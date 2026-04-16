import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './EnrollmentModal.css'; 

function EnrollmentModal({ course, onClose }) {
  const { user } = useContext(AuthContext);
const [form, setForm] = useState({
  name:         user?.fullName || user?.name || '',
  email:        user?.email    || '',
  phone:        user?.phone    || '',
  age:          '',
  gender:       '',
  country:      '',
  interestedIn: course ? (course.category === 'diploma' ? 'Diploma' : 'Course') : '',
  program:      course?.title        || '',
  programFee:   course?.installmentFee || '',
  message:      ''
});
  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [courses, setCourses]           = useState([]);
  const [diplomas, setDiplomas]         = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const overlayRef = useRef(null);

// ── Discount from Spin Wheel ──
const discountPercent = course?.discountPercent || 0;

const getDiscountedFee = (fee) => {
  if (!fee || !discountPercent) return null;
  const numeric = parseFloat(fee.replace(/[^0-9.]/g, ""));
  if (isNaN(numeric)) return null;
  return Math.round(numeric * (1 - discountPercent / 100));
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progRes  = await fetch(`${API_BASE}/programs`);
        const progData = await progRes.json();
        if (progData.success && Array.isArray(progData.data)) {
          const active       = progData.data.filter(p => p.isActive !== false);
          const professional = active.filter(p => p.category === 'professional');
          const short        = active.filter(p => p.category === 'short');
          setCourses([...professional, ...short]);
        }

        const dipRes  = await fetch(`${API_BASE}/diplomas`);
        const dipData = await dipRes.json();
        if (Array.isArray(dipData))
          setDiplomas(dipData.filter(d => d.isActive !== false));
        else if (dipData.success && Array.isArray(dipData.data))
          setDiplomas(dipData.data.filter(d => d.isActive !== false));
      } catch (err) {
        console.error('EnrollmentModal fetch error:', err);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = ''; };
  }, [onClose]);

  // ── When user picks a program auto-fill its fee ──
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'interestedIn') {
      setForm(p => ({ ...p, interestedIn: value, program: '', programFee: '' }));
    } else if (name === 'program') {
      let fee = '';
      if (form.interestedIn === 'Course') {
        const found = courses.find(c => c.title === value);
        fee = found?.installmentFee || found?.discountedFee || '';
      } else if (form.interestedIn === 'Diploma') {
        const found = diplomas.find(d => d.title === value);
        
        fee = found?.installmentFee || found?.fee ||
      (found?.price === 0 ? 'Free' : found?.price ? `PKR ${found.price}` : '');
      }
      setForm(p => ({ ...p, program: value, programFee: fee }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }

    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };
const validate = () => {
  const e = {};
  
  if (!form.email.trim())
    e.email = 'Email is required';
  else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email.trim()))
    e.email = 'Enter a valid email (e.g. ali@gmail.com)';
    if (!form.phone.trim())                            e.phone        = 'Phone is required';
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) e.phone        = 'Enter a valid phone number';
    if (!form.age || form.age < 10 || form.age > 70)  e.age          = 'Enter a valid age (10–70)';
    if (!form.gender)                                  e.gender       = 'Please select gender';
    if (!form.country.trim())                          e.country      = 'Please enter your country';
    if (!form.interestedIn)                            e.interestedIn = 'Please select type';
    if (!form.program)                                 e.program      = 'Please select a program';
    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const errs = validate();
  if (Object.keys(errs).length) { setErrors(errs); return; }
  setLoading(true);

  // ── Build final fee string with discount if applicable ──
  const finalFee = discountPercent > 0 && getDiscountedFee(form.programFee)
    ? `PKR ${getDiscountedFee(form.programFee).toLocaleString()} (${discountPercent}% discount from Spin Wheel. Original: ${form.programFee})`
    : form.programFee;

  try {
    await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, programFee: finalFee })  // ← sends discounted fee
    });
    } catch (err) {
      console.error('Enrollment error:', err);
    }
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <div className="am-overlay" ref={overlayRef}
        onClick={e => e.target === overlayRef.current && onClose()}>
        <div className="am-modal" role="dialog" aria-modal="true">

          {/* Header */}
          <div className="am-header">
            <div className="am-header-left">
              <div className="am-icon">📋</div>
              <div>
                <h2 className="am-title">Enrollment Application</h2>
                <p className="am-subtitle">ITechSkill — Fill in your details below</p>
              </div>
            </div>
            <button className="am-close" onClick={onClose} aria-label="Close">✕</button>
          </div>

          {/* Fee strip — only if opened from specific course */}
          {course?.installmentFee && (
            <div className="am-fee-strip">
              <span className="am-fee-item">💰 Installment: <strong>{course.installmentFee}</strong><span className="am-fee-usd">{course.installmentDollar}</span></span>
              <span className="am-fee-divider" />
              <span className="am-fee-item am-fee-discount">🏷️ Advance: <strong>{course.discountedFee}</strong><span className="am-fee-usd">{course.discountedDollar}</span></span>
              <span className="am-fee-divider" />
              <span className="am-fee-item">⏱ <strong>{course.duration}</strong></span>
            </div>
          )}

          <div className="am-body">
            {!submitted ? (
              <form className="am-form" onSubmit={handleSubmit} noValidate>

                {/* Name + Phone */}
                <div className="am-row">
                  <div className={`am-field ${errors.name ? 'has-error' : ''}`}>
                    <label className="am-label">Full Name <span className="am-required">*</span></label>
                    <input className="am-input" type="text" name="name"
                      placeholder="e.g. Ali Hassan" value={form.name} onChange={handleChange} />
                    {errors.name && <span className="am-error">{errors.name}</span>}
                  </div>
                  <div className={`am-field ${errors.phone ? 'has-error' : ''}`}>
                    <label className="am-label">Phone / WhatsApp <span className="am-required">*</span></label>
                    <input className="am-input" type="tel" name="phone"
                      placeholder="e.g. 0330-9998880" value={form.phone} onChange={handleChange} />
                    {errors.phone && <span className="am-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className={`am-field ${errors.email ? 'has-error' : ''}`}>
                  <label className="am-label">Email Address <span className="am-required">*</span></label>
                  <input className="am-input" type="email" name="email"
                    placeholder="e.g. ali@gmail.com" value={form.email} onChange={handleChange} />
                  {errors.email && <span className="am-error">{errors.email}</span>}
                </div>

                {/* Age + Gender */}
                <div className="am-row">
                  <div className={`am-field ${errors.age ? 'has-error' : ''}`}>
                    <label className="am-label">Age <span className="am-required">*</span></label>
                    <input className="am-input" type="number" name="age"
                      placeholder="e.g. 22" min="10" max="70"
                      value={form.age} onChange={handleChange} />
                    {errors.age && <span className="am-error">{errors.age}</span>}
                  </div>
                  <div className={`am-field ${errors.gender ? 'has-error' : ''}`}>
                    <label className="am-label">Gender <span className="am-required">*</span></label>
                    <select className="am-input" name="gender" value={form.gender} onChange={handleChange}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                    {errors.gender && <span className="am-error">{errors.gender}</span>}
                  </div>
                </div>

                {/* Country */}
                <div className={`am-field ${errors.country ? 'has-error' : ''}`}>
                  <label className="am-label">Country <span className="am-required">*</span></label>
                  <input className="am-input" type="text" name="country"
                    placeholder="e.g. Pakistan, UAE, UK..."
                    value={form.country} onChange={handleChange} />
                  {errors.country && <span className="am-error">{errors.country}</span>}
                </div>

                {/* Interested In */}
                <div className={`am-field ${errors.interestedIn ? 'has-error' : ''}`}>
                  <label className="am-label">Interested In <span className="am-required">*</span></label>
                  <select className="am-input" name="interestedIn"
                    value={form.interestedIn} onChange={handleChange}>
                    <option value="">Select type</option>
                    <option value="Course">Course</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                  {errors.interestedIn && <span className="am-error">{errors.interestedIn}</span>}
                </div>

                {/* Course dropdown with price */}
                {form.interestedIn === 'Course' && (
                  <div className={`am-field ${errors.program ? 'has-error' : ''}`}>
                    <label className="am-label">Select Course <span className="am-required">*</span></label>
                    {fetchingData ? (
                      <select className="am-input" disabled>
                        <option>Loading courses...</option>
                      </select>
                    ) : (
                      <select className="am-input" name="program"
                        value={form.program} onChange={handleChange}>
                        <option value="">— select a course —</option>
                        <optgroup label="── Professional Courses ──">
                          {courses
                            .filter(c => c.category === 'professional')
                            .map(c => (
                              <option key={c._id} value={c.title}>
                                {c.title}{c.installmentFee ? ` — ${c.installmentFee}` : ''}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="── Short Courses ──">
                          {courses
                            .filter(c => c.category === 'short')
                            .map(c => (
                              <option key={c._id} value={c.title}>
                                {c.title}{c.installmentFee ? ` — ${c.installmentFee}` : ''}
                              </option>
                            ))}
                        </optgroup>
                      </select>
                    )}
                    {errors.program && <span className="am-error">{errors.program}</span>}
                  </div>
                )}

                {/* Diploma dropdown with price */}
                {form.interestedIn === 'Diploma' && (
                  <div className={`am-field ${errors.program ? 'has-error' : ''}`}>
                    <label className="am-label">Select Diploma <span className="am-required">*</span></label>
                    {fetchingData ? (
                      <select className="am-input" disabled>
                        <option>Loading diplomas...</option>
                      </select>
                    ) : (
                      <select className="am-input" name="program"
                        value={form.program} onChange={handleChange}>
                        <option value="">— select a diploma —</option>
                        {diplomas.map(d => {
                          const fee = d.installmentFee || d.fee ||
  (d.price === 0 ? 'Free' : d.price ? `${d.price}-PKR ` : '');
                          return (
                            <option key={d._id} value={d.title}>
                              {d.title}{fee ? ` — ${fee}` : ''}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {errors.program && <span className="am-error">{errors.program}</span>}
                  </div>
                )}

              {/* Fee display box — shows after program selected */}
{form.programFee && (
  <div className="am-fee-display" style={discountPercent > 0 ? { background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1.5px solid #86efac' } : {}}>
    <div className="am-fee-display-left">
      <span className="am-fee-display-label">Program Fee</span>

      {discountPercent > 0 && getDiscountedFee(form.programFee) ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.9rem', color: '#9ca3af', textDecoration: 'line-through', fontWeight: 500 }}>
            {form.programFee}
          </span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
            PKR {getDiscountedFee(form.programFee).toLocaleString()}
          </span>
          <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, border: '1px solid #86efac' }}>
            -{discountPercent}% OFF
          </span>
        </div>
      ) : (
        <span className="am-fee-display-value">{form.programFee}</span>
      )}
    </div>

    {discountPercent > 0 ? (
      <span className="am-fee-display-badge" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
        🎉 Spin Wheel Discount!
      </span>
    ) : (
      <span className="am-fee-display-badge">💡 Payment after confirmation</span>
    )}
  </div>
)}

                {/* Message */}
                <div className="am-field">
                  <label className="am-label">Message <span className="am-optional">(optional)</span></label>
                  <textarea className="am-input am-textarea" name="message"
                    placeholder="Any questions or preferred batch timing..."
                    value={form.message} onChange={handleChange} rows={3} />
                </div>

                <button type="submit"
                  className={`am-submit ${loading ? 'am-loading' : ''}`}
                  disabled={loading}>
                  {loading ? <span className="am-spinner" /> : '🚀 Submit Application'}
                </button>
                <p className="am-privacy">🔒 Your information is safe and only used for enrollment purposes.</p>
              </form>

            ) : (
              /* ── SUCCESS SCREEN with Next Steps ── */
              <div className="am-success">
                <div className="am-success-icon">🎉</div>
                <h3 className="am-success-title">Application Submitted!</h3>
                <p className="am-success-msg">
                  Thank you <strong>{form.name}</strong>! Your application for{' '}
                  <strong>{form.program}</strong> has been received.
                  {form.programFee && (
  discountPercent > 0 && getDiscountedFee(form.programFee)
    ? <> Your discounted fee is <strong style={{ color: '#15803d' }}>PKR {getDiscountedFee(form.programFee).toLocaleString()}</strong> 🎉 ({discountPercent}% spin wheel discount applied!)</>
    : <> The fee for this program is <strong>{form.programFee}</strong>.</>
)}
                </p>

                {/* Next Steps */}
                <div className="am-steps">
                  <p className="am-steps-title">What happens next?</p>

                  <div className="am-step">
                    <div className="am-step-num">1</div>
                    <div className="am-step-text">
                      <strong>Our team reviews your application</strong>
                      <span>We'll contact you at <strong>{form.phone}</strong> or <strong>{form.email}</strong> within 24 hours</span>
                    </div>
                  </div>

                  <div className="am-step">
                    <div className="am-step-num">2</div>
                    <div className="am-step-text">
                      <strong>Seat confirmation & payment details</strong>
                      <span>We'll share our JazzCash / Easypaisa / bank account details with you</span>
                    </div>
                  </div>

                  <div className="am-step">
                    <div className="am-step-num">3</div>
                    <div className="am-step-text">
                      <strong>Make payment & send screenshot</strong>
                      <span>Send your payment proof via WhatsApp to confirm your seat</span>
                    </div>
                  </div>

                  <div className="am-step">
                    <div className="am-step-num am-step-num-last">4</div>
                    <div className="am-step-text">
                      <strong>Get course access</strong>
                      <span>Your account will be activated and you'll receive login credentials</span>
                    </div>
                  </div>
                </div>

                <div className="am-success-actions">
                  <a className="am-whatsapp-btn"
                    href={`https://wa.me/923309998880?text=${encodeURIComponent(
  `Hi ITechSkill! I just applied for *${form.program}*.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAge: ${form.age}\nGender: ${form.gender}\nCountry: ${form.country}\nFee: ${
    discountPercent > 0 && getDiscountedFee(form.programFee)
      ? `PKR ${getDiscountedFee(form.programFee).toLocaleString()} (${discountPercent}% Spin Wheel Discount Applied! Original: ${form.programFee})`
      : form.programFee || 'N/A'
  }${form.message ? '\nMessage: ' + form.message : ''}`
)}`}
                    target="_blank" rel="noopener noreferrer">
                    📲 Message Us on WhatsApp
                  </a>
                  <button className="am-close-btn" onClick={onClose}>Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EnrollmentModal;
