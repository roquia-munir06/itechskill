// DiscountOfferPopup.jsx
import React, { useState } from 'react';
import './DiscountOfferPopup.css';
import graduationStudent from '../assets/graduation-student.webp';

const DiscountOfferPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    city: '',
    course: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will follow up shortly.');
    onClose();
  };

  return (
    <div className="d-overlay" onClick={(e) => e.target.classList.contains('d-overlay') && onClose()}>
      <div className="d-modal">
        <button className="d-close" onClick={onClose}>✕</button>
        
        <div className="d-split-layout">
          {/* Left Side - Image */}
          <div className="d-image-side">
            <img 
              src={graduationStudent} 
              alt="Student in graduation cap and gown" 
              className="d-graduation-image"
            />
          </div>

          {/* Right Side - Form */}
          <div className="d-form-side">
            <h2 className="d-title">Get the discount offer</h2>
            <p className="d-subtitle">Fill in your info and we will follow up shortly.</p>

            <form onSubmit={handleSubmit} className="d-form">
              <div className="d-form-group">
                <label className="d-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="d-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="d-form-group">
                <label className="d-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="d-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="d-form-group">
                <label className="d-label">Contact</label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="d-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="d-form-group">
                <label className="d-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="d-input"
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="d-form-group">
                <label className="d-label">Select course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="d-select"
                  required
                >
                  <option value="">Choose a course</option>
                  <option value="agentic-ai">Agentic AI</option>
                  <option value="web-development">Web Development</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="art-design">Art & Design</option>
                </select>
              </div>

              <button type="submit" className="d-submit-btn">
                SUBMIT DETAILS
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountOfferPopup;