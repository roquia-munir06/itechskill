import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllExams, createExam, updateExam, deleteExam, grantExamAccess, revokeExamAccess } from "../api/api";
import { useNavigate } from "react-router-dom";
import { 
  FaEdit, FaTrash, FaEye, FaPlus, FaClock, FaStar, 
  FaGraduationCap, FaClipboardList, FaTimes, FaSearch,
  FaLock, FaLockOpen, FaUserPlus, FaUserMinus
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

const MockExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    title: "", description: "", duration: "", totalMarks: "", passingMarks: "",
  });

  // ✅ Access Control States
  const [accessModal, setAccessModal] = useState(null);
  const [accessEmail, setAccessEmail] = useState("");
  const [accessLoading, setAccessLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchExams = async () => {
    try {
      const res = await getAllExams();
      setExams(res.exams || res || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load exams");
    }
  };

  useEffect(() => { fetchExams(); }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", duration: "", totalMarks: "", passingMarks: "" });
    setEditingExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      duration: Number(formData.duration),
      totalMarks: Number(formData.totalMarks),
      passingMarks: Number(formData.passingMarks),
    };
    try {
      if (editingExam) await updateExam(editingExam._id, payload);
      else await createExam(payload);
      setFormVisible(false);
      resetForm();
      fetchExams();
      alert(editingExam ? "Exam updated successfully!" : "Exam created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save exam. Check all fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this exam? This action cannot be undone.")) {
      try {
        await deleteExam(id);
        fetchExams();
        alert("Exam deleted successfully!");
      } catch (err) {
        alert("Failed to delete exam");
      }
    }
  };

  // ✅ Grant Access Handler
  const handleGrantAccess = async () => {
    if (!accessEmail.trim()) return alert("Please enter an email address");
    setAccessLoading(true);
    try {
      const data = await grantExamAccess(accessModal._id, accessEmail.trim());
      if (data.success) {
        alert(`✅ Access granted to ${accessEmail}`);
        setAccessEmail("");
        setAccessModal(prev => ({ 
          ...prev, 
          allowedEmails: data.allowedEmails, 
          accessType: "restricted" 
        }));
        fetchExams();
      } else {
        alert(data.message || "Failed to grant access");
      }
    } catch (err) {
      alert("Failed to grant access. Please try again.");
    }
    setAccessLoading(false);
  };

  // ✅ Revoke Access Handler
  const handleRevokeAccess = async (email) => {
    if (!window.confirm(`Revoke access for ${email}?`)) return;
    try {
      const data = await revokeExamAccess(accessModal._id, email);
      if (data.success) {
        alert(`✅ Access revoked from ${email}`);
        setAccessModal(prev => ({ ...prev, allowedEmails: data.allowedEmails }));
        fetchExams();
      } else {
        alert(data.message || "Failed to revoke access");
      }
    } catch (err) {
      alert("Failed to revoke access. Please try again.");
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExams = exams.length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.bgGray }}>
      <Sidebar />

      <div style={{
        flex: 1,
        overflowX: "hidden",
        marginLeft: isMobile ? "0" : "280px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? "20px" : "24px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            marginBottom: isMobile ? "16px" : "24px", flexWrap: "wrap", gap: "16px",
          }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <h1 style={{
                margin: 0, color: COLORS.deepPurple,
                fontSize: isMobile ? "20px" : "28px", fontWeight: "700", marginBottom: "8px"
              }}>
                📘 Mock Exams Management
              </h1>
              <p style={{ margin: 0, color: COLORS.textGray, fontSize: isMobile ? "12px" : "14px" }}>
                Create and manage mock exams for student assessment
              </p>
            </div>

            {/* Total Exams Card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
              border: "1px solid rgba(61, 26, 91, 0.2)", borderRadius: "8px",
              padding: isMobile ? "10px 16px" : "12px 20px",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <div style={{
                width: isMobile ? "35px" : "40px", height: isMobile ? "35px" : "40px",
                borderRadius: "8px", background: COLORS.blueLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isMobile ? "16px" : "20px", color: COLORS.info
              }}>
                <FaClipboardList />
              </div>
              <div>
                <p style={{ color: COLORS.deepPurple, fontSize: isMobile ? "12px" : "14px", fontWeight: "600", margin: 0, marginBottom: "2px" }}>
                  Total Exams
                </p>
                <p style={{ color: COLORS.deepPurple, fontSize: isMobile ? "20px" : "24px", fontWeight: "700", margin: 0 }}>
                  {totalExams}
                </p>
              </div>
            </div>
          </div>

          {/* Search & Add Button */}
          <div style={{
            display: "flex", gap: isMobile ? "8px" : "12px",
            marginBottom: isMobile ? "16px" : "20px",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center"
          }}>
            <div style={{ position: "relative", flex: isMobile ? "1" : "1 1 400px", maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", color: COLORS.darkGray,
                fontSize: isMobile ? "14px" : "16px"
              }} />
              <input
                placeholder="Search exams by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", padding: isMobile ? "10px 14px 10px 40px" : "12px 16px 12px 44px",
                  borderRadius: "8px", border: "1px solid #D1D5DB",
                  fontSize: isMobile ? "13px" : "14px", background: COLORS.white,
                  boxSizing: "border-box", outline: "none"
                }}
              />
            </div>

            <button
              onClick={() => { resetForm(); setFormVisible(true); }}
              style={{
                background: COLORS.primaryButton, color: COLORS.white, border: "none",
                padding: isMobile ? "10px 20px" : "12px 24px", borderRadius: "8px",
                cursor: "pointer", fontSize: isMobile ? "12px" : "14px", fontWeight: "600",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                boxShadow: "0 2px 5px rgba(139, 92, 246, 0.3)", whiteSpace: "nowrap",
                flex: isMobile ? "0" : "0 0 auto", transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#7C3AED"}
              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}
            >
              <FaPlus /> {isMobile ? "Create Exam" : "Create New Exam"}
            </button>
          </div>

          {/* Exams Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))",
            gap: isMobile ? "12px" : "20px"
          }}>
            {filteredExams.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1", textAlign: "center",
                padding: isMobile ? "40px 20px" : "60px 40px",
                background: COLORS.white, borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <FaClipboardList style={{ fontSize: isMobile ? "48px" : "64px", color: COLORS.darkGray, marginBottom: "16px" }} />
                <p style={{ fontSize: isMobile ? "16px" : "18px", color: COLORS.darkGray, margin: 0, marginBottom: "8px" }}>
                  {searchTerm ? "No exams found matching your search" : "No exams created yet"}
                </p>
                {!searchTerm && (
                  <p style={{ fontSize: isMobile ? "13px" : "14px", color: COLORS.textGray, margin: 0 }}>
                    Create your first mock exam to get started
                  </p>
                )}
              </div>
            ) : (
              filteredExams.map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  isMobile={isMobile}
                  onView={() => navigate(`/mock-exams/${exam._id}/questions`)}
                  onEdit={() => {
                    setEditingExam(exam);
                    setFormData({
                      title: exam.title,
                      description: exam.description || "",
                      duration: exam.duration,
                      totalMarks: exam.totalMarks,
                      passingMarks: exam.passingMarks || "",
                    });
                    setFormVisible(true);
                  }}
                  onDelete={() => handleDelete(exam._id)}
                  onAccess={() => setAccessModal(exam)} // ✅ Open Access Modal
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ✅ Access Management Modal */}
      {accessModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 3000,
          padding: isMobile ? "16px" : "20px"
        }}>
          <div style={{
            background: COLORS.white, borderRadius: "12px",
            padding: isMobile ? "20px" : "28px",
            width: isMobile ? "100%" : "520px",
            maxWidth: "95%", maxHeight: "85vh", overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.25)"
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: isMobile ? "16px" : "18px", fontWeight: "700" }}>
                  🔐 Manage Exam Access
                </h3>
                <p style={{ margin: "4px 0 0", color: COLORS.darkGray, fontSize: "13px" }}>
                  {accessModal.title}
                </p>
              </div>
              <button
                onClick={() => { setAccessModal(null); setAccessEmail(""); }}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: COLORS.darkGray }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Access Type Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: accessModal.accessType === "public" ? COLORS.greenLight : COLORS.yellowLight,
              color: accessModal.accessType === "public" ? "#065f46" : "#92400e",
              padding: "6px 14px", borderRadius: "20px",
              fontSize: "13px", fontWeight: "600", marginBottom: "20px"
            }}>
              {accessModal.accessType === "public" ? <FaLockOpen /> : <FaLock />}
              {accessModal.accessType === "public" ? "Public — All Students Can Access" : "Restricted — Specific Students Only"}
            </div>

            {/* Grant Access Input */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontWeight: "600", color: COLORS.deepPurple, marginBottom: "8px", fontSize: "14px" }}>
                Grant Access by Email
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGrantAccess()}
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: "8px",
                    border: "1px solid #D1D5DB", fontSize: "14px",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
                <button
                  onClick={handleGrantAccess}
                  disabled={accessLoading}
                  style={{
                    background: COLORS.teal, color: COLORS.white, border: "none",
                    padding: "10px 16px", borderRadius: "8px", cursor: accessLoading ? "not-allowed" : "pointer",
                    fontWeight: "600", fontSize: "14px", opacity: accessLoading ? 0.7 : 1,
                    display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap"
                  }}
                >
                  <FaUserPlus /> {accessLoading ? "Adding..." : "Grant"}
                </button>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "12px", color: COLORS.darkGray }}>
                💡 Press Enter or click Grant to add student access
              </p>
            </div>

            {/* Divider */}
            <div style={{ borderTop: `1px solid ${COLORS.lightGray}`, marginBottom: "16px" }} />

            {/* Allowed Emails List */}
            <div>
              <label style={{ display: "block", fontWeight: "600", color: COLORS.deepPurple, marginBottom: "10px", fontSize: "14px" }}>
                Students with Access ({accessModal.allowedEmails?.length || 0})
              </label>

              {!accessModal.allowedEmails?.length ? (
                <div style={{
                  textAlign: "center", padding: "24px",
                  background: COLORS.bgGray, borderRadius: "8px",
                  border: `1px dashed ${COLORS.darkGray}`
                }}>
                  <FaLockOpen style={{ fontSize: "28px", color: COLORS.darkGray, marginBottom: "8px" }} />
                  <p style={{ margin: 0, color: COLORS.darkGray, fontSize: "14px" }}>
                    No restrictions set — exam is public
                  </p>
                  <p style={{ margin: "4px 0 0", color: COLORS.textGray, fontSize: "12px" }}>
                    Add an email above to restrict access
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {accessModal.allowedEmails.map((email, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", background: COLORS.bgGray, borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "32px", height: "32px", borderRadius: "50%",
                          background: COLORS.purpleLight, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontSize: "14px", color: COLORS.deepPurple, fontWeight: "700"
                        }}>
                          {email[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: "14px", color: COLORS.textGray }}>{email}</span>
                      </div>
                      <button
                        onClick={() => handleRevokeAccess(email)}
                        style={{
                          background: COLORS.danger, color: COLORS.white, border: "none",
                          padding: "6px 10px", borderRadius: "6px", cursor: "pointer",
                          fontSize: "12px", display: "flex", alignItems: "center", gap: "4px",
                          fontWeight: "600"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
                        onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
                      >
                        <FaUserMinus /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => { setAccessModal(null); setAccessEmail(""); }}
              style={{
                width: "100%", marginTop: "20px", padding: "12px",
                background: COLORS.lightGray, color: COLORS.textGray,
                border: "none", borderRadius: "8px", cursor: "pointer",
                fontSize: "14px", fontWeight: "600"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formVisible && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 2000,
          padding: isMobile ? "16px" : "20px"
        }}>
          <div style={{
            background: COLORS.white, padding: isMobile ? "20px" : "30px",
            borderRadius: "12px", width: isMobile ? "100%" : "500px",
            maxWidth: "90%", maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile ? "16px" : "20px" }}>
              <h3 style={{ margin: 0, fontSize: isMobile ? "18px" : "20px", color: COLORS.deepPurple }}>
                {editingExam ? "✏️ Edit Exam" : "➕ Create New Exam"}
              </h3>
              <button
                onClick={() => { setFormVisible(false); resetForm(); }}
                style={{ background: "transparent", border: "none", fontSize: isMobile ? "18px" : "20px", cursor: "pointer", color: COLORS.darkGray }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: isMobile ? "14px" : "16px" }}>
              {[
                { label: "Exam Title *", field: "title", placeholder: "Enter exam title", type: "text" },
              ].map(({ label, field, placeholder, type }) => (
                <div key={field}>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "14px" }}>
                    {label}
                  </label>
                  <input
                    placeholder={placeholder}
                    required
                    type={type}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    style={{
                      width: "100%", padding: isMobile ? "10px" : "12px", borderRadius: "8px",
                      border: `1px solid ${COLORS.lightGray}`, fontSize: isMobile ? "13px" : "14px",
                      boxSizing: "border-box", outline: "none"
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "14px" }}>
                  Description *
                </label>
                <textarea
                  placeholder="Enter exam description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  style={{
                    width: "100%", padding: isMobile ? "10px" : "12px", borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`, fontSize: isMobile ? "13px" : "14px",
                    resize: "vertical", boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "14px" : "16px" }}>
                {[
                  { label: "Duration (minutes) *", field: "duration", placeholder: "e.g., 60" },
                  { label: "Total Marks *", field: "totalMarks", placeholder: "e.g., 100" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={{ display: "block", marginBottom: "6px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "14px" }}>
                      {label}
                    </label>
                    <input
                      placeholder={placeholder}
                      required
                      type="number"
                      min="1"
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      style={{
                        width: "100%", padding: isMobile ? "10px" : "12px", borderRadius: "8px",
                        border: `1px solid ${COLORS.lightGray}`, fontSize: isMobile ? "13px" : "14px",
                        boxSizing: "border-box", outline: "none"
                      }}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.deepPurple, fontWeight: "600", fontSize: isMobile ? "13px" : "14px" }}>
                  Passing Marks *
                </label>
                <input
                  placeholder="e.g., 40"
                  required
                  type="number"
                  min="1"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
                  style={{
                    width: "100%", padding: isMobile ? "10px" : "12px", borderRadius: "8px",
                    border: `1px solid ${COLORS.lightGray}`, fontSize: isMobile ? "13px" : "14px",
                    boxSizing: "border-box", outline: "none"
                  }}
                />
                <div style={{ fontSize: isMobile ? "11px" : "12px", color: COLORS.darkGray, marginTop: "6px" }}>
                  💡 Minimum marks required to pass this exam
                </div>
              </div>

              <div style={{
                display: "flex", gap: isMobile ? "8px" : "12px",
                marginTop: "20px", paddingTop: "20px",
                borderTop: `1px solid ${COLORS.lightGray}`, flexWrap: "wrap"
              }}>
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.formButton} 0%, ${COLORS.indigo} 100%)`,
                    color: COLORS.white, border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px", flex: "1 1 180px", cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px", fontWeight: "600"
                  }}
                >
                  {editingExam ? "Update Exam" : "Create Exam"}
                </button>
                <button
                  type="button"
                  onClick={() => { setFormVisible(false); resetForm(); }}
                  style={{
                    background: COLORS.danger, color: COLORS.white, border: "none",
                    padding: isMobile ? "12px 24px" : "14px 28px",
                    borderRadius: "8px", flex: "1 1 180px", cursor: "pointer",
                    fontSize: isMobile ? "13px" : "15px", fontWeight: "600"
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

// ✅ Updated ExamCard with Access Button
const ExamCard = ({ exam, isMobile, onView, onEdit, onDelete, onAccess }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: COLORS.white, padding: isMobile ? "16px" : "20px",
        borderRadius: "12px",
        boxShadow: isHovered ? "0 8px 20px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        cursor: "pointer",
        border: `1px solid ${isHovered ? COLORS.deepPurple : COLORS.lightGray}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Title + Access Badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: isMobile ? "16px" : "18px", fontWeight: "700", flex: 1 }}>
          {exam.title}
        </h3>
        {/* ✅ Access Type Badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          background: exam.accessType === "restricted" ? COLORS.yellowLight : COLORS.greenLight,
          color: exam.accessType === "restricted" ? "#92400e" : "#065f46",
          padding: "3px 8px", borderRadius: "12px", fontSize: "11px",
          fontWeight: "600", marginLeft: "8px", whiteSpace: "nowrap"
        }}>
          {exam.accessType === "restricted" ? <FaLock size={9} /> : <FaLockOpen size={9} />}
          {exam.accessType === "restricted" ? `${exam.allowedEmails?.length || 0} students` : "Public"}
        </span>
      </div>

      <p style={{ margin: 0, color: COLORS.textGray, fontSize: isMobile ? "13px" : "14px", lineHeight: "1.5", marginBottom: "12px" }}>
        {exam.description}
      </p>

      {/* Stats Row */}
      <div style={{
        display: "flex", justifyContent: "space-between", flexWrap: "wrap",
        gap: "8px", marginBottom: "12px", paddingTop: "12px",
        borderTop: `1px solid ${COLORS.lightGray}`
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: isMobile ? "12px" : "13px", color: COLORS.warning, background: COLORS.yellowLight, padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
          <FaClock size={isMobile ? 12 : 14} /> {exam.duration} min
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: isMobile ? "12px" : "13px", color: COLORS.indigo, background: COLORS.purpleLight, padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
          <FaStar size={isMobile ? 12 : 14} /> {exam.totalMarks} Marks
        </div>
        {exam.passingMarks && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: isMobile ? "12px" : "13px", color: COLORS.teal, background: COLORS.greenLight, padding: "4px 10px", borderRadius: "6px", fontWeight: "600" }}>
            <FaGraduationCap size={isMobile ? 12 : 14} /> Pass: {exam.passingMarks}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: isMobile ? "6px" : "8px", paddingTop: "12px", borderTop: `1px solid ${COLORS.lightGray}` }}>
        {/* View Questions */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(); }}
          style={{ background: COLORS.info, color: COLORS.white, border: "none", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "6px", cursor: "pointer", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: isMobile ? "12px" : "14px", fontWeight: "600" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#2563EB"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.info}
        >
          <FaEye size={isMobile ? 12 : 14} /> {!isMobile && "Questions"}
        </button>

        {/* ✅ Access Control Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAccess(); }}
          style={{ background: COLORS.teal, color: COLORS.white, border: "none", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: isMobile ? "12px" : "14px", fontWeight: "600" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#0f766e"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.teal}
          title="Manage student access"
        >
          <FaLock size={isMobile ? 12 : 14} /> {!isMobile && "Access"}
        </button>

        {/* Edit */}
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          style={{ background: COLORS.warning, color: COLORS.white, border: "none", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "12px" : "14px" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning}
        >
          <FaEdit size={isMobile ? 12 : 14} />
        </button>

        {/* Delete */}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{ background: COLORS.danger, color: COLORS.white, border: "none", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "12px" : "14px" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"}
          onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger}
        >
          <FaTrash size={isMobile ? 12 : 14} />
        </button>
      </div>
    </div>
  );
};

export default MockExamsPage;