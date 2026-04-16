import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiTrash2 } from "react-icons/fi";
import Footer from '../components/Footer';
import { TRENDING_COURSES } from "../components/TrendingCourses";

/* ══════════════════════════════════════════════
   STARS
══════════════════════════════════════════════ */
function Stars({ rating }) {
  return (
    <div className="cp-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className="cp-star">
          {i <= Math.floor(rating) ? "★" : i - rating < 1 ? "⯨" : "☆"}
        </span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SUGGESTION HOVER POPUP
══════════════════════════════════════════════ */
function SuggestionPopup({ course, cardRect, onAddToCart, wishlist, onWishlist, alreadyInCart }) {
  const popupWidth    = 300;
  const margin        = 12;
  const viewportWidth = window.innerWidth;

  let left, arrowClass;
  if (cardRect.right + margin + popupWidth < viewportWidth) {
    left = cardRect.right + margin;
    arrowClass = "arrow-left";
  } else {
    left = cardRect.left - popupWidth - margin;
    arrowClass = "arrow-right";
  }
  const top = Math.max(8, Math.min(cardRect.top, window.innerHeight - 420));

  return (
    <div className={`cp-popup ${arrowClass}`} style={{ top, left }}>
      <div className="cp-popup-badge">Free Preview</div>
      <div className="cp-popup-title">{course.title}</div>
      <div className="cp-popup-meta">
        <span>⏱ {course.hours} total hours</span>
        <span>· {course.level}</span>
      </div>
      <div className="cp-popup-rating">
        <span className="cp-popup-rating-num">{course.rating}</span>
        <Stars rating={course.rating} />
        <span className="cp-popup-rating-count">({course.ratingCount?.toLocaleString()})</span>
      </div>
      <div className="cp-popup-divider" />
      <div className="cp-popup-what">What you'll learn</div>
      <ul className="cp-popup-points">
        {course.points.map((p, i) => (
          <li key={i} className="cp-popup-point">
            <div className="cp-popup-check">✓</div>
            {p}
          </li>
        ))}
      </ul>
      <div className="cp-popup-divider" />
      <div className="cp-popup-bottom">
        <div className="cp-popup-price-block">
          <div className="cp-popup-price-current">{course.price}</div>
          {course.originalPrice && (
            <div className="cp-popup-price-original">{course.originalPrice}</div>
          )}
        </div>
        <button
          className={`cp-popup-cart-btn ${alreadyInCart ? "already-added" : ""}`}
          onClick={() => !alreadyInCart && onAddToCart(course)}
        >
          {alreadyInCart ? "✓ In Cart" : "🛒 Add to Cart"}
        </button>
        <button
          className={`cp-popup-wishlist ${wishlist.includes(course._id) ? "wishlisted" : ""}`}
          onClick={() => onWishlist(course._id)}
          title="Save for later"
        >
          {wishlist.includes(course._id) ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Lora:ital,wght@0,700;1,600&display=swap');

  /* ── Page shell ── */
  .cart-page {
    font-family: 'Outfit', sans-serif;
    background: #fff;
    min-height: 100vh;
    padding: 0 0 60px;
  }
  .cart-page-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 40px 40px 0;
    display: grid; grid-template-columns: 1fr 300px;
    gap: 48px; align-items: start;
  }

  /* ── Header ── */
  .cart-page-title {
    font-family: 'Lora', serif; font-size: 2rem; font-weight: 700;
    color: #1a1228; margin: 0 0 6px;
  }
  .cart-item-count {
    font-size: 0.85rem; color: #6b7280; margin: 0 0 20px;
    padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;
  }

  /* ── Empty state ── */
  .cart-empty-state {
    display: flex; flex-direction: column;
    align-items: center; padding: 80px 20px;
    text-align: center; gap: 12px;
  }
  .cart-empty-icon-big { font-size: 4rem; }
  .cart-empty-state h2 { font-size: 1.4rem; color: #1a1228; margin: 0; }
  .cart-empty-state p  { color: #6b7280; margin: 0; font-size: 0.95rem; }
  .cart-keep-shopping {
    margin-top: 8px; padding: 12px 28px;
    background: linear-gradient(135deg, #22013a, #7c1abd);
    color: #fff; border: none; border-radius: 8px;
    font-size: 0.95rem; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: all 0.2s;
  }
  .cart-keep-shopping:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(124,26,189,0.3); }

  /* ── Item rows ── */
  .cart-items-list { display: flex; flex-direction: column; }
  .cart-item-row {
    display: flex; gap: 16px; padding: 20px 0;
    border-bottom: 1px solid #e5e7eb; align-items: flex-start;
  }
  .cart-item-img {
    width: 120px; height: 80px; border-radius: 6px;
    overflow: hidden; flex-shrink: 0;
    background: linear-gradient(135deg, #22013a, #5c3600);
  }
  .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .cart-item-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center; font-size: 2rem;
  }
  .cart-item-details { flex: 1; min-width: 0; }
  .cart-item-name {
    font-size: 0.95rem; font-weight: 700; color: #1a1228;
    margin: 0 0 4px; line-height: 1.4; cursor: pointer; transition: color 0.15s;
  }
  .cart-item-name:hover { color: #7c3aed; }
  .cart-item-by { font-size: 0.78rem; color: #6b7280; margin: 0 0 8px; }
  .cart-item-meta-row {
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;
  }
  .cart-item-bestseller {
    background: #fef3c7; color: #92400e; font-size: 0.65rem;
    font-weight: 700; padding: 2px 8px; border-radius: 4px;
  }
  .cart-item-rating, .cart-item-hours, .cart-item-level { font-size: 0.75rem; color: #6b7280; }
  .cart-item-hours::before, .cart-item-level::before { content: "•"; margin-right: 6px; }
  .cart-item-actions { display: flex; align-items: center; gap: 16px; }
  .cart-remove-btn {
    background: none; border: none; cursor: pointer; font-size: 0.8rem;
    font-weight: 600; font-family: 'Outfit', sans-serif;
    display: flex; align-items: center; gap: 4px; padding: 0;
    transition: color 0.15s; color: #7c3aed;
  }
  .cart-remove-btn:hover { color: #e11d48; }
  .cart-item-price-col {
    display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;
  }
  .cart-item-price-current  { font-size: 1.05rem; font-weight: 800; color: #7c3aed; }
  .cart-item-price-original { font-size: 0.82rem; color: #b0a0c8; text-decoration: line-through; }

  /* ── Summary ── */
  .cart-summary {
    position: sticky; top: 88px; background: #fff;
    border: 1.5px solid #e5e7eb; border-radius: 12px;
    padding: 24px; margin-top: 68px;
  }
  .cart-summary-label {
    font-size: 0.9rem; color: #6b7280; margin: 0 0 4px;
    font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .cart-summary-total {
    font-family: 'Lora', serif; font-size: 2.2rem; font-weight: 700;
    color: #1a1228; margin: 0 0 4px; line-height: 1;
  }
  .cart-summary-original { font-size: 1rem; color: #b0a0c8; text-decoration: line-through; margin: 0; }
  .cart-summary-discount  { font-size: 0.85rem; font-weight: 700; color: #059669; margin: 0 0 20px; }
  .cart-checkout-btn {
    width: 100%; padding: 14px 0; border-radius: 8px; border: none;
    background: linear-gradient(135deg, #22013a 0%, #7c1abd 50%, #8e5203 100%);
    color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif; transition: all 0.2s;
    box-shadow: 0 3px 12px rgba(124,26,189,0.3); margin-bottom: 10px;
  }
  .cart-checkout-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,26,189,0.4); }
  .cart-not-charged { text-align: center; font-size: 0.75rem; color: #9b8db0; margin: 0; }

  /* ══════════════════════════════════════════════
     YOU MIGHT ALSO LIKE
  ══════════════════════════════════════════════ */
  .cart-suggestions {
    max-width: 1200px; margin: 48px auto 0;
    padding: 40px 40px 0; border-top: 1px solid #e5e7eb;
  }
  .cart-suggestions-title {
    font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 700;
    color: #1a1228; margin: 0 0 24px;
  }
  .cart-suggestions-row {
    display: flex; gap: 18px; overflow-x: auto;
    scrollbar-width: none; padding-bottom: 12px;
  }
  .cart-suggestions-row::-webkit-scrollbar { display: none; }

  /* Card */
  .cart-suggestion-card {
    flex-shrink: 0; width: 232px;
    border: 1.5px solid #ede9f8; border-radius: 14px;
    overflow: hidden; background: #fff;
    display: flex; flex-direction: column;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    cursor: default;
  }
  .cart-suggestion-card:hover {
    border-color: #7c3aed;
    box-shadow: 0 8px 28px rgba(124,58,237,0.14);
    transform: translateY(-3px);
  }

  /* Thumbnail */
  .cart-suggestion-thumb-link { display: block; text-decoration: none; }
  .cart-suggestion-thumb {
    position: relative; height: 136px; overflow: hidden; background: #1a1228;
  }
  .cart-suggestion-thumb img {
    width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;
  }
  .cart-suggestion-card:hover .cart-suggestion-thumb img { transform: scale(1.05); }
  .cart-suggestion-play {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 40px; height: 40px; border-radius: 50%;
    background: rgba(255,255,255,0.92);
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; color: #22013a; opacity: 0; transition: opacity 0.2s;
  }
  .cart-suggestion-card:hover .cart-suggestion-play { opacity: 1; }

  /* Info block */
  .cart-suggestion-info {
    padding: 13px 13px 14px;
    display: flex; flex-direction: column; gap: 6px; flex: 1;
  }
  .cart-suggestion-name {
    font-size: 0.87rem; font-weight: 700; color: #1a1228; line-height: 1.35; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .cart-suggestion-desc {
    font-size: 0.72rem; color: #6b7280; line-height: 1.4; margin: 0;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }

  /* Rating row */
  .cart-suggestion-rating-row { display: flex; align-items: center; gap: 4px; }
  .cart-suggestion-rating-num   { font-size: 0.78rem; font-weight: 700; color: #b45309; }
  .cart-suggestion-rating-count { font-size: 0.7rem; color: #9b8db0; }

  /* Stars */
  .cp-stars { display: flex; gap: 1px; }
  .cp-star  { font-size: 0.68rem; color: #f59e0b; }

  /* Price row */
  .cart-suggestion-price-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .cart-suggestion-price    { font-size: 0.95rem; font-weight: 800; color: #1a1228; }
  .cart-suggestion-original { font-size: 0.74rem; color: #b0a0c8; text-decoration: line-through; }
  .cart-suggestion-free {
    display: inline-block; background: #dcfce7; color: #166534;
    font-size: 0.62rem; font-weight: 700; padding: 2px 7px;
    border-radius: 4px; letter-spacing: 0.3px;
  }

  /* Add to Cart button on card */
  .cart-suggestion-cart-btn {
    margin-top: 2px; width: 100%; padding: 9px 0;
    border-radius: 8px; border: none;
    background: linear-gradient(135deg, #22013a 0%, #7c1abd 50%, #8e5203 100%);
    color: #fff; font-size: 0.78rem; font-weight: 700;
    cursor: pointer; font-family: 'Outfit', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: all 0.2s; box-shadow: 0 2px 10px rgba(124,26,189,0.25);
  }
  .cart-suggestion-cart-btn:hover {
    transform: translateY(-1px); box-shadow: 0 5px 16px rgba(124,26,189,0.38);
  }
  .cart-suggestion-cart-btn.in-cart {
    background: linear-gradient(135deg, #065f46, #047857);
    box-shadow: 0 2px 10px rgba(4,120,87,0.25); cursor: default;
  }
  .cart-suggestion-cart-btn.in-cart:hover { transform: none; }

  /* ══════════════════════════════════════════════
     HOVER POPUP
  ══════════════════════════════════════════════ */
  .cp-popup {
    position: fixed; width: 300px;
    background: #fff; border-radius: 14px;
    box-shadow: 0 8px 40px rgba(26,18,40,0.22), 0 2px 8px rgba(0,0,0,0.08);
    border: 1.5px solid #ede9f8;
    z-index: 9999; padding: 20px; pointer-events: all;
    animation: cp-popup-in 0.18s cubic-bezier(0.34,1.4,0.64,1);
    font-family: 'Outfit', sans-serif;
  }
  @keyframes cp-popup-in {
    from { opacity: 0; transform: scale(0.94) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }
  .cp-popup::before {
    content: ''; position: absolute;
    width: 12px; height: 12px; background: #fff; transform: rotate(45deg);
  }
  .cp-popup.arrow-left::before  { left: -7px; top: 28px; border-right: 1.5px solid #ede9f8; border-bottom: 1.5px solid #ede9f8; }
  .cp-popup.arrow-right::before { right: -7px; top: 28px; border-left: 1.5px solid #ede9f8; border-top: 1.5px solid #ede9f8; }

  .cp-popup-badge {
    display: inline-block; background: #dcfce7; color: #166534;
    font-size: 0.62rem; font-weight: 700; padding: 2px 8px;
    border-radius: 4px; margin-bottom: 8px; letter-spacing: 0.3px;
  }
  .cp-popup-title {
    font-family: 'Lora', serif; font-size: 1rem; font-weight: 600;
    color: #1a1228; line-height: 1.4; margin-bottom: 4px;
  }
  .cp-popup-meta {
    font-size: 0.72rem; color: #9b8db0; margin-bottom: 6px;
    display: flex; align-items: center; gap: 6px;
  }
  .cp-popup-meta span { display: flex; align-items: center; gap: 3px; }
  .cp-popup-rating { display: flex; align-items: center; gap: 5px; margin-bottom: 4px; }
  .cp-popup-rating-num   { font-size: 0.8rem; font-weight: 700; color: #b45309; }
  .cp-popup-rating-count { font-size: 0.72rem; color: #9b8db0; }
  .cp-popup-divider { height: 1px; background: #f0ebf9; margin: 10px 0; }
  .cp-popup-what {
    font-size: 0.73rem; font-weight: 700; color: #1a1228;
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
  }
  .cp-popup-points {
    list-style: none; padding: 0; margin: 0 0 14px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .cp-popup-point {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 0.78rem; color: #4b3f6b; line-height: 1.45;
  }
  .cp-popup-check {
    width: 16px; height: 16px; border-radius: 50%;
    background: linear-gradient(135deg, #22013a, #8e5203);
    color: #fcd34d; display: flex; align-items: center;
    justify-content: center; font-size: 0.55rem; font-weight: 800;
    flex-shrink: 0; margin-top: 1px;
  }
  .cp-popup-bottom { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
  .cp-popup-price-current  { font-size: 1.1rem; font-weight: 800; color: #1a1228; line-height: 1; }
  .cp-popup-price-original { font-size: 0.72rem; color: #b0a0c8; text-decoration: line-through; }
  .cp-popup-cart-btn {
    flex: 1; padding: 11px 0; border-radius: 10px; border: none;
    background: linear-gradient(135deg, #22013a 0%, #7c1abd 50%, #8e5203 100%);
    color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer;
    font-family: 'Outfit', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.2s; box-shadow: 0 3px 12px rgba(124,26,189,0.3);
  }
  .cp-popup-cart-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,26,189,0.4); }
  .cp-popup-cart-btn.already-added {
    background: linear-gradient(135deg, #065f46, #047857);
    box-shadow: 0 3px 12px rgba(4,120,87,0.3); cursor: default;
  }
  .cp-popup-cart-btn.already-added:hover { transform: none; }
  .cp-popup-wishlist {
    width: 38px; height: 38px; border-radius: 10px;
    border: 1.5px solid #ede9f8; background: #faf8ff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem; transition: all 0.2s; flex-shrink: 0;
  }
  .cp-popup-wishlist:hover   { border-color: #e11d48; background: #fff1f2; }
  .cp-popup-wishlist.wishlisted { border-color: #e11d48; background: #fff1f2; }

  /* ── Toast ── */
  .cp-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%);
    background: #1a1228; color: #fff;
    font-family: 'Outfit', sans-serif; font-size: 0.83rem; font-weight: 600;
    padding: 12px 22px; border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 99999; display: flex; align-items: center; gap: 8px;
    animation: cp-toast-in 0.3s ease;
  }
  @keyframes cp-toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0);    }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .cart-page-inner  { grid-template-columns: 1fr; padding: 24px 20px 0; gap: 28px; }
    .cart-summary     { position: static; margin-top: 0; }
    .cart-suggestions { padding: 32px 20px 0; }
    .cp-popup         { display: none; }
  }
  @media (max-width: 480px) {
    .cart-page-title   { font-size: 1.5rem; }
    .cart-item-img     { width: 80px; height: 56px; }
    .cart-item-name    { font-size: 0.85rem; }
    .cart-summary-total { font-size: 1.8rem; }
    .cart-suggestion-card { width: 200px; }
  }
`;


/* ══════════════════════════════════════════════
   MAIN CART PAGE
══════════════════════════════════════════════ */
export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, addToCart, cartTotal, cartOriginalTotal } = useCart();

  const [hoveredSuggestion, setHoveredSuggestion] = useState(null);
  const [wishlist,           setWishlist]          = useState([]);
  const [toast,              setToast]             = useState(null);
  const hoverTimer = useRef(null);

  const discountPercent = cartOriginalTotal > 0
    ? Math.round((1 - cartTotal / cartOriginalTotal) * 100)
    : 0;

  /* ── Smart filter: only hide exact topic matches ── */
  const STOP_WORDS = new Set([
    "and","the","for","with","from","how","your","you",
    "this","that","are","was","will","have","has",
    "its","into","use","using","learn","course","complete"
  ]);
  const getKeywords = (title) =>
    title.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/)
      .filter(w => w.length >= 4 && !STOP_WORDS.has(w));

  const suggestions = TRENDING_COURSES.filter(c => {
    const cKeywords = getKeywords(c.title);
    return !cartItems.some(item => {
      const iKeywords = getKeywords(item.title || '');
      const matches   = cKeywords.filter(cw => iKeywords.some(iw => iw === cw));
      return matches.length >= 2;
    });
  });

  /* ── Hover handlers ── */
  const handleSuggestionEnter = (e, course) => {
    clearTimeout(hoverTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimer.current = setTimeout(() => setHoveredSuggestion({ course, rect }), 280);
  };
  const handleSuggestionLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredSuggestion(null), 160);
  };
  const handlePopupEnter = () => clearTimeout(hoverTimer.current);
  const handlePopupLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setHoveredSuggestion(null), 160);
  };

  const handleAddToCart = (course) => {
    addToCart(course);
    setHoveredSuggestion(null);
    setToast(`"${course.title.slice(0, 32)}…" added to cart`);
    setTimeout(() => setToast(null), 2800);
  };
  const handleWishlist = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  return (
    <>
      <style>{CSS}</style>
      <div className="cart-page">
        <div className="cart-page-inner">

          {/* ── Left: Items ── */}
          <div className="cart-left">
            <h1 className="cart-page-title">Shopping Cart</h1>
            <p className="cart-item-count">
              {cartItems.length} {cartItems.length === 1 ? "Course" : "Courses"} in Cart
            </p>

            {cartItems.length === 0 ? (
              <div className="cart-empty-state">
                <div className="cart-empty-icon-big">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Keep shopping to find a course!</p>
                <button className="cart-keep-shopping" onClick={() => navigate("/training")}>
                  Keep Shopping
                </button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item-row">
                    <div className="cart-item-img">
                      {item.thumbnail
                        ? <img src={item.thumbnail} alt={item.title} />
                        : <div className="cart-item-img-placeholder">{item.emoji || "📚"}</div>
                      }
                    </div>
                    <div className="cart-item-details">
                      <h3 className="cart-item-name" onClick={() => navigate(`/courses/${item._id}`)}>
                        {item.title}
                      </h3>
                      {item.instructor && <p className="cart-item-by">By {item.instructor}</p>}
                      <div className="cart-item-meta-row">
                        <span className="cart-item-bestseller">Bestseller</span>
                        {item.rating && <span className="cart-item-rating">⭐ {item.rating}</span>}
                        {item.hours  && <span className="cart-item-hours">{item.hours} total hours</span>}
                        {item.level  && <span className="cart-item-level">{item.level}</span>}
                      </div>
                      <div className="cart-item-actions">
                        <button className="cart-remove-btn" onClick={() => removeFromCart(item._id)}>
                          <FiTrash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price-col">
                      <span className="cart-item-price-current">{item.price}</span>
                      {item.originalPrice && (
                        <span className="cart-item-price-original">{item.originalPrice}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Summary ── */}
          {cartItems.length > 0 && (
            <aside className="cart-summary">
              <p className="cart-summary-label">Total:</p>
              <p className="cart-summary-total">${cartTotal}</p>
              {cartOriginalTotal !== cartTotal && (
                <>
                  <p className="cart-summary-original">${cartOriginalTotal}</p>
                  <p className="cart-summary-discount">{discountPercent}% off</p>
                </>
              )}
              <button className="cart-checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout →
              </button>
              <p className="cart-not-charged">You won't be charged yet</p>
            </aside>
          )}
        </div>

        {/* ══════════════════════════════════════════
            YOU MIGHT ALSO LIKE
        ══════════════════════════════════════════ */}
        {suggestions.length > 0 && (
          <div className="cart-suggestions">
            <h2 className="cart-suggestions-title">You might also like</h2>
            <div className="cart-suggestions-row">
              {suggestions.map(s => {
                const alreadyInCart = cartItems.some(item => item._id === s._id);
                return (
                  <div
                    key={s.id}
                    className="cart-suggestion-card"
                    onMouseEnter={e => handleSuggestionEnter(e, s)}
                    onMouseLeave={handleSuggestionLeave}
                  >
                    {/* Clickable thumbnail → opens YouTube */}
                    <a href={s.link} target="_blank" rel="noopener noreferrer"
                      className="cart-suggestion-thumb-link">
                      <div className="cart-suggestion-thumb">
                        <img src={s.thumbnail} alt={s.title} />
                        <div className="cart-suggestion-play">▶</div>
                      </div>
                    </a>

                    {/* Info */}
                    <div className="cart-suggestion-info">
                      <p className="cart-suggestion-name">{s.title}</p>
                      <p className="cart-suggestion-desc">{s.description}</p>

                      {/* Rating */}
                      <div className="cart-suggestion-rating-row">
                        <span className="cart-suggestion-rating-num">{s.rating}</span>
                        <Stars rating={s.rating} />
                        <span className="cart-suggestion-rating-count">
                          ({s.ratingCount?.toLocaleString()})
                        </span>
                      </div>

                      {/* Price + Free Preview badge */}
                      <div className="cart-suggestion-price-row">
                        <span className="cart-suggestion-price">{s.price}</span>
                        {s.originalPrice && (
                          <span className="cart-suggestion-original">{s.originalPrice}</span>
                        )}
                        <span className="cart-suggestion-free">Free Preview</span>
                      </div>

                      {/* Add to Cart */}
                      <button
                        className={`cart-suggestion-cart-btn ${alreadyInCart ? "in-cart" : ""}`}
                        onClick={() => !alreadyInCart && handleAddToCart(s)}
                      >
                        {alreadyInCart ? "✓ Added to Cart" : "🛒 Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Hover popup (desktop only) ── */}
      {hoveredSuggestion && (
        <div onMouseEnter={handlePopupEnter} onMouseLeave={handlePopupLeave}>
          <SuggestionPopup
            course={hoveredSuggestion.course}
            cardRect={hoveredSuggestion.rect}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onWishlist={handleWishlist}
            alreadyInCart={cartItems.some(item => item._id === hoveredSuggestion.course._id)}
          />
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && <div className="cp-toast">🛒 {toast}</div>}

      <Footer />
    </>
  );
}
