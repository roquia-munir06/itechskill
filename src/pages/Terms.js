
// // import React from 'react';
// // import './Terms.css';
// // import { FaFileContract, FaUserGraduate, FaCreditCard, FaCertificate, FaUsers, FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaBook, FaDownload } from 'react-icons/fa';
// // import { Link } from 'react-router-dom';
// // import Footer from '../components/Footer';
// // import { useScrollToTop } from '../hooks/useScrollToTop';

// // const Terms = () => {
// //    useScrollToTop();
// //   const sections = [
// //     {
// //       id: 1,
// //       title: "Use of Platform",
// //       icon: <FaBook />,
// //       items: [
// //         "The use of iTechSkill material must be personal and educational",
// //         "Users cannot reproduce, distribute, or trade course materials",
// //         "Account sharing is not allowed strictly",
// //         "One account per individual user",
// //         "No commercial use without written permission",
// //         "Compliance with copyright laws",
// //         "Respect intellectual property rights"
// //       ],
// //       colorClass: "terms-section-general"
// //     },
// //     {
// //       id: 2,
// //       title: "Course Enrollment & Payments",
// //       icon: <FaCreditCard />,
// //       items: [
// //         "All fees must be paid to access courses",
// //         "Prices are subject to change without notice",
// //         "Refund policies apply as per enrollment terms",
// //         "Payment must be completed before course access",
// //         "Subscription renewals are automatic unless cancelled",
// //         "No refunds for digital products after access",
// //         "Payment disputes may result in account suspension"
// //       ],
// //       colorClass: "terms-section-enrollment"
// //     },
// //     {
// //       id: 3,
// //       title: "Certificates",
// //       icon: <FaCertificate />,
// //       items: [
// //         "Issuance requires course completion",
// //         "Presentation and delivery of all projects",
// //         "Meeting all course requirements and assessments",
// //         "Certificate verification available to employers",
// //         "Digital certificates issued within 14 business days",
// //         "Certificate authenticity can be verified online",
// //         "Replacement certificates may incur fees"
// //       ],
// //       colorClass: "terms-section-certification"
// //     },
// //     {
// //       id: 4,
// //       title: "User Conduct",
// //       icon: <FaUsers />,
// //       items: [
// //         "Respect teachers and fellow students",
// //         "Avoid misuse of the platform",
// //         "Maintain ethical and professional behavior",
// //         "No harassment or discriminatory behavior",
// //         "Follow community guidelines in discussions",
// //         "Report technical issues promptly",
// //         "Provide constructive feedback"
// //       ],
// //       colorClass: "terms-section-support"
// //     },
// //     {
// //       id: 5,
// //       title: "Limitation of Liability",
// //       icon: <FaShieldAlt />,
// //       items: [
// //         "iTechSkill is not liable for individual career outcomes",
// //         "Not responsible for technical issues beyond our control",
// //         "No guarantee of employment or specific salary outcomes",
// //         "Platform availability may vary due to maintenance",
// //         "Third-party service disruptions not covered",
// //         "User responsibility for device and internet connectivity",
// //         "Disclaimer for course content accuracy"
// //       ],
// //       colorClass: "terms-section-privacy"
// //     },
// //     {
// //       id: 6,
// //       title: "Changes to Terms",
// //       icon: <FaExclamationTriangle />,
// //       items: [
// //         "We reserve the right to change these Terms",
// //         "Continued use implies acceptance of updates",
// //         "Users will be notified of significant changes",
// //         "30-day notice for major policy changes",
// //         "Review Terms periodically for updates",
// //         "Archived versions available upon request",
// //         "Jurisdiction and governing law clauses"
// //       ],
// //       colorClass: "terms-section-contact"
// //     }
// //   ];

// //   const importantPoints = [
// //     {
// //       icon: <FaUserGraduate />,
// //       title: "Educational Use Only",
// //       description: "All materials are for personal learning and development",
// //       colorClass: "terms-point-general"
// //     },
// //     {
// //       icon: <FaCheckCircle />,
// //       title: "Complete Requirements",
// //       description: "Certificates require full course completion",
// //       colorClass: "terms-point-certification"
// //     },
// //     {
// //       icon: <FaFileContract />,
// //       title: "Binding Agreement",
// //       description: "Using our platform means you accept these terms",
// //       colorClass: "terms-point-payment"
// //     },
// //     {
// //       icon: <FaEnvelope />,
// //       title: "Stay Updated",
// //       description: "Check for term updates regularly",
// //       colorClass: "terms-point-support"
// //     }
// //   ];

// //   return (
// //     <div className="terms-page-container">
// //       {/* Hero Section */}
// //       <div className="terms-hero-section">
// //         <div className="terms-hero-content">
// //           <div className="terms-hero-header">
// //             <FaFileContract className="terms-hero-icon" />
// //             <h1 className="terms-hero-title">Terms & Conditions</h1>
// //           </div>
// //           <p className="terms-hero-description">
// //             By utilizing iTechSkill.com, you consent to abide by the following Terms and Conditions. 
// //             Please read them carefully before enrolling in any course.
// //           </p>
// //               </div>
// //       </div>

// //       {/* Important Notice */}
// //       <div className="terms-notice-section">
// //         <div className="terms-notice-icon">
// //           <FaExclamationTriangle />
// //         </div>
// //         <div className="terms-notice-text">
// //           <h3>Important Notice</h3>
// //           <p>
// //             These Terms & Conditions constitute a legally binding agreement between you and iTechSkill. 
// //             By accessing or using our platform, you agree to be bound by these terms.
// //           </p>
// //         </div>
// //       </div>

// //       {/* Key Points */}
// //       <div className="terms-key-points-section">
// //         <h2 className="terms-section-title">Key Points to Remember</h2>
// //         <div className="terms-points-grid">
// //           {importantPoints.map((point, index) => (
// //             <div key={index} className="terms-point-card">
// //               <div className={`terms-point-icon ${point.colorClass}`}>
// //                 {point.icon}
// //               </div>
// //               <h3>{point.title}</h3>
// //               <p>{point.description}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Main Terms Sections */}
// //       <div className="terms-sections-container">
// //         {sections.map(section => (
// //           <div key={section.id} className="terms-content-section">
// //             <div className={`terms-content-header ${section.colorClass}`}>
// //               <div className="terms-content-icon">
// //                 {section.icon}
// //               </div>
// //               <h2 className="terms-content-title">{section.title}</h2>
// //             </div>
// //             <div className="terms-section-content">
// //               <ul className="terms-section-list">
// //                 {section.items.map((item, index) => (
// //                   <li key={index} className="terms-list-item">
// //                     <FaCheckCircle className="terms-list-icon" />
// //                     <span>{item}</span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //     {/* Contact Section */}
// // <div className="terms-contact-section">
// //   <div className="terms-contact-content">
// //     <div className="terms-contact-header">
// //       <FaEnvelope className="terms-contact-header-icon" />
// //       <h2 className="terms-contact-title">Questions About Our Terms?</h2>
// //     </div>
// //     <p className="terms-contact-description">
// //       If you have any questions or concerns regarding our Terms & Conditions, 
// //       please don't hesitate to reach out to our legal team.
// //     </p>
// //     <div className="terms-contact-actions">
// //       <a href="mailto:itechskill6@gmail.com" className="terms-contact-btn">
// //         <FaEnvelope />
// //         Email Us: itechskill6@gmail.com
// //       </a>
// //       <button 
// //         className="terms-download-btn"
// //         onClick={() => {
// //           const link = document.createElement('a');
// //           link.href = '/documents/Terms.pdf';
// //           link.download = 'iTechSkill-Terms-And-Conditions.pdf';
// //           document.body.appendChild(link);
// //           link.click();
// //           document.body.removeChild(link);
// //         }}
// //       >
// //         <FaDownload />
// //         Download Terms (PDF)
// //       </button>
// //     </div>
// //   </div>
// // </div>

// //       <Footer />
// //     </div>
// //   );
// // };

// // export default Terms;


// import React from 'react';
// import './Terms.css';
// import { FaFileContract, FaUserGraduate, FaCreditCard, FaCertificate, FaUsers, FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaBook, FaDownload } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import Footer from '../components/Footer';
// import { useScrollToTop } from '../hooks/useScrollToTop';

// const Terms = () => {
//    useScrollToTop();
//   const sections = [
//     {
//       id: 1,
//       title: "Using the Platform",
//       icon: <FaBook />,
//       items: [
// "All use of iTechSkill material must be for personal and educational purposes",
// "Users cannot make, sell or reproduce the content inside courses",
// "Account sharing is strictly forbidden",
// "One account for each individual user",
// "No commercial use without written permission",
// "Compliance with all copyright laws",
// "Respect intellectual property rights"
//       ],
//       colorClass: "terms-section-general"
//     },
//     {
//       id: 2,
//       title: " Enrollment & Payments",
//       icon: <FaCreditCard />,
//       items: [
//        "You must pay all fees to access courses",
// "Prices and other information are subject to change without notice",
// "Refund policies apply to enrollments as specified",
// "Payment should be made in advance of course access",
// "Subscriptions will be renewed automatically unless cancelled",
// "There are no refunds after the product has been used in digital form",
// "Account suspensions may result from payment disputes"
//       ],
//       colorClass: "terms-section-enrollment"
//     },
//     {
//       id: 3,
//       title: "Certificate",
//       icon: <FaCertificate />,
//       items: [
//      " We need full course completion for the issue of a certificate",
// "All projects must be presented and handed in",
// "You show all course requirements and meet all assessments",
// "Employers may verify certificates via digital verification (service)",
// "Digital certificates will be issued within 14 business days",
// "You may verify online the authenticity of your certificate",
// "Fees may be payable for replacement certificates",
//       ],
//       colorClass: "terms-section-certification"
//     },
//     {
//       id: 4,
//       title: "User Conduct",
//       icon: <FaUsers />,
//       items: [
//        "Be polite to teachers and other students",
// "Do not misuse or abuse the platform",
// "Keep your behavior in line with both your job and ethics",
// "No harassment or discrimination of any kind",
// "Have regard to community discussions guidelines",
// "Relevant persons should be informed immediately when technical issues arise",
// "Send us your feedback and comments that are constructive",
//       ],
//       colorClass: "terms-section-support"
//     },
//     {
//       id: 5,
//       title: "Limitation of Liability",
//       icon: <FaShieldAlt />,
//       items: [
//         "We make no representation as to individual lifetime career outcomes",
// "We are not responsible for technical problems beyond our control",
// "We cannot guarantee you employment or certain levels of salary",
// "Technical revisions will be scheduled regularly for platform maintenance",
// "Disruptions to third party services are not covered by the guarantee",
// "You are personally responsible for device and connectivity to the Internet",
// "No warranty is given for course content accuracy"
//       ],
//       colorClass: "terms-section-privacy"
//     },
//     {
//       id: 6,
//       title: "Changes to Terms",
//       icon: <FaExclamationTriangle />,
//       items: [
// "We reserve the right to modify these Terms",
// "Use after any such changes have taken place will imply your acceptance thereof",
// "Major changes will be announced to registered users",
// "Major changes to be brought in at least 30 days after the announcement",
// "Regularly review these Terms for amendments",
// "Previous editions if not on this site can be requested from us",
// "Governing law clause, Jurisdiction clause and forum selection"
//       ],
//       colorClass: "terms-section-contact"
//     }
//   ];

//   const importantPoints = [
//     {
//       icon: <FaUserGraduate />,
//       title: "For Educational Use Only",
//       description: "All materials are used for personal learning and development.",
//       colorClass: "terms-point-general"
//     },
//     {
//       icon: <FaCheckCircle />,
//       title: "All Requirements Completed",
//       description: "Certificates require full course completion",
//       colorClass: "terms-point-certification"
//     },
//     {
//       icon: <FaFileContract />,
//       title: "Binding Agreement",
//       description: "By using our platform you agree to and accept these terms",
//       colorClass: "terms-point-payment"
//     },
//     {
//       icon: <FaEnvelope />,
//       title: "Stay Current",
//       description: "Please check for term updates regularly",
//       colorClass: "terms-point-support"
//     }
//   ];

//   return (
//     <div className="terms-page-container">
//       {/* Hero Section */}
//       <div className="terms-hero-section">
//         <div className="terms-hero-content">
//           <div className="terms-hero-header">
//             <h1 className="terms-hero-title">Terms & Conditions</h1>
//           </div>
//           <p className="terms-hero-description">
//        When using iTechSkill.com, you need to agree to the following Terms and Conditions. Therefore, before proceeding to enroll in any course please study them carefully.   </p>
//               </div>
//       </div>

//       {/* Important Notice */}
//       <div className="terms-notice-section">
//         <div className="terms-notice-icon">
//           <FaExclamationTriangle />
//         </div>
//         <div className="terms-notice-text">
//           <h3>Important Notice</h3>
//           <p>
//           Users should remember that these Terms & Conditions are a legally binding agreement between you and iTechSkill. You accept these terms by logging (or using) our platform.    </p>
//         </div>
//       </div>

//       {/* Key Points */}
//       <div className="terms-key-points-section">
//         <h2 className="terms-section-title">Key Points to Remember</h2>
//         <div className="terms-points-grid">
//           {importantPoints.map((point, index) => (
//             <div key={index} className="terms-point-card">
//               <div className={`terms-point-icon ${point.colorClass}`}>
//                 {point.icon}
//               </div>
//               <h3>{point.title}</h3>
//               <p>{point.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Terms Sections */}
//       <div className="terms-sections-container">
//         {sections.map(section => (
//           <div key={section.id} className="terms-content-section">
//             <div className={`terms-content-header ${section.colorClass}`}>
//               <div className="terms-content-icon">
//                 {section.icon}
//               </div>
//               <h2 className="terms-content-title">{section.title}</h2>
//             </div>
//             <div className="terms-section-content">
//               <ul className="terms-section-list">
//                 {section.items.map((item, index) => (
//                   <li key={index} className="terms-list-item">
//                     <FaCheckCircle className="terms-list-icon" />
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         ))}
//       </div>

//     {/* Contact Section */}
// <div className="terms-contact-section">
//   <div className="terms-contact-content">
//     <div className="terms-contact-header">
//       <FaEnvelope className="terms-contact-header-icon" />
//       <h2 className="terms-contact-title">Questions about Our Terms?</h2>
//     </div>
//     <p className="terms-contact-description">
//     If you have questions or concerns regarding our Terms & Conditions, please contact our legal team without delay.
//     </p>
//     <div className="terms-contact-actions">
//       <a href="mailto:itechskill6@gmail.com" className="terms-contact-btn">
//         <FaEnvelope />
//         Email Us: itechskill6@gmail.com
//       </a>
//       <button 
//         className="terms-download-btn"
//         onClick={() => {
//           const link = document.createElement('a');
//           link.href = '/documents/Terms.pdf';
//           link.download = 'iTechSkill-Terms-And-Conditions.pdf';
//           document.body.appendChild(link);
//           link.click();
//           document.body.removeChild(link);
//         }}
//       >
//         <FaDownload />
//         Download Terms (PDF)
//       </button>
//     </div>
//   </div>
// </div>

//       <Footer />
//     </div>
//   );
// };

// export default Terms;










import React from 'react';
import './Terms.css';
import { FaFileContract, FaUserGraduate, FaCreditCard, FaCertificate, FaWhatsapp ,FaUsers, FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaCheckCircle, FaBook, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Terms = () => {
   useScrollToTop();
  const sections = [
    {
      id: 1,
      title: "Using the Platform",
      icon: <FaBook />,
      items: [
"All use of iTechSkill material must be for personal and educational purposes",
"Users cannot make, sell or reproduce the content inside courses",
"Account sharing is strictly forbidden",
"One account for each individual user",
"No commercial use without written permission",
"Compliance with all copyright laws",
"Respect intellectual property rights"
      ],
      colorClass: "terms-section-general"
    },
    {
      id: 2,
      title: " Enrollment & Payments",
      icon: <FaCreditCard />,
      items: [
       "You must pay all fees to access courses",
"Prices and other information are subject to change without notice",
"Refund policies apply to enrollments as specified",
"Payment should be made in advance of course access",
"Subscriptions will be renewed automatically unless cancelled",
"There are no refunds after the product has been used in digital form",
"Account suspensions may result from payment disputes"
      ],
      colorClass: "terms-section-enrollment"
    },
    {
      id: 3,
      title: "Certificate",
      icon: <FaCertificate />,
      items: [
     " We need full course completion for the issue of a certificate",
"All projects must be presented and handed in",
"You show all course requirements and meet all assessments",
"Employers may verify certificates via digital verification (service)",
"Digital certificates will be issued within 14 business days",
"You may verify online the authenticity of your certificate",
"Fees may be payable for replacement certificates",
      ],
      colorClass: "terms-section-certification"
    },
    {
      id: 4,
      title: "User Conduct",
      icon: <FaUsers />,
      items: [
       "Be polite to teachers and other students",
"Do not misuse or abuse the platform",
"Keep your behavior in line with both your job and ethics",
"No harassment or discrimination of any kind",
"Have regard to community discussions guidelines",
"Relevant persons should be informed immediately when technical issues arise",
"Send us your feedback and comments that are constructive",
      ],
      colorClass: "terms-section-support"
    },
    {
      id: 5,
      title: "Limitation of Liability",
      icon: <FaShieldAlt />,
      items: [
        "We make no representation as to individual lifetime career outcomes",
"We are not responsible for technical problems beyond our control",
"We cannot guarantee you employment or certain levels of salary",
"Technical revisions will be scheduled regularly for platform maintenance",
"Disruptions to third party services are not covered by the guarantee",
"You are personally responsible for device and connectivity to the Internet",
"No warranty is given for course content accuracy"
      ],
      colorClass: "terms-section-privacy"
    },
    {
      id: 6,
      title: "Changes to Terms",
      icon: <FaExclamationTriangle />,
      items: [
"We reserve the right to modify these Terms",
"Use after any such changes have taken place will imply your acceptance thereof",
"Major changes will be announced to registered users",
"Major changes to be brought in at least 30 days after the announcement",
"Regularly review these Terms for amendments",
"Previous editions if not on this site can be requested from us",
"Governing law clause, Jurisdiction clause and forum selection"
      ],
      colorClass: "terms-section-contact"
    },
    {
  id: 7,
  title: "Content Protection",
  icon: <FaShieldAlt />,
  items: [
    "Screenshots of course content are strictly prohibited",
    "Screen recording of any course material is not allowed",
    "Violations will result in immediate enrollment removal",
    "No refund will be issued for policy violation removals",
    "We reserve the right to monitor and enforce this policy",
  ],
  colorClass: "terms-section-privacy"
},
  ];

  const importantPoints = [
    {
      icon: <FaUserGraduate />,
      title: "For Educational Use Only",
      description: "All materials are used for personal learning and development.",
      colorClass: "terms-point-general"
    },
    {
      icon: <FaCheckCircle />,
      title: "All Requirements Completed",
      description: "Certificates require full course completion",
      colorClass: "terms-point-certification"
    },
    {
      icon: <FaFileContract />,
      title: "Binding Agreement",
      description: "By using our platform you agree to and accept these terms",
      colorClass: "terms-point-payment"
    },
    {
      icon: <FaEnvelope />,
      title: "Stay Current",
      description: "Please check for term updates regularly",
      colorClass: "terms-point-support"
    }
  ];

  return (
    <div className="terms-page-container">
      {/* Hero Section */}
      <div className="terms-hero-section">
        <div className="terms-hero-content">
          <div className="terms-hero-header">
            <h1 className="terms-hero-title">Terms & Conditions</h1>
          </div>
          <p className="terms-hero-description">
       When using iTechSkill.com, you need to agree to the following Terms and Conditions. Therefore, before proceeding to enroll in any course please study them carefully.   </p>
              </div>
      </div>

      {/* Important Notice */}
      <div className="terms-notice-section">
        <div className="terms-notice-icon">
          <FaExclamationTriangle />
        </div>
        <div className="terms-notice-text">
          <h3>Important Notice</h3>
          <p>
          Users should remember that these Terms & Conditions are a legally binding agreement between you and iTechSkill. You accept these terms by logging (or using) our platform.    </p>
        </div>
      </div>

      {/* Key Points */}
      <div className="terms-key-points-section">
        <h2 className="terms-section-title">Key Points to Remember</h2>
        <div className="terms-points-grid">
          {importantPoints.map((point, index) => (
            <div key={index} className="terms-point-card">
              <div className={`terms-point-icon ${point.colorClass}`}>
                {point.icon}
              </div>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="terms-sections-container">
        {sections.map(section => (
          <div key={section.id} className="terms-content-section">
            <div className={`terms-content-header ${section.colorClass}`}>
              <div className="terms-content-icon">
                {section.icon}
              </div>
              <h2 className="terms-content-title">{section.title}</h2>
            </div>
            <div className="terms-section-content">
              <ul className="terms-section-list">
                {section.items.map((item, index) => (
                  <li key={index} className="terms-list-item">
                    <FaCheckCircle className="terms-list-icon" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

    {/* Contact Section */}
<div className="terms-contact-section">
  <div className="terms-contact-content">
    <div className="terms-contact-header">
      <FaEnvelope className="terms-contact-header-icon" />
      <h2 className="terms-contact-title">Questions about Our Terms?</h2>
    </div>
    <p className="terms-contact-description">
    If you have questions or concerns regarding our Terms & Conditions, please contact our legal team without delay.
    </p>
    <div className="terms-contact-actions">
      <a href="mailto:itechskill6@gmail.com" className="terms-contact-btn">
        <FaEnvelope />
        Email Us: itechskill6@gmail.com
      </a>
      <a href="https://wa.me/03309998880" target="_blank" rel="noreferrer" className="terms-whatsapp-btn">
  <FaWhatsapp />
  WhatsApp Us
</a>
      <button 
        className="terms-download-btn"
        onClick={() => {
          const link = document.createElement('a');
          link.href = '/documents/Terms.pdf';
          link.download = 'iTechSkill-Terms-And-Conditions.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
      >
        <FaDownload />
        Download Terms (PDF)
      </button>
    </div>
  </div>
</div>

      <Footer />
    </div>
  );
};

export default Terms;