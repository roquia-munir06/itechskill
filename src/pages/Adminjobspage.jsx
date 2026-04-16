import React, { useEffect, useState, useMemo } from "react";
import {
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
} from "../api/api";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaEye, FaTimes, FaToggleOn, FaToggleOff } from "react-icons/fa";

const COLORS = {
  sidebarDark:  "#1a1d2e",
  deepPurple:   "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen:  "#00D9A3",
  goldBadge:    "#D4A745",
  white:        "#FFFFFF",
  bgGray:       "#F9FAFB",
  lightGray:    "#F3F4F6",
  darkGray:     "#6B7280",
  textGray:     "#4B5563",
  danger:       "#EF4444",
  warning:      "#F59E0B",
  orange:       "#3D1A5B",
};

const Modal = ({ children, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" }}>
    <div style={{ background: COLORS.white, padding: "24px", borderRadius: "12px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
      {children}
    </div>
  </div>
);

const AdminJobsPage = () => {
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast]           = useState(null);
  const [search, setSearch]         = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMobile, setIsMobile]     = useState(window.innerWidth <= 768);

  // Form fields
  const [editingId, setEditingId]       = useState(null);
  const [title, setTitle]               = useState("");
  const [department, setDepartment]     = useState("");
  const [type, setType]                 = useState("Full-time");
  const [location, setLocation]         = useState("Remote");
  const [description, setDescription]   = useState("");
  const [requirements, setRequirements] = useState([""]);
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
    setEditingId(null); setTitle(""); setDepartment("");
    setType("Full-time"); setLocation("Remote");
    setDescription(""); setRequirements([""]); setDisplayOrder(999);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobsAdmin();
      const data = res.data;
      if (Array.isArray(data)) setJobs(data);
      else if (Array.isArray(data?.data)) setJobs(data.data);
      else setJobs([]);
    } catch (err) {
      showToast("Failed to load job openings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

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
      title, department, type, location, description,
      displayOrder: Number(displayOrder),
      requirements: requirements.filter(r => r.trim()),
    };
    try {
      setSubmitting(true);
      if (editingId) {
        await updateJob(editingId, payload);
        showToast("Job updated successfully.");
      } else {
        await createJob(payload);
        showToast("Job created successfully.");
      }
      setFormVisible(false);
      resetForm();
      await fetchJobs();
    } catch (err) {
      showToast(err.message || "Operation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this job opening?")) return;
    try {
      await deleteJob(id);
      showToast("Job deleted.");
      fetchJobs();
    } catch (err) {
      showToast(err.message || "Delete failed", "error");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleJobStatus(id);
      showToast("Status updated.");
      fetchJobs();
    } catch (err) {
      showToast("Toggle failed", "error");
    }
  };

  const handleEdit = (job) => {
    setEditingId(job._id);
    setTitle(job.title || "");
    setDepartment(job.department || "");
    setType(job.type || "Full-time");
    setLocation(job.location || "Remote");
    setDescription(job.description || "");
    setRequirements(job.requirements?.length ? job.requirements : [""]);
    setDisplayOrder(job.displayOrder ?? 999);
    setFormVisible(true);
  };

  const filtered = useMemo(() =>
    jobs.filter(j =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      j.type?.toLowerCase().includes(search.toLowerCase())
    ), [jobs, search]
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
              <h1 style={{ fontSize: isMobile ? "24px" : "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px" }}>¼ Job Openings Management</h1>
              <p style={{ color: COLORS.textGray, margin: 0, fontSize: "14px" }}>Create, edit & manage all open positions</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" }}>
              <p style={{ color: COLORS.deepPurple, fontSize: "14px", fontWeight: "600", margin: 0 }}>Total: {filtered.length}</p>
            </div>
          </div>

          {/* Search + Add */}
          <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: "24px", flexDirection: isMobile ? "column" : "row" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray }} />
              <input type="text" placeholder="Search by title, department, type..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ padding: "14px 16px 14px 48px", borderRadius: "8px", border: "1px solid #D1D5DB", width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
            </div>
            <button onClick={() => { resetForm(); setFormVisible(true); }}
              style={{ background: COLORS.orange, color: COLORS.white, border: "none", padding: "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <FaPlus /> Add Job Opening
            </button>
          </div>

          {/* Table */}
          <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            {loading ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid #f3f3f3", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: COLORS.textGray }}>Loading job openings...</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "950px" : "auto" }}>
                <thead>
                  <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                    {["#", "Title", "Department", "Type", "Location", "Status", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "18px 24px", textAlign: i === 6 ? "center" : "left", fontSize: "15px", fontWeight: "700" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map((job, index) => (
                    <tr key={job._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray, fontWeight: "600" }}>{index + 1}</td>
                      <td style={{ padding: "18px 24px", color: COLORS.deepPurple, fontWeight: "600" }}>{job.title}</td>
                      <td style={{ padding: "18px 24px" }}>
                        <span style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                          {job.department || "â€”"}
                        </span>
                      </td>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray }}>{job.type || "â€”"}</td>
                      <td style={{ padding: "18px 24px", color: COLORS.textGray }}>{job.location || "â€”"}</td>
                      <td style={{ padding: "18px 24px" }}>
                        <span style={{ background: job.isActive ? "#d1fae5" : "#fee2e2", color: job.isActive ? "#065f46" : "#991b1b", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>
                          {job.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td style={{ padding: "18px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          {[
                            { onClick: () => setSelectedJob(job),      icon: <FaEye size={14} />,    bg: "#10B981", title: "View"   },
                            { onClick: () => handleEdit(job),           icon: <FaEdit size={14} />,   bg: COLORS.warning, title: "Edit" },
                            { onClick: () => handleToggle(job._id),     icon: job.isActive ? <FaToggleOn size={14}/> : <FaToggleOff size={14}/>, bg: "#6366f1", title: "Toggle" },
                            { onClick: () => handleDelete(job._id),     icon: <FaTrash size={14} />,  bg: COLORS.danger, title: "Delete" },
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
                    <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No job openings found</td></tr>
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
            <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingId ? "Edit Job Opening" : "Create New Job Opening"}</h3>
            <button onClick={() => { setFormVisible(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <label style={labelStyle}>Job Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Full Stack Developer" required style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Description *</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the role and responsibilities..." required rows={3}
                style={{ ...inputStyle, resize: "vertical" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Department</label>
                <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Engineering" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Contract/Full-time</option>
                  <option>Internship</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Location</label>
                <select value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input type="number" value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} min="1" style={inputStyle} />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label style={labelStyle}>Requirements</label>
              {requirements.map((req, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input value={req} onChange={e => handleArrayChange(requirements, setRequirements, i, e.target.value)}
                    placeholder="e.g. 2+ years experience with React" style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "14px", outline: "none" }} />
                  {requirements.length > 1 && (
                    <button type="button" onClick={() => removeArrayField(requirements, setRequirements, i)}
                      style={{ padding: "10px 15px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer" }}>Ã—</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addArrayField(requirements, setRequirements)}
                style={{ padding: "8px 16px", background: COLORS.lightGray, color: COLORS.textGray, border: "1px dashed #9CA3AF", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}>
                + Add Requirement
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="button" onClick={() => { setFormVisible(false); resetForm(); }}
                style={{ flex: 1, padding: "14px", background: COLORS.lightGray, color: COLORS.textGray, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                style={{ flex: 2, padding: "14px", background: submitting ? COLORS.darkGray : COLORS.brightGreen, color: submitting ? COLORS.white : COLORS.deepPurple, border: "none", borderRadius: "8px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: "600", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Saving..." : editingId ? "Update Job" : "Create Job"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedJob && (
        <Modal onClose={() => setSelectedJob(null)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "16px" }}>
            <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>Job Opening Details</h3>
            <button onClick={() => setSelectedJob(null)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
          </div>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { label: "Title",       value: selectedJob.title },
              { label: "Description", value: selectedJob.description },
              { label: "Department",  value: selectedJob.department || "â€”" },
              { label: "Type",        value: selectedJob.type || "â€”" },
              { label: "Location",    value: selectedJob.location || "â€”" },
              { label: "Status",      value: selectedJob.isActive ? "Active" : "Inactive" },
              { label: "Requirements", value: selectedJob.requirements?.length ? (
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {selectedJob.requirements.map((r, i) => <li key={i} style={{ color: COLORS.textGray, fontSize: "14px" }}>{r}</li>)}
                </ul>
              ) : "â€”" },
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

export default AdminJobsPage;