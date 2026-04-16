import React from 'react';
import './All_Courses.css';
import { FaCheck, FaUsers, FaClock, FaCertificate, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Courses_Screen from './Courses_Screen';

import { useScrollToTop } from '../hooks/useScrollToTop';

const All_Courses = () => {
    useScrollToTop();
  return (
    <div className="all-courses-container">
      <div className="all-courses-hero-section full-width">
        <div className="all-courses-hero-content">
          <h1 className="all-courses-hero-title"><i>Empowerment — Gain the work skills that pay.</i></h1>
          <p className="all-courses-hero-description">
            Our careers will help you gain skills that are widely in demand; employers, companies and clients would find you valuable.No matter the position size or level, bring your knowledge and begin to significantly develop your existing talent You'll find career driven programs as well as ones designed just to ignite or further your career; hands-on programs that offer comprehensive skill sets for all aspects of real world results.
          </p>
          <p className="all-courses-hero-subtext">
           Hands-on experience, actual projects, individual mentorship, online format- we’ve got everything to offer for you not just learn at your own pace but apply new skills too! </p>
        </div>
      </div>
      <div className="all-courses-page-header">
        <h1 className="all-courses-page-title">Our Complete Course Library</h1>
        <p className="all-courses-page-subtitle">Select from our wide range of industry-related courses</p>
      </div>

      <Courses_Screen/>
      <div className="all-courses-why-learn-section">
        <h2 className="all-courses-section-title">Why Learn With iTechSkill?</h2>
        <div className="all-courses-features-grid">
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaCheck />
            </div>
            <h3>Work-ready training curriculum</h3>
            <p>Programs developed with input from industry to ensure you gain job-relevant skills</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaUsers />
            </div>
            <h3>Industry-expert instructors</h3>
            <p>Learn from practicing professionals</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaClock />
            </div>
            <h3>Lifetime course access</h3>
            <p>Course materials available forever after enrollment</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaGraduationCap />
            </div>
            <h3>Flexible online learning</h3>
            <p>Learn on your own schedule, wherever you are</p>
          </div>
          <div className="all-courses-feature-card">
            <div className="all-courses-feature-icon-circle">
              <FaCertificate />
            </div>
            <h3>Career-focused certifications</h3>
            <p>Earn resume-worthy credentials that employers recognize</p>
          </div>
        </div>
      </div>
      

      <Footer />
    </div>
  );
};

export default All_Courses;