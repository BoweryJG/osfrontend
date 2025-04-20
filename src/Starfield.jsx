import React, { useRef, useEffect } from 'react';

// Star and comet config
const STAR_LAYERS = [
  { count: 70, minR: 1.2, maxR: 2.2, speed: 0.08, color: ['#fffbe9', '#ffeedd', '#cbeaff'] }, // Foreground bright
  { count: 100, minR: 0.7, maxR: 1.4, speed: 0.04, color: ['#aee7ff', '#ffe0f0', '#fffbe9', '#ffd080'] }, // Mid
  { count: 60, minR: 0.4, maxR: 0.9, speed: 0.02, color: ['#b0cfff', '#ffeedd', '#ffd080', '#fffbe9', '#ffb0b0'] }, // Faint background
];
const TWINKLE_SPEED = 0.04;
const COMET_INTERVAL_MIN = 7000; // ms
const COMET_INTERVAL_MAX = 17000; // ms

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const makeStar = (w, h, layer) => ({
  x: Math.random() * w,
  y: Math.random() * h,
  r: randomBetween(layer.minR, layer.maxR),
  twinkle: Math.random() * Math.PI * 2,
  baseAlpha: randomBetween(0.5, 1),
  color: layer.color[Math.floor(Math.random() * layer.color.length)],
  speed: layer.speed,
});

const makeComet = (w, h) => {
  // Randomly from left or top, random angle
  const fromLeft = Math.random() > 0.5;
  const start = fromLeft
    ? { x: -80, y: randomBetween(0, h * 0.7) }
    : { x: randomBetween(0, w * 0.7), y: -80 };
  const angle = fromLeft
    ? randomBetween(Math.PI / 8, Math.PI / 3)
    : randomBetween(Math.PI / 2, Math.PI * 0.7);
  const speed = randomBetween(7, 11);
  return {
    x: start.x,
    y: start.y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    trail: [],
    life: 0,
    maxLife: randomBetween(40, 60),
  };
};

const Starfield = () => {
  const canvasRef = useRef();
  const animationRef = useRef();
  const starsRef = useRef([]);
  const cometRef = useRef(null);
  const nextCometTimeout = useRef();

  // Resize canvas to fill window
  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recreate stars on resize for all layers
    let stars = [];
    STAR_LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        stars.push(makeStar(canvas.width, canvas.height, layer));
      }
    });
    starsRef.current = stars;
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
    // eslint-disable-next-line
  }, []);

  // Comet logic
  const scheduleComet = () => {
    nextCometTimeout.current = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      cometRef.current = makeComet(canvas.width, canvas.height);
      scheduleComet();
    }, randomBetween(COMET_INTERVAL_MIN, COMET_INTERVAL_MAX));
  };

  useEffect(() => {
    scheduleComet();
    return () => clearTimeout(nextCometTimeout.current);
    // eslint-disable-next-line
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame = 0;

    function draw() {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw stars (parallax, color, depth)
      for (let star of starsRef.current) {
        // Twinkle & parallax drift
        star.twinkle += TWINKLE_SPEED * (0.5 + Math.random());
        star.x += star.speed * 0.15; // slow drift right
        if (star.x > w + 10) star.x = -10; // wrap
        const alpha = star.baseAlpha * (0.7 + 0.3 * Math.sin(star.twinkle));
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 8 + 8 * star.r;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Draw comet if present
      if (cometRef.current) {
        const comet = cometRef.current;
        // Trail
        comet.trail.unshift({ x: comet.x, y: comet.y });
        if (comet.trail.length > 45) comet.trail.pop();
        // Glowing, soft trail with color gradient
        for (let i = comet.trail.length - 1; i > 0; i--) {
          const t = i / comet.trail.length;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(comet.trail[i].x, comet.trail[i].y);
          ctx.lineTo(comet.trail[i - 1].x, comet.trail[i - 1].y);
          const grad = ctx.createLinearGradient(comet.trail[i].x, comet.trail[i].y, comet.trail[i - 1].x, comet.trail[i - 1].y);
          grad.addColorStop(0, `rgba(255,${Math.floor(180 + 60 * t)},80,${0.06 + 0.22 * t})`);
          grad.addColorStop(1, `rgba(255,${Math.floor(120 + 80 * t)},0,${0.10 + 0.33 * t})`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2 + 12 * t;
          ctx.shadowColor = `rgba(255,180,80,${0.11 + 0.22 * t})`;
          ctx.shadowBlur = 32 * t;
          ctx.stroke();
          ctx.restore();
        }
        ctx.shadowBlur = 0;
        // Head (bright, soft, no hard edge)
        ctx.save();
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 11, 0, Math.PI * 2);
        const cometHeadGrad = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 11);
        cometHeadGrad.addColorStop(0, 'rgba(255,255,200,1)');
        cometHeadGrad.addColorStop(0.5, 'rgba(255,200,80,0.8)');
        cometHeadGrad.addColorStop(1, 'rgba(255,180,80,0.12)');
        ctx.fillStyle = cometHeadGrad;
        ctx.shadowColor = '#fffbe9';
        ctx.shadowBlur = 64;
        ctx.globalAlpha = 1;
        ctx.fill();
        ctx.restore();
        // Move
        comet.x += comet.dx;
        comet.y += comet.dy;
        comet.life++;
        // Remove comet if out of bounds or expired
        if (
          comet.x < -120 || comet.x > w + 120 ||
          comet.y < -120 || comet.y > h + 120 ||
          comet.life > comet.maxLife
        ) {
          cometRef.current = null;
        }
      }
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(draw);
      frame++;
    }
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
    // eslint-disable-next-line
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 60%, #232526 0%, #181818 100%)',
        transition: 'background 1s',
      }}
      width={typeof window !== 'undefined' ? window.innerWidth : 1920}
      height={typeof window !== 'undefined' ? window.innerHeight : 1080}
      aria-hidden="true"
    />
  );
};

export default Starfield;
