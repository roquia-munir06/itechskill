import React, { useState, useContext, useRef, useEffect } from "react";
import { FiMenu, FiX, FiBookOpen, FiDollarSign,
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


// Add this after your existing useEffects
useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${window.scrollY}px`;
  } else {
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  };
}, [isMobileMenuOpen]);

  const fetchSuggestions = (q) => {
    if (!q.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    setLoadingSuggestions(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000/api")
             .replace(/\/api$/, "");
const res = await fetch(`${BASE}/api/search/suggestions?q=${encodeURIComponent(q)}&limit=6`);
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
    setSearchQuery(""); 
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

 const handleSuggestionClick = (suggestion) => {
    setSearchQuery("");
  setSearchQuery(suggestion.title);
  setShowSuggestions(false);
  if (suggestion.type === "course") {
    navigate(`/course/${suggestion.slug || suggestion._id}`);
  } else if (suggestion.type === "diploma") {
    navigate(`/diplomas/${suggestion.slug || suggestion._id}`);
  } else if (suggestion.type === "program") {
    navigate(`/programs/${suggestion.slug || suggestion._id}`);
  } else {
    navigate(`/search?q=${encodeURIComponent(suggestion.title)}`);
  }
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
  <a href='https://markazai.cloud/'>AI Academy</a>
  
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
<Link to="/course-outline" className="diploma-nav-button desktop-only" onClick={closeMobileMenu}>
  <FiBookOpen className="courses-icon" /><span>Outlines</span>
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
style={{ fontSize: "13px" }}
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

    {/* User / Auth Hero */}
    {user ? (
      <div className="mm-user-hero">
        <div className="mm-u-avatar">{(user.fullName || user.name || "U").charAt(0).toUpperCase()}</div>
        <div className="mm-u-info">
          <div className="mm-u-name">{user.fullName || user.name || "User"}</div>
          <div className="mm-u-tag">{user.email || "Welcome back!"}</div>
        </div>
        <button className="mm-u-logout" onClick={() => { logout(); closeMobileMenu(); }}>Logout</button>
      </div>
    ) : (
      <div className="mm-auth-hero">
        <div className="mm-auth-hero-text">
          <p>Welcome to ITechSkill</p>
          <span>Sign in to access your dashboard</span>
        </div>
        <div className="mm-auth-pair">
          <Link to="/login" className="mm-auth-btn ab-l" onClick={closeMobileMenu}><FiLogIn size={13}/> Login</Link>
          <Link to="/register" className="mm-auth-btn ab-s" onClick={closeMobileMenu}><FiUserPlus size={13}/> Sign Up</Link>
        </div>
      </div>
    )}

  {/* Enroll Strip */}  
    <div className="mm-enroll-strip">
      <span className="mm-es-text">Start learning today</span>
      <button className="mm-es-btn" onClick={() => { setShowEnrollModal(true); closeMobileMenu(); }}>Enroll Now</button>
    </div>

    {/* Navigate */}
    <div className="mm-section">
    
      <div className="mm-nav-list">
        <Link to="/trainings" className="mm-nav-row" onClick={closeMobileMenu}>
          <div className="mm-nav-ic ni-p"><FiBookOpen size={15}/></div>
          <div className="mm-nav-text"><div className="mm-nav-title">Trainings</div><div className="mm-nav-sub">All courses & workshops</div></div>
          <span className="mm-chev">›</span>
        </Link>
        <Link to="/diplomas" className="mm-nav-row" onClick={closeMobileMenu}>
          <div className="mm-nav-ic ni-a"><FiAward size={15}/></div>
          <div className="mm-nav-text"><div className="mm-nav-title">Diplomas</div><div className="mm-nav-sub">1-year certified programs</div></div>
          <span className="mm-chev">›</span>
        </Link>
        <Link to="/course-outline" className="mm-nav-row" onClick={closeMobileMenu}>
  <div className="mm-nav-ic ni-p"><FiBookOpen size={15}/></div>
  <div className="mm-nav-text"><div className="mm-nav-title">Course Outlines</div><div className="mm-nav-sub">View full course breakdowns</div></div>
  <span className="mm-chev">›</span>
</Link>
        <Link to="/cart" className="mm-nav-row" onClick={closeMobileMenu}>
          <div className="mm-nav-ic ni-g"><FiShoppingCart size={15}/></div>
          <div className="mm-nav-text"><div className="mm-nav-title">Cart</div><div className="mm-nav-sub">{cartCount > 0 ? `${cartCount} items waiting` : "Your cart"}</div></div>
          <div className="mm-nav-right">{cartCount > 0 && <span className="mm-cbadge">{cartCount}</span>}<span className="mm-chev">›</span></div>
        </Link>
        <Link to="/pricing" className="mm-nav-row" onClick={closeMobileMenu}>
          <div className="mm-nav-ic ni-b"><FiDollarSign size={15}/></div>
          <div className="mm-nav-text"><div className="mm-nav-title">Pricing</div><div className="mm-nav-sub">Plans & packages</div></div>
          <span className="mm-chev">›</span>
        </Link>
      </div>
    </div>

    <div className="mm-divider" />

    {/* Quick Links */}
    <div className="mm-section">
      <div className="mm-sec-label">Quick Links</div>
      <div className="mm-chip-grid">
        <a href="https://arteanalytics.com/services/" className="mm-chip"><div className="mm-chip-name">Digital Services</div><div className="mm-chip-sub">arteanalytics.com</div></a>
        <a href="//markazai.cloud/"className="mm-chip"><div className="mm-chip-name">AI Academy</div><div className="mm-chip-sub">markazai.com</div></a>
        <span className="mm-chip off"><div className="mm-chip-name">She Learns <em className="mm-soon">Soon</em></div><div className="mm-chip-sub">Coming soon</div></span>
        <span className="mm-chip off"><div className="mm-chip-name">Digital Flyers <em className="mm-soon">Soon</em></div><div className="mm-chip-sub">Coming soon</div></span>
        <a href="/feestructure" className="mm-chip"><div className="mm-chip-name">Fee Structure</div><div className="mm-chip-sub">View all fees</div></a>
        <span className="mm-chip off"><div className="mm-chip-name">Class Schedule <em className="mm-soon">Soon</em></div><div className="mm-chip-sub">Coming soon</div></span>
      </div>
    </div>

    <div className="mm-divider" />

    {/* Contact */}
    <div className="mm-section">
      <div className="mm-sec-label">Contact</div>
      <div className="mm-contact-list">
        <a href="tel:+923309998880" className="mm-contact-row"><div className="mm-ci ci-g"><FiPhone size={13}/></div><span className="mm-ctxt">UAN +92 3309998880</span></a>
        <a href="mailto:itechskill6@gmail.com" className="mm-contact-row"><div className="mm-ci ci-b"><FiMail size={13}/></div><span className="mm-ctxt">itechskill6@gmail.com</span></a>
        <a href="https://wa.me/923309998880" target="_blank" rel="noopener noreferrer" className="mm-contact-row"><div className="mm-ci ci-w"><FaWhatsapp size={13}/></div><span className="mm-ctxt">WhatsApp +92 3309998880</span></a>
      </div>
    </div>

    <a href="/Careers" className="mm-dream-row" onClick={closeMobileMenu}>
      <div className="mm-dream-ic"><FiBriefcase size={14}/></div>
      <div><div className="mm-dream-txt">Get a Dream Job</div><div className="mm-dream-sub">Explore career opportunities</div></div>
      <span className="mm-chev" style={{marginLeft:"auto",color:"#d97706"}}>›</span>
    </a>

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
