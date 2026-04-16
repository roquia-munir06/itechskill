import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaPinterest } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';

const COMING_SOON_BADGE = (
  <span style={{
    fontSize: '7px', fontWeight: '700', letterSpacing: '0.04em',
    textTransform: 'uppercase',
    background: 'linear-gradient(135deg, #7c1abd, #8e5203)',
    color: '#fff', padding: '1px 4px', borderRadius: '999px',
    whiteSpace: 'nowrap', lineHeight: '1.4', marginLeft: '5px',
    verticalAlign: 'middle',
  }}>coming soon</span>
);

const Footer = () => {
  const [openCategories, setOpenCategories] = useState({});
const [programs, setPrograms] = useState(() => {
  const cached = sessionStorage.getItem('cachedPrograms');
  return cached ? JSON.parse(cached) : [];
});
useEffect(() => {
  if (programs.length > 0) return;
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  fetch(`${API_BASE}/programs`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setPrograms(data.data);
        sessionStorage.setItem('cachedPrograms', JSON.stringify(data.data));
      }
    })
    .catch(() => {});
}, [programs.length]);

 const getProgramLink = (keyword) => {
  const match = programs.find(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );
  return match ? `/course/${match.slug}` : null;  // ← use match.slug
};

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

const skillsCategories = [
  {
    id: 'in-demand-careers',
    title: 'In-demand Careers',
    items: ['Artificial Intelligence', 'Data Science', 'FullStack Development', 'Cloud Computing', 'Digital Marketing', 'Generative AI']
  },
  {
    id: 'web-development',
    title: 'Web Development',
    items: ['WordPress Development', 'Front-End Development', 'Back-End Development', 'Laravel Development', 'FullStack Development', 'E-Commerce Specialist']
  },
  {
    id: 'it-certifications',
    title: 'IT Certifications',
    items: ['Cloud Computing', 'Cyber Security', 'Blockchain Development', 'Basic IT', 'Development and Operations (DevOps)']
  },
  {
    id: 'leadership',
    title: 'Leadership',
    items: ['Business Development', 'Project Management', 'Personal Productivity', 'Management Skills', 'Emotional Intelligence']
  },
  {
    id: 'certifications-by-skill',
    title: 'Certifications by Skill',
    items: ['Cyber Security', 'Digital Marketing', 'Cloud Computing', 'Data Science', 'Business Development']
  },
  {
    id: 'data-science',
    title: 'Data Science',
    items: ['Data Science', 'Python Programming', 'Machine Learning & Deep Learning', 'AI Agents', 'Generative AI']
  },
  {
    id: 'communication',
    title: 'Communication',
    items: ['Content Writing', 'Presentation Skills', 'Public Speaking', 'Writing Skills', 'Social Media Marketing']
  },
  {
    id: 'business-analytics',
    title: 'Business Analytics & Intelligence',
    items: ['Microsoft Excel', 'SQL Database', 'Power BI', 'Tableau', 'Data Science']
  }
];

  return (
    <footer className="footer">
      <div className="footer-skills-section">
        <h2 className="skills-maain-title">Explore top skills and certifications</h2>

        <div className="skills-grid">
          {skillsCategories.map((category) => (
            <div className="skills-category" key={category.id}>

              {/* Desktop heading */}
<h3 className="category-title desktop-view">
  {getProgramLink(category.title) ? (
    <Link to={getProgramLink(category.title)} style={{ color: 'inherit', textDecoration: 'none' }}>
      {category.title}
    </Link>
  ) : (
    category.title
  )}
</h3>

              {/* Mobile heading */}
<div className="mobile-category-header" onClick={() => toggleCategory(category.id)}>
  <h3 className="category-title mobile-view">
    {getProgramLink(category.title) ? (
      <Link to={getProgramLink(category.title)} style={{ color: 'inherit', textDecoration: 'none' }}
        onClick={e => e.stopPropagation()}>
        {category.title}
      </Link>
    ) : (
      category.title
    )}
  </h3>
  <span className="dropdown-arrow">{openCategories[category.id] ? '−' : '+'}</span>
</div>

              {/* Desktop links */}
              <ul className="category-links desktop-view">
                {category.items.map((item, index) => {
                  const link = getProgramLink(item);
                  return (
                    <li key={index}>
                      {link ? (
                        <Link to={link} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                          onMouseOver={e => e.target.style.color = '#f9f493'}
                          onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.8)'}>
                          {item}
                        </Link>
                      ) : (
                        <span style={{ opacity: 0.7 }}>{item}{COMING_SOON_BADGE}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Mobile links */}
              <ul className={`category-links mobile-view ${openCategories[category.id] ? 'open' : ''}`}>
                {category.items.map((item, index) => {
                  const link = getProgramLink(item);
                  return (
                    <li key={index}>
                      {link ? (
                        <Link to={link} style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
                          {item}
                        </Link>
                      ) : (
                        <span style={{ opacity: 0.7 }}>{item}{COMING_SOON_BADGE}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

            </div>
          ))}
        </div>
      </div>

      <div className="footer-links">
        <div className="company-section">
          <h3 className="company-title">Company</h3>
          <ul className="company-links">
            <li><Link to="/AboutUs">About Us</Link></li>
            <li><Link to="/Careers">Careers</Link></li>
            <li><Link to="/Contact">Contact</Link></li>
            <li><Link to="/Blog">Blogs</Link></li>
          </ul>
        </div>

        <div className="learning-section">
          <h3 className="learning-title">Learning</h3>
          <ul className="learning-links">
            <li><Link to="/course">All Courses</Link></li>
            <li><Link to="/Categories">Categories</Link></li>
            <li><Link to="/Certification">Certifications</Link></li>
            <li><Link to="/Affiliateprogram">Affiliate Program</Link></li>
          </ul>
        </div>

        <div className="support-section">
          <h3 className="support-title">Support</h3>
          <ul className="support-links">
            <li><Link to="/HelpCenter">Help Center</Link></li>
            <li><Link to="/FAQ">FAQs</Link></li>
            <li><Link to="/Terms">Terms</Link></li>
            <li><Link to="/Privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-copyright">
        <div className="footer-social-icons">
          <a href="https://www.facebook.com/profile.php?id=61586540587111" className="social-icon" aria-label="Facebook"><FaFacebook /></a>
          <a href="https://www.instagram.com/itech_skill/" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
          <a href="https://www.youtube.com/@itechskill-6" className="social-icon" aria-label="YouTube"><FaYoutube /></a>
          <a href="https://www.linkedin.com/company/itechskill" className="social-icon" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="https://www.pinterest.com/your-pinterest-page" className="social-icon" aria-label="Pinterest"><FaPinterest /></a>
          <a href="https://www.tiktok.com/@itechskill" className="social-icon" aria-label="TikTok"><SiTiktok /></a>
        </div>
        <p>© 2026 iTechSkill. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;