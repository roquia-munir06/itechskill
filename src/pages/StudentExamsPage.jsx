
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { getAllExams, getAttemptsByUser, checkExamAccess } from "../api/api";
import { 
  FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle,
  FaSearch, FaFilter, FaLock
} from "react-icons/fa";

const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple: "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge: "#D4A745",
  roleBg: "#E8DFF5",
  white: "#FFFFFF",
  bgGray: "#F9FAFB",
  lightGray: "#F3F4F6",
  darkGray: "#6B7280",
  textGray: "#4B5563",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  orange: "#F97316",
  primaryButton: "#3D1A5B",
  formButton: "#3B82F6",
  cancelButton: "#6B7280",
  blueLight: "#dbeafe",
  greenLight: "#d1fae5",
  yellowLight: "#fef3c7",
  purpleLight: "#ede9fe",
  teal: "#0d9488",
  indigo: "#4f46e5",
  rose: "#f43f5e"
};

const StudentExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Get student info from localStorage
  const getStudentInfo = () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return { id: null, email: null };
      const user = JSON.parse(userInfo);
      return {
        id: user?.id || user?._id || user?.user?._id || user?.userId || null,
        email: user?.email || user?.user?.email || null,
      };
    } catch (err) {
      return { id: null, email: null };
    }
  };

  const { id: studentId, email: studentEmail } = getStudentInfo();

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId || !studentEmail) {
        setError("Unable to identify student. Please login again.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const examsData = await getAllExams();
        const attemptsData = await getAttemptsByUser(studentId);

        const allExams = examsData.exams || examsData || [];
        const allAttempts = attemptsData.attempts || attemptsData || [];

        // ✅ Filter exams by access control
        const accessChecks = await Promise.all(
          allExams.map(async (exam) => {
            // Public exams are always accessible
            if (exam.accessType === "public" || !exam.accessType) return true;
            // Check if student email is in allowedEmails
            try {
              const result = await checkExamAccess(exam._id, studentEmail);
              return result.hasAccess;
            } catch {
              return false;
            }
          })
        );

        const accessibleExams = allExams.filter((_, index) => accessChecks[index]);

        setExams(accessibleExams);
        setAttempts(allAttempts);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load exams. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId, studentEmail]);

  const getAttempt = (exam) => {
    return attempts.find(a => {
      const attemptExamId = a.exam?._id || a.exam;
      return attemptExamId === exam._id;
    });
  };

  const getExamStatus = (exam) => {
    const attempt = getAttempt(exam);
    if (!attempt) return "Pending";
    if (attempt.passed !== undefined) return attempt.passed ? "PASS" : "FAIL";
    const passingMarks = exam.passingMarks !== undefined && exam.passingMarks !== null
      ? Math.min(exam.passingMarks, exam.totalMarks || 0)
      : Math.ceil((exam.totalMarks || 0) * 0.5);
    return attempt.score >= passingMarks ? "PASS" : "FAIL";
  };

  const getAttemptScore = (exam) => getAttempt(exam)?.score ?? null;

  const statusColors = {
    Pending: COLORS.warning,
    PASS: COLORS.brightGreen,
    FAIL: COLORS.danger,
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch =
      exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getExamStatus(exam);
    const matchesFilter = filterStatus === "all" || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ Exam Card Component
  const ExamCard = ({ exam }) => {
    const status = getExamStatus(exam);
    const score = getAttemptScore(exam);
    const statusColor = statusColors[status];
    const attempt = getAttempt(exam);

    const [cooldownInfo, setCooldownInfo] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
      if (attempt && !attempt.passed) {
        const lastAttemptTime = new Date(attempt.submittedAt || attempt.createdAt);
        const now = new Date();
        const hoursSinceLastAttempt = (now - lastAttemptTime) / (1000 * 60 * 60);
        if (hoursSinceLastAttempt < 24) {
          const hoursRemaining = 24 - hoursSinceLastAttempt;
          setCooldownInfo({ hoursRemaining: Math.ceil(hoursRemaining) });
          setTimeLeft(Math.ceil(hoursRemaining * 60 * 60));
        }
      }
    }, [attempt]);

    useEffect(() => {
      if (!timeLeft || timeLeft <= 0) { setCooldownInfo(null); return; }
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timer); setCooldownInfo(null); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, [timeLeft]);

    const formatCooldownTime = (seconds) => {
      if (!seconds) return "00:00:00";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const passingMarks = exam.passingMarks !== undefined && exam.passingMarks !== null
      ? Math.min(exam.passingMarks, exam.totalMarks || 0)
      : Math.ceil((exam.totalMarks || 0) * 0.5);

    const isRestricted = exam.accessType === "restricted";

    return (
      <div style={{
        background: COLORS.white, borderRadius: "16px",
        padding: isMobile ? "20px" : "24px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        border: `2px solid ${status !== "Pending" ? statusColor : COLORS.lightGray}`,
        position: "relative", transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: cooldownInfo ? "not-allowed" : "pointer",
        opacity: cooldownInfo ? 0.8 : 1,
        display: "flex", flexDirection: "column", height: "100%"
      }}
        onMouseEnter={e => {
          if (!cooldownInfo) {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15)";
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
        }}
      >
        {/* Status Badge */}
        <div style={{
          position: "absolute", top: isMobile ? "16px" : "20px", right: isMobile ? "16px" : "20px",
          background: `${statusColor}20`, color: statusColor,
          padding: "8px 16px", borderRadius: "20px",
          fontSize: isMobile ? "12px" : "14px", fontWeight: "700",
          display: "flex", alignItems: "center", gap: "6px",
          border: `1px solid ${statusColor}40`
        }}>
          {status === "PASS" && <FaCheckCircle size={14} />}
          {status === "FAIL" && <FaTimesCircle size={14} />}
          {status}
        </div>

        {/* ✅ Restricted Badge */}
        {isRestricted && (
          <div style={{
            position: "absolute", top: isMobile ? "50px" : "56px", right: isMobile ? "16px" : "20px",
            background: COLORS.purpleLight, color: COLORS.deepPurple,
            padding: "4px 10px", borderRadius: "12px",
            fontSize: "11px", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "4px"
          }}>
            <FaLock size={9} /> Restricted
          </div>
        )}

        {/* Cooldown Timer */}
        {cooldownInfo && (
          <div style={{
            position: "absolute",
            top: isRestricted ? (isMobile ? "84px" : "90px") : (isMobile ? "50px" : "60px"),
            right: isMobile ? "16px" : "20px",
            background: COLORS.warning, color: COLORS.white,
            padding: "6px 12px", borderRadius: "12px",
            fontSize: isMobile ? "11px" : "12px", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "5px", zIndex: 2
          }}>
            ⏳ {formatCooldownTime(timeLeft)}
          </div>
        )}

        {/* Title */}
        <h3 style={{
          fontSize: isMobile ? "18px" : "20px", fontWeight: "700",
          color: COLORS.deepPurple, marginBottom: "12px",
          marginTop: isMobile ? "8px" : "0", paddingRight: "120px", lineHeight: 1.3
        }}>
          {exam.title}
        </h3>

        {/* Description */}
        <p style={{
          color: COLORS.textGray, fontSize: isMobile ? "14px" : "15px",
          marginBottom: "20px", lineHeight: 1.6, flex: 1
        }}>
          {exam.description || "No description available"}
        </p>

        {/* Exam Details Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: isMobile ? "12px" : "16px", marginBottom: "20px",
          padding: isMobile ? "16px" : "20px",
          background: COLORS.bgGray, borderRadius: "12px"
        }}>
          <div>
            <div style={{ fontSize: isMobile ? "12px" : "13px", color: COLORS.darkGray, marginBottom: "6px" }}>Duration</div>
            <div style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: COLORS.deepPurple, display: "flex", alignItems: "center", gap: "8px" }}>
              <FaClock size={isMobile ? 14 : 16} color={COLORS.warning} /> {exam.duration} min
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? "12px" : "13px", color: COLORS.darkGray, marginBottom: "6px" }}>Total Marks</div>
            <div style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: COLORS.deepPurple }}>
              {exam.totalMarks}
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? "12px" : "13px", color: COLORS.darkGray, marginBottom: "6px" }}>Passing Marks</div>
            <div style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "600", color: COLORS.deepPurple }}>
              {passingMarks}
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? "12px" : "13px", color: statusColor, marginBottom: "6px" }}>Your Score</div>
            <div style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: "700", color: statusColor }}>
              {score !== null ? `${score} / ${exam.totalMarks}` : `- / ${exam.totalMarks}`}
            </div>
          </div>
        </div>

        {/* Result Summary */}
        {status !== "Pending" && (
          <div style={{
            padding: "16px", borderRadius: "12px", marginBottom: "16px",
            background: status === "PASS" ? `${COLORS.brightGreen}15` : `${COLORS.danger}15`,
            border: `1px solid ${status === "PASS" ? COLORS.brightGreen : COLORS.danger}30`
          }}>
            <div style={{
              fontSize: isMobile ? "13px" : "14px",
              color: status === "PASS" ? "#065f46" : "#991b1b",
              fontWeight: "600", display: "flex", alignItems: "center", gap: "8px"
            }}>
              {status === "PASS" ? <FaCheckCircle size={16} /> : <FaTimesCircle size={16} />}
              {status === "PASS"
                ? `Congratulations! You passed with ${score}/${exam.totalMarks} marks`
                : `You scored ${score}/${exam.totalMarks}. Need ${passingMarks} to pass.`}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={status !== "Pending" || !!cooldownInfo}
          onClick={() => {
            if (cooldownInfo) {
              alert(`⏳ Please wait ${formatCooldownTime(timeLeft)} before attempting again.`);
              return;
            }
            if (status === "Pending") navigate(`/student/exams/${exam._id}`);
            else navigate(`/student/exams/${exam._id}/result`);
          }}
          style={{
            width: "100%", padding: isMobile ? "16px" : "18px",
            background: cooldownInfo ? COLORS.darkGray :
              (status === "Pending" ? COLORS.deepPurple : COLORS.darkGray),
            color: COLORS.white, border: "none", borderRadius: "12px",
            fontWeight: "700", fontSize: isMobile ? "15px" : "16px",
            cursor: cooldownInfo ? "not-allowed" : (status === "Pending" ? "pointer" : "default"),
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
          }}
          onMouseEnter={e => {
            if (status === "Pending" && !cooldownInfo) {
              e.currentTarget.style.background = COLORS.headerPurple;
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={e => {
            if (status === "Pending" && !cooldownInfo) {
              e.currentTarget.style.background = COLORS.deepPurple;
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          {cooldownInfo ? `⏳ Wait ${formatCooldownTime(timeLeft)}` :
            status === "Pending" ? "🚀 Start Exam" : "📊 View Details"}
        </button>

        {/* Cooldown Message */}
        {cooldownInfo && (
          <div style={{
            marginTop: "12px", padding: "12px",
            background: COLORS.yellowLight, borderRadius: "10px",
            fontSize: isMobile ? "12px" : "13px", color: COLORS.warning,
            textAlign: "center", border: `1px solid ${COLORS.warning}30`
          }}>
            ⏳ Next attempt available after {formatCooldownTime(timeLeft)}
          </div>
        )}
      </div>
    );
  };

  // ✅ Loading State
  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <StudentSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: COLORS.bgGray }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "60px", height: "60px",
              border: `4px solid ${COLORS.lightGray}`,
              borderTopColor: COLORS.deepPurple,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }} />
            <p style={{ fontSize: "16px", color: COLORS.deepPurple, fontWeight: "600" }}>
              Loading your exams...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Auth Error State
  if (!studentId) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <StudentSidebar />
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: COLORS.bgGray }}>
          <div style={{
            textAlign: "center", background: COLORS.white,
            padding: "40px", borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            maxWidth: "500px", width: "90%"
          }}>
            <h2 style={{ color: COLORS.danger, marginBottom: "16px" }}>Authentication Error</h2>
            <p style={{ color: COLORS.textGray, marginBottom: "24px", lineHeight: 1.6 }}>
              {error || "Please login again to access exams"}
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "16px 32px", background: COLORS.deepPurple,
                color: COLORS.white, border: "none", borderRadius: "12px",
                cursor: "pointer", fontSize: "16px", fontWeight: "700"
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bgGray }}>
      <StudentSidebar />

      <div style={{
        flex: 1,
        marginLeft: isMobile ? "0" : (isTablet ? "80px" : "280px"),
        padding: isMobile ? "20px 16px" : (isTablet ? "32px 24px" : "40px"),
        transition: "all 0.3s ease"
      }}>
        {/* Header */}
        <div style={{
          marginBottom: isMobile ? "24px" : "32px",
          background: COLORS.white, padding: isMobile ? "20px" : "24px",
          borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
        }}>
          <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, marginBottom: "8px" }}>
            📝 Mock Exams
          </h1>
          <p style={{ color: COLORS.textGray, fontSize: isMobile ? "14px" : "16px", lineHeight: 1.5, margin: 0 }}>
            Test your knowledge and track your progress. Each exam can be attempted once every 24 hours if failed.
          </p>

          {/* ✅ Stats Overview */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: isMobile ? "12px" : "16px", marginTop: "24px"
          }}>
            {[
              { label: "Total Exams", value: exams.length, color: COLORS.info, bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
              { label: "Passed", value: exams.filter(e => getExamStatus(e) === "PASS").length, color: COLORS.brightGreen, bg: "rgba(0,217,163,0.1)", border: "rgba(0,217,163,0.2)" },
              { label: "Failed", value: exams.filter(e => getExamStatus(e) === "FAIL").length, color: COLORS.danger, bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
              { label: "Pending", value: exams.filter(e => getExamStatus(e) === "Pending").length, color: COLORS.warning, bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label} style={{ background: bg, padding: "16px", borderRadius: "12px", border: `1px solid ${border}` }}>
                <div style={{ fontSize: isMobile ? "12px" : "14px", color, fontWeight: "600" }}>{label}</div>
                <div style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "12px" : "16px", marginBottom: "24px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <FaSearch style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" }} />
            <input
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "16px 16px 16px 52px",
                borderRadius: "12px", border: `2px solid ${COLORS.lightGray}`,
                fontSize: "15px", background: COLORS.white,
                boxSizing: "border-box", outline: "none"
              }}
              onFocus={e => e.target.style.borderColor = COLORS.deepPurple}
              onBlur={e => e.target.style.borderColor = COLORS.lightGray}
            />
          </div>

          <div style={{
            display: "flex", gap: "8px", background: COLORS.white,
            padding: "8px", borderRadius: "12px",
            border: `2px solid ${COLORS.lightGray}`,
            minWidth: isMobile ? "100%" : "280px"
          }}>
            <FaFilter style={{ color: COLORS.deepPurple, fontSize: "18px", margin: "8px" }} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: COLORS.deepPurple, fontWeight: "600", background: "transparent", cursor: "pointer" }}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="PASS">Passed</option>
              <option value="FAIL">Failed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: `${COLORS.danger}15`, color: COLORS.danger,
            padding: "20px", borderRadius: "12px", marginBottom: "24px",
            border: `1px solid ${COLORS.danger}30`, fontSize: "15px"
          }}>
            {error}
          </div>
        )}

        {/* ✅ No Access Message */}
        {!loading && exams.length === 0 && !error && (
          <div style={{
            textAlign: "center", background: COLORS.white,
            padding: "60px 40px", borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <FaLock size={64} color={COLORS.darkGray} style={{ marginBottom: "20px", opacity: 0.4 }} />
            <h3 style={{ color: COLORS.deepPurple, fontSize: "20px", marginBottom: "12px", fontWeight: "700" }}>
              No Exams Available
            </h3>
            <p style={{ color: COLORS.textGray, fontSize: "16px", maxWidth: "400px", margin: "0 auto", lineHeight: 1.6 }}>
              You don't have access to any exams yet. Please contact your instructor to get access.
            </p>
          </div>
        )}

        {/* Exams Grid */}
        {exams.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(auto-fill, minmax(320px, 1fr))" : "repeat(auto-fill, minmax(360px, 1fr))",
            gap: isMobile ? "20px" : "24px"
          }}>
            {filteredExams.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1", textAlign: "center",
                background: COLORS.white, padding: "60px 40px",
                borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
              }}>
                <FaClipboardList size={64} color={COLORS.darkGray} style={{ marginBottom: "20px", opacity: 0.5 }} />
                <h3 style={{ color: COLORS.deepPurple, fontSize: "20px", marginBottom: "12px", fontWeight: "700" }}>
                  No matching exams found
                </h3>
                <p style={{ color: COLORS.textGray, fontSize: "16px", maxWidth: "400px", margin: "0 auto" }}>
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              filteredExams.map(exam => <ExamCard key={exam._id} exam={exam} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExamsPage;