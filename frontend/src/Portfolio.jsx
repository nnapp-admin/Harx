import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Lottie from 'react-lottie';
import UserImage from './assets/User.png';
import LoadingAnimation from './assets/Loading.json';
// Import individual project images
import AnalyticsImage from './assets/Analytics.jpg';
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

const Portfolio = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isUserImageLoaded, setIsUserImageLoaded] = useState(false);
  const [theme, setTheme] = useState('dark'); // Default to dark mode

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  };

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    const img = new Image();
    img.src = UserImage;
    img.onload = () => {
      setIsUserImageLoaded(true);
      setIsPageLoaded(true);
    };
    img.onerror = () => {
      setIsUserImageLoaded(true);
      setIsPageLoaded(true);
    };

    const timeout = setTimeout(() => {
      setIsPageLoaded(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const ProjectCard = ({ title, description, tags, link, status, image }) => {
    const [isProjectImageLoaded, setIsProjectImageLoaded] = useState(false);

    useEffect(() => {
      if (image) {
        const img = new Image();
        img.src = image;
        img.onload = () => setIsProjectImageLoaded(true);
        img.onerror = () => setIsProjectImageLoaded(true);
      } else {
        setIsProjectImageLoaded(true);
      }
    }, [image]);

    return (
      <div className="project-card">
        <div className="project-img">
          {isProjectImageLoaded && image ? (
            <img src={image} alt={title} className="project-image" />
          ) : (
            <div className="loading-container">
              <Lottie options={lottieOptions} height={100} width={100} />
            </div>
          )}
          {!image && isProjectImageLoaded && title}
        </div>
        <div className="project-info">
          <h3>{title}</h3>
          <p>{description}</p>
          <div className="status-section">
            <span className={`status ${status.toLowerCase()}`}>
              {status === 'complete' ? 'Complete' : 'In Development'}
            </span>
          </div>
          <div>
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          {link && (
            <p>
              <a href={link} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                Live Demo →
              </a>
            </p>
          )}
        </div>
      </div>
    );
  };

  const ExperienceCard = ({ date, title, company, description, tags }) => (
    <div className="experience-card">
      <span className="date">{date}</span>
      <h3>{title}</h3>
      <h4>{company}</h4>
      <p>{description}</p>
      <div>
        {tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );

  const EducationCard = ({ date, degree, institution, description }) => (
    <div className="education-card">
      <span className="date">{date}</span>
      <h3>{degree}</h3>
      <h4>{institution}</h4>
      {description && <p>{description}</p>}
    </div>
  );

  const SkillCategory = ({ title, skills }) => (
    <div className="skill-category">
      <h3>{title}</h3>
      <div className="skill-list">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>
  );

  if (!isPageLoaded) {
    return (
      <div className="page-loading-container">
        <Lottie options={lottieOptions} height={200} width={200} />
        <style jsx>{`
          .page-loading-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: var(--bg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="portfolio" data-theme={theme}>
      <header>
        <div className="logo">Harshit</div>
        <nav className={isNavOpen ? 'active' : ''}>
          <ul>
            <li>
              <a href="#home" onClick={(e) => scrollToSection(e, '#home')}>
                Home
              </a>
            </li>
            <li>
              <a href="#projects" onClick={(e) => scrollToSection(e, '#projects')}>
                Projects
              </a>
            </li>
            <li>
              <a href="#experience" onClick={(e) => scrollToSection(e, '#experience')}>
                Experience
              </a>
            </li>
            <li>
              <a href="#education" onClick={(e) => scrollToSection(e, '#education')}>
                Education
              </a>
            </li>
            <li>
              <a href="#skills" onClick={(e) => scrollToSection(e, '#skills')}>
                Skills
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-buttons">
          <a
            href="https://razorpay.me/@cassinicorp"
            target="_blank"
            rel="noopener noreferrer"
            className="support-button"
          >
            Support Me
          </a>
          <div className="theme-toggle" onClick={toggleTheme}>
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </div>
          <div className="mobile-menu" onClick={toggleNav}>
            <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <img src={UserImage} alt="Harx" className="user-image" />
            <h1>Hello, I'm Harx</h1>
          </div>
          <p>
           Full Stack Developer & Entrepreneur with hands-on experience across multiple stages of a tech startup lifecycle — from ideation, market research, and MVP development to UI/UX design, frontend and backend infrastructure, database management, launch execution, and digital/physical marketing strategy. Proficient in user acquisition, customer onboarding, growth hacking, and leveraging customer and market data for informed, data-driven decisions and retention strategies. Passionate about solving real-world problems with an ambitious team, using technology to build from zero to one — and beyond.
          </p>
          <div>
            <a href="#projects" className="cta" onClick={(e) => scrollToSection(e, '#projects')}>
              View Projects
            </a>
            <a href="#contact" className="cta-secondary" onClick={(e) => scrollToSection(e, '#contact')}>
              Contact Me
            </a>
          </div>
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <div className="projects">
            <ProjectCard
              title="FounderCult"
              description="All the tools, services & connections startup founders need — to build smarter, move faster & grow together."
              tags={['React', 'Next.js', 'AWS', 'Next.Js']}
              link="https://foundercult.com/"
              status="complete"
              image={FounderImage}
            />
            <ProjectCard
              title="MyWaiter"
              description="An Indian-based technology StartUp committed to simplifying restaurant operations."
              tags={['React', 'Node.js', 'MongoDB', 'Restaurant Tech']}
              link="https://mywaiter.in"
              status="complete"
              image={MyWaiterImage}
            />
            <ProjectCard
              title="Skord"
              description="An AI agent that helps users make smart choices and decisions."
              tags={['React', 'AI', 'Decision Making', 'Python']}
              link="https://skord-g2rv.onrender.com"
              status="in development"
              image={SkordImage}
            />
            <ProjectCard
              title="drOcto"
              description="drOcto is an AI-based interactive learning platform for kids to Boost critical thinking, problem-solving, and real-world skills."
              tags={['React', 'AI', 'Development Tools', 'Automation']}
              link="https://drocto.in"
              status="complete"
              image={DrOctoImage}
            />
            <ProjectCard
              title="Brandmap"
              description="A modern tool to see trending brands, shops for clothing, food, bars, events, and celebrities on a map."
              tags={['React', 'Map API', 'Social Media', 'Trends']}
              link="https://map-o7bz.onrender.com"
              status="in development"
              image={BrandMapImage}
            />
            <ProjectCard
              title="GhostBrand"
              description="An All in one solution for Personal Brands to sell anything Online"
              tags={['UI/UX', 'Branding', 'Design System']}
              link="https://ghostbrand.onrender.com/"
              status="in development"
              image={GhostBrandImage}
            />
            <ProjectCard
              title="Gig Advance"
              description="Instant Cash for Gig Workers"
              tags={['React', 'Node.js', 'Aadhar Verification', 'Loan App']}
              link="https://giga-483t.onrender.com/"
              status="in development"
              image={GigAdvanceImage}
            />
            <ProjectCard
              title="Analytics Dashboard"
              description="Refresh it again & again as the backend takes around 50 seconds to start due to free host plan. A demo project that helps administrators of a Fantasy Betting Platform's monitor user behavior, financials, and team preferences."
              tags={['React', 'Node.js', 'Machine Learning', 'Data Analytics']}
              link="https://fantasy11-3vnl.onrender.com/"
              status="complete"
              image={AnalyticsImage}
            />
            <ProjectCard
              title="PinkSync"
              description="Meet the locket that alerts your circle and shares your location — instantly, accurately, for 36 hours."
              tags={['React', 'Next.js', 'Location Services', 'Safety Tech']}
              link="https://pinksync.onrender.com/"
              status="complete"
              image={PinkSyncImage}
            />
            <ProjectCard
              title="Nutrination.AI"
              description="A modern health management platform leveraging AI for personalized solutions."
              tags={['React', 'AI', 'Healthcare', 'Python']}
              link="https://storied-cocada-8bfcc4.netlify.app/"
              status="in development"
              image={NutrinationImage}
            />
            <ProjectCard
              title="Megheza"
              description="Global Professional Network for Verified Journalists to connect collaborate and Grow"
              tags={['React', 'Next.js', 'AWS', 'Next.Js']}
              link="https://megheza.com/"
              status="complete"
              image={MeghezaImage}
            />
            <ProjectCard
              title="Konark"
              description="Konark is your free coding partner. Brainstorm ideas, generate full repos, and download your codebase to build anywhere — no limits, just code."
              tags={['React', 'Coding Assistant', 'Chatbot', 'WebApp']}
              link="https://konark.onrender.com"
              status="complete"
              image={KonarkImage}
            />
          </div>
        </section>

        <section id="experience">
          <h2>Experience</h2>
          <div className="experience-grid">
            <ExperienceCard
              date="Jan 2025 - Present"
              title="SDE"
              company="AM Megheza"
              description="Global Professional Network for Verified Journalists. Founding Engineer. I was hired for Designing, building, updating, and maintaining the Company’s website and web applications—both front-end and back-end functionality— ensuring responsiveness, interactivity, and compatibility across devices and platforms. Hosting and Server Management: Configuring and managing web hosting, server infrastructure, domain integration, and deployment environments, including implementation of security patches and SSL certifications. Technical Operations: Maintaining updated records of system logs, documenting development processes, version control repositories, and carrying out regular data backups to ensure uninterrupted operations. "
              tags={['Full Stack Development', 'AWS' , 'Team Collaboration']}
            />
            <ExperienceCard
              date="March 2025 - Present"
              title="Founder"
              company="Dcocto"
              description="Pioneering a child-friendly AI ecosystem designed to enhance how kids interact with technology—intelligently, safely, and purposefully. Our goal is to create an AI-powered platform that offers brain-positive digital experiences tailored specifically for children, combining education, engagement, and ethical tech usage."
              tags={['Full Stack Webb Development','Team Management', 'Strategic Planning', 'Entrepreneurship']}
            />
            <ExperienceCard
              date="Aug 2024 - Present"
              title="Founder"
              company="MyWaiter"
              description="A full-stack web application that allows diners to scan a table-specific QR code, view the live menu, place orders, and even pay — all without downloading any app or calling a waiter. The system allowed restaurant staff to: Receive real-time order notifications from any table Update menus instantly (out-of-stock, time-based items, etc.) Reduce wait times and optimize staff resources. Increase the Average Order Value by pushing items using ML."
              tags={['Full Stack Webb Development','Team Management', 'Strategic Planning', 'Entrepreneurship']}
            />
            <ExperienceCard
              date="Oct 2022 - May 2024"
              title="Content and Marketing Strategist"
              company="Indian Institute of Technology, Madras"
              description="Shaped connections at Alumni and Corporate Relations by curating compelling content."
              tags={['Corporate Communications', 'Content Marketing', 'Social Media Strategy', 'Crisis Management']}
            />
            <ExperienceCard
              date="Apr 2020 - Present"
              title="Freelance VFX/GFX Designer"
              company="Fiverr"
              description="Working as a freelance graphic designer and brand management designer."
              tags={['Graphic Design', 'Brand Management', 'Visual Effects', 'Copywriting']}
            />
          </div>
        </section>

        <section id="education">
          <h2>Education</h2>
          <div className="education-grid">
            <EducationCard
              date="2021 - 2025"
              degree="Bachelor of Science - BS, Data Science"
              institution="Indian Institute of Technology, Madras"
              description="Focusing on Python, Data Analytics, Machine Learning Algorithms, and Database Management."
            />
            <EducationCard
              date="Jul 2021 - Jul 2024"
              degree="Bachelor of Business Administration - BBA"
              institution="Amity University Online"
            />
          </div>
        </section>

        <section id="skills">
          <h2>Skills</h2>
          <div className="skills">
            <SkillCategory
              title="Development"
              skills={['Python', 'JavaScript', 'React', 'Node.js', 'Next.js', 'MongoDB', 'AWS', "Google Cloud", 'SQL', 'HTML/CSS', 'Git', 'OPEN AI SDK',"xAI SDK","Gemini SDK", "Kotlin & AndroidStudio(VibeCoding)"]}
            />
            <SkillCategory
              title="Data Science"
              skills={['Data Analytics', 'Machine Learning', 'Database Management', 'Data Visualization']}
            />
            <SkillCategory
              title="Design"
              skills={['Graphic Design', 'UI/UX Design', 'Visual Effects', 'Brand Development']}
            />
            <SkillCategory
              title="Content Creation"
              skills={['GFX Design', 'VFX Design', 'Content Research', 'Content Writing', 'Content Curation', 'AI Generated Videos']}
            />
          </div>
        </section>

        <section id="contact">
          <h2>Get In Touch</h2>
          <p>I'm always open to discussing new projects, creative ideas, or opportunities.</p>
          <a
            href="https://wa.link/pz0f28"
            target="_blank"
            rel="noopener noreferrer"
            className="cta"
          >
            Say Hello
          </a>
        </section>
      </main>

      <footer>
        <div className="social-links">
          <a
            href="http://linkedin.com/in/harx"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a
            href="https://www.instagram.com/the_cassini_huygens?igsh=enVoazF3ZHRpYTQ4"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://wa.link/pz0f28"
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} />
          </a>
        </div>
        <p>© 2025 Harx. All rights reserved.</p>
      </footer>

      <style jsx>{`
        :root {
          --primary: #0070f3;
          --secondary: #6c5ce7;
          --accent: #00b894;
          --shadow: rgba(0, 0, 0, 0.2);
        }

        [data-theme='dark'] {
          --bg: #0a0a0a;
          --card-bg: #111111;
          --text: #f5f5f5;
          --text-secondary: #a0a0a0;
        }

        [data-theme='light'] {
          --bg: #ffffff;
          --card-bg: #f5f5f5;
          --text: #333333;
          --text-secondary: #666666;
          --shadow: rgba(0, 0, 0, 0.1);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
            Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .portfolio {
          background-color: var(--bg);
          color: var(--text);
          line-height: 1.6;
          overflow-x: hidden;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 3rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: var(--bg);
          backdrop-filter: blur(10px);
          z-index: 1000;
          box-shadow: 0 2px 10px var(--shadow);
        }

        .logo {
          font-weight: 700;
          font-size: 1.8rem;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        nav ul {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        nav ul li a {
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          position: relative;
        }

        nav ul li a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          background: var(--primary);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        nav ul li a:hover::after {
          width: 100%;
        }

        nav ul li a:hover {
          color: var(--primary);
        }

        .mobile-menu {
          display: none;
          cursor: pointer;
          font-size: 1.8rem;
          color: var(--text);
        }

        .theme-toggle {
          cursor: pointer;
          font-size: 1.5rem;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          color: var(--primary);
          transform: scale(1.1);
        }

        .header-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .support-button {
          display: inline-block;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .support-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px var(--shadow);
          filter: brightness(1.1);
        }

        main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          padding-top: 6rem;
        }

        section {
          margin-bottom: 6rem;
          padding: 2rem 0;
        }

        h1,
        h2,
        h3 {
          font-weight: 700;
          line-height: 1.2;
        }

        h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        h2 {
          font-size: 2.5rem;
          margin-bottom: 2.5rem;
          position: relative;
        }

        h2::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, travis: var(--primary), var(--secondary));
          bottom: -15px;
          left: 0;
          border-radius: 2px;
        }

        p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .hero {
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .hero-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .user-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary);
          box-shadow: 0 0 10px rgba(0, 112, 243, 0.3);
        }

        .loading-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--card-bg);
        }

        .hero p {
          font-size: 1.5rem;
          max-width: 800px;
          margin-bottom: 2.5rem;
        }

        .cta {
          display: inline-block;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-right: 1rem;
        }

        .cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px var(--shadow);
          filter: brightness(1.1);
        }

        .cta-secondary {
          display: inline-block;
          background: transparent;
          color: var(--primary);
          padding: 1rem 2.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          border: 2px solid var(--primary);
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          background: var(--primary);
          color: white;
          border-color: transparent;
          transform: translateY(-3px);
        }

        .projects {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .project-card {
          background-color: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .project-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px var(--shadow);
        }

        .project-img {
          width: 100%;
          height: 200px;
          background-color: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          position: relative;
          overflow: hidden;
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .project-img::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
        }

        .project-info {
          padding: 2rem;
        }

        .project-info h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--text);
        }

        .status-section {
          margin: 1rem 0;
        }

        .status {
          display: inline-block;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .status.complete {
          background-color: rgba(0, 184, 148, 0.1);
          color: var(--accent);
        }

        .status.in-development {
          background-color: rgba(255, 165, 0, 0.1);
          color: #ffa500;
        }

        .tag {
          display: inline-block;
          background-color: rgba(0, 112, 243, 0.1);
          color: var(--primary);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .tag:hover {
          background-color: var(--primary);
          color: white;
        }

        .experience-grid,
        .education-grid {
          display: grid;
          gap: 2rem;
        }

        .experience-card,
        .education-card {
          background-color: var(--card-bg);
          border-radius: 15px;
          padding: 2rem;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .experience-card:hover,
        .education-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px var(--shadow);
        }

        .experience-card::before,
        .education-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary), var(--secondary));
        }

        .education-card::before {
          background: linear-gradient(to bottom, var(--secondary), var(--accent));
        }

        .experience-card h3,
        .education-card h3 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }

        .experience-card h4,
        .education-card h4 {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .date {
          display: inline-block;
          background-color: rgba(0, 112, 243, 0.1);
          color: var(--primary);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        .skills {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .skill-category {
          background-color: var(--card-bg);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .skill-category:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px var(--shadow);
        }

        .skill-category h3 {
          font-size: 1.4rem;
          margin-bottom: 1.5rem;
          color: var(--primary);
        }

        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .skill-tag {
          background-color: rgba(0, 112, 243, 0.1);
          color: var(--text);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .skill-tag:hover {
          background-color: var(--primary);
          color: white;
        }

        footer {
          text-align: center;
          padding: 4rem 1.5rem;
          background-color: var(--card-bg);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--bg);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .social-links a:hover {
          background: linear-gradient(45deg, var(--primary), var(--secondary));
          transform: translateY(-5px);
          box-shadow: 0 5px 15px var(--shadow);
        }

        @media (max-width: 768px) {
          header {
            padding: 1rem 1.5rem;
          }

          nav {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: var(--card-bg);
            padding-top: 5rem;
          }

          nav.active {
            display: block;
          }

          nav ul {
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }

          nav ul li a {
            font-size: 1.2rem;
          }

          .mobile-menu {
            display: block;
          }

          .header-buttons {
            gap: 0.5rem;
          }

          .support-button {
            padding: 0.6rem 1.2rem;
            font-size: 0.8rem;
          }

          .theme-toggle {
            margin-right: 0;
            font-size: 1.3rem;
          }

          h1 {
            font-size: 2.5rem;
          }

          h2 {
            font-size: 2rem;
          }

          .hero {
            min-height: auto;
            padding: 4rem 0;
          }

          .hero-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .user-image {
            width: 80px;
            height: 80px;
          }

          .loading-container {
            width: 80px;
            height: 80px;
          }

          .hero p {
            font-size: 1.2rem;
          }

          .cta,
          .cta-secondary {
            padding: 0.8rem 2rem;
          }

          .projects {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;