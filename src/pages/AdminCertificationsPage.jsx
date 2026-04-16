import React, { useEffect, useState, useMemo } from "react";
import {
  getAllCertificationsAdmin,
  createCertification,
  updateCertification,
  deleteCertification,
  toggleCertificationStatus,
} from "../api/api";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";

const COLORS = {
  sidebarDark: "#1a1d2e",
  deepPurple:  "#3D1A5B",
  headerPurple:"#4B2D7A",
  brightGreen: "#00D9A3",
  goldBadge:   "#D4A745",
  white:       "#FFFFFF",
  bgGray:      "#F9FAFB",
  lightGray:   "#F3F4F6",
  darkGray:    "#6B7280",
  textGray:    "#4B5563",
  danger:      "#EF4444",
  warning:     "#F59E0B",
  orange:      "#3D1A5B",
};



const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" }}>
    <div style={{ background: COLORS.white, padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
      {children}
    </div>
  </div>
);

const AdminCertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [toast, setToast]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [formVisible, setFormVisible]       = useState(false);
  const [selectedCert, setSelectedCert]     = useState(null);
  const [isMobile, setIsMobile]             = useState(window.innerWidth <= 768);

  // Form fields
  const [editingId, setEditingId]   = useState(null);
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration]     = useState("");
  const [level, setLevel]           = useState("Beginner to Intermediate");
  const [projects, setProjects]     = useState("");
  const [skills, setSkills]         = useState([""]);
  const [benefits, setBenefits]     = useState([""]);
  const [color, setColor]           = useState("#22013a");
  const [icon, setIcon]             = useState("FaAward");
  const [displayOrder, setDisplayOrder] = useState(999);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resetForm = () => {
    setEditingId(null); setTitle(""); setDescription("");
    setDuration(""); setLevel("Beginner to Intermediate");
    setProjects(""); setSkills([""]); setBenefits([""]);
    setColor("#22013a"); setIcon("FaAward"); setDisplayOrder(999);
  };

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const res = await getAllCertificationsAdmin();
      setCertifications(res.data || []);
    } catch (err) {
      showToast("Failed to load certifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCertifications(); }, []);

  const handleArrayChange = (arr, setArr, index, value) => {
    const n = [...arr]; n[index] = value; setArr(n);
  };
  const addArrayField    = (arr, setArr) => setArr([...arr, ""]);
  const removeArrayField = (arr, setArr, index) => setArr(arr.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast("Title and description are required.", "error"); return;
    }
    const payload = {
      title, description, duration, level, projects, color, icon,
      displayOrder: Number(displayOrder),
      skills:    skills.filter(s => s.trim()),
      benefits:  benefits.filter(b => b.trim()),
    };
    try {
      setSubmitting(true);
      if (editingId) {
        await updateCertification(editingId, payload);
        showToast("Certification updated successfully.");
      } else {
        await createCertification(payload);
        showToast("Certification created successfully.");
      }
      setFormVisible(false);
      resetForm();
      await fetchCertifications();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this certification?")) return;
    try {
      await deleteCertification(id);
      showToast("Certification deleted.");
      fetchCertifications();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleCertificationStatus(id);
      showToast("Status updated.");
      fetchCertifications();
    } catch (err) {
      showToast("Toggle failed", "error");
    }
  };

  const handleEdit = (cert) => {
    setEditingId(cert._id);
    setTitle(cert.title || "");
    setDescription(cert.description || "");
    setDuration(cert.duration || "");
    setLevel(cert.level || "Beginner to Intermediate");
    setProjects(cert.projects || "");
    setSkills(cert.skills?.length ? cert.skills : [""]);
    setBenefits(cert.benefits?.length ? cert.benefits : [""]);
    setColor(cert.color || "#22013a");
    setIcon(cert.icon || "FaAward");
    setDisplayOrder(cert.displayOrder ?? 999);
    setFormVisible(true);
  };

  const filtered = useMemo(() =>
    certifications.filter(c =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.level?.toLowerCase().includes(search.toLowerCase())
    ), [certifications, search]
  );

  const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #D1D5DB", width: "100%", boxSizing: "border-box", fontSize: "14px", outline: "none" };
  const labelStyle = { display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" };

  return (
    <div style={{ display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 16px 32px 16px" : "32px" }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 9999, padding: "12px 24px", borderRadius: "8px", background: toast.type === "success" ? COLORS.brightGreen : COLORS.danger, color: toast.type === "success" ? COLORS.deepPurple : COLORS.white, fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px" }}>🏅 Certification Management</h1>
              <p style={{ color: COLORS.textGray, margin: 0, fontSize: "14px" }}>Create, edit & manage all certification programs</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" }}>
              <p style={{ color: COLORS.deepPurple, fontSize: "14px", fontWeight: "600", margin: 0 }}>Total: {filtered.length}</p>
            </div>
          </div>

          {/* Search + Add */}
          <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: "24px", flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray }} />
              <input type="text" placeholder="Search certifications..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "14px 16px 14px 48px", borderRadius: "8px", border: "1px solid #D1D5DB", width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
            </div>
            <button onClick={() => { resetForm(); setFormVisible(true); }}
              style={{ background: COLORS.orange, color: COLORS.white, border: "none", padding: "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <FaPlus /> Add Certification
            </button>
          </div>

          {/* Table */}
          <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loading ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: COLORS.textGray }}>Loading certifications...</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "900px" : "auto" }}>
                <thead>
                  <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                    {["#", "Title", "Level", "Duration", "Projects", "Status", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "18px 24px", textAlign: i === 6 ? "center" : "left", fontSize: "15px", fontWeight: "700" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((cert, index) => (
                    <tr key={cert._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray, fontWeight: "600" }}>{index + 1}</td>
                      <td style={{ padding: "18px 24px", color: COLORS.deepPurple, fontWeight: "600" }}>{cert.title}</td>
                      <td style={{ padding: "18px 24px" }}>
                        <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>{cert.level}</span>
                      </td>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray }}>{cert.duration || "—"}</td>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray }}>{cert.projects || "—"}</td>
                      <td style={{ padding: "18px 24px" }}>
                        <span style={{ background: cert.isActive ? "#d1fae5" : "#fee2e2", color: cert.isActive ? "#065f46" : "#991b1b", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                          {cert.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          {[
                            { onClick: () => setSelectedCert(cert),   icon: <FaEye size={14} />,    bg: "#10B981", title: "View"   },
                            { onClick: () => handleEdit(cert),         icon: <FaEdit size={14} />,   bg: COLORS.warning, title: "Edit" },
                            { onClick: () => handleToggle(cert._id),   icon: cert.isActive ? <FaToggleOn size={14}/> : <FaToggleOff size={14}/>, bg: "#6366f1", title: "Toggle" },
                            { onClick: () => handleDelete(cert._id),   icon: <FaTrash size={14} />,  bg: COLORS.danger, title: "Delete" },
                          ].map((btn, i) => (
                            <button key={i} onClick={btn.onClick} title={btn.title}
                              style={{ background: btn.bg, color: COLORS.white, border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No certifications found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {formVisible && (
        <Modal onClose={() => { setFormVisible(false); resetForm(); }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
            <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingId ? "Edit Certification" : "Create New Certification"}</h3>
            <button onClick={() => { setFormVisible(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={labelStyle}>Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Data Science Certification" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the certification..." required rows={3}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Duration</label>
                <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 6-8 Months" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Projects</label>
                <input value={projects} onChange={e => setProjects(e.target.value)} placeholder="e.g. 8+ Real Projects" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Level</label>
                <select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Beginner to Intermediate</option>
                  <option>All Levels</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} min="1" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Card Color</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    style={{ width: "50px", height: "42px", padding: "2px", borderRadius: "6px", border: "1px solid #D1D5DB", cursor: "pointer" }} />
                  <input value={color} onChange={e => setColor(e.target.value)} placeholder="#22013a" style={{ ...inputStyle, flex: 1 }} />
                </div>
              </div>
              <div>
                
              </div>
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>Key Skills</label>
              {skills.map((skill, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input value={skill} onChange={e => handleArrayChange(skills, setSkills, i, e.target.value)}
                    placeholder="e.g. Python" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px", outline: "none" }} />
                  {skills.length > 1 && (
                    <button type="button" onClick={() => removeArrayField(skills, setSkills, i)}
                      style={{ padding: "10px 15px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer" }}>×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayField(skills, setSkills)}
                style={{ padding: "8px 16px", background: COLORS.lightGray, color: COLORS.textGray, border: "1px dashed #9CA3AF", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                + Add Skill
              </button>
            </div>

            {/* Benefits */}
            <div>
              <label style={labelStyle}>Benefits</label>
              {benefits.map((benefit, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input value={benefit} onChange={e => handleArrayChange(benefits, setBenefits, i, e.target.value)}
                    placeholder="e.g. Industry-recognized credential" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px", outline: "none" }} />
                  {benefits.length > 1 && (
                    <button type="button" onClick={() => removeArrayField(benefits, setBenefits, i)}
                      style={{ padding: "10px 15px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer" }}>×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayField(benefits, setBenefits)}
                style={{ padding: "8px 16px", background: COLORS.lightGray, color: COLORS.textGray, border: "1px dashed #9CA3AF", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                + Add Benefit
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="button" onClick={() => { setFormVisible(false); resetForm(); }}
                style={{ flex: 1, padding: "14px", background: COLORS.lightGray, color: COLORS.textGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                style={{ flex: 2, padding: "14px", background: submitting ? COLORS.darkGray : COLORS.brightGreen, color: submitting ? COLORS.white : COLORS.deepPurple, border: "none", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: "600", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : editingId ? "Update Certification" : "Create Certification"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedCert && (
        <Modal onClose={() => setSelectedCert(null)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
            <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>👁 Certification Details</h3>
            <button onClick={() => setSelectedCert(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { label: "Title",       value: selectedCert.title },
              { label: "Description", value: selectedCert.description },
              { label: "Duration",    value: selectedCert.duration || "—" },
              { label: "Level",       value: selectedCert.level },
              { label: "Projects",    value: selectedCert.projects || "—" },
              { label: "Color",       value: selectedCert.color },
              { label: "Icon",        value: selectedCert.icon },
              { label: "Status",      value: selectedCert.isActive ? "Active" : "Inactive" },
              { label: "Skills",      value: selectedCert.skills?.join(", ") || "—" },
              { label: "Benefits",    value: selectedCert.benefits?.length ? (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {selectedCert.benefits.map((b, i) => <li key={i} style={{ color: COLORS.textGray, fontSize: "14px" }}>{b}</li>)}
                </ul>
              ) : "—" },
            ].map((item, index) => (
              <div key={index} style={{ padding: "12px", background: index % 2 === 0 ? COLORS.lightGray : COLORS.white, borderRadius: "8px", borderLeft: `3px solid ${COLORS.deepPurple}` }}>
                <strong style={{ color: COLORS.textGray, display: "block", marginBottom: "4px", fontSize: "14px" }}>{item.label}</strong>
                <div style={{ color: COLORS.deepPurple, fontSize: "14px" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminCertificationsPage;