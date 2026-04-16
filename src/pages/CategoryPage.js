import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './Blog.css';
import './CategoryPage.css';
import { useScrollToTop } from '../hooks/useScrollToTop';
import Footer from '../components/Footer';
import { getAllBlogs } from '../api/api'; 

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9; // 9 blogs per page

  useScrollToTop();

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Only fetch blogs - we'll extract categories from them
        const allBlogs = await getAllBlogs();

        console.log("All blogs for CategoryPage:", allBlogs);
        
        // Extract unique categories from published blogs
        const uniqueCategories = [...new Set(allBlogs
          .filter(blog => blog.status === "published")
          .map(blog => blog.category)
          .filter(Boolean)
        )];

        console.log("Extracted categories:", uniqueCategories);

        setCategories(uniqueCategories);
        setBlogs(allBlogs);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  // Decode the category name from URL parameter
  const decodedCategory = decodeURIComponent(categoryId || '');
  
  // Filter blogs by the current category (only published)
  const allCategoryPosts = blogs.filter(
    post => post.category === decodedCategory && post.status === "published"
  );

  // Pagination logic
  const totalPosts = allCategoryPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Get current posts for the page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allCategoryPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categoryDisplayName = decodedCategory;

  return (
    <div className="blog-container">
      {/* Category Bar - Using extracted categories */}
      {!isMobile && (
        <div className="blog-category-bar full-width purple-bg">
          <div className="blog-category-bar-container fixed-one-line">
            <Link
              to="/blog"
              className="blog-category-bar-btn no-icon"
            >
              <span>All</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${encodeURIComponent(cat)}`}
                className={`blog-category-bar-btn no-icon ${cat === decodedCategory ? 'active' : ''}`}
              >
                <span>{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="blog-main-content">
        {loading && <p className="blog-status">Loading articles...</p>}
        {error && <p className="blog-status error">{error}</p>}

        {!loading && !error && (
          <>
            <h2 className="blog-section-title">
              {categoryDisplayName} Articles
              <span className="post-count"> ({totalPosts} posts)</span>
            </h2>
            
            {totalPosts === 0 ? (
              <div className="no-posts-message">
                <p>No articles found in this category.</p>
                <Link to="/blog" className="back-to-blog">â† Back to all blogs</Link>
              </div>
            ) : (
              <>
                {/* 3-column grid layout */}
                <div className="blog-grid-3-columns">
                  {currentPosts.map(post => (
                   <Link to={`/blog/${post.slug}`} key={post._id}
                   className="blog-grid-card">
                      <div className="blog-grid-image">
                        <img 
                          src={post.image || defaultImage} 
                          alt={post.title}
                          onError={(e) => {
                            e.target.src = defaultImage;
                          }}
                        />
                      </div>
                      <div className="blog-grid-content">
                        <div className="blog-grid-meta-top">
                          <span className="blog-tag">{post.category}</span>
                          <span className="blog-grid-date">
                            <FaCalendarAlt /> {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recent"}
                          </span>
                        </div>
                        <h3 className="blog-grid-title">{post.title}</h3>
                        <p className="blog-grid-excerpt">{post.excerpt}</p>
                        <div className="blog-grid-meta">
                          <span className="blog-grid-author">
                            <FaUser /> {post.author || "Admin"}
                          </span>
                          <span className="blog-grid-read">5 min read</span>
                        </div>
                        <span className="blog-read-more">Read More â†’</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination - Simple 1/4 format */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <button 
                      className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                    >
                      <FaArrowLeft />
                    </button>

                    <span className="pagination-simple">
                      {currentPage}/{totalPages}
                    </span>

                    <button 
                      className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
       
      <Footer/>
    </div>
  );
};

export default CategoryPage;