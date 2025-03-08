import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faGithub, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import UserImage from './assets/User.png'; // Assuming User.png is in the same directory

const Portfolio = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    document.querySelector(sectionId).scrollIntoView({ behavior: 'smooth' });
    setIsNavOpen(false);
  };

  const ProjectCard = ({ title, description, tags, link, status }) => (
    <div className="project-card">
      <div className="project-img">{title}</div>
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
        {link && <p><a href={link} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Live Demo →</a></p>}
      </div>
    </div>
  );

  const ExperienceCard = ({ date, title, company, description, tags }) => (
    <div className="experience-card">
      <span className="date">{date}</span>
      <h3>{title}</h3>
      <h4>{company}</h4>
      <p>{description}</p>
      <div>
        {tags.map((tag, index) => <span key={index} className="tag">{tag}</span>)}
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
        {skills.map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)}
      </div>
    </div>
  );

  return (
    <div className="portfolio">
      <header>
        <div className="logo">Harshit</div>
        <nav className={isNavOpen ? 'active' : ''}>
          <ul>
            <li><a href="#home" onClick={(e) => scrollToSection(e, '#home')}>Home</a></li>
            <li><a href="#projects" onClick={(e) => scrollToSection(e, '#projects')}>Projects</a></li>
            <li><a href="#experience" onClick={(e) => scrollToSection(e, '#experience')}>Experience</a></li>
            <li><a href="#education" onClick={(e) => scrollToSection(e, '#education')}>Education</a></li>
            <li><a href="#skills" onClick={(e) => scrollToSection(e, '#skills')}>Skills</a></li>
            <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contact</a></li>
          </ul>
        </nav>
        <div className="mobile-menu" onClick={toggleNav}>
          <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
        </div>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <img src={UserImage} alt="Harx" className="user-image" />
            <h1>Hello, I'm Harx</h1>
          </div>
          <p>Full Stack Developer & Entrepreneur with expertise in content strategy, UI/UX design, and digital marketing.</p>
          <div>
            <a href="#projects" className="cta" onClick={(e) => scrollToSection(e, '#projects')}>View Projects</a>
            <a href="#contact" className="cta-secondary" onClick={(e) => scrollToSection(e, '#contact')}>Contact Me</a>
          </div>
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <div className="projects">
            <ProjectCard
              title="MyWaiter"
              description="An Indian-based technology StartUp committed to simplifying restaurant operations."
              tags={['React', 'Node.js', 'MongoDB', 'Restaurant Tech']}
              link="https://mywaiter.in"
              status="complete"
            />
            <ProjectCard
              title="Nutrination.AI"
              description="A modern health management platform leveraging AI for personalized solutions."
              tags={['React', 'AI', 'Healthcare', 'Python']}
              link="https://storied-cocada-8bfcc4.netlify.app/"
              status="in development"
            />
            <ProjectCard
              title="Brandmap"
              description="A modern tool to see trending brands, shops for clothing, food, bars, events, and celebrities on a map."
              tags={['React', 'Map API', 'Social Media', 'Trends']}
              link="https://map-o7bz.onrender.com"
              status="in development"
            />
            <ProjectCard
              title="Ghost Brand"
              description="A comprehensive branding and design project showcasing creative direction."
              tags={['UI/UX', 'Branding', 'Design System']}
              link="https://ghostbrand.onrender.com/"
              status="complete"
            />
          </div>
        </section>

        <section id="experience">
          <h2>Experience</h2>
          <div className="experience-grid">
            <ExperienceCard
              date="May 2023 - Present"
              title="Founder & CEO"
              company="Nutrination.AI"
              description="Developing a modern, all-in-one, end-to-end health management platform."
              tags={['Team Management', 'Fundraising', 'Strategic Planning', 'Entrepreneurship']}
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
              skills={['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'SQL', 'HTML/CSS', 'Git']}
            />
            <SkillCategory
              title="Data Science"
              skills={['Data Analytics', 'Machine Learning', 'Database Management', 'Data Visualization']}
            />
            <SkillCategory
              title="Design"
              skills={['Graphic Design', 'UI/UX Design', 'Visual Effects', 'Brand Development']}
            />
          </div>
        </section>

        <section id="contact">
          <h2>Get In Touch</h2>
          <p>I'm always open to discussing new projects, creative ideas, or opportunities.</p>
          <a href="mailto:contact@abhishek.dev" className="cta">Say Hello</a>
        </section>
      </main>

      <footer>
        <div className="social-links">
          <a href="#" title="LinkedIn"><FontAwesomeIcon icon={faLinkedin} /></a>
          <a href="#" title="GitHub"><FontAwesomeIcon icon={faGithub} /></a>
          <a href="#" title="Twitter"><FontAwesomeIcon icon={faTwitter} /></a>
          <a href="#" title="Instagram"><FontAwesomeIcon icon={faInstagram} /></a>
        </div>
        <p>© 2025 Harx. All rights reserved.</p>
      </footer>

      <style jsx>{`
        :root {
          --primary: #0070f3;
          --secondary: #6c5ce7;
          --bg: #0a0a0a;
          --card-bg: #111111;
          --text: #f5f5f5;
          --text-secondary: #a0a0a0;
          --accent: #00b894;
          --shadow: rgba(0, 0, 0, 0.2);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
          background-color: rgba(10, 10, 10, 0.95);
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

        h1, h2, h3 {
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
          background: linear-gradient(90deg, var(--primary), var(--secondary));
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
          background-color: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          position: relative;
          overflow: hidden;
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

        .experience-grid, .education-grid {
          display: grid;
          gap: 2rem;
        }

        .experience-card, .education-card {
          background-color: var(--card-bg);
          border-radius: 15px;
          padding: 2rem;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .experience-card:hover, .education-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px var(--shadow);
        }

        .experience-card::before, .education-card::before {
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

        .experience-card h3, .education-card h3 {
          font-size: 1.4rem;
          margin-bottom: 0.5rem;
        }

        .experience-card h4, .education-card h4 {
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

          .hero p {
            font-size: 1.2rem;
          }

          .cta, .cta-secondary {
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