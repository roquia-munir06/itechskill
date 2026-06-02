import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const pageSEO = {
  "/": {
    title: "ITechSkill | Online Courses & Skill Development",
    description: "Professional IT Diploma Programs, Courses and Training in Pakistan. Learn Web Development, AI, Cyber Security and more.",
    keywords: "IT courses Pakistan, online IT training, skill development, web development courses, diploma programs Pakistan, ITechSkill"
  },
  "/Blog": {
    title: "Blog - ITechSkill | Tech Articles & Guides",
    description: "Read expert articles on web development, data science, AI and more. Stay updated with latest technology trends.",
    keywords: "IT blog Pakistan, tech articles, web development blog, data science articles, AI guides, programming tutorials"
  },
  "/AboutUs": {
    title: "About Us - ITechSkill | Pakistan's Leading IT Institute",
    description: "Learn about ITechSkill — Pakistan's leading IT training institute offering professional courses and diploma programs.",
    keywords: "ITechSkill about, IT institute Pakistan, professional IT training, best IT institute Pakistan"
  },
  "/Contact": {
    title: "Contact Us - ITechSkill",
    description: "Get in touch with ITechSkill for enrollment, course queries and training information.",
    keywords: "contact ITechSkill, IT course enrollment, ITechSkill phone, ITechSkill address"
  },
  "/diplomas": {
    title: "IT Diploma Programs - ITechSkill Pakistan",
    description: "Explore professional IT diploma programs at ITechSkill. Get certified in top IT skills with expert trainers.",
    keywords: "IT diploma Pakistan, diploma programs, professional IT diploma, web development diploma, data science diploma, ITechSkill diploma"
  },
  "/trainings": {
    title: "IT Training Courses - ITechSkill Pakistan",
    description: "Browse all IT training courses at ITechSkill. Expert-led courses in web development, AI, Cyber Security and more.",
    keywords: "IT training Pakistan, online courses, web development training, AI training, cyber security course, ITechSkill courses"
  },
  "/Certification": {
    title: "IT Certifications - ITechSkill Pakistan",
    description: "Get certified in top IT skills with ITechSkill. Industry-recognized certifications for better career opportunities.",
    keywords: "IT certification Pakistan, online certification, professional certificate, ITechSkill certificate, skill certification"
  },
  "/login": {
    title: "Login - ITechSkill",
    description: "Sign in to your ITechSkill account to access your courses, diplomas and training materials.",
    keywords: "ITechSkill login, student login, sign in ITechSkill"
  },
  "/register": {
    title: "Register - ITechSkill | Start Learning Today",
    description: "Create your ITechSkill account today and start your IT learning journey with Pakistan's top IT institute.",
    keywords: "ITechSkill register, create account, sign up ITechSkill, join ITechSkill"
  },
  "/search": {
    title: "Search Courses & Programs - ITechSkill",
    description: "Search for courses, diplomas and programs at ITechSkill. Find the perfect IT course for your career.",
    keywords: "search IT courses, find diploma, ITechSkill programs, IT course search Pakistan"
  },
  "/feestructure": {
    title: "Fee Structure - ITechSkill | Affordable IT Courses",
    description: "View ITechSkill course and diploma fee structure. Affordable IT training with installment options available.",
    keywords: "ITechSkill fees, course fee Pakistan, IT training cost, affordable IT courses, diploma fee structure"
  },
  "/Faq": {
    title: "FAQ - ITechSkill | Frequently Asked Questions",
    description: "Frequently asked questions about ITechSkill programs, enrollment, fees and certifications.",
    keywords: "ITechSkill FAQ, IT course questions, enrollment queries, ITechSkill help"
  },
  "/Careers": {
    title: "Careers - ITechSkill | Join Our Team",
    description: "Join the ITechSkill team and grow your career. Explore job opportunities at Pakistan's leading IT institute.",
    keywords: "ITechSkill careers, jobs Pakistan, IT jobs, work at ITechSkill, teaching jobs Pakistan"
  },
  "/Privacy": {
    title: "Privacy Policy - ITechSkill",
    description: "Read ITechSkill privacy policy to understand how we protect your personal data.",
    keywords: "ITechSkill privacy policy, data protection, user privacy"
  },
  "/Terms": {
    title: "Terms & Conditions - ITechSkill",
    description: "Read ITechSkill terms and conditions for using our platform and services.",
    keywords: "ITechSkill terms, conditions of use, platform terms"
  },
};

const DEFAULT_SEO = {
  title: "ITechSkill | Online Courses & Skill Development",
  description: "Professional IT Diploma Programs, Courses and Training in Pakistan. Learn Web Development, AI, Cyber Security and more.",
  keywords: "IT courses Pakistan, online IT training, ITechSkill, skill development Pakistan",
};

const formatSlug = (slug) => {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const SEO = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let seo = pageSEO[path] || null;

    // ── Handle /diplomas/:slug ──
    if (!seo && path.startsWith("/diplomas/")) {
      const slug = path.replace("/diplomas/", "");
      const name = formatSlug(slug);
      seo = {
        title: `${name} Diploma - ITechSkill Pakistan`,
        description: `Enroll in ${name} Diploma Program at ITechSkill. Professional IT training with expert instructors in Pakistan.`,
        keywords: `${name} diploma, ${name} course Pakistan, ${name} training, ITechSkill ${name}, learn ${name} Pakistan`,
      };
    }

    // ── Handle /programs/:slug or /course/:slug ──
    if (!seo && (path.startsWith("/programs/") || path.startsWith("/course/"))) {
      const slug = path.replace("/programs/", "").replace("/course/", "");
      const name = formatSlug(slug);
      seo = {
        title: `${name} Course - ITechSkill Pakistan`,
        description: `Learn ${name} at ITechSkill. Professional IT training and courses with expert instructors in Pakistan.`,
        keywords: `${name} course, learn ${name}, ${name} training Pakistan, ${name} online course, ITechSkill ${name}`,
      };
    }

    // ── Handle /blog/:slug ──
    if (!seo && path.startsWith("/blog/")) {
      const slug = path.replace("/blog/", "");
      const name = formatSlug(slug);
      seo = {
        title: `${name} - ITechSkill Blog`,
        description: `Read about ${name} on ITechSkill Blog. Expert IT guides, tutorials and articles for tech professionals.`,
        keywords: `${name}, ${name} tutorial, ${name} guide, IT blog Pakistan, ITechSkill blog`,
      };
    }

    // ── Fallback ──
    if (!seo) seo = DEFAULT_SEO;

    // ── Apply to document ──
    document.title = seo.title;

    // Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.description;

    // Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seo.keywords;

  }, [location.pathname]);

  return null;
};

export default SEO;