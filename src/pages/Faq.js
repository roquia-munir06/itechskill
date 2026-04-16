import React, { useState } from 'react';
import './Faq.css';
import { FaQuestionCircle, FaGraduationCap, FaLaptop, FaInfinity, FaCertificate, FaCheckCircle, FaEnvelope, FaWhatsapp, FaArrowRight, FaArrowDown, FaUsers, FaBook, FaUserGraduate, FaAward, FaHeadset } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import HelpCenter from'./HelpCenter';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Faq = () => {
    useScrollToTop();
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All FAQs");

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      id: 1,
      question: "What training programs do you offer?",
      answer: "We offer professional training in Data Science, Artificial Intelligence, Generative AI, DevOps, Cloud Computing, Full Stack Development, Mobile App Development, Blockchain Development, Cyber Security, Front-End Development, Back-End Development, Laravel Development, Database Management, WordPress Development, Digital Marketing, Social Media Marketing, SEO, Content Writing, Graphic Designing, Adobe Photoshop, Video & Audio Editing, Business Development, and E-Commerce Specialization.",
      icon: <FaUserGraduate />
    },
    {
      id: 2,
      question: "Are your courses designed according to industry standards?",
      answer: "Yes, all programs are designed in alignment with current industry trends, tools, and market demands.",
      icon: <FaLaptop />
    },
    {
      id: 3,
      question: "Who can enroll in these training programs?",
      answer: "Students, fresh graduates, professionals, freelancers, and entrepreneurs looking to enhance their digital and technical skills can enroll.",
      icon: <FaInfinity />
    },
    {
      id: 4,
      question: "Do you offer beginner to advanced level training?",
      answer: "Yes, we provide structured learning paths from foundational to advanced levels.",
      icon: <FaCertificate />
    },
    {
      id: 5,
      question: "Is practical training included in all courses?",
      answer: "Yes, our programs emphasize hands-on training, live projects, case studies, and real-world applications.",
      icon: <FaAward />
    },
    {
      id: 6,
      question: "6. What skills will I gain in Data Science and AI training?",
      answer: "You will develop expertise in data analysis, machine learning, AI models, predictive analytics, and Generative AI applications.",
      icon: <FaHeadset />
    },
    {
      id: 7,
      question: "What does the Full Stack and Web Development program cover?",
      answer: "It covers front-end technologies, back-end development, databases, APIs, Laravel, WordPress, and complete web application development.",
      icon: <FaCheckCircle />
    },
    {
      id: 8,
      question: "What is included in the Cloud Computing and DevOps training?",
      answer: "The program includes cloud platforms, deployment strategies, automation tools, CI/CD pipelines, and infrastructure management.",
      icon: <FaLaptop />
    },
    {
      id: 9,
      question: "Do you provide Mobile App Development training?",
      answer: "Yes, we offer comprehensive mobile app development training covering UI/UX, app architecture, and deployment processes.",  icon: <FaCheckCircle />,

    },
    {
      id: 10,
      question: "What will I learn in Cyber Security and Blockchain Development?",
      answer: "You will learn system security principles, threat management, ethical security practices, and blockchain fundamentals and applications.",
        icon: <FaBook />
    },
    {
      id: 11,
      question: "What tools are used in Graphic Designing and Adobe Photoshop training?",
      answer: "Students are trained on professional design tools including Adobe Photoshop and other industry-standard creative software.",
      icon: <FaInfinity />
    },
    {
      id: 12,
      question: "What does Video & Audio Editing training include?",
      answer: "The course covers professional editing techniques, post-production processes, and multimedia content creation.",
      icon: <FaUsers />
    },
   {
      id: 13,
      question: "What is covered in Digital Marketing and SEO training?",
      answer: "The program includes social media marketing, paid advertising, search engine optimization, keyword research, analytics, and campaign strategy.",
      icon: <FaUsers />
    },
     {
      id: 14,
      question: "Do you offer Social Media Marketing specialization?",
      answer: "Yes, we provide dedicated training in platform strategy, audience targeting, ad campaigns, and performance analysis.",
      icon: <FaUsers />
    },
     {
      id: 15,
      question: "What does the Business Development and E-Commerce Specialist program focus on?",
      answer: "It focuses on online business growth strategies, sales funnels, digital marketplaces, brand positioning, and revenue optimization.",
      icon: <FaUsers />
    },
     {
      id: 16,
      question: "Are certifications provided after course completion?",
      answer: "Yes, participants receive a professional certificate upon successful completion of the training.",
      icon: <FaUsers />
    },
     {
      id: 17,
      question: "Do you provide career support or job assistance?",
      answer: "We provide career counseling, CV and portfolio development, interview preparation, and freelancing guidance.",
      icon: <FaUsers />
    },
     {
      id: 18,
      question: "Are classes available online and on-campus?",
      answer: "Yes, we offer both online and physical classroom training for flexibility.",
      icon: <FaUsers />
    },
     {
      id: 19,
      question: "How long are the training programs?",
      answer: "Course duration typically ranges from 2 to 6 months depending on the specialization and learning track.",
      icon: <FaUsers />
    },
     {
      id: 20,
      question: "How can I enroll in a course?",
      answer: "You can enroll by contacting our admissions team through our website, phone, or by visiting our campus for consultation and registration.",
      icon: <FaUsers />,
       }
];
  const categories = [
    { 
      id: 1, 
      name: "All FAQs", 
      icon: <FaQuestionCircle />, 
      count: faqs.length,
      colorClass: "faq-category-get-started"
    },
    { 
      id: 2, 
      name: "Eligibility", 
      icon: <FaUserGraduate />, 
      count: faqs.filter(f => f.category === "Eligibility").length,
      colorClass: "faq-category-enrollment"
    },
    { 
      id: 3, 
      name: "Learning Mode", 
      icon: <FaLaptop />, 
      count: faqs.filter(f => f.category === "Learning Mode").length,
      colorClass: "faq-category-technical"
    },
    { 
      id: 4, 
      name: "Access", 
      icon: <FaInfinity />, 
      count: faqs.filter(f => f.category === "Access").length,
      colorClass: "faq-category-payment"
    },
    { 
      id: 5, 
      name: "Certification", 
      icon: <FaCertificate />, 
      count: faqs.filter(f => f.category === "Certification").length,
      colorClass: "faq-category-certification"
    },
    { 
      id: 6, 
      name: "Payment", 
      icon: <FaCheckCircle />, 
      count: faqs.filter(f => f.category === "Payment").length,
      colorClass: "faq-category-account"
    },
    { 
      id: 7, 
      name: "Support", 
      icon: <FaHeadset />, 
      count: faqs.filter(f => f.category === "Support").length,
      colorClass: "faq-category-get-started"
    },
    { 
      id: 8, 
      name: "Career Support", 
      icon: <FaUsers />, 
      count: faqs.filter(f => f.category === "Career Support").length,
      colorClass: "faq-category-enrollment"
    }
  ];

  const filteredFAQs = selectedCategory === "All FAQs" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="faq-page-container">
      {/* Hero Section */}
      <div className="faq-hero-section">
        <div className="faq-hero-content">
          <div className="faq-hero-header">
            <h1 className="faq-hero-title">Frequently Asked Questions</h1>
          </div>
          <p className="faq-hero-subtitle">Get fast answers to your questions about courses, enrollment, certificates and more. 
          </p>
          <p className="faq-hero-description">
            Looking for something you can't find? We are always stand by to assist you.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-accordion-section">
        <div className="faq-section-header">
          <h2 className="faq-section-title">
            {selectedCategory === "All FAQs" ? "All Frequently Asked Questions" : selectedCategory + " FAQs"}
          </h2>
          <p className="faq-section-subtitle">Click on a question to see the answer.
          </p>
        </div>
        
        <div className="faq-list">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`faq-accordion-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-accordion-question"
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question-header">
                  <div className="faq-question-icon">
                    {faq.icon}
                  </div>
                  <h3 className="faq-question-text">{faq.question}</h3>
                </div>
                <div className="faq-question-arrow">
                  {activeIndex === index ? <FaArrowDown /> : <FaArrowRight />}
                </div>
              </div>
              
              <div className="faq-accordion-answer">
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="faq-contact-support-section">
        <div className="faq-contact-content">
          <div className="faq-contact-header">
            <FaQuestionCircle className="faq-contact-header-icon" />
            <h2 className="faq-contact-title">Still Have Questions?</h2>
          </div>
          <p className="faq-contact-description">
           Our customer service is happy to assist you with any questions or issues that you have.  </p>
          
          <div className="faq-contact-options">
            <div className="faq-contact-card">
              <div className="faq-contact-icon faq-email-icon">
                <FaEnvelope />
              </div>
              <div className="faq-contact-card-content">
                <h3>Email Support</h3>
                <p>For detailed inquiries and documentation</p>
                <a href="mailto:itechskill6@gmail.com" className="faq-contact-link">
                  itechskill6@gmail.com
                </a>
              </div>
            </div>
            
            <div className="faq-contact-card">
              <div className="faq-contact-icon faq-whatsapp-icon">
                <FaWhatsapp />
              </div>
              <div className="faq-contact-card-content">
                <h3>WhatsApp Support</h3>
                <p>Quick answers and instant assistance</p>
                <a 
                  href="https://wa.me/923309998880" 
                  className="faq-contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +92 330 9998880
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="faq-resources-section">
        <h2 className="faq-section-title">Additional Resources</h2>
        <div className="faq-resources-grid">
          {/* FIXED: Remove nested <a> tag and use Link properly */}
          <Link to="/HelpCenter" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaHeadset />
            </div>
            <div className="faq-resource-content">
              <h3>Help Center</h3>
              <p>Detailed guides and troubleshooting articles</p>
              <span className="faq-resource-link">
                Explore Help Center <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/trainings" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaGraduationCap />
            </div>
            <div className="faq-resource-content">
              <h3>Course Catalog</h3>
              <p>View all programs and courses that are available</p>
              <span className="faq-resource-link">
                View Courses <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/certification" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaCertificate />
            </div>
            <div className="faq-resource-content">
              <h3>Certifications</h3>
              <p>Learn about our certification programs</p>
              <span className="faq-resource-link">
                View Certifications <FaArrowRight />
              </span>
            </div>
          </Link>
          
          <Link to="/contact" className="faq-resource-card">
            <div className="faq-resource-icon">
              <FaEnvelope />
            </div>
            <div className="faq-resource-content">
              <h3>Contact Form</h3>
              <p>If you have any in-depth questions, send them to our staff</p>
              <span className="faq-resource-link">
                Contact Us <FaArrowRight />
              </span>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Faq;





