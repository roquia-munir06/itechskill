import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaClipboardList,
  FaComment,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ITSLogo from "../assets/ITS.png";

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      // navigate("/login", { replace: true });
      navigate("/", { replace: true });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div style={styles.mobileHeader}>
          <button onClick={toggleMobileMenu} style={styles.menuToggle}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img src={ITSLogo} alt="ITS Logo" style={styles.mobileLogoImg} />
          <div style={{ width: "40px" }}></div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div style={styles.overlay} onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <div
        style={{
          ...styles.sidebar,
          ...(isMobile ? styles.sidebarMobile : {}),
          ...(isMobile && !isMobileMenuOpen ? styles.sidebarHidden : {}),
        }}
      >
        {/* Logo Section with Circular Design */}
        <div style={styles.logoWrapper}>
          <div style={styles.logoCircle}>
            <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={styles.nav}>
          <ul style={styles.menu}>
            <li>
              <Link
                to="/student/dashboard"
                style={{
                  ...styles.link,
                  ...(isActive("/student/dashboard") ? styles.activeLink : {}),
                }}
                onClick={closeMobileMenu}
              >
                <div style={styles.iconWrapper}>
                  <FaTachometerAlt />
                </div>
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/courses"
                style={{
                  ...styles.link,
                  ...(isActive("/student/courses") ? styles.activeLink : {}),
                }}
                onClick={closeMobileMenu}
              >
                <div style={styles.iconWrapper}>
                  <FaBook />
                </div>
                <span>My Courses</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/exams"
                style={{
                  ...styles.link,
                  ...(isActive("/student/exams") ? styles.activeLink : {}),
                }}
                onClick={closeMobileMenu}
              >
                <div style={styles.iconWrapper}>
                  <FaClipboardList />
                </div>
                <span>Mock Exams</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/messages"
                style={{
                  ...styles.link,
                  ...(isActive("/student/messages") ? styles.activeLink : {}),
                }}
                onClick={closeMobileMenu}
              >
                <div style={styles.iconWrapper}>
                  <FaComment />
                </div>
                <span>Messages</span>
              </Link>
            </li>
          </ul>

          {/* Logout Button */}
          <div style={styles.logoutContainer}>
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
              }}
            >
              <div style={styles.iconWrapper}>
                <FaSignOutAlt />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default StudentSidebar;

// Styles
const styles = {
  mobileHeader: {
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    zIndex: 1001,
  },
  menuToggle: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileLogoImg: {
    height: "40px",
    width: "auto",
    objectFit: "contain",
  },
  overlay: {
    display: "block",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "280px",
    height: "100vh",
    background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.3)",
    zIndex: 1000,
    transition: "transform 0.3s ease-in-out",
  },
  sidebarMobile: {
    top: "60px",
    height: "calc(100vh - 60px)",
  },
  sidebarHidden: {
    transform: "translateX(-100%)",
  },
  logoWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  logoCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#ffffff",
    padding: "4px",
    boxShadow: "0 8px 24px rgba(123, 67, 151, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: "92px",
    height: "92px",
    borderRadius: "50%",
    objectFit: "contain",
    background: "transparent",
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
  },
  menu: {
    listStyle: "none",
    padding: "0 15px",
    margin: 0,
    flex: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "14px 18px",
    color: "#e0e0e8",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "20px",
    borderRadius: "12px",
    margin: "6px 0",
    transition: "all 0.3s ease",
  },
  activeLink: {
    background:
      "linear-gradient(135deg, rgba(123, 67, 151, 0.25) 0%, rgba(220, 156, 99, 0.25) 100%)",
    color: "#dca863",
    boxShadow: "0 4px 12px rgba(123, 67, 151, 0.3)",
  },
  iconWrapper: {
    width: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  logoutContainer: {
    padding: "15px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "16px 20px",
    width: "100%",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "12px",
    color: "#ff6b6b",
    fontWeight: "600",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};