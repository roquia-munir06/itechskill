// import React from "react";
// import { Navigate } from "react-router-dom";
// import { getCurrentUser } from "../api/api";
// import Dashboard from "./Dashboard";
// import TeacherDashboard, { ManagerDashboard } from "./Teacherdashboard";

// const DashboardRouter = () => {
//   const user = getCurrentUser();

//   if (!user) return <Navigate to="/login" replace />;

//   const role = user.role?.toLowerCase();

//   if (role === "admin")   return <Dashboard />;
//   if (role === "teacher") return <TeacherDashboard />;
//   if (role === "manager") return <ManagerDashboard />;

//   // student or anything else
//   return <Navigate to="/student/dashboard" replace />;
// };

// export default DashboardRouter;








import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/api";
import Dashboard from "./Dashboard";
import TeacherDashboard from "./TeacherDashboard";  // ✅ Correct case - Capital D
import ManagerDashboard from "./ManagerDashboard";  // ✅ Separate import

const DashboardRouter = () => {
  const user = getCurrentUser();

  // Loading state
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || user.Role || "").toLowerCase();

  // Role-based routing
  if (role === "admin") {
    return <Dashboard />;
  }
  
  if (role === "teacher") {
    return <TeacherDashboard />;
  }
  
  if (role === "manager") {
    return <ManagerDashboard />;
  }
  
  if (role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Default fallback
  return <Navigate to="/login" replace />;
};

export default DashboardRouter;