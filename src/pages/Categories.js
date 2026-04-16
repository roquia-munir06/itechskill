import React from 'react';
import './Categories.css';
import { FaLaptopCode, FaRobot, FaChartLine, FaCode, FaBullhorn, FaSearch, FaPalette, FaGraduationCap, FaArrowRight, FaUsers, FaBriefcase, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

import { useScrollToTop } from '../hooks/useScrollToTop';
const Categories = () => {
    useScrollToTop();
  const categories = [
    {
      id: 1,
      title: "Technology & Data",
      icon: <FaLaptopCode />,
      color: "#22013a",
      description: "Learn how to Manipulate data, Predict future, Perform Sentimental analysis and also give readers or users the best data-driven decisions that can be justified with your findings.",
      subcategories: [
        { name: "Data Science", description: "Advanced analytics, machine learning, and AI applications" },
        { name: "Data Analytics", description: "Business intelligence, reporting, and decision-making tools" },
        { name: "Database Management", description: "SQL, NoSQL, and data architecture" },
        { name: "Business Intelligence", description: "Power BI, Tableau, and data visualization" }
      ],
      courseCount: "15+ courses",
      link: "/training?category=technology-data"
    },
    {
      id: 2,
      title: "Artificial Intelligence",
      icon: <FaRobot />,
      color: "#8e5203",
      description: "Learn AI, develop intelligent systems, and create a powerful AI tool to change the world.",
      subcategories: [
        { name: "AI & Machine Learning", description: "Neural networks, deep learning, and AI models" },
        { name: "Generative AI", description: "ChatGPT, DALL-E, and creative AI applications" },
        { name: "Computer Vision", description: "Image recognition and processing" },
        { name: "Natural Language Processing", description: "Chatbots and language models" }
      ],
      courseCount: "8+ courses",
      link: "/training?category=ai"
    },
    {
      id: 3,
      title: "Web & Development",
      icon: <FaCode />,
      color: "#22013a",
      description: "Create, design and manage websites and mobile applications with or without coding experience.",
      subcategories: [
        { name: "WordPress Development", description: "No-code website building and management" },
        { name: "Full Stack Development", description: "Frontend and backend web development" },
        { name: "Mobile App Development", description: "iOS and Android app creation" },
        { name: "Cloud Computing", description: "AWS, Azure, and Google Cloud" }
      ],
      courseCount: "12+ courses",
      link: "/training?category=web-dev"
    },
    {
      id: 4,
      title: "Digital Marketing ",
      icon: <FaBullhorn />,
      color: "#8e5203",
      description: "Become a master at advertising, social media strategy, email marketing and tracking performance.",
      subcategories: [
        { name: "Digital Marketing", description: "Complete digital marketing strategy" },
        { name: "Social Media Marketing", description: "Facebook, Instagram, TikTok strategies" },
        { name: "Email Marketing", description: "Campaign creation and automation" },
        { name: "Content Marketing", description: "Blogging and content strategy" }
      ],
      courseCount: "10+ courses",
      link: "/training?category=marketing"
    },
    {
      id: 5,
      title: "SEO & Optimization",
      icon: <FaSearch />,
      color: "#22013a",
      description: "Rank your website on search engines and organic traffic.",
      subcategories: [
        { name: "Technical SEO", description: "Website structure and performance optimization" },
        { name: "Content SEO", description: "Keyword research and content optimization" },
        { name: "Local SEO", description: "Local business optimization" },
        { name: "E-commerce SEO", description: "Product page and shop optimization" }
      ],
      courseCount: "6+ courses",
      link: "/training?category=seo"
    },
    {
      id: 6,
      title: "Creative & Design",
      icon: <FaPalette />,
      color: "#8e5203",
      description: "Produce branding, marketing collaterals and UI/UX designs in accordance with standard tools practice.",
      subcategories: [
        { name: "Graphic Design", description: "Adobe Creative Suite and branding" },
        { name: "UI/UX Design", description: "User interface and experience design" },
        { name: "Video & Animation", description: "Premiere Pro, After Effects, and animation" },
        { name: "3D Modeling", description: "Blender and 3D design" }
      ],
      courseCount: "8+ courses",
      link: "/training?category=design"
    },
    {
      id: 7,
      title: "Business Management",
      icon: <FaBriefcase />,
      color: "#22013a",
      description: "Enhance leadership, project management and business strategy abilities.",
      subcategories: [
        { name: "Project Management", description: "PMP, Agile, and Scrum methodologies" },
        { name: "Business Analytics", description: "Decision-making and strategy" },
        { name: "Entrepreneurship", description: "Startup creation and management" },
        { name: "Soft Skills", description: "Communication and leadership" }
      ],
      courseCount: "7+ courses",
      link: "/training?category=business"
    },
    {
      id: 8,
      title: "Certification Programs",
      icon: <FaGraduationCap />,
      color: "#8e5203",
      description: "Earn resume-worthy credentials and market for career advancement.",
      subcategories: [
        { name: "AWS Certifications", description: "Amazon Web Services cloud certifications" },
        { name: "Google Certifications", description: "Google Cloud and analytics certifications" },
        { name: "Microsoft Certifications", description: "Azure and Office 365 certifications" },
        { name: "CompTIA Certifications", description: "IT fundamentals and security" }
      ],
      courseCount: "10+ certifications",
      link: "/Certification"
    }
  ];

  const careerPaths = [
    {
      id: 1,
      title: "Beginner",
      icon: <FaRocket />,
      description: "Begin from the basics with no experience needed",
      courses: "Foundational courses with step-by-step guidance"
    },
    {
      id: 2,
      title: "Career Changer",
      icon: <FaUsers />,
      description: "Career transition from another industry to tech",
      courses: "Bootcamps for rapid career changes"
    },
    {
      id: 3,
      title: "Professional",
      icon: <FaBriefcase />,
      description: "Advance your existing tech career",
      courses: "Advanced specializations and certifications"
    },
    {
      id: 4,
      title: "Entrepreneur",
      icon: <FaChartLine />,
      description: "Become a solopreneur or freelancer",
      courses: "Business + tech combo programs"
    }
  ];

  // ✅ Updated: Popular categories for marquee rotation - Added SEO, Data Science, Graphic Designing
  const popularCategories = [
    {
      id: 1,
      title: "Artificial Intelligence",
      icon: <FaRobot />,
      description: "Develop intelligent systems and actual AI tools for use in the future",
      link: "/training?category=ai",
      color: "#22013a"
    },
    {
      id: 2,
      title: "Web Development",
      icon: <FaLaptopCode />,
      description: "Setup, create and manage websites, ideal for freelancers and start-ups",
      link: "/training?category=web-dev",
      color: "#8e5203"
    },
    {
      id: 3,
      title: "Digital Marketing",
      icon: <FaBullhorn />,
      description: "Get Master paid ads, Social Media Strategy, and Performance tracking",
      link: "/training?category=marketing",
      color: "#22013a"
    },
    {
      id: 4,
      title: "Data Science",
      icon: <FaChartLine />,
      description: "Advanced analytics, machine learning, and AI applications for data-driven decisions",
      link: "/training?category=technology-data",
      color: "#8e5203"
    },
    {
      id: 5,
      title: "SEO & Optimization",
      icon: <FaSearch />,
      description: "Rank your website on search engines and drive organic traffic",
      link: "/training?category=seo",
      color: "#22013a"
    },
    {
      id: 6,
      title: "Graphic Designing",
      icon: <FaPalette />,
      description: "Produce branding, marketing collaterals and UI/UX designs",
      link: "/training?category=design",
      color: "#8e5203"
    }
  ];

  // Duplicate the array for seamless marquee effect
  const marqueeItems = [...popularCategories, ...popularCategories, ...popularCategories];

  return (
    <div className="categories-container">
      {/* Hero Section */}
      <div className="categories-hero-section full-width">
        <div className="categories-hero-content">
          <h1 className="categories-hero-title"><i>Explore Course Categories</i></h1>
          <h2 className="categories-hero-subtitle"><i>Choose Your Path to Success</i></h2>
          <p className="categories-hero-description">
            Not sure where to start? Easily discover the right skill for any role you’re interested based on your career goals. Our theory classes are based on the live project and job opportunities in courses. </p>
        </div>
      </div>

      {/* Find Your Path Section */}
      <div className="categories-find-path-section">
        <h2 className="categories-section-title">Find Your Perfect Category</h2>
        <p className="categories-section-description">
          Whatever your background, there’s a way to learn more and learning faster. Explore categories and enroll today.
        </p>
        
        <div className="categories-career-paths-grid">
          {careerPaths.map(path => (
            <div key={path.id} className="categories-career-path-card">
              <div className="categories-path-icon" style={{ 
                backgroundColor: path.id % 2 === 0 ? '#8e5203' : '#22013a' 
              }}>
                {path.icon}
              </div>
              <h3 className="categories-path-title">{path.title}</h3>
              <p className="categories-path-description">{path.description}</p>
              <p className="categories-path-courses">{path.courses}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid-section">
        <h2 className="categories-section-title">Browse All Categories</h2>
        <p className="categories-section-subtitle">
          All things are based on practical knowledge and creation of an employment opportunity .  </p>
        
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="categories-category-card">
              <div className="categories-category-header" style={{ backgroundColor: category.color }}>
                <div className="categories-category-icon">
                  {category.icon}
                </div>
                <div className="categories-category-title-wrapper">
                  <h3 className="categories-category-card-title">{category.title}</h3>
                  <span className="categories-course-count">{category.courseCount}</span>
                </div>
              </div>
              
              <div className="categories-category-content">
                <p className="categories-category-description">{category.description}</p>
                
                <div className="categories-subcategories">
                  <h4 className="categories-subcategories-title">Includes:</h4>
                  <ul className="categories-subcategories-list">
                    {category.subcategories.map((subcat, index) => (
                      <li key={index} className="categories-subcategory-item">
                        <span className="categories-subcategory-name">{subcat.name}</span>
                        <span className="categories-subcategory-desc">{subcat.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ UPDATED: Popular Categories with Marquee Rotation */}
      <div className="categories-popular-categories-section">
        <h2 className="categories-section-title">Most Popular Categories</h2>
        <div className="categories-marquee-container">
          <div className="categories-marquee-track">
            {marqueeItems.map((category, index) => (
              <div 
                key={`${category.id}-${index}`} 
                className="categories-popular-category"
                style={{ borderLeft: `4px solid ${category.color}` }}
              >
                <div className="categories-popular-category-icon" style={{ color: category.color }}>
                  {category.icon}
                </div>
                <div className="categories-popular-category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <Link to={category.link} className="categories-popular-link">
                    View {category.title.includes('SEO') ? 'SEO' : 
                           category.title.includes('Data') ? 'Data Science' : 
                           category.title.includes('Graphic') ? 'Design' : 
                           category.title} Courses <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Choose Section */}
      <div className="categories-choose-section">
        <div className="categories-choose-content">
          <h2 className="categories-choose-title">How to Choose Your Category?</h2>
          
          <div className="categories-choose-steps">
            <div className="categories-choose-step">
              <div className="categories-step-number">1</div>
              <div className="categories-step-content">
                <h3>Identify Your Goals</h3>
                <p>Do you want to change career, skill up or scratch?</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">2</div>
              <div className="categories-step-content">
                <h3>Assess Your Background</h3>
                <p>Take into account your existing knowledge and place in education ​and/or amount of time available to offer.</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">3</div>
              <div className="categories-step-content">
                <h3>Explore Career Outcomes</h3>
                <p>Investigate the job prospects and income potential in each area.</p>
              </div>
            </div>
            
            <div className="categories-choose-step">
              <div className="categories-step-number">4</div>
              <div className="categories-step-content">
                <h3>Start with a Free Course</h3>
                <p>Explore our free starter courses before moving to a full program.</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>

      {/* CTA Section */}
      <div className="categories-cta-section full-width">
        <div className="categories-cta-content">
          <h2 className="categories-cta-title">Ready to Start Learning?</h2>
          <p className="categories-cta-description">
            Find your course, sign up and start investing in a tech career.
          </p>
          
          <div className="categories-cta-buttons">
            <Link to="/trainings" className="categories-primary-cta-btn">
          Browse All Courses
            </Link>
                     </div>
          
          <div className="categories-cta-features">
            <div className="categories-feature">
              <FaGraduationCap className="categories-feature-icon" />
              <span>Practical, Hands-on Learning</span>
            </div>
            <div className="categories-feature">
              <FaBriefcase className="categories-feature-icon" />
              <span>Industry-Relevant Skills</span>
            </div>
            <div className="categories-feature">
              <FaUsers className="categories-feature-icon" />
              <span>Expert Instructor Support</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default Categories;