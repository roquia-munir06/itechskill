import React, { useState, useRef , useEffect} from 'react';
import './Careers.css';
import {
  FaUsers, FaRocket, FaGraduationCap, FaGlobe, FaHeart,
  FaLaptop, FaLightbulb, FaHandshake, FaChartLine,
  FaBalanceScale, FaSmile, FaPhone, FaWhatsapp,
  FaCheckCircle, FaTimes, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ─────────────────────────────────────────
// JOB APPLICATION MODAL
// ─────────────────────────────────────────
function JobApplicationModal({ job, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    position: job?.title || 'General Application',
    experience: '', coverLetter: '', cvLink: ''
  });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState('');
  const overlayRef              = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim())                           e.name        = 'Name is required';
    if (!form.email.trim())                          e.email       = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))       e.email       = 'Enter a valid email';
    if (!form.phone.trim())                          e.phone       = 'Phone is required';
    if (!form.experience)                            e.experience  = 'Please select experience';
    if (!form.coverLetter.trim())                    e.coverLetter = 'Please write a brief cover letter';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/careers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const inp = (hasErr) => ({
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px', borderRadius: '9px',
    border: `1.5px solid ${hasErr ? '#e11d48' : '#e5e7eb'}`,
    fontSize: '0.88rem', fontFamily: 'inherit',
    outline: 'none', background: '#fff', color: '#1a1228'
  });

  return (
    <div
      ref={overlayRef}
      onClick={e => e.target === overlayRef.current && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,0,22,0.72)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '18px',
        width: '100%', maxWidth: '520px', maxHeight: '92vh',
        overflowY: 'auto', boxShadow: '0 24px 80px rgba(34,1,58,0.45)',
        fontFamily: "'Outfit', sans-serif"
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,#22013a,#7c1abd 55%,#8e5203)',
          padding: '22px 24px 16px', borderRadius: '18px 18px 0 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.1rem', fontWeight: '700' }}>
              {job ? `Apply — ${job.title}` : 'General Application'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.78rem' }}>
              ITechSkill Careers
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              width: '32px', height: '32px', borderRadius: '8px',
              color: '#fff', cursor: 'pointer', fontSize: '0.9rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px 24px' }}>
          {!submitted ? (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                    Full Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input name="name" placeholder="e.g. Ali Hassan"
                    value={form.name} onChange={handleChange} style={inp(errors.name)} />
                  {errors.name && <span style={{ fontSize: '0.73rem', color: '#e11d48' }}>⚠ {errors.name}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                    Phone <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input name="phone" placeholder="e.g. 0330-9998880" type="tel"
                    value={form.phone} onChange={handleChange} style={inp(errors.phone)} />
                  {errors.phone && <span style={{ fontSize: '0.73rem', color: '#e11d48' }}>⚠ {errors.phone}</span>}
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                  Email <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input name="email" placeholder="e.g. ali@gmail.com" type="email"
                  value={form.email} onChange={handleChange} style={inp(errors.email)} />
                {errors.email && <span style={{ fontSize: '0.73rem', color: '#e11d48' }}>⚠ {errors.email}</span>}
              </div>

              {/* Position — readonly if specific job */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>Position</label>
                <input name="position" value={form.position}
                  readOnly={!!job}
                  onChange={handleChange}
                  style={{ ...inp(false), background: job ? '#f7f5ff' : '#fff', color: job ? '#6b21a8' : '#1a1228', fontWeight: job ? '600' : '400', border: '1.5px solid #ddd5f0' }}
                />
              </div>

              {/* Experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                  Years of Experience <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <select name="experience" value={form.experience}
                  onChange={handleChange} style={inp(errors.experience)}>
                  <option value="">Select experience level</option>
                  <option value="0-1 years">0–1 years (Fresh Graduate)</option>
                  <option value="1-2 years">1–2 years</option>
                  <option value="2-4 years">2–4 years</option>
                  <option value="4-6 years">4–6 years</option>
                  <option value="6+ years">6+ years</option>
                </select>
                {errors.experience && <span style={{ fontSize: '0.73rem', color: '#e11d48' }}>⚠ {errors.experience}</span>}
              </div>

              {/* CV Link */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                  CV / Portfolio Link <span style={{ color: '#9b8db0', fontWeight: '400', fontSize: '0.75rem' }}>(optional)</span>
                </label>
                <input name="cvLink" placeholder="e.g. linkedin.com/in/yourname or drive link"
                  value={form.cvLink} onChange={handleChange} style={inp(false)} />
              </div>

              {/* Cover Letter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#22013a' }}>
                  Cover Letter <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <textarea name="coverLetter" rows={4}
                  placeholder="Tell us why you're a great fit for this role..."
                  value={form.coverLetter} onChange={handleChange}
                  style={{ ...inp(errors.coverLetter), resize: 'vertical', minHeight: '100px' }} />
                {errors.coverLetter && <span style={{ fontSize: '0.73rem', color: '#e11d48' }}>⚠ {errors.coverLetter}</span>}
              </div>

              {error && (
                <p style={{
                  color: '#e11d48', fontSize: '0.85rem', margin: 0,
                  background: '#fff1f2', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #fca5a5'
                }}>
                  ⚠ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px', borderRadius: '10px', border: 'none',
                  background: loading ? '#9b8db0' : 'linear-gradient(135deg,#22013a,#7c1abd 55%,#8e5203)',
                  color: '#fff', fontWeight: '800', fontSize: '0.95rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', marginTop: '4px'
                }}
              >
                {loading ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>

              <p style={{ fontSize: '0.73rem', color: '#9b8db0', textAlign: 'center', margin: 0 }}>
                🔒 Your information is only used for recruitment purposes.
              </p>
            </form>
          ) : (
            /* Success Screen */
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '8px 0' }}>
              <div style={{ fontSize: '3rem' }}>🎉</div>
              <h3 style={{ color: '#22013a', margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                Application Submitted!
              </h3>
              <p style={{ color: '#4b3f6b', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                Thank you <strong>{form.name}</strong>! We received your application for <strong>{form.position}</strong>.
                Our HR team will review it and contact you within <strong>3–5 business days</strong>.
              </p>
              <a
                href={`https://wa.me/923309998880?text=${encodeURIComponent(`Hi ITechSkill! I just applied for *${form.position}*.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '12px', borderRadius: '10px', background: '#25d366',
                  color: '#fff', textDecoration: 'none', fontWeight: '700',
                  fontSize: '0.9rem', width: '100%'
                }}
              >
                <FaWhatsapp size={16} /> Follow Up on WhatsApp
              </a>
              <button
                onClick={onClose}
                style={{
                  padding: '11px', borderRadius: '10px',
                  border: '1.5px solid #ede9f8', background: '#faf5ff',
                  color: '#7c3aed', fontWeight: '700', cursor: 'pointer',
                  width: '100%', fontFamily: 'inherit'
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN CAREERS PAGE
// ─────────────────────────────────────────
const Careers = () => {
  useScrollToTop();
  const navigate        = useNavigate();
  const jobsSectionRef  = useRef(null);

  const [applyModal, setApplyModal]     = useState(null); // null | job object | 'general'
  const [expandedJob, setExpandedJob]   = useState(null); // job id | null

  const [jobOpenings, setJobOpenings] = useState([]);
const [jobsLoading, setJobsLoading] = useState(true);
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res  = await fetch(`${API_BASE}/jobs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobOpenings(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };
  fetchJobs();
}, []);
  const benefits = [
    { id: 1, title: "Competitive Salary",    description: "Industry-competitive compensation with performance bonuses", icon: <FaChartLine /> },
    { id: 2, title: "Remote First",          description: "Work from anywhere with flexible hours",                    icon: <FaGlobe /> },
    { id: 3, title: "Learning Budget",       description: "Annual budget to improve your skills",                     icon: <FaGraduationCap /> },
    { id: 4, title: "Health & Wellness",     description: "Holistic health and wellness coverage",                    icon: <FaHeart /> },
    { id: 5, title: "Tech Equipment",        description: "Newest laptop and equipment for maximum productivity",     icon: <FaLaptop /> },
    { id: 6, title: "Growth Opportunities",  description: "Transparent career progression and leadership development", icon: <FaRocket /> }
  ];

  const values = [
    { id: 1, title: "Student Success First",  description: "Every decision begins with students at the forefront.", icon: <FaUsers /> },
    { id: 2, title: "Innovate Constantly",    description: "Adopting teaching tools and styles enabled by technology.", icon: <FaLightbulb /> },
    { id: 3, title: "Collaborate Openly",     description: "Transparent communication and teamwork.", icon: <FaHandshake /> },
    { id: 4, title: "Own & Execute",          description: "Be proactive and drive excellent results.", icon: <FaBalanceScale /> },
    { id: 5, title: "Celebrate Wins",         description: "Celebrate accomplishments and have fun in the process.", icon: <FaSmile /> }
  ];

  const teamTestimonials = [
    {
      id: 1,
      text: "Working at iTechSkill gives me the opportunity to impact hundreds of students with the latest AI technology. The best of both worlds!",
      name: "Dr. Sarah Ahmed", role: "AI Instructor", tenure: "2 years"
    },
    {
      id: 2,
      text: "I have an amazing work-life balance in this remote-first culture while working on meaningful projects revolutionizing education in Pakistan.",
      name: "Hamza Malik", role: "Full Stack Developer", tenure: "1.5 years"
    }
  ];

  const scrollToJobs = () => {
    jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="careers-container">

      {/* Hero Section */}
      <div className="careers-hero-section full-width">
        <div className="careers-hero-content">
          <h1 className="careers-hero-title"><i>Build Your Career at iTechSkill</i></h1>
          <h2 className="careers-hero-subtitle"><i>Move Ahead with Pakistan's No. 1 EdTech Innovator</i></h2>
          <p className="careers-hero-description">
            Help us shape the future of education. Join a team that is developing tech education products that truly make a difference!
          </p>
          {/* Scrolls down to jobs section */}
          <button className="careers-hero-cta-button" onClick={scrollToJobs}>
            View Open Positions
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="careers-stats-section">
        <div className="careers-stats-grid">
          <div className="careers-stat-card"><h3>50+</h3><p>Team Members</p></div>
          <div className="careers-stat-card"><h3>10,000+</h3><p>Students Impacted</p></div>
          <div className="careers-stat-card"><h3>15+</h3><p>Countries Reached</p></div>
          <div className="careers-stat-card"><h3>4.8/5</h3><p>Employee Satisfaction</p></div>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="careers-why-join-section">
        <h2 className="careers-section-title">Why Join iTechSkill?</h2>
        <p className="careers-section-subtitle">
          We aren't just creating courses — we're creating careers and communities.
        </p>
        <div className="careers-benefits-grid">
          {benefits.map(b => (
            <div key={b.id} className="careers-benefit-card">
              <div className="careers-benefit-icon">{b.icon}</div>
              <h3 className="careers-benefit-title">{b.title}</h3>
              <p className="careers-benefit-description">{b.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Work Culture */}
      <div className="careers-culture-section">
        <h2 className="careers-section-title">Our Work Culture</h2>
        <div className="careers-culture-content">
          <div className="careers-culture-points">
            {[
              ["Innovative & Student-Centered", "Learners are at the heart of everything we do."],
              ["Flexible & Remote-First", "Work from anywhere and set your own schedule."],
              ["Continuous Learning", "We invest in your development with regular training."],
              ["Weekend-Only Courses Available", "Ideal for working professionals with busy weekdays."],
              ["One Month Intensive Programs", "Accelerated learning with our intensive courses."],
              ["Collaborative Team Spirit", "Empower and be supported by passionate professionals."],
              ["Impact-Driven Mission", "Every role helps change education in Pakistan."],
            ].map(([title, desc], i) => (
              <div key={i} className="careers-culture-point">
                <div className="careers-culture-bullet">●</div>
                <div><h4>{title}</h4><p>{desc}</p></div>
              </div>
            ))}
          </div>
          <div className="careers-culture-image">
            <div className="careers-placeholder-image">
              <FaUsers className="careers-team-icon" />
              <p>Our Diverse & Talented Team</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── JOB OPENINGS ── */}
      <div className="careers-jobs-section" ref={jobsSectionRef}>
        <h2 className="careers-section-title">Current Openings</h2>
        <p className="careers-section-subtitle">
          We're hiring across multiple departments. Find your perfect role below.
        </p>

        <div className="careers-jobs-grid">
  {jobsLoading ? (
    <p style={{ color: '#9b8db0', textAlign: 'center', gridColumn: '1/-1' }}>
      Loading openings...
    </p>
  ) : jobOpenings.length === 0 ? (
    <p style={{ color: '#9b8db0', textAlign: 'center', gridColumn: '1/-1' }}>
      No open positions at the moment. Check back soon!
    </p>
  ) : (
    jobOpenings.map(job => (
      <div key={job._id} className="careers-job-card">
        <div className="careers-job-header">
          <h3 className="careers-job-title">{job.title}</h3>
          <div className="careers-job-tags">
            <span className="careers-job-tag department">{job.department}</span>
            <span className="careers-job-tag type">{job.type}</span>
            <span className="careers-job-tag location">{job.location}</span>
          </div>
        </div>
        <p className="careers-job-description">{job.description}</p>
        <div className="careers-job-requirements">
          <h4>Requirements:</h4>
          <ul>
            {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </div>
        <div className="careers-job-actions">
          <button className="careers-apply-btn" onClick={() => setApplyModal(job)}>
            Apply Now
          </button>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      {/* Our Values */}
      <div className="careers-values-section">
        <h2 className="careers-section-title">Our Core Values</h2>
        <div className="careers-values-grid">
          {values.map(v => (
            <div key={v.id} className="careers-value-card">
              <div className="careers-value-icon">{v.icon}</div>
              <h3 className="careers-value-title">{v.title}</h3>
              <p className="careers-value-description">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Testimonials */}
      <div className="careers-testimonials-section">
        <h2 className="careers-section-title">Hear From Our Team</h2>
        <div className="careers-testimonials-grid">
          {teamTestimonials.map(t => (
            <div key={t.id} className="careers-testimonial-card">
              <p className="careers-testimonial-text">"{t.text}"</p>
              <div className="careers-testimonial-author">
                <h4>{t.name}</h4>
                <p>{t.role} • {t.tenure} at iTechSkill</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Process */}
      <div className="careers-process-section">
        <h2 className="careers-section-titlee">Our Hiring Process</h2>
        <div className="careers-process-steps">
          {[
            ["1", "Application Review",   "We review your resume within 3–5 business days"],
            ["2", "Initial Interview",    "30-min video call with our HR team"],
            ["3", "Technical Assessment", "Role-specific task or case study"],
            ["4", "Final Interview",      "Meet the team and department head"],
            ["5", "Offer & Onboarding",   "Welcome to the iTechSkill family!"],
          ].map(([num, title, desc]) => (
            <div key={num} className="careers-process-step">
              <div className="careers-step-number">{num}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="careers-cta-section">
        <div className="careers-cta-content">
          <h2 className="careers-cta-title">Don't See Your Perfect Role?</h2>
          <p className="careers-cta-description">
            We're always hiring great people. Submit a general application and tell us how you can help!
          </p>
          <button
            className="careers-primary-cta-btn"
            onClick={() => setApplyModal({ title: 'General Application' })}
          >
            Submit General Application
          </button>
          <p className="careers-email-cta">
            Or email us at: <a href="mailto:itechskill6@gmail.com">itechskill6@gmail.com</a>
          </p>
        </div>
      </div>

      <Footer />

      {/* Application Modal */}
      {applyModal && (
        <JobApplicationModal
          job={applyModal.title === 'General Application' ? null : applyModal}
          onClose={() => setApplyModal(null)}
        />
      )}

    </div>
  );
};

export default Careers;