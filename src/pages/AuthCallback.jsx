// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const AuthCallback = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useAuth();

// useEffect(() => {
//   console.log('Full URL:', window.location.href);
//   const params = new URLSearchParams(location.search);
//   const userParam = params.get("user");
//   console.log('userParam:', userParam);  // ← is this null?
//   const errorParam = params.get("error");
//   console.log('errorParam:', errorParam);  // ← is this set?
  
//   if (!userParam) {
//     console.log('No user param, redirecting to login');
//     navigate("/login?error=github");
//     return;
//   }

//     const userData = JSON.parse(decodeURIComponent(userParam));
//     login(userData); 

//     const role = userData.role?.toLowerCase();
//     if (role === "admin") navigate("/admin/dashboard", { replace: true });
//     else if (role === "teacher") navigate("/teacher/dashboard", { replace: true });
//     else if (role === "manager") navigate("/manager/dashboard", { replace: true });
//     else navigate("/student/dashboard", { replace: true });

//   }, []);

//   return <div style={{ textAlign: "center", padding: 50 }}>Logging you in...</div>;
// };

// export default AuthCallback;








import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (!userParam) {
      navigate("/login?error=facebook");
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userParam));
      login(userData);
      const role = userData.role?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (role === "teacher") navigate("/teacher/dashboard", { replace: true });
      else if (role === "manager") navigate("/manager/dashboard", { replace: true });
      else navigate("/student/dashboard", { replace: true });
    } catch (err) {
      navigate("/login?error=facebook");
    }
  }, []);

  return <div style={{ textAlign: "center", padding: 50 }}>Logging you in...</div>;
};

export default AuthCallback;