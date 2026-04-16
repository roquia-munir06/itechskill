// src/components/Review.js
import React from 'react';
import './Review.css';

const Review = () => {
  // Review data array
  const reviewsData = [
    {
      id: 1,
      quote: "iTechSkill was rated in our 2025 graduate survey as one of the most comprehensive and practical online learning platforms for mastering AI, Data Science, and emerging technologies in general.",
      initials: "IA",
      name: "iTechSkill Alumni",
      role: "45,320 responses collected",
      company: null
    },
    {
      id: 2,
      quote: "iTechSkill has revolutionized my career path completely. After finishing the AI Mastery course, I got a machine learning job with a 60% raise. The projects were the game-changers for me!",
      initials: "SZ",
      name: "Sarah Zulfiqar",
      role: "Senior ML Engineer at",
      company: "Microsoft"
    },
    {
      id: 3,
      quote: "The practical learning and updated syllabus at iTechSkill have prepared me ideally for my current position. The trainers are practical experts, not mere lecturers. The best return on investment in education that I have ever had.",
      initials: "JA",
      name: "Jamshaid Ali",
      role: "Cloud Solutions Architect at",
      company: "Amazon Web Services"
    },
    {
      id: 4,
      quote: "Through iTechSkill, we were able to fill the gap between innovative technology and necessary soft skills. The tool has played a pivotal role in speeding up our digital transformation journey.",
      initials: "BW",
      name: "Bakhtawar Waraich",
      role: "Head of Learning & Development,",
      company: "North America at Deloitte Digital"
    }
  ];

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Sign up today, and begin transforming your life with others</h3>
      
      <div className="reviews-grid">
        {reviewsData.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-quote">&ldquo;</div>
            <p className="review-content">{review.quote}</p>
            <div className="review-footer">
              <div className="reviewer-avatar">
                <span className="avatar-initials">{review.initials}</span>
              </div>
              <div className="reviewer-details">
                <p className="reviewer-name">{review.name}</p>
                <p className="reviewer-role">{review.role}</p>
                {review.company && <p className="reviewer-company">{review.company}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* <a href="/success-stories" className="view-all-reviews">
        View all stories →
      </a> */}
    </div>
  );
};

export default Review;