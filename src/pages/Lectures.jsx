// src/pages/Lectures.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  FaEdit, FaTrash, FaPlus, FaEye, FaFilePdf, FaFileWord,
  FaFileExcel, FaFilePowerpoint, FaVideo, FaLink, FaLock,
  FaUnlock, FaRupeeSign, FaChartLine, FaFilter, FaSort,
  FaArrowLeft, FaDownload, FaPlay, FaBook, FaSearch, FaTag,
  FaTimes, FaArrowUp, FaArrowDown, FaUserClock, FaLayerGroup,
  FaHourglassHalf, FaCheckCircle, FaExclamationTriangle,
  FaUsers, FaKey, FaClock, FaStopwatch, FaInfoCircle, FaSpinner,
} from "react-icons/fa";
import {
  getLecturesByCourse, createLecture, updateLecture, deleteLecture,
  getCourseById, getAdminEnrollments, grantCourseAccess, getCurrentUser,
  isAdmin, isTeacher, getEnrollmentStatus, getFilteredLectures,
} from "../api/api";

const BASE_URL = "https://itechskill.com";

const COLORS = {
  sidebarDark: "#1a1d2e", deepPurple: "#3D1A5B", headerPurple: "#4B2D7A",
  brightGreen: "#00D9A3", goldBadge: "#D4A745", roleBg: "#E8DFF5",
  white: "#FFFFFF", bgGray: "#F9FAFB", lightGray: "#F3F4F6",
  darkGray: "#6B7280", textGray: "#4B5563", danger: "#EF4444",
  warning: "#F59E0B", info: "#3B82F6", orange: "#F97316",
  primaryButton: "#3D1A5B", formButton: "#3B82F6", cancelButton: "#6B7280",
  blueLight: "#dbeafe", greenLight: "#d1fae5", yellowLight: "#fef3c7",
  purpleLight: "#ede9fe", teal: "#0d9488", indigo: "#4f46e5",
  rose: "#f43f5e", insertPurple: "#8B5CF6", insertTeal: "#0D9488",
};

// ─────────────────────────────────────────────────────────
// ProtectedVideoPlayer
// ─────────────────────────────────────────────────────────
const ProtectedVideoPlayer = ({ src }) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    const v = videoRef.current;
    const noCtx = (e) => e.preventDefault();
    const noPiP = () => { if (document.pictureInPictureElement) document.exitPictureInPicture(); };
    const noKey = (e) => {
      if ((e.ctrlKey && ["s","S","u","p","d"].includes(e.key)) || e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && ["I","J"].includes(e.key))) {
        e.preventDefault(); return false;
      }
    };
    if (v) {
      v.addEventListener("contextmenu", noCtx);
      v.addEventListener("enterpictureinpicture", noPiP);
    }
    window.addEventListener("keydown", noKey);
    return () => {
      if (v) {
        v.removeEventListener("contextmenu", noCtx);
        v.removeEventListener("enterpictureinpicture", noPiP);
      }
      window.removeEventListener("keydown", noKey);
    };
  }, []);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <video
        ref={videoRef}
        controls
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={e => e.preventDefault()}
        style={{ width: "100%", maxHeight: "500px", borderRadius: "8px" }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div style={{ position: "absolute", bottom: "40px", right: "10px", background: "rgba(0,0,0,0.7)", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", pointerEvents: "none" }}>
        🔒 Protected
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// GrantAccessModal — admin grants time + lecture limit to one student
// ─────────────────────────────────────────────────────────
const GrantAccessModal = ({ courseId, courseName, onClose, isMobile, onAccessGranted }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(null);
  const [search, setSearch]           = useState("");
  const [successId, setSuccessId]     = useState(null);
  const [rowValues, setRowValues]     = useState({});
  const [error, setError]             = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("📚 GrantAccessModal: Loading enrollments for course:", courseId);
        
        const res  = await getAdminEnrollments();
        console.log("📚 GrantAccessModal: Admin enrollments response:", res);
        
        // Extract enrollments array from response
        let enrollmentsList = [];
        if (res?.enrollments && Array.isArray(res.enrollments)) {
          enrollmentsList = res.enrollments;
        } else if (Array.isArray(res)) {
          enrollmentsList = res;
        } else if (res?.data && Array.isArray(res.data)) {
          enrollmentsList = res.data;
        }
        
        // Filter for this specific course
        const filtered = enrollmentsList.filter(e => {
          const eCourseId = e.courseId?.toString() || e.course?._id?.toString() || e.course?.toString();
          return eCourseId === courseId;
        });
        
        console.log("📚 GrantAccessModal: Filtered enrollments for this course:", filtered);
        setEnrollments(filtered);
        
        const init = {};
        filtered.forEach(e => {
          init[e._id] = {
            durationDays: e.daysRemaining && e.daysRemaining > 0 ? String(e.daysRemaining) : "",
            lectureLimit: e.lectureLimit != null ? String(e.lectureLimit) : "",
          };
        });
        setRowValues(init);
      } catch (err) {
        console.error("❌ GrantAccessModal load error:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError("Failed to load enrollments. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const updateRow = (id, field, value) =>
    setRowValues(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));

  const handleGrant = async (enrollmentId) => {
    const vals         = rowValues[enrollmentId] || {};
    const durationDays = vals.durationDays ? Number(vals.durationDays) : null;
    const lectureLimit = vals.lectureLimit  ? Number(vals.lectureLimit)  : null;

    console.log("🔑 GrantAccessModal: Attempting to grant access", {
      enrollmentId,
      durationDays,
      lectureLimit,
      rawValues: vals
    });

    if (durationDays !== null && (isNaN(durationDays) || durationDays < 1)) {
      console.warn("⚠️ Invalid duration days:", durationDays);
      alert("Duration must be a positive number of days, or leave blank for lifetime.");
      return;
    }
    if (lectureLimit !== null && (isNaN(lectureLimit) || lectureLimit < 1)) {
      console.warn("⚠️ Invalid lecture limit:", lectureLimit);
      alert("Lecture limit must be a positive number, or leave blank for unlimited.");
      return;
    }

    try {
      setSaving(enrollmentId);
      console.log("📡 GrantAccessModal: Calling grantCourseAccess API...");
      
      const grantData = {
        durationDays,
        lectureLimit,
        notes: "Manual grant via admin panel",
      };
      
      console.log("📡 GrantAccessModal: Request payload:", grantData);
      
      // Use grantCourseAccess (which now points to grantLimitedLectureAccess)
      const result = await grantCourseAccess(enrollmentId, grantData);
      
      console.log("✅ GrantAccessModal: API response:", result);
      
      setSuccessId(enrollmentId);
      setTimeout(() => setSuccessId(null), 2500);

      // Refresh the enrollment list inside the modal
      console.log("🔄 GrantAccessModal: Refreshing enrollment list...");
      const res = await getAdminEnrollments();
      let enrollmentsList = [];
      if (res?.enrollments && Array.isArray(res.enrollments)) {
        enrollmentsList = res.enrollments;
      } else if (Array.isArray(res)) {
        enrollmentsList = res;
      } else if (res?.data && Array.isArray(res.data)) {
        enrollmentsList = res.data;
      }
      
      const filtered = enrollmentsList.filter(e => {
        const eCourseId = e.courseId?.toString() || e.course?._id?.toString() || e.course?.toString();
        return eCourseId === courseId;
      });
      setEnrollments(filtered);
      console.log("✅ GrantAccessModal: Enrollment list refreshed, found:", filtered.length, "enrollments");

      // Tell the parent page to re-fetch lectures + access info
      if (onAccessGranted) {
        console.log("📢 GrantAccessModal: Notifying parent to refresh data");
        onAccessGranted();
      }
      
      alert("✅ Access granted successfully!");
      
    } catch (err) {
      console.error("❌ GrantAccessModal: Error granting access:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      const errorMessage = err?.response?.data?.message || err.message || "Failed to grant access. Please try again.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setSaving(null);
    }
  };

  const filtered = enrollments.filter(e =>
    (e.studentName || e.student?.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.studentEmail || e.student?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, padding: isMobile ? "16px" : "24px" }}>
      <div style={{ background: COLORS.white, borderRadius: "14px", width: isMobile ? "100%" : "1000px", maxWidth: "96%", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 48px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `2px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,rgba(61,26,91,0.08),rgba(94,66,123,0.04))" }}>
          <div>
            <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: isMobile ? "18px" : "22px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <FaKey /> Grant Student Access
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: COLORS.darkGray }}>
              Course: <strong style={{ color: COLORS.deepPurple }}>{courseName}</strong>
            </p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: "22px", cursor: "pointer", color: COLORS.deepPurple, padding: "4px" }}>
            <FaTimes />
          </button>
        </div>

        {/* Info banner */}
        <div style={{ padding: "12px 24px", background: COLORS.yellowLight, borderBottom: `1px solid #fcd34d`, fontSize: "13px", color: "#92400e", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <FaExclamationTriangle style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>
            <strong>How it works:</strong> Set a duration (days from today) and/or a lecture limit per student.
            Leave duration blank for <strong>lifetime access</strong>. Leave lecture limit blank for <strong>unlimited lectures</strong>.
            Re-watching an already-opened lecture never uses an extra slot.
          </span>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${COLORS.lightGray}` }}>
          <div style={{ position: "relative", maxWidth: "360px" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: "14px" }} />
            <input
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "8px", border: `1px solid ${COLORS.lightGray}`, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: COLORS.darkGray }}>
              <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "32px", marginBottom: "12px" }} />
              <div>Loading enrollments...</div>
            </div>
          ) : error ? (
            <div style={{ padding: "48px", textAlign: "center", color: COLORS.danger }}>
              <FaExclamationTriangle style={{ fontSize: "36px", marginBottom: "12px" }} />
              <div>{error}</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: COLORS.darkGray }}>
              <FaUsers style={{ fontSize: "36px", opacity: 0.3, display: "block", margin: "0 auto 12px" }} />
              No enrolled students found for this course.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "700px" : "auto" }}>
              <thead>
                <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                  {["Student", "Current Access", "Set Duration (days)", "Set Lecture Limit", "Action"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, fontSize: "13px", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((enr, i) => {
                  const vals     = rowValues[enr._id] || {};
                  const isSaving = saving    === enr._id;
                  const isSuccess= successId === enr._id;
                  const expiry   = enr.endDate ? new Date(enr.endDate) : null;
                  const now      = new Date();
                  const expired  = expiry && now > expiry;
                  const daysLeft = expiry ? Math.max(0, Math.ceil((expiry - now) / 86400000)) : null;
                  
                  // Get student name from different possible fields
                  const studentName = enr.studentName || enr.student?.fullName || enr.student?.name || "Unknown";
                  const studentEmail = enr.studentEmail || enr.student?.email || "";

                  return (
                    <tr key={enr._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: i % 2 === 0 ? COLORS.white : COLORS.bgGray }}>
                      <td style={{ padding: "14px 16px", minWidth: "160px" }}>
                        <div style={{ fontWeight: 600, color: COLORS.deepPurple, fontSize: "14px" }}>{studentName}</div>
                        <div style={{ fontSize: "12px", color: COLORS.darkGray }}>{studentEmail}</div>
                        <span style={{
                          display: "inline-block", marginTop: "4px",
                          padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 600,
                          background: enr.isPaid || enr.grantedByAdmin ? COLORS.greenLight : "#fee2e2",
                          color:      enr.isPaid || enr.grantedByAdmin ? "#065f46"         : "#991b1b",
                        }}>
                          {enr.grantedByAdmin ? "✓ Admin Grant" : (enr.isPaid ? "✓ Paid" : "Unpaid")}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", minWidth: "160px" }}>
                        <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                          <span style={{ color: COLORS.darkGray, fontWeight: 600 }}>Time: </span>
                          {expiry ? (
                            <span style={{ color: expired ? COLORS.danger : (daysLeft <= 3 ? COLORS.warning : "#059669"), fontWeight: 600 }}>
                              {expired ? "Expired" : `${daysLeft}d left`}
                              <span style={{ color: COLORS.darkGray, fontWeight: 400, marginLeft: "4px" }}>
                                ({expiry.toLocaleDateString()})
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: "#059669", fontWeight: 600 }}>Lifetime</span>
                          )}
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          <span style={{ color: COLORS.darkGray, fontWeight: 600 }}>Lectures: </span>
                          {enr.lectureLimit != null ? (
                            <span style={{ fontWeight: 600, color: COLORS.deepPurple }}>
                              {enr.accessedLecturesCount || 0} / {enr.lectureLimit}
                              {enr.isLimitReached && <span style={{ color: COLORS.danger, marginLeft: "4px" }}>⚠ limit reached</span>}
                            </span>
                          ) : (
                            <span style={{ color: "#059669", fontWeight: 600 }}>Unlimited</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", minWidth: "160px" }}>
                        <input
                          type="number" min="1"
                          value={vals.durationDays || ""}
                          onChange={e => updateRow(enr._id, "durationDays", e.target.value)}
                          placeholder="e.g. 30"
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: `1px solid ${COLORS.lightGray}`, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                        />
                        <div style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "4px" }}>blank = lifetime</div>
                        {vals.durationDays && (
                          <div style={{ fontSize: "11px", color: "#059669", marginTop: "2px", fontWeight: 600 }}>
                            → expires {new Date(Date.now() + Number(vals.durationDays) * 86400000).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", minWidth: "160px" }}>
                        <input
                          type="number" min="1"
                          value={vals.lectureLimit || ""}
                          onChange={e => updateRow(enr._id, "lectureLimit", e.target.value)}
                          placeholder="e.g. 10"
                          style={{ width: "100%", padding: "8px 10px", borderRadius: "7px", border: `1px solid ${COLORS.lightGray}`, fontSize: "13px", outline: "none", boxSizing: "border-box" }}
                        />
                        <div style={{ fontSize: "11px", color: COLORS.darkGray, marginTop: "4px" }}>blank = unlimited</div>
                        {vals.lectureLimit && (
                          <div style={{ fontSize: "11px", color: COLORS.deepPurple, marginTop: "2px", fontWeight: 600 }}>
                            → max {vals.lectureLimit} lectures
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px", minWidth: "130px" }}>
                        {isSuccess ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#059669", fontWeight: 700, fontSize: "13px" }}>
                            <FaCheckCircle /> Saved!
                          </div>
                        ) : (
                          <button
                            onClick={() => handleGrant(enr._id)}
                            disabled={isSaving}
                            style={{
                              background: isSaving ? COLORS.darkGray : "linear-gradient(135deg,#3D1A5B,#5E427B)",
                              color: COLORS.white, border: "none", padding: "9px 16px",
                              borderRadius: "8px", cursor: isSaving ? "not-allowed" : "pointer",
                              fontWeight: 700, fontSize: "13px", width: "100%",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {isSaving ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <><FaKey size={11} /> Grant</>}
                          </button>
                        )}
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ padding: "14px 24px", borderTop: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: COLORS.cancelButton, color: COLORS.white, border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// AccessStatusBanner — shows student their current access status
// ─────────────────────────────────────────────────────────
const AccessStatusBanner = ({ accessInfo, isMobile }) => {
  if (!accessInfo) return null;

  const {
    isExpired, isLimitReached, daysRemaining,
    lectureLimit, accessedLecturesCount, lecturesRemaining,
    hasAccess, coursePrice, grantedByAdmin,
  } = accessInfo;

  if (grantedByAdmin && !isExpired && !isLimitReached) {
    return (
      <div style={{ background: "#fef9c3", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: "4px solid #eab308" }}>
        <FaCheckCircle style={{ color: "#ca8a04", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#854d0e" }}>✅ Manual Access Granted</strong>
          <span style={{ color: "#854d0e", fontSize: "13px", marginLeft: "8px" }}>
            Access provided via admin. All lectures unlocked.
          </span>
        </div>
      </div>
    );
  }

  if (coursePrice === 0) {
    return (
      <div style={{ background: COLORS.greenLight, padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.brightGreen}` }}>
        <FaUnlock style={{ color: "#065f46", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#065f46" }}>Free Course</strong>
          <span style={{ color: "#065f46", fontSize: "13px", marginLeft: "8px" }}>All lectures are available for free!</span>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div style={{ background: "#fee2e2", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.danger}` }}>
        <FaHourglassHalf style={{ color: "#991b1b", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Access Expired</strong>
          <span style={{ color: "#991b1b", fontSize: "13px", marginLeft: "8px" }}>Your course access has expired. Please contact admin to renew.</span>
        </div>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div style={{ background: "#fee2e2", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.danger}` }}>
        <FaExclamationTriangle style={{ color: "#991b1b", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Lecture Limit Reached</strong>
          <span style={{ color: "#991b1b", fontSize: "13px", marginLeft: "8px" }}>
            You have reached the maximum number of lectures ({lectureLimit}). Contact admin to extend.
          </span>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div style={{ background: "#fee2e2", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.danger}` }}>
        <FaLock style={{ color: "#991b1b", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Access Restricted</strong>
          <span style={{ color: "#991b1b", fontSize: "13px", marginLeft: "8px" }}>Contact admin to get access.</span>
        </div>
      </div>
    );
  }

  if (daysRemaining !== null && daysRemaining > 0) {
    return (
      <div style={{ background: COLORS.blueLight, padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.info}` }}>
        <FaClock style={{ color: "#1e40af", fontSize: "18px" }} />
        <div>
          <strong style={{ color: "#1e40af" }}>Access Status</strong>
          <span style={{ color: "#1e40af", fontSize: "13px", marginLeft: "8px" }}>
            {daysRemaining} days remaining
            {lectureLimit !== null && ` • ${accessedLecturesCount || 0}/${lectureLimit} lectures used (${lecturesRemaining} remaining)`}
          </span>
        </div>
      </div>
    );
  }

  if (lectureLimit !== null) {
    return (
      <div style={{ background: COLORS.purpleLight, padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.deepPurple}` }}>
        <FaBook style={{ color: COLORS.deepPurple, fontSize: "18px" }} />
        <div>
          <strong style={{ color: COLORS.deepPurple }}>Access Status</strong>
          <span style={{ color: COLORS.deepPurple, fontSize: "13px", marginLeft: "8px" }}>
            {accessedLecturesCount || 0}/{lectureLimit} lectures used ({lecturesRemaining} remaining) • Lifetime access
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.greenLight, padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", borderLeft: `4px solid ${COLORS.brightGreen}` }}>
      <FaUnlock style={{ color: "#065f46", fontSize: "18px" }} />
      <div>
        <strong style={{ color: "#065f46" }}>Full Access</strong>
        <span style={{ color: "#065f46", fontSize: "13px", marginLeft: "8px" }}>You have lifetime access to all lectures.</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Main Lectures component
// ─────────────────────────────────────────────────────────
const Lectures = () => {
  const { courseId } = useParams();
  const navigate     = useNavigate();

  const [lectures, setLectures]           = useState([]);
  const [course, setCourse]               = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [editingId, setEditingId]         = useState(null);
  const [loading, setLoading]             = useState(false);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [sortBy, setSortBy]               = useState("lectureNumber");
  const [filterAccess, setFilterAccess]   = useState("all");
  const [isMobile, setIsMobile]           = useState(window.innerWidth <= 768);
  const [reorderMode, setReorderMode]     = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [stats, setStats]                 = useState({ totalLectures: 0, freeLectures: 0, paidLectures: 0, totalDuration: 0 });
  const [accessInfo, setAccessInfo]       = useState(null);

  const [videoFile, setVideoFile]   = useState(null);
  const [pdfFile,   setPdfFile]     = useState(null);
  const [docFile,   setDocFile]     = useState(null);
  const [excelFile, setExcelFile]   = useState(null);
  const [pptFile,   setPptFile]     = useState(null);

  const [formData, setFormData] = useState({
    title: "", description: "", lectureNumber: "", duration: "",
    videoUrl: "", type: "video", notes: "", isFreePreview: false,
    priceRequired: 0, subCategory: "",
  });

  const currentUser    = getCurrentUser();
  const userRole       = currentUser?.role?.toLowerCase() || "student";
  const isAdminUser    = userRole === "admin";
  const isTeacherUser  = userRole === "teacher";
  const isStudentUser  = !isAdminUser && !isTeacherUser;

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // ── Fetch course details + lectures ──
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📚 fetchData: Starting for courseId:", courseId);
      console.log("📚 fetchData: User role:", userRole, "isStudentUser:", isStudentUser);

      // Fetch course details
      try {
        const res = await getCourseById(courseId);
        console.log("📚 fetchData: Course response:", res);
        setCourse(res?.course || res || null);
      } catch (err) {
        console.error("Error fetching course:", err);
      }

      if (isStudentUser) {
        console.log("📚 fetchData: Fetching filtered lectures for student");
        const data = await getFilteredLectures(courseId);
        console.log("📚 fetchData: Filtered lectures response:", data);

        const accessMeta = {
          isExpired:             data.isExpired             || false,
          isLimitReached:        data.isLimitReached        || false,
          lectureLimit:          data.lectureLimit          ?? null,
          accessedLecturesCount: data.accessedLecturesCount || 0,
          lecturesRemaining:     data.lecturesRemaining     ?? null,
          daysRemaining:         data.daysRemaining         ?? null,
          endDate:               data.endDate               || null,
          hasAccess:             data.hasAccess             || data.hasFullAccess || false,
          isPaid:                data.isPaid                || false,
          coursePrice:           data.coursePrice           || 0,
          grantedByAdmin:        data.grantedByAdmin        || false,
        };
        
        console.log("📚 fetchData: Access info for student:", accessMeta);
        setAccessInfo(accessMeta);

        let lecturesArr = data.lectures || [];
        lecturesArr.sort((a, b) => (parseInt(a.lectureNumber) || 0) - (parseInt(b.lectureNumber) || 0));
        console.log("📚 fetchData: Lectures loaded:", lecturesArr.length);
        setLectures(lecturesArr);
        calcStats(lecturesArr);

      } else {
        console.log("📚 fetchData: Fetching all lectures for admin/teacher");
        const data = await getLecturesByCourse(courseId);
        let lecturesArr = data.lectures || [];
        if (Array.isArray(data)) lecturesArr = data;
        lecturesArr.sort((a, b) => (parseInt(a.lectureNumber) || 0) - (parseInt(b.lectureNumber) || 0));
        console.log("📚 fetchData: Lectures loaded:", lecturesArr.length);
        setLectures(lecturesArr);
        calcStats(lecturesArr);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  const calcStats = (arr) => {
    const total = arr.length;
    const free  = arr.filter(l => l.isFreePreview).length;
    setStats({
      totalLectures: total,
      freeLectures:  free,
      paidLectures:  total - free,
      totalDuration: arr.reduce((s, l) => s + (parseInt(l.duration) || 0), 0),
    });
  };

  useEffect(() => { 
    fetchData(); 
  }, [courseId]);

  // ── Insert / reorder helpers ──
  const shiftLectures = async (condition, offset) => {
    const toUpdate = lectures.filter(l => condition(parseInt(l.lectureNumber) || 0));
    for (const l of toUpdate) {
      await updateLecture(l._id, { lectureNumber: (parseInt(l.lectureNumber) || 0) + offset });
    }
    await fetchData();
  };

  const openInsertForm = async (ref, pos) => {
    setEditingId(null); resetForm();
    const newNum = pos === "above"
      ? (parseInt(ref.lectureNumber) || 1)
      : (parseInt(ref.lectureNumber) || 0) + 1;
    setLoading(true);
    try {
      if (pos === "above") await shiftLectures(n => n >= newNum, 1);
      else                 await shiftLectures(n => n > parseInt(ref.lectureNumber), 1);
    } catch { alert("Failed to update lecture order."); } finally { setLoading(false); }
    setFormData(p => ({ ...p, lectureNumber: newNum }));
    setShowForm(true);
  };

  const openAddAtTopForm = () => {
    setEditingId(null); resetForm();
    setFormData(p => ({ ...p, lectureNumber: 1 }));
    (async () => {
      setLoading(true);
      try { await shiftLectures(n => n >= 1, 1); }
      catch { alert("Failed to prepare."); }
      finally { setLoading(false); }
    })();
    setShowForm(true);
  };

  const openAddAtBottomForm = () => {
    setEditingId(null); resetForm();
    const next = lectures.length > 0
      ? Math.max(...lectures.map(l => parseInt(l.lectureNumber) || 0)) + 1
      : 1;
    setFormData(p => ({ ...p, lectureNumber: next }));
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingId(null); resetForm();
    const next = lectures.length > 0
      ? Math.max(...lectures.map(l => parseInt(l.lectureNumber) || 0)) + 1
      : 1;
    setFormData(p => ({ ...p, lectureNumber: next }));
    setShowForm(true);
  };

  const openEditForm = (lec) => {
    setEditingId(lec._id);
    setFormData({
      title:         lec.title         || "",
      description:   lec.description   || "",
      lectureNumber: lec.lectureNumber || "",
      duration:      lec.duration      || "",
      videoUrl:      lec.videoUrl      || "",
      type:          lec.type          || "video",
      notes:         lec.notes         || "",
      isFreePreview: lec.isFreePreview || false,
      priceRequired: lec.priceRequired || 0,
      subCategory:   lec.subCategory   || "",
    });
    setVideoFile(null); setPdfFile(null); setDocFile(null); setExcelFile(null); setPptFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "", description: "", lectureNumber: "", duration: "",
      videoUrl: "", type: "video", notes: "", isFreePreview: false,
      priceRequired: 0, subCategory: "",
    });
    setVideoFile(null); setPdfFile(null); setDocFile(null); setExcelFile(null); setPptFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") form.append(k, v);
      });
      form.append("course", courseId);
      if (videoFile) form.append("video",    videoFile);
      if (pdfFile)   form.append("pdf",      pdfFile);
      if (docFile)   form.append("document", docFile);
      if (excelFile) form.append("excel",    excelFile);
      if (pptFile)   form.append("ppt",      pptFile);
      if (editingId) await updateLecture(editingId, form);
      else           await createLecture(form);
      await fetchData(); resetForm(); setShowForm(false);
      alert(editingId ? "Lecture updated!" : "Lecture added!");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lecture? This cannot be undone.")) return;
    try { await deleteLecture(id); await fetchData(); alert("Deleted!"); }
    catch { alert("Failed to delete lecture."); }
  };

  // ── Filter / Sort ──
  const filtered = lectures
    .filter(l => {
      const matchSearch =
        l.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.lectureNumber?.toString().includes(searchTerm) ||
        l.subCategory?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchAccess =
        filterAccess === "all" ||
        (filterAccess === "free" && l.isFreePreview) ||
        (filterAccess === "paid" && !l.isFreePreview);
      return matchSearch && matchAccess;
    })
    .sort((a, b) => {
      if (sortBy === "lectureNumber") return (parseInt(a.lectureNumber) || 0) - (parseInt(b.lectureNumber) || 0);
      if (sortBy === "title")        return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "duration")     return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
      return 0;
    });

  const bySubcategory = {};
  filtered.forEach(l => {
    const s = l.subCategory || "Uncategorized";
    if (!bySubcategory[s]) bySubcategory[s] = [];
    bySubcategory[s].push(l);
  });

  const renderFile = (lec) => {
    if (lec.videoPath)    return <div style={{ width: "100%", maxWidth: "400px" }}><ProtectedVideoPlayer src={`${BASE_URL}/${lec.videoPath}`} /></div>;
    if (lec.videoUrl)     return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaPlay style={{ color: COLORS.danger }} /><span style={{ color: COLORS.darkGray, fontSize: "13px" }}>External Video</span></div>;
    if (lec.pdfPath)      return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFilePdf style={{ color: COLORS.danger }} /><a href={`${BASE_URL}/${lec.pdfPath}`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.info, textDecoration: "none", fontSize: "13px" }}>View PDF</a></div>;
    if (lec.documentPath) return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFileWord style={{ color: COLORS.indigo }} /><a href={`${BASE_URL}/${lec.documentPath}`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.info, textDecoration: "none", fontSize: "13px" }}>View Doc</a></div>;
    if (lec.excelPath)    return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFileExcel style={{ color: COLORS.teal }} /><a href={`${BASE_URL}/${lec.excelPath}`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.info, textDecoration: "none", fontSize: "13px" }}>View Sheet</a></div>;
    if (lec.pptPath)      return <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><FaFilePowerpoint style={{ color: COLORS.warning }} /><a href={`${BASE_URL}/${lec.pptPath}`} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.info, textDecoration: "none", fontSize: "13px" }}>View PPT</a></div>;
    return <span style={{ color: COLORS.darkGray, fontStyle: "italic", fontSize: "13px" }}>No file</span>;
  };

  const typeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "video":    return { bg: "#fee2e2",        text: COLORS.danger };
      case "pdf":      return { bg: COLORS.blueLight,  text: COLORS.info };
      case "document": return { bg: COLORS.greenLight, text: COLORS.teal };
      case "excel":    return { bg: COLORS.yellowLight,text: "#92400e" };
      case "ppt":      return { bg: COLORS.purpleLight,text: COLORS.indigo };
      case "link":     return { bg: "#e0f2fe",         text: COLORS.info };
      default:         return { bg: COLORS.lightGray,  text: COLORS.darkGray };
    }
  };

  const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div style={{ background: COLORS.white, padding: isMobile ? "12px" : "16px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px", flex: "1 1 180px", minWidth: isMobile ? "150px" : "180px" }}>
      <div style={{ width: isMobile ? "35px" : "40px", height: isMobile ? "35px" : "40px", borderRadius: "8px", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "16px" : "18px", color }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: isMobile ? "11px" : "12px", color: COLORS.darkGray, marginBottom: "2px", whiteSpace: "nowrap" }}>{title}</div>
        <div style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 700, color: COLORS.deepPurple }}>{value}</div>
      </div>
    </div>
  );

  const isLectureLocked = (lec) => {
    if (isAdminUser || isTeacherUser)  return false;
    if (lec.isFreePreview)             return false;
    if (accessInfo?.grantedByAdmin)    return false;
    if (
      (accessInfo?.hasAccess || accessInfo?.hasFullAccess) &&
      !accessInfo?.isExpired &&
      !accessInfo?.isLimitReached
    ) return false;
    return true;
  };

  // ── Render ──
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: COLORS.bgGray }}>
      <Sidebar />

      <div style={{ flex: 1, overflowX: "hidden", marginLeft: isMobile ? 0 : "280px", padding: isMobile ? "80px 16px 32px" : "32px" }}>
        {/* Header section */}
        <div style={{ marginBottom: isMobile ? "20px" : "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isMobile ? "16px" : "24px", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <button onClick={() => navigate("/courses")} style={{ background: "transparent", border: "none", fontSize: isMobile ? "14px" : "16px", cursor: "pointer", color: COLORS.darkGray, display: "flex", alignItems: "center", gap: "8px", padding: "8px 0", marginBottom: "8px" }}>
                <FaArrowLeft /> Back to Courses
              </button>
              <h1 style={{ margin: 0, color: COLORS.deepPurple, fontSize: isMobile ? "20px" : "28px", fontWeight: 700, marginBottom: "8px" }}>
                📚 Lectures
              </h1>
              {course && (
                <p style={{ margin: 0, color: COLORS.textGray, fontSize: isMobile ? "12px" : "14px", display: "flex", flexWrap: "wrap", gap: isMobile ? "6px" : "8px", alignItems: "center" }}>
                  <span>Course: <strong style={{ color: COLORS.deepPurple }}>{course.title}</strong></span>
                  <span style={{ color: COLORS.darkGray }}>•</span>
                  <span>Price: <strong style={{ color: course.price > 0 ? COLORS.deepPurple : COLORS.brightGreen }}>
                    ₹{course.price || 0}{course.price === 0 && " (FREE)"}
                  </strong></span>
                  <span style={{ color: COLORS.darkGray }}>•</span>
                  <span>Category: <strong style={{ color: COLORS.deepPurple }}>{course.category || "Uncategorized"}</strong></span>
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {isAdminUser && (
                <button
                  onClick={() => setShowGrantModal(true)}
                  style={{ background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: COLORS.white, border: "none", padding: isMobile ? "10px 16px" : "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: isMobile ? "13px" : "14px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(61,26,91,0.3)", transition: "all 0.2s ease" }}
                >
                  <FaUserClock /> {isMobile ? "Access" : "Manage Student Access"}
                </button>
              )}

              <div style={{ background: "linear-gradient(135deg,rgba(61,26,91,0.1),rgba(94,66,123,0.1))", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", padding: isMobile ? "10px 16px" : "12px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: isMobile ? "35px" : "40px", height: isMobile ? "35px" : "40px", borderRadius: "8px", background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? "16px" : "20px", color: COLORS.info }}><FaBook /></div>
                <div>
                  <p style={{ color: COLORS.deepPurple, fontSize: isMobile ? "12px" : "14px", fontWeight: 600, margin: 0, marginBottom: "2px" }}>Total Lectures</p>
                  <p style={{ color: COLORS.deepPurple, fontSize: isMobile ? "20px" : "24px", fontWeight: 700, margin: 0 }}>{stats.totalLectures}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: isMobile ? "10px" : "15px", marginBottom: isMobile ? "16px" : "20px", overflowX: "auto", paddingBottom: "5px" }}>
            <StatCard icon={<FaBook />}     title="Total Lectures" value={stats.totalLectures} color={COLORS.info}    bgColor={COLORS.blueLight} />
            <StatCard icon={<FaUnlock />}   title="Free Lectures"  value={stats.freeLectures}  color="#059669"        bgColor="#d1fae5" />
            <StatCard icon={<FaLock />}     title="Paid Lectures"  value={stats.paidLectures}  color={COLORS.danger}  bgColor="#fee2e2" />
            <StatCard icon={<FaChartLine />}title="Total Duration" value={`${stats.totalDuration}m`} color={COLORS.orange} bgColor="#fed7aa" />
          </div>

          {/* Access Status Banner */}
          {isStudentUser && accessInfo && (
            <AccessStatusBanner accessInfo={accessInfo} isMobile={isMobile} />
          )}

          {/* Search / Filter / Add row */}
          <div style={{ display: "flex", gap: isMobile ? "8px" : "12px", marginBottom: isMobile ? "16px" : "20px", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: isMobile ? "1" : "1 1 400px", maxWidth: isMobile ? "100%" : "500px" }}>
              <FaSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: COLORS.darkGray, fontSize: isMobile ? "14px" : "16px" }} />
              <input
                placeholder="Search lectures..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: isMobile ? "10px 14px 10px 40px" : "12px 16px 12px 44px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: isMobile ? "13px" : "14px", background: COLORS.white, boxSizing: "border-box", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: isMobile ? "8px" : "10px", flex: isMobile ? "1" : "0 0 auto", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: isMobile ? "10px" : "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: isMobile ? "12px" : "14px", background: COLORS.white, cursor: "pointer", flex: isMobile ? "1 1 45%" : "0 0 auto", minWidth: isMobile ? 0 : "150px", outline: "none" }}>
                <option value="lectureNumber">Sort by Number</option>
                <option value="title">Sort by Title</option>
                <option value="duration">Sort by Duration</option>
              </select>
              <select value={filterAccess} onChange={e => setFilterAccess(e.target.value)} style={{ padding: isMobile ? "10px" : "12px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: isMobile ? "12px" : "14px", background: COLORS.white, cursor: "pointer", flex: isMobile ? "1 1 45%" : "0 0 auto", minWidth: isMobile ? 0 : "150px", outline: "none" }}>
                <option value="all">All Lectures</option>
                <option value="free">Free Preview</option>
                <option value="paid">Paid Only</option>
              </select>
              {(isAdminUser || isTeacherUser) && (
                <>
                  <button onClick={() => setReorderMode(!reorderMode)} style={{ background: reorderMode ? COLORS.brightGreen : COLORS.lightGray, color: reorderMode ? COLORS.white : COLORS.textGray, border: "none", padding: isMobile ? "10px 12px" : "12px 16px", borderRadius: "8px", cursor: "pointer", fontSize: isMobile ? "12px" : "14px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", flex: isMobile ? "1 1 45%" : "0 0 auto", whiteSpace: "nowrap", transition: "all 0.2s ease" }}>
                    {reorderMode ? "✅ Reorder ON" : "🔄 Reorder"}
                  </button>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <button onClick={openAddForm} style={{ background: COLORS.primaryButton, color: COLORS.white, border: "none", padding: isMobile ? "10px 20px" : "12px 24px", borderRadius: "8px", cursor: "pointer", fontSize: isMobile ? "12px" : "14px", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 2px 5px rgba(139,92,246,0.3)", whiteSpace: "nowrap", flex: isMobile ? "1 1 100%" : "0 0 auto", transition: "all 0.2s ease" }}>
                      <FaPlus /> {isMobile ? "Add" : "New Lecture"}
                    </button>
                    {reorderMode && (
                      <div style={{ position: "absolute", top: "100%", right: 0, marginTop: "5px", background: COLORS.white, borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 100, minWidth: "180px", overflow: "hidden" }}>
                        <button onClick={openAddAtTopForm} style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: COLORS.textGray, borderBottom: `1px solid ${COLORS.lightGray}` }}>
                          <FaArrowUp color={COLORS.insertPurple} /> Add at Top
                        </button>
                        <button onClick={openAddAtBottomForm} style={{ width: "100%", padding: "10px 16px", border: "none", background: "transparent", textAlign: "left", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", color: COLORS.textGray }}>
                          <FaArrowDown color={COLORS.insertTeal} /> Add at Bottom
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {reorderMode && (isAdminUser || isTeacherUser) && (
            <div style={{ background: COLORS.yellowLight, padding: "10px 16px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: isMobile ? "12px" : "14px", color: "#92400e", border: "1px solid #fcd34d" }}>
              <span style={{ fontSize: "18px" }}>🔄</span>
              <span><strong>Reorder Mode Active:</strong> Click ↑ Above or ↓ Below buttons to insert lectures between existing ones</span>
            </div>
          )}

          {/* ── Lectures by Subcategory ── */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "40px", color: COLORS.deepPurple }} />
              <p style={{ marginTop: "16px", color: COLORS.darkGray }}>Loading lectures...</p>
            </div>
          ) : Object.keys(bySubcategory).length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", background: COLORS.white, borderRadius: "12px" }}>
              <FaBook style={{ fontSize: "48px", color: COLORS.darkGray, opacity: 0.3, marginBottom: "16px" }} />
              <h3 style={{ color: COLORS.deepPurple }}>No Lectures Found</h3>
              {(isAdminUser || isTeacherUser) && (
                <button onClick={openAddForm} style={{ marginTop: "16px", background: COLORS.primaryButton, color: COLORS.white, border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
                  <FaPlus /> Add First Lecture
                </button>
              )}
            </div>
          ) : (
            Object.keys(bySubcategory).map((sub) => (
              <div key={sub} style={{ marginBottom: "30px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", padding: "12px 20px", background: "linear-gradient(135deg,rgba(61,26,91,0.1),rgba(94,66,123,0.1))", borderRadius: "10px", borderLeft: `4px solid ${COLORS.deepPurple}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FaTag style={{ color: COLORS.deepPurple, fontSize: "18px" }} />
                    <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: "18px", fontWeight: 600 }}>{sub}</h3>
                    <span style={{ background: COLORS.deepPurple, color: COLORS.white, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>{bySubcategory[sub].length} lectures</span>
                  </div>
                </div>

                <div style={{ background: COLORS.white, borderRadius: "12px", overflow: isMobile ? "auto" : "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "1200px" : "auto" }}>
                    <thead>
                      <tr style={{ background: COLORS.headerPurple, color: COLORS.white }}>
                        {["#", "Lecture Details", "Access", "Resource", "Actions"].map((h, i) => (
                          <th key={h} style={{ padding: isMobile ? "14px 12px" : "18px 24px", textAlign: i === 4 ? "center" : "left", fontWeight: 700, fontSize: isMobile ? "12px" : "15px", width: [80, undefined, 120, 150, 250][i] }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bySubcategory[sub].map((lec, i) => {
                        const tc = typeColor(lec.type);
                        const locked = isLectureLocked(lec);

                        return (
                          <tr key={lec._id} style={{ borderBottom: `1px solid ${COLORS.lightGray}`, background: i % 2 === 0 ? COLORS.white : COLORS.bgGray, opacity: locked ? 0.6 : 1 }}>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px", color: COLORS.deepPurple, fontWeight: 600, fontSize: isMobile ? "13px" : "15px" }}>{lec.lectureNumber}</td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                              <div style={{ fontWeight: 600, color: COLORS.deepPurple, marginBottom: "4px", fontSize: isMobile ? "13px" : "15px" }}>{lec.title}</div>
                              <div style={{ fontSize: isMobile ? "11px" : "13px", color: COLORS.textGray, marginBottom: "6px", wordBreak: "break-word" }}>{lec.description?.substring(0, isMobile ? 50 : 80)}...</div>
                              <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px", flexWrap: "wrap" }}>
                                <span style={{ background: tc.bg, color: tc.text, padding: "3px 8px", borderRadius: "4px", fontSize: isMobile ? "10px" : "11px", fontWeight: 600, textTransform: "uppercase" }}>{lec.type}</span>
                                {lec.duration && <span style={{ fontSize: isMobile ? "11px" : "12px", color: COLORS.darkGray }}>⏱️ {lec.duration} min</span>}
                              </div>
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: lec.isFreePreview ? COLORS.greenLight : "#fee2e2", color: lec.isFreePreview ? "#065f46" : "#991b1b", padding: isMobile ? "4px 8px" : "6px 10px", borderRadius: "6px", fontSize: isMobile ? "10px" : "12px", fontWeight: 600, width: "fit-content" }}>
                                  {lec.isFreePreview ? <><FaUnlock size={10} /> Free Preview</> : <><FaLock size={10} /> Paid Only</>}
                                </span>
                                {locked && !lec.isFreePreview && (
                                  <span style={{ fontSize: "11px", color: COLORS.warning, display: "flex", alignItems: "center", gap: "4px" }}>
                                    <FaInfoCircle size={10} /> Requires purchase
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px" }}>{renderFile(lec)}</td>
                            <td style={{ padding: isMobile ? "14px 12px" : "18px 24px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: isMobile ? "4px" : "6px", justifyContent: "center", flexDirection: "column", alignItems: "center", flexWrap: "wrap" }}>
                                {(isAdminUser || isTeacherUser) && reorderMode && (
                                  <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center", marginBottom: "4px" }}>
                                    <button onClick={() => openInsertForm(lec, "above")} disabled={loading} style={{ background: COLORS.insertPurple, color: COLORS.white, border: "none", padding: isMobile ? "4px 8px" : "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: isMobile ? "10px" : "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }}>
                                      <FaArrowUp size={10} /> Above
                                    </button>
                                    <button onClick={() => openInsertForm(lec, "below")} disabled={loading} style={{ background: COLORS.insertTeal, color: COLORS.white, border: "none", padding: isMobile ? "4px 8px" : "6px 12px", borderRadius: "4px", cursor: "pointer", fontSize: isMobile ? "10px" : "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", flex: 1, justifyContent: "center" }}>
                                      <FaArrowDown size={10} /> Below
                                    </button>
                                  </div>
                                )}
                                <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
                                  {(isAdminUser || isTeacherUser) ? (
                                    <>
                                      <button onClick={() => setSelectedLecture(lec)} style={{ background: COLORS.brightGreen, color: COLORS.white, border: "none", padding: isMobile ? "6px 8px" : "8px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: isMobile ? "11px" : "13px", flex: 1, justifyContent: "center" }}>
                                        <FaEye size={isMobile ? 10 : 12} /> {!isMobile && "View"}
                                      </button>
                                      <button onClick={() => openEditForm(lec)} style={{ background: COLORS.warning, color: COLORS.white, border: "none", padding: isMobile ? "6px 8px" : "8px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: isMobile ? "11px" : "13px", flex: 1, justifyContent: "center" }}>
                                        <FaEdit size={isMobile ? 10 : 12} /> {!isMobile && "Edit"}
                                      </button>
                                      <button onClick={() => handleDelete(lec._id)} style={{ background: COLORS.danger, color: COLORS.white, border: "none", padding: isMobile ? "6px 8px" : "8px 12px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: isMobile ? "11px" : "13px", flex: 1, justifyContent: "center" }}>
                                        <FaTrash size={isMobile ? 10 : 12} /> {!isMobile && "Delete"}
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => setSelectedLecture(lec)}
                                      disabled={locked}
                                      style={{ background: locked ? COLORS.darkGray : COLORS.brightGreen, color: COLORS.white, border: "none", padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "6px", cursor: locked ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: isMobile ? "12px" : "14px", width: "100%", justifyContent: "center", transition: "all 0.2s ease" }}
                                    >
                                      {locked ? <FaLock size={isMobile ? 10 : 12} /> : <FaEye size={isMobile ? 10 : 12} />}
                                      {locked ? "Locked" : "View Lecture"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && isAdminUser && (
        <GrantAccessModal
          courseId={courseId}
          courseName={course?.title || "This Course"}
          onClose={() => setShowGrantModal(false)}
          isMobile={isMobile}
          onAccessGranted={fetchData}
        />
      )}

      {/* Lecture View Modal */}
      {selectedLecture && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: isMobile ? "16px" : "20px" }}>
          <div style={{ background: COLORS.white, borderRadius: "12px", width: isMobile ? "100%" : "800px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, color: COLORS.deepPurple }}>{selectedLecture.title}</h3>
              <button onClick={() => setSelectedLecture(null)} style={{ background: "transparent", border: "none", fontSize: "20px", cursor: "pointer" }}><FaTimes /></button>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <span style={{ background: COLORS.lightGray, padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>Lecture #{selectedLecture.lectureNumber}</span>
                  {selectedLecture.duration && <span style={{ background: COLORS.lightGray, padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>⏱️ {selectedLecture.duration} min</span>}
                  <span style={{ background: selectedLecture.isFreePreview ? COLORS.greenLight : "#fee2e2", color: selectedLecture.isFreePreview ? "#065f46" : "#991b1b", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                    {selectedLecture.isFreePreview ? "Free Preview" : "Paid Only"}
                  </span>
                </div>
                <p style={{ color: COLORS.textGray, marginBottom: "20px", lineHeight: "1.6" }}>{selectedLecture.description}</p>
              </div>
              <div>
                <h4 style={{ marginBottom: "12px", color: COLORS.deepPurple }}>📁 Lecture Resource</h4>
                {renderFile(selectedLecture)}
              </div>
              {selectedLecture.notes && (
                <div style={{ marginTop: "20px", padding: "16px", background: COLORS.bgGray, borderRadius: "8px" }}>
                  <h4 style={{ marginBottom: "8px", color: COLORS.deepPurple }}>📝 Notes</h4>
                  <p style={{ color: COLORS.textGray, margin: 0, whiteSpace: "pre-wrap" }}>{selectedLecture.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (isAdminUser || isTeacherUser) && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: isMobile ? "16px" : "20px" }}>
          <div style={{ background: COLORS.white, padding: isMobile ? "20px" : "30px", borderRadius: "12px", width: isMobile ? "100%" : "700px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: `2px solid ${COLORS.lightGray}` }}>
              <h3 style={{ margin: 0, color: COLORS.deepPurple, fontSize: isMobile ? "20px" : "24px", fontWeight: 700 }}>
                {editingId ? "✏️ Edit Lecture" : "➕ Add New Lecture"}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "none", fontSize: "24px", cursor: "pointer", color: COLORS.deepPurple }}><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Lecture Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Enter lecture title" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} placeholder="Enter lecture description" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Subcategory *</label>
                {course?.subCategories && course.subCategories.length > 0 ? (
                  <select name="subCategory" value={formData.subCategory} onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", background: COLORS.white, boxSizing: "border-box", outline: "none" }}>
                    <option value="">Select subcategory...</option>
                    {(typeof course.subCategories === "string" ? JSON.parse(course.subCategories) : course.subCategories).map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} required placeholder="e.g., Photoshop, React" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
                )}
                <input type="text" placeholder="Or enter custom subcategory" value={formData.subCategory} onChange={e => setFormData({ ...formData, subCategory: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px dashed ${COLORS.darkGray}`, fontSize: "13px", marginTop: "8px", background: COLORS.bgGray, boxSizing: "border-box", outline: "none" }} />
                {formData.subCategory && <div style={{ marginTop: "8px", padding: "8px 12px", background: COLORS.purpleLight, borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: COLORS.deepPurple, fontWeight: 600 }}><FaTag size={12} /> Selected: {formData.subCategory}</div>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Lecture Number *</label>
                  <input type="number" name="lectureNumber" value={formData.lectureNumber} onChange={handleChange} required min="1" placeholder="e.g., 1" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Duration (minutes)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="0" placeholder="e.g., 30" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Lecture Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", background: COLORS.white, boxSizing: "border-box", outline: "none" }}>
                  <option value="video">Video</option>
                  <option value="pdf">PDF Document</option>
                  <option value="document">Word Document</option>
                  <option value="excel">Excel File</option>
                  <option value="ppt">PowerPoint</option>
                  <option value="link">External Link</option>
                </select>
              </div>
              {(formData.type === "video" || formData.type === "link") && (
                <div>
                  <label style={{ display: "block", marginBottom: "6px", color: COLORS.textGray, fontWeight: 600, fontSize: "14px" }}>Video URL {formData.type === "link" && "*"}</label>
                  <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} required={formData.type === "link"} placeholder="https://youtube.com/..." style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
                </div>
              )}
              <div style={{ padding: "16px", background: COLORS.bgGray, borderRadius: "8px", border: `1px dashed ${COLORS.darkGray}` }}>
                <h4 style={{ margin: "0 0 12px", color: COLORS.deepPurple, fontSize: "14px", fontWeight: 600 }}>📎 Upload Files (Optional)</h4>
                {formData.type === "video"    && <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: COLORS.textGray, fontWeight: 500 }}><FaVideo style={{ marginRight: "6px" }} />Video File</label><input type="file" accept="video/*" onChange={e => setVideoFile(e.target.files[0])} style={{ fontSize: "13px" }} /></div>}
                {formData.type === "pdf"      && <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: COLORS.textGray, fontWeight: 500 }}><FaFilePdf style={{ marginRight: "6px" }} />PDF File</label><input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ fontSize: "13px" }} /></div>}
                {formData.type === "document" && <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: COLORS.textGray, fontWeight: 500 }}><FaFileWord style={{ marginRight: "6px" }} />Document (.doc, .docx)</label><input type="file" accept=".doc,.docx" onChange={e => setDocFile(e.target.files[0])} style={{ fontSize: "13px" }} /></div>}
                {formData.type === "excel"    && <div style={{ marginBottom: "12px" }}><label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: COLORS.textGray, fontWeight: 500 }}><FaFileExcel style={{ marginRight: "6px" }} />Excel (.xls, .xlsx)</label><input type="file" accept=".xls,.xlsx" onChange={e => setExcelFile(e.target.files[0])} style={{ fontSize: "13px" }} /></div>}
                {formData.type === "ppt"      && <div><label style={{ display: "block", marginBottom: "4px", fontSize: "13px", color: COLORS.textGray, fontWeight: 500 }}><FaFilePowerpoint style={{ marginRight: "6px" }} />PowerPoint (.ppt, .pptx)</label><input type="file" accept=".ppt,.pptx" onChange={e => setPptFile(e.target.files[0])} style={{ fontSize: "13px" }} /></div>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", padding: "16px", background: COLORS.yellowLight, borderRadius: "8px", border: "1px solid rgba(166,138,70,0.3)" }}>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: COLORS.textGray }}>
                    <input type="checkbox" name="isFreePreview" checked={formData.isFreePreview} onChange={handleChange} style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: COLORS.brightGreen }} />
                    {formData.isFreePreview
                      ? <span style={{ color: "#065f46" }}><FaUnlock style={{ marginRight: "4px" }} />Free Preview</span>
                      : <span style={{ color: "#92400e" }}><FaLock  style={{ marginRight: "4px" }} />Paid Only</span>}
                  </label>
                  <div style={{ fontSize: "12px", color: COLORS.darkGray, marginTop: "4px", marginLeft: "26px" }}>{formData.isFreePreview ? "Anyone can view" : "Paid students only"}</div>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "14px", fontWeight: 600, color: COLORS.textGray }}>Price Required (₹)</label>
                  <input type="number" name="priceRequired" value={formData.priceRequired} onChange={handleChange} min="0" step="0.01" placeholder="0.00" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${COLORS.darkGray}`, fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "24px", paddingTop: "20px", borderTop: `2px solid ${COLORS.lightGray}` }}>
                <button type="submit" disabled={loading} style={{ flex: 1, background: loading ? COLORS.darkGray : COLORS.formButton, color: COLORS.white, border: "none", padding: "14px", borderRadius: "8px", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 6px rgba(59,130,246,0.3)" }}>
                  {loading ? <><FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Processing...</> : editingId ? "✅ Update Lecture" : "➕ Create Lecture"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: COLORS.cancelButton, color: COLORS.white, border: "none", padding: "14px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: 700 }}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Lectures;