import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllExamResults } from "../api/api";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaUser, 
  FaEnvelope, 
  FaBook, 
  FaSearch, 
  FaChartLine, 
  FaExclamationTriangle,
  FaGraduationCap,
  FaUsers,
  FaMoneyBillWave,
  FaFilter,
  FaSort,
  FaArrowRight,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

// Exact Color Theme from Courses Page
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
  rose: "#f43f5e",
  passGreen: "#10b981",
  failRed: "#ef4444"
};

// Statistics Card Component matching Courses page
const StatCard = ({ icon, title, value, color, bgColor, isMobile }) => (
  <div style={{
    background: COLORS.white,
    padding: isMobile ? "16px" : "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "15px",
    flex: 1,
    minWidth: isMobile ? "140px" : "200px",
  }}>
    <div style={{
      width: isMobile ? "40px" : "50px",
      height: isMobile ? "40px" : "50px",
      borderRadius: "10px",
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: isMobile ? "18px" : "24px",
      color: color
    }}>
      {icon}
    </div>
    <div>
      <div style={{ 
        fontSize: isMobile ? "12px" : "14px", 
        color: COLORS.textGray, 
        marginBottom: "4px" 
      }}>
        {title}
      </div>
      <div style={{ 
        fontSize: isMobile ? "18px" : "24px", 
        fontWeight: "700", 
        color: COLORS.deepPurple 
      }}>
        {value}
      </div>
    </div>
  </div>
);

// Student Card Component
const StudentCard = ({ student, index, isMobile, calculateStatus, groupedByStudent, filterStatus }) => {
  const originalStudent = Object.values(groupedByStudent).find(
    s => s.studentEmail === student.studentEmail
  );
  
  const allExams = originalStudent?.exams || student.exams;
  
  const studentPassCount = allExams.filter(e => 
    calculateStatus(e.obtainedMarks, e.totalMarks, e.passingMarks) === "Pass"
  ).length;
  
  const studentFailCount = allExams.filter(e => 
    calculateStatus(e.obtainedMarks, e.totalMarks, e.passingMarks) === "Fail"
  ).length;
  
  const studentAvgPercentage = allExams.length > 0 
    ? allExams.reduce((sum, e) => sum + parseFloat(e.percentage || 0), 0) / allExams.length 
    : 0;

  const [showAllExams, setShowAllExams] = useState(false);
  const examsToShow = showAllExams ? student.exams : student.exams.slice(0, 2);

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: `1px solid ${COLORS.lightGray}`,
    }}>
      {/* Student Header */}
      <div style={{
        background: COLORS.headerPurple,
        padding: isMobile ? "16px" : "20px",
        color: COLORS.white,
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "12px" : "16px"
      }}>
        <div style={{
          width: isMobile ? "40px" : "50px",
          height: isMobile ? "40px" : "50px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "18px" : "24px",
        }}>
          <FaUser />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            marginBottom: "4px"
          }}>
            {student.studentName}
          </h3>
          <p style={{
            margin: 0,
            fontSize: isMobile ? "12px" : "13px",
            opacity: 0.9,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <FaEnvelope size={isMobile ? 12 : 14} /> {student.studentEmail}
          </p>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.2)",
          padding: isMobile ? "6px 12px" : "8px 16px",
          borderRadius: "20px",
          fontSize: isMobile ? "12px" : "13px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <FaBook size={isMobile ? 12 : 14} /> {allExams.length} Exam{allExams.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Student Stats */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        padding: isMobile ? "12px" : "16px",
        background: COLORS.bgGray,
        borderBottom: `1px solid ${COLORS.lightGray}`
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "block",
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "700",
            color: COLORS.passGreen,
            marginBottom: "4px"
          }}>
            {studentPassCount}
          </div>
          <div style={{
            fontSize: isMobile ? "11px" : "12px",
            color: COLORS.darkGray,
            fontWeight: "500"
          }}>
            Passed
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "block",
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "700",
            color: COLORS.failRed,
            marginBottom: "4px"
          }}>
            {studentFailCount}
          </div>
          <div style={{
            fontSize: isMobile ? "11px" : "12px",
            color: COLORS.darkGray,
            fontWeight: "500"
          }}>
            Failed
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{
            display: "block",
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "700",
            color: COLORS.deepPurple,
            marginBottom: "4px"
          }}>
            {studentAvgPercentage.toFixed(1)}%
          </div>
          <div style={{
            fontSize: isMobile ? "11px" : "12px",
            color: COLORS.darkGray,
            fontWeight: "500"
          }}>
            Avg Score
          </div>
        </div>
      </div>

      {/* Exams List */}
      <div style={{ padding: isMobile ? "12px" : "16px" }}>
        {filterStatus !== "all" && (
          <div style={{
            background: COLORS.yellowLight,
            color: "#92400e",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: isMobile ? "12px" : "13px",
            marginBottom: "12px",
            fontWeight: "500",
            border: `1px solid ${COLORS.warning}20`
          }}>
            Showing {filterStatus} results only ({student.exams.length} of {allExams.length} exams)
          </div>
        )}
        
        {examsToShow.map((exam, examIndex) => {
          const examStatus = calculateStatus(
            exam.obtainedMarks, 
            exam.totalMarks, 
            exam.passingMarks
          );
          
          return (
            <div key={examIndex} style={{
              background: COLORS.bgGray,
              borderRadius: "8px",
              padding: isMobile ? "12px" : "16px",
              marginBottom: "12px",
              border: `1px solid ${COLORS.lightGray}`
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "8px",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? "8px" : "0"
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "600",
                    color: COLORS.deepPurple,
                    marginBottom: "4px"
                  }}>
                    {exam.examTitle}
                  </div>
                  <div style={{
                    fontSize: isMobile ? "11px" : "12px",
                    color: COLORS.darkGray,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    alignItems: "center"
                  }}>
                    <span>Attempt #{exam.attemptNumber}</span>
                    <span>•</span>
                    <span>Passing: {exam.passingMarks} marks</span>
                    <span>•</span>
                    <span>
                      {new Date(exam.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    {exam.passingMarks <= 0 && (
                      <>
                        <span>•</span>
                        <span style={{ color: COLORS.warning }}>
                          (50% Rule)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "12px" : "20px",
                  flexWrap: isMobile ? "wrap" : "nowrap"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "700",
                      color: COLORS.deepPurple
                    }}>
                      {exam.obtainedMarks}<span style={{ color: COLORS.darkGray, fontWeight: "400" }}>/{exam.totalMarks}</span>
                    </div>
                    <div style={{
                      fontSize: isMobile ? "11px" : "12px",
                      color: COLORS.darkGray
                    }}>
                      Marks
                    </div>
                  </div>
                  
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "700",
                      color: COLORS.deepPurple
                    }}>
                      {exam.percentage}%
                    </div>
                    <div style={{
                      fontSize: isMobile ? "11px" : "12px",
                      color: COLORS.darkGray
                    }}>
                      Score
                    </div>
                  </div>
                  
                  <div>
                    {examStatus === "Pass" ? (
                      <span style={{
                        background: COLORS.greenLight,
                        color: COLORS.passGreen,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <FaCheckCircle /> Pass
                      </span>
                    ) : (
                      <span style={{
                        background: "#fee2e2",
                        color: COLORS.failRed,
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: isMobile ? "12px" : "13px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <FaTimesCircle /> Fail
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {student.exams.length > 2 && (
          <button
            onClick={() => setShowAllExams(!showAllExams)}
            style={{
              width: "100%",
              background: "transparent",
              border: `1px solid ${COLORS.lightGray}`,
              color: COLORS.deepPurple,
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: isMobile ? "13px" : "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.lightGray;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {showAllExams ? (
              <>
                <FaEyeSlash /> Show Less
              </>
            ) : (
              <>
                <FaEye /> View All {student.exams.length} Exams
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const AdminExamResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [debugMode, setDebugMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchResults();
  }, []);

  // ✅ CORRECT STATUS CALCULATION FUNCTION
  const calculateStatus = (obtained, total, passing) => {
    const obtainedNum = parseFloat(obtained) || 0;
    const totalNum = parseFloat(total) || 1;
    const passingNum = parseFloat(passing) || 0;
    
    if (passingNum <= 0) {
      const percentage = (obtainedNum / totalNum) * 100;
      return percentage >= 50 ? "Pass" : "Fail";
    }
    
    return obtainedNum >= passingNum ? "Pass" : "Fail";
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await getAllExamResults();
      
      const processedResults = res.map(r => {
        const obtained = r.obtainedMarks || 0;
        const total = r.totalMarks || 1;
        const passing = r.passingMarks || 0;
        
        const correctStatus = calculateStatus(obtained, total, passing);
        
        return {
          ...r,
          status: correctStatus,
          obtainedMarks: parseFloat(obtained) || 0,
          totalMarks: parseFloat(total) || 0,
          passingMarks: parseFloat(passing) || 0,
          percentage: total > 0 ? ((obtained / total) * 100).toFixed(1) : "0"
        };
      });
      
      setResults(Array.isArray(processedResults) ? processedResults : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching exam results:", error);
      setError("Failed to load exam results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Group results by student
  const groupedByStudent = {};
  results.forEach(result => {
    const key = result.studentEmail || result.studentName || "unknown";
    if (!groupedByStudent[key]) {
      groupedByStudent[key] = {
        studentName: result.studentName || "Unknown Student",
        studentEmail: result.studentEmail || "No Email",
        exams: []
      };
    }
    groupedByStudent[key].exams.push(result);
  });

  let studentsArray = Object.values(groupedByStudent);

  // Filter students based on search query
  studentsArray = studentsArray.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.studentName.toLowerCase().includes(query) ||
      student.studentEmail.toLowerCase().includes(query)
    );
  });

  // ✅ Apply status filter
  let displayStudents = studentsArray;
  if (filterStatus !== "all") {
    displayStudents = studentsArray.map(student => ({
      ...student,
      exams: student.exams.filter(exam => {
        const status = calculateStatus(
          exam.obtainedMarks, 
          exam.totalMarks, 
          exam.passingMarks
        );
        return status.toLowerCase() === filterStatus.toLowerCase();
      })
    })).filter(student => student.exams.length > 0);
  }

  // ✅ Calculate statistics
  const totalStudents = Object.values(groupedByStudent).length;
  const totalExams = results.length;
  const passedExams = results.filter(r => {
    return calculateStatus(r.obtainedMarks, r.totalMarks, r.passingMarks) === "Pass";
  }).length;
  
  const failedExams = results.filter(r => {
    return calculateStatus(r.obtainedMarks, r.totalMarks, r.passingMarks) === "Fail";
  }).length;
  
  const passPercentage = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : 0;

  return (
    <div style={{ display: "flex", backgroundColor: COLORS.bgGray, minHeight: "100vh" }}>
      <Sidebar />

      <div style={{
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header Section */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div>
              <h1 style={{
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                color: COLORS.deepPurple,
                margin: 0,
                marginBottom: "8px",
              }}>
                📊 Exam Results Dashboard
              </h1>
              <p style={{ 
                color: COLORS.textGray, 
                margin: 0, 
                fontSize: isMobile ? "13px" : "14px" 
              }}>
                View and analyze all student exam performance
              </p>
            </div>
          </div>

          {/* ✅ DEBUG INFO PANEL */}
          {debugMode && !loading && !error && results.length > 0 && (
            <div style={{
              background: COLORS.white,
              border: `2px solid ${COLORS.warning}`,
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "25px",
              boxShadow: "0 4px 12px rgba(245, 158, 11, 0.1)"
            }}>
              <h4 style={{
                color: COLORS.warning,
                marginTop: "0",
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: isMobile ? "16px" : "18px"
              }}>
                <FaExclamationTriangle /> Debug Information
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "12px",
                marginBottom: "20px"
              }}>
                <div style={{
                  background: COLORS.white,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.lightGray}`
                }}>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "11px" : "12px",
                    color: COLORS.darkGray,
                    marginBottom: "4px"
                  }}>
                    Total Results:
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "bold",
                    color: COLORS.deepPurple
                  }}>
                    {results.length}
                  </span>
                </div>
                <div style={{
                  background: COLORS.white,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.lightGray}`
                }}>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "11px" : "12px",
                    color: COLORS.darkGray,
                    marginBottom: "4px"
                  }}>
                    Using 50% Rule:
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "bold",
                    color: COLORS.deepPurple
                  }}>
                    {results.filter(r => r.passingMarks <= 0).length}
                  </span>
                </div>
                <div style={{
                  background: COLORS.white,
                  padding: "12px",
                  borderRadius: "8px",
                  border: `1px solid ${COLORS.lightGray}`
                }}>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "11px" : "12px",
                    color: COLORS.darkGray,
                    marginBottom: "4px"
                  }}>
                    Pass/Fail Ratio:
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "bold",
                    color: COLORS.deepPurple
                  }}>
                    {passedExams}/{failedExams}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Cards */}
          {!loading && !error && (
            <div style={{ 
              display: "flex", 
              gap: isMobile ? "12px" : "20px", 
              marginBottom: "30px",
              flexWrap: "wrap",
              overflowX: isMobile ? "auto" : "visible",
              paddingBottom: isMobile ? "8px" : "0"
            }}>
              <StatCard
                icon={<FaUsers />}
                title="Total Students"
                value={totalStudents}
                color={COLORS.info}
                bgColor={COLORS.blueLight}
                isMobile={isMobile}
              />
              <StatCard
                icon={<FaCheckCircle />}
                title="Passed Exams"
                value={passedExams}
                color={COLORS.passGreen}
                bgColor={COLORS.greenLight}
                isMobile={isMobile}
              />
              <StatCard
                icon={<FaTimesCircle />}
                title="Failed Exams"
                value={failedExams}
                color={COLORS.failRed}
                bgColor="#fee2e2"
                isMobile={isMobile}
              />
              <StatCard
                icon={<FaChartLine />}
                title="Pass Rate"
                value={`${passPercentage}%`}
                color={COLORS.warning}
                bgColor={COLORS.yellowLight}
                isMobile={isMobile}
              />
            </div>
          )}
          
          {/* Search and Filter Bar */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "12px" : "20px",
            marginBottom: isMobile ? "20px" : "24px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            {/* Search Input */}
            <div style={{
              position: "relative",
              flex: 1,
            }}>
              <FaSearch style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.darkGray,
                fontSize: "16px"
              }} />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px",
                  borderRadius: "8px",
                  border: `1px solid #D1D5DB`,
                  width: "100%",
                  fontSize: isMobile ? "14px" : "15px",
                  background: COLORS.white,
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    color: COLORS.darkGray,
                    cursor: "pointer",
                    padding: "5px 10px",
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div style={{ 
              display: "flex", 
              gap: isMobile ? "8px" : "12px",
              flexWrap: "wrap"
            }}>
              <button 
                onClick={() => setFilterStatus("all")}
                style={{
                  background: filterStatus === "all" ? COLORS.primaryButton : COLORS.white,
                  color: filterStatus === "all" ? COLORS.white : COLORS.textGray,
                  border: `1px solid ${filterStatus === "all" ? COLORS.primaryButton : COLORS.lightGray}`,
                  padding: isMobile ? "10px 16px" : "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== "all") {
                    e.currentTarget.style.background = COLORS.lightGray;
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== "all") {
                    e.currentTarget.style.background = COLORS.white;
                  }
                }}
              >
                All Results
              </button>
              <button 
                onClick={() => setFilterStatus("pass")}
                style={{
                  background: filterStatus === "pass" ? COLORS.passGreen : COLORS.white,
                  color: filterStatus === "pass" ? COLORS.white : COLORS.passGreen,
                  border: `1px solid ${filterStatus === "pass" ? COLORS.passGreen : COLORS.lightGray}`,
                  padding: isMobile ? "10px 16px" : "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== "pass") {
                    e.currentTarget.style.background = COLORS.greenLight;
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== "pass") {
                    e.currentTarget.style.background = COLORS.white;
                  }
                }}
              >
                <FaCheckCircle /> Passed
              </button>
              <button 
                onClick={() => setFilterStatus("fail")}
                style={{
                  background: filterStatus === "fail" ? COLORS.failRed : COLORS.white,
                  color: filterStatus === "fail" ? COLORS.white : COLORS.failRed,
                  border: `1px solid ${filterStatus === "fail" ? COLORS.failRed : COLORS.lightGray}`,
                  padding: isMobile ? "10px 16px" : "12px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (filterStatus !== "fail") {
                    e.currentTarget.style.background = "#fee2e2";
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterStatus !== "fail") {
                    e.currentTarget.style.background = COLORS.white;
                  }
                }}
              >
                <FaTimesCircle /> Failed
              </button>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && !error && (
            <div style={{
              display: "flex",
              gap: "20px",
              padding: isMobile ? "12px 16px" : "16px 20px",
              background: COLORS.white,
              borderRadius: "8px",
              border: `1px solid ${COLORS.lightGray}`,
              flexWrap: "wrap",
              marginBottom: "24px",
              justifyContent: isMobile ? "center" : "space-between"
            }}>
              <span style={{
                fontSize: isMobile ? "12px" : "14px",
                color: COLORS.textGray,
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                👥 Showing {displayStudents.length} of {totalStudents} students
              </span>
              <span style={{
                fontSize: isMobile ? "12px" : "14px",
                color: COLORS.textGray,
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                📝 Displaying {displayStudents.reduce((sum, s) => sum + s.exams.length, 0)} exams
              </span>
              <span style={{
                fontSize: isMobile ? "12px" : "14px",
                color: COLORS.textGray,
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                📊 Pass Rate: {passPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: COLORS.white,
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              border: `4px solid ${COLORS.lightGray}`,
              borderTop: `4px solid ${COLORS.deepPurple}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}></div>
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: COLORS.textGray,
              fontWeight: "500"
            }}>
              Loading results...
            </p>
          </div>
        ) : error ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: COLORS.white,
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: COLORS.danger,
              fontSize: "24px"
            }}>
              <FaTimesCircle />
            </div>
            <p style={{
              color: COLORS.danger,
              fontSize: isMobile ? "16px" : "18px",
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              {error}
            </p>
            <button 
              onClick={fetchResults} 
              style={{
                background: COLORS.primaryButton,
                color: COLORS.white,
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(139, 92, 246, 0.2)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              Try Again
            </button>
          </div>
        ) : results.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: COLORS.white,
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: COLORS.lightGray,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: COLORS.darkGray,
              fontSize: "24px"
            }}>
              <FaBook />
            </div>
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: COLORS.textGray,
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              No exam results found
            </p>
          </div>
        ) : displayStudents.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: COLORS.white,
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              background: COLORS.lightGray,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: COLORS.darkGray,
              fontSize: "24px"
            }}>
              <FaSearch />
            </div>
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: COLORS.textGray,
              marginBottom: "20px",
              fontWeight: "500"
            }}>
              {filterStatus !== "all" 
                ? `No students with ${filterStatus} results found` 
                : `No students found matching "${searchQuery}"`}
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
              }} 
              style={{
                background: COLORS.primaryButton,
                color: COLORS.white,
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(139, 92, 246, 0.2)"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(500px, 1fr))",
            gap: isMobile ? "16px" : "24px",
          }}>
            {displayStudents.map((student, index) => (
              <StudentCard
                key={index}
                student={student}
                index={index}
                isMobile={isMobile}
                calculateStatus={calculateStatus}
                groupedByStudent={groupedByStudent}
                filterStatus={filterStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminExamResults;