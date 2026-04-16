import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/* ================= TOKEN INTERCEPTOR ================= */
API.interceptors.request.use((req) => {
  const token    = localStorage.getItem("token");
  const deviceId = getDeviceId();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  req.headers["x-device-id"] = deviceId;
  return req;
});

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong. Please try again.";
    if (status === 401) {
      alert(message);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    if (status === 403) alert(message);
    return Promise.reject(error);
  }
);

/* ================= AUTH ================= */
export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const deviceId = getDeviceId();
  const { data } = await API.post("/auth/login", {
    email: credentials.email, password: credentials.password, deviceId,
  });
  localStorage.setItem("token",    data.token);
  localStorage.setItem("userInfo", JSON.stringify(data));
  return data;
};

export const logoutUser = async () => {
  try {
    const deviceId = getDeviceId();
    await API.post("/auth/logout", { deviceId });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  }
};

export const getActiveSessions = async ()           => { const { data } = await API.get("/auth/active-sessions");             return data; };
export const forceLogoutDevice = async (sessionId)  => { const { data } = await API.post("/auth/force-logout", { sessionId }); return data; };

/* ================= GOOGLE LOGIN ================= */
export const googleLoginUser = async (googleToken) => {
  const deviceId = getDeviceId();
  const { data } = await API.post("/auth/google-login", { token: googleToken, deviceId });
  localStorage.setItem("token",    data.token);
  localStorage.setItem("userInfo", JSON.stringify(data));
  return data;
};

/* ================= FORGOT / RESET PASSWORD ================= */
export const forgotPassword = async (email)           => { const { data } = await API.post("/auth/forgot-password",         { email });      return data; };
export const verifyOtp      = async (email, otp)      => { const { data } = await API.post("/auth/verify-otp",              { email, otp }); return data; };
export const resetPassword  = async (token, password) => { const { data } = await API.post(`/auth/reset-password/${token}`, { password });   return data; };

/* ================= UTILITY ================= */
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  } catch { return null; }
};

export const getUserId       = ()  => { const u = getCurrentUser(); return u?.id || u?._id || null; };
export const isAuthenticated = ()  => !!localStorage.getItem("token");
export const isAdmin         = ()  => { const u = getCurrentUser(); return u?.role?.toLowerCase() === "admin"; };
export const isTeacher       = ()  => { const u = getCurrentUser(); return u?.role?.toLowerCase() === "teacher"; };
export const isManager       = ()  => { const u = getCurrentUser(); return u?.role?.toLowerCase() === "manager"; };

export const checkServerHealth = async () => {
  try { const { data } = await API.get("/health"); return { healthy: true, data }; }
  catch (error) { return { healthy: false, error: error.message }; }
};

/* ================= USERS (ADMIN) ================= */
export const getAllUsers  = async ()       => { const { data } = await API.get("/users");            return Array.isArray(data) ? data : []; };
export const getUserById  = async (id)     => { const { data } = await API.get(`/users/${id}`);     return data; };
export const createUser   = async (ud)     => { const { data } = await API.post("/users", ud);      return data; };
export const updateUser   = async (id, ud) => { const { data } = await API.put(`/users/${id}`, ud); return data; };
export const deleteUser   = async (id)     => { const { data } = await API.delete(`/users/${id}`);  return data; };

/* ================= COURSES ================= */
export const getCourses = async () => {
  const { data } = await API.get("/courses");
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.courses)) return data.courses;
  return [];
};

export const getCourseBySlug = async (slug) => {
  const { data } = await API.get(`/courses/slug/${slug}`);
  return data.course || data;
};

export const getCourseById  = async (id)       => { const { data } = await API.get(`/courses/${id}`);            return data; };
export const createCourse   = async (fd)       => { const { data } = await API.post("/courses/create", fd);      return data; };
export const updateCourse   = async (id, fd)   => { const { data } = await API.put(`/courses/update/${id}`, fd); return data; };
export const deleteCourse   = async (id)       => { const { data } = await API.delete(`/courses/delete/${id}`);  return data; };
export const getCoursePrice = async (courseId) => { const { data } = await API.get(`/courses/${courseId}/price`);return data; };

export const getCourseCategories = async () => {
  try {
    const courses = await getCourses();
    return [...new Set(courses.map(c => c.category).filter(c => c?.trim()))].sort();
  } catch (error) { console.error("Error fetching course categories:", error); throw error; }
};



// In api.js - add this
export const getAdminAllCourses = async () => {
  const { data } = await API.get("/courses/admin/all");
  return Array.isArray(data) ? data : data?.courses || [];
};
/* ================= DIPLOMAS (ADMIN) ================= */
export const getDiplomas    = async ()       => { try { const { data } = await API.get("/diplomas/admin/all"); return Array.isArray(data) ? data : []; } catch { return []; } };
export const createDiploma  = async (dd)     => { const { data } = await API.post("/diplomas", dd);           return data; };
export const getDiplomaById = async (id)     => { const { data } = await API.get(`/diplomas/${id}`);          return data; };
export const updateDiploma  = async (id, dd) => { const { data } = await API.put(`/diplomas/${id}`, dd);      return data; };
export const deleteDiploma  = async (id)     => { const { data } = await API.delete(`/diplomas/${id}`);       return data; };

/* ================= ENROLLMENTS ================= */
export const enrollStudentInCourse   = async (studentId, courseId) => { const { data } = await API.post("/enrollments/enroll", { studentId, courseId }); return data; };
export const getAdminEnrollments     = async ()                    => { const { data } = await API.get("/enrollments/admin/all"); return data; };
export const updateEnrollmentPayment = async (id, pd)             => { const { data } = await API.patch(`/enrollments/${id}/payment`, pd); return data; };
export const removeEnrollment        = async (id)                 => { const { data } = await API.delete(`/enrollments/${id}`); return data; };

export const getStudentEnrollments = async (studentId) => {
  const { data } = await API.get(`/enrollments/student/${studentId}`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.enrollments)) return data.enrollments;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// Returns full enrollment status including time + lecture limit fields
export const getEnrollmentStatus = async (studentId, courseId) => {
  const { data } = await API.get(`/enrollments/status/${studentId}/${courseId}`);
  return data;
};

export const getEnrollmentDetails = async (enrollmentId) => {
  const { data } = await API.get(`/enrollments/${enrollmentId}`);
  return data;
};

// ✅ GRANT FULL COURSE ACCESS (Lifetime, unlimited lectures)
export const grantFullCourseAccess = async (studentId, courseId) => {
  console.log("📡 grantFullCourseAccess called:", { studentId, courseId });
  try {
    const { data } = await API.post("/admin/enrollment/grant-free-access", { 
      studentId, 
      courseId 
    });
    console.log("✅ grantFullCourseAccess response:", data);
    return data;
  } catch (error) {
    console.error("❌ grantFullCourseAccess error:", error.response?.data || error.message);
    throw error;
  }
};

// // ✅ GRANT LIMITED LECTURE ACCESS (Time limit or lecture count limit)
// export const grantLimitedLectureAccess = async (enrollmentId, { durationDays = null, lectureLimit = null, notes = "" } = {}) => {
//   console.log("📡 grantLimitedLectureAccess called:", { enrollmentId, durationDays, lectureLimit, notes });
//   try {
//     const { data } = await API.patch(`/admin/enrollment/grant-limited-access/${enrollmentId}`, {
//       durationDays,
//       lectureLimit,
//       notes,
//     });
//     console.log("✅ grantLimitedLectureAccess response:", data);
//     return data;
//   } catch (error) {
//     console.error("❌ grantLimitedLectureAccess error:", error.response?.data || error.message);
//     throw error;
//   }
// };
export const grantLimitedLectureAccess = async (enrollmentId, data) => {
  console.log('Calling API with:', enrollmentId, data);
  
  // Try karo POST method se
  try {
    const response = await axios.post(`/api/admin/enrollment/grant-limited-access/${enrollmentId}`, data);
    return response.data;
  } catch (error) {
    console.log('POST failed, trying PUT...');
    
    // Agar POST fail ho to PUT try karo
    try {
      const response = await axios.put(`/api/admin/enrollment/grant-limited-access/${enrollmentId}`, data);
      return response.data;
    } catch (err) {
      console.log('PUT also failed, trying different URL...');
      
      // Different URL try karo
      const response = await axios.post(`/api/admin/grant-access/${enrollmentId}`, data);
      return response.data;
    }
  }
};







// ✅ Keep old function names for backward compatibility
export const grantFreeAccessToStudent = grantFullCourseAccess;
export const grantCourseAccess = grantLimitedLectureAccess;

// ✅ Record that a student opened a lecture
export const recordLectureAccess = async (studentId, courseId, lectureId) => {
  console.log("📡 recordLectureAccess called:", { studentId, courseId, lectureId });
  try {
    const { data } = await API.post("/enrollments/record-access", {
      studentId,
      courseId,
      lectureId,
    });
    console.log("✅ recordLectureAccess response:", data);
    return data;
  } catch (error) {
    console.error("❌ recordLectureAccess error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Check if student can access a specific lecture
export const checkLectureAccess = async (studentId, courseId, lectureId) => {
  console.log("🔍 checkLectureAccess called:", { studentId, courseId, lectureId });
  try {
    const { data } = await API.post("/enrollments/check-lecture-access", {
      studentId,
      courseId,
      lectureId,
    });
    console.log("✅ checkLectureAccess response:", data);
    return data;
  } catch (error) {
    console.error("❌ checkLectureAccess error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Check if student can access a course
export const canAccessCourse = async (courseId, studentId = null) => {
  const userId = studentId || getUserId();
  if (!userId) {
    return {
      canAccess: false,
      hasFullAccess: false,
      hasAccess: false,
      isPaid: false,
      coursePrice: 0,
      isExpired: false,
      isLimitReached: false,
      daysRemaining: null,
      lectureLimit: null,
      accessedLecturesCount: 0,
      lecturesRemaining: null,
      accessExpiresAt: null,
      endDate: null,
      grantedByAdmin: false,
      reason: "Not logged in",
    };
  }

  try {
    const { data } = await API.get(`/enrollments/can-access/${courseId}`);
    return data;
  } catch (error) {
    console.error("❌ canAccessCourse error:", error);
    return {
      canAccess: false,
      hasFullAccess: false,
      hasAccess: false,
      isPaid: false,
      coursePrice: 0,
      isExpired: false,
      isLimitReached: false,
      daysRemaining: null,
      lectureLimit: null,
      accessedLecturesCount: 0,
      lecturesRemaining: null,
      accessExpiresAt: null,
      endDate: null,
      grantedByAdmin: false,
      reason: "Error checking access",
    };
  }
};

/* ================= PAYMENTS ================= */
export const processPayment     = async (studentId, courseId, pd) => { const { data } = await API.post("/payments/process", { studentId, courseId, ...pd }); return data; };
export const checkPaymentStatus = async (studentId, courseId)     => { const { data } = await API.get("/payments/status", { params: { studentId, courseId } }); return data; };
export const getPaymentHistory  = async (studentId)               => { const { data } = await API.get(`/payments/history/${studentId}`); return data; };
export const getAdminPayments   = async ()                        => { const { data } = await API.get("/payments/admin"); return data; };

export const mockPaymentProcessor = async (paymentData) =>
  new Promise(resolve =>
    setTimeout(() => resolve({
      success:       true,
      paymentId:     `mock_pay_${Date.now()}`,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      amount:        paymentData.amount,
      currency:      "INR",
      status:        "completed",
      timestamp:     new Date().toISOString(),
    }), 1500)
  );

export const completePaymentProcess = async (courseId, paymentMethod, amount) => {
  try {
    const studentId = getUserId();
    if (!studentId) throw new Error("User not logged in");
    const paymentResult = await mockPaymentProcessor({ amount, method: paymentMethod, courseId, studentId });
    if (!paymentResult.success) throw new Error("Payment failed");
    const paymentResponse = await processPayment(studentId, courseId, {
      paymentMethod,
      amount:        paymentResult.amount,
      paymentId:     paymentResult.paymentId,
      transactionId: paymentResult.transactionId,
    });
    return { success: true, message: "Payment successful! Course unlocked.", payment: paymentResult, enrollment: paymentResponse };
  } catch (error) {
    return { success: false, message: error.message || "Payment failed. Please try again." };
  }
};

/* ================= PROGRESS ================= */
export const trackLectureProgress = async (studentId, courseId, lectureId) => {
  const { data } = await API.post("/progress/track", { studentId, courseId, lectureId });
  return data;
};
export const getProgress = async (studentId, courseId) => {
  const { data } = await API.get(`/progress/${studentId}/${courseId}`);
  const completed = data?.completedLectures?.length || 0;
  const total     = data?.totalLectures || 0;
  return { ...data, progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
};




// Add these functions to your existing api.js

// Submit lead
export const submitLead = async (leadData) => {
  try {
    const { data } = await API.post('/leads', leadData);
    return data;
  } catch (error) {
    console.error('Submit lead error:', error);
    throw error.response?.data || error;
  }
};

// Get all leads (Admin only)
export const getAllLeads = async () => {
  try {
    const { data } = await API.get('/leads');
    return data;
  } catch (error) {
    console.error('Get leads error:', error);
    throw error;
  }
};

// Update lead status (Admin only)
export const updateLeadStatus = async (id, status) => {
  try {
    const { data } = await API.put(`/leads/${id}/status`, { status });
    return data;
  } catch (error) {
    console.error('Update lead error:', error);
    throw error;
  }
};

// Delete lead (Admin only)
export const deleteLead = async (id) => {
  try {
    const { data } = await API.delete(`/leads/${id}`);
    return data;
  } catch (error) {
    console.error('Delete lead error:', error);
    throw error;
  }
};
/* ================= LECTURES ================= */
// export const getLectures          = async ()       => { const { data } = await API.get("/lectures"); return Array.isArray(data) ? data : data?.lectures || []; };
export const getLectures = async () => {
  try {
    // First get teacher's courses
    const courses = await getCourses();
    const courseIds = courses.map(c => c._id);
    
    // Fetch lectures for each course
    const lecturePromises = courseIds.map(courseId => 
      API.get(`/lectures/course/${courseId}`)
    );
    
    const results = await Promise.all(lecturePromises);
    const allLectures = results.flatMap(res => res.data.lectures || []);
    
    return allLectures;
  } catch (error) {
    console.error("Get lectures error:", error);
    return [];
  }
};
export const getTeacherLectures   = getLectures;
export const getLectureById       = async (id)     => { const { data } = await API.get(`/lectures/${id}`); return data; };
export const updateLecture        = async (id, fd) => { const { data } = await API.put(`/lectures/update/${id}`, fd); return data; };
export const updateTeacherLecture = updateLecture;
export const deleteLecture        = async (id)     => { const { data } = await API.delete(`/lectures/delete/${id}`); return data; };
export const deleteTeacherLecture = deleteLecture;

// getLecturesByCourse — backend returns access control metadata with lectures
export const getLecturesByCourse = async (courseId, studentId = null) => {
  let url = `/lectures/course/${courseId}`;
  if (studentId) url += `?studentId=${studentId}`;
  const { data } = await API.get(url);

  if (Array.isArray(data)) {
    return {
      lectures:              data,
      isPaidStudent:         false,
      hasFullAccess:         false,
      hasAccess:             false,
      coursePrice:           0,
      isExpired:             false,
      isLimitReached:        false,
      lectureLimit:          null,
      accessedLecturesCount: 0,
      lecturesRemaining:     null,
      daysRemaining:         null,
      endDate:               null,
      grantedByAdmin:        false,
    };
  }

  return {
    lectures:              data.lectures              || [],
    isPaidStudent:         data.isPaidStudent         || false,
    hasFullAccess:         data.hasFullAccess         || data.isPaidStudent || false,
    hasAccess:             data.hasAccess             || data.hasFullAccess || data.isPaidStudent || false,
    coursePrice:           data.coursePrice           || 0,
    isExpired:             data.isExpired             || false,
    isLimitReached:        data.isLimitReached        || false,
    lectureLimit:          data.lectureLimit          ?? null,
    accessedLecturesCount: data.accessedLecturesCount || 0,
    lecturesRemaining:     data.lecturesRemaining     ?? null,
    daysRemaining:         data.daysRemaining         ?? null,
    endDate:               data.endDate               || null,
    grantedByAdmin:        data.grantedByAdmin        || false,
  };
};

export const createLecture = async (formData) => {
  try {
    const response = await API.post("/lectures/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
      onUploadProgress: (e) => console.log(`Upload: ${Math.round((e.loaded * 100) / e.total)}%`),
    });
    return response.data;
  } catch (error) { console.error("❌ createLecture:", error); throw error; }
};
export const createTeacherLecture = createLecture;

// getFilteredLectures — passes through ALL access control metadata
export const getFilteredLectures = async (courseId, studentId = null) => {
  try {
    const userId = studentId || getUserId();
    const result = await getLecturesByCourse(courseId, userId);

    const accessMeta = {
      isExpired:             result.isExpired             || false,
      isLimitReached:        result.isLimitReached        || false,
      lectureLimit:          result.lectureLimit          ?? null,
      accessedLecturesCount: result.accessedLecturesCount || 0,
      lecturesRemaining:     result.lecturesRemaining     ?? null,
      daysRemaining:         result.daysRemaining         ?? null,
      endDate:               result.endDate               || null,
      grantedByAdmin:        result.grantedByAdmin        || false,
      hasAccess:             result.hasAccess             || result.hasFullAccess || false,
    };

    if (!userId || !result.lectures) {
      return {
        lectures: result.lectures || [],
        hasFullAccess: false,
        isPaid: false,
        coursePrice: result.coursePrice || 0,
        ...accessMeta,
      };
    }

    // Free course
    if (result.coursePrice === 0) {
      return {
        lectures: result.lectures,
        hasFullAccess: true,
        isPaid: true,
        coursePrice: 0,
        message: "Free course - all lectures available",
        ...accessMeta,
      };
    }

    // Paid student OR admin-granted student
    if (result.isPaidStudent || result.hasFullAccess || result.grantedByAdmin) {
      return {
        lectures: result.lectures,
        hasFullAccess: true,
        isPaid: true,
        coursePrice: result.coursePrice || 0,
        ...accessMeta,
      };
    }

    // Expired or unpaid — show free previews only
    return {
      lectures: result.lectures.filter(l => l.isFreePreview === true),
      hasFullAccess: false,
      isPaid: false,
      coursePrice: result.coursePrice || 0,
      message: result.isExpired
        ? "Access expired. Contact admin to renew."
        : "Showing free preview lectures only.",
      ...accessMeta,
    };
  } catch (error) {
    console.error("❌ getFilteredLectures error:", error);
    return {
      lectures: [],
      hasFullAccess: false,
      isPaid: false,
      coursePrice: 0,
      isExpired: false,
      isLimitReached: false,
      lectureLimit: null,
      accessedLecturesCount: 0,
      lecturesRemaining: null,
      daysRemaining: null,
      endDate: null,
      grantedByAdmin: false,
      hasAccess: false,
      error: error.message,
    };
  }
};

/* ================= ASSIGNMENTS (COMPLETE) ================= */

// Get all assignments (with role-based filtering)
export const getAssignments = async () => {
  try {
    const { data } = await API.get("/assignments");
    return data.assignments || [];
  } catch (error) {
    console.error("Get assignments error:", error);
    return [];
  }
};

// Get assignments for a specific course
export const getCourseAssignments = async (courseId) => {
  try {
    const { data } = await API.get(`/assignments/course/${courseId}`);
    return data.assignments || [];
  } catch (error) {
    console.error("Get course assignments error:", error);
    return [];
  }
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
  try {
    const { data } = await API.get(`/assignments/${id}`);
    return data.assignment;
  } catch (error) {
    console.error("Get assignment error:", error);
    throw error;
  }
};

// Create assignment (Teacher/Admin)
export const createAssignment = async (formData) => {
  try {
    const { data } = await API.post("/assignments", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  } catch (error) {
    console.error("Create assignment error:", error);
    throw error;
  }
};

// Update assignment (Teacher/Admin)
export const updateAssignment = async (id, formData) => {
  try {
    const { data } = await API.put(`/assignments/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  } catch (error) {
    console.error("Update assignment error:", error);
    throw error;
  }
};

// Delete assignment (Teacher/Admin)
export const deleteAssignment = async (id) => {
  try {
    const { data } = await API.delete(`/assignments/${id}`);
    return data;
  } catch (error) {
    console.error("Delete assignment error:", error);
    throw error;
  }
};

// Submit assignment (Student)
export const submitAssignment = async (id, formData) => {
  try {
    const { data } = await API.post(`/assignments/${id}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  } catch (error) {
    console.error("Submit assignment error:", error);
    throw error;
  }
};

// Get submissions for an assignment (Teacher/Admin)
export const getAssignmentSubmissions = async (assignmentId) => {
  try {
    const { data } = await API.get(`/assignments/${assignmentId}/submissions`);
    return data;
  } catch (error) {
    console.error("Get submissions error:", error);
    return { submissions: [], totalStudents: 0 };
  }
};

// Grade a submission (Teacher/Admin)
export const gradeAssignmentSubmission = async (submissionId, obtainedMarks, feedback) => {
  try {
    const { data } = await API.post(`/assignments/submissions/${submissionId}/grade`, {
      obtainedMarks,
      feedback
    });
    return data;
  } catch (error) {
    console.error("Grade submission error:", error);
    throw error;
  }
};

// Get student's own submissions
export const getMySubmissions = async () => {
  try {
    const { data } = await API.get("/assignments/my-submissions");
    return data.submissions || [];
  } catch (error) {
    console.error("Get my submissions error:", error);
    return [];
  }
};

/* ================= EXAMS ================= */

export const getAllExams  = async ()       => { const { data } = await API.get("/exams");            return Array.isArray(data) ? data : (data?.exams || []); };
export const getExamById = async (id)     => { const { data } = await API.get(`/exams/${id}`);      return data; };
export const createExam  = async (ed)     => { const { data } = await API.post("/exams", ed);       return data; };
export const updateExam  = async (id, ed) => { const { data } = await API.put(`/exams/${id}`, ed);  return data; };
export const deleteExam  = async (id)     => { const { data } = await API.delete(`/exams/${id}`);   return data; };

/* ================= EXAM ACCESS CONTROL ================= */

export const grantExamAccess  = async (id, email) => { const { data } = await API.post(`/exams/${id}/grant-access`,  { email }); return data; };
export const revokeExamAccess = async (id, email) => { const { data } = await API.post(`/exams/${id}/revoke-access`, { email }); return data; };
export const checkExamAccess  = async (id, email) => { const { data } = await API.get(`/exams/${id}/check-access`,  { params: { email } }); return data; };

/* ================= QUESTIONS ================= */

export const getQuestionsByExam = async (examId) => { const { data } = await API.get(`/questions/exam/${examId}`); return Array.isArray(data) ? data : []; };
export const addQuestion        = async (qd)     => { const { data } = await API.post("/questions", qd);           return data; };
export const updateQuestion     = async (id, qd) => { const { data } = await API.put(`/questions/${id}`, qd);      return data; };
export const deleteQuestion     = async (id)     => { const { data } = await API.delete(`/questions/${id}`);       return data; };

/* ================= ATTEMPTS ================= */

export const submitAttempt     = async (ad)       => { const { data } = await API.post("/attempts", ad);                 return data; };
export const getAttemptsByUser = async (userId)   => { const { data } = await API.get(`/attempts/user/${userId}`);       return Array.isArray(data) ? data : data?.attempts || []; };
export const getAttemptsByExam = async (examId)   => { const { data } = await API.get(`/attempts/exam/${examId}`);       return Array.isArray(data) ? data : data?.attempts || []; };
export const getExamStatus     = async (sid, eid) => { const { data } = await API.get(`/attempts/status/${sid}/${eid}`); return data; };





/* ================= MESSAGES ================= */
export const sendMessage          = async (md)     => { const { data } = await API.post("/messages", md);      return data; };
export const getMessages          = async (userId) => { const { data } = await API.get(`/messages/${userId}`); return data; };
export const getUsersForMessaging = async ()       => { const { data } = await API.get("/messages");            return data; };
export const deleteMessage        = async (id)     => { const { data } = await API.delete(`/messages/${id}`);  return data; };

/* ================= EXAM RESULTS ================= */
export const getAllExamResults = async () => { const { data } = await API.get("/admin/exam-results"); return data; };

/* ═══════════════════════════════════════════════════════
   BLOGS (PUBLIC)
═══════════════════════════════════════════════════════ */
export const getAllBlogs        = async ()          => { const { data } = await API.get("/blogs");                      return data; };
export const getFeaturedBlogs   = async ()          => { const { data } = await API.get("/blogs/featured");             return data; };
export const getBlogCategories  = async ()          => { const { data } = await API.get("/blogs/categories");           return data; };
export const getBlogsByCategory = async (category) => { const { data } = await API.get(`/blogs/category/${category}`); return data; };

export const getBlogById = async (id) => {
  try { const { data } = await API.get(`/blogs/${id}`); return data; }
  catch (error) { console.error("❌ getBlogById:", error.response?.data); throw error; }
};

export const getRelatedBlogs = async (category, currentBlogId, limit = 3) => {
  try { const { data } = await API.get(`/blogs/category/${category}`); return data.filter(b => b._id !== currentBlogId).slice(0, limit); }
  catch { return []; }
};

export const searchBlogs = async (filters = {}) => {
  try {
    const q = new URLSearchParams();
    if (filters.search)   q.append("search",   filters.search);
    if (filters.category) q.append("category", filters.category);
    if (filters.format)   q.append("format",   filters.format);
    if (filters.tag)      q.append("tag",       filters.tag);
    if (filters.status)   q.append("status",   filters.status);
    if (filters.featured) q.append("featured", filters.featured);
    const { data } = await API.get(q.toString() ? `/blogs?${q.toString()}` : "/blogs");
    return data;
  } catch { return []; }
};

/* ═══════════════════════════════════════════════════════
   BLOGS (ADMIN + MANAGER CRUD)
═══════════════════════════════════════════════════════ */
export const getAllBlogsAdmin = async () => {
  const { data } = await API.get("/blogs/admin");
  return Array.isArray(data) ? data : data?.blogs || [];
};

export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (blogData[key] !== undefined && blogData[key] !== null) formData.append(key, blogData[key]);
    });
    const { data } = await API.post("/blogs", formData);
    return data;
  } catch (error) { throw new Error(error.response?.data?.message || "Failed to create blog"); }
};

export const updateBlog = async (id, blogData) => {
  try {
    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (blogData[key] !== undefined && blogData[key] !== null) formData.append(key, blogData[key]);
    });
    const { data } = await API.put(`/blogs/${id}`, formData);
    return data;
  } catch (error) { throw new Error(error.response?.data?.message || "Failed to update blog"); }
};

export const deleteBlog = async (id) => {
  try { const { data } = await API.delete(`/blogs/${id}`); return data; }
  catch (error) { throw new Error(error.response?.data?.message || "Failed to delete blog"); }
};

export const toggleFeaturedBlog = async (id) => {
  try { const { data } = await API.patch(`/blogs/${id}/toggle-featured`); return data; }
  catch (error) { throw new Error(error.response?.data?.message || "Failed to toggle featured"); }
};

export const getBlogStats = async () => {
  try {
    const blogs = await getAllBlogsAdmin();
    const stats = {
      total:     blogs.length,
      published: blogs.filter(b => b.status === "published").length,
      draft:     blogs.filter(b => b.status === "draft").length,
      featured:  blogs.filter(b => b.featured).length,
      byFormat: {}, byCategory: {}, totalTags: 0,
    };
    blogs.forEach(blog => {
      const fmt = blog.postFormat || "standard";
      stats.byFormat[fmt]             = (stats.byFormat[fmt]             || 0) + 1;
      stats.byCategory[blog.category] = (stats.byCategory[blog.category] || 0) + 1;
    });
    stats.totalTags = blogs.reduce((acc, b) => acc + (b.tags?.length || 0), 0);
    return stats;
  } catch { return null; }
};

/* ── Manager blog aliases ── */
export const getManagerBlogs   = getAllBlogsAdmin;
export const createManagerBlog = createBlog;
export const updateManagerBlog = updateBlog;

/* ═══════════════════════════════════════════════════════
   DIPLOMA PROGRAMS (MANAGER)
═══════════════════════════════════════════════════════ */
export const getManagerDiplomaPrograms    = async ()       => { const { data } = await API.get("/manager/diploma-programs");           return Array.isArray(data) ? data : data?.programs || []; };
export const createManagerDiplomaProgram = async (pd)     => { const { data } = await API.post("/manager/diploma-programs", pd);      return data; };
export const updateManagerDiplomaProgram = async (id, pd) => { const { data } = await API.put(`/manager/diploma-programs/${id}`, pd); return data; };

/* ================= PROGRAMS (PUBLIC) ================= */
export const getAllPrograms = async (category = "") => { const { data } = await API.get(category ? `/programs?category=${category}` : "/programs"); return data; };
export const getProgramById = async (id)           => { const { data } = await API.get(`/programs/${id}`); return data; };

/* ================= PROGRAMS (ADMIN) ================= */
export const getAllProgramsAdmin = async ()       => { const { data } = await API.get("/programs/admin/all");      return data; };
export const createProgram       = async (pd)     => { const { data } = await API.post("/programs", pd);           return data; };
export const updateProgram       = async (id, pd) => { const { data } = await API.put(`/programs/${id}`, pd);      return data; };
export const toggleProgramStatus = async (id)     => { const { data } = await API.patch(`/programs/${id}/toggle`); return data; };
export const deleteProgram       = async (id)     => { const { data } = await API.delete(`/programs/${id}`);       return data; };

/* ================= EXPORT HELPERS ================= */
export const getAllCourses  = getCourses;
export const getAllLectures = getLectures;

export const blogAPI = {
  getAllBlogs, getFeaturedBlogs, getBlogCategories, getBlogsByCategory,
  getBlogById, getRelatedBlogs, getAllBlogsAdmin, createBlog, updateBlog,
  deleteBlog, toggleFeaturedBlog, getBlogStats, searchBlogs,
};

/* ================= ORDERS ================= */
export const submitOrder = async (formData) => {
  const { data } = await API.post("/orders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
export const getMyOrders  = async ()              => { const { data } = await API.get("/orders/my-orders");                  return data; };
export const getAllOrders  = async ()              => { const { data } = await API.get("/orders/admin/all");                  return data; };
export const approveOrder  = async (id)           => { const { data } = await API.patch(`/orders/${id}/approve`);            return data; };
export const rejectOrder   = async (id, reason="") => { const { data } = await API.patch(`/orders/${id}/reject`, { reason }); return data; };

/* ================= ENROLLMENT INQUIRIES ================= */
export const submitEnrollmentInquiry = async (formData) => {
  try {
    const { data } = await API.post("/inquiries", formData);
    return data;
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message };
  }
};

export const getAdminInquiries = async (params = {}) => {
  try { const { data } = await API.get("/inquiries", { params }); return data; }
  catch (error) { console.error("❌ Get inquiries error:", error); throw error; }
};

export const updateInquiryStatus = async (id, updateData) => {
  try { const { data } = await API.patch(`/inquiries/${id}/status`, updateData); return data; }
  catch (error) { console.error("❌ Update inquiry error:", error); throw error; }
};

export const getInquiryStats = async () => {
  try { const { data } = await API.get("/inquiries/stats"); return data; }
  catch (error) { console.error("❌ Get stats error:", error); throw error; }
};

export const deleteInquiry = async (id) => {
  try { const { data } = await API.delete(`/inquiries/${id}`); return data; }
  catch (error) { console.error("❌ Delete inquiry error:", error); throw error; }
};


/* ================= CERTIFICATIONS ================= */

export const getAllCertifications = async () => {
  const { data } = await API.get("/certifications");
  return data;
};

export const getAllCertificationsAdmin = async () => {
  const { data } = await API.get("/certifications/admin/all");
  return data;
};

export const getCertificationById = async (id) => {
  const { data } = await API.get(`/certifications/${id}`);
  return data;
};

export const createCertification = async (certData) => {
  const { data } = await API.post("/certifications", certData);
  return data;
};

export const updateCertification = async (id, certData) => {
  const { data } = await API.put(`/certifications/${id}`, certData);
  return data;
};

export const toggleCertificationStatus = async (id) => {
  const { data } = await API.patch(`/certifications/${id}/toggle`);
  return data;
};

export const deleteCertification = async (id) => {
  const { data } = await API.delete(`/certifications/${id}`);
  return data;
};



export const getDiplomaBySlug = async (slug) => {
  const { data } = await API.get(`/diplomas/slug/${slug}`);
  return data;
};

export const getAllJobsPublic  = () => API.get("/jobs");
export const getAllJobsAdmin   = () => API.get("/jobs/admin/all");
export const createJob        = (data) => API.post("/jobs", data);
export const updateJob        = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob        = (id) => API.delete(`/jobs/${id}`);
export const toggleJobStatus  = (id) => API.patch(`/jobs/${id}/toggle`);

export default API;