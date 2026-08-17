import React, { useEffect, useRef } from 'react';

export default function MagicalLibraryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth Mouse tracking for interactive parallax
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // =========================================================================
    // 📚 LOAD REALISTIC PHOTOREALISTIC BOOK TEXTURES
    // =========================================================================
    const bookSrcs = [
      '/assets/books/book_burgundy.png',
      '/assets/books/book_open.png',
      '/assets/books/book_sapphire.png',
    ];

    const bookImages = bookSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Color auras corresponding to the realistic books
    const bookAuras = [
      { glow: 'rgba(255, 0, 85, 0.35)', trim: '#FFD700' },   // Burgundy & Gold
      { glow: 'rgba(255, 215, 0, 0.4)', trim: '#00F0FF' },   // Open Grimoire
      { glow: 'rgba(0, 240, 255, 0.35)', trim: '#9D4EDD' },  // Sapphire & Celestial Gold
    ];

    // =========================================================================
    // 🌟 PARTICLES & FLOATING ENTITIES
    // =========================================================================

    // 1. FAIRY DUST PARTICLES (Soft celestial embers)
    const NUM_PARTICLES = 45;
    const particles = [];
    const particleColors = [
      'rgba(255, 215, 0, ',   // Gold
      'rgba(0, 240, 255, ',   // Cyan
      'rgba(157, 78, 221, ',  // Purple
      'rgba(255, 0, 85, ',    // Crimson
      'rgba(255, 255, 255, ', // White
    ];

    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        colorPrefix: particleColors[i % particleColors.length],
        alphaPhase: Math.random() * Math.PI * 2,
        alphaSpeed: Math.random() * 0.025 + 0.008,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.45 - 0.1,
        swaySpeed: Math.random() * 0.02 + 0.01,
      });
    }

    // 2. 15 REALISTIC FLOATING VINTAGE BOOKS
    const NUM_BOOKS = 15;
    const books = [];
    for (let i = 0; i < NUM_BOOKS; i++) {
      const typeIdx = i % bookImages.length;
      const depth = Math.random(); // 0 (distant/small/soft) to 1 (near/crisp)
      books.push({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: depth,
        scale: depth * 0.25 + 0.32, // Elegant proportions
        typeIdx: typeIdx,
        aura: bookAuras[typeIdx],
        angle: (Math.random() - 0.5) * 0.25,
        rotationSpeed: (Math.random() - 0.5) * 0.0015,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.22 - 0.06, // Graceful slow upward drift
        bobPhase: Math.random() * Math.PI * 2,
        bobSpeed: Math.random() * 0.012 + 0.006,
        bobAmplitude: Math.random() * 10 + 6,
        sparkleTimer: Math.floor(Math.random() * 60),
      });
    }

    // 3. GLOWING CELESTIAL RUNES
    const runes = [];
    const runeSymbols = ['✦', '✧', '★', 'λ', '∞', '∫', 'α', 'Ω', '⚡', '📖', '📜', '⚜'];

    const spawnRune = (x, y, color) => {
      if (runes.length > 20) return;
      runes.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - 10,
        symbol: runeSymbols[Math.floor(Math.random() * runeSymbols.length)],
        color: color || '#FFD700',
        vy: -Math.random() * 0.5 - 0.2,
        vx: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 6 + 10,
        life: 1,
      });
    };

    let frameCount = 0;

    // =========================================================================
    // 🚀 60 FPS RENDER LOOP
    // =========================================================================
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse parallax
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      const mouseParallaxX = (mouse.x - width / 2) * 0.02;
      const mouseParallaxY = (mouse.y - height / 2) * 0.02;

      // --- LAYER 1: AMBIENT CELESTIAL FAIRY DUST ---
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const p = particles[i];
        p.y += p.vy;
        p.x += p.vx + Math.sin(frameCount * p.swaySpeed) * 0.25;
        p.alphaPhase += p.alphaSpeed;
        const alpha = 0.3 + Math.sin(p.alphaPhase) * 0.22;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x + mouseParallaxX * 0.25, p.y + mouseParallaxY * 0.25, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${Math.max(0, Math.min(1, alpha))})`;
        ctx.fill();
      }

      // --- LAYER 2: REALISTIC FLOATING VINTAGE BOOKS ---
      for (let i = 0; i < NUM_BOOKS; i++) {
        const b = books[i];
        const img = bookImages[b.typeIdx];

        b.y += b.vy;
        b.x += b.vx;
        b.angle += b.rotationSpeed;
        b.bobPhase += b.bobSpeed;

        const currentY = b.y + Math.sin(b.bobPhase) * b.bobAmplitude + mouseParallaxY * (b.depth + 0.15);
        const currentX = b.x + mouseParallaxX * (b.depth + 0.15);

        // Wrap around screen smoothly
        if (b.y < -120) {
          b.y = height + 90;
          b.x = Math.random() * width;
        }
        if (b.x < -120) b.x = width + 90;
        if (b.x > width + 120) b.x = -90;

        // Occasional floating rune
        b.sparkleTimer++;
        if (b.sparkleTimer > 85 && Math.random() > 0.6) {
          spawnRune(currentX, currentY, b.aura.trim);
          b.sparkleTimer = 0;
        }

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(b.angle + Math.sin(b.bobPhase * 0.8) * 0.05);
        ctx.scale(b.scale, b.scale);
        ctx.globalAlpha = 0.55 + b.depth * 0.45; // Depth atmospheric translucency

        // Ambient Magical Halo behind the realistic book
        const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 95);
        auraGrad.addColorStop(0, b.aura.glow);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 95, 0, Math.PI * 2);
        ctx.fill();

        if (img.complete && img.naturalWidth > 0) {
          // Render realistic book texture
          const iw = 180;
          const ih = 180;
          ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        } else {
          // Fallback while loading
          ctx.fillStyle = '#0F2C59';
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-30, -40, 60, 80, 4);
          ctx.fill();
          ctx.stroke();
        }

        ctx.restore();
      }

      // --- LAYER 3: FLOATING CELESTIAL RUNES ---
      for (let i = runes.length - 1; i >= 0; i--) {
        const r = runes[i];
        r.y += r.vy;
        r.x += r.vx;
        r.life -= 0.012;

        if (r.life <= 0) {
          runes.splice(i, 1);
          continue;
        }

        ctx.font = `${r.size}px serif`;
        ctx.fillStyle = r.color;
        ctx.globalAlpha = r.life * 0.85;
        ctx.fillText(r.symbol, r.x, r.y);
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.95,
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
}
