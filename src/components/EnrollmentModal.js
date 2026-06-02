import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './EnrollmentModal.css'; 
const PAYMENT_METHODS = [
  {
    id: "JazzCash", label: "JazzCash", accentColor: "#CC0000", bgLight: "#fff5f5",
    emoji: "📱",
    details: [{ label: "Account Number", value: "03445004983" }, { label: "Account Name", value: "Muhammad Altaf Khan" }],
  },
  {
    id: "Easypaisa", label: "Easypaisa", accentColor: "#00A550", bgLight: "#f0fdf4",
    emoji: "💚",
    details: [{ label: "Account Number", value: "03445004983" }, { label: "Account Name", value: "Muhammad Altaf Khan" }],
  },
  {
    id: "BankTransfer", label: "Bank Transfer", accentColor: "#003087", bgLight: "#eff6ff",
    emoji: "🏦",
    details: [
      { label: "Bank Name",     value: "Meezan Bank" },
      { label: "Account No",   value: "03120111697815" },
      { label: "Account Name", value: "Arte Analytics" },
    ],
  },
];
function EnrollmentModal({ course, onClose }) {
  const { user } = useContext(AuthContext);
const [form, setForm] = useState({
  name:         user?.fullName || user?.name || '',
  email:        user?.email    || '',
  phone:        user?.phone    || '',
  dob:          '',
  gender:       '',
  country:      '',
  interestedIn: course ? (course.category === 'diploma' ? 'Diploma' : 'Course') : '',
  program:      course?.title        || '',
  programFee:   course?.installmentFee || '',
  message:      '',
   referral: '' 
});
  const [errors, setErrors]             = useState({});
  const [submitted, setSubmitted]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [courses, setCourses]           = useState([]);
  const [diplomas, setDiplomas]         = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);
  const overlayRef = useRef(null);
const [selectedMethod, setSelectedMethod] = useState(null);
const [copiedKey,      setCopiedKey]      = useState(null);
const handleCopy = (value, key) => {
  navigator.clipboard.writeText(value);
  setCopiedKey(key);
  setTimeout(() => setCopiedKey(null), 2000);
};
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
console.log('Programs response:', progData); // ← ADD THIS
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

      // ── NEW: fetch certifications ──
      const certRes  = await fetch(`${API_BASE}/vendor-certifications`);
      const certData = await certRes.json();
      if (certData.success && Array.isArray(certData.data))
        setCertifications(certData.data.filter(c => c.isActive !== false));

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
} else if (form.interestedIn === 'Certification') {
  const found = certifications.find(c => c.title === value);
  if (found) {
    const hasDiscount = found.discountedPrice !== null && found.discountedPrice !== undefined && found.discountedPrice > 0;
    fee = hasDiscount
      ? `${found.currency || 'USD'} ${found.discountedPrice}`
      : `${found.currency || 'USD'} ${found.price ?? 0}`;  // ← ?? instead of truthy check
  }
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
if (!form.dob) {
  e.dob = 'Date of birth is required';
} else {
  const age = Math.floor((new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 10 || age > 70) e.dob = 'Age must be between 10 and 70 years';
}
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

  // ── declare finalFee BEFORE the fetch ──
  const finalFee = discountPercent > 0 && getDiscountedFee(form.programFee)
    ? `PKR ${getDiscountedFee(form.programFee).toLocaleString()} (${discountPercent}% discount from Spin Wheel. Original: ${form.programFee})`
    : form.programFee;

  try {
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, programFee: finalFee }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setErrors({ submit: data.message || 'Submission failed. Please try again.' });
      return;
    }

    setSubmitted(true);
  } catch (err) {
    console.error('Enrollment error:', err);
    setErrors({ submit: 'Network error. Please check your connection.' });
  } finally {
    setLoading(false);
  }
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
  placeholder="e.g. 03309998880" value={form.phone}
  onChange={handleChange}
  onKeyPress={(e) => {
    if (!/[0-9+\-\s]/.test(e.key)) e.preventDefault();
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData('text');
    if (!/^[0-9+\-\s]+$/.test(pasted)) e.preventDefault();
  }}
  maxLength={15}
/>
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
{/* Date of Birth */}
<div className={`am-field ${errors.dob ? 'has-error' : ''}`}>
  <label className="am-label">
    Date of Birth <span className="am-required">*</span>
  </label>

  <input
    className="am-input"
    type="date"
    name="dob"
    value={form.dob || ''}
    max={new Date().toISOString().split('T')[0]}
    min={`${new Date().getFullYear() - 70}-01-01`}
    onChange={handleChange}
  />

  {form.dob && (() => {
    const age = Math.floor(
      (new Date() - new Date(form.dob)) / (365.25 * 24 * 60 * 60 * 1000)
    );
    if (age >= 10 && age <= 70)
      return (
        <span style={{
          display: 'inline-block', marginTop: '6px',
          fontSize: '0.72rem', fontWeight: 600,
          background: '#f0fdf4', color: '#15803d',
          border: '1px solid #86efac',
          borderRadius: '20px', padding: '2px 10px'
        }}>
          ✓ Age: {age} years
        </span>
      );
    return null;
  })()}

  {errors.dob && <span className="am-error">{errors.dob}</span>}
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
  <select className="am-input" name="country" value={form.country} onChange={handleChange}>
    <option value="">Select your country</option>
    <option>Afghanistan</option>
    <option>Albania</option>
    <option>Algeria</option>
    <option>Argentina</option>
    <option>Australia</option>
    <option>Austria</option>
    <option>Azerbaijan</option>
    <option>Bahrain</option>
    <option>Bangladesh</option>
    <option>Belgium</option>
    <option>Brazil</option>
    <option>Canada</option>
    <option>China</option>
    <option>Denmark</option>
    <option>Egypt</option>
    <option>Ethiopia</option>
    <option>Finland</option>
    <option>France</option>
    <option>Germany</option>
    <option>Ghana</option>
    <option>Greece</option>
    <option>India</option>
    <option>Indonesia</option>
    <option>Iran</option>
    <option>Iraq</option>
    <option>Ireland</option>
    <option>Italy</option>
    <option>Japan</option>
    <option>Jordan</option>
    <option>Kazakhstan</option>
    <option>Kenya</option>
    <option>Kuwait</option>
    <option>Lebanon</option>
    <option>Libya</option>
    <option>Malaysia</option>
    <option>Maldives</option>
    <option>Mexico</option>
    <option>Morocco</option>
    <option>Netherlands</option>
    <option>New Zealand</option>
    <option>Nigeria</option>
    <option>Norway</option>
    <option>Oman</option>
    <option>Pakistan</option>
    <option>Palestine</option>
    <option>Philippines</option>
    <option>Poland</option>
    <option>Portugal</option>
    <option>Qatar</option>
    <option>Romania</option>
    <option>Russia</option>
    <option>Saudi Arabia</option>
    <option>Singapore</option>
    <option>Somalia</option>
    <option>South Africa</option>
    <option>South Korea</option>
    <option>Spain</option>
    <option>Sri Lanka</option>
    <option>Sudan</option>
    <option>Sweden</option>
    <option>Switzerland</option>
    <option>Syria</option>
    <option>Tanzania</option>
    <option>Thailand</option>
    <option>Tunisia</option>
    <option>Turkey</option>
    <option>Uganda</option>
    <option>Ukraine</option>
    <option>United Arab Emirates</option>
    <option>United Kingdom</option>
    <option>United States</option>
    <option>Uzbekistan</option>
    <option>Yemen</option>
    <option>Zimbabwe</option>
  </select>
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
  <option value="Certification">Certification</option>  {/* ── NEW ── */}
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
                        <option value="">select a course</option>
                        <optgroup label="Professional Courses">
                          {courses
                            .filter(c => c.category === 'professional')
                            .map(c => (
                              <option key={c._id} value={c.title}>
                                {c.title}{c.installmentFee ? ` — ${c.installmentFee}` : ''}
                              </option>
                            ))}
                        </optgroup>
                        <optgroup label="Short Courses">
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
                        <option value="">select a diploma </option>
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
{/* Certification dropdown */}
{form.interestedIn === 'Certification' && (
  <div className={`am-field ${errors.program ? 'has-error' : ''}`}>
    <label className="am-label">Select Certification <span className="am-required">*</span></label>
    {fetchingData ? (
      <select className="am-input" disabled>
        <option>Loading certifications...</option>
      </select>
    ) : (
      <select className="am-input" name="program"
        value={form.program} onChange={handleChange}>
        <option value="">Select a certification</option>
     
     
     
     
     
     
     
     
  {certifications.map(c => {
  const hasDiscount = c.discountedPrice !== null && c.discountedPrice > 0;
  const priceLabel = hasDiscount
    ? ` — ${c.currency || 'USD'} ${c.discountedPrice} (was ${c.price})`
    : c.price > 0                          // ← only show if price > 0
    ? ` — ${c.currency || 'USD'} ${c.price}`
    : '';                                  // ← hide "PKR 0"
  return (
    <option key={c._id} value={c.title}>
      {c.title}{priceLabel}
      {c.examVoucherIncluded ? ' ✓ Voucher' : ''}
    </option>
  );
})}
      </select>
    )}
    {errors.program && <span className="am-error">{errors.program}</span>}

    {/* Show exam voucher badge if selected cert includes it */}
    {form.program && (() => {
      const found = certifications.find(c => c.title === form.program);
      return found?.examVoucherIncluded ? (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          marginTop: 6, fontSize: '0.72rem', fontWeight: 700,
          background: '#f0fdf4', color: '#15803d',
          border: '1px solid #86efac', borderRadius: 20,
          padding: '3px 10px', width: 'fit-content'
        }}>
           Exam Voucher Included
        </span>
      ) : null;
    })()}
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

{/* Referral Code */}
<div className="am-field">
  <label className="am-label">
    Referral Code <span className="am-optional">(optional)</span>
  </label>
  <input
    className="am-input"
    type="text"
    name="referral"
    placeholder="Enter referral code (if any)"
    value={form.referral}
    onChange={handleChange}
  />
</div>
{errors.submit && (
  <div style={{
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: '8px', padding: '10px 14px',
    color: '#dc2626', fontSize: '0.82rem', marginBottom: '12px'
  }}>
    ❌ {errors.submit}
  </div>
)}
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
    <strong>Pay using details shown below</strong>
    <span>Use JazzCash, Easypaisa, or Bank Transfer — details are right below</span>
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
{/* ── Payment Details ── */}
<div style={{ width: '100%', marginTop: '4px' }}>
  <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#22013a', marginBottom: '10px', textAlign: 'left' }}>
    💳 Pay Now to Confirm Your Seat
  </p>

  {/* Method selector */}
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
    {PAYMENT_METHODS.map(m => (
      <button 
      type="button"   // ← ADD THIS
key={m.id}
        onClick={() => setSelectedMethod(m.id)}
        style={{
          padding: '10px 6px', borderRadius: '10px', border: `1.5px solid ${selectedMethod === m.id ? m.accentColor : '#e5e7eb'}`,
          background: selectedMethod === m.id ? m.bgLight : '#fff',
          cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '5px', transition: 'all 0.18s',
          boxShadow: selectedMethod === m.id ? `0 0 0 3px ${m.accentColor}22` : 'none',
          fontFamily: 'Outfit, sans-serif', position: 'relative',
        }}>
        <span style={{ fontSize: '1.4rem' }}>{m.emoji}</span>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151' }}>{m.label}</span>
        {selectedMethod === m.id && (
          <span style={{
            position: 'absolute', top: 5, right: 5, width: 16, height: 16,
            borderRadius: '50%', background: m.accentColor, color: '#fff',
            fontSize: '0.55rem', fontWeight: 800, display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>✓</span>
        )}
      </button>
    ))}
  </div>

  {/* Account details */}
  {selectedMethod && (() => {
    const active = PAYMENT_METHODS.find(m => m.id === selectedMethod);
    return (
      <div style={{ border: `1.5px solid ${active.accentColor}40`, borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
        {active.details.map((d, i) => {
          const copyKey = `${active.id}-${i}`;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', borderBottom: i < active.details.length - 1 ? '1px solid #f3f4f6' : 'none',
              background: i % 2 === 0 ? '#faf5ff' : '#fff',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 500 }}>{d.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1a1228' }}>{d.value}</span>
                <button type="button" onClick={() => handleCopy(d.value, copyKey)}
                  style={{
                    background: copiedKey === copyKey ? '#d1fae5' : '#f3f4f6',
                    border: 'none', cursor: 'pointer', padding: '4px 9px',
                    borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600,
                    color: copiedKey === copyKey ? '#059669' : '#6b7280',
                    fontFamily: 'Outfit, sans-serif', transition: 'all 0.18s',
                  }}>
                  {copiedKey === copyKey ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  })()}

  <div style={{
    fontSize: '0.73rem', color: '#b45309', background: '#fffbeb',
    border: '1px solid #fcd34d', borderRadius: '7px', padding: '9px 12px',
    lineHeight: 1.5, marginBottom: '12px', textAlign: 'left'
  }}>
    ⚠️ After payment, send your screenshot on WhatsApp to confirm your seat.
  </div>
</div>
                <div className="am-success-actions">
                  <a className="am-whatsapp-btn"
                    href={`https://wa.me/923309998880?text=${encodeURIComponent(
  `Hi ITechSkill! I just applied for *${form.program}*.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAge: ${form.age}\nGender: ${form.gender}\nCountry: ${form.country}\nFee: ${
    discountPercent > 0 && getDiscountedFee(form.programFee)
      ? `PKR ${getDiscountedFee(form.programFee).toLocaleString()} (${discountPercent}% Spin Wheel Discount Applied! Original: ${form.programFee})`
      : form.programFee || 'N/A'
  }${form.referral ? '\nReferral Code: ' + form.referral : ''}${form.message ? '\nMessage: ' + form.message : ''}`
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
