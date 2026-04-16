import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import { getExamById, getQuestionsByExam, submitAttempt, getExamStatus } from "../api/api";
import { 
  FaClock, 
  FaExclamationCircle, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRedoAlt,
  FaArrowLeft,
  FaQuestionCircle
} from "react-icons/fa";

// Using the same color theme from previous components
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

const StudentExamAttemptPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const isSubmitting = useRef(false);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStudentId = () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) return null;
      const user = JSON.parse(userInfo);
      return user?._id || user?.user?._id || user?.id || user?.userId || null;
    } catch (err) {
      console.error("Error parsing userInfo:", err);
      return null;
    }
  };

  const studentId = getStudentId();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [examStatus, setExamStatus] = useState(null);

  // Fetch Exam Status & Check if can attempt
  useEffect(() => {
    if (result) return;

    const checkExamStatus = async () => {
      if (!studentId) return;

      try {
        const statusData = await getExamStatus(studentId, examId);
        console.log("Exam status from API:", statusData.data);
        setExamStatus(statusData.data);

        // Check cooldown first
        if (statusData.data.cooldownInfo?.hasCooldown) {
          const hours = statusData.data.cooldownInfo.hoursRemaining;
          const nextTime = new Date(statusData.data.cooldownInfo.nextAttemptTime).toLocaleString();
          
          alert(`⏳ You must wait ${hours} hour(s) before attempting again.\nNext attempt available: ${nextTime}`);
          navigate("/student/exams");
          return;
        }

        // If cannot attempt, redirect back
        if (!statusData.data.canAttempt) {
          if (statusData.data.passed) {
            alert("You have already passed this exam!");
          } else {
            alert(`You have used all ${statusData.data.totalAttemptsAllowed} attempts for this exam.`);
          }
          navigate("/student/exams");
          return;
        }
      } catch (err) {
        console.error("Error checking exam status:", err);
      }
    };

    checkExamStatus();
  }, [studentId, examId, navigate, result]);

  // Fetch Exam & Questions
  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        setError("Unable to identify student. Please login again.");
        setLoading(false);
        return;
      }
      try {
        setError("");
        const examRes = await getExamById(examId);
        setExam(examRes.exam);

        if (examRes.exam?.duration) {
          setTimeLeft(examRes.exam.duration * 60);
        }

        const qs = await getQuestionsByExam(examId);
        setQuestions(qs || []);
        if (!qs || qs.length === 0) {
          setError("No questions available for this exam.");
        }
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("Failed to load exam. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [examId, studentId]);

  // Timer countdown with auto-submit
  useEffect(() => {
    if (result) return;

    if (timeLeft <= 0 && questions.length > 0 && !isSubmitting.current) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questions, result]);

  const handleAnswerChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  const formatTime = sec => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getAnsweredCount = () => Object.keys(answers).filter(k => answers[k]).length;

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!studentId) {
      alert("Unable to identify student. Please login again.");
      navigate("/login");
      return;
    }

    if (!questions.length) {
      alert("No questions to submit.");
      return;
    }

    if (isSubmitting.current) return;

    if (!isAutoSubmit) {
      const unanswered = questions.filter(q => !answers[q._id]);
      if (unanswered.length > 0) {
        const proceed = window.confirm(
          `You have ${unanswered.length} unanswered question(s). Submit anyway?`
        );
        if (!proceed) return;
      }
    }

    const answersArray = questions.map(q => ({
      questionId: q._id,
      selectedOption: answers[q._id] || null,
    }));

    isSubmitting.current = true;

    try {
      // Submit attempt
      const res = await submitAttempt({
        userId: studentId,
        examId,
        answers: answersArray,
      });

      console.log("Submit response from backend:", res.data);

      const resultData = res.data;

      setResult({
        score: resultData.score,
        totalMarks: resultData.totalMarks,
        passingMarks: resultData.passingMarks,
        passed: resultData.passed,
        status: resultData.status,
        attemptNumber: resultData.attemptNumber,
        attemptsLeft: resultData.attemptsLeft,
        totalAttemptsAllowed: resultData.totalAttemptsAllowed,
        cooldownInfo: resultData.cooldownInfo
      });

      setTimeLeft(0);
      
      // Also update exam status after submission
      const updatedStatus = await getExamStatus(studentId, examId);
      setExamStatus(updatedStatus.data);
      
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
      
      // Handle cooldown error specifically
      if (err.response?.data?.cooldownInfo?.hasCooldown) {
        const hours = err.response.data.cooldownInfo.hoursRemaining;
        const nextTime = new Date(err.response.data.cooldownInfo.nextAttemptTime).toLocaleString();
        alert(`⏳ Cooldown Active: You must wait ${hours} hour(s) before attempting again.\nNext attempt available: ${nextTime}`);
        navigate("/student/exams");
      } else {
        alert(err.response?.data?.message || "Failed to submit exam.");
      }
      
      isSubmitting.current = false;
    }
  };

  const handleRetry = () => {
    // Check if cooldown is active
    if (result?.cooldownInfo?.hasCooldown) {
      const hours = result.cooldownInfo.hoursRemaining;
      const nextTime = new Date(result.cooldownInfo.nextAttemptTime).toLocaleString();
      alert(`⏳ Please wait ${hours} hour(s) before retrying.\nNext attempt available: ${nextTime}`);
      navigate("/student/exams");
      return;
    }
    
    setAnswers({});
    setTimeLeft(exam.duration * 60);
    setResult(null);
    isSubmitting.current = false;
  };

  const QuestionCard = ({ q, idx }) => {
    const selected = answers[q._id];
    const isDisabled = !!result;

    return (
      <div
        style={{
          background: COLORS.white,
          padding: isMobile ? "20px" : "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: `2px solid ${selected ? COLORS.brightGreen : COLORS.lightGray}`,
          marginBottom: isMobile ? "16px" : "20px",
          opacity: isDisabled ? 0.8 : 1,
          transition: "all 0.2s ease"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: isMobile ? "12px" : "16px"
        }}>
          <div style={{
            width: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            borderRadius: "8px",
            background: COLORS.purpleLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "700",
            color: COLORS.deepPurple,
            flexShrink: 0
          }}>
            {idx + 1}
          </div>
          <h3 style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            color: COLORS.deepPurple,
            margin: 0,
            flex: 1,
            lineHeight: 1.4
          }}>
            {q.questionText}
          </h3>
        </div>
        
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: isMobile ? "10px" : "12px" 
        }}>
          {q.options.map((opt, i) => (
            <label
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "14px 16px" : "16px 20px",
                background: selected === opt ? COLORS.blueLight : COLORS.bgGray,
                borderRadius: "12px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                border: `2px solid ${selected === opt ? COLORS.info : COLORS.lightGray}`,
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={e => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                }
              }}
              onMouseLeave={e => {
                if (!isDisabled) {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              <input
                type="radio"
                name={`question_${q._id}`}
                value={opt}
                checked={selected === opt}
                onChange={() => handleAnswerChange(q._id, opt)}
                disabled={isDisabled}
                style={{
                  marginRight: "12px",
                  width: isMobile ? "18px" : "20px",
                  height: isMobile ? "18px" : "20px",
                  cursor: isDisabled ? "not-allowed" : "pointer"
                }}
              />
              <span style={{
                fontWeight: selected === opt ? "600" : "400",
                fontSize: isMobile ? "14px" : "15px",
                color: selected === opt ? COLORS.info : COLORS.textGray,
                flex: 1
              }}>
                {opt}
              </span>
              
              {/* Option letter badge */}
              <div style={{
                position: "absolute",
                right: "16px",
                width: isMobile ? "24px" : "28px",
                height: isMobile ? "24px" : "28px",
                borderRadius: "6px",
                background: selected === opt ? COLORS.info : COLORS.lightGray,
                color: selected === opt ? COLORS.white : COLORS.darkGray,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "12px" : "13px",
                fontWeight: "600"
              }}>
                {String.fromCharCode(65 + i)}
              </div>
            </label>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bgGray }}>
        <StudentSidebar />
        <div style={{ 
          flex: 1, 
          marginLeft: isMobile ? "0" : (isTablet ? "80px" : "280px"),
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: isMobile ? "20px" : "32px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "60px",
              height: "60px",
              border: `4px solid ${COLORS.lightGray}`,
              borderTopColor: COLORS.deepPurple,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }} />
            <p style={{ 
              fontSize: isMobile ? "16px" : "18px", 
              color: COLORS.deepPurple, 
              fontWeight: "600" 
            }}>
              Loading exam...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bgGray }}>
        <StudentSidebar />
        <div style={{ 
          flex: 1, 
          marginLeft: isMobile ? "0" : (isTablet ? "80px" : "280px"),
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: isMobile ? "20px" : "32px"
        }}>
          <div style={{ 
            textAlign: "center",
            background: COLORS.white,
            padding: isMobile ? "32px 24px" : "48px 32px",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "100%"
          }}>
            <FaExclamationCircle size={isMobile ? 48 : 64} color={COLORS.danger} />
            <h2 style={{ 
              marginTop: "20px", 
              color: COLORS.deepPurple,
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700"
            }}>
              Exam not found
            </h2>
            <p style={{
              color: COLORS.textGray,
              marginTop: "8px",
              fontSize: isMobile ? "14px" : "16px"
            }}>
              The exam you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/student/exams")}
              style={{
                marginTop: "24px",
                padding: isMobile ? "14px 28px" : "16px 32px",
                background: COLORS.deepPurple,
                color: COLORS.white,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: isMobile ? "15px" : "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                margin: "0 auto",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = COLORS.headerPurple}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.deepPurple}
            >
              <FaArrowLeft size={isMobile ? 14 : 16} />
              Back to Exams
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
        padding: isMobile ? "16px" : (isTablet ? "24px" : "32px"),
        transition: "all 0.3s ease",
        maxWidth: "100%",
        overflowX: "hidden"
      }}>
        
        {/* Mobile Header */}
        {isMobile && !result && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: COLORS.white,
            padding: "16px",
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              <h1 style={{ 
                fontSize: "18px", 
                fontWeight: "700", 
                color: COLORS.deepPurple,
                margin: 0,
                lineHeight: 1.2
              }}>
                {exam.title}
              </h1>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px"
              }}>
                <div style={{
                  padding: "4px 10px",
                  background: timeLeft < 300 ? `${COLORS.danger}15` : `${COLORS.info}15`,
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "700",
                  color: timeLeft < 300 ? COLORS.danger : COLORS.info,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <FaClock size={12} /> {formatTime(timeLeft)}
                </div>
                <div style={{
                  fontSize: "12px",
                  color: COLORS.textGray
                }}>
                  {getAnsweredCount()}/{questions.length}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/student/exams")}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "20px",
                color: COLORS.darkGray,
                cursor: "pointer",
                padding: "8px"
              }}
            >
              <FaArrowLeft />
            </button>
          </div>
        )}

        {/* Main Content Area - Adjusted for mobile header */}
        <div style={{ 
          marginTop: isMobile && !result ? "80px" : "0",
          marginBottom: isMobile ? "80px" : "0"
        }}>
          {/* Result Display */}
          {result && (
            <div style={{
              background: result.passed 
                ? `linear-gradient(135deg, ${COLORS.greenLight} 0%, rgba(0, 217, 163, 0.1) 100%)`
                : `linear-gradient(135deg, #fee2e2 0%, rgba(239, 68, 68, 0.1) 100%)`,
              border: `2px solid ${result.passed ? COLORS.brightGreen : COLORS.danger}`,
              borderRadius: "20px",
              padding: isMobile ? "24px" : "32px",
              marginBottom: isMobile ? "20px" : "24px",
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}>
              <div style={{
                fontSize: isMobile ? "64px" : "80px",
                marginBottom: "20px",
                color: result.passed ? COLORS.brightGreen : COLORS.danger
              }}>
                {result.passed ? <FaCheckCircle /> : <FaTimesCircle />}
              </div>
              
              <h2 style={{
                fontSize: isMobile ? "22px" : "28px",
                fontWeight: "700",
                color: result.passed ? "#065f46" : COLORS.danger,
                marginBottom: "12px"
              }}>
                {result.passed ? "🎉 Congratulations! You Passed!" : "✋ You Did Not Pass"}
              </h2>
              
              <div style={{ 
                fontSize: isMobile ? "20px" : "24px", 
                fontWeight: "600", 
                marginBottom: "20px" 
              }}>
                <span style={{ 
                  color: result.passed ? COLORS.teal : COLORS.danger 
                }}>
                  Your Score: {result.score} / {result.totalMarks}
                </span>
              </div>
              
              <div style={{ 
                fontSize: isMobile ? "15px" : "16px", 
                color: COLORS.textGray, 
                marginBottom: "12px",
                background: COLORS.white,
                padding: "12px 20px",
                borderRadius: "10px",
                display: "inline-block",
                fontWeight: "600"
              }}>
                Passing Marks: {result.passingMarks}
              </div>

              {/* Cooldown Warning for Failed Attempts */}
              {!result.passed && result.cooldownInfo?.hasCooldown && (
                <div style={{
                  background: COLORS.yellowLight,
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  border: `1px solid ${COLORS.warning}`,
                  textAlign: "left"
                }}>
                  <div style={{ 
                    fontSize: "16px", 
                    fontWeight: "700", 
                    color: "#92400e",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    ⏳ Cooldown Active
                  </div>
                  <div style={{ 
                    fontSize: "14px", 
                    color: "#92400e",
                    marginBottom: "4px"
                  }}>
                    You must wait 24 hours before attempting again.
                  </div>
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#92400e",
                    fontStyle: "italic"
                  }}>
                    Next attempt: {new Date(result.cooldownInfo.nextAttemptTime).toLocaleString()}
                  </div>
                </div>
              )}

              {/* Attempts Info */}
              <div style={{
                background: COLORS.white,
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "24px",
                display: "inline-block",
                minWidth: isMobile ? "100%" : "300px"
              }}>
                <div style={{ 
                  fontSize: "14px", 
                  color: COLORS.darkGray, 
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  Attempt {result.attemptNumber} of {result.totalAttemptsAllowed}
                </div>
                {!result.passed && result.attemptsLeft > 0 && !result.cooldownInfo?.hasCooldown && (
                  <div style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: COLORS.warning,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}>
                    <FaRedoAlt />
                    {result.attemptsLeft} attempt(s) remaining
                  </div>
                )}
                {!result.passed && result.attemptsLeft === 0 && (
                  <div style={{ 
                    fontSize: "16px", 
                    fontWeight: "700", 
                    color: COLORS.danger 
                  }}>
                    No attempts remaining
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: "12px", 
                justifyContent: "center",
                width: "100%"
              }}>
                <button
                  onClick={() => navigate("/student/exams")}
                  style={{
                    padding: isMobile ? "16px 24px" : "16px 32px",
                    background: COLORS.deepPurple,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: "12px",
                    fontSize: isMobile ? "15px" : "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    flex: isMobile ? "1" : "none",
                    minWidth: isMobile ? "100%" : "180px",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = COLORS.headerPurple;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = COLORS.deepPurple;
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <FaArrowLeft size={isMobile ? 14 : 16} />
                  Back to Exams
                </button>

                {!result.passed && result.attemptsLeft > 0 && !result.cooldownInfo?.hasCooldown && (
                  <button
                    onClick={handleRetry}
                    style={{
                      padding: isMobile ? "16px 24px" : "16px 32px",
                      background: COLORS.warning,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "12px",
                      fontSize: isMobile ? "15px" : "16px",
                      fontWeight: "700",
                      cursor: "pointer",
                      flex: isMobile ? "1" : "none",
                      minWidth: isMobile ? "100%" : "180px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#D97706";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = COLORS.warning;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <FaRedoAlt size={isMobile ? 14 : 16} /> 
                    Retry Exam
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Exam Header - Desktop/Tablet */}
          {!result && !isMobile && (
            <div style={{
              background: COLORS.white,
              padding: isTablet ? "24px" : "32px",
              borderRadius: "20px",
              marginBottom: isMobile ? "20px" : "24px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "16px"
              }}>
                <div style={{ flex: 1, minWidth: "300px" }}>
                  <h1 style={{ 
                    fontSize: isTablet ? "22px" : "24px", 
                    fontWeight: "700", 
                    marginBottom: "8px",
                    color: COLORS.deepPurple
                  }}>
                    {exam.title}
                  </h1>
                  <p style={{ 
                    color: COLORS.textGray, 
                    fontSize: isTablet ? "14px" : "15px",
                    lineHeight: 1.5 
                  }}>
                    {exam.description}
                  </p>

                  {/* Show attempt number */}
                  {examStatus && (
                    <div style={{
                      marginTop: "12px",
                      padding: "8px 16px",
                      background: COLORS.yellowLight,
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: COLORS.warning,
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <FaQuestionCircle size={14} />
                      Attempt {examStatus.attemptsUsed + 1} of {examStatus.totalAttemptsAllowed || 3}
                    </div>
                  )}
                </div>
                
                {/* Timer - Desktop */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "16px 24px",
                  background: timeLeft < 300 
                    ? `${COLORS.danger}15` 
                    : `${COLORS.info}15`,
                  borderRadius: "12px",
                  fontSize: isTablet ? "20px" : "24px",
                  fontWeight: "700",
                  color: timeLeft < 300 ? COLORS.danger : COLORS.info,
                  border: `2px solid ${timeLeft < 300 ? COLORS.danger : COLORS.info}30`
                }}>
                  <FaClock size={isTablet ? 20 : 24} /> 
                  {formatTime(timeLeft)}
                </div>
              </div>

              {/* Exam Stats */}
              <div style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "12px",
                background: COLORS.bgGray,
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
                gap: isMobile ? "16px" : "24px"
              }}>
                <div>
                  <div style={{ fontSize: "13px", color: COLORS.darkGray, marginBottom: "6px" }}>
                    Total Marks
                  </div>
                  <div style={{ 
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: COLORS.deepPurple,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: COLORS.purpleLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.indigo
                    }}>
                      📝
                    </div>
                    {exam.totalMarks}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: "13px", color: COLORS.darkGray, marginBottom: "6px" }}>
                    Passing Marks
                  </div>
                  <div style={{ 
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: COLORS.deepPurple,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: COLORS.greenLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.teal
                    }}>
                      🎯
                    </div>
                    {exam.passingMarks}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: "13px", color: COLORS.darkGray, marginBottom: "6px" }}>
                    Duration
                  </div>
                  <div style={{ 
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: COLORS.deepPurple,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: COLORS.yellowLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.warning
                    }}>
                      <FaClock size={18} />
                    </div>
                    {exam.duration} min
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: "13px", color: COLORS.darkGray, marginBottom: "6px" }}>
                    Answered
                  </div>
                  <div style={{ 
                    fontSize: "20px", 
                    fontWeight: "700", 
                    color: COLORS.deepPurple,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      background: COLORS.blueLight,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.info
                    }}>
                      ✓
                    </div>
                    {getAnsweredCount()}/{questions.length}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ 
                marginTop: "24px", 
                padding: "16px", 
                background: COLORS.white, 
                borderRadius: "12px",
                border: `2px solid ${COLORS.lightGray}`
              }}>
                <div style={{ 
                  fontSize: "14px", 
                  color: COLORS.darkGray, 
                  marginBottom: "8px",
                  fontWeight: "600" 
                }}>
                  Progress: {getAnsweredCount()} of {questions.length} questions answered
                </div>
                <div style={{ 
                  width: "100%", 
                  height: "12px", 
                  background: COLORS.lightGray, 
                  borderRadius: "6px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(getAnsweredCount() / questions.length) * 100}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${COLORS.brightGreen} 0%, ${COLORS.teal} 100%)`,
                    borderRadius: "6px",
                    transition: "width 0.5s ease"
                  }} />
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: COLORS.darkGray,
                  marginTop: "6px"
                }}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Progress Card */}
          {!result && isMobile && (
            <div style={{
              background: COLORS.white,
              padding: "20px",
              borderRadius: "16px",
              marginBottom: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <div>
                  <div style={{ 
                    fontSize: "13px", 
                    color: COLORS.darkGray,
                    fontWeight: "600"
                  }}>
                    Answered Questions
                  </div>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    color: COLORS.deepPurple 
                  }}>
                    {getAnsweredCount()} / {questions.length}
                  </div>
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: "13px", 
                    color: COLORS.darkGray,
                    fontWeight: "600",
                    textAlign: "right"
                  }}>
                    Time Remaining
                  </div>
                  <div style={{ 
                    fontSize: "18px", 
                    fontWeight: "700", 
                    color: timeLeft < 300 ? COLORS.danger : COLORS.info 
                  }}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
              
              <div style={{ 
                width: "100%", 
                height: "8px", 
                background: COLORS.lightGray, 
                borderRadius: "4px" 
              }}>
                <div style={{
                  width: `${(getAnsweredCount() / questions.length) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${COLORS.brightGreen} 0%, ${COLORS.teal} 100%)`,
                  borderRadius: "4px"
                }} />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div style={{
              background: `${COLORS.danger}15`,
              color: COLORS.danger,
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: `1px solid ${COLORS.danger}30`,
              fontSize: "15px",
              fontWeight: "600"
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Questions List */}
          {questions.length > 0 ? (
            <>
              {questions.map((q, idx) => <QuestionCard key={q._id} q={q} idx={idx} />)}

              {/* Submit Button - Fixed on Mobile */}
              {!result && (
                <div style={{
                  position: isMobile ? "fixed" : "static",
                  bottom: isMobile ? "0" : "auto",
                  left: isMobile ? "0" : "auto",
                  right: isMobile ? "0" : "auto",
                  background: isMobile ? COLORS.white : "transparent",
                  padding: isMobile ? "16px" : "24px 0",
                  boxShadow: isMobile ? "0 -2px 10px rgba(0,0,0,0.1)" : "none",
                  zIndex: isMobile ? 1000 : 1,
                  textAlign: "center"
                }}>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting.current}
                    style={{
                      padding: isMobile ? "18px 32px" : "20px 48px",
                      background: isSubmitting.current 
                        ? COLORS.darkGray 
                        : `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "12px",
                      fontSize: isMobile ? "16px" : "18px",
                      fontWeight: "700",
                      cursor: isSubmitting.current ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      width: isMobile ? "100%" : "auto",
                      minWidth: isMobile ? "auto" : "300px",
                      boxShadow: "0 4px 20px rgba(61, 26, 91, 0.3)"
                    }}
                    onMouseEnter={e => {
                      if (!isSubmitting.current) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(61, 26, 91, 0.4)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSubmitting.current) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(61, 26, 91, 0.3)";
                      }
                    }}
                  >
                    {isSubmitting.current ? "⏳ Submitting..." : "🚀 Submit Exam"}
                  </button>
                  
                  {!isMobile && (
                    <p style={{
                      marginTop: "12px",
                      color: COLORS.textGray,
                      fontSize: "14px"
                    }}>
                      You have answered {getAnsweredCount()} of {questions.length} questions
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={{
              background: COLORS.white,
              padding: isMobile ? "40px 24px" : "60px 40px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <FaExclamationCircle 
                size={isMobile ? 48 : 64} 
                color={COLORS.darkGray} 
                style={{ marginBottom: "20px", opacity: 0.5 }} 
              />
              <h3 style={{ 
                color: COLORS.deepPurple, 
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                No questions available
              </h3>
              <p style={{ 
                color: COLORS.textGray, 
                fontSize: isMobile ? "14px" : "16px",
                maxWidth: "400px", 
                margin: "0 auto" 
              }}>
                This exam doesn't have any questions yet. Please contact your instructor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default StudentExamAttemptPage;