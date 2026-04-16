import React, { useState, useContext, useRef, useEffect } from "react";
import {
  FiUser, FiMenu, FiX, FiBookOpen, FiDollarSign,
  FiLogIn, FiUserPlus, FiLogOut, FiAward, FiSearch, FiShoppingCart, FiTrash2, FiPhone, FiMail, FiBriefcase
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaWhatsapp } from "react-icons/fa";
import EnrollmentModal from './EnrollmentModal';

const Navbar = () => {
  const [searchQuery, setSearchQuery]               = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen]     = useState(false);
  const [isSearchFocused, setIsSearchFocused]       = useState(false);
  const [suggestions, setSuggestions]               = useState([]);
  const [showSuggestions, setShowSuggestions]       = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex]               = useState(-1);
  const [showCartDropdown, setShowCartDropdown]     = useState(false); // ← dropdown state
const [showEnrollModal, setShowEnrollModal] = useState(false);


  const { user, logout } = useContext(AuthContext);
  const { cartItems, removeFromCart, cartTotal, cartOriginalTotal } = useCart();
  const cartCount = cartItems.length;

  const location    = useLocation();
  const navigate    = useNavigate();
  const debounceRef = useRef(null);
  const searchRef   = useRef(null);
  const cartRef     = useRef(null); 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false);
      if (cartRef.current && !cartRef.current.contains(e.target))
        setShowCartDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = (q) => {
    if (!q.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoadingSuggestions(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res  = await fetch(`${BASE}/api/search/suggestions?q=${encodeURIComponent(q)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        }
      } catch { setSuggestions([]); }
      finally  { setLoadingSuggestions(false); }
    }, 300);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    if (suggestion.type === "course")       navigate(`/courses/${suggestion._id}`);
    else if (suggestion.type === "diploma") navigate(`/diplomas/${suggestion._id}`);
    else                                    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if      (e.key === "ArrowDown")                    { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")                      { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && activeIndex >= 0)    { e.preventDefault(); handleSuggestionClick(suggestions[activeIndex]); }
    else if (e.key === "Escape")                       { setShowSuggestions(false); setActiveIndex(-1); }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(p => !p);
  const closeMobileMenu  = () => setIsMobileMenuOpen(false);

  const handleUserClick = () => {
    closeMobileMenu();
    if (user) navigate(
      user.role === "admin" || user.isAdmin || user.email?.includes("admin")
        ? "/admin/dashboard" : "/student/dashboard"
    );
  };

  const typeIcon  = (t) => t === "course" ? <FiBookOpen size={14}/> : t === "diploma" ? <FiAward size={14}/> : <FiSearch size={14}/>;
  const typeLabel = (t) => t === "course" ? "Course" : t === "diploma" ? "Diploma" : "Topic";

  if (location.pathname === "/login" || location.pathname === "/register") return null;

  return (
    <>
      <div className="topbar-links">
  <a href="https://arteanalytics.com/services/">Digital Services</a>
  
  <a className="coming-soon-link">
    Junior Academy
    <span className="coming-soon-badge">Coming Soon</span>
  </a>
  
  <a className="coming-soon-link">
    She Learns
    <span className="coming-soon-badge">Coming Soon</span>
  </a>
  
  <a className="coming-soon-link">
    Digital Flyers
    <span className="coming-soon-badge">Coming Soon</span>
  </a>
  
  <a className="coming-soon-link">
    Class Schedule
    <span className="coming-soon-badge">Coming Soon</span>
  </a>
  
  <a href="/feestructure">Fee Structure</a>
</div>

<div className="topbar-info">
<a className="topbar-dreamjob-btn" href="/Careers">
  <FiBriefcase size={13} /> Get a Dream Job
</a>

<span>
  <FiPhone size={13} /> 
  <a href="tel:+923309998880">UAN +92 3309998880</a>
</span>

<span>
  <FiMail size={13} /> 
  <a href="mailto:itechskill6@gmail.com">itechskill6@gmail.com</a>
</span>

<span>
  <FaWhatsapp size={14} /> 
  <a href="https://wa.me/923309998880" target="_blank" rel="noopener noreferrer">
    +92 3309998880
  </a>
</span>
<button
  className="topbar-enroll-btn"
  onClick={() => setShowEnrollModal(true)}
>
  Enroll Now
</button>
</div>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              <img src={logo} alt="ITechSkill Logo" className="logo-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/50/ffffff/13032e?text=IT"; }} />
              <span className="logo-text">ITechSkill</span>
            </Link>
          </div>

          {/* CENTER — Courses / Diplomas / Search */}
          <div className="navbar-center">
            <Link to="/trainings" className="courses-nav-button desktop-only" onClick={closeMobileMenu}>
              <FiBookOpen className="courses-icon" /><span>Trainings</span>
            </Link>
            <Link to="/diplomas" className="diploma-nav-button desktop-only" onClick={closeMobileMenu}>
              <FiAward className="diploma-icon" /><span>Diplomas</span>
            </Link>

            {/* Search bar */}
            <div className={`search-bar ${isSearchFocused ? "focused" : ""}`} ref={searchRef}>
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                  <input
                    type="text" placeholder="Search Anything..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setActiveIndex(-1); fetchSuggestions(e.target.value); }}
                    onFocus={() => { setIsSearchFocused(true); if (suggestions.length > 0) setShowSuggestions(true); }}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    className="search-input" autoComplete="off"
/>
                  <button type="submit" className="search-submit-btn"><FiSearch size={16} /></button>
                </div>
              </form>

              {showSuggestions && (
                <div className="search-suggestions">
                  {loadingSuggestions ? (
                    <div className="suggestion-loading"><span className="suggestion-spinner" />Searching...</div>
                  ) : suggestions.length > 0 ? (
                    <>
                      {suggestions.map((s, i) => (
                        <div key={s._id || i}
                          className={`suggestion-item ${i === activeIndex ? "active" : ""}`}
                          onMouseDown={() => handleSuggestionClick(s)}>
                          <span className={`suggestion-type-badge ${s.type}`}>{typeIcon(s.type)}{typeLabel(s.type)}</span>
                          <span className="suggestion-title">{s.title}</span>
                          {s.category && <span className="suggestion-category">{s.category}</span>}
                        </div>
                      ))}
                      <div className="suggestion-footer" onMouseDown={handleSearch}>
                        <FiSearch size={13} /> See all results for "<strong>{searchQuery}</strong>"
                      </div>
                    </>
                  ) : (
                    <div className="suggestion-empty">
                      <FiSearch size={20} />
                      <p>No results for "<strong>{searchQuery}</strong>"</p>
                      <span>Try different keywords</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="navbar-right">
            <div className="nav-links desktop-only">

              {/* ── Cart button → opens dropdown (NOT a Link) ── */}
              <div className="cart-nav-wrapper" ref={cartRef}>
                <button
                  className="cart-nav-button"
                  onClick={() => setShowCartDropdown(p => !p)}
                  aria-label="Open cart"
                >
                  <div className="cart-icon-wrapper">
                    <FiShoppingCart className="cart-icon" />
                    {cartCount > 0 && (
                      <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>
                    )}
                  </div>
                </button>

                {/* ── Dropdown ── */}
                {showCartDropdown && (
                  <div className="cart-dropdown">
                    {cartCount === 0 ? (
                      <div className="cart-dropdown-empty">
                        <span className="cart-empty-icon">🛒</span>
                        <p>Your cart is empty</p>
                        <span>Add courses to get started!</span>
                      </div>
                    ) : (
                      <>
                        <div className="cart-dropdown-items">
                          {cartItems.map((item) => (
                            <div key={item._id} className="cart-dropdown-item">
                              <div className="cart-item-thumb">
                                {item.thumbnail
                                  ? <img src={item.thumbnail} alt={item.title} />
                                  : <div className="cart-item-thumb-placeholder">{item.emoji || "📚"}</div>
                                }
                              </div>
                              <div className="cart-item-info">
                                <p className="cart-item-title">{item.title}</p>
                                <span className="cart-item-instructor">{item.instructor}</span>
                                <div className="cart-item-prices">
                                  <span className="cart-item-price">{item.price}</span>
                                  {item.originalPrice && (
                                    <span className="cart-item-original">{item.originalPrice}</span>
                                  )}
                                </div>
                              </div>
                              <button className="cart-item-remove" onClick={() => removeFromCart(item._id)} title="Remove">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="cart-dropdown-footer">
                          <div className="cart-total-row">
                            <span className="cart-total-label">Total:</span>
                            <div className="cart-total-prices">
                              <span className="cart-total-current">${cartTotal}</span>
                              {cartOriginalTotal !== cartTotal && (
                                <span className="cart-total-original">${cartOriginalTotal}</span>
                              )}
                            </div>
                          </div>
                          <Link to="/cart" className="cart-goto-btn"
                            onClick={() => setShowCartDropdown(false)}>
                            Go to cart
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link to="/pricing" className="nav-link pricing-link">
                <FiDollarSign style={{ marginRight: "6px" }} />Pricing
              </Link>

              {user ? (
                <>
                  <div className="user-welcome clickable" onClick={handleUserClick}
                    role="button" tabIndex={0}
                    onKeyPress={(e) => { if (e.key === "Enter" || e.key === " ") handleUserClick(); }}>
                    <span className="welcome-text">Welcome,</span>
                    <span className="user-name">{user.fullName || user.name || "User"}</span>
                  </div>
                  <button onClick={logout} className="nav-button logout-button">
                    <FiLogOut className="button-icon" /><span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login"    className="nav-button login-button"><FiLogIn    className="button-icon"/><span>Login</span></Link>
                  <Link to="/register" className="nav-button signup-button"><FiUserPlus className="button-icon"/><span>Sign Up</span></Link>
                </>
              )}
            </div>

            <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <div className="mobile-menu-content">
            <div className="mobile-divider" />
            <Link to="/trainings" className="mobile-menu-item" onClick={closeMobileMenu}><FiBookOpen className="menu-item-icon"/><span>Trainings</span></Link>
            <Link to="/diplomas"       className="mobile-menu-item diploma-mobile-item" onClick={closeMobileMenu}><FiAward className="menu-item-icon"/><span>Diplomas</span></Link>
            <Link to="/cart"           className="mobile-menu-item cart-mobile-item"    onClick={closeMobileMenu}>
              <div className="cart-icon-wrapper">
                <FiShoppingCart className="menu-item-icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? "99+" : cartCount}</span>}
              </div>
              <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            </Link>
            <Link to="/pricing" className="mobile-menu-item" onClick={closeMobileMenu}><FiDollarSign className="menu-item-icon"/><span>Pricing</span></Link>
            <div className="mobile-divider" />
            {user ? (
              <>
                <div className="mobile-user-info clickable" onClick={handleUserClick} role="button" tabIndex={0}
                  onKeyPress={(e) => { if (e.key === "Enter" || e.key === " ") handleUserClick(); }}>
                  <FiUser className="user-icon" />
                  <div className="user-details">
                    <span className="user-greeting">Welcome back!</span>
                    <span className="user-name-mobile">{user.fullName || user.name || "User"}</span>
                  </div>
                </div>
                <button onClick={() => { logout(); closeMobileMenu(); }} className="mobile-menu-button logout">
                  <FiLogOut style={{ marginRight: "8px" }} /><span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login"    className="mobile-menu-button login"  onClick={closeMobileMenu}><FiLogIn    style={{ marginRight: "8px" }}/><span>Login</span></Link>
                <Link to="/register" className="mobile-menu-button signup" onClick={closeMobileMenu}><FiUserPlus style={{ marginRight: "8px" }}/><span>Sign Up</span></Link>
              </>
            )}
          </div>
        </div>

      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu} />}
    </nav>

    {/* Enrollment Modal */}
    {showEnrollModal && (
      <EnrollmentModal
        course={null}
        onClose={() => setShowEnrollModal(false)}
      />
    )}
 
    </>
  );
};


export default Navbar;
