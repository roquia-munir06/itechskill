import React from 'react';
import './HelpCenter.css';
import { FaSearch, FaQuestionCircle, FaUserGraduate, FaCreditCard, FaLock, FaDesktop, FaCertificate, FaWhatsapp, FaEnvelope, FaDownload, FaKey, FaCartPlus, FaUserPlus, FaGraduationCap, FaCog, FaClock, FaFileInvoice,FaPhone , FaArrowRight, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const HelpCenter = () => {
    useScrollToTop();
const helpCategories = [
  {
    id: 1,
    title: "Get Started",
    icon: <FaUserGraduate />,
    colorClass: "help-general-bg",
    items: [
      {
        question: "Registration Process",
        answer: "Choose any one course listed, click on “add to cart” and pay by bank transfer or EasyPaisa/ JazzCash. Your dashboard will be available to you immediately once payment is confirmed.",
        icon: <FaCartPlus />
      },
      {
        question: "Free Trials",
        answer: "No credit card required. Enroll in the 1st module of all the courses for free to glimpse through our teaching fashion.",
         icon: <FaClock />
      },
      {
        question: "Account Registration",
        answer: "Sign up with your email and password. Authenticate using the confirmation link sent to your email.",
         icon: <FaUserPlus />
      }
    ]
  },
  {
    id: 2,
    title: "Course Access & Learning",
    icon: <FaGraduationCap />,
    colorClass: "help-billing-bg",
    items: [
      {
        question: "Dashboard Login",
        answer: "Access your dashboard at itechskill. com/login. Forgot password? Click on the 'Reset Password' link in login page.",
        icon: <FaLock />
      },
      {
        question: "Payment Options",
        answer: "Select from 3 to 6 months EMI based on the offer amount and product being offered. Contact itechskill6@gmail.com for installment arrangements.",
         icon: <FaCreditCard />
      },
      {
        question: "Receipts & Invoices",
        answer: "Access payment receipts and course invoices straight from the profile tab on your dashboard.",
          icon: <FaFileInvoice />
      }
    ]
  },
{
  id: 3,
  title: "Technical Support",
  icon: <FaCog />,
  colorClass: "help-technical-bg",
  items: [
    {
      question: "Enrollment Issues",
      answer: "If you are having problems enrolling in the course please clear your browser's cache or try a different browser. Contact support if problems persist.",
      icon: <FaDesktop />
    },
    // ✅ REMOVED: "Certificate Downloads" point
    // ✅ ADDED: Company contact information
    {
      question: "Contact Support",
      answer: "Get immediate assistance from our technical support team.",
      icon: <FaHeadset />, // You'll need to import FaHeadset from react-icons/fa
      contactInfo: {
        phone: "+92 330 8889990",
        email: "itechskill6@gmail.com",
        phoneLink: "tel:+923308889990",
        emailLink: "mailto:itechskill6@gmail.com"
      }
    },
    {
      question: "Platform Troubleshooting",
      answer: "If it is a technical problem, please check your stable network connection, update your browser, and disable conflicting extensions.",
      icon: <FaDesktop />
    }
  ]
}
];

const contactOptions = [
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp Support",
    description: "Instant messaging support available",
    details: "+92 330 8889990",
    detailsLink: "https://wa.me/923308889990", // Added this
    action: "Chat Now",
    link: "https://wa.me/923308889990",
    colorClass: "contact-chat-bg"
  },
  {
    icon: <FaEnvelope />,
    title: "Email Support",
    description: "Detailed inquiries and document submissions",
    details: "itechskill6@gmail.com",
    detailsLink: "mailto:itechskill6@gmail.com", // Added this
    action: "Send Email",
    link: "mailto:itechskill6@gmail.com",
    colorClass: "contact-email-bg"
  },
];

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "On the login page it says ‘Forgot Password’. Please type your registered email to reset your password." },
    {
      question: "Are courses accessible on mobile?",
      answer: "Yes, all our courses are completely responsive and will work on your smart phone, tablet or desktop."   },
    {
      question: "What payment methods are accepted?",
      answer: "We take bank transfer, JazzCash, EasyPaisa and all major credit/debit cards."
    },
    {
      question: "How long will I have access to the course?",
      answer: "You receive all enrolled courses from now until the end of time as well as future updates and content."
    }
  ];

  return (
    <div className="help-center-container">
      {/* Hero Section */}
      <div className="help-hero-section">
        <div className="help-hero-content">
          <div className="hero-header">
            <h1 className="help-hero-title">Help Center</h1>
          </div>
          <p className="help-hero-subtitle">Warehouse of Accelerated Learning and Knowledgeasyarak (AWOL)
          </p>
          <p className="help-hero-description">
           Having trouble enrolling, paying or accessing courses? Get answers to common questions in our Help Center. Can't find what you need? Reach out to our support team for custom guidance.
          </p>
          
          {/* Search Bar */}
         
        </div>
      </div>


      {/* Help Categories */}
      <div className="categories-section">
        <h2 className="section-title">Browse Help Topics</h2>
        <div className="categories-grid">
          {helpCategories.map(category => (
            <div key={category.id} className="category-card">
              <div className={`category-header ${category.colorClass}`}>
                <div className="category-icon">
                  {category.icon}
                </div>
                <h3 className="category-title">{category.title}</h3>
              </div>
  <div className="category-content">
  {category.items.map((item, index) => (
    <div key={index} className="faq-item">
      <div className="faq-header">
        <div className="question-icon">
          {item.icon}
        </div>
        <h4 className="question">{item.question}</h4>
      </div>
      <p className="answer">{item.answer}</p>
      
      {/* ✅ NEW: Render contact info if it exists */}
      {item.contactInfo && (
        <div className="contact-info-links">
          <a href={item.contactInfo.phoneLink} className="contact-info-link">
            <FaPhone /> {item.contactInfo.phone}
          </a>
          <a href={item.contactInfo.emailLink} className="contact-info-link">
            <FaEnvelope /> {item.contactInfo.email}
          </a>
        </div>
      )}
    </div>
  ))}
</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="contact-support-section">
        <h2 className="section-title">Still Stuck? Contact Support</h2>
        <p className="contact-description">
        Our customer service team is at your service 24/7 for any questions you may have or issues you want to resolve.   </p>
        
        <div className="contact-options">
          {contactOptions.map((option, index) => (
            <div key={index} className="contact-card">
              <div className={`contact-icon ${option.colorClass}`}>
                {option.icon}
              </div>
              <div className="contact-content">
                <h3>{option.title}</h3>
                <p className="contact-desc">{option.description}</p>
               <div className="contact-details">
  <a 
    href={option.detailsLink || option.link} 
    className="detail-link"
    target={option.detailsLink?.startsWith('http') || option.detailsLink?.startsWith('mailto') ? '_blank' : '_self'}
    rel="noopener noreferrer"
  >
    {option.details}
  </a>
</div>
                <a 
                  href={option.link} 
                  className="contact-action-btn"
                  target={option.link.startsWith('http') || option.link.startsWith('mailto') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                >
                  {option.action}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="additional-faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-card">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

     
      <Footer />
    </div>
  );
};

export default HelpCenter;