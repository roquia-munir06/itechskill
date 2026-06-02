import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getDiplomas } from "../api/api";
import EnrollmentModal from '../components/EnrollmentModal';
import './DiplomasScreen.css';

const DiplomaCard = ({ diploma, index, onClick, onEnroll }) => (
<div className="dp-card"
style={{ animationDelay: `${index * 65}ms` }}
onClick={onClick} role="button" tabIndex={0}>
{/* Top banner — matches course card gradient */}
<div className="dp-card-top">
<div className="dp-card-top-dots">
<div className="dp-card-top-dot" />
<div className="dp-card-top-dot" />
<div className="dp-card-top-dot" />
</div>
<span className="dp-card-cat-badge">{diploma.category}</span>
<span className="dp-card-abbr">{diploma.shortTitle || diploma.title}</span>
</div>
{/* Body */}
<div className="dp-card-body">
<div className="dp-fee-row">
<div className="dp-fee-item">
<span className="dp-fee-label">Total Fee (Installment):</span>
<span className="dp-fee-amount">
{diploma.price === 0 ? "Free" : `${diploma.price.toLocaleString()}/- PKR`}
</span>
</div>
<div className="dp-fee-item">
<span className="dp-fee-label">Course Duration:</span>
<span className="dp-fee-duration">{diploma.duration}</span>
</div>
</div>
{/* Technologies — shown exactly like course cards */}
<div className="dp-tech-section">
<p className="dp-tech-label">Technologies Covered:</p>
<div className="dp-tags">
{(diploma.technologies || []).map((tech, i) => (
<span key={i} className="dp-tag">{tech}</span>
))}
</div>
</div>
</div>
{/* Footer buttons */}
<div className="dp-card-foot">
<button className="dp-card-btn"
onClick={(e) => { e.stopPropagation(); onClick(); }}>
View Details
</button>
<button className="dp-enroll-btn"
onClick={(e) => { e.stopPropagation(); onEnroll(); }}>
Apply Now
</button>
</div>
</div>
);

const DiplomaScreen = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [diplomas, setDiplomas]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [enrollDiploma, setEnrollDiploma] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDiplomas();
        setDiplomas(data);
      } catch {
        setError("Failed to load diplomas. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <div className="dp-root">

        {/* ── HERO — matches other pages style ── */}
        <div className="dp-hero full-width">
          <div className="dp-hero-content">
            <h1 className="dp-hero-title"><i>Diploma Programs</i></h1>
            <h2 className="dp-hero-subtitle"><i>Professional Certifications Built for Your Career</i></h2>
            <p className="dp-hero-desc">
              Industry-aligned, expert-led diploma programs designed to give you real skills,
              real confidence, and a real career edge. From AI to Web Development — find your path.
            </p>
          <div className="dp-hero-stats">
  <div className="dp-hero-stat">
    <span className="dp-hero-stat-num">{diplomas.length || "—"}</span>
    <span className="dp-hero-stat-label">Diplomas</span>
  </div>
  <div className="dp-hero-stat-divider" />
  <div className="dp-hero-stat">
    <span className="dp-hero-stat-num">12 Months</span>
    <span className="dp-hero-stat-label">Duration</span>
  </div>
  {/* <div className="dp-hero-stat-divider" /> */}
  {/* <div className="dp-hero-stat">
    <span className="dp-hero-stat-num">100%</span>
    <span className="dp-hero-stat-label">Job Focused</span>
  </div> */}
  <div className="dp-hero-stat-divider" />
  <div className="dp-hero-stat">
    <span className="dp-hero-stat-num">Live</span>
    <span className="dp-hero-stat-label">+ Recorded</span>
  </div>
  {/* 👇 ADD THIS NEW STAT FOR INTERNSHIP 👇 */}
  <div className="dp-hero-stat-divider" />
  <div className="dp-hero-stat">
    <span className="dp-hero-stat-num">3 Months</span>
    <span className="dp-hero-stat-label">Internship</span>
  </div>
  {/* 👆 ADD THIS NEW STAT FOR INTERNSHIP 👆 */}
</div>

          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="dp-loading">
            <div className="dp-spin" />
            <p>Loading Diplomas…</p>
          </div>
        ) : error ? (
          <div className="dp-err">
            <div className="dp-err-box">{error}</div>
          </div>
        ) : (
          <div className="dp-body">
            <div className="dp-row">
              <h2 className="dp-section-title">All <span>Diploma</span> Programs</h2>
              <span className="dp-pill">{diplomas.length} Available</span>
            </div>
            <div className="dp-grid">
              {diplomas.length === 0 ? (
                <div className="dp-empty">
                  <span className="dp-empty-ico">📚</span>
                  <h3>No Programs Yet</h3>
                  <p>New diplomas are being added soon — check back!</p>
                </div>
              ) : (
                diplomas.map((d, i) => (
                  <DiplomaCard
                    key={d._id}
                    diploma={d}
                    index={i}
               onClick={() => navigate(`/diplomas/${d.slug}`)}
                    onEnroll={() => setEnrollDiploma(d)}
                  />
                ))
              )}
            </div>
          </div>
        )}

      </div>
      <Footer />

      {/* EnrollmentModal */}
      {enrollDiploma && (
        <EnrollmentModal
          course={{
            title:             enrollDiploma.title,
            category:          'diploma',
            installmentFee:    enrollDiploma.price === 0 ? 'Free' : `${enrollDiploma.price}-PKR`,
            installmentDollar: '',
            discountedFee:     '',
            discountedDollar:  '',
            duration:          enrollDiploma.duration,
          }}
          onClose={() => setEnrollDiploma(null)}
        />
      )}
    </>
  );
};

export default DiplomaScreen;