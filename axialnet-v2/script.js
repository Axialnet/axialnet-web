/* ==========================================
   AXIALNET — script.js
   Nav scroll · Reveal · Signal canvas · 
   GeoViz · Mobile nav · Form
========================================== */

// ==========================================
// NAV
// ==========================================
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mob    = document.getElementById('mobileNav');
  const close  = document.getElementById('mobileClose');
  const links  = document.querySelectorAll('.mobile-nav__link');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 32);
    }, { passive: true });
  }

  function closeMob() {
    mob.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (burger && mob) {
    burger.addEventListener('click', () => {
      mob.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (close) close.addEventListener('click', closeMob);
  links.forEach(l => l.addEventListener('click', closeMob));
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
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

// ==========================================
// SIGNAL CANVAS — hero right panel
// Simulates a geotechnical boring log / signal
// ==========================================
(function initSignalCanvas() {
  const canvas = document.getElementById('signalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width  * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize);
  resize();

  // Generate synthetic SPT boring log data columns
  const COLS = 3;
  const ROWS = 20;
  const layers = [];
  
  // Column 0: Depth (m)
  // Column 1: SPT N-value
  // Column 2: Soil classification
  const soilTypes = ['SP', 'SM', 'SC', 'ML', 'CL', 'CH', 'GW'];
  const colors    = ['#b3cde3', '#8fb5d3', '#6495b3', '#b1d4a0', '#7dbf6b', '#4da63e', '#d9b8a0'];

  for (let i = 0; i < ROWS; i++) {
    layers.push({
      depth: (i + 1) * 1.5,
      nVal: Math.floor(4 + Math.random() * 48),
      soil: soilTypes[Math.floor(Math.random() * soilTypes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  let offset = 0;
  let hovered = -1;

  function draw() {
    const W = canvas.width  / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, W, H);

    const rowH = (H - 32) / ROWS;
    const barMaxW = W * 0.38;

    // Column headers
    ctx.font = '500 9px Geist Mono, monospace';
    ctx.fillStyle = 'rgba(100,100,100,0.7)';
    ctx.letterSpacing = '0.08em';
    ctx.fillText('DEPTH (m)', 12, 14);
    ctx.fillText('N-VALUE', W * 0.28, 14);
    ctx.fillText('SOIL', W * 0.72, 14);
    ctx.letterSpacing = '0';

    // Grid line under header
    ctx.beginPath();
    ctx.moveTo(0, 20); ctx.lineTo(W, 20);
    ctx.strokeStyle = 'rgba(0,0,0,0.07)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    layers.forEach((l, i) => {
      const y = 24 + i * rowH;
      const animated_i = ((i - offset * 0.3) % ROWS + ROWS) % ROWS;
      const alpha = hovered === i ? 0.06 : (i % 2 === 0 ? 0.02 : 0);

      // Row background
      ctx.fillStyle = `rgba(0,0,0,${alpha})`;
      ctx.fillRect(0, y, W, rowH);

      // Depth label
      ctx.font = '400 9px Geist Mono, monospace';
      ctx.fillStyle = 'rgba(80,80,80,0.8)';
      ctx.fillText(l.depth.toFixed(1), 12, y + rowH * 0.65);

      // N-value bar
      const barW = (l.nVal / 60) * barMaxW;
      const bx = W * 0.26;
      const by = y + rowH * 0.22;
      const bh = rowH * 0.55;

      ctx.fillStyle = l.nVal > 30 ? 'rgba(26,86,219,0.18)' : 'rgba(26,86,219,0.1)';
      ctx.beginPath();
      ctx.roundRect(bx, by, barMaxW, bh, 2);
      ctx.fill();

      ctx.fillStyle = l.nVal > 30 ? 'rgba(26,86,219,0.65)' : 'rgba(26,86,219,0.4)';
      ctx.beginPath();
      ctx.roundRect(bx, by, barW, bh, 2);
      ctx.fill();

      // N-value text
      ctx.font = '500 9px Geist Mono, monospace';
      ctx.fillStyle = 'rgba(26,86,219,0.85)';
      ctx.fillText(l.nVal, bx + barW + 4, y + rowH * 0.65);

      // Soil type badge
      const sx = W * 0.70;
      ctx.font = '500 8.5px Geist Mono, monospace';
      ctx.fillStyle = 'rgba(50,50,50,0.6)';
      ctx.fillRect(sx, by + 1, 28, bh - 2);
      ctx.fillStyle = 'rgba(250,250,248,0.9)';
      ctx.fillText(l.soil, sx + 4, y + rowH * 0.65);

      // Row separator
      ctx.beginPath();
      ctx.moveTo(0, y + rowH); ctx.lineTo(W, y + rowH);
      ctx.strokeStyle = 'rgba(0,0,0,0.04)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Prediction highlight — blinking row
    const predRow = Math.floor(offset * 0.5) % ROWS;
    const py = 24 + predRow * rowH;
    ctx.fillStyle = 'rgba(26,86,219,0.06)';
    ctx.fillRect(0, py, W, rowH);
    ctx.strokeStyle = 'rgba(26,86,219,0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, py, W, rowH);

    // "PREDICTING..." label
    ctx.font = '500 8px Geist Mono, monospace';
    ctx.fillStyle = 'rgba(26,86,219,0.7)';
    ctx.fillText('▶ PREDICTING', W - 80, py + rowH * 0.65);

    offset += 0.04;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ==========================================
// GEO VIZ — product card soil profile
// ==========================================
(function initGeoViz() {
  const container = document.getElementById('geoViz');
  if (!container) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 400 90');
  svg.style.display = 'block';
  container.appendChild(svg);

  // Soil strata
  const strata = [
    { y: 0, h: 18, fill: '#d4c4a0', label: 'Fill / Topsoil', n: '4–8' },
    { y: 18, h: 22, fill: '#c4a87a', label: 'Silty Sand (SM)', n: '12–18' },
    { y: 40, h: 20, fill: '#a08060', label: 'Sandy Clay (SC)', n: '22–34' },
    { y: 60, h: 30, fill: '#786048', label: 'Dense Sand (SP)', n: '38–55' },
  ];

  strata.forEach(s => {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', s.y);
    rect.setAttribute('width', '80');
    rect.setAttribute('height', s.h);
    rect.setAttribute('fill', s.fill);
    svg.appendChild(rect);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '90');
    label.setAttribute('y', s.y + s.h / 2 + 4);
    label.setAttribute('fill', 'rgba(60,40,20,0.7)');
    label.setAttribute('font-size', '9');
    label.setAttribute('font-family', 'Geist Mono, monospace');
    label.textContent = s.label;
    svg.appendChild(label);

    const nval = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nval.setAttribute('x', '340');
    nval.setAttribute('y', s.y + s.h / 2 + 4);
    nval.setAttribute('fill', 'rgba(26,86,219,0.8)');
    nval.setAttribute('font-size', '9');
    nval.setAttribute('font-family', 'Geist Mono, monospace');
    nval.setAttribute('text-anchor', 'end');
    nval.textContent = 'N=' + s.n;
    svg.appendChild(nval);

    // divider line
    if (s.y > 0) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0'); line.setAttribute('y1', s.y);
      line.setAttribute('x2', '400'); line.setAttribute('y2', s.y);
      line.setAttribute('stroke', 'rgba(0,0,0,0.12)');
      line.setAttribute('stroke-width', '0.5');
      line.setAttribute('stroke-dasharray', '4,3');
      svg.appendChild(line);
    }
  });

  // N-value bars on right
  strata.forEach(s => {
    const nAvg = (parseInt(s.n) + parseInt(s.n.split('–')[1] || s.n)) / 2;
    const barW = (nAvg / 60) * 50;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '345');
    rect.setAttribute('y', s.y + 3);
    rect.setAttribute('width', barW);
    rect.setAttribute('height', s.h - 6);
    rect.setAttribute('fill', 'rgba(26,86,219,0.15)');
    rect.setAttribute('rx', '2');
    svg.appendChild(rect);
  });

})();

// ==========================================
// SMOOTH SCROLL
// ==========================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ==========================================
// CONTACT FORM
// ==========================================
(function initForm() {
  const form    = document.getElementById('contactForm');
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
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => success.classList.remove('visible'), 6000);
    }, 1000);
  });
})();

console.log('%caxialnet — ML for the physical world', 'color:#1a56db;font-family:monospace;font-size:12px;');
