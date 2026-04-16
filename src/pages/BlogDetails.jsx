// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { FaCalendarAlt, FaUser, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { useScrollToTop } from '../hooks/useScrollToTop';
// import Footer from '../components/Footer';
// import { getBlogById, getRelatedBlogs } from '../api/api';
// import './BlogDetails.css';

// const BlogDetails = () => {
//   const navigate = useNavigate();
//   const [blog, setBlog] = useState(null);
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const { id } = useParams();
  
//   const scrollContainerRef = useRef(null);
  
//   useScrollToTop();

//   // Default fallback image
//   const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   // Check scroll position to show/hide arrows
//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//       setShowLeftArrow(scrollLeft > 10);
//       setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
//     }
//   };

//   // Scroll function
//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 300;
//       const newScrollLeft = direction === 'left' 
//         ? scrollContainerRef.current.scrollLeft - scrollAmount 
//         : scrollContainerRef.current.scrollLeft + scrollAmount;
      
//       scrollContainerRef.current.scrollTo({
//         left: newScrollLeft,
//         behavior: 'smooth'
//       });
      
//       setTimeout(checkScrollPosition, 300);
//     }
//   };

//   useEffect(() => {
//     const fetchBlogDetails = async () => {
//       try {
//         setLoading(true);
//         const data = await getBlogById(id);
//         setBlog(data);
        
//         if (data.category) {
//           const related = await getRelatedBlogs(data.category, id, 10);
//           setRelatedPosts(related);
//         }
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//         setError("Failed to load blog post.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogDetails();
//   }, [id]);

//   useEffect(() => {
//     if (relatedPosts.length > 0) {
//       setTimeout(checkScrollPosition, 100);
      
//       const container = scrollContainerRef.current;
//       if (container) {
//         container.addEventListener('scroll', checkScrollPosition);
//         window.addEventListener('resize', checkScrollPosition);
        
//         return () => {
//           container.removeEventListener('scroll', checkScrollPosition);
//           window.removeEventListener('resize', checkScrollPosition);
//         };
//       }
//     }
//   }, [relatedPosts]);

//   // Share functionality
//   const shareUrl = window.location.href;
//   const shareTitle = blog?.title || 'Check out this blog';

//   const shareOnSocial = (platform) => {
//     let url = '';
//     switch(platform) {
//       case 'facebook':
//         url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
//         break;
//       case 'twitter':
//         url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
//         break;
//       case 'linkedin':
//         url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
//         break;
//       case 'whatsapp':
//         url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
//         break;
//       default:
//         return;
//     }
//     window.open(url, '_blank', 'width=600,height=400');
//   };

//   if (loading) {
//     return (
//       <div className="blog-details-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading article...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="blog-details-container">
//         <div className="error-message">
//           <h2>Oops! Something went wrong</h2>
//           <p>{error || 'Blog post not found'}</p>
//           <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
//             <FaArrowLeft /> Back to Blogs
//           </button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="blog-details-container">
//       {/* Blog Header */}
//       <div className="blog-details-header">
//         <h1 className="blog-details-title">{blog.title}</h1>
        
//         <div className="blog-details-meta">
//           <span className="blog-details-category">{blog.category}</span>
// <span className="blog-details-date">
//   <FaCalendarAlt /> {
//     new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   }
// </span>
//           <span className="blog-details-author">
//             <FaUser /> {blog.author || 'Admin'}
//           </span>
//         </div>
//       </div>

//       {/* Blog Content */}
//       <div className="blog-details-content">
//         {/* Excerpt as introduction */}
//         {blog.excerpt && (
//           <div className="blog-details-excerpt">
//             <p>{blog.excerpt}</p>
//           </div>
//         )}

//         {/* Featured Image */}
//         {blog.image && (
//           <div className="blog-details-image">
//             <img 
//               src={blog.image} 
//               alt={blog.title}
//               onError={(e) => {
//                 e.target.src = defaultImage;
//               }}
//             />
//           </div>
//         )}

//         {/* Main Content */}
//         <div 
//           className="blog-details-body"
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />
//       </div>

//       {/* Share Section */}
//       <div className="blog-details-share">
//         <h3>Share this article</h3>
//         <div className="share-buttons">
//           <button onClick={() => shareOnSocial('facebook')} className="share-btn facebook">
//             <FaFacebook /> Facebook
//           </button>
//           <button onClick={() => shareOnSocial('twitter')} className="share-btn twitter">
//             <FaTwitter /> Twitter
//           </button>
//           <button onClick={() => shareOnSocial('linkedin')} className="share-btn linkedin">
//             <FaLinkedin /> LinkedIn
//           </button>
//           <button onClick={() => shareOnSocial('whatsapp')} className="share-btn whatsapp">
//             <FaWhatsapp /> WhatsApp
//           </button>
//         </div>
//       </div>

//       {/* Related Posts Section */}
//       {relatedPosts.length > 0 && (
//         <div className="related-posts-section">
//           <h2 className="related-posts-title">Related Articles</h2>
          
//           <div className="related-posts-scroll-container">
//             {showLeftArrow && (
//               <button 
//                 className="scroll-arrow scroll-arrow-left"
//                 onClick={() => scroll('left')}
//                 aria-label="Scroll left"
//               >
//                 <FaChevronLeft />
//               </button>
//             )}
            
//             <div 
//               className="related-posts-scroll"
//               ref={scrollContainerRef}
//               onScroll={checkScrollPosition}
//             >
//               {relatedPosts.map((post) => (
//                 <Link to={`/blog/${post._id}`} key={post._id} className="related-post-card">
//                   <div className="related-post-image">
//                     <img 
//                       src={post.image || defaultImage} 
//                       alt={post.title}
//                       onError={(e) => { e.target.src = defaultImage; }}
//                     />
//                   </div>
//                   <div className="related-post-content">
//                     <h3 className="related-post-title">{post.title}</h3>
//                     <p className="related-post-excerpt">{post.excerpt}</p>
//                    <div className="related-post-meta">
//   <FaCalendarAlt /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
// </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
            
//             {showRightArrow && (
//               <button 
//                 className="scroll-arrow scroll-arrow-right"
//                 onClick={() => scroll('right')}
//                 aria-label="Scroll right"
//               >
//                 <FaChevronRight />
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default BlogDetails;









// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { FaCalendarAlt, FaUser, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { useScrollToTop } from '../hooks/useScrollToTop';
// import Footer from '../components/Footer';
// import { getBlogById, getRelatedBlogs } from '../api/api';
// import './BlogDetails.css';

// const BlogDetails = () => {
//   const navigate = useNavigate();
//   const [blog, setBlog] = useState(null);
//   const [relatedPosts, setRelatedPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const { id } = useParams();
  
//   const scrollContainerRef = useRef(null);
  
//   useScrollToTop();

//   // Default fallback image
//   const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

//   // Check scroll position to show/hide arrows
//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//       setShowLeftArrow(scrollLeft > 10);
//       setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
//     }
//   };

//   // Scroll function
//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 300;
//       const newScrollLeft = direction === 'left' 
//         ? scrollContainerRef.current.scrollLeft - scrollAmount 
//         : scrollContainerRef.current.scrollLeft + scrollAmount;
      
//       scrollContainerRef.current.scrollTo({
//         left: newScrollLeft,
//         behavior: 'smooth'
//       });
      
//       setTimeout(checkScrollPosition, 300);
//     }
//   };

//   useEffect(() => {
//     const fetchBlogDetails = async () => {
//       try {
//         setLoading(true);
//         const data = await getBlogById(id);
//         setBlog(data);
        
//         if (data.category) {
//           const related = await getRelatedBlogs(data.category, id, 10);
//           setRelatedPosts(related);
//         }
//       } catch (err) {
//         console.error("Error fetching blog:", err);
//         setError("Failed to load blog post.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogDetails();
//   }, [id]);

//   useEffect(() => {
//     if (relatedPosts.length > 0) {
//       setTimeout(checkScrollPosition, 100);
      
//       const container = scrollContainerRef.current;
//       if (container) {
//         container.addEventListener('scroll', checkScrollPosition);
//         window.addEventListener('resize', checkScrollPosition);
        
//         return () => {
//           container.removeEventListener('scroll', checkScrollPosition);
//           window.removeEventListener('resize', checkScrollPosition);
//         };
//       }
//     }
//   }, [relatedPosts]);

//   // Share functionality
//   const shareUrl = window.location.href;
//   const shareTitle = blog?.title || 'Check out this blog';

//   const shareOnSocial = (platform) => {
//     let url = '';
//     switch(platform) {
//       case 'facebook':
//         url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
//         break;
//       case 'twitter':
//         url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
//         break;
//       case 'linkedin':
//         url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
//         break;
//       case 'whatsapp':
//         url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
//         break;
//       default:
//         return;
//     }
//     window.open(url, '_blank', 'width=600,height=400');
//   };

//   if (loading) {
//     return (
//       <div className="blog-details-container">
//         <div className="loading-spinner">
//           <div className="spinner"></div>
//           <p>Loading article...</p>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error || !blog) {
//     return (
//       <div className="blog-details-container">
//         <div className="error-message">
//           <h2>Oops! Something went wrong</h2>
//           <p>{error || 'Blog post not found'}</p>
//           <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
//             <FaArrowLeft /> Back to Blogs
//           </button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <>
//     <div className="blog-details-container">
//       {/* Blog Header */}
//       <div className="blog-details-header">
//         <h1 className="blog-details-title">{blog.title}</h1>
        
//         <div className="blog-details-meta">
//           <span className="blog-details-category">{blog.category}</span>
// <span className="blog-details-date">
//   <FaCalendarAlt /> {
//     new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   }
// </span>
//           <span className="blog-details-author">
//             <FaUser /> {blog.author || 'Admin'}
//           </span>
//         </div>
//       </div>

//       {/* Blog Content */}
//       <div className="blog-details-content">
//         {/* Excerpt as introduction */}
//         {blog.excerpt && (
//           <div className="blog-details-excerpt">
//             <p>{blog.excerpt}</p>
//           </div>
//         )}

//         {/* Featured Image */}
//         {blog.image && (
//           <div className="blog-details-image">
//             <img 
//               src={blog.image} 
//               alt={blog.title}
//               onError={(e) => {
//                 e.target.src = defaultImage;
//               }}
//             />
//           </div>
//         )}

//         {/* Main Content */}
//         <div 
//           className="blog-details-body"
//           dangerouslySetInnerHTML={{ __html: blog.content }}
//         />
//       </div>

//       {/* Share Section */}
//       <div className="blog-details-share">
//         <h3>Share this article</h3>
//         <div className="share-buttons">
//           <button onClick={() => shareOnSocial('facebook')} className="share-btn facebook">
//             <FaFacebook /> Facebook
//           </button>
//           <button onClick={() => shareOnSocial('twitter')} className="share-btn twitter">
//             <FaTwitter /> Twitter
//           </button>
//           <button onClick={() => shareOnSocial('linkedin')} className="share-btn linkedin">
//             <FaLinkedin /> LinkedIn
//           </button>
//           <button onClick={() => shareOnSocial('whatsapp')} className="share-btn whatsapp">
//             <FaWhatsapp /> WhatsApp
//           </button>
//         </div>
//       </div>

//       {/* Related Posts Section */}
//       {relatedPosts.length > 0 && (
//         <div className="related-posts-section">
//           <h2 className="related-posts-title">Related Articles</h2>
          
//           <div className="related-posts-scroll-container">
//             {showLeftArrow && (
//               <button 
//                 className="scroll-arrow scroll-arrow-left"
//                 onClick={() => scroll('left')}
//                 aria-label="Scroll left"
//               >
//                 <FaChevronLeft />
//               </button>
//             )}
            
//             <div 
//               className="related-posts-scroll"
//               ref={scrollContainerRef}
//               onScroll={checkScrollPosition}
//             >
//               {relatedPosts.map((post) => (
//                 <Link to={`/blog/${post._id}`} key={post._id} className="related-post-card">
//                   <div className="related-post-image">
//                     <img 
//                       src={post.image || defaultImage} 
//                       alt={post.title}
//                       onError={(e) => { e.target.src = defaultImage; }}
//                     />
//                   </div>
//                   <div className="related-post-content">
//                     <h3 className="related-post-title">{post.title}</h3>
//                     <p className="related-post-excerpt">{post.excerpt}</p>
//                    <div className="related-post-meta">
//   <FaCalendarAlt /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
// </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
            
//             {showRightArrow && (
//               <button 
//                 className="scroll-arrow scroll-arrow-right"
//                 onClick={() => scroll('right')}
//                 aria-label="Scroll right"
//               >
//                 <FaChevronRight />
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//     <Footer />
//     </>
//   );
// };

// export default BlogDetails;

















import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Footer from '../components/Footer';
import { getBlogById, getRelatedBlogs } from '../api/api';
import './BlogDetails.css';

const BlogDetails = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
 const { slug } = useParams();
  
  const scrollContainerRef = useRef(null);
  
  useScrollToTop();

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  // Check scroll position to show/hide arrows
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Scroll function
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollPosition, 300);
    }
  };

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(slug);
        setBlog(data);
        
        if (data.category) {
          const related = await getRelatedBlogs(data.category, slug, 10);
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  useEffect(() => {
    if (relatedPosts.length > 0) {
      setTimeout(checkScrollPosition, 100);
      
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', checkScrollPosition);
        
        return () => {
          container.removeEventListener('scroll', checkScrollPosition);
          window.removeEventListener('resize', checkScrollPosition);
        };
      }
    }
  }, [relatedPosts]);

  // Share functionality
  const shareUrl = window.location.href;
  const shareTitle = blog?.title || 'Check out this blog';

  const shareOnSocial = (platform) => {
    let url = '';
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="blog-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-details-container">
        <div className="error-message">
          <h2>Oops! Something went wrong</h2>
          <p>{error || 'Blog post not found'}</p>
          <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
            <FaArrowLeft /> Back to Blogs
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
    <div className="blog-details-container">
      {/* Blog Header */}
      <div className="blog-details-header">
        <h1 className="blog-details-title">{blog.title}</h1>
        
        <div className="blog-details-meta">
          <span className="blog-details-category">{blog.category}</span>
<span className="blog-details-date">
  <FaCalendarAlt /> {
    new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
</span>
          <span className="blog-details-author">
            <FaUser /> {blog.author || 'Admin'}
          </span>
        </div>
      </div>

      {/* Blog Content */}
      <div className="blog-details-content">
        {/* Excerpt as introduction */}
        {blog.excerpt && (
          <div className="blog-details-excerpt">
            <p>{blog.excerpt}</p>
          </div>
        )}

        {/* Featured Image */}
        {blog.image && (
          <div className="blog-details-image">
            <img 
              src={blog.image} 
              alt={blog.title}
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
        )}

        {/* Main Content */}
        <div 
          className="blog-details-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* Share Section */}
      <div className="blog-details-share">
        <h3>Share this article</h3>
        <div className="share-buttons">
          <button onClick={() => shareOnSocial('facebook')} className="share-btn facebook">
            <FaFacebook /> Facebook
          </button>
          <button onClick={() => shareOnSocial('twitter')} className="share-btn twitter">
            <FaTwitter /> Twitter
          </button>
          <button onClick={() => shareOnSocial('linkedin')} className="share-btn linkedin">
            <FaLinkedin /> LinkedIn
          </button>
          <button onClick={() => shareOnSocial('whatsapp')} className="share-btn whatsapp">
            <FaWhatsapp /> WhatsApp
          </button>
        </div>
      </div>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <div className="related-posts-section">
          <h2 className="related-posts-title">Related Articles</h2>
          
          <div className="related-posts-scroll-container">
            {showLeftArrow && (
              <button 
                className="scroll-arrow scroll-arrow-left"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
            )}
            
            <div 
              className="related-posts-scroll"
              ref={scrollContainerRef}
              onScroll={checkScrollPosition}
            >
              {relatedPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.slug} className="related-post-card">
                  <div className="related-post-image">
                    <img 
                      src={post.image || defaultImage} 
                      alt={post.title}
                      onError={(e) => { e.target.src = defaultImage; }}
                    />
                  </div>
                  <div className="related-post-content">
                    <h3 className="related-post-title">{post.title}</h3>
                    <p className="related-post-excerpt">{post.excerpt}</p>
                   <div className="related-post-meta">
  <FaCalendarAlt /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
</div>
                  </div>
                </Link>
              ))}
            </div>
            
            {showRightArrow && (
              <button 
                className="scroll-arrow scroll-arrow-right"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default BlogDetails;