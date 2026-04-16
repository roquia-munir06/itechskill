import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Courses_Screen.css';
import Footer from '../components/Footer';
import '../components/Footer.css';
import '../components/Navbar';
import { useScrollToTop } from '../hooks/useScrollToTop';
import EnrollmentModal from '../components/EnrollmentModal';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function normaliseProgram(prog) {
  return {
    id:    prog._id,
    slug:  prog.slug || prog._id,
    title:            prog.title            || '',
    installmentFee:   prog.installmentFee   || '',
    installmentDollar: prog.installmentDollar || '',
    discountedFee:    prog.discountedFee    || '',
    discountedDollar: prog.discountedDollar || '',
    duration:         prog.duration         || '',
    technologies:     Array.isArray(prog.technologies)
                        ? prog.technologies
                        : (prog.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
    projects:         prog.projects         || '5 Capstone Projects',
    color:            prog.color            || '#22013a',
    category:         prog.category         || 'professional',
    displayOrder:     prog.displayOrder     ?? 999,
  };
}

const Courses_Screen = () => {
  useScrollToTop();
  const navigate = useNavigate();
const { user } = useContext(AuthContext);
const { addToCart, cartItems } = useCart();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [apiPrograms, setApiPrograms]       = useState([]);
  const [apiLoading, setApiLoading]         = useState(true);
  const [apiError, setApiError]             = useState(false);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res  = await fetch(`${API_BASE}/programs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const active = data.data
            .filter(p => p.isActive !== false)
            .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
            .map(normaliseProgram);
          setApiPrograms(active);
        } else {
          setApiError(true);
        }
      } catch {
        setApiError(true);
      } finally {
        setApiLoading(false);
      }
    };
    fetchPrograms();
  }, []);

const professionalCourses = apiPrograms.filter(p => p.category === 'professional');
const shortCourses        = apiPrograms.filter(p => p.category === 'short');
const totalCount          = professionalCourses.length + shortCourses.length;
  /* ── View Details → navigate to detail page using the MongoDB _id ── */
 const handleViewDetails = (course) => {
  console.log('navigating to slug:', course.slug, '| id:', course.id);
  navigate(`/course/${course.slug}`);
};

  const renderCourseCards = (courses) =>
    courses.map((course) => (
      <div key={course.id} className="course-card">
        <div className="course-header" style={{ backgroundColor: course.color }}>
          <h3 className="course-title">{course.title}</h3>
        </div>
        <div className="course-content">
          <div className="course-fee-section">
            <div className="fee-row">
              <span className="fee-label">Total Fee (Installment):</span>
              <span className="fee-amount">{course.installmentFee}</span>
            </div>
            <div className="fee-dollar">{course.installmentDollar}</div>
            <div className="fee-row discounted">
              <span className="fee-label">Discounted Fee (Advance):</span>
              <span className="fee-amount">{course.discountedFee}</span>
            </div>
            <div className="fee-dollar">{course.discountedDollar}</div>
          </div>
          <div className="course-duration">
            <span className="duration-label">Course Duration:</span>
            <span className="duration-value">{course.duration}</span>
          </div>
          <div className="course-projects">
            <span className="projects-label"> Projects:</span>
            <span className="projects-value">{course.projects}</span>
          </div>
          {course.technologies && course.technologies.length > 0 && (
            <div className="course-technologies">
              <span className="tech-label">Technologies Covered:</span>
              <div className="tech-tags">
                {course.technologies.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          )}
          <div className="course-buttons">
  <button
    className="apply-button"
    onClick={() => setSelectedCourse(course)}
  >
    Apply Now
  </button>



  <button className="details-button" onClick={() => handleViewDetails(course)}>
    View Details
  </button>
  <button
  className="cart-button"
  onClick={() => {
    // Extract numeric dollar value from strings like "(Approx. $170)" or "(approx. $80)"
    const extractDollar = (str) => {
      if (!str) return '0';
      const match = str.match(/\$([0-9,]+)/);
      return match ? match[1].replace(/,/g, '') : '0';
    };

    addToCart({
      _id:           course.id,
      courseRef:     course.id,
      title:         course.title,
      price:         extractDollar(course.discountedDollar || course.installmentDollar),
      originalPrice: extractDollar(course.installmentDollar),
      thumbnail:     course.thumbnail || '',
    });
  }}
  title={cartItems.some(i => i._id === course.id) ? 'Already in cart' : 'Add to cart'}
  style={{
    width:          '38px',
    height:         '38px',
    borderRadius:   '8px',
    marginTop:'6px',
    border:         cartItems.some(i => i._id === course.id) ? '2px solid #22013a' : '1.5px solid #ddd5f0',
    background:     cartItems.some(i => i._id === course.id) ? '#22013a' : '#fff',
    color:          cartItems.some(i => i._id === course.id) ? '#fcd34d' : '#22013a',
    cursor:         'pointer',
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
    transition:     'all 0.2s',
  }}
>
  <FiShoppingCart size={16} />
</button>
</div>
        </div>
      </div>
    ));

  if (apiLoading) return (
    <div className="courses-page-container" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:'48px', height:'48px', borderRadius:'50%', border:'4px solid #ede9f8', borderTopColor:'#22013a', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
        <p style={{ color:'#8e5203', fontWeight:'600', fontSize:'1rem' }}>Loading courses…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
if (apiError) return (
  <div className="courses-page-container" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
    <div style={{ textAlign:'center' }}>
      <p style={{ color:'#dc2626', fontWeight:'600', fontSize:'1rem' }}>
        Failed to load courses. Please refresh the page.
      </p>
    </div>
  </div>
);
  return (
    <>
      <div className="courses-page-container">
        <div className="courses-header">
          <h1 className="courses-title"><i>All Courses</i></h1>
          <div className="courses-subheader">
            <h2 className="courses-subtitle"><i>Browse Our Complete Course Catalog</i></h2>
            <p className="courses-count">{totalCount} courses available</p>
          </div>
        </div>

        {professionalCourses.length > 0 && (
          <div className="courses-section">
            <h2 className="section-heading">Professional Courses</h2>
            <div className="courses-grid">{renderCourseCards(professionalCourses)}</div>
          </div>
        )}

        {shortCourses.length > 0 && (
          <div className="courses-section">
            <h2 className="section-heading">Short Courses</h2>
            <div className="courses-grid">{renderCourseCards(shortCourses)}</div>
          </div>
        )}
{!apiLoading && totalCount === 0 && (
  <div style={{ textAlign:'center', padding:'60px 20px', color:'#8e5203' }}>
    <p style={{ fontSize:'1.2rem', fontWeight:'600' }}>No active courses found.</p>
  </div>
)}
      </div>

      
{selectedCourse && <EnrollmentModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
  {/* <Footer /> */}
    </>
  );
};

export default Courses_Screen;
