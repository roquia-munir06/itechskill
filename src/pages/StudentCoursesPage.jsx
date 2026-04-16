// src/pages/StudentCoursesPage.jsx
import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import {
  getStudentEnrollments,
  getProgress,
  enrollStudentInCourse,
  getAllCourses,
  completePaymentProcess,
  canAccessCourse
} from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaGraduationCap,
  FaCheckCircle,
  FaTimesCircle,
  FaBook,
  FaCalendarAlt,
  FaLock,
  FaUnlock,
  FaRupeeSign,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaPlay,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaTags
} from "react-icons/fa";
import { getUserId, isAuthenticated } from "../utils/auth";

// ✅ FEATURE FLAG - Set to true to re-enable enrollment
const ENABLE_ENROLLMENT = false;

const StudentCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [coursePrices, setCoursePrices] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [courseAccessMap, setCourseAccessMap] = useState({});

  const navigate = useNavigate();
  const studentId = getUserId();

  // Responsive handling
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

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    if (studentId) {
      initializePage();
    }
  }, [studentId, navigate]);

  const initializePage = async () => {
    await Promise.all([
      fetchEnrollments(), 
      ENABLE_ENROLLMENT ? fetchAllCourses() : Promise.resolve()
    ]);
  };

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching enrollments for student:", studentId);
      
      const data = await getStudentEnrollments(studentId);
      console.log("📚 Raw enrollments data:", data);

      // ✅ Filter active enrollments - only courses that exist and are not deleted
      const active = data.filter(e => {
        const isValid = !e.isDeleted && e.course && e.course._id;
        if (!isValid) {
          console.warn("⚠️ Filtered out invalid enrollment:", e);
        }
        return isValid;
      });
      
      console.log(`✅ Active enrollments found: ${active.length}`);
      setEnrollments(active);

      const progressMap = {};
      const priceMap = {};
      const paymentMap = {};
      const accessMap = {};
      
      // ✅ Process each enrollment with detailed access checking
      for (const enrollment of active) {
        const courseId = enrollment.course._id;
        const course = enrollment.course;
        
        console.log(`\n🎯 Processing course: ${course.title} (${courseId})`);
        
        try {
          // Get progress
          try {
            const res = await getProgress(studentId, courseId);
            progressMap[courseId] = res.progressPercentage || 0;
            console.log(`  📊 Progress: ${progressMap[courseId]}%`);
          } catch (progressErr) {
            console.warn(`  ⚠️ Could not fetch progress:`, progressErr.message);
            progressMap[courseId] = 0;
          }
          
          // Get course price from enrollment
          const coursePrice = enrollment.course.price || 0;
          priceMap[courseId] = coursePrice;
          console.log(`  💰 Course price: ₹${coursePrice}`);
          
          // ✅ CRITICAL: Check actual access status from backend
          try {
            const accessStatus = await canAccessCourse(courseId, studentId);
            console.log(`  🔐 Access check result:`, accessStatus);
            
            // ✅ Determine if student has access
            const hasAccess = accessStatus.canAccess || false;
            const isPaid = accessStatus.isPaid || enrollment.isPaid || false;
            const hasFullAccess = accessStatus.hasFullAccess || false;
            
            accessMap[courseId] = {
              canAccess: hasAccess,
              hasFullAccess: hasFullAccess,
              isPaid: isPaid,
              coursePrice: coursePrice,
              isEnrolled: true,
              enrollmentId: enrollment._id,
              // ✅ Store access grant info if exists
              accessGrantedBy: accessStatus.accessGrantedBy || null,
              accessGrantedAt: accessStatus.accessGrantedAt || null
            };
            
            // Update payment status
            paymentMap[courseId] = isPaid;
            
            console.log(`  ✅ Access summary:
              - Can Access: ${hasAccess}
              - Has Full Access: ${hasFullAccess}
              - Is Paid: ${isPaid}
              - Is Free: ${coursePrice === 0}
              - Access Granted: ${accessStatus.accessGrantedBy ? 'Yes (by admin)' : 'No'}`
            );
            
          } catch (accessErr) {
            console.error(`  ❌ Access check failed:`, accessErr);
            
            // ✅ Fallback: Free courses get access, paid courses check isPaid
            const isFreeCourse = coursePrice === 0;
            const isPaidEnrollment = enrollment.isPaid || false;
            
            accessMap[courseId] = {
              canAccess: isFreeCourse || isPaidEnrollment,
              hasFullAccess: isFreeCourse || isPaidEnrollment,
              isPaid: isPaidEnrollment,
              coursePrice: coursePrice,
              isEnrolled: true,
              enrollmentId: enrollment._id
            };
            
            paymentMap[courseId] = isPaidEnrollment;
            
            console.log(`  ⚠️ Using fallback access - Can Access: ${isFreeCourse || isPaidEnrollment}`);
          }
          
        } catch (err) {
          console.error(`  ❌ Error processing course ${courseId}:`, err);
          
          // Safe defaults
          const coursePrice = enrollment.course.price || 0;
          const isFreeCourse = coursePrice === 0;
          const isPaidEnrollment = enrollment.isPaid || false;
          
          progressMap[courseId] = 0;
          priceMap[courseId] = coursePrice;
          paymentMap[courseId] = isPaidEnrollment;
          accessMap[courseId] = {
            canAccess: isFreeCourse || isPaidEnrollment,
            hasFullAccess: isFreeCourse || isPaidEnrollment,
            isPaid: isPaidEnrollment,
            coursePrice: coursePrice,
            isEnrolled: true,
            enrollmentId: enrollment._id
          };
        }
      }
      
      setProgressData(progressMap);
      setCoursePrices(priceMap);
      setPaymentStatus(paymentMap);
      setCourseAccessMap(accessMap);
      
      console.log("\n✅ All enrollments processed successfully");
      console.log("📊 Final Access Map:", accessMap);
      
    } catch (err) {
      console.error("❌ Error fetching enrollments:", err);
      setError("Failed to load courses");
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const data = await getAllCourses();
      setAvailableCourses(data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleEnrollCourse = async () => {
    if (!selectedCourse) {
      setError("Please select a course");
      return;
    }
    
    if (!studentId) {
      setError("User not logged in. Please login again.");
      navigate("/login");
      return;
    }
    
    setEnrolling(true);
    setError("");
    
    try {
      const selectedCourseData = availableCourses.find(c => c._id === selectedCourse);
      
      if (!selectedCourseData) {
        setError("Course not found");
        setEnrolling(false);
        return;
      }
      
      const coursePrice = selectedCourseData.price || 0;
      const validStudentId = String(studentId).trim();
      
      if (!validStudentId || validStudentId === 'null' || validStudentId === 'undefined') {
        setError("Invalid user session. Please logout and login again.");
        setEnrolling(false);
        return;
      }
      
      const enrollmentResult = await enrollStudentInCourse(
        validStudentId, 
        selectedCourseData._id,
        coursePrice === 0
      );

      if (coursePrice === 0) {
        alert("✅ Successfully enrolled in free course! You now have full access.");
        await fetchEnrollments();
        setSelectedCourse("");
      } else {
        alert("✅ Enrollment successful! Please complete payment to unlock all content.");
        setSelectedCourseForPayment(selectedCourseData);
        setShowPaymentModal(true);
        fetchEnrollments();
        setSelectedCourse("");
      }
      
    } catch (err) {
      console.error("❌ Enrollment error:", err);
      
      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || err.response?.data?.error;
        
        if (errorMsg?.toLowerCase().includes("already enrolled")) {
          setError("ℹ️ You are already enrolled in this course.");
          await fetchEnrollments();
        } else {
          setError(errorMsg || "Invalid enrollment request. Please try again.");
        }
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(err.response?.data?.message || "Enrollment failed. Please try again.");
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = async (courseId, paymentMethod) => {
    try {
      setProcessingPayment(prev => ({ ...prev, [courseId]: true }));
      
      const course = availableCourses.find(c => c._id === courseId);
      const coursePrice = course?.price || 0;
      
      if (!coursePrice || coursePrice <= 0) {
        alert("Invalid course price");
        return;
      }
      
      const result = await completePaymentProcess(courseId, paymentMethod, coursePrice);
      
      if (result.success) {
        alert("✅ Payment successful! Course is now unlocked.");
        setShowPaymentModal(false);
        setSelectedCourseForPayment(null);
        
        await fetchEnrollments();
      } else {
        alert(result.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment processing error. Please try again.");
    } finally {
      setProcessingPayment(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const getStatus = (progress) => {
    if (progress === 100) {
      return { text: "Completed", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> };
    }
    if (progress > 0) {
      return { text: "In Progress", color: "#F1D572", bg: "rgba(241, 213, 114, 0.2)", icon: <FaChartLine /> };
    }
    return { text: "Not Started", color: "#6b7280", bg: "#f3f4f6", icon: <FaBook /> };
  };

  // ✅ FIXED: Properly check if course is locked based on access map
  const isCourseLocked = (enrollment) => {
    const courseId = enrollment.course._id;
    const accessInfo = courseAccessMap[courseId];
    
    if (!accessInfo) {
      // Fallback if no access info
      const coursePrice = enrollment.course.price || 0;
      return coursePrice > 0 && !enrollment.isPaid;
    }
    
    // ✅ Check access from access map
    // Free courses are never locked
    if (accessInfo.coursePrice === 0) {
      return false;
    }
    
    // Paid courses: locked if no access
    // Access can be granted via payment OR admin grant
    return !accessInfo.canAccess && !accessInfo.hasFullAccess && !accessInfo.isPaid;
  };

  // ✅ FIXED: Get proper access type with admin grant support
  const getCourseAccessType = (enrollment) => {
    const courseId = enrollment.course._id;
    const accessInfo = courseAccessMap[courseId];
    
    if (!accessInfo) {
      // Fallback
      const coursePrice = enrollment.course.price || 0;
      const isPaid = enrollment.isPaid || false;
      
      if (coursePrice === 0) {
        return { 
          type: "free", 
          label: "Free Course", 
          icon: <FaUnlock />, 
          color: "#10b981", 
          bg: "#d1fae5" 
        };
      } else if (isPaid) {
        return { 
          type: "paid_unlocked", 
          label: "Paid (Unlocked)", 
          icon: <FaUnlock />, 
          color: "#3D1A5B", 
          bg: "rgba(61, 26, 91, 0.1)" 
        };
      } else {
        return { 
          type: "paid_locked", 
          label: "Payment Required", 
          icon: <FaLock />, 
          color: "#ef4444", 
          bg: "#fee2e2" 
        };
      }
    }
    
    const coursePrice = accessInfo.coursePrice;
    
    // Free course
    if (coursePrice === 0) {
      return { 
        type: "free", 
        label: "Free Course", 
        icon: <FaUnlock />, 
        color: "#10b981", 
        bg: "#d1fae5" 
      };
    }
    
    // ✅ Check if access was granted by admin
    if (accessInfo.accessGrantedBy) {
      return { 
        type: "granted_access", 
        label: "Access Granted", 
        icon: <FaUnlock />, 
        color: "#0d9488", 
        bg: "rgba(13, 148, 136, 0.1)" 
      };
    }
    
    // Paid and unlocked
    if (accessInfo.isPaid || accessInfo.hasFullAccess) {
      return { 
        type: "paid_unlocked", 
        label: "Paid (Unlocked)", 
        icon: <FaUnlock />, 
        color: "#3D1A5B", 
        bg: "rgba(61, 26, 91, 0.1)" 
      };
    }
    
    // Locked (payment required)
    return { 
      type: "paid_locked", 
      label: "Payment Required", 
      icon: <FaLock />, 
      color: "#ef4444", 
      bg: "#fee2e2" 
    };
  };

  const StatBadge = ({ label, value, color }) => (
    <div style={styles.statBadgeContainer}>
      <div style={{ ...styles.statBadgeValue, color }}>{value}</div>
      <div style={styles.statBadgeLabel}>{label}</div>
    </div>
  );

  if (loading && enrollments.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <StudentSidebar 
          isMobile={isMobile}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div style={{
          ...styles.loadingContainer,
          marginLeft: isMobile ? "0" : "280px",
          padding: isMobile ? "80px 20px 20px 20px" : "32px",
        }}>
          <div style={styles.spinner}></div>
          <div style={styles.loadingText}>Loading your courses...</div>
        </div>
      </div>
    );
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(e => (progressData[e.course._id] || 0) === 100).length;
  const unlockedCourses = enrollments.filter(e => !isCourseLocked(e)).length;
  const avgProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((sum, e) => sum + (progressData[e.course._id] || 0), 0) / totalCourses)
    : 0;

  return (
    <div style={styles.pageContainer}>
      <StudentSidebar 
        isMobile={isMobile}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
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
        padding: isMobile ? "80px 20px 32px 20px" : "32px 40px",
      }}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div style={styles.headerLeft}>
              <h1 style={styles.pageTitle}>
                <FaGraduationCap style={styles.titleIcon} />
                My Courses
              </h1>
              <p style={styles.pageSubtitle}>
                Track your progress, access course materials, and continue learning
              </p>
            </div>
            
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div style={styles.statsContainer}>
            <StatBadge 
              label="Total Courses" 
              value={totalCourses} 
              color="#3D1A5B" 
            />
            <StatBadge 
              label="Completed" 
              value={completedCourses} 
              color="#10b981" 
            />
            <StatBadge 
              label="Unlocked" 
              value={unlockedCourses} 
              color="#F1D572" 
            />
            <StatBadge 
              label="Avg Progress" 
              value={`${avgProgress}%`} 
              color="#A68A46" 
            />
          </div>
        </div>

        {/* ✅ ENROLLMENT SECTION - CONTROLLED BY FEATURE FLAG */}
        {ENABLE_ENROLLMENT ? (
          // ACTIVE ENROLLMENT FORM
          <div style={styles.enrollSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Enroll in New Course</h2>
            </div>
            
            <p style={styles.enrollSubtitle}>
              Choose from available courses to expand your learning
            </p>
            
            <div style={styles.enrollForm}>
              <div style={styles.selectWrapper}>
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setError("");
                  }}
                  style={styles.selectStyle}
                  disabled={enrolling}
                >
                  <option value="">Select a course to enroll...</option>
                  {availableCourses
                    .filter(c => !enrollments.some(e => e.course._id === c._id))
                    .map(c => (
                      <option key={c._id} value={c._id}>
                        {c.title} {c.duration ? `(${c.duration}h)` : ''} - 
                        {c.price > 0 ? ` ₹${c.price}` : ' FREE'}
                      </option>
                    ))}
                </select>
              </div>
              
              <button
                onClick={handleEnrollCourse}
                disabled={!selectedCourse || enrolling}
                style={{
                  ...styles.enrollButton,
                  opacity: (!selectedCourse || enrolling) ? 0.7 : 1,
                  cursor: (!selectedCourse || enrolling) ? 'not-allowed' : 'pointer'
                }}
              >
                {enrolling ? (
                  <>
                    <div style={styles.buttonSpinner}></div>
                    Enrolling...
                  </>
                ) : selectedCourse && availableCourses.find(c => c._id === selectedCourse)?.price > 0 ? (
                  <>
                    <FaShoppingCart /> Proceed to Payment
                    <FaArrowRight />
                  </>
                ) : (
                  <>
                    <FaBook /> Enroll Now
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div style={styles.errorMessage}>
                <FaTimesCircle />
                {error}
              </div>
            )}
            
            {availableCourses.length > 0 && (
              <div style={{ marginTop: 16, fontSize: 14, color: '#64748b' }}>
                {availableCourses.filter(c => !enrollments.some(e => e.course._id === c._id)).length} courses available for enrollment
              </div>
            )}
          </div>
        ) : (
          // DISABLED MESSAGE
          <div style={styles.enrollSection}>
            {/* <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Enroll in New Course</h2>
            </div> */}
            
            {/* <div style={styles.disabledNotice}>
              <FaExclamationTriangle style={{ fontSize: "48px", color: "#A68A46", marginBottom: "16px" }} />
              <h3 style={styles.disabledTitle}>Enrollment Temporarily Unavailable</h3>
              <p style={styles.disabledText}>
                We're currently updating our enrollment system. New course enrollments will be available soon. 
                Thank you for your patience!
              </p>
              <p style={styles.disabledSubtext}>
                Please continue enjoying your enrolled courses in the meantime.
              </p>
            </div> */}
          </div>
        )}

        {/* Courses Grid Section */}
        <div style={styles.coursesSection}>
          <div style={styles.coursesSectionHeader}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Your Courses</h2>
            </div>
            <div style={styles.coursesInfo}>
              <span style={styles.courseCount}>
                {totalCourses} course{totalCourses !== 1 ? 's' : ''}
              </span>
              <div style={styles.courseStats}>
                {unlockedCourses} unlocked • {totalCourses - unlockedCourses} locked
              </div>
            </div>
          </div>

          {enrollments.length === 0 ? (
            <div style={styles.emptyState}>
              <FaBook style={styles.emptyIcon} />
              <h3 style={styles.emptyTitle}>No courses enrolled yet</h3>
              <p style={styles.emptyText}>
                Get started by enrolling in a course from the dropdown above
              </p>
            </div>
          ) : (
            <div style={styles.coursesGrid}>
              {enrollments.map((enrollment) => {
                const course = enrollment.course;
                const courseId = course._id;
                const progress = progressData[courseId] || 0;
                const status = getStatus(progress);
                const accessType = getCourseAccessType(enrollment);
                const locked = isCourseLocked(enrollment);
                const coursePrice = courseAccessMap[courseId]?.coursePrice || course.price || 0;
                const accessInfo = courseAccessMap[courseId];

                return (
                  <div
                    key={enrollment._id}
                    style={{
                      ...styles.courseCard,
                      opacity: locked ? 0.9 : 1,
                    }}
                    className="course-card"
                  >
                    <div style={styles.cardHeader}>
                      <div style={statusBadgeStyle(status)}>
                        {status.icon}
                        {status.text}
                      </div>
                      
                      <div style={styles.badgeContainer}>
                        {/* Access Type Badge */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: accessType.bg,
                          color: accessType.color,
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {accessType.icon}
                          {accessType.label}
                        </div>
                        
                        {/* Price Badge */}
                        {coursePrice > 0 && (
                          <div style={styles.priceBadge}>
                            <FaRupeeSign size={10} />
                            ₹{coursePrice}
                          </div>
                        )}
                        
                        {course.duration && (
                          <div style={styles.durationBadge}>
                            <FaClock style={styles.badgeIcon} />
                            {course.duration}h
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <h3 style={styles.courseTitle}>{course.title}</h3>
                      <p style={styles.courseDescription}>
                        {course.description?.substring(0, 120) || 'No description available'}...
                      </p>
                      
                      {course.subCategories && (
                        <div style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: '6px', 
                          marginTop: '8px',
                          marginBottom: '8px'
                        }}>
                          {(typeof course.subCategories === 'string' 
                            ? JSON.parse(course.subCategories) 
                            : course.subCategories
                          )?.slice(0, 3).map((sub, idx) => (
                            <span key={idx} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              <FaTags size={9} />
                              {sub}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* ✅ Show admin grant info if access was granted */}
                      {accessInfo?.accessGrantedBy && (
                        <div style={{
                          marginTop: '8px',
                          padding: '6px 10px',
                          background: 'rgba(13, 148, 136, 0.1)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: '#0f766e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaCheckCircle size={10} />
                          Free access granted by admin
                        </div>
                      )}
                      
                      {course.createdAt && (
                        <div style={styles.dateInfo}>
                          <FaCalendarAlt style={styles.dateIcon} />
                          Enrolled on {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* <div style={styles.progressSection}>
                      <div style={styles.progressHeader}>
                        <div style={styles.progressLabel}>
                          <FaChartLine style={styles.progressIcon} />
                          Progress
                        </div>
                        <div style={styles.progressPercentage}>{progress}%</div>
                      </div>
                      <div style={styles.progressBarContainer}>
                        <div style={styles.progressBarTrack}>
                          <div 
                            style={{
                              ...styles.progressBarFill,
                              width: `${progress}%`,
                              backgroundColor: status.color
                            }}
                          />
                        </div>
                      </div>
                    </div> */}

                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => {
                          if (locked && coursePrice > 0) {
                            setSelectedCourseForPayment(course);
                            setShowPaymentModal(true);
                            return;
                          }

                          navigate(`/student/courses/${courseId}`);
                        }}
                        style={{
                          ...styles.viewButton,
                          background: locked 
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : progress === 100
                            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                            : 'linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)',
                          flex: 2
                        }}
                        className="view-button"
                      >
                        {locked ? (
                          <>
                            <FaLock />
                            Unlock Course
                          </>
                        ) : progress === 100 ? (
                          <>
                            <FaCheckCircle />
                            Review Course
                            <FaArrowRight style={styles.buttonArrow} />
                          </>
                        ) : (
                          <>
                            <FaPlay />
                            Continue Learning
                            <FaArrowRight style={styles.buttonArrow} />
                          </>
                        )}
                      </button>
                      
                      {locked && coursePrice > 0 && (
                        <button
                          onClick={() => {
                            setSelectedCourseForPayment(course);
                            setShowPaymentModal(true);
                          }}
                          disabled={processingPayment[courseId]}
                          style={{
                            ...styles.paymentButton,
                            opacity: processingPayment[courseId] ? 0.7 : 1,
                            cursor: processingPayment[courseId] ? 'not-allowed' : 'pointer'
                          }}
                          className="payment-button"
                        >
                          {processingPayment[courseId] ? (
                            <>
                              <div style={styles.buttonSpinner}></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaMoneyBillWave />
                              Pay ₹{coursePrice}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedCourseForPayment && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                <FaShoppingCart /> Complete Payment
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedCourseForPayment(null);
                }}
                style={styles.modalClose}
              >
                ✕
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.courseInfo}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
                  {selectedCourseForPayment.title}
                </h4>
                <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>
                  {selectedCourseForPayment.description?.substring(0, 150)}...
                </p>
                
                <div style={styles.priceDisplay}>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Course Price:</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#3D1A5B' }}>
                    ₹{selectedCourseForPayment.price || 0}
                  </div>
                </div>
                
                <div style={styles.noteBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
                    <FaExclamationTriangle />
                    <strong>Note:</strong> Once payment is complete, you'll get lifetime access to all course materials.
                  </div>
                </div>
              </div>
              
              <div style={styles.paymentMethods}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Select Payment Method</h4>
                
                <div style={styles.methodGrid}>
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'card')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
                    <div style={{ fontWeight: '600' }}>Credit/Debit Card</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with card</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'upi')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
                    <div style={{ fontWeight: '600' }}>UPI</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with UPI ID</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'netbanking')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏦</div>
                    <div style={{ fontWeight: '600' }}>Net Banking</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>All banks supported</div>
                  </button>
                  
                  <button
                    onClick={() => handlePayment(selectedCourseForPayment._id, 'wallet')}
                    disabled={processingPayment[selectedCourseForPayment._id]}
                    style={styles.paymentMethodBtn}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>👛</div>
                    <div style={{ fontWeight: '600' }}>Wallet</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Paytm, PhonePe, etc.</div>
                  </button>
                </div>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedCourseForPayment(null);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', flex: 1 }}>
                Your payment is secure and encrypted
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .course-card {
          transition: all 0.3s ease;
        }
        
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(61, 26, 91, 0.15);
        }
        
        .view-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
        }
        
        .payment-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        input:focus, select:focus, textarea:focus {
          border-color: #3D1A5B !important;
          box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
        }

        @media (max-width: 768px) {
          [style*="mobileMenuButton"] {
            display: flex !important;
          }

          [style*="mainContent"] {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          [style*="loadingContainer"] {
            margin-left: 0 !important;
            padding: 80px 20px 20px 20px !important;
          }

          [style*="headerTop"] {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          [style*="statsContainer"] {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            width: 100% !important;
            gap: 12px !important;
          }

          [style*="enrollForm"] {
            flex-direction: column !important;
          }

          [style*="selectWrapper"] {
            width: 100% !important;
            min-width: auto !important;
          }

          [style*="enrollButton"] {
            width: 100% !important;
          }

          [style*="coursesGrid"] {
            grid-template-columns: 1fr !important;
          }

          [style*="badgeContainer"] {
            flex-wrap: wrap !important;
          }

          [style*="buttonGroup"] {
            flex-direction: column !important;
          }

          [style*="viewButton"], [style*="paymentButton"] {
            width: 100% !important;
          }

          [style*="methodGrid"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 480px) {
          [style*="mainContent"] {
            padding: 70px 16px 16px 16px !important;
          }

          [style*="pageTitle"] {
            font-size: 24px !important;
          }

          [style*="statsContainer"] {
            grid-template-columns: 1fr !important;
          }

          [style*="statBadgeContainer"] {
            min-width: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

// Updated Styles with new disabled notice styles
const styles = {
  pageContainer: {
    display: "flex",
    minHeight: "100vh",
    background: "#f9fafb",
    position: "relative",
  },

  mobileMenuButton: {
    display: "none",
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
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: 50,
    height: 50,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
    fontWeight: 500,
  },

  mainContent: {
    flex: 1,
    maxWidth: 1400,
  },

  headerSection: {
    marginBottom: 40,
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 24,
    marginBottom: 24,
  },

  headerLeft: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#3D1A5B",
    marginBottom: 8,
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  titleIcon: {
    color: "#F1D572",
    fontSize: 28,
  },

  pageSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 1.6,
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

  statsContainer: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },

  statBadgeContainer: {
    background: "#fff",
    padding: "16px 24px",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "center",
    minWidth: 120,
    border: "1px solid #e2e8f0",
  },

  statBadgeValue: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 4,
  },

  statBadgeLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  enrollSection: {
    background: "#fff",
    padding: 32,
    borderRadius: 20,
    marginBottom: 40,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
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

  enrollSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 24,
  },

  enrollForm: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  selectWrapper: {
    flex: 1,
    minWidth: 300,
  },

  selectStyle: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    borderRadius: 12,
    border: "2px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    outline: "none",
  },

  enrollButton: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },

  buttonSpinner: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  errorMessage: {
    marginTop: 16,
    padding: 12,
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: 10,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 500,
  },

  // ✅ NEW: Disabled enrollment notice styles
  disabledNotice: {
    background: "#fff",
    padding: "60px 40px",
    borderRadius: "20px",
    textAlign: "center",
    border: "2px dashed rgba(166, 138, 70, 0.3)",
  },

  disabledTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#3D1A5B",
    marginBottom: "12px",
    margin: "0 0 12px 0",
  },

  disabledText: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "12px",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto 12px auto",
  },

  disabledSubtext: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: 0,
  },

  coursesSection: {
    marginTop: 40,
  },

  coursesSectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },

  coursesInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  courseCount: {
    fontSize: 20,
    color: "#64748b",
    fontWeight: 500,
  },

  courseStats: {
    fontSize: 14,
    color: "#64748b",
    background: "#f8fafc",
    padding: "6px 12px",
    borderRadius: "20px",
  },

  emptyState: {
    textAlign: "center",
    padding: "80px 40px",
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  emptyIcon: {
    fontSize: 64,
    color: "#cbd5e1",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 16,
    color: "#64748b",
  },

  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: 28,
  },

  courseCard: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },

  badgeContainer: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  priceBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "rgba(241, 213, 114, 0.2)",
    color: "#92400e",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },

  durationBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 600,
  },

  badgeIcon: {
    fontSize: 13,
  },

  cardBody: {
    flex: 1,
    marginBottom: 20,
  },

  courseTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 12,
    lineHeight: 1.4,
  },

  courseDescription: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 12,
  },

  dateInfo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#64748b",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 12,
  },

  dateIcon: {
    fontSize: 13,
    color: "#94a3b8",
  },

  progressSection: {
    marginBottom: 20,
  },

  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  progressLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
  },

  progressIcon: {
    fontSize: 14,
    color: "#3D1A5B",
  },

  progressPercentage: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
  },

  progressBarContainer: {
    marginTop: 8,
  },

  progressBarTrack: {
    width: "100%",
    height: 12,
    background: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 10,
    transition: "width 0.5s ease",
  },

  buttonGroup: {
    display: "flex",
    gap: 10,
  },

  viewButton: {
    padding: "14px 20px",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    cursor: "pointer",
  },

  paymentButton: {
    padding: "14px 20px",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    cursor: "pointer",
    flex: 1
  },

  buttonArrow: {
    fontSize: 14,
    transition: "transform 0.3s ease",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modalContent: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #e2e8f0",
  },

  modalTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
  },

  modalBody: {
    padding: "24px",
  },

  courseInfo: {
    marginBottom: "24px",
  },

  priceDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "rgba(61, 26, 91, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(61, 26, 91, 0.1)",
  },

  noteBox: {
    background: "rgba(241, 213, 114, 0.1)",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "20px",
    border: "1px solid rgba(166, 138, 70, 0.2)",
  },

  paymentMethods: {
    marginTop: "24px",
  },

  methodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },

  paymentMethodBtn: {
    background: "#fff",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  modalFooter: {
    padding: "24px",
    borderTop: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cancelButton: {
    background: "#64748b",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

const statusBadgeStyle = (status) => ({
  background: status.bg,
  color: status.color,
  padding: "8px 16px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: 6,
  textTransform: "uppercase",
  letterSpacing: 0.5,
});

export default StudentCoursesPage;











// // src/pages/StudentCoursesPage.jsx
// import React, { useEffect, useState } from "react";
// import StudentSidebar from "../components/StudentSidebar";
// import {
//   getStudentEnrollments,
//   getProgress,
//   enrollStudentInCourse,
//   getAllCourses,
//   completePaymentProcess,
//   canAccessCourse,
//   getEnrollmentStatus
// } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import {
//   FaClock,
//   FaChartLine,
//   FaArrowRight,
//   FaGraduationCap,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaBook,
//   FaCalendarAlt,
//   FaLock,
//   FaUnlock,
//   FaRupeeSign,
//   FaMoneyBillWave,
//   FaExclamationTriangle,
//   FaPlay,
//   FaShoppingCart,
//   FaBars,
//   FaTimes,
//   FaTags,
//   FaHourglassHalf,
//   FaStopwatch,
//   FaInfoCircle,
//   FaShieldAlt
// } from "react-icons/fa";
// import { getUserId, isAuthenticated } from "../utils/auth";

// // ✅ FEATURE FLAG - Set to true to re-enable enrollment
// const ENABLE_ENROLLMENT = true;

// const StudentCoursesPage = () => {
//   const [enrollments, setEnrollments] = useState([]);
//   const [progressData, setProgressData] = useState({});
//   const [coursePrices, setCoursePrices] = useState({});
//   const [paymentStatus, setPaymentStatus] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [enrolling, setEnrolling] = useState(false);
//   const [error, setError] = useState("");
//   const [processingPayment, setProcessingPayment] = useState({});
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [courseAccessMap, setCourseAccessMap] = useState({});

//   const navigate = useNavigate();
//   const studentId = getUserId();

//   // Responsive handling
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       if (!mobile && isMobileSidebarOpen) {
//         setIsMobileSidebarOpen(false);
//       }
//     };
    
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isMobileSidebarOpen]);

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate("/login");
//       return;
//     }
    
//     if (studentId) {
//       initializePage();
//     }
//   }, [studentId, navigate]);

//   const initializePage = async () => {
//     await Promise.all([
//       fetchEnrollments(), 
//       ENABLE_ENROLLMENT ? fetchAllCourses() : Promise.resolve()
//     ]);
//   };

//   const fetchEnrollments = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Fetching enrollments for student:", studentId);
      
//       const data = await getStudentEnrollments(studentId);
//       console.log("📚 Raw enrollments data:", data);

//       // Filter active enrollments
//       const active = data.filter(e => {
//         const isValid = !e.isDeleted && e.course && e.course._id;
//         if (!isValid) {
//           console.warn("⚠️ Filtered out invalid enrollment:", e);
//         }
//         return isValid;
//       });
      
//       console.log(`✅ Active enrollments found: ${active.length}`);
//       setEnrollments(active);

//       const progressMap = {};
//       const priceMap = {};
//       const paymentMap = {};
//       const accessMap = {};
      
//       // Process each enrollment with detailed access checking
//       for (const enrollment of active) {
//         const courseId = enrollment.course._id;
//         const course = enrollment.course;
        
//         console.log(`\n🎯 Processing course: ${course.title} (${courseId})`);
        
//         try {
//           // Get progress
//           try {
//             const res = await getProgress(studentId, courseId);
//             progressMap[courseId] = res.progressPercentage || 0;
//             console.log(`  📊 Progress: ${progressMap[courseId]}%`);
//           } catch (progressErr) {
//             console.warn(`  ⚠️ Could not fetch progress:`, progressErr.message);
//             progressMap[courseId] = 0;
//           }
          
//           // Get course price
//           const coursePrice = enrollment.course.price || 0;
//           priceMap[courseId] = coursePrice;
//           console.log(`  💰 Course price: ₹${coursePrice}`);
          
//           // ✅ Get detailed enrollment status with time/lecture limits
//           try {
//             const status = await getEnrollmentStatus(studentId, courseId);
//             console.log(`  🔐 Enrollment Status:`, {
//               isEnrolled: status.isEnrolled,
//               isPaid: status.isPaid,
//               hasAccess: status.hasAccess,
//               isExpired: status.isExpired,
//               isLimitReached: status.isLimitReached,
//               daysRemaining: status.daysRemaining,
//               lectureLimit: status.lectureLimit,
//               accessedLecturesCount: status.accessedLecturesCount,
//               lecturesRemaining: status.lecturesRemaining,
//               endDate: status.endDate
//             });
            
//             // Store comprehensive access info
//             accessMap[courseId] = {
//               // Basic access
//               canAccess: status.hasAccess || false,
//               hasFullAccess: status.hasAccess || false,
//               isPaid: status.isPaid || false,
//               coursePrice: coursePrice,
//               isEnrolled: true,
//               enrollmentId: enrollment._id,
              
//               // Time-based access info
//               isExpired: status.isExpired || false,
//               daysRemaining: status.daysRemaining ?? null,
//               endDate: status.endDate || null,
              
//               // Lecture limit info
//               isLimitReached: status.isLimitReached || false,
//               lectureLimit: status.lectureLimit ?? null,
//               accessedLecturesCount: status.accessedLecturesCount || 0,
//               lecturesRemaining: status.lecturesRemaining ?? null,
              
//               // Admin grant info
//               accessGrantedBy: status.grantedByAdmin ? 'admin' : null,
//               accessGrantedAt: status.grantedAt || null
//             };
            
//             paymentMap[courseId] = status.isPaid || false;
            
//             console.log(`  ✅ Access summary:
//               - Can Access: ${accessMap[courseId].canAccess}
//               - Is Expired: ${accessMap[courseId].isExpired}
//               - Days Remaining: ${accessMap[courseId].daysRemaining}
//               - Lecture Limit: ${accessMap[courseId].lectureLimit}
//               - Lectures Used: ${accessMap[courseId].accessedLecturesCount}
//               - Lectures Remaining: ${accessMap[courseId].lecturesRemaining}
//               - Is Limit Reached: ${accessMap[courseId].isLimitReached}`);
            
//           } catch (accessErr) {
//             console.error(`  ❌ Access check failed:`, accessErr);
            
//             // Fallback logic
//             const isFreeCourse = coursePrice === 0;
//             const isPaidEnrollment = enrollment.isPaid || false;
            
//             accessMap[courseId] = {
//               canAccess: isFreeCourse || isPaidEnrollment,
//               hasFullAccess: isFreeCourse || isPaidEnrollment,
//               isPaid: isPaidEnrollment,
//               coursePrice: coursePrice,
//               isEnrolled: true,
//               enrollmentId: enrollment._id,
//               isExpired: false,
//               daysRemaining: null,
//               endDate: null,
//               isLimitReached: false,
//               lectureLimit: null,
//               accessedLecturesCount: 0,
//               lecturesRemaining: null,
//               accessGrantedBy: null,
//               accessGrantedAt: null
//             };
            
//             paymentMap[courseId] = isPaidEnrollment;
//             console.log(`  ⚠️ Using fallback access - Can Access: ${isFreeCourse || isPaidEnrollment}`);
//           }
          
//         } catch (err) {
//           console.error(`  ❌ Error processing course ${courseId}:`, err);
          
//           // Safe defaults
//           const coursePrice = enrollment.course.price || 0;
//           const isFreeCourse = coursePrice === 0;
//           const isPaidEnrollment = enrollment.isPaid || false;
          
//           progressMap[courseId] = 0;
//           priceMap[courseId] = coursePrice;
//           paymentMap[courseId] = isPaidEnrollment;
//           accessMap[courseId] = {
//             canAccess: isFreeCourse || isPaidEnrollment,
//             hasFullAccess: isFreeCourse || isPaidEnrollment,
//             isPaid: isPaidEnrollment,
//             coursePrice: coursePrice,
//             isEnrolled: true,
//             enrollmentId: enrollment._id,
//             isExpired: false,
//             daysRemaining: null,
//             endDate: null,
//             isLimitReached: false,
//             lectureLimit: null,
//             accessedLecturesCount: 0,
//             lecturesRemaining: null,
//             accessGrantedBy: null,
//             accessGrantedAt: null
//           };
//         }
//       }
      
//       setProgressData(progressMap);
//       setCoursePrices(priceMap);
//       setPaymentStatus(paymentMap);
//       setCourseAccessMap(accessMap);
      
//       console.log("\n✅ All enrollments processed successfully");
//       console.log("📊 Final Access Map:", accessMap);
      
//     } catch (err) {
//       console.error("❌ Error fetching enrollments:", err);
//       setError("Failed to load courses");
//       setEnrollments([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAllCourses = async () => {
//     try {
//       const data = await getAllCourses();
//       setAvailableCourses(data || []);
//     } catch (err) {
//       console.error("Error fetching courses:", err);
//     }
//   };

//   const handleEnrollCourse = async () => {
//     if (!selectedCourse) {
//       setError("Please select a course");
//       return;
//     }
    
//     if (!studentId) {
//       setError("User not logged in. Please login again.");
//       navigate("/login");
//       return;
//     }
    
//     setEnrolling(true);
//     setError("");
    
//     try {
//       const selectedCourseData = availableCourses.find(c => c._id === selectedCourse);
      
//       if (!selectedCourseData) {
//         setError("Course not found");
//         setEnrolling(false);
//         return;
//       }
      
//       const coursePrice = selectedCourseData.price || 0;
      
//       const enrollmentResult = await enrollStudentInCourse(
//         studentId, 
//         selectedCourseData._id,
//         coursePrice === 0
//       );

//       if (coursePrice === 0) {
//         alert("✅ Successfully enrolled in free course! You now have full access.");
//         await fetchEnrollments();
//         setSelectedCourse("");
//       } else {
//         alert("✅ Enrollment successful! Please complete payment to unlock all content.");
//         setSelectedCourseForPayment(selectedCourseData);
//         setShowPaymentModal(true);
//         await fetchEnrollments();
//         setSelectedCourse("");
//       }
      
//     } catch (err) {
//       console.error("❌ Enrollment error:", err);
      
//       if (err.response?.status === 400) {
//         const errorMsg = err.response?.data?.message || err.response?.data?.error;
        
//         if (errorMsg?.toLowerCase().includes("already enrolled")) {
//           setError("ℹ️ You are already enrolled in this course.");
//           await fetchEnrollments();
//         } else {
//           setError(errorMsg || "Invalid enrollment request. Please try again.");
//         }
//       } else if (err.response?.status === 401) {
//         setError("Session expired. Please login again.");
//         setTimeout(() => navigate("/login"), 2000);
//       } else {
//         setError(err.response?.data?.message || "Enrollment failed. Please try again.");
//       }
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   const handlePayment = async (courseId, paymentMethod) => {
//     try {
//       setProcessingPayment(prev => ({ ...prev, [courseId]: true }));
      
//       const course = availableCourses.find(c => c._id === courseId);
//       const coursePrice = course?.price || 0;
      
//       if (!coursePrice || coursePrice <= 0) {
//         alert("Invalid course price");
//         return;
//       }
      
//       const result = await completePaymentProcess(courseId, paymentMethod, coursePrice);
      
//       if (result.success) {
//         alert("✅ Payment successful! Course is now unlocked.");
//         setShowPaymentModal(false);
//         setSelectedCourseForPayment(null);
//         await fetchEnrollments();
//       } else {
//         alert(result.message || "Payment failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Payment error:", err);
//       alert(err.response?.data?.message || "Payment processing error. Please try again.");
//     } finally {
//       setProcessingPayment(prev => ({ ...prev, [courseId]: false }));
//     }
//   };

//   const getStatus = (progress) => {
//     if (progress === 100) {
//       return { text: "Completed", color: "#10b981", bg: "#d1fae5", icon: <FaCheckCircle /> };
//     }
//     if (progress > 0) {
//       return { text: "In Progress", color: "#F1D572", bg: "rgba(241, 213, 114, 0.2)", icon: <FaChartLine /> };
//     }
//     return { text: "Not Started", color: "#6b7280", bg: "#f3f4f6", icon: <FaBook /> };
//   };

//   // Check if course is locked based on access info
//   const isCourseLocked = (enrollment) => {
//     const courseId = enrollment.course._id;
//     const accessInfo = courseAccessMap[courseId];
    
//     if (!accessInfo) {
//       const coursePrice = enrollment.course.price || 0;
//       return coursePrice > 0 && !enrollment.isPaid;
//     }
    
//     // Free courses are never locked
//     if (accessInfo.coursePrice === 0) {
//       return false;
//     }
    
//     // Check if access is expired
//     if (accessInfo.isExpired) {
//       return true;
//     }
    
//     // Check if lecture limit is reached
//     if (accessInfo.isLimitReached) {
//       return true;
//     }
    
//     // Paid courses: locked if no access
//     return !accessInfo.canAccess && !accessInfo.hasFullAccess && !accessInfo.isPaid;
//   };

//   // Get detailed access type with all status info
//   const getCourseAccessType = (enrollment) => {
//     const courseId = enrollment.course._id;
//     const accessInfo = courseAccessMap[courseId];
    
//     if (!accessInfo) {
//       const coursePrice = enrollment.course.price || 0;
//       const isPaid = enrollment.isPaid || false;
      
//       if (coursePrice === 0) {
//         return { 
//           type: "free", 
//           label: "Free Course", 
//           icon: <FaUnlock />, 
//           color: "#10b981", 
//           bg: "#d1fae5",
//           tooltip: "Free course - full access"
//         };
//       } else if (isPaid) {
//         return { 
//           type: "paid_unlocked", 
//           label: "Paid (Unlocked)", 
//           icon: <FaUnlock />, 
//           color: "#3D1A5B", 
//           bg: "rgba(61, 26, 91, 0.1)",
//           tooltip: "Access granted via payment"
//         };
//       } else {
//         return { 
//           type: "paid_locked", 
//           label: "Payment Required", 
//           icon: <FaLock />, 
//           color: "#ef4444", 
//           bg: "#fee2e2",
//           tooltip: "Complete payment to unlock"
//         };
//       }
//     }
    
//     const coursePrice = accessInfo.coursePrice;
    
//     // Free course
//     if (coursePrice === 0) {
//       return { 
//         type: "free", 
//         label: "Free Course", 
//         icon: <FaUnlock />, 
//         color: "#10b981", 
//         bg: "#d1fae5",
//         tooltip: "Free course - full access"
//       };
//     }
    
//     // Expired access
//     if (accessInfo.isExpired) {
//       return { 
//         type: "expired", 
//         label: "Access Expired", 
//         icon: <FaHourglassHalf />, 
//         color: "#ef4444", 
//         bg: "#fee2e2",
//         tooltip: `Expired on ${accessInfo.endDate ? new Date(accessInfo.endDate).toLocaleDateString() : "N/A"}`
//       };
//     }
    
//     // Limit reached
//     if (accessInfo.isLimitReached) {
//       return { 
//         type: "limit_reached", 
//         label: "Limit Reached", 
//         icon: <FaStopwatch />, 
//         color: "#ef4444", 
//         bg: "#fee2e2",
//         tooltip: `Reached limit of ${accessInfo.lectureLimit} lectures`
//       };
//     }
    
//     // Access granted by admin
//     if (accessInfo.accessGrantedBy) {
//       return { 
//         type: "granted_access", 
//         label: "Access Granted", 
//         icon: <FaShieldAlt />, 
//         color: "#0d9488", 
//         bg: "rgba(13, 148, 136, 0.1)",
//         tooltip: "Access granted by admin"
//       };
//     }
    
//     // Paid and unlocked with time limit
//     if (accessInfo.isPaid || accessInfo.hasFullAccess) {
//       if (accessInfo.daysRemaining !== null && accessInfo.daysRemaining > 0) {
//         return { 
//           type: "time_limited", 
//           label: `${accessInfo.daysRemaining} days left`, 
//           icon: <FaClock />, 
//           color: accessInfo.daysRemaining <= 7 ? "#f97316" : "#3D1A5B", 
//           bg: accessInfo.daysRemaining <= 7 ? "#fed7aa" : "rgba(61, 26, 91, 0.1)",
//           tooltip: `${accessInfo.daysRemaining} days remaining`
//         };
//       }
      
//       if (accessInfo.lectureLimit !== null) {
//         return { 
//           type: "lecture_limited", 
//           label: `${accessInfo.accessedLecturesCount || 0}/${accessInfo.lectureLimit} lectures`, 
//           icon: <FaBook />, 
//           color: "#3D1A5B", 
//           bg: "rgba(61, 26, 91, 0.1)",
//           tooltip: `${accessInfo.lecturesRemaining || 0} lectures remaining`
//         };
//       }
      
//       return { 
//         type: "paid_unlocked", 
//         label: "Full Access", 
//         icon: <FaUnlock />, 
//         color: "#3D1A5B", 
//         bg: "rgba(61, 26, 91, 0.1)",
//         tooltip: "Lifetime unlimited access"
//       };
//     }
    
//     // Locked (payment required)
//     return { 
//       type: "paid_locked", 
//       label: "Payment Required", 
//       icon: <FaLock />, 
//       color: "#ef4444", 
//       bg: "#fee2e2",
//       tooltip: "Complete payment to unlock"
//     };
//   };

//   // Get access details for display
//   const getAccessDetails = (enrollment) => {
//     const courseId = enrollment.course._id;
//     const accessInfo = courseAccessMap[courseId];
    
//     if (!accessInfo) return null;
    
//     const details = [];
    
//     if (accessInfo.daysRemaining !== null && accessInfo.daysRemaining > 0) {
//       details.push({
//         icon: <FaClock size={12} />,
//         text: `${accessInfo.daysRemaining} days left`,
//         color: accessInfo.daysRemaining <= 7 ? "#f97316" : "#059669"
//       });
//     }
    
//     if (accessInfo.lectureLimit !== null && !accessInfo.isLimitReached) {
//       details.push({
//         icon: <FaBook size={12} />,
//         text: `${accessInfo.lecturesRemaining || 0} lectures left`,
//         color: "#3b82f6"
//       });
//     }
    
//     if (accessInfo.isExpired) {
//       details.push({
//         icon: <FaHourglassHalf size={12} />,
//         text: "Access expired",
//         color: "#ef4444"
//       });
//     }
    
//     if (accessInfo.isLimitReached) {
//       details.push({
//         icon: <FaStopwatch size={12} />,
//         text: `Limit reached (${accessInfo.lectureLimit} lectures)`,
//         color: "#ef4444"
//       });
//     }
    
//     return details;
//   };

//   const StatBadge = ({ label, value, color }) => (
//     <div style={styles.statBadgeContainer}>
//       <div style={{ ...styles.statBadgeValue, color }}>{value}</div>
//       <div style={styles.statBadgeLabel}>{label}</div>
//     </div>
//   );

//   if (loading && enrollments.length === 0) {
//     return (
//       <div style={styles.pageContainer}>
//         <StudentSidebar 
//           isMobile={isMobile}
//           isOpen={isMobileSidebarOpen}
//           onClose={() => setIsMobileSidebarOpen(false)}
//         />
//         <div style={{
//           ...styles.loadingContainer,
//           marginLeft: isMobile ? "0" : "280px",
//           padding: isMobile ? "80px 20px 20px 20px" : "32px",
//         }}>
//           <div style={styles.spinner}></div>
//           <div style={styles.loadingText}>Loading your courses...</div>
//         </div>
//       </div>
//     );
//   }

//   const totalCourses = enrollments.length;
//   const completedCourses = enrollments.filter(e => (progressData[e.course._id] || 0) === 100).length;
//   const unlockedCourses = enrollments.filter(e => !isCourseLocked(e)).length;
//   const avgProgress = totalCourses > 0 
//     ? Math.round(enrollments.reduce((sum, e) => sum + (progressData[e.course._id] || 0), 0) / totalCourses)
//     : 0;

//   return (
//     <div style={styles.pageContainer}>
//       <StudentSidebar 
//         isMobile={isMobile}
//         isOpen={isMobileSidebarOpen}
//         onClose={() => setIsMobileSidebarOpen(false)}
//       />
      
//       {isMobile && (
//         <button 
//           style={styles.mobileMenuButton}
//           onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       )}
      
//       <div style={{
//         ...styles.mainContent,
//         marginLeft: isMobile ? "0" : "280px",
//         padding: isMobile ? "80px 20px 32px 20px" : "32px 40px",
//       }}>
//         {/* Header Section */}
//         <div style={styles.headerSection}>
//           <div style={styles.headerTop}>
//             <div style={styles.headerLeft}>
//               <h1 style={styles.pageTitle}>
//                 <FaGraduationCap style={styles.titleIcon} />
//                 My Courses
//               </h1>
//               <p style={styles.pageSubtitle}>
//                 Track your progress, access course materials, and continue learning
//               </p>
//             </div>
            
//             <div style={styles.liveDataBadge}>
//               <p style={styles.liveDataText}>
//                 Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>

//           <div style={styles.statsContainer}>
//             <StatBadge 
//               label="Total Courses" 
//               value={totalCourses} 
//               color="#3D1A5B" 
//             />
//             <StatBadge 
//               label="Completed" 
//               value={completedCourses} 
//               color="#10b981" 
//             />
//             <StatBadge 
//               label="Unlocked" 
//               value={unlockedCourses} 
//               color="#F1D572" 
//             />
//             <StatBadge 
//               label="Avg Progress" 
//               value={`${avgProgress}%`} 
//               color="#A68A46" 
//             />
//           </div>
//         </div>

//         {/* Enrollment Section */}
//         {ENABLE_ENROLLMENT ? (
//           <div style={styles.enrollSection}>
//             <div style={styles.sectionHeader}>
//               <div style={styles.sectionIndicator}></div>
//               <h2 style={styles.sectionTitle}>Enroll in New Course</h2>
//             </div>
            
//             <p style={styles.enrollSubtitle}>
//               Choose from available courses to expand your learning
//             </p>
            
//             <div style={styles.enrollForm}>
//               <div style={styles.selectWrapper}>
//                 <select
//                   value={selectedCourse}
//                   onChange={(e) => {
//                     setSelectedCourse(e.target.value);
//                     setError("");
//                   }}
//                   style={styles.selectStyle}
//                   disabled={enrolling}
//                 >
//                   <option value="">Select a course to enroll...</option>
//                   {availableCourses
//                     .filter(c => !enrollments.some(e => e.course._id === c._id))
//                     .map(c => (
//                       <option key={c._id} value={c._id}>
//                         {c.title} {c.duration ? `(${c.duration}h)` : ''} - 
//                         {c.price > 0 ? ` ₹${c.price}` : ' FREE'}
//                       </option>
//                     ))}
//                 </select>
//               </div>
              
//               <button
//                 onClick={handleEnrollCourse}
//                 disabled={!selectedCourse || enrolling}
//                 style={{
//                   ...styles.enrollButton,
//                   opacity: (!selectedCourse || enrolling) ? 0.7 : 1,
//                   cursor: (!selectedCourse || enrolling) ? 'not-allowed' : 'pointer'
//                 }}
//               >
//                 {enrolling ? (
//                   <>
//                     <div style={styles.buttonSpinner}></div>
//                     Enrolling...
//                   </>
//                 ) : selectedCourse && availableCourses.find(c => c._id === selectedCourse)?.price > 0 ? (
//                   <>
//                     <FaShoppingCart /> Proceed to Payment
//                     <FaArrowRight />
//                   </>
//                 ) : (
//                   <>
//                     <FaBook /> Enroll Now
//                     <FaArrowRight />
//                   </>
//                 )}
//               </button>
//             </div>
            
//             {error && (
//               <div style={styles.errorMessage}>
//                 <FaTimesCircle />
//                 {error}
//               </div>
//             )}
            
//             {availableCourses.length > 0 && (
//               <div style={{ marginTop: 16, fontSize: 14, color: '#64748b' }}>
//                 {availableCourses.filter(c => !enrollments.some(e => e.course._id === c._id)).length} courses available for enrollment
//               </div>
//             )}
//           </div>
//         ) : (
//           <div style={styles.enrollSection}>
//             {/* Enrollment disabled message - can be uncommented if needed */}
//           </div>
//         )}

//         {/* Courses Grid Section */}
//         <div style={styles.coursesSection}>
//           <div style={styles.coursesSectionHeader}>
//             <div style={styles.sectionHeader}>
//               <div style={styles.sectionIndicator}></div>
//               <h2 style={styles.sectionTitle}>Your Courses</h2>
//             </div>
//             <div style={styles.coursesInfo}>
//               <span style={styles.courseCount}>
//                 {totalCourses} course{totalCourses !== 1 ? 's' : ''}
//               </span>
//               <div style={styles.courseStats}>
//                 {unlockedCourses} unlocked • {totalCourses - unlockedCourses} locked
//               </div>
//             </div>
//           </div>

//           {enrollments.length === 0 ? (
//             <div style={styles.emptyState}>
//               <FaBook style={styles.emptyIcon} />
//               <h3 style={styles.emptyTitle}>No courses enrolled yet</h3>
//               <p style={styles.emptyText}>
//                 Get started by enrolling in a course from the dropdown above
//               </p>
//             </div>
//           ) : (
//             <div style={styles.coursesGrid}>
//               {enrollments.map((enrollment) => {
//                 const course = enrollment.course;
//                 const courseId = course._id;
//                 const progress = progressData[courseId] || 0;
//                 const status = getStatus(progress);
//                 const accessType = getCourseAccessType(enrollment);
//                 const locked = isCourseLocked(enrollment);
//                 const accessDetails = getAccessDetails(enrollment);
//                 const accessInfo = courseAccessMap[courseId];

//                 return (
//                   <div
//                     key={enrollment._id}
//                     style={{
//                       ...styles.courseCard,
//                       opacity: locked ? 0.9 : 1,
//                       borderLeft: accessInfo?.isExpired ? "4px solid #ef4444" : 
//                                  accessInfo?.isLimitReached ? "4px solid #ef4444" :
//                                  accessType.type === "granted_access" ? "4px solid #0d9488" :
//                                  accessType.type === "time_limited" ? "4px solid #f97316" : 
//                                  accessType.type === "lecture_limited" ? "4px solid #3b82f6" : "4px solid transparent"
//                     }}
//                     className="course-card"
//                   >
//                     <div style={styles.cardHeader}>
//                       <div style={statusBadgeStyle(status)}>
//                         {status.icon}
//                         {status.text}
//                       </div>
                      
//                       <div style={styles.badgeContainer}>
//                         {/* Access Type Badge */}
//                         <div style={{
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px',
//                           background: accessType.bg,
//                           color: accessType.color,
//                           padding: '6px 12px',
//                           borderRadius: '20px',
//                           fontSize: '12px',
//                           fontWeight: '600',
//                           cursor: 'help'
//                         }} title={accessType.tooltip}>
//                           {accessType.icon}
//                           {accessType.label}
//                         </div>
                        
//                         {/* Price Badge */}
//                         {accessInfo?.coursePrice > 0 && !accessInfo.isPaid && !accessInfo.accessGrantedBy && (
//                           <div style={styles.priceBadge}>
//                             <FaRupeeSign size={10} />
//                             ₹{accessInfo.coursePrice}
//                           </div>
//                         )}
                        
//                         {course.duration && (
//                           <div style={styles.durationBadge}>
//                             <FaClock style={styles.badgeIcon} />
//                             {course.duration}h
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div style={styles.cardBody}>
//                       <h3 style={styles.courseTitle}>{course.title}</h3>
//                       <p style={styles.courseDescription}>
//                         {course.description?.substring(0, 120) || 'No description available'}...
//                       </p>
                      
//                       {course.subCategories && (
//                         <div style={{ 
//                           display: 'flex', 
//                           flexWrap: 'wrap', 
//                           gap: '6px', 
//                           marginTop: '8px',
//                           marginBottom: '8px'
//                         }}>
//                           {(typeof course.subCategories === 'string' 
//                             ? JSON.parse(course.subCategories) 
//                             : course.subCategories
//                           )?.slice(0, 3).map((sub, idx) => (
//                             <span key={idx} style={{
//                               display: 'inline-flex',
//                               alignItems: 'center',
//                               gap: '4px',
//                               background: '#e0f2fe',
//                               color: '#0369a1',
//                               padding: '4px 8px',
//                               borderRadius: '4px',
//                               fontSize: '11px',
//                               fontWeight: '500'
//                             }}>
//                               <FaTags size={9} />
//                               {sub}
//                             </span>
//                           ))}
//                         </div>
//                       )}
                      
//                       {/* Access Details */}
//                       {accessDetails && accessDetails.length > 0 && (
//                         <div style={{
//                           marginTop: '12px',
//                           padding: '8px 12px',
//                           background: '#f8fafc',
//                           borderRadius: '8px',
//                           display: 'flex',
//                           flexWrap: 'wrap',
//                           gap: '12px',
//                           border: '1px solid #e2e8f0'
//                         }}>
//                           {accessDetails.map((detail, idx) => (
//                             <div key={idx} style={{
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '6px',
//                               fontSize: '12px',
//                               color: detail.color
//                             }}>
//                               {detail.icon}
//                               <span>{detail.text}</span>
//                             </div>
//                           ))}
//                         </div>
//                       )}
                      
//                       {/* Admin grant badge */}
//                       {accessInfo?.accessGrantedBy && (
//                         <div style={{
//                           marginTop: '8px',
//                           padding: '6px 10px',
//                           background: 'rgba(13, 148, 136, 0.1)',
//                           borderRadius: '6px',
//                           fontSize: '11px',
//                           color: '#0f766e',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '4px'
//                         }}>
//                           <FaShieldAlt size={10} />
//                           Free access granted by admin
//                         </div>
//                       )}
                      
//                       {/* Expired warning */}
//                       {accessInfo?.isExpired && (
//                         <div style={{
//                           marginTop: '8px',
//                           padding: '8px 10px',
//                           background: '#fee2e2',
//                           borderRadius: '6px',
//                           fontSize: '11px',
//                           color: '#991b1b',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}>
//                           <FaHourglassHalf size={10} />
//                           Access expired on {accessInfo.endDate ? new Date(accessInfo.endDate).toLocaleDateString() : "N/A"}
//                         </div>
//                       )}
                      
//                       {/* Limit reached warning */}
//                       {accessInfo?.isLimitReached && (
//                         <div style={{
//                           marginTop: '8px',
//                           padding: '8px 10px',
//                           background: '#fee2e2',
//                           borderRadius: '6px',
//                           fontSize: '11px',
//                           color: '#991b1b',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '6px'
//                         }}>
//                           <FaStopwatch size={10} />
//                           Lecture limit reached ({accessInfo.lectureLimit} lectures)
//                         </div>
//                       )}
                      
//                       {course.createdAt && (
//                         <div style={styles.dateInfo}>
//                           <FaCalendarAlt style={styles.dateIcon} />
//                           Enrolled on {new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>

//                     <div style={styles.buttonGroup}>
//                       <button
//                         onClick={() => {
//                           if (locked && accessInfo?.coursePrice > 0 && !accessInfo.isExpired && !accessInfo.isLimitReached) {
//                             setSelectedCourseForPayment(course);
//                             setShowPaymentModal(true);
//                             return;
//                           }
                          
//                           // Allow navigation even if expired or limit reached? No, show message
//                           if (accessInfo?.isExpired) {
//                             alert("Your access to this course has expired. Please contact admin to renew.");
//                             return;
//                           }
                          
//                           if (accessInfo?.isLimitReached) {
//                             alert(`You have reached your lecture limit (${accessInfo.lectureLimit} lectures). Please contact admin to extend.`);
//                             return;
//                           }
                          
//                           navigate(`/student/courses/${courseId}`);
//                         }}
//                         style={{
//                           ...styles.viewButton,
//                           background: locked && !accessInfo?.isExpired && !accessInfo?.isLimitReached
//                             ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
//                             : accessInfo?.isExpired || accessInfo?.isLimitReached
//                             ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
//                             : progress === 100
//                             ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
//                             : 'linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)',
//                           flex: accessInfo?.coursePrice > 0 && locked && !accessInfo?.isExpired && !accessInfo?.isLimitReached ? 2 : 1
//                         }}
//                         className="view-button"
//                       >
//                         {accessInfo?.isExpired ? (
//                           <>
//                             <FaHourglassHalf />
//                             Access Expired
//                           </>
//                         ) : accessInfo?.isLimitReached ? (
//                           <>
//                             <FaStopwatch />
//                             Limit Reached
//                           </>
//                         ) : locked && accessInfo?.coursePrice > 0 ? (
//                           <>
//                             <FaLock />
//                             Unlock Course
//                           </>
//                         ) : progress === 100 ? (
//                           <>
//                             <FaCheckCircle />
//                             Review Course
//                             <FaArrowRight style={styles.buttonArrow} />
//                           </>
//                         ) : (
//                           <>
//                             <FaPlay />
//                             Continue Learning
//                             <FaArrowRight style={styles.buttonArrow} />
//                           </>
//                         )}
//                       </button>
                      
//                       {accessInfo?.coursePrice > 0 && locked && !accessInfo?.isExpired && !accessInfo?.isLimitReached && !accessInfo?.accessGrantedBy && (
//                         <button
//                           onClick={() => {
//                             setSelectedCourseForPayment(course);
//                             setShowPaymentModal(true);
//                           }}
//                           disabled={processingPayment[courseId]}
//                           style={{
//                             ...styles.paymentButton,
//                             opacity: processingPayment[courseId] ? 0.7 : 1,
//                             cursor: processingPayment[courseId] ? 'not-allowed' : 'pointer'
//                           }}
//                           className="payment-button"
//                         >
//                           {processingPayment[courseId] ? (
//                             <>
//                               <div style={styles.buttonSpinner}></div>
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <FaMoneyBillWave />
//                               Pay ₹{accessInfo.coursePrice}
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {showPaymentModal && selectedCourseForPayment && (
//         <div style={styles.modalOverlay}>
//           <div style={styles.modalContent}>
//             <div style={styles.modalHeader}>
//               <h3 style={styles.modalTitle}>
//                 <FaShoppingCart /> Complete Payment
//               </h3>
//               <button
//                 onClick={() => {
//                   setShowPaymentModal(false);
//                   setSelectedCourseForPayment(null);
//                 }}
//                 style={styles.modalClose}
//               >
//                 ✕
//               </button>
//             </div>
            
//             <div style={styles.modalBody}>
//               <div style={styles.courseInfo}>
//                 <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
//                   {selectedCourseForPayment.title}
//                 </h4>
//                 <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>
//                   {selectedCourseForPayment.description?.substring(0, 150)}...
//                 </p>
                
//                 <div style={styles.priceDisplay}>
//                   <div style={{ fontSize: '14px', color: '#64748b' }}>Course Price:</div>
//                   <div style={{ fontSize: '32px', fontWeight: '800', color: '#3D1A5B' }}>
//                     ₹{selectedCourseForPayment.price || 0}
//                   </div>
//                 </div>
                
//                 <div style={styles.noteBox}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400e' }}>
//                     <FaExclamationTriangle />
//                     <strong>Note:</strong> Once payment is complete, you'll get lifetime access to all course materials.
//                   </div>
//                 </div>
//               </div>
              
//               <div style={styles.paymentMethods}>
//                 <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>Select Payment Method</h4>
                
//                 <div style={styles.methodGrid}>
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'card')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
//                     <div style={{ fontWeight: '600' }}>Credit/Debit Card</div>
//                     <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with card</div>
//                   </button>
                  
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'upi')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>📱</div>
//                     <div style={{ fontWeight: '600' }}>UPI</div>
//                     <div style={{ fontSize: '12px', color: '#64748b' }}>Pay with UPI ID</div>
//                   </button>
                  
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'netbanking')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏦</div>
//                     <div style={{ fontWeight: '600' }}>Net Banking</div>
//                     <div style={{ fontSize: '12px', color: '#64748b' }}>All banks supported</div>
//                   </button>
                  
//                   <button
//                     onClick={() => handlePayment(selectedCourseForPayment._id, 'wallet')}
//                     disabled={processingPayment[selectedCourseForPayment._id]}
//                     style={styles.paymentMethodBtn}
//                   >
//                     <div style={{ fontSize: '24px', marginBottom: '8px' }}>👛</div>
//                     <div style={{ fontWeight: '600' }}>Wallet</div>
//                     <div style={{ fontSize: '12px', color: '#64748b' }}>Paytm, PhonePe, etc.</div>
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.modalFooter}>
//               <button
//                 onClick={() => {
//                   setShowPaymentModal(false);
//                   setSelectedCourseForPayment(null);
//                 }}
//                 style={styles.cancelButton}
//               >
//                 Cancel
//               </button>
//               <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', flex: 1 }}>
//                 Your payment is secure and encrypted
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         .course-card {
//           transition: all 0.3s ease;
//         }
        
//         .course-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 35px rgba(61, 26, 91, 0.15);
//         }
        
//         .view-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
//         }
        
//         .payment-button:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
//         }

//         input:focus, select:focus, textarea:focus {
//           border-color: #3D1A5B !important;
//           box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
//         }

//         @media (max-width: 768px) {
//           [style*="mobileMenuButton"] {
//             display: flex !important;
//           }

//           [style*="mainContent"] {
//             margin-left: 0 !important;
//             padding: 80px 20px 20px 20px !important;
//           }

//           [style*="loadingContainer"] {
//             margin-left: 0 !important;
//             padding: 80px 20px 20px 20px !important;
//           }

//           [style*="headerTop"] {
//             flex-direction: column !important;
//             align-items: flex-start !important;
//           }

//           [style*="statsContainer"] {
//             display: grid !important;
//             grid-template-columns: repeat(2, 1fr) !important;
//             width: 100% !important;
//             gap: 12px !important;
//           }

//           [style*="enrollForm"] {
//             flex-direction: column !important;
//           }

//           [style*="selectWrapper"] {
//             width: 100% !important;
//             min-width: auto !important;
//           }

//           [style*="enrollButton"] {
//             width: 100% !important;
//           }

//           [style*="coursesGrid"] {
//             grid-template-columns: 1fr !important;
//           }

//           [style*="badgeContainer"] {
//             flex-wrap: wrap !important;
//           }

//           [style*="buttonGroup"] {
//             flex-direction: column !important;
//           }

//           [style*="viewButton"], [style*="paymentButton"] {
//             width: 100% !important;
//           }

//           [style*="methodGrid"] {
//             grid-template-columns: 1fr !important;
//           }
//         }

//         @media (max-width: 480px) {
//           [style*="mainContent"] {
//             padding: 70px 16px 16px 16px !important;
//           }

//           [style*="pageTitle"] {
//             font-size: 24px !important;
//           }

//           [style*="statsContainer"] {
//             grid-template-columns: 1fr !important;
//           }

//           [style*="statBadgeContainer"] {
//             min-width: auto !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// // Updated Styles
// const styles = {
//   pageContainer: {
//     display: "flex",
//     minHeight: "100vh",
//     background: "#f9fafb",
//     position: "relative",
//   },

//   mobileMenuButton: {
//     display: "none",
//     position: "fixed",
//     top: "16px",
//     left: "16px",
//     zIndex: 1000,
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     padding: "12px",
//     fontSize: "20px",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   loadingContainer: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   spinner: {
//     width: 50,
//     height: 50,
//     border: "4px solid #e5e7eb",
//     borderTop: "4px solid #3D1A5B",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//   },

//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#6b7280",
//     fontWeight: 500,
//   },

//   mainContent: {
//     flex: 1,
//     maxWidth: 1400,
//   },

//   headerSection: {
//     marginBottom: 40,
//   },

//   headerTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//     gap: 24,
//     marginBottom: 24,
//   },

//   headerLeft: {
//     flex: 1,
//   },

//   pageTitle: {
//     fontSize: 28,
//     fontWeight: 700,
//     color: "#3D1A5B",
//     marginBottom: 8,
//     margin: 0,
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },

//   titleIcon: {
//     color: "#F1D572",
//     fontSize: 28,
//   },

//   pageSubtitle: {
//     fontSize: 16,
//     color: "#6b7280",
//     lineHeight: 1.6,
//     margin: 0,
//   },

//   liveDataBadge: {
//     background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
//     border: "1px solid rgba(61, 26, 91, 0.2)",
//     borderRadius: "8px",
//     padding: "12px 16px",
//   },

//   liveDataText: {
//     color: "#3D1A5B",
//     fontSize: "14px",
//     fontWeight: "600",
//     margin: 0,
//   },

//   statsContainer: {
//     display: "flex",
//     gap: 16,
//     flexWrap: "wrap",
//   },

//   statBadgeContainer: {
//     background: "#fff",
//     padding: "16px 24px",
//     borderRadius: 12,
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//     textAlign: "center",
//     minWidth: 120,
//     border: "1px solid #e2e8f0",
//   },

//   statBadgeValue: {
//     fontSize: 32,
//     fontWeight: 800,
//     marginBottom: 4,
//   },

//   statBadgeLabel: {
//     fontSize: 13,
//     color: "#64748b",
//     fontWeight: 600,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },

//   enrollSection: {
//     background: "#fff",
//     padding: 32,
//     borderRadius: 20,
//     marginBottom: 40,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//     border: "1px solid #e2e8f0",
//   },

//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     marginBottom: "16px",
//   },

//   sectionIndicator: {
//     width: "4px",
//     height: "20px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     borderRadius: "2px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#374151",
//     margin: 0,
//   },

//   enrollSubtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 24,
//   },

//   enrollForm: {
//     display: "flex",
//     gap: 16,
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//   },

//   selectWrapper: {
//     flex: 1,
//     minWidth: 300,
//   },

//   selectStyle: {
//     width: "100%",
//     padding: "14px 16px",
//     fontSize: 15,
//     borderRadius: 12,
//     border: "2px solid #e2e8f0",
//     background: "#f8fafc",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//     fontFamily: "inherit",
//     outline: "none",
//   },

//   enrollButton: {
//     padding: "14px 32px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     whiteSpace: "nowrap",
//     cursor: "pointer",
//   },

//   buttonSpinner: {
//     width: 16,
//     height: 16,
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #fff",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },

//   errorMessage: {
//     marginTop: 16,
//     padding: 12,
//     background: "#fee2e2",
//     color: "#dc2626",
//     borderRadius: 10,
//     fontSize: 14,
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     fontWeight: 500,
//   },

//   coursesSection: {
//     marginTop: 40,
//   },

//   coursesSectionHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 24,
//     flexWrap: "wrap",
//     gap: 16,
//   },

//   coursesInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//   },

//   courseCount: {
//     fontSize: 20,
//     color: "#64748b",
//     fontWeight: 500,
//   },

//   courseStats: {
//     fontSize: 14,
//     color: "#64748b",
//     background: "#f8fafc",
//     padding: "6px 12px",
//     borderRadius: "20px",
//   },

//   emptyState: {
//     textAlign: "center",
//     padding: "80px 40px",
//     background: "#fff",
//     borderRadius: 20,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
//   },

//   emptyIcon: {
//     fontSize: 64,
//     color: "#cbd5e1",
//     marginBottom: 20,
//   },

//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#0f172a",
//     marginBottom: 8,
//   },

//   emptyText: {
//     fontSize: 16,
//     color: "#64748b",
//   },

//   coursesGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
//     gap: 28,
//   },

//   courseCard: {
//     background: "#fff",
//     borderRadius: 20,
//     padding: 28,
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//     border: "1px solid #e2e8f0",
//     display: "flex",
//     flexDirection: "column",
//   },

//   cardHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//     flexWrap: "wrap",
//     gap: 10,
//   },

//   badgeContainer: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//     justifyContent: "flex-end",
//   },

//   priceBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: "4px",
//     background: "rgba(241, 213, 114, 0.2)",
//     color: "#92400e",
//     padding: "6px 12px",
//     borderRadius: "20px",
//     fontSize: "12px",
//     fontWeight: "600",
//   },

//   durationBadge: {
//     display: "flex",
//     alignItems: "center",
//     gap: 6,
//     color: "#64748b",
//     fontSize: 14,
//     fontWeight: 600,
//   },

//   badgeIcon: {
//     fontSize: 13,
//   },

//   cardBody: {
//     flex: 1,
//     marginBottom: 20,
//   },

//   courseTitle: {
//     fontSize: 22,
//     fontWeight: 700,
//     color: "#0f172a",
//     marginBottom: 12,
//     lineHeight: 1.4,
//   },

//   courseDescription: {
//     color: "#64748b",
//     fontSize: 15,
//     lineHeight: 1.7,
//     marginBottom: 12,
//   },

//   dateInfo: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//     color: "#64748b",
//     fontSize: 14,
//     fontWeight: 500,
//     marginTop: 12,
//   },

//   dateIcon: {
//     fontSize: 13,
//     color: "#94a3b8",
//   },

//   buttonGroup: {
//     display: "flex",
//     gap: 10,
//   },

//   viewButton: {
//     padding: "14px 20px",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     cursor: "pointer",
//     flex: 1
//   },

//   paymentButton: {
//     padding: "14px 20px",
//     background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: 12,
//     fontWeight: 700,
//     fontSize: 15,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     transition: "all 0.3s ease",
//     boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
//     cursor: "pointer",
//     flex: 1
//   },

//   buttonArrow: {
//     fontSize: 14,
//     transition: "transform 0.3s ease",
//   },

//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//     padding: "20px",
//   },

//   modalContent: {
//     background: "#fff",
//     borderRadius: "20px",
//     boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
//     width: "100%",
//     maxWidth: "500px",
//     overflow: "hidden",
//   },

//   modalHeader: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "24px",
//     borderBottom: "1px solid #e2e8f0",
//   },

//   modalTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: "700",
//     color: "#0f172a",
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },

//   modalClose: {
//     background: "transparent",
//     border: "none",
//     fontSize: "24px",
//     cursor: "pointer",
//     color: "#64748b",
//     padding: "0",
//     width: "32px",
//     height: "32px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: "6px",
//   },

//   modalBody: {
//     padding: "24px",
//   },

//   courseInfo: {
//     marginBottom: "24px",
//   },

//   priceDisplay: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: "16px",
//     background: "rgba(61, 26, 91, 0.05)",
//     borderRadius: "12px",
//     border: "1px solid rgba(61, 26, 91, 0.1)",
//   },

//   noteBox: {
//     background: "rgba(241, 213, 114, 0.1)",
//     padding: "12px",
//     borderRadius: "8px",
//     marginTop: "20px",
//     border: "1px solid rgba(166, 138, 70, 0.2)",
//   },

//   paymentMethods: {
//     marginTop: "24px",
//   },

//   methodGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(2, 1fr)",
//     gap: "12px",
//   },

//   paymentMethodBtn: {
//     background: "#fff",
//     border: "2px solid #e2e8f0",
//     borderRadius: "12px",
//     padding: "16px",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   modalFooter: {
//     padding: "24px",
//     borderTop: "1px solid #e2e8f0",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   cancelButton: {
//     background: "#64748b",
//     color: "#fff",
//     border: "none",
//     padding: "10px 20px",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
// };

// const statusBadgeStyle = (status) => ({
//   background: status.bg,
//   color: status.color,
//   padding: "8px 16px",
//   borderRadius: 20,
//   fontSize: 13,
//   fontWeight: 700,
//   display: "flex",
//   alignItems: "center",
//   gap: 6,
//   textTransform: "uppercase",
//   letterSpacing: 0.5,
// });

// export default StudentCoursesPage;