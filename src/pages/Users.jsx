import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { FaEdit, FaTrash, FaKey, FaSearch, FaUserPlus, FaEye, FaTimes, FaMobile, FaDesktop, FaCircle, FaTablet } from "react-icons/fa";
import API, { getAllUsers, deleteUser, updateUser, createUser, getCourses, getActiveSessions, forceLogoutDevice } from "../api/api";

// Exact Color Theme
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
  onlineDot: "#22C55E",
};

// ── Role color map ──
const ROLE_COLORS = {
  Admin:   { bg: "#EDE9FE", color: "#5B21B6" },
  Student: { bg: "#E8DFF5", color: "#3D1A5B" },
  Teacher: { bg: "#D1FAE5", color: "#065F46" },
  Manager: { bg: "#FEF3C7", color: "#92400E" },
};

const getRoleStyle = (role) =>
  ROLE_COLORS[role] || { bg: COLORS.roleBg, color: COLORS.deepPurple };

const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px",
  }}>
    <div style={{
      background: COLORS.white, padding: "24px", borderRadius: "12px", width: "100%",
      maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    }}>
      {children}
    </div>
  </div>
);

const CoursesCheckbox = ({ courses, selectedCourses, onToggle, disabled }) => (
  <div style={{
    display: "flex", flexDirection: "column", border: `1px solid ${COLORS.darkGray}`,
    padding: "12px", borderRadius: "8px", maxHeight: "150px", overflowY: "auto", background: COLORS.lightGray,
  }}>
    {courses.map(course => (
      <label key={course._id} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: "8px", padding: "4px", color: disabled ? COLORS.darkGray : COLORS.textGray,
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" checked={selectedCourses.includes(course._id)}
            onChange={() => onToggle(course._id)} disabled={disabled}
            style={{ accentColor: COLORS.deepPurple, cursor: disabled ? "not-allowed" : "pointer" }} />
          <span style={{ fontWeight: selectedCourses.includes(course._id) ? "600" : "400" }}>
            {course.title}
          </span>
        </div>
      </label>
    ))}
  </div>
);

// ── Device Sessions Modal ──
const DeviceSessionsModal = ({ user, sessions, onClose, onForceLogout }) => {
  const userSessions = sessions.filter(
    s => s.user?._id === user._id || s.user?.toString() === user._id
  );

  const getDeviceType = (ua = "") => {
    if (/ipad|tablet/i.test(ua)) return "tablet";
    if (/mobile|android|iphone/i.test(ua)) return "mobile";
    return "desktop";
  };

  const getBrowser = (ua = "") => {
    const u = ua.toLowerCase();
    if (u.includes("edg"))                        return "🌐 Edge";
    if (u.includes("chrome"))                     return "🌐 Chrome";
    if (u.includes("firefox"))                    return "🦊 Firefox";
    if (u.includes("safari") && !u.includes("chrome")) return "🧭 Safari";
    return "🌐 Browser";
  };

  const getOS = (ua = "") => {
    const u = ua.toLowerCase();
    if (u.includes("windows")) return "Windows";
    if (u.includes("mac"))     return "macOS";
    if (u.includes("android")) return "Android";
    if (u.includes("iphone") || u.includes("ipad")) return "iOS";
    if (u.includes("linux"))   return "Linux";
    return "OS";
  };

  const getTimeDiff = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return `${diff} sec ago`;
    if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const formatIP = (ip) => {
    if (!ip || ip === "Unknown") return "Unknown IP";
    if (ip.includes("localhost") || ip.includes("127.0.0.1") || ip === "::1") return "🏠 Localhost";
    return ip;
  };

  return (
    <Modal onClose={onClose}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h3 style={{ color: COLORS.deepPurple, margin: 0, fontSize: "20px", fontWeight: "700" }}>
              📱 Active Sessions
            </h3>
            <p style={{ color: COLORS.darkGray, margin: "6px 0 0", fontSize: "14px" }}>
              <strong>{user.fullName}</strong> — {userSessions.length} device(s)
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "22px" }}>
            <FaTimes />
          </button>
        </div>

        {userSessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px 20px", background: COLORS.lightGray, borderRadius: "12px", color: COLORS.darkGray }}>
            <FaMobile size={40} style={{ marginBottom: "16px", opacity: 0.3 }} />
            <p style={{ margin: 0, fontWeight: "700", fontSize: "16px" }}>No active sessions</p>
            <p style={{ margin: "8px 0 0", fontSize: "14px", opacity: 0.7 }}>Offline</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {userSessions.map((session, i) => {
              const deviceType = getDeviceType(session.userAgent);
              const browser    = getBrowser(session.userAgent);
              const os         = getOS(session.userAgent);
              return (
                <div key={session._id} style={{
                  padding: "18px", border: `2px solid ${COLORS.lightGray}`, borderRadius: "12px",
                  background: COLORS.white, borderLeft: `5px solid ${COLORS.brightGreen}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", paddingBottom: "12px", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {deviceType === "mobile"  && <FaMobile  size={20} color={COLORS.deepPurple} />}
                      {deviceType === "tablet"  && <FaTablet  size={20} color={COLORS.deepPurple} />}
                      {deviceType === "desktop" && <FaDesktop size={20} color={COLORS.deepPurple} />}
                      <div>
                        <span style={{ fontWeight: "700", color: COLORS.deepPurple, fontSize: "15px", display: "block" }}>
                          Device {i + 1}
                        </span>
                        <span style={{ fontSize: "12px", color: COLORS.darkGray, fontWeight: "500" }}>
                          {deviceType === "mobile" ? "📱 Mobile" : deviceType === "tablet" ? "📱 Tablet" : "💻 Desktop"}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(34,197,94,0.1)", padding: "6px 12px", borderRadius: "20px", border: `1px solid ${COLORS.onlineDot}` }}>
                      <FaCircle size={8} color={COLORS.onlineDot} />
                      <span style={{ fontSize: "13px", color: COLORS.onlineDot, fontWeight: "700" }}>ONLINE</span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                    {[
                      { label: "Device ID",   value: session.deviceId ? `${session.deviceId.slice(0, 8)}-${session.deviceId.slice(-4)}` : "N/A", icon: "🔑" },
                      { label: "IP Address",  value: formatIP(session.ipAddress), icon: "🌐" },
                      { label: "Last Active", value: getTimeDiff(session.lastActive), icon: "⏱️" },
                      { label: "Login Time",  value: new Date(session.createdAt).toLocaleString("en-PK", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }), icon: "📅" },
                    ].map((item, idx) => (
                      <div key={idx} style={{ padding: "10px 12px", background: COLORS.bgGray, borderRadius: "8px", border: `1px solid ${COLORS.lightGray}` }}>
                        <p style={{ margin: 0, fontSize: "11px", color: COLORS.darkGray, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>
                          {item.icon} {item.label}
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: COLORS.textGray, fontWeight: "600", wordBreak: "break-word" }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "12px", background: COLORS.bgGray, borderRadius: "8px", border: `1px solid ${COLORS.lightGray}`, marginBottom: "10px" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: COLORS.darkGray, fontWeight: "700", textTransform: "uppercase", marginBottom: "6px" }}>
                      🖥️ SYSTEM INFO
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {[browser, `💾 ${os}`].map((tag, ti) => (
                        <span key={ti} style={{ background: COLORS.white, padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: COLORS.deepPurple, border: `1px solid ${COLORS.lightGray}` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <details style={{ marginTop: "8px" }}>
                    <summary style={{ cursor: "pointer", fontSize: "11px", color: COLORS.darkGray, fontWeight: "600", padding: "6px", background: COLORS.lightGray, borderRadius: "6px", userSelect: "none" }}>
                      📋 View Full User Agent
                    </summary>
                    <p style={{ margin: "8px 0 0", fontSize: "11px", color: COLORS.textGray, background: COLORS.bgGray, padding: "10px", borderRadius: "6px", wordBreak: "break-all", fontFamily: "monospace", lineHeight: "1.5" }}>
                      {session.userAgent || "Unknown"}
                    </p>
                  </details>

                  <button onClick={() => onForceLogout(session._id)} style={{ marginTop: "12px", width: "100%", padding: "10px", background: COLORS.danger, color: COLORS.white, border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>
                    🚫 Force Logout This Device
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "20px", padding: "12px 16px", background: "rgba(59,130,246,0.08)", border: `1px solid rgba(59,130,246,0.2)`, borderRadius: "8px", fontSize: "13px", color: COLORS.info, display: "flex", alignItems: "center", gap: "8px" }}>
          <span>ℹ️</span>
          <span>Max 2 devices. Auto-refresh every 10s.</span>
        </div>

        <button onClick={onClose} style={{ marginTop: "16px", width: "100%", padding: "14px", background: COLORS.deepPurple, color: COLORS.white, border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
          Close
        </button>
      </div>
    </Modal>
  );
};

// ── Main Page ──
const UsersPage = () => {
  const [users, setUsers]           = useState([]);
  const [courses, setCourses]       = useState([]);
  const [sessions, setSessions]     = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sessionUser, setSessionUser]   = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [roleFilter, setRoleFilter]     = useState("All");  // ✅ NEW role filter
  const [isMobile, setIsMobile]         = useState(window.innerWidth <= 768);

  const [formData, setFormData] = useState({
    fullName: "", email: "", role: "Student", phone: "", address: "",
    password: "", confirmPassword: "", status: "Active", courses: [],
    country: "", dob: "", gender: "Male", selectDate: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
  };

const fetchCourses = async () => {
  try {
    setCoursesLoading(true);
    // Use admin endpoint that bypasses role filtering
    const { data } = await API.get("/courses/admin/all");
    const coursesList = data?.courses || [];
    setCourses(coursesList);
  } catch (error) {
    console.error("❌ Fetch courses error:", error);
    // Fallback to regular endpoint
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : data?.courses || []);
    } catch (e) {
      setCourses([]);
    }
  } finally {
    setCoursesLoading(false);
  }
};

  const fetchSessions = async () => {
    try {
      const data = await getActiveSessions();
      setSessions(data.sessions || []);
    } catch { setSessions([]); }
  };

 useEffect(() => {
  const fetchAll = async () => { 
    await fetchUsers(); 
    await fetchCourses(); 
    await fetchSessions(); 
  };
  fetchAll();
  
  // Add this to check courses after fetch
  setTimeout(() => {
    console.log("Final courses state:", courses);
  }, 2000);
  
  const interval = setInterval(fetchAll, 10000);
  return () => clearInterval(interval);
}, []);

  const getSessionCount = (userId) =>
    sessions.filter(s => s.user?._id === userId || s.user?.toString() === userId).length;

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
      status: user.status || "Active", courses: user.courses?.map(c => c._id) || [],
      country: user.country || "", dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      gender: user.gender || "Male", selectDate: user.selectDate ? new Date(user.selectDate).toISOString().split("T")[0] : "",
    });
    setFormVisible(true);
  };

  const handleShowDetails = (user) => setSelectedUser(user);
  const handleCloseDetails = () => setSelectedUser(null);
  const handleShowSessions = (user) => setSessionUser(user);
  const handleCloseSessions = () => setSessionUser(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(c => c !== courseId)
        : [...prev.courses, courseId],
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try { await deleteUser(id); fetchUsers(); }
    catch { alert("Failed to delete!"); }
  };

  // const handleResetPassword = async (userId) => {
  //   const newPassword = prompt("Enter new password:");
  //   if (!newPassword) return;
  //   try { await updateUser(userId, { password: newPassword }); alert("Password reset!"); }
  //   catch { alert("Failed!"); }
  // };


  const handleResetPassword = async (userId) => {
  const newPassword = prompt("Enter new password (min 6 chars):");
  if (!newPassword) return;

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    await updateUser(userId, { password: newPassword }); // ya { newPassword }
    alert("Password reset successfully!");
  } catch (error) {
    console.log("Reset Error:", error.response?.data || error);
    alert(error.response?.data?.message || "Failed to reset password!");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser && formData.password !== formData.confirmPassword) return alert("Passwords don't match!");
    if (!formData.phone) return alert("Phone required!");

    try {
      const payload = {
        fullName: formData.fullName, email: formData.email, role: formData.role,
        phone: formData.phone, address: formData.address, status: formData.status,
        courses: formData.courses, country: formData.country, dob: formData.dob,
        gender: formData.gender, selectDate: formData.selectDate,
      };
      if (!editingUser) payload.password = formData.password;

      if (editingUser) {
        await updateUser(editingUser._id, payload);
        alert("Updated!");
      } else {
        await createUser(payload);
        alert("Created!");
      }
      setFormVisible(false);
      fetchUsers();
    } catch (error) { alert(error.response?.data?.message || "Failed!"); }
  };

  const handleForceLogout = async (sessionId) => {
    if (!window.confirm("Force logout this device?")) return;
    try {
      await forceLogoutDevice(sessionId);
      const data = await getActiveSessions();
      setSessions(data.sessions || []);
      alert("Device logged out successfully");
    } catch { alert("Failed to logout device"); }
  };

  const getCourseNames = (userCourses) => {
    if (!Array.isArray(userCourses)) return [];
    return userCourses
      .map(c => (typeof c === "string" ? courses.find(cr => cr._id === c)?.title : c.title))
      .filter(Boolean);
  };

  // ── Role summary counts ──
  const roleCounts = useMemo(() => {
    const counts = { All: users.length, Admin: 0, Student: 0, Teacher: 0, Manager: 0 };
    users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchRole   = roleFilter === "All" || user.role === roleFilter;
      const courseTitles = getCourseNames(user.courses).join(" ").toLowerCase();
      const matchSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitles.includes(searchTerm.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, searchTerm, roleFilter, courses]);

  const onlineUserIds = new Set(sessions.map(s => s.user?._id || s.user?.toString()));

  // ── Courses checkbox disabled for Admin/Teacher/Manager (not student-course related) ──
const coursesDisabled = ["Admin", "Manager"].includes(formData.role);

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <div style={{ ...styles.mainContent, marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 16px 32px 16px" : "32px" }}>

        {/* ── Header ── */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div><h1 style={styles.pageTitle}>User Management</h1></div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={styles.liveDataBadge}>
                <p style={styles.liveDataText}>Total: {filteredUsers.length}</p>
              </div>
              <div style={{ ...styles.liveDataBadge, background: "linear-gradient(135deg, rgba(0,217,163,0.1) 0%, rgba(0,217,163,0.05) 100%)", border: "1px solid rgba(0,217,163,0.3)" }}>
                <p style={{ ...styles.liveDataText, color: "#059669" }}>🟢 Online: {onlineUserIds.size}</p>
              </div>
            </div>
          </div>

          {/* ── Role Filter Chips ── */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            {["All", "Admin", "Student", "Teacher", "Manager"].map(role => (
              <button key={role} onClick={() => setRoleFilter(role)} style={{
                padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
                fontWeight: "700", fontSize: "13px",
                background: roleFilter === role ? COLORS.deepPurple : COLORS.lightGray,
                color: roleFilter === role ? COLORS.white : COLORS.textGray,
                transition: "all 0.2s",
              }}>
                {role === "All"     ? "👥" :
                 role === "Admin"   ? "👑" :
                 role === "Student" ? "🎓" :
                 role === "Teacher" ? "📖" : "📋"} {role}
                <span style={{ marginLeft: "6px", fontSize: "11px", opacity: 0.8 }}>
                  ({roleCounts[role] || 0})
                </span>
              </button>
            ))}
          </div>

          {/* ── Search + Add ── */}
          <div style={{ display: "flex", gap: isMobile ? "12px" : "20px", marginBottom: isMobile ? "24px" : "30px", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: isMobile ? "100%" : "650px" }}>
              <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" }} />
              <input type="text" placeholder="Search by name, email or course..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: isMobile ? "12px 16px 12px 48px" : "14px 16px 14px 48px", borderRadius: "8px", border: `1px solid #D1D5DB`, width: "100%", fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" }} />
            </div>
            <button onClick={handleAdd} style={{ background: COLORS.deepPurple, color: COLORS.white, border: "none", padding: isMobile ? "12px 24px" : "14px 28px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <FaUserPlus /> Add User
            </button>
          </div>

          {/* ── Table ── */}
          <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "900px" : "auto" }}>
              <thead>
                <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                  {["#", "Name", "Email", "Role", "Status", "Phone", "Courses", "🟢 Devices", "Actions"].map((h, i) => (
                    <th key={i} style={{ padding: isMobile ? "14px 16px" : "18px 20px", textAlign: h === "Actions" ? "center" : "left", fontSize: isMobile ? "13px" : "14px", fontWeight: "700" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user, index) => {
                  const sessionCount = getSessionCount(user._id);
                  const isOnline     = sessionCount > 0;
                  const roleStyle    = getRoleStyle(user.role);
                  return (
                    <tr key={user._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: index % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" }}>{index + 1}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {isOnline && <FaCircle size={8} color={COLORS.onlineDot} />}
                          <span style={{ color: COLORS.deepPurple, fontWeight: "600", fontSize: "14px" }}>{user.fullName}</span>
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px", color: COLORS.textGray, fontSize: "13px" }}>{user.email}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        <span style={{ background: roleStyle.bg, color: roleStyle.color, padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>
                          {user.role === "Admin"   ? "👑 Admin"   :
                           user.role === "Teacher" ? "📖 Teacher" :
                           user.role === "Manager" ? "📋 Manager" :
                           user.role === "Student" ? "🎓 Student" : user.role}
                        </span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        <span style={{ background: user.status === "Active" ? COLORS.brightGreen : COLORS.darkGray, color: COLORS.white, padding: "5px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>{user.status}</span>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px", color: COLORS.textGray, fontSize: "13px" }}>{user.phone || "-"}</td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {getCourseNames(user.courses).map((course, i) => (
                            <span key={i} style={{ background: COLORS.goldBadge, color: "#3D2817", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "600" }}>{course}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        {/* Show device sessions button for Student, Teacher, Manager */}
                        {user.role !== "Admin" ? (
                          <button onClick={() => handleShowSessions(user)} style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: isOnline ? "rgba(34,197,94,0.12)" : COLORS.lightGray,
                            border: `1px solid ${isOnline ? COLORS.onlineDot : "#D1D5DB"}`,
                            borderRadius: "20px", padding: "5px 12px", cursor: "pointer",
                            fontSize: "12px", fontWeight: "700", color: isOnline ? "#15803D" : COLORS.darkGray, whiteSpace: "nowrap",
                          }}>
                            {isOnline ? <FaCircle size={7} color={COLORS.onlineDot} /> : <FaCircle size={7} color="#9CA3AF" />}
                            {sessionCount}/2
                            {isOnline ? <FaMobile size={10} /> : <span style={{ fontSize: "10px" }}>Offline</span>}
                          </button>
                        ) : <span style={{ color: COLORS.darkGray, fontSize: "12px" }}>—</span>}
                      </td>
                      <td style={{ padding: isMobile ? "14px 16px" : "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                          <button onClick={() => handleShowDetails(user)} style={actionBtn("#10B981")} title="View"><FaEye size={13} /></button>
                          <button onClick={() => handleEdit(user)}        style={actionBtn("#F59E0B")} title="Edit"><FaEdit size={13} /></button>
                          <button onClick={() => handleDelete(user._id)}  style={actionBtn("#EF4444")} title="Delete"><FaTrash size={13} /></button>
                          <button onClick={() => handleResetPassword(user._id)} style={actionBtn("#3B82F6")} title="Reset Password"><FaKey size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="9" style={{ padding: "40px", textAlign: "center", color: COLORS.darkGray }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {formVisible && (
        <Modal onClose={() => setFormVisible(false)}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>{editingUser ? "Edit" : "Add"} User</h3>
              <button onClick={() => setFormVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Full Name", name: "fullName", type: "text" },
                { label: "Email",     name: "email",    type: "email" },
                { label: "Phone",     name: "phone",    type: "text" },
              ].map(f => (
                <div key={f.name}>
                  <label style={formLabel}>{f.label}</label>
                  <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleChange} required style={formInput} />
                </div>
              ))}

              {!editingUser && (
                <>
                  <div><label style={formLabel}>Password</label><input name="password" type="password" value={formData.password} onChange={handleChange} required style={formInput} /></div>
                  <div><label style={formLabel}>Confirm Password</label><input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required style={formInput} /></div>
                </>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* ✅ UPDATED: All 4 roles available */}
                <div>
                  <label style={formLabel}>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={formInput}>
                    <option value="Student">🎓 Student</option>
                    <option value="Teacher">📖 Teacher</option>
                    <option value="Manager">📋 Manager</option>
                    <option value="Admin">👑 Admin</option>
                  </select>
                </div>
                <div>
                  <label style={formLabel}>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={formInput}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Role info banner */}
              {formData.role !== "Student" && (
  <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "600",
    background: formData.role === "Admin"   ? "#EDE9FE" :
                 formData.role === "Teacher" ? "#D1FAE5" : "#FEF3C7",
    color:      formData.role === "Admin"   ? "#5B21B6" :
                 formData.role === "Teacher" ? "#065F46" : "#92400E",
  }}>
    {formData.role === "Admin"   && "👑 Admin: Full access to all features"}
    {formData.role === "Teacher" && "📖 Teacher: Can upload lectures, assignments & mock exams. Select courses below to assign."}
    {formData.role === "Manager" && "📋 Manager: Can manage blogs & diploma programs"}
  </div>
)}
{/* Courses Section - FIXED */}
<div>
  <label style={formLabel}>
    {formData.role === "Teacher" ? "📚 Assigned Courses (Teacher will teach these)" : 
     formData.role === "Student" ? "📚 Enrolled Courses" : 
     "Courses"}
    {coursesDisabled && formData.role !== "Teacher" && 
      <span style={{ color: COLORS.darkGray, fontSize: "12px", fontWeight: "400" }}>
        (not applicable for {formData.role})
      </span>
    }
  </label>
  
  {/* Show loading state */}
  {coursesLoading ? (
    <div style={{ 
      padding: "20px", 
      textAlign: "center", 
      background: COLORS.lightGray, 
      borderRadius: "8px",
      color: COLORS.darkGray
    }}>
      Loading courses...
    </div>
  ) : courses.length === 0 ? (
    <div style={{ 
      padding: "20px", 
      textAlign: "center", 
      background: COLORS.lightGray, 
      borderRadius: "8px",
      color: COLORS.darkGray,
      border: `1px solid ${COLORS.darkGray}`
    }}>
      <p>⚠️ No courses available.</p>
      <p style={{ fontSize: "12px", marginTop: "8px" }}>
        Please create courses first in the Courses section.
      </p>
    </div>
  ) : (
    <CoursesCheckbox
      courses={courses}
      selectedCourses={formData.courses}
      onToggle={handleCheckbox}
      disabled={coursesDisabled}
    />
  )}
</div>


{/* Teacher course assignment helper */}
{formData.role === "Teacher" && (
  <div style={{ 
    padding: "12px", 
    background: "#D1FAE5", 
    borderRadius: "8px", 
    fontSize: "13px", 
    fontWeight: "500",
    color: "#065F46",
    borderLeft: `4px solid ${COLORS.brightGreen}`
  }}>
    <strong>💡 Teacher Assignment Info:</strong><br />
    • Select courses above that this teacher will be responsible for<br />
    • Teachers will only see and manage their assigned courses<br />
    • Students enrolled in these courses will see this teacher
  </div>
)}

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", border: "none", background: COLORS.deepPurple, color: COLORS.white, fontWeight: "600", cursor: "pointer", flex: 1 }}>
                  {editingUser ? "Update" : "Add"} User
                </button>
                <button type="button" onClick={() => setFormVisible(false)} style={{ padding: "12px 24px", borderRadius: "8px", border: "none", background: COLORS.danger, color: COLORS.white, fontWeight: "600", cursor: "pointer", flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ── View Details Modal ── */}
      {selectedUser && (
        <Modal onClose={handleCloseDetails}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: COLORS.deepPurple, margin: 0 }}>User Details</h3>
              <button onClick={handleCloseDetails} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.deepPurple, fontSize: "20px" }}><FaTimes /></button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { label: "Name",    value: selectedUser.fullName },
                { label: "Email",   value: selectedUser.email },
                { label: "Phone",   value: selectedUser.phone || "-" },
                { label: "Role",    value: selectedUser.role },
                { label: "Status",  value: selectedUser.status },
                { label: "Devices", value: `${getSessionCount(selectedUser._id)}/2` },
                { label: "Courses", value: getCourseNames(selectedUser.courses).join(", ") || "None" },
              ].map((item, i) => {
                const roleStyle = item.label === "Role" ? getRoleStyle(item.value) : null;
                return (
                  <div key={i} style={{ padding: "12px", background: i % 2 === 0 ? COLORS.lightGray : COLORS.white, borderRadius: "8px", borderLeft: `3px solid ${COLORS.deepPurple}` }}>
                    <strong style={{ color: COLORS.textGray, display: "block", marginBottom: "4px", fontSize: "14px" }}>{item.label}</strong>
                    {roleStyle ? (
                      <span style={{ background: roleStyle.bg, color: roleStyle.color, padding: "3px 10px", borderRadius: "6px", fontSize: "13px", fontWeight: "700" }}>{item.value}</span>
                    ) : (
                      <span style={{ color: COLORS.deepPurple, fontSize: "14px" }}>{item.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Sessions Modal ── */}
      {sessionUser && (
        <DeviceSessionsModal
          user={sessionUser}
          sessions={sessions}
          onClose={handleCloseSessions}
          onForceLogout={handleForceLogout}
        />
      )}
    </div>
  );
};

const actionBtn = (bg) => ({
  background: bg, color: "#fff", border: "none", padding: "7px 9px",
  borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
});
const formLabel = { display: "block", marginBottom: "6px", color: "#4B5563", fontWeight: "600", fontSize: "14px" };
const formInput = { padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", width: "100%", boxSizing: "border-box", fontSize: "14px", background: "#fff" };

const styles = {
  pageContainer:  { display: "flex", backgroundColor: "#f9fafb", minHeight: "100vh" },
  mainContent:    { flex: 1, overflowX: "hidden" },
  headerSection:  { marginBottom: "32px" },
  headerTop:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  pageTitle:      { fontSize: "28px", fontWeight: "700", color: "#3D1A5B", margin: 0, marginBottom: "8px" },
  liveDataBadge:  { background: "linear-gradient(135deg, rgba(61,26,91,0.1) 0%, rgba(94,66,123,0.1) 100%)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: "12px 16px" },
  liveDataText:   { color: "#3D1A5B", fontSize: "14px", fontWeight: "600", margin: 0 },
};

export default UsersPage;