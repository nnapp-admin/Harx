import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import NeonStrings from './NeonStrings';
import AnalyticsImage from './assets/Analytics.jpg';
import ScribingImage from './assets/scribing.jpg';
import BrandMapImage from './assets/BrandMapmap.jpg';
import GhostBrandImage from './assets/GhostBrand.jpg';
import GigAdvanceImage from './assets/GigAdvance.jpg';
import MyWaiterImage from './assets/MyWaiter.jpg';
import NutrinationImage from './assets/Nutrination.jpg';
import XerxesImage from './assets/Xerxes.jpg';
import SkordImage from './assets/Skord.jpg';
import KonarkImage from './assets/WifeCode.jpg';
import FounderImage from './assets/Foundercult.jpg';
import MeghezaImage from './assets/Megheza.jpg';
import SalescatImage from './assets/Salescat.jpg';
import StarlookImage from './assets/Starlook.jpg';
import DecodeImage from './assets/19decode.jpg';
import FacilityImage from './assets/Facility19.jpg';
import PostgirlImage from './assets/Postgirl.jpg';
import AstronomicaImage from './assets/Astronomica.jpg';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    title: 'Astronomica',
    description:
      'AI-powered SAT preparation platform featuring retrieval-augmented generation (RAG), custom knowledge bases, adaptive practice modules, and intelligent student performance evaluation.',
    tags: ['Next.js', 'AWS', 'RAG', 'Custom KB', 'Agentic AI'],
    link: 'https://student.astronomica.ai/',
    status: 'complete',
    image: AstronomicaImage,
  },
  {
    title: 'Scribing',
    description:
      'AI-powered medical documentation system that listens to consultations, performs speech-to-text processing, extracts medical entities, and converts them into structured clinical templates. Uses RAG validation, domain-tuned LLM prompts, and physician-style formatting.',
    tags: ['React', 'TypeScript', 'AWS', 'Speech Recognition', 'GPT-OSS', 'Gemma'],
    link: 'https://scribing.io',
    status: 'complete',
    image: ScribingImage,
  },
  {
    title: '19Decode',
    description:
      'Sports prediction platform powered by custom machine learning models that analyze historical data, player performance, and real-time match factors to generate accurate game insights.',
    tags: ['React', 'TypeScript', 'AWS', 'Machine Learning', 'Data Analytics', 'Predictive Modeling'],
    link: 'https://app.19decode.com',
    status: 'complete',
    image: DecodeImage,
  },
  {
    title: 'Facility19',
    description:
      'AI-powered facility management platform that automates operations such as scheduling, dispatch, vendor coordination, and resident communication.',
    tags: ['React', 'TypeScript', 'AWS', 'AI Automation', 'Workflow Management', 'SaaS'],
    link: 'https://welaunch.ai/',
    status: 'complete',
    image: FacilityImage,
  },
  {
    title: 'PostGirl',
    description:
      'AI-powered content generation and publishing tool designed to help users create, refine, and share social media posts effortlessly. Smart text generation to streamline the content creation workflow.',
    tags: ['React', 'TypeScript', 'AWS', 'Agentic AI'],
    link: 'https://post-girl.vercel.app/',
    status: 'complete',
    image: PostgirlImage,
  },
  {
    title: 'SalesCat',
    description:
      'A text-based AI sales agent trained to mimic high-performing sales reps. Uses LLM reasoning, objection-handling flows, tone adaptation, and CRM-style structured outputs to close leads.',
    tags: ['React', 'TypeScript', 'AWS', 'GPT-OSS'],
    link: 'https://salescat.onrender.com/',
    status: 'complete',
    image: SalescatImage,
  },
  {
    title: 'StarLook',
    description:
      'Virtual wardrobe and styling assistant using multimodal embeddings, image processing, and AI-powered outfit recommendations. Users can upload clothing and generate looks.',
    tags: ['React', 'AWS', 'Next.js', 'Gemini'],
    link: 'https://studio--virtual-vogue-z1mz4.us-central1.hosted.app/',
    status: 'complete',
    image: StarlookImage,
  },
  {
    title: 'FounderCult',
    description:
      'A unified ecosystem where startup founders access tools, vetted service providers, community discussions, and collaboration channels. Built with role-based access and scalable server architecture.',
    tags: ['React', 'AWS', 'Next.js'],
    link: 'https://foundercult.onrender.com/',
    status: 'complete',
    image: FounderImage,
  },
  {
    title: 'MyWaiter',
    description:
      'QR-based restaurant automation platform enabling real-time ordering, live menu sync, staff dashboards, and ML-powered upsell suggestions. Designed to reduce service friction.',
    tags: ['React', 'Node.js', 'MongoDB', 'Restaurant Tech'],
    link: 'https://mywaiter-p2w3.onrender.com/',
    status: 'complete',
    image: MyWaiterImage,
  },
  {
    title: 'Skord',
    description:
      'A reasoning-based AI decision agent that evaluates multiple options, compares outcomes, and generates structured recommendations using multi-step thought processes and confidence scoring.',
    tags: ['React', 'AI', 'Decision Making', 'Python'],
    link: 'https://skord-g2rv.onrender.com/',
    status: 'complete',
    image: SkordImage,
  },
  {
    title: 'Brandmap',
    description:
      'A visual discovery platform that maps trending businesses, celebrities, and hotspots using geo-indexed data, API scraping, and real-time ranking algorithms.',
    tags: ['React', 'Map API', 'Social Media', 'Trends'],
    link: 'https://map-o7bz.onrender.com',
    status: 'in development',
    image: BrandMapImage,
  },
  {
    title: 'GhostBrand',
    description: 'An all-in-one solution for Personal Brands to sell anything online.',
    tags: ['UI/UX', 'Branding', 'Design System'],
    link: 'https://ghostbrand.onrender.com/',
    status: 'in development',
    image: GhostBrandImage,
  },
  {
    title: 'Gig Advance',
    description:
      'Fintech platform that verifies identity using Aadhaar, links bank accounts via SETU API, analyzes earnings history, and provides instant advance payouts through automated underwriting.',
    tags: ['React', 'Node.js', 'Aadhar Verification', 'Loan App'],
    link: 'https://giga-483t.onrender.com/',
    status: 'in development',
    image: GigAdvanceImage,
  },
  {
    title: 'Analytics Dashboard',
    description:
      'A demo project that helps administrators of a Fantasy Betting Platform monitor user behavior, financials, and team preferences. (Backend may take ~50s on free tier.)',
    tags: ['React', 'Node.js', 'Machine Learning', 'Data Analytics'],
    link: 'https://fantasy11-3vnl.onrender.com/',
    status: 'complete',
    image: AnalyticsImage,
  },
  {
    title: 'Xerxes',
    description:
      'AI-powered demand intelligence platform that validates startup concepts before launch. Simulates multi-channel ad campaigns, calculates synthetic CAC/CPC projections, models target customer personas, and delivers data-backed go/no-go verdicts via multi-model LLM pipelines.',
    tags: ['React', 'TypeScript', 'Paid Ads', 'OpenRouter', 'Gemini', 'Market Intelligence'],
    link: 'https://github.com/nnapp-admin/ZeroAI', // Replace with your live demo URL
    status: 'complete', // or 'in development'
    image: XerxesImage,
  },
  {
    title: 'Nutrination.AI',
    description:
      'AI-driven health assistant offering personalized nutrition guidance, daily routines, risk scores, and habit reinforcement using user health data and LLM reasoning.',
    tags: ['React', 'AI', 'Healthcare', 'Python'],
    link: 'https://storied-cocada-8bfcc4.netlify.app/',
    status: 'in development',
    image: NutrinationImage,
  },
  {
    title: 'Megheza',
    description: 'Global Professional Network for Verified Journalists to connect, collaborate and grow.',
    tags: ['React', 'Next.js', 'AWS'],
    link: 'https://megheza.com/',
    status: 'complete',
    image: MeghezaImage,
  },
  {
    title: 'Konark',
    description:
      'Coding companion capable of repo generation, code completion, debugging assistance, and project scaffolding — powered by LLMs, embeddings, and streaming response architecture.',
    tags: ['React', 'Coding Assistant', 'GPT-OSS', 'WebApp'],
    link: 'https://konark.onrender.com',
    status: 'complete',
    image: KonarkImage,
  },
];

const EXPERIENCES = [
  {
    date: 'Feb 2026 - Present',
    title: 'AI Engineer',
    company: 'WeLaunch · Full-time · Remote',
    description:
      'Building full-stack and agentic AI systems at WeLaunch, contributing across the entire product lifecycle — from backend architecture and API integrations to deploying LLM-powered workflows and automation pipelines.',
    tags: ['Full Stack Development', 'Agentic AI', 'LLMs', 'API Integration', 'Automation'],
  },
  {
    date: 'Jan 2026 - Feb 2026',
    title: 'AI Engineer Intern',
    company: 'Vela (YC W26) · Remote',
    description:
      'Vela is a Y Combinator-backed AI assistant that helps people schedule meetings effortlessly — no back-and-forth, no chaos. She books interviews and coordinates across clients & candidates.',
    tags: ['Agentic AI', 'Scheduling Automation', 'LLMs', 'YC W26'],
  },
  {
    date: 'Aug 2025 - Present',
    title: 'Co-Founder',
    company: 'Scribing · Part-time · Remote',
    description:
      'Our AI listens to every consultation, transcribes it in real time, and instantly converts it into structured medical templates, while intelligently evaluating ICD-10 codes.',
    tags: ['AI Medical Scribe', 'Speech Recognition', 'LLMs', 'Healthcare Tech', 'Entrepreneurship'],
  },
  {
    date: 'May 2025 - Present',
    title: 'Member',
    company: 'FounderCult · Part-time · India',
    description:
      'All the tools, services & connections startup founders need — to build smarter, move faster & grow together. Active contributor in a founder ecosystem.',
    tags: ['Start-up Ventures', 'MERN Stack', 'Community Building', 'Entrepreneurship'],
  },
  {
    date: 'Jan 2025 - Present',
    title: 'SDE',
    company: 'AM Megheza',
    description:
      'Global Professional Network for Verified Journalists. Founding Engineer responsible for designing, building, and maintaining the website and web applications, server management, and security.',
    tags: ['Full Stack Development', 'AWS', 'Team Collaboration'],
  },
  {
    date: 'Oct 2022 - May 2024',
    title: 'Content & Marketing Strategist',
    company: 'Indian Institute of Technology, Madras',
    description: 'Shaped connections at Alumni and Corporate Relations by curating compelling content.',
    tags: ['Corporate Communications', 'Content Marketing', 'Social Media Strategy', 'Crisis Management'],
  },
  {
    date: 'Apr 2020 - Present',
    title: 'Freelance VFX/GFX Designer',
    company: 'Fiverr',
    description: 'Working as a freelance graphic designer and brand management designer.',
    tags: ['Graphic Design', 'Brand Management', 'Visual Effects', 'Copywriting'],
  },
];

const EDUCATION = [
  {
    date: '2021 - 2025',
    degree: 'Bachelor of Science — Data Science',
    institution: 'Indian Institute of Technology, Madras',
    description: 'Focusing on Python, Data Analytics, Machine Learning Algorithms, and Database Management.',
  },
  {
    date: 'Jul 2021 - Jul 2024',
    degree: 'Bachelor of Business Administration',
    institution: 'Amity University Online',
    description: '',
  },
];

const SKILLS = {
  Development: [
    'Python', 'JavaScript', 'React', 'Node.js', 'Next.js', 'MongoDB', 'AWS', 'GCP',
    'SQL', 'Anthropic SDK', 'CI/CD', 'OpenAI SDK', 'xAI SDK', 'Gemini SDK', 'Kotlin & Android Studio',
  ],
  'Data Science & AI': [
    'Data Analytics', 'Machine Learning', 'Database Management', 'Data Visualization',
    'Fine Tuning', 'Vector Databases', 'RAG Pipeline', 'Ollama', 'HuggingFace', 'LangChain',
  ],
  Design: ['Graphic Design', 'UI/UX Design', 'Visual Effects', 'Brand Development'],
  'Content Creation': ['GFX Design', 'VFX Design', 'Content Research', 'Content Writing', 'Content Curation', 'AI Generated Videos'],
};

// ─── Typewriter ────────────────────────────────────────────────────────────────

const Typewriter = ({ texts, speed = 80 }) => {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const current = texts[idx];
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
        if (charIdx + 1 === current.length) {
          setPaused(true);
          setTimeout(() => { setDeleting(true); setPaused(false); }, 2200);
        }
      } else {
        setDisplayed(current.slice(0, charIdx - 1));
        setCharIdx((c) => c - 1);
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, paused, texts, speed]);

  return (
    <span className="tw-text">
      {displayed}
      <span className="tw-cursor">|</span>
    </span>
  );
};

// ─── Main Portfolio ────────────────────────────────────────────────────────────

const Portfolio = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const isRevealedRef = useRef(false);
  const [isCursorActive, setIsCursorActive] = useState(false);
  const isCursorActiveRef = useRef(false);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('home');
  const scrollBarRef = useRef(null);

  // Custom Magnetic Cursor Refs & State
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const ringPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isHovering, setIsHovering] = useState(false);
  const isHoveringRef = useRef(false);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  }, []);

  // Custom magnetic cursor hover listener
  useEffect(() => {
    const handleMouseOver = (e) => {
      const interactive = e.target.closest('a, button, input, textarea, select, [role="button"], .proj-card, .exp-card, .edu-card, .skill-card, .nav-pill-item, .pill-btn-solid, .pill-btn-frosted, .support-btn, .icon-btn');
      if (interactive) {
        setIsHovering(true);
        isHoveringRef.current = true;
      }
    };
    const handleMouseOut = (e) => {
      const interactive = e.target.closest('a, button, input, textarea, select, [role="button"], .proj-card, .exp-card, .edu-card, .skill-card, .nav-pill-item, .pill-btn-solid, .pill-btn-frosted, .support-btn, .icon-btn');
      if (interactive) {
        setIsHovering(false);
        isHoveringRef.current = false;
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Canvas & Character animation tracking refs
  const frameImagesRef = useRef([]);
  const angleMapRef = useRef([]);  // Exact angle (in degrees) for each perimeter frame
  const inRightImagesRef = useRef([]);
  const inDownRightImagesRef = useRef([]);
  const inDownImagesRef = useRef([]);
  const inDownLeftImagesRef = useRef([]);
  const inLeftImagesRef = useRef([]);
  const inUpLeftImagesRef = useRef([]);
  const inUpImagesRef = useRef([]);
  const inUpRightImagesRef = useRef([]);
  const centerImageRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, active: false });
  const smoothedAngleRef = useRef(0);
  const gyroRef = useRef({ x: 0, y: 0, active: false });
  const smoothedGyroRef = useRef({ x: 0, y: 0 });

  // Detect mobile / touch devices where gyroscope replaces cursor tracking
  const isMobileScreen = () => {
    return (
      window.innerWidth <= 1024 ||
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0 && window.innerWidth <= 1200)
    );
  };

  // Preload 207 perimeter frames + 8-way inward sets + center.webp + angle map
  useEffect(() => {
    let loadedCount = 0;
    const TOTAL_PERIMETER = 207;
    const frames = new Array(TOTAL_PERIMETER);
    let revealTriggered = false;

    const triggerReveal = () => {
      if (revealTriggered) return;
      revealTriggered = true;
      setIsRevealing(true);
      setIsPageLoaded(true);
      setTimeout(() => {
        setIsRevealed(true);
        isRevealedRef.current = true;
      }, 1200);
    };

    const checkLoaded = () => {
      loadedCount++;
      if (centerImageRef.current?.complete && (loadedCount >= 20 || loadedCount >= TOTAL_PERIMETER + 1)) {
        triggerReveal();
      }
    };

    // Load angle map JSON (maps each frame index to its exact angle in degrees)
    fetch(`${process.env.PUBLIC_URL}/frames/angle_map.json`)
      .then(res => res.json())
      .then(map => { angleMapRef.current = map; })
      .catch(() => {
        // Fallback: generate uniform angle map
        const fallback = [];
        for (let i = 0; i < TOTAL_PERIMETER; i++) fallback.push(i * 360.0 / TOTAL_PERIMETER);
        angleMapRef.current = fallback;
      });

    // Preload center.webp
    const centerImg = new Image();
    centerImg.src = `${process.env.PUBLIC_URL}/frames/center.webp`;
    centerImg.onload = checkLoaded;
    centerImg.onerror = checkLoaded;
    centerImageRef.current = centerImg;

    // Preload 207 perimeter frames (0..206)
    for (let i = 0; i < TOTAL_PERIMETER; i++) {
      const img = new Image();
      img.src = `${process.env.PUBLIC_URL}/frames/${i}.webp`;
      img.onload = checkLoaded;
      img.onerror = checkLoaded;
      frames[i] = img;
    }
    frameImagesRef.current = frames;

    // Helper to preload inward transition sequence
    const loadInwardSet = (prefix, count, ref) => {
      const list = [];
      for (let i = 0; i < count; i++) {
        const img = new Image();
        img.src = `${process.env.PUBLIC_URL}/frames/${prefix}_${i}.webp`;
        img.onload = checkLoaded;
        img.onerror = checkLoaded;
        list.push(img);
      }
      ref.current = list;
    };

    // Preload all 8 high-density inward directional sets (77 frames total)
    loadInwardSet('in_right', 10, inRightImagesRef);
    loadInwardSet('in_downright', 9, inDownRightImagesRef);
    loadInwardSet('in_down', 10, inDownImagesRef);
    loadInwardSet('in_downleft', 8, inDownLeftImagesRef);
    loadInwardSet('in_left', 10, inLeftImagesRef);
    loadInwardSet('in_upleft', 9, inUpLeftImagesRef);
    loadInwardSet('in_up', 11, inUpImagesRef);
    loadInwardSet('in_upright', 10, inUpRightImagesRef);

    const fallbackTimer = setTimeout(() => {
      triggerReveal();
    }, 2500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  // Track cursor position for dot & head tracking (locked until reveal finishes, only visible when user moves mouse)
  // On mobile screens, cursor/touch tracking is disabled on the character; gyroscope is used instead.
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isMobileScreen()) return;
      if (!isRevealedRef.current) return;
      if (!isCursorActiveRef.current) {
        ringPosRef.current = { x: e.clientX, y: e.clientY };
        isCursorActiveRef.current = true;
        setIsCursorActive(true);
      }
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      }
    };
    const handleTouchMove = (e) => {
      if (isMobileScreen()) return;
      if (!isRevealedRef.current) return;
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        if (!isCursorActiveRef.current) {
          ringPosRef.current = { x: touch.clientX, y: touch.clientY };
          isCursorActiveRef.current = true;
          setIsCursorActive(true);
        }
        mouseRef.current = { x: touch.clientX, y: touch.clientY, active: true };
        if (cursorDotRef.current) {
          cursorDotRef.current.style.transform = `translate3d(${touch.clientX - 4}px, ${touch.clientY - 4}px, 0)`;
        }
      }
    };
    const handleMouseLeave = () => {
      isCursorActiveRef.current = false;
      setIsCursorActive(false);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Gyroscope tracking for mobile screens (calibrated opposite parallax)
  useEffect(() => {
    const handleOrientation = (e) => {
      if (!isRevealedRef.current) return;
      const gamma = e.gamma; // Left-to-Right tilt [-90, 90]
      const beta = e.beta;   // Front-to-Back tilt [-180, 180]
      if (gamma === null || beta === null) return;

      // Neutral reading when holding phone naturally while browsing (~50 deg upright)
      const neutralBeta = 50.0;
      const neutralGamma = 0.0;

      // Delta from comfortable holding angle
      const dGamma = gamma - neutralGamma;
      const dBeta = beta - neutralBeta;

      // Deadband filter: ignore micro hand tremors (< 1.5 deg) so character stays serene
      const absDGamma = Math.abs(dGamma);
      const absDBeta = Math.abs(dBeta);

      const filteredGamma = absDGamma > 1.5 ? (absDGamma - 1.5) * Math.sign(dGamma) : 0;
      const filteredBeta = absDBeta > 1.5 ? (absDBeta - 1.5) * Math.sign(dBeta) : 0;

      // "Opposive" (inverted) gyroscope parallax:
      // When phone tilts RIGHT (dGamma > 0), character turns LEFT (virtualX < 0)
      // When phone tilts LEFT (dGamma < 0), character turns RIGHT (virtualX > 0)
      // When phone tilts TOP AWAY (dBeta < 0), character tilts UP (virtualY < 0)
      // When phone tilts TOP TOWARD (dBeta > 0), character tilts DOWN (virtualY > 0)
      // Sensitivity factor: ~6.2px per degree gives natural reach to r_outer (190px) at ~30 deg tilt
      const SENSITIVITY = 6.2;
      const MAX_OFFSET = 210;

      const targetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, -filteredGamma * SENSITIVITY));
      const targetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, filteredBeta * SENSITIVITY));

      gyroRef.current = {
        x: targetX,
        y: targetY,
        active: true,
      };
    };

    // iOS 13+ permission support & auto-initialization
    const initGyro = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        } catch {
          // Graceful fallback to center pose if permission is denied
        }
      } else if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    };

    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      const handleFirstInteraction = () => {
        initGyro();
        window.removeEventListener('touchstart', handleFirstInteraction);
        window.removeEventListener('touchend', handleFirstInteraction);
      };
      window.addEventListener('touchstart', handleFirstInteraction, { passive: true, once: true });
      window.addEventListener('touchend', handleFirstInteraction, { passive: true, once: true });
    } else {
      initGyro();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // 60 FPS Zero-Ghosting Canvas Renderer & Magnetic Cursor Ring Lerp
  useEffect(() => {
    let animId;

    const render = () => {
      const mouse = mouseRef.current;

      // Update Magnetic Trailing Cursor Ring with smooth lerp (only once user moves mouse)
      if (cursorRingRef.current && isCursorActiveRef.current) {
        ringPosRef.current.x += (mouse.x - ringPosRef.current.x) * 0.22;
        ringPosRef.current.y += (mouse.y - ringPosRef.current.y) * 0.22;
        const ringRadius = isHoveringRef.current ? 28 : 18;
        cursorRingRef.current.style.transform = `translate3d(${ringPosRef.current.x - ringRadius}px, ${ringPosRef.current.y - ringRadius}px, 0)`;
      }

      const canvas = canvasRef.current;
      if (!canvas) {
        animId = requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const canvasW = rect.width;
      const canvasH = rect.height;

      // Original video aspect ratio: 1920 / 1080 = 16 / 9
      const videoAspect = 1920 / 1080;
      const canvasAspect = canvasW / (canvasH || 1);

      let renderedW, renderedH, offsetX, offsetY;
      if (canvasAspect > videoAspect) {
        // Screen is wider than 16:9 -> top and bottom are cropped equally
        renderedW = canvasW;
        renderedH = canvasW / videoAspect;
        offsetX = 0;
        offsetY = (canvasH - renderedH) / 2;
      } else {
        // Screen is taller than 16:9 -> left and right are cropped equally
        renderedH = canvasH;
        renderedW = canvasH * videoAspect;
        offsetX = (canvasW - renderedW) / 2;
        offsetY = 0;
      }

      // Normalized character face center from the 1920x1080 character2.mp4 video:
      // x = 940 / 1920 = 0.4896, y = 390 / 1080 = 0.3611
      const faceCenterX = rect.left + offsetX + renderedW * 0.4896;
      const faceCenterY = rect.top + offsetY + renderedH * 0.3611;

      let effDx = mouse.x - faceCenterX;
      let effDy = mouse.y - faceCenterY;
      let effDist = Math.hypot(effDx, effDy);
      let effActive = mouse.active;

      // On mobile screens, use smoothed gyroscope offsets instead of mouse/touch
      if (isMobileScreen()) {
        if (gyroRef.current.active) {
          smoothedGyroRef.current.x += (gyroRef.current.x - smoothedGyroRef.current.x) * 0.16;
          smoothedGyroRef.current.y += (gyroRef.current.y - smoothedGyroRef.current.y) * 0.16;
          effDx = smoothedGyroRef.current.x;
          effDy = smoothedGyroRef.current.y;
          effDist = Math.hypot(effDx, effDy);
          effActive = true;
        } else {
          effDx = 0;
          effDy = 0;
          effDist = 0;
          effActive = false;
        }
      }

      // Transition boundaries (inner direct eye-contact sweet spot vs full perimeter reach)
      const r_inner = 38;
      const r_outer = 190;
      const isDirectCenter = !effActive || effDist <= r_inner;

      // Calculate cursor angle relative to face center
      const targetAngle = Math.atan2(effDy, effDx);

      // Shortest-path circular angular lerp with responsive factor ~0.38 (~40ms tracking)
      let diff = (targetAngle - smoothedAngleRef.current) % (2 * Math.PI);
      if (diff < -Math.PI) diff += 2 * Math.PI;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      smoothedAngleRef.current += diff * 0.38;

      // Map smoothed angle to nearest perimeter frame using angle map (207 non-uniform frames)
      const twoPi = 2 * Math.PI;
      const normAngle = ((smoothedAngleRef.current % twoPi) + twoPi) % twoPi;
      const cursorDeg = (normAngle * 180 / Math.PI) % 360;
      const angleMap = angleMapRef.current;
      const totalFrames = frameImagesRef.current.length || 207;
      let frameIndex = 0;
      if (angleMap && angleMap.length > 0) {
        // Binary search for closest angle in the sorted angle map
        let bestDist = 360;
        for (let i = 0; i < angleMap.length; i++) {
          let d = Math.abs(angleMap[i] - cursorDeg);
          if (d > 180) d = 360 - d;  // Wrap-around shortest distance
          if (d < bestDist) { bestDist = d; frameIndex = i; }
        }
      } else {
        frameIndex = Math.round((cursorDeg / 360) * totalFrames) % totalFrames;
      }

      // Select frame with smooth inward transition (using real video frames)
      let imgToDraw = null;

      // Seam patch: the one unavoidable video seam at ~269° (UP direction)
      // where perimeter frame 206 jumps to frame 0 with a 23.6px delta.
      // When the cursor sweeps through this 8° band on the outer perimeter,
      // use the smooth in_up inward frames instead to bridge the gap.
      const SEAM_CENTER = 269.0;
      const SEAM_HALF = 4.0;
      let seamDist = Math.abs(cursorDeg - SEAM_CENTER);
      if (seamDist > 180) seamDist = 360 - seamDist;
      const isInSeamZone = seamDist < SEAM_HALF;

      if (!isRevealedRef.current || isDirectCenter) {
        imgToDraw = centerImageRef.current;
      } else if (isInSeamZone && effDist >= r_outer) {
        // On the perimeter at the seam — use the outermost in_up frame (index 0)
        // which is the same head pose as the perimeter but avoids the seam jump
        const inUpList = inUpImagesRef.current;
        if (inUpList && inUpList.length > 0) {
          imgToDraw = inUpList[0];
        } else {
          const frames = frameImagesRef.current;
          imgToDraw = frames && frames[frameIndex] ? frames[frameIndex] : centerImageRef.current;
        }
      } else if (effDist < r_outer) {
        // Cursor / gyro is in transition zone towards center
        const progress = Math.max(0, Math.min(1, (effDist - r_inner) / (r_outer - r_inner)));

        // Calculate cursor direction in degrees [0, 360)
        const angleDeg = (((targetAngle * 180 / Math.PI) % 360) + 360) % 360;
        let chosenList = null;

        // Select exact 8-way inward physical video trajectory:
        // Right: [337.5°, 360°) U [0°, 22.5°)
        if (angleDeg >= 337.5 || angleDeg < 22.5) {
          chosenList = inRightImagesRef.current;
        }
        // Down-Right: [22.5°, 67.5°)
        else if (angleDeg >= 22.5 && angleDeg < 67.5) {
          chosenList = inDownRightImagesRef.current;
        }
        // Down: [67.5°, 112.5°)
        else if (angleDeg >= 67.5 && angleDeg < 112.5) {
          chosenList = inDownImagesRef.current;
        }
        // Down-Left: [112.5°, 157.5°)
        else if (angleDeg >= 112.5 && angleDeg < 157.5) {
          chosenList = inDownLeftImagesRef.current;
        }
        // Left: [157.5°, 202.5°)
        else if (angleDeg >= 157.5 && angleDeg < 202.5) {
          chosenList = inLeftImagesRef.current;
        }
        // Up-Left: [202.5°, 247.5°)
        else if (angleDeg >= 202.5 && angleDeg < 247.5) {
          chosenList = inUpLeftImagesRef.current;
        }
        // Up: [247.5°, 292.5°)
        else if (angleDeg >= 247.5 && angleDeg < 292.5) {
          chosenList = inUpImagesRef.current;
        }
        // Up-Right: [292.5°, 337.5°)
        else {
          chosenList = inUpRightImagesRef.current;
        }

        if (chosenList && chosenList.length > 0) {
          const maxStep = chosenList.length - 1;
          const step = Math.min(maxStep, Math.max(0, Math.round((1 - progress) * maxStep)));
          imgToDraw = chosenList[step];
        } else {
          const frames = frameImagesRef.current;
          imgToDraw = frames && frames[frameIndex] ? frames[frameIndex] : centerImageRef.current;
        }
      } else {
        const frames = frameImagesRef.current;
        imgToDraw = frames && frames[frameIndex] ? frames[frameIndex] : centerImageRef.current;
      }

      // Safety fallback
      if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
        imgToDraw = centerImageRef.current;
      }

      // Draw EXACTLY ONE crisp frame at 100% opacity on the canvas (zero alpha-blend ghosting)
      if (imgToDraw && imgToDraw.complete && imgToDraw.naturalWidth > 0) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(imgToDraw, 0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);




  // Scroll progress + active section + reveal
  useEffect(() => {
    if (!isPageLoaded) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
          if (scrollBarRef.current) {
            scrollBarRef.current.style.width = `${pct}%`;
          }
          const ids = ['home', 'projects', 'experience', 'education', 'skills', 'contact'];
          for (let i = ids.length - 1; i >= 0; i--) {
            const el = document.getElementById(ids[i]);
            if (el && el.getBoundingClientRect().top <= 120) {
              setActiveSection((prev) => (prev !== ids[i] ? ids[i] : prev));
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('vis'), delay);
          }
        });
      },
      { threshold: 0.08, rootMargin: '-20px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [isPageLoaded]);

  // 3D tilt card handlers
  const onCardEnter = useCallback((e) => {
    e.currentTarget.style.transition = 'transform 0.08s ease, box-shadow 0.3s ease';
  }, []);
  const onCardMove = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -18;
    const ry = ((x / r.width) - 0.5) * 18;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(22px)`;
    const shine = el.querySelector('.shine');
    if (shine) shine.style.background = 'none';
  }, []);
  const onCardLeave = useCallback((e) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    const shine = el.querySelector('.shine');
    if (shine) shine.style.background = 'none';
  }, []);
  const tilt = { onMouseEnter: onCardEnter, onMouseMove: onCardMove, onMouseLeave: onCardLeave };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-theme={theme} className="pf">
      {/* Custom Magnetic Cursor (hidden completely during loading/reveal and until user moves mouse) */}
      <div ref={cursorDotRef} className={`cursor-dot${!isCursorActive ? ' cursor-hidden' : ''}`} />
      <div ref={cursorRingRef} className={`cursor-ring${isHovering ? ' is-hovering' : ''}${!isCursorActive ? ' cursor-hidden' : ''}`} />

      {/* Top scroll progress */}
      <div ref={scrollBarRef} className="scroll-bar" style={{ width: '0%' }} />

      {/* 7 Interactive Neon Physics Strings in right black gap (elongates down to footer) */}
      <NeonStrings isVisible={isRevealing} />

      {/* ── Floating Frosted-Glass Header Navigation Pill ────────── */}
      <header className="floating-nav-pill" aria-label="Main Navigation">
        <div className="nav-marquee-viewport">
          <div className="nav-marquee-track">
            {[0, 1].map((copyIdx) => (
              <div key={copyIdx} className="nav-marquee-group" aria-hidden={copyIdx === 1 ? 'true' : undefined}>
                <a
                  href="#projects"
                  className={`nav-pill-item ${activeSection === 'projects' ? 'active' : ''}`}
                  onClick={(e) => scrollTo(e, '#projects')}
                >
                  [PROJECTS]
                </a>
                <a
                  href="#experience"
                  className={`nav-pill-item ${activeSection === 'experience' ? 'active' : ''}`}
                  onClick={(e) => scrollTo(e, '#experience')}
                >
                  [EXPERIENCE]
                </a>
                <a
                  href="#education"
                  className={`nav-pill-item ${activeSection === 'education' ? 'active' : ''}`}
                  onClick={(e) => scrollTo(e, '#education')}
                >
                  [EDUCATION]
                </a>
                <a
                  href="#skills"
                  className={`nav-pill-item ${activeSection === 'skills' ? 'active' : ''}`}
                  onClick={(e) => scrollTo(e, '#skills')}
                >
                  [SKILLS]
                </a>
                <a
                  href="#contact"
                  className={`nav-pill-item ${activeSection === 'contact' ? 'active' : ''}`}
                  onClick={(e) => scrollTo(e, '#contact')}
                >
                  [CONTACT]
                </a>
                <a
                  href="https://razorpay.me/@cassinicorp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-pill-item nav-pill-support"
                >
                  [SUPPORT ME]
                </a>
              </div>
            ))}
          </div>
        </div>
        <button className="nav-pill-theme" onClick={toggleTheme} aria-label="Toggle theme">
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </header>

      {/* ══ FULLSCREEN HERO ═════════════════════════════════════════ */}
      <section id="home" className="hero-fullscreen">
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className={`hero-canvas ${isRevealing ? 'hero-canvas-revealed' : 'hero-canvas-loading'}`}
          aria-label="Interactive character head rotation tracking cursor"
        />

        {/* Subtle gradient vignette to ensure bottom-left text readability */}
        <div className="hero-vignette" />

        {/* Bottom-Left Hero Content */}
        <div className="hero-bottom-left">
          <p className="hero-hi-spaced">Hi, I'm</p>
          <h1 className="hero-script-name">Harx🔱</h1>
          <p className="hero-compact-bio">
Developer, Entrepreneur building intelligent systems from concept to scale. Specialized in agentic AI, multimodal interfaces, AI infrastructure, modern web architectures, and automation.            </p>
          <div className="hero-pill-btns">
            <a href="#experience" className="pill-btn-solid" onClick={(e) => scrollTo(e, '#experience')}>
              <span>Experience</span>
              <span className="btn-arrow">→</span>
            </a>
            <a href="#contact" className="pill-btn-frosted" onClick={(e) => scrollTo(e, '#contact')}>
              Say Hello
            </a>
          </div>
        </div>


      </section>

      <main className="pf-main">

        {/* ══ PROJECTS ═════════════════════════════════════════════════════ */}
        <section id="projects">
          <div className="sec-hdr reveal" data-delay="0">
            <h2>Projects</h2>
            <p className="sec-sub">Things I've shipped</p>
          </div>
          <div className="proj-grid">
            {PROJECTS.map((p, i) => (
              <article key={p.title} className="proj-card reveal" data-delay={String((i % 3) * 90)} {...tilt}>
                <div className="shine" />
                <div className="proj-img">
                  <img src={p.image} alt={p.title} loading="lazy" />
                  <div className="proj-overlay" />
                  <span className={`badge ${p.status === 'complete' ? 'live' : 'dev'}`}>
                    {p.status === 'complete' ? '✓ Live' : '⚡ In Dev'}
                  </span>
                </div>
                <div className="proj-body">
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <div className="tags">
                    {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="proj-link">Live Demo →</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ══ EXPERIENCE ═══════════════════════════════════════════════════ */}
        <section id="experience">
          <div className="sec-hdr reveal" data-delay="0">
            <h2>Experience</h2>
            <p className="sec-sub">Where I've worked & built</p>
          </div>
          <div className="exp-list">
            {EXPERIENCES.map((ex, i) => (
              <div key={i} className="exp-card reveal" data-delay={String(i * 70)} {...tilt}>
                <div className="shine" />
                <div className="exp-accent" />
                <span className="date-chip">{ex.date}</span>
                <h3>{ex.title}</h3>
                <h4>{ex.company}</h4>
                <p>{ex.description}</p>
                <div className="tags">
                  {ex.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ EDUCATION ════════════════════════════════════════════════════ */}
        <section id="education">
          <div className="sec-hdr reveal" data-delay="0">
            <h2>Education</h2>
            <p className="sec-sub">Academic foundations</p>
          </div>
          <div className="edu-grid">
            {EDUCATION.map((ed, i) => (
              <div key={i} className="edu-card reveal" data-delay={String(i * 140)} {...tilt}>
                <div className="shine" />
                <div className="edu-accent" />
                <span className="date-chip">{ed.date}</span>
                <h3>{ed.degree}</h3>
                <h4>{ed.institution}</h4>
                {ed.description && <p>{ed.description}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* ══ SKILLS ═══════════════════════════════════════════════════════ */}
        <section id="skills">
          <div className="sec-hdr reveal" data-delay="0">
            <h2>Skills</h2>
            <p className="sec-sub">My technical toolkit</p>
          </div>
          <div className="skills-overview-card reveal" data-delay="60" {...tilt}>
            <div className="shine" />
            <div className="skills-overview-accent" />
            <p className="skills-overview-text">
              I have hands on experience building products end-to-end—from idea validation, MVP architecture, and scalable backend systems to real-time applications, and cloud deployments. I’ve shipped AI-powered platforms using LLMs, RAG pipelines, agentic workflows, vector search, and model fine-tuning, alongside full-stack systems across web, infra, and DevOps layers. Beyond engineering, I understand product: user acquisition, onboarding, growth loops, and continuous iteration driven by real user feedback and market signals. I thrive in 0→1 environments, solving real problems with pragmatic execution, fast iteration, and ownership from concept to scale.
            </p>
          </div>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([cat, skills], ci) => (
              <div key={cat} className="skill-card reveal" data-delay={String(ci * 110)} {...tilt}>
                <div className="shine" />
                <h3>{cat}</h3>
                <div className="skill-tags">
                  {skills.map((s, si) => (
                    <span key={s} className="stag" style={{ animationDelay: `${si * 0.12}s` }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTACT ══════════════════════════════════════════════════════ */}
        <section id="contact">
          <div className="contact-wrap reveal" data-delay="0">
            <div className="contact-glow" />
            <h2>Get In Touch</h2>
            <p>I'm always open to discussing new projects, creative ideas, or opportunities.</p>
            <a href="https://wa.link/pz0f28" target="_blank" rel="noopener noreferrer" className="btn-primary btn-lg">
              Say Hello 👋
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="pf-footer">
        <div className="socials">
          {[
            { href: 'http://linkedin.com/in/harx', icon: faLinkedin, label: 'LinkedIn' },
            { href: 'https://www.instagram.com/the_cassini_huygens?igsh=enVoazF3ZHRpYTQ4', icon: faInstagram, label: 'Instagram' },
            { href: 'https://wa.link/pz0f28', icon: faWhatsapp, label: 'WhatsApp' },
          ].map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label} className="social-a">
              <FontAwesomeIcon icon={icon} />
            </a>
          ))}
        </div>
        <p>© 2026 Harx. All rights reserved.</p>
      </footer>

      {/* ══ STYLES ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* Reset */
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; user-select:none; cursor:none !important; }
        html { scroll-behavior:smooth; -ms-overflow-style:none; scrollbar-width:none; }
        html::-webkit-scrollbar { display:none; }
        body { overflow-x:hidden; -ms-overflow-style:none; scrollbar-width:none; }
        body::-webkit-scrollbar { display:none; }

        /* Custom Magnetic Cursor */
        .cursor-hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        .cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.95), 0 0 20px rgba(255, 255, 255, 0.6);
          pointer-events: none;
          z-index: 999999;
          will-change: transform;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.16);
          pointer-events: none;
          z-index: 999998;
          will-change: transform, width, height, border-color, background;
          transition: width 0.22s var(--ease), height 0.22s var(--ease), border-color 0.22s ease, background 0.22s ease, opacity 0.4s ease, visibility 0.4s ease;
        }

        .cursor-ring.is-hovering {
          width: 56px;
          height: 56px;
          border-color: rgba(255, 255, 255, 0.95);
          background: rgba(255, 255, 255, 0.14);
          box-shadow: 0 0 24px rgba(255, 255, 255, 0.35);
        }

        @media (max-width: 1024px), (pointer: coarse) {
          .cursor-dot, .cursor-ring {
            display: none !important;
          }
        }

        /* Tokens */
        :root {
          --blue:   #f43f5e;
          --purple: #9f1239;
          --teal:   #fb7185;
          --orange: #f97316;
          --ease:   cubic-bezier(0.16,1,0.3,1);
          --font:   'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        }
        [data-theme='dark'] {
          --bg:         #000000;
          --bg2:        #08080c;
          --card:       #0c0c12;
          --card-hover: #13131c;
          --border:     rgba(255,255,255,0.08);
          --text:       #ececf4;
          --muted:      #8888a0;
          --shadow:     rgba(0,0,0,0.85);
          --glow:       rgba(244,63,94,0.32);
        }
        [data-theme='light'] {
          --bg:         #fdfbfb;
          --bg2:        #f7f2f2;
          --card:       #ffffff;
          --card-hover: #f9f9fb;
          --border:     rgba(0,0,0,0.08);
          --text:       #18182c;
          --muted:      #55556a;
          --shadow:     rgba(0,0,0,0.08);
          --glow:       rgba(225,29,72,0.18);
        }

        /* Base */
        .pf {
          background:var(--bg); color:var(--text);
          font-family:var(--font); min-height:100vh; overflow-x:hidden;
        }



        /* Scroll progress */
        .scroll-bar {
          position:fixed; top:0; left:0; height:3px;
          background:linear-gradient(90deg,var(--blue),var(--purple));
          z-index:9999; transition:width .12s linear;
          border-radius:0 2px 2px 0;
        }

        /* ── Floating Frosted-Glass Header Navigation Pill ────────── */
        .floating-nav-pill {
          position: fixed;
          top: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          width: min(560px, calc(100vw - 2.5rem));
          max-width: 560px;
          padding: 0.38rem 0.45rem 0.38rem 0.65rem;
          background: rgba(14, 14, 20, 0.75);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 24px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        [data-theme='light'] .floating-nav-pill {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .nav-marquee-viewport {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          position: relative;
          mask-image: linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%);
        }

        .nav-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: navMarquee 22s linear infinite;
        }
        .nav-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes navMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .nav-marquee-group {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding-right: 0.3rem;
          flex-shrink: 0;
        }

        .nav-pill-item {
          color: rgba(255, 255, 255, 0.68);
          text-decoration: none;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.38rem 0.72rem;
          border-radius: 9999px;
          transition: all 0.22s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
        }
        .nav-pill-item:hover,
        .nav-pill-item.active {
          color: #ffffff;
          background: rgba(244, 63, 94, 0.18);
        }
        [data-theme='light'] .nav-pill-item {
          color: #4b5563;
        }
        [data-theme='light'] .nav-pill-item:hover,
        [data-theme='light'] .nav-pill-item.active {
          color: #be123c;
          background: rgba(225, 29, 72, 0.1);
        }

        .nav-pill-support {
          color: #ff4d6d !important;
          background: rgba(255, 77, 109, 0.1);
          border: 1px solid rgba(255, 77, 109, 0.28);
        }
        .nav-pill-support:hover {
          color: #ffffff !important;
          background: rgba(255, 77, 109, 0.26);
          border-color: rgba(255, 77, 109, 0.6);
          box-shadow: 0 0 14px rgba(255, 77, 109, 0.35);
        }
        [data-theme='light'] .nav-pill-support {
          color: #e11d48 !important;
          background: rgba(225, 29, 72, 0.08);
          border: 1px solid rgba(225, 29, 72, 0.25);
        }
        [data-theme='light'] .nav-pill-support:hover {
          color: #be123c !important;
          background: rgba(225, 29, 72, 0.16);
          border-color: rgba(225, 29, 72, 0.45);
        }

        .nav-pill-theme {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.82rem;
          margin-left: 0.35rem;
          transition: all 0.22s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .nav-pill-theme:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          transform: rotate(20deg);
        }
        [data-theme='light'] .nav-pill-theme {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #1f2937;
        }
        [data-theme='light'] .nav-pill-theme:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        /* ── Layout ─────────────────────────────────────────────── */
        .pf-main { position:relative; z-index:4; max-width:1280px; margin:0 auto; padding:0 2rem; }
        section { padding:7rem 0; }

        /* Section header */
        .sec-hdr { margin-bottom:3.5rem; }
        .sec-hdr h2 {
          font-size:clamp(2rem,5vw,3.2rem); font-weight:400; letter-spacing:-1.5px;
          color:var(--text); margin-bottom:.4rem;
        }
        .sec-sub { color:var(--muted); font-size:1.05rem; }

        /* Reveal animation */
        .reveal {
          opacity:0;
          transform:translateY(38px) perspective(700px) rotateX(7deg);
          transition:opacity .72s var(--ease), transform .72s var(--ease);
        }
        .reveal.vis {
          opacity:1;
          transform:translateY(0) perspective(700px) rotateX(0deg);
        }

        /* ── Fullscreen Hero ────────────────────────────────────── */
        .hero-fullscreen {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000000;
          display: flex;
          align-items: flex-end;
          padding: 0;
          margin: 0;
          transform: none !important;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          background-color: #000000;
          z-index: 1;
          pointer-events: none;
          /* Explicitly NO CSS 3D transforms: rock-solid motionless */
          transform: none !important;
          perspective: none !important;
          will-change: filter;
          transition: filter 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-canvas-loading {
          filter: blur(28px) brightness(0.85);
        }

        .hero-canvas-revealed {
          filter: blur(0px) brightness(1.0);
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background: radial-gradient(circle at 75% 25%, transparent 45%, rgba(0, 0, 0, 0.45) 100%),
                      linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 30%, transparent 60%);
        }

        /* 7 Interactive Neon Physics Strings (Desktop Only - Spans Full Journey to Footer) */
        .site-neon-strings {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          z-index: 3;
          pointer-events: none;
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .site-neon-strings.strings-hidden {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        @media (max-width: 1200px) {
          .site-neon-strings {
            display: none !important;
          }
        }

        /* Hero Typography (Bottom-Left) */
        .hero-bottom-left {
          position: absolute;
          bottom: 3.8rem;
          left: 4.5rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 440px;
          pointer-events: auto;
          animation: heroFadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-hi-spaced {
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.72);
          margin-bottom: 0.15rem;
        }

        .hero-script-name {
          font-family: 'Dancing Script', cursive;
          font-size: clamp(4rem, 6.8vw, 5.8rem);
          font-weight: 700;
          line-height: 1.04;
          color: #ffffff;
          margin: 0 0 0.85rem -0.25rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.3);
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.7));
        }

        .hero-compact-bio {
          font-size: 0.92rem;
          line-height: 1.62;
          color: rgba(255, 255, 255, 0.72);
          max-width: 340px;
          margin-bottom: 1.7rem;
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
        }

        /* Two stylish white pill buttons */
        .hero-pill-btns {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          flex-wrap: wrap;
        }

        .pill-btn-solid {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.78rem 1.65rem;
          border-radius: 9999px;
          background: #ffffff;
          color: #000000;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.25s var(--ease);
          box-shadow: 0 4px 24px rgba(255, 255, 255, 0.24);
        }
        .pill-btn-solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.42);
        }
        .btn-arrow {
          font-size: 1.05rem;
          transition: transform 0.25s var(--ease);
        }
        .pill-btn-solid:hover .btn-arrow {
          transform: translateX(4px);
        }

        .pill-btn-frosted {
          display: inline-flex;
          align-items: center;
          padding: 0.78rem 1.65rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1.5px solid rgba(255, 255, 255, 0.42);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.25s var(--ease);
        }
        .pill-btn-frosted:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }



        /* Minimalist scroll cue */
        .scroll-cue-minimal {
          position: absolute;
          bottom: 1.8rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.25s ease;
        }
        .scroll-cue-minimal:hover {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .hero-bottom-left {
            left: 2rem;
            bottom: 2.5rem;
            max-width: calc(100vw - 4rem);
          }
          .hero-tracking-indicator {
            display: none;
          }
          .floating-nav-pill {
            top: 1rem;
            width: calc(100vw - 1.5rem);
            max-width: calc(100vw - 1.5rem);
            padding: 0.32rem 0.35rem 0.32rem 0.45rem;
          }
          .nav-pill-item {
            font-size: 0.66rem;
            padding: 0.32rem 0.55rem;
          }
        }

        /* Buttons */
        .btn-primary {
          display:inline-block;
          background:linear-gradient(135deg,var(--blue),var(--purple));
          color:#fff; text-decoration:none;
          padding:.82rem 2rem; border-radius:50px;
          font-weight:700; font-size:.93rem;
          transition:all .3s ease; position:relative; overflow:hidden;
        }
        .btn-primary:hover { transform:translateY(-3px); box-shadow:0 16px 32px var(--glow); filter:brightness(1.1); }

        .btn-ghost {
          display:inline-block; background:transparent; color:var(--text);
          text-decoration:none; padding:.82rem 2rem; border-radius:50px;
          font-weight:700; font-size:.93rem;
          border:2px solid var(--border); transition:all .3s;
          backdrop-filter:blur(8px);
        }
        .btn-ghost:hover { border-color:var(--blue); color:var(--blue); transform:translateY(-3px); background:rgba(244,63,94,.08); }
        .btn-lg { padding:1rem 2.6rem; font-size:1.05rem; }

        /* Scroll cue */
        .scroll-cue {
          margin-top:2.8rem; z-index:1; background:none; border:none;
          cursor:pointer; animation:cueFade 1s 1.2s both;
        }
        @keyframes cueFade {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }
        .cue-mouse {
          width:26px; height:42px;
          border:2px solid var(--muted); border-radius:13px;
          display:flex; justify-content:center; padding-top:6px;
        }
        .cue-dot {
          width:4px; height:9px; background:var(--blue); border-radius:2px;
          animation:cueBounce 2s ease-in-out infinite;
        }
        @keyframes cueBounce {
          0%,100%{transform:translateY(0);opacity:1}
          80%{transform:translateY(12px);opacity:0}
        }

        /* ── Shared card ────────────────────────────────────────── */
        .proj-card,.exp-card,.edu-card,.skill-card,.skills-overview-card {
          position:relative; z-index:5; overflow:hidden;
          background:var(--card); border:1px solid var(--border); border-radius:20px;
          will-change:transform; isolation:isolate;
          transition:border-color .3s, box-shadow .3s, background .3s;
        }
        .proj-card:hover,.exp-card:hover,.edu-card:hover,.skill-card:hover,.skills-overview-card:hover {
          background:var(--card-hover);
          border-color:rgba(244,63,94,.38);
          box-shadow:0 20px 50px var(--shadow),0 0 0 1px rgba(244,63,94,.15);
        }
        .shine {
          position:absolute; inset:0; z-index:2;
          pointer-events:none; border-radius:inherit;
          transition:background .08s;
        }

        /* Tags (Grey vibe) */
        .tags { display:flex; flex-wrap:wrap; gap:.38rem; margin-top:.8rem; }
        .tag {
          padding:.28rem .68rem; border-radius:20px;
          font-size:.76rem; font-weight:500;
          background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.72);
          border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(8px);
          transition:all .2s ease;
        }
        .tag:hover {
          background:rgba(255,255,255,0.12); color:#ffffff;
          border-color:rgba(255,255,255,0.24); transform:translateY(-1px);
        }
        [data-theme='light'] .tag {
          background:rgba(0,0,0,0.045); color:#4b5563;
          border-color:rgba(0,0,0,0.1);
        }
        [data-theme='light'] .tag:hover {
          background:rgba(0,0,0,0.09); color:#111827;
          border-color:rgba(0,0,0,0.2);
        }

        .date-chip {
          display:inline-block; padding:.28rem .72rem; border-radius:20px;
          font-size:.76rem; font-weight:600;
          background:rgba(244,63,94,.1); color:var(--blue);
          border:1px solid rgba(244,63,94,.24);
        }

        /* ── Projects ───────────────────────────────────────────── */
        .proj-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(350px,1fr));
          gap:1.4rem;
        }
        .proj-img { position:relative; height:205px; overflow:hidden; border-radius:20px 20px 0 0; }
        .proj-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
        .proj-card:hover .proj-img img { transform:scale(1.06); }
        .proj-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom,transparent 38%,var(--card) 100%);
          opacity:.72;
        }
        [data-theme='light'] .proj-overlay { display:none; }
        .badge {
          position:absolute; top:11px; right:11px;
          padding:.28rem .7rem; border-radius:20px;
          font-size:.73rem; font-weight:700; backdrop-filter:blur(12px);
        }
        .badge.live { background:rgba(244,63,94,.18); color:var(--blue); border:1px solid rgba(244,63,94,.38); box-shadow:0 0 12px rgba(244,63,94,.15); }
        .badge.dev  { background:rgba(255,165,0,.14); color:var(--orange); border:1px solid rgba(255,165,0,.3); }
        .proj-body { padding:1.4rem 1.6rem; }
        .proj-body h3 { font-size:1.2rem; font-weight:800; margin:.5rem 0 .5rem; color:var(--text); }
        .proj-body p  { font-size:.875rem; color:var(--muted); line-height:1.65; }
        .proj-link {
          display:inline-block; margin-top:.8rem;
          color:var(--blue); text-decoration:none;
          font-size:.875rem; font-weight:600; transition:color .2s;
        }
        .proj-link:hover { color:var(--purple); }

        /* ── Experience ─────────────────────────────────────────── */
        .exp-list { display:flex; flex-direction:column; gap:1.2rem; }
        .exp-card { padding:1.7rem 1.9rem 1.7rem 2.5rem; }
        .exp-accent {
          position:absolute; top:0; left:0; width:4px; height:100%;
          border-radius:20px 0 0 20px;
          background:linear-gradient(to bottom,var(--blue),var(--purple));
        }
        .exp-card h3 { font-size:1.18rem; font-weight:800; margin:.52rem 0 .22rem; color:var(--text); }
        .exp-card h4 { font-size:.87rem; font-weight:500; color:var(--blue); margin-bottom:.7rem; }
        .exp-card p  { font-size:.875rem; color:var(--muted); line-height:1.65; }

        /* ── Education ──────────────────────────────────────────── */
        .edu-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:1.4rem; }
        .edu-card { padding:2rem 2rem 2rem 2.5rem; }
        .edu-accent {
          position:absolute; top:0; left:0; width:4px; height:100%;
          border-radius:20px 0 0 20px;
          background:linear-gradient(to bottom,var(--purple),var(--teal));
        }
        .edu-card h3 { font-size:1.18rem; font-weight:800; margin:.52rem 0 .3rem; color:var(--text); }
        .edu-card h4 { font-size:.87rem; font-weight:600; color:var(--purple); margin-bottom:.7rem; }
        .edu-card p  { font-size:.875rem; color:var(--muted); line-height:1.65; }

        /* ── Skills ─────────────────────────────────────────────── */
        .skills-overview-card {
          padding: 2.2rem 2.5rem 2.2rem 2.8rem;
          margin-bottom: 2.2rem;
          backdrop-filter: blur(12px);
        }
        .skills-overview-accent {
          position: absolute; top: 0; left: 0; width: 4px; height: 100%;
          border-radius: 20px 0 0 20px;
          background: linear-gradient(to bottom, var(--blue), var(--purple));
        }
        .skills-overview-text {
          font-size: 1.05rem;
          line-height: 1.82;
          color: var(--text);
          font-weight: 400;
          letter-spacing: -0.01em;
        }
        [data-theme='light'] .skills-overview-text {
          color: #374151;
        }
        .skills-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(275px,1fr)); gap:1.4rem; }
        .skill-card { padding:2rem; }
        .skill-card h3 {
          font-size:.82rem; font-weight:800;
          color:var(--blue); margin-bottom:1.2rem;
          text-transform:uppercase; letter-spacing:.08em;
        }
        .skill-tags { display:flex; flex-wrap:wrap; gap:.45rem; }
        .stag {
          padding:.42rem .88rem; border-radius:20px;
          font-size:.8rem; font-weight:500;
          background:var(--border); color:var(--text);
          border:1px solid var(--border); transition:all .25s;
          animation:floatTag 3.8s ease-in-out infinite;
        }
        .stag:hover {
          background:linear-gradient(135deg,var(--blue),var(--purple));
          color:#fff; border-color:transparent; transform:translateY(-2px);
        }
        @keyframes floatTag {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-3px)}
        }

        /* ── Contact ────────────────────────────────────────────── */
        #contact { text-align:center; }
        .contact-wrap { padding:5rem 2rem; position:relative; }
        .contact-glow {
          position:absolute; inset:0; border-radius:24px;
          background:radial-gradient(ellipse at 50% 0%,rgba(244,63,94,.18),transparent 70%);
          pointer-events:none;
        }
        .contact-wrap h2 {
          font-size:clamp(2rem,5vw,3.5rem); font-weight:400;
          color:var(--text); margin-bottom:1rem;
        }
        .contact-wrap p { color:var(--muted); font-size:1.08rem; margin-bottom:2.2rem; }

        /* ── Footer ─────────────────────────────────────────────── */
        .pf-footer {
          position:relative; z-index:4;
          text-align:center; padding:4rem 2rem;
          border-top:1px solid var(--border); background:transparent;
        }
        .socials { position:relative; z-index:5; display:flex; justify-content:center; gap:.9rem; margin-bottom:1.4rem; }
        .social-a {
          width:48px; height:48px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          background:var(--card); border:1px solid var(--border);
          color:var(--muted); text-decoration:none; font-size:1.1rem;
          transition:all .3s;
        }
        .social-a:hover {
          background:linear-gradient(135deg,var(--blue),var(--purple));
          color:#fff; border-color:transparent;
          transform:translateY(-4px); box-shadow:0 10px 24px var(--glow);
        }
        .pf-footer p { position:relative; z-index:5; color:var(--muted); font-size:.88rem; }

        /* ── Responsive ─────────────────────────────────────────── */
        @media(max-width:1024px){
          .hdr { padding:1rem 1.75rem; }
          .pf-main { padding:0 1.5rem; }
          .proj-grid { grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }
        }

        @media(max-width:768px){
          .hdr { padding:.9rem 1.2rem; }
          .support-btn { display:none; }
          .pf-main { padding:0 1rem; }
          section { padding:5rem 0; }
          .hero { padding-top:8rem; }
          .hero-btns { flex-direction:column; align-items:center; }
          .btn-primary,.btn-ghost { width:100%; max-width:280px; text-align:center; }
          .proj-grid { grid-template-columns:1fr; }
          .edu-grid  { grid-template-columns:1fr; }
          .skills-grid { grid-template-columns:1fr; }
          .skills-overview-card { padding: 1.5rem 1.6rem 1.5rem 1.8rem; margin-bottom: 1.8rem; }
          .skills-overview-text { font-size: 0.94rem; line-height: 1.7; }
        }

        @media(max-width:480px){
          .hero-name { font-size:2.8rem; letter-spacing:-1.5px; }
          .hero-role  { font-size:1.1rem; }
          .sec-hdr h2 { font-size:1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
