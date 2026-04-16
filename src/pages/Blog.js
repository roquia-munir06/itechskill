// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { Link } from "react-router-dom";
// import Footer from "../components/Footer";
// import { useScrollToTop } from "../hooks/useScrollToTop";
// import {
//   FaCalendarAlt,
//   FaUser,
//   FaArrowLeft,
//   FaArrowRight,
//   FaChevronDown,
// } from "react-icons/fa";
// import {
//   getAllBlogs,
//   getFeaturedBlogs,
//   // getBlogCategories,   // ← UNCOMMENT THIS
//   // getCourseCategories, // ← COMMENT THIS OUT
// } from "../api/api";
// import "./Blog.css";

// // Add this helper function before your main component
// const getFormatIcon = (format) => {
//   const icons = {
//     video: '🎥',
//     gallery: '🖼️',
//     link: '🔗',
//     quote: '💬',
//     audio: '🎵',
//     image: '📷',
//     status: '📢',
//     aside: '📝',
//     standard: '📄'
//   };
//   return icons[format] || '📄';
// };

// const getFormatColor = (format) => {
//   const colors = {
//     video: '#FF6B6B',
//     gallery: '#4ECDC4',
//     link: '#45B7D1',
//     quote: '#96CEB4',
//     audio: '#FFEAA7',
//     image: '#D4A5A5',
//     status: '#9B59B6',
//     aside: '#3498DB',
//     standard: '#95A5A6'
//   };
//   return colors[format] || '#95A5A6';
// };

// const Blog = () => {
//   useScrollToTop();

//   const [categories, setCategories] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [featuredBlogs, setFeaturedBlogs] = useState([]);
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // CHANGE: Use blogCategories instead of courseCategories
//   const [blogCategories, setBlogCategories] = useState([]); // ← CHANGE THIS
//   // const [courseCategories, setCourseCategories] = useState([]); // ← COMMENT OUT
  
//   const [activeCategory, setActiveCategory] = useState(null);
  
//   // State to track arrow visibility for each category
//   const [arrowVisibility, setArrowVisibility] = useState({});
  
//   const scrollRefs = useRef({});
//   const dropdownRef = useRef(null);

//   // Default fallback image if blog has no thumbnail
//   const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Function to check scroll position for a specific category
//   const checkScrollPosition = (category) => {
//     const container = scrollRefs.current[category];
//     if (container) {
//       const { scrollLeft, scrollWidth, clientWidth } = container;
      
//       setArrowVisibility(prev => ({
//         ...prev,
//         [category]: {
//           showLeft: scrollLeft > 10,
//           showRight: scrollLeft + clientWidth < scrollWidth - 10
//         }
//       }));
//     }
//   };

//   // Add scroll event listeners to all category containers
//   useEffect(() => {
//     if (Object.keys(scrollRefs.current).length > 0) {
//       // Initial check for all categories
//       blogCategories.forEach(cat => { // ← CHANGE HERE
//         setTimeout(() => checkScrollPosition(cat), 100);
//       });
      
//       // Add scroll and resize listeners for each category
//       const containers = Object.values(scrollRefs.current);
//       const handleScroll = () => {
//         blogCategories.forEach(cat => checkScrollPosition(cat)); // ← CHANGE HERE
//       };
      
//       containers.forEach(container => {
//         if (container) {
//           container.addEventListener('scroll', handleScroll);
//         }
//       });
      
//       window.addEventListener('resize', handleScroll);
      
//       return () => {
//         containers.forEach(container => {
//           if (container) {
//             container.removeEventListener('scroll', handleScroll);
//           }
//         });
//         window.removeEventListener('resize', handleScroll);
//       };
//     }
//   }, [blogCategories, blogs]); // ← CHANGE HERE

//   // Fetch data from backend
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching blogs and categories...");
        
//         // CHANGE: Fetch blog categories instead of course categories
//         const [allBlogs, featured] = await Promise.all([
//           getAllBlogs(),
//           getFeaturedBlogs()
//           // getBlogCategories() // ← Uncomment if you have this API
//         ]);

//         // Get unique categories from blogs (since we don't have blogCategories API yet)
//         const uniqueCategories = [...new Set(allBlogs
//           .filter(blog => blog.status === "published")
//           .map(blog => blog.category)
//           .filter(Boolean)
//         )];

//         console.log("Blog categories:", uniqueCategories);
//         console.log("All blogs from API:", allBlogs);
//         console.log("Number of blogs:", allBlogs.length);
//         console.log("Featured blogs:", featured);
        
//         // 🔍 DEBUG: Check each blog's ID
//         console.log("🔍 BLOG IDS VALIDATION:");
//         allBlogs.forEach((blog, index) => {
//           const isValid = /^[0-9a-fA-F]{24}$/.test(blog._id);
//           console.log(`Blog ${index + 1}:`, {
//             title: blog.title,
//             id: blog._id,
//             idLength: blog._id?.length,
//             isValidMongoId: isValid,
//             idType: typeof blog._id
//           });
//         });

//         // 🔍 DEBUG: Check featured blog IDs
//         console.log("🔍 FEATURED BLOG IDS:");
//         featured.forEach((blog, index) => {
//           const isValid = /^[0-9a-fA-F]{24}$/.test(blog._id);
//           console.log(`Featured ${index + 1}:`, {
//             title: blog.title,
//             id: blog._id,
//             idLength: blog._id?.length,
//             isValidMongoId: isValid
//           });
//         });

//         // CHANGE: Set blogCategories instead of courseCategories
//         setBlogCategories(uniqueCategories);
//         setBlogs(allBlogs);
//         setFeaturedBlogs(featured);
        
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load blogs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Group blogs by category
//   const blogsByCategory = useMemo(() => {
//     const grouped = {};
//     blogCategories.forEach(cat => { // ← CHANGE HERE
//       grouped[cat] = blogs.filter((b) => b.category === cat && b.status === "published");
//     });
//     return grouped;
//   }, [blogCategories, blogs]); // ← CHANGE HERE

//   // Scroll function with arrow visibility update
//   const scroll = (category, direction) => {
//     const container = scrollRefs.current[category];
//     if (container) {
//       const scrollAmount = direction === 'left' ? -300 : 300;
//       container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
//       // Update arrow visibility after scroll completes
//       setTimeout(() => checkScrollPosition(category), 300);
//     }
//   };

//   return (
//     <div className="blog-container">
//       {/* HERO SECTION */}
//       <div className="blog-hero-section full-width">
//         <div className="blog-hero-content">
//           <h1 className="blog-hero-title"><i>iTechSkill Blogs</i></h1>
//           <h2 className="blog-hero-subtitle"><i>Your Access to Technology Knowledge & Career Opportunities</i></h2>
//           <p className="blog-hero-description">
//             Take a look through our library of in-depth expert guides covering web dev, mobile apps, 
//             data science and how to succeed in your career. Keep up with the latest technology and trends.
//           </p>
//         </div>
//       </div>

//       {loading && <p className="blog-status">Loading blogs...</p>}
//       {error && <p className="blog-status error">{error}</p>}

//       {!loading && !error && (
//         <>
//           {/* CATEGORY BAR - CHANGE ALL REFERENCES */}
//           {!isMobile ? (
//             <div className="blog-category-bar full-width purple-bg">
//               <div className="blog-category-bar-container fixed-one-line">
//               <button
//   className={`blog-category-bar-btn no-icon ${!activeCategory ? 'active' : ''}`}
//   onClick={() => setActiveCategory(null)}
// >
//   <span>All</span>
// </button>
//                {blogCategories.map((cat) => (
//   <button
//     key={cat}
//     className={`blog-category-bar-btn no-icon ${activeCategory === cat ? 'active' : ''}`}
//     onClick={() => setActiveCategory(cat)}
//   >
//     <span>{cat}</span>
//   </button>
// ))}
//               </div>
//             </div>
//           ) : (
//             <div className="blog-category-dropdown mobile-only" ref={dropdownRef}>
//               <button 
//                 className="blog-dropdown-toggle"
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//               >
//                 <span>{activeCategory || "Select Category"}</span>
//                 <FaChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
//               </button>
              
//               {dropdownOpen && (
//                 <div className="blog-dropdown-menu">
//                   <div 
//                     className="blog-dropdown-item"
//                     onClick={() => {
//                       setActiveCategory(null);
//                       setDropdownOpen(false);
//                     }}
//                   >
//                     All
//                   </div>
//                   {blogCategories.map((cat) => ( // ← CHANGE HERE
//                     <div
//                       key={cat}
//                       className="blog-dropdown-item"
//                       onClick={() => {
//                         setActiveCategory(cat);
//                         setDropdownOpen(false);
//                       }}
//                     >
//                       {cat}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* FEATURED SECTION - WITH THUMBNAILS */}
//           {featuredBlogs.length > 0 && (
//             <div className="blog-featured-section">
//               <h2 className="blog-section-title">Featured Articles</h2>
//               <div className="blog-featured-grid">
//                 {featuredBlogs.map((post) => {
//                   const isValidId = /^[0-9a-fA-F]{24}$/.test(post._id);
//                   console.log(`🔗 Featured Blog Link: /blog/${post._id}`, {
//                     title: post.title,
//                     id: post._id,
//                     isValid: isValidId
//                   });
                  
//                   return (
//                     <Link to={`/blog/${post._id}`} key={post._id} className="blog-featured-card">
//                       <div className="blog-featured-image">
//                         <img 
//                           src={post.image || defaultImage} 
//                           alt={post.title}
//                           onError={(e) => {
//                             e.target.src = defaultImage;
//                           }}
//                         />
//                         {/* Add format badge */}
//                         {post.postFormat && post.postFormat !== 'standard' && (
//                           <span 
//                             className="blog-format-badge"
//                             style={{ backgroundColor: getFormatColor(post.postFormat) }}
//                           >
//                             {getFormatIcon(post.postFormat)} {post.postFormat}
//                           </span>
//                         )}
//                       </div>
//                       <div className="blog-featured-content">
//                         <div className="blog-post-category-tag">{post.category}</div>
//                         <h3 className="blog-featured-post-title">{post.title}</h3>
//                         <div className="blog-featured-author">
//                           <FaUser /> {post.author || "Admin"}
//                         </div>
//                       </div>
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* BLOG SECTIONS BY CATEGORY - WITH THUMBNAILS AND DYNAMIC ARROWS */}
//           {(activeCategory ? [activeCategory] : blogCategories).map((cat) => { // ← CHANGE HERE
//             const categoryPosts = blogsByCategory[cat] || [];
//             if (categoryPosts.length === 0) return null;
            
//             const visibility = arrowVisibility[cat] || { showLeft: false, showRight: true };
            
//             return (
//               <div key={cat} className="blog-category-horizontal-section">
//                 <div className="category-header">
//                   <h2 className="blog-category-title">{cat} Articles</h2>
//                 </div>
                
//                 <div className="blog-horizontal-scroll-container">
//                   {/* Left Arrow - only shown when not at start */}
//                   {visibility.showLeft && (
//                     <button 
//                       className="scroll-arrow left-arrow"
//                       onClick={() => scroll(cat, 'left')}
//                       aria-label="Scroll left"
//                     >
//                       <FaArrowLeft />
//                     </button>
//                   )}
                  
//                   <div 
//                     className="blog-horizontal-scroll"
//                     ref={el => {
//                       scrollRefs.current[cat] = el;
//                       // Check scroll position when ref is set
//                       if (el) {
//                         setTimeout(() => checkScrollPosition(cat), 100);
//                       }
//                     }}
//                     onScroll={() => checkScrollPosition(cat)}
//                   >
//                     {categoryPosts.map((post) => {
//                       const isValidId = /^[0-9a-fA-F]{24}$/.test(post._id);
//                       console.log(`🔗 Horizontal Blog Link: /blog/${post._id}`, {
//                         title: post.title,
//                         id: post._id,
//                         isValid: isValidId,
//                         category: cat
//                       });
                      
//                       return (
//                         <Link to={`/blog/${post._id}`} key={post._id} className="blog-horizontal-card">
//                           <div className="blog-horizontal-image">
//                             <img 
//                               src={post.image || defaultImage} 
//                               alt={post.title}
//                               onError={(e) => {
//                                 e.target.src = defaultImage;
//                               }}
//                             />
//                             {/* Add format badge */}
//                             {post.postFormat && post.postFormat !== 'standard' && (
//                               <span 
//                                 className="blog-format-badge small"
//                                 style={{ backgroundColor: getFormatColor(post.postFormat) }}
//                               >
//                                 {getFormatIcon(post.postFormat)}
//                               </span>
//                             )}
//                           </div>
//                           <div className="blog-horizontal-content">
//                             <div className="blog-horizontal-meta-top">
//                               <span className="blog-tag">{post.category}</span>
//                               <span className="blog-horizontal-date">
//                                 <FaCalendarAlt /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
//                               </span>
//                             </div>
//                             <h3 className="blog-horizontal-title">{post.title}</h3>
//                             <p className="blog-horizontal-excerpt">{post.excerpt}</p>
//                             <div className="blog-horizontal-meta">
//                               <span className="blog-horizontal-author">
//                                 <FaUser /> {post.author || "Admin"}
//                               </span>
//                               <span className="blog-horizontal-read">
//                                 {post.postFormat && post.postFormat !== 'standard' ? (
//                                   <span style={{ color: getFormatColor(post.postFormat) }}>
//                                     {getFormatIcon(post.postFormat)} {post.postFormat}
//                                   </span>
//                                 ) : (
//                                   '5 min read'
//                                 )}
//                               </span>
//                             </div>
//                             <span className="blog-read-more">Read More →</span>
//                           </div>
//                         </Link>
//                       );
//                     })}
//                   </div>
                  
//                   {/* Right Arrow - only shown when not at end */}
//                   {visibility.showRight && (
//                     <button 
//                       className="scroll-arrow right-arrow"
//                       onClick={() => scroll(cat, 'right')}
//                       aria-label="Scroll right"
//                     >
//                       <FaArrowRight />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default Blog;













import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";
import {
  getAllBlogs,
  getFeaturedBlogs,
  // getBlogCategories,   // ← UNCOMMENT THIS
  // getCourseCategories, // ← COMMENT THIS OUT
} from "../api/api";
import "./Blog.css";

// Add this helper function before your main component
const getFormatIcon = (format) => {
  const icons = {
    video: '🎥',
    gallery: '🖼️',
    link: '🔗',
    quote: '💬',
    audio: '🎵',
    image: '📷',
    status: '📢',
    aside: '📝',
    standard: '📄'
  };
  return icons[format] || '📄';
};

const getFormatColor = (format) => {
  const colors = {
    video: '#FF6B6B',
    gallery: '#4ECDC4',
    link: '#45B7D1',
    quote: '#96CEB4',
    audio: '#FFEAA7',
    image: '#D4A5A5',
    status: '#9B59B6',
    aside: '#3498DB',
    standard: '#95A5A6'
  };
  return colors[format] || '#95A5A6';
};

const Blog = () => {
  useScrollToTop();

  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // CHANGE: Use blogCategories instead of courseCategories
  const [blogCategories, setBlogCategories] = useState([]); // ← CHANGE THIS
  // const [courseCategories, setCourseCategories] = useState([]); // ← COMMENT OUT
  
  const [activeCategory, setActiveCategory] = useState(null);
  
  // State to track arrow visibility for each category
  const [arrowVisibility, setArrowVisibility] = useState({});
  
  const scrollRefs = useRef({});
  const dropdownRef = useRef(null);

  // Default fallback image if blog has no thumbnail
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to check scroll position for a specific category
  const checkScrollPosition = (category) => {
    const container = scrollRefs.current[category];
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      setArrowVisibility(prev => ({
        ...prev,
        [category]: {
          showLeft: scrollLeft > 10,
          showRight: scrollLeft + clientWidth < scrollWidth - 10
        }
      }));
    }
  };

  // Add scroll event listeners to all category containers
  useEffect(() => {
    if (Object.keys(scrollRefs.current).length > 0) {
      // Initial check for all categories
      blogCategories.forEach(cat => { // ← CHANGE HERE
        setTimeout(() => checkScrollPosition(cat), 100);
      });
      
      // Add scroll and resize listeners for each category
      const containers = Object.values(scrollRefs.current);
      const handleScroll = () => {
        blogCategories.forEach(cat => checkScrollPosition(cat)); // ← CHANGE HERE
      };
      
      containers.forEach(container => {
        if (container) {
          container.addEventListener('scroll', handleScroll);
        }
      });
      
      window.addEventListener('resize', handleScroll);
      
      return () => {
        containers.forEach(container => {
          if (container) {
            container.removeEventListener('scroll', handleScroll);
          }
        });
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [blogCategories, blogs]); // ← CHANGE HERE

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("Fetching blogs and categories...");
        
        // CHANGE: Fetch blog categories instead of course categories
        const [allBlogs, featured] = await Promise.all([
          getAllBlogs(),
          getFeaturedBlogs()
          // getBlogCategories() // ← Uncomment if you have this API
        ]);

        // Get unique categories from blogs (since we don't have blogCategories API yet)
        const uniqueCategories = [...new Set(allBlogs
          .filter(blog => blog.status === "published")
          .map(blog => blog.category)
          .filter(Boolean)
        )];

        console.log("Blog categories:", uniqueCategories);
        console.log("All blogs from API:", allBlogs);
        console.log("Number of blogs:", allBlogs.length);
        console.log("Featured blogs:", featured);
        
        // 🔍 DEBUG: Check each blog's ID
        console.log("🔍 BLOG IDS VALIDATION:");
        allBlogs.forEach((blog, index) => {
          const isValid = /^[0-9a-fA-F]{24}$/.test(blog._id);
          console.log(`Blog ${index + 1}:`, {
            title: blog.title,
            id: blog._id,
            idLength: blog._id?.length,
            isValidMongoId: isValid,
            idType: typeof blog._id
          });
        });

        // 🔍 DEBUG: Check featured blog IDs
        console.log("🔍 FEATURED BLOG IDS:");
        featured.forEach((blog, index) => {
          const isValid = /^[0-9a-fA-F]{24}$/.test(blog._id);
          console.log(`Featured ${index + 1}:`, {
            title: blog.title,
            id: blog._id,
            idLength: blog._id?.length,
            isValidMongoId: isValid
          });
        });

        // CHANGE: Set blogCategories instead of courseCategories
        setBlogCategories(uniqueCategories);
        setBlogs(allBlogs);
        setFeaturedBlogs(featured);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Group blogs by category
  const blogsByCategory = useMemo(() => {
    const grouped = {};
    blogCategories.forEach(cat => { // ← CHANGE HERE
      grouped[cat] = blogs.filter((b) => b.category === cat && b.status === "published");
    });
    return grouped;
  }, [blogCategories, blogs]); // ← CHANGE HERE

  // Scroll function with arrow visibility update
  const scroll = (category, direction) => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Update arrow visibility after scroll completes
      setTimeout(() => checkScrollPosition(category), 300);
    }
  };

  return (
    <div className="blog-container">
      {/* HERO SECTION */}
      <div className="blog-hero-section full-width">
        <div className="blog-hero-content">
          <h1 className="blog-hero-title"><i>iTechSkill Blogs</i></h1>
          <h2 className="blog-hero-subtitle"><i>Your Access to Technology Knowledge & Career Opportunities</i></h2>
          <p className="blog-hero-description">
            Take a look through our library of in-depth expert guides covering web dev, mobile apps, 
            data science and how to succeed in your career. Keep up with the latest technology and trends.
          </p>
        </div>
      </div>

      {loading && <p className="blog-status">Loading blogs...</p>}
      {error && <p className="blog-status error">{error}</p>}

      {!loading && !error && (
        <>
          {/* CATEGORY BAR - CHANGE ALL REFERENCES */}
          {!isMobile ? (
            <div className="blog-category-bar full-width purple-bg">
              <div className="blog-category-bar-container fixed-one-line">
              <button
  className={`blog-category-bar-btn no-icon ${!activeCategory ? 'active' : ''}`}
  onClick={() => setActiveCategory(null)}
>
  <span>All</span>
</button>
               {blogCategories.map((cat) => (
  <button
    key={cat}
    className={`blog-category-bar-btn no-icon ${activeCategory === cat ? 'active' : ''}`}
    onClick={() => setActiveCategory(cat)}
  >
    <span>{cat}</span>
  </button>
))}
              </div>
            </div>
          ) : (
            <div className="blog-category-dropdown mobile-only" ref={dropdownRef}>
              <button 
                className="blog-dropdown-toggle"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{activeCategory || "Select Category"}</span>
                <FaChevronDown className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="blog-dropdown-menu">
                  <div 
                    className="blog-dropdown-item"
                    onClick={() => {
                      setActiveCategory(null);
                      setDropdownOpen(false);
                    }}
                  >
                    All
                  </div>
                  {blogCategories.map((cat) => ( // ← CHANGE HERE
                    <div
                      key={cat}
                      className="blog-dropdown-item"
                      onClick={() => {
                        setActiveCategory(cat);
                        setDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FEATURED SECTION - WITH THUMBNAILS */}
          {featuredBlogs.length > 0 && (
            <div className="blog-featured-section">
              <h2 className="blog-section-title">Featured Articles</h2>
              <div className="blog-featured-grid">
                {featuredBlogs.map((post) => {
                  const isValidId = /^[0-9a-fA-F]{24}$/.test(post._id);
                console.log(`🔗 Featured Blog Link: /blog/${post.slug}`
                    , {
                    title: post.title,
                    id: post._id,
                    isValid: isValidId
                  });
                  
                  return (
                    <Link to={`/blog/${post.slug}`} key={post._id}
                     className="blog-featured-card">
                      <div className="blog-featured-image">
                        <img 
                          src={post.image || defaultImage} 
                          alt={post.title}
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                        {/* Add format badge */}
                        {post.postFormat && post.postFormat !== 'standard' && (
                          <span 
                            className="blog-format-badge"
                            style={{ backgroundColor: getFormatColor(post.postFormat) }}
                          >
                            {getFormatIcon(post.postFormat)} {post.postFormat}
                          </span>
                        )}
                      </div>
                      <div className="blog-featured-content">
                        <div className="blog-post-category-tag">{post.category}</div>
                        <h3 className="blog-featured-post-title">{post.title}</h3>
                        <div className="blog-featured-author">
                          <FaUser /> {post.author || "Admin"}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* BLOG SECTIONS BY CATEGORY - WITH THUMBNAILS AND DYNAMIC ARROWS */}
          {(activeCategory ? [activeCategory] : blogCategories).map((cat) => { // ← CHANGE HERE
            const categoryPosts = blogsByCategory[cat] || [];
            if (categoryPosts.length === 0) return null;
            
            const visibility = arrowVisibility[cat] || { showLeft: false, showRight: true };
            
            return (
              <div key={cat} className="blog-category-horizontal-section">
                <div className="category-header">
                  <h2 className="blog-category-title">{cat} Articles</h2>
                </div>
                
                <div className="blog-horizontal-scroll-container">
                  {/* Left Arrow - only shown when not at start */}
                  {visibility.showLeft && (
                    <button 
                      className="scroll-arrow left-arrow"
                      onClick={() => scroll(cat, 'left')}
                      aria-label="Scroll left"
                    >
                      <FaArrowLeft />
                    </button>
                  )}
                  
                  <div 
                    className="blog-horizontal-scroll"
                    ref={el => {
                      scrollRefs.current[cat] = el;
                      // Check scroll position when ref is set
                      if (el) {
                        setTimeout(() => checkScrollPosition(cat), 100);
                      }
                    }}
                    onScroll={() => checkScrollPosition(cat)}
                  >
                    {categoryPosts.map((post) => {
                      const isValidId = /^[0-9a-fA-F]{24}$/.test(post._id);
                     console.log(`🔗 Horizontal Blog Link: /blog/${post.slug}`, {
                        title: post.title,
                        id: post._id,
                        isValid: isValidId,
                        category: cat
                      });
                      
                      return (
                       <Link to={`/blog/${post.slug}`} key={post._id} className="blog-horizontal-card">
                          <div className="blog-horizontal-image">
                            <img 
                              src={post.image || defaultImage} 
                              alt={post.title}
                              onError={(e) => {
                                e.target.src = defaultImage;
                              }}
                            />
                            {/* Add format badge */}
                            {post.postFormat && post.postFormat !== 'standard' && (
                              <span 
                                className="blog-format-badge small"
                                style={{ backgroundColor: getFormatColor(post.postFormat) }}
                              >
                                {getFormatIcon(post.postFormat)}
                              </span>
                            )}
                          </div>
                          <div className="blog-horizontal-content">
                            <div className="blog-horizontal-meta-top">
                              <span className="blog-tag">{post.category}</span>
                              <span className="blog-horizontal-date">
                                <FaCalendarAlt /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                              </span>
                            </div>
                            <h3 className="blog-horizontal-title">{post.title}</h3>
                            <p className="blog-horizontal-excerpt">{post.excerpt}</p>
                            <div className="blog-horizontal-meta">
                              <span className="blog-horizontal-author">
                                <FaUser /> {post.author || "Admin"}
                              </span>
                              <span className="blog-horizontal-read">
                                {post.postFormat && post.postFormat !== 'standard' ? (
                                  <span style={{ color: getFormatColor(post.postFormat) }}>
                                    {getFormatIcon(post.postFormat)} {post.postFormat}
                                  </span>
                                ) : (
                                  '5 min read'
                                )}
                              </span>
                            </div>
                            <span className="blog-read-more">Read More →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  
                  {/* Right Arrow - only shown when not at end */}
                  {visibility.showRight && (
                    <button 
                      className="scroll-arrow right-arrow"
                      onClick={() => scroll(cat, 'right')}
                      aria-label="Scroll right"
                    >
                      <FaArrowRight />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}

      <Footer />
    </div>
  );
};

export default Blog;