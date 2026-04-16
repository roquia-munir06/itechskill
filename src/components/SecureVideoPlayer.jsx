import React, { useEffect, useRef, useState, useCallback } from "react";
import API from "../api/api"; 

const SecureVideoPlayer = ({
  lectureId,
  watermarkText,
  onTimeUpdate,
  onLoadedMetadata,
  style = {},
}) => {
  const videoRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const refreshTimerRef = useRef(null);

  /* ================= TOKEN FETCH ================= */
  const fetchSecureUrl = useCallback(async () => {
    try {
      const currentTime = videoRef.current?.currentTime || 0;

      const res = await API.get(`/lectures/stream/video/${lectureId}`);
      const { url, expires } = res.data;

      setVideoUrl(url);
      setTokenExpiry(expires);
      setError("");
      setLoading(false);

      // ✅ Video jo time par tha wahan se resume karo
      if (videoRef.current && currentTime > 0) {
        videoRef.current.currentTime = currentTime;
      }

      // ✅ 80 seconds baad auto-refresh (token 90s mein expire hoga)
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        fetchSecureUrl();
      }, 80 * 1000);
    } catch (err) {
      console.error("❌ Token fetch error:", err);
      setError("Video load karne mein masla hua. Page refresh karein.");
      setLoading(false);
    }
  }, [lectureId]);

  useEffect(() => {
    fetchSecureUrl();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [fetchSecureUrl]);

  /* ================= SECURITY: Right-click + Keyboard ================= */
  useEffect(() => {
    // Right-click block
    const blockContextMenu = (e) => e.preventDefault();

    // Dangerous keyboard shortcuts block
    const blockKeys = (e) => {
      // F12 (DevTools)
      if (e.key === "F12") { e.preventDefault(); return; }
      // Ctrl+U (View Source), Ctrl+S (Save), Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && ["u", "s", "U", "S"].includes(e.key)) { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(e.key)) { e.preventDefault(); return; }
    };

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  /* ================= VIDEO ELEMENT SETUP ================= */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ✅ Download button hata do
    video.setAttribute("controlsList", "nodownload nofullscreen noremoteplayback");
    video.setAttribute("disablePictureInPicture", "true");
    video.setAttribute("disableRemotePlayback", "true");

    // ✅ Drag se video src copy na ho
    video.addEventListener("dragstart", (e) => e.preventDefault());
  }, [videoUrl]);

  if (loading) {
    return (
      <div style={styles.loadingBox}>
        <div style={styles.spinner} />
        <p style={{ color: "#a0aec0", marginTop: 12 }}>Video load ho rahi hai...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        <p style={{ color: "#fc8181" }}>⚠️ {error}</p>
        <button
          onClick={fetchSecureUrl}
          style={styles.retryBtn}
        >
          Dobara Try Karein
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.playerWrapper, ...style }}>
      {/* ✅ WATERMARK — user ka email/naam video par */}
      <div style={styles.watermarkOverlay} aria-hidden="true">
        <span style={styles.watermarkText}>{watermarkText}</span>
      </div>

      {/* ✅ Transparent overlay — right-click se video element access na ho */}
      <div
        style={styles.securityOverlay}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ✅ VIDEO ELEMENT */}
      <video
        ref={videoRef}
        key={videoUrl} // URL change hone par re-render ho
        src={videoUrl}
        controls
        autoPlay={false}
        playsInline
        style={styles.video}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onContextMenu={(e) => e.preventDefault()}
      >
        Aapka browser video support nahi karta.
      </video>

      {/* ✅ Token refresh indicator */}
      {tokenExpiry && Date.now() > tokenExpiry - 15000 && (
        <div style={styles.refreshBanner}>
          🔄 Video refresh ho rahi hai...
        </div>
      )}
    </div>
  );
};

const styles = {
  playerWrapper: {
    position: "relative",
    width: "100%",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
    userSelect: "none",    // Text select na ho
    WebkitUserSelect: "none",
    MozUserSelect: "none",
  },
  video: {
    width: "100%",
    maxHeight: "550px",
    display: "block",
    background: "#000",
    // Pointer events on (controls kaam karein), but overlay upar hai
  },
  // ✅ Transparent overlay — video par direct right-click na ho
  securityOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // Sirf upar 85% cover karo, controls chhod do
    bottom: "48px",
    zIndex: 5,
    background: "transparent",
    pointerEvents: "none", // Mouse events pass through ho — video controls kaam karein
  },
  // ✅ WATERMARK
  watermarkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: "none", // Watermark click block na kare
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: "rotate(-25deg)",
  },
  watermarkText: {
    color: "rgba(255, 255, 255, 0.12)",
    fontSize: "clamp(14px, 2.5vw, 22px)",
    fontWeight: "600",
    letterSpacing: "2px",
    whiteSpace: "nowrap",
    fontFamily: "monospace",
    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
    // Repeat watermark
    background: "repeating-linear-gradient(transparent, transparent)",
  },
  loadingBox: {
    width: "100%",
    height: "300px",
    background: "#1a1a2e",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #4a5568",
    borderTop: "3px solid #3D1A5B",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorBox: {
    width: "100%",
    padding: "30px",
    background: "#1a1a2e",
    borderRadius: "12px",
    textAlign: "center",
  },
  retryBtn: {
    marginTop: "12px",
    padding: "10px 24px",
    background: "#3D1A5B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  refreshBanner: {
    position: "absolute",
    bottom: "52px",
    left: 0,
    right: 0,
    background: "rgba(61, 26, 91, 0.85)",
    color: "#fff",
    textAlign: "center",
    padding: "6px",
    fontSize: "12px",
    zIndex: 20,
  },
};

export default SecureVideoPlayer;