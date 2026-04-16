import React , { useEffect } from 'react';
import './Privacy.css';
import { FaLock, FaUserShield, FaCookie, FaShieldAlt, FaEnvelope, FaCreditCard, FaChartLine, FaBell, FaHandshake, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';


const Privacy = () => {
  useScrollToTop();
  const sections = [
    {
      id: 1,
      title: "Information We Collect",
      icon: <FaUserShield />,
      items: [
        "Name and contact details",
        "Email and phone number",
        "Course enrollment data",
        "Payment-related information",
        "Learning progress and achievements",
        "Technical data (IP address, browser type)",
        "Communication preferences"
      ],
      color: "#22013a"
    },
    {
      id: 2,
      title: "How We Use Your Information",
      icon: <FaChartLine />,
      items: [
        "Enable access to content, courses and learning resources",
        "Issue certificates, and keep them updated on their progress.",
        "Enhance our services and experience on the platform. ",
        "Oversee communication and customer support",
        "Process payments and transactions",
        "Distribute critical change notices and announcements",
        "Personalize learning recommendations"
      ],
      color: "#8e5203"
    },
    {
      id: 3,
      title: "Data Protection",
      icon: <FaShieldAlt />,
      items: [
        "We take reasonable security measures to safeguard your information",
        "Data is stored and transmitted using several levels of encryption.",
        "Regular security checks and updates",
        "Restricted access to personal data",
        "Without visitor consent we never disclose personal information to third parties.",
        "Data retention in accordance with legal obligations",
        "Access and control Over your data"
      ],
      color: "#22013a"
    },
    {
      id: 4,
      title: "Cookies",
      icon: <FaCookie />,
      items: [
        "Cookies are used to improve user experience and analyze website traffic.",
        "Strictly necessary as they let you get around the website and use its features.",
        "Performance cookies for analytics",
        "Preference cookies for personalization",
        "You may be able to set your browser to block or delete cookies if you wish.",
        "Third party cookies for embedded content",
        "Public announcement of updates to the Cookie policy"
      ],
      color: "#8e5203"
    },
    {
      id: 5,
      title: "Third-Party Services",
      icon: <FaHandshake />,
      items: [
        "Payment gateways (Stripe, PayPal)",
        "Analytics services (Google Analytics)",
        "Email marketing platforms",
        "Learning management systems",
        "Customer support tools",
        "Cloud storage providers",
        "There is a different rules for each services"
      ],
      color: "#22013a"
    },
    {
      id: 6,
      title: "Your Rights",
      icon: <FaCheckCircle />,
      items: [
        "Right to access personal data about you",
        "The right to correct inaccurate information",
        "Right to erasure of data",
        "Right to data portability",
        "Right to withdraw consent",
        "Right to lodge complaints",
        "You have the right to opt-out of marketing"
      ],
      color: "#8e5203"
    }
  ];

  const privacyPrinciples = [
    {
      icon: <FaLock />,
      title: "Transparency",
      description: "We are transparent about how we receive and use your data"
    },
    {
      icon: <FaUserShield />,
      title: "Security",
      description: "Enhanced security features to protect information"
    },
    {
      icon: <FaEnvelope />,
      title: "Consent",
      description: "We obtain consent before collecting sensitive data"
    },
    {
      icon: <FaCreditCard />,
      title: "Minimal Data",
      description: "We only gather data that is required to provide our services"
    }
  ];

  return (
    <div className="privacy-container">
      {/* Hero Section */}
      <div className="privacy-hero-section">
        <div className="privacy-hero-content">
          <div className="privacy-hero hero-header">
            <h1 className="privacy-hero-title">Privacy Policy</h1>
          </div>
          <p className="privacy-hero-description">
           At iTechSkill, we care about your privacy. This Privacy Policy describes how we collect, use and store your personal information while providing you with the best learning experience.   </p>
         
        </div>
      </div>

      {/* Introduction */}
      <div className="privacy-introduction-section">
        <div className="privacy-introduction-content">
          <h2 className="privacy-section-title">Our Commitment to Your Privacy</h2>
          <p className="privacy-introduction-text">
          We are dedicated to safeguarding your personal information and being transparent about what information we collect. This policy describes how we process your data when you sign up to our platform, create courses or interact with our services.  </p>
          <p className="privacy-introduction-text">
          Your trust and confidence are very important to us, and we ensure that any personal data is treated with respect and in accordance with all applicable laws. </p>
        </div>
      </div>

      {/* Privacy Principles */}
      <div className="privacy-principles-section">
        <h2 className="privacy-section-title">Our Privacy Principles</h2>
        <div className="privacy-principles-grid">
          {privacyPrinciples.map((principle, index) => (
            <div key={index} className="privacy-principle-card">
              <div className="privacy-principle-icon" style={{ 
                backgroundColor: index % 2 === 0 ? '#22013a' : '#8e5203' 
              }}>
                {principle.icon}
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="privacy-sections-container">
        {sections.map(section => (
          <div key={section.id} className="privacy-section-wrapper">
            <div className="privacy-section-header" style={{ backgroundColor: section.color }}>
              <div className="privacy-section-icon">
                {section.icon}
              </div>
              <h2 className="privacy-section-title">{section.title}</h2>
            </div>
            <div className="privacy-section-content">
              <ul className="privacy-section-list">
                {section.items.map((item, index) => (
                  <li key={index} className="privacy-list-item">
                    <FaCheckCircle className="privacy-list-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Section */}
      <div className="privacy-consent-section">
        <div className="privacy-consent-content">
          <h2 className="privacy-section-titlee">Your Consent</h2>
          <div className="privacy-consent-card">
            <div className="privacy-consent-icon">
              <FaHandshake />
            </div>
            <div className="privacy-consent-text">
              <p>
               By using the iTechSkills Platform, enrolling in a class, or otherwise engaging with any of our Services you agree and consent to the practices described in this Privacy Policy.   </p>
              <p className="privacy-consent-note">
               If you have any questions or comments about this privacy policy, please contact our Privacy Team.  </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="privacy-faq-section">
        <h2 className="privacy-section-title">Frequently Asked Questions</h2>
        <div className="privacy-faq-grid">
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>How do I access my personal information?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>You may seek a copy of your personal information by contacting our support team. We’ll make it easy for you to get a copy of your data within 30 days.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>Is there a way I can delete my account and data?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>The short answer is yes you can ask to have it deleted. Some information may be stored by law or for legitimate business purposes.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>Do you pass information on to third parties?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>We only pass data on to trustworthy third-party service providers who need it for the purpose of providing our services and with whom we have also concluded applicable data protection contracts.</p>
            </div>
          </div>
          
          <div className="privacy-faq-item">
            <div className="privacy-faq-question">
              <FaQuestionCircle className="privacy-faq-icon" />
              <h3>How do you safeguard payment information?</h3>
            </div>
            <div className="privacy-faq-answer">
              <p>All payments are processed through PCI-compliant Payment Gateways. We never keep your full card payment details on our servers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="privacy-contact-section">
        <div className="privacy-contact-content">
          <h2 className="privacy-contact-title">Contact Our Privacy Team</h2>
          <p className="privacy-contact-description">
        If you have any questions about this Privacy Policy, or the practices of our Site, or your dealings with us please contact us at:  </p>
          <div className="privacy-contact-methods">
          <div className="privacy-contact-method">
  <FaEnvelope className="privacy-contact-icon" />
  <div className="privacy-contact-info">
    <span className="privacy-contact-label">Email</span>
    <a 
      href="mailto:itechskill6@gmail.com" 
      className="privacy-contact-value privacy-email-link"
    >
      itechskill6@gmail.com
    </a>
  </div>
</div>
            <div className="privacy-contact-method">
              <FaBell className="privacy-contact-icon" />
              <div className="privacy-contact-info">
                <span className="privacy-contact-label">Support Hours</span>
                <span className="privacy-contact-value">24/7 - Always Available</span>
              </div>
            </div>
          </div>
          <div className="privacy-contact-actions">
            <Link to="/contact" className="privacy-contact-btn">
              Contact Support
            </Link>
           {/* <button 
  className="privacy-download-btn"
  onClick={() => window.open('/documents/PrivacyPolicy.pdf', '_blank')}
>
  Download Privacy Policy (PDF)
</button> */}
<button 
  className="privacy-download-btn"
  onClick={() => {
    const link = document.createElement('a');
    link.href = '/documents/PrivacyPolicy.pdf';
    link.download = 'iTechSkill-Privacy-Policy.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }}
>
  Download Privacy Policy (PDF)
</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;