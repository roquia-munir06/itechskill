import React from 'react';
import './CompaniesLogo.css';
import logo1 from '../assets/logo1.webp';
import logo2 from '../assets/logo2.webp';
import logo3 from '../assets/logo3.webp';
import logo4 from '../assets/logo4.webp';
import logo5 from '../assets/logo5.webp';
import logo6 from '../assets/logo6.webp';
import logo7 from '../assets/logo7.webp';

const logos = [
  { src: logo1, alt: 'Samsung' },
  { src: logo2, alt: 'Cisco' },
  { src: logo3, alt: 'Vimeo' },
  { src: logo4, alt: 'P&G' },
  { src: logo5, alt: 'Hewlett Packard Enterprise' },
  { src: logo6, alt: 'Citi' },
  { src: logo7, alt: 'Ericsson' },
];

const CompaniesLogo = () => {
  return (
    <div className="logos-reviews-section">
      <div className="section-header">
        <h2 className="trusted-section-title">
          <i>Trusted by the Industry's Elite</i>
        </h2>
        <p className="trusted-section-subtitle">
          Join thousands of professionals and companies who have made iTechSkill their partner in corporate change.
        </p>
      </div>

      <div className="logos-marquee-wrapper">
        {/* Fade edges */}
        <div className="marquee-fade-left" />
        <div className="marquee-fade-right" />

        <div className="logos-marquee-track">
          {/* Duplicate logos for seamless infinite scroll */}
          {[...logos, ...logos, ...logos].map((logo, index) => (
            <div className="logo-item-single" key={index}>
              <img src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="companies-label">
        Trusted by over multiple companies and hundreds of learners around the world
      </div>
    </div>
  );
};

export default CompaniesLogo;