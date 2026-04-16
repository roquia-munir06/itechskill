import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:ital,wght@0,600;1,500&display=swap');

  .tc-section {
    padding: 48px 0 60px;
    font-family: 'Outfit', sans-serif;
    background: #fff;
  }

  .tc-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0 40px;
    margin-bottom: 28px;
  }

  .tc-title {
    font-family: 'Lora', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #1a1228;
    letter-spacing: -0.3px;
  }

  .tc-see-all {
    font-size: 0.82rem;
    font-weight: 600;
    color: #7c3aed;
    text-decoration: none;
    cursor: pointer;
    letter-spacing: 0.3px;
    transition: color 0.2s;
  }
  .tc-see-all:hover { color: #5b21b6; text-decoration: underline; }

  /* ── Scrollable row ── */
  .tc-scroll-wrapper {
    position: relative;
    overflow: hidden;
  }

  .tc-row {
    display: flex;
    gap: 16px;
    padding: 10px 40px 20px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .tc-row::-webkit-scrollbar { display: none; }

  /* Scroll arrows */
  .tc-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid #e5e0f5;
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: all 0.2s;
    color: #1a1228;
    font-size: 1rem;
  }
  .tc-arrow:hover { background: #1a1228; color: #fff; border-color: #1a1228; }
  .tc-arrow.left  { left: 8px; }
  .tc-arrow.right { right: 8px; }

  /* ── Card ── */
  .tc-card-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 280px;
  }

  .tc-card {
    width: 280px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    background: #fff;
    border: 1.5px solid #ede9f8;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .tc-card:hover { border-color: #7c3aed; box-shadow: 0 6px 24px rgba(124,58,237,0.1); }

  .tc-thumb {
    width: 100%;
    height: 168px;
    object-fit: cover;
    display: block;
    background: linear-gradient(135deg, #22013a 0%, #5c3600 100%);
  }

  .tc-card-body {
    padding: 14px 16px 16px;
  }

  .tc-card-title {
    font-size: 0.92rem;
    font-weight: 700;
    color: #1a1228;
    line-height: 1.45;
    margin-bottom: 5px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tc-card-instructor {
    font-size: 0.78rem;
    color: #8b7db0;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tc-card-rating {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
  }

  .tc-rating-num {
    font-size: 0.82rem;
    font-weight: 700;
    color: #b45309;
  }

  .tc-stars {
    display: flex;
    gap: 1px;
  }

  .tc-star {
    font-size: 0.72rem;
    color: #f59e0b;
  }

  .tc-rating-count {
    font-size: 0.74rem;
    color: #9b8db0;
  }

  .tc-card-price-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tc-price {
    font-size: 1rem;
    font-weight: 800;
    color: #1a1228;
  }

  .tc-price-original {
    font-size: 0.8rem;
    color: #b0a0c8;
    text-decoration: line-through;
  }

  .tc-bestseller {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.66rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.3px;
    margin-bottom: 6px;
  }

  /* ── Hover Popup ── */
  .tc-popup {
    position: fixed;
    width: 300px;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 8px 40px rgba(26,18,40,0.22), 0 2px 8px rgba(0,0,0,0.08);
    border: 1.5px solid #ede9f8;
    z-index: 9999;
    padding: 20px;
    pointer-events: all;
    animation: tc-popup-in 0.18s cubic-bezier(0.34,1.4,0.64,1);
    font-family: 'Outfit', sans-serif;
  }

  @keyframes tc-popup-in {
    from { opacity: 0; transform: scale(0.94) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }

  .tc-popup-badge {
    display: inline-block;
    background: #fef3c7;
    color: #92400e;
    font-size: 0.62rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

  .tc-popup-title {
    font-family: 'Lora', serif;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1228;
    line-height: 1.4;
    margin-bottom: 4px;
  }

  .tc-popup-meta {
    font-size: 0.72rem;
    color: #9b8db0;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .tc-popup-meta span { display: flex; align-items: center; gap: 3px; }

  .tc-popup-divider {
    height: 1px;
    background: #f0ebf9;
    margin: 10px 0;
  }

  .tc-popup-what {
    font-size: 0.73rem;
    font-weight: 700;
    color: #1a1228;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  .tc-popup-points {
    list-style: none;
    padding: 0;
    margin: 0 0 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tc-popup-point {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 0.78rem;
    color: #4b3f6b;
    line-height: 1.45;
  }

  .tc-popup-check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, #22013a, #8e5203);
    color: #fcd34d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.55rem;
    font-weight: 800;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .tc-popup-bottom {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }

  .tc-popup-price-block {}
  .tc-popup-price-current {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1228;
    line-height: 1;
  }
  .tc-popup-price-original {
    font-size: 0.72rem;
    color: #b0a0c8;
    text-decoration: line-through;
  }

  .tc-popup-cart-btn {
    flex: 1;
    padding: 11px 0;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #22013a 0%, #7c1abd 50%, #8e5203 100%);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Outfit', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
    box-shadow: 0 3px 12px rgba(124,26,189,0.3);
  }
  .tc-popup-cart-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(124,26,189,0.4);
  }
  .tc-popup-cart-btn.already-added {
    background: linear-gradient(135deg, #065f46, #047857);
    box-shadow: 0 3px 12px rgba(4,120,87,0.3);
    cursor: default;
  }

  .tc-popup-wishlist {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    border: 1.5px solid #ede9f8;
    background: #faf8ff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .tc-popup-wishlist:hover { border-color: #e11d48; background: #fff1f2; }
  .tc-popup-wishlist.wishlisted { border-color: #e11d48; background: #fff1f2; }

  /* Popup arrow pointer */
  .tc-popup::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #fff;
    border-left: 1.5px solid #ede9f8;
    border-top: 1.5px solid #ede9f8;
    transform: rotate(45deg);
  }
  .tc-popup.arrow-left::before   { left: -7px;  top: 28px; border-left: none; border-top: none; border-right: 1.5px solid #ede9f8; border-bottom: 1.5px solid #ede9f8; }
  .tc-popup.arrow-right::before  { right: -7px; top: 28px; border-right: none; border-bottom: none; border-left: 1.5px solid #ede9f8; border-top: 1.5px solid #ede9f8; }

  /* Cart toast */
  .tc-toast {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #1a1228;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-size: 0.83rem;
    font-weight: 600;
    padding: 12px 22px;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: tc-toast-in 0.3s ease;
  }
  @keyframes tc-toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
  }

  @media (max-width: 640px) {
    .tc-header { padding: 0 16px; }
    .tc-row    { padding: 10px 16px 20px; gap: 12px; }
    .tc-arrow  { display: none; }
    .tc-popup  { display: none; }
  }
`;

/* ── Stars ─────────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="tc-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="tc-star">
          {i <= Math.floor(rating) ? "★" : i - rating < 1 ? "⯨" : "☆"}
        </span>
      ))}
    </div>
  );
}

/* ── Popup ──────────────────────────────────────────────────────────────── */
function CoursePopup({ course, cardRect, onAddToCart, wishlist, onWishlist, alreadyInCart }) {
  const popupWidth = 300;
  const margin = 12;
  const viewportWidth = window.innerWidth;

  let left, arrowClass;
  if (cardRect.right + margin + popupWidth < viewportWidth) {
    left = cardRect.right + margin;
    arrowClass = "arrow-left";
  } else {
    left = cardRect.left - popupWidth - margin;
    arrowClass = "arrow-right";
  }

  const top = Math.max(8, Math.min(cardRect.top, window.innerHeight - 380));

  return (
    <div className={`tc-popup ${arrowClass}`} style={{ top, left }}>
      <div className="tc-popup-badge">Bestseller</div>
      <div className="tc-popup-title">{course.title}</div>
      <div className="tc-popup-meta">
        <span>⏱ {course.hours} total hours</span>
        <span>· {course.level}</span>
      </div>
      <div className="tc-popup-divider" />
      <div className="tc-popup-what">What you'll learn</div>
      <ul className="tc-popup-points">
        {course.points.map((p, i) => (
          <li key={i} className="tc-popup-point">
            <div className="tc-popup-check">✓</div>
            {p}
          </li>
        ))}
      </ul>
      <div className="tc-popup-divider" />
      <div className="tc-popup-bottom">
        <div className="tc-popup-price-block">
          <div className="tc-popup-price-current">{course.price}</div>
          {course.originalPrice && (
            <div className="tc-popup-price-original">{course.originalPrice}</div>
          )}
        </div>
        <button
          className={`tc-popup-cart-btn ${alreadyInCart ? "already-added" : ""}`}
          onClick={() => !alreadyInCart && onAddToCart(course)}
        >
          {alreadyInCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
        </button>
        <button
          className={`tc-popup-wishlist ${wishlist.includes(course._id) ? "wishlisted" : ""}`}
          onClick={() => onWishlist(course._id)}
          title="Save for later"
        >
          {wishlist.includes(course._id) ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export default function TrendingCourses({ courses = TRENDING_COURSES }) {
  const navigate   = useNavigate();
  const rowRef     = useRef(null);
  const hoverTimer = useRef(null);

  // ← Use shared cart context instead of local state
  const { cartItems, addToCart } = useCart();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [wishlist,    setWishlist]    = useState([]);
  const [toast,       setToast]       = useState(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const close = () => setHoveredCard(null);
    el.addEventListener("scroll", close);
    window.addEventListener("scroll", close);
    return () => { el.removeEventListener("scroll", close); window.removeEventListener("scroll", close); };
  }, []);

  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 310, behavior: "smooth" });

  const handleMouseEnter = (e, course) => {
    clearTimeout(hoverTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimer.current = setTimeout(() => setHoveredCard({ course, rect }), 280);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredCard(null), 160);
  };

  const handlePopupEnter = () => clearTimeout(hoverTimer.current);
  const handlePopupLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredCard(null), 160);
  };

  const handleAddToCart = (course) => {
    addToCart(course); // ← updates shared context → Navbar badge updates automatically
    setHoveredCard(null);
    setToast(`"${course.title.slice(0, 32)}…" added to cart`);
    setTimeout(() => setToast(null), 2800);
  };

  const handleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <>
      <style>{CSS}</style>
      <section className="tc-section">
        <div className="tc-header">
          <h2 className="tc-title">Trending Courses</h2>
        </div>

        <div className="tc-scroll-wrapper">
          <button className="tc-arrow left"  onClick={() => scroll(-1)}>‹</button>
          <button className="tc-arrow right" onClick={() => scroll(1)}>›</button>

          <div className="tc-row" ref={rowRef}>
            {courses.map(course => (
              <div
                key={course._id}
                className="tc-card-wrapper"
                onMouseEnter={e => handleMouseEnter(e, course)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="tc-card" >
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="tc-thumb" />
                  ) : (
                    <div className="tc-thumb" style={{
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem"
                    }}>
                      {course.emoji || "📚"}
                    </div>
                  )}
                  <div className="tc-card-body">
                    <div className="tc-bestseller">Bestseller</div>
                    <div className="tc-card-title">{course.title}</div>
                    <div className="tc-card-instructor">{course.instructor}</div>
                    <div className="tc-card-rating">
                      <span className="tc-rating-num">{course.rating}</span>
                      <Stars rating={course.rating} />
                      <span className="tc-rating-count">({course.ratingCount?.toLocaleString()})</span>
                    </div>
                    <div className="tc-card-price-row">
                      <span className="tc-price">{course.price}</span>
                      {course.originalPrice && (
                        <span className="tc-price-original">{course.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {hoveredCard && (
        <div onMouseEnter={handlePopupEnter} onMouseLeave={handlePopupLeave}>
          <CoursePopup
            course={hoveredCard.course}
            cardRect={hoveredCard.rect}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onWishlist={handleWishlist}
            alreadyInCart={cartItems.some(item => item._id === hoveredCard.course._id)}
          />
        </div>
      )}

      {toast && <div className="tc-toast">🛒 {toast}</div>}
    </>
  );
}

/* ── Demo data ─────────────────────────────────────────────────────────── */
 // src/data/trendingCourses.js
// Single source of truth for trending courses — import this everywhere

export const TRENDING_COURSES = [
  {
    id: 1,
    _id: "s1",
    courseRef: "69abc2818583f8f6ac056c09",
    title: "AI Artificial Intelligence",
    description: "Get the fundamentals of AI and how this field is being transformed",
    // link: "https://youtu.be/oTnR5x2KME0",
    thumbnail: "https://i.ytimg.com/vi/oTnR5x2KME0/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.7, ratingCount: 21000,
    price: "$270", originalPrice: "$288",
    hours: "18", level: "All Levels",
    points: [
      "Understand core AI concepts and terminology",
      "Explore machine learning and neural networks",
      "See how AI is transforming industries today",
      "Hands-on demos and real-world examples",
    ],
  },
  {
    id: 2,
    _id: "s2",
    courseRef: "69abc1638583f8f6ac056bfe",
    title: "Data Science and Engineering",
    description: "Start out on a data scientist's journey with this full introductory course.",
    link: "https://youtu.be/e3LZNYqsJ_Q",
    thumbnail: "https://i.ytimg.com/vi/e3LZNYqsJ_Q/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.6, ratingCount: 18500,
    price: "$270", originalPrice: "$288",
    hours: "22", level: "Beginner",
    points: [
      "Learn Python for data analysis and visualization",
      "Master pandas, NumPy and Matplotlib",
      "Build end-to-end data pipelines",
      "Work with real datasets and case studies",
    ],
  },
  {
    id: 3,
    _id: "s3",
    courseRef: "69abd7318583f8f6ac056c77",
    title: "Web Development",
    description: "Build responsive web sites from scratch using modern technology",
    link: "https://youtu.be/nSRCJGvRJ-o",
    thumbnail: "https://i.ytimg.com/vi/nSRCJGvRJ-o/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.8, ratingCount: 34200,
    price: "$87", originalPrice: "$100",
    hours: "30", level: "All Levels",
    points: [
      "Build websites with HTML, CSS and JavaScript",
      "Learn responsive design and Flexbox/Grid",
      "Intro to React and modern frontend tooling",
      "Deploy your site to the web",
    ],
  },
  {
    id: 4,
    _id: "s4",
    courseRef: "69abda968583f8f6ac056c8a",
    title: "Graphic Designing",
    description: "The principles of graphic design and tools to make exquisite creations.",
    link: "https://youtu.be/h7CTU2NxJ6A",
    thumbnail: "https://i.ytimg.com/vi/h7CTU2NxJ6A/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.5, ratingCount: 12800,
    price: "$162", originalPrice: "$180",
    hours: "16", level: "Beginner",
    points: [
      "Master design principles: color, typography, layout",
      "Work with Adobe Photoshop and Illustrator",
      "Create logos, posters and social media graphics",
      "Build a professional design portfolio",
    ],
  },
  {
    id: 5,
    _id: "s5",
    courseRef: "69abd7ba8583f8f6ac056c7a",
    title: "Digital Marketing",
    description: "Learn online marketing strategies that you don't want to miss out on.",
    link: "https://youtu.be/QGdYlqEc0s8",
    thumbnail: "https://i.ytimg.com/vi/QGdYlqEc0s8/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.6, ratingCount: 15300,
    price: "$87", originalPrice: "$100",
    hours: "20", level: "All Levels",
    points: [
      "Run effective social media marketing campaigns",
      "Master Google Ads and Facebook Ads",
      "Learn email marketing and sales funnels",
      "Measure and optimize your marketing ROI",
    ],
  },
  {
    id: 6,
    _id: "s6",
    courseRef: "69abd9258583f8f6ac056c84",
    title: "Search Engine Optimization",
    description: "Use SEO techniques to raise your website's search engine rankings.",
    link: "https://youtu.be/vTJXbtQ9odY",
    thumbnail: "https://i.ytimg.com/vi/vTJXbtQ9odY/hqdefault.jpg",
    instructor: "Various Instructors",
    rating: 4.5, ratingCount: 9700,
    price: "$100", originalPrice: "$117",
    hours: "14", level: "Beginner",
    points: [
      "Understand how search engines rank content",
      "Do keyword research and on-page optimization",
      "Build backlinks and domain authority",
      "Track rankings with Google Search Console",
    ],
  },
];