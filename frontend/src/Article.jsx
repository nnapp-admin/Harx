import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import NeonStrings from './NeonStrings';

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

  return (
    <div data-theme={theme} className="article-page">
      {/* 7 Interactive Neon Physics Strings in right gap */}
      <NeonStrings isVisible={true} />

      {/* ── Floating Navigation Pill ────────── */}
      <header className="article-nav-pill" aria-label="Article Navigation">
        <button
          className="article-nav-back"
          onClick={() => navigate('/')}
          aria-label="Back to Portfolio"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '6px' }} />
          <span>[PORTFOLIO]</span>
        </button>

        <div className="article-nav-badge">[ARTICLES]</div>

        <button
          className="article-pill-theme"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
        </button>
      </header>

      {/* ── Blank Article Workspace ────────── */}
      <main className="article-main">
        <div className="article-blank-container">
          {/* Kept blank for now as requested */}
        </div>
      </main>

      <style>{`
        :root {
          --bg: #09090d;
          --bg-alt: #101017;
          --border: rgba(255, 255, 255, 0.08);
          --text: #f1f5f9;
          --muted: #64748b;
          --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        [data-theme='light'] {
          --bg: #f8fafc;
          --bg-alt: #f1f5f9;
          --border: rgba(0, 0, 0, 0.08);
          --text: #0f172a;
          --muted: #64748b;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .article-page {
          background-color: var(--bg);
          color: var(--text);
          min-height: 100vh;
          font-family: var(--font);
          position: relative;
          overflow-x: hidden;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        /* ── Floating Navigation Pill ────────── */
        .article-nav-pill {
          position: fixed;
          top: 1.6rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: min(560px, calc(100vw - 2.5rem));
          max-width: 560px;
          padding: 0.38rem 0.55rem 0.38rem 0.65rem;
          background: rgba(14, 14, 20, 0.75);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5), 0 0 24px rgba(244, 63, 94, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        [data-theme='light'] .article-nav-pill {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        .article-nav-back {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.82);
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          padding: 0.38rem 0.75rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .article-nav-back:hover {
          color: #ffffff;
          background: rgba(244, 63, 94, 0.18);
        }

        [data-theme='light'] .article-nav-back {
          color: #4b5563;
        }

        [data-theme='light'] .article-nav-back:hover {
          color: #be123c;
          background: rgba(225, 29, 72, 0.1);
        }

        .article-nav-badge {
          color: rgba(244, 63, 94, 0.9);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.15em;
        }

        [data-theme='light'] .article-nav-badge {
          color: #be123c;
        }

        .article-pill-theme {
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

        .article-pill-theme:hover {
          background: rgba(244, 63, 94, 0.22);
          border-color: rgba(244, 63, 94, 0.45);
          transform: rotate(20deg) scale(1.05);
        }

        [data-theme='light'] .article-pill-theme {
          background: rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(0, 0, 0, 0.1);
          color: #0f172a;
        }

        [data-theme='light'] .article-pill-theme:hover {
          background: rgba(225, 29, 72, 0.12);
          border-color: rgba(225, 29, 72, 0.35);
          color: #be123c;
        }

        /* ── Main Canvas ────────── */
        .article-main {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6rem 2rem 2rem;
          position: relative;
          z-index: 2;
        }

        .article-blank-container {
          width: 100%;
          max-width: 900px;
          min-height: 400px;
        }
      `}</style>
    </div>
  );
};

export default Article;
