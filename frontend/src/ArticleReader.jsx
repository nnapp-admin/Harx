import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faArrowLeft, faListUl, faTimes, faShareNodes, faCheck } from '@fortawesome/free-solid-svg-icons';
import NeonStrings from './NeonStrings';
import { ARTICLES } from './data/articlesData';
import TheSyntheticCrowd, { SECTIONS_TOC as SYNTHETIC_CROWD_TOC } from './articles/TheSyntheticCrowd';
import TheChatbotEraIsEnding, { SECTIONS_TOC as CHATBOT_ERA_TOC } from './articles/TheChatbotEraIsEnding';

const ArticleReader = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('opening');
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollBarRef = useRef(null);
  const article = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];
  const currentSlug = article.slug;
  const currentToc = currentSlug === 'the-chatbot-era-is-ending' ? CHATBOT_ERA_TOC : SYNTHETIC_CROWD_TOC;

  // Scroll to top and reset active TOC section when article changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveSection(currentToc[0]?.id || 'opening');
  }, [slug, currentToc]);

  // Theme synchronization
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  // Scroll progress & active TOC section tracking (optimized via requestAnimationFrame)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
          if (scrollBarRef.current) {
            scrollBarRef.current.style.width = `${pct}%`;
          }

          // Check active section
          for (let i = currentToc.length - 1; i >= 0; i--) {
            const el = document.getElementById(currentToc[i].id);
            if (el && el.getBoundingClientRect().top <= 140) {
              setActiveSection(currentToc[i].id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentToc]);

  // Jump to section with smooth scroll
  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top, behavior: 'smooth' });
      setActiveSection(id);
      setIsTocOpen(false);
    }
  };

  // Share link handler
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div data-theme={theme} className="reader-page">
      {/* ── Reading Progress Bar ──────────────────────────────── */}
      <div ref={scrollBarRef} className="reader-progress-bar" style={{ width: '0%' }} />

      {/* ── Atmospheric 7 Neon Physics Strings (Right Gap) ────── */}
      <NeonStrings isVisible={true} />

      {/* ── Floating Header Navigation Pill ───────────────────── */}
      <header className="reader-nav-pill" aria-label="Article Reader Navigation">
        <button
          className="reader-nav-back"
          onClick={() => navigate('/article')}
          aria-label="Back to Articles"
          title="Back to All Articles"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px' }} />
          <span>[ARTICLES]</span>
        </button>

        <div className="reader-nav-title" title={article.title}>
          <span>{article.title}</span>
        </div>

        <div className="reader-nav-actions">
          {/* Mobile TOC Toggle Button */}
          <button
            className="reader-icon-btn reader-toc-btn-mobile"
            onClick={() => setIsTocOpen(!isTocOpen)}
            aria-label="Table of Contents"
            title="Table of Contents"
          >
            <FontAwesomeIcon icon={isTocOpen ? faTimes : faListUl} />
          </button>

          {/* Share Button */}
          <button
            className="reader-icon-btn"
            onClick={handleShare}
            aria-label="Share article link"
            title="Copy Article Link"
          >
            <FontAwesomeIcon icon={copied ? faCheck : faShareNodes} />
          </button>

          {/* Theme Toggle Button */}
          <button
            className="reader-icon-btn reader-pill-theme"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle Light/Dark Theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </button>
        </div>
      </header>

      {/* ── Main Layout: Sidebar TOC + Reading Column ─────────── */}
      <div className="reader-layout-container">
        {/* Sticky Desktop Table of Contents */}
        <aside className="reader-sidebar-toc" aria-label="Table of Contents">
          <div className="toc-inner-card">
            <div className="toc-header">
              <span className="toc-title">CONTENTS</span>
              <span className="toc-count">{currentToc.length} SECTIONS</span>
            </div>
            <nav className="toc-list">
              {currentToc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`toc-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                >
                  <span className="toc-bullet" />
                  <span className="toc-text">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile / Tablet Drawer TOC Modal */}
        {isTocOpen && (
          <div className="reader-mobile-toc-overlay" onClick={() => setIsTocOpen(false)}>
            <div className="reader-mobile-toc-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-toc-header">
                <h3>Table of Contents</h3>
                <button
                  className="mobile-toc-close"
                  onClick={() => setIsTocOpen(false)}
                  aria-label="Close"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <nav className="mobile-toc-list">
                {currentToc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`mobile-toc-link ${activeSection === item.id ? 'active' : ''}`}
                    onClick={(e) => scrollToSection(e, item.id)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Editorial Text Column */}
        <main className="reader-content-column">
          {currentSlug === 'the-chatbot-era-is-ending' ? (
            <TheChatbotEraIsEnding />
          ) : (
            <TheSyntheticCrowd />
          )}

          {/* Reader Footer Navigation */}
          <footer className="reader-footer-nav">
            <button className="reader-footer-btn" onClick={() => navigate('/article')}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
              Back to All Articles
            </button>
            <button
              className="reader-footer-btn reader-footer-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top ↑
            </button>
          </footer>
        </main>
      </div>

      {/* ── Global Editorial Stylesheet ───────────────────────── */}
      <style>{`
        :root {
          --bg: #09090d;
          --bg-alt: #101017;
          --card: #13131c;
          --card-glass: rgba(19, 19, 28, 0.88);
          --border: rgba(255, 255, 255, 0.08);
          --border-bright: rgba(255, 255, 255, 0.16);
          --text: #f1f5f9;
          --text-secondary: #94a3b8;
          --muted: #64748b;
          --rose: #f43f5e;
          --rose-dim: rgba(244, 63, 94, 0.12);
          --purple: #a855f7;
          --blue: #38bdf8;
          --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        [data-theme='light'] {
          --bg: #f8fafc;
          --bg-alt: #f1f5f9;
          --card: #ffffff;
          --card-glass: rgba(255, 255, 255, 0.94);
          --border: rgba(0, 0, 0, 0.08);
          --border-bright: rgba(0, 0, 0, 0.15);
          --text: #0f172a;
          --text-secondary: #475569;
          --muted: #64748b;
          --rose: #e11d48;
          --rose-dim: rgba(225, 29, 72, 0.08);
          --purple: #9333ea;
          --blue: #0284c7;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .reader-page {
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: var(--font);
          position: relative;
          overflow-x: clip;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* ── Reading Progress Bar ──────────────────────────────── */
        .reader-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3.5px;
          background: linear-gradient(90deg, var(--rose), var(--purple), var(--blue));
          z-index: 99999;
          transition: width 0.08s linear;
          box-shadow: 0 0 10px rgba(244, 63, 94, 0.6);
        }

        /* ── Floating Header Navigation Pill ───────────────────── */
        .reader-nav-pill {
          position: fixed;
          top: 1.4rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(840px, calc(100vw - 2.5rem));
          padding: 0.38rem 0.55rem 0.38rem 0.65rem;
          background: rgba(14, 14, 20, 0.82);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 24px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: all 0.3s ease;
        }

        [data-theme='light'] .reader-nav-pill {
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .reader-nav-back {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.82);
          font-family: inherit;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.38rem 0.72rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.22s ease;
          flex-shrink: 0;
        }

        .reader-nav-back:hover {
          color: #ffffff;
          background: rgba(244, 63, 94, 0.18);
        }

        [data-theme='light'] .reader-nav-back {
          color: #4b5563;
        }

        [data-theme='light'] .reader-nav-back:hover {
          color: #be123c;
          background: rgba(225, 29, 72, 0.1);
        }

        .reader-nav-title {
          flex: 1;
          min-width: 0;
          padding: 0 1rem;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reader-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }

        .reader-icon-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .reader-icon-btn:hover {
          background: rgba(244, 63, 94, 0.22);
          border-color: rgba(244, 63, 94, 0.45);
          color: #ffffff;
          box-shadow: 0 0 12px rgba(244, 63, 94, 0.3);
          transform: scale(1.06);
        }

        .reader-pill-theme:hover {
          transform: rotate(20deg) scale(1.06);
        }

        [data-theme='light'] .reader-icon-btn {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #1f2937;
        }

        [data-theme='light'] .reader-icon-btn:hover {
          background: rgba(225, 29, 72, 0.12);
          border-color: rgba(225, 29, 72, 0.35);
          color: #be123c;
          box-shadow: 0 0 12px rgba(225, 29, 72, 0.2);
        }

        .reader-toc-btn-mobile {
          display: none;
        }

        /* ── Main Layout: Sidebar TOC + Reading Column ─────────── */
        .reader-layout-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 5.4rem 1.8rem 4rem;
          display: flex;
          gap: 3.5rem;
          position: relative;
          z-index: 4;
        }

        /* ── Sticky Desktop TOC Sidebar ────────────────────────── */
        .reader-sidebar-toc {
          width: 280px;
          flex-shrink: 0;
          position: sticky;
          top: 6.5rem;
          align-self: flex-start;
          height: fit-content;
          display: block;
        }

        .toc-inner-card {
          position: sticky;
          top: 6.5rem;
          max-height: calc(100vh - 8rem);
          overflow-y: auto;
          padding: 1.4rem 1.1rem;
          background: var(--card-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          scrollbar-width: thin;
          scrollbar-color: rgba(244, 63, 94, 0.4) transparent;
        }

        .toc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.9rem;
          margin-bottom: 0.9rem;
          border-bottom: 1px solid var(--border);
        }

        .toc-title {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--rose);
        }

        .toc-count {
          font-size: 0.68rem;
          font-weight: 600;
          color: var(--muted);
          letter-spacing: 0.08em;
        }

        .toc-list {
          display: flex;
          flex-direction: column;
          gap: 0.28rem;
        }

        .toc-link {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.45rem 0.55rem;
          text-decoration: none;
          color: var(--muted);
          font-size: 0.76rem;
          line-height: 1.4;
          border-radius: 8px;
          transition: all 0.18s ease;
        }

        .toc-bullet {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--muted);
          margin-top: 5px;
          flex-shrink: 0;
          transition: all 0.18s ease;
        }

        .toc-link:hover {
          color: var(--text);
          background: var(--rose-dim);
        }

        .toc-link:hover .toc-bullet {
          background: var(--rose);
          transform: scale(1.4);
        }

        .toc-link.active {
          color: #ffffff;
          background: rgba(244, 63, 94, 0.18);
          font-weight: 600;
        }

        [data-theme='light'] .toc-link.active {
          color: #be123c;
          background: rgba(225, 29, 72, 0.1);
        }

        .toc-link.active .toc-bullet {
          background: var(--rose);
          transform: scale(1.6);
          box-shadow: 0 0 8px var(--rose);
        }

        /* ── Reading Text Column ───────────────────────────────── */
        .reader-content-column {
          flex: 1;
          min-width: 0;
          max-width: 760px;
        }

        .article-body {
          background: var(--card-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 3.5rem 3.8rem;
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
        }

        [data-theme='light'] .article-body {
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.05);
        }

        /* ── Header Area ───────────────────────────────────────── */
        .article-header {
          padding-bottom: 2.8rem;
          margin-bottom: 3.2rem;
          border-bottom: 1px solid var(--border);
        }

        .article-meta-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }

        .article-category-badge {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.28rem 0.75rem;
          border-radius: 9999px;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        [data-theme='light'] .article-category-badge {
          background: rgba(0, 0, 0, 0.045);
          color: #4b5563;
          border-color: rgba(0, 0, 0, 0.1);
        }

        .article-read-badge, .article-date-badge {
          color: var(--muted);
          font-size: 0.78rem;
          font-weight: 500;
        }

        .article-main-title {
          font-size: clamp(2rem, 3.8vw, 2.75rem);
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 1.1rem;
        }

        .article-main-subtitle {
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          font-weight: 400;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1.8rem;
        }

        .article-lead-notice {
          background: rgba(244, 63, 94, 0.06);
          border-left: 3px solid var(--rose);
          padding: 1.1rem 1.4rem;
          border-radius: 0 10px 10px 0;
          font-size: 0.94rem;
          line-height: 1.68;
          color: var(--text-secondary);
        }

        /* ── Section & Paragraphs ──────────────────────────────── */
        .article-section {
          padding: 3rem 0;
          border-bottom: 1px solid var(--border);
        }

        .article-section:last-child {
          border-bottom: none;
        }

        .section-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          padding: 0.28rem 0.7rem;
          border-radius: 6px;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
        }

        .badge-scenario {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .badge-history {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .badge-definition {
          background: rgba(168, 85, 247, 0.12);
          color: #a855f7;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .badge-capabilities {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .badge-analysis {
          background: rgba(244, 63, 94, 0.12);
          color: var(--rose);
          border: 1px solid rgba(244, 63, 94, 0.3);
        }

        .badge-threat-model {
          background: rgba(239, 68, 68, 0.14);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        }

        .badge-concept {
          background: rgba(139, 92, 246, 0.12);
          color: #8b5cf6;
          border: 1px solid rgba(139, 92, 246, 0.3);
        }

        .badge-defensive {
          background: rgba(14, 165, 233, 0.12);
          color: #0ea5e9;
          border: 1px solid rgba(14, 165, 233, 0.3);
        }

        .badge-normative {
          background: rgba(217, 70, 239, 0.12);
          color: #d946ef;
          border: 1px solid rgba(217, 70, 239, 0.3);
        }

        .badge-regulatory {
          background: rgba(249, 115, 22, 0.12);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.3);
        }

        .badge-framework {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .badge-epistemic {
          background: rgba(99, 102, 241, 0.12);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .badge-checklist {
          background: rgba(20, 184, 166, 0.12);
          color: #14b8a6;
          border: 1px solid rgba(20, 184, 166, 0.3);
        }

        .badge-conclusion {
          background: rgba(244, 63, 94, 0.16);
          color: var(--rose);
          border: 1px solid var(--rose);
        }

        .badge-sources {
          background: rgba(148, 163, 184, 0.12);
          color: var(--text-secondary);
          border: 1px solid var(--border);
        }

        .article-section h2 {
          font-size: clamp(1.4rem, 2.4vw, 1.85rem);
          font-weight: 700;
          color: var(--text);
          line-height: 1.35;
          letter-spacing: -0.02em;
          margin-bottom: 1.4rem;
        }

        .article-section p {
          font-size: 1.05rem;
          line-height: 1.82;
          color: var(--text-secondary);
          margin-bottom: 1.4rem;
        }

        .article-section p strong {
          color: var(--text);
        }

        .article-emphasis-lead {
          font-size: 1.25rem !important;
          color: var(--text) !important;
          line-height: 1.65 !important;
          padding: 1rem 0;
        }

        /* ── Callout Quote Box ─────────────────────────────────── */
        .article-callout, .article-quote-box {
          margin: 2.2rem 0;
          padding: 1.5rem 1.8rem;
          background: rgba(244, 63, 94, 0.05);
          border-left: 3.5px solid var(--rose);
          border-radius: 0 14px 14px 0;
          box-shadow: 0 8px 24px rgba(244, 63, 94, 0.08);
        }

        .callout-heading {
          font-size: 0.72rem !important;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--rose) !important;
          text-transform: uppercase;
          margin-bottom: 0.5rem !important;
        }

        .article-callout p, .article-quote-box p {
          font-size: 1.15rem;
          line-height: 1.72;
          color: var(--text);
          margin-bottom: 0;
        }

        /* ── Stat Highlight Card ───────────────────────────────── */
        .stat-highlight-card {
          margin: 2.2rem 0;
          padding: 1.8rem 2rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .stat-number {
          font-size: clamp(2.4rem, 4.5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, var(--rose), var(--purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--text-secondary);
        }

        /* ── Lists ─────────────────────────────────────────────── */
        .article-numbered-list, .article-bullet-list {
          margin: 1.6rem 0 2rem 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .article-numbered-list li, .article-bullet-list li {
          font-size: 1.02rem;
          line-height: 1.75;
          color: var(--text-secondary);
          padding-left: 0.4rem;
        }

        .article-numbered-list li strong, .article-bullet-list li strong {
          color: var(--text);
        }

        /* ── Workflow Diagram ──────────────────────────────────── */
        .workflow-diagram-card {
          background: var(--bg-alt);
          border: 1px solid var(--border);
          padding: 1.1rem 1.4rem;
          border-radius: 12px;
          margin: 1.4rem 0 1.8rem;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 0.92rem;
          color: var(--text);
          text-align: center;
          overflow-x: auto;
        }

        .agent-flow {
          border-color: rgba(244, 63, 94, 0.4);
          background: rgba(244, 63, 94, 0.05);
          color: var(--rose);
        }

        /* ── Tables ────────────────────────────────────────────── */
        .table-responsive-wrapper {
          width: 100%;
          overflow-x: auto;
          margin: 2.2rem 0;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: var(--card);
        }

        .article-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.92rem;
          text-align: left;
        }

        .article-table th {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text);
          font-weight: 700;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--border-bright);
          letter-spacing: 0.03em;
        }

        [data-theme='light'] .article-table th {
          background: rgba(0, 0, 0, 0.03);
        }

        .article-table td {
          padding: 0.95rem 1.2rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-secondary);
          line-height: 1.55;
        }

        .article-table tbody tr:last-child td {
          border-bottom: none;
        }

        .article-table tbody tr:hover {
          background: rgba(244, 63, 94, 0.04);
        }

        .complex-table th, .complex-table td {
          padding: 0.85rem 1rem;
          font-size: 0.88rem;
        }

        .highlight-row {
          background: rgba(244, 63, 94, 0.08) !important;
        }

        .highlight-row td {
          color: var(--text) !important;
          font-weight: 600;
        }

        /* ── Notice Card ───────────────────────────────────────── */
        .article-notice-card {
          margin: 2.2rem 0;
          padding: 1.5rem 1.8rem;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .article-notice-card h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--rose);
          letter-spacing: 0.06em;
          margin-bottom: 0.6rem;
        }

        .article-notice-card p {
          margin-bottom: 0;
          font-size: 0.95rem;
        }

        /* ── Loop Card ─────────────────────────────────────────── */
        .article-loop-card {
          margin: 2.2rem 0;
          padding: 1.6rem 2rem;
          background: rgba(244, 63, 94, 0.06);
          border: 1px dashed rgba(244, 63, 94, 0.4);
          border-radius: 14px;
        }

        .loop-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--rose);
          letter-spacing: 0.14em;
          margin-bottom: 0.7rem;
        }

        .loop-flow {
          font-size: 1.05rem !important;
          font-weight: 600;
          color: var(--text) !important;
          line-height: 1.65;
          margin-bottom: 0 !important;
        }

        .inline-tag {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--rose);
          letter-spacing: 0.08em;
          display: inline-block;
          margin-left: 0.35rem;
        }

        /* ── Ethical Cards ─────────────────────────────────────── */
        .ethical-question-card {
          margin: 1.6rem 0;
          padding: 1.4rem 1.8rem;
          background: var(--bg-alt);
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .ethical-question-card h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.7rem;
        }

        .ethical-question-card p {
          margin-bottom: 0;
          font-size: 0.96rem;
        }

        /* ── Legal Cards ───────────────────────────────────────── */
        .legal-jurisdiction-card {
          margin: 1.6rem 0;
          padding: 1.5rem 1.8rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
        }

        .legal-jurisdiction-card h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--rose);
          margin-bottom: 0.6rem;
        }

        .legal-jurisdiction-card p {
          margin-bottom: 0;
          font-size: 0.96rem;
        }

        /* ── Scenario Card ─────────────────────────────────────── */
        .scenario-narrative-card {
          background: var(--bg-alt);
          border-left: 3px solid var(--rose);
          border-radius: 0 16px 16px 0;
          padding: 1.8rem 2.2rem;
          margin: 2rem 0;
        }

        .scenario-accent-line {
          font-size: 1.15rem !important;
          color: var(--rose) !important;
          font-weight: 600;
          margin: 1.2rem 0 !important;
        }

        .article-caveat-note {
          font-size: 0.88rem !important;
          color: var(--muted) !important;
          line-height: 1.6 !important;
          margin-top: 1.2rem;
        }

        /* ── Indicators Grid ───────────────────────────────────── */
        .indicators-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.2rem;
          margin: 2rem 0;
        }

        .indicator-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.2rem 1.4rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          transition: all 0.22s ease;
        }

        .indicator-item:hover {
          border-color: rgba(244, 63, 94, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .indicator-num {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--rose);
          background: var(--rose-dim);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .indicator-content strong {
          display: block;
          font-size: 0.96rem;
          color: var(--text);
          margin-bottom: 0.35rem;
        }

        .indicator-content p {
          font-size: 0.88rem !important;
          line-height: 1.55 !important;
          margin-bottom: 0 !important;
          color: var(--text-secondary) !important;
        }

        /* ── Checklist ─────────────────────────────────────────── */
        .checklist-container {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin: 2rem 0;
        }

        .checklist-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.1rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 1.1rem;
          transition: all 0.2s ease;
        }

        .checklist-card:hover {
          border-color: rgba(244, 63, 94, 0.35);
          background: rgba(244, 63, 94, 0.03);
        }

        .check-box {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--rose);
          background: var(--rose-dim);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .checklist-card p {
          margin-bottom: 0 !important;
          font-size: 0.98rem !important;
          line-height: 1.6 !important;
        }

        .checklist-footer-note {
          font-size: 0.94rem !important;
          color: var(--muted) !important;
          font-style: italic;
          margin-top: 1.2rem;
        }

        /* ── Final Callout ─────────────────────────────────────── */
        .article-final-callout {
          margin: 2.8rem 0;
          padding: 2.2rem 2.4rem;
          background: linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(168, 85, 247, 0.08));
          border: 1px solid rgba(244, 63, 94, 0.3);
          border-radius: 20px;
          box-shadow: 0 12px 35px rgba(244, 63, 94, 0.15);
          text-align: center;
        }

        .final-question-label {
          font-size: 0.74rem !important;
          font-weight: 800;
          letter-spacing: 0.18em;
          color: var(--rose) !important;
          text-transform: uppercase;
          margin-bottom: 0.8rem !important;
        }

        .final-question-text {
          font-size: clamp(1.4rem, 2.8vw, 2.1rem) !important;
          font-weight: 700;
          color: var(--text) !important;
          line-height: 1.35;
          margin-bottom: 0 !important;
        }

        /* ── Sources Section ───────────────────────────────────── */
        .sources-section {
          padding-top: 2rem;
        }

        .source-category-group {
          margin: 2rem 0;
        }

        .source-category-group h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.9rem;
          letter-spacing: -0.01em;
        }

        .source-links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .source-links-list li {
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .source-links-list a {
          color: var(--text-secondary);
          text-decoration: none;
          border-bottom: 1px dotted var(--border-bright);
          transition: all 0.2s ease;
          display: inline;
        }

        .source-links-list a:hover {
          color: var(--rose);
          border-bottom-color: var(--rose);
        }

        /* ── Reader Footer Nav ─────────────────────────────────── */
        .reader-footer-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }

        .reader-footer-btn {
          background: var(--card-glass);
          border: 1px solid var(--border);
          color: var(--text);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 0.65rem 1.3rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .reader-footer-btn:hover {
          background: var(--rose-dim);
          border-color: rgba(244, 63, 94, 0.4);
          color: var(--rose);
          transform: translateY(-1px);
        }

        /* ── Mobile TOC Drawer Modal ───────────────────────────── */
        .reader-mobile-toc-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          justify-content: flex-end;
          animation: overlayFadeIn 0.25s ease;
        }

        .reader-mobile-toc-drawer {
          width: min(340px, 85vw);
          height: 100%;
          background: var(--card);
          border-left: 1px solid var(--border);
          padding: 1.8rem 1.4rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: -10px 0 35px rgba(0, 0, 0, 0.5);
          animation: drawerSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .mobile-toc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.1rem;
          margin-bottom: 1.1rem;
          border-bottom: 1px solid var(--border);
        }

        .mobile-toc-header h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--rose);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mobile-toc-close {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          font-size: 1.1rem;
          cursor: pointer;
        }

        .mobile-toc-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mobile-toc-link {
          padding: 0.6rem 0.8rem;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 0.86rem;
          border-radius: 8px;
          line-height: 1.4;
          transition: all 0.18s ease;
        }

        .mobile-toc-link:hover, .mobile-toc-link.active {
          color: #ffffff;
          background: var(--rose-dim);
          font-weight: 600;
        }

        /* ── Responsive Breakpoints ────────────────────────────── */
        @media (max-width: 1200px) {
          .reader-sidebar-toc {
            display: none;
          }
          .reader-toc-btn-mobile {
            display: flex;
          }
          .reader-layout-container {
            justify-content: center;
            padding: 6.2rem 1.4rem 3.5rem;
          }
          .reader-content-column {
            max-width: 820px;
          }
        }

        @media (max-width: 768px) {
          .article-body {
            padding: 2.4rem 1.8rem;
            border-radius: 18px;
          }
          .article-header {
            padding-bottom: 2rem;
            margin-bottom: 2.2rem;
          }
          .article-section {
            padding: 2.2rem 0;
          }
          .article-section h2 {
            font-size: 1.4rem;
          }
          .article-section p {
            font-size: 0.98rem;
            line-height: 1.76;
          }
          .stat-highlight-card {
            padding: 1.4rem 1.4rem;
          }
          .indicators-grid {
            grid-template-columns: 1fr;
          }
          .reader-nav-title {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .article-body {
            padding: 1.8rem 1.2rem;
          }
          .article-main-title {
            font-size: 1.65rem;
          }
          .article-callout, .article-quote-box {
            padding: 1.2rem 1.2rem;
          }
          .scenario-narrative-card {
            padding: 1.4rem 1.4rem;
          }
          .reader-footer-nav {
            flex-direction: column;
            gap: 0.8rem;
          }
          .reader-footer-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ArticleReader;
