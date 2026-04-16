
// // src/pages/StudentLecturesPage.jsx
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StudentSidebar from "../components/StudentSidebar";
// import {
//   getProgress, trackLectureProgress, getFilteredLectures,
//   canAccessCourse, getCourseById, completePaymentProcess,
//   getEnrollmentStatus, recordLectureAccess,
// } from "../api/api";
// import {
//   FaCheckCircle, FaFilePdf, FaClock, FaPlay, FaFileExcel,
//   FaFileWord, FaLock, FaUnlock, FaArrowRight, FaExclamationTriangle,
//   FaRupeeSign, FaShoppingCart, FaChartLine, FaBook, FaSpinner,
//   FaDownload, FaLink, FaTimes, FaTag, FaGraduationCap, FaList,
//   FaRedo, FaFilePowerpoint, FaShieldAlt, FaCamera, FaEyeSlash,
//   FaHourglassHalf, FaStopwatch, FaInfoCircle,
// } from "react-icons/fa";
// import { getUserId, isAuthenticated } from "../utils/auth";
// import axios from "axios";

// // AFTER
// const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
// const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// // ==========================================================
// // AccessStatusBanner
// // ==========================================================
// const AccessStatusBanner = ({ accessInfo, coursePrice, isMobile }) => {
//   if (!accessInfo) return null;
  
//   const {
//     isExpired,
//     isLimitReached,
//     daysRemaining,
//     lectureLimit,
//     accessedLecturesCount,
//     lecturesRemaining,
//     hasAccess,
//     endDate,
//   } = accessInfo;

//   if (coursePrice === 0) {
//     return (
//       <div style={{
//         background: "#d1fae5",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #10b981",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaUnlock style={{ color: "#059669", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#065f46" }}>Free Course</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#065f46" }}>
//             All lectures are available for free!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!hasAccess && !isExpired && !isLimitReached) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaLock style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Purchase Required</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             This course costs ₹{coursePrice}. Purchase to unlock all lectures.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isExpired) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaHourglassHalf style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Access Expired</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             Your access expired on {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}.
//             Please contact admin to renew.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLimitReached) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaStopwatch style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Lecture Limit Reached</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             You've reached your limit of {lectureLimit} lectures.
//             Contact admin to extend your access.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       background: daysRemaining !== null && daysRemaining <= 7 ? "#fed7aa" : "#dbeafe",
//       padding: isMobile ? "10px 14px" : "12px 16px",
//       borderRadius: "10px",
//       marginBottom: "16px",
//       borderLeft: `4px solid ${daysRemaining !== null && daysRemaining <= 7 ? "#f97316" : "#3b82f6"}`,
//     }}>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
//         {daysRemaining !== null && daysRemaining > 0 && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaClock style={{ color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Time Remaining</div>
//               <div style={{ fontWeight: 700, color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }}>
//                 {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {lectureLimit !== null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaBook style={{ color: "#3b82f6" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Lectures Used</div>
//               <div style={{ fontWeight: 700, color: "#3b82f6" }}>
//                 {accessedLecturesCount || 0} / {lectureLimit}
//                 {lecturesRemaining !== null && lecturesRemaining > 0 && (
//                   <span style={{ fontSize: "11px", marginLeft: "4px", color: "#059669" }}>
//                     ({lecturesRemaining} left)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
        
//         {endDate && daysRemaining === null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaInfoCircle style={{ color: "#059669" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Lifetime Access</div>
//               <div style={{ fontWeight: 700, color: "#059669" }}>No Expiry</div>
//             </div>
//           </div>
//         )}
        
//         {lectureLimit === null && daysRemaining === null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaUnlock style={{ color: "#059669" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Full Access</div>
//               <div style={{ fontWeight: 700, color: "#059669" }}>Lifetime Unlimited</div>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {endDate && daysRemaining !== null && daysRemaining > 0 && (
//         <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
//           Expires: {new Date(endDate).toLocaleDateString()}
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================================
// // useAntiCapture
// // ==========================================================
// const useAntiCapture = (enabled = true) => {
//   const [blocked, setBlocked] = useState(false);
//   const overlayRef = useRef(null);

//   useEffect(() => {
//     if (!enabled) return;

//     const style = document.createElement("style");
//     style.id = "anti-capture-style";
//     style.innerHTML = `
//       .secure-content {
//         -webkit-user-select: none;
//         -moz-user-select: none;
//         user-select: none;
//       }
//       @media print {
//         .secure-content, .secure-video-wrap, .secure-pdf-wrap, .lecture-content-panel {
//           display: none !important;
//           visibility: hidden !important;
//         }
//         body::before {
//           content: "⛔ This content is protected. Printing is not allowed.";
//           display: block;
//           font-size: 24px;
//           text-align: center;
//           padding: 60px;
//           color: #dc2626;
//           background: #fff;
//         }
//       }
//       .secure-content * {
//         -webkit-user-select: none !important;
//         user-select: none !important;
//         -webkit-touch-callout: none !important;
//       }
//       #capture-blocker {
//         display: none;
//         position: fixed;
//         inset: 0;
//         background: rgba(0, 0, 0, 0.95);
//         z-index: 99999;
//         align-items: center;
//         justify-content: center;
//         flex-direction: column;
//         gap: 16px;
//       }
//       #capture-blocker.show {
//         display: flex;
//       }
//       @keyframes spin {
//         to { transform: rotate(360deg); }
//       }
//       .lec-card:hover {
//         box-shadow: 0 3px 10px rgba(61,26,91,0.1);
//         transform: translateY(-1px);
//       }
//       .pay-btn:hover:not(:disabled) {
//         border-color: #3D1A5B !important;
//         transform: translateY(-2px);
//         box-shadow: 0 4px 10px rgba(61,26,91,0.1);
//       }
//       video {
//         pointer-events: auto;
//       }
//       video::-webkit-media-controls-download-button {
//         display: none !important;
//       }
//     `;
//     document.head.appendChild(style);

//     const overlay = document.createElement("div");
//     overlay.id = "capture-blocker";
//     overlay.innerHTML = `
//       <div style="font-size:64px; color:#ef4444;">🚫</div>
//       <div style="font-size:20px; font-weight:700; color:#fff;">Screen Capture Blocked</div>
//       <div style="font-size:14px; color:#9ca3af; text-align:center; max-width:340px;">
//         Recording and screenshot of course content is strictly prohibited.
//       </div>
//     `;
//     document.body.appendChild(overlay);
//     overlayRef.current = overlay;

//     const showBlocker = (duration = 2000) => {
//       overlay.classList.add("show");
//       setBlocked(true);
//       setTimeout(() => {
//         overlay.classList.remove("show");
//         setBlocked(false);
//       }, duration);
//     };

//     const handleKeyDown = (e) => {
//       const blocked_combos = [
//         e.key === "PrintScreen",
//         e.metaKey && e.shiftKey && ["3","4","5","6"].includes(e.key),
//         e.metaKey && e.shiftKey && e.key === "s",
//         e.metaKey && e.key === "g",
//         e.metaKey && e.altKey && e.key === "r",
//         e.key === "F12",
//         e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C"].includes(e.key),
//         e.ctrlKey && (e.key === "u" || e.key === "U"),
//         e.ctrlKey && (e.key === "s" || e.key === "S"),
//       ];

//       if (blocked_combos.some(Boolean)) {
//         e.preventDefault();
//         e.stopPropagation();
//         showBlocker(1500);
//         return false;
//       }
//     };

//     const patchScreenCapture = () => {
//       if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
//         navigator.mediaDevices.getDisplayMedia = async (...args) => {
//           showBlocker(3000);
//           throw new DOMException("Screen capture is not allowed.", "NotAllowedError");
//         };
//       }
//     };
//     patchScreenCapture();

//     document.addEventListener("keydown", handleKeyDown, true);
//     document.addEventListener("contextmenu", (e) => {
//       if (e.target.closest(".secure-content")) e.preventDefault();
//     });

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown, true);
//       const s = document.getElementById("anti-capture-style");
//       if (s) s.remove();
//       if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
//     };
//   }, [enabled]);

//   return { blocked };
// };

// // ==========================================================
// // useSignedUrl
// // ==========================================================
// const buildFallbackUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http") || path.startsWith("blob")) return path;
//   const clean = path.startsWith("/") ? path : `/${path}`;
//   return `${BASE_URL}${clean}`;
// };

// const useSignedUrl = (lectureId, type = "video", enabled = true) => {
//   const [signedUrl, setSignedUrl] = useState(null);
//   const [urlLoading, setUrlLoading] = useState(false);
//   const [urlError, setUrlError] = useState(null);
//   const [useFallback, setUseFallback] = useState(false);

//   const fetchUrl = useCallback(async () => {
//     if (!lectureId || !enabled) return;
//     setUrlLoading(true); setUrlError(null); setUseFallback(false);
//     try {
//       const endpoint = type === "pdf"
//         ? `${BASE_URL}/api/lectures/stream/pdf/${lectureId}`
//         : `${BASE_URL}/api/lectures/stream/video/${lectureId}`;
//       const res = await axios.get(endpoint, { headers: getAuthHeader(), timeout: 10000 });
//       if (res.data?.success && res.data?.url) {
//         setSignedUrl(res.data.url);
//       } else if (res.data?.url) {
//         setSignedUrl(res.data.url);
//       } else {
//         setUseFallback(true);
//       }
//     } catch (err) {
//       const status = err?.response?.status;
//       if (status === 401 || status === 403) {
//         setUrlError(err?.response?.data?.message || "Access denied. Please enroll first.");
//       } else {
//         setUseFallback(true);
//       }
//     } finally { setUrlLoading(false); }
//   }, [lectureId, type, enabled]);

//   useEffect(() => {
//     setSignedUrl(null); setUrlError(null); setUseFallback(false);
//     fetchUrl();
//     const t = setInterval(fetchUrl, 90000);
//     return () => clearInterval(t);
//   }, [fetchUrl]);

//   return { signedUrl, urlLoading, urlError, useFallback, refetch: fetchUrl };
// };

// // ==========================================================
// // CanvasVideoPlayer
// // ==========================================================
// const CanvasVideoPlayer = ({ src, onTimeUpdate, onLoadedMetadata, onError, userId, lectureId, onLectureComplete }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const wrapRef = useRef(null);
//   const rafRef = useRef(null);
//   const seekRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [currentT, setCurrentT] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFS, setIsFS] = useState(false);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [overlayType, setOverlayType] = useState("focus");
//   const [buffered, setBuffered] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const controlTimer = useRef(null);
//   const [completedNotified, setCompletedNotified] = useState(false);

//   const drawFrame = useCallback(() => {
//     const v = videoRef.current;
//     const c = canvasRef.current;
//     if (!v || !c) return;
    
//     const ctx = c.getContext("2d");
//     if (!ctx) return;

//     const vw = v.videoWidth || 1280;
//     const vh = v.videoHeight || 720;
//     if (c.width !== vw) c.width = vw;
//     if (c.height !== vh) c.height = vh;

//     ctx.drawImage(v, 0, 0, vw, vh);

//     const fs = Math.max(14, vw * 0.018);

//     ctx.save();
//     ctx.globalAlpha = 0.75;
//     ctx.fillStyle = "rgba(0,0,0,0.55)";
//     const pillW = fs * 12;
//     ctx.fillRect(12, vh - fs * 2.5, pillW, fs * 1.8);
//     ctx.globalAlpha = 0.95;
//     ctx.fillStyle = "#ffffff";
//     ctx.font = `bold ${fs}px monospace`;
//     ctx.fillText("itechskill.com", 18, vh - fs);
//     ctx.restore();

//     rafRef.current = v.paused ? null : requestAnimationFrame(drawFrame);
//   }, []);

//   const startDraw = useCallback(() => {
//     cancelAnimationFrame(rafRef.current);
//     rafRef.current = requestAnimationFrame(drawFrame);
//   }, [drawFrame]);

//   const stopDraw = useCallback(() => {
//     cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//   }, []);

//   const checkCompletion = useCallback((currentTime, videoDuration) => {
//     if (completedNotified) return;
//     if (videoDuration > 0 && currentTime / videoDuration >= 0.9) {
//       setCompletedNotified(true);
//       if (onLectureComplete) onLectureComplete();
//     }
//   }, [completedNotified, onLectureComplete]);

//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const onPlay = () => { setIsPlaying(true); startDraw(); };
//     const onPause = () => {
//       setIsPlaying(false);
//       stopDraw();
//       requestAnimationFrame(() => drawFrame());
//     };
//     const onEnded = () => { setIsPlaying(false); stopDraw(); };
//     const onMeta = (e) => {
//       setDuration(v.duration);
//       const c = canvasRef.current;
//       if (c) {
//         c.width = v.videoWidth || 1280;
//         c.height = v.videoHeight || 720;
//       }
//       requestAnimationFrame(() => drawFrame());
//       onLoadedMetadata?.(e);
//     };
//     const onTime = (e) => {
//       setCurrentT(v.currentTime);
//       if (v.buffered.length) setBuffered((v.buffered.end(v.buffered.length-1)/v.duration)*100);
//       onTimeUpdate?.(e);
//       checkCompletion(v.currentTime, v.duration);
//     };
//     const onVolChg = () => { setIsMuted(v.muted); setVolume(v.volume); };
//     const noPiP = () => { if (document.pictureInPictureElement) document.exitPictureInPicture(); };
//     const noCtx = (e) => e.preventDefault();

//     v.addEventListener("play", onPlay);
//     v.addEventListener("pause", onPause);
//     v.addEventListener("ended", onEnded);
//     v.addEventListener("loadedmetadata", onMeta);
//     v.addEventListener("timeupdate", onTime);
//     v.addEventListener("volumechange", onVolChg);
//     v.addEventListener("enterpictureinpicture", noPiP);
//     v.addEventListener("contextmenu", noCtx);

//     return () => {
//       stopDraw();
//       v.removeEventListener("play", onPlay);
//       v.removeEventListener("pause", onPause);
//       v.removeEventListener("ended", onEnded);
//       v.removeEventListener("loadedmetadata", onMeta);
//       v.removeEventListener("timeupdate", onTime);
//       v.removeEventListener("volumechange", onVolChg);
//       v.removeEventListener("enterpictureinpicture", noPiP);
//       v.removeEventListener("contextmenu", noCtx);
//     };
//   }, [startDraw, stopDraw, drawFrame, onTimeUpdate, onLoadedMetadata, checkCompletion]);

//   useEffect(() => {
//     const paintBlack = () => {
//       const c = canvasRef.current;
//       if (!c) return;
//       const ctx = c.getContext("2d");
//       ctx.fillStyle = "#000";
//       ctx.fillRect(0, 0, c.width, c.height);
//       ctx.fillStyle = "#ef4444";
//       ctx.font = "20px sans-serif";
//       ctx.fillText("Content Protected", c.width/2 - 100, c.height/2);
//     };

//     const triggerBlackout = (type = "focus") => {
//       const v = videoRef.current;
//       if (v && !v.paused) v.pause();
//       stopDraw();
//       paintBlack();
//       setOverlayType(type);
//       setShowOverlay(true);
//     };
//     const restore = () => setShowOverlay(false);

//     const onVisible = () => { if (document.hidden) triggerBlackout("focus"); };
//     const onBlur = () => triggerBlackout("focus");
//     const onFocus = () => restore();

//     document.addEventListener("visibilitychange", onVisible);
//     window.addEventListener("blur", onBlur);
//     window.addEventListener("focus", onFocus);

//     return () => {
//       document.removeEventListener("visibilitychange", onVisible);
//       window.removeEventListener("blur", onBlur);
//       window.removeEventListener("focus", onFocus);
//     };
//   }, [stopDraw]);

//   const toggleFullscreen = () => {
//     const wrap = wrapRef.current;
//     if (!wrap) return;
//     if (!document.fullscreenElement) {
//       const requestFullscreen = wrap.requestFullscreen || 
//                               wrap.webkitRequestFullscreen || 
//                               wrap.mozRequestFullScreen;
//       if (requestFullscreen) requestFullscreen.call(wrap);
//     } else {
//       document.exitFullscreen?.();
//     }
//   };

//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v || showOverlay) return;
//     v.paused ? v.play() : v.pause();
//     resetControlTimer();
//   };

//   const resetControlTimer = () => {
//     setShowControls(true);
//     clearTimeout(controlTimer.current);
//     if (isFS) {
//       controlTimer.current = setTimeout(() => setShowControls(false), 3000);
//     }
//   };

//   const handleSeekClick = (e) => {
//     const v = videoRef.current;
//     if (!v || !duration) return;
//     const bar = seekRef.current;
//     if (!bar) return;
//     const rect = bar.getBoundingClientRect();
//     const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
//     v.currentTime = pct * duration;
//   };

//   const formatTime = (s) => {
//     if (!s || isNaN(s)) return "0:00";
//     const m = Math.floor(s / 60), sec = Math.floor(s % 60);
//     return `${m}:${sec.toString().padStart(2, "0")}`;
//   };

//   const pct = duration ? (currentT / duration) * 100 : 0;

//   return (
//     <div
//       ref={wrapRef}
//       className="secure-video-wrap"
//       style={{ 
//         position: "relative", 
//         background: "#000", 
//         borderRadius: "12px", 
//         overflow: "hidden",
//         width: "100%",
//         aspectRatio: "16/9",
//       }}
//       onMouseMove={resetControlTimer}
//     >
//       <video
//         ref={videoRef}
//         src={src}
//         style={{
//           position: "fixed",
//           left: "-9999px",
//           top: "-9999px",
//           width: "1px",
//           height: "1px",
//           opacity: 0,
//           pointerEvents: "none",
//         }}
//         disablePictureInPicture
//         playsInline
//         preload="auto"
//         onError={onError}
//       />

//       <canvas
//         ref={canvasRef}
//         onClick={togglePlay}
//         onDoubleClick={toggleFullscreen}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//           background: "#000",
//           cursor: "pointer",
//           objectFit: "contain"
//         }}
//       />

//       {showOverlay && (
//         <div style={{
//           position: "absolute", inset: 0, background: "#000",
//           display: "flex", flexDirection: "column",
//           alignItems: "center", justifyContent: "center",
//           gap: "16px", zIndex: 30,
//         }}>
//           <div style={{
//             width: 80, height: 80, borderRadius: "50%",
//             background: "linear-gradient(135deg,#3D1A5B,#5E427B)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <FaShieldAlt style={{ fontSize: "36px", color: "#fff" }} />
//           </div>
//           <p style={{ color: "#fff", fontWeight: 800, fontSize: "20px", margin: 0 }}>
//             Content Protected
//           </p>
//           <button
//             onClick={() => { setShowOverlay(false); }}
//             style={{
//               background: "linear-gradient(135deg,#3D1A5B,#5E427B)",
//               color: "#fff", border: "none", padding: "11px 28px",
//               borderRadius: "9px", cursor: "pointer", fontWeight: 700,
//             }}
//           >
//             Resume Video
//           </button>
//         </div>
//       )}

//       <div
//         style={{
//           position: "absolute", bottom: 0, left: 0, right: 0,
//           background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
//           padding: "32px 14px 12px",
//           zIndex: 20,
//           opacity: showControls ? 1 : 0,
//           transition: "opacity 0.3s",
//         }}
//       >
//         <div
//           ref={seekRef}
//           onClick={handleSeekClick}
//           style={{
//             height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px",
//             cursor: "pointer", marginBottom: "12px", position: "relative",
//           }}
//         >
//           <div style={{
//             position: "absolute", left: 0, top: 0, height: "100%",
//             width: `${buffered}%`, background: "rgba(255,255,255,0.3)", borderRadius: "2px",
//           }} />
//           <div style={{
//             position: "absolute", left: 0, top: 0, height: "100%",
//             width: `${pct}%`, background: "linear-gradient(90deg,#3D1A5B,#A68A46)", borderRadius: "2px",
//           }} />
//           <div style={{
//             position: "absolute", top: "50%", left: `${pct}%`,
//             transform: "translate(-50%,-50%)",
//             width: "12px", height: "12px", background: "#fff", borderRadius: "50%",
//             boxShadow: "0 0 5px rgba(0,0,0,0.6)", pointerEvents: "none",
//           }} />
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <button onClick={togglePlay} style={ctrlBtn}>
//             {isPlaying ? "⏸" : "▶"}
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.currentTime = Math.max(0, v.currentTime - 5); }} style={ctrlBtn}>
//             ⏪
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.currentTime = Math.min(v.duration, v.currentTime + 5); }} style={ctrlBtn}>
//             ⏩
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.muted = !v.muted; }} style={ctrlBtn}>
//             {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
//           </button>

//           <input
//             type="range" min="0" max="1" step="0.05"
//             value={isMuted ? 0 : volume}
//             onChange={(e) => { const v = videoRef.current; if(v) { v.volume = parseFloat(e.target.value); v.muted = false; } }}
//             style={{ width: "65px", accentColor: "#A68A46", cursor: "pointer" }}
//           />

//           <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontFamily: "monospace" }}>
//             {formatTime(currentT)} / {formatTime(duration)}
//           </span>

//           <div style={{ flex: 1 }} />

//           <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "3px" }}>
//             <FaShieldAlt size={8} /> Protected
//           </span>

//           <button onClick={toggleFullscreen} style={ctrlBtn}>
//             {isFS ? "⊡" : "⛶"}
//           </button>
//         </div>
//       </div>

//       <div style={{
//         position: "absolute", top: "10px", left: "10px",
//         background: "rgba(61,26,91,0.8)", color: "#fff",
//         padding: "3px 9px", borderRadius: "4px", fontSize: "10px",
//         pointerEvents: "none", display: "flex", alignItems: "center", gap: "4px", zIndex: 21,
//       }}>
//         <FaShieldAlt size={8} /> itechskill.com
//       </div>
//     </div>
//   );
// };

// const ctrlBtn = {
//   background: "none", border: "none", color: "#fff",
//   cursor: "pointer", fontSize: "18px", padding: "2px 5px",
//   display: "flex", alignItems: "center", lineHeight: 1,
//   transition: "opacity 0.2s",
// };

// // ==========================================================
// // SecureVideoPlayer
// // ==========================================================
// const SecureVideoPlayer = ({ lecture, onTimeUpdate, onLoadedMetadata, onLectureComplete }) => {
//   const rawVideoPath = lecture.videoPath || lecture.video || lecture.videoUrl || null;
  
//   // ADD THIS TEMPORARILY
//   console.log("🎬 SecureVideoPlayer:", {
//     lectureId: lecture._id,
//     rawVideoPath,
//     videoPath: lecture.videoPath,
//     videoUrl: lecture.videoUrl,
//   });
//   const needsSigning = !!rawVideoPath && !rawVideoPath.startsWith("http");
//   const { signedUrl, urlLoading, urlError, useFallback, refetch } =
//     useSignedUrl(lecture._id, "video", needsSigning);

//   const src = signedUrl
//     ? signedUrl
//     : useFallback
//       ? buildFallbackUrl(rawVideoPath)
//       : rawVideoPath?.startsWith("http")
//         ? rawVideoPath
//         : null;

//   if (!rawVideoPath && !lecture.videoUrl) return null;

//   if (urlLoading) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//       minHeight: "240px", background: "#111", borderRadius: "12px" }}>
//       <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "#3D1A5B" }} />
//       <span style={{ marginTop: "12px", fontSize: "13px", color: "#9ca3af" }}>Loading secure video...</span>
//     </div>
//   );

//   if (urlError) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//       minHeight: "200px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", padding: "24px" }}>
//       <FaLock style={{ fontSize: "28px", color: "#ef4444", marginBottom: "10px" }} />
//       <p style={{ color: "#991b1b", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>⚠️ {urlError}</p>
//       <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: "5px",
//         background: "#3D1A5B", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px",
//         cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
//         <FaRedo size={11} /> Retry
//       </button>
//     </div>
//   );

//   if (!src) return null;

//   return (
//     <CanvasVideoPlayer
//       src={src}
//       userId={getUserId()}
//       lectureId={lecture._id}
//       onTimeUpdate={onTimeUpdate}
//       onLoadedMetadata={onLoadedMetadata}
//       onLectureComplete={onLectureComplete}
//       onError={() => { console.warn("Video error, retrying..."); refetch(); }}
//     />
//   );
// };

// // ==========================================================
// // SecurePDFLink
// // ==========================================================
// const SecurePDFLink = ({ lecture }) => {
//   const rawPdfPath = lecture.pdfPath || lecture.pdf || null;
//   const needsSigning = !!rawPdfPath && !rawPdfPath.startsWith("http");
//   const { signedUrl, urlLoading, urlError, useFallback, refetch } =
//     useSignedUrl(lecture._id, "pdf", needsSigning);

//   const url = signedUrl
//     ? signedUrl
//     : useFallback
//       ? buildFallbackUrl(rawPdfPath)
//       : rawPdfPath?.startsWith("http")
//         ? rawPdfPath
//         : null;

//   if (urlLoading) return (
//     <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6b7280", padding: "12px 14px", background: "#f9fafb", borderRadius: "8px" }}>
//       <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading PDF...
//     </div>
//   );
//   if (urlError) return (
//     <div style={{ padding: "12px 14px", color: "#991b1b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", borderRadius: "8px" }}>
//       ⚠️ {urlError}
//       <button onClick={refetch} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline", fontSize: "12px" }}>Retry</button>
//     </div>
//   );
//   if (!url) return null;

//   return (
//     <a href={url} target="_blank" rel="noopener noreferrer"
//       onContextMenu={e => e.preventDefault()}
//       style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", textDecoration: "none", color: "#991b1b" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <FaFilePdf style={{ fontSize: "18px" }} />
//         <div>
//           <div style={{ fontWeight: "600" }}>Lecture Notes (PDF)</div>
//           <div style={{ fontSize: "11px", color: "#dc2626" }}>Secure link — expires in 5 min</div>
//         </div>
//       </div>
//       <FaArrowRight />
//     </a>
//   );
// };

// // ==========================================================
// // MAIN COMPONENT
// // ==========================================================
// const StudentLecturesPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [lectures, setLectures] = useState([]);
//   const [completedLectures, setCompletedLectures] = useState([]);
//   const [lectureProgress, setLectureProgress] = useState({});
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentVideoTime, setCurrentVideoTime] = useState(0);
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [courseAccess, setCourseAccess] = useState({ 
//     hasFullAccess: false, 
//     isPaid: false, 
//     coursePrice: 0, 
//     hasAccess: false,
//     isExpired: false,
//     isLimitReached: false,
//     daysRemaining: null,
//     lectureLimit: null,
//     accessedLecturesCount: 0,
//     lecturesRemaining: null,
//     endDate: null,
//   });
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [isLectureListOpen, setIsLectureListOpen] = useState(false);
//   const [courseData, setCourseData] = useState(null);
//   const [lecturesBySubcategory, setLecturesBySubcategory] = useState({});
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
//   const [recordingAccess, setRecordingAccess] = useState(false);
//   const studentId = getUserId();

//   useAntiCapture(false);

//   useEffect(() => {
//     const fn = () => {
//       const m = window.innerWidth <= 768;
//       setIsMobile(m);
//       if (!m) {
//         setIsMobileSidebarOpen(false);
//         setIsLectureListOpen(false);
//       }
//     };
//     window.addEventListener("resize", fn);
//     return () => window.removeEventListener("resize", fn);
//   }, []);

//   // ==========================================================
//   // MAIN LOAD DATA FUNCTION - NO FREE PREVIEW
//   // ==========================================================
//  const loadData = async () => {
//   try {
//     setLoading(true);

//     const courseRes = await getCourseById(courseId);
//     setCourseData(courseRes?.course || courseRes);

//     // Trust backend — it already handles all access logic
//     const fr = await getFilteredLectures(courseId);
//     const allLectures = fr.lectures || [];

//     const coursePrice = fr.coursePrice ?? courseRes?.course?.price ?? courseRes?.price ?? 0;

//     // Use ONLY backend-provided access flags — don't re-derive them
//     const hasAccess       = fr.hasAccess || fr.hasFullAccess || coursePrice === 0;
//     const isExpired       = fr.isExpired       || false;
//     const isLimitReached  = fr.isLimitReached  || false;
//     const lectureLimit    = fr.lectureLimit    ?? null;
//     const accessedCount   = fr.accessedLecturesCount || 0;

//     // ✅ Use lectures as-is from backend — it already filtered correctly
//     const filteredLectures = allLectures;

//     setLectures(filteredLectures);

//     const g = {};
//     filteredLectures.forEach(l => {
//       const s = l.subCategory || "General";
//       if (!g[s]) g[s] = [];
//       g[s].push(l);
//     });
//     setLecturesBySubcategory(g);

//     setCourseAccess({
//       hasFullAccess:         hasAccess && !isExpired && !isLimitReached,
//       isPaid:                fr.isPaidStudent || false,
//       coursePrice,
//       hasAccess,
//       isExpired,
//       isLimitReached,
//       daysRemaining:         fr.daysRemaining         ?? null,
//       lectureLimit,
//       accessedLecturesCount: accessedCount,
//       lecturesRemaining:     fr.lecturesRemaining      ?? null,
//       endDate:               fr.endDate               || null,
//       grantedByAdmin:        fr.grantedByAdmin        || false,
//     });

//     const pr = await getProgress(studentId, courseId);
//     const comp = pr?.completedLectures || pr?.progress?.completedLectures || [];
//     const ids = Array.isArray(comp) ? comp.map(l => l._id || l) : [];
//     setCompletedLectures(ids);

//     const pd = {};
//     ids.forEach(id => (pd[id] = 100));
//     setLectureProgress(pd);

//     if (filteredLectures.length > 0) {
//       setSelectedLecture(filteredLectures[0]);
//     } else {
//       setSelectedLecture(null);
//     }

//   } catch (e) {
//     console.error("Load error:", e);
//     alert(`Failed to load: ${e.message}`);
//   } finally {
//     setLoading(false);
//   }
// };
//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate("/login");
//       return;
//     }
//     if (studentId && courseId) {
//       loadData();
//     }
//   }, [courseId, studentId, navigate]);

//   // ==========================================================
//   // IS LOCKED FUNCTION - NO FREE PREVIEW
//   // ==========================================================
//  const isLocked = (lecture) => {
//   if (!lecture) return true;
//   if (courseAccess.coursePrice === 0) return false;           // free = never locked
//   if (courseAccess.grantedByAdmin) return false;             // admin grant = open
//   if (courseAccess.hasFullAccess) return false;              // full access = open
//   return true;                                               // everything else = locked
// };

//   // ==========================================================
//   // HANDLE SELECT LECTURE - NO FREE PREVIEW
//   // ==========================================================
//   const handleSelectLecture = async (lecture) => {
//     if (isLocked(lecture)) {
//       setShowPaymentModal(true);
//       return;
//     }
    
//     // Record access for paid lectures
//     if (courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess) {
//       const alreadyAccessed = completedLectures.includes(lecture._id) || lectureProgress[lecture._id] >= 90;
      
//       if (!alreadyAccessed && courseAccess.lectureLimit !== null) {
//         if (courseAccess.accessedLecturesCount >= courseAccess.lectureLimit) {
//           alert(`You have reached your lecture limit (${courseAccess.lectureLimit} lectures).`);
//           return;
//         }
        
//         try {
//           setRecordingAccess(true);
//           const result = await recordLectureAccess(studentId, courseId, lecture._id);
//           console.log("✅ Lecture access recorded:", result);
          
//           setCourseAccess(prev => ({
//             ...prev,
//             accessedLecturesCount: result.accessedLecturesCount,
//             lecturesRemaining: result.lecturesRemaining,
//             isLimitReached: result.isLimitReached || false,
//           }));
          
//           await loadData();
          
//         } catch (err) {
//           console.error("Failed to record access:", err);
//           if (err.response?.data?.isLimitReached) {
//             alert("Lecture limit reached!");
//             return;
//           }
//         } finally {
//           setRecordingAccess(false);
//         }
//       }
//     }
    
//     setSelectedLecture(lecture);
//     if (isMobile) setIsLectureListOpen(false);
//   };

//   const handleLectureComplete = async () => {
//     if (!selectedLecture) return;
//     if (completedLectures.includes(selectedLecture._id)) return;
    
//     try {
//       await trackLectureProgress(studentId, courseId, selectedLecture._id);
//       setCompletedLectures(prev => [...new Set([...prev, selectedLecture._id])]);
//       setLectureProgress(prev => ({ ...prev, [selectedLecture._id]: 100 }));
//     } catch (err) {
//       console.error("Failed to mark lecture complete:", err);
//     }
//   };

//   const formatTime = s => {
//     if (!s || isNaN(s)) return "0:00";
//     return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
//   };

//   const getProgressPercent = id => completedLectures.includes(id) ? 100 : lectureProgress[id] || 0;

//   const handlePayment = async method => {
//     try {
//       setProcessingPayment(true);
//       const result = await completePaymentProcess(courseId, method, courseAccess.coursePrice);
//       if (result.success) {
//         alert("Payment successful! Course unlocked.");
//         setShowPaymentMethodsModal(false);
//         setShowPaymentModal(false);
//         await loadData();
//       } else {
//         alert(result.message || "Payment failed.");
//       }
//     } catch (e) {
//       alert(e.response?.data?.message || "Payment error.");
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   if (loading) return (
//     <div style={styles.page}>
//       <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
//       <div style={{ ...styles.loadWrap, marginLeft: isMobile ? 0 : "280px" }}>
//         <div style={styles.spin} />
        
       
//       </div>
//     </div>
//   );

//   return (
//     <div style={styles.page}>
//       <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

//       {isMobile && (
//         <button style={styles.toggle} onClick={() => setIsLectureListOpen(v => !v)}>
//           {isLectureListOpen ? <FaTimes /> : <FaList />}
//         </button>
//       )}

//       {isMobile && isLectureListOpen && (
//         <div style={styles.backdrop} onClick={() => setIsLectureListOpen(false)} />
//       )}

//       <div style={{ ...styles.content, marginLeft: isMobile ? 0 : "280px" }}>
//         <div style={{ ...styles.main, padding: isMobile ? "80px 12px 12px" : "20px" }}>

//           {/* LEFT PANEL */}
//           <div style={{
//             ...styles.left,
//             ...(isMobile ? {
//               ...styles.leftM,
//               ...(isLectureListOpen ? styles.open : styles.closed)
//             } : {})
//           }}>
//             <div style={styles.cHead}>
//               <h1 style={styles.cTitle}>
//                 <FaGraduationCap /> {courseData?.title || "Course"}
//               </h1>
//               <div style={styles.cMeta}>
//                 <span style={styles.badge1}>
//                   {courseAccess.coursePrice === 0
//                     ? <><FaUnlock size={10} /> FREE</>
//                     : <><FaRupeeSign size={10} /> ₹{courseAccess.coursePrice}</>
//                   }
//                 </span>
//                 <span>{lectures.length} lectures</span>
//                 <span style={{ color: "#10b981", fontWeight: 600 }}>
//                   {completedLectures.length} done ✓
//                 </span>
//               </div>
//             </div>

//             {courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess && !courseAccess.isExpired && (
//               <div style={styles.payBar}>
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
//                     <FaExclamationTriangle style={{ color: "#92400e" }} />
//                     <strong style={{ color: "#92400e" }}>Purchase Required</strong>
//                   </div>
//                   <div style={{ fontSize: "12px", color: "#92400e" }}>Unlock all lectures</div>
//                 </div>
//                 <button onClick={() => setShowPaymentModal(true)} style={styles.buyBtn}>
//                   <FaShoppingCart size={11} /> Purchase
//                 </button>
//               </div>
//             )}

//             {lectures.length > 0 && (
//               <div style={{ marginBottom: "14px", padding: "10px 12px", background: "#f9fafb", borderRadius: "9px", border: "1px solid #e5e7eb" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginBottom: "5px" }}>
//                   <span>Overall Progress</span>
//                   <span style={{ fontWeight: 700, color: "#3D1A5B" }}>
//                     {Math.round((completedLectures.length / lectures.length) * 100)}%
//                   </span>
//                 </div>
//                 <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
//                   <div style={{
//                     height: "100%",
//                     width: `${(completedLectures.length / lectures.length) * 100}%`,
//                     background: "linear-gradient(90deg,#3D1A5B,#5E427B)",
//                     transition: "width 0.5s ease"
//                   }} />
//                 </div>
//               </div>
//             )}

//             {Object.keys(lecturesBySubcategory).length > 0
//               ? Object.keys(lecturesBySubcategory).map(sub => (
//                 <div key={sub} style={{ marginBottom: "18px" }}>
//                   <div style={styles.subH}>
//                     <FaTag size={10} />
//                     <span>{sub}</span>
//                     <span style={styles.subCnt}>{lecturesBySubcategory[sub].length}</span>
//                   </div>
//                   {lecturesBySubcategory[sub].map(lec => {
//                     const locked = isLocked(lec);
//                     const done = completedLectures.includes(lec._id);
//                     const prog = getProgressPercent(lec._id);
//                     const sel = selectedLecture?._id === lec._id;

//                     return (
//                       <div key={lec._id}
//                         className="lec-card"
//                         onClick={() => handleSelectLecture(lec)}
//                         style={{
//                           ...styles.lecCard,
//                           ...(locked ? styles.lockedC : {}),
//                           ...(sel ? styles.selC : {})
//                         }}>
//                         {!locked && (
//                           <div style={{
//                             ...styles.strip,
//                             width: `${prog}%`,
//                             background: done ? "#10b981" : "#3D1A5B"
//                           }} />
//                         )}
//                         <div style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
//                           <div style={{
//                             ...styles.num,
//                             background: locked ? "#f3f4f6" : done ? "#d1fae5" : "rgba(61,26,91,0.08)",
//                             color: locked ? "#9ca3af" : done ? "#10b981" : "#3D1A5B"
//                           }}>
//                             {locked ? <FaLock size={11} /> : done ? <FaCheckCircle size={13} /> : lec.lectureNumber}
//                           </div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "2px" }}>
//                               <span style={{ fontSize: "13px", fontWeight: 600, color: locked ? "#9ca3af" : "#111827", lineHeight: 1.4 }}>
//                                 {lec.title}
//                               </span>
//                               {lec.duration && (
//                                 <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, display: "flex", alignItems: "center", gap: "2px" }}>
//                                   <FaClock size={8} />{lec.duration}m
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))
//               : (
//                 <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
//                   <FaBook style={{ fontSize: "36px", marginBottom: "10px", opacity: 0.3 }} />
//                   <p>No lectures available</p>
//                 </div>
//               )
//             }
//           </div>

//           {/* RIGHT PANEL */}
//           <div style={styles.right} className="secure-content">
//             <AccessStatusBanner 
//               accessInfo={courseAccess} 
//               coursePrice={courseAccess.coursePrice}
//               isMobile={isMobile}
//             />

//             {!selectedLecture
//               ? (
//                 <div style={styles.empty}>
//                   <FaPlay style={{ fontSize: "40px", opacity: 0.2, color: "#3D1A5B", marginBottom: "10px" }} />
//                   <p style={{ color: "#9ca3af", fontSize: "15px" }}>Select a lecture to start learning</p>
//                 </div>
//               )
//               : isLocked(selectedLecture)
//                 ? (
//                   <div style={styles.lockedScreen}>
//                     <div style={styles.lkCircle}>
//                       <FaLock style={{ fontSize: "30px", color: "#fff" }} />
//                     </div>
//                     <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>
//                       Lecture Locked
//                     </h3>
//                     <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px", textAlign: "center", lineHeight: 1.7, marginBottom: "18px" }}>
//                       {courseAccess.isExpired 
//                         ? "Your access to this course has expired. Please contact admin to renew."
//                         : courseAccess.isLimitReached
//                           ? `You have reached your lecture limit (${courseAccess.lectureLimit} lectures). Please contact admin to extend.`
//                           : "Purchase this course to unlock all lectures."}
//                     </p>
//                     {!courseAccess.isExpired && !courseAccess.isLimitReached && (
//                       <button onClick={() => setShowPaymentModal(true)} style={styles.unlockBtn}>
//                         <FaShoppingCart /> Unlock for ₹{courseAccess.coursePrice}
//                       </button>
//                     )}
//                   </div>
//                 )
//                 : (
//                   <>
//                     <div style={{ marginBottom: "16px" }}>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
//                         <div style={{ flex: 1 }}>
//                           <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "6px", lineHeight: 1.35 }}>
//                             {selectedLecture.title}
//                           </h2>
//                           <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", fontSize: "12px", color: "#6b7280" }}>
//                             <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//                               <FaClock size={10} /> Lecture {selectedLecture.lectureNumber}
//                             </span>
//                             {selectedLecture.duration && (
//                               <span>Duration: {selectedLecture.duration} min</span>
//                             )}
//                             {selectedLecture.subCategory && (
//                               <span style={styles.subTag}>
//                                 <FaTag size={9} /> {selectedLecture.subCategory}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                         {completedLectures.includes(selectedLecture._id) && (
//                           <span style={styles.doneBadge}>
//                             <FaCheckCircle /> Completed
//                           </span>
//                         )}
//                       </div>

//                       <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "12px" }}>
//                         {selectedLecture.description}
//                       </p>

//                       <div style={styles.progCard}>
//                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
//                           <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
//                             <FaChartLine size={10} /> Progress
//                           </span>
//                           <span style={{ fontSize: "14px", fontWeight: 700, color: completedLectures.includes(selectedLecture._id) ? "#10b981" : "#3D1A5B" }}>
//                             {Math.round(getProgressPercent(selectedLecture._id))}%
//                           </span>
//                         </div>
//                         <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
//                           <div style={{
//                             width: `${getProgressPercent(selectedLecture._id)}%`,
//                             height: "100%",
//                             background: completedLectures.includes(selectedLecture._id) ? "#10b981" : "linear-gradient(90deg,#3D1A5B,#5E427B)",
//                             transition: "width 0.3s ease"
//                           }} />
//                         </div>
//                         {videoDuration > 0 && (
//                           <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
//                             <span>{formatTime(currentVideoTime)}</span>
//                             <span>{formatTime(videoDuration)}</span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
// {(selectedLecture.videoPath || selectedLecture.video || selectedLecture.videoUrl) && (
//                       <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
//                         <SecureVideoPlayer
//                           lecture={selectedLecture}
//                           onTimeUpdate={e => setCurrentVideoTime(e.target.currentTime)}
//                           onLoadedMetadata={e => setVideoDuration(e.target.duration)}
//                           onLectureComplete={handleLectureComplete}
//                         />
//                       </div>
//                     )}

//                     {(selectedLecture.pdfPath || selectedLecture.pdf ||
//                       selectedLecture.excelPath || selectedLecture.documentPath ||
//                       selectedLecture.pptPath || selectedLecture.videoUrl) && (
//                       <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
//                         <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
//                           <FaDownload size={12} /> Lecture Resources
//                           <span style={{ marginLeft: "auto", fontSize: "10px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", fontWeight: 400 }}>
//                             <FaShieldAlt size={8} /> All files protected
//                           </span>
//                         </h3>
//                         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                           {(selectedLecture.pdfPath || selectedLecture.pdf) && <SecurePDFLink lecture={selectedLecture} />}
//                           {selectedLecture.excelPath && (
//                             <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534" }}>
//                               <FaFileExcel style={{ fontSize: "18px" }} />
//                               <div>
//                                 <div style={{ fontWeight: "600" }}>Exercise Files (Excel)</div>
//                                 <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                               </div>
//                             </div>
//                           )}
//                           {selectedLecture.documentPath && (
//                             <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", color: "#1e40af" }}>
//                               <FaFileWord style={{ fontSize: "18px" }} />
//                               <div>
//                                 <div style={{ fontWeight: "600" }}>Word Document</div>
//                                 <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                               </div>
//                             </div>
//                           )}
//                           {selectedLecture.pptPath && (
//                             <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", color: "#9a3412" }}>
//                               <FaFilePowerpoint style={{ fontSize: "18px" }} />
//                               <div>
//                                 <div style={{ fontWeight: "600" }}>Presentation (PPT)</div>
//                                 <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                               </div>
//                             </div>
//                           )}
//                           {selectedLecture.videoUrl && (
//                             <a href={selectedLecture.videoUrl} target="_blank" rel="noreferrer"
//                               onContextMenu={e => e.preventDefault()}
//                               style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", textDecoration: "none", color: "#3D1A5B" }}>
//                               <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                                 <FaLink style={{ fontSize: "16px" }} />
//                                 <div>
//                                   <div style={{ fontWeight: "600" }}>External Video</div>
//                                   <div style={{ fontSize: "11px", color: "#5E427B" }}>Watch on external platform</div>
//                                 </div>
//                               </div>
//                               <FaArrowRight />
//                             </a>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 )
//             }
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {showPaymentModal && courseAccess.coursePrice > 0 && (
//         <div style={styles.mOverlay} onClick={() => setShowPaymentModal(false)}>
//           <div style={styles.modal} onClick={e => e.stopPropagation()}>
//             <div style={{ textAlign: "center" }}>
//               <div style={styles.lkCircle}>
//                 <FaLock style={{ fontSize: "26px", color: "#fff" }} />
//               </div>
//               <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "8px" }}>
//                 Unlock Full Access
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px", lineHeight: 1.6 }}>
//                 All lectures, resources & certificate
//               </p>
//             </div>

//             <div style={{ background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.12)", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "14px" }}>
//               <div style={{ fontSize: "11px", color: "#5E427B", fontWeight: 600, marginBottom: "4px" }}>
//                 {courseData?.title}
//               </div>
//               <div style={{ fontSize: "34px", fontWeight: 800, color: "#3D1A5B" }}>
//                 ₹{courseAccess.coursePrice}
//               </div>
//               <div style={{ fontSize: "11px", color: "#64748b" }}>
//                 One-time • Lifetime access
//               </div>
//             </div>

//             <button onClick={() => { setShowPaymentMethodsModal(true); setShowPaymentModal(false); }} style={styles.procBtn}>
//               <FaShoppingCart /> Proceed to Payment
//             </button>

//             <button onClick={() => setShowPaymentModal(false)} style={styles.ghostBtn}>
//               Cancel
//             </button>

//             <div style={styles.secNote}>
//               <FaCheckCircle style={{ color: "#059669" }} /> Secure • 30-day money-back
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Methods Modal */}
//       {showPaymentMethodsModal && courseAccess.coursePrice > 0 && (
//         <div style={styles.mOverlay} onClick={() => setShowPaymentMethodsModal(false)}>
//           <div style={styles.modal} onClick={e => e.stopPropagation()}>
//             <div style={{ textAlign: "center", marginBottom: "16px" }}>
//               <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "4px" }}>
//                 Select Payment Method
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280" }}>
//                 Total: <strong style={{ color: "#3D1A5B" }}>₹{courseAccess.coursePrice}</strong>
//               </p>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//               {[
//                 { method: "card", icon: "💳", label: "Card", sub: "Credit/Debit" },
//                 { method: "upi", icon: "📱", label: "UPI", sub: "UPI ID" },
//                 { method: "netbanking", icon: "🏦", label: "Net Banking", sub: "All banks" },
//                 { method: "wallet", icon: "👛", label: "Wallet", sub: "Paytm, PhonePe" }
//               ].map(({ method, icon, label, sub }) => (
//                 <button
//                   key={method}
//                   onClick={() => handlePayment(method)}
//                   disabled={processingPayment}
//                   className="pay-btn"
//                   style={{
//                     background: "#fff",
//                     border: "2px solid #e2e8f0",
//                     borderRadius: "10px",
//                     padding: "14px 10px",
//                     cursor: "pointer",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "4px",
//                     opacity: processingPayment ? 0.7 : 1
//                   }}>
//                   <div style={{ fontSize: "24px" }}>{icon}</div>
//                   <div style={{ fontWeight: 600, fontSize: "13px" }}>{label}</div>
//                   <div style={{ fontSize: "11px", color: "#64748b" }}>{sub}</div>
//                 </button>
//               ))}
//             </div>

//             {processingPayment && (
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", padding: "11px", background: "rgba(61,26,91,0.05)", borderRadius: "8px" }}>
//                 <FaSpinner style={{ animation: "spin 1s linear infinite", color: "#3D1A5B" }} />
//                 <span style={{ fontSize: "13px", color: "#3D1A5B", fontWeight: 600 }}>Processing...</span>
//               </div>
//             )}

//             <button onClick={() => { setShowPaymentMethodsModal(false); setShowPaymentModal(true); }} style={styles.ghostBtn}>
//               ← Back
//             </button>

//             <div style={styles.secNote}>
//               Your payment is secure and encrypted
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .lec-card:hover { box-shadow: 0 3px 10px rgba(61,26,91,0.1); transform: translateY(-1px); }
//         .pay-btn:hover:not(:disabled) { border-color: #3D1A5B !important; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(61,26,91,0.1); }
        
//         .secure-video-wrap:fullscreen {
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           background: #000 !important;
//           width: 100vw !important;
//           height: 100vh !important;
//           max-width: 100vw !important;
//           max-height: 100vh !important;
//           border-radius: 0 !important;
//         }
        
//         .secure-video-wrap:fullscreen canvas {
//           width: auto !important;
//           height: auto !important;
//           max-width: 100vw !important;
//           max-height: 100vh !important;
//           object-fit: contain !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// // ==========================================================
// // STYLES
// // ==========================================================
// const styles = {
//   page: { display: "flex", minHeight: "100vh", background: "#f1f5f9", position: "relative" },
//   loadWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px" },
//   spin: { width: "46px", height: "46px", border: "4px solid #e5e7eb", borderTop: "4px solid #3D1A5B", borderRadius: "50%", animation: "spin 1s linear infinite" },
//   content: { flex: 1, transition: "margin-left 0.3s" },
//   main: { display: "flex", gap: "14px" },
//   toggle: { position: "fixed", top: "80px", right: "16px", zIndex: 1001, background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", borderRadius: "50%", width: "48px", height: "48px", fontSize: "17px", cursor: "pointer", boxShadow: "0 4px 12px rgba(61,26,91,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
//   backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 999 },
//   left: { width: "340px", background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", height: "calc(100vh - 40px)", overflowY: "auto", flexShrink: 0 },
//   leftM: { position: "fixed", top: "60px", right: 0, width: "300px", maxWidth: "85%", height: "calc(100vh - 60px)", zIndex: 1000, transition: "transform 0.3s ease", boxShadow: "-4px 0 20px rgba(0,0,0,0.14)" },
//   open: { transform: "translateX(0)" },
//   closed: { transform: "translateX(100%)" },
//   right: { flex: 1, background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflowY: "auto", height: "calc(100vh - 40px)", minWidth: 0 },
//   cHead: { marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" },
//   cTitle: { fontSize: "16px", fontWeight: 700, color: "#3D1A5B", marginBottom: "7px", display: "flex", alignItems: "center", gap: "7px" },
//   cMeta: { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" },
//   badge1: { display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
//   payBar: { background: "rgba(251,191,36,0.1)", border: "1px solid rgba(166,138,70,0.28)", borderRadius: "9px", padding: "11px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" },
//   buyBtn: { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "7px 12px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", whiteSpace: "nowrap" },
//   freeBar: { background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "9px", padding: "11px 13px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "9px" },
//   subH: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#3D1A5B", marginBottom: "7px", padding: "7px 10px", background: "rgba(61,26,91,0.05)", borderRadius: "6px", borderLeft: "3px solid #3D1A5B" },
//   subCnt: { background: "#3D1A5B", color: "#fff", padding: "1px 6px", borderRadius: "9px", fontSize: "10px", fontWeight: 600, marginLeft: "auto" },
//   lecCard: { padding: "11px", marginBottom: "7px", borderRadius: "8px", border: "1px solid #e5e7eb", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.15s ease" },
//   lockedC: { opacity: 0.6, cursor: "not-allowed", background: "#fafafa" },
//   selC: { background: "rgba(61,26,91,0.05)", borderColor: "#3D1A5B", borderWidth: "2px" },
//   strip: { position: "absolute", bottom: 0, left: 0, height: "3px", transition: "width 0.3s ease" },
//   num: { width: "32px", height: "32px", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" },
//   empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "260px" },
//   lockedScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", textAlign: "center", padding: "30px" },
//   lkCircle: { width: "60px", height: "60px", margin: "0 auto 14px", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
//   unlockBtn: { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(166,138,70,0.28)" },
//   subTag: { background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "2px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" },
//   doneBadge: { background: "#d1fae5", color: "#065f46", padding: "4px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" },
//   progCard: { padding: "11px 13px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" },
//   mOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
//   modal: { background: "#fff", borderRadius: "14px", padding: "24px", maxWidth: "440px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
//   procBtn: { width: "100%", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", padding: "12px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(61,26,91,0.22)", marginBottom: "7px" },
//   ghostBtn: { width: "100%", background: "transparent", color: "#64748b", border: "none", padding: "9px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, fontSize: "13px", marginTop: "4px" },
//   secNote: { fontSize: "11px", color: "#64748b", textAlign: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
// };

// export default StudentLecturesPage;

















// import React, { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import StudentSidebar from "../components/StudentSidebar";
// import {
//   getProgress, trackLectureProgress, getFilteredLectures,
//   canAccessCourse, getCourseById, completePaymentProcess,
//   getEnrollmentStatus, recordLectureAccess,
// } from "../api/api";
// import {
//   FaCheckCircle, FaFilePdf, FaClock, FaPlay, FaFileExcel,
//   FaFileWord, FaLock, FaUnlock, FaArrowRight, FaExclamationTriangle,
//   FaRupeeSign, FaShoppingCart, FaChartLine, FaBook, FaSpinner,
//   FaDownload, FaLink, FaTimes, FaTag, FaGraduationCap, FaList,
//   FaRedo, FaFilePowerpoint, FaShieldAlt, FaCamera, FaEyeSlash,
//   FaHourglassHalf, FaStopwatch, FaInfoCircle,
// } from "react-icons/fa";
// import { getUserId, isAuthenticated } from "../utils/auth";
// import axios from "axios";

// // AFTER
// const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
// const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// // ==========================================================
// // AccessStatusBanner
// // ==========================================================
// const AccessStatusBanner = ({ accessInfo, coursePrice, isMobile }) => {
//   if (!accessInfo) return null;
 
//   const {
//     isExpired,
//     isLimitReached,
//     daysRemaining,
//     lectureLimit,
//     accessedLecturesCount,
//     lecturesRemaining,
//     hasAccess,
//     endDate,
//   } = accessInfo;

//   if (coursePrice === 0) {
//     return (
//       <div style={{
//         background: "#d1fae5",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #10b981",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaUnlock style={{ color: "#059669", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#065f46" }}>Free Course</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#065f46" }}>
//             All lectures are available for free!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!hasAccess && !isExpired && !isLimitReached) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaLock style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Purchase Required</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             This course costs ₹{coursePrice}. Purchase to unlock all lectures.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isExpired) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaHourglassHalf style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Access Expired</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             Your access expired on {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}.
//             Please contact admin to renew.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isLimitReached) {
//     return (
//       <div style={{
//         background: "#fee2e2",
//         padding: isMobile ? "10px 14px" : "12px 16px",
//         borderRadius: "10px",
//         marginBottom: "16px",
//         borderLeft: "4px solid #ef4444",
//         display: "flex",
//         alignItems: "center",
//         gap: "12px",
//       }}>
//         <FaStopwatch style={{ color: "#991b1b", fontSize: "20px" }} />
//         <div>
//           <strong style={{ color: "#991b1b" }}>Lecture Limit Reached</strong>
//           <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>
//             You've reached your limit of {lectureLimit} lectures.
//             Contact admin to extend your access.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       background: daysRemaining !== null && daysRemaining <= 7 ? "#fed7aa" : "#dbeafe",
//       padding: isMobile ? "10px 14px" : "12px 16px",
//       borderRadius: "10px",
//       marginBottom: "16px",
//       borderLeft: `4px solid ${daysRemaining !== null && daysRemaining <= 7 ? "#f97316" : "#3b82f6"}`,
//     }}>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
//         {daysRemaining !== null && daysRemaining > 0 && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaClock style={{ color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Time Remaining</div>
//               <div style={{ fontWeight: 700, color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }}>
//                 {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
//               </div>
//             </div>
//           </div>
//         )}
       
//         {lectureLimit !== null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaBook style={{ color: "#3b82f6" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Lectures Used</div>
//               <div style={{ fontWeight: 700, color: "#3b82f6" }}>
//                 {accessedLecturesCount || 0} / {lectureLimit}
//                 {lecturesRemaining !== null && lecturesRemaining > 0 && (
//                   <span style={{ fontSize: "11px", marginLeft: "4px", color: "#059669" }}>
//                     ({lecturesRemaining} left)
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
       
//         {endDate && daysRemaining === null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaInfoCircle style={{ color: "#059669" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Lifetime Access</div>
//               <div style={{ fontWeight: 700, color: "#059669" }}>No Expiry</div>
//             </div>
//           </div>
//         )}
       
//         {lectureLimit === null && daysRemaining === null && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <FaUnlock style={{ color: "#059669" }} />
//             <div>
//               <div style={{ fontSize: "11px", color: "#6b7280" }}>Full Access</div>
//               <div style={{ fontWeight: 700, color: "#059669" }}>Lifetime Unlimited</div>
//             </div>
//           </div>
//         )}
//       </div>
     
//       {endDate && daysRemaining !== null && daysRemaining > 0 && (
//         <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
//           Expires: {new Date(endDate).toLocaleDateString()}
//         </div>
//       )}
//     </div>
//   );
// };

// // ==========================================================
// // useAntiCapture
// // ==========================================================
// const useAntiCapture = (enabled = true) => {
//   const [blocked, setBlocked] = useState(false);
//   const overlayRef = useRef(null);

//   useEffect(() => {
//     if (!enabled) return;

//     const style = document.createElement("style");
//     style.id = "anti-capture-style";
//     style.innerHTML = `
//       .secure-content {
//         -webkit-user-select: none;
//         -moz-user-select: none;
//         user-select: none;
//       }
//       @media print {
//         .secure-content, .secure-video-wrap, .secure-pdf-wrap, .lecture-content-panel {
//           display: none !important;
//           visibility: hidden !important;
//         }
//         body::before {
//           content: "⛔ This content is protected. Printing is not allowed.";
//           display: block;
//           font-size: 24px;
//           text-align: center;
//           padding: 60px;
//           color: #dc2626;
//           background: #fff;
//         }
//       }
//       .secure-content * {
//         -webkit-user-select: none !important;
//         user-select: none !important;
//         -webkit-touch-callout: none !important;
//       }
//       #capture-blocker {
//         display: none;
//         position: fixed;
//         inset: 0;
//         background: rgba(0, 0, 0, 0.95);
//         z-index: 99999;
//         align-items: center;
//         justify-content: center;
//         flex-direction: column;
//         gap: 16px;
//       }
//       #capture-blocker.show {
//         display: flex;
//       }
//       @keyframes spin {
//         to { transform: rotate(360deg); }
//       }
//       .lec-card:hover {
//         box-shadow: 0 3px 10px rgba(61,26,91,0.1);
//         transform: translateY(-1px);
//       }
//       .pay-btn:hover:not(:disabled) {
//         border-color: #3D1A5B !important;
//         transform: translateY(-2px);
//         box-shadow: 0 4px 10px rgba(61,26,91,0.1);
//       }
//       video {
//         pointer-events: auto;
//       }
//       video::-webkit-media-controls-download-button {
//         display: none !important;
//       }
//     `;
//     document.head.appendChild(style);

//     const overlay = document.createElement("div");
//     overlay.id = "capture-blocker";
//     overlay.innerHTML = `
//       <div style="font-size:64px; color:#ef4444;">🚫</div>
//       <div style="font-size:20px; font-weight:700; color:#fff;">Screen Capture Blocked</div>
//       <div style="font-size:14px; color:#9ca3af; text-align:center; max-width:340px;">
//         Recording and screenshot of course content is strictly prohibited.
//       </div>
//     `;
//     document.body.appendChild(overlay);
//     overlayRef.current = overlay;

//     const showBlocker = (duration = 2000) => {
//       overlay.classList.add("show");
//       setBlocked(true);
//       setTimeout(() => {
//         overlay.classList.remove("show");
//         setBlocked(false);
//       }, duration);
//     };

//     const handleKeyDown = (e) => {
//       const blocked_combos = [
//         e.key === "PrintScreen",
//         e.metaKey && e.shiftKey && ["3","4","5","6"].includes(e.key),
//         e.metaKey && e.shiftKey && e.key === "s",
//         e.metaKey && e.key === "g",
//         e.metaKey && e.altKey && e.key === "r",
//         e.key === "F12",
//         e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C"].includes(e.key),
//         e.ctrlKey && (e.key === "u" || e.key === "U"),
//         e.ctrlKey && (e.key === "s" || e.key === "S"),
//       ];

//       if (blocked_combos.some(Boolean)) {
//         e.preventDefault();
//         e.stopPropagation();
//         showBlocker(1500);
//         return false;
//       }
//     };

//     const patchScreenCapture = () => {
//       if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
//         navigator.mediaDevices.getDisplayMedia = async (...args) => {
//           showBlocker(3000);
//           throw new DOMException("Screen capture is not allowed.", "NotAllowedError");
//         };
//       }
//     };
//     patchScreenCapture();

//     document.addEventListener("keydown", handleKeyDown, true);
//     document.addEventListener("contextmenu", (e) => {
//       if (e.target.closest(".secure-content")) e.preventDefault();
//     });

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown, true);
//       const s = document.getElementById("anti-capture-style");
//       if (s) s.remove();
//       if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
//     };
//   }, [enabled]);

//   return { blocked };
// };

// // ==========================================================
// // useSignedUrl
// // ==========================================================
// const buildFallbackUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http") || path.startsWith("blob")) return path;
//   const clean = path.startsWith("/") ? path : `/${path}`;
//   return `${BASE_URL}${clean}`;
// };

// const useSignedUrl = (lectureId, type = "video", enabled = true) => {
//   const [signedUrl, setSignedUrl] = useState(null);
//   const [urlLoading, setUrlLoading] = useState(false);
//   const [urlError, setUrlError] = useState(null);
//   const [useFallback, setUseFallback] = useState(false);

//   const fetchUrl = useCallback(async () => {
//     if (!lectureId || !enabled) return;
//     setUrlLoading(true); setUrlError(null); setUseFallback(false);
//     try {
//       const endpoint = type === "pdf"
//         ? `${BASE_URL}/api/lectures/stream/pdf/${lectureId}`
//         : `${BASE_URL}/api/lectures/stream/video/${lectureId}`;
//       const res = await axios.get(endpoint, { headers: getAuthHeader(), timeout: 10000 });
//       if (res.data?.success && res.data?.url) {
//         setSignedUrl(res.data.url);
//       } else if (res.data?.url) {
//         setSignedUrl(res.data.url);
//       } else {
//         setUseFallback(true);
//       }
//     } catch (err) {
//       const status = err?.response?.status;
//       if (status === 401 || status === 403) {
//         setUrlError(err?.response?.data?.message || "Access denied. Please enroll first.");
//       } else {
//         setUseFallback(true);
//       }
//     } finally { setUrlLoading(false); }
//   }, [lectureId, type, enabled]);

//   useEffect(() => {
//     setSignedUrl(null); setUrlError(null); setUseFallback(false);
//     fetchUrl();
//     const t = setInterval(fetchUrl, 90000);
//     return () => clearInterval(t);
//   }, [fetchUrl]);

//   return { signedUrl, urlLoading, urlError, useFallback, refetch: fetchUrl };
// };

// // ==========================================================
// // CanvasVideoPlayer
// // ==========================================================
// const CanvasVideoPlayer = ({ src, onTimeUpdate, onLoadedMetadata, onError, userId, lectureId, onLectureComplete }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const wrapRef = useRef(null);
//   const rafRef = useRef(null);
//   const seekRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [currentT, setCurrentT] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isFS, setIsFS] = useState(false);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [overlayType, setOverlayType] = useState("focus");
//   const [buffered, setBuffered] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const controlTimer = useRef(null);
//   const [completedNotified, setCompletedNotified] = useState(false);

//   const drawFrame = useCallback(() => {
//     const v = videoRef.current;
//     const c = canvasRef.current;
//     if (!v || !c) return;
   
//     const ctx = c.getContext("2d");
//     if (!ctx) return;

//     const vw = v.videoWidth || 1280;
//     const vh = v.videoHeight || 720;
//     if (c.width !== vw) c.width = vw;
//     if (c.height !== vh) c.height = vh;

//     ctx.drawImage(v, 0, 0, vw, vh);

//     const fs = Math.max(14, vw * 0.018);

//     ctx.save();
//     ctx.globalAlpha = 0.75;
//     ctx.fillStyle = "rgba(0,0,0,0.55)";
//     const pillW = fs * 12;
//     ctx.fillRect(12, vh - fs * 2.5, pillW, fs * 1.8);
//     ctx.globalAlpha = 0.95;
//     ctx.fillStyle = "#ffffff";
//     ctx.font = `bold ${fs}px monospace`;
//     ctx.fillText("itechskill.com", 18, vh - fs);
//     ctx.restore();

//     rafRef.current = v.paused ? null : requestAnimationFrame(drawFrame);
//   }, []);

//   const startDraw = useCallback(() => {
//     cancelAnimationFrame(rafRef.current);
//     rafRef.current = requestAnimationFrame(drawFrame);
//   }, [drawFrame]);

//   const stopDraw = useCallback(() => {
//     cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//   }, []);

//   const checkCompletion = useCallback((currentTime, videoDuration) => {
//     if (completedNotified) return;
//     if (videoDuration > 0 && currentTime / videoDuration >= 0.9) {
//       setCompletedNotified(true);
//       if (onLectureComplete) onLectureComplete();
//     }
//   }, [completedNotified, onLectureComplete]);

//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const onPlay = () => { setIsPlaying(true); startDraw(); };
//     const onPause = () => {
//       setIsPlaying(false);
//       stopDraw();
//       requestAnimationFrame(() => drawFrame());
//     };
//     const onEnded = () => { setIsPlaying(false); stopDraw(); };
//     const onMeta = (e) => {
//       setDuration(v.duration);
//       const c = canvasRef.current;
//       if (c) {
//         c.width = v.videoWidth || 1280;
//         c.height = v.videoHeight || 720;
//       }
//       requestAnimationFrame(() => drawFrame());
//       onLoadedMetadata?.(e);
//     };
//     const onTime = (e) => {
//       setCurrentT(v.currentTime);
//       if (v.buffered.length) setBuffered((v.buffered.end(v.buffered.length-1)/v.duration)*100);
//       onTimeUpdate?.(e);
//       checkCompletion(v.currentTime, v.duration);
//     };
//     const onVolChg = () => { setIsMuted(v.muted); setVolume(v.volume); };
//     const noPiP = () => { if (document.pictureInPictureElement) document.exitPictureInPicture(); };
//     const noCtx = (e) => e.preventDefault();

//     v.addEventListener("play", onPlay);
//     v.addEventListener("pause", onPause);
//     v.addEventListener("ended", onEnded);
//     v.addEventListener("loadedmetadata", onMeta);
//     v.addEventListener("timeupdate", onTime);
//     v.addEventListener("volumechange", onVolChg);
//     v.addEventListener("enterpictureinpicture", noPiP);
//     v.addEventListener("contextmenu", noCtx);

//     return () => {
//       stopDraw();
//       v.removeEventListener("play", onPlay);
//       v.removeEventListener("pause", onPause);
//       v.removeEventListener("ended", onEnded);
//       v.removeEventListener("loadedmetadata", onMeta);
//       v.removeEventListener("timeupdate", onTime);
//       v.removeEventListener("volumechange", onVolChg);
//       v.removeEventListener("enterpictureinpicture", noPiP);
//       v.removeEventListener("contextmenu", noCtx);
//     };
//   }, [startDraw, stopDraw, drawFrame, onTimeUpdate, onLoadedMetadata, checkCompletion]);

//   useEffect(() => {
//     const paintBlack = () => {
//       const c = canvasRef.current;
//       if (!c) return;
//       const ctx = c.getContext("2d");
//       ctx.fillStyle = "#000";
//       ctx.fillRect(0, 0, c.width, c.height);
//       ctx.fillStyle = "#ef4444";
//       ctx.font = "20px sans-serif";
//       ctx.fillText("Content Protected", c.width/2 - 100, c.height/2);
//     };

//     const triggerBlackout = (type = "focus") => {
//       const v = videoRef.current;
//       if (v && !v.paused) v.pause();
//       stopDraw();
//       paintBlack();
//       setOverlayType(type);
//       setShowOverlay(true);
//     };
//     const restore = () => setShowOverlay(false);

//     const onVisible = () => { if (document.hidden) triggerBlackout("focus"); };
//     const onBlur = () => triggerBlackout("focus");
//     const onFocus = () => restore();

//     document.addEventListener("visibilitychange", onVisible);
//     window.addEventListener("blur", onBlur);
//     window.addEventListener("focus", onFocus);

//     return () => {
//       document.removeEventListener("visibilitychange", onVisible);
//       window.removeEventListener("blur", onBlur);
//       window.removeEventListener("focus", onFocus);
//     };
//   }, [stopDraw]);

//   const toggleFullscreen = () => {
//     const wrap = wrapRef.current;
//     if (!wrap) return;
//     if (!document.fullscreenElement) {
//       const requestFullscreen = wrap.requestFullscreen ||
//                               wrap.webkitRequestFullscreen ||
//                               wrap.mozRequestFullScreen;
//       if (requestFullscreen) requestFullscreen.call(wrap);
//     } else {
//       document.exitFullscreen?.();
//     }
//   };

//   const togglePlay = () => {
//     const v = videoRef.current;
//     if (!v || showOverlay) return;
//     v.paused ? v.play() : v.pause();
//     resetControlTimer();
//   };

//   const resetControlTimer = () => {
//     setShowControls(true);
//     clearTimeout(controlTimer.current);
//     if (isFS) {
//       controlTimer.current = setTimeout(() => setShowControls(false), 3000);
//     }
//   };

//   const handleSeekClick = (e) => {
//     const v = videoRef.current;
//     if (!v || !duration) return;
//     const bar = seekRef.current;
//     if (!bar) return;
//     const rect = bar.getBoundingClientRect();
//     const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
//     v.currentTime = pct * duration;
//   };

//   const formatTime = (s) => {
//     if (!s || isNaN(s)) return "0:00";
//     const m = Math.floor(s / 60), sec = Math.floor(s % 60);
//     return `${m}:${sec.toString().padStart(2, "0")}`;
//   };

//   const pct = duration ? (currentT / duration) * 100 : 0;

//   return (
//     <div
//       ref={wrapRef}
//       className="secure-video-wrap"
//       style={{
//         position: "relative",
//         background: "#000",
//         borderRadius: "12px",
//         overflow: "hidden",
//         width: "100%",
//         aspectRatio: "16/9",
//       }}
//       onMouseMove={resetControlTimer}
//     >
//       <video
//         ref={videoRef}
//         src={src}
//         style={{
//           position: "fixed",
//           left: "-9999px",
//           top: "-9999px",
//           width: "1px",
//           height: "1px",
//           opacity: 0,
//           pointerEvents: "none",
//         }}
//         disablePictureInPicture
//         playsInline
//         preload="auto"
//         onError={onError}
//       />

//       <canvas
//         ref={canvasRef}
//         onClick={togglePlay}
//         onDoubleClick={toggleFullscreen}
//         style={{
//           width: "100%",
//           height: "100%",
//           display: "block",
//           background: "#000",
//           cursor: "pointer",
//           objectFit: "contain"
//         }}
//       />

//       {showOverlay && (
//         <div style={{
//           position: "absolute", inset: 0, background: "#000",
//           display: "flex", flexDirection: "column",
//           alignItems: "center", justifyContent: "center",
//           gap: "16px", zIndex: 30,
//         }}>
//           <div style={{
//             width: 80, height: 80, borderRadius: "50%",
//             background: "linear-gradient(135deg,#3D1A5B,#5E427B)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//           }}>
//             <FaShieldAlt style={{ fontSize: "36px", color: "#fff" }} />
//           </div>
//           <p style={{ color: "#fff", fontWeight: 800, fontSize: "20px", margin: 0 }}>
//             Content Protected
//           </p>
//           <button
//             onClick={() => { setShowOverlay(false); }}
//             style={{
//               background: "linear-gradient(135deg,#3D1A5B,#5E427B)",
//               color: "#fff", border: "none", padding: "11px 28px",
//               borderRadius: "9px", cursor: "pointer", fontWeight: 700,
//             }}
//           >
//             Resume Video
//           </button>
//         </div>
//       )}

//       <div
//         style={{
//           position: "absolute", bottom: 0, left: 0, right: 0,
//           background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
//           padding: "32px 14px 12px",
//           zIndex: 20,
//           opacity: showControls ? 1 : 0,
//           transition: "opacity 0.3s",
//         }}
//       >
//         <div
//           ref={seekRef}
//           onClick={handleSeekClick}
//           style={{
//             height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px",
//             cursor: "pointer", marginBottom: "12px", position: "relative",
//           }}
//         >
//           <div style={{
//             position: "absolute", left: 0, top: 0, height: "100%",
//             width: `${buffered}%`, background: "rgba(255,255,255,0.3)", borderRadius: "2px",
//           }} />
//           <div style={{
//             position: "absolute", left: 0, top: 0, height: "100%",
//             width: `${pct}%`, background: "linear-gradient(90deg,#3D1A5B,#A68A46)", borderRadius: "2px",
//           }} />
//           <div style={{
//             position: "absolute", top: "50%", left: `${pct}%`,
//             transform: "translate(-50%,-50%)",
//             width: "12px", height: "12px", background: "#fff", borderRadius: "50%",
//             boxShadow: "0 0 5px rgba(0,0,0,0.6)", pointerEvents: "none",
//           }} />
//         </div>

//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <button onClick={togglePlay} style={ctrlBtn}>
//             {isPlaying ? "⏸" : "▶"}
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.currentTime = Math.max(0, v.currentTime - 5); }} style={ctrlBtn}>
//             ⏪
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.currentTime = Math.min(v.duration, v.currentTime + 5); }} style={ctrlBtn}>
//             ⏩
//           </button>

//           <button onClick={() => { const v = videoRef.current; if(v) v.muted = !v.muted; }} style={ctrlBtn}>
//             {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
//           </button>

//           <input
//             type="range" min="0" max="1" step="0.05"
//             value={isMuted ? 0 : volume}
//             onChange={(e) => { const v = videoRef.current; if(v) { v.volume = parseFloat(e.target.value); v.muted = false; } }}
//             style={{ width: "65px", accentColor: "#A68A46", cursor: "pointer" }}
//           />

//           <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontFamily: "monospace" }}>
//             {formatTime(currentT)} / {formatTime(duration)}
//           </span>

//           <div style={{ flex: 1 }} />

//           <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "3px" }}>
//             <FaShieldAlt size={8} /> Protected
//           </span>

//           <button onClick={toggleFullscreen} style={ctrlBtn}>
//             {isFS ? "⊡" : "⛶"}
//           </button>
//         </div>
//       </div>

//       <div style={{
//         position: "absolute", top: "10px", left: "10px",
//         background: "rgba(61,26,91,0.8)", color: "#fff",
//         padding: "3px 9px", borderRadius: "4px", fontSize: "10px",
//         pointerEvents: "none", display: "flex", alignItems: "center", gap: "4px", zIndex: 21,
//       }}>
//         <FaShieldAlt size={8} /> itechskill.com
//       </div>
//     </div>
//   );
// };

// const ctrlBtn = {
//   background: "none", border: "none", color: "#fff",
//   cursor: "pointer", fontSize: "18px", padding: "2px 5px",
//   display: "flex", alignItems: "center", lineHeight: 1,
//   transition: "opacity 0.2s",
// };

// // ==========================================================
// // SecureVideoPlayer
// // ==========================================================
// const SecureVideoPlayer = ({ lecture, onTimeUpdate, onLoadedMetadata, onLectureComplete }) => {
//   const rawVideoPath = lecture.videoPath || lecture.video || lecture.videoUrl || null;
 
//   const needsSigning = !!rawVideoPath && !rawVideoPath.startsWith("http");
//   const { signedUrl, urlLoading, urlError, useFallback, refetch } =
//     useSignedUrl(lecture._id, "video", needsSigning);

//   const src = signedUrl
//     ? signedUrl
//     : useFallback
//       ? buildFallbackUrl(rawVideoPath)
//       : rawVideoPath?.startsWith("http")
//         ? rawVideoPath
//         : null;

//   if (!rawVideoPath && !lecture.videoUrl) return null;

//   if (urlLoading) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//       minHeight: "240px", background: "#111", borderRadius: "12px" }}>
//       <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "#3D1A5B" }} />
//       <span style={{ marginTop: "12px", fontSize: "13px", color: "#9ca3af" }}>Loading secure video...</span>
//     </div>
//   );

//   if (urlError) return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
//       minHeight: "200px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", padding: "24px" }}>
//       <FaLock style={{ fontSize: "28px", color: "#ef4444", marginBottom: "10px" }} />
//       <p style={{ color: "#991b1b", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>⚠️ {urlError}</p>
//       <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: "5px",
//         background: "#3D1A5B", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px",
//         cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
//         <FaRedo size={11} /> Retry
//       </button>
//     </div>
//   );

//   if (!src) return null;

//   return (
//     <CanvasVideoPlayer
//       src={src}
//       userId={getUserId()}
//       lectureId={lecture._id}
//       onTimeUpdate={onTimeUpdate}
//       onLoadedMetadata={onLoadedMetadata}
//       onLectureComplete={onLectureComplete}
//       onError={() => { console.warn("Video error, retrying..."); refetch(); }}
//     />
//   );
// };

// // ==========================================================
// // SecurePDFLink
// // ==========================================================
// const SecurePDFLink = ({ lecture }) => {
//   const rawPdfPath = lecture.pdfPath || lecture.pdf || null;
//   const needsSigning = !!rawPdfPath && !rawPdfPath.startsWith("http");
//   const { signedUrl, urlLoading, urlError, useFallback, refetch } =
//     useSignedUrl(lecture._id, "pdf", needsSigning);

//   const url = signedUrl
//     ? signedUrl
//     : useFallback
//       ? buildFallbackUrl(rawPdfPath)
//       : rawPdfPath?.startsWith("http")
//         ? rawPdfPath
//         : null;

//   if (urlLoading) return (
//     <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6b7280", padding: "12px 14px", background: "#f9fafb", borderRadius: "8px" }}>
//       <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading PDF...
//     </div>
//   );
//   if (urlError) return (
//     <div style={{ padding: "12px 14px", color: "#991b1b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", borderRadius: "8px" }}>
//       ⚠️ {urlError}
//       <button onClick={refetch} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline", fontSize: "12px" }}>Retry</button>
//     </div>
//   );
//   if (!url) return null;

//   return (
//     <a href={url} target="_blank" rel="noopener noreferrer"
//       onContextMenu={e => e.preventDefault()}
//       style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", textDecoration: "none", color: "#991b1b" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <FaFilePdf style={{ fontSize: "18px" }} />
//         <div>
//           <div style={{ fontWeight: "600" }}>Lecture Notes (PDF)</div>
//           <div style={{ fontSize: "11px", color: "#dc2626" }}>Secure link — expires in 5 min</div>
//         </div>
//       </div>
//       <FaArrowRight />
//     </a>
//   );
// };

// // ==========================================================
// // MAIN COMPONENT
// // ==========================================================
// const StudentLecturesPage = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const [lectures, setLectures] = useState([]);
//   const [completedLectures, setCompletedLectures] = useState([]);
//   const [lectureProgress, setLectureProgress] = useState({});
//   const [selectedLecture, setSelectedLecture] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentVideoTime, setCurrentVideoTime] = useState(0);
//   const [videoDuration, setVideoDuration] = useState(0);
//   const [courseAccess, setCourseAccess] = useState({
//     hasFullAccess: false,
//     isPaid: false,
//     coursePrice: 0,
//     hasAccess: false,
//     isExpired: false,
//     isLimitReached: false,
//     daysRemaining: null,
//     lectureLimit: null,
//     accessedLecturesCount: 0,
//     lecturesRemaining: null,
//     endDate: null,
//   });
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [isLectureListOpen, setIsLectureListOpen] = useState(false);
//   const [courseData, setCourseData] = useState(null);
//   const [lecturesBySubcategory, setLecturesBySubcategory] = useState({});
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
//   const [recordingAccess, setRecordingAccess] = useState(false);
//   const studentId = getUserId();

//   useAntiCapture(false);

//   useEffect(() => {
//     const fn = () => {
//       const m = window.innerWidth <= 768;
//       setIsMobile(m);
//       if (!m) {
//         setIsMobileSidebarOpen(false);
//         setIsLectureListOpen(false);
//       }
//     };
//     window.addEventListener("resize", fn);
//     return () => window.removeEventListener("resize", fn);
//   }, []);

//   // ==========================================================
//   // MAIN LOAD DATA FUNCTION - FIXED VERSION
//   // ==========================================================
//   const loadData = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Loading data for course:", courseId);

//       // Fetch course details
//       const courseRes = await getCourseById(courseId);
//       console.log("📚 Course data:", courseRes);
//       setCourseData(courseRes?.course || courseRes);

//       // Fetch filtered lectures (backend handles access control)
//       const fr = await getFilteredLectures(courseId);
//       console.log("📋 Filtered lectures response:", fr);
     
//       const allLectures = fr.lectures || [];
//       console.log("📖 All lectures count:", allLectures.length);
     
//       const coursePrice = fr.coursePrice ?? courseRes?.course?.price ?? courseRes?.price ?? 0;

//       // Use backend-provided access flags
//       const hasAccess = fr.hasAccess || fr.hasFullAccess || coursePrice === 0;
//       const isExpired = fr.isExpired || false;
//       const isLimitReached = fr.isLimitReached || false;
//       const lectureLimit = fr.lectureLimit ?? null;
//       const accessedCount = fr.accessedLecturesCount || 0;

//       // IMPORTANT: Use lectures as-is from backend
//       const filteredLectures = allLectures;
//       console.log("✅ Filtered lectures to display:", filteredLectures.length);

//       setLectures(filteredLectures);

//       // Group lectures by subcategory
//       const grouped = {};
//       filteredLectures.forEach(l => {
//         const s = l.subCategory || "General";
//         if (!grouped[s]) grouped[s] = [];
//         grouped[s].push(l);
//       });
//       setLecturesBySubcategory(grouped);
//       console.log("📂 Grouped by subcategory:", Object.keys(grouped));

//       setCourseAccess({
//         hasFullAccess: hasAccess && !isExpired && !isLimitReached,
//         isPaid: fr.isPaidStudent || false,
//         coursePrice,
//         hasAccess,
//         isExpired,
//         isLimitReached,
//         daysRemaining: fr.daysRemaining ?? null,
//         lectureLimit,
//         accessedLecturesCount: accessedCount,
//         lecturesRemaining: fr.lecturesRemaining ?? null,
//         endDate: fr.endDate || null,
//         grantedByAdmin: fr.grantedByAdmin || false,
//       });

//       // Fetch progress
//       const pr = await getProgress(studentId, courseId);
//       console.log("📊 Progress data:", pr);
//       const comp = pr?.completedLectures || pr?.progress?.completedLectures || [];
//       const ids = Array.isArray(comp) ? comp.map(l => l._id || l) : [];
//       setCompletedLectures(ids);

//       const pd = {};
//       ids.forEach(id => (pd[id] = 100));
//       setLectureProgress(pd);

//       // Set first lecture as selected if available
//       if (filteredLectures.length > 0) {
//         console.log("🎯 Setting first lecture as selected:", filteredLectures[0].title);
//         setSelectedLecture(filteredLectures[0]);
//       } else {
//         console.warn("⚠️ No lectures found for this course");
//         setSelectedLecture(null);
//       }

//     } catch (e) {
//       console.error("❌ Load error:", e);
//       alert(`Failed to load: ${e.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isAuthenticated()) {
//       navigate("/login");
//       return;
//     }
//     if (studentId && courseId) {
//       loadData();
//     }
//   }, [courseId, studentId, navigate]);

//   // ==========================================================
//   // IS LOCKED FUNCTION
//   // ==========================================================
//   const isLocked = (lecture) => {
//     if (!lecture) return true;
//     if (courseAccess.coursePrice === 0) return false;
//     if (courseAccess.grantedByAdmin) return false;
//     if (courseAccess.hasFullAccess) return false;
//     return true;
//   };

//   // ==========================================================
//   // HANDLE SELECT LECTURE
//   // ==========================================================
//   const handleSelectLecture = async (lecture) => {
//     console.log("🔍 Selecting lecture:", lecture.title, "Locked:", isLocked(lecture));
   
//     if (isLocked(lecture)) {
//       setShowPaymentModal(true);
//       return;
//     }
   
//     // Record access for paid lectures
//     if (courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess) {
//       const alreadyAccessed = completedLectures.includes(lecture._id) || lectureProgress[lecture._id] >= 90;
     
//       if (!alreadyAccessed && courseAccess.lectureLimit !== null) {
//         if (courseAccess.accessedLecturesCount >= courseAccess.lectureLimit) {
//           alert(`You have reached your lecture limit (${courseAccess.lectureLimit} lectures).`);
//           return;
//         }
       
//         try {
//           setRecordingAccess(true);
//           const result = await recordLectureAccess(studentId, courseId, lecture._id);
//           console.log("✅ Lecture access recorded:", result);
         
//           setCourseAccess(prev => ({
//             ...prev,
//             accessedLecturesCount: result.accessedLecturesCount,
//             lecturesRemaining: result.lecturesRemaining,
//             isLimitReached: result.isLimitReached || false,
//           }));
         
//           await loadData();
         
//         } catch (err) {
//           console.error("Failed to record access:", err);
//           if (err.response?.data?.isLimitReached) {
//             alert("Lecture limit reached!");
//             return;
//           }
//         } finally {
//           setRecordingAccess(false);
//         }
//       }
//     }
   
//     setSelectedLecture(lecture);
//     if (isMobile) setIsLectureListOpen(false);
//   };

//   const handleLectureComplete = async () => {
//     if (!selectedLecture) return;
//     if (completedLectures.includes(selectedLecture._id)) return;
   
//     try {
//       await trackLectureProgress(studentId, courseId, selectedLecture._id);
//       setCompletedLectures(prev => [...new Set([...prev, selectedLecture._id])]);
//       setLectureProgress(prev => ({ ...prev, [selectedLecture._id]: 100 }));
//     } catch (err) {
//       console.error("Failed to mark lecture complete:", err);
//     }
//   };

//   const formatTime = s => {
//     if (!s || isNaN(s)) return "0:00";
//     return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
//   };

//   const getProgressPercent = id => completedLectures.includes(id) ? 100 : lectureProgress[id] || 0;

//   const handlePayment = async method => {
//     try {
//       setProcessingPayment(true);
//       const result = await completePaymentProcess(courseId, method, courseAccess.coursePrice);
//       if (result.success) {
//         alert("Payment successful! Course unlocked.");
//         setShowPaymentMethodsModal(false);
//         setShowPaymentModal(false);
//         await loadData();
//       } else {
//         alert(result.message || "Payment failed.");
//       }
//     } catch (e) {
//       alert(e.response?.data?.message || "Payment error.");
//     } finally {
//       setProcessingPayment(false);
//     }
//   };

//   if (loading) return (
//     <div style={styles.page}>
//       <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
//       <div style={{ ...styles.loadWrap, marginLeft: isMobile ? 0 : "280px" }}>
//         <div style={styles.spin} />
//         <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading lectures...</p>
//       </div>
//     </div>
//   );

//   // Debug log before render
//   console.log("🎨 Rendering with:", {
//     lecturesCount: lectures.length,
//     selectedLecture: selectedLecture?.title,
//     hasAccess: courseAccess.hasFullAccess,
//     isLocked: selectedLecture ? isLocked(selectedLecture) : null
//   });

//   return (
//     <div style={styles.page}>
//       <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

//       {isMobile && (
//         <button style={styles.toggle} onClick={() => setIsLectureListOpen(v => !v)}>
//           {isLectureListOpen ? <FaTimes /> : <FaList />}
//         </button>
//       )}

//       {isMobile && isLectureListOpen && (
//         <div style={styles.backdrop} onClick={() => setIsLectureListOpen(false)} />
//       )}

//       <div style={{ ...styles.content, marginLeft: isMobile ? 0 : "280px" }}>
//         <div style={{ ...styles.main, padding: isMobile ? "80px 12px 12px" : "20px" }}>

//           {/* LEFT PANEL - Lecture List */}
//           <div style={{
//             ...styles.left,
//             ...(isMobile ? {
//               ...styles.leftM,
//               ...(isLectureListOpen ? styles.open : styles.closed)
//             } : {})
//           }}>
//             <div style={styles.cHead}>
//               <h1 style={styles.cTitle}>
//                 <FaGraduationCap /> {courseData?.title || "Course"}
//               </h1>
//               <div style={styles.cMeta}>
//                 <span style={styles.badge1}>
//                   {courseAccess.coursePrice === 0
//                     ? <><FaUnlock size={10} /> FREE</>
//                     : <><FaRupeeSign size={10} /> ₹{courseAccess.coursePrice}</>
//                   }
//                 </span>
//                 <span>{lectures.length} lectures</span>
//                 <span style={{ color: "#10b981", fontWeight: 600 }}>
//                   {completedLectures.length} done ✓
//                 </span>
//               </div>
//             </div>

//             {courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess && !courseAccess.isExpired && (
//               <div style={styles.payBar}>
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
//                     <FaExclamationTriangle style={{ color: "#92400e" }} />
//                     <strong style={{ color: "#92400e" }}>Purchase Required</strong>
//                   </div>
//                   <div style={{ fontSize: "12px", color: "#92400e" }}>Unlock all lectures</div>
//                 </div>
//                 <button onClick={() => setShowPaymentModal(true)} style={styles.buyBtn}>
//                   <FaShoppingCart size={11} /> Purchase
//                 </button>
//               </div>
//             )}

//             {lectures.length > 0 && (
//               <div style={{ marginBottom: "14px", padding: "10px 12px", background: "#f9fafb", borderRadius: "9px", border: "1px solid #e5e7eb" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginBottom: "5px" }}>
//                   <span>Overall Progress</span>
//                   <span style={{ fontWeight: 700, color: "#3D1A5B" }}>
//                     {lectures.length > 0 ? Math.round((completedLectures.length / lectures.length) * 100) : 0}%
//                   </span>
//                 </div>
//                 <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
//                   <div style={{
//                     height: "100%",
//                     width: lectures.length > 0 ? `${(completedLectures.length / lectures.length) * 100}%` : "0%",
//                     background: "linear-gradient(90deg,#3D1A5B,#5E427B)",
//                     transition: "width 0.5s ease"
//                   }} />
//                 </div>
//               </div>
//             )}

//             {Object.keys(lecturesBySubcategory).length > 0
//               ? Object.keys(lecturesBySubcategory).map(sub => (
//                 <div key={sub} style={{ marginBottom: "18px" }}>
//                   <div style={styles.subH}>
//                     <FaTag size={10} />
//                     <span>{sub}</span>
//                     <span style={styles.subCnt}>{lecturesBySubcategory[sub].length}</span>
//                   </div>
//                   {lecturesBySubcategory[sub].map(lec => {
//                     const locked = isLocked(lec);
//                     const done = completedLectures.includes(lec._id);
//                     const prog = getProgressPercent(lec._id);
//                     const sel = selectedLecture?._id === lec._id;

//                     return (
//                       <div key={lec._id}
//                         className="lec-card"
//                         onClick={() => handleSelectLecture(lec)}
//                         style={{
//                           ...styles.lecCard,
//                           ...(locked ? styles.lockedC : {}),
//                           ...(sel ? styles.selC : {})
//                         }}>
//                         {!locked && (
//                           <div style={{
//                             ...styles.strip,
//                             width: `${prog}%`,
//                             background: done ? "#10b981" : "#3D1A5B"
//                           }} />
//                         )}
//                         <div style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
//                           <div style={{
//                             ...styles.num,
//                             background: locked ? "#f3f4f6" : done ? "#d1fae5" : "rgba(61,26,91,0.08)",
//                             color: locked ? "#9ca3af" : done ? "#10b981" : "#3D1A5B"
//                           }}>
//                             {locked ? <FaLock size={11} /> : done ? <FaCheckCircle size={13} /> : lec.lectureNumber}
//                           </div>
//                           <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "2px" }}>
//                               <span style={{ fontSize: "13px", fontWeight: 600, color: locked ? "#9ca3af" : "#111827", lineHeight: 1.4 }}>
//                                 {lec.title}
//                               </span>
//                               {lec.duration && (
//                                 <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, display: "flex", alignItems: "center", gap: "2px" }}>
//                                   <FaClock size={8} />{lec.duration}m
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))
//               : (
//                 <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
//                   <FaBook style={{ fontSize: "36px", marginBottom: "10px", opacity: 0.3 }} />
//                   <p>No lectures available</p>
//                 </div>
//               )
//             }
//           </div>

//           {/* RIGHT PANEL - Lecture Content */}
//           <div style={styles.right} className="secure-content">
//             <AccessStatusBanner
//               accessInfo={courseAccess}
//               coursePrice={courseAccess.coursePrice}
//               isMobile={isMobile}
//             />

//             {!selectedLecture ? (
//               <div style={styles.empty}>
//                 <FaPlay style={{ fontSize: "40px", opacity: 0.2, color: "#3D1A5B", marginBottom: "10px" }} />
//                 <p style={{ color: "#9ca3af", fontSize: "15px" }}>Select a lecture to start learning</p>
//               </div>
//             ) : isLocked(selectedLecture) ? (
//               <div style={styles.lockedScreen}>
//                 <div style={styles.lkCircle}>
//                   <FaLock style={{ fontSize: "30px", color: "#fff" }} />
//                 </div>
//                 <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>
//                   Lecture Locked
//                 </h3>
//                 <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px", textAlign: "center", lineHeight: 1.7, marginBottom: "18px" }}>
//                   {courseAccess.isExpired
//                     ? "Your access to this course has expired. Please contact admin to renew."
//                     : courseAccess.isLimitReached
//                       ? `You have reached your lecture limit (${courseAccess.lectureLimit} lectures). Please contact admin to extend.`
//                       : "Purchase this course to unlock all lectures."}
//                 </p>
//                 {!courseAccess.isExpired && !courseAccess.isLimitReached && (
//                   <button onClick={() => setShowPaymentModal(true)} style={styles.unlockBtn}>
//                     <FaShoppingCart /> Unlock for ₹{courseAccess.coursePrice}
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div style={{ marginBottom: "16px" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
//                     <div style={{ flex: 1 }}>
//                       <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "6px", lineHeight: 1.35 }}>
//                         {selectedLecture.title}
//                       </h2>
//                       <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", fontSize: "12px", color: "#6b7280" }}>
//                         <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//                           <FaClock size={10} /> Lecture {selectedLecture.lectureNumber}
//                         </span>
//                         {selectedLecture.duration && (
//                           <span>Duration: {selectedLecture.duration} min</span>
//                         )}
//                         {selectedLecture.subCategory && (
//                           <span style={styles.subTag}>
//                             <FaTag size={9} /> {selectedLecture.subCategory}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {completedLectures.includes(selectedLecture._id) && (
//                       <span style={styles.doneBadge}>
//                         <FaCheckCircle /> Completed
//                       </span>
//                     )}
//                   </div>

//                   <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "12px" }}>
//                     {selectedLecture.description}
//                   </p>

//                   <div style={styles.progCard}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
//                       <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
//                         <FaChartLine size={10} /> Progress
//                       </span>
//                       <span style={{ fontSize: "14px", fontWeight: 700, color: completedLectures.includes(selectedLecture._id) ? "#10b981" : "#3D1A5B" }}>
//                         {Math.round(getProgressPercent(selectedLecture._id))}%
//                       </span>
//                     </div>
//                     <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
//                       <div style={{
//                         width: `${getProgressPercent(selectedLecture._id)}%`,
//                         height: "100%",
//                         background: completedLectures.includes(selectedLecture._id) ? "#10b981" : "linear-gradient(90deg,#3D1A5B,#5E427B)",
//                         transition: "width 0.3s ease"
//                       }} />
//                     </div>
//                     {videoDuration > 0 && (
//                       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
//                         <span>{formatTime(currentVideoTime)}</span>
//                         <span>{formatTime(videoDuration)}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {(selectedLecture.videoPath || selectedLecture.video || selectedLecture.videoUrl) && (
//                   <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
//                     <SecureVideoPlayer
//                       lecture={selectedLecture}
//                       onTimeUpdate={e => setCurrentVideoTime(e.target.currentTime)}
//                       onLoadedMetadata={e => setVideoDuration(e.target.duration)}
//                       onLectureComplete={handleLectureComplete}
//                     />
//                   </div>
//                 )}

//                 {(selectedLecture.pdfPath || selectedLecture.pdf ||
//                   selectedLecture.excelPath || selectedLecture.documentPath ||
//                   selectedLecture.pptPath || selectedLecture.videoUrl) && (
//                   <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
//                     <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
//                       <FaDownload size={12} /> Lecture Resources
//                       <span style={{ marginLeft: "auto", fontSize: "10px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", fontWeight: 400 }}>
//                         <FaShieldAlt size={8} /> All files protected
//                       </span>
//                     </h3>
//                     <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//                       {(selectedLecture.pdfPath || selectedLecture.pdf) && <SecurePDFLink lecture={selectedLecture} />}
//                       {selectedLecture.excelPath && (
//                         <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534" }}>
//                           <FaFileExcel style={{ fontSize: "18px" }} />
//                           <div>
//                             <div style={{ fontWeight: "600" }}>Exercise Files (Excel)</div>
//                             <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                           </div>
//                         </div>
//                       )}
//                       {selectedLecture.documentPath && (
//                         <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", color: "#1e40af" }}>
//                           <FaFileWord style={{ fontSize: "18px" }} />
//                           <div>
//                             <div style={{ fontWeight: "600" }}>Word Document</div>
//                             <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                           </div>
//                         </div>
//                       )}
//                       {selectedLecture.pptPath && (
//                         <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", color: "#9a3412" }}>
//                           <FaFilePowerpoint style={{ fontSize: "18px" }} />
//                           <div>
//                             <div style={{ fontWeight: "600" }}>Presentation (PPT)</div>
//                             <div style={{ fontSize: "11px" }}>Contact instructor to access</div>
//                           </div>
//                         </div>
//                       )}
//                       {selectedLecture.videoUrl && (
//                         <a href={selectedLecture.videoUrl} target="_blank" rel="noreferrer"
//                           onContextMenu={e => e.preventDefault()}
//                           style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", textDecoration: "none", color: "#3D1A5B" }}>
//                           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                             <FaLink style={{ fontSize: "16px" }} />
//                             <div>
//                               <div style={{ fontWeight: "600" }}>External Video</div>
//                               <div style={{ fontSize: "11px", color: "#5E427B" }}>Watch on external platform</div>
//                             </div>
//                           </div>
//                           <FaArrowRight />
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {showPaymentModal && courseAccess.coursePrice > 0 && (
//         <div style={styles.mOverlay} onClick={() => setShowPaymentModal(false)}>
//           <div style={styles.modal} onClick={e => e.stopPropagation()}>
//             <div style={{ textAlign: "center" }}>
//               <div style={styles.lkCircle}>
//                 <FaLock style={{ fontSize: "26px", color: "#fff" }} />
//               </div>
//               <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "8px" }}>
//                 Unlock Full Access
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px", lineHeight: 1.6 }}>
//                 All lectures, resources & certificate
//               </p>
//             </div>

//             <div style={{ background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.12)", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "14px" }}>
//               <div style={{ fontSize: "11px", color: "#5E427B", fontWeight: 600, marginBottom: "4px" }}>
//                 {courseData?.title}
//               </div>
//               <div style={{ fontSize: "34px", fontWeight: 800, color: "#3D1A5B" }}>
//                 ₹{courseAccess.coursePrice}
//               </div>
//               <div style={{ fontSize: "11px", color: "#64748b" }}>
//                 One-time • Lifetime access
//               </div>
//             </div>

//             <button onClick={() => { setShowPaymentMethodsModal(true); setShowPaymentModal(false); }} style={styles.procBtn}>
//               <FaShoppingCart /> Proceed to Payment
//             </button>

//             <button onClick={() => setShowPaymentModal(false)} style={styles.ghostBtn}>
//               Cancel
//             </button>

//             <div style={styles.secNote}>
//               <FaCheckCircle style={{ color: "#059669" }} /> Secure • 30-day money-back
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Methods Modal */}
//       {showPaymentMethodsModal && courseAccess.coursePrice > 0 && (
//         <div style={styles.mOverlay} onClick={() => setShowPaymentMethodsModal(false)}>
//           <div style={styles.modal} onClick={e => e.stopPropagation()}>
//             <div style={{ textAlign: "center", marginBottom: "16px" }}>
//               <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "4px" }}>
//                 Select Payment Method
//               </h3>
//               <p style={{ fontSize: "14px", color: "#6b7280" }}>
//                 Total: <strong style={{ color: "#3D1A5B" }}>₹{courseAccess.coursePrice}</strong>
//               </p>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//               {[
//                 { method: "card", icon: "💳", label: "Card", sub: "Credit/Debit" },
//                 { method: "upi", icon: "📱", label: "UPI", sub: "UPI ID" },
//                 { method: "netbanking", icon: "🏦", label: "Net Banking", sub: "All banks" },
//                 { method: "wallet", icon: "👛", label: "Wallet", sub: "Paytm, PhonePe" }
//               ].map(({ method, icon, label, sub }) => (
//                 <button
//                   key={method}
//                   onClick={() => handlePayment(method)}
//                   disabled={processingPayment}
//                   className="pay-btn"
//                   style={{
//                     background: "#fff",
//                     border: "2px solid #e2e8f0",
//                     borderRadius: "10px",
//                     padding: "14px 10px",
//                     cursor: "pointer",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     gap: "4px",
//                     opacity: processingPayment ? 0.7 : 1
//                   }}>
//                   <div style={{ fontSize: "24px" }}>{icon}</div>
//                   <div style={{ fontWeight: 600, fontSize: "13px" }}>{label}</div>
//                   <div style={{ fontSize: "11px", color: "#64748b" }}>{sub}</div>
//                 </button>
//               ))}
//             </div>

//             {processingPayment && (
//               <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", padding: "11px", background: "rgba(61,26,91,0.05)", borderRadius: "8px" }}>
//                 <FaSpinner style={{ animation: "spin 1s linear infinite", color: "#3D1A5B" }} />
//                 <span style={{ fontSize: "13px", color: "#3D1A5B", fontWeight: 600 }}>Processing...</span>
//               </div>
//             )}

//             <button onClick={() => { setShowPaymentMethodsModal(false); setShowPaymentModal(true); }} style={styles.ghostBtn}>
//               ← Back
//             </button>

//             <div style={styles.secNote}>
//               Your payment is secure and encrypted
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         .lec-card:hover { box-shadow: 0 3px 10px rgba(61,26,91,0.1); transform: translateY(-1px); }
//         .pay-btn:hover:not(:disabled) { border-color: #3D1A5B !important; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(61,26,91,0.1); }
       
//         .secure-video-wrap:fullscreen {
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           background: #000 !important;
//           width: 100vw !important;
//           height: 100vh !important;
//           max-width: 100vw !important;
//           max-height: 100vh !important;
//           border-radius: 0 !important;
//         }
       
//         .secure-video-wrap:fullscreen canvas {
//           width: auto !important;
//           height: auto !important;
//           max-width: 100vw !important;
//           max-height: 100vh !important;
//           object-fit: contain !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// // ==========================================================
// // STYLES
// // ==========================================================
// const styles = {
//   page: { display: "flex", minHeight: "100vh", background: "#f1f5f9", position: "relative" },
//   loadWrap: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px" },
//   spin: { width: "46px", height: "46px", border: "4px solid #e5e7eb", borderTop: "4px solid #3D1A5B", borderRadius: "50%", animation: "spin 1s linear infinite" },
//   content: { flex: 1, transition: "margin-left 0.3s" },
//   main: { display: "flex", gap: "14px" },
//   toggle: { position: "fixed", top: "80px", right: "16px", zIndex: 1001, background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", borderRadius: "50%", width: "48px", height: "48px", fontSize: "17px", cursor: "pointer", boxShadow: "0 4px 12px rgba(61,26,91,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
//   backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 999 },
//   left: { width: "340px", background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", height: "calc(100vh - 40px)", overflowY: "auto", flexShrink: 0 },
//   leftM: { position: "fixed", top: "60px", right: 0, width: "300px", maxWidth: "85%", height: "calc(100vh - 60px)", zIndex: 1000, transition: "transform 0.3s ease", boxShadow: "-4px 0 20px rgba(0,0,0,0.14)" },
//   open: { transform: "translateX(0)" },
//   closed: { transform: "translateX(100%)" },
//   right: { flex: 1, background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflowY: "auto", height: "calc(100vh - 40px)", minWidth: 0 },
//   cHead: { marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" },
//   cTitle: { fontSize: "16px", fontWeight: 700, color: "#3D1A5B", marginBottom: "7px", display: "flex", alignItems: "center", gap: "7px" },
//   cMeta: { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" },
//   badge1: { display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
//   payBar: { background: "rgba(251,191,36,0.1)", border: "1px solid rgba(166,138,70,0.28)", borderRadius: "9px", padding: "11px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" },
//   buyBtn: { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "7px 12px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", whiteSpace: "nowrap" },
//   freeBar: { background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "9px", padding: "11px 13px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "9px" },
//   subH: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#3D1A5B", marginBottom: "7px", padding: "7px 10px", background: "rgba(61,26,91,0.05)", borderRadius: "6px", borderLeft: "3px solid #3D1A5B" },
//   subCnt: { background: "#3D1A5B", color: "#fff", padding: "1px 6px", borderRadius: "9px", fontSize: "10px", fontWeight: 600, marginLeft: "auto" },
//   lecCard: { padding: "11px", marginBottom: "7px", borderRadius: "8px", border: "1px solid #e5e7eb", cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.15s ease" },
//   lockedC: { opacity: 0.6, cursor: "not-allowed", background: "#fafafa" },
//   selC: { background: "rgba(61,26,91,0.05)", borderColor: "#3D1A5B", borderWidth: "2px" },
//   strip: { position: "absolute", bottom: 0, left: 0, height: "3px", transition: "width 0.3s ease" },
//   num: { width: "32px", height: "32px", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" },
//   empty: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "260px" },
//   lockedScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", textAlign: "center", padding: "30px" },
//   lkCircle: { width: "60px", height: "60px", margin: "0 auto 14px", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
//   unlockBtn: { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(166,138,70,0.28)" },
//   subTag: { background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "2px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" },
//   doneBadge: { background: "#d1fae5", color: "#065f46", padding: "4px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" },
//   progCard: { padding: "11px 13px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" },
//   mOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
//   modal: { background: "#fff", borderRadius: "14px", padding: "24px", maxWidth: "440px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
//   procBtn: { width: "100%", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", padding: "12px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(61,26,91,0.22)", marginBottom: "7px" },
//   ghostBtn: { width: "100%", background: "transparent", color: "#64748b", border: "none", padding: "9px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, fontSize: "13px", marginTop: "4px" },
//   secNote: { fontSize: "11px", color: "#64748b", textAlign: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
// };

// export default StudentLecturesPage;
















import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import {
  getProgress, trackLectureProgress, getFilteredLectures,
  canAccessCourse, getCourseById, completePaymentProcess,
  getEnrollmentStatus, recordLectureAccess,
} from "../api/api";
import {
  FaCheckCircle, FaFilePdf, FaClock, FaPlay, FaFileExcel,
  FaFileWord, FaLock, FaUnlock, FaArrowRight, FaExclamationTriangle,
  FaRupeeSign, FaShoppingCart, FaChartLine, FaBook, FaSpinner,
  FaDownload, FaLink, FaTimes, FaTag, FaGraduationCap, FaList,
  FaRedo, FaFilePowerpoint, FaShieldAlt, FaCamera, FaEyeSlash,
  FaHourglassHalf, FaStopwatch, FaInfoCircle,
} from "react-icons/fa";
import { getUserId, isAuthenticated } from "../utils/auth";
import axios from "axios";

// const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";
const BASE_URL = "https://itechskill.com";
const getAuthHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

// ==========================================================
// AccessStatusBanner
// ==========================================================
const AccessStatusBanner = ({ accessInfo, coursePrice, isMobile }) => {
  if (!accessInfo) return null;

  const {
    isExpired, isLimitReached, daysRemaining, lectureLimit,
    accessedLecturesCount, lecturesRemaining, hasAccess, endDate,
  } = accessInfo;

  if (coursePrice === 0) {
    return (
      <div style={{ background: "#d1fae5", padding: isMobile ? "10px 14px" : "12px 16px", borderRadius: "10px", marginBottom: "16px", borderLeft: "4px solid #10b981", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaUnlock style={{ color: "#059669", fontSize: "20px" }} />
        <div>
          <strong style={{ color: "#065f46" }}>Free Course</strong>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#065f46" }}>All lectures are available for free!</p>
        </div>
      </div>
    );
  }

  if (!hasAccess && !isExpired && !isLimitReached) {
    return (
      <div style={{ background: "#fee2e2", padding: isMobile ? "10px 14px" : "12px 16px", borderRadius: "10px", marginBottom: "16px", borderLeft: "4px solid #ef4444", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaLock style={{ color: "#991b1b", fontSize: "20px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Purchase Required</strong>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>This course costs ₹{coursePrice}. Purchase to unlock all lectures.</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div style={{ background: "#fee2e2", padding: isMobile ? "10px 14px" : "12px 16px", borderRadius: "10px", marginBottom: "16px", borderLeft: "4px solid #ef4444", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaHourglassHalf style={{ color: "#991b1b", fontSize: "20px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Access Expired</strong>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>Your access expired on {endDate ? new Date(endDate).toLocaleDateString() : "N/A"}. Please contact admin to renew.</p>
        </div>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div style={{ background: "#fee2e2", padding: isMobile ? "10px 14px" : "12px 16px", borderRadius: "10px", marginBottom: "16px", borderLeft: "4px solid #ef4444", display: "flex", alignItems: "center", gap: "12px" }}>
        <FaStopwatch style={{ color: "#991b1b", fontSize: "20px" }} />
        <div>
          <strong style={{ color: "#991b1b" }}>Lecture Limit Reached</strong>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#991b1b" }}>You've reached your limit of {lectureLimit} lectures. Contact admin to extend your access.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: daysRemaining !== null && daysRemaining <= 7 ? "#fed7aa" : "#dbeafe", padding: isMobile ? "10px 14px" : "12px 16px", borderRadius: "10px", marginBottom: "16px", borderLeft: `4px solid ${daysRemaining !== null && daysRemaining <= 7 ? "#f97316" : "#3b82f6"}` }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
        {daysRemaining !== null && daysRemaining > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaClock style={{ color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Time Remaining</div>
              <div style={{ fontWeight: 700, color: daysRemaining <= 7 ? "#f97316" : "#1e40af" }}>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</div>
            </div>
          </div>
        )}
        {lectureLimit !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaBook style={{ color: "#3b82f6" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Lectures Used</div>
              <div style={{ fontWeight: 700, color: "#3b82f6" }}>
                {accessedLecturesCount || 0} / {lectureLimit}
                {lecturesRemaining !== null && lecturesRemaining > 0 && (
                  <span style={{ fontSize: "11px", marginLeft: "4px", color: "#059669" }}>({lecturesRemaining} left)</span>
                )}
              </div>
            </div>
          </div>
        )}
        {endDate && daysRemaining === null && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaInfoCircle style={{ color: "#059669" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Lifetime Access</div>
              <div style={{ fontWeight: 700, color: "#059669" }}>No Expiry</div>
            </div>
          </div>
        )}
        {lectureLimit === null && daysRemaining === null && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaUnlock style={{ color: "#059669" }} />
            <div>
              <div style={{ fontSize: "11px", color: "#6b7280" }}>Full Access</div>
              <div style={{ fontWeight: 700, color: "#059669" }}>Lifetime Unlimited</div>
            </div>
          </div>
        )}
      </div>
      {endDate && daysRemaining !== null && daysRemaining > 0 && (
        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          Expires: {new Date(endDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

// ==========================================================
// useAntiCapture
// ==========================================================
const useAntiCapture = (enabled = true) => {
  const [blocked, setBlocked] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const style = document.createElement("style");
    style.id = "anti-capture-style";
    style.innerHTML = `
      .secure-content { -webkit-user-select: none; -moz-user-select: none; user-select: none; }
      @media print {
        .secure-content, .secure-video-wrap, .secure-pdf-wrap, .lecture-content-panel { display: none !important; visibility: hidden !important; }
        body::before { content: "⛔ This content is protected. Printing is not allowed."; display: block; font-size: 24px; text-align: center; padding: 60px; color: #dc2626; background: #fff; }
      }
      .secure-content * { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none !important; }
      #capture-blocker { display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.95); z-index: 99999; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
      #capture-blocker.show { display: flex; }
      @keyframes spin { to { transform: rotate(360deg); } }
      video { pointer-events: auto; }
      video::-webkit-media-controls-download-button { display: none !important; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "capture-blocker";
    overlay.innerHTML = `
      <div style="font-size:64px; color:#ef4444;">🚫</div>
      <div style="font-size:20px; font-weight:700; color:#fff;">Screen Capture Blocked</div>
      <div style="font-size:14px; color:#9ca3af; text-align:center; max-width:340px;">Recording and screenshot of course content is strictly prohibited.</div>
    `;
    document.body.appendChild(overlay);
    overlayRef.current = overlay;

    const showBlocker = (duration = 2000) => {
      overlay.classList.add("show");
      setBlocked(true);
      setTimeout(() => { overlay.classList.remove("show"); setBlocked(false); }, duration);
    };

    const handleKeyDown = (e) => {
      const blocked_combos = [
        e.key === "PrintScreen",
        e.metaKey && e.shiftKey && ["3","4","5","6"].includes(e.key),
        e.metaKey && e.shiftKey && e.key === "s",
        e.metaKey && e.key === "g",
        e.metaKey && e.altKey && e.key === "r",
        e.key === "F12",
        e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C"].includes(e.key),
        e.ctrlKey && (e.key === "u" || e.key === "U"),
        e.ctrlKey && (e.key === "s" || e.key === "S"),
      ];
      if (blocked_combos.some(Boolean)) { e.preventDefault(); e.stopPropagation(); showBlocker(1500); return false; }
    };

    const patchScreenCapture = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia = async (...args) => {
          showBlocker(3000);
          throw new DOMException("Screen capture is not allowed.", "NotAllowedError");
        };
      }
    };
    patchScreenCapture();

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", (e) => { if (e.target.closest(".secure-content")) e.preventDefault(); });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      const s = document.getElementById("anti-capture-style");
      if (s) s.remove();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }, [enabled]);

  return { blocked };
};

// ==========================================================
// useSignedUrl — ✅ FIXED: uses lecture._id only, no path needed
// ==========================================================
const useSignedUrl = (lectureId, type = "video", enabled = true) => {
  const [signedUrl, setSignedUrl] = useState(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(null);

  const fetchUrl = useCallback(async () => {
    if (!lectureId || !enabled) return;
    setUrlLoading(true); setUrlError(null);
    try {
      const endpoint = type === "pdf"
        ? `${BASE_URL}/api/lectures/stream/pdf/${lectureId}`
        : `${BASE_URL}/api/lectures/stream/video/${lectureId}`;
      const res = await axios.get(endpoint, { headers: getAuthHeader(), timeout: 10000 });
      if (res.data?.url) {
        setSignedUrl(res.data.url);
      } else {
        setUrlError("Could not load media URL. Please try again.");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setUrlError(err?.response?.data?.message || "Access denied. Please enroll first.");
      } else {
        setUrlError("Failed to load media. Please refresh.");
      }
    } finally { setUrlLoading(false); }
  }, [lectureId, type, enabled]);

  useEffect(() => {
    setSignedUrl(null); setUrlError(null);
    fetchUrl();
    const t = setInterval(fetchUrl, 90000); // refresh signed URL every 90s
    return () => clearInterval(t);
  }, [fetchUrl]);

  return { signedUrl, urlLoading, urlError, refetch: fetchUrl };
};

// ==========================================================
// CanvasVideoPlayer
// ==========================================================
const CanvasVideoPlayer = ({ src, onTimeUpdate, onLoadedMetadata, onError, userId, lectureId, onLectureComplete }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const seekRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentT, setCurrentT] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFS, setIsFS] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const controlTimer = useRef(null);
  const [completedNotified, setCompletedNotified] = useState(false);

  const drawFrame = useCallback(() => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const vw = v.videoWidth || 1280;
    const vh = v.videoHeight || 720;
    if (c.width !== vw) c.width = vw;
    if (c.height !== vh) c.height = vh;
    ctx.drawImage(v, 0, 0, vw, vh);
    const fs = Math.max(14, vw * 0.018);
    ctx.save();
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    const pillW = fs * 12;
    ctx.fillRect(12, vh - fs * 2.5, pillW, fs * 1.8);
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fs}px monospace`;
    ctx.fillText("itechskill.com", 18, vh - fs);
    ctx.restore();
    rafRef.current = v.paused ? null : requestAnimationFrame(drawFrame);
  }, []);

  const startDraw = useCallback(() => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(drawFrame); }, [drawFrame]);
  const stopDraw  = useCallback(() => { cancelAnimationFrame(rafRef.current); rafRef.current = null; }, []);

  const checkCompletion = useCallback((currentTime, videoDuration) => {
    if (completedNotified) return;
    if (videoDuration > 0 && currentTime / videoDuration >= 0.9) {
      setCompletedNotified(true);
      if (onLectureComplete) onLectureComplete();
    }
  }, [completedNotified, onLectureComplete]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay  = () => { setIsPlaying(true); startDraw(); };
    const onPause = () => { setIsPlaying(false); stopDraw(); requestAnimationFrame(() => drawFrame()); };
    const onEnded = () => { setIsPlaying(false); stopDraw(); };
    const onMeta  = (e) => {
      setDuration(v.duration);
      const c = canvasRef.current;
      if (c) { c.width = v.videoWidth || 1280; c.height = v.videoHeight || 720; }
      requestAnimationFrame(() => drawFrame());
      onLoadedMetadata?.(e);
    };
    const onTime   = (e) => {
      setCurrentT(v.currentTime);
      if (v.buffered.length) setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
      onTimeUpdate?.(e);
      checkCompletion(v.currentTime, v.duration);
    };
    const onVolChg = () => { setIsMuted(v.muted); setVolume(v.volume); };
    const noPiP    = () => { if (document.pictureInPictureElement) document.exitPictureInPicture(); };
    const noCtx    = (e) => e.preventDefault();

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("volumechange", onVolChg);
    v.addEventListener("enterpictureinpicture", noPiP);
    v.addEventListener("contextmenu", noCtx);

    return () => {
      stopDraw();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("volumechange", onVolChg);
      v.removeEventListener("enterpictureinpicture", noPiP);
      v.removeEventListener("contextmenu", noCtx);
    };
  }, [startDraw, stopDraw, drawFrame, onTimeUpdate, onLoadedMetadata, checkCompletion]);

  useEffect(() => {
    const paintBlack = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#ef4444";
      ctx.font = "20px sans-serif";
      ctx.fillText("Content Protected", c.width / 2 - 100, c.height / 2);
    };
    const triggerBlackout = () => { const v = videoRef.current; if (v && !v.paused) v.pause(); stopDraw(); paintBlack(); setShowOverlay(true); };
    const restore = () => setShowOverlay(false);
    const onVisible = () => { if (document.hidden) triggerBlackout(); };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("blur", triggerBlackout);
    window.addEventListener("focus", restore);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("blur", triggerBlackout);
      window.removeEventListener("focus", restore);
    };
  }, [stopDraw]);

  const toggleFullscreen = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!document.fullscreenElement) {
      const req = wrap.requestFullscreen || wrap.webkitRequestFullscreen || wrap.mozRequestFullScreen;
      if (req) req.call(wrap);
    } else { document.exitFullscreen?.(); }
  };

  const togglePlay = () => { const v = videoRef.current; if (!v || showOverlay) return; v.paused ? v.play() : v.pause(); resetControlTimer(); };

  const resetControlTimer = () => {
    setShowControls(true);
    clearTimeout(controlTimer.current);
    if (isFS) controlTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleSeekClick = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const bar = seekRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * duration;
  };

  const formatTime = (s) => { if (!s || isNaN(s)) return "0:00"; const m = Math.floor(s / 60), sec = Math.floor(s % 60); return `${m}:${sec.toString().padStart(2, "0")}`; };
  const pct = duration ? (currentT / duration) * 100 : 0;

  return (
    <div ref={wrapRef} className="secure-video-wrap"
      style={{ position: "relative", background: "#000", borderRadius: "12px", overflow: "hidden", width: "100%", aspectRatio: "16/9" }}
      onMouseMove={resetControlTimer}
    >
      <video ref={videoRef} src={src}
        style={{ position: "fixed", left: "-9999px", top: "-9999px", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
        disablePictureInPicture playsInline preload="auto" onError={onError}
      />
      <canvas ref={canvasRef} onClick={togglePlay} onDoubleClick={toggleFullscreen}
        style={{ width: "100%", height: "100%", display: "block", background: "#000", cursor: "pointer", objectFit: "contain" }}
      />

      {showOverlay && (
        <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 30 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FaShieldAlt style={{ fontSize: "36px", color: "#fff" }} />
          </div>
          <p style={{ color: "#fff", fontWeight: 800, fontSize: "20px", margin: 0 }}>Content Protected</p>
          <button onClick={() => setShowOverlay(false)}
            style={{ background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "9px", cursor: "pointer", fontWeight: 700 }}>
            Resume Video
          </button>
        </div>
      )}

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.9))", padding: "32px 14px 12px", zIndex: 20, opacity: showControls ? 1 : 0, transition: "opacity 0.3s" }}>
        <div ref={seekRef} onClick={handleSeekClick}
          style={{ height: "4px", background: "rgba(255,255,255,0.3)", borderRadius: "2px", cursor: "pointer", marginBottom: "12px", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${buffered}%`, background: "rgba(255,255,255,0.3)", borderRadius: "2px" }} />
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#3D1A5B,#A68A46)", borderRadius: "2px" }} />
          <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: "12px", height: "12px", background: "#fff", borderRadius: "50%", boxShadow: "0 0 5px rgba(0,0,0,0.6)", pointerEvents: "none" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={togglePlay} style={ctrlBtn}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, v.currentTime - 5); }} style={ctrlBtn}>⏪</button>
          <button onClick={() => { const v = videoRef.current; if (v) v.currentTime = Math.min(v.duration, v.currentTime + 5); }} style={ctrlBtn}>⏩</button>
          <button onClick={() => { const v = videoRef.current; if (v) v.muted = !v.muted; }} style={ctrlBtn}>{isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</button>
          <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
            onChange={(e) => { const v = videoRef.current; if (v) { v.volume = parseFloat(e.target.value); v.muted = false; } }}
            style={{ width: "65px", accentColor: "#A68A46", cursor: "pointer" }}
          />
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontFamily: "monospace" }}>{formatTime(currentT)} / {formatTime(duration)}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "3px" }}><FaShieldAlt size={8} /> Protected</span>
          <button onClick={toggleFullscreen} style={ctrlBtn}>{isFS ? "⊡" : "⛶"}</button>
        </div>
      </div>

      <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(61,26,91,0.8)", color: "#fff", padding: "3px 9px", borderRadius: "4px", fontSize: "10px", pointerEvents: "none", display: "flex", alignItems: "center", gap: "4px", zIndex: 21 }}>
        <FaShieldAlt size={8} /> itechskill.com
      </div>
    </div>
  );
};

const ctrlBtn = {
  background: "none", border: "none", color: "#fff",
  cursor: "pointer", fontSize: "18px", padding: "2px 5px",
  display: "flex", alignItems: "center", lineHeight: 1,
};

// ==========================================================
// SecureVideoPlayer — ✅ FIXED: uses hasVideo flag from backend
// ==========================================================
const SecureVideoPlayer = ({ lecture, onTimeUpdate, onLoadedMetadata, onLectureComplete }) => {
  // ✅ FIX: Check hasVideo flag (set by backend) OR legacy path fields
  // Backend now sends hasVideo: true/false instead of the actual path
  const hasVideoContent = lecture.hasVideo || lecture.videoPath || lecture.video || lecture.videoUrl;

  // ✅ FIX: Always sign by lecture ID — no longer depends on rawVideoPath existing
  const { signedUrl, urlLoading, urlError, refetch } =
    useSignedUrl(lecture._id, "video", !!hasVideoContent);

  // Fallback: if backend sends actual videoUrl (external link), use directly
  const src = signedUrl || (lecture.videoUrl?.startsWith("http") ? lecture.videoUrl : null);

  // Don't render anything if no video content at all
  if (!hasVideoContent) return null;

  if (urlLoading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "240px", background: "#111", borderRadius: "12px" }}>
      <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "#3D1A5B" }} />
      <span style={{ marginTop: "12px", fontSize: "13px", color: "#9ca3af" }}>Loading secure video...</span>
    </div>
  );

  if (urlError) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", padding: "24px" }}>
      <FaLock style={{ fontSize: "28px", color: "#ef4444", marginBottom: "10px" }} />
      <p style={{ color: "#991b1b", fontWeight: "600", textAlign: "center", marginBottom: "10px" }}>⚠️ {urlError}</p>
      <button onClick={refetch} style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#3D1A5B", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
        <FaRedo size={11} /> Retry
      </button>
    </div>
  );

  if (!src) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", background: "#fef2f2", borderRadius: "12px", border: "1px solid #fecaca", padding: "24px" }}>
      <FaSpinner style={{ animation: "spin 1s linear infinite", fontSize: "24px", color: "#3D1A5B" }} />
      <span style={{ marginTop: "12px", fontSize: "13px", color: "#9ca3af" }}>Preparing video...</span>
    </div>
  );

  return (
    <CanvasVideoPlayer
      src={src}
      userId={getUserId()}
      lectureId={lecture._id}
      onTimeUpdate={onTimeUpdate}
      onLoadedMetadata={onLoadedMetadata}
      onLectureComplete={onLectureComplete}
      onError={() => { console.warn("Video error, retrying..."); refetch(); }}
    />
  );
};

// ==========================================================
// SecurePDFLink — ✅ FIXED: uses hasPdf flag from backend
// ==========================================================
const SecurePDFLink = ({ lecture }) => {
  // ✅ FIX: Check hasPdf flag (set by backend) OR legacy path field
  const hasPdfContent = lecture.hasPdf || lecture.pdfPath || lecture.pdf;

  const { signedUrl, urlLoading, urlError, refetch } =
    useSignedUrl(lecture._id, "pdf", !!hasPdfContent);

  if (!hasPdfContent) return null;

  if (urlLoading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6b7280", padding: "12px 14px", background: "#f9fafb", borderRadius: "8px" }}>
      <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Loading PDF...
    </div>
  );

  if (urlError) return (
    <div style={{ padding: "12px 14px", color: "#991b1b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", background: "#fef2f2", borderRadius: "8px" }}>
      ⚠️ {urlError}
      <button onClick={refetch} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline", fontSize: "12px" }}>Retry</button>
    </div>
  );

  if (!signedUrl) return null;

  return (
    <a href={signedUrl} target="_blank" rel="noopener noreferrer"
      onContextMenu={e => e.preventDefault()}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", textDecoration: "none", color: "#991b1b" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaFilePdf style={{ fontSize: "18px" }} />
        <div>
          <div style={{ fontWeight: "600" }}>Lecture Notes (PDF)</div>
          <div style={{ fontSize: "11px", color: "#dc2626" }}>Secure link — expires in 5 min</div>
        </div>
      </div>
      <FaArrowRight />
    </a>
  );
};

// ==========================================================
// MAIN COMPONENT
// ==========================================================
const StudentLecturesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [lectureProgress, setLectureProgress] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [courseAccess, setCourseAccess] = useState({
    hasFullAccess: false, isPaid: false, coursePrice: 0, hasAccess: false,
    isExpired: false, isLimitReached: false, daysRemaining: null,
    lectureLimit: null, accessedLecturesCount: 0, lecturesRemaining: null, endDate: null,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLectureListOpen, setIsLectureListOpen] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [lecturesBySubcategory, setLecturesBySubcategory] = useState({});
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);
  const [recordingAccess, setRecordingAccess] = useState(false);
  const studentId = getUserId();

  useAntiCapture(false);

  useEffect(() => {
    const fn = () => {
      const m = window.innerWidth <= 768;
      setIsMobile(m);
      if (!m) { setIsMobileSidebarOpen(false); setIsLectureListOpen(false); }
    };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const courseRes = await getCourseById(courseId);
      setCourseData(courseRes?.course || courseRes);

      const fr = await getFilteredLectures(courseId);
      console.log("📋 API Response:", fr);
      console.log("📖 First lecture sample:", fr.lectures?.[0]);

      const allLectures = fr.lectures || [];
      const coursePrice = fr.coursePrice ?? courseRes?.course?.price ?? courseRes?.price ?? 0;
      const hasAccess   = fr.hasAccess || fr.hasFullAccess || coursePrice === 0;

      setLectures(allLectures);

      const grouped = {};
      allLectures.forEach(l => {
        const s = l.subCategory || "General";
        if (!grouped[s]) grouped[s] = [];
        grouped[s].push(l);
      });
      setLecturesBySubcategory(grouped);

      setCourseAccess({
        hasFullAccess:         hasAccess && !fr.isExpired && !fr.isLimitReached,
        isPaid:                fr.isPaidStudent || false,
        coursePrice,
        hasAccess,
        isExpired:             fr.isExpired || false,
        isLimitReached:        fr.isLimitReached || false,
        daysRemaining:         fr.daysRemaining ?? null,
        lectureLimit:          fr.lectureLimit ?? null,
        accessedLecturesCount: fr.accessedLecturesCount || 0,
        lecturesRemaining:     fr.lecturesRemaining ?? null,
        endDate:               fr.endDate || null,
        grantedByAdmin:        fr.grantedByAdmin || false,
      });

      const pr   = await getProgress(studentId, courseId);
      const comp = pr?.completedLectures || pr?.progress?.completedLectures || [];
      const ids  = Array.isArray(comp) ? comp.map(l => l._id || l) : [];
      setCompletedLectures(ids);
      const pd = {};
      ids.forEach(id => (pd[id] = 100));
      setLectureProgress(pd);

      if (allLectures.length > 0) {
        setSelectedLecture(allLectures[0]);
      } else {
        setSelectedLecture(null);
      }

    } catch (e) {
      console.error("❌ Load error:", e);
      alert(`Failed to load: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) { navigate("/login"); return; }
    if (studentId && courseId) loadData();
  }, [courseId, studentId, navigate]);

  const isLocked = (lecture) => {
    if (!lecture) return true;
    if (courseAccess.coursePrice === 0) return false;
    if (courseAccess.grantedByAdmin) return false;
    if (courseAccess.hasFullAccess) return false;
    return true;
  };

  const handleSelectLecture = async (lecture) => {
    if (isLocked(lecture)) { setShowPaymentModal(true); return; }

    if (courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess) {
      const alreadyAccessed = completedLectures.includes(lecture._id) || lectureProgress[lecture._id] >= 90;
      if (!alreadyAccessed && courseAccess.lectureLimit !== null) {
        if (courseAccess.accessedLecturesCount >= courseAccess.lectureLimit) {
          alert(`You have reached your lecture limit (${courseAccess.lectureLimit} lectures).`);
          return;
        }
        try {
          setRecordingAccess(true);
          const result = await recordLectureAccess(studentId, courseId, lecture._id);
          setCourseAccess(prev => ({
            ...prev,
            accessedLecturesCount: result.accessedLecturesCount,
            lecturesRemaining:     result.lecturesRemaining,
            isLimitReached:        result.isLimitReached || false,
          }));
          await loadData();
        } catch (err) {
          console.error("Failed to record access:", err);
          if (err.response?.data?.isLimitReached) { alert("Lecture limit reached!"); return; }
        } finally { setRecordingAccess(false); }
      }
    }

    setSelectedLecture(lecture);
    if (isMobile) setIsLectureListOpen(false);
  };

  const handleLectureComplete = async () => {
    if (!selectedLecture) return;
    if (completedLectures.includes(selectedLecture._id)) return;
    try {
      await trackLectureProgress(studentId, courseId, selectedLecture._id);
      setCompletedLectures(prev => [...new Set([...prev, selectedLecture._id])]);
      setLectureProgress(prev => ({ ...prev, [selectedLecture._id]: 100 }));
    } catch (err) { console.error("Failed to mark lecture complete:", err); }
  };

  const formatTime = s => { if (!s || isNaN(s)) return "0:00"; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };
  const getProgressPercent = id => completedLectures.includes(id) ? 100 : lectureProgress[id] || 0;

  const handlePayment = async method => {
    try {
      setProcessingPayment(true);
      const result = await completePaymentProcess(courseId, method, courseAccess.coursePrice);
      if (result.success) {
        alert("Payment successful! Course unlocked.");
        setShowPaymentMethodsModal(false);
        setShowPaymentModal(false);
        await loadData();
      } else { alert(result.message || "Payment failed."); }
    } catch (e) { alert(e.response?.data?.message || "Payment error."); }
    finally { setProcessingPayment(false); }
  };

  if (loading) return (
    <div style={styles.page}>
      <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      <div style={{ ...styles.loadWrap, marginLeft: isMobile ? 0 : "280px" }}>
        <div style={styles.spin} />
        <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading lectures...</p>
      </div>
    </div>
  );

  // ✅ Check for video/pdf using both new flags and legacy fields
  const lectureHasVideo = selectedLecture &&
    (selectedLecture.hasVideo || selectedLecture.videoPath || selectedLecture.video || selectedLecture.videoUrl);

  const lectureHasPdf = selectedLecture &&
    (selectedLecture.hasPdf || selectedLecture.pdfPath || selectedLecture.pdf);

  const lectureHasResources = selectedLecture && (
    lectureHasPdf ||
    selectedLecture.hasDocument || selectedLecture.documentPath ||
    selectedLecture.hasExcel    || selectedLecture.excelPath ||
    selectedLecture.hasPpt      || selectedLecture.pptPath ||
    selectedLecture.videoUrl
  );

  return (
    <div style={styles.page}>
      <StudentSidebar isMobile={isMobile} isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {isMobile && (
        <button style={styles.toggle} onClick={() => setIsLectureListOpen(v => !v)}>
          {isLectureListOpen ? <FaTimes /> : <FaList />}
        </button>
      )}

      {isMobile && isLectureListOpen && (
        <div style={styles.backdrop} onClick={() => setIsLectureListOpen(false)} />
      )}

      <div style={{ ...styles.content, marginLeft: isMobile ? 0 : "280px" }}>
        <div style={{ ...styles.main, padding: isMobile ? "80px 12px 12px" : "20px" }}>

          {/* LEFT PANEL */}
          <div style={{ ...styles.left, ...(isMobile ? { ...styles.leftM, ...(isLectureListOpen ? styles.open : styles.closed) } : {}) }}>
            <div style={styles.cHead}>
              <h1 style={styles.cTitle}><FaGraduationCap /> {courseData?.title || "Course"}</h1>
              <div style={styles.cMeta}>
                <span style={styles.badge1}>
                  {courseAccess.coursePrice === 0 ? <><FaUnlock size={10} /> FREE</> : <><FaRupeeSign size={10} /> ₹{courseAccess.coursePrice}</>}
                </span>
                <span>{lectures.length} lectures</span>
                <span style={{ color: "#10b981", fontWeight: 600 }}>{completedLectures.length} done ✓</span>
              </div>
            </div>

            {courseAccess.coursePrice > 0 && !courseAccess.hasFullAccess && !courseAccess.isExpired && (
              <div style={styles.payBar}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                    <FaExclamationTriangle style={{ color: "#92400e" }} />
                    <strong style={{ color: "#92400e" }}>Purchase Required</strong>
                  </div>
                  <div style={{ fontSize: "12px", color: "#92400e" }}>Unlock all lectures</div>
                </div>
                <button onClick={() => setShowPaymentModal(true)} style={styles.buyBtn}>
                  <FaShoppingCart size={11} /> Purchase
                </button>
              </div>
            )}

            {lectures.length > 0 && (
              <div style={{ marginBottom: "14px", padding: "10px 12px", background: "#f9fafb", borderRadius: "9px", border: "1px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6b7280", marginBottom: "5px" }}>
                  <span>Overall Progress</span>
                  <span style={{ fontWeight: 700, color: "#3D1A5B" }}>{Math.round((completedLectures.length / lectures.length) * 100)}%</span>
                </div>
                <div style={{ height: "5px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(completedLectures.length / lectures.length) * 100}%`, background: "linear-gradient(90deg,#3D1A5B,#5E427B)", transition: "width 0.5s ease" }} />
                </div>
              </div>
            )}

            {Object.keys(lecturesBySubcategory).length > 0
              ? Object.keys(lecturesBySubcategory).map(sub => (
                <div key={sub} style={{ marginBottom: "18px" }}>
                  <div style={styles.subH}>
                    <FaTag size={10} /><span>{sub}</span>
                    <span style={styles.subCnt}>{lecturesBySubcategory[sub].length}</span>
                  </div>
                  {lecturesBySubcategory[sub].map(lec => {
                    const locked = isLocked(lec);
                    const done   = completedLectures.includes(lec._id);
                    const prog   = getProgressPercent(lec._id);
                    const sel    = selectedLecture?._id === lec._id;

                    return (
                      <div key={lec._id} className="lec-card" onClick={() => handleSelectLecture(lec)}
                        style={{ ...styles.lecCard, ...(locked ? styles.lockedC : {}), ...(sel ? styles.selC : {}) }}>
                        {!locked && (
                          <div style={{ ...styles.strip, width: `${prog}%`, background: done ? "#10b981" : "#3D1A5B" }} />
                        )}
                        <div style={{ display: "flex", gap: "9px", alignItems: "flex-start" }}>
                          <div style={{ ...styles.num, background: locked ? "#f3f4f6" : done ? "#d1fae5" : "rgba(61,26,91,0.08)", color: locked ? "#9ca3af" : done ? "#10b981" : "#3D1A5B" }}>
                            {locked ? <FaLock size={11} /> : done ? <FaCheckCircle size={13} /> : lec.lectureNumber}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginBottom: "2px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 600, color: locked ? "#9ca3af" : "#111827", lineHeight: 1.4 }}>{lec.title}</span>
                              {lec.duration && (
                                <span style={{ fontSize: "11px", color: "#9ca3af", flexShrink: 0, display: "flex", alignItems: "center", gap: "2px" }}>
                                  <FaClock size={8} />{lec.duration}m
                                </span>
                              )}
                            </div>
                            {/* ✅ Show video/pdf indicator badges */}
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "3px" }}>
                              {(lec.hasVideo || lec.videoPath || lec.videoUrl) && (
                                <span style={{ fontSize: "9px", background: "rgba(61,26,91,0.08)", color: "#3D1A5B", padding: "1px 5px", borderRadius: "3px" }}>▶ Video</span>
                              )}
                              {(lec.hasPdf || lec.pdfPath) && (
                                <span style={{ fontSize: "9px", background: "#fef2f2", color: "#991b1b", padding: "1px 5px", borderRadius: "3px" }}>PDF</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
              : (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
                  <FaBook style={{ fontSize: "36px", marginBottom: "10px", opacity: 0.3 }} />
                  <p>No lectures available</p>
                </div>
              )
            }
          </div>

          {/* RIGHT PANEL */}
          <div style={styles.right} className="secure-content">
            <AccessStatusBanner accessInfo={courseAccess} coursePrice={courseAccess.coursePrice} isMobile={isMobile} />

            {!selectedLecture ? (
              <div style={styles.empty}>
                <FaPlay style={{ fontSize: "40px", opacity: 0.2, color: "#3D1A5B", marginBottom: "10px" }} />
                <p style={{ color: "#9ca3af", fontSize: "15px" }}>Select a lecture to start learning</p>
              </div>
            ) : isLocked(selectedLecture) ? (
              <div style={styles.lockedScreen}>
                <div style={styles.lkCircle}><FaLock style={{ fontSize: "30px", color: "#fff" }} /></div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b", marginBottom: "10px" }}>Lecture Locked</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", maxWidth: "400px", textAlign: "center", lineHeight: 1.7, marginBottom: "18px" }}>
                  {courseAccess.isExpired
                    ? "Your access to this course has expired. Please contact admin to renew."
                    : courseAccess.isLimitReached
                      ? `You have reached your lecture limit (${courseAccess.lectureLimit} lectures). Please contact admin to extend.`
                      : "Purchase this course to unlock all lectures."}
                </p>
                {!courseAccess.isExpired && !courseAccess.isLimitReached && (
                  <button onClick={() => setShowPaymentModal(true)} style={styles.unlockBtn}>
                    <FaShoppingCart /> Unlock for ₹{courseAccess.coursePrice}
                  </button>
                )}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "6px", lineHeight: 1.35 }}>
                        {selectedLecture.title}
                      </h2>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", fontSize: "12px", color: "#6b7280" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><FaClock size={10} /> Lecture {selectedLecture.lectureNumber}</span>
                        {selectedLecture.duration && <span>Duration: {selectedLecture.duration} min</span>}
                        {selectedLecture.subCategory && (
                          <span style={styles.subTag}><FaTag size={9} /> {selectedLecture.subCategory}</span>
                        )}
                      </div>
                    </div>
                    {completedLectures.includes(selectedLecture._id) && (
                      <span style={styles.doneBadge}><FaCheckCircle /> Completed</span>
                    )}
                  </div>

                  <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.7, marginBottom: "12px" }}>
                    {selectedLecture.description}
                  </p>

                  <div style={styles.progCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
                        <FaChartLine size={10} /> Progress
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: completedLectures.includes(selectedLecture._id) ? "#10b981" : "#3D1A5B" }}>
                        {Math.round(getProgressPercent(selectedLecture._id))}%
                      </span>
                    </div>
                    <div style={{ height: "6px", background: "#e5e7eb", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${getProgressPercent(selectedLecture._id)}%`, height: "100%", background: completedLectures.includes(selectedLecture._id) ? "#10b981" : "linear-gradient(90deg,#3D1A5B,#5E427B)", transition: "width 0.3s ease" }} />
                    </div>
                    {videoDuration > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px", color: "#9ca3af" }}>
                        <span>{formatTime(currentVideoTime)}</span>
                        <span>{formatTime(videoDuration)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ FIXED: Use lectureHasVideo which checks both hasVideo flag AND legacy fields */}
                {lectureHasVideo && (
                  <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                    <SecureVideoPlayer
                      lecture={selectedLecture}
                      onTimeUpdate={e => setCurrentVideoTime(e.target.currentTime)}
                      onLoadedMetadata={e => setVideoDuration(e.target.duration)}
                      onLectureComplete={handleLectureComplete}
                    />
                  </div>
                )}

                {/* ✅ FIXED: Use lectureHasResources which checks both new flags AND legacy fields */}
                {lectureHasResources && (
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaDownload size={12} /> Lecture Resources
                      <span style={{ marginLeft: "auto", fontSize: "10px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "4px", fontWeight: 400 }}>
                        <FaShieldAlt size={8} /> All files protected
                      </span>
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

                      {/* ✅ FIXED: Check hasPdf flag OR legacy field */}
                      {(selectedLecture.hasPdf || selectedLecture.pdfPath || selectedLecture.pdf) && (
                        <SecurePDFLink lecture={selectedLecture} />
                      )}

                      {(selectedLecture.hasExcel || selectedLecture.excelPath) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", color: "#166534" }}>
                          <FaFileExcel style={{ fontSize: "18px" }} />
                          <div><div style={{ fontWeight: "600" }}>Exercise Files (Excel)</div><div style={{ fontSize: "11px" }}>Contact instructor to access</div></div>
                        </div>
                      )}

                      {(selectedLecture.hasDocument || selectedLecture.documentPath) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", color: "#1e40af" }}>
                          <FaFileWord style={{ fontSize: "18px" }} />
                          <div><div style={{ fontWeight: "600" }}>Word Document</div><div style={{ fontSize: "11px" }}>Contact instructor to access</div></div>
                        </div>
                      )}

                      {(selectedLecture.hasPpt || selectedLecture.pptPath) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 14px", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", color: "#9a3412" }}>
                          <FaFilePowerpoint style={{ fontSize: "18px" }} />
                          <div><div style={{ fontWeight: "600" }}>Presentation (PPT)</div><div style={{ fontSize: "11px" }}>Contact instructor to access</div></div>
                        </div>
                      )}

                      {selectedLecture.videoUrl && (
                        <a href={selectedLecture.videoUrl} target="_blank" rel="noreferrer"
                          onContextMenu={e => e.preventDefault()}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.2)", borderRadius: "8px", textDecoration: "none", color: "#3D1A5B" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <FaLink style={{ fontSize: "16px" }} />
                            <div><div style={{ fontWeight: "600" }}>External Video</div><div style={{ fontSize: "11px", color: "#5E427B" }}>Watch on external platform</div></div>
                          </div>
                          <FaArrowRight />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && courseAccess.coursePrice > 0 && (
        <div style={styles.mOverlay} onClick={() => setShowPaymentModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center" }}>
              <div style={styles.lkCircle}><FaLock style={{ fontSize: "26px", color: "#fff" }} /></div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "8px" }}>Unlock Full Access</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "16px", lineHeight: 1.6 }}>All lectures, resources & certificate</p>
            </div>
            <div style={{ background: "rgba(61,26,91,0.05)", border: "1px solid rgba(61,26,91,0.12)", borderRadius: "10px", padding: "16px", textAlign: "center", marginBottom: "14px" }}>
              <div style={{ fontSize: "11px", color: "#5E427B", fontWeight: 600, marginBottom: "4px" }}>{courseData?.title}</div>
              <div style={{ fontSize: "34px", fontWeight: 800, color: "#3D1A5B" }}>₹{courseAccess.coursePrice}</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>One-time • Lifetime access</div>
            </div>
            <button onClick={() => { setShowPaymentMethodsModal(true); setShowPaymentModal(false); }} style={styles.procBtn}>
              <FaShoppingCart /> Proceed to Payment
            </button>
            <button onClick={() => setShowPaymentModal(false)} style={styles.ghostBtn}>Cancel</button>
            <div style={styles.secNote}><FaCheckCircle style={{ color: "#059669" }} /> Secure • 30-day money-back</div>
          </div>
        </div>
      )}

      {/* Payment Methods Modal */}
      {showPaymentMethodsModal && courseAccess.coursePrice > 0 && (
        <div style={styles.mOverlay} onClick={() => setShowPaymentMethodsModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#3D1A5B", marginBottom: "4px" }}>Select Payment Method</h3>
              <p style={{ fontSize: "14px", color: "#6b7280" }}>Total: <strong style={{ color: "#3D1A5B" }}>₹{courseAccess.coursePrice}</strong></p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                { method: "card",       icon: "💳", label: "Card",        sub: "Credit/Debit" },
                { method: "upi",        icon: "📱", label: "UPI",         sub: "UPI ID" },
                { method: "netbanking", icon: "🏦", label: "Net Banking", sub: "All banks" },
                { method: "wallet",     icon: "👛", label: "Wallet",      sub: "Paytm, PhonePe" },
              ].map(({ method, icon, label, sub }) => (
                <button key={method} onClick={() => handlePayment(method)} disabled={processingPayment} className="pay-btn"
                  style={{ background: "#fff", border: "2px solid #e2e8f0", borderRadius: "10px", padding: "14px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", opacity: processingPayment ? 0.7 : 1 }}>
                  <div style={{ fontSize: "24px" }}>{icon}</div>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>{sub}</div>
                </button>
              ))}
            </div>
            {processingPayment && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "12px", padding: "11px", background: "rgba(61,26,91,0.05)", borderRadius: "8px" }}>
                <FaSpinner style={{ animation: "spin 1s linear infinite", color: "#3D1A5B" }} />
                <span style={{ fontSize: "13px", color: "#3D1A5B", fontWeight: 600 }}>Processing...</span>
              </div>
            )}
            <button onClick={() => { setShowPaymentMethodsModal(false); setShowPaymentModal(true); }} style={styles.ghostBtn}>← Back</button>
            <div style={styles.secNote}>Your payment is secure and encrypted</div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .lec-card { transition: all 0.15s ease; }
        .lec-card:hover { box-shadow: 0 3px 10px rgba(61,26,91,0.1); transform: translateY(-1px); }
        .pay-btn:hover:not(:disabled) { border-color: #3D1A5B !important; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(61,26,91,0.1); }
        .secure-video-wrap:fullscreen { display: flex !important; align-items: center !important; justify-content: center !important; background: #000 !important; width: 100vw !important; height: 100vh !important; border-radius: 0 !important; }
        .secure-video-wrap:fullscreen canvas { width: auto !important; height: auto !important; max-width: 100vw !important; max-height: 100vh !important; object-fit: contain !important; }
      `}</style>
    </div>
  );
};

// ==========================================================
// STYLES
// ==========================================================
const styles = {
  page:       { display: "flex", minHeight: "100vh", background: "#f1f5f9", position: "relative" },
  loadWrap:   { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px" },
  spin:       { width: "46px", height: "46px", border: "4px solid #e5e7eb", borderTop: "4px solid #3D1A5B", borderRadius: "50%", animation: "spin 1s linear infinite" },
  content:    { flex: 1, transition: "margin-left 0.3s" },
  main:       { display: "flex", gap: "14px" },
  toggle:     { position: "fixed", top: "80px", right: "16px", zIndex: 1001, background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", borderRadius: "50%", width: "48px", height: "48px", fontSize: "17px", cursor: "pointer", boxShadow: "0 4px 12px rgba(61,26,91,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
  backdrop:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.42)", zIndex: 999 },
  left:       { width: "340px", background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", height: "calc(100vh - 40px)", overflowY: "auto", flexShrink: 0 },
  leftM:      { position: "fixed", top: "60px", right: 0, width: "300px", maxWidth: "85%", height: "calc(100vh - 60px)", zIndex: 1000, transition: "transform 0.3s ease", boxShadow: "-4px 0 20px rgba(0,0,0,0.14)" },
  open:       { transform: "translateX(0)" },
  closed:     { transform: "translateX(100%)" },
  right:      { flex: 1, background: "#fff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflowY: "auto", height: "calc(100vh - 40px)", minWidth: 0 },
  cHead:      { marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #f3f4f6" },
  cTitle:     { fontSize: "16px", fontWeight: 700, color: "#3D1A5B", marginBottom: "7px", display: "flex", alignItems: "center", gap: "7px" },
  cMeta:      { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" },
  badge1:     { display: "inline-flex", alignItems: "center", gap: "4px", background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  payBar:     { background: "rgba(251,191,36,0.1)", border: "1px solid rgba(166,138,70,0.28)", borderRadius: "9px", padding: "11px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" },
  buyBtn:     { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "7px 12px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", whiteSpace: "nowrap" },
  subH:       { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#3D1A5B", marginBottom: "7px", padding: "7px 10px", background: "rgba(61,26,91,0.05)", borderRadius: "6px", borderLeft: "3px solid #3D1A5B" },
  subCnt:     { background: "#3D1A5B", color: "#fff", padding: "1px 6px", borderRadius: "9px", fontSize: "10px", fontWeight: 600, marginLeft: "auto" },
  lecCard:    { padding: "11px", marginBottom: "7px", borderRadius: "8px", border: "1px solid #e5e7eb", cursor: "pointer", position: "relative", overflow: "hidden" },
  lockedC:    { opacity: 0.6, cursor: "not-allowed", background: "#fafafa" },
  selC:       { background: "rgba(61,26,91,0.05)", borderColor: "#3D1A5B", borderWidth: "2px" },
  strip:      { position: "absolute", bottom: 0, left: 0, height: "3px", transition: "width 0.3s ease" },
  num:        { width: "32px", height: "32px", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px" },
  empty:      { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "260px" },
  lockedScreen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", textAlign: "center", padding: "30px" },
  lkCircle:   { width: "60px", height: "60px", margin: "0 auto 14px", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  unlockBtn:  { background: "linear-gradient(135deg,#F1D572,#A68A46)", color: "#fff", border: "none", padding: "11px 22px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(166,138,70,0.28)" },
  subTag:     { background: "rgba(61,26,91,0.1)", color: "#3D1A5B", padding: "2px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, display: "flex", alignItems: "center", gap: "3px" },
  doneBadge:  { background: "#d1fae5", color: "#065f46", padding: "4px 11px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" },
  progCard:   { padding: "11px 13px", background: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" },
  mOverlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal:      { background: "#fff", borderRadius: "14px", padding: "24px", maxWidth: "440px", width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
  procBtn:    { width: "100%", background: "linear-gradient(135deg,#3D1A5B,#5E427B)", color: "#fff", border: "none", padding: "12px", borderRadius: "9px", cursor: "pointer", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(61,26,91,0.22)", marginBottom: "7px" },
  ghostBtn:   { width: "100%", background: "transparent", color: "#64748b", border: "none", padding: "9px", borderRadius: "7px", cursor: "pointer", fontWeight: 600, fontSize: "13px", marginTop: "4px" },
  secNote:    { fontSize: "11px", color: "#64748b", textAlign: "center", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" },
};

export default StudentLecturesPage;