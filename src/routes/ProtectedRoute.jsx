// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, role }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = user.role || user.Role;

//   if (role && userRole?.toLowerCase() !== role.toLowerCase()) {
//     if (userRole?.toLowerCase() === "admin") {
//       return <Navigate to="/admin/dashboard" replace />;
//     }
//     if (userRole?.toLowerCase() === "student") {
//       return <Navigate to="/student/dashboard" replace />;
//     }
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;













// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// /* ── redirect each role to their own dashboard ── */
// const getDashboard = (role) => {
//   switch (role?.toLowerCase()) {
//     case "admin":   return "/admin/dashboard";
//     case "teacher": return "/teacher/dashboard";
//     case "manager": return "/manager/dashboard";
//     case "student": return "/student/dashboard";
//     default:        return "/login";
//   }
// };

// /* ══════════════════════════════════════════
//    ProtectedRoute
//    Props:
//      role  — single string  e.g. role="Admin"
//      roles — array          e.g. roles={["Admin","Teacher"]}
//    Either prop works. roles takes priority.
// ══════════════════════════════════════════ */
// const ProtectedRoute = ({ children, role, roles }) => {
//   const { user, loading } = useAuth();

//   // ── Loading state ──
//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "100px", color: "#6b7280" }}>
//         Loading...
//       </div>
//     );
//   }

//   // ── Not logged in ──
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = (user.role || user.Role || "").toLowerCase();

//   // ── Check roles array e.g. roles={["Admin","Teacher","Manager"]} ──
//   if (roles && roles.length > 0) {
//     const allowed = roles.map(r => r.toLowerCase());
//     if (!allowed.includes(userRole)) {
//       // Wrong role → send to their own dashboard instead of /login
//       return <Navigate to={getDashboard(userRole)} replace />;
//     }
//     return children;
//   }

//   // ── Check single role e.g. role="Admin" ──
//   if (role) {
//     if (userRole !== role.toLowerCase()) {
//       // Wrong role → send to their own dashboard
//       return <Navigate to={getDashboard(userRole)} replace />;
//     }
//     return children;
//   }

//   // ── No role restriction — just needs to be logged in ──
//   return children;
// };

// export default ProtectedRoute;













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

  const userRole = (user.role || user.Role || "").toLowerCase();

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