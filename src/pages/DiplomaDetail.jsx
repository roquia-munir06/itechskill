import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from '../components/Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { getDiplomaBySlug } from "../api/api";  
import EnrollmentModal from '../components/EnrollmentModal';
import { Helmet } from 'react-helmet-async';


const BENEFITS = [
  {  title: "Learning Management System", desc: "Access all course material, recorded sessions, assignments and progress tracking anywhere, anytime, with our advanced LMS platform." },
  {  title: "Live & Recorded Sessions ", desc: "attend live class with an instructor or watch them at your own pace, no one will miss a class of lessons with recordings that you can access for life." },
  { title: "Internship Opportunity", desc: "guaranteed internship placement in real world after completion of program to develop professional portfolio and hands on experience." },
  {  title: "Job Cell Support", desc: "  Our dedicated Job Cell team actively links our graduates with top companies and assists you to get your first or next job in the industry." },
  {  title: "Instructor Support", desc: "Get your questions answered, code reviewed and project guided throughout the program." },
  {  title: "NEXT Community Access", desc: "Become a part of the exclusive alumni and student Community network, connect with peers, industry professional and students from all over the world." },
  {  title: "Recognized Certificate", desc: "Upon completion, receive a diploma certificate that is valued by employers all over Pakistan and globally." },
  { title: "Free Seminar Access", desc: "  Participate in ITechSkill's complimentary top tech seminars, workshops and bootcamps throughout the year, hosted by ITechSkill and industry partners." },
];



// const FALLBACK_TOOLS = [
//   { name: "VS Code"},
//   { name: "Git & GitHub" },
//   { name: "Chrome DevTools"},
//   { name: "Linux / Windows"},
// ];

// const CATEGORY_TOOLS = [
//   {
//     keywords: ["ai agent", "ai agents", "agentic", "autonomous agent"],
//     tools: [
//       { name: "Python",  }, { name: "LangChain",  }, { name: "LangGraph",  },
//       { name: "OpenAI API" }, { name: "CrewAI" }, { name: "AutoGen",  },
//       { name: "Hugging Face",  }, { name: "Vector DBs (Pinecone / Chroma)" },
//       { name: "FastAPI",  }, { name: "VS Code" }, { name: "Git & GitHub" }, { name: "Docker" },
//     ],
//   },
//   {
//     keywords: ["artificial intelligence", "machine learning", "deep learning", "ai & ml", "ai/ml", "data science"],
//     tools: [
//       { name: "Python" }, { name: "TensorFlow",  }, { name: "PyTorch" },
//       { name: "Scikit-learn" }, { name: "Pandas & NumPy" }, { name: "Jupyter Notebook" },
//       { name: "Hugging Face" }, { name: "OpenCV" }, { name: "VS Code"},
//       { name: "Git & GitHub" }, { name: "Google Colab" },
//     ],
//   },
//   {
//     keywords: ["web development", "full stack", "fullstack", "mern", "mean", "frontend", "back end", "backend"],
//     tools: [
//       { name: "HTML & CSS" }, { name: "JavaScript" }, { name: "React.js" },
//       { name: "Node.js" }, { name: "Express.js" }, { name: "MongoDB",  },
//       { name: "Git & GitHub", }, { name: "Postman"}, { name: "VS Code"},
//       { name: "Chrome DevTools", },
//     ],
//   },
//   {
//     keywords: ["graphic design", "ui/ux", "ui ux", "ux design", "visual design"],
//     tools: [
//       { name: "Figma", }, { name: "Adobe Photoshop", }, { name: "Adobe Illustrator" },
//       { name: "Adobe XD" }, { name: "Canva" }, { name: "InVision" }, { name: "Zeplin",  },
//     ],
//   },
//   {
//     keywords: ["cyber security", "cybersecurity", "ethical hacking", "networking", "network"],
//     tools: [
//       { name: "Kali Linux"}, { name: "Wireshark" }, { name: "Metasploit",  },
//       { name: "Nmap"}, { name: "Burp Suite", }, { name: "Cisco Packet Tracer"},
//       { name: "VirtualBox", }, { name: "Git & GitHub", },
//     ],
//   },
//   {
//     keywords: ["digital marketing", "seo", "social media", "marketing"],
//     tools: [
//       { name: "Google Analytics" }, { name: "Google Ads",  }, { name: "Meta Ads Manager" },
//       { name: "SEMrush",  }, { name: "Canva", }, { name: "Mailchimp",  },
//       { name: "HubSpot", }, { name: "WordPress",  },
//     ],
//   },
// ];

const FAQS = [
  { q: "Do I need prior experience to enroll?", a: "You do not need any background before joining. The course begins at zero, guiding you step by step until skills reach a working level." },
  { q: "Are classes online or on-campus?", a: "Some folks come in person. Others log in from home across Pakistan, tuning into real-time lessons online. Start wherever feels right - step into a campus, or keep still and join from your screen." },
  { q: "What happens if I miss a class?", a: "If you miss a workout, it won’t matter much. One pause doesn’t ruin anything.Each meeting gets saved automatically. These recordings show up on the learning platform by the next day. Access them whenever suits you best." },
  { q: "Will I get a certificate after completion?", a: "Finish the course along with the required tasks, then a widely respected diploma arrives by mail. That document shows others what skills were built during training." },
  { q: "Is there any installment plan available?", a: "Payment options include split schedules. These can ease the process. For specifics, reach out to the enrollment staff. Another way is stopping by a local office nearby. " },
  { q: "How does the Job Cell help me find a job?", a: "Start by reaching out through our Job Cell, where staff connect you directly with hiring firms. Instead of waiting, they send your resume to employers who are looking. Interviews show up after that step happens." },
];


const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;0,700;1,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .dd-root { font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f4f0; min-height: 100vh; }

  .dd-info-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 11px 0; border-bottom: 1px solid #f0ebf9; gap: 8px;
  }
  .dd-info-row:last-child { border-bottom: none; }
  .dd-info-label { display: flex; align-items: center; gap: 7px; font-size: 0.74rem; color: #9b8db0; font-weight: 500; white-space: nowrap; }
  .dd-info-val { font-size: 0.8rem; font-weight: 700; color: #22013a; text-align: right; }
  .dd-info-val.green { color: #16a34a; }

  
  .dd-enroll-banner {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 16px; padding: 20px 26px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 18px; backdrop-filter: blur(6px);
  }
  .dd-enroll-banner-left { display: flex; align-items: baseline; gap: 12px; }
  .dd-price { font-family: 'Lora', serif; font-size: 2.2rem; font-weight: 700; color: #fff; line-height: 1; }
  .dd-price.free { color: #6ee7a0; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.6rem; letter-spacing: 1px; }
  .dd-price-note { font-size: 0.78rem; color: rgba(255,255,255,0.45); }
  .dd-enroll-btn {
    background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%);
    color: #22013a; border: none; padding: 13px 28px; border-radius: 11px;
    font-size: 0.9rem; font-weight: 800;
    font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
    box-shadow: 0 4px 20px rgba(49, 43, 21, 0.35); transition: all 0.25s ease;
    display: flex; align-items: center; gap: 7px; white-space: nowrap;
  }
  .dd-enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(252,211,77,0.5); }

  /* â”€â”€ PAGE BODY â”€â”€ */
  .dd-body { max-width: 1200px; margin: 0 auto; padding: 2.5rem 4rem 4rem; display: flex; flex-direction: column; gap: 1.75rem; }

  .dd-block {
    background: #fff; border-radius: 14px; padding: 28px 32px;
    border: 1px solid #ece9f1; box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    animation: fadeUp 0.4s ease both;
  }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }

  .dd-block-title {
    font-family: 'Lora', serif; font-size: 1.15rem; font-weight: 700; color: #22013a;
    margin-bottom: 20px; padding-bottom: 14px;
    border-bottom: 2px solid #f0ebf9;
    display: flex; align-items: center; gap: 8px;
  }

  .dd-overview-text { font-size: 0.88rem; color: #4b5563; line-height: 1.9; font-weight: 400; }
  .dd-overview-text p { margin-bottom: 14px; }
  .dd-overview-text p:last-child { margin-bottom: 0; }

  .dd-stat-row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px; }
  .dd-stat-pill {
    flex: 1; min-width: 130px;
    background: linear-gradient(135deg, #faf5ff, #fff8ee);
    border: 1px solid #ede8f8; border-radius: 10px;
    padding: 14px 16px; text-align: center;
  }
  .dd-stat-val { font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 700; color: #22013a; display: block; }
  .dd-stat-label { font-size: 0.71rem; color: #9b8db0; margin-top: 3px; display: block; text-transform: uppercase; letter-spacing: 0.8px; }

  .dd-outcomes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .dd-outcome-item {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 11px 14px; background: #faf9ff;
    border: 1px solid #ede8f8; border-radius: 9px;
    font-size: 0.83rem; color: #374151; line-height: 1.5;
  }
  .dd-outcome-check {
    width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #22013a, #8e5203);
    display: flex; align-items: center; justify-content: center; margin-top: 1px;
  }

  .dd-benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .dd-benefit-card {
    padding: 16px; border-radius: 11px;
    background: #faf9ff; border: 1px solid #ede8f8;
    display: flex; gap: 13px; align-items: flex-start;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .dd-benefit-card:hover { border-color: #c4b5e8; box-shadow: 0 4px 14px rgba(34,1,58,0.07); }
  .dd-benefit-icon { font-size: 1.5rem; flex-shrink: 0; line-height: 1; margin-top: 2px; }
  .dd-benefit-title { font-size: 0.84rem; font-weight: 700; color: #22013a; margin-bottom: 5px; }
  .dd-benefit-desc { font-size: 0.76rem; color: #6b7280; line-height: 1.6; }

  .dd-req-item {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 0.86rem; color: #4b5563; line-height: 1.6;
    padding: 11px 0; border-bottom: 1px solid #f5f3f9;
  }
  .dd-req-item:last-child { border-bottom: none; }
  .dd-req-dot { width: 7px; height: 7px; border-radius: 50%; background: #868528; flex-shrink: 0; margin-top: 7px; }

  .dd-tools-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .dd-tool-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: #f5f3fb; border: 1px solid #e4ddf5;
    color: #22013a; font-size: 0.8rem; font-weight: 600;
    padding: 8px 15px; border-radius: 8px; transition: background 0.15s;
  }
  .dd-tool-tag:hover { background: #ede8f8; }

  .dd-faq-item { border-bottom: 1px solid #f0ebf9; padding: 15px 0; }
  .dd-faq-item:last-child { border-bottom: none; padding-bottom: 0; }
  .dd-faq-q { font-size: 0.88rem; font-weight: 700; color: #22013a; display: flex; align-items: flex-start; gap: 10px; cursor: pointer; user-select: none; }
  .dd-faq-q-num { background: linear-gradient(135deg, #22013a, #8e5203); color: #fcd34d; font-size: 0.65rem; font-weight: 800; padding: 2px 7px; border-radius: 5px; flex-shrink: 0; margin-top: 2px; }
  .dd-faq-toggle { margin-left: auto; color: #9b8db0; font-size: 1.1rem; flex-shrink: 0; }
  .dd-faq-a { font-size: 0.83rem; color: #6b7280; line-height: 1.75; padding: 10px 0 0 38px; }

  /* â”€â”€ Bottom CTA â”€â”€ */
  .dd-cta-block {
    background: linear-gradient(135deg, #22013a 0%, #2a043b 60%, #5c3600 100%);
    border-radius: 16px; padding: 32px 28px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 20px;
    animation: fadeUp 0.4s ease both; animation-delay: .32s;
  }
  .dd-cta-heading { font-family: 'Lora', serif; font-size: 1.3rem; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .dd-cta-sub { font-size: 0.82rem; color: rgba(255,255,255,0.55); }

  .dd-center { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
  .dd-spin { width: 44px; height: 44px; border: 3px solid #ede8f8; border-top-color: #22013a; border-radius: 50%; animation: spin 0.85s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .dd-center p { color: #9b8db0; font-size: 0.88rem; }
  .dd-err-box { background: #fff0f0; border: 1px solid #fecaca; color: #dc2626; padding: 1.2rem 2rem; border-radius: 12px; font-size: 0.9rem; text-align: center; }

  @media (max-width: 960px) { .dd-body { padding: 2rem 2rem 3rem; } }
  @media (max-width: 640px) {
    .dd-body { padding: 2rem 1.2rem 3rem; gap: 1.25rem; }
    .dd-block { padding: 18px; }
    .dd-outcomes-grid { grid-template-columns: 1fr; }
    .dd-benefits-grid { grid-template-columns: 1fr; }
    .dd-enroll-banner { flex-direction: column; align-items: flex-start; }
    .dd-enroll-btn { width: 100%; justify-content: center; }
    .dd-stat-row { gap: 8px; }
    .dd-cta-block { flex-direction: column; }
    .dd-cta-block .dd-enroll-btn { width: 100%; justify-content: center; }
  }

  .course-desc { width: 100%; font-size: 17px !important; }
  .course-desc * { font-size: inherit; }
  .course-desc h1 { font-size: 32px !important; font-weight: 800; color: #22013a; margin: 28px 0 14px; line-height: 1.3; }
  .course-desc h2 { font-size: 26px !important; font-weight: 700; color: #22013a; margin: 24px 0 12px; line-height: 1.3; }
  .course-desc h3 { font-size: 21px !important; font-weight: 700; color: #3d1a5b; margin: 20px 0 10px; }
  .course-desc p  { font-size: 17px !important; color: #4b5563; line-height: 1.9; margin: 0 0 16px; }
  .course-desc ul { padding-left: 1.6em; margin: 10px 0 16px; list-style-type: disc; }
  .course-desc li { font-size: 17px !important; color: #4b5563; line-height: 1.85; margin-bottom: 8px; }
  .course-desc strong { font-weight: 700; color: #1a1228; }
  .course-desc img { display: block !important; max-width: 100% !important; margin: 16px auto !important; border-radius: 8px; }
`;

const DiplomaDetail = () => {
  useScrollToTop();
  const { slug } = useParams(); 
  // const navigate = useNavigate();
  const [diploma, setDiploma]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [openFaq, setOpenFaq]       = useState(null);
  const [showEnroll, setShowEnroll] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getDiplomaBySlug(slug); 
        setDiploma(data);
      } catch {
        setError("Failed to load this diploma. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return (
    <>
      <Helmet>
        <title>Loading... | ITechSkill</title>
      </Helmet>
      <style>{S}</style>
    <div className="dd-root"><div className="dd-center"><div className="dd-spin" /><p>Loading program</p></div></div>
    <Footer /></>
  );

  if (error || !diploma) return (
    <><style>{S}</style>
    <div className="dd-root"><div className="dd-center"><div className="dd-err-box">{error || "Diploma not found."}</div></div></div>
    <Footer /></>
  );

  const formatPrice = (price) => {
    if (price === 0) return "FREE";
    return `PKR- ${price.toLocaleString("en-PK")}`;
  };

  // Build enrollment course object for the modal
  const enrollCourseObj = {
    title:             diploma.title,
    category:          'diploma',
    installmentFee:    diploma.price === 0 ? 'Free' : `PKR-${diploma.price}`,
    installmentDollar: '',
    discountedFee:     '',
    discountedDollar:  '',
    duration:          diploma.duration,
  };

  return (
    <>
      <Helmet>
  <title>{diploma?.title} | ITechSkill</title>
  <link rel="canonical" href={`https://itechskill.com/diplomas/${slug}`} />
  <meta name="robots" content="index, follow" />
<meta property="og:title" content={`${diploma?.title} | ITechSkill`} />
<meta property="og:url" content={`https://itechskill.com/diplomas/${slug}`} />
<meta property="og:type" content="website" />
<meta property="og:image" content={diploma?.image || 'https://itechskill.com/logo.png'} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={`${diploma?.title} | ITechSkill`} />
  <meta name="description"  content={
  diploma?.metaDescription ||
  (diploma?.description
    ? diploma.description.replace(/<[^>]*>/g, '').substring(0, 155).trim()
    : `Enroll in ${diploma?.title} at ITechSkill. ${diploma?.duration} program in ${diploma?.category} with internship and certificate.`)
} />
<meta property="og:description" content={
  diploma?.metaDescription ||
  (diploma?.description
    ? diploma.description.replace(/<[^>]*>/g, '').substring(0, 155).trim()
    : `Enroll in ${diploma?.title} at ITechSkill.`)
} />

<meta name="twitter:description" content={
  diploma?.metaDescription ||
  (diploma?.description
    ? diploma.description.replace(/<[^>]*>/g, '').substring(0, 155).trim()
    : `Enroll in ${diploma?.title} at ITechSkill.`)
} />
      </Helmet>

      <style>{S}</style>
      <div className="dd-root">
        <div className="dd-body">

        {/* Title */}
        <div style={{ paddingBottom: "8px", borderBottom: "2px solid #ede8f8" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "#868528", letterSpacing: "2px", textTransform: "uppercase" }}>
            {diploma.category}
          </span>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: "700", color: "#22013a", marginTop: "8px", lineHeight: "1.25" }}>
            {diploma.title}
          </h1>
          <div style={{
  display: "inline-flex", alignItems: "center", gap: "8px",
  marginTop: "12px", background: "linear-gradient(135deg, #22013a, #8e5203)",
  color: "#fcd34d", padding: "8px 16px", borderRadius: "8px",
  fontSize: "0.82rem", fontWeight: "700", letterSpacing: "0.3px"
}}>
Internship placement with 100% guarantee for 3 months.
</div>
        </div>
        {/* Overview */}
        <div className="dd-block">
          <h2 className="dd-block-title"> Program Overview</h2>
          {/* <div className="dd-overview-text">
            <p>
              This <strong>{diploma.duration}</strong> diploma program in <strong>{diploma.category}</strong> is built for anyone ready to turn ambition into a professional career. You'll follow a structured, industry-aligned curriculum that blends foundational concepts with hands-on, real-world application.
            </p>
            <p>
              From day one, you'll work alongside industry experts, build projects that belong in your portfolio, and gain the kind of practical experience that employers actually look for.
            </p>
            <p>
              Graduates receive a recognized diploma certificate and gain full access to our Job Cell a dedicated team that actively connects you with top hiring companies in <strong>{diploma.category}</strong> across Pakistan and beyond.
            </p>
          </div> */}
          <div className="dd-stat-row">
            <div className="dd-stat-pill"><span className="dd-stat-val">{diploma.duration}</span><span className="dd-stat-label">Program Duration</span></div>
            <div className="dd-stat-pill"><span className="dd-stat-val">{diploma.learningOutcomes?.length || 0}+</span><span className="dd-stat-label">Learning Outcomes</span></div>
      <div className="dd-stat-pill">
  <span className="dd-stat-val">100%</span>
  <span className="dd-stat-label">Job Cell Support</span>
</div>
<div className="dd-stat-pill" style={{ background: "linear-gradient(135deg, #fdf6e3, #fff8ee)", border: "1px solid #f59e0b" }}>
  <span className="dd-stat-val" style={{ color: "#b45309" }}>3 Months</span>
  <span className="dd-stat-label">Internship Included</span>
</div>
            <div className="dd-stat-pill"><span className="dd-stat-val">Live</span><span className="dd-stat-label">+ Recorded Sessions</span></div>
          </div>
        </div>

        {/* Description */}
        {diploma.description && diploma.description.replace(/<[^>]*>/g, '').trim() && (
          <div className="dd-block">
            <h2 className="dd-block-title"> About This Program</h2>
            <div className="course-desc" dangerouslySetInnerHTML={{ __html: diploma.description }} />
          </div>
        )}

        {/* What You'll Learn */}
  {/* What You'll Learn */}
<div className="dd-block">
  <h2 className="dd-block-title"> What You'll Learn</h2>
  <div className="dd-outcomes-grid">
    {[
      "Develop skills recognised by top employers that are industry-employable.",   
   "Construct real world projects to enhance portfolio.",
      "Become proficient in tools and technologies used by the professionals.",
      "Use key concepts in practical application.",
      "Improve problem solving / analytical thinking skills",
"Complete a diploma certificate accepted around the world.",    
"  Free access all year around to ITechSkill and industry sponsored high-end tech seminars, workshops and bootcamps delivered by ITechSkill.",
    ].map((o, i) => (
      <div key={i} className="dd-outcome-item">
        <div className="dd-outcome-check">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        {o}
      </div>
    ))}
  </div>
</div>

        {/* What You'll Get */}
        <div className="dd-block">
          <h2 className="dd-block-title"> What You'll Get with This Program</h2>
          <div className="dd-benefits-grid">
            {BENEFITS.map((b, i) => (
              <div key={i} className="dd-benefit-card">
                <div className="dd-benefit-icon">{b.icon}</div>
                <div>
                  <div className="dd-benefit-title">{b.title}</div>
                  <div className="dd-benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        {diploma.requirements?.length > 0 && (
          <div className="dd-block">
            <h2 className="dd-block-title"> Requirements & Prerequisites</h2>
            {diploma.requirements.map((r, i) => (
              <div key={i} className="dd-req-item"><div className="dd-req-dot" />{r}</div>
            ))}
          </div>
        )}

        {/* Who is this for
        <div className="dd-block">
          <h2 className="dd-block-title"> Who Is This Program For?</h2>
          {[
            `Students who want to build a career in ${diploma.category} from scratch`,
            "Fresh graduates looking for job-ready technical skills",
            "Working professionals who want to upskill or switch their career path",
            `Anyone passionate about ${diploma.category} and modern technology`,
            "Entrepreneurs who want to understand and apply digital skills in their business",
            "Freelancers looking to expand their service offerings and income potential",
          ].map((item, i) => (
            <div key={i} className="dd-req-item"><div className="dd-req-dot" />{item}</div>
          ))}
        </div> */}

        {/* FAQs */}
        <div className="dd-block">
          <h2 className="dd-block-title"> Frequently Asked Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className="dd-faq-item">
              <div className="dd-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="dd-faq-q-num">Q{i + 1}</span>
                {faq.q}
                <span className="dd-faq-toggle">{openFaq === i ? "âˆ’" : "+"}</span>
              </div>
              {openFaq === i && <div className="dd-faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>

        <div className="dd-cta-block">
          <div>
            <div className="dd-cta-heading">Want to enroll in {diploma.title}?</div>
            <div className="dd-cta-sub">
              {formatPrice(diploma.price)} &nbsp;&nbsp; {diploma.duration} &nbsp;&nbsp; Includes Certificate + Internship
            </div>
          </div>
          <button className="dd-enroll-btn" onClick={() => setShowEnroll(true)}>
             Enroll Now
          </button>
        </div>

      </div>
    </div>
    <Footer />

    {/* â”€â”€ EnrollmentModal â”€â”€ */}
    {showEnroll && (
      <EnrollmentModal
        course={enrollCourseObj}
        onClose={() => setShowEnroll(false)}
      />
    )}
    </>
  );
};

export default DiplomaDetail;