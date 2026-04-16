import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import '../components/Footer.css';
import EnrollmentModal from '../components/EnrollmentModal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function CourseDetail_Screen() {
  const { slug } = useParams();
  const navigate                  = useNavigate();
  const [course, setCourse]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
const { user } = useContext(AuthContext);



useEffect(() => {
  window.scrollTo(0, 0);
  (async () => {
    try {
      const res = await fetch(`${API_BASE}/programs/slug/${slug}`);
      
      console.log('Status:', res.status);
      console.log('URL hit:', `${API_BASE}/programs/slug/${slug}`);
      
      const text = await res.text(); // Read as text first
      console.log('Raw response:', text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Response is not JSON:', text.substring(0, 500));
        setError(true);
        setLoading(false);
        return;
      }
      
      if (data.success && data.data) {
        setCourse(data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  })();
}, [slug]);

if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '4px solid #ede9f8', borderTopColor: '#22013a', animation: 'spin 0.8s linear infinite', marginBottom: '14px' }} />
      <p style={{ color: '#8e5203', fontWeight: '600' }}>Loading…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !course) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}></div>
      <h2 style={{ color: '#22013a', marginBottom: '8px' }}>Course Not Found</h2>
      
    </div>
  );

  const headerColor = course.color || '#22013a';

  const description =
    course.description ||
    course.overview    ||
    course.details     ||
    course.content     ||
    course.body        ||
    course.courseDescription ||
    course.desc        ||
    '';
  const hasContent = description && description.replace(/<[^>]*>/g, '').trim().length > 0;
return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; }

        .cd-page { background: #f5f4f0; min-height: 100vh; }
        .cd-wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 60px 80px;
          font-family: 'Segoe UI', sans-serif;
        }
        .cd-title {
          font-size: 34px;
          font-weight: 800;
          color: #22013a;
          margin: 0 0 36px;
          line-height: 1.25;
        }

        .course-desc { width: 100%; font-size: 17px !important; }
        .course-desc * { font-size: inherit; }
      .course-desc p { font-size: 17px !important; color: #374151; line-height: 1.9; margin: 0 0 8px; }
.course-desc p:empty { display: none; }
.course-desc p br:only-child { display: none; }
.course-desc br + br { display: none; }
.course-desc h1 { font-size: 32px !important; font-weight: 800; color: #22013a; margin: 16px 0 6px; line-height: 1.3; }
.course-desc h2 { font-size: 26px !important; font-weight: 700; color: #22013a; margin: 16px 0 6px; line-height: 1.3; }
.course-desc h3 { font-size: 21px !important; font-weight: 700; color: #3d1a5b; margin: 14px 0 5px; }
.course-desc h4 { font-size: 18px !important; font-weight: 700; color: #3d1a5b; margin: 12px 0 4px; }
        .course-desc span { font-size: 17px !important; }
        .course-desc div { font-size: 17px !important; }
        .course-desc ul { padding-left: 1.6em; margin: 10px 0 16px; list-style-type: disc; }
        .course-desc ol { padding-left: 1.6em; margin: 10px 0 16px; list-style-type: decimal; }
        .course-desc li { font-size: 17px !important; color: #374151; line-height: 1.85; margin-bottom: 8px; }
        .course-desc strong { font-weight: 700; color: #1a1228; }
        .course-desc em { font-style: italic; }
        .course-desc u  { text-decoration: underline; }
        .course-desc s  { text-decoration: line-through; }
        .course-desc blockquote {
          border-left: 4px solid #7c1abd; margin: 20px 0; padding: 14px 22px;
          background: #faf5ff; color: #4b3f6b; border-radius: 0 8px 8px 0;
          font-size: 17px !important; line-height: 1.75;
        }
        .course-desc a { color: #7c1abd; text-decoration: underline; }
        .course-desc a:hover { color: #22013a; }
        .course-desc iframe, .course-desc video {
          display: block; max-width: 100%; width: 100%;
          border-radius: 10px; margin: 20px auto;
        }
       .course-desc img {
  display: block !important;
  max-width: 100% !important;
  margin: 16px auto !important;
  border-radius: 8px;
  float: none !important;
}
        .course-desc font[size="1"] { font-size: 10px !important; }
        .course-desc font[size="2"] { font-size: 13px !important; }
        .course-desc font[size="3"] { font-size: 17px !important; }
        .course-desc font[size="4"] { font-size: 20px !important; }
        .course-desc font[size="5"] { font-size: 24px !important; }
        .course-desc font[size="6"] { font-size: 30px !important; }
        .course-desc font[size="7"] { font-size: 40px !important; }
        .course-desc .ql-indent-1 { padding-left: 3em; }
        .course-desc .ql-indent-2 { padding-left: 6em; }
        .course-desc .ql-indent-3 { padding-left: 9em; }

        @media (max-width: 900px) {
          .cd-wrap { padding: 32px 28px 60px; }
          .cd-title { font-size: 26px; }
        }
        @media (max-width: 640px) {
          .cd-wrap { padding: 24px 16px 60px; }
          .cd-title { font-size: 22px; }
        }
      `}</style>

      <div className="cd-page">
        <div className="cd-wrap">
          <h1 className="cd-title">{course.title}</h1>
          {hasContent
            ? <div className="course-desc" dangerouslySetInnerHTML={{ __html: description }} />
            : <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '17px' }}>No description available for this course yet.</p>
          }
          {/* ── Enrollment CTA ── */}
<div style={{
  marginTop: '48px',
  padding: '36px 40px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #22013a 0%, #7c1abd 55%, #8e5203 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '20px',
  boxShadow: '0 8px 32px rgba(34,1,58,0.25)',
}}>
  <div>
    <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.3rem', fontWeight: '800' }}>
      Ready to enroll in {course.title}?
    </h3>
    <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.9rem' }}>
      💰 Fee: <strong style={{ color: '#fff' }}>{course.installmentFee}</strong>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      🏷️ Advance: <strong style={{ color: '#4ade80' }}>{course.discountedFee}</strong>
      &nbsp;&nbsp;|&nbsp;&nbsp;
      ⏱ {course.duration}
    </p>
  </div>
 <button
  onClick={() => setApplyOpen(true)}
  style={{
    padding: '14px 32px',
    borderRadius: '10px',
    border: '2px solid rgba(255,255,255,0.3)',
    background: '#fff',
    color: '#22013a',
    fontWeight: '800',
    fontSize: '1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  }}
  onMouseEnter={e => { e.target.style.background = '#f3f0ff'; e.target.style.transform = 'translateY(-2px)'; }}
  onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.transform = 'translateY(0)'; }}
>
   Apply Now
</button>
</div>
        </div>
      </div>

      <Footer />
      {applyOpen && (
  <EnrollmentModal
    course={{
      ...course,
      category: 'professional',       // tells modal this is a Course
      installmentFee:  course.installmentFee  || '',
      installmentDollar: course.installmentDollar || '',
      discountedFee:   course.discountedFee   || '',
      discountedDollar: course.discountedDollar || '',
      duration:        course.duration        || '',
    }}
    onClose={() => setApplyOpen(false)}
  />
)}
    </>
  );
}