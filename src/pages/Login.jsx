import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, googleLoginUser, forgotPassword, verifyOtp, resetPassword } from "../api/api";
import ITSLogo from "../assets/ITS.png";
import { GoogleLogin } from "@react-oauth/google";
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope, FaFacebook, FaBuilding } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

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
      const userData = response.user || response;
      login(userData);
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate(getDashboardPath(userData.role));
      }
    } catch (error) {
  const message = error.response?.data?.message || "Login failed.";
  const msg = message.toLowerCase();

  if (msg.includes('incorrect password') || msg.includes('wrong password') || 
      (msg.includes('password') && !msg.includes('email'))) {
    setErrors({ password: "Incorrect password. Please try again." });
  } else if (msg.includes('no account') || msg.includes('not found') || 
             msg.includes('user') || msg.includes('email')) {
    setErrors({ email: "No account found with this email address." });
  } else if (msg.includes('invalid') && msg.includes('password')) {
    // catches "invalid email or password" — ambiguous, show on password
    setErrors({ password: "Incorrect password. Please try again." });
  } else {
    setErrors({ email: message });
  }
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

  /* ── Social Login Redirects ── */
  const handleFacebookLogin   = () => { window.location.href = `${SERVER_URL}/auth/facebook`; };
  const handleMicrosoftLogin  = () => { window.location.href = `${SERVER_URL}/auth/microsoft`; };

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

  const getStrength = (pass) => {
    if (!pass)            return { width: "0%",   color: "#e5e7eb", label: "" };
    if (pass.length >= 10) return { width: "100%", color: "#22c55e", label: "Strong 💪" };
    if (pass.length >= 6)  return { width: "60%",  color: "#f59e0b", label: "Medium" };
    return                         { width: "30%",  color: "#ef4444", label: "Weak" };
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

        {/* Show social login error if redirected back with error */}
        {new URLSearchParams(location.search).get("error") && (
          <p style={styles.errorBox}>
            ⚠️ {new URLSearchParams(location.search).get("error")} login failed. Please try again.
          </p>
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

        {/* ── Divider ── */}
        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine} />
        </div>

{/* ── Social Login Icons Row ── */}
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>

  {/* Google */}
  <div style={{ position: "relative", width: "48px", height: "48px" }}>
    <div style={styles.iconBtn}>
      <svg width="24" height="24" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.1-6.1C34.36 3.05 29.45 1 24 1 14.82 1 7.07 6.54 3.96 14.36l7.1 5.52C12.74 13.6 17.94 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.68 7.15l7.18 5.57C43.36 37.3 46.52 31.36 46.52 24.5z"/>
        <path fill="#FBBC05" d="M11.06 28.12A14.6 14.6 0 0 1 9.5 24c0-1.43.24-2.82.56-4.12l-7.1-5.52A23.93 23.93 0 0 0 0 24c0 3.86.93 7.5 2.56 10.72l8.5-6.6z"/>
        <path fill="#34A853" d="M24 47c5.45 0 10.02-1.8 13.36-4.88l-7.18-5.57C28.36 38.1 26.3 38.5 24 38.5c-6.06 0-11.26-4.1-13.06-9.5l-8.5 6.6C5.9 42.9 14.3 47 24 47z"/>
      </svg>
    </div>
    <div style={{ 
      position: "absolute", 
      top: 0, left: 0, 
      width: "48px", height: "48px", 
      opacity: 0, 
      overflow: "hidden",
      zIndex: 2
    }}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  </div>

  {/* Facebook - completely isolated, no overlap possible */}
  <button 
    type="button" 
    onClick={handleFacebookLogin} 
    style={{ ...styles.iconBtn, position: "static", zIndex: "auto" }}
    title="Login with Facebook"
  >
    <FaFacebook style={{ fontSize: "24px", color: "#1877f2" }} />
  </button>

  {/* GitHub/Microsoft */}
  <button 
    type="button" 
    onClick={handleMicrosoftLogin} 
    style={{ ...styles.iconBtn, position: "static", zIndex: "auto" }}
    title="Login with Microsoft"
  >
    <FaBuilding style={{ fontSize: "24px", color: "#0078d4" }} />
  </button>

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

            <button style={styles.closeBtn} onClick={closeModal}>✕</button>

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

            {modalSuccess && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
                <h3 style={styles.modalTitle}>Password Reset!</h3>
                <p style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>Your password has been updated successfully.</p>
                <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>You can now login with your new password.</p>
                <button style={styles.btn} onClick={closeModal}>Login Now →</button>
              </div>
            )}

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

            {!modalSuccess && step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div style={styles.iconCircle}><FaLock size={26} color="#693683" /></div>
                  <h3 style={styles.modalTitle}>Set New Password</h3>
                  <p style={styles.modalSub}>Choose a strong password for your account</p>
                </div>

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
                      <span style={{ fontSize: "11px", color: strength.color, fontWeight: "600" }}>{strength.label}</span>
                    </div>
                  )}
                </div>

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

                {modalError && <div style={styles.errorBox}>⚠️ {modalError}</div>}

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
  iconBtn: { width: "48px", height: "48px", borderRadius: "50%", border: "2px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "box-shadow 0.2s" },
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

  // ── NEW: Social login styles ──
  divider:      { display: "flex", alignItems: "center", gap: "12px" },
  dividerLine:  { flex: 1, height: "1px", background: "#e5e7eb" },
  dividerText:  { color: "#999", fontSize: "13px", whiteSpace: "nowrap" },
  googleWrapper:{ width: "100%" },
  socialGrid:   { display: "flex", flexDirection: "column", gap: "10px" },
  socialBtn:    { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", borderRadius: "10px", border: "2px solid transparent", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s", width: "100%" },
  facebookBtn:  { background: "#1877f2", color: "#fff", border: "2px solid #1877f2" },
  githubBtn:    { background: "#24292e", color: "#fff", border: "2px solid #24292e" },
  microsoftBtn: { background: "#fff", color: "#333", border: "2px solid #e5e7eb" },
};

export default Login;