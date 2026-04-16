import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  getQuestionsByExam,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../api/api";
import { 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaTimes, 
  FaArrowLeft,
  FaQuestionCircle,
  FaCheckCircle,
  FaSearch
} from "react-icons/fa";

// Exact Color Theme from Previous Components
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

const ExamQuestionsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [form, setForm] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  // Responsive handling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestionsByExam(examId);
      console.log("Question data", data);
      setQuestions(data || []);
    } catch (err) {
      console.error("Error fetching questions:", err);
      alert("Failed to load questions");
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateQuestion(editing._id, form);
        alert("Question updated successfully!");
      } else {
        await addQuestion({
          exam: examId,
          questionText: form.questionText,
          options: form.options,
          correctAnswer: form.correctAnswer,
        });
        alert("Question added successfully!");
      }
      setFormVisible(false);
      setEditing(null);
      resetForm();
      fetchQuestions();
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Failed to save question. Please check all fields.");
    }
  };

  const resetForm = () => {
    setForm({ questionText: "", options: ["", "", "", ""], correctAnswer: "" });
  };

  const handleEdit = (q) => {
    setEditing(q);
    setForm({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
    });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this question? This action cannot be undone.")) {
      try {
        await deleteQuestion(id);
        fetchQuestions();
        alert("Question deleted successfully!");
      } catch (err) {
        console.error("Error deleting question:", err);
        alert("Failed to delete question");
      }
    }
  };

  // Filter questions based on search
  const filteredQuestions = questions.filter(q =>
    q.questionText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.options?.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.bgGray }}>
      <Sidebar />
      
      <div style={{
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        paddingTop: isMobile ? "80px" : "32px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: isMobile ? "20px" : "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: isMobile ? "16px" : "24px",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <h1 style={{ 
                margin: 0, 
                color: COLORS.deepPurple,
                fontSize: isMobile ? "20px" : "28px",
                fontWeight: "700",
                marginBottom: "8px"
              }}>
                📝 Exam Questions
              </h1>
              <p style={{ 
                margin: 0, 
                color: COLORS.textGray, 
                fontSize: isMobile ? "12px" : "14px" 
              }}>
                Manage questions for this exam
              </p>
            </div>

            {/* Total Questions Card - Top Right */}
            <div style={{
              background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
              border: "1px solid rgba(61, 26, 91, 0.2)",
              borderRadius: "8px",
              padding: isMobile ? "10px 16px" : "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <div style={{
                width: isMobile ? "35px" : "40px",
                height: isMobile ? "35px" : "40px",
                borderRadius: "8px",
                background: COLORS.blueLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "16px" : "20px",
                color: COLORS.info
              }}>
                <FaQuestionCircle />
              </div>
              <div>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "600",
                  margin: 0,
                  marginBottom: "2px"
                }}>
                  Total Questions
                </p>
                <p style={{
                  color: COLORS.deepPurple,
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "700",
                  margin: 0
                }}>
                  {questions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Add Button Row */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "8px" : "12px",
            marginBottom: isMobile ? "16px" : "20px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            {/* Search Input */}
            <div style={{
              position: "relative",
              flex: isMobile ? "1" : "1 1 400px",
              maxWidth: isMobile ? "100%" : "500px"
            }}>
              <FaSearch style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: COLORS.darkGray,
                fontSize: isMobile ? "14px" : "16px"
              }} />
              <input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: isMobile ? "10px 14px 10px 40px" : "12px 16px 12px 44px",
                  borderRadius: "8px",
                  border: `1px solid #D1D5DB`,
                  fontSize: isMobile ? "13px" : "14px",
                  background: COLORS.white,
                  boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>

            {/* Add Question Button */}
            <button
              onClick={() => {
                resetForm();
                setEditing(null);
                setFormVisible(true);
              }}
              style={{
                background: COLORS.primaryButton,
                color: COLORS.white,
                border: "none",
                padding: isMobile ? "10px 20px" : "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(139, 92, 246, 0.3)",
                whiteSpace: "nowrap",
                flex: isMobile ? "0" : "0 0 auto",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              <FaPlus /> {isMobile ? "Add Question" : "Add New Question"}
            </button>
          </div>

          {/* Questions Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile 
              ? "1fr" 
              : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: isMobile ? "12px" : "20px"
          }}>
            {filteredQuestions.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: isMobile ? "40px 20px" : "60px 40px",
                background: COLORS.white,
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <FaQuestionCircle style={{
                  fontSize: isMobile ? "48px" : "64px",
                  color: COLORS.darkGray,
                  marginBottom: "16px"
                }} />
                <p style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: COLORS.darkGray,
                  margin: 0,
                  marginBottom: "8px"
                }}>
                  {searchTerm ? "No questions found matching your search" : "No questions added yet"}
                </p>
                {!searchTerm && (
                  <p style={{
                    fontSize: isMobile ? "13px" : "14px",
                    color: COLORS.textGray,
                    margin: 0
                  }}>
                    Add your first question to get started
                  </p>
                )}
              </div>
            ) : (
              filteredQuestions.map((q, i) => (
                <QuestionCard
                  key={q._id}
                  question={q}
                  index={i}
                  isMobile={isMobile}
                  onEdit={() => handleEdit(q)}
                  onDelete={() => handleDelete(q._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {formVisible && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000,
          padding: isMobile ? "16px" : "20px"
        }}>
          <div style={{
            background: COLORS.white,
            padding: isMobile ? "20px" : "30px",
            borderRadius: "12px",
            width: isMobile ? "100%" : "550px",
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isMobile ? "16px" : "20px"
            }}>
              <h3 style={{
                margin: 0,
                fontSize: isMobile ? "18px" : "20px",
                color: COLORS.deepPurple
              }}>
                {editing ? "✏️ Edit Question" : "➕ Add New Question"}
              </h3>
              <button
                onClick={() => {
                  setFormVisible(false);
                  resetForm();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: isMobile ? "18px" : "20px",
                  cursor: "pointer",
                  color: COLORS.darkGray
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={submit} style={{
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "14px" : "16px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Question Text *
                </label>
                <textarea
                  required
                  placeholder="Enter your question here..."
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "10px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Options (4 required) *
                </label>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  {form.options.map((op, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{
                        background: COLORS.deepPurple,
                        color: COLORS.white,
                        width: isMobile ? "24px" : "28px",
                        height: isMobile ? "24px" : "28px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: isMobile ? "11px" : "12px",
                        fontWeight: "700",
                        flexShrink: 0
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        required
                        placeholder={`Option ${i + 1}`}
                        value={op}
                        onChange={(e) => {
                          const opts = [...form.options];
                          opts[i] = e.target.value;
                          setForm({ ...form, options: opts });
                        }}
                        style={{
                          flex: 1,
                          padding: isMobile ? "10px" : "12px",
                          borderRadius: "8px",
                          border: `1px solid ${COLORS.lightGray}`,
                          fontSize: isMobile ? "13px" : "14px",
                          boxSizing: "border-box",
                          outline: "none"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "6px",
                  color: COLORS.deepPurple,
                  fontWeight: "600",
                  fontSize: isMobile ? "13px" : "14px"
                }}>
                  Correct Answer *
                </label>
                <input
                  required
                  placeholder="Enter the correct answer (must match one option exactly)"
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px" : "12px",
                    borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`,
                    fontSize: isMobile ? "13px" : "14px",
                    boxSizing: "border-box",
                    outline: "none"
                  }}
                />
                <div style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: COLORS.darkGray,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <FaCheckCircle style={{ color: COLORS.brightGreen }} />
                  <span>Must exactly match one of the options above</span>
                </div>
              </div>

              <div style={{
                display: "flex",
                gap: isMobile ? "8px" : "12px",
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: `1px solid ${COLORS.lightGray}`,
                flexWrap: "wrap"
              }}>
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.formButton} 0%, ${COLORS.indigo} 100%)`,
                    color: COLORS.white,
                    border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px",
                    flex: "1 1 180px",
                    cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {editing ? "Update Question" : "Add Question"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormVisible(false);
                    resetForm();
                  }}
                  style={{
                    background: COLORS.danger,
                    color: COLORS.white,
                    border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px",
                    flex: "1 1 180px",
                    cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, index, isMobile, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: COLORS.white,
        padding: isMobile ? "16px" : "20px",
        borderRadius: "12px",
        boxShadow: isHovered 
          ? "0 8px 20px rgba(0,0,0,0.15)" 
          : "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        border: `1px solid ${isHovered ? COLORS.deepPurple : COLORS.lightGray}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Question Number & Text */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "12px"
      }}>
        <span style={{
          background: COLORS.deepPurple,
          color: COLORS.white,
          width: isMobile ? "28px" : "32px",
          height: isMobile ? "28px" : "32px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "13px" : "14px",
          fontWeight: "700",
          flexShrink: 0
        }}>
          {index + 1}
        </span>
        <h4 style={{
          margin: 0,
          color: COLORS.deepPurple,
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "600",
          lineHeight: "1.5"
        }}>
          {question.questionText}
        </h4>
      </div>

      {/* Options */}
      <div style={{
        marginBottom: "12px",
        paddingLeft: isMobile ? "38px" : "42px"
      }}>
        {question.options?.map((op, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 0",
              fontSize: isMobile ? "13px" : "14px",
              color: COLORS.textGray
            }}
          >
            <span style={{
              background: COLORS.lightGray,
              color: COLORS.deepPurple,
              width: isMobile ? "20px" : "22px",
              height: isMobile ? "20px" : "22px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "10px" : "11px",
              fontWeight: "600",
              flexShrink: 0
            }}>
              {String.fromCharCode(65 + idx)}
            </span>
            {op}
          </div>
        ))}
      </div>

      {/* Correct Answer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: isMobile ? "8px 12px" : "10px 14px",
        background: COLORS.greenLight,
        borderRadius: "8px",
        marginBottom: "12px",
        marginLeft: isMobile ? "38px" : "42px"
      }}>
        <FaCheckCircle style={{ 
          color: "#059669", 
          fontSize: isMobile ? "14px" : "16px",
          flexShrink: 0 
        }} />
        <span style={{
          fontWeight: "600",
          color: "#059669",
          fontSize: isMobile ? "13px" : "14px"
        }}>
          Correct: {question.correctAnswer}
        </span>
      </div>

      {/* Actions */}
      <div style={{
        display: "flex",
        gap: isMobile ? "6px" : "8px",
        paddingTop: "12px",
        borderTop: `1px solid ${COLORS.lightGray}`
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          style={{
            background: COLORS.warning,
            color: COLORS.white,
            border: "none",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning}
        >
          <FaEdit size={isMobile ? 12 : 14} />
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: COLORS.danger,
            color: COLORS.white,
            border: "none",
            padding: isMobile ? "8px 12px" : "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
        >
          <FaTrash size={isMobile ? 12 : 14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExamQuestionsPage;