import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Lottie from 'react-lottie';
import UserImage from './assets/User.jpg';
import LoadingAnimation from './assets/Loading.json';
import AnalyticsImage from './assets/Analytics.jpg';
import ScribingImage from './assets/scribing.jpg';
import BrandMapImage from './assets/BrandMapmap.jpg';
import DrOctoImage from './assets/drOcto.jpg';
import GhostBrandImage from './assets/GhostBrand.jpg';
import GigAdvanceImage from './assets/GigAdvance.jpg';
import MyWaiterImage from './assets/MyWaiter.jpg';
import NutrinationImage from './assets/Nutrination.jpg';
import PinkSyncImage from './assets/PinkSync.jpg';
import SkordImage from './assets/Skord.jpg';
import KonarkImage from './assets/WifeCode.jpg';
import FounderImage from './assets/Foundercult.jpg';
import MeghezaImage from './assets/Megheza.jpg';
import SalescatImage from './assets/Salescat.jpg';
import StarlookImage from './assets/Starlook.jpg';
import VoiceImage from './assets/Voicecopilotai.jpg';
import DecodeImage from './assets/19decode.jpg';
import FacilityImage from './assets/Facility19.jpg';
import PostgirlImage from './assets/Postgirl.jpg';

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
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
    title: 'VoiceCopilot',
    description:
      'Powering businesses with AI voice agents that answer every call, qualify leads, book appointments, and handle customer inquiries — 24/7.',
    tags: ['React', 'TypeScript', 'AWS', 'Voice Agent', 'Agentic AI'],
    link: 'https://voicecopilotai.com',
    status: 'complete',
    image: VoiceImage,
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
    link: 'https://facility19.com',
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
    link: 'https://salescat.org/',
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
    link: 'https://foundercult.com/',
    status: 'complete',
    image: FounderImage,
  },
  {
    title: 'MyWaiter',
    description:
      'QR-based restaurant automation platform enabling real-time ordering, live menu sync, staff dashboards, and ML-powered upsell suggestions. Designed to reduce service friction.',
    tags: ['React', 'Node.js', 'MongoDB', 'Restaurant Tech'],
    link: 'https://mywaiter.in',
    status: 'complete',
    image: MyWaiterImage,
  },
  {
    title: 'Skord',
    description:
      'A reasoning-based AI decision agent that evaluates multiple options, compares outcomes, and generates structured recommendations using multi-step thought processes and confidence scoring.',
    tags: ['React', 'AI', 'Decision Making', 'Python'],
    link: 'https://skord.club/',
    status: 'complete',
    image: SkordImage,
  },
  {
    title: 'drOcto',
    description:
      'Interactive AI learning environment for kids with safety guardrails, adaptive difficulty, feedback loops, and gamified reinforcement systems — designed to build critical thinking.',
    tags: ['React', 'AI', 'Development Tools', 'Automation'],
    link: 'https://drocto.in',
    status: 'complete',
    image: DrOctoImage,
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
    title: 'PinkSync',
    description:
      'Meet the locket that alerts your circle and shares your location — instantly, accurately, for 36 hours.',
    tags: ['React', 'Next.js', 'Location Services', 'Safety Tech'],
    link: 'https://pinksync.onrender.com/',
    status: 'complete',
    image: PinkSyncImage,
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
    date: 'Dec 2025 - Present',
    title: 'Co-Founder',
    company: 'VoiceCopilot AI',
    description:
      'Powering businesses with AI voice agents that answer every call, qualify leads, book appointments, and handle customer inquiries — 24/7. Built the core voice agentic infrastructure and real-time call handling pipelines.',
    tags: ['Voice AI', 'Agentic AI', 'Early Stage Ventures', 'Full Stack Development', 'Entrepreneurship'],
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
    date: 'March 2025 - Present',
    title: 'Founder',
    company: 'Drocto',
    description:
      'Pioneering a child-friendly AI ecosystem designed to enhance how kids interact with technology — intelligently, safely, and purposefully.',
    tags: ['Full Stack Development', 'Team Management', 'Strategic Planning', 'Entrepreneurship'],
  },
  {
    date: 'Aug 2024 - Present',
    title: 'Founder',
    company: 'MyWaiter',
    description:
      'Full-stack web application that allows diners to scan a QR code, view live menus, place orders, and pay — without downloading any app. Restaurant staff get real-time order notifications and ML-powered upsell suggestions.',
    tags: ['Full Stack Development', 'Team Management', 'Strategic Planning', 'Entrepreneurship'],
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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('home');
  const [scrollPct, setScrollPct] = useState(0);

  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const cursorRef = useRef(null);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  }, []);

  // Custom cursor
  useEffect(() => {
    const move = (e) => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    document.addEventListener('mousemove', move);
    return () => document.removeEventListener('mousemove', move);
  }, []);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = UserImage;
    const done = () => setIsPageLoaded(true);
    img.onload = done;
    img.onerror = done;
    const t = setTimeout(done, 5000);
    return () => clearTimeout(t);
  }, []);

  // Canvas space animation — stars + comets
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isDark = theme === 'dark';
    const isMobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = isMobile ? 120 : 280;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      baseOpacity: Math.random() * 0.55 + 0.25,
      twinkleSpeed: Math.random() * 0.018 + 0.004,
      twinklePhase: Math.random() * Math.PI * 2,
      hue: [210, 220, 260, 180][Math.floor(Math.random() * 4)],
    }));

    const comets = [];
    let frame = 0;
    let nextCometAt = 60 + Math.floor(Math.random() * 100);

    const spawnComet = () => {
      const speed = 5 + Math.random() * 5;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * (Math.PI / 4);
      comets.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.007 + Math.random() * 0.005,
        len: 80 + Math.random() * 130,
        w: 1.2 + Math.random() * 0.9,
        hue: Math.random() > 0.5 ? 210 : 260,
      });
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      stars.forEach((s) => {
        const opacity = s.baseOpacity * (0.55 + 0.45 * Math.sin(frame * s.twinkleSpeed + s.twinklePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `hsla(${s.hue},70%,88%,${opacity})`
          : `hsla(${s.hue},60%,32%,${opacity * 0.55})`;
        ctx.fill();

        if (s.r > 1.1) {
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3.5);
          g.addColorStop(0, isDark ? `hsla(${s.hue},80%,90%,${opacity * 0.35})` : `hsla(${s.hue},70%,35%,${opacity * 0.18})`);
          g.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      });

      if (frame >= nextCometAt) {
        spawnComet();
        nextCometAt = frame + 200 + Math.floor(Math.random() * 160);
      }

      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx;
        c.y += c.vy;
        c.life -= c.decay;
        if (c.life <= 0 || c.x > canvas.width + 300 || c.y > canvas.height + 300) {
          comets.splice(i, 1);
          continue;
        }
        const norm = Math.hypot(c.vx, c.vy);
        const tx = c.x - (c.vx / norm) * c.len;
        const ty = c.y - (c.vy / norm) * c.len;
        const g = ctx.createLinearGradient(c.x, c.y, tx, ty);
        g.addColorStop(0, isDark ? `hsla(${c.hue},100%,92%,${c.life})` : `hsla(${c.hue},100%,42%,${c.life * 0.75})`);
        g.addColorStop(0.4, isDark ? `hsla(${c.hue},85%,75%,${c.life * 0.5})` : `hsla(${c.hue},85%,38%,${c.life * 0.35})`);
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = g;
        ctx.lineWidth = c.w * c.life;
        ctx.lineCap = 'round';
        ctx.stroke();
        const hg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6);
        hg.addColorStop(0, isDark ? `hsla(${c.hue},100%,96%,${c.life})` : `hsla(${c.hue},100%,48%,${c.life * 0.8})`);
        hg.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [theme]);


  // Scroll progress + active section + reveal
  useEffect(() => {
    if (!isPageLoaded) return;

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(total > 0 ? (window.scrollY / total) * 100 : 0);
      const ids = ['home', 'projects', 'experience', 'education', 'skills', 'contact'];
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) { setActiveSection(ids[i]); break; }
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
    setIsNavOpen(false);
  };

  const lottieOpts = {
    loop: true, autoplay: true, animationData: LoadingAnimation,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  if (!isPageLoaded) {
    return (
      <div style={{ position:'fixed',inset:0,background:'#050508',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999 }}>
        <Lottie options={lottieOpts} height={200} width={200} />
      </div>
    );
  }

  const NAV = ['home', 'projects', 'experience', 'education', 'skills', 'contact'];

  return (
    <div data-theme={theme} className="pf">
      {/* Custom cursor */}
      <div ref={cursorRef} className="custom-cursor" />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="pf-canvas" />

      {/* Top scroll progress */}
      <div className="scroll-bar" style={{ width: `${scrollPct}%` }} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="hdr">
        <div className="hdr-logo">Portfolio</div>
        <div className="hdr-right">
          <a href="https://razorpay.me/@cassinicorp" target="_blank" rel="noopener noreferrer" className="support-btn">
            Support Me
          </a>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>
          <button className="icon-btn menu-btn" onClick={() => setIsNavOpen((o) => !o)} aria-label="Menu">
            <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
          </button>
        </div>
      </header>
      <nav className={`hdr-nav${isNavOpen ? ' open' : ''}`}>
        <ul>
          {NAV.map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={activeSection === id ? 'active' : ''} onClick={(e) => scrollTo(e, `#${id}`)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="pf-main">

        {/* ══ HERO ═════════════════════════════════════════════════════════ */}
        <section id="home" className="hero">
          <div className="hero-inner">
            <div className="avatar-wrap">
              <div className="avatar-ring" />
              <img src={UserImage} alt="Harshit" className="avatar-img" />
              <div className="avatar-glow" />
            </div>
            <div className="hero-copy">
              <p className="hero-hi">Hi there, I'm</p>
              <h1 className="hero-name">Harshit</h1>
              <div className="hero-role">
                <Typewriter texts={['Full-Stack Developer', 'AI Engineer', 'Co-Founder', 'Builder of 0→1 Products']} speed={72} />
              </div>
              <p className="hero-bio">
                Full-Stack Developer and AI Engineer with hands on experience building products end-to-end—from idea validation, MVP architecture, and scalable backend systems to real-time applications, and cloud deployments. I’ve shipped AI-powered platforms using LLMs, RAG pipelines, agentic workflows, vector search, and model fine-tuning, alongside full-stack systems across web, infra, and DevOps layers. Beyond engineering, I understand product: user acquisition, onboarding, growth loops, and continuous iteration driven by real user feedback and market signals. I thrive in 0→1 environments, solving real problems with pragmatic execution, fast iteration, and ownership from concept to scale.
              </p>
              <div className="hero-btns">
                <a href="#projects" className="btn-primary" onClick={(e) => scrollTo(e, '#projects')}>View Projects</a>
                <a href="#contact" className="btn-ghost" onClick={(e) => scrollTo(e, '#contact')}>Contact Me</a>
              </div>
            </div>
          </div>

          <button className="scroll-cue" onClick={(e) => scrollTo(e, '#projects')} aria-label="Scroll down">
            <div className="cue-mouse"><div className="cue-dot" /></div>
          </button>
        </section>

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
        <p>© 2025 Harx. All rights reserved.</p>
      </footer>

      {/* ══ STYLES ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* Reset */
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; user-select:none; cursor:none !important; }
        html { scroll-behavior:smooth; -ms-overflow-style:none; scrollbar-width:none; }
        html::-webkit-scrollbar { display:none; }
        body { overflow-x:hidden; -ms-overflow-style:none; scrollbar-width:none; }
        body::-webkit-scrollbar { display:none; }

        /* Custom cursor */
        .custom-cursor {
          position:fixed; top:0; left:0; z-index:999999;
          width:12px; height:12px; border-radius:50%;
          background:var(--blue);
          box-shadow:0 0 8px var(--blue), 0 0 16px rgba(0,112,243,0.45);
          pointer-events:none; will-change:transform;
        }

        /* Tokens */
        :root {
          --blue:   #0070f3;
          --purple: #6c5ce7;
          --teal:   #00b894;
          --orange: #ffa500;
          --ease:   cubic-bezier(0.16,1,0.3,1);
          --font:   'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        }
        [data-theme='dark'] {
          --bg:      #050508;
          --bg2:     #0c0c14;
          --card:    rgba(255,255,255,0.042);
          --border:  rgba(255,255,255,0.08);
          --text:    #ececf4;
          --muted:   #8888a0;
          --shadow:  rgba(0,0,0,0.6);
          --glow:    rgba(0,112,243,0.25);
        }
        [data-theme='light'] {
          --bg:      #f0f4f8;
          --bg2:     #e4eaf0;
          --card:    rgba(255,255,255,0.72);
          --border:  rgba(0,0,0,0.09);
          --text:    #18182c;
          --muted:   #55556a;
          --shadow:  rgba(0,0,0,0.1);
          --glow:    rgba(0,112,243,0.14);
        }

        /* Base */
        .pf {
          background:var(--bg); color:var(--text);
          font-family:var(--font); min-height:100vh; overflow-x:hidden;
        }

        /* Canvas */
        .pf-canvas {
          position:fixed; top:0; left:0;
          width:100%; height:100%;
          z-index:0; pointer-events:none; opacity:1;
        }

        /* Scroll progress */
        .scroll-bar {
          position:fixed; top:0; left:0; height:3px;
          background:linear-gradient(90deg,var(--blue),var(--purple));
          z-index:9999; transition:width .12s linear;
          border-radius:0 2px 2px 0;
        }

        /* ── Header ─────────────────────────────────────────────── */
        .hdr {
          position:fixed; top:0; left:0; right:0; z-index:1000;
          display:flex; align-items:center; justify-content:space-between;
          padding:1.1rem 3rem;
          background:rgba(5,5,8,.74);
          backdrop-filter:blur(22px) saturate(180%);
          -webkit-backdrop-filter:blur(22px) saturate(180%);
          border-bottom:1px solid var(--border);
          transition:background .3s;
        }
        [data-theme='light'] .hdr { background:rgba(240,244,248,.84); }

        .hdr-logo {
          font-weight:400; font-size:1.55rem; letter-spacing:-.5px;
          color:var(--text); cursor:default; user-select:none; pointer-events:none;
        }

        .hdr-nav {
          position:fixed; top:0; left:50%; transform:translateX(-50%);
          display:flex; align-items:center; height:64px; z-index:999;
        }
        .hdr-nav ul { display:flex; list-style:none; gap:.15rem; }
        .hdr-nav ul li a {
          display:block; padding:.48rem .9rem;
          color:var(--muted); text-decoration:none;
          font-weight:500; font-size:.88rem; border-radius:8px;
          transition:all .2s; position:relative;
        }
        .hdr-nav ul li a:hover,
        .hdr-nav ul li a.active { color:var(--text); background:var(--card); }
        .hdr-nav ul li a.active::after {
          content:''; position:absolute;
          bottom:4px; left:50%; transform:translateX(-50%);
          width:4px; height:4px; border-radius:50%;
          background:var(--blue);
        }

        .hdr-right { display:flex; align-items:center; gap:.65rem; }

        .support-btn {
          padding:.5rem 1.1rem;
          background:linear-gradient(135deg,var(--blue),var(--purple));
          color:#fff; text-decoration:none;
          font-weight:700; font-size:.82rem; border-radius:50px;
          transition:all .3s; white-space:nowrap;
        }
        .support-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px var(--glow); filter:brightness(1.1); }

        .icon-btn {
          background:var(--card); border:1px solid var(--border);
          color:var(--muted); cursor:pointer;
          width:38px; height:38px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          font-size:.95rem; transition:all .2s;
        }
        .icon-btn:hover { color:var(--text); background:var(--border); }
        .menu-btn { display:none; }

        /* ── Layout ─────────────────────────────────────────────── */
        .pf-main { position:relative; z-index:1; max-width:1280px; margin:0 auto; padding:0 2rem; }
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

        /* ── Hero ───────────────────────────────────────────────── */
        .hero {
          min-height:100vh;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          text-align:center; position:relative;
          padding-top:6rem; overflow:hidden;
        }


        /* Hero inner */
        .hero-inner {
          display:flex; flex-direction:column;
          align-items:center; gap:2.2rem;
          z-index:1; max-width:760px;
          animation:heroFade 1s var(--ease) both;
        }
        @keyframes heroFade {
          from{opacity:0;transform:translateY(28px)}
          to{opacity:1;transform:translateY(0)}
        }

        /* Avatar */
        .avatar-wrap { position:relative; width:130px; height:130px; flex-shrink:0; }
        .avatar-ring {
          position:absolute; inset:-9px; border-radius:50%;
          background:conic-gradient(var(--blue),var(--purple),var(--teal),var(--blue));
          animation:spin 4.5s linear infinite;
        }
        .avatar-ring::before {
          content:''; position:absolute; inset:4px;
          border-radius:50%; background:var(--bg);
        }
        @keyframes spin { to{transform:rotate(360deg)} }
        .avatar-img {
          position:absolute; inset:0; width:100%; height:100%;
          border-radius:50%; object-fit:cover; z-index:1;
        }
        .avatar-glow {
          position:absolute; inset:-24px; border-radius:50%;
          background:radial-gradient(circle,rgba(0,112,243,.32),transparent 70%);
          pointer-events:none; animation:glowPulse 3.5s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100%{opacity:.4;transform:scale(1)}
          50%{opacity:.85;transform:scale(1.07)}
        }

        /* Hero text */
        .hero-copy { text-align:center; }
        .hero-hi { color:var(--muted); font-size:1.05rem; margin-bottom:.4rem; letter-spacing:.04em; }
        .hero-name {
          font-size:clamp(3rem,9vw,6rem); font-weight:400;
          letter-spacing:-3px; line-height:1;
          color:var(--text); margin-bottom:1rem;
        }
        .hero-role {
          font-size:clamp(1.15rem,3vw,1.75rem); font-weight:600;
          color:var(--text); min-height:2.4rem; margin-bottom:1.5rem;
        }
        .tw-text { color:var(--text); }
        .tw-cursor {
          display:inline-block; width:2px; margin-left:2px;
          background:var(--blue); color:transparent;
          animation:blink .8s step-end infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-bio {
          color:var(--muted); font-size:.98rem; line-height:1.82;
          max-width:640px; margin:0 auto 2rem;
        }
        .hero-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }

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
        .btn-ghost:hover { border-color:var(--blue); color:var(--blue); transform:translateY(-3px); background:rgba(0,112,243,.06); }
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
        .proj-card,.exp-card,.edu-card,.skill-card {
          position:relative; overflow:hidden;
          background:var(--card); border:1px solid var(--border); border-radius:20px;
          transform-style:preserve-3d; will-change:transform;
          transition:border-color .3s, box-shadow .3s;
        }
        .proj-card:hover,.exp-card:hover,.edu-card:hover,.skill-card:hover {
          border-color:rgba(0,112,243,.35);
          box-shadow:0 20px 50px var(--shadow),0 0 0 1px rgba(0,112,243,.1);
        }
        .shine {
          position:absolute; inset:0; z-index:2;
          pointer-events:none; border-radius:inherit;
          transition:background .08s;
        }

        /* Tags */
        .tags { display:flex; flex-wrap:wrap; gap:.38rem; margin-top:.8rem; }
        .tag {
          padding:.28rem .65rem; border-radius:20px;
          font-size:.76rem; font-weight:500;
          background:rgba(0,112,243,.1); color:var(--blue);
          border:1px solid rgba(0,112,243,.18); transition:all .2s;
        }
        .tag:hover { background:var(--blue); color:#fff; border-color:transparent; }

        .date-chip {
          display:inline-block; padding:.28rem .72rem; border-radius:20px;
          font-size:.76rem; font-weight:600;
          background:rgba(0,112,243,.1); color:var(--blue);
          border:1px solid rgba(0,112,243,.22);
        }

        /* ── Projects ───────────────────────────────────────────── */
        .proj-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(350px,1fr));
          gap:1.4rem;
        }
        .proj-img { position:relative; height:205px; overflow:hidden; }
        .proj-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s; }
        .proj-card:hover .proj-img img { transform:scale(1.06); }
        .proj-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to bottom,transparent 38%,var(--bg) 100%);
          opacity:.72;
        }
        [data-theme='light'] .proj-overlay { display:none; }
        .badge {
          position:absolute; top:11px; right:11px;
          padding:.28rem .7rem; border-radius:20px;
          font-size:.73rem; font-weight:700; backdrop-filter:blur(12px);
        }
        .badge.live { background:rgba(0,184,148,.18); color:var(--teal); border:1px solid rgba(0,184,148,.3); }
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
          background:radial-gradient(ellipse at 50% 0%,rgba(0,112,243,.12),transparent 70%);
          pointer-events:none;
        }
        .contact-wrap h2 {
          font-size:clamp(2rem,5vw,3.5rem); font-weight:400;
          color:var(--text); margin-bottom:1rem;
        }
        .contact-wrap p { color:var(--muted); font-size:1.08rem; margin-bottom:2.2rem; }

        /* ── Footer ─────────────────────────────────────────────── */
        .pf-footer {
          position:relative; z-index:1;
          text-align:center; padding:4rem 2rem;
          border-top:1px solid var(--border); background:var(--bg);
        }
        .socials { display:flex; justify-content:center; gap:.9rem; margin-bottom:1.4rem; }
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
        .pf-footer p { color:var(--muted); font-size:.88rem; }

        /* ── Responsive ─────────────────────────────────────────── */
        @media(max-width:1024px){
          .hdr { padding:1rem 1.75rem; }
          .pf-main { padding:0 1.5rem; }
          .proj-grid { grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }
        }

        @media(max-width:768px){
          .hdr { padding:.9rem 1.2rem; }
          .hdr-nav {
            display:none; position:fixed;
            top:0; left:0; right:0; bottom:0;
            transform:none; height:auto;
            background:var(--bg); flex-direction:column;
            align-items:center; justify-content:center; z-index:999;
          }
          .hdr-nav.open { display:flex; }
          .hdr-nav ul { flex-direction:column; align-items:center; gap:.4rem; }
          .hdr-nav ul li a { font-size:1.35rem; padding:.75rem 2.5rem; }
          .menu-btn { display:flex; }
          .support-btn { display:none; }
          .pf-main { padding:0 1rem; }
          section { padding:5rem 0; }
          .hero { padding-top:8rem; }
          .hero-btns { flex-direction:column; align-items:center; }
          .btn-primary,.btn-ghost { width:100%; max-width:280px; text-align:center; }
          .proj-grid { grid-template-columns:1fr; }
          .edu-grid  { grid-template-columns:1fr; }
          .skills-grid { grid-template-columns:1fr; }
        }

        @media(max-width:480px){
          .hero-name { font-size:2.8rem; letter-spacing:-1.5px; }
          .hero-role  { font-size:1.1rem; }
          .avatar-wrap { width:100px; height:100px; }
          .sec-hdr h2 { font-size:1.8rem; }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;
