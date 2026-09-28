import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faArrowLeft, faArrowRight, faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import NeonStrings from './NeonStrings';
import { ARTICLES } from './data/articlesData';

const Article = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  // 3D Tilt handlers matching Portfolio cards
  const onCardEnter = useCallback((e) => {
    e.currentTarget.style.transition = 'transform 0.08s ease, box-shadow 0.3s ease';
  }, []);
  const onCardMove = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - 0.5) * -12;
    const ry = ((x / r.width) - 0.5) * 12;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px)`;
  }, []);
  const onCardLeave = useCallback((e) => {
    const el = e.currentTarget;
    el.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  return (
    <div data-theme={theme} className="articles-directory-page">
      {/* ── 7 Atmospheric Neon Strings Animation ── */}
      <NeonStrings isVisible={true} />

      {/* ── Floating Header Navigation Pill ── */}
      <header className="dir-nav-pill" aria-label="Directory Navigation">
        <button
          className="dir-nav-back"
          onClick={() => navigate('/')}
          aria-label="Back to Portfolio"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px' }} />
          <span>[PORTFOLIO]</span>
        </button>

        <div className="dir-nav-badge">[ARTICLES]</div>

        <button
          className="dir-pill-theme"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </header>

      {/* ── Main Catalog Content ── */}
      <main className="dir-main-container">
        {/* Section Intro */}
        <div className="dir-header-text">
          <h1 className="dir-heading">Writings & Investigations</h1>
          <p className="dir-subheading">
            Deep-dive analytical research on AI security, agentic systems, corporate information environments, and emerging attack surfaces.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {ARTICLES.map((art) => (
            <article
              key={art.id}
              className="article-card"
              onMouseEnter={onCardEnter}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              onClick={() => navigate(`/article/${art.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/article/${art.slug}`)}
              aria-label={`Read ${art.title}`}
            >
              <div className="card-top-meta">
                <span className="card-category-pill">{art.category}</span>
                <div className="card-time-date">
                  <span>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '4px' }} />
                    {art.readTime}
                  </span>
                  <span>·</span>
                  <span>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
                    {art.date}
                  </span>
                </div>
              </div>

              <h2 className="card-title">{art.fullTitle || art.title}</h2>
              <p className="card-subtitle">{art.subtitle}</p>

              <p className="card-excerpt">{art.excerpt}</p>

              <div className="card-tags-list">
                {art.tags.map((t, idx) => (
                  <span key={idx} className="card-tag-pill">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="card-footer-action">
                <span className="card-action-text">Read Full Investigation</span>
                <span className="card-action-arrow">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* ── Directory Stylesheet ── */}
      <style>{`
        :root {
          --bg: #09090d;
          --bg-alt: #101017;
          --card: #13131c;
          --card-glass: rgba(19, 19, 28, 0.82);
          --border: rgba(255, 255, 255, 0.08);
          --border-bright: rgba(255, 255, 255, 0.16);
          --text: #f1f5f9;
          --text-secondary: #94a3b8;
          --muted: #64748b;
          --rose: #f43f5e;
          --rose-dim: rgba(244, 63, 94, 0.12);
          --purple: #a855f7;
          --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        [data-theme='light'] {
          --bg: #f8fafc;
          --bg-alt: #f1f5f9;
          --card: #ffffff;
          --card-glass: rgba(255, 255, 255, 0.88);
          --border: rgba(0, 0, 0, 0.08);
          --border-bright: rgba(0, 0, 0, 0.15);
          --text: #0f172a;
          --text-secondary: #475569;
          --muted: #64748b;
          --rose: #e11d48;
          --rose-dim: rgba(225, 29, 72, 0.08);
          --purple: #9333ea;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .articles-directory-page {
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: var(--font);
          position: relative;
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* ── Floating Header Navigation Pill ── */
        .dir-nav-pill {
          position: fixed;
          top: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(560px, calc(100vw - 2.5rem));
          padding: 0.38rem 0.55rem 0.38rem 0.65rem;
          background: rgba(14, 14, 20, 0.78);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 24px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        [data-theme='light'] .dir-nav-pill {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .dir-nav-back {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.82);
          font-family: inherit;
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.38rem 0.75rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .dir-nav-back:hover {
          color: #ffffff;
          background: rgba(244, 63, 94, 0.18);
        }

        [data-theme='light'] .dir-nav-back {
          color: #4b5563;
        }

        [data-theme='light'] .dir-nav-back:hover {
          color: #be123c;
          background: rgba(225, 29, 72, 0.1);
        }

        .dir-nav-badge {
          color: var(--rose);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        .dir-pill-theme {
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
          cursor: pointer;
          transition: all 0.22s ease;
          flex-shrink: 0;
        }

        .dir-pill-theme:hover {
          background: rgba(244, 63, 94, 0.22);
          border-color: rgba(244, 63, 94, 0.45);
          transform: rotate(20deg) scale(1.06);
        }

        [data-theme='light'] .dir-pill-theme {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #0f172a;
        }

        [data-theme='light'] .dir-pill-theme:hover {
          background: rgba(225, 29, 72, 0.12);
          border-color: rgba(225, 29, 72, 0.35);
          color: #be123c;
        }

        /* ── Main Directory Container ── */
        .dir-main-container {
          max-width: 980px;
          margin: 0 auto;
          padding: 5.4rem 1.8rem 4rem;
          position: relative;
          z-index: 4;
        }

        .dir-header-text {
          margin-bottom: 2rem;
        }

        .dir-heading {
          font-size: clamp(2.4rem, 4.8vw, 3.4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--text);
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .dir-subheading {
          font-size: 1.12rem;
          line-height: 1.68;
          color: var(--text-secondary);
          max-width: 680px;
        }

        /* ── Article Cards Grid ── */
        .articles-grid {
          display: flex;
          flex-direction: column;
          gap: 2.2rem;
        }

        .article-card {
          background: var(--card-glass);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2.6rem 2.8rem;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          transform-style: preserve-3d;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .article-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, var(--rose), var(--purple));
          opacity: 0.8;
          transition: opacity 0.3s ease, width 0.3s ease;
        }

        .article-card:hover {
          border-color: rgba(244, 63, 94, 0.45);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.5), 0 0 30px rgba(244, 63, 94, 0.15);
        }

        .article-card:hover::before {
          width: 6px;
          opacity: 1;
        }

        [data-theme='light'] .article-card {
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.06);
        }

        [data-theme='light'] .article-card:hover {
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12), 0 0 25px rgba(225, 29, 72, 0.12);
        }

        .card-top-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 1.4rem;
        }

        .card-category-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.28rem 0.75rem;
          border-radius: 9999px;
          text-transform: uppercase;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        [data-theme='light'] .card-category-pill {
          background: rgba(0, 0, 0, 0.045);
          color: #4b5563;
          border-color: rgba(0, 0, 0, 0.1);
        }

        .card-time-date {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.82rem;
          color: var(--muted);
          font-weight: 500;
        }

        .card-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 0.65rem;
          transition: color 0.2s ease;
        }

        .article-card:hover .card-title {
          color: var(--rose);
        }

        .card-subtitle {
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1.2rem;
        }

        .card-excerpt {
          font-size: 0.96rem;
          line-height: 1.72;
          color: var(--text-secondary);
          margin-bottom: 1.8rem;
        }

        .card-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.8rem;
        }

        .card-tag-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.72);
          font-size: 0.76rem;
          font-weight: 500;
          padding: 0.28rem 0.68rem;
          border-radius: 20px;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .card-tag-pill:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.24);
          transform: translateY(-1px);
        }

        [data-theme='light'] .card-tag-pill {
          background: rgba(0, 0, 0, 0.045);
          color: #4b5563;
          border-color: rgba(0, 0, 0, 0.1);
        }

        [data-theme='light'] .card-tag-pill:hover {
          background: rgba(0, 0, 0, 0.09);
          color: #111827;
          border-color: rgba(0, 0, 0, 0.2);
        }

        .card-footer-action {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--rose);
          font-size: 0.88rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .card-action-arrow {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .article-card:hover .card-action-arrow {
          transform: translateX(6px);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dir-main-container {
            padding: 7rem 1.4rem 4rem;
          }
          .article-card {
            padding: 2rem 1.6rem;
            border-radius: 16px;
          }
          .card-title {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Article;
