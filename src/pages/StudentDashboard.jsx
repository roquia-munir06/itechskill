// // src/pages/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import StudentSidebar from "../components/StudentSidebar";
// import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle, FaBars, FaTimes } from "react-icons/fa";
// import {
//   getStudentEnrollments,
//   getProgress,
//   getAllCourses,
//   enrollStudentInCourse,
// } from "../api/api";

// const StudentDashboard = () => {
//   /* ================= USER INFO ================= */
//   const userInfo = localStorage.getItem("userInfo");
//   const parsedUser = userInfo ? JSON.parse(userInfo) : null;

//   const studentId = parsedUser?._id || parsedUser?.id || null;
//   const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

//   /* ================= STATES ================= */
//   const [loading, setLoading] = useState(true);
//   const [myCourses, setMyCourses] = useState(0);
//   const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
//   const [coursesList, setCoursesList] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   const [enrollData, setEnrollData] = useState({
//     name: parsedUser?.fullName || "",
//     email: parsedUser?.email || "",
//     phone: "",
//     country: "",
//     dob: "",
//     gender: "",
//     courses: "",
//     message: "",
//     agree: false,
//   });

//   /* ================= RESPONSIVE HANDLING ================= */
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       // Close sidebar when switching from mobile to desktop
//       if (!mobile && isMobileSidebarOpen) {
//         setIsMobileSidebarOpen(false);
//       }
//     };
    
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isMobileSidebarOpen]);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       setLoading(true);
//       await Promise.all([fetchDashboard(), fetchCourses()]);
//       setLoading(false);
//     };
//     initializeDashboard();
//   }, []);

//   /* ================= FUNCTIONS ================= */
//   const fetchDashboard = async () => {
//     if (!studentId) return;

//     try {
//       const enrollments = await getStudentEnrollments(studentId);

//       // Count total courses
//       setMyCourses(enrollments.length);

//       // Save enrolled courses safely (filter out null courses)
//       setEnrolledCourses(
//         enrollments
//           .filter((e) => e.course)
//           .map((e) => e.course._id)
//       );

//       // Calculate subscription time using first active course
//       const activeCourse = enrollments.find((e) => e.course && e.course.endDate);
//       if (activeCourse) {
//         const diff = new Date(activeCourse.course.endDate) - new Date();
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
//       } else {
//         setSubscriptionTime("N/A");
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await getAllCourses();
//       setCoursesList(res);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!enrollData.name.trim()) newErrors.name = "Full name is required";
//     if (!enrollData.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enrollData.email)) {
//       newErrors.email = "Invalid email format";
//     }
//     if (!enrollData.phone.trim()) newErrors.phone = "Phone number is required";
//     if (!enrollData.country.trim()) newErrors.country = "Country is required";
//     if (!enrollData.dob) newErrors.dob = "Date of birth is required";
//     if (!enrollData.gender) newErrors.gender = "Gender is required";
//     if (!enrollData.courses) newErrors.courses = "Please select a course";
//     if (!enrollData.agree) newErrors.agree = "You must agree to the rules";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setEnrollData({
//       ...enrollData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const handleEnroll = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     if (enrolledCourses.includes(enrollData.courses)) {
//       setErrors({ courses: "You are already enrolled in this course" });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       await enrollStudentInCourse(studentId, enrollData.courses);

//       alert("✅ Enrolled successfully!");

//       // Reset form
//       setEnrollData({
//         name: parsedUser?.fullName || "",
//         email: parsedUser?.email || "",
//         phone: "",
//         country: "",
//         dob: "",
//         gender: "",
//         courses: "",
//         message: "",
//         agree: false,
//       });

//       // Refresh dashboard
//       await fetchDashboard();
//     } catch (err) {
//       setErrors({
//         submit: err.response?.data?.message || "Enrollment failed. Please try again.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* ================= LOADING STATE ================= */
//   if (loading) {
//     return (
//       <div style={styles.pageContainer}>
//         <StudentSidebar/>
//         <div style={{
//           ...styles.mainContent,
//           marginLeft: isMobile ? "0" : "280px",
//           paddingTop: isMobile ? "80px" : "32px",
//         }}>
//           <div style={styles.loadingContainer}>
//             <div style={styles.spinner} />
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//             <p style={styles.loadingText}>Loading dashboard data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <StudentSidebar 
//         isMobile={isMobile}
//         isOpen={isMobileSidebarOpen}
//         onClose={() => setIsMobileSidebarOpen(false)}
//       />
      
//       {/* Mobile Menu Button - Only visible on mobile */}
//       {isMobile && (
//         <button 
//           style={styles.mobileMenuButton}
//           onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       )}

//       <div style={{
//         ...styles.mainContent,
//         marginLeft: isMobile ? "0" : "280px",
//         padding: isMobile ? "80px 16px 32px 16px" : "32px",
//       }}>
//         {/* Header Section */}
//         <div style={styles.headerSection}>
//           <div style={styles.headerTop}>
//             <div>
//               <h1 style={styles.pageTitle}>
//                 Welcome back, <span style={styles.highlightText}>{studentName}</span> 👋
//               </h1>
//               <p style={styles.pageSubtitle}>Here's your learning overview and progress</p>
//             </div>
//             <div style={styles.liveDataBadge}>
//               <p style={styles.liveDataText}>
//                 Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div style={styles.statsSection}>
//           <div style={styles.sectionHeader}>
//             <div style={styles.sectionIndicator}></div>
//             <h2 style={styles.sectionTitle}>Overview</h2>
//           </div>
//           <div style={styles.cardGrid}>
//             <StatCard
//               icon={<FaBook />}
//               title="My Courses"
//               value={myCourses}
//               subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
//               gradient="linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)"
//             />
//             <StatCard
//               icon={<FaClock />}
//               title="Subscription Time"
//               value={subscriptionTime}
//               subtitle="Until your access expires"
//               gradient="linear-gradient(135deg, #F1D572 0%, #A68A46 100%)"
//             />
//           </div>
//         </div>

//         {/* Enrollment Form */}
//         <div style={styles.formSection}>
//           <div style={styles.sectionHeader}>
//             <div style={styles.sectionIndicator}></div>
//             <h2 style={styles.sectionTitle}>Enroll in a New Course</h2>
//           </div>
          
//           <div style={styles.formCard}>
//             <div style={styles.formHeader}>
//               <h3 style={styles.formTitle}>Course Enrollment</h3>
//               <p style={styles.formSubtitle}>Fill out the form below to enroll in your desired course</p>
//             </div>

//             <form style={styles.formStyle} onSubmit={handleEnroll}>
//               <div style={styles.formRow}>
//                 <FormInput
//                   label="Full Name"
//                   name="name"
//                   value={enrollData.name}
//                   onChange={handleChange}
//                   error={errors.name}
//                   required
//                 />
//                 <FormInput
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   value={enrollData.email}
//                   onChange={handleChange}
//                   error={errors.email}
//                   required
//                 />
//               </div>

//               <div style={styles.formRow}>
//                 <FormInput
//                   label="Phone Number"
//                   name="phone"
//                   type="tel"
//                   value={enrollData.phone}
//                   onChange={handleChange}
//                   error={errors.phone}
//                   required
//                 />
//                 <FormInput
//                   label="Country"
//                   name="country"
//                   value={enrollData.country}
//                   onChange={handleChange}
//                   error={errors.country}
//                   required
//                 />
//               </div>

//               <div style={styles.formRow}>
//                 <FormInput
//                   label="Date of Birth"
//                   name="dob"
//                   type="date"
//                   value={enrollData.dob}
//                   onChange={handleChange}
//                   error={errors.dob}
//                   required
//                 />
//                 <FormSelect
//                   label="Gender"
//                   name="gender"
//                   value={enrollData.gender}
//                   onChange={handleChange}
//                   error={errors.gender}
//                   options={["Male", "Female", "Other"]}
//                   required
//                 />
//               </div>

//               {/* <FormSelect
//                 label="Select Course"
//                 name="courses"
//                 value={enrollData.courses}
//                 onChange={handleChange}
//                 error={errors.courses}
//                 options={coursesList.map((c) => ({ value: c._id, label: c.title }))}
//                 required
//               /> */}

//               <div style={styles.fieldContainer}>
//                 <label style={styles.labelStyle}>Message (Optional)</label>
//                 <textarea
//                   name="message"
//                   value={enrollData.message}
//                   onChange={handleChange}
//                   style={styles.textareaStyle}
//                   placeholder="Add any additional information or questions..."
//                   rows={4}
//                 />
//               </div>

//               <div style={styles.rulesContainer}>
//                 <FaExclamationCircle style={{ color: "#A68A46", fontSize: 18, flexShrink: 0 }} />
//                 <p style={styles.rulesText}>
//                   Lectures downloads, screenshots, recordings, and sharing are strictly prohibited.
//                 </p>
//               </div>

//               <label style={styles.checkboxLabel}>
//                 <input
//                   type="checkbox"
//                   name="agree"
//                   checked={enrollData.agree}
//                   onChange={handleChange}
//                   style={styles.checkboxStyle}
//                 />
//                 <span>I agree to the terms and rules stated above</span>
//               </label>
//               {errors.agree && <ErrorMessage message={errors.agree} />}
//               {errors.submit && <ErrorMessage message={errors.submit} />}

//               <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <div style={styles.buttonSpinner}></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <FaCheckCircle /> Submit & Proceed to Payment
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ================= REUSABLE COMPONENTS ================= */
// const StatCard = ({ icon, title, value, subtitle, gradient }) => (
//   <div style={{ ...styles.statCard, background: gradient }}>
//     <div style={styles.statIconContainer}>{icon}</div>
//     <div style={styles.statContent}>
//       <h3 style={styles.statTitle}>{title}</h3>
//       <p style={styles.statValue}>{value}</p>
//       <p style={styles.statSubtitle}>{subtitle}</p>
//     </div>
//   </div>
// );

// const FormInput = ({ label, name, type = "text", value, onChange, error, required }) => (
//   <div style={styles.fieldContainer}>
//     <label style={styles.labelStyle}>
//       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
//     </label>
//     <input
//       name={name}
//       type={type}
//       value={value}
//       onChange={onChange}
//       style={{ ...styles.inputStyle, ...(error ? styles.errorInputStyle : {}) }}
//     />
//     {error && <ErrorMessage message={error} />}
//   </div>
// );

// const FormSelect = ({ label, name, value, onChange, error, options, required }) => (
//   <div style={styles.fieldContainer}>
//     <label style={styles.labelStyle}>
//       {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
//     </label>
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       style={{ ...styles.inputStyle, ...(error ? styles.errorInputStyle : {}) }}
//     >
//       <option value="">Select {label}</option>
//       {options.map((opt) =>
//         typeof opt === "string" ? (
//           <option key={opt} value={opt}>
//             {opt}
//           </option>
//         ) : (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         )
//       )}
//     </select>
//     {error && <ErrorMessage message={error} />}
//   </div>
// );

// const ErrorMessage = ({ message }) => (
//   <p style={styles.errorText}>
//     <FaExclamationCircle style={{ fontSize: 12 }} /> {message}
//   </p>
// );

// /* ================= STYLES ================= */
// const styles = {
//   pageContainer: {
//     display: "flex",
//     backgroundColor: "#f9fafb",
//     minHeight: "100vh",
//     position: "relative",
//   },

//   mobileMenuButton: {
//     position: "fixed",
//     top: "16px",
//     left: "16px",
//     zIndex: 1000,
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     padding: "12px",
//     fontSize: "20px",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "transform 0.2s ease",
//   },

//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "60vh",
//   },

//   spinner: {
//     width: "50px",
//     height: "50px",
//     border: "3px solid #e5e7eb",
//     borderTop: "3px solid #3D1A5B",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: "16px",
//   },

//   loadingText: {
//     color: "#6b7280",
//     fontSize: "16px",
//   },

//   mainContent: {
//     flex: 1,
//     overflowX: "hidden",
//     maxWidth: "1400px",
//   },

//   headerSection: {
//     marginBottom: "32px",
//   },

//   headerTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//     gap: "16px",
//     marginBottom: "24px",
//   },

//   pageTitle: {
//     fontSize: "28px",
//     fontWeight: "700",
//     color: "#3D1A5B",
//     margin: 0,
//     marginBottom: "8px",
//   },

//   highlightText: {
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//   },

//   pageSubtitle: {
//     color: "#6b7280",
//     fontSize: "16px",
//     margin: 0,
//   },

//   liveDataBadge: {
//     background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
//     border: "1px solid rgba(61, 26, 91, 0.2)",
//     borderRadius: "8px",
//     padding: "12px 16px",
//   },

//   liveDataText: {
//     color: "#3D1A5B",
//     fontSize: "14px",
//     fontWeight: "600",
//     margin: 0,
//   },

//   statsSection: {
//     marginBottom: "48px",
//   },

//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     marginBottom: "20px",
//   },

//   sectionIndicator: {
//     width: "4px",
//     height: "20px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     borderRadius: "2px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#374151",
//     margin: 0,
//   },

//   cardGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//     gap: "24px",
//   },

//   statCard: {
//     color: "#fff",
//     padding: "28px",
//     borderRadius: "16px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//     cursor: "pointer",
//   },

//   statIconContainer: {
//     fontSize: "36px",
//     opacity: 0.9,
//   },

//   statContent: {
//     flex: 1,
//   },

//   statTitle: {
//     fontSize: "14px",
//     fontWeight: "500",
//     opacity: 0.9,
//     marginBottom: "8px",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },

//   statValue: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "4px",
//     margin: 0,
//   },

//   statSubtitle: {
//     fontSize: "13px",
//     opacity: 0.8,
//     margin: 0,
//   },

//   formSection: {
//     marginBottom: "40px",
//   },

//   formCard: {
//     background: "#fff",
//     padding: "40px",
//     borderRadius: "20px",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//   },

//   formHeader: {
//     marginBottom: "32px",
//   },

//   formTitle: {
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "#3D1A5B",
//     marginBottom: "8px",
//     margin: 0,
//   },

//   formSubtitle: {
//     fontSize: "15px",
//     color: "#6b7280",
//     margin: 0,
//   },

//   formStyle: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "24px",
//   },

//   formRow: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px",
//   },

//   fieldContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },

//   labelStyle: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#334155",
//   },

//   inputStyle: {
//     width: "100%",
//     padding: "12px 16px",
//     borderRadius: "10px",
//     border: "2px solid #e2e8f0",
//     fontSize: "14px",
//     transition: "border-color 0.3s ease, box-shadow 0.3s ease",
//     outline: "none",
//     fontFamily: "inherit",
//     boxSizing: "border-box",
//   },

//   errorInputStyle: {
//     borderColor: "#ef4444",
//   },

//   textareaStyle: {
//     width: "100%",
//     padding: "12px 16px",
//     borderRadius: "10px",
//     border: "2px solid #e2e8f0",
//     fontSize: "14px",
//     transition: "border-color 0.3s ease",
//     outline: "none",
//     fontFamily: "inherit",
//     resize: "vertical",
//     boxSizing: "border-box",
//   },

//   rulesContainer: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "12px",
//     padding: "16px",
//     background: "linear-gradient(135deg, rgba(241, 213, 114, 0.1) 0%, rgba(166, 138, 70, 0.1) 100%)",
//     borderRadius: "10px",
//     border: "1px solid rgba(166, 138, 70, 0.2)",
//   },

//   rulesText: {
//     fontSize: "13px",
//     color: "#92400e",
//     margin: 0,
//     lineHeight: "1.6",
//   },

//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     fontSize: "14px",
//     color: "#475569",
//     cursor: "pointer",
//   },

//   checkboxStyle: {
//     width: "18px",
//     height: "18px",
//     cursor: "pointer",
//   },

//   errorText: {
//     fontSize: "13px",
//     color: "#ef4444",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     marginTop: "4px",
//   },

//   submitButton: {
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     padding: "14px 32px",
//     borderRadius: "10px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "600",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//   },

//   buttonSpinner: {
//     width: "16px",
//     height: "16px",
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #fff",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
// };

// // Add responsive CSS
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
  
//   button:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
//   }
  
//   button:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
  
//   input:focus, select:focus, textarea:focus {
//     border-color: #3D1A5B !important;
//     box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
//   }

//   .statCard:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 12px 35px rgba(0,0,0,0.2);
//   }

//   /* Mobile Responsive Styles */
//   @media (max-width: 768px) {
//     /* Show mobile menu button */
//     [style*="mobileMenuButton"] {
//       display: flex !important;
//       align-items: center;
//       justify-content: center;
//     }

//     /* Adjust page title */
//     [style*="pageTitle"] {
//       font-size: 24px !important;
//     }

//     /* Adjust page subtitle */
//     [style*="pageSubtitle"] {
//       font-size: 14px !important;
//     }

//     /* Full width badge */
//     [style*="liveDataBadge"] {
//       width: 100%;
//     }

//     /* Single column card grid */
//     [style*="cardGrid"] {
//       grid-template-columns: 1fr !important;
//     }

//     /* Adjust stat card */
//     [style*="statCard"] {
//       padding: 20px !important;
//     }

//     /* Adjust form card */
//     [style*="formCard"] {
//       padding: 24px 20px !important;
//       border-radius: 16px !important;
//     }

//     /* Single column form rows */
//     [style*="formRow"] {
//       grid-template-columns: 1fr !important;
//       gap: 16px !important;
//     }

//     /* Adjust section title */
//     [style*="sectionTitle"] {
//       font-size: 18px !important;
//     }

//     /* Adjust form title */
//     [style*="formTitle"] {
//       font-size: 20px !important;
//     }

//     /* Adjust button */
//     [style*="submitButton"] {
//       width: 100%;
//       font-size: 14px !important;
//       padding: 12px 24px !important;
//     }

//     /* Adjust form input padding */
//     [style*="inputStyle"], [style*="textareaStyle"] {
//       padding: 10px 14px !important;
//     }
//   }

//   @media (max-width: 480px) {
//     /* Extra small devices */
//     [style*="pageTitle"] {
//       font-size: 20px !important;
//     }

//     [style*="statValue"] {
//       font-size: 24px !important;
//     }

//     [style*="statIconContainer"] {
//       font-size: 28px !important;
//     }

//     [style*="formCard"] {
//       padding: 20px 16px !important;
//     }

//     [style*="liveDataBadge"] {
//       padding: 10px 12px !important;
//     }

//     [style*="liveDataText"] {
//       font-size: 12px !important;
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default StudentDashboard;
















// // src/pages/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import StudentSidebar from "../components/StudentSidebar";
// import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle, FaBars, FaTimes } from "react-icons/fa";
// import {
//   getStudentEnrollments,
//   getAllCourses,
// } from "../api/api";

// const StudentDashboard = () => {
//   /* ================= USER INFO ================= */
//   const userInfo = localStorage.getItem("userInfo");
//   const parsedUser = userInfo ? JSON.parse(userInfo) : null;

//   const studentId = parsedUser?._id || parsedUser?.id || null;
//   const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

//   /* ================= STATES ================= */
//   const [loading, setLoading] = useState(true);
//   const [myCourses, setMyCourses] = useState(0);
//   const [subscriptionTime, setSubscriptionTime] = useState("Loading...");
//   const [coursesList, setCoursesList] = useState([]);
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


//   /* ================= RESPONSIVE HANDLING ================= */
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       // Close sidebar when switching from mobile to desktop
//       if (!mobile && isMobileSidebarOpen) {
//         setIsMobileSidebarOpen(false);
//       }
//     };
    
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isMobileSidebarOpen]);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       setLoading(true);
//       await Promise.all([fetchDashboard(), fetchCourses()]);
//       setLoading(false);
//     };
//     initializeDashboard();
//   }, []);

//   /* ================= FUNCTIONS ================= */
//   const fetchDashboard = async () => {
//     if (!studentId) return;

//     try {
//       const enrollments = await getStudentEnrollments(studentId);

//       // Count total courses
//       setMyCourses(enrollments.length);

//       // Save enrolled courses safely (filter out null courses)
//       setEnrolledCourses(
//         enrollments
//           .filter((e) => e.course)
//           .map((e) => e.course._id)
//       );

//       // Calculate subscription time using first active course
//       const activeCourse = enrollments.find((e) => e.course && e.course.endDate);
//       if (activeCourse) {
//         const diff = new Date(activeCourse.course.endDate) - new Date();
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//         setSubscriptionTime(days > 0 ? `${days} Days Remaining` : "Expired");
//       } else {
//         setSubscriptionTime("N/A");
//       }
//     } catch (error) {
//       console.error("Error fetching dashboard:", error);
//     }
//   };

//   const fetchCourses = async () => {
//     try {
//       const res = await getAllCourses();
//       setCoursesList(res);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };
//   if (loading) {
//     return (
//       <div style={styles.pageContainer}>
//         <StudentSidebar/>
//         <div style={{
//           ...styles.mainContent,
//           marginLeft: isMobile ? "0" : "280px",
//           paddingTop: isMobile ? "80px" : "32px",
//         }}>
//           <div style={styles.loadingContainer}>
//             <div style={styles.spinner} />
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//             <p style={styles.loadingText}>Loading dashboard data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={styles.pageContainer}>
//       <StudentSidebar 
//         isMobile={isMobile}
//         isOpen={isMobileSidebarOpen}
//         onClose={() => setIsMobileSidebarOpen(false)}
//       />
      
//       {/* Mobile Menu Button - Only visible on mobile */}
//       {isMobile && (
//         <button 
//           style={styles.mobileMenuButton}
//           onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//           aria-label="Toggle menu"
//         >
//           {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       )}

//       <div style={{
//         ...styles.mainContent,
//         marginLeft: isMobile ? "0" : "280px",
//         padding: isMobile ? "80px 16px 32px 16px" : "32px",
//       }}>
//         {/* Header Section */}
//         <div style={styles.headerSection}>
//           <div style={styles.headerTop}>
//             <div>
//               <h1 style={styles.pageTitle}>
//                 Welcome back, <span style={styles.highlightText}>{studentName}</span>
//               </h1>
//               <p style={styles.pageSubtitle}>Here's your learning overview and progress</p>
//             </div>
//             <div style={styles.liveDataBadge}>
//               <p style={styles.liveDataText}>
//                 Live Data{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div style={styles.statsSection}>
//           <div style={styles.sectionHeader}>
//             <div style={styles.sectionIndicator}></div>
//             <h2 style={styles.sectionTitle}>Overview</h2>
//           </div>
//           <div style={styles.cardGrid}>
//             <StatCard
//               icon={<FaBook />}
//               title="My Courses"
//               value={myCourses}
//               subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
//               gradient="linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)"
//             />
//             <StatCard
//               icon={<FaClock />}
//               title="Subscription Time"
//               value={subscriptionTime}
//               subtitle="Until your access expires"
//               gradient="linear-gradient(135deg, #F1D572 0%, #A68A46 100%)"
//             />
//           </div>
//         </div>

//         {/* Enrollment Form */}
//         <div style={styles.formSection}>
//           <div style={styles.sectionHeader}>
//                   </div>
//                 </div>
//       </div>
//     </div>
//   );
// };
// const StatCard = ({ icon, title, value, subtitle, gradient }) => (
//   <div style={{ ...styles.statCard, background: gradient }}>
//     <div style={styles.statIconContainer}>{icon}</div>
//     <div style={styles.statContent}>
//       <h3 style={styles.statTitle}>{title}</h3>
//       <p style={styles.statValue}>{value}</p>
//       <p style={styles.statSubtitle}>{subtitle}</p>
//     </div>
//   </div>
// );



// /* ================= STYLES ================= */
// const styles = {
//   pageContainer: {
//     display: "flex",
//     backgroundColor: "#f9fafb",
//     minHeight: "100vh",
//     position: "relative",
//   },

//   mobileMenuButton: {
//     position: "fixed",
//     top: "16px",
//     left: "16px",
//     zIndex: 1000,
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     padding: "12px",
//     fontSize: "20px",
//     cursor: "pointer",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     transition: "transform 0.2s ease",
//   },

//   loadingContainer: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     minHeight: "60vh",
//   },

//   spinner: {
//     width: "50px",
//     height: "50px",
//     border: "3px solid #e5e7eb",
//     borderTop: "3px solid #3D1A5B",
//     borderRadius: "50%",
//     animation: "spin 1s linear infinite",
//     marginBottom: "16px",
//   },

//   loadingText: {
//     color: "#6b7280",
//     fontSize: "16px",
//   },

//   mainContent: {
//     flex: 1,
//     overflowX: "hidden",
//     maxWidth: "1400px",
//   },

//   headerSection: {
//     marginBottom: "32px",
//   },

//   headerTop: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     flexWrap: "wrap",
//     gap: "16px",
//     marginBottom: "24px",
//   },

//   pageTitle: {
//     fontSize: "28px",
//     fontWeight: "700",
//     color: "#3D1A5B",
//     margin: 0,
//     marginBottom: "8px",
//   },

//   highlightText: {
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     WebkitBackgroundClip: "text",
//     WebkitTextFillColor: "transparent",
//     backgroundClip: "text",
//   },

//   pageSubtitle: {
//     color: "#6b7280",
//     fontSize: "16px",
//     margin: 0,
//   },

//   liveDataBadge: {
//     background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
//     border: "1px solid rgba(61, 26, 91, 0.2)",
//     borderRadius: "8px",
//     padding: "12px 16px",
//   },

//   liveDataText: {
//     color: "#3D1A5B",
//     fontSize: "14px",
//     fontWeight: "600",
//     margin: 0,
//   },

//   statsSection: {
//     marginBottom: "48px",
//   },

//   sectionHeader: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     marginBottom: "20px",
//   },

//   sectionIndicator: {
//     width: "4px",
//     height: "20px",
//     background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
//     borderRadius: "2px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: "600",
//     color: "#374151",
//     margin: 0,
//   },

//   cardGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//     gap: "24px",
//   },

//   statCard: {
//     color: "#fff",
//     padding: "28px",
//     borderRadius: "16px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//     display: "flex",
//     alignItems: "center",
//     gap: "20px",
//     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//     cursor: "pointer",
//   },

//   statIconContainer: {
//     fontSize: "36px",
//     opacity: 0.9,
//   },

//   statContent: {
//     flex: 1,
//   },

//   statTitle: {
//     fontSize: "14px",
//     fontWeight: "500",
//     opacity: 0.9,
//     marginBottom: "8px",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//   },

//   statValue: {
//     fontSize: "28px",
//     fontWeight: "700",
//     marginBottom: "4px",
//     margin: 0,
//   },

//   statSubtitle: {
//     fontSize: "13px",
//     opacity: 0.8,
//     margin: 0,
//   },

//   formSection: {
//     marginBottom: "40px",
//   },

//   formCard: {
//     background: "#fff",
//     padding: "40px",
//     borderRadius: "20px",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//   },

//   formHeader: {
//     marginBottom: "32px",
//   },

//   formTitle: {
//     fontSize: "22px",
//     fontWeight: "700",
//     color: "#3D1A5B",
//     marginBottom: "8px",
//     margin: 0,
//   },

//   formSubtitle: {
//     fontSize: "15px",
//     color: "#6b7280",
//     margin: 0,
//   },

//   formStyle: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "24px",
//   },

//   formRow: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: "20px",
//   },

//   fieldContainer: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },

//   labelStyle: {
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#334155",
//   },

//   inputStyle: {
//     width: "100%",
//     padding: "12px 16px",
//     borderRadius: "10px",
//     border: "2px solid #e2e8f0",
//     fontSize: "14px",
//     transition: "border-color 0.3s ease, box-shadow 0.3s ease",
//     outline: "none",
//     fontFamily: "inherit",
//     boxSizing: "border-box",
//   },

//   errorInputStyle: {
//     borderColor: "#ef4444",
//   },

//   textareaStyle: {
//     width: "100%",
//     padding: "12px 16px",
//     borderRadius: "10px",
//     border: "2px solid #e2e8f0",
//     fontSize: "14px",
//     transition: "border-color 0.3s ease",
//     outline: "none",
//     fontFamily: "inherit",
//     resize: "vertical",
//     boxSizing: "border-box",
//   },

//   rulesContainer: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "12px",
//     padding: "16px",
//     background: "linear-gradient(135deg, rgba(241, 213, 114, 0.1) 0%, rgba(166, 138, 70, 0.1) 100%)",
//     borderRadius: "10px",
//     border: "1px solid rgba(166, 138, 70, 0.2)",
//   },

//   rulesText: {
//     fontSize: "13px",
//     color: "#92400e",
//     margin: 0,
//     lineHeight: "1.6",
//   },

//   checkboxLabel: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     fontSize: "14px",
//     color: "#475569",
//     cursor: "pointer",
//   },

//   checkboxStyle: {
//     width: "18px",
//     height: "18px",
//     cursor: "pointer",
//   },

//   errorText: {
//     fontSize: "13px",
//     color: "#ef4444",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     marginTop: "4px",
//   },

//   submitButton: {
//     background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
//     color: "#fff",
//     padding: "14px 32px",
//     borderRadius: "10px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "16px",
//     fontWeight: "600",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "10px",
//     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//     boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
//   },

//   buttonSpinner: {
//     width: "16px",
//     height: "16px",
//     border: "2px solid rgba(255,255,255,0.3)",
//     borderTop: "2px solid #fff",
//     borderRadius: "50%",
//     animation: "spin 0.8s linear infinite",
//   },
// };

// // Add responsive CSS
// const styleSheet = document.createElement("style");
// styleSheet.textContent = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
  
//   button:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
//   }
  
//   button:disabled {
//     opacity: 0.7;
//     cursor: not-allowed;
//   }
  
//   input:focus, select:focus, textarea:focus {
//     border-color: #3D1A5B !important;
//     box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
//   }

//   .statCard:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 12px 35px rgba(0,0,0,0.2);
//   }

//   /* Mobile Responsive Styles */
//   @media (max-width: 768px) {
//     /* Show mobile menu button */
//     [style*="mobileMenuButton"] {
//       display: flex !important;
//       align-items: center;
//       justify-content: center;
//     }

//     /* Adjust page title */
//     [style*="pageTitle"] {
//       font-size: 24px !important;
//     }

//     /* Adjust page subtitle */
//     [style*="pageSubtitle"] {
//       font-size: 14px !important;
//     }

//     /* Full width badge */
//     [style*="liveDataBadge"] {
//       width: 100%;
//     }

//     /* Single column card grid */
//     [style*="cardGrid"] {
//       grid-template-columns: 1fr !important;
//     }

//     /* Adjust stat card */
//     [style*="statCard"] {
//       padding: 20px !important;
//     }

//     /* Adjust form card */
//     [style*="formCard"] {
//       padding: 24px 20px !important;
//       border-radius: 16px !important;
//     }

//     /* Single column form rows */
//     [style*="formRow"] {
//       grid-template-columns: 1fr !important;
//       gap: 16px !important;
//     }

//     /* Adjust section title */
//     [style*="sectionTitle"] {
//       font-size: 18px !important;
//     }

//     /* Adjust form title */
//     [style*="formTitle"] {
//       font-size: 20px !important;
//     }

//     /* Adjust button */
//     [style*="submitButton"] {
//       width: 100%;
//       font-size: 14px !important;
//       padding: 12px 24px !important;
//     }

//     /* Adjust form input padding */
//     [style*="inputStyle"], [style*="textareaStyle"] {
//       padding: 10px 14px !important;
//     }
//   }

//   @media (max-width: 480px) {
//     /* Extra small devices */
//     [style*="pageTitle"] {
//       font-size: 20px !important;
//     }

//     [style*="statValue"] {
//       font-size: 24px !important;
//     }

//     [style*="statIconContainer"] {
//       font-size: 28px !important;
//     }

//     [style*="formCard"] {
//       padding: 20px 16px !important;
//     }

//     [style*="liveDataBadge"] {
//       padding: 10px 12px !important;
//     }

//     [style*="liveDataText"] {
//       font-size: 12px !important;
//     }
//   }
// `;
// document.head.appendChild(styleSheet);

// export default StudentDashboard;



// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { FaBook, FaClock, FaCheckCircle, FaExclamationCircle, FaBars, FaTimes, FaCalendarAlt, FaHourglassHalf } from "react-icons/fa";
import {
  getStudentEnrollments,
  getAllCourses,
} from "../api/api";

const StudentDashboard = () => {
  /* ================= USER INFO ================= */
  const userInfo = localStorage.getItem("userInfo");
  const parsedUser = userInfo ? JSON.parse(userInfo) : null;

  const studentId = parsedUser?._id || parsedUser?.id || null;
  const studentName = parsedUser?.fullName || parsedUser?.name || "Student";

  /* ================= STATES ================= */
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    timeRemaining: "Loading...",
    daysRemaining: null,
    expiryDate: null,
    status: "active",
    lectureLimit: null,
    lecturesUsed: 0,
    totalLectures: 0
  });
  const [coursesList, setCoursesList] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollmentsData, setEnrollmentsData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  /* ================= RESPONSIVE HANDLING ================= */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchCourses()]);
      setLoading(false);
    };
    initializeDashboard();
  }, []);

  /* ================= FUNCTIONS ================= */
  
  // Calculate subscription time from enrollment data
  const calculateSubscriptionTime = (enrollments) => {
    if (!enrollments || enrollments.length === 0) {
      return {
        timeRemaining: "No Active Subscriptions",
        daysRemaining: null,
        expiryDate: null,
        status: "no_subscription",
        lectureLimit: null,
        lecturesUsed: 0,
        totalLectures: 0
      };
    }

    let bestExpiry = null;
    let totalDaysRemaining = null;
    let lectureLimitInfo = null;
    let totalLecturesCount = 0;
    let lecturesUsedCount = 0;

    // Process each enrollment to find the best (longest remaining) access
    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      if (!course) return;

      totalLecturesCount += course.totalLectures || 0;
      
      // Check lecture limit info
      if (enrollment.lectureLimit) {
        lecturesUsedCount += (enrollment.accessedLectures || []).length;
        if (!lectureLimitInfo || enrollment.lectureLimit > lectureLimitInfo.limit) {
          lectureLimitInfo = {
            limit: enrollment.lectureLimit,
            used: (enrollment.accessedLectures || []).length,
            remaining: enrollment.lectureLimit - (enrollment.accessedLectures || []).length,
            courseTitle: course.title
          };
        }
      }

      // Check expiry date
      let expiryDate = null;
      let daysRemaining = null;
      
      // Priority 1: endDate from enrollment
      if (enrollment.endDate) {
        expiryDate = new Date(enrollment.endDate);
        daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      } 
      // Priority 2: course endDate
      else if (course.endDate) {
        expiryDate = new Date(course.endDate);
        daysRemaining = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      }
      // Priority 3: lifetime access (no expiry)
      else if (enrollment.isPaid || enrollment.grantedByAdmin) {
        daysRemaining = null; // Lifetime access
        expiryDate = null;
      }

      // Select the enrollment with most days remaining (or lifetime access)
      if (daysRemaining === null) {
        // Lifetime access is best
        bestExpiry = null;
        totalDaysRemaining = null;
      } else if (daysRemaining > 0 && (totalDaysRemaining === null || daysRemaining > totalDaysRemaining)) {
        bestExpiry = expiryDate;
        totalDaysRemaining = daysRemaining;
      }
    });

    // Determine status and time remaining text
    let timeRemaining = "";
    let status = "active";
    
    if (totalDaysRemaining === null && bestExpiry === null) {
      timeRemaining = "Lifetime Access";
      status = "lifetime";
    } else if (totalDaysRemaining > 0) {
      if (totalDaysRemaining <= 7) {
        status = "expiring_soon";
        timeRemaining = `${totalDaysRemaining} Day${totalDaysRemaining !== 1 ? 's' : ''} Remaining ⚠️`;
      } else {
        status = "active";
        timeRemaining = `${totalDaysRemaining} Days Remaining`;
      }
    } else if (totalDaysRemaining === 0) {
      timeRemaining = "Expires Today";
      status = "expiring_soon";
    } else if (totalDaysRemaining < 0) {
      timeRemaining = "Expired";
      status = "expired";
    }

    // Check if any enrollment is expired but still has lecture limit
    if (status === "expired" && lectureLimitInfo && lectureLimitInfo.remaining > 0) {
      timeRemaining = `${lectureLimitInfo.remaining} Lectures Left`;
      status = "lecture_limit";
    }

    return {
      timeRemaining,
      daysRemaining: totalDaysRemaining,
      expiryDate: bestExpiry,
      status,
      lectureLimit: lectureLimitInfo,
      lecturesUsed: lecturesUsedCount,
      totalLectures: totalLecturesCount
    };
  };

  const fetchDashboard = async () => {
    if (!studentId) return;

    try {
      const enrollments = await getStudentEnrollments(studentId);
      setEnrollmentsData(enrollments);
      
      // Count total courses (only active/purchased courses)
      const activeEnrollments = enrollments.filter(e => 
        e.isPaid || e.grantedByAdmin || (e.course && e.course.price === 0)
      );
      setMyCourses(activeEnrollments.length);

      // Save enrolled courses IDs
      setEnrolledCourses(
        enrollments
          .filter((e) => e.course)
          .map((e) => e.course._id)
      );

      // Calculate subscription info
      const subscriptionInfo = calculateSubscriptionTime(enrollments);
      setSubscriptionInfo(subscriptionInfo);
      
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setSubscriptionInfo({
        timeRemaining: "Error loading data",
        daysRemaining: null,
        expiryDate: null,
        status: "error",
        lectureLimit: null,
        lecturesUsed: 0,
        totalLectures: 0
      });
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCoursesList(res);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Helper function to format expiry date
  const formatExpiryDate = (date) => {
    if (!date) return "Never (Lifetime)";
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'expiring_soon': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'lifetime': return '#8b5cf6';
      case 'lecture_limit': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FaCheckCircle />;
      case 'expiring_soon': return <FaHourglassHalf />;
      case 'expired': return <FaExclamationCircle />;
      case 'lifetime': return <FaCalendarAlt />;
      case 'lecture_limit': return <FaBook />;
      default: return <FaClock />;
    }
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <StudentSidebar 
          isMobile={isMobile}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <div style={{
          ...styles.mainContent,
          marginLeft: isMobile ? "0" : "280px",
          paddingTop: isMobile ? "80px" : "32px",
        }}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <p style={styles.loadingText}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <StudentSidebar 
        isMobile={isMobile}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <button 
          style={styles.mobileMenuButton}
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isMobileSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      <div style={{
        ...styles.mainContent,
        marginLeft: isMobile ? "0" : "280px",
        padding: isMobile ? "80px 16px 32px 16px" : "32px",
      }}>
        {/* Header Section */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                Welcome back, <span style={styles.highlightText}>{studentName}</span>
              </h1>
              <p style={styles.pageSubtitle}>Here's your learning overview and progress</p>
            </div>
            <div style={styles.liveDataBadge}>
              <p style={styles.liveDataText}>
                Live Data • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div style={styles.statsSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIndicator}></div>
            <h2 style={styles.sectionTitle}>Overview</h2>
          </div>
          <div style={styles.cardGrid}>
            <StatCard
              icon={<FaBook />}
              title="My Courses"
              value={myCourses}
              subtitle={`${myCourses} ${myCourses === 1 ? "course" : "courses"} enrolled`}
              gradient="linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)"
            />
            <StatCard
              icon={getStatusIcon(subscriptionInfo.status)}
              title="Subscription Status"
              value={subscriptionInfo.timeRemaining}
              subtitle={
                subscriptionInfo.expiryDate 
                  ? `Expires: ${formatExpiryDate(subscriptionInfo.expiryDate)}`
                  : subscriptionInfo.status === 'lifetime'
                    ? "Never expires"
                    : "No active subscription"
              }
              gradient={`linear-gradient(135deg, ${getStatusColor(subscriptionInfo.status)} 0%, ${getStatusColor(subscriptionInfo.status)}CC 100%)`}
            />
          </div>
        </div>

        {/* Additional Course Info Section (Optional) */}
        {subscriptionInfo.lectureLimit && (
          <div style={styles.lectureInfoSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Lecture Access Details</h2>
            </div>
            <div style={styles.lectureInfoCard}>
              <div style={styles.lectureInfoHeader}>
                <FaBook style={styles.lectureInfoIcon} />
                <div>
                  <h3 style={styles.lectureInfoTitle}>{subscriptionInfo.lectureLimit.courseTitle}</h3>
                  <p style={styles.lectureInfoSubtitle}>Lecture Limit Access</p>
                </div>
              </div>
              <div style={styles.lectureProgressBar}>
                <div style={{
                  ...styles.lectureProgressFill,
                  width: `${(subscriptionInfo.lectureLimit.used / subscriptionInfo.lectureLimit.limit) * 100}%`
                }} />
              </div>
              <div style={styles.lectureInfoStats}>
                <span>Used: {subscriptionInfo.lectureLimit.used}</span>
                <span>Remaining: {subscriptionInfo.lectureLimit.remaining}</span>
                <span>Total: {subscriptionInfo.lectureLimit.limit}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Enrollments Section */}
        {enrollmentsData.length > 0 && (
          <div style={styles.recentSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIndicator}></div>
              <h2 style={styles.sectionTitle}>Your Courses</h2>
            </div>
            <div style={styles.coursesGrid}>
              {enrollmentsData.slice(0, 6).map((enrollment, index) => (
                <div key={index} style={styles.courseCard}>
                  <div style={styles.courseCardHeader}>
                    <h3 style={styles.courseCardTitle}>
                      {enrollment.course?.title || "Untitled Course"}
                    </h3>
                    {enrollment.isPaid && (
                      <span style={styles.paidBadge}>Purchased</span>
                    )}
                    {enrollment.grantedByAdmin && (
                      <span style={styles.adminBadge}>Admin Access</span>
                    )}
                  </div>
                  {enrollment.endDate && (
                    <div style={styles.courseExpiry}>
                      <FaClock size={12} />
                      <span>
                        Expires: {new Date(enrollment.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {enrollment.lectureLimit && (
                    <div style={styles.courseLimit}>
                      <FaBook size={12} />
                      <span>
                        Lectures: {enrollment.accessedLectures?.length || 0} / {enrollment.lectureLimit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, gradient }) => (
  <div style={{ ...styles.statCard, background: gradient }}>
    <div style={styles.statIconContainer}>{icon}</div>
    <div style={styles.statContent}>
      <h3 style={styles.statTitle}>{title}</h3>
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statSubtitle}>{subtitle}</p>
    </div>
  </div>
);

/* ================= STYLES ================= */
const styles = {
  pageContainer: {
    display: "flex",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    position: "relative",
  },

  mobileMenuButton: {
    position: "fixed",
    top: "16px",
    left: "16px",
    zIndex: 1000,
    background: "linear-gradient(135deg, #3D1A5B 0%, #5E427B 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(61, 26, 91, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease",
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },

  loadingText: {
    color: "#6b7280",
    fontSize: "16px",
  },

  mainContent: {
    flex: 1,
    overflowX: "hidden",
    maxWidth: "1400px",
  },

  headerSection: {
    marginBottom: "32px",
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#3D1A5B",
    margin: 0,
    marginBottom: "8px",
  },

  highlightText: {
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  pageSubtitle: {
    color: "#6b7280",
    fontSize: "16px",
    margin: 0,
  },

  liveDataBadge: {
    background: "linear-gradient(135deg, rgba(61, 26, 91, 0.1) 0%, rgba(94, 66, 123, 0.1) 100%)",
    border: "1px solid rgba(61, 26, 91, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
  },

  liveDataText: {
    color: "#3D1A5B",
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },

  statsSection: {
    marginBottom: "32px",
  },

  lectureInfoSection: {
    marginBottom: "32px",
  },

  recentSection: {
    marginBottom: "32px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },

  sectionIndicator: {
    width: "4px",
    height: "20px",
    background: "linear-gradient(135deg, #3D1A5B 0%, #F1D572 100%)",
    borderRadius: "2px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },

  statCard: {
    color: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  },

  statIconContainer: {
    fontSize: "36px",
    opacity: 0.9,
  },

  statContent: {
    flex: 1,
  },

  statTitle: {
    fontSize: "14px",
    fontWeight: "500",
    opacity: 0.9,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "4px",
    margin: 0,
    wordBreak: "break-word",
  },

  statSubtitle: {
    fontSize: "12px",
    opacity: 0.8,
    margin: 0,
  },

  lectureInfoCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },

  lectureInfoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },

  lectureInfoIcon: {
    fontSize: "32px",
    color: "#3D1A5B",
  },

  lectureInfoTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1f2937",
    margin: 0,
    marginBottom: "4px",
  },

  lectureInfoSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: 0,
  },

  lectureProgressBar: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "16px",
  },

  lectureProgressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #3D1A5B, #5E427B)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },

  lectureInfoStats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#6b7280",
  },

  coursesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },

  courseCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },

  courseCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },

  courseCardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
    flex: 1,
  },

  paidBadge: {
    background: "#d1fae5",
    color: "#065f46",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginLeft: "8px",
  },

  adminBadge: {
    background: "#dbeafe",
    color: "#1e40af",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    marginLeft: "8px",
  },

  courseExpiry: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
  },

  courseLimit: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "6px",
  },
};

// Add responsive CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(61, 26, 91, 0.4);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #3D1A5B !important;
    box-shadow: 0 0 0 3px rgba(61, 26, 91, 0.1);
  }

  .statCard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.2);
  }

  .courseCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }

  /* Mobile Responsive Styles */
  @media (max-width: 768px) {
    [style*="pageTitle"] {
      font-size: 24px !important;
    }

    [style*="pageSubtitle"] {
      font-size: 14px !important;
    }

    [style*="liveDataBadge"] {
      width: 100%;
    }

    [style*="cardGrid"] {
      grid-template-columns: 1fr !important;
    }

    [style*="statCard"] {
      padding: 20px !important;
    }

    [style*="statValue"] {
      font-size: 18px !important;
    }

    [style*="coursesGrid"] {
      grid-template-columns: 1fr !important;
    }

    [style*="sectionTitle"] {
      font-size: 18px !important;
    }
  }

  @media (max-width: 480px) {
    [style*="pageTitle"] {
      font-size: 20px !important;
    }

    [style*="statIconContainer"] {
      font-size: 28px !important;
    }

    [style*="liveDataBadge"] {
      padding: 10px 12px !important;
    }

    [style*="liveDataText"] {
      font-size: 12px !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default StudentDashboard;