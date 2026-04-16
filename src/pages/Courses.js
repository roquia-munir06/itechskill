// src/pages/Courses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  FaEdit, FaTrash, FaVideo, FaPlus, FaTimes, FaLock, FaUnlock,
  FaUsers, FaRupeeSign, FaChartLine, FaGraduationCap, FaMoneyBillWave,
  FaArrowRight, FaSearch, FaSort, FaFilter, FaTags, FaExclamationTriangle,
  FaSpinner, FaCheckCircle, FaTimesCircle, FaEnvelope, FaBars,
} from "react-icons/fa";
import {
  getCourses, deleteCourse, updateCourse, createCourse,
  getAdminEnrollments, getAdminPayments, grantFreeAccessToStudent,
  getAllUsers, getCurrentUser,
} from "../api/api";

// ── Color Theme ──
const COLORS = {
  sidebarDark: "#1a1d2e", deepPurple: "#3D1A5B", headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3", goldBadge: "#D4A745", roleBg: "#E8DFF5",
  white: "#FFFFFF", bgGray: "#F9FAFB", lightGray: "#F3F4F6",
  darkGray: "#6B7280", textGray: "#4B5563", danger: "#EF4444",
  warning: "#F59E0B", info: "#3B82F6", orange: "#F97316",
  primaryButton: "#3D1A5B", formButton: "#3B82F6", cancelButton: "#6B7280",
  blueLight: "#dbeafe", greenLight: "#d1fae5", yellowLight: "#fef3c7",
  purpleLight: "#ede9fe", teal: "#0d9488", indigo: "#4f46e5", rose: "#f43f5e",
};

const CATEGORIES = [
  { name: "Programming",        subcategories: ["Python", "JavaScript", "Java", "C++", "PHP", "Ruby", "Go", "Swift"] },
  { name: "Web Development",    subcategories: ["Frontend", "Backend", "Full Stack", "React", "Angular", "Vue.js", "Node.js"] },
  { name: "Data Science",       subcategories: ["Machine Learning", "AI", "Data Analysis", "Big Data", "Statistics", "Deep Learning"] },
  { name: "Mobile Development", subcategories: ["iOS", "Android", "React Native", "Flutter", "Kotlin", "Swift"] },
  { name: "Design",             subcategories: ["UI/UX", "Graphic Design", "Web Design", "Adobe Photoshop", "Figma", "Adobe XD", "Illustrator", "Canva"] },
  { name: "Business",           subcategories: ["Marketing", "Finance", "Management", "Entrepreneurship", "Sales", "Leadership"] },
  { name: "Cloud Computing",    subcategories: ["AWS", "Azure", "Google Cloud", "DevOps", "Docker", "Kubernetes"] },
  { name: "Database",           subcategories: ["MySQL", "MongoDB", "PostgreSQL", "Redis", "Firebase", "Oracle"] },
  { name: "Design Tools",       subcategories: ["Illustrator", "Canva", "Photoshop", "Figma", "Sketch", "InDesign", "CorelDRAW", "Affinity Designer"] },
];

const Modal = ({ children, onClose, width = "500px" }) => (
  <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }} onClick={onClose}>
    <div style={{ background: COLORS.white, borderRadius: "12px", padding: "24px", width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const CategoryCheckbox = ({ categories, selectedCategory, onSelect, isMobile }) => (
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "10px", marginBottom: "12px" }}>
    {categories.map(cat => (
      <label key={cat.name} style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "8px", borderRadius: "6px", background: selectedCategory === cat.name ? COLORS.purpleLight : "transparent", transition: "all 0.2s ease" }}>
        <input type="radio" name="category" checked={selectedCategory === cat.name} onChange={() => onSelect(cat.name)} style={{ marginRight: "8px", accentColor: COLORS.deepPurple }} />
        {cat.name}
      </label>
    ))}
  </div>
);

const SubcategoryCheckbox = ({ subcategories, selectedSubcategories, onToggle, isMobile }) => (
  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "8px", maxHeight: "200px", overflowY: "auto", padding: "10px", border: `1px solid ${COLORS.lightGray}`, borderRadius: "8px", background: COLORS.bgGray }}>
    {subcategories.length === 0 ? (
      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px", color: COLORS.darkGray }}>Please select a category first</div>
    ) : (
      subcategories.map(sub => (
        <div key={sub} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderRadius: "6px", background: selectedSubcategories.includes(sub) ? COLORS.purpleLight : COLORS.white, transition: "all 0.2s ease" }}>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer", flex: 1 }}>
            <input type="checkbox" checked={selectedSubcategories.includes(sub)} onChange={() => onToggle(sub)} style={{ marginRight: "8px", accentColor: COLORS.deepPurple }} />
            {sub}
          </label>
          {selectedSubcategories.includes(sub) && (
            <FaTimes onClick={(e) => { e.preventDefault(); onToggle(sub); }} style={{ color: COLORS.danger, cursor: "pointer", fontSize: "12px" }} />
          )}
        </div>
      ))
    )}
  </div>
);

const SubcategoryBadge = ({ subcategories, isMobile }) => {
  if (!subcategories || (!Array.isArray(subcategories) && typeof subcategories !== "string")) {
    return <span style={{ fontSize: "13px", color: COLORS.darkGray }}>No subcategories</span>;
  }
  let subcats = subcategories;
  if (typeof subcategories === "string") {
    try { subcats = JSON.parse(subcategories); if (!Array.isArray(subcats)) subcats = subcategories.split(","); }
    catch (e) { subcats = subcategories.split(","); }
  }
  if (!Array.isArray(subcats) || subcats.length === 0) return <span style={{ fontSize: "13px", color: COLORS.darkGray }}>No subcategories</span>;
  const displaySubcats = subcats.slice(0, 2);
  const hasMore = subcats.length > 2;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
      {displaySubcats.map((sub, i) => (
        <span key={i} style={{ background: getSubcategoryColor(sub), color: "#fff", padding: isMobile ? "2px 6px" : "3px 8px", borderRadius: "4px", fontSize: isMobile ? "10px" : "11px", fontWeight: "500", whiteSpace: "nowrap" }}>{sub}</span>
      ))}
      {hasMore && <span style={{ background: COLORS.darkGray, color: COLORS.white, padding: isMobile ? "2px 6px" : "3px 8px", borderRadius: "4px", fontSize: isMobile ? "10px" : "11px", fontWeight: "500" }}>+{subcats.length - 2} more</span>}
    </div>
  );
};

const getSubcategoryColor = (subcategory) => {
  const colorMap = { "Illustrator": "#FF9A00", "Canva": "#00C4CC", "Photoshop": "#31A8FF", "Figma": "#F24E1E", "Python": "#3776AB", "JavaScript": "#F7DF1E", "Java": "#007396", "React": "#61DAFB", "Angular": "#DD0031", "Vue.js": "#4FC08D", "Node.js": "#339933", "AWS": "#FF9900", "Azure": "#0089D6", "Docker": "#2496ED", "Machine Learning": "#FF6B6B", "AI": "#4ECDC4", "UI/UX": "#6C5CE7" };
  return colorMap[subcategory] || COLORS.deepPurple;
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const Courses = () => {
  const [courses,      setCourses]      = useState([]);
  const [enrollments,  setEnrollments]  = useState([]);
  const [payments,     setPayments]     = useState([]);
  const [showForm,     setShowForm]     = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [isMobile,     setIsMobile]     = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, totalRevenue: 0, paidCourses: 0, freeCourses: 0 });

  // Free Access Modal
  const [showFreeAccessModal,      setShowFreeAccessModal]      = useState(false);
  const [studentEmail,             setStudentEmail]             = useState("");
  const [selectedCoursesForGrant,  setSelectedCoursesForGrant]  = useState([]);
  const [searchingStudent,         setSearchingStudent]         = useState(false);
  const [foundStudent,             setFoundStudent]             = useState(null);
  const [grantAccessLoading,       setGrantAccessLoading]       = useState(false);
  const [grantAccessMessage,       setGrantAccessMessage]       = useState("");
  const [allUsers,                 setAllUsers]                 = useState([]);

  const navigate = useNavigate();

  // ✅ Get current user role
  const currentUser = getCurrentUser();
  const userRole    = currentUser?.role?.toLowerCase() || "student";
  const isAdmin     = userRole === "admin";
  const isTeacher   = userRole === "teacher";

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", subCategories: [],
    duration: 0, level: "Beginner", price: 0, status: "Active",
  });
  const [customCategory,    setCustomCategory]    = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile && isMobileSidebarOpen) setIsMobileSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const coursesData  = await getCourses();
      const coursesArray = Array.isArray(coursesData) ? coursesData : Array.isArray(coursesData?.courses) ? coursesData.courses : [];
      setCourses(coursesArray);

      // ✅ Only admin fetches enrollments/payments/users
      if (isAdmin) {
        try { const d = await getAdminEnrollments(); setEnrollments(Array.isArray(d) ? d : d?.enrollments || []); } catch { setEnrollments([]); }
        try { const d = await getAdminPayments();     setPayments(Array.isArray(d)     ? d : d?.payments     || []); } catch { setPayments([]); }
        try { const d = await getAllUsers();           setAllUsers(Array.isArray(d)     ? d                  : []); } catch { setAllUsers([]); }
      }

      calculateStatistics(coursesArray);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (coursesArray) => {
    const totalCourses = coursesArray.length;
    const paidCourses  = coursesArray.filter(c => c.price > 0).length;
    const freeCourses  = coursesArray.filter(c => c.price === 0).length;
    let totalRevenue = 0, enrolledStudents = new Set();
    enrollments.forEach(e => { if (e.isPaid && e.coursePrice) totalRevenue += e.coursePrice; if (e.studentId) enrolledStudents.add(e.studentId); });
    setStats({ totalCourses, totalStudents: enrolledStudents.size, totalRevenue, paidCourses, freeCourses });
  };

  useEffect(() => { fetchAllData(); }, []);

  // ✅ Role-based lectures navigation
  const handleViewLectures = (courseId) => {
    if (isAdmin) {
      navigate(`/lectures/${courseId}`);           // admin route
    } else if (isTeacher) {
      navigate(`/teacher/lectures/${courseId}`);   // teacher route
    }
  };

  // Grant access handlers (admin only)
  const handleSearchStudent = async () => {
    if (!studentEmail.trim()) { alert("Please enter student email"); return; }
    setSearchingStudent(true);
    setFoundStudent(null);
    setGrantAccessMessage("");
    try {
      const student = allUsers.find(u => u.email?.toLowerCase() === studentEmail.toLowerCase() && u.role === "Student");
      if (student) {
        const studentEnrollments = enrollments.filter(e => e.studentId === student._id || e.student === student._id);
        setFoundStudent({ ...student, enrollments: studentEnrollments });
      } else {
        setGrantAccessMessage("❌ Student not found with this email");
      }
    } catch { setGrantAccessMessage("❌ Error searching for student"); }
    finally { setSearchingStudent(false); }
  };

  const handleToggleCourseForGrant = (courseId) => {
    setSelectedCoursesForGrant(prev => prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]);
  };

  const studentHasAccess = (courseId) => {
    if (!foundStudent?.enrollments) return false;
    const e = foundStudent.enrollments.find(e => e.courseId === courseId || e.course === courseId);
    return e && e.isPaid;
  };

  const handleGrantAccessToCourses = async () => {
    if (!foundStudent || selectedCoursesForGrant.length === 0) { 
      
    console.log('❌ Validation failed:', { 
      hasStudent: !!foundStudent, 
      coursesCount: selectedCoursesForGrant.length 
    });
      alert("Please select a student and course(s)"); return; }
    
    try {
      setGrantAccessLoading(true);
      const results = [];
      for (const courseId of selectedCoursesForGrant) {
        try { await grantFreeAccessToStudent(foundStudent._id, courseId); results.push({ courseId, success: true }); }
        catch (err) { results.push({ courseId, success: false }); }
      }
      const successCount = results.filter(r => r.success).length;
      const failCount    = results.filter(r => !r.success).length;
      if (successCount > 0) {
        setGrantAccessMessage(`✅ Successfully granted access to ${successCount} course(s)${failCount > 0 ? ` (${failCount} failed)` : ""}`);
        setTimeout(() => { setShowFreeAccessModal(false); setStudentEmail(""); setFoundStudent(null); setSelectedCoursesForGrant([]); setGrantAccessMessage(""); fetchAllData(); }, 2000);
      } else { setGrantAccessMessage("❌ Failed to grant access"); }
    } catch { setGrantAccessMessage("❌ Error granting access"); }
    finally { setGrantAccessLoading(false); }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", category: "", subCategories: [], duration: 0, level: "Beginner", price: 0, status: "Active" });
    setCustomCategory(""); setCustomSubcategory("");
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setEditingId(course._id);
    let subCategoriesArray = [];
    if (course.subCategories) {
      if (typeof course.subCategories === "string") {
        try { subCategoriesArray = JSON.parse(course.subCategories); if (!Array.isArray(subCategoriesArray)) subCategoriesArray = course.subCategories.split(","); }
        catch { subCategoriesArray = course.subCategories.split(","); }
      } else if (Array.isArray(course.subCategories)) { subCategoriesArray = course.subCategories; }
    }
    setFormData({ title: course.title || "", description: course.description || "", category: course.category || "", subCategories: subCategoriesArray, duration: course.duration || 0, level: course.level || "Beginner", price: course.price || 0, status: course.status || "Active" });
    setCustomCategory(""); setCustomSubcategory("");
    setShowForm(true);
  };

  const handleChange     = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCategorySelect = (cat) => setFormData({ ...formData, category: cat, subCategories: [] });
  const handleSubcategoryToggle = (sub) => setFormData(prev => ({ ...prev, subCategories: prev.subCategories.includes(sub) ? prev.subCategories.filter(s => s !== sub) : [...prev.subCategories, sub] }));
  const handleAddCustomCategory  = () => { if (customCategory.trim()) { setFormData({ ...formData, category: customCategory.trim(), subCategories: [] }); setCustomCategory(""); } };
  const handleAddCustomSubcategory = () => { if (customSubcategory.trim() && !formData.subCategories.includes(customSubcategory.trim())) { setFormData(prev => ({ ...prev, subCategories: [...prev.subCategories, customSubcategory.trim()] })); setCustomSubcategory(""); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) { alert("Please select a category!"); return; }
    if (formData.subCategories.length === 0) { alert("Please select at least one subcategory!"); return; }
    setLoading(true);
    try {
      const payload = { ...formData };
      if (Array.isArray(payload.subCategories)) payload.subCategories = JSON.stringify(payload.subCategories);
      if (editingId) { await updateCourse(editingId, payload); alert("Course updated successfully"); }
      else           { await createCourse(payload);            alert("Course added successfully"); }
      setShowForm(false); fetchAllData();
    } catch (error) { alert(error.response?.data?.message || "Operation failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This will also remove all enrollments.")) return;
    try { await deleteCourse(id); fetchAllData(); }
    catch { alert("Delete failed"); }
  };

  const getAvailableSubcategories = () => { const cat = CATEGORIES.find(c => c.name === formData.category); return cat ? cat.subcategories : []; };
  const getCourseEnrollmentsCount = (id) => enrollments.filter(e => e.courseId === id).length;
  const getPaidEnrollmentsCount   = (id) => enrollments.filter(e => e.courseId === id && e.isPaid).length;
  const getCourseRevenue          = (id) => enrollments.filter(e => e.courseId === id && e.isPaid).reduce((sum, e) => sum + (e.coursePrice || 0), 0);

  const filteredCourses = Array.isArray(courses)
    ? courses.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.subCategories && (typeof c.subCategories === "string"
          ? c.subCategories.toLowerCase().includes(searchTerm.toLowerCase())
          : c.subCategories.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))))
      )
    : [];

  if (loading && !courses.length) {
    return (
      <div style={styles.pageContainer}>
        <Sidebar />
        <div style={{ ...styles.loadingContainer, marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 20px 20px" : "32px" }}>
          <div style={styles.spinner} />
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
          <p style={styles.loadingText}>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <Sidebar />

      <div style={{ ...styles.mainContent, marginLeft: isMobile ? "0" : "280px", padding: isMobile ? "80px 16px 32px" : "24px" }}>

        {/* ── Header ── */}
        <div style={styles.headerSection}>
          <div style={styles.headerTop}>
            <div>
              <h1 style={styles.pageTitle}>
                <FaGraduationCap style={styles.titleIcon} />
                {isAdmin ? "Courses Management" : "Available Courses"}
              </h1>
              <p style={styles.pageSubtitle}>
                {isAdmin   ? "Manage all courses, subcategories, and enrollments" : ""}
                {isTeacher ? "View courses and manage your lectures" : ""}
              </p>
            </div>
            <div style={styles.statsBadge}>
              <div style={styles.statsBadgeLabel}>Total Courses</div>
              <div style={styles.statsBadgeValue}>{stats.totalCourses}</div>
            </div>
          </div>

          {/* Stats — admin only */}
          {isAdmin && (
            <div style={styles.statsGrid}>
              {[
                { icon: "📚", value: stats.paidCourses,  label: "Paid Courses"      },
                { icon: "🎓", value: stats.freeCourses,  label: "Free Courses"      },
                { icon: "👥", value: stats.totalStudents,label: "Enrolled Students" },
                { icon: "💰", value: `₹${stats.totalRevenue.toLocaleString()}`, label: "Total Revenue" },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statIcon}>{s.icon}</div>
                  <div style={styles.statContent}>
                    <div style={styles.statValue}>{s.value}</div>
                    <div style={styles.statLabel}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Action Bar ── */}
        <div style={styles.actionBar}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input type="text" placeholder="Search courses by title, category, or subcategory..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={styles.searchInput} />
          </div>

          {/* ✅ Admin-only action buttons */}
          {isAdmin && (
            <div style={styles.buttonGroup}>
              <button onClick={() => setShowFreeAccessModal(true)} style={styles.grantButton} onMouseEnter={(e) => e.currentTarget.style.background = "#0f766e"} onMouseLeave={(e) => e.currentTarget.style.background = COLORS.teal}>
                <FaUnlock /> {isMobile ? "Grant" : "Grant Access"}
              </button>
              <button onClick={openAddForm} style={styles.addButton} onMouseEnter={(e) => e.currentTarget.style.background = "#5E427B"} onMouseLeave={(e) => e.currentTarget.style.background = COLORS.primaryButton}>
                <FaPlus /> {isMobile ? "Add" : "New Course"}
              </button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                {!isMobile && <th style={styles.th}>Subcategories</th>}
                <th style={styles.th}>Price/Type</th>
                {/* Admin-only columns */}
                {isAdmin && !isMobile && <th style={styles.th}>Enrollments</th>}
                {isAdmin && !isMobile && <th style={styles.th}>Revenue</th>}
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr><td colSpan={isAdmin ? (isMobile ? 6 : 9) : (isMobile ? 5 : 6)} style={styles.emptyState}>
                  {searchTerm ? "No courses found matching your search" : "No courses available"}
                </td></tr>
              ) : (
                filteredCourses.map((course, index) => {
                  const enrollmentsCount     = isAdmin ? getCourseEnrollmentsCount(course._id) : 0;
                  const paidEnrollmentsCount = isAdmin ? getPaidEnrollmentsCount(course._id)   : 0;
                  const courseRevenue        = isAdmin ? getCourseRevenue(course._id)          : 0;

                  return (
                    <tr key={course._id} style={styles.tableRow}>
                      <td style={styles.td}>{index + 1}</td>
                      <td style={styles.td}>
                        <div style={styles.courseTitle}>{course.title}</div>
                        <div style={styles.courseMeta}>{course.duration}h • {course.level}</div>
                      </td>
                      <td style={styles.td}>{course.category || "Uncategorized"}</td>
                      {!isMobile && <td style={styles.td}><SubcategoryBadge subcategories={course.subCategories} isMobile={isMobile} /></td>}
                      <td style={styles.td}>
                        <div style={styles.priceValue}>₹{course.price || 0}</div>
                        <div style={{ ...styles.typeBadge, background: course.price > 0 ? COLORS.yellowLight : COLORS.greenLight, color: course.price > 0 ? "#92400e" : "#065f46" }}>
                          {course.price > 0 ? <FaLock style={styles.typeIcon} /> : <FaUnlock style={styles.typeIcon} />}
                          {course.price > 0 ? "Paid" : "Free"}
                        </div>
                      </td>
                      {isAdmin && !isMobile && <td style={styles.td}><div>{enrollmentsCount} total</div><div style={styles.paidCount}>{paidEnrollmentsCount} paid</div></td>}
                      {isAdmin && !isMobile && <td style={styles.td}><span style={styles.revenue}>₹{courseRevenue}</span></td>}
                      <td style={styles.td}><span style={styles.status}>{course.status || "Active"}</span></td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>

                          {/* ✅ Lectures button — both admin and teacher can access */}
                          {(isAdmin || isTeacher) && (
                            <button
                              onClick={() => handleViewLectures(course._id)}
                              style={styles.lectureButton}
                              onMouseEnter={(e) => e.currentTarget.style.background = "#2563EB"}
                              onMouseLeave={(e) => e.currentTarget.style.background = COLORS.info}
                              title={isAdmin ? "Manage All Lectures" : "Manage My Lectures"}
                            >
                              <FaVideo />
                              {!isMobile && (isAdmin ? " Lectures" : " My Lectures")}
                            </button>
                          )}

                          {/* ✅ Edit & Delete — admin only */}
                          {isAdmin && (
                            <>
                              <button onClick={() => openEditForm(course)} style={styles.editButton} onMouseEnter={(e) => e.currentTarget.style.background = "#D97706"} onMouseLeave={(e) => e.currentTarget.style.background = COLORS.warning} title="Edit Course">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDelete(course._id)} style={styles.deleteButton} onMouseEnter={(e) => e.currentTarget.style.background = "#DC2626"} onMouseLeave={(e) => e.currentTarget.style.background = COLORS.danger} title="Delete Course">
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Add/Edit Form — admin only ── */}
        {showForm && isAdmin && (
          <Modal onClose={() => setShowForm(false)} width="600px">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingId ? "Edit Course" : "Add New Course"}</h3>
              <button onClick={() => setShowForm(false)} style={styles.modalClose}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required style={styles.input} placeholder="e.g., Complete Python Bootcamp" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} style={styles.textarea} placeholder="Course description..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <CategoryCheckbox categories={CATEGORIES} selectedCategory={formData.category} onSelect={handleCategorySelect} isMobile={isMobile} />
                <div style={styles.customInputGroup}>
                  <input type="text" placeholder="Or enter custom category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={styles.customInput} />
                  <button type="button" onClick={handleAddCustomCategory} style={styles.customAddButton}>Add</button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Subcategories *</label>
                <SubcategoryCheckbox subcategories={getAvailableSubcategories()} selectedSubcategories={formData.subCategories} onToggle={handleSubcategoryToggle} isMobile={isMobile} />
                {formData.category && (
                  <div style={styles.customInputGroup}>
                    <input type="text" placeholder="Or enter custom subcategory" value={customSubcategory} onChange={(e) => setCustomSubcategory(e.target.value)} style={styles.customInput} />
                    <button type="button" onClick={handleAddCustomSubcategory} style={styles.customAddButton}>Add</button>
                  </div>
                )}
              </div>
              <div style={styles.formRow}>
                <div style={{ flex: 1 }}><label style={styles.label}>Duration (hours) *</label><input type="number" name="duration" value={formData.duration} onChange={handleChange} required min="1" style={styles.input} /></div>
                <div style={{ flex: 1 }}><label style={styles.label}>Level *</label><select name="level" value={formData.level} onChange={handleChange} style={styles.select}><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option><option value="All Levels">All Levels</option></select></div>
                <div style={{ flex: 1 }}><label style={styles.label}>Price (₹) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={styles.input} placeholder="0 for free" /></div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} style={styles.select}><option value="Active">Active</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select>
              </div>
              <div style={styles.formActions}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>Cancel</button>
                <button type="submit" disabled={loading} style={styles.submitButton}>
                  {loading ? <><FaSpinner style={styles.buttonSpinner} />{editingId ? "Updating..." : "Creating..."}</> : (editingId ? "Update Course" : "Create Course")}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ── Grant Free Access — admin only ── */}
        {showFreeAccessModal && isAdmin && (
          <Modal onClose={() => { setShowFreeAccessModal(false); setStudentEmail(""); setFoundStudent(null); setSelectedCoursesForGrant([]); setGrantAccessMessage(""); }} width="700px">
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}><FaUnlock style={{ marginRight: "8px" }} />Grant Free Course Access</h3>
              <button onClick={() => { setShowFreeAccessModal(false); setStudentEmail(""); setFoundStudent(null); setSelectedCoursesForGrant([]); setGrantAccessMessage(""); }} style={styles.modalClose}><FaTimes /></button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}><FaEnvelope style={{ marginRight: "6px" }} />Student Email *</label>
              <div style={styles.searchRow}>
                <input type="email" placeholder="Enter student's email address" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearchStudent()} style={styles.searchInputField} />
                <button onClick={handleSearchStudent} disabled={searchingStudent || !studentEmail.trim()} style={{ ...styles.searchButton, opacity: (searchingStudent || !studentEmail.trim()) ? 0.7 : 1, cursor: (searchingStudent || !studentEmail.trim()) ? "not-allowed" : "pointer" }}>
                  {searchingStudent ? <><FaSpinner style={styles.buttonSpinner} />Searching...</> : <><FaSearch />Search</>}
                </button>
              </div>
            </div>
            {foundStudent && (
              <div style={styles.studentFoundCard}>
                <div style={styles.studentFoundHeader}><FaCheckCircle style={{ color: "#059669", fontSize: "20px" }} /><h4 style={styles.studentFoundTitle}>Student Found</h4></div>
                <div style={styles.studentDetails}><div><strong>Name:</strong> {foundStudent.fullName}</div><div><strong>Email:</strong> {foundStudent.email}</div><div><strong>ID:</strong> {foundStudent._id}</div></div>
              </div>
            )}
            {foundStudent && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Select Courses to Grant Access *</label>
                <div style={styles.courseList}>
                  {courses.map(course => {
                    const hasAccess = studentHasAccess(course._id);
                    const isSelected = selectedCoursesForGrant.includes(course._id);
                    return (
                      <div key={course._id} style={{ ...styles.courseItem, background: isSelected ? COLORS.purpleLight : COLORS.white, opacity: hasAccess ? 0.6 : 1, cursor: hasAccess ? "not-allowed" : "pointer" }} onClick={() => !hasAccess && handleToggleCourseForGrant(course._id)}>
                        <div style={styles.courseCheckbox}><input type="checkbox" checked={isSelected || hasAccess} disabled={hasAccess} onChange={() => !hasAccess && handleToggleCourseForGrant(course._id)} style={styles.checkbox} /></div>
                        <div style={styles.courseInfo}>
                          <div style={styles.courseInfoHeader}>
                            <span style={styles.courseInfoTitle}>{course.title}</span>
                            {hasAccess && <span style={styles.hasAccessBadge}><FaCheckCircle size={10} />Already Has Access</span>}
                          </div>
                          <div style={styles.courseInfoMeta}>{course.category} • {course.duration}h • {course.level}</div>
                          <div style={styles.courseInfoFooter}><span style={{ ...styles.coursePriceTag, background: course.price > 0 ? COLORS.yellowLight : COLORS.greenLight, color: course.price > 0 ? "#92400e" : "#065f46" }}>₹{course.price || 0}</span><SubcategoryBadge subcategories={course.subCategories} isMobile={true} /></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedCoursesForGrant.length > 0 && <div style={styles.selectionInfo}><FaCheckCircle />{selectedCoursesForGrant.length} course(s) selected</div>}
              </div>
            )}
            {grantAccessMessage && (
              <div style={{ ...styles.messageBox, background: grantAccessMessage.includes("✅") ? COLORS.greenLight : "#fee2e2", color: grantAccessMessage.includes("✅") ? "#065f46" : "#991b1b", borderColor: grantAccessMessage.includes("✅") ? "#10b981" : "#f87171" }}>
                {grantAccessMessage.includes("✅") ? <FaCheckCircle /> : <FaTimesCircle />}{grantAccessMessage}
              </div>
            )}
            <div style={styles.modalActions}>
              <button onClick={handleGrantAccessToCourses} disabled={grantAccessLoading || !foundStudent || selectedCoursesForGrant.length === 0} style={{ ...styles.grantSubmitButton, opacity: (grantAccessLoading || !foundStudent || selectedCoursesForGrant.length === 0) ? 0.7 : 1, cursor: (grantAccessLoading || !foundStudent || selectedCoursesForGrant.length === 0) ? "not-allowed" : "pointer" }}>
                {grantAccessLoading ? <><FaSpinner style={styles.buttonSpinner} />Granting...</> : <><FaUnlock />Grant Access to {selectedCoursesForGrant.length} Course(s)</>}
              </button>
              <button type="button" onClick={() => { setShowFreeAccessModal(false); setStudentEmail(""); setFoundStudent(null); setSelectedCoursesForGrant([]); setGrantAccessMessage(""); }} style={styles.modalCancelButton}>Cancel</button>
            </div>
          </Modal>
        )}
      </div>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

const styles = {
  pageContainer:   { display: "flex", minHeight: "100vh", background: COLORS.bgGray, position: "relative" },
  loadingContainer:{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
  spinner:         { width: "50px", height: "50px", border: "3px solid #e5e7eb", borderTop: `3px solid ${COLORS.deepPurple}`, borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "16px" },
  loadingText:     { color: COLORS.darkGray, fontSize: "16px" },
  mainContent:     { flex: 1, transition: "margin-left 0.3s ease", maxWidth: "1600px" },
  headerSection:   { marginBottom: "32px" },
  headerTop:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" },
  pageTitle:       { fontSize: "28px", fontWeight: "700", color: COLORS.deepPurple, margin: 0, marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" },
  titleIcon:       { color: "#F1D572", fontSize: "28px" },
  pageSubtitle:    { color: COLORS.darkGray, fontSize: "16px", margin: 0 },
  statsBadge:      { background: `linear-gradient(135deg, ${COLORS.deepPurple} 0%, ${COLORS.headerPurple} 100%)`, padding: "16px 24px", borderRadius: "12px", color: COLORS.white, minWidth: "180px", boxShadow: "0 4px 12px rgba(61,26,91,0.2)", textAlign: "center" },
  statsBadgeLabel: { fontSize: "14px", opacity: 0.9, marginBottom: "4px" },
  statsBadgeValue: { fontSize: "32px", fontWeight: "700" },
  statsGrid:       { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginTop: "20px" },
  statCard:        { background: COLORS.white, padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "16px", border: `1px solid ${COLORS.lightGray}` },
  statIcon:        { fontSize: "32px" },
  statContent:     { flex: 1 },
  statValue:       { fontSize: "24px", fontWeight: "700", color: COLORS.deepPurple, marginBottom: "4px" },
  statLabel:       { fontSize: "14px", color: COLORS.darkGray },
  actionBar:       { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  searchContainer: { position: "relative", flex: 1, minWidth: "280px" },
  searchIcon:      { position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "16px" },
  searchInput:     { width: "100%", padding: "14px 16px 14px 48px", borderRadius: "8px", border: `1px solid #D1D5DB`, fontSize: "15px", background: COLORS.white, boxSizing: "border-box", outline: "none" },
  buttonGroup:     { display: "flex", gap: "12px" },
  grantButton:     { background: COLORS.teal, color: COLORS.white, border: "none", padding: "14px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 4px 8px rgba(13,148,136,0.2)", whiteSpace: "nowrap" },
  addButton:       { background: COLORS.primaryButton, color: COLORS.white, border: "none", padding: "14px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s ease", boxShadow: "0 4px 8px rgba(61,26,91,0.2)", whiteSpace: "nowrap" },
  tableContainer:  { background: COLORS.white, borderRadius: "12px", overflow: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  table:           { width: "100%", borderCollapse: "collapse", minWidth: "600px" },
  th:              { padding: "16px", textAlign: "left", color: COLORS.textGray, fontWeight: "600", fontSize: "14px", background: COLORS.lightGray, whiteSpace: "nowrap" },
  td:              { padding: "16px", fontSize: "14px", color: COLORS.textGray, borderBottom: `1px solid ${COLORS.lightGray}` },
  tableRow:        { transition: "background 0.2s ease" },
  courseTitle:     { fontWeight: "600", color: COLORS.deepPurple, fontSize: "15px", marginBottom: "4px" },
  courseMeta:      { fontSize: "12px", color: COLORS.darkGray },
  priceValue:      { fontWeight: "600", color: "#92400e", fontSize: "15px", marginBottom: "4px" },
  typeBadge:       { padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", width: "fit-content", display: "flex", alignItems: "center", gap: "4px" },
  typeIcon:        { fontSize: "10px" },
  paidCount:       { fontSize: "12px", color: COLORS.darkGray },
  revenue:         { fontWeight: "600", color: COLORS.textGray },
  status:          { padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", background: COLORS.greenLight, color: "#065f46" },
  actionButtons:   { display: "flex", gap: "8px", flexWrap: "wrap" },
  lectureButton:   { background: COLORS.info, color: COLORS.white, border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", transition: "all 0.2s ease" },
  editButton:      { background: COLORS.warning, color: COLORS.white, border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  deleteButton:    { background: COLORS.danger, color: COLORS.white, border: "none", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  emptyState:      { padding: "40px", textAlign: "center", color: COLORS.darkGray, fontSize: "15px" },
  modalHeader:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  modalTitle:      { color: COLORS.deepPurple, margin: 0, fontSize: "20px", display: "flex", alignItems: "center" },
  modalClose:      { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: COLORS.deepPurple, padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" },
  formGroup:       { marginBottom: "20px" },
  label:           { display: "block", marginBottom: "8px", color: COLORS.textGray, fontWeight: "600", fontSize: "14px" },
  input:           { width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none" },
  textarea:        { width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none", fontFamily: "inherit", resize: "vertical" },
  select:          { width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none", background: COLORS.white },
  customInputGroup:{ display: "flex", gap: "8px", marginTop: "12px" },
  customInput:     { flex: 1, padding: "10px", borderRadius: "6px", border: `1px solid ${COLORS.darkGray}`, fontSize: "13px", outline: "none" },
  customAddButton: { padding: "10px 16px", background: COLORS.formButton, color: COLORS.white, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" },
  formRow:         { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "20px" },
  formActions:     { display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${COLORS.lightGray}` },
  cancelButton:    { padding: "12px 24px", background: COLORS.cancelButton, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "all 0.3s ease" },
  submitButton:    { padding: "12px 24px", background: COLORS.formButton, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "all 0.3s ease", display: "flex", alignItems: "center", gap: "8px" },
  buttonSpinner:   { animation: "spin 1s linear infinite" },
  searchRow:       { display: "flex", gap: "8px" },
  searchInputField:{ flex: 1, padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", outline: "none" },
  searchButton:    { padding: "12px 20px", background: COLORS.formButton, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease", whiteSpace: "nowrap" },
  studentFoundCard:{ background: COLORS.greenLight, border: `2px solid #10b981`, borderRadius: "8px", padding: "16px", marginBottom: "20px" },
  studentFoundHeader:{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" },
  studentFoundTitle: { color: "#065f46", margin: 0, fontSize: "16px" },
  studentDetails:  { color: "#065f46", fontSize: "14px", marginLeft: "28px" },
  courseList:      { maxHeight: "300px", overflowY: "auto", border: `1px solid ${COLORS.lightGray}`, borderRadius: "8px", background: COLORS.bgGray },
  courseItem:      { padding: "12px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", gap: "12px", transition: "all 0.2s ease" },
  courseCheckbox:  { marginTop: "4px" },
  checkbox:        { accentColor: COLORS.deepPurple },
  courseInfo:      { flex: 1 },
  courseInfoHeader:{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" },
  courseInfoTitle: { fontWeight: "600", color: COLORS.deepPurple, fontSize: "14px" },
  hasAccessBadge:  { background: COLORS.greenLight, color: "#065f46", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" },
  courseInfoMeta:  { fontSize: "12px", color: COLORS.darkGray, marginBottom: "4px" },
  courseInfoFooter:{ display: "flex", gap: "6px", alignItems: "center" },
  coursePriceTag:  { padding: "2px 6px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" },
  selectionInfo:   { marginTop: "12px", padding: "10px", background: COLORS.blueLight, borderRadius: "6px", fontSize: "13px", color: "#1e40af", display: "flex", alignItems: "center", gap: "8px" },
  messageBox:      { padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px", border: "1px solid" },
  modalActions:    { display: "flex", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${COLORS.lightGray}` },
  grantSubmitButton:{ flex: 1, padding: "12px 24px", background: COLORS.formButton, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.3s ease" },
  modalCancelButton:{ flex: 1, padding: "12px 24px", background: COLORS.cancelButton, color: COLORS.white, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "600", transition: "all 0.3s ease" },
};

export default Courses;