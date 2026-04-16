import React, { useState, useEffect, useRef } from "react";
import "./SpinnerPopup.css";
import EnrollmentModal from './EnrollmentModal';

const SEGMENTS = [
  { label: "10%", color: "#8e35ce" },
  { label: "15%", color: "#f9f493"},
  { label: "20%", color: "#8e5203"},
  { label: "30%", color: "#666" },
  { label: "50%", color: "#c77dff" },  
  { label: "40%", color: "#868528" },
  { label: "60%", color: "#c9b1ff" },
  { label: "70%", color: "#a78abb" },
];

const SEGMENT_COUNT = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / SEGMENT_COUNT;
const WINNER_INDEX = 2; 
const SPIN_DURATION = 3500; 

const SpinnerPopup = ({ onClose }) => {
  const [phase, setPhase] = useState("wheel"); 
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCourses, setAllCourses] = useState([]);       // ← renamed
  const [selectedCourse, setSelectedCourse] = useState(null); // ← renamed, stores full object
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState(null);
  const canvasRef = useRef(null);
  const startRotationRef = useRef(0);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    drawWheel(rotation);
  }, [rotation]);

  useEffect(() => {
    fetch(`${API_BASE}/programs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAllCourses(data.data.filter(p => p.isActive !== false));
        }
      })
      .catch((err) => console.error("Failed to load courses:", err));
  }, []);

  const drawWheel = (currentRotation) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fill();

    SEGMENTS.forEach((seg, i) => {
      const startAngle = ((i * SEGMENT_ANGLE - 90 + currentRotation) * Math.PI) / 180;
      const endAngle = (((i + 1) * SEGMENT_ANGLE - 90 + currentRotation) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + (SEGMENT_ANGLE * Math.PI) / 360);
      ctx.textAlign = "right";
      ctx.fillStyle = "#1a1a2e";
      ctx.font = "bold 16px Arial, sans-serif";
      ctx.fillText(seg.label, radius - 20, 6);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#13032e";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Spin", cx, cy);
  };
  
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);

    const winnerCenterAngle = WINNER_INDEX * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const targetAngle = extraSpins * 360 + (360 - winnerCenterAngle);

    const startRot = startRotationRef.current;
    const endRot = startRot + targetAngle;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRot + (endRot - startRot) * eased;

      setRotation(currentRot % 360);
      drawWheel(currentRot % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        startRotationRef.current = endRot % 360;
        setRotation(endRot % 360);
        setSpinning(false);
        setTimeout(() => setPhase("result"), 400);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - canvas.width / 2;
    const y = e.clientY - rect.top - canvas.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    if (dist <= 60) handleSpin();
  };

  const filteredCourses = allCourses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDiscountedFee = (course) => {
    if (!course) return null;
    const raw = course.installmentFee || course.discountedFee || "";
    const numeric = parseFloat(raw.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) return null;
    return Math.round(numeric * 0.80); // 20% off
  };

  const handleApply = () => {
    if (!selectedCourse) return;
    setEnrollmentCourse({
      ...selectedCourse,
      discountPercent: 20,
      discountLabel: "🎉 Spin Wheel 20% Discount Applied!",
      // Override fee display with discounted amount
      spinDiscountedFee: getDiscountedFee(selectedCourse),
    });
    setShowEnrollment(true);
  };

  if (showEnrollment && enrollmentCourse) {
    return (
      <EnrollmentModal
        course={enrollmentCourse}
        onClose={() => {
          setShowEnrollment(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="sp-overlay" onClick={(e) => e.target.classList.contains("sp-overlay") && onClose()}>
      <div className="sp-modal">
        <button className="sp-close" onClick={onClose} aria-label="Close">✕</button>

        {phase === "wheel" ? (
          <>
            <div className="sp-header">
              <h2 className="sp-title">Try Your Luck — Spin & Grab Your Discount!</h2>
              <p className="sp-subtitle">Click the center of the wheel to spin</p>
            </div>

            <div className="sp-wheel-wrap">
              <div className="sp-pointer">▼</div>
              <canvas
                ref={canvasRef}
                width={320}
                height={320}
                className={`sp-canvas ${spinning ? "sp-spinning-cursor" : "sp-spin-cursor"}`}
                onClick={handleCanvasClick}
              />
            </div>

            {!spinning && <p className="sp-hint">👆 Click <strong>Spin</strong> in the center to try your luck!</p>}
            {spinning && <p className="sp-hint spinning-text">🌀 Spinning... good luck!</p>}
          </>
        ) : (
          <>
            <div className="sp-result-header">
              <h2 className="sp-congrats-title">Congratulations!</h2>
              <p className="sp-congrats-sub">
                You unlocked a <strong className="sp-discount-highlight">20% discount</strong>. Pick a course below.
              </p>
            </div>

            {/* Search */}
            <div className="sp-search-wrap">
              <input
                type="text"
                className="sp-search-input"
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div className="sp-diploma-list">
              {filteredCourses.length === 0 ? (
                <p className="sp-no-results">No courses found.</p>
              ) : (
                filteredCourses.map((course) => (
                  <label
                    key={course._id}
                    className={`sp-diploma-item ${selectedCourse?._id === course._id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="course"
                      value={course._id}
                      checked={selectedCourse?._id === course._id}
                      onChange={() => setSelectedCourse(course)}  
                      className="sp-radio"
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                      <span className="sp-diploma-name">{course.title}</span>
                      {course.installmentFee && (
                        <span style={{ fontSize: "0.78rem", color: "#888", marginLeft: 8, whiteSpace: "nowrap" }}>
                          {course.installmentFee}
                        </span>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>

            {selectedCourse && getDiscountedFee(selectedCourse) && (
              <div style={{
                margin: "0 16px 12px",
                padding: "10px 14px",
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                border: "1.5px solid #86efac",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#15803d", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                     20% Discount Applied
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: "0.85rem", color: "#9ca3af", textDecoration: "line-through" }}>
                      {selectedCourse.installmentFee}
                    </span>
                    <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "#15803d" }}>
                      PKR {getDiscountedFee(selectedCourse).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="sp-result-footer">
              <button className="sp-not-now" onClick={onClose}>Not now</button>
              <button
                className={`sp-apply-btn ${selectedCourse ? "active" : ""}`}
                onClick={handleApply}
                disabled={!selectedCourse}
              >
                🎓 Enroll Now with 20% Off
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpinnerPopup;