import React from 'react';
import './OpenPositions.css';
import Footer from './Footer';  // Footer is in same components folder
import { useScrollToTop } from '../hooks/useScrollToTop';  // Go up one level to src, then into hooks

const OpenPositions = () => {
  useScrollToTop();
  
  // Copy the jobOpenings array from Careers.js
  const jobOpenings = [
    {
      id: 1,
      title: "Tech Instructor (AI & Data Science)",
      department: "Education",
      type: "Full-time",
      location: "Remote",
      description: "Instruct students across the globe in AI and Data Science on the most innovative courses.",
      requirements: ["2+ years industry experience", "Strong Python skills", "Teaching experience preferred"]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      description: "Develop and maintain our educational platform / tools.",
      requirements: ["React/Node.js expertise", "3+ years experience", "AWS/Cloud knowledge"]
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      department: "Marketing",
      type: "Full-time",
      location: "Remote",
      description: "Who you are You love digital marketing and are eager to drive new student acquisition and brand growth.",
      requirements: ["SEO/SEM expertise", "Content creation skills", "Analytics proficiency"]
    },
    {
      id: 4,
      title: "Student Success Manager",
      department: "Operations",
      type: "Full-time",
      location: "Remote",
      description: "Support the students all through their learning process.",
      requirements: ["Excellent communication", "Customer service experience", "Education background"]
    },
    {
      id: 5,
      title: "Curriculum Developer",
      department: "Content",
      type: "Contract/Full-time",
      location: "Remote",
      description: "Design engaging, industry-relevant course content.",
      requirements: ["Subject matter expertise", "Instructional design experience", "Tech-savvy"]
    },
    {
      id: 6,
      title: "Sales Executive",
      department: "Business Development",
      type: "Full-time",
      location: "Remote",
      description: "Expand our corporate training partnerships.",
      requirements: ["Sales experience", "B2B background", "Strong networking skills"]
    }
  ];

  return (
    <div className="open-positions-container">
      {/* Hero Section */}
      <div className="open-positions-hero">
        <div className="open-positions-hero-content">
          <h1 className="open-positions-title">Open Positions at iTechSkill</h1>
          <p className="open-positions-subtitle">
            Join our team and help shape the future of education in Pakistan
          </p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="open-positions-grid-section">
        <h2 className="open-positions-grid-title">Current Openings ({jobOpenings.length})</h2>
        <div className="open-positions-grid">
          {jobOpenings.map(job => (
            <div key={job.id} className="open-position-card">
              <div className="position-card-header">
                <h3 className="position-title">{job.title}</h3>
                <div className="position-tags">
                  <span className="position-tag department">{job.department}</span>
                  <span className="position-tag type">{job.type}</span>
                  <span className="position-tag location">{job.location}</span>
                </div>
              </div>
              
              <p className="position-description">{job.description}</p>
              
              <div className="position-requirements">
                <h4>Requirements:</h4>
                <ul>
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="position-actions">
                <button className="apply-btn">Apply Now</button>
                <button className="details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="open-positions-why-join">
        <h2>Why Work at iTechSkill?</h2>
        <div className="why-join-grid">
          <div className="why-join-card">
            <h3>🚀 Growth Opportunities</h3>
            <p>Fast-track your career with clear progression paths</p>
          </div>
          <div className="why-join-card">
            <h3>💻 Remote First</h3>
            <p>Work from anywhere with flexible hours</p>
          </div>
          <div className="why-join-card">
            <h3>📚 Learning Budget</h3>
            <p>$1,000 annual budget for your professional development</p>
          </div>
          <div className="why-join-card">
            <h3>❤️ Health & Wellness</h3>
            <p>Comprehensive health coverage for you and your family</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="open-positions-cta">
        <h2>Don't see the right role?</h2>
        <p>Send us your resume and we'll keep you in mind for future opportunities</p>
        <button className="open-positions-cta-btn">Submit General Application</button>
        <p className="open-positions-email">
          Or email us at: <a href="mailto:itechskill6@gmail.com">itechskill6@gmail.com</a>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default OpenPositions;