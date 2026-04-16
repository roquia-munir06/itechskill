// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/api";
// import ITSLogo from "../assets/ITS.png";
// import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   /* ================= INPUT ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   /* ================= VALIDATION ================= */
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim())
//       newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Email is invalid";

//     if (!formData.password)
//       newErrors.password = "Password is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ================= LOGIN ================= */
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       const response = await loginUser({
//         email: formData.email,
//         password: formData.password,
//       });

//       // ✅ Auth context update
//       login(response.user);

//       // ✅ Role based redirect
//       if (response.user.role?.toLowerCase() === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/student/dashboard");
//       }

//     } catch (error) {
//       console.error("❌ Login error:", error);

//       const backendMessage =
//         error.response?.data?.message || "Login failed";

//       const newErrors = {};

//       if (backendMessage.toLowerCase().includes("email")) {
//         newErrors.email = backendMessage;
//       } else if (backendMessage.toLowerCase().includes("password")) {
//         newErrors.password = backendMessage;
//       } else {
//         newErrors.email = backendMessage;
//         newErrors.password = backendMessage;
//       }

//       setErrors(newErrors);
//     } finally {
//       setLoading(false); // ✅ VERY IMPORTANT
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         {/* Logo */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>
//           Sign in to continue to your account
//         </p>

//         {/* Email */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Email Address"
//               style={styles.inputField}
//             />
//           </div>
//           {errors.email && <span style={styles.error}>{errors.email}</span>}
//         </div>

//         {/* Password */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               style={styles.inputField}
//             />
//             <span
//               style={styles.passwordToggle}
//               onClick={() => setShowPassword((p) => !p)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && (
//             <span style={styles.error}>{errors.password}</span>
//           )}
//         </div>

//         {/* Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             ...styles.button,
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span
//             style={styles.registerLink}
//             onClick={() => navigate("/register")}
//           >
//             Register here
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// /* ⚠️ styles SAME as tumhare — no change */
// const styles = {
//   container: {
//     minHeight: "100vh",
//     // minHeight: "calc(100vh - 80px)",
//     paddingTop: "100px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
//     padding: "20px",
//   },
//   form: {
//     width: "100%",
//     maxWidth: "450px",
//     margin: "0 auto",
//     padding: "40px 30px",
//     borderRadius: "20px",
//     boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
//     background: "rgba(255, 255, 255, 0.98)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   logoSection: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   logoCircle: {
//     width: "80px",
//     height: "80px",
//     borderRadius: "50%",
//     background: "#ffffff",
//     padding: "3px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)",
//     marginBottom: "15px",
//   },
//   logoImg: {
//     width: "74px",
//     height: "74px",
//     borderRadius: "50%",
//     objectFit: "contain",
//     background: "transparent",
//   },
//   brandTitle: {
//     margin: "0 0 5px 0",
//     fontSize: "28px",
//     fontWeight: "700",
//     background: "#693683",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//     letterSpacing: "2px",
//   },
//   brandTagline: {
//     margin: 0,
//     fontSize: "12px",
//     color: "#666",
//     fontWeight: "400",
//     letterSpacing: "0.5px",
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: "5px",
//     marginTop: "10px",
//     color: "#1a1a2e",
//     fontSize: "26px",
//     fontWeight: "700"
//   },
//   subheading: {
//     textAlign: "center",
//     margin: "0 0 10px 0",
//     color: "#666",
//     fontSize: "14px",
//     fontWeight: "400",
//   },
//   inputWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "6px",
//   },
//   inputContainer: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//   },
//   icon: {
//     position: "absolute",
//     left: "15px",
//     color: "#888",
//     fontSize: "16px",
//     zIndex: 1,
//   },
//   inputField: {
//     width: "100%",
//     padding: "14px 15px 14px 45px",
//     borderRadius: "10px",
//     border: "2px solid #e5e7eb",
//     fontSize: "15px",
//     transition: "all 0.3s ease",
//     outline: "none",
//     backgroundColor: "#fff",
//   },
//   passwordToggle: {
//     position: "absolute",
//     right: "15px",
//     cursor: "pointer",
//     color: "#888",
//     fontSize: "16px",
//     zIndex: 1,
//   },
//   button: {
//     padding: "14px",
//     border: "none",
//     borderRadius: "10px",
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: "16px",
//     transition: "all 0.3s ease",
//     marginTop: "10px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "10px",
//   },
//   error: {
//     color: "#ef4444",
//     fontSize: "13px",
//     marginLeft: "5px",
//     fontWeight: "500",
//   },
//   registerText: {
//     textAlign: "center",
//     fontSize: "14px",
//     color: "#666",
//     marginTop: "5px",
//   },
//   registerLink: {
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
// };
// export default Login;










// import React, { useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../api/api";
// import ITSLogo from "../assets/ITS.png";
// import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";
// import { useLocation } from 'react-router-dom';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);
// const location = useLocation();
// const redirectTo = location.state?.redirectTo || '/';
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   /* ================= INPUT ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   /* ================= VALIDATION ================= */
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim())
//       newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email))
//       newErrors.email = "Email is invalid";

//     if (!formData.password)
//       newErrors.password = "Password is required";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* ================= LOGIN ================= */
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrors({});

//     try {
//       const response = await loginUser({
//         email: formData.email,
//         password: formData.password,
//       });
// navigate(redirectTo);
//       // ✅ Auth context update
//      login(response.user);

// if (location.state?.redirectTo) {
//   navigate(location.state.redirectTo);
// } else if (response.user.role?.toLowerCase() === "admin") {
//   navigate("/admin/dashboard");
// } else {
//   navigate("/student/dashboard");
// }

//     } catch (error) {
//       console.error("❌ Login error:", error);

//       const backendMessage =
//         error.response?.data?.message || "Login failed";

//       const newErrors = {};

//       if (backendMessage.toLowerCase().includes("email")) {
//         newErrors.email = backendMessage;
//       } else if (backendMessage.toLowerCase().includes("password")) {
//         newErrors.password = backendMessage;
//       } else {
//         newErrors.email = backendMessage;
//         newErrors.password = backendMessage;
//       }

//       setErrors(newErrors);
//     } finally {
//       setLoading(false); // ✅ VERY IMPORTANT
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         {/* Logo */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>
// {location.state?.message && (
//   <p style={{
//     textAlign: 'center',
//     color: '#7c3aed',
//     background: '#f3f0ff',
//     padding: '10px 16px',
//     borderRadius: '8px',
//     fontSize: '14px',
//     fontWeight: '500',
//     margin: '0'
//   }}>
//     ℹ️ {location.state.message}
//   </p>
// )}
//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>
//           Sign in to continue to your account
//         </p>

//         {/* Email */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Email Address"
//               style={styles.inputField}
//             />
//           </div>
//           {errors.email && <span style={styles.error}>{errors.email}</span>}
//         </div>

//         {/* Password */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               style={styles.inputField}
//             />
//             <span
//               style={styles.passwordToggle}
//               onClick={() => setShowPassword((p) => !p)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && (
//             <span style={styles.error}>{errors.password}</span>
//           )}
//         </div>

//         {/* Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             ...styles.button,
//             opacity: loading ? 0.7 : 1,
//           }}
//         >
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span
//             style={styles.registerLink}
//             onClick={() => navigate("/register")}
//           >
//             Register here
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// /* ⚠️ styles SAME as tumhare — no change */
// const styles = {
//   container: {
//     minHeight: "100vh",
//     // minHeight: "calc(100vh - 80px)",
//     paddingTop: "100px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
//     padding: "20px",
//   },
//   form: {
//     width: "100%",
//     maxWidth: "450px",
//     margin: "0 auto",
//     padding: "40px 30px",
//     borderRadius: "20px",
//     boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
//     background: "rgba(255, 255, 255, 0.98)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   logoSection: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     marginBottom: "10px",
//   },
//   logoCircle: {
//     width: "80px",
//     height: "80px",
//     borderRadius: "50%",
//     background: "#ffffff",
//     padding: "3px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)",
//     marginBottom: "15px",
//   },
//   logoImg: {
//     width: "74px",
//     height: "74px",
//     borderRadius: "50%",
//     objectFit: "contain",
//     background: "transparent",
//   },
//   brandTitle: {
//     margin: "0 0 5px 0",
//     fontSize: "28px",
//     fontWeight: "700",
//     background: "#693683",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//     letterSpacing: "2px",
//   },
//   brandTagline: {
//     margin: 0,
//     fontSize: "12px",
//     color: "#666",
//     fontWeight: "400",
//     letterSpacing: "0.5px",
//   },
//   heading: {
//     textAlign: "center",
//     marginBottom: "5px",
//     marginTop: "10px",
//     color: "#1a1a2e",
//     fontSize: "26px",
//     fontWeight: "700"
//   },
//   subheading: {
//     textAlign: "center",
//     margin: "0 0 10px 0",
//     color: "#666",
//     fontSize: "14px",
//     fontWeight: "400",
//   },
//   inputWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "6px",
//   },
//   inputContainer: {
//     position: "relative",
//     display: "flex",
//     alignItems: "center",
//   },
//   icon: {
//     position: "absolute",
//     left: "15px",
//     color: "#888",
//     fontSize: "16px",
//     zIndex: 1,
//   },
//   inputField: {
//     width: "100%",
//     padding: "14px 15px 14px 45px",
//     borderRadius: "10px",
//     border: "2px solid #e5e7eb",
//     fontSize: "15px",
//     transition: "all 0.3s ease",
//     outline: "none",
//     backgroundColor: "#fff",
//   },
//   passwordToggle: {
//     position: "absolute",
//     right: "15px",
//     cursor: "pointer",
//     color: "#888",
//     fontSize: "16px",
//     zIndex: 1,
//   },
//   button: {
//     padding: "14px",
//     border: "none",
//     borderRadius: "10px",
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: "16px",
//     transition: "all 0.3s ease",
//     marginTop: "10px",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: "10px",
//   },
//   error: {
//     color: "#ef4444",
//     fontSize: "13px",
//     marginLeft: "5px",
//     fontWeight: "500",
//   },
//   registerText: {
//     textAlign: "center",
//     fontSize: "14px",
//     color: "#666",
//     marginTop: "5px",
//   },
//   registerLink: {
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
// };
// export default Login;












// import React, { useContext, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser, googleLoginUser, forgotPassword } from "../api/api";
// import ITSLogo from "../assets/ITS.png";
// import { GoogleLogin } from "@react-oauth/google";

// import {
//   FaUser,
//   FaLock,
//   FaSignInAlt,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";

// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useContext(AuthContext);
//   const redirectTo = location.state?.redirectTo || "/";

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Input handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Validation
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Normal login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     setErrors({});
//     try {
//       const response = await loginUser(formData);
//       login(response.user);

//       if (location.state?.redirectTo) {
//         navigate(location.state.redirectTo);
//       } else if (response.user.role?.toLowerCase() === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/student/dashboard");
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Login failed";
//       setErrors({ email: message, password: message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await googleLoginUser(credentialResponse.credential);
//       login(response.user);
//       navigate(redirectTo);
//     } catch (error) {
//       alert("Google login failed");
//       console.error(error);
//     }
//   };

//   // Forgot password
//   const handleForgotPassword = async () => {
//     if (!formData.email) {
//       alert("Enter your email first");
//       return;
//     }
//     try {
//       await forgotPassword(formData.email);
//       alert("Password reset link sent to your email");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to send reset link");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         {location.state?.message && (
//           <p
//             style={{
//               textAlign: "center",
//               color: "#7c3aed",
//               background: "#f3f0ff",
//               padding: "10px 16px",
//               borderRadius: "8px",
//               fontSize: "14px",
//               fontWeight: "500",
//               margin: 0,
//             }}
//           >
//             ℹ️ {location.state.message}
//           </p>
//         )}

//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>Sign in to continue to your account</p>

//         {/* Email */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Email Address"
//               style={styles.inputField}
//             />
//           </div>
//           {errors.email && <span style={styles.error}>{errors.email}</span>}
//         </div>

//         {/* Password */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               style={styles.inputField}
//             />
//             <span
//               style={styles.passwordToggle}
//               onClick={() => setShowPassword((p) => !p)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && <span style={styles.error}>{errors.password}</span>}
//         </div>

//         {/* Forgot Password */}
//         <div style={{ textAlign: "right", fontSize: "13px" }}>
//           <span
//             onClick={handleForgotPassword}
//             style={{ cursor: "pointer", color: "#693683" }}
//           >
//             Forgot Password?
//           </span>
//         </div>

//         {/* Login Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
//         >
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         {/* OR Google Login */}
//         <div style={{ textAlign: "center" }}>
//           <p style={{ marginBottom: "10px" }}>or</p>
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => alert("Google Login Failed")}
//           />
//         </div>

//         {/* Register */}
//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span
//             style={styles.registerLink}
//             onClick={() => navigate("/register")}
//           >
//             Register here
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// // Styles (same as original)
// const styles = {
//   container: {
//     minHeight: "100vh",
//     paddingTop: "100px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
//     padding: "20px",
//   },
//   form: {
//     width: "100%",
//     maxWidth: "450px",
//     margin: "0 auto",
//     padding: "40px 30px",
//     borderRadius: "20px",
//     boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
//     background: "rgba(255, 255, 255, 0.98)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   logoSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" },
//   logoCircle: { width: "80px", height: "80px", borderRadius: "50%", background: "#fff", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)", marginBottom: "15px" },
//   logoImg: { width: "74px", height: "74px", borderRadius: "50%", objectFit: "contain", background: "transparent" },
//   heading: { textAlign: "center", marginBottom: "5px", marginTop: "10px", color: "#1a1a2e", fontSize: "26px", fontWeight: "700" },
//   subheading: { textAlign: "center", margin: "0 0 10px 0", color: "#666", fontSize: "14px", fontWeight: "400" },
//   inputWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
//   inputContainer: { position: "relative", display: "flex", alignItems: "center" },
//   icon: { position: "absolute", left: "15px", color: "#888", fontSize: "16px", zIndex: 1 },
//   inputField: { width: "100%", padding: "14px 15px 14px 45px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "15px", transition: "all 0.3s ease", outline: "none", backgroundColor: "#fff" },
//   passwordToggle: { position: "absolute", right: "15px", cursor: "pointer", color: "#888", fontSize: "16px", zIndex: 1 },
//   button: { padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", color: "#fff", fontWeight: "600", fontSize: "16px", transition: "all 0.3s ease", marginTop: "10px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" },
//   error: { color: "#ef4444", fontSize: "13px", marginLeft: "5px", fontWeight: "500" },
//   registerText: { textAlign: "center", fontSize: "14px", color: "#666", marginTop: "5px" },
//   registerLink: { background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", cursor: "pointer", fontWeight: "600" },
// };

// export default Login;


















// import React, { useContext, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser, googleLoginUser, forgotPassword } from "../api/api";
// import ITSLogo from "../assets/ITS.png";
// import { GoogleLogin } from "@react-oauth/google";
// import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useContext(AuthContext);
//   const redirectTo = location.state?.redirectTo || "/";

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ NEW: Forgot password states
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [forgotSuccess, setForgotSuccess] = useState(false);
//   const [forgotError, setForgotError] = useState("");

//   // Input handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Validation
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Normal login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     setErrors({});
//     try {
//       const response = await loginUser(formData);
//       login(response.user);
//       if (location.state?.redirectTo) {
//         navigate(location.state.redirectTo);
//       } else if (response.user.role?.toLowerCase() === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/student/dashboard");
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Login failed";
//       setErrors({ email: message, password: message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Google login
//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await googleLoginUser(credentialResponse.credential);
//       login(response.user);
//       navigate(redirectTo);
//     } catch (error) {
//       alert("Google login failed");
//       console.error(error);
//     }
//   };

//   // ✅ FIXED: Forgot password with proper modal
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail.trim()) {
//       setForgotError("Please enter your email address");
//       return;
//     }
//     if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
//       setForgotError("Please enter a valid email address");
//       return;
//     }

//     setForgotLoading(true);
//     setForgotError("");

//     try {
//       await forgotPassword(forgotEmail);
//       setForgotSuccess(true);
//     } catch (error) {
//       setForgotError(
//         error.response?.data?.message || "Failed to send reset link. Try again."
//       );
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   const closeForgotModal = () => {
//     setShowForgotModal(false);
//     setForgotEmail("");
//     setForgotError("");
//     setForgotSuccess(false);
//     setForgotLoading(false);
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         {/* Logo */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         {location.state?.message && (
//           <p style={styles.infoMessage}>ℹ️ {location.state.message}</p>
//         )}

//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>Sign in to continue to your account</p>

//         {/* Email */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               placeholder="Email Address"
//               style={styles.inputField}
//             />
//           </div>
//           {errors.email && <span style={styles.error}>{errors.email}</span>}
//         </div>

//         {/* Password */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input
//               type={showPassword ? "text" : "password"}
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               placeholder="Password"
//               style={styles.inputField}
//             />
//             <span style={styles.passwordToggle} onClick={() => setShowPassword((p) => !p)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && <span style={styles.error}>{errors.password}</span>}
//         </div>

//         {/* ✅ FIXED: Forgot Password opens modal */}
//         <div style={{ textAlign: "right", fontSize: "13px" }}>
//           <span
//             onClick={() => {
//               setForgotEmail(formData.email); // pre-fill if email already typed
//               setShowForgotModal(true);
//             }}
//             style={{ cursor: "pointer", color: "#693683", fontWeight: "500" }}
//           >
//             Forgot Password?
//           </span>
//         </div>

//         {/* Login Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
//         >
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         {/* Google Login */}
//         <div style={{ textAlign: "center" }}>
//           <p style={{ marginBottom: "10px", color: "#888", fontSize: "13px" }}>or</p>
//           <GoogleLogin
//             onSuccess={handleGoogleSuccess}
//             onError={() => alert("Google Login Failed")}
//           />
//         </div>

//         {/* Register */}
//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span style={styles.registerLink} onClick={() => navigate("/register")}>
//             Register here
//           </span>
//         </p>
//       </form>

//       {/* ✅ FORGOT PASSWORD MODAL */}
//       {showForgotModal && (
//         <div style={styles.modalOverlay} onClick={closeForgotModal}>
//           <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>

//             {/* Close button */}
//             <button style={styles.closeBtn} onClick={closeForgotModal}>✕</button>

//             {/* Success state */}
//             {forgotSuccess ? (
//               <div style={{ textAlign: "center", padding: "10px 0" }}>
//                 <div style={styles.successIcon}>✅</div>
//                 <h3 style={styles.modalTitle}>Email Sent!</h3>
//                 <p style={styles.modalSubtitle}>
//                   A password reset link has been sent to:
//                 </p>
//                 <p style={{ fontWeight: "600", color: "#693683", margin: "8px 0 20px" }}>
//                   {forgotEmail}
//                 </p>
//                 <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
//                   Check your inbox (and spam folder). The link expires in 15 minutes.
//                 </p>
//                 <button style={styles.button} onClick={closeForgotModal}>
//                   Back to Login
//                 </button>
//               </div>
//             ) : (
//               /* Form state */
//               <form onSubmit={handleForgotPassword}>
//                 <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                   <div style={styles.emailIcon}>
//                     <FaEnvelope size={28} color="#693683" />
//                   </div>
//                   <h3 style={styles.modalTitle}>Forgot Password?</h3>
//                   <p style={styles.modalSubtitle}>
//                     Enter your email and we'll send you a reset link
//                   </p>
//                 </div>

//                 <div style={styles.inputWrapper}>
//                   <div style={styles.inputContainer}>
//                     <FaEnvelope style={styles.icon} />
//                     <input
//                       type="email"
//                       value={forgotEmail}
//                       onChange={(e) => {
//                         setForgotEmail(e.target.value);
//                         setForgotError("");
//                       }}
//                       placeholder="Enter your email address"
//                       style={styles.inputField}
//                       autoFocus
//                     />
//                   </div>
//                   {forgotError && (
//                     <span style={styles.error}>{forgotError}</span>
//                   )}
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={forgotLoading}
//                   style={{ ...styles.button, marginTop: "16px", opacity: forgotLoading ? 0.7 : 1 }}
//                 >
//                   {forgotLoading ? "Sending..." : "Send Reset Link"}
//                 </button>

//                 <p
//                   style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888", cursor: "pointer" }}
//                   onClick={closeForgotModal}
//                 >
//                   ← Back to Login
//                 </p>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: {
//     minHeight: "100vh",
//     paddingTop: "100px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
//     padding: "20px",
//   },
//   form: {
//     width: "100%",
//     maxWidth: "450px",
//     margin: "0 auto",
//     padding: "40px 30px",
//     borderRadius: "20px",
//     boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
//     background: "rgba(255, 255, 255, 0.98)",
//     display: "flex",
//     flexDirection: "column",
//     gap: "20px",
//   },
//   logoSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" },
//   logoCircle: { width: "80px", height: "80px", borderRadius: "50%", background: "#fff", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)", marginBottom: "15px" },
//   logoImg: { width: "74px", height: "74px", borderRadius: "50%", objectFit: "contain", background: "transparent" },
//   heading: { textAlign: "center", marginBottom: "5px", marginTop: "10px", color: "#1a1a2e", fontSize: "26px", fontWeight: "700" },
//   subheading: { textAlign: "center", margin: "0 0 10px 0", color: "#666", fontSize: "14px" },
//   inputWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
//   inputContainer: { position: "relative", display: "flex", alignItems: "center" },
//   icon: { position: "absolute", left: "15px", color: "#888", fontSize: "16px", zIndex: 1 },
//   inputField: { width: "100%", padding: "14px 15px 14px 45px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "15px", outline: "none", backgroundColor: "#fff" },
//   passwordToggle: { position: "absolute", right: "15px", cursor: "pointer", color: "#888", fontSize: "16px", zIndex: 1 },
//   button: { padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", color: "#fff", fontWeight: "600", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" },
//   error: { color: "#ef4444", fontSize: "13px", marginLeft: "5px", fontWeight: "500" },
//   infoMessage: { textAlign: "center", color: "#7c3aed", background: "#f3f0ff", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", margin: 0 },
//   registerText: { textAlign: "center", fontSize: "14px", color: "#666", marginTop: "5px" },
//   registerLink: { background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", cursor: "pointer", fontWeight: "600" },

//   // ✅ Modal styles
//   modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
//   modalBox: { background: "#fff", borderRadius: "20px", padding: "40px 30px", width: "100%", maxWidth: "420px", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
//   closeBtn: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#888", lineHeight: 1 },
//   modalTitle: { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "10px 0 6px" },
//   modalSubtitle: { fontSize: "14px", color: "#666", margin: 0 },
//   emailIcon: { width: "64px", height: "64px", borderRadius: "50%", background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
//   successIcon: { fontSize: "48px", marginBottom: "10px" },
// };

// export default Login;










// import React, { useContext, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser, googleLoginUser, forgotPassword, verifyOtp } from "../api/api"; // ✅ added verifyOtp
// import ITSLogo from "../assets/ITS.png";
// import { GoogleLogin } from "@react-oauth/google";
// import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useContext(AuthContext);
//   const redirectTo = location.state?.redirectTo || "/";

//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // ✅ Forgot password states
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotStep, setForgotStep] = useState(1); // 1 = email, 2 = otp
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [forgotError, setForgotError] = useState("");

//   /* ================= LOGIN ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     setErrors({});
//     try {
//       const response = await loginUser(formData);
//       login(response.user);
//       if (location.state?.redirectTo) {
//         navigate(location.state.redirectTo);
//       } else if (response.user.role?.toLowerCase() === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/student/dashboard");
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Login failed";
//       setErrors({ email: message, password: message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await googleLoginUser(credentialResponse.credential);
//       login(response.user);
//       navigate(redirectTo);
//     } catch (error) {
//       alert("Google login failed");
//       console.error(error);
//     }
//   };

//   /* ================= FORGOT PASSWORD ================= */

//   // Step 1: Send OTP to email
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail.trim()) {
//       setForgotError("Please enter your email address");
//       return;
//     }
//     if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
//       setForgotError("Please enter a valid email address");
//       return;
//     }
//     setForgotLoading(true);
//     setForgotError("");
//     try {
//       await forgotPassword(forgotEmail);
//       setForgotStep(2); // ✅ Move to OTP step
//     } catch (error) {
//       setForgotError(error.response?.data?.message || "Failed to send OTP. Try again.");
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   // OTP box: typing handler — auto jump to next box
//   const handleOtpChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return; // numbers only
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setForgotError("");
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   // OTP box: backspace goes to previous box
//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   // OTP box: paste support
//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
//     if (pasted.length === 6) {
//       setOtp(pasted.split(""));
//       document.getElementById("otp-5")?.focus();
//     }
//   };

//   // Step 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     const otpValue = otp.join("");
//     if (otpValue.length !== 6) {
//       setForgotError("Please enter the complete 6-digit OTP");
//       return;
//     }
//     setForgotLoading(true);
//     setForgotError("");
//     try {
//       const response = await verifyOtp(forgotEmail, otpValue);
//       closeForgotModal();
//       navigate(`/reset-password/${response.resetToken}`); // ✅ Go to reset page
//     } catch (error) {
//       setForgotError(error.response?.data?.message || "Invalid or expired OTP");
//       // Clear OTP boxes on wrong OTP
//       setOtp(["", "", "", "", "", ""]);
//       document.getElementById("otp-0")?.focus();
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   const closeForgotModal = () => {
//     setShowForgotModal(false);
//     setForgotStep(1);
//     setForgotEmail("");
//     setOtp(["", "", "", "", "", ""]);
//     setForgotError("");
//     setForgotLoading(false);
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>

//         {/* Logo */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         {location.state?.message && (
//           <p style={styles.infoMessage}>ℹ️ {location.state.message}</p>
//         )}

//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>Sign in to continue to your account</p>

//         {/* Email */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" style={styles.inputField} />
//           </div>
//           {errors.email && <span style={styles.error}>{errors.email}</span>}
//         </div>

//         {/* Password */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" style={styles.inputField} />
//             <span style={styles.passwordToggle} onClick={() => setShowPassword((p) => !p)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && <span style={styles.error}>{errors.password}</span>}
//         </div>

//         {/* Forgot Password */}
//         <div style={{ textAlign: "right", fontSize: "13px" }}>
//           <span
//             onClick={() => { setForgotEmail(formData.email); setShowForgotModal(true); }}
//             style={{ cursor: "pointer", color: "#693683", fontWeight: "500" }}
//           >
//             Forgot Password?
//           </span>
//         </div>

//         <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <div style={{ textAlign: "center" }}>
//           <p style={{ marginBottom: "10px", color: "#888", fontSize: "13px" }}>or</p>
//           <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Login Failed")} />
//         </div>

//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span style={styles.registerLink} onClick={() => navigate("/register")}>Register here</span>
//         </p>
//       </form>

//       {/* ✅ FORGOT PASSWORD MODAL */}
//       {showForgotModal && (
//         <div style={styles.modalOverlay} onClick={closeForgotModal}>
//           <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
//             <button style={styles.closeBtn} onClick={closeForgotModal}>✕</button>

//             {/* ===== STEP 1: Enter Email ===== */}
//             {forgotStep === 1 && (
//               <form onSubmit={handleSendOtp}>
//                 <div style={{ textAlign: "center", marginBottom: "24px" }}>
//                   <div style={styles.emailIcon}>
//                     <FaEnvelope size={28} color="#693683" />
//                   </div>
//                   <h3 style={styles.modalTitle}>Forgot Password?</h3>
//                   <p style={styles.modalSubtitle}>Enter your email to receive a 6-digit OTP</p>
//                 </div>

//                 <div style={styles.inputWrapper}>
//                   <div style={styles.inputContainer}>
//                     <FaEnvelope style={styles.icon} />
//                     <input
//                       type="email"
//                       value={forgotEmail}
//                       onChange={(e) => { setForgotEmail(e.target.value); setForgotError(""); }}
//                       placeholder="Enter your email address"
//                       style={styles.inputField}
//                       autoFocus
//                     />
//                   </div>
//                   {forgotError && <span style={styles.error}>{forgotError}</span>}
//                 </div>

//                 <button type="submit" disabled={forgotLoading} style={{ ...styles.button, marginTop: "16px", opacity: forgotLoading ? 0.7 : 1 }}>
//                   {forgotLoading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//                 <p style={styles.backLink} onClick={closeForgotModal}>← Back to Login</p>
//               </form>
//             )}

//             {/* ===== STEP 2: Enter OTP ===== */}
//             {forgotStep === 2 && (
//               <form onSubmit={handleVerifyOtp}>
//                 <div style={{ textAlign: "center", marginBottom: "24px" }}>
//                   <div style={{ fontSize: "52px", marginBottom: "10px" }}>📧</div>
//                   <h3 style={styles.modalTitle}>Enter OTP</h3>
//                   <p style={styles.modalSubtitle}>
//                     We sent a 6-digit OTP to<br />
//                     <strong style={{ color: "#693683" }}>{forgotEmail}</strong>
//                   </p>
//                 </div>

//                 {/* OTP Input Boxes */}
//                 <div style={styles.otpContainer} onPaste={handleOtpPaste}>
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       id={`otp-${index}`}
//                       type="text"
//                       inputMode="numeric"
//                       maxLength={1}
//                       value={digit}
//                       onChange={(e) => handleOtpChange(index, e.target.value)}
//                       onKeyDown={(e) => handleOtpKeyDown(index, e)}
//                       style={{
//                         ...styles.otpBox,
//                         borderColor: forgotError ? "#ef4444" : digit ? "#693683" : "#e5e7eb",
//                         background: digit ? "#f3f0ff" : "#fff",
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {forgotError && (
//                   <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center", margin: "10px 0 0" }}>
//                     ⚠️ {forgotError}
//                   </p>
//                 )}

//                 <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", margin: "10px 0 16px" }}>
//                   ⏰ OTP expires in 10 minutes
//                 </p>

//                 <button
//                   type="submit"
//                   disabled={forgotLoading || otp.join("").length !== 6}
//                   style={{ ...styles.button, opacity: (forgotLoading || otp.join("").length !== 6) ? 0.6 : 1 }}
//                 >
//                   {forgotLoading ? "Verifying..." : "Verify OTP →"}
//                 </button>

//                 <p
//                   style={styles.backLink}
//                   onClick={() => { setForgotStep(1); setForgotError(""); setOtp(["", "", "", "", "", ""]); }}
//                 >
//                   ← Didn't get OTP? Resend
//                 </p>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   container: { minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)", padding: "20px" },
//   form: { width: "100%", maxWidth: "450px", margin: "0 auto", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", background: "rgba(255, 255, 255, 0.98)", display: "flex", flexDirection: "column", gap: "20px" },
//   logoSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" },
//   logoCircle: { width: "80px", height: "80px", borderRadius: "50%", background: "#fff", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)", marginBottom: "15px" },
//   logoImg: { width: "74px", height: "74px", borderRadius: "50%", objectFit: "contain", background: "transparent" },
//   heading: { textAlign: "center", marginBottom: "5px", marginTop: "10px", color: "#1a1a2e", fontSize: "26px", fontWeight: "700" },
//   subheading: { textAlign: "center", margin: "0 0 10px 0", color: "#666", fontSize: "14px" },
//   inputWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
//   inputContainer: { position: "relative", display: "flex", alignItems: "center" },
//   icon: { position: "absolute", left: "15px", color: "#888", fontSize: "16px", zIndex: 1 },
//   inputField: { width: "100%", padding: "14px 15px 14px 45px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "15px", outline: "none", backgroundColor: "#fff" },
//   passwordToggle: { position: "absolute", right: "15px", cursor: "pointer", color: "#888", fontSize: "16px", zIndex: 1 },
//   button: { padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", color: "#fff", fontWeight: "600", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" },
//   error: { color: "#ef4444", fontSize: "13px", marginLeft: "5px", fontWeight: "500" },
//   infoMessage: { textAlign: "center", color: "#7c3aed", background: "#f3f0ff", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", margin: 0 },
//   registerText: { textAlign: "center", fontSize: "14px", color: "#666", marginTop: "5px" },
//   registerLink: { background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", cursor: "pointer", fontWeight: "600" },
//   // Modal
//   modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
//   modalBox: { background: "#fff", borderRadius: "20px", padding: "40px 30px", width: "100%", maxWidth: "420px", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
//   closeBtn: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#888", lineHeight: 1 },
//   modalTitle: { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "10px 0 6px" },
//   modalSubtitle: { fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" },
//   emailIcon: { width: "64px", height: "64px", borderRadius: "50%", background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
//   backLink: { textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#693683", cursor: "pointer", fontWeight: "500" },
//   // OTP
//   otpContainer: { display: "flex", gap: "10px", justifyContent: "center", margin: "10px 0" },
//   otpBox: { width: "48px", height: "56px", textAlign: "center", fontSize: "24px", fontWeight: "700", borderRadius: "10px", border: "2px solid #e5e7eb", outline: "none", transition: "all 0.2s", color: "#693683", cursor: "text" },
// };

// export default Login;


















// import React, { useContext, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { loginUser, googleLoginUser, forgotPassword, verifyOtp, resetPassword } from "../api/api";
// import ITSLogo from "../assets/ITS.png";
// import { GoogleLogin } from "@react-oauth/google";
// import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
// import { AuthContext } from "../context/AuthContext";

// const Login = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = useContext(AuthContext);
//   const redirectTo = location.state?.redirectTo || "/";

//   // ===== LOGIN STATES =====
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // ===== FORGOT PASSWORD MODAL STATES =====
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [resetToken, setResetToken] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showNewPass, setShowNewPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [modalError, setModalError] = useState("");
//   const [modalSuccess, setModalSuccess] = useState(false);

//   /* ================= LOGIN HANDLERS ================= */
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.email.trim()) newErrors.email = "Email is required";
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
//     if (!formData.password) newErrors.password = "Password is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     setLoading(true);
//     setErrors({});
//     try {
//       const response = await loginUser(formData);
//       login(response.user);
//       if (location.state?.redirectTo) {
//         navigate(location.state.redirectTo);
//       } else if (response.user.role?.toLowerCase() === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/student/dashboard");
//       }
//     } catch (error) {
//       const message = error.response?.data?.message || "Login failed";
//       setErrors({ email: message, password: message });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     try {
//       const response = await googleLoginUser(credentialResponse.credential);
//       login(response.user);
//       navigate(redirectTo);
//     } catch (error) {
//       alert("Google login failed");
//     }
//   };

//   /* ================= MODAL HANDLERS ================= */

//   const openModal = () => {
//     setForgotEmail(formData.email);
//     setStep(1);
//     setModalError("");
//     setModalSuccess(false);
//     setOtp(["", "", "", "", "", ""]);
//     setNewPassword("");
//     setConfirmPassword("");
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setStep(1);
//     setForgotEmail("");
//     setOtp(["", "", "", "", "", ""]);
//     setResetToken("");
//     setNewPassword("");
//     setConfirmPassword("");
//     setModalError("");
//     setModalSuccess(false);
//     setModalLoading(false);
//   };

//   // STEP 1: Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
//       setModalError("Please enter a valid email address");
//       return;
//     }
//     setModalLoading(true);
//     setModalError("");
//     try {
//       await forgotPassword(forgotEmail);
//       setStep(2);
//     } catch (error) {
//       setModalError(error.response?.data?.message || "Failed to send OTP. Try again.");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // OTP box handlers
//   const handleOtpChange = (index, value) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setModalError("");
//     if (value && index < 5) {
//       document.getElementById(`otp-${index + 1}`)?.focus();
//     }
//   };

//   const handleOtpKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-${index - 1}`)?.focus();
//     }
//   };

//   const handleOtpPaste = (e) => {
//     e.preventDefault();
//     const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
//     if (pasted.length === 6) {
//       setOtp(pasted.split(""));
//       document.getElementById("otp-5")?.focus();
//     }
//   };

//   // STEP 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     const otpValue = otp.join("");
//     if (otpValue.length !== 6) {
//       setModalError("Please enter the complete 6-digit OTP");
//       return;
//     }
//     setModalLoading(true);
//     setModalError("");
//     try {
//       const response = await verifyOtp(forgotEmail, otpValue);
//       setResetToken(response.resetToken);
//       setStep(3); // ✅ Move to password reset step
//     } catch (error) {
//       setModalError(error.response?.data?.message || "Invalid or expired OTP");
//       setOtp(["", "", "", "", "", ""]);
//       document.getElementById("otp-0")?.focus();
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // STEP 3: Reset Password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     setModalError("");

//     if (!newPassword) return setModalError("Password is required");
//     if (newPassword.length < 6) return setModalError("Password must be at least 6 characters");
//     if (newPassword !== confirmPassword) return setModalError("Passwords do not match");

//     setModalLoading(true);
//     try {
//       await resetPassword(resetToken, newPassword);
//       setModalSuccess(true); // ✅ Show success screen
//     } catch (error) {
//       setModalError(error.response?.data?.message || "Reset failed. Please try again.");
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // Password strength
//   const getStrength = (pass) => {
//     if (!pass) return { width: "0%", color: "#e5e7eb", label: "" };
//     if (pass.length >= 10) return { width: "100%", color: "#22c55e", label: "Strong 💪" };
//     if (pass.length >= 6) return { width: "60%", color: "#f59e0b", label: "Medium" };
//     return { width: "30%", color: "#ef4444", label: "Weak" };
//   };
//   const strength = getStrength(newPassword);

//   /* ================= RENDER ================= */
//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleLogin} style={styles.form}>

//         {/* Logo */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         {location.state?.message && (
//           <p style={styles.infoMessage}>ℹ️ {location.state.message}</p>
//         )}

//         <h2 style={styles.heading}>Welcome Back</h2>
//         <p style={styles.subheading}>Sign in to continue to your account</p>

//         {/* Email Field */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input
//               type="email" name="email" value={formData.email}
//               onChange={handleInputChange} placeholder="Email Address"
//               style={styles.inputField}
//             />
//           </div>
//           {errors.email && <span style={styles.errorText}>{errors.email}</span>}
//         </div>

//         {/* Password Field */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input
//               type={showPassword ? "text" : "password"} name="password"
//               value={formData.password} onChange={handleInputChange}
//               placeholder="Password" style={styles.inputField}
//             />
//             <span style={styles.eyeIcon} onClick={() => setShowPassword((p) => !p)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && <span style={styles.errorText}>{errors.password}</span>}
//         </div>

//         {/* Forgot Password Link */}
//         <div style={{ textAlign: "right" }}>
//           <span onClick={openModal} style={styles.forgotLink}>Forgot Password?</span>
//         </div>

//         {/* Login Button */}
//         <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
//           <FaSignInAlt />
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         {/* Google Login */}
//         <div style={{ textAlign: "center" }}>
//           <p style={{ color: "#888", fontSize: "13px", marginBottom: "10px" }}>or</p>
//           <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Login Failed")} />
//         </div>

//         <p style={styles.registerText}>
//           Don't have an account?{" "}
//           <span style={styles.registerLink} onClick={() => navigate("/register")}>Register here</span>
//         </p>
//       </form>

//       {/* ============================================================
//           ✅ FORGOT PASSWORD MODAL — 3 STEPS
//           ============================================================ */}
//       {showModal && (
//         <div style={styles.overlay} onClick={closeModal}>
//           <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

//             {/* Close Button */}
//             <button style={styles.closeBtn} onClick={closeModal}>✕</button>

//             {/* Step Indicator */}
//             {!modalSuccess && (
//               <div style={styles.stepBar}>
//                 {["Email", "OTP", "New Password"].map((label, i) => (
//                   <div key={i} style={styles.stepItem}>
//                     <div style={{
//                       ...styles.stepCircle,
//                       background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#693683" : "#e5e7eb",
//                       color: step >= i + 1 ? "#fff" : "#999",
//                     }}>
//                       {step > i + 1 ? "✓" : i + 1}
//                     </div>
//                     <span style={{ fontSize: "11px", color: step === i + 1 ? "#693683" : "#999", fontWeight: step === i + 1 ? "600" : "400" }}>
//                       {label}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ===== SUCCESS SCREEN ===== */}
//             {modalSuccess && (
//               <div style={{ textAlign: "center", padding: "10px 0" }}>
//                 <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
//                 <h3 style={styles.modalTitle}>Password Reset!</h3>
//                 <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
//                   Your password has been updated successfully.
//                 </p>
//                 <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>
//                   You can now login with your new password.
//                 </p>
//                 <button style={styles.btn} onClick={() => { closeModal(); }}>
//                   Login Now →
//                 </button>
//               </div>
//             )}

//             {/* ===== STEP 1: Enter Email ===== */}
//             {!modalSuccess && step === 1 && (
//               <form onSubmit={handleSendOtp}>
//                 <div style={{ textAlign: "center", marginBottom: "24px" }}>
//                   <div style={styles.iconCircle}><FaEnvelope size={26} color="#693683" /></div>
//                   <h3 style={styles.modalTitle}>Forgot Password?</h3>
//                   <p style={styles.modalSub}>Enter your email to receive a 6-digit OTP</p>
//                 </div>

//                 <div style={styles.inputWrapper}>
//                   <div style={styles.inputContainer}>
//                     <FaEnvelope style={styles.icon} />
//                     <input
//                       type="email" value={forgotEmail}
//                       onChange={(e) => { setForgotEmail(e.target.value); setModalError(""); }}
//                       placeholder="Enter your email address"
//                       style={styles.inputField} autoFocus
//                     />
//                   </div>
//                   {modalError && <span style={styles.errorText}>{modalError}</span>}
//                 </div>

//                 <button type="submit" disabled={modalLoading}
//                   style={{ ...styles.btn, marginTop: "16px", opacity: modalLoading ? 0.7 : 1 }}>
//                   {modalLoading ? "Sending OTP..." : "Send OTP 📨"}
//                 </button>
//                 <p style={styles.backLink} onClick={closeModal}>← Back to Login</p>
//               </form>
//             )}

//             {/* ===== STEP 2: Enter OTP ===== */}
//             {!modalSuccess && step === 2 && (
//               <form onSubmit={handleVerifyOtp}>
//                 <div style={{ textAlign: "center", marginBottom: "20px" }}>
//                   <div style={{ fontSize: "48px", marginBottom: "10px" }}>📧</div>
//                   <h3 style={styles.modalTitle}>Enter OTP</h3>
//                   <p style={styles.modalSub}>
//                     6-digit OTP sent to<br />
//                     <strong style={{ color: "#693683" }}>{forgotEmail}</strong>
//                   </p>
//                 </div>

//                 {/* 6 OTP Boxes */}
//                 <div style={styles.otpRow} onPaste={handleOtpPaste}>
//                   {otp.map((digit, i) => (
//                     <input
//                       key={i} id={`otp-${i}`}
//                       type="text" inputMode="numeric"
//                       maxLength={1} value={digit}
//                       onChange={(e) => handleOtpChange(i, e.target.value)}
//                       onKeyDown={(e) => handleOtpKeyDown(i, e)}
//                       style={{
//                         ...styles.otpBox,
//                         borderColor: modalError ? "#ef4444" : digit ? "#693683" : "#e5e7eb",
//                         background: digit ? "#f3f0ff" : "#fff",
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {modalError && (
//                   <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center", margin: "8px 0" }}>
//                     ⚠️ {modalError}
//                   </p>
//                 )}

//                 <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", margin: "8px 0 14px" }}>
//                   ⏰ OTP expires in 10 minutes
//                 </p>

//                 <button type="submit"
//                   disabled={modalLoading || otp.join("").length !== 6}
//                   style={{ ...styles.btn, opacity: (modalLoading || otp.join("").length !== 6) ? 0.6 : 1 }}>
//                   {modalLoading ? "Verifying..." : "Verify OTP →"}
//                 </button>

//                 <p style={styles.backLink}
//                   onClick={() => { setStep(1); setModalError(""); setOtp(["", "", "", "", "", ""]); }}>
//                   ← Resend OTP
//                 </p>
//               </form>
//             )}

//             {/* ===== STEP 3: Set New Password ===== */}
//             {!modalSuccess && step === 3 && (
//               <form onSubmit={handleResetPassword}>
//                 <div style={{ textAlign: "center", marginBottom: "24px" }}>
//                   <div style={styles.iconCircle}><FaLock size={26} color="#693683" /></div>
//                   <h3 style={styles.modalTitle}>Set New Password</h3>
//                   <p style={styles.modalSub}>Choose a strong password for your account</p>
//                 </div>

//                 {/* New Password */}
//                 <div style={{ ...styles.inputWrapper, marginBottom: "16px" }}>
//                   <label style={styles.label}>New Password</label>
//                   <div style={styles.inputContainer}>
//                     <FaLock style={styles.icon} />
//                     <input
//                       type={showNewPass ? "text" : "password"}
//                       value={newPassword}
//                       onChange={(e) => { setNewPassword(e.target.value); setModalError(""); }}
//                       placeholder="Enter new password (min 6 chars)"
//                       style={styles.inputField}
//                       autoFocus
//                     />
//                     <span style={styles.eyeIcon} onClick={() => setShowNewPass((p) => !p)}>
//                       {showNewPass ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                   </div>
//                   {/* Strength bar */}
//                   {newPassword && (
//                     <div style={{ marginTop: "6px" }}>
//                       <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "4px" }}>
//                         <div style={{ width: strength.width, background: strength.color, height: "4px", borderRadius: "4px", transition: "all 0.3s" }} />
//                       </div>
//                       <span style={{ fontSize: "11px", color: strength.color, fontWeight: "600" }}>
//                         {strength.label}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Confirm Password */}
//                 <div style={{ ...styles.inputWrapper, marginBottom: "16px" }}>
//                   <label style={styles.label}>Confirm Password</label>
//                   <div style={styles.inputContainer}>
//                     <FaLock style={styles.icon} />
//                     <input
//                       type={showConfirmPass ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => { setConfirmPassword(e.target.value); setModalError(""); }}
//                       placeholder="Re-enter your new password"
//                       style={{
//                         ...styles.inputField,
//                         borderColor: confirmPassword
//                           ? confirmPassword === newPassword ? "#22c55e" : "#ef4444"
//                           : "#e5e7eb",
//                       }}
//                     />
//                     <span style={styles.eyeIcon} onClick={() => setShowConfirmPass((p) => !p)}>
//                       {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                   </div>
//                   {/* Match indicator */}
//                   {confirmPassword && (
//                     <span style={{ fontSize: "12px", fontWeight: "600", color: confirmPassword === newPassword ? "#22c55e" : "#ef4444" }}>
//                       {confirmPassword === newPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
//                     </span>
//                   )}
//                 </div>

//                 {/* Error */}
//                 {modalError && (
//                   <div style={styles.errorBox}>⚠️ {modalError}</div>
//                 )}

//                 <button type="submit" disabled={modalLoading}
//                   style={{ ...styles.btn, opacity: modalLoading ? 0.7 : 1 }}>
//                   {modalLoading ? "Resetting..." : "Reset Password ✓"}
//                 </button>
//               </form>
//             )}

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ================= STYLES ================= */
// const styles = {
//   container: { minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)", padding: "20px" },
//   form: { width: "100%", maxWidth: "450px", margin: "0 auto", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", background: "rgba(255,255,255,0.98)", display: "flex", flexDirection: "column", gap: "20px" },
//   logoSection: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" },
//   logoCircle: { width: "80px", height: "80px", borderRadius: "50%", background: "#fff", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(123,67,151,0.4)", marginBottom: "15px" },
//   logoImg: { width: "74px", height: "74px", borderRadius: "50%", objectFit: "contain" },
//   heading: { textAlign: "center", color: "#1a1a2e", fontSize: "26px", fontWeight: "700", margin: 0 },
//   subheading: { textAlign: "center", color: "#666", fontSize: "14px", margin: 0 },
//   inputWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
//   inputContainer: { position: "relative", display: "flex", alignItems: "center" },
//   icon: { position: "absolute", left: "15px", color: "#888", fontSize: "16px", zIndex: 1 },
//   inputField: { width: "100%", padding: "14px 45px 14px 45px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "15px", outline: "none", backgroundColor: "#fff", transition: "border-color 0.2s" },
//   eyeIcon: { position: "absolute", right: "15px", cursor: "pointer", color: "#888", fontSize: "16px", zIndex: 1 },
//   btn: { padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", color: "#fff", fontWeight: "600", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" },
//   errorText: { color: "#ef4444", fontSize: "13px", marginLeft: "5px", fontWeight: "500" },
//   errorBox: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "12px" },
//   infoMessage: { textAlign: "center", color: "#7c3aed", background: "#f3f0ff", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", margin: 0 },
//   forgotLink: { cursor: "pointer", color: "#693683", fontWeight: "500", fontSize: "13px" },
//   registerText: { textAlign: "center", fontSize: "14px", color: "#666" },
//   registerLink: { background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer", fontWeight: "600" },
//   label: { fontSize: "13px", fontWeight: "600", color: "#444" },
//   // Modal
//   overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
//   modal: { background: "#fff", borderRadius: "20px", padding: "36px 30px", width: "100%", maxWidth: "440px", position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", maxHeight: "90vh", overflowY: "auto" },
//   closeBtn: { position: "absolute", top: "14px", right: "14px", background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999" },
//   modalTitle: { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "10px 0 6px" },
//   modalSub: { fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" },
//   iconCircle: { width: "64px", height: "64px", borderRadius: "50%", background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
//   backLink: { textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#693683", cursor: "pointer", fontWeight: "500" },
//   // Step bar
//   stepBar: { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "28px" },
//   stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
//   stepCircle: { width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", transition: "all 0.3s" },
//   // OTP
//   otpRow: { display: "flex", gap: "10px", justifyContent: "center", margin: "16px 0" },
//   otpBox: { width: "46px", height: "54px", textAlign: "center", fontSize: "22px", fontWeight: "700", borderRadius: "10px", border: "2px solid #e5e7eb", outline: "none", transition: "all 0.2s", color: "#693683" },
// };

// export default Login;


















import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, googleLoginUser, forgotPassword, verifyOtp, resetPassword } from "../api/api";
import ITSLogo from "../assets/ITS.png";
import { GoogleLogin } from "@react-oauth/google";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

/* ── helper: pick dashboard by role ── */
const getDashboardPath = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":   return "/admin/dashboard";
    case "teacher": return "/teacher/dashboard";
    case "manager": return "/manager/dashboard";
    case "student": return "/student/dashboard";
    default:        return "/";
  }
};

const Login = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useContext(AuthContext);
  const redirectTo = location.state?.redirectTo || null;

  // ===== LOGIN STATES =====
  const [formData,     setFormData]     = useState({ email: "", password: "" });
  const [errors,       setErrors]       = useState({});
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ===== FORGOT PASSWORD MODAL STATES =====
  const [showModal,       setShowModal]       = useState(false);
  const [step,            setStep]            = useState(1);
  const [forgotEmail,     setForgotEmail]     = useState("");
  const [otp,             setOtp]             = useState(["", "", "", "", "", ""]);
  const [resetToken,      setResetToken]      = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass,     setShowNewPass]     = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [modalLoading,    setModalLoading]    = useState(false);
  const [modalError,      setModalError]      = useState("");
  const [modalSuccess,    setModalSuccess]    = useState(false);

  /* ================= LOGIN HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const response = await loginUser(formData);

      // ✅ Support both response shapes: { user: {...} } or flat { role, fullName, ... }
      const userData = response.user || response;
      login(userData);

      // ✅ If there's a specific redirect (e.g. came from a protected page), use it
      // Otherwise route by role
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate(getDashboardPath(userData.role));
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ email: message, password: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLoginUser(credentialResponse.credential);
      const userData = response.user || response;
      login(userData);
      navigate(getDashboardPath(userData.role));
    } catch (error) {
      alert("Google login failed. Please try again.");
    }
  };

  /* ================= MODAL HANDLERS ================= */
  const openModal = () => {
    setForgotEmail(formData.email);
    setStep(1);
    setModalError("");
    setModalSuccess(false);
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep(1);
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setModalError("");
    setModalSuccess(false);
    setModalLoading(false);
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setModalError("Please enter a valid email address");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      await forgotPassword(forgotEmail);
      setStep(2);
    } catch (error) {
      setModalError(error.response?.data?.message || "Failed to send OTP. Try again.");
    } finally {
      setModalLoading(false);
    }
  };

  // OTP box handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setModalError("");
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setModalError("Please enter the complete 6-digit OTP");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      const response = await verifyOtp(forgotEmail, otpValue);
      setResetToken(response.resetToken);
      setStep(3);
    } catch (error) {
      setModalError(error.response?.data?.message || "Invalid or expired OTP");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    } finally {
      setModalLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setModalError("");
    if (!newPassword)              return setModalError("Password is required");
    if (newPassword.length < 6)    return setModalError("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return setModalError("Passwords do not match");
    setModalLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setModalSuccess(true);
    } catch (error) {
      setModalError(error.response?.data?.message || "Reset failed. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  // Password strength
  const getStrength = (pass) => {
    if (!pass)           return { width: "0%",   color: "#e5e7eb", label: "" };
    if (pass.length >= 10) return { width: "100%", color: "#22c55e", label: "Strong 💪" };
    if (pass.length >= 6)  return { width: "60%",  color: "#f59e0b", label: "Medium" };
    return                        { width: "30%",  color: "#ef4444", label: "Weak" };
  };
  const strength = getStrength(newPassword);

  /* ================= RENDER ================= */
  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>

        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
          </div>
        </div>

        {location.state?.message && (
          <p style={styles.infoMessage}>ℹ️ {location.state.message}</p>
        )}

        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Sign in to continue to your account</p>

        {/* Email Field */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaUser style={styles.icon} />
            <input
              type="email" name="email" value={formData.email}
              onChange={handleInputChange} placeholder="Email Address"
              style={styles.inputField}
            />
          </div>
          {errors.email && <span style={styles.errorText}>{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"} name="password"
              value={formData.password} onChange={handleInputChange}
              placeholder="Password" style={styles.inputField}
            />
            <span style={styles.eyeIcon} onClick={() => setShowPassword((p) => !p)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span style={styles.errorText}>{errors.password}</span>}
        </div>

        {/* Forgot Password Link */}
        <div style={{ textAlign: "right" }}>
          <span onClick={openModal} style={styles.forgotLink}>Forgot Password?</span>
        </div>

        {/* Login Button */}
        <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
          <FaSignInAlt />
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Google Login */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "13px", marginBottom: "10px" }}>or</p>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google Login Failed")} />
        </div>

        <p style={styles.registerText}>
          Don't have an account?{" "}
          <span style={styles.registerLink} onClick={() => navigate("/register")}>Register here</span>
        </p>
      </form>

      {/* ============================================================
          FORGOT PASSWORD MODAL — 3 STEPS
      ============================================================ */}
      {showModal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            {/* Close Button */}
            <button style={styles.closeBtn} onClick={closeModal}>✕</button>

            {/* Step Indicator */}
            {!modalSuccess && (
              <div style={styles.stepBar}>
                {["Email", "OTP", "New Password"].map((label, i) => (
                  <div key={i} style={styles.stepItem}>
                    <div style={{
                      ...styles.stepCircle,
                      background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#693683" : "#e5e7eb",
                      color: step >= i + 1 ? "#fff" : "#999",
                    }}>
                      {step > i + 1 ? "✓" : i + 1}
                    </div>
                    <span style={{ fontSize: "11px", color: step === i + 1 ? "#693683" : "#999", fontWeight: step === i + 1 ? "600" : "400" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* SUCCESS SCREEN */}
            {modalSuccess && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
                <h3 style={styles.modalTitle}>Password Reset!</h3>
                <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>
                  Your password has been updated successfully.
                </p>
                <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>
                  You can now login with your new password.
                </p>
                <button style={styles.btn} onClick={closeModal}>
                  Login Now →
                </button>
              </div>
            )}

            {/* STEP 1: Enter Email */}
            {!modalSuccess && step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={styles.iconCircle}><FaEnvelope size={26} color="#693683" /></div>
                  <h3 style={styles.modalTitle}>Forgot Password?</h3>
                  <p style={styles.modalSub}>Enter your email to receive a 6-digit OTP</p>
                </div>
                <div style={styles.inputWrapper}>
                  <div style={styles.inputContainer}>
                    <FaEnvelope style={styles.icon} />
                    <input
                      type="email" value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); setModalError(""); }}
                      placeholder="Enter your email address"
                      style={styles.inputField} autoFocus
                    />
                  </div>
                  {modalError && <span style={styles.errorText}>{modalError}</span>}
                </div>
                <button type="submit" disabled={modalLoading}
                  style={{ ...styles.btn, marginTop: "16px", opacity: modalLoading ? 0.7 : 1 }}>
                  {modalLoading ? "Sending OTP..." : "Send OTP 📨"}
                </button>
                <p style={styles.backLink} onClick={closeModal}>← Back to Login</p>
              </form>
            )}

            {/* STEP 2: Enter OTP */}
            {!modalSuccess && step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "10px" }}>📧</div>
                  <h3 style={styles.modalTitle}>Enter OTP</h3>
                  <p style={styles.modalSub}>
                    6-digit OTP sent to<br />
                    <strong style={{ color: "#693683" }}>{forgotEmail}</strong>
                  </p>
                </div>
                <div style={styles.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i} id={`otp-${i}`}
                      type="text" inputMode="numeric"
                      maxLength={1} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      style={{
                        ...styles.otpBox,
                        borderColor: modalError ? "#ef4444" : digit ? "#693683" : "#e5e7eb",
                        background:  digit ? "#f3f0ff" : "#fff",
                      }}
                    />
                  ))}
                </div>
                {modalError && (
                  <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center", margin: "8px 0" }}>
                    ⚠️ {modalError}
                  </p>
                )}
                <p style={{ textAlign: "center", fontSize: "12px", color: "#aaa", margin: "8px 0 14px" }}>
                  ⏰ OTP expires in 10 minutes
                </p>
                <button type="submit"
                  disabled={modalLoading || otp.join("").length !== 6}
                  style={{ ...styles.btn, opacity: (modalLoading || otp.join("").length !== 6) ? 0.6 : 1 }}>
                  {modalLoading ? "Verifying..." : "Verify OTP →"}
                </button>
                <p style={styles.backLink}
                  onClick={() => { setStep(1); setModalError(""); setOtp(["", "", "", "", "", ""]); }}>
                  ← Resend OTP
                </p>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {!modalSuccess && step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={styles.iconCircle}><FaLock size={26} color="#693683" /></div>
                  <h3 style={styles.modalTitle}>Set New Password</h3>
                  <p style={styles.modalSub}>Choose a strong password for your account</p>
                </div>

                {/* New Password */}
                <div style={{ ...styles.inputWrapper, marginBottom: "16px" }}>
                  <label style={styles.label}>New Password</label>
                  <div style={styles.inputContainer}>
                    <FaLock style={styles.icon} />
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setModalError(""); }}
                      placeholder="Enter new password (min 6 chars)"
                      style={styles.inputField} autoFocus
                    />
                    <span style={styles.eyeIcon} onClick={() => setShowNewPass((p) => !p)}>
                      {showNewPass ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {newPassword && (
                    <div style={{ marginTop: "6px" }}>
                      <div style={{ background: "#e5e7eb", borderRadius: "4px", height: "4px" }}>
                        <div style={{ width: strength.width, background: strength.color, height: "4px", borderRadius: "4px", transition: "all 0.3s" }} />
                      </div>
                      <span style={{ fontSize: "11px", color: strength.color, fontWeight: "600" }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div style={{ ...styles.inputWrapper, marginBottom: "16px" }}>
                  <label style={styles.label}>Confirm Password</label>
                  <div style={styles.inputContainer}>
                    <FaLock style={styles.icon} />
                    <input
                      type={showConfirmPass ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setModalError(""); }}
                      placeholder="Re-enter your new password"
                      style={{
                        ...styles.inputField,
                        borderColor: confirmPassword
                          ? confirmPassword === newPassword ? "#22c55e" : "#ef4444"
                          : "#e5e7eb",
                      }}
                    />
                    <span style={styles.eyeIcon} onClick={() => setShowConfirmPass((p) => !p)}>
                      {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {confirmPassword && (
                    <span style={{ fontSize: "12px", fontWeight: "600", color: confirmPassword === newPassword ? "#22c55e" : "#ef4444" }}>
                      {confirmPassword === newPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </span>
                  )}
                </div>

                {modalError && (
                  <div style={styles.errorBox}>⚠️ {modalError}</div>
                )}

                <button type="submit" disabled={modalLoading}
                  style={{ ...styles.btn, opacity: modalLoading ? 0.7 : 1 }}>
                  {modalLoading ? "Resetting..." : "Reset Password ✓"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  container:    { minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)", padding: "20px" },
  form:         { width: "100%", maxWidth: "450px", margin: "0 auto", padding: "40px 30px", borderRadius: "20px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", background: "rgba(255,255,255,0.98)", display: "flex", flexDirection: "column", gap: "20px" },
  logoSection:  { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" },
  logoCircle:   { width: "80px", height: "80px", borderRadius: "50%", background: "#fff", padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 15px rgba(123,67,151,0.4)", marginBottom: "15px" },
  logoImg:      { width: "74px", height: "74px", borderRadius: "50%", objectFit: "contain" },
  heading:      { textAlign: "center", color: "#1a1a2e", fontSize: "26px", fontWeight: "700", margin: 0 },
  subheading:   { textAlign: "center", color: "#666", fontSize: "14px", margin: 0 },
  inputWrapper: { display: "flex", flexDirection: "column", gap: "6px" },
  inputContainer: { position: "relative", display: "flex", alignItems: "center" },
  icon:         { position: "absolute", left: "15px", color: "#888", fontSize: "16px", zIndex: 1 },
  inputField:   { width: "100%", padding: "14px 45px 14px 45px", borderRadius: "10px", border: "2px solid #e5e7eb", fontSize: "15px", outline: "none", backgroundColor: "#fff", transition: "border-color 0.2s" },
  eyeIcon:      { position: "absolute", right: "15px", cursor: "pointer", color: "#888", fontSize: "16px", zIndex: 1 },
  btn:          { padding: "14px", border: "none", borderRadius: "10px", background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", color: "#fff", fontWeight: "600", fontSize: "16px", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", width: "100%" },
  errorText:    { color: "#ef4444", fontSize: "13px", marginLeft: "5px", fontWeight: "500" },
  errorBox:     { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "12px" },
  infoMessage:  { textAlign: "center", color: "#7c3aed", background: "#f3f0ff", padding: "10px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", margin: 0 },
  forgotLink:   { cursor: "pointer", color: "#693683", fontWeight: "500", fontSize: "13px" },
  registerText: { textAlign: "center", fontSize: "14px", color: "#666" },
  registerLink: { background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", cursor: "pointer", fontWeight: "600" },
  label:        { fontSize: "13px", fontWeight: "600", color: "#444" },
  overlay:      { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal:        { background: "#fff", borderRadius: "20px", padding: "36px 30px", width: "100%", maxWidth: "440px", position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", maxHeight: "90vh", overflowY: "auto" },
  closeBtn:     { position: "absolute", top: "14px", right: "14px", background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#999" },
  modalTitle:   { fontSize: "22px", fontWeight: "700", color: "#1a1a2e", margin: "10px 0 6px" },
  modalSub:     { fontSize: "14px", color: "#666", margin: 0, lineHeight: "1.6" },
  iconCircle:   { width: "64px", height: "64px", borderRadius: "50%", background: "#f3f0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" },
  backLink:     { textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#693683", cursor: "pointer", fontWeight: "500" },
  stepBar:      { display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "28px" },
  stepItem:     { display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" },
  stepCircle:   { width: "30px", height: "30px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "700", transition: "all 0.3s" },
  otpRow:       { display: "flex", gap: "10px", justifyContent: "center", margin: "16px 0" },
  otpBox:       { width: "46px", height: "54px", textAlign: "center", fontSize: "22px", fontWeight: "700", borderRadius: "10px", border: "2px solid #e5e7eb", outline: "none", transition: "all 0.2s", color: "#693683" },
};

export default Login;