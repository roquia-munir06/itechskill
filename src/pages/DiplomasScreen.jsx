import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getDiplomas } from "../api/api";
import EnrollmentModal from '../components/EnrollmentModal';

/* ─────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  .dp-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f4f0; min-height: 100vh; }

  /* ── HERO — same pattern as Contact/Careers hero ── */
  .dp-hero.full-width {
    width: 100vw;
    position: relative;
    left: 50%; right: 50%;
    margin-left: -50vw; margin-right: -50vw;
    background: linear-gradient(135deg, #2a043b 20%, #868528 100%);
    padding: 50px 0 40px;
    margin-bottom: 0;
    text-align: center;
  }
  .dp-hero-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    color: white;
  }
  .dp-hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #fff;
  }
  .dp-hero-subtitle {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 16px;
    opacity: 0.9;
    color: #fff;
  }
  .dp-hero-desc {
    font-size: 1.1rem;
    line-height: 1.7;
    max-width: 700px;
    margin: 0 auto 28px;
    opacity: 0.85;
    color: #fff;
  }
  .dp-hero-stats {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 14px; padding: 16px 32px;
    gap: 0; backdrop-filter: blur(10px);
    flex-wrap: wrap; justify-content: center;
  }
  .dp-hero-stat { text-align: center; padding: 0 24px; }
  .dp-hero-stat-num { font-size: 1.4rem; font-weight: 800; color: #fcd34d; display: block; line-height: 1; }
  .dp-hero-stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.6); letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; display: block; }
  .dp-hero-stat-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.2); margin: 0 4px; }

  /* ── SECTION ── */
  .dp-body { max-width: 1320px; margin: 0 auto; padding: 4rem 2rem 4rem; }

  .dp-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;
  }
  .dp-section-title {
    font-family: 'Lora', serif;
    font-size: 1.65rem; font-weight: 700; color: #0f0524;
  }
  .dp-section-title span { font-style: italic; color: #22013a; }
  .dp-pill {
    background: rgba(34,1,58,0.07); color: #22013a;
    font-size: 0.75rem; font-weight: 700;
    padding: 5px 14px; border-radius: 50px;
    border: 1px solid rgba(34,1,58,0.15);
  }

  /* ── GRID ── */
  .dp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem; }

  /* ── CARD ── */
  .dp-card {
    background: #fff; border-radius: 18px;
    border: 1px solid #ece9f1; overflow: hidden;
    cursor: pointer; display: flex; flex-direction: column;
    transition: transform 0.3s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.3s ease, border-color 0.3s ease;
    animation: fadeUp 0.45s ease both;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  .dp-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(34,1,58,0.13); border-color: rgba(34,1,58,0.25); }

  .dp-card-top {
    height: 90px;
    background: linear-gradient(135deg, #22013a 20%, #8e5203 50%, #f9f493 100%);
    position: relative; overflow: hidden;
    display: flex; align-items: flex-end;
    padding: 0 20px 14px; flex-shrink: 0;
  }
  .dp-card-top::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 85% 20%, rgba(252,211,77,0.15) 0%, transparent 55%);
    pointer-events: none;
  }
  .dp-card-top-dots { position: absolute; top: 10px; right: 16px; display: flex; gap: 5px; }
  .dp-card-top-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.2); }
  .dp-card-top-dot:first-child { background: rgba(252,211,77,0.5); }

  .dp-card-abbr {
    font-family: 'Lora', serif; font-size: 1.3rem; font-weight: 700; color: #fff;
    letter-spacing: 0.5px; position: relative; z-index: 1;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  .dp-card-cat-badge {
    position: absolute; top: 14px; left: 20px;
    background: rgba(252,211,77,0.15); border: 1px solid rgba(252,211,77,0.3);
    color: #fcd34d; font-size: 0.62rem; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase;
    padding: 3px 10px; border-radius: 50px; z-index: 1;
  }

  .dp-card-body { padding: 20px 22px 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .dp-card-title { font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 700; color: #0f0524; line-height: 1.4; margin: 0; }
  .dp-card-desc {
    font-size: 0.83rem; color: #6b7280; line-height: 1.7; font-weight: 400;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    margin: 2px 0 4px;
  }
  .dp-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 2px; }
 .dp-tag {
  font-size: 0.7rem; font-weight: 500; color: #22013a;
  background: rgba(34,1,58,0.06); border: 1px solid rgba(34,1,58,0.12);
  padding: 3px 10px; border-radius: 6px;
  white-space: nowrap; /* keep this to prevent mid-word breaks */
}

  .dp-card-foot {
    padding: 14px 22px 18px; border-top: 1px solid #f3f4f6;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .dp-card-metas { display: flex; align-items: center; gap: 12px; }
  .dp-card-meta { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #6b7280; font-weight: 500; }
  .dp-sep { width: 3px; height: 3px; border-radius: 50%; background: #d1d5db; }
  .dp-card-price { font-size: 0.9rem; font-weight: 700; color: #22013a; font-family: 'Lora', serif; }
  .dp-card-price.free { color: #16a34a; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; }

  .dp-card-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: linear-gradient(135deg, #22013a 20%, #8e5203 100%);
    color: #fff; border: none; padding: 9px 16px; border-radius: 10px;
    font-size: 0.78rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 12px rgba(34,1,58,0.2); transition: all 0.25s ease;
  }
  .dp-card:hover .dp-card-btn { box-shadow: 0 6px 20px rgba(34,1,58,0.35); transform: scale(1.03); }

  .dp-enroll-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: #22013a;
    color: #fff; border: none; padding: 9px 16px; border-radius: 10px;
    font-size: 0.78rem; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 12px rgba(5,150,105,0.3); transition: all 0.25s ease;
  }
  .dp-enroll-btn:hover { box-shadow: 0 6px 20px rgba(5,150,105,0.45); transform: scale(1.03); }

  /* ── STATES ── */
  .dp-loading { min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .dp-spin { width: 44px; height: 44px; border: 3px solid #ede8f8; border-top-color: #22013a; border-radius: 50%; animation: spin 0.85s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dp-loading p { color: #9b8db0; font-size: 0.88rem; }
  .dp-err { min-height: 50vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
  .dp-err-box { background: #fff0f0; border: 1px solid #fecaca; color: #dc2626; padding: 1.4rem 2.5rem; border-radius: 14px; font-size: 0.9rem; text-align: center; }
  .dp-empty { grid-column: 1/-1; text-align: center; padding: 5rem 2rem; }
  .dp-empty-ico { font-size: 3.5rem; display: block; margin-bottom: 1rem; opacity: 0.5; }
  .dp-empty h3 { font-family: 'Lora', serif; color: #4a3060; font-size: 1.4rem; margin-bottom: 6px; }
  .dp-empty p { color: #9b8db0; font-size: 0.88rem; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) { .dp-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); } }
  @media (max-width: 768px) {
    .dp-hero-title { font-size: 2rem; }
    .dp-hero-subtitle { font-size: 1.3rem; }
    .dp-hero-desc { font-size: 0.95rem; }
    .dp-hero-stats { padding: 12px 20px; }
    .dp-hero-stat { padding: 0 16px; }
    .dp-hero-stat-divider { display: none; }
    .dp-grid { grid-template-columns: 1fr; }
    .dp-body { padding: 3rem 1.2rem 2rem; }
  }
  @media (max-width: 480px) {
    .dp-hero-title { font-size: 1.7rem; }
    .dp-card-foot { flex-direction: column; align-items: stretch; }
    .dp-card-btn, .dp-enroll-btn { justify-content: center; }
  }
`;

const stripHtml = (html = '') =>
  html.replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s{2,}/g, ' ')
      .trim();
const getCardDesc = (html = '') => {
  const plain = stripHtml(html);
  // Cut off at "Phase 1" or "Phase:" or numbered lists
  const cutoff = plain.search(/Phase\s*\d*[:.]|Phase\s*1/i);
  const intro = cutoff > 0 ? plain.slice(0, cutoff).trim() : plain;
  // Also limit to first 160 chars
  return intro.length > 160 ? intro.slice(0, 160) + '…' : intro;
};

const getPhases = (html = '') => {
  const plain = stripHtml(html);
  const matches = [...plain.matchAll(/Phase\s*\d+[:\s]+([^\n\d]+)/gi)];
  return matches.slice(0, 3).map(m => m[1].trim().replace(/\s+/g, ' '));
};

const DiplomaCard = ({ diploma, index, onClick, onEnroll }) => {
  const abbr       = diploma.shortTitle || diploma.category || "Diploma";
  const plainDesc = getCardDesc(diploma.description);
const phases    = getPhases(diploma.description);

  return (
    <div
      className="dp-card"
      style={{ animationDelay: `${index * 65}ms` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      {/* Card Top Banner */}
      <div className="dp-card-top">
        <div className="dp-card-top-dots">
          <div className="dp-card-top-dot" />
          <div className="dp-card-top-dot" />
          <div className="dp-card-top-dot" />
        </div>
        <span className="dp-card-cat-badge">{diploma.category}</span>
        <span className="dp-card-abbr">{abbr}</span>
      </div>

      {/* Card Body */}
      <div className="dp-card-body">
        <h3 className="dp-card-title">{diploma.title}</h3>
        {/* ✅ Plain text description — no raw HTML */}
        <p className="dp-card-desc">{plainDesc || "A professional diploma program designed for career growth."}</p>
       {phases.length > 0 && (
  <div className="dp-tags">
    {phases.map((phase, i) => (
      <span key={i} className="dp-tag">
        {phase.length > 35 ? phase.slice(0, 35) + '…' : phase}
      </span>
    ))}
  </div>
)}
      </div>

      {/* Card Footer */}
      <div className="dp-card-foot">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div className="dp-card-metas">
            <span className="dp-card-meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {diploma.duration}
            </span>
            <span className="dp-sep" />
            <span className="dp-card-meta">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              {diploma.level || "All Levels"}
            </span>
          </div>
          <span className={`dp-card-price ${diploma.price === 0 ? "free" : ""}`}>
            {diploma.price === 0 ? "Free Enrollment" : `${diploma.price}-PKR`}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="dp-card-btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            View
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
          <button className="dp-enroll-btn" onClick={(e) => { e.stopPropagation(); onEnroll(); }}>
             Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

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
      <style>{CSS}</style>
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
                <span className="dp-hero-stat-label">Programs</span>
              </div>
              <div className="dp-hero-stat-divider" />
              <div className="dp-hero-stat">
                <span className="dp-hero-stat-num">12 Months</span>
                <span className="dp-hero-stat-label">Duration</span>
              </div>
              <div className="dp-hero-stat-divider" />
              <div className="dp-hero-stat">
                <span className="dp-hero-stat-num">100%</span>
                <span className="dp-hero-stat-label">Job Focused</span>
              </div>
              <div className="dp-hero-stat-divider" />
              <div className="dp-hero-stat">
                <span className="dp-hero-stat-num">Live</span>
                <span className="dp-hero-stat-label">+ Recorded</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <div className="dp-loading">
            <div className="dp-spin" />
            <p>Loading programs…</p>
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
