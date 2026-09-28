import React, { useEffect, useRef } from 'react';

/**
 * 7 Interactive Neon Glowing Physics Strings (Curtain Simulation)
 * Built with Verlet numerical integration, distance constraint relaxation,
 * dynamic mouse repulsion, swipe momentum, scroll inertia, and multi-pass neon bloom.
 *
 * Elongates across the full website down to the footer area on widescreen
 * desktop viewports (>= 1200px) where the right-hand negative space is present.
 */
const NeonStrings = ({ isVisible = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let isRunning = false;

    // Simulation settings
    const NUM_STRINGS = 7;
    const NUM_POINTS = 32;
    const FRICTION = 0.958;
    const GRAVITY = 0.34;
    const INTERACT_RADIUS = 82;
    const CONSTRAINT_ITERATIONS = 6;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let strings = [];

    // Track mouse & swipe velocity
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      active: false,
    };

    // Track scroll velocity for kinetic curtain inertia
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const isBigScreen = () => window.innerWidth >= 1200;

    // Initialize or resize strings
    const initStrings = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Target area: right black negative space (~72% to 94% of screen width)
      const startX = width * 0.72;
      const endX = width * 0.94;
      const stepX = (endX - startX) / (NUM_STRINGS - 1);

      strings = [];
      for (let s = 0; s < NUM_STRINGS; s++) {
        const baseX = startX + s * stepX;
        // Organic curtain drape: center strings elongate to ~93.5% height (footer level)
        const drape = Math.sin((s / (NUM_STRINGS - 1)) * Math.PI) * (height * 0.035);
        const ropeHeight = height * 0.90 + drape;
        const segLen = ropeHeight / (NUM_POINTS - 1);

        const points = [];
        for (let p = 0; p < NUM_POINTS; p++) {
          const y = p * segLen;
          points.push({
            x: baseX,
            y,
            oldX: baseX,
            oldY: y,
            baseX,
            baseY: y,
            pinned: p === 0,
            index: p,
            stringIndex: s,
          });
        }
        strings.push({ points, segLen, baseX });
      }
    };

    // Mouse listeners
    const handleMouseMove = (e) => {
      if (!isBigScreen()) return;
      if (mouse.prevX === -9999) {
        mouse.prevX = e.clientX;
        mouse.prevY = e.clientY;
      }
      mouse.vx = e.clientX - mouse.prevX;
      mouse.vy = e.clientY - mouse.prevY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // Scroll listener for physical curtain inertia
    const handleScroll = () => {
      if (!isBigScreen()) return;
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollVelocity = delta;
    };

    // Main 60 FPS physics & render loop
    let lastTime = performance.now();

    const loop = (currentTime) => {
      if (!isBigScreen()) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        return;
      }

      lastTime = currentTime;

      // Dampen mouse velocity if cursor stops moving
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      // Apply scroll inertia to strings
      if (Math.abs(scrollVelocity) > 0.04) {
        for (let s = 0; s < strings.length; s++) {
          const { points } = strings[s];
          for (let p = 1; p < points.length; p++) {
            const progress = p / (points.length - 1);
            // Lift strings slightly against scroll direction
            points[p].y -= scrollVelocity * 0.055 * progress;
            // Alternating lateral breeze sway
            points[p].x += Math.sin(s * 0.85 + p * 0.15) * scrollVelocity * 0.03 * progress;
          }
        }
        scrollVelocity *= 0.88;
      }

      // ── 1. Physics update (Verlet + Interaction) ───────────
      for (let s = 0; s < strings.length; s++) {
        const { points } = strings[s];

        for (let p = 0; p < points.length; p++) {
          const pt = points[p];
          if (pt.pinned) continue;

          // Verlet velocity
          const vx = (pt.x - pt.oldX) * FRICTION;
          const vy = (pt.y - pt.oldY) * FRICTION;
          pt.oldX = pt.x;
          pt.oldY = pt.y;

          // Soft restoring spring to baseline vertical column
          const restoreX = (pt.baseX - pt.x) * 0.0075;
          const restoreY = (pt.baseY - pt.y) * 0.004;

          // Subtle organic breathing breeze so strings feel dynamic and alive
          const breeze = Math.sin(currentTime * 0.0016 + s * 0.75 + p * 0.12) * 0.35;

          pt.x += vx + restoreX + breeze;
          pt.y += vy + GRAVITY + restoreY;

          // Mouse collision / curtain push & swipe transfer
          if (mouse.active) {
            const dx = pt.x - mouse.x;
            const dy = pt.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < INTERACT_RADIUS && dist > 0) {
              const force = (INTERACT_RADIUS - dist) / INTERACT_RADIUS;
              // Repulsion away from cursor + transfer cursor swipe velocity
              const pushX = (dx / dist) * force * 11.5 + mouse.vx * 0.3 * force;
              const pushY = (dy / dist) * force * 3.2 + mouse.vy * 0.12 * force;

              pt.x += pushX;
              pt.y += pushY;
            }
          }
        }
      }

      // ── 2. Constraint relaxation (Maintain distance) ───────
      for (let iter = 0; iter < CONSTRAINT_ITERATIONS; iter++) {
        for (let s = 0; s < strings.length; s++) {
          const { points, segLen } = strings[s];
          for (let p = 0; p < points.length - 1; p++) {
            const p1 = points[p];
            const p2 = points[p + 1];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.hypot(dx, dy);
            if (dist === 0) continue;
            const diff = (dist - segLen) / dist;

            if (!p1.pinned) {
              p1.x += dx * 0.5 * diff;
              p1.y += dy * 0.5 * diff;
            }
            if (!p2.pinned) {
              p2.x -= dx * 0.5 * diff;
              p2.y -= dy * 0.5 * diff;
            }
          }
        }
      }

      // ── 3. Render strings with multi-pass neon bloom ───────
      ctx.clearRect(0, 0, width, height);

      for (let s = 0; s < strings.length; s++) {
        const { points } = strings[s];

        // Construct smooth bezier path
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length - 1; p++) {
          const xc = (points[p].x + points[p + 1].x) / 2;
          const yc = (points[p].y + points[p + 1].y) / 2;
          ctx.quadraticCurveTo(points[p].x, points[p].y, xc, yc);
        }
        const lastPt = points[points.length - 1];
        ctx.lineTo(lastPt.x, lastPt.y);

        // Pass 1: Diffuse Ambient Neon Halo
        ctx.save();
        ctx.shadowColor = '#ff2a55';
        ctx.shadowBlur = 16;
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Pass 2: High-Intensity Crimson Core
        ctx.shadowBlur = 6;
        ctx.strokeStyle = 'rgba(255, 60, 95, 0.82)';
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Pass 3: White-Hot Center Filament
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 240, 245, 0.95)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
        ctx.restore();

        // Glowing Terminal Micro-Bead at string bottom (dangling in footer area)
        ctx.save();
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ff2a55';
        ctx.shadowColor = '#ff2a55';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      if (isBigScreen()) {
        initStrings();
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(loop);
        }
      } else {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        cancelAnimationFrame(animId);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    if (isBigScreen()) {
      initStrings();
      isRunning = true;
      animId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`site-neon-strings${!isVisible ? ' strings-hidden' : ''}`}
      aria-hidden="true"
    />
  );
};

export default NeonStrings;
