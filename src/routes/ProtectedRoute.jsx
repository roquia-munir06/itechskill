import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ── redirect each role to their own dashboard ── */
const getDashboard = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":   return "/admin/dashboard";
    case "teacher": return "/teacher/dashboard";
    case "manager": return "/manager/dashboard";
    case "student": return "/student/dashboard";
    default:        return "/login";
  }
};

/* ══════════════════════════════════════════
   ProtectedRoute
   Props:
     role  — single string  e.g. role="Admin"
     roles — array          e.g. roles={["Admin","Teacher"]}
   Either prop works. roles takes priority.
══════════════════════════════════════════ */
const ProtectedRoute = ({ children, role, roles }) => {
  const { user, loading } = useAuth();

  // ADD THIS:
  console.log("🛡️ ProtectedRoute:", { 
    path: window.location.pathname,
    user: user?.role, 
    loading, 
    requiredRole: role, 
    requiredRoles: roles 
  });
    console.log("🛡️ ProtectedRoute check:", { user, loading, role, roles });
  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        marginTop: "100px", 
        color: "#6b7280",
        fontSize: "16px",
        fontWeight: "500"
      }}>
        Loading...
      </div>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return <Navigate to="/login" replace />;
  }
// ✅ REPLACE WITH:
const userRole = (
  user?.role || 
  user?.Role || 
  user?.user?.role ||   // ← add this
  user?.userRole || 
  ""
).toLowerCase();
console.log("Full user object:", JSON.stringify(user));
console.log("🎯 userRole extracted:", userRole, "from user:", user);

  // ── Check roles array e.g. roles={["Admin","Teacher","Manager"]} ──
  if (roles && roles.length > 0) {
    const allowed = roles.map(r => r.toLowerCase());
    if (!allowed.includes(userRole)) {
      // Wrong role → send to their own dashboard instead of /login
      return <Navigate to={getDashboard(userRole)} replace />;
    }
    return children;
  }

  // ── Check single role e.g. role="Admin" ──
  if (role) {
    if (userRole !== role.toLowerCase()) {
      // Wrong role → send to their own dashboard
      return <Navigate to={getDashboard(userRole)} replace />;
    }
    return children;
  }

  // ── No role restriction — just needs to be logged in ──
  return children;
};

export default ProtectedRoute;