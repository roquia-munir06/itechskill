import React from 'react';
import './AboutUs.css';
import { FaCheck, FaUsers, FaGraduationCap, FaGlobe, FaHandsHelping, FaCertificate, FaLaptopCode, FaChartLine, FaRobot, FaWordpress, FaBullhorn, FaSearch, FaPalette } from 'react-icons/fa';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

import { useScrollToTop } from '../hooks/useScrollToTop';

const AboutUs = () => {
  useScrollToTop();
  const navigate = useNavigate(); // ← add this line
  const courses = [
    { id: 1, title: "Data Science", description: "Master Python, machine learning, and data visualization to analyze complex data effectively, particularly useful in banking, finance, and e-commerce sectors.", icon: <FaChartLine /> },
    { id: 2, title: "Data Analytics", description: "Learn SQL, Excel, and Tableau skills to transform raw data into actionable insights, ideal for industries like telecom, startups, and enterprises.", icon: <FaChartLine /> },
    { id: 3, title: "Artificial Intelligence (AI)", description: "Develop Neural Networks, Chatbots, and advanced AI solutions to future-proof your career in automation and innovation.", icon: <FaRobot /> },
    { id: 4, title: "WordPress Development", description: "Create professional websites, portfolios, and e-commerce platforms without the need for coding skills.", icon: <FaWordpress /> },
    { id: 5, title: "Digital Marketing", description: "Receive comprehensive training in digital marketing, covering Google Ads, social media strategies, email campaigns, and analytics.", icon: <FaBullhorn /> },
    { id: 6, title: "Advanced SEO", description: "Explore techniques to improve website ranking on Google through keyword research, on-page optimization, technical SEO, and effective link building practices.", icon: <FaSearch /> },
    { id: 7, title: "Graphic Designing", description: "Master Adobe Photoshop, Illustrator, and Figma tools for creating logos, UI/UX designs, and branding projects.", icon: <FaPalette /> }
  ];

  const testimonials = [
    { id: 1, text: "iTechSkill empowered me to transition into Digital Marketing. The focus on practical projects and mentor support truly made a difference.", name: "Ayesha K.", location: "Karachi" },
    { id: 2, text: "The Artificial Intelligence course provided by iTechSkill is practical and easy to grasp. It lays a strong foundation in imparting real-world skills to beginners.", name: "Ahmed R.", location: "Lahore" }
  ];

  const differences = [
    { id: 1, title: "Hands-On Learning Approach", description: "Each course incorporates live projects, real case studies, and practical assignments mirroring actual workplace scenarios.", icon: <FaLaptopCode /> },
    { id: 2, title: "Expert Guidance", description: "Learn from industry professionals well-versed in AI, Data Science, SEO, Digital Marketing, and Web Development.", icon: <FaUsers /> },
    { id: 3, title: "Flexible Online Learning", description: "Study at your own pace through video recordings and unlimited access to updated course materials.", icon: <FaGlobe /> },
    { id: 4, title: "Round-the-Clock Student Support", description: "A dedicated team is available to assist with technical issues, offer learning guidance, and provide career advice.", icon: <FaHandsHelping /> },
    { id: 5, title: "Career-Oriented Certifications", description: "Earn certifications that enhance your CV and LinkedIn profile, beneficial for job applications and freelance opportunities.", icon: <FaCertificate /> }
  ];

  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <div className="about-hero-section full-width">
        <div className="about-hero-content">
          <h1 className="about-hero-title"><i>About iTechSkill</i></h1>
          <h2 className="about-hero-subtitle"><i>Learn Skills That Transform Careers</i></h2>
          <p className="about-hero-description">
      At iTechSkill, we believe education should go beyond teaching concepts or issuing certificates. Education should unlock opportunities, boost self-assurance, and change lives. Everything we do is guided by this principle.
          
          </p>
        </div>
      </div>

      {/* Intro Section */}
      <div className="about-intro-section">
        <div className="about-intro-content">
          <p className="about-intro-text">
            We have a clear yet powerful mission to equip beginners, students, freelancers, and professionals with practical, job-ready tech skills that pave the way for real careers, sustainable income, and long-term growth. Whether you aim to delve into Data Science online, explore cutting-edge AI technologies, craft professional websites using WordPress, or gain certification in Digital Marketing, iTechSkill supports you in accomplishing these goals step by step.
          </p>
          <p className="about-intro-text">
            Whether you want to study Data Science online, explore the latest AI technologies, 
            create professional websites with WordPress, or get certified in Digital Marketing, 
            iTechSkill helps you achieve it - step by step.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-mission-section">
        <h2 className="about-section-title">Our Mission</h2>
        <p className="about-section-description">
       In today's rapidly evolving tech landscape, conventional education often falls short. iTechSkill acts as a bridge between theoretical knowledge and industry requirements, offering:
        </p>
        
        <div className="about-mission-features">
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Hands-on training through real-world projects</span>
          </div>
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Practical assignments to nurture confidence</span>
          </div>
          <div className="about-mission-feature">
            <FaCheck className="about-feature-icon" />
            <span>Expert guidance from industry professionals</span>
          </div>
        </div>

        <div className="about-mission-focus">
          <h3 className="about-focus-title">Our Core Focus Includes:</h3>
          <div className="about-focus-points">
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Practical, industry-relevant skills sought by employers</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Cost-effective, flexible learning options for students and working professionals</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Emphasis on tangible career outcomes over theoretical knowledge</p>
            </div>
            <div className="about-focus-point">
              <div className="about-focus-bullet">●</div>
              <p>Tailored international opportunities for Pakistan's job market</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="about-story-section">
        <h2 className="about-section-title">Our Story</h2>
        <div className="about-story-content">
          <p>
       iTechSkill was established to make top-tier technology education accessible, practical, and affordable for students in Pakistan and beyond. Recognizing the growing demand for skilled professionals in areas like Data Analytics, Artificial Intelligence, Digital Marketing, SEO, and Web Development, we noticed a gap in structured education focusing on practical competencies rather than outdated theory. 
          </p>
          <p>
          Consequently, iTechSkill was founded to address this need by providing an educational platform understanding the modern requirements of employers, startups, and clients.
          </p>
          <p>
         We prioritize action, creation, analysis, and problem-solving to equip individuals for today's dynamic world.
          </p>
        </div>

        <div className="about-who-we-support">
          <h3 className="about-support-title">Who We Support:</h3>
          <div className="about-support-grid">
            <div className="about-support-card">
              <FaGraduationCap className="about-support-icon" />
              <h4>Novices in Tech</h4>
              <p>Starting their tech journey</p>
            </div>
            <div className="about-support-card">
              <FaUsers className="about-support-icon" />
              <h4>Freelancers</h4>
              <p>Building independent careers</p>
            </div>
            <div className="about-support-card">
              <FaCertificate className="about-support-icon" />
              <h4>Professionals</h4>
              <p>Enhancing their skill set</p>
            </div>
            <div className="about-support-card">
              <FaLaptopCode className="about-support-icon" />
              <h4>Career Switchers</h4>
              <p>Transitioning into the Tech Industry with iTechSkill</p>
            </div>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="about-differences-section">
        <h2 className="about-section-title">Key Features of iTechSkill</h2>
        <div className="about-differences-grid">
          {differences.map(diff => (
            <div key={diff.id} className="about-difference-card">
              <div className="about-difference-icon">{diff.icon}</div>
              <h3 className="about-difference-title">{diff.title}</h3>
              <p className="about-difference-description">{diff.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Courses */}
      <div className="about-courses-section">
        <h2 className="about-section-title">Acquire Job-Ready Skills</h2>
        <p className="about-courses-subtitle">iTechSkill offers meticulously designed programs that prepare learners for career opportunities in Pakistan and beyond.</p>
        
        <div className="about-courses-grid">
          {courses.map(course => (
            <div key={course.id} className="about-course-card">
              <div className="about-course-icon">{course.icon}</div>
              <h3 className="about-course-title">{course.title}</h3>
              <p className="about-course-description">{course.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="about-testimonials-section">
        <h2 className="about-section-title">What Our Students Say</h2>
        <div className="about-testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="about-testimonial-card">
              <p className="about-testimonial-text">"{testimonial.text}"</p>
              <p className="about-testimonial-author">- {testimonial.name}, {testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision for the Future */}
      <div className="about-vision-section">
        <h2 className="about-section-titlee">Our Future Vision</h2>
        <div className="about-vision-content">
          <p>
       Our goal is to become a leading global edtech platform, equipping thousands of learners with essential digital skills for the future.
          </p>
          
          <div className="about-vision-plans">
            <h3>We are continuously growing by:</h3>
            <ul className="about-vision-list">
              <li> Implementing advanced AI programs</li>
              <li> Offering enterprise and corporate training</li>
              <li>Providing international certifications</li>
              <li>Strengthening industry partnerships</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="about-cta-section">
        <div className="about-cta-content">
          <h2 className="about-cta-title">Begin Your Educational Journey Today</h2>
          <p className="about-cta-description">
           When you are prepared to acquire valuable skills and long-lasting opportunities, iTechSkill is here to assist you in obtaining top-tier education.
          </p>
          
          <div className="about-cta-buttons">
        <button
  className="about-primary-cta-button"
  onClick={() => navigate('/trainings')}
>
  Explore Our Courses
</button>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
};

export default AboutUs;