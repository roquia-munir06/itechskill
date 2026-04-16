import React, { useState, useRef, useEffect } from 'react';
import './YouTubeRecommendations.css';
import student from '../assets/student.webp';
import groupDiscount from '../assets/GroupDiscount.webp';   // ← ADD
import student2 from '../assets/Student2.webp'; 
import aiiImage from '../assets/aii.webp';
import MS from '../assets/MS.webp';
import awsImage from '../assets/aws.webp';
import pmiImage from '../assets/pmi.webp';
import report from '../assets/report.webp';
import { FaChevronLeft, FaChevronRight, FaRobot, FaCertificate, FaChartLine, FaLaptopCode, FaCloud, FaDatabase, FaCheck, FaPlay, FaYoutube, } from 'react-icons/fa';
import Footer from '../components/Footer'; // ✅ Go up one level, then into components
import '../components/Footer.css'; // ✅ If Footer.css is with Footer.js
import PlanPrice from '../components/PlanPrice'; // ✅
import CompaniesLogo from '../components/CompaniesLogo';
import Review from '../components/Review';
import { useScrollToTop } from '../hooks/useScrollToTop';
import SpinnerPopup from "../components/SpinnerPopup";
import DiscountOfferPopup from "../components/DiscountOfferPopup";
import TrendingCourses, { TRENDING_COURSES } from '../components/TrendingCourses';
import { Link ,useNavigate} from 'react-router-dom';
import FloatingButtons from '../components/FloatingButtons';


const YouTubeRecommendations = () => {
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(() => {
  return !sessionStorage.getItem("spinnerShown");
});
  const [showDiscountOffer, setShowDiscountOffer] = useState(false);


const handleCloseSpinner = () => {
  setShowSpinner(false);
  sessionStorage.setItem("spinnerShown", "true");
  setShowDiscountOffer(true);  // ← JUST ADD THIS ONE LINE
};
 const handleCloseDiscountOffer = () => {
    setShowDiscountOffer(false);
  };


  useScrollToTop();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lectureIndex, setLectureIndex] = useState(0);
  const [trendingIndex, setTrendingIndex] = useState(0); // ✅ Fixed
  const [trendingCardsPerView, setTrendingCardsPerView] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [demoCardsPerView, setDemoCardsPerView] = useState(4);
  const [demoIndex, setDemoIndex] = useState(0); // ✅ Moved here
  const carouselRef = useRef(null);
  const lectureCarouselRef = useRef(null);
const [programs, setPrograms] = useState(() => {
  const cached = sessionStorage.getItem('cachedPrograms');
  return cached ? JSON.parse(cached) : [];
});


useEffect(() => {
  const handleResize = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // Set different cards per view based on screen size
    let demoCards, trendingCards;
    
    if (window.innerWidth <= 480) {
      demoCards = 1;
      trendingCards = 1;
    } else if (window.innerWidth <= 768) {
      demoCards = 2;
      trendingCards = 2;
    } else if (window.innerWidth <= 1024) {
      demoCards = 3;
      trendingCards = 3;
    } else {
      // Desktop: 4 demo cards, 6 trending cards
      demoCards = 4;
      trendingCards = 4; // Show all 6 trending courses
    }
    
    setDemoCardsPerView(demoCards);
    setTrendingCardsPerView(trendingCards);
    
    // Reset indices
    setDemoIndex(0);
    setTrendingIndex(0);
  };
  
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

useEffect(() => {
  if (programs.length > 0) return; // already have data, skip fetch
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  fetch(`${API_BASE}/programs`)
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        setPrograms(data.data);
        sessionStorage.setItem('cachedPrograms', JSON.stringify(data.data));
      }
    })
    .catch(() => {});
}, [programs.length]);

const getProgramLink = (keyword) => {
  const match = programs.find(p =>
    p.title.toLowerCase().includes(keyword.toLowerCase())
  );
  // Use slug if available, fall back to id
  return match ? `/course/${match.slug || match._id}` : '/training';
};
  
 const skillsData = [
  {
    id: 1,
    title: "Generative AI",
    description: "Get to grips with cutting-edge AI tools like ChatGPT and DALL-E, build your own AI models from scratch. For beginners or expert learners.",
    icon: <FaRobot className="skill-icon" />,
    color: "#22013a",
    coursesCount: "12+ courses",
  },
  {
    id: 2,
    title: "Data Science",
    description: "Become an expert in machine learning, statistical analysis, and predictive modeling. Get hands-on experience solving business problems using data like a true data scientist.",
    icon: <FaChartLine className="skill-icon" />,
    color: "#22013a",
    coursesCount: "18+ courses",
  },
  {
    id: 3,
    title: "Search Engine Optimization (SEO)",
    description: "Become a master at on page, off page, and technical SEO. Master keyword research, link building and analytics to grow organic traffic.",
    icon: <FaChartLine className="skill-icon" />,
    color: "#22013a",
    coursesCount: "8+ courses",
  },
  {
    id: 4,
    title: "Digital Marketing",
    description: "Learn SEO, social media marketing, and digital advertising strategies.",
    icon: <FaChartLine className="skill-icon" />,
    color: "#8e5203",
    coursesCount: "9+ courses",
  },
  {
    id: 5,
    title: "Data Science",
    description: "Study data analysis, machine learning and visualization. Become a data-oriented decision maker.",
    icon: <FaChartLine className="skill-icon" />,
    color: "#22013a",
    coursesCount: "15+ courses",
  },
  {
    id: 6,
    title: "WordPress Development",
    description: "Full stack development using the latest frameworks. Build responsive websites and they look as good on smart phones or tablets as they do on a desktop.",
    icon: <FaLaptopCode className="skill-icon" />,
    color: "#8e5203",
    coursesCount: "10+ courses",
  },
  {
    id: 7,
    title: "Cloud Computing",
    description: "Master in the cloud and get skilled in Amazon AWS! you'll study property, deployment, management of your cloud architectures.",
    icon: <FaCloud className="skill-icon" />,
    color: "#22013a",
    coursesCount: "7+ courses",
  },
  {
    id: 8,
    title: "Database Management",
    description: "SQL, NoSQL, data modeling and administration. Essential skills for backend developers.",
    icon: <FaDatabase className="skill-icon" />,
    color: "#8e5203",
    coursesCount: "5+ courses",
  },
  {
    id: 9,
    title: "Mobile App Development",
    description: "Build native and cross-platform mobile apps for iOS and Android.",
    icon: <FaLaptopCode className="skill-icon" />,
    color: "#22013a",
    coursesCount: "6+ courses",
  },
  {
    id: 10,
    title: "Cyber Security",
    description: "Get qualified in Amazon Web Services, Google Cloud, Cisco and more Besides, with internationally recognized certifications your IT career will be strengthened further still.",
    icon: <FaCertificate className="skill-icon" />,
    color: "#8e5203",
    coursesCount: "8+ certifications",
  },
];

  // Demo Lectures Data
  const demoLectures = [
    {
      id: 1,
      title: "AI Artificial Intelligence",
      description: "Get the fundamentals of AI and how this field is being transformed",
      link: "https://youtu.be/oTnR5x2KME0",
      thumbnail: "https://i.ytimg.com/vi/oTnR5x2KME0/hqdefault.jpg"
    },
    {
      id: 2,
      title: "Data Science and and Engineering",
      description: "Start out on a data scientist's journey with this full introductory course.",
      link: "https://youtu.be/e3LZNYqsJ_Q",
      thumbnail: "https://i.ytimg.com/vi/e3LZNYqsJ_Q/hqdefault.jpg"
    },
    {
      id: 3,
      title: "Web Development",
      description: "Build responsive web sites from scratch using modern technology",
      link: "https://youtu.be/nSRCJGvRJ-o",
      thumbnail: "https://i.ytimg.com/vi/nSRCJGvRJ-o/hqdefault.jpg"
    },
    {
      id: 4,
      title: "Graphic Designing",
      description: "The principles of graphic design and tools to make exquisite creations.",
      link: "https://youtu.be/h7CTU2NxJ6A",
      thumbnail: "https://i.ytimg.com/vi/h7CTU2NxJ6A/hqdefault.jpg"
    },
    {
      id: 5,
      title: "Digital Marketing",
      description: "learn online marketing strategies that you don't want to miss out on.",
      link: "https://youtu.be/QGdYlqEc0s8",
      thumbnail: "https://i.ytimg.com/vi/QGdYlqEc0s8/hqdefault.jpg"
    },
    {
      id: 6,
      title: "Search Engine Optimization",
      description: "Use SEO techniques to raise your website's search engine rankings.",
      link: "https://youtu.be/vTJXbtQ9odY",
      thumbnail: "https://i.ytimg.com/vi/vTJXbtQ9odY/hqdefault.jpg"
    }
  ];
const demoMaxIndex = Math.max(0, demoLectures.length - (demoCardsPerView || 1));
const certificationsData = [
  {
    id: 1,
    title: "Microsoft",
    categories: "Cloud, Networking, Cybersecurity",
    description: "Industry-standard IT certifications for building foundational tech skills",
    color: "#22013a",
    image: MS,
    alt: "CompTIA Certification",
    logoWidth: "250px"
  },
  {
    id: 2,
    title: "AWS",
    categories: "Cloud, AI, Coding, Networking",
    description: "Amazon Web Services certifications for cloud professionals",
    color: "#8e5203",
    image: awsImage,
    alt: "AWS Certification"
  },
  {
    id: 3,
    title: "PMI",
    categories: "Project & Program Management",
    description: "Project Management Institute certifications for project leaders",
    color: "#22013a",
    image: pmiImage,
    alt: "PMI Certification",
    logoWidth: "250px"
  }
];
const cardsPerView = isMobile ? 1 : 2;
const totalSlides = Math.ceil(skillsData.length / cardsPerView);
const maxIndex = totalSlides - 1;
console.log('Number of cards:', skillsData.length);
console.log('Cards per view:', cardsPerView);
console.log('Total slides needed:', totalSlides);
  
  const lectureCardsPerView = 4;
  const lectureMaxIndex = Math.max(0, Math.ceil(demoLectures.length / lectureCardsPerView) - 1);

const nextSlide = () => {
  setCurrentIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > maxIndex) {
      return prev;
    }
    return newIndex;
  });
};

const prevSlide = () => {
  setCurrentIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};

  const nextLectureSlide = () => {
    setLectureIndex(prev => {
      if (prev >= lectureMaxIndex) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevLectureSlide = () => {
    setLectureIndex(prev => {
      if (prev <= 0) {
        return lectureMaxIndex;
      }
      return prev - 1;
    });
  };
// Add these functions
const nextDemoSlide = () => {
  setDemoIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > demoMaxIndex) {
      return prev;
    }
    return newIndex;
  });
};
const prevDemoSlide = () => {
  setDemoIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};
const trendingMaxIndex = TRENDING_COURSES.length - trendingCardsPerView;

const nextTrendingSlide = () => {
  setTrendingIndex(prev => {
    const newIndex = prev + 1;
    if (newIndex > trendingMaxIndex) {
      return prev;
    }
    return newIndex;
  });
};

const prevTrendingSlide = () => {
  setTrendingIndex(prev => {
    const newIndex = prev - 1;
    if (newIndex < 0) {
      return prev;
    }
    return newIndex;
  });
};
const handleLectureClick = (link) => {
  window.open(link, '_blank');
};
const heroSlides = [
  {
    id: 1,
    badge: " Industry-Led Training",
    title: "Master data analysis in your own way",
    subtitle: "Learn from leading figures in the industry — turn your career around! Start at the starter stage and culminate at the ultimate expert level.",
    cta: "Explore Courses",
    link: "/trainings",
    image: student,           // ← ADD (keep existing image)
    accent: "#f9f493",
    badgeColor: "#22013a",
    bg: "linear-gradient(135deg, #2a043b 0%, #4a0870 50%, #868528 100%)",
    bgPosition: "bottom center",
    bgSize: "contain",
     bgTop: "10%"
  },
  {
    id: 2,
    badge: " 1-Year Diploma Program",
    title: "Earn a Professional Diploma in 12 Months",
    subtitle: "Our 1-Year Diploma covers Data Science, AI, Web Development & more — with live mentorship, real projects, and a globally recognized certificate.",
    cta: "View Diploma Programs",
    link: "/diplomas",
    image: student2,          // ← ADD
    accent: "#f9f493",
    badgeColor: "#22013a",
    bg: "linear-gradient(135deg, #2a043b 0%, #4a0870 50%, #868528 100%)",
     bgPosition: "top center",   // ← show head, not feet
    bgSize: "cover",
     bgTop: "10%"
  },
  {
    id: 3,
    badge: " Group Discount Available",
    title: "Learn Together, Save Together",
    subtitle: "Enroll your team or friends and unlock exclusive group discounts of up to 30%. Perfect for corporate training, universities, and study groups.",
    cta: "Get Group Pricing",
    link: "/pricing",
    image: groupDiscount,     // ← ADD
    accent: "#f9f493",
    badgeColor: "#22013a",
    bg: "linear-gradient(135deg, #2a043b 0%, #4a0870 50%, #868528 100%)",
    bgPosition: "center center", // ← center the group
    bgSize: "contain",
  },
];
const HeroSlider = () => {
      const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (index) => {
    if (animating || index === active) return;
    setAnimating(true);
    setActive(index);
    setTimeout(() => setAnimating(false), 600);
  };

  const prev = () => goTo((active - 1 + heroSlides.length) % heroSlides.length);
  const next = () => goTo((active + 1) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [active]);

  const slide = heroSlides[active];

  return (
    <div className="hs-root">
      {/* Animated background */}
      <div className="hs-bg" style={{ background: slide.bg }} />

      {/* Decorative shapes */}
      <div className="hs-shapes">
        <div className="hs-shape hs-shape-1" style={{ borderColor: slide.accent }} />
        <div className="hs-shape hs-shape-2" style={{ background: slide.accent }} />
        <div className="hs-shape hs-shape-3" style={{ borderColor: slide.accent }} />
      </div>

      {/* Main content row */}
      <div className="hs-inner">
        {/* LEFT: White card */}
        <div className="hs-card" key={`card-${active}`}>
          <div className="hs-badge" style={{ background: slide.accent, color: slide.badgeColor }}>
            {slide.badge}
          </div>
          <h2 className="hs-title">{slide.title}</h2>
          <p className="hs-subtitle">{slide.subtitle}</p>
          <div className="hs-actions">
            <button
              className="hs-btn-primary"
              style={{ background: slide.accent, color: slide.badgeColor }}
              onClick={() => navigate(slide.link)}
            >
              {slide.cta}
            </button>
           
          </div>
        </div>

{/* RIGHT: Image */}
<div className="hs-image-wrap" key={`img-${active}`}>
<div
  className="hs-student-img"
  style={{
    backgroundImage: `url(${slide.image})`,
    backgroundPosition: slide.bgPosition || "bottom center",
    backgroundSize: slide.bgSize || "contain",
    top: slide.bgTop || "0%",        // ← ADD THIS
    height: `calc(100% - ${slide.bgTop || "0%"})`,  // ← shrink height to match
  }}
/>
</div>
      </div>

      <button className="hs-arrow hs-arrow-left" onClick={prev} aria-label="Previous">
  <FaChevronLeft />
</button>
<button className="hs-arrow hs-arrow-right" onClick={next} aria-label="Next">
  <FaChevronRight />
</button>

      {/* Dots + counter */}
      <div className="hs-footer">
        <div className="hs-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hs-dot ${i === active ? 'hs-dot-active' : ''}`}
              style={i === active ? { background: slide.accent } : {}}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <span className="hs-counter">{active + 1} / {heroSlides.length}</span>
      </div>

    
    </div>
  );
};

  return (
    
    <div className="youtube-recommendations-container">
        {showSpinner && <SpinnerPopup onClose={handleCloseSpinner} />}
    {showDiscountOffer && <DiscountOfferPopup onClose={handleCloseDiscountOffer} />}
        
<div className="purple-recommendation-box full-width">
  <HeroSlider />
</div>

      {/* Skills & Certifications Section WITH CAROUSEL */}
      <div className="skills-certifications-section">
        <div className="skills-container">
          <div className="skills-content">
            <h2 className="skills-main-title"><i>
              Future-proof your career with top skills training</i>
            </h2>
            <p className="skills-subtitle">
              <i>ITechSkill</i>:  Where ambition meets expertise. We train professionals to face tomorrow's challenges well-equipped.
            </p>
          </div>

          <div className="skills-carousel-container">
            <div className="carousel-wrapper">
              <div className="skills-carousel" ref={carouselRef}>
               <div 
  className="skills-carousel-track"
  style={{ 
    transform: `translateX(-${currentIndex * 100}%)`,
    display: 'flex',
    gap: '20px',
    width: '100%'
  }}
>
  {skillsData.map((skill) => (
    <div 
      key={skill.id} 
      className="skill-card"
      style={{
        flex: `0 0 calc(${100 / cardsPerView}% - 20px)`,
        minWidth: `calc(${100 / cardsPerView}% - 20px)`
      }}
    >
      {/* Your existing card content - don't change this part */}
      <div className="skill-card-header" style={{ backgroundColor: skill.color }}>
        <div className="skill-icon-container">
          {skill.icon}
        </div>
                      </div>
                      
                     <div className="skill-card-content">
  <h3 className="skill-title" style={{ position: 'relative', display: 'inline-block' }}>
    {getProgramLink(skill.title) !== '/training' ? (
      <Link to={getProgramLink(skill.title)} style={{ color: 'inherit', textDecoration: 'none' }}>
        {skill.title}
      </Link>
    ) : (
      <>
        {skill.title}
        <span style={{
          position: 'absolute', top: '-10px', left: '0',
          fontSize: '7px', fontWeight: '700', letterSpacing: '0.04em',
          textTransform: 'uppercase',
          background: 'linear-gradient(135deg, #7c1abd, #8e5203)',
          color: '#fff', padding: '1px 4px', borderRadius: '999px',
          whiteSpace: 'nowrap', lineHeight: '1.4',
        }}>coming soon</span>
      </>
    )}
  </h3>
                        <p className="skill-description">{skill.description}</p>
                        
                        <div className="skill-meta">
                          <span className="courses-count">{skill.coursesCount}</span>
                        </div>
                        
                <button 
  className="explore-button"
  onClick={() => {
    const link = getProgramLink(skill.title);
    if (link !== '/training') {
      window.location.href = link;
    }
  }}
  style={{ backgroundColor: skill.color, position: 'relative' }}
>
  {getProgramLink(skill.title) !== '/training' ? 'Explore' : (
    <>
      Explore
      <span style={{
        position: 'absolute',
        top: '-10px',
        left: '0',
        fontSize: '7px',
        fontWeight: '700',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, #7c1abd, #8e5203)',
        color: '#fff',
        padding: '1px 4px',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        lineHeight: '1.4',
      }}>coming soon</span>
    </>
  )}
</button>
                             </div>
                    </div>
                  ))}
</div>
              </div>
              
 <div className="carousel-controls">
  {currentIndex > 0 && (
    <button 
      className="carousel-arrow left-arrow"
      onClick={prevSlide}
      aria-label="Previous slide"
    >
      <FaChevronLeft />
    </button>
  )}
  
  <div className="carousel-dots">
    {Array.from({ length: maxIndex + 1 }).map((_, index) => (
      <button
        key={index}
        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
        onClick={() => setCurrentIndex(index)}
        aria-label={`Go to slide ${index + 1}`}
      />
    ))}
  </div>
  
  {currentIndex < maxIndex && (
    <button 
      className="carousel-arrow right-arrow"
      onClick={nextSlide}
      aria-label="Next slide"
    >
      <FaChevronRight />
    </button>
  )}
</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Era Career Section */}
      <div className="ai-era-section">
        <div className="ai-era-container">
          <div className="ai-era-content">
            <h2 className="ai-era-title">
              Reward your industry with a Self-paced AI Master from iTechSkill
            </h2>
            <p className="ai-era-subtitle">
            From iTechSkill very personal Pro Plan-you can take a sensitively exclusive content, created by AI's industry leader! </p>
            
       <div className="ai-era-features">
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span> Master Cutting-Edge AI Technologies</span>
  </div> 
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span> Pass the Qualifying Tests of IT Industry</span>
  </div>
  <div className="ai-era-feature-item">
    <FaCheck className="ai-era-feature-icon" />
    <span>Target AI Mentors with a Brain</span>
  </div>
  <div className="ai-era-feature-item"> 
    <FaCheck className="ai-era-feature-icon" /> 
    <span>Accelerate Your Career Climbs in Technology</span>
  </div>
</div>
            
            <button className="ai-era-button" onClick={() => navigate(getProgramLink('Artificial Intelligence'))}>
  Start Your Journey
</button>
            
            <p className="ai-era-pricing">
              Starting at <span className="price">$9.00</span>/month
            </p>
          </div>
          
          <div className="ai-era-image">
            <div className="image-placeholder">
              <img 
                src={aiiImage} 
                alt="iTechSkill AI Platform" 
                className="ai-platform-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x400/22013a/ffffff?text=iTechSkill+AI";
                }}
              />
            </div>
          </div>
        </div>
      </div>

     {/* Demo Lectures Section */}
{/* Demo Lectures Section */}
<div className="demo-lectures-section">
  <div className="demo-lectures-header">
    <h2 className="demo-lectures-title">
      <FaYoutube className="youtube-icon" />
      Free Demo Classes
    </h2>
    <p className="demo-lectures-subtitle">
     No obligations involved-see for yourself what some of our courses are like and how they work out! </p>
    <a 
      href="https://www.youtube.com/@ArteAnalytics/playlists" 
      target="_blank" 
      rel="noopener noreferrer"
      className="youtube-channel-link"
    ><FaYoutube /> See All Free Demo Classes on YouTube
    </a>
  </div>

  <div className="demo-lectures-carousel-wrapper">

 <button 
      className="demo-lectures-arrow left"
      onClick={prevDemoSlide}
      aria-label="Previous demo lectures"
      disabled={demoIndex === 0}
      style={{ 
        opacity: demoIndex === 0 ? 0.3 : 1,
        cursor: demoIndex === 0 ? 'not-allowed' : 'pointer'
      }}
    >
      <FaChevronLeft />
    </button>
    <div className="demo-lectures-carousel-container">
      <div 
        className="demo-lectures-track"
        style={{
          transform: `translateX(-${demoIndex * (100 / demoCardsPerView)}%)`,
          transition: 'transform 0.5s ease'
        }}
      >
        {demoLectures.map((lecture) => (
          <div 
            key={lecture.id} 
            className="demo-lecture-card"
            style={{
              flex: `0 0 calc((100% - (16px * (${demoCardsPerView} - 1))) / ${demoCardsPerView})`,
              minWidth: `calc((100% - (16px * (${demoCardsPerView} - 1))) / ${demoCardsPerView})`
            }}
            onClick={() => handleLectureClick(lecture.link)}
          >
             <div className="demo-lecture-thumbnail">
              <img 
                src={lecture.thumbnail} 
                alt={lecture.title}
                className="demo-thumbnail-img"
                onError={(e) => {
                  e.target.onerror = null;
                  const videoId = lecture.link.split('youtu.be/')[1] || lecture.link.split('v=')[1];
                  if (videoId) {
                    e.target.src = `https://i.ytimg.com/vi/${videoId.split('?')[0]}/hqdefault.jpg`;
                  }
                }}
              />
                        <div className="demo-play-overlay">
                <FaPlay className="demo-play-icon" />
              </div>
            </div>
            
            <div className="demo-lecture-content">
              <h3 className="demo-lecture-title">{lecture.title}</h3>
              <p className="demo-lecture-description">{lecture.description}</p>
              <button 
                className="demo-watch-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLectureClick(lecture.link);
                }}
              >
       Watch Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

   <button 
      className="demo-lectures-arrow right"
      onClick={nextDemoSlide}
      aria-label="Next demo lectures"
      disabled={demoIndex >= demoMaxIndex}
      style={{ 
        opacity: demoIndex >= demoMaxIndex ? 0.3 : 1,
        cursor: demoIndex >= demoMaxIndex ? 'not-allowed' : 'pointer'
      }}
    >
      <FaChevronRight />
      </button>
      </div>
</div>
    
<CompaniesLogo/>

<Review/>


      {/* Certifications Section */}
      <div className="certifications-section">
        <div className="certifications-container">
          <div className="certifications-main-content">
            <div className="certifications-text-content">
              <h2 className="certifications-title">
              Get certified and advance your career
              </h2>
              <p className="certifications-subtitle">
               Perform well in certifications with expert training, in-depth practice tests, and special deals on certification vouchers. </p>
            </div>

            <div className="certifications-grid">

{certificationsData.map((cert) => (
  <div key={cert.id} className="certification-card">
    <div className="certification-logo-container">
      <img src={cert.image} alt={cert.alt}
        style={{ width: cert.logoWidth, maxWidth: '100%' }}
        className="certification-logo"
      />
    </div>
    <div className="certification-content">
      <h3 className="certification-title">{cert.title}</h3>
      <div className="certification-categories">{cert.categories}</div>
    </div>
  </div>
))}
            </div>
          </div>
        </div>
      </div>

 <TrendingCourses courses={TRENDING_COURSES} />

<PlanPrice/>
<div className="trends-report-section">
  <div className="trends-report-container">
    <div className="trends-report-content">
      <h2 className="trends-report-title">
        Get Global Learning & Skills Trends Report 2026
      </h2>
      <p className="trends-report-description">
       If you or your company are in need of assistance with change and AI transformation, you will find a guide in our popular annual report.  </p>
      {/* <button className="trends-report-button">
        Download now →
      </button> */}
    </div>
    
    <div className="trends-report-image">
      <img 
        src={report}
        alt="2026 Global Learning & Skills Trends Report"
        className="report-cover-image"
      />
    </div>
  </div>
</div>
{/* Popular Skills Section */}
<div className="popular-skills-section">
  <h2 className="popular-skills-title">Popular Skills</h2>
  
  <div className="skills-content-wrapper">
    
    {/* LEFT SIDE - ChatGPT Section */}
    <div className="chatgpt-section">
      <div>
        <h3 className="chatgpt-title">ChatGPT is a top skill</h3>
        <a className="see-chatgpt-link">
          See ChatGPT courses ›
        </a>
        <p className="learners-count">5,462,840 learners</p>
      </div>
      
      <Link to="/trainings" className="trending-skills-button" style={{ textDecoration: 'none' }}>
  Show all trending skills ⤴
</Link>
    </div>
<div className="skills-categories-wrapper">
  <div className="skill-category-column">
    <h3 className="category-tiitle">AI</h3>
    <ul className="category-skills-list">
      <li className="skill-link-item">
        <a className="skill-link" href='https://markazai.cloud/'>ChatGPT</a>
        <p className="skill-learners-count">5,462,840 learners</p>
      </li>
      <li className="skill-link-item">
        <a className="skill-link" href='https://www.arteanalytics.com/service/ai-&-data-science'>Prompt Engineering</a>
        <p className="skill-learners-count">3,210,500 learners</p>
      </li>
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('AI Agents')}>AI Agents</Link>
        <p className="skill-learners-count">1,890,320 learners</p>
      </li>
    </ul>
  </div>

  {/* Data Science Column */}
  <div className="skill-category-column">
    <h3 className="category-tiitle">Data Science</h3>
    <ul className="category-skills-list">
      <li className="skill-link-item">
    <Link className="skill-link" to={getProgramLink('Python')}>Python</Link>
        <p className="skill-learners-count">50,176,801 learners</p>
      </li>
      <li className="skill-link-item">
       <Link className="skill-link" to={getProgramLink('Machine Learning')}>Machine Learning</Link>
        <p className="skill-learners-count">12,340,210 learners</p>
      </li>
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('Data Science')}>Data Analysis</Link>
        <p className="skill-learners-count">7,654,320 learners</p>
      </li>
    </ul>
  </div>
  <div className="skill-category-column">
    <h3 className="category-tiitle">Development</h3>
    <ul className="category-skills-list">
      <li className="skill-link-item">
      <Link className="skill-link" to={getProgramLink('WordPress Development')}>Web Development</Link>
        <p className="skill-learners-count">14,475,692 learners</p>
      </li>
      <li className="skill-link-item">
       <Link className="skill-link" to={getProgramLink('Mobile App')}>Mobile App Development</Link>
        <p className="skill-learners-count">8,338,020 learners</p>
      </li>
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('FullStack Development')}>Software Development</Link>
        <p className="skill-learners-count">50,176,801 learners</p>
      </li>
    </ul>
  </div>

  {/* Design Column */}
  <div className="skill-category-column">
    <h3 className="category-tiitle">Design</h3>
    <ul className="category-skills-list">
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('Graphic')}>Graphic Design</Link>
        <p className="skill-learners-count">4,687,243 learners</p>
      </li>
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('UX')}>User Experience (UX) Design</Link>
        <p className="skill-learners-count">2,150,373 learners</p>
      </li>
      <li className="skill-link-item">
        <Link className="skill-link" to={getProgramLink('Video & Audio Editing')}>Video & Audio Editing</Link>
        <p className="skill-learners-count">3,108,331 learners</p>
      </li>
    </ul>
  </div>

</div>
  </div>
</div>
     <Footer />
        <FloatingButtons whatsappNumber="923309998880" /> 
    </div>
  );
};
export default YouTubeRecommendations;