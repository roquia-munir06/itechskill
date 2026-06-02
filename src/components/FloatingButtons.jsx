import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaCommentDots, FaTimes, FaChevronUp } from 'react-icons/fa';

const FloatingButtons = ({ whatsappNumber = "923001234567" }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const waBase = "https://wa.me/" + whatsappNumber;
  const waQuestion = waBase + "?text=I have a question";
  const waMore = waBase + "?text=Tell me more about your courses";

  const isMobileView = window.innerWidth <= 768;
  const circleStyle = {
    borderRadius: '50%',
    width: isMobileView ? '36px' : '50px',
    height: isMobileView ? '36px' : '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
    cursor: 'pointer',
    border: '2px solid #22013a',
    background: '#fff',
    color: '#22013a',
    fontSize: isMobileView ? '16px' : '22px',
  };

  return (
    <div>

      {/* Stack on bottom right: scroll-up (top), chat (middle), whatsapp (bottom) */}

      {/* WhatsApp Button - bottom right */}
      <a  href={waBase}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    position: 'fixed',
  bottom: isMobileView ? '14px' : '20px',
    right: isMobileView ? '10px' : '20px',
    zIndex: 9999,
    textDecoration: 'none',
    ...circleStyle,
    border: '2px solid #25D366',
    color: '#25D366',
    fontSize: isMobileView ? '18px' : '26px',
  }}
  aria-label="Chat on WhatsApp"
>
  <FaWhatsapp />
</a>

      {/* Chat Bubble Button - above whatsapp */}
      <button
        onClick={() => setChatOpen(function(o) { return !o; })}
        style={{
          position: 'fixed',
                 bottom: isMobileView ? '60px' : '82px',
        right: isMobileView ? '10px' : '20px',
          zIndex: 9999,
          ...circleStyle,
        }}
        aria-label="Open chat"
      >
        {chatOpen ? <FaTimes /> : <FaCommentDots />}
      </button>

      {/* Scroll To Top - above chat button, only when scrolled */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          style={{
            position: 'fixed',
bottom: isMobileView ? '106px' : '144px',
        right: isMobileView ? '10px' : '20px',
            zIndex: 9999,
            ...circleStyle,
          }}
          aria-label="Scroll to top"
        >
          <FaChevronUp />
        </button>
      )}

      {/* Chat Popup */}
      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '160px',
            right: '20px',
            zIndex: 9999,
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            width: '300px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >

          {/* Header */}
          <div
            style={{
              background: '#22013a',
              color: '#fff',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: '700', fontSize: '15px' }}>Hi! How can we help?</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>We reply instantly</div>
            </div>
            <FaTimes style={{ cursor: 'pointer' }} onClick={() => setChatOpen(false)} />
          </div>

          {/* Options */}
          <div
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <a
              href={waQuestion}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#f3e8ff',
                color: '#22013a',
                padding: '10px 16px',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              I have a question
            </a>
            <a
              href={waMore}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#f3e8ff',
                color: '#22013a',
                padding: '10px 16px',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                textAlign: 'center'
              }}
            >
              Tell me more
            </a>
          </div>

        </div>
      )}

    </div>
  );
};

export default FloatingButtons;