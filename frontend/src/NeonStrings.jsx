import React, { useEffect, useRef } from 'react';

/**
 * 7 Interactive Neon Glowing Physics Strings (Curtain Simulation)
 * Built with Verlet numerical integration, distance constraint relaxation,
 * dynamic mouse repulsion, and multi-pass neon bloom.
 *
 * - Only hover effect causes disruption (no movement during scroll).
 * - After movement, strings gracefully oscillate and slowly come to a
 *   complete, motionless rest (damped harmonic physics reset).
 * - Spans desktop screens (>= 1200px) down through the footer area.
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
    // Friction: 0.964 provides natural, gradual pendulum damping ("slowly slowly")
    const FRICTION = 0.964;
    const GRAVITY = 0.35;
    const INTERACT_RADIUS = 85;
    const CONSTRAINT_ITERATIONS = 6;
    const RESTORE_STIFFNESS_X = 0.012;
    const RESTORE_STIFFNESS_Y = 0.005;

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

    // Mouse listeners (only hover effect causes disruption)
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

    // Main 60 FPS physics & render loop
    const loop = () => {
      if (!isBigScreen()) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        return;
      }

      // Dampen mouse velocity if cursor stops moving
      mouse.vx *= 0.85;
      mouse.vy *= 0.85;

      // ── 1. Physics update (Verlet + Damped Harmonic Restitution) ──
      for (let s = 0; s < strings.length; s++) {
        const { points } = strings[s];

        for (let p = 0; p < points.length; p++) {
          const pt = points[p];
          if (pt.pinned) continue;

          // Verlet velocity with physical friction damping
          const vx = (pt.x - pt.oldX) * FRICTION;
          const vy = (pt.y - pt.oldY) * FRICTION;
          pt.oldX = pt.x;
          pt.oldY = pt.y;

          // Restoring force to baseline hanging vertical column
          const restoreX = (pt.baseX - pt.x) * RESTORE_STIFFNESS_X;
          const restoreY = (pt.baseY - pt.y) * RESTORE_STIFFNESS_Y;

          pt.x += vx + restoreX;
          pt.y += vy + GRAVITY + restoreY;

          // Hover interaction: cursor deflection + swipe velocity transfer
          if (mouse.active) {
            const dx = pt.x - mouse.x;
            const dy = pt.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < INTERACT_RADIUS && dist > 0) {
              const force = (INTERACT_RADIUS - dist) / INTERACT_RADIUS;
              const pushX = (dx / dist) * force * 11 + mouse.vx * 0.28 * force;
              const pushY = (dy / dist) * force * 3 + mouse.vy * 0.1 * force;

              pt.x += pushX;
              pt.y += pushY;
            }
          }

          // Slow, smooth natural reset: when momentum has gradually dissipated,
          // settle seamlessly back to exact baseline rest
          const dxFromBase = Math.abs(pt.x - pt.baseX);
          const dyFromBase = Math.abs(pt.y - pt.baseY);
          const speedSq = (pt.x - pt.oldX) ** 2 + (pt.y - pt.oldY) ** 2;

          if (dxFromBase < 0.18 && dyFromBase < 0.18 && speedSq < 0.035) {
            pt.x = pt.baseX;
            pt.y = pt.baseY;
            pt.oldX = pt.baseX;
            pt.oldY = pt.baseY;
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
    window.addEventListener('resize', handleResize);

    if (isBigScreen()) {
      initStrings();
      isRunning = true;
      animId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
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
