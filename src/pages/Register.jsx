// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { registerUser } from '../api/api'; 
// import ITSLogo from '../assets/ITS.png';
// import { FaUser, FaLock, FaPhone, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     role: 'Student'
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
//     if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
//     if (successMessage) setSuccessMessage('');
//   };

//   // const validateForm = () => {
//   //   const newErrors = {};
//   //   if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
//   //   if (!formData.email.trim()) newErrors.email = 'Email is required';
//   //   else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
//   //   if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
//   //   if (!formData.password) newErrors.password = 'Password is required';
//   //   if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
//   //   setErrors(newErrors);
//   //   return Object.keys(newErrors).length === 0;
//   // };
//   const validateForm = () => {
//   const newErrors = {};

//   // Full Name
//   if (!formData.fullName.trim()) {
//     newErrors.fullName = "Full name is required";
//   } else if (formData.fullName.trim().length < 3) {
//     newErrors.fullName = "Full name must be at least 3 characters";
//   }

//   // Email
//   if (!formData.email.trim()) {
//     newErrors.email = "Email is required";
//   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//     newErrors.email = "Enter a valid email address";
//   }

//   // Phone
//   if (!formData.phone.trim()) {
//     newErrors.phone = "Phone number is required";
//   } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
//     newErrors.phone = "Phone number must be 10–15 digits";
//   }

//   // Password
// if (!formData.password) {
//   newErrors.password = "Password is required";
// } else if (formData.password.length < 5) {
//   newErrors.password = "Password must be at least 5 characters";
// }
// //confirm password
//   if (!formData.confirmPassword) {
//   newErrors.confirmPassword = "Confirm password is required";
// } else if (formData.password !== formData.confirmPassword) {
//   newErrors.confirmPassword = "Passwords do not match";
// }


//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };


//   const handleRegister = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     setErrors({});
//     setSuccessMessage('');

//     try {
//       const payload = {
//         fullName: formData.fullName,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         confirmPassword: formData.confirmPassword,
//         role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
//       };
//       const response = await registerUser(payload);
          
//       if (response.success === true || response.user) {
//         const user = response.user || response.data?.user || {
//           fullName: formData.fullName,
//           email: formData.email,
//           role: "Student",
//         };

//         localStorage.setItem("userInfo", JSON.stringify(user));

//         if (response.token) {
//           localStorage.setItem("token", response.token);
//         }

//         alert(`Registration successful! Welcome ${user.fullName}`);

//         setFormData({
//           fullName: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirmPassword: "",
//           role: "Student",
//         });

//         navigate("/student/dashboard", { replace: true });
//       } else {
//         const errorMsg = response.message || 'Registration failed';
//         setErrors({ general: errorMsg });
//       }

//     } catch (error) {
//       console.error('❌ Registration error:', error.response?.data || error);
      
//       const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      
//       if (typeof message === 'string') {
//         const lowerMessage = message.toLowerCase();
        
//         if (lowerMessage.includes('email')) {
//           setErrors({ email: message });
//         } else if (lowerMessage.includes('phone')) {
//           setErrors({ phone: message });
//         } else if (lowerMessage.includes('password')) {
//           setErrors({ password: message });
//         } else if (lowerMessage.includes('all fields')) {
//           setErrors({ general: message });
//         } else {
//           setErrors({ general: message });
//         }
//       } else {
//         setErrors({ general: 'Registration failed. Please try again.' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <form onSubmit={handleRegister} style={styles.form}>
//         {/* Logo Section */}
//         <div style={styles.logoSection}>
//           <div style={styles.logoCircle}>
//             <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
//           </div>
//         </div>

//         <h2 style={styles.heading}>Create Account</h2>

//         {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
//         {errors.general && <div style={styles.errorMessage}>{errors.general}</div>}

//         {/* Full Name Input */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaUser style={styles.icon} />
//             <input 
//               type="text" 
//               name="fullName" 
//               value={formData.fullName} 
//               onChange={handleInputChange} 
//               placeholder="Full Name" 
//               style={styles.inputField} 
//             />
//           </div>
//           {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
//         </div>

//         {/* Email Input */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaEnvelope style={styles.icon} />
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

//         {/* Phone Input */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaPhone style={styles.icon} />
//             <input 
//               type="text" 
//               name="phone" 
//               value={formData.phone} 
//               onChange={handleInputChange} 
//               placeholder="Phone Number" 
//               style={styles.inputField} 
//             />
//           </div>
//           {errors.phone && <span style={styles.error}>{errors.phone}</span>}
//         </div>

//         {/* Password Input */}
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
//               onClick={() => setShowPassword(prev => !prev)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.password && <span style={styles.error}>{errors.password}</span>}
//         </div>

//         {/* Confirm Password Input */}
//         <div style={styles.inputWrapper}>
//           <div style={styles.inputContainer}>
//             <FaLock style={styles.icon} />
//             <input 
//               type={showConfirm ? "text" : "password"} 
//               name="confirmPassword" 
//               value={formData.confirmPassword} 
//               onChange={handleInputChange} 
//               placeholder="Confirm Password" 
//               style={styles.inputField} 
//             />
//             <span 
//               style={styles.passwordToggle} 
//               onClick={() => setShowConfirm(prev => !prev)}
//             >
//               {showConfirm ? <FaEyeSlash /> : <FaEye />}
//             </span>
//           </div>
//           {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
//         </div>

//         {/* Submit Button */}
//         <button 
//           type="submit" 
//           disabled={loading} 
//           style={{ 
//             ...styles.button, 
//             opacity: loading ? 0.7 : 1,
//             cursor: loading ? "not-allowed" : "pointer"
//           }}
//         >
//           {loading ? "Creating Account..." : "Register"}
//         </button>

//         {/* Login Link */}
//         <p style={styles.loginText}>
//           Already have an account?{' '}
//           <span 
//             style={styles.loginLink} 
//             onClick={() => navigate('/login')}
//           >
//             Login here
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     minHeight: "100vh",
//     // minHeight: "calc(100vh - 80px)",
//     padding: "80px",
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
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
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
//   successMessage: {
//     color: "#10b981",
//     backgroundColor: "#d1fae5",
//     padding: "12px",
//     borderRadius: "8px",
//     textAlign: "center",
//     fontWeight: "500",
//     fontSize: "14px",
//   },
//   errorMessage: {
//     color: "#ef4444",
//     backgroundColor: "#fee2e2",
//     padding: "12px",
//     borderRadius: "8px",
//     textAlign: "center",
//     fontWeight: "500",
//     fontSize: "14px",
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
//   },
//   error: { 
//     color: "#ef4444", 
//     fontSize: "13px",
//     marginLeft: "5px",
//     fontWeight: "500",
//   },
//   passwordToggle: { 
//     position: "absolute", 
//     right: "15px", 
//     cursor: "pointer", 
//     color: "#888",
//     fontSize: "16px",
//     zIndex: 1,
//   },
//   loginText: {
//     textAlign: "center",
//     fontSize: "14px",
//     color: "#666",
//     marginTop: "5px",
//   },
//   loginLink: {
//     background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
  
//   // Media Query styles applied via JavaScript
//   "@media (maxWidth: 640px)": {
//     form: {
//       padding: "30px 20px",
//       maxWidth: "100%",
//     },
//     heading: {
//       fontSize: "22px",
//     },
//     logoCircle: {
//       width: "70px",
//       height: "70px",
//     },
//     logoImg: {
//       width: "64px",
//       height: "64px",
//     },
//     brandTitle: {
//       fontSize: "24px",
//     },
//   },
// };

// export default Register;










import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, googleLoginUser, forgotPassword } from '../api/api';
import ITSLogo from '../assets/ITS.png';
import { GoogleLogin } from '@react-oauth/google';
import { FaUser, FaLock, FaPhone, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 3) newErrors.fullName = "Full name must be at least 3 characters";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email address";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = "Phone number must be 10–15 digits";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 5) newErrors.password = "Password must be at least 5 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
      };

      const response = await registerUser(payload);

      if (response.success || response.user) {
        const user = response.user || response.data?.user || {
          fullName: formData.fullName,
          email: formData.email,
          role: "Student",
        };
        localStorage.setItem("userInfo", JSON.stringify(user));
        if (response.token) localStorage.setItem("token", response.token);

        alert(`Registration successful! Welcome ${user.fullName}`);

        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'Student'
        });

        navigate("/student/dashboard", { replace: true });
      } else {
        setErrors({ general: response.message || "Registration failed" });
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLoginUser(credentialResponse.credential);
      localStorage.setItem("userInfo", JSON.stringify(response.user));
      if (response.token) localStorage.setItem("token", response.token);
      navigate("/student/dashboard", { replace: true });
    } catch (error) {
      alert("Google login failed");
      console.error(error);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Enter your email first");
      return;
    }
    try {
      await forgotPassword(formData.email);
      alert("Password reset link sent to your email");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.logoSection}>
          <div style={styles.logoCircle}>
            <img src={ITSLogo} alt="ITS Logo" style={styles.logoImg} />
          </div>
        </div>

        <h2 style={styles.heading}>Create Account</h2>

        {errors.general && <div style={styles.errorMessage}>{errors.general}</div>}

        {/* Full Name */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              style={styles.inputField}
            />
          </div>
          {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              style={styles.inputField}
            />
          </div>
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>

        {/* Phone */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaPhone style={styles.icon} />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              style={styles.inputField}
            />
          </div>
          {errors.phone && <span style={styles.error}>{errors.phone}</span>}
        </div>

        {/* Password */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              style={styles.inputField}
            />
            <span style={styles.passwordToggle} onClick={() => setShowPassword(p => !p)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <span style={styles.error}>{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div style={styles.inputWrapper}>
          <div style={styles.inputContainer}>
            <FaLock style={styles.icon} />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              style={styles.inputField}
            />
            <span style={styles.passwordToggle} onClick={() => setShowConfirm(p => !p)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
        </div>

        {/* Forgot Password */}
        {/* <div style={{ textAlign: "right", fontSize: "13px" }}>
          <span onClick={handleForgotPassword} style={{ cursor: "pointer", color: "#693683" }}>
            Forgot Password?
          </span>
        </div> */}

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* OR Google Sign-Up */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p>or</p>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>

        {/* Login Link */}
        <p style={styles.loginText}>
          Already have an account?{' '}
          <span style={styles.loginLink} onClick={() => navigate('/login')}>
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    // minHeight: "calc(100vh - 80px)",
    padding: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2a043b 20%, #868528 100%)",
    padding: "20px",
  },
  form: { 
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto", 
    padding: "40px 30px", 
    borderRadius: "20px", 
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)", 
    background: "rgba(255, 255, 255, 0.98)",
    display: "flex", 
    flexDirection: "column", 
    gap: "20px",
  },
  logoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  },
  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "#ffffff",
    padding: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(123, 67, 151, 0.4)",
    marginBottom: "15px",
  },
  logoImg: {
    width: "74px",
    height: "74px",
    borderRadius: "50%",
    objectFit: "contain",
    background: "transparent",
  },
  brandTitle: {
    margin: "0 0 5px 0",
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "2px",
  },
  brandTagline: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    fontWeight: "400",
    letterSpacing: "0.5px",
  },
  heading: { 
    textAlign: "center", 
    marginBottom: "5px",
    marginTop: "10px",
    color: "#1a1a2e", 
    fontSize: "26px", 
    fontWeight: "700" 
  },
  successMessage: {
    color: "#10b981",
    backgroundColor: "#d1fae5",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "14px",
  },
  errorMessage: {
    color: "#ef4444",
    backgroundColor: "#fee2e2",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    fontWeight: "500",
    fontSize: "14px",
  },
  inputWrapper: { 
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: { 
    position: "absolute", 
    left: "15px", 
    color: "#888",
    fontSize: "16px",
    zIndex: 1,
  },
  inputField: { 
    width: "100%", 
    padding: "14px 15px 14px 45px", 
    borderRadius: "10px", 
    border: "2px solid #e5e7eb", 
    fontSize: "15px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "#fff",
  },
  button: { 
    padding: "14px", 
    border: "none", 
    borderRadius: "10px", 
    background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
    color: "#fff", 
    fontWeight: "600", 
    fontSize: "16px", 
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  error: { 
    color: "#ef4444", 
    fontSize: "13px",
    marginLeft: "5px",
    fontWeight: "500",
  },
  passwordToggle: { 
    position: "absolute", 
    right: "15px", 
    cursor: "pointer", 
    color: "#888",
    fontSize: "16px",
    zIndex: 1,
  },
  loginText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  loginLink: {
    background: "linear-gradient(135deg, #693683 0%, #a55d1e 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    cursor: "pointer",
    fontWeight: "600",
  },
  
  // Media Query styles applied via JavaScript
  "@media (maxWidth: 640px)": {
    form: {
      padding: "30px 20px",
      maxWidth: "100%",
    },
    heading: {
      fontSize: "22px",
    },
    logoCircle: {
      width: "70px",
      height: "70px",
    },
    logoImg: {
      width: "64px",
      height: "64px",
    },
    brandTitle: {
      fontSize: "24px",
    },
  },
};


export default Register;