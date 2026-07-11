/* ==========================================
   AXIALNET V2 — script.js
========================================== */

// ==========================================
// HEADER SCROLL
// ==========================================
(function () {
  const h = document.getElementById('siteHeader');
  if (!h) return;
  window.addEventListener('scroll', () => {
    h.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

// ==========================================
// MOBILE NAV
// ==========================================
(function () {
  const burger  = document.getElementById('burger');
  const mob     = document.getElementById('mobNav');
  const close   = document.getElementById('mobClose');
  const links   = mob ? mob.querySelectorAll('a') : [];

  function open()  { mob.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function shut()  { mob.classList.remove('open'); document.body.style.overflow = ''; }

  if (burger) burger.addEventListener('click', open);
  if (close)  close.addEventListener('click', shut);
  links.forEach(l => l.addEventListener('click', shut));
})();

// ==========================================
// SCROLL REVEAL
// ==========================================
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
})();

// ==========================================
// BORING LOG CANVAS — hero panel
// Shows a live-updating SPT boring log table
// ==========================================
(function () {
  const canvas = document.getElementById('boringCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DPR = window.devicePixelRatio || 1;
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width  * DPR;
    canvas.height = 310 * DPR;
    canvas.style.width  = rect.width + 'px';
    canvas.style.height = '310px';
    ctx.scale(DPR, DPR);
  }
  resize();
  window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });

  // Deterministic layer data
  const soilCodes = ['SP','SM','SC','ML','CL','CH','GP','GM','SW'];
  const soilColors = {
    SP:'#d4b483', SM:'#c8a870', SC:'#b89660', ML:'#a8c4a0',
    CL:'#8fba7a', CH:'#6aaa55', GP:'#e0c89a', GM:'#cdb87a', SW:'#d8c090'
  };
  const rows = Array.from({length:16}, (_,i) => ({
    depth: ((i+1)*1.5).toFixed(1),
    nVal: [5,8,11,14,18,22,26,31,28,35,40,38,44,50,50,50][i],
    soil: soilCodes[i % soilCodes.length],
    blows: `${3+Math.floor(i*0.7)}/${4+Math.floor(i*0.8)}/${5+Math.floor(i*0.9)}`
  }));

  let tick = 0;
  let activeRow = 0;

  function draw() {
    const W = canvas.width / DPR;
    const H = canvas.height / DPR;
    ctx.clearRect(0, 0, W, H);

    const COLS = [
      { label: 'DEPTH', x: 10,  w: 52 },
      { label: 'BLOWS',  x: 68,  w: 70 },
      { label: 'N',      x: 144, w: 32 },
      { label: 'SOIL',   x: 182, w: 32 },
      { label: '',       x: 222, w: W-232 }  // bar
    ];
    const ROW_H = 17;
    const Y0 = 26;

    // Header bg
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    ctx.fillRect(0, 0, W, Y0);

    // Header labels
    ctx.font = `500 8px IBM Plex Mono, monospace`;
    ctx.fillStyle = 'rgba(80,80,78,0.7)';
    COLS.forEach(c => {
      if (c.label) ctx.fillText(c.label, c.x, 16);
    });

    // Col dividers
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    [68, 144, 182, 222].forEach(x => {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    });

    // Header underline
    ctx.beginPath(); ctx.moveTo(0, Y0); ctx.lineTo(W, Y0);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5; ctx.stroke();

    rows.forEach((r, i) => {
      const y = Y0 + i * ROW_H;

      // Active row highlight
      if (i === activeRow) {
        ctx.fillStyle = 'rgba(28,78,216,0.05)';
        ctx.fillRect(0, y, W, ROW_H);
        ctx.strokeStyle = 'rgba(28,78,216,0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(0, y, W, ROW_H);
      } else if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.012)';
        ctx.fillRect(0, y, W, ROW_H);
      }

      const ty = y + ROW_H * 0.72;
      ctx.font = `400 8px IBM Plex Mono, monospace`;

      // Depth
      ctx.fillStyle = 'rgba(80,80,78,0.65)';
      ctx.fillText(r.depth, COLS[0].x, ty);

      // Blows
      ctx.fillStyle = 'rgba(60,60,58,0.6)';
      ctx.fillText(r.blows, COLS[1].x, ty);

      // N value
      const nColor = r.nVal >= 50 ? '#b91c1c' : r.nVal >= 30 ? '#1c4ed8' : 'rgba(30,30,28,0.8)';
      ctx.fillStyle = nColor;
      ctx.font = `500 8.5px IBM Plex Mono, monospace`;
      ctx.fillText(r.nVal >= 50 ? '50R' : r.nVal, COLS[2].x, ty);

      // Soil badge
      const sc = soilColors[r.soil] || '#c8b08a';
      ctx.fillStyle = sc;
      ctx.fillRect(COLS[3].x, y+3, 26, ROW_H-6);
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.font = `500 7px IBM Plex Mono, monospace`;
      ctx.fillText(r.soil, COLS[3].x+3, ty);

      // N-value bar
      const barX = COLS[4].x;
      const barMaxW = W - barX - 10;
      const barW = Math.min((r.nVal / 60), 1) * barMaxW;
      const barY = y + 5; const barH = ROW_H - 10;

      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath(); ctx.roundRect(barX, barY, barMaxW, barH, 1); ctx.fill();

      const barAlpha = i === activeRow ? 0.7 : 0.3;
      ctx.fillStyle = r.nVal >= 30 ? `rgba(28,78,216,${barAlpha})` : `rgba(28,78,216,${barAlpha*0.7})`;
      ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 1); ctx.fill();

      // Row separator
      if (i < rows.length - 1) {
        ctx.beginPath(); ctx.moveTo(0, y+ROW_H); ctx.lineTo(W, y+ROW_H);
        ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth=0.5; ctx.stroke();
      }
    });

    // Prediction cursor label on active row
    const ay = Y0 + activeRow * ROW_H;
    ctx.font = `500 7px IBM Plex Mono, monospace`;
    ctx.fillStyle = 'rgba(28,78,216,0.6)';
    ctx.fillText('◀ PREDICTING', W - 70, ay + ROW_H * 0.72);

    tick++;
    if (tick % 80 === 0) {
      activeRow = (activeRow + 1) % rows.length;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// STRATA CHART — SVG soil profile
// ==========================================
(function () {
  const el = document.getElementById('strataChart');
  if (!el) return;

  const strata = [
    { label: 'Made Ground / Fill',    h: 14, color: '#e0d4b4', nRange: [3,8]  },
    { label: 'Loose Silty Sand (SM)', h: 16, color: '#d4bc8a', nRange: [8,14] },
    { label: 'Med. Dense Sand (SP)',  h: 18, color: '#c8a870', nRange: [16,24]},
    { label: 'Stiff Sandy Clay (SC)', h: 20, color: '#b09060', nRange: [24,35]},
    { label: 'Dense Gravel (GP)',     h: 20, color: '#9a7848', nRange: [35,50]},
    { label: 'Dense Sand (SP)',       h: 22, color: '#7a5c38', nRange: [45,55]},
  ];

  const W = 340, H = 260;
  const SOIL_W = 72, PAD = 12;
  const BAR_X = SOIL_W + 80, BAR_MAX = W - BAR_X - PAD;
  const totalH = strata.reduce((a,s) => a+s.h*4, 0);
  const scale = (H - 30) / totalH;

  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('width','100%');
  svg.setAttribute('height','100%');
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.style.display = 'block';
  el.appendChild(svg);

  // Headers
  const mkText = (x,y,txt,opts={}) => {
    const t = document.createElementNS('http://www.w3.org/2000/svg','text');
    t.setAttribute('x',x); t.setAttribute('y',y);
    t.setAttribute('fill', opts.fill || 'rgba(100,100,96,0.7)');
    t.setAttribute('font-size', opts.size || '7.5');
    t.setAttribute('font-family','IBM Plex Mono, monospace');
    t.setAttribute('font-weight', opts.weight || '400');
    if (opts.anchor) t.setAttribute('text-anchor', opts.anchor);
    t.textContent = txt;
    return t;
  };

  svg.appendChild(mkText(PAD, 12, 'STRATIGRAPHY'));
  svg.appendChild(mkText(SOIL_W+PAD, 12, 'DESCRIPTION'));
  svg.appendChild(mkText(BAR_X, 12, 'SPT N-VALUE', {anchor:'start'}));

  // Header line
  const hline = document.createElementNS('http://www.w3.org/2000/svg','line');
  hline.setAttribute('x1',0); hline.setAttribute('y1',16);
  hline.setAttribute('x2',W); hline.setAttribute('y2',16);
  hline.setAttribute('stroke','rgba(0,0,0,0.1)'); hline.setAttribute('stroke-width','0.5');
  svg.appendChild(hline);

  let cy = 20;
  strata.forEach((s, i) => {
    const rh = s.h * 4 * scale;
    const mid = cy + rh/2;

    // Soil block
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x',PAD); rect.setAttribute('y',cy);
    rect.setAttribute('width',SOIL_W-PAD); rect.setAttribute('height',rh);
    rect.setAttribute('fill',s.color); rect.setAttribute('rx','1');
    svg.appendChild(rect);

    // Hatch lines on soil block
    for (let lx = PAD; lx < SOIL_W; lx += 5) {
      const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
      ln.setAttribute('x1',lx); ln.setAttribute('y1',cy);
      ln.setAttribute('x2',lx); ln.setAttribute('y2',cy+rh);
      ln.setAttribute('stroke','rgba(0,0,0,0.08)'); ln.setAttribute('stroke-width','0.5');
      svg.appendChild(ln);
    }

    // Depth label
    svg.appendChild(mkText(0, mid+3, `${(i*1.5).toFixed(1)}m`, {size:'6.5', fill:'rgba(100,100,96,0.55)'}));

    // Description
    svg.appendChild(mkText(SOIL_W+PAD, mid+3, s.label, {size:'7', fill:'rgba(50,50,48,0.7)'}));

    // N-value bar
    const nMid = (s.nRange[0] + s.nRange[1]) / 2;
    const bw = (nMid / 60) * BAR_MAX;
    const bRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    bRect.setAttribute('x',BAR_X); bRect.setAttribute('y',cy+2);
    bRect.setAttribute('width',bw); bRect.setAttribute('height',rh-4);
    bRect.setAttribute('fill',`rgba(28,78,216,${0.1 + (nMid/60)*0.35})`);
    bRect.setAttribute('rx','1');
    svg.appendChild(bRect);

    // N label
    svg.appendChild(mkText(BAR_X+bw+3, mid+3, `${s.nRange[0]}–${s.nRange[1]}`, {size:'6.5', fill:'rgba(28,78,216,0.75)', weight:'500'}));

    // Separator
    if (i < strata.length-1) {
      const sep = document.createElementNS('http://www.w3.org/2000/svg','line');
      sep.setAttribute('x1',0); sep.setAttribute('y1',cy+rh);
      sep.setAttribute('x2',W); sep.setAttribute('y2',cy+rh);
      sep.setAttribute('stroke','rgba(0,0,0,0.08)'); sep.setAttribute('stroke-width','0.5');
      sep.setAttribute('stroke-dasharray','3,2');
      svg.appendChild(sep);
    }

    cy += rh;
  });
})();

// ==========================================
// LANE VIZ — animated road lane detection
// ==========================================
(function () {
  const el = document.getElementById('laneViz');
  if (!el) return;

  const canvas = document.createElement('canvas');
  canvas.style.width  = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  el.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const W = 340, H = 260;
  canvas.width  = W;
  canvas.height = H;

  let frame = 0;

  // Static vehicles
  const vehicles = [
    { x: 80,  y: 120, w: 40, h: 22, label: 'car',    color: '#a0a0a0', lane: 1 },
    { x: 200, y: 90,  w: 50, h: 26, label: 'truck',  color: '#8a8a8a', lane: 2 },
    { x: 50,  y: 175, w: 38, h: 20, label: 'car',    color: '#b4b4b4', lane: 0 },
    { x: 260, y: 160, w: 44, h: 22, label: 'car',    color: '#969696', lane: 2 },
    { x: 140, y: 195, w: 36, h: 18, label: 'bike',   color: '#c0c0c0', lane: 1 },
  ];

  // Lane lines (perspective-ish)
  const lanes = [
    { x1: 0,   y1: H,   x2: W*0.35, y2: H*0.45 },
    { x1: W*0.33, y1: H, x2: W*0.42, y2: H*0.45 },
    { x1: W*0.66, y1: H, x2: W*0.58, y2: H*0.45 },
    { x1: W,   y1: H,   x2: W*0.65, y2: H*0.45 },
  ];

  const detColors = ['rgba(28,78,216,0.7)','rgba(21,128,61,0.7)','rgba(185,28,28,0.7)'];

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Road bg
    ctx.fillStyle = '#e8e6e2';
    ctx.fillRect(0, 0, W, H);

    // Road surface
    ctx.fillStyle = '#c8c6c2';
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(W*0.25, H*0.4);
    ctx.lineTo(W*0.75, H*0.4);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Lane markings (animated dashes)
    const dashOffset = (frame * 1.2) % 20;
    lanes.forEach((l, i) => {
      const alpha = i === 1 || i === 2 ? 0.7 : 0.4;
      ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
      ctx.lineWidth = i === 0 || i === 3 ? 2.5 : 1.5;
      ctx.setLineDash(i === 1 || i === 2 ? [12, 8] : []);
      ctx.lineDashOffset = -dashOffset;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // CLRNet detected lanes (colored overlay, slightly offset)
    const clrAlpha = 0.5 + Math.sin(frame * 0.05) * 0.1;
    [
      { x1: 0, y1: H, x2: W*0.35+2, y2: H*0.45, color: 'rgba(28,78,216,' + clrAlpha + ')' },
      { x1: W*0.33+2, y1: H, x2: W*0.42+2, y2: H*0.45, color: 'rgba(21,128,61,' + clrAlpha + ')' },
      { x1: W*0.66+2, y1: H, x2: W*0.58+2, y2: H*0.45, color: 'rgba(21,128,61,' + clrAlpha + ')' },
      { x1: W+2, y1: H, x2: W*0.65+2, y2: H*0.45, color: 'rgba(28,78,216,' + clrAlpha + ')' },
    ].forEach(l => {
      ctx.strokeStyle = l.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(l.x1, l.y1);
      ctx.lineTo(l.x2, l.y2);
      ctx.stroke();
    });

    // Vehicles
    vehicles.forEach((v, i) => {
      // Move slightly
      const vy = v.y + Math.sin(frame * 0.012 + i) * 0.3;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.ellipse(v.x + v.w/2, vy + v.h + 2, v.w*0.45, 4, 0, 0, Math.PI*2);
      ctx.fill();

      // Body
      ctx.fillStyle = v.color;
      ctx.beginPath();
      ctx.roundRect(v.x, vy, v.w, v.h, 3);
      ctx.fill();

      // Detection box
      const boxColor = detColors[v.lane % detColors.length];
      ctx.strokeStyle = boxColor;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.strokeRect(v.x - 3, vy - 3, v.w + 6, v.h + 6);

      // Label badge
      ctx.fillStyle = boxColor.replace('0.7','0.85');
      ctx.fillRect(v.x - 3, vy - 14, 30, 11);
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 7px IBM Plex Mono, monospace';
      ctx.fillText(v.label.toUpperCase(), v.x, vy - 5);
    });

    // Confidence score overlay
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(6, 6, 120, 26);
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(6, 6, 120, 26);
    ctx.fillStyle = 'rgba(28,78,216,0.8)';
    ctx.font = '500 7px IBM Plex Mono, monospace';
    ctx.fillText('CLRNet  conf: 0.92', 12, 16);
    ctx.fillStyle = 'rgba(21,128,61,0.8)';
    ctx.fillText('YOLOv8  det: ' + vehicles.length + ' obj', 12, 27);

    // Frame counter
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.font = '400 6px IBM Plex Mono, monospace';
    ctx.fillText('frame ' + String(frame).padStart(5,'0'), W-56, H-6);

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ==========================================
// SMOOTH SCROLL
// ==========================================
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const t = document.querySelector(this.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();

// ==========================================
// CONTACT FORM
// ==========================================
(function () {
  const form = document.getElementById('contactForm');
  const suc  = document.getElementById('formSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => {
      suc.classList.add('visible'); form.reset();
      btn.textContent = 'Send →'; btn.disabled = false;
      setTimeout(() => suc.classList.remove('visible'), 6000);
    }, 900);
  });
})();

console.log('%caxialnet v2 — research build', 'font-family:monospace;font-size:11px;color:#1c4ed8;');
