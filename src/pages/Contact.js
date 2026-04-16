import React, { useState } from 'react';
import './Contact.css';
import { FaEnvelope, FaPhone, FaWhatsapp, FaGlobe, FaClock, FaMapMarkerAlt,FaUserGraduate, FaQuestionCircle, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import Footer from '../components/Footer';
import EnrollmentModal from '../components/EnrollmentModal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import API from '../api/api';
const Contact = () => {
  useScrollToTop();

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    country: '', subject: '', message: ''
  });
  const [submitted, setSubmitted]             = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState('');
  const [showEnrollModal, setShowEnrollModal] = useState(false);


  const contactMethods = [
    {
      id: 1, title: "Email Us", info: "itechskill6@gmail.com",
      description: "General inquiries and course information",
      icon: <FaEnvelope />, color: "#22013a", link: "mailto:itechskill6@gmail.com"
    },
    {
      id: 2, title: "Call Us", info: "+92 330 9998880",
      description: "Monday - Saturday, 10 AM - 7 PM PKT",
      icon: <FaPhone />, color: "#8e5203", link: "tel:+923309998880"
    },
    {
      id: 3, title: "WhatsApp", info: "+92 330 9998880",
      description: "Quick queries and instant support",
      icon: <FaWhatsapp />, color: "#25D366", link: "https://wa.me/923309998880"
    },
    {
      id: 4, title: "Visit Website", info: "https://itechskill.com",
      description: "Explore courses and resources",
      icon: <FaGlobe />, color: "#22013a", link: "https://itechskill.com", target: "_blank"
    },
    {
  id: 5, title: "Visit Us", info: "Office No. S-10, Malikabad Shopping Mall, Rahmanabad, Rawalpindi, Pakistan",
  description: "Come visit us in person during business hours",
  icon: <FaMapMarkerAlt />, color: "#8e5203"
}
  ];

  const contactReasons = [
    { id: 1, reason: "Course Admissions & Enrollment" },
    { id: 2, reason: "Certification & Course Details" },
    { id: 3, reason: "Payment & Fee Structure" },
    { id: 4, reason: "Technical Support and Platform Access" },
    { id: 5, reason: "Career Guidance & Counseling" },
    { id: 6, reason: "Corporate Training Programs" },
    { id: 7, reason: "Partnership & Collaboration" },
    { id: 8, reason: "Feedback & Suggestions" }
  ];

  const faqs = [
    {
      id: 1,
      question: "What are the admission requirements?",
      answer: "The essential requirements are: 1) One must possess matriculation or equivalent, 2) Basic knowledge of computer, 3) A valid Email-Id and mobile Number. Certain courses may have additional prerequisites."
    },
    {
      id: 2,
      question: "How many hours does a course take?",
      answer: "Programs durations are different: Short Term (2 months), Standard Programmes (3 months), Advance Courses (4-6 months). Most courses offer flexible pacing."
    },
    {
      id: 3,
      question: "Are certifications internationally recognized?",
      answer: "Yes! Our qualifications are accredited by employers and industry worldwide. They are tools that focus on the practical skills employers want."
    },
    {
      id: 4,
      question: "How do I pay you?",
      answer: "We take: Bank Transfer, EasyPaisa, JazzCash, Credit/Debit and installment plans on most courses."
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  try {
    const { data } = await API.post('/contact', formData);
    if (data.success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', country: '', subject: '', message: '' });
    } else {
      setError('Failed to send message. Please try again.');
    }
  } catch (err) {
    console.error('Contact form error:', err);
    setError('Server error. Please try WhatsApp or email directly.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="contact-container">

      {/* Hero Section */}
      <div className="contact-hero-section full-width">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title"><i>Contact iTechSkill</i></h1>
          <h2 className="contact-hero-subtitle"><i>We're Here So You Can Succeed</i></h2>
          <p className="contact-hero-description">
            Questions about programs, applications, certifications or learning experience? New to tech and looking for a friendly community? We're here for you!
          </p>
          <p className="contact-hero-description">
            At iTechSkill, communication matters. We mentor you, answer your questions and point you in the right direction when it comes to finding the best learning path for your goals.
          </p>
        </div>
      </div>

      {/* Contact Methods Grid */}
      <div className="contact-methods-section">
        <h2 className="contact-section-title">Get in Touch With Us</h2>
        <div className="contact-methods-grid">
          {contactMethods.map(method => (
            <div key={method.id} className="contact-method-card">
              <div className="contact-method-icon" style={{ backgroundColor: method.color }}>
                {method.icon}
              </div>
              <h3 className="contact-method-title">{method.title}</h3>
              <a
                href={method.link}
                target={method.target || '_self'}
                rel={method.target === '_blank' ? 'noopener noreferrer' : ''}
                className="contact-method-info-link"
              >
                {method.info}
              </a>
              <p className="contact-method-description">{method.description}</p>
              {method.id === 3 && (
                <a
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp-link"
                >
                  Start Chat on WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="contact-business-hours">
          <FaClock className="contact-hours-icon" />
          <div className="contact-hours-content">
            <h4>Business Hours</h4>
            <p>Monday - Saturday | 10:00 AM - 7:00 PM (PKT)</p>
            <p className="contact-hours-note">Closed on Sundays and Public Holidays</p>
          </div>
        </div>
      </div>

      {/* Contact Form & Reasons */}
      <div className="contact-form-section">
        <div className="contact-form-container">
          <div className="contact-form-header">
            <h2 className="contact-form-title">Send Us a Message</h2>
            <p className="contact-form-subtitle">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          {submitted ? (
            <div className="contact-success-message">
              <FaCheckCircle className="contact-success-icon" />
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting iTechSkill. Our team will respond to you within 24 hours.</p>
              <button
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: '16px', padding: '10px 24px',
                  borderRadius: '8px', border: 'none',
                  background: 'linear-gradient(135deg,#22013a,#7c1abd)',
                  color: '#fff', fontWeight: '700', cursor: 'pointer'
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form-form">
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text" id="name" name="name"
                    value={formData.name} onChange={handleChange}
                    required placeholder="Enter your full name"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email" id="email" name="email"
                    value={formData.email} onChange={handleChange}
                    required placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleChange}
                    placeholder="+92 XXX XXXXXXX"
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="country">Country</label>
                  <input
                    type="text" id="country" name="country"
                    value={formData.country} onChange={handleChange}
                    placeholder="e.g. Pakistan, UAE, UK"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject" name="subject"
                  value={formData.subject} onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="admissions">Course Admissions</option>
                  <option value="courses">Course Information</option>
                  <option value="certifications">Certifications</option>
                  <option value="payments">Payment & Fees</option>
                  <option value="technical">Technical Support</option>
                  <option value="career">Career Guidance</option>
                  <option value="other">Other Inquiry</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange}
                  required rows="6"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {error && (
                <p style={{
                  color: '#e11d48', fontSize: '0.85rem',
                  background: '#fff1f2', padding: '10px 14px',
                  borderRadius: '8px', border: '1px solid #fca5a5'
                }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="contact-submit-button"
                disabled={loading}
                style={{ opacity: loading ? 0.75 : 1 }}
              >
                <FaPaperPlane className="submit-icon" />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div className="contact-reasons">
          <h3 className="contact-reasons-title">Common Reasons to Contact Us</h3>
          <ul className="contact-reasons-list">
            {contactReasons.map(reason => (
              <li key={reason.id} className="contact-reason-item">
                <FaUserGraduate className="contact-reason-icon" />
                <span>{reason.reason}</span>
              </li>
            ))}
          </ul>
          <div className="contact-urgent-support">
            <h4>Need Immediate Assistance?</h4>
            <p>For quick enquiries call or WhatsApp us directly.</p>
            <a href="tel:+923309998880" className="contact-urgent-call">
              <FaPhone /> Call Now: +92 330 9998880
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faq-section">
        <h2 className="contact-section-title">Frequently Asked Questions</h2>
        <div className="contact-faq-grid">
          {faqs.map(faq => (
            <div key={faq.id} className="contact-faq-card">
              <div className="contact-faq-question">
                <FaQuestionCircle className="contact-faq-icon" />
                <h4>{faq.question}</h4>
              </div>
              <p className="contact-faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="contact-faq-cta">
          <p>Need more answers? Review our full <a href="/faq">FAQ section</a> or contact us.</p>
        </div>
      </div>

      {/* Final CTA */}
      <div className="contact-cta-section">
        <div className="cta-content">
          <h2 className="contact-cta-title">All Set to Begin Your Tech Journey?</h2>
          <p className="contact-cta-description">
            Enroll today and start your technology career with iTechSkill. We're here to walk you through the process.
          </p>
          <div className="contact-cta-buttons">
            <a href="/trainings" className="contact-primary-cta-btn">
              Explore All Courses
            </a>
           <button
  onClick={() => setShowEnrollModal(true)}
  className="contact-secondary-cta-btn"
  style={{
    background: 'transparent',
    border: '2px solid white',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }}
>
  Apply for Admission
</button>
            <a
              href="https://wa.me/923309998880"
              className="contact-whatsapp-cta-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
          <p className="contact-response-time">
            <strong>Typical Response Time:</strong> 2-4 hours on business days
          </p>
        </div>
      </div>

      <Footer />

      {showEnrollModal && (
        <EnrollmentModal
          course={null}
          onClose={() => setShowEnrollModal(false)}
        />
      )}

    </div>
  );
};

export default Contact;