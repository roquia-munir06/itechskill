import React, { useState, useEffect } from 'react';
import './Certification.css';
import {
  FaCertificate, FaAward, FaCheckCircle, FaLinkedin, FaBriefcase,
  FaClock, FaGlobe, FaRocket, FaUserTie, FaChartLine, FaRobot,
  FaCode, FaBullhorn, FaSearch, FaPalette, FaUsers, FaLaptop,
  FaProjectDiagram, FaMedal,
} from 'react-icons/fa';
import Footer from '../components/Footer';
import EnrollmentModal from '../components/EnrollmentModal';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getAllCertifications } from '../api/api';

// ── Map icon string saved in DB to actual React icon component ──
const ICON_MAP = {
  FaChartLine:    <FaChartLine />,
  FaRobot:        <FaRobot />,
  FaCode:         <FaCode />,
  FaBullhorn:     <FaBullhorn />,
  FaSearch:       <FaSearch />,
  FaPalette:      <FaPalette />,
  FaProjectDiagram: <FaProjectDiagram />,
  FaAward:        <FaAward />,
  FaUserTie:      <FaUserTie />,
};

const features = [
  { icon: <FaProjectDiagram />, title: "It is not mere theory, as in practice.", description: "Practical projects that modeled real-life examples" },
  { icon: <FaUserTie />, title: "Efficient and adopted by employers and customers", description: "Industry and business recognized certifications" },
  { icon: <FaLinkedin />, title: "Exquisite LinkedIn and CV resume", description: "Professional looking certificates that 'pop' on your profile" },
  { icon: <FaGlobe />, title: "Applicable: Suitable for domestic and overseas markets", description: "World-class skills with local market customization." },
  { icon: <FaLaptop />, title: "Designed for Pakistani market", description: "Faculty who recognize the challenges and opportunities unique to your area of interest." },
];

const steps = [
  { number: "01", title: "Enroll in a course", description: "Select your certification program and get started" },
  { number: "02", title: "Complete assignments/projects", description: "Engage on real projects that are meaningful and build skill." },
  { number: "03", title: "Pass course evaluations", description: "Demonstrate your knowledge through assessments" },
  { number: "04", title: "Obtain digital certificate", description: "Get your certified digital signatured certificate." },
  { number: "05", title: "Build Credibility. Boost Your Career", description: "Put Your certification on display and advance professionally." },
];

const Certification = () => {
  useScrollToTop();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [certifications, setCertifications]   = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(false);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await getAllCertifications();
        setCertifications(res.data || []);
      } catch (err) {
        console.error('Failed to fetch certifications:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);

  return (
    <div className="certification-container">

      {/* Hero Section */}
      <div className="certification-hero-section full-width">
        <div className="certification-hero-content">
          <div className="certification-hero-badge">
            <FaCertificate className="certification-badge-icon" />
            <span>iTechSkill Certifications</span>
          </div>
          <h1 className="certification-hero-title"><i>Showcase of Skills That Matter.</i></h1>
          <p className="certification-hero-description">
            iTechSkill does not involve paper work in certification, rather proving the real know-how at field. Every certificate is a testament on practice, accomplished projects and knowledge in the field.
          </p>
          <p className="certification-hero-subtext">
            Your degrees will be put to shame in the job applications, freelance sites and professional networks you belong to.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="certification-features-section">
        <h2 className="certification-section-title-alt">Why iTechSkill Certifications are in Demand</h2>
        <div className="certification-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="certification-feature-card">
              <div className="certification-feature-icon-wrapper">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="certification-certifications-section">
        <div className="certification-section-header">
          <h2 className="certification-section-titlee">Our Certification Programs which we have</h2>
          <p className="certification-section-subtitle">
            Select from among our wide variety of industry-recognized certification programs
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #ede9f8', borderTopColor: '#22013a', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#8e5203', fontWeight: '600' }}>Loading certifications…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#dc2626', fontWeight: '600' }}>Failed to load certifications. Please refresh.</p>
          </div>
        ) : (
          <div className="certification-certifications-grid">
            {certifications.map(cert => (
              <div key={cert._id} className="certification-card">
                <div className="certification-card-header">
                                   <h3 className="certification-card-title">{cert.title}</h3>
                  <div className="certification-level-badge" style={{ backgroundColor: cert.color || '#22013a' }}>
                    {cert.level}
                  </div>
                </div>

                <div className="certification-card-content">
                  <p className="certification-card-description">{cert.description}</p>

                  <div className="certification-details">
                    <div className="certification-detail-row">
                      <FaClock className="certification-detail-icon" />
                      <span className="certification-detail-label">Duration:</span>
                      <span className="certification-detail-value">{cert.duration}</span>
                    </div>
                    <div className="certification-detail-row">
                      <FaProjectDiagram className="certification-detail-icon" />
                      <span className="certification-detail-label">Projects:</span>
                      <span className="certification-detail-value">{cert.projects}</span>
                    </div>
                  </div>

                  {cert.skills?.length > 0 && (
                    <div className="certification-skills-section">
                      <h4 className="certification-skills-title">Key Skills:</h4>
                      <div className="certification-skills-list">
                        {cert.skills.map((skill, i) => (
                          <span key={i} className="certification-skill-tag">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cert.benefits?.length > 0 && (
                    <div className="certification-benefits-section">
                      <h4 className="certification-benefits-title">Benefits:</h4>
                      <ul className="certification-benefits-list">
                        {cert.benefits.map((benefit, i) => (
                          <li key={i} className="certification-benefit-item">
                            <FaCheckCircle className="certification-benefit-icon" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Earn Section */}
      <div className="certification-steps-section">
        <div className="certification-steps-container">
          <h2 className="certification-section-title">How to Earn a Certification</h2>
          <div className="certification-steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="certification-step-card">
                <div className="certification-step-number">{step.number}</div>
                <div className="certification-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="certification-cta-section full-width">
        <div className="certification-cta-content">
          <div className="certification-cta-badge">
            <FaAward className="certification-badge-icon" />
            <span>Get Certified Today</span>
          </div>
          <h2 className="certification-cta-title">Build Credibility. Boost Your Career.</h2>
          <p className="certification-cta-description">
            Become one of the thousands of practitioners whose careers have changed with an iTechSkill certification.
          </p>
          <div className="certification-cta-buttons">
            <button className="certification-secondary-cta-btn" onClick={() => setShowEnrollModal(true)} style={{ cursor: 'pointer' }}>
              <FaRocket className="certification-btn-icon" />
              Enroll Now & Get Certified
            </button>
          </div>
          <div className="certification-cta-stats">
            <div className="certification-stat-item">
              <FaUsers className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">10,000+</span>
                <span className="certification-stat-label">Certified Professionals</span>
              </div>
            </div>
            <div className="certification-stat-item">
              <FaBriefcase className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">85%</span>
                <span className="certification-stat-label">Career Advancement Rate</span>
              </div>
            </div>
            <div className="certification-stat-item">
              <FaMedal className="certification-stat-icon" />
              <div className="certification-stat-content">
                <span className="certification-stat-number">4.8/5</span>
                <span className="certification-stat-label">Employer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {showEnrollModal && (
        <EnrollmentModal course={null} onClose={() => setShowEnrollModal(false)} />
      )}
    </div>
  );
};

export default Certification;