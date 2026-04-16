import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ATLogo from "../assets/AT.png";
import { AuthContext } from "../context/AuthContext";

const StartScreen = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "student") {
        navigate("/student-dashboard");
      }
    }
  }, [user, navigate]);

  // Inline CSS
  const styles = {
    startscreen: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e1eff5, #38bdf8, #ffffff)",
      color: "#0f172a",
      fontFamily: "Poppins, sans-serif",
      position: "relative",
      overflow: "hidden",
    },
    watermark: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      opacity: 0.05,
      width: "400px",
      height: "400px",
      pointerEvents: "none",
      zIndex: 0,
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 40px",
      position: "relative",
      zIndex: 1,
    },
    logoImg: { height: "48px" },
    navButtons: { display: "flex", gap: "16px" },
    btnOutline: {
      padding: "10px 20px",
      borderRadius: "999px",
      border: "1px solid #0ea5e9",
      background: "transparent",
      color: "#0f172a",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
    btnOutlineHover: { background: "#bae6fd" },
    btnPrimary: {
      padding: "10px 22px",
      borderRadius: "999px",
      background: "#5699b8",
      color: "white",
      border: "none",
      cursor: "pointer",
      transition: "background 0.3s ease, transform 0.3s ease",
    },
    btnPrimaryHover: {
      background: "#0284c7",
      transform: "scale(1.05)",
    },
    btnPrimaryLarge: {
      padding: "14px 36px",
      fontSize: "18px",
    },
    hero: {
      marginTop: "90px",
      textAlign: "center",
      padding: "0 20px",
      position: "relative",
      zIndex: 1,
    },
    heroTitle: { fontSize: "48px", fontWeight: 700, marginBottom: "16px", color: "#0f172a" },
    heroText: { maxWidth: "700px", margin: "0 auto 32px", color: "#1e3a8a", fontSize: "16px" },
    features: {
      marginTop: "60px",
      padding: "0 40px 40px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "24px",
      position: "relative",
      zIndex: 1,
    },
    card: {
      background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
      color: "white",
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    },
    cardTitle: { marginBottom: "12px", fontSize: "20px" },
    cardText: { fontSize: "14px", lineHeight: 1.5 },
  };

  return (
    <div style={styles.startscreen}>
      {/* Watermark */}
      <img src={ATLogo} alt="Watermark" style={styles.watermark} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div className="logo">
          <img src={ATLogo} alt="AT Logo" style={styles.logoImg} />
        </div>
        <div style={styles.navButtons}>
          {user ? (
            <>
              <span style={{ marginRight: "10px" }}>Hi, {user.fullName || user.name}</span>
              <button style={styles.btnOutline} onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button style={styles.btnOutline} onClick={() => navigate("/login")}>Login</button>
              <button
                style={{ ...styles.btnPrimary, ...styles.btnPrimaryLarge }}
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Master the Code. Build the Future</h1>
        <p style={styles.heroText}>Get hands-on training from industry experts and build real-world projects with AI & Web Development.</p>
        <button
          style={{ ...styles.btnPrimary, ...styles.btnPrimaryLarge }}
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </div>

      {/* Feature Cards */}
      <div style={styles.features}>
        {[
          { title: "AI Projects", text: "Build real-world AI applications and learn cutting-edge technologies." },
          { title: "Web Development", text: "Learn modern web frameworks and create responsive websites." },
          { title: "Mobile Apps", text: "Create attractive mobile applications for Android and iOS." },
          { title: "Data Science", text: "Analyze data, visualize insights, and solve real business problems." },
        ].map((feature, index) => (
          <div
            key={index}
            style={styles.card}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0px)"}
          >
            <h3 style={styles.cardTitle}>{feature.title}</h3>
            <p style={styles.cardText}>{feature.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartScreen;




















// import React, { useState, useRef, useEffect } from 'react';
// import './YouTubeRecommendations.css';
// import student from '../assets/student.png';
// import aiiImage from '../assets/aii.png';
// import logo1 from '../assets/logo1.png';
// import logo2 from '../assets/logo2.png';
// import logo3 from '../assets/logo3.png';
// import logo4 from '../assets/logo4.png';
// import logo5 from '../assets/logo5.png';
// import logo6 from '../assets/logo6.png';
// import logo7 from '../assets/logo7.png';
// import comptiaImage from '../assets/comptia.png';
// import awsImage from '../assets/aws.png';
// import pmiImage from '../assets/pmi.png';
// import report from '../assets/report.png';
// import { FaChevronLeft, FaChevronRight, FaRobot, FaCertificate, FaChartLine, FaLaptopCode, FaCloud, FaDatabase, FaCheck, FaPlay, FaYoutube, FaUsers, FaBuilding, FaBrain } from 'react-icons/fa';

// const YouTubeRecommendations = () => {
// const [currentIndex, setCurrentIndex] = useState(0);
// const [lectureIndex, setLectureIndex] = useState(0);
// const [trendingIndex, setTrendingIndex] = useState(0);
// const carouselRef = useRef(null);
// const lectureCarouselRef = useRef(null);
// const autoPlayRef = useRef(null);

//  const logoContainerStyle = {
//     flex: '1',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '140px',
//     padding: '0 2px',
//     minWidth: '0',
//     maxWidth: '200px'
//   };

//   const logoImageStyle = {
//     width: 'auto',
//     height: '120px',
//     maxWidth: '100%',
//     objectFit: 'contain'
//   };

//   const logosRowStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: '1400px',
//     margin: '0 auto 30px',
//     padding: '20px 0',
//     gap: '0'
//   };

//   // Skills & Certifications Data
//   const skillsData = [
//     {
//       id: 1,
//       title: "Generative AI",
//       description: "Master AI tools like ChatGPT, DALL-E, and build your own AI models. Perfect for beginners to advanced learners.",
//       icon: <FaRobot className="skill-icon" />,
//       color: "#22013a",
//       coursesCount: "12+ courses",
//       link: "/courses?category=ai"
//     },
//     {
//       id: 2,
//       title: "IT Certifications",
//       description: "Get certified in AWS, Google Cloud, Cisco, and more. Boost your IT career with recognized certifications.",
//       icon: <FaCertificate className="skill-icon" />,
//       color: "#8e5203",
//       coursesCount: "8+ certifications",
//       link: "/courses?category=certifications"
//     },
//     {
//       id: 3,
//       title: "Data Science",
//       description: "Learn data analysis, machine learning, and visualization. Become a data-driven decision maker.",
//       icon: <FaChartLine className="skill-icon" />,
//       color: "#22013a",
//       coursesCount: "15+ courses",
//       link: "/courses?category=data-science"
//     },
//     {
//       id: 4,
//       title: "Web Development",
//       description: "Full-stack development with modern frameworks. Build responsive websites and web applications.",
//       icon: <FaLaptopCode className="skill-icon" />,
//       color: "#8e5203",
//       coursesCount: "10+ courses",
//       link: "/courses?category=web-dev"
//     },
//     {
//       id: 5,
//       title: "Cloud Computing",
//       description: "Master AWS, Azure, Google Cloud. Learn cloud architecture, deployment, and management.",
//       icon: <FaCloud className="skill-icon" />,
//       color: "#22013a",
//       coursesCount: "7+ courses",
//       link: "/courses?category=cloud"
//     },
//     {
//       id: 6,
//       title: "Database Management",
//       description: "SQL, NoSQL, data modeling and administration. Essential skills for backend developers.",
//       icon: <FaDatabase className="skill-icon" />,
//       color: "#8e5203",
//       coursesCount: "5+ courses",
//       link: "/courses?category=database"
//     },
//     {
//       id: 7,
//       title: "Mobile App Development",
//       description: "Build native and cross-platform mobile apps for iOS and Android.",
//       icon: <FaLaptopCode className="skill-icon" />,
//       color: "#22013a",
//       coursesCount: "6+ courses",
//       link: "/courses?category=mobile"
//     },
//     {
//       id: 8,
//       title: "Digital Marketing",
//       description: "Learn SEO, social media marketing, and digital advertising strategies.",
//       icon: <FaChartLine className="skill-icon" />,
//       color: "#8e5203",
//       coursesCount: "9+ courses",
//       link: "/courses?category=marketing"
//     }
//   ];

//   // Demo Lectures Data
//   const demoLectures = [
//     {
//       id: 1,
//       title: "AI Artificial Intelligence",
//       description: "Learn the fundamentals of Artificial Intelligence and how it's transforming industries.",
//       link: "https://youtu.be/oTnR5x2KME0",
//       thumbnail: "https://i.ytimg.com/vi/oTnR5x2KME0/hqdefault.jpg"
//     },
//     {
//       id: 2,
//       title: "Data Science",
//       description: "Start your data science journey with this comprehensive introductory course.",
//       link: "https://youtu.be/e3LZNYqsJ_Q",
//       thumbnail: "https://i.ytimg.com/vi/e3LZNYqsJ_Q/hqdefault.jpg"
//     },
//     {
//       id: 3,
//       title: "Web Development",
//       description: "Build responsive websites from scratch using modern web technologies.",
//       link: "https://youtu.be/nSRCJGvRJ-o",
//       thumbnail: "https://i.ytimg.com/vi/nSRCJGvRJ-o/hqdefault.jpg"
//     },
//     {
//       id: 4,
//       title: "Graphic Designing",
//       description: "Master graphic design principles and tools for creating stunning visuals.",
//       link: "https://youtu.be/h7CTU2NxJ6A",
//       thumbnail: "https://i.ytimg.com/vi/h7CTU2NxJ6A/hqdefault.jpg"
//     },
//     {
//       id: 5,
//       title: "Digital Marketing",
//       description: "Learn digital marketing strategies to grow your business online.",
//       link: "https://youtu.be/QGdYlqEc0s8",
//       thumbnail: "https://i.ytimg.com/vi/QGdYlqEc0s8/hqdefault.jpg"
//     },
//     {
//       id: 6,
//       title: "Search Engine Optimization",
//       description: "Master SEO techniques to improve your website's search engine ranking.",
//       link: "https://youtu.be/vTJXbtQ9odY",
//       thumbnail: "https://i.ytimg.com/vi/vTJXbtQ9odY/hqdefault.jpg"
//     }
//   ];

// const trendingCourses = [
//   demoLectures[0],
//   demoLectures[4],
//   demoLectures[1],
//   demoLectures[5],
//   demoLectures[3],
//   demoLectures[2]
// ];

// // Deployment Plans Data
// const deploymentPlans = [
//   {
//     id: 1,
//     name: "Team Plan",
//     targetAudience: "2 to 50 people - For your team",
//     pricing: "$30.00 a month per user",
//     billingNote: "Billed annually. Cancel anytime.",
//     features: [
//       "Access to 13,000+ top courses",
//       "Certification prep",
//       "Goal-focused recommendations",
//       "AI-powered coaching",
//       "Analytics and adoption reports"
//     ],
//     buttonText: "Try it free",
//     buttonAction: () => console.log("Try Team Plan"),
//     color: "#5624d0"
//   },
//   {
//     id: 2,
//     name: "Enterprise Plan",
//     targetAudience: "More than 20 people - For your whole organization",
//     pricing: "Contact sales for pricing",
//     billingNote: null,
//     features: [
//       "Access to 30,000+ top courses",
//       "Certification prep",
//       "Goal-focused recommendations",
//       "AI-powered coaching",
//       "Advanced analytics and insights",
//       "Dedicated customer success team",
//       "Customizable content",
//       "Hands-on tech training with add-on",
//       "Strategic implementation services with add-on"
//     ],
//     buttonText: "Request a demo",
//     buttonAction: () => console.log("Request Enterprise Demo"),
//     color: "#5624d0"
//   },
//   {
//     id: 3,
//     name: "AI Fluency",
//     targetAudience: "From AI foundations to Enterprise transformation",
//     pricing: null,
//     billingNote: null,
//     sections: [
//       {
//         title: "AI Readiness Collection",
//         audience: "More than 100 people",
//         description: "Build org-wide AI fluency fast with 50 curated courses + AI Assistant to accelerate learning."
//       },
//       {
//         title: "AI Growth Collection",
//         audience: "More than 20 people",
//         description: "Scale AI and technical expertise with 800+ specialized courses and 30+ role-specific learning paths in multiple languages."
//       }
//     ],
//     buttonText: "Contact Us",
//     buttonAction: () => console.log("Contact for AI Fluency"),
//     color: "#5624d0"
//   }
// ];

// const certificationsData = [
//   {
//     id: 1,
//     title: "CompTIA",
//     categories: "Cloud, Networking, Cybersecurity",
//     description: "Industry-standard IT certifications for building foundational tech skills",
//     color: "#22013a",
//     image: comptiaImage,
//     alt: "CompTIA Certification",
//     logoWidth: "250px"
//   },
//   {
//     id: 2,
//     title: "AWS",
//     categories: "Cloud, AI, Coding, Networking",
//     description: "Amazon Web Services certifications for cloud professionals",
//     color: "#8e5203",
//     image: awsImage,
//     alt: "AWS Certification"
//   },
//   {
//     id: 3,
//     title: "PMI",
//     categories: "Project & Program Management",
//     description: "Project Management Institute certifications for project leaders",
//     color: "#22013a",
//     image: pmiImage,
//     alt: "PMI Certification",
//     logoWidth: "250px"
//   }
// ];

//   const cardsPerView = 2;
//   const maxIndex = Math.ceil(skillsData.length / cardsPerView) - 1;
  
//   const lectureCardsPerView = 4;
//   const lectureMaxIndex = Math.max(0, Math.ceil(demoLectures.length / lectureCardsPerView) - 1);

//   const nextSlide = () => {
//     setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0);
//   };

//   const prevSlide = () => {
//     setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex);
//   };

//   const nextLectureSlide = () => {
//     setLectureIndex(prev => {
//       if (prev >= lectureMaxIndex) {
//         return 0;
//       }
//       return prev + 1;
//     });
//   };

//   const prevLectureSlide = () => {
//     setLectureIndex(prev => {
//       if (prev <= 0) {
//         return lectureMaxIndex;
//       }
//       return prev - 1;
//     });
//   };

// const trendingCardsPerView = 4;
// const trendingMaxIndex = trendingCourses.length - trendingCardsPerView;

// const nextTrendingSlide = () => {
//   setTrendingIndex(prev => {
//     const newIndex = prev + 1;
//     if (newIndex > trendingMaxIndex) {
//       return prev;
//     }
//     return newIndex;
//   });
// };

// const prevTrendingSlide = () => {
//   setTrendingIndex(prev => {
//     const newIndex = prev - 1;
//     if (newIndex < 0) {
//       return prev;
//     }
//     return newIndex;
//   });
// };

// useEffect(() => {
//   const trendingAutoPlay = setInterval(() => {
//     setTrendingIndex(prev => {
//       const newIndex = prev + 1;
//       if (newIndex > trendingMaxIndex) {
//         clearInterval(trendingAutoPlay);
//         return prev;
//       }
//       return newIndex;
//     });
//   }, 3000);

//   return () => {
//     clearInterval(trendingAutoPlay);
//   };
// }, [trendingIndex]);

// const handleSkillClick = (skill) => {
//   window.open(skill.link, '_blank');
// };

// const handleLectureClick = (link) => {
//   window.open(link, '_blank');
// };

// const handleCarouselHover = (isHovering) => {
//   if (autoPlayRef.current) {
//     clearInterval(autoPlayRef.current);
//   }
  
//   if (!isHovering) {
//     autoPlayRef.current = setInterval(() => {
//       nextLectureSlide();
//     }, 5000);
//   }
// };

// useEffect(() => {
//   const trendingAutoPlay = setInterval(() => {
//     nextTrendingSlide();
//   }, 5000);

//   return () => {
//     clearInterval(trendingAutoPlay);
//   };
// }, [trendingIndex]);

//   return (
//     <div className="youtube-recommendations-container">
//       {/* Purple Recommendation Box */}
//       <div className="purple-recommendation-box full-width">
//         <div className="purple-box-content">
//           <div className="purple-box-text">
//             <h2 className="purple-box-title"><i>Master Data Analytics Your Way</i></h2>
//             <h3 className="purple-box-subtitle"><i>Learn from industry experts and transform your career. Start with fundamentals and advance to expert level.</i></h3>
//           </div>
          
//           <div className="purple-box-image full-height">
//             <img 
//               src={student} 
//               alt="Student learning" 
//               className="student-image full-height"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = "https://via.placeholder.com/300x400/22013a/ffffff?text=Student+Image";
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Skills & Certifications Section WITH CAROUSEL */}
//       <div className="skills-certifications-section">
//         <div className="skills-container">
//           <div className="skills-content">
//             <h2 className="skills-main-title"><i>
//               Future-Proof Your Career with Elite Skills Training</i>
//             </h2>
//             <p className="skills-subtitle">
//               <i>ITechSkill</i>: Where ambition meets expertise. We build professionals equipped for tomorrow's challenges.
//             </p>
//           </div>

//           <div className="skills-carousel-container">
//             <div className="carousel-wrapper">
//               <div className="skills-carousel" ref={carouselRef}>
//                 <div 
//                   className="skills-carousel-track"
//                   style={{ 
//                     transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
//                   }}
//                 >
//                   {skillsData.map((skill) => (
//                     <div 
//                       key={skill.id} 
//                       className="skill-card"
//                       onClick={() => handleSkillClick(skill)}
//                     >
//                       <div className="skill-card-header" style={{ backgroundColor: skill.color }}>
//                         <div className="skill-icon-container">
//                           {skill.icon}
//                         </div>
//                       </div>
                      
//                       <div className="skill-card-content">
//                         <h3 className="skill-title">{skill.title}</h3>
//                         <p className="skill-description">{skill.description}</p>
                        
//                         <div className="skill-meta">
//                           <span className="courses-count">{skill.coursesCount}</span>
//                         </div>
                        
//                         <button 
//                           className="explore-button"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleSkillClick(skill);
//                           }}
//                           style={{ backgroundColor: skill.color }}
//                         >
//                           Explore
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="carousel-controls">
//                 <button 
//                   className="carousel-arrow left-arrow"
//                   onClick={prevSlide}
//                   aria-label="Previous slide"
//                 >
//                   <FaChevronLeft />
//                 </button>
                
//                 <div className="carousel-dots">
//                   {Array.from({ length: maxIndex + 1 }).map((_, index) => (
//                     <button
//                       key={index}
//                       className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
//                       onClick={() => setCurrentIndex(index)}
//                       aria-label={`Go to slide ${index + 1}`}
//                     />
//                   ))}
//                 </div>
                
//                 <button 
//                   className="carousel-arrow right-arrow"
//                   onClick={nextSlide}
//                   aria-label="Next slide"
//                 >
//                   <FaChevronRight />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AI Era Career Section */}
//       <div className="ai-era-section">
//         <div className="ai-era-container">
//           <div className="ai-era-content">
//             <h2 className="ai-era-title">
//               Transform Your Career with iTechSkills AI Mastery
//             </h2>
//             <p className="ai-era-subtitle">
//               Future-proof your expertise with iTechSkills Personal Pro Plan. Access exclusive content crafted by industry-leading AI experts.
//             </p>
            
//             <div className="ai-era-features">
//               <div className="feature-item">
//                 <FaCheck className="feature-icon" />
//                 <span>Master Cutting-Edge AI Technologies</span>
//               </div>
//               <div className="feature-item">
//                 <FaCheck className="feature-icon" />
//                 <span>Ace Industry-Recognized Certifications</span>
//               </div>
//               <div className="feature-item">
//                 <FaCheck className="feature-icon" />
//                 <span>Train with Intelligent AI Mentors</span>
//               </div>
//               <div className="feature-item">
//                 <FaCheck className="feature-icon" />
//                 <span>Accelerate Your Tech Career Growth</span>
//               </div>
//             </div>
            
//             <button className="ai-era-button">
//               Start Your Journey
//             </button>
            
//             <p className="ai-era-pricing">
//               Starting at <span className="price">$11.00</span>/month
//             </p>
//           </div>
          
//           <div className="ai-era-image">
//             <div className="image-placeholder">
//               <img 
//                 src={aiiImage} 
//                 alt="iTechSkills AI Platform" 
//                 className="ai-platform-image"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = "https://via.placeholder.com/400x400/22013a/ffffff?text=iTechSkills+AI";
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Demo Lectures Section */}
//       <div className="demo-lectures-section">
//         <div className="demo-lectures-header">
//           <h2 className="demo-lectures-title">
//             <FaYoutube className="youtube-icon" />
//             Free Demo Lectures
//           </h2>
//           <p className="demo-lectures-subtitle">
//             Experience our teaching style with these free introductory lectures. No commitment required!
//           </p>
//           <a 
//             href="https://www.youtube.com/@ArteAnalytics/playlists" 
//             target="_blank" 
//             rel="noopener noreferrer"
//             className="youtube-channel-link"
//           >
//             <FaYoutube /> Watch All Demo Lectures on YouTube
//           </a>
//         </div>

//         <div className="all-lectures-grid">
//           {demoLectures.map((lecture) => (
//             <div 
//               key={lecture.id} 
//               className="lecture-card"
//               onClick={() => handleLectureClick(lecture.link)}
//             >
//               <div className="lecture-thumbnail">
//                 <img 
//                   src={lecture.thumbnail} 
//                   alt={lecture.title}
//                   className="thumbnail-img"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     const videoId = lecture.link.split('youtu.be/')[1] || lecture.link.split('v=')[1];
//                     if (videoId) {
//                       e.target.src = `https://i.ytimg.com/vi/${videoId.split('?')[0]}/hqdefault.jpg`;
//                     }
//                   }}
//                 />
//                 <div className="play-overlay">
//                   <FaPlay className="play-icon" />
//                 </div>
//               </div>
              
//               <div className="lecture-content">
//                 <h3 className="lecture-title">{lecture.title}</h3>
//                 <p className="lecture-description">{lecture.description}</p>
//                 <button 
//                   className="watch-button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleLectureClick(lecture.link);
//                   }}
//                 >
//                   Watch Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Logos & Reviews Section */}
//       <div className="logos-reviews-section">
//         <div className="section-header">
//           <h2 className="section-title">
//             <i>Trusted by Industry Leaders</i>
//           </h2>
//           <p className="section-subtitle">
//             Join thousands of professionals and companies who have transformed their careers with iTechSkills
//           </p>
//         </div>




//         <div className="logos-single-row-container">
//           <div className="logos-single-row" style={logosRowStyle}>
//             <div style={logoContainerStyle}>
//               <img src={logo1} alt="Samsung" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo2} alt="Cisco" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo3} alt="Vimeo" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo4} alt="P&G" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo5} alt="Hewlett Packard Enterprise" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo6} alt="Citi" style={logoImageStyle} />
//             </div>
//             <div style={logoContainerStyle}>
//               <img src={logo7} alt="Ericsson" style={logoImageStyle} />
//             </div>
//           </div>
          
//           <div className="companies-label">
//             Trusted by over 17,000 companies and millions of learners around the world
//           </div>
//         </div>

       
//       </div>


// {/* Reviews Section */}
// <div className="reviews-container">
//   <h3 className="reviews-title">Join others transforming their lives through learning</h3>
  
//   <div className="reviews-grid">
//     {/* Review Card 1 */}
//     <div className="review-card">
//       <div className="review-quote">&ldquo;</div>
//       <p className="review-content">
//         iTechSkills was rated as one of the most comprehensive and practical online learning platforms for mastering AI, Data Science, and emerging technologies according to our 2025 graduate survey.
//       </p>
//       <div className="review-footer">
//         <div className="reviewer-avatar">
//           <span className="avatar-initials">IA</span>
//         </div>
//         <div className="reviewer-details">
//           <p className="reviewer-name">iTechSkills Alumni</p>
//           <p className="reviewer-role">45,320 responses collected</p>
//         </div>
//       </div>
//     </div>

//     {/* Review Card 2 */}
//     <div className="review-card">
//       <div className="review-quote">&ldquo;</div>
//       <p className="review-content">
//         iTechSkills completely transformed my career trajectory. After completing the AI Mastery program, I landed a machine learning role with a 60% salary increase. The real-world projects made all the difference!
//       </p>
//       <div className="review-footer">
//         <div className="reviewer-avatar">
//           <span className="avatar-initials">SZ</span>
//         </div>
//         <div className="reviewer-details">
//           <p className="reviewer-name">Sarah Zulfiqar</p>
//           <p className="reviewer-role">Senior ML Engineer at</p>
//           <p className="reviewer-company">Microsoft</p>
//         </div>
//       </div>
//     </div>

//     {/* Review Card 3 */}
//     <div className="review-card">
//       <div className="review-quote">&ldquo;</div>
//       <p className="review-content">
//         The hands-on approach and industry-relevant curriculum at iTechSkills prepared me perfectly for my current role. The instructors are actual practitioners, not just teachers. Best ROI on education I've ever experienced.
//       </p>
//       <div className="review-footer">
//         <div className="reviewer-avatar">
//           <span className="avatar-initials">JA</span>
//         </div>
//         <div className="reviewer-details">
//           <p className="reviewer-name">Jamshaid Ali</p>
//           <p className="reviewer-role">Cloud Solutions Architect at</p>
//           <p className="reviewer-company">Amazon Web Services</p>
//         </div>
//       </div>
//     </div>

//     {/* Review Card 4 */}
//     <div className="review-card">
//       <div className="review-quote">&ldquo;</div>
//       <p className="review-content">
//         With iTechSkills, our team was able to bridge the gap between cutting-edge technology and essential soft skills. The platform has been instrumental in accelerating our digital transformation journey.
//       </p>
//       <div className="review-footer">
//         <div className="reviewer-avatar">
//           <span className="avatar-initials">BW</span>
//         </div>
//         <div className="reviewer-details">
//           <p className="reviewer-name">Bakhtawar Waraich</p>
//           <p className="reviewer-role">Head of Learning & Development,</p>
//           <p className="reviewer-company">North America at Deloitte Digital</p>
//         </div>
//       </div>
//     </div>
//   </div>
  
//   <a href="/success-stories" className="view-all-reviews">
//     View all stories →
//   </a>
// </div>


//       {/* Certifications Section */}
//       <div className="certifications-section">
//         <div className="certifications-container">
//           <div className="certifications-main-content">
//             <div className="certifications-text-content">
//               <h2 className="certifications-title">
//                 Get certified and take your career to the next level
//               </h2>
//               <p className="certifications-subtitle">
//                 Succeed in certifications with expert courses, comprehensive practice tests, and exclusive offers on exam vouchers.
//               </p>
//             </div>

//             <div className="certifications-grid">
//               {certificationsData.map((cert) => (
//                 <div 
//                   key={cert.id} 
//                   className="certification-card"
//                 >
//                   <div className="certification-logo-container">
//                     <img 
//                       src={cert.image} 
//                       alt={cert.alt}
//                       style={{
//                         width: cert.logoWidth,
//                         maxWidth: '100%'
//                       }}
//                       className="certification-logo"
//                     />
//                   </div>
                  
//                   <div className="certification-content">
//                     <h3 className="certification-title">{cert.title}</h3>
//                     <div className="certification-categories">{cert.categories}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trending Courses Section */}
//       <div className="trending-courses-section">
//         <div className="trending-courses-header">
//           <h2 className="trending-courses-title">Trending courses</h2>
//         </div>

//         <div className="trending-carousel-wrapper">
//           {trendingIndex > 0 && (
//             <button 
//               className="trending-carousel-arrow left"
//               onClick={prevTrendingSlide}
//               aria-label="Previous courses"
//             >
//               <FaChevronLeft />
//             </button>
//           )}

//           <div 
//             className="trending-courses-track"
//             style={{
//               transform: `translateX(-${trendingIndex * (100 / trendingCardsPerView)}%)`,
//               transition: 'transform 0.5s ease'
//             }}
//           >
//             {trendingCourses.map((course, index) => (
//               <div 
//                 key={`${course.id}-${index}`}
//                 className="trending-course-card"
//                 onClick={() => handleLectureClick(course.link)}
//               >
//                 <div className="trending-thumbnail">
//                   <img 
//                     src={course.thumbnail} 
//                     alt={course.title}
//                     className="trending-thumbnail-img"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       const videoId = course.link.split('youtu.be/')[1] || course.link.split('v=')[1];
//                       if (videoId) {
//                         e.target.src = `https://i.ytimg.com/vi/${videoId.split('?')[0]}/hqdefault.jpg`;
//                       }
//                     }}
//                   />
//                   <div className="trending-play-overlay">
//                     <FaPlay className="trending-play-icon" />
//                   </div>
//                 </div>
                
//                 <div className="trending-course-info">
//                   <h3 className="trending-course-title">{course.title}</h3>
//                   <p className="trending-course-description">{course.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {trendingIndex < trendingMaxIndex && (
//             <button 
//               className="trending-carousel-arrow right"
//               onClick={nextTrendingSlide}
//               aria-label="Next courses"
//             >
//               <FaChevronRight />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* NEW: Deployment Strategies Section - ADDED HERE */}
//       <div className="deployment-strategies-section">
//         <div className="deployment-container">
//           <div className="deployment-header">
//             <h2 className="deployment-main-title">
//               Grow your team's skills and your business
//             </h2>
//             <p className="deployment-subtitle">
//               Reach goals faster with one of our plans or programs. Try one free today or contact sales to learn more.
//             </p>
//           </div>

//           <div className="deployment-plans-grid">
//             {deploymentPlans.map((plan) => (
//               <div key={plan.id} className="deployment-plan-card">
//                 <div className="plan-header">
//                   <div className="plan-icon-container" style={{ backgroundColor: plan.color }}>
//                     {plan.icon}
//                   </div>
//                   <h3 className="plan-name">{plan.name}</h3>
//                   <p className="plan-audience">{plan.targetAudience}</p>
//                 </div>

//                <div className="plan-cta-container">
//   <button 
//     className="plan-cta-button"
//     onClick={plan.buttonAction}
//   >
//     {plan.buttonText}
//   </button>
// </div>
//                 <div className="plan-body">
//                   {plan.pricing && (
//                     <div className="plan-pricing">
//                       <p className="pricing-amount">{plan.pricing}</p>
//                       {plan.billingNote && (
//                         <p className="billing-note">{plan.billingNote}</p>
//                       )}
//                     </div>
//                   )}

//                   {plan.features && (
//                     <ul className="plan-features-list">
//                       {plan.features.map((feature, index) => (
//                         <li key={index} className="feature-item">
//                           <FaCheck className="feature-check-icon" />
//                           <span>{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                   {plan.sections && (
//                     <div className="plan-sections">
//                       {plan.sections.map((section, index) => (
//                         <div key={index} className="plan-section">
//                           <h4 className="section-title">{section.title}</h4>
//                           <p className="section-audience">{section.audience}</p>
//                           <p className="section-description">{section.description}</p>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>


// <div className="trends-report-section">
//   <div className="trends-report-container">
//     <div className="trends-report-content">
//       <h2 className="trends-report-title">
//         Get the 2026 Global Learning & Skills Trends Report
//       </h2>
//       <p className="trends-report-description">
//         If you or your organization are looking for help navigating change and AI transformation, you'll find a roadmap for action in our popular annual report.
//       </p>
//       <button className="trends-report-button">
//         Download now →
//       </button>
//     </div>
    
//     <div className="trends-report-image">
//       <img 
//         src={report}
//         alt="2026 Global Learning & Skills Trends Report"
//         className="report-cover-image"
//       />
//     </div>
//   </div>
// </div>



// {/* Popular Skills Section */}
// <div className="popular-skills-section">
//   <h2 className="popular-skills-title">Popular Skills</h2>
  
//   <div className="skills-content-wrapper">
    
//     {/* LEFT SIDE - ChatGPT Section */}
//     <div className="chatgpt-section">
//       <div>
//         <h3 className="chatgpt-title">ChatGPT is a top skill</h3>
//         <a href="/courses/chatgpt" className="see-chatgpt-link">
//           See ChatGPT courses ›
//         </a>
//         <p className="learners-count">5,462,840 learners</p>
//       </div>
      
//       <a href="/skills/trending" className="trending-skills-button">
//         Show all trending skills ⤴
//       </a>
//     </div>
    
//     {/* RIGHT SIDE - 3 Column Grid */}
//     <div className="skills-categories-wrapper">
      
//       {/* Development Column */}
//       <div className="skill-category-column">
//         <h3 className="category-title">Development</h3>
//         <ul className="category-skills-list">
//           <li className="skill-link-item">
//             <a href="/topic/python" className="skill-link">Python</a>
//             <p className="skill-learners-count">50,176,801 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/web-development" className="skill-link">Web Development</a>
//             <p className="skill-learners-count">14,475,692 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/data-science" className="skill-link">Data Science</a>
//             <p className="skill-learners-count">8,338,020 learners</p>
//           </li>
//         </ul>
//       </div>
      
//       {/* Design Column */}
//       <div className="skill-category-column">
//         <h3 className="category-title">Design</h3>
//         <ul className="category-skills-list">
//           <li className="skill-link-item">
//             <a href="/topic/blender" className="skill-link">Blender</a>
//             <p className="skill-learners-count">3,108,331 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/graphic-design" className="skill-link">Graphic Design</a>
//             <p className="skill-learners-count">4,687,243 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/ux-design" className="skill-link">User Experience (UX) Design</a>
//             <p className="skill-learners-count">2,150,373 learners</p>
//           </li>
//         </ul>
//       </div>
      
//       {/* Business Column */}
//       <div className="skill-category-column">
//         <h3 className="category-title">Business</h3>
//         <ul className="category-skills-list">
//           <li className="skill-link-item">
//             <a href="/topic/pmp" className="skill-link">PMI Project Management Professional (PMP)</a>
//             <p className="skill-learners-count">2,860,044 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/power-bi" className="skill-link">Microsoft Power BI</a>
//             <p className="skill-learners-count">5,139,271 learners</p>
//           </li>
//           <li className="skill-link-item">
//             <a href="/topic/capm" className="skill-link">PMI Certified Associate in Project Management (CAPM)</a>
//             <p className="skill-learners-count">485,497 learners</p>
//           </li>
//         </ul>
//       </div>
      
//     </div>
//   </div>
// </div>

//       {/* Footer */}
//       <footer className="footer">
//         <div className="footer-copyright">
//           <p>© 2025 iTechSkills. All rights reserved.</p>
//           <p className="footer-tagline">Empowering the next generation of tech professionals</p>
//         </div>
        
//         <div className="footer-links">
//           <div className="company-section">
//             <p className="company-title">Company</p>
//             <ul className="company-links">
//               <li><a href="/about">About Us</a></li>
//               <li><a href="/careers">Careers</a></li>
//               <li><a href="/contact">Contact</a></li>
//               <li><a href="/blog">Blog</a></li>
//             </ul>
//           </div>
          
//           <div className="learning-section">
//             <p className="learning-title">Learning</p>
//             <ul className="learning-links">
//               <li><a href="/courses">All Courses</a></li>
//               <li><a href="/instructors">Instructors</a></li>
//               <li><a href="/categories">Categories</a></li>
//               <li><a href="/certifications">Certifications</a></li>
//             </ul>
//           </div>
          
//           <div className="support-section">
//             <p className="support-title">Support</p>
//             <ul className="support-links">
//               <li><a href="/help">Help Center</a></li>
//               <li><a href="/faq">FAQ</a></li>
//               <li><a href="/terms">Terms</a></li>
//               <li><a href="/privacy">Privacy</a></li>
//             </ul>
//           </div>
          
//           <div className="youtube-channel">
//             <a 
//               href="https://www.youtube.com/@ArteAnalytics" 
//               target="_blank" 
//               rel="noopener noreferrer"
//               className="youtube-link"
//             >
//               <svg width="24" height="24" viewBox="0 0 24 24">
//                 <path fill="currentColor" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
//               </svg>
//               Visit Our YouTube Channel
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default YouTubeRecommendations;
