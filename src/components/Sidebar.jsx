import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers, FaUser, FaBook, FaClipboardList, FaComment,
  FaSignOutAlt, FaChartBar, FaTachometerAlt, FaBars,
  FaTimes, FaBlog, FaGraduationCap, FaLayerGroup,
  FaShoppingBag,
  FaCertificate
} from "react-icons/fa";
import ITSLogo from "../assets/ITS.png";
import { getCurrentUser, logoutUser } from "../api/api";

/* ─────────────────────────────────────────────
   Menu config per role
───────────────────────────────────────────── */
const MENU = {
  admin: [
    { label: "Dashboard",    to: "/admin/dashboard",    icon: <FaTachometerAlt /> },
    { label: "Users",        to: "/users",              icon: <FaUsers />         },
    { label: "Students",     to: "/students",           icon: <FaUser />          },
    { label: "Courses",      to: "/courses",            icon: <FaBook />          },
    { label: "Diplomas",     to: "/admin/diplomas",     icon: <FaGraduationCap /> },
    { label: "Programs",     to: "/admin/programs",     icon: <FaLayerGroup />    },
    { label: "Enrollments",  to: "/admin/inquiries",    icon: <FaClipboardList /> }, // ✅ ADDED THIS
    { label: "Orders",  to: "/admin/orders",    icon: <FaShoppingBag /> }, 

  { label: "Certifications",  to: "/admin/certifications",    icon: <FaCertificate /> }, 
    { label: "Mock Exams",   to: "/mockexams",          icon: <FaClipboardList /> },
    { label: "Exam Results", to: "/admin/exam-results", icon: <FaChartBar />      },
    { label: "Blogs",        to: "/admin/blogs",        icon: <FaBlog />          },
    { label: "Vendor Certs", to: "/admin/vendor-certifications", icon: <FaCertificate /> },

    { label: "Messages",     to: "/admin/messages",     icon: <FaComment />       },
  ],
  teacher: [
    { label: "Dashboard",    to: "/teacher/dashboard",  icon: <FaTachometerAlt /> },
    // ✅ FIXED: /courses shows all courses, teacher clicks "My Lectures" per course
    { label: "Courses",      to: "/courses",            icon: <FaBook />          },
    { label: "Mock Exams",   to: "/teacher/mockexams",  icon: <FaClipboardList /> },
    { label: "Messages",     to: "/admin/messages",     icon: <FaComment />       },
  ],
  manager: [
    { label: "Dashboard",    to: "/manager/dashboard",  icon: <FaTachometerAlt /> },
    { label: "Users",        to: "/users",              icon: <FaUsers />         },
    { label: "Blogs",        to: "/manager/blogs",      icon: <FaBlog />          },
    { label: "Diplomas",     to: "/manager/diplomas",   icon: <FaGraduationCap /> },
    { label: "Programs",     to: "/manager/programs",   icon: <FaLayerGroup />    },
    { label: "Messages",     to: "/admin/messages",     icon: <FaComment />       },
  ],
  student: [
    { label: "Dashboard",    to: "/student/dashboard",  icon: <FaTachometerAlt /> },
    { label: "My Courses",   to: "/student/courses",    icon: <FaBook />          },
    { label: "Exams",        to: "/student/exams",      icon: <FaClipboardList /> },
    { label: "Messages",     to: "/student/messages",   icon: <FaComment />       },
  ],
};

const ROLE_COLOR = {
  admin:   { primary: "#7B4397", accent: "#dca863" },
  teacher: { primary: "#059669", accent: "#34d399" },
  manager: { primary: "#d97706", accent: "#fbbf24" },
  student: { primary: "#2563eb", accent: "#60a5fa" },
};

const ROLE_LABEL = {
  admin:   "👑 Admin",
  teacher: "📖 Teacher",
  manager: "📋 Manager",
  student: "🎓 Student",
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const user      = getCurrentUser();
  const role      = user?.role?.toLowerCase() || "student";
  const menuItems = MENU[role] || MENU.student;
  const colors    = ROLE_COLOR[role] || ROLE_COLOR.student;

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    try { await logoutUser(); } catch (_) {}
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const SidebarContent = () => (
    <div style={{ ...styles.sidebar, background: "linear-gradient(180deg, #0f0c1a 0%, #1a1528 60%, #0f1923 100%)" }}>

      {/* Logo + Role Badge */}
      <div style={styles.logoSection}>
        <div style={{ ...styles.logoRing, boxShadow: `0 0 0 3px ${colors.primary}40, 0 8px 24px ${colors.primary}50` }}>
          <img src={ITSLogo} alt="ITS" style={styles.logoImg} />
        </div>
        <div style={{ ...styles.roleBadge, background: `${colors.primary}22`, border: `1px solid ${colors.primary}55`, color: colors.accent }}>
          {ROLE_LABEL[role]}
        </div>
        {user?.fullName && <p style={styles.userName}>{user.fullName}</p>}
      </div>

      <div style={{ ...styles.divider, background: `linear-gradient(90deg, transparent, ${colors.primary}60, transparent)` }} />

      {/* Nav Items */}
      <nav style={styles.nav}>
        <ul style={styles.menu}>
          {menuItems.map((item, i) => {
            const active = isActive(item.to);
            return (
              <li key={i}>
                <Link
                  to={item.to}
                  style={{
                    ...styles.link,
                    ...(active ? {
                      background:  `linear-gradient(135deg, ${colors.primary}30, ${colors.accent}18)`,
                      color:       colors.accent,
                      borderLeft:  `3px solid ${colors.accent}`,
                      boxShadow:   `0 4px 12px ${colors.primary}25`,
                    } : {}),
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = `${colors.primary}18`;
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#c8c8d8";
                    }
                  }}
                >
                  <span style={{
                    ...styles.iconBox,
                    background: active ? `${colors.primary}40` : "rgba(255,255,255,0.07)",
                    color:      active ? colors.accent           : "#9090a8",
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>
                    {item.label}
                  </span>
                  {active && <span style={{ ...styles.activeDot, background: colors.accent }} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div style={styles.logoutSection}>
        <div style={{ ...styles.divider, background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.3), transparent)", marginBottom: 12 }} />
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"; }}
        >
          <span style={{ ...styles.iconBox, background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button onClick={() => setIsMobileMenuOpen(p => !p)} style={styles.menuToggle}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img src={ITSLogo} alt="ITS" style={{ height: 36, width: "auto", objectFit: "contain" }} />
          <div style={{ ...styles.roleBadge, fontSize: 11, padding: "3px 10px", background: `${colors.primary}22`, border: `1px solid ${colors.primary}55`, color: colors.accent }}>
            {ROLE_LABEL[role]}
          </div>
        </div>
      )}

      {isMobile && isMobileMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ position: "fixed", top: 0, left: 0, width: 280, height: "100vh", zIndex: 1000 }}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Sliding Sidebar */}
      {isMobile && (
        <div style={{
          position: "fixed", top: 60, left: 0,
          width: 280, height: "calc(100vh - 60px)",
          zIndex: 1000,
          transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}>
          <SidebarContent />
        </div>
      )}
    </>
  );
};

const styles = {
  sidebar:      { width: "100%", height: "100%", display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" },
  logoSection:  { display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px 16px", gap: 10 },
  logoRing:     { width: 88, height: 88, borderRadius: "50%", background: "#fff", padding: 3, display: "flex", alignItems: "center", justifyContent: "center" },
  logoImg:      { width: 80, height: 80, borderRadius: "50%", objectFit: "contain" },
  roleBadge:    { fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5 },
  userName:     { color: "#c8c8d8", fontSize: 13, fontWeight: 500, margin: 0, textAlign: "center", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  divider:      { height: 1, margin: "4px 20px 12px", borderRadius: 1 },
  nav:          { flex: 1, padding: "0 12px" },
  menu:         { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 },
  link:         { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", color: "#c8c8d8", textDecoration: "none", borderRadius: 10, borderLeft: "3px solid transparent", transition: "all 0.2s ease", position: "relative" },
  iconBox:      { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, transition: "all 0.2s" },
  activeDot:    { width: 6, height: 6, borderRadius: "50%", marginLeft: "auto", flexShrink: 0 },
  logoutSection:{ padding: "0 12px 20px" },
  logoutBtn:    { display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", width: "100%", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, color: "#f87171", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s ease", textAlign: "left" },
  mobileHeader: { display: "flex", position: "fixed", top: 0, left: 0, right: 0, height: 60, background: "linear-gradient(90deg, #0f0c1a 0%, #1a1528 100%)", alignItems: "center", justifyContent: "space-between", padding: "0 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.4)", zIndex: 1001 },
  menuToggle:   { background: "transparent", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 8, display: "flex", alignItems: "center" },
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999 },
};

export default Sidebar;