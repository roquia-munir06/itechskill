import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import {
  FaEdit, FaTrash, FaKey, FaSearch, FaUserPlus, FaEye,
  FaTimes, FaMobile, FaDesktop, FaCircle, FaTablet,
  FaUserGraduate, FaChalkboardTeacher, FaLock, FaUnlock,
  FaBookOpen, FaUserShield,
} from "react-icons/fa";
import API from "../api/api";

// ── Color Theme (matches your existing theme) ──
const C = {
  sidebarDark:  "#1a1d2e",
  deepPurple:   "#3D1A5B",
  headerPurple: "#4B2D7A",
  brightGreen:  "#00D9A3",
  goldBadge:    "#D4A745",
  roleBg:       "#E8DFF5",
  white:        "#FFFFFF",
  bgGray:       "#F9FAFB",
  lightGray:    "#F3F4F6",
  darkGray:     "#6B7280",
  textGray:     "#4B5563",
  danger:       "#EF4444",
  warning:      "#F59E0B",
  info:         "#3B82F6",
  onlineDot:    "#22C55E",
  amber:        "#F59E0B",
};

const ROLE_COLORS = {
  Admin:   { bg: "#EDE9FE", color: "#5B21B6" },
  Student: { bg: "#E8DFF5", color: "#3D1A5B" },
  Teacher: { bg: "#D1FAE5", color: "#065F46" },
  Manager: { bg: "#FEF3C7", color: "#92400E" },
};

const getRoleStyle = (role) => ROLE_COLORS[role] || { bg: C.roleBg, color: C.deepPurple };

// ── Reusable Modal ──
const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000, padding: "16px",
  }}>
    <div style={{
      background: C.white, padding: "28px", borderRadius: "14px", width: "100%",
      maxWidth: "640px", maxHeight: "90vh", overflowY: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    }}>
      {children}
    </div>
  </div>
);

// ── Course Access Checkbox List ──
const CoursesCheckbox = ({ courses, selectedCourses, onToggle, disabled }) => (
  <div style={{
    display: "flex", flexDirection: "column", border: `1px solid #D1D5DB`,
    padding: "12px", borderRadius: "10px", maxHeight: "180px",
    overflowY: "auto", background: disabled ? "#F9FAFB" : C.white, gap: "4px",
  }}>
    {courses.length === 0 && (
      <p style={{ color: C.darkGray, fontSize: "13px", margin: 0, textAlign: "center", padding: "12px" }}>
        No courses available
      </p>
    )}
    {courses.map(course => {
      const checked = selectedCourses.includes(course._id);
      return (
        <label key={course._id} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "8px 10px", borderRadius: "8px", cursor: disabled ? "not-allowed" : "pointer",
          background: checked ? "rgba(61,26,91,0.06)" : "transparent",
          border: checked ? `1px solid rgba(61,26,91,0.2)` : "1px solid transparent",
          transition: "all 0.15s",
        }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(course._id)}
            disabled={disabled}
            style={{ accentColor: C.deepPurple, width: "16px", height: "16px", cursor: disabled ? "not-allowed" : "pointer" }}
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: checked ? "600" : "400", color: disabled ? C.darkGray : C.textGray, fontSize: "13px" }}>
              {course.title}
            </span>
            {course.category && (
              <span style={{ marginLeft: "8px", fontSize: "11px", color: C.darkGray, background: C.lightGray, padding: "1px 6px", borderRadius: "4px" }}>
                {course.category}
              </span>
            )}
          </div>
        </label>
      );
    })}
  </div>
);

// ── View Details Modal ──
const UserDetailsModal = ({ user, courses, sessions, onClose }) => {
  const getCourseNames = (ids = []) =>
    (ids || []).filter(Boolean).map(id => {
      const c = courses.find(x => x._id === id || x._id === id?._id);
      return c ? c.title : null;
    }).filter(Boolean);

  const sessionCount = sessions.filter(
    s => s.user?._id === user._id || s.user?.toString() === user._id
  ).length;

  const roleStyle = getRoleStyle(user.role);

  return (
    <Modal onClose={onClose}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: roleStyle.bg, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "22px",
            }}>
              {user.role === "Teacher" ? "📖" : user.role === "Admin" ? "👑" : user.role === "Manager" ? "📋" : "🎓"}
            </div>
            <div>
              <h3 style={{ color: C.deepPurple, margin: 0, fontSize: "18px", fontWeight: "700" }}>{user.fullName}</h3>
              <span style={{ ...roleStyle, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "700" }}>
                {user.role}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.darkGray, fontSize: "20px" }}>
            <FaTimes />
          </button>
        </div>

        <div style={{ display: "grid", gap: "10px" }}>
          {[
            { icon: "✉️", label: "Email",   value: user.email },
            { icon: "📞", label: "Phone",   value: user.phone || "—" },
            { icon: "🌍", label: "Country", value: user.country || "—" },
            { icon: "👤", label: "Gender",  value: user.gender || "—" },
            { icon: "📅", label: "DOB",     value: user.dob ? new Date(user.dob).toLocaleDateString() : "—" },
            { icon: "📟", label: "Devices", value: `${sessionCount}/2 active` },
            { icon: "🔒", label: "Status",  value: user.status || "Active" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 14px", background: i % 2 === 0 ? C.bgGray : C.white,
              borderRadius: "8px", borderLeft: `3px solid ${C.deepPurple}22`,
            }}>
              <span style={{ fontSize: "16px" }}>{item.icon}</span>
              <span style={{ color: C.darkGray, fontSize: "13px", fontWeight: "600", minWidth: "70px" }}>{item.label}</span>
              <span style={{ color: C.deepPurple, fontSize: "13px", fontWeight: "500" }}>{item.value}</span>
            </div>
          ))}

          {/* Courses */}
          <div style={{ padding: "12px 14px", background: C.bgGray, borderRadius: "8px", borderLeft: `3px solid ${C.goldBadge}` }}>
            <span style={{ color: C.darkGray, fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              📚 Course Access ({getCourseNames(user.courses).length})
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {getCourseNames(user.courses).length === 0
                ? <span style={{ color: C.darkGray, fontSize: "12px" }}>No courses assigned</span>
                : getCourseNames(user.courses).map((name, i) => (
                  <span key={i} style={{ background: C.goldBadge + "22", color: "#92400E", border: `1px solid ${C.goldBadge}44`, padding: "3px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                    {name}
                  </span>
                ))
              }
            </div>
          </div>
        </div>

        <button onClick={onClose} style={{ marginTop: "20px", width: "100%", padding: "12px", background: C.deepPurple, color: C.white, border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
};

// ── Main Manager Users Page ──
const ManagerUsersPage = () => {
  const [users, setUsers]               = useState([]);
  const [courses, setCourses]           = useState([]);
  const [sessions, setSessions]         = useState([]);
  const [formVisible, setFormVisible]   = useState(false);
  const [editingUser, setEditingUser]   = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [courseModal, setCourseModal]   = useState(null); // user for quick course assignment
  const [searchTerm, setSearchTerm]     = useState("");
  const [roleFilter, setRoleFilter]     = useState("All");
  const [loading, setLoading]           = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "", email: "", role: "Student", phone: "", address: "",
    password: "", confirmPassword: "", status: "Active", courses: [],
    country: "", dob: "", gender: "Male", selectDate: "",
  });

  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  // ── API calls ──
  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/manager/users");
      setUsers(Array.isArray(data) ? data : data?.users || []);
    } catch (e) {
      console.error("Fetch users error:", e);
      setUsers([]);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const { data } = await API.get("/courses/admin/all");
      setCourses(data?.courses || []);
    } catch (e) {
      console.error("Fetch courses error:", e);
      try {
        const { data } = await API.get("/courses");
        setCourses(data?.courses || []);
      } catch { setCourses([]); }
    } finally { setCoursesLoading(false); }
  };

  const fetchSessions = async () => {
    try {
      const { data } = await API.get("/manager/sessions");
      setSessions(data?.sessions || []);
    } catch { setSessions([]); }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchCourses(), fetchSessions()]);
      setLoading(false);
    };
    init();
    const interval = setInterval(() => { fetchUsers(); fetchSessions(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ── Helpers ──
  const extractCourseIds = (courseArr = []) =>
    (courseArr || []).filter(Boolean).map(c =>
      (c && typeof c === "object" && c._id) ? c._id : typeof c === "string" ? c : null
    ).filter(Boolean);

  const getCourseNames = (ids = []) =>
    extractCourseIds(ids).map(id => {
      const c = courses.find(x => x._id === id);
      return c ? c.title : null;
    }).filter(Boolean);

  const getSessionCount = (userId) =>
    sessions.filter(s => s.user?._id === userId || s.user?.toString() === userId).length;

  // ── Handlers ──
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({ fullName: "", email: "", role: "Student", phone: "", address: "", password: "", confirmPassword: "", status: "Active", courses: [], country: "", dob: "", gender: "Male", selectDate: "" });
    setFormVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "", email: user.email || "", role: user.role || "Student",
      phone: user.phone || "", address: user.address || "", password: "", confirmPassword: "",
      status: user.status || "Active", courses: extractCourseIds(user.courses),
      country: user.country || "", gender: user.gender || "Male",
      dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      selectDate: user.selectDate ? new Date(user.selectDate).toISOString().split("T")[0] : "",
    });
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/manager/users/${id}`);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete user");
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password (min 6 chars):");
    if (!newPassword) return;
    if (newPassword.length < 6) return alert("Password must be at least 6 characters");
    try {
      await API.put(`/manager/users/${userId}/reset-password`, { password: newPassword });
      alert("Password reset successfully!");
    } catch (e) {
      alert(e.response?.data?.message || "Failed to reset password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && formData.password !== formData.confirmPassword)
      return alert("Passwords don't match!");
    if (!formData.phone) return alert("Phone is required!");

    setSubmitLoading(true);
    try {
      const payload = {
        fullName: formData.fullName, email: formData.email, role: formData.role,
        phone: formData.phone, address: formData.address, status: formData.status,
        courses: formData.courses, country: formData.country, dob: formData.dob,
        gender: formData.gender, selectDate: formData.selectDate,
      };
      if (!editingUser) payload.password = formData.password;

      if (editingUser) {
        await API.put(`/manager/users/${editingUser._id}`, payload);
        alert("User updated successfully!");
      } else {
        await API.post("/manager/users", payload);
        alert("User created successfully!");
      }
      setFormVisible(false);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Operation failed!");
    } finally { setSubmitLoading(false); }
  };

  // ── Quick course access modal ──
  const handleQuickCourseAccess = (user) => {
    setCourseModal({ ...user, _courseIds: extractCourseIds(user.courses) });
  };

  const handleSaveCourseAccess = async () => {
    if (!courseModal) return;
    try {
      await API.put(`/manager/users/${courseModal._id}/courses`, { courses: courseModal._courseIds });
      alert("Course access updated!");
      setCourseModal(null);
      fetchUsers();
    } catch (e) {
      alert(e.response?.data?.message || "Failed to update course access");
    }
  };

  const toggleCourseInModal = (courseId) => {
    setCourseModal(prev => ({
      ...prev,
      _courseIds: prev._courseIds.includes(courseId)
        ? prev._courseIds.filter(c => c !== courseId)
        : [...prev._courseIds, courseId],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (courseId) => {
    if (!courseId) return;
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(c => c !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  // ── Role stats ──
  const roleCounts = useMemo(() => {
    const c = { All: users.length, Admin: 0, Student: 0, Teacher: 0, Manager: 0 };
    users.forEach(u => { if (c[u.role] !== undefined) c[u.role]++; });
    return c;
  }, [users]);

  const filteredUsers = useMemo(() => users.filter(u => {
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const courseStr = getCourseNames(u.courses).join(" ").toLowerCase();
    const matchSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseStr.includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  }), [users, roleFilter, searchTerm, courses]);

  const onlineIds = new Set(sessions.map(s => s.user?._id || s.user?.toString()));
  const coursesDisabled = formData.role === "Admin" || formData.role === "Manager";

  if (loading) return (
    <div style={{ display: "flex", backgroundColor: C.bgGray, minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: isMobile ? 0 : 280 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 44, height: 44, border: "3px solid #e5e7eb", borderTop: `3px solid ${C.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
          <p style={{ color: C.darkGray, marginTop: 16 }}>Loading users...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", backgroundColor: C.bgGray, minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? 0 : 280, padding: isMobile ? "80px 16px 32px" : "32px" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FEF3C7", color: "#92400E", border: "1px solid #F59E0B40", borderRadius: "20px", padding: "3px 12px", fontSize: "12px", fontWeight: "700", marginBottom: "6px" }}>
              📋 Manager
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: C.deepPurple, margin: "0 0 4px", letterSpacing: "-0.5px" }}>
              User & Teacher Management
            </h1>
            <p style={{ color: C.darkGray, fontSize: "14px", margin: 0 }}>
              Create, edit, delete users and manage their course access
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(61,26,91,0.08)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "10px 16px" }}>
              <p style={{ color: C.deepPurple, fontSize: "13px", fontWeight: "700", margin: 0 }}>
                👥 Total: {filteredUsers.length}
              </p>
            </div>
            <div style={{ background: "rgba(0,217,163,0.08)", border: "1px solid rgba(0,217,163,0.3)", borderRadius: "8px", padding: "10px 16px" }}>
              <p style={{ color: "#059669", fontSize: "13px", fontWeight: "700", margin: 0 }}>
                🟢 Online: {onlineIds.size}
              </p>
            </div>
          </div>
        </div>

        {/* ── Role Filter Chips ── */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          {[
            { key: "All",     icon: "👥" },
            { key: "Student", icon: "🎓" },
            { key: "Teacher", icon: "📖" },
            { key: "Manager", icon: "📋" },
            { key: "Admin",   icon: "👑" },
          ].map(({ key, icon }) => (
            <button key={key} onClick={() => setRoleFilter(key)} style={{
              padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
              fontWeight: "700", fontSize: "13px", transition: "all 0.2s",
              background: roleFilter === key ? C.deepPurple : C.lightGray,
              color: roleFilter === key ? C.white : C.textGray,
            }}>
              {icon} {key} <span style={{ marginLeft: "4px", fontSize: "11px", opacity: 0.75 }}>({roleCounts[key] || 0})</span>
            </button>
          ))}
        </div>

        {/* ── Search + Add ── */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: C.darkGray, fontSize: "14px" }} />
            <input
              type="text"
              placeholder="Search by name, email or course..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: "13px 14px 13px 42px", borderRadius: "10px", border: "1px solid #D1D5DB", width: "100%", fontSize: "14px", background: C.white, boxSizing: "border-box", outline: "none" }}
            />
          </div>
          <button onClick={handleAdd} style={{
            background: C.deepPurple, color: C.white, border: "none",
            padding: "13px 24px", borderRadius: "10px", cursor: "pointer",
            fontWeight: "700", fontSize: "14px", display: "flex", alignItems: "center",
            gap: "8px", whiteSpace: "nowrap",
          }}>
            <FaUserPlus /> Add User / Teacher
          </button>
        </div>

        {/* ── Table ── */}
        <div style={{ background: C.white, borderRadius: "14px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "960px" : "auto" }}>
            <thead>
              <tr style={{ background: C.headerPurple, color: C.white }}>
                {["#", "Name", "Email", "Role", "Status", "Phone", "Courses", "Devices", "Actions"].map((h, i) => (
                  <th key={i} style={{ padding: "16px 18px", textAlign: h === "Actions" ? "center" : "left", fontSize: "13px", fontWeight: "700", letterSpacing: "0.3px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan="9" style={{ padding: "48px", textAlign: "center", color: C.darkGray, fontSize: "14px" }}>
                  No users found
                </td></tr>
              ) : filteredUsers.map((user, idx) => {
                const sessionCount = getSessionCount(user._id);
                const isOnline     = sessionCount > 0;
                const roleStyle    = getRoleStyle(user.role);
                const courseNames  = getCourseNames(user.courses);

                return (
                  <tr key={user._id} style={{ borderBottom: `1px solid ${C.lightGray}`, background: idx % 2 === 0 ? C.white : C.bgGray, transition: "background 0.15s" }}>
                    <td style={td}>{idx + 1}</td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {isOnline && <FaCircle size={7} color={C.onlineDot} />}
                        <span style={{ color: C.deepPurple, fontWeight: "600", fontSize: "14px" }}>{user.fullName}</span>
                      </div>
                    </td>
                    <td style={{ ...td, fontSize: "13px" }}>{user.email}</td>
                    <td style={td}>
                      <span style={{ background: roleStyle.bg, color: roleStyle.color, padding: "4px 11px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
                        {user.role === "Admin" ? "👑" : user.role === "Teacher" ? "📖" : user.role === "Manager" ? "📋" : "🎓"} {user.role}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ background: user.status === "Active" ? "#D1FAE5" : "#F3F4F6", color: user.status === "Active" ? "#065F46" : C.darkGray, padding: "4px 11px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ ...td, fontSize: "13px" }}>{user.phone || "—"}</td>
                    <td style={td}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxWidth: "200px" }}>
                        {courseNames.length === 0
                          ? <span style={{ color: C.darkGray, fontSize: "12px" }}>—</span>
                          : courseNames.slice(0, 2).map((name, i) => (
                            <span key={i} style={{ background: C.goldBadge + "22", color: "#92400E", padding: "2px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "600" }}>
                              {name}
                            </span>
                          ))
                        }
                        {courseNames.length > 2 && (
                          <span style={{ background: C.lightGray, color: C.darkGray, padding: "2px 8px", borderRadius: "5px", fontSize: "11px", fontWeight: "600" }}>
                            +{courseNames.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={td}>
                      <div style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        background: isOnline ? "rgba(34,197,94,0.1)" : C.lightGray,
                        border: `1px solid ${isOnline ? C.onlineDot : "#D1D5DB"}`,
                        borderRadius: "16px", padding: "4px 10px", width: "fit-content",
                      }}>
                        <FaCircle size={6} color={isOnline ? C.onlineDot : "#9CA3AF"} />
                        <span style={{ fontSize: "12px", fontWeight: "700", color: isOnline ? "#15803D" : C.darkGray }}>
                          {sessionCount}/2
                        </span>
                      </div>
                    </td>
                    <td style={{ ...td, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "5px", flexWrap: "wrap" }}>
                        <button onClick={() => setSelectedUser(user)} style={actionBtn("#10B981")} title="View Details"><FaEye size={12} /></button>
                        <button onClick={() => handleEdit(user)}        style={actionBtn("#F59E0B")} title="Edit User"><FaEdit size={12} /></button>
                        <button onClick={() => handleQuickCourseAccess(user)} style={actionBtn("#3B82F6")} title="Manage Course Access"><FaBookOpen size={12} /></button>
                        <button onClick={() => handleResetPassword(user._id)} style={actionBtn("#8B5CF6")} title="Reset Password"><FaKey size={12} /></button>
                        <button onClick={() => handleDelete(user._id)}  style={actionBtn("#EF4444")} title="Delete User"><FaTrash size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
              <div>
                <h3 style={{ color: C.deepPurple, margin: 0, fontSize: "18px", fontWeight: "800" }}>
                  {editingUser ? "✏️ Edit User" : "➕ Add New User"}
                </h3>
                <p style={{ color: C.darkGray, fontSize: "13px", margin: "4px 0 0" }}>
                  {editingUser ? "Update user details and course access" : "Create a new user or teacher account"}
                </p>
              </div>
              <button onClick={() => setFormVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", color: C.darkGray, fontSize: "20px" }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Basic Fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={lbl}>Full Name</label>
                  <input name="fullName" type="text" value={formData.fullName} onChange={handleChange} required style={inp} placeholder="Enter full name" />
                </div>
                <div>
                  <label style={lbl}>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} required style={inp} placeholder="Enter email" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={lbl}>Phone Number</label>
                  <input name="phone" type="text" value={formData.phone} onChange={handleChange} required style={inp} placeholder="Enter phone" />
                </div>
                <div>
                  <label style={lbl}>Country</label>
                  <input name="country" type="text" value={formData.country} onChange={handleChange} style={inp} placeholder="Enter country" />
                </div>
              </div>

              {!editingUser && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={lbl}>Password</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required style={inp} placeholder="Min 6 characters" />
                  </div>
                  <div>
                    <label style={lbl}>Confirm Password</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required style={inp} placeholder="Repeat password" />
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={lbl}>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={inp}>
                    <option value="Student">🎓 Student</option>
                    <option value="Teacher">📖 Teacher</option>
                    <option value="Manager">📋 Manager</option>
                    <option value="Admin">👑 Admin</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={inp}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} style={inp}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Role Info Banner */}
              {formData.role !== "Student" && (
                <div style={{
                  padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                  background: formData.role === "Admin" ? "#EDE9FE" : formData.role === "Teacher" ? "#D1FAE5" : "#FEF3C7",
                  color: formData.role === "Admin" ? "#5B21B6" : formData.role === "Teacher" ? "#065F46" : "#92400E",
                  borderLeft: `4px solid ${formData.role === "Admin" ? "#8B5CF6" : formData.role === "Teacher" ? "#10B981" : "#F59E0B"}`,
                }}>
                  {formData.role === "Admin"   && "👑 Admin: Full system access to all features and settings"}
                  {formData.role === "Teacher" && "📖 Teacher: Can upload lectures, assignments & mock exams. Assign courses below."}
                  {formData.role === "Manager" && "📋 Manager: Can manage blogs, diploma programs, users & teachers"}
                </div>
              )}

              {/* Course Access Section */}
              <div>
                <label style={{ ...lbl, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>
                    {formData.role === "Teacher" ? "📚 Assigned Courses (Teacher will teach these)" :
                     formData.role === "Student" ? "📚 Enrolled Courses (Student can access these)" :
                     "📚 Course Access"}
                  </span>
                  {!coursesDisabled && (
                    <span style={{ fontSize: "11px", color: C.deepPurple, fontWeight: "700" }}>
                      {formData.courses.length} selected
                    </span>
                  )}
                </label>

                {coursesDisabled ? (
                  <div style={{ padding: "14px", background: C.lightGray, borderRadius: "8px", color: C.darkGray, fontSize: "13px", textAlign: "center" }}>
                    🔒 Course access is not applicable for {formData.role} role
                  </div>
                ) : coursesLoading ? (
                  <div style={{ padding: "20px", textAlign: "center", background: C.lightGray, borderRadius: "8px", color: C.darkGray }}>
                    Loading courses...
                  </div>
                ) : (
                  <CoursesCheckbox
                    courses={courses}
                    selectedCourses={formData.courses}
                    onToggle={handleCheckbox}
                    disabled={coursesDisabled}
                  />
                )}

                {formData.role === "Teacher" && !coursesDisabled && (
                  <p style={{ fontSize: "12px", color: "#065F46", margin: "6px 0 0", background: "#D1FAE5", padding: "8px 12px", borderRadius: "6px" }}>
                    💡 Teachers only see and manage their assigned courses. Students enrolled in these courses will see this teacher.
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={submitLoading}
                  style={{ padding: "13px 24px", borderRadius: "8px", border: "none", background: submitLoading ? "#9CA3AF" : C.deepPurple, color: C.white, fontWeight: "700", cursor: submitLoading ? "not-allowed" : "pointer", flex: 1, fontSize: "14px" }}
                >
                  {submitLoading ? "Saving..." : editingUser ? "Update User" : "Create User"}
                </button>
                <button type="button" onClick={() => setFormVisible(false)} style={{ padding: "13px 24px", borderRadius: "8px", border: "none", background: C.lightGray, color: C.textGray, fontWeight: "700", cursor: "pointer", flex: 1, fontSize: "14px" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ── Quick Course Access Modal ── */}
      {courseModal && (
        <Modal onClose={() => setCourseModal(null)}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ color: C.deepPurple, margin: 0, fontSize: "18px", fontWeight: "800" }}>
                  📚 Manage Course Access
                </h3>
                <p style={{ color: C.darkGray, fontSize: "13px", margin: "4px 0 0" }}>
                  <strong>{courseModal.fullName}</strong> — {courseModal.role}
                </p>
              </div>
              <button onClick={() => setCourseModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: C.darkGray, fontSize: "20px" }}>
                <FaTimes />
              </button>
            </div>

            <div style={{ marginBottom: "16px", padding: "12px 14px", background: C.bgGray, borderRadius: "8px", fontSize: "13px", color: C.textGray }}>
              <strong>Currently assigned:</strong>{" "}
              {courseModal._courseIds.length === 0
                ? "No courses"
                : courseModal._courseIds.map(id => {
                  const c = courses.find(x => x._id === id);
                  return c ? c.title : null;
                }).filter(Boolean).join(", ")
              }
            </div>

            <label style={lbl}>Select / Deselect Courses</label>
            {coursesLoading ? (
              <p style={{ color: C.darkGray, fontSize: "13px" }}>Loading courses...</p>
            ) : (
              <CoursesCheckbox
                courses={courses}
                selectedCourses={courseModal._courseIds}
                onToggle={toggleCourseInModal}
                disabled={false}
              />
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button onClick={handleSaveCourseAccess} style={{ flex: 1, padding: "13px", background: C.deepPurple, color: C.white, border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                💾 Save Course Access
              </button>
              <button onClick={() => setCourseModal(null)} style={{ flex: 1, padding: "13px", background: C.lightGray, color: C.textGray, border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "14px" }}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── View Details Modal ── */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          courses={courses}
          sessions={sessions}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

// ── Shared micro styles ──
const td         = { padding: "14px 18px", color: "#4B5563", fontSize: "14px" };
const actionBtn  = (bg) => ({ background: bg, color: "#fff", border: "none", padding: "7px 8px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" });
const lbl        = { display: "block", marginBottom: "6px", color: C.textGray, fontWeight: "600", fontSize: "13px" };
const inp        = { padding: "10px 12px", borderRadius: "8px", border: "1px solid #D1D5DB", width: "100%", boxSizing: "border-box", fontSize: "14px", background: "#fff", outline: "none" };

export default ManagerUsersPage;