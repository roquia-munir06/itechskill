
// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle, FaBars, FaTimes, FaCalendarAlt, FaHourglassHalf } from "react-icons/fa";
import {
  getStudentEnrollments,
  getAllCourses,
} from "../api/api";

const StudentDashboard = () => {
  /* ================= USER INFO ================= */
  const userInfo = localStorage.getItem("userInfo");
  const parsedUser = userInfo ? JSON.parse(userInfo) : null;

  const studentId = parsedUser?._id || parsedUser?.id || null;
  const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    timeRemaining: "Loading...",
    daysRemaining: null,
    expiryDate: null,
    status: "active",
    lectureLimit: null,
    lecturesUsed: 0,
    totalLectures: 0
  });
  const [coursesList, setCoursesList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentsData, setEnrollmentsData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  /* ================= RESPONSIVE HANDLING ================= */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchCourses()]);
      setLoading(false);
    };
    initializeDashboard();
  }, []);

  /* ================= FUNCTIONS ================= */
  
  // Calculate subscription time from enrollment data
  const calculateSubscriptionTime = (enrollments) => {
    if (!enrollments || enrollments.length === 0) {
      return {
        timeRemaining: "No Active Subscriptions",
        daysRemaining: null,
        expiryDate: null,
        status: "no_subscription",
        lectureLimit: null,
        lecturesUsed: 0,
        totalLectures: 0
      };
    }

    let bestExpiry = null;
    let totalDaysRemaining = null;
    let lectureLimitInfo = null;
    let totalLecturesCount = 0;
    let lecturesUsedCount = 0;

    // Process each enrollment to find the best (longest remaining) access
    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      if (!course) return;

      totalLecturesCount += course.totalLectures || 0;
      
      // Check lecture limit info
      if (enrollment.lectureLimit) {
        lecturesUsedCount += (enrollment.accessedLectures || []).length;
        if (!lectureLimitInfo || enrollment.lectureLimit > lectureLimitInfo.limit) {
          lectureLimitInfo = {
            limit: enrollment.lectureLimit,
            used: (enrollment.accessedLectures || []).length,
            remaining: enrollment.lectureLimit - (enrollment.accessedLectures || []).length,
            courseTitle: course.title
          };
        }
      }

      // Check expiry date
      let expiryDate = null;
      let daysRemaining = null;
      
      // Priority 1: endDate from enrollment
      if (enrollment.endDate) {
        expiryDate = new Date(enrollment.endDate);
        daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      } 
      // Priority 2: course endDate
      else if (course.endDate) {
        expiryDate = new Date(course.endDate);
        daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      }
      // Priority 3: lifetime access (no expiry)
      else if (enrollment.isPaid || enrollment.grantedByAdmin) {
        daysRemaining = null; // Lifetime access
        expiryDate = null;
      }

      // Select the enrollment with most days remaining (or lifetime access)
      if (daysRemaining === null) {
        // Lifetime access is best
        bestExpiry = null;
        totalDaysRemaining = null;
      } else if (daysRemaining > 0 && (totalDaysRemaining === null || daysRemaining > totalDaysRemaining)) {
        bestExpiry = expiryDate;
        totalDaysRemaining = daysRemaining;
      }
    });

    // Determine status and time remaining text
    let timeRemaining = "";
    let status = "active";
    
    if (totalDaysRemaining === null && bestExpiry === null) {
      timeRemaining = "Lifetime Access";
      status = "lifetime";
    } else if (totalDaysRemaining > 0) {
      if (totalDaysRemaining <= 7) {
        status = "expiring_soon";
        timeRemaining = `${totalDaysRemaining} Day${totalDaysRemaining !== 1 ? 's' : ''} Remaining ⚠️`;
      } else {
        status = "active";
        timeRemaining = `${totalDaysRemaining} Days Remaining`;
      }
    } else if (totalDaysRemaining === 0) {
      timeRemaining = "Expires Today";
      status = "expiring_soon";
    } else if (totalDaysRemaining < 0) {
      timeRemaining = "Expired";
      status = "expired";
    }

    // Check if any enrollment is expired but still has lecture limit
    if (status === "expired" && lectureLimitInfo && lectureLimitInfo.remaining > 0) {
      timeRemaining = `${lectureLimitInfo.remaining} Lectures Left`;
      status = "lecture_limit";
    }

    return {
      timeRemaining,
      daysRemaining: totalDaysRemaining,
      expiryDate: bestExpiry,
      status,
      lectureLimit: lectureLimitInfo,
      lecturesUsed: lecturesUsedCount,
      totalLectures: totalLecturesCount
    };
  };

  const fetchDashboard = async () => {
    if (!studentId) return;

    try {
      const enrollments = await getStudentEnrollments(studentId);
      setEnrollmentsData(enrollments);
      
      // Count total courses (only active/purchased courses)
      const activeEnrollments = enrollments.filter(e => 
        e.isPaid || e.grantedByAdmin || (e.course && e.course.price === 0)
      );
      setMyCourses(activeEnrollments.length);

      // Save enrolled courses IDs
      setEnrolledCourses(
        enrollments
          .filter((e) => e.course)
          .map((e) => e.course._id)
      );

      // Calculate subscription info
      const subscriptionInfo = calculateSubscriptionTime(enrollments);
      setSubscriptionInfo(subscriptionInfo);
      
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setSubscriptionInfo({
        timeRemaining: "Error loading data",
        daysRemaining: null,
        expiryDate: null,
        status: "error",
        lectureLimit: null,
        lecturesUsed: 0,
        totalLectures: 0
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCoursesList(res);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Helper function to format expiry date
  const formatExpiryDate = (date) => {
    if (!date) return "Never (Lifetime)";
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'expiring_soon': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'lifetime': return '#8b5cf6';
      case 'lecture_limit': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FaCheckCircle />;
      case 'expiring_soon': return <FaHourglassHalf />;
      case 'expired': return <FaExclamationCircle />;
      case 'lifetime': return <FaCalendarAlt />;
      case 'lecture_limit': return <FaBook />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
      <Sidebar 
          isMobile={isMobile}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div style={{
          ...styles.mainContent,
          marginLeft: isMobile ? "0" : "280px",
          paddingTop: isMobile ? "80px" : "32px",
        }}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={styles.loadingText}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Sidebar 
        isMobile={isMobile}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      <div style={{
        ...styles.mainContent,
        marginLeft: isMobile ? "0" : "280px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                Welcome back, <span style={styles.highlightText}>{studentName}</span>
              </h1>
              <p style={styles.pageSubtitle}>Here's your learning overview and progress</p>
            </div>
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIndicator}></div>
            <h2 style={styles.sectionTitle}>Overview</h2>
          </div>
          <div style={styles.cardGrid}>
            <StatCard
              icon={<FaBook />}
              title="My Courses"
              value={myCourses}
              subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
              gradient="linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)"
            />
            <StatCard
              icon={getStatusIcon(subscriptionInfo.status)}
              title="Subscription Status"
              value={subscriptionInfo.timeRemaining}
              subtitle={
                subscriptionInfo.expiryDate 
                  ? `Expires: ${formatExpiryDate(subscriptionInfo.expiryDate)}`
                  : subscriptionInfo.status === 'lifetime'
                    ? "Never expires"
                    : "No active subscription"
              }
              gradient={`linear-gradient(135deg, ${getStatusColor(subscriptionInfo.status)} 0%, ${getStatusColor(subscriptionInfo.status)}CC 100%)`}
            />
          </div>
        </div>

        {/* Additional Course Info Section (Optional) */}
        {subscriptionInfo.lectureLimit && (
          <div style={styles.lectureInfoSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Lecture Access Details</h2>
            </div>
            <div style={styles.lectureInfoCard}>
              <div style={styles.lectureInfoHeader}>
                <FaBook style={styles.lectureInfoIcon} />
                <div>
                  <h3 style={styles.lectureInfoTitle}>{subscriptionInfo.lectureLimit.courseTitle}</h3>
                  <p style={styles.lectureInfoSubtitle}>Lecture Limit Access</p>
                </div>
              </div>
              <div style={styles.lectureProgressBar}>
                <div style={{
                  ...styles.lectureProgressFill,
                  width: `${(subscriptionInfo.lectureLimit.used / subscriptionInfo.lectureLimit.limit) * 100}%`
                }} />
              </div>
              <div style={styles.lectureInfoStats}>
                <span>Used: {subscriptionInfo.lectureLimit.used}</span>
                <span>Remaining: {subscriptionInfo.lectureLimit.remaining}</span>
                <span>Total: {subscriptionInfo.lectureLimit.limit}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Enrollments Section */}
        {enrollmentsData.length > 0 && (
          <div style={styles.recentSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Your Courses</h2>
            </div>
            <div style={styles.coursesGrid}>
              {enrollmentsData.slice(0, 6).map((enrollment, index) => (
                <div key={index} style={styles.courseCard}>
                  <div style={styles.courseCardHeader}>
                    <h3 style={styles.courseCardTitle}>
                      {enrollment.course?.title || "Untitled Course"}
                    </h3>
                    {enrollment.isPaid && (
                      <span style={styles.paidBadge}>Purchased</span>
                    )}
                    {enrollment.grantedByAdmin && (
                      <span style={styles.adminBadge}>Admin Access</span>
                    )}
                  </div>
                  {enrollment.endDate && (
                    <div style={styles.courseExpiry}>
                      <FaClock size={12} />
                      <span>
                        Expires: {new Date(enrollment.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enrollment.lectureLimit && (
                    <div style={styles.courseLimit}>
                      <FaBook size={12} />
                      <span>
                        Lectures: {enrollment.accessedLectures?.length || 0} / {enrollment.lectureLimit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, gradient }) => (
  <div style={{ ...styles.statCard, background: gradient }}>
    <div style={styles.statIconContainer}>{icon}</div>
    <div style={styles.statContent}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statSubtitle}>{subtitle}</p>
    </div>
  </div>
);

/* ================= STYLES ================= */
const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    position: "relative",
  },

  mobileMenuButton: {
    position: "fixed",
    top: "16px",
    left: "16px",
    zIndex: 1000,
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
  },

  mainContent: {
    flex: 1,
    overflowX: "hidden",
    maxWidth: "1400px",
  },

  headerSection: {
    marginBottom: "32px",
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3D1A5B",
    margin: 0,
    marginBottom: "8px",
  },

  highlightText: {
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  pageSubtitle: {
    color: "#6b7280",
    fontSize: "16px",
    margin: 0,
  },

  liveDataBadge: {
    background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
    border: "1px solid rgba(61, 26, 91, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
  },

  liveDataText: {
    color: "#3D1A5B",
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },

  statsSection: {
    marginBottom: "32px",
  },

  lectureInfoSection: {
    marginBottom: "32px",
  },

  recentSection: {
    marginBottom: "32px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },

  sectionIndicator: {
    width: "4px",
    height: "20px",
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    borderRadius: "2px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },

  statCard: {
    color: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },

  statIconContainer: {
    fontSize: "36px",
    opacity: 0.9,
  },

  statContent: {
    flex: 1,
  },

  statTitle: {
    fontSize: "14px",
    fontWeight: "500",
    opacity: 0.9,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "4px",
    margin: 0,
    wordBreak: "break-word",
  },

  statSubtitle: {
    fontSize: "12px",
    opacity: 0.8,
    margin: 0,
  },

  lectureInfoCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },

  lectureInfoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  lectureInfoIcon: {
    fontSize: "32px",
    color: "#3D1A5B",
  },

  lectureInfoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
    marginBottom: "4px",
  },

  lectureInfoSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  lectureProgressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "16px",
  },

  lectureProgressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3D1A5B, #5E427B)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },

  lectureInfoStats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#6b7280",
  },

  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },

  courseCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },

  courseCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },

  courseCardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
    flex: 1,
  },

  paidBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginLeft: "8px",
  },

  adminBadge: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginLeft: "8px",
  },

  courseExpiry: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
  },

  courseLimit: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "6px",
  },
};

// Add responsive CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #3D1A5B !important;
    box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
  }

  .statCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.2);
  }

  .courseCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    [style*="pageTitle"] {
      font-size: 24px !important;
    }

    [style*="pageSubtitle"] {
      font-size: 14px !important;
    }

    [style*="liveDataBadge"] {
      width: 100%;
    }

    [style*="cardGrid"] {
      grid-template-columns: 1fr !important;
    }

    [style*="statCard"] {
      padding: 20px !important;
    }

    [style*="statValue"] {
      font-size: 18px !important;
    }

    [style*="coursesGrid"] {
      grid-template-columns: 1fr !important;
    }

    [style*="sectionTitle"] {
      font-size: 18px !important;
    }
  }

  @media (max-width: 480px) {
    [style*="pageTitle"] {
      font-size: 20px !important;
    }

    [style*="statIconContainer"] {
      font-size: 28px !important;
    }

    [style*="liveDataBadge"] {
      padding: 10px 12px !important;
    }

    [style*="liveDataText"] {
      font-size: 12px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StudentDashboard;