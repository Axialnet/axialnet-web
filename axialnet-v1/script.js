/* ==========================================
   AXIALNET — script.js
   Custom cursor, canvas network, animations,
   scroll effects, counter animations, form
========================================== */

// ==========================================
// CUSTOM CURSOR
// ==========================================
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = 0, my = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Scale cursor on hoverable elements
  const hoverEls = document.querySelectorAll(
    'a, button, .btn, .feature-card, .testi-card, .price-card, input, textarea'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursor.style.background = 'rgba(41,121,255,0.5)';
      trail.style.transform = 'translate(-50%,-50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--accent)';
      trail.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
})();

// ==========================================
// NAV SCROLL EFFECT
// ==========================================
(function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(l => l.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }
})();

// ==========================================
// NETWORK CANVAS — HERO BACKGROUND
// ==========================================
(function initCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], mouse = { x: -999, y: -999 };
  const ACCENT = '#2979ff';
  const NODE_COUNT = 70;
  const CONNECT_DIST = 160;

  class Node {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : -10;
      this.vx = (Math.random() - .5) * .5;
      this.vy = (Math.random() - .5) * .5;
      this.r  = Math.random() * 2.5 + 1;
      this.life = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      // Bounce off edges
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        this.vx += (dx / d) * 0.5;
        this.vy += (dy / d) * 0.5;
      }
      // Clamp velocity
      const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
      if (speed > 2) { this.vx = (this.vx/speed)*2; this.vy = (this.vy/speed)*2; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = ACCENT;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, () => new Node());
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });
    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = ACCENT;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    nodes.forEach(n => { n.update(); n.draw(); });
    requestAnimationFrame(loop);
  }

  init();
})();

// ==========================================
// SCROLL REVEAL
// ==========================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

// ==========================================
// NUMBER COUNTERS — HERO METRICS
// ==========================================
(function initHeroCounters() {
  const metrics = document.querySelectorAll('.metric__val');
  let started = false;

  function countUp(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = String(target).includes('.') ? String(target).split('.')[1].length : 0;
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      el.textContent = (target * ease).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const hero = document.getElementById('hero');
  if (!hero) return;
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started) {
      started = true;
      metrics.forEach(m => countUp(m));
    }
  }, { threshold: 0.3 });
  io.observe(hero);
})();

// ==========================================
// NUMBER COUNTERS — STATS SECTION
// ==========================================
(function initStatCounters() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  function countUp(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = String(target).includes('.') ? String(target).split('.')[1].length : 0;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * ease).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const num = e.target.querySelector('.stat-card__num');
        if (num) countUp(num);
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(c => io.observe(c));
})();

// ==========================================
// MESH VIZ — FEATURE CARD
// ==========================================
(function initMeshViz() {
  const container = document.getElementById('meshViz');
  if (!container) return;

  const W = container.offsetWidth || 400;
  const H = container.offsetHeight || 100;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  container.appendChild(svg);

  const pts = [];
  for (let i = 0; i < 12; i++) {
    pts.push({ x: Math.random() * W, y: Math.random() * H });
  }

  // Draw lines
  pts.forEach((a, i) => {
    pts.forEach((b, j) => {
      if (j <= i) return;
      const d = Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
      if (d < 140) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
        line.setAttribute('stroke', 'rgba(41,121,255,0.25)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);
      }
    });
  });
  // Draw dots
  pts.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
    c.setAttribute('r', '3');
    c.setAttribute('fill', '#2979ff');
    c.setAttribute('opacity', '0.8');
    svg.appendChild(c);
  });

  // Animate one traveling packet
  const pathPts = pts.slice(0, 4);
  function animatePacket() {
    const start = pathPts[Math.floor(Math.random() * pathPts.length)];
    const end   = pathPts[Math.floor(Math.random() * pathPts.length)];
    if (start === end) { setTimeout(animatePacket, 600); return; }

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#2979ff');
    dot.setAttribute('opacity', '1');
    svg.appendChild(dot);

    let t = 0;
    function step() {
      t += 0.025;
      dot.setAttribute('cx', start.x + (end.x - start.x) * t);
      dot.setAttribute('cy', start.y + (end.y - start.y) * t);
      dot.setAttribute('opacity', 1 - t * 0.6);
      if (t < 1) requestAnimationFrame(step);
      else { svg.removeChild(dot); setTimeout(animatePacket, 400 + Math.random() * 600); }
    }
    step();
  }
  animatePacket();
})();

// ==========================================
// WORLD MAP NODE PULSES
// ==========================================
(function initWorldMap() {
  const map = document.getElementById('worldMap');
  if (!map) return;

  const positions = [
    { left: '12%', top: '40%' }, { left: '22%', top: '30%' }, { left: '35%', top: '45%' },
    { left: '48%', top: '55%' }, { left: '50%', top: '35%' }, { left: '60%', top: '42%' },
    { left: '72%', top: '38%' }, { left: '80%', top: '55%' }, { left: '88%', top: '45%' },
    { left: '5%',  top: '60%' }, { left: '55%', top: '65%' }, { left: '70%', top: '60%' },
  ];

  positions.forEach((pos, i) => {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: absolute;
      left: ${pos.left};
      top: ${pos.top};
      width: 6px;
      height: 6px;
      background: #2979ff;
      border-radius: 50%;
      z-index: 2;
      animation: nodePulse ${1.5 + Math.random()}s ease infinite ${i * 0.2}s;
    `;
    map.appendChild(dot);

    const ring = document.createElement('div');
    ring.style.cssText = `
      position: absolute;
      left: ${pos.left};
      top: ${pos.top};
      width: 16px;
      height: 16px;
      margin-left: -5px;
      margin-top: -5px;
      border: 1px solid rgba(41,121,255,0.4);
      border-radius: 50%;
      animation: nodeRing 2s ease-out infinite ${i * 0.25}s;
    `;
    map.appendChild(ring);
  });

  // Add CSS animations dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes nodePulse {
      0%, 100% { opacity: 0.9; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    @keyframes nodeRing {
      0%   { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ==========================================
// CONTACT FORM
// ==========================================
(function initForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      success.classList.add('visible');
      form.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
      setTimeout(() => success.classList.remove('visible'), 5000);
    }, 1200);
  });
})();

// ==========================================
// SMOOTH ANCHOR SCROLL
// ==========================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ==========================================
// PARALLAX — ABOUT BG TEXT
// ==========================================
(function initParallax() {
  const bgText = document.querySelector('.about__bg-text');
  if (!bgText) return;

  window.addEventListener('scroll', () => {
    const rect = bgText.closest('.about').getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    bgText.style.transform = `translate(-50%, calc(-50% + ${progress * 40}px))`;
  }, { passive: true });
})();

// ==========================================
// FEATURE CARD HOVER — GLOW EFFECT
// ==========================================
(function initCardGlow() {
  document.querySelectorAll('.feature-card, .testi-card, .price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--gx', `${x}px`);
      card.style.setProperty('--gy', `${y}px`);
      card.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(41,121,255,0.05), var(--surface) 70%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

console.log('%cAxialNet — Network Online ✓', 'color:#2979ff;font-family:monospace;font-size:14px;font-weight:bold;');
