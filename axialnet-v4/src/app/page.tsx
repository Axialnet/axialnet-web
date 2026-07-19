"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    // ------------------------------------------
    // HEADER SCROLL
    // ------------------------------------------
    const h = document.getElementById('siteHeader');
    const onScroll = () => {
      if (h) h.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ------------------------------------------
    // MOBILE NAV
    // ------------------------------------------
    const burger  = document.getElementById('burger');
    const mob     = document.getElementById('mobNav');
    const close   = document.getElementById('mobClose');
    const links   = mob ? mob.querySelectorAll('a') : [];

    const open = () => { mob?.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const shut = () => { mob?.classList.remove('open'); document.body.style.overflow = ''; };

    burger?.addEventListener('click', open);
    close?.addEventListener('click', shut);
    links.forEach(l => l.addEventListener('click', shut));

    // ------------------------------------------
    // SCROLL REVEAL
    // ------------------------------------------
    const els = document.querySelectorAll('.reveal');
    if (els.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.08 });
      els.forEach(el => io.observe(el));
    }

    // ------------------------------------------
    // BORING LOG CANVAS — hero panel
    // ------------------------------------------
    const canvas = document.getElementById('boringCanvas') as HTMLCanvasElement;
    let animFrame1: number;
    let animFrame2: number;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const DPR = window.devicePixelRatio || 1;
        const resize = () => {
          if(!canvas.parentElement) return;
          const rect = canvas.parentElement.getBoundingClientRect();
          canvas.width  = rect.width  * DPR;
          canvas.height = 310 * DPR;
          canvas.style.width  = rect.width + 'px';
          canvas.style.height = '310px';
          ctx.scale(DPR, DPR);
        };
        resize();
        window.addEventListener('resize', () => { ctx.setTransform(1,0,0,1,0,0); resize(); });

        const soilCodes = ['SP','SM','SC','ML','CL','CH','GP','GM','SW'];
        const soilColors: Record<string, string> = {
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

        const draw = () => {
          const W = canvas.width / DPR;
          const H = canvas.height / DPR;
          ctx.clearRect(0, 0, W, H);

          const COLS = [
            { label: 'DEPTH', x: 10,  w: 52 },
            { label: 'BLOWS', x: 68,  w: 70 },
            { label: 'N',     x: 144, w: 32 },
            { label: 'SOIL',  x: 182, w: 32 },
            { label: '',      x: 222, w: W-232 }
          ];
          const ROW_H = 17;
          const Y0 = 26;

          ctx.fillStyle = 'rgba(0,0,0,0.03)';
          ctx.fillRect(0, 0, W, Y0);

          ctx.font = `500 8px var(--font-ibm-mono), monospace`;
          ctx.fillStyle = 'rgba(80,80,78,0.7)';
          COLS.forEach(c => {
            if (c.label) ctx.fillText(c.label, c.x, 16);
          });

          ctx.strokeStyle = 'rgba(0,0,0,0.06)';
          ctx.lineWidth = 0.5;
          [68, 144, 182, 222].forEach(x => {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
          });

          ctx.beginPath(); ctx.moveTo(0, Y0); ctx.lineTo(W, Y0);
          ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 0.5; ctx.stroke();

          rows.forEach((r, i) => {
            const y = Y0 + i * ROW_H;

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
            ctx.font = `400 8px var(--font-ibm-mono), monospace`;
            ctx.fillStyle = 'rgba(80,80,78,0.65)';
            ctx.fillText(r.depth, COLS[0].x, ty);
            ctx.fillStyle = 'rgba(60,60,58,0.6)';
            ctx.fillText(r.blows, COLS[1].x, ty);

            const nColor = r.nVal >= 50 ? '#b91c1c' : r.nVal >= 30 ? '#1c4ed8' : 'rgba(30,30,28,0.8)';
            ctx.fillStyle = nColor;
            ctx.font = `500 8.5px var(--font-ibm-mono), monospace`;
            ctx.fillText(r.nVal >= 50 ? '50R' : r.nVal.toString(), COLS[2].x, ty);

            const sc = soilColors[r.soil] || '#c8b08a';
            ctx.fillStyle = sc;
            ctx.fillRect(COLS[3].x, y+3, 26, ROW_H-6);
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.font = `500 7px var(--font-ibm-mono), monospace`;
            ctx.fillText(r.soil, COLS[3].x+3, ty);

            const barX = COLS[4].x;
            const barMaxW = W - barX - 10;
            const barW = Math.min((r.nVal / 60), 1) * barMaxW;
            const barY = y + 5; const barH = ROW_H - 10;

            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.beginPath(); ctx.roundRect(barX, barY, barMaxW, barH, 1); ctx.fill();

            const barAlpha = i === activeRow ? 0.7 : 0.3;
            ctx.fillStyle = r.nVal >= 30 ? `rgba(28,78,216,${barAlpha})` : `rgba(28,78,216,${barAlpha*0.7})`;
            ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 1); ctx.fill();

            if (i < rows.length - 1) {
              ctx.beginPath(); ctx.moveTo(0, y+ROW_H); ctx.lineTo(W, y+ROW_H);
              ctx.strokeStyle = 'rgba(0,0,0,0.04)'; ctx.lineWidth=0.5; ctx.stroke();
            }
          });

          const ay = Y0 + activeRow * ROW_H;
          ctx.font = `500 7px var(--font-ibm-mono), monospace`;
          ctx.fillStyle = 'rgba(28,78,216,0.6)';
          ctx.fillText('◀ PREDICTING', W - 70, ay + ROW_H * 0.72);

          tick++;
          if (tick % 80 === 0) {
            activeRow = (activeRow + 1) % rows.length;
          }
          animFrame1 = requestAnimationFrame(draw);
        };
        draw();
      }
    }

    // ------------------------------------------
    // STRATA CHART — SVG soil profile
    // ------------------------------------------
    const el = document.getElementById('strataChart');
    if (el) {
      el.innerHTML = ''; // clear for StrictMode re-renders
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

      const mkText = (x: number|string, y: number|string, txt: string, opts: any={}) => {
        const t = document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x', String(x)); t.setAttribute('y', String(y));
        t.setAttribute('fill', opts.fill || 'rgba(100,100,96,0.7)');
        t.setAttribute('font-size', opts.size || '7.5');
        t.setAttribute('font-family','var(--font-ibm-mono), monospace');
        t.setAttribute('font-weight', opts.weight || '400');
        if (opts.anchor) t.setAttribute('text-anchor', opts.anchor);
        t.textContent = txt;
        return t;
      };

      svg.appendChild(mkText(PAD, 12, 'STRATIGRAPHY'));
      svg.appendChild(mkText(SOIL_W+PAD, 12, 'DESCRIPTION'));
      svg.appendChild(mkText(BAR_X, 12, 'SPT N-VALUE', {anchor:'start'}));

      const hline = document.createElementNS('http://www.w3.org/2000/svg','line');
      hline.setAttribute('x1','0'); hline.setAttribute('y1','16');
      hline.setAttribute('x2',String(W)); hline.setAttribute('y2','16');
      hline.setAttribute('stroke','rgba(0,0,0,0.1)'); hline.setAttribute('stroke-width','0.5');
      svg.appendChild(hline);

      let cy = 20;
      strata.forEach((s, i) => {
        const rh = s.h * 4 * scale;
        const mid = cy + rh/2;

        const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        rect.setAttribute('x',String(PAD)); rect.setAttribute('y',String(cy));
        rect.setAttribute('width',String(SOIL_W-PAD)); rect.setAttribute('height',String(rh));
        rect.setAttribute('fill',s.color); rect.setAttribute('rx','1');
        svg.appendChild(rect);

        for (let lx = PAD; lx < SOIL_W; lx += 5) {
          const ln = document.createElementNS('http://www.w3.org/2000/svg','line');
          ln.setAttribute('x1',String(lx)); ln.setAttribute('y1',String(cy));
          ln.setAttribute('x2',String(lx)); ln.setAttribute('y2',String(cy+rh));
          ln.setAttribute('stroke','rgba(0,0,0,0.08)'); ln.setAttribute('stroke-width','0.5');
          svg.appendChild(ln);
        }

        svg.appendChild(mkText(0, mid+3, `${(i*1.5).toFixed(1)}m`, {size:'6.5', fill:'rgba(100,100,96,0.55)'}));
        svg.appendChild(mkText(SOIL_W+PAD, mid+3, s.label, {size:'7', fill:'rgba(50,50,48,0.7)'}));

        const nMid = (s.nRange[0] + s.nRange[1]) / 2;
        const bw = (nMid / 60) * BAR_MAX;
        const bRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
        bRect.setAttribute('x',String(BAR_X)); bRect.setAttribute('y',String(cy+2));
        bRect.setAttribute('width',String(bw)); bRect.setAttribute('height',String(rh-4));
        bRect.setAttribute('fill',`rgba(28,78,216,${0.1 + (nMid/60)*0.35})`);
        bRect.setAttribute('rx','1');
        svg.appendChild(bRect);

        svg.appendChild(mkText(BAR_X+bw+3, mid+3, `${s.nRange[0]}–${s.nRange[1]}`, {size:'6.5', fill:'rgba(28,78,216,0.75)', weight:'500'}));

        if (i < strata.length-1) {
          const sep = document.createElementNS('http://www.w3.org/2000/svg','line');
          sep.setAttribute('x1','0'); sep.setAttribute('y1',String(cy+rh));
          sep.setAttribute('x2',String(W)); sep.setAttribute('y2',String(cy+rh));
          sep.setAttribute('stroke','rgba(0,0,0,0.08)'); sep.setAttribute('stroke-width','0.5');
          sep.setAttribute('stroke-dasharray','3,2');
          svg.appendChild(sep);
        }

        cy += rh;
      });
    }

    // ------------------------------------------
    // LANE VIZ
    // ------------------------------------------
    const laneEl = document.getElementById('laneViz');
    if (laneEl) {
      laneEl.innerHTML = ''; // clear for StrictMode
      const laneCanvas = document.createElement('canvas');
      laneCanvas.style.width  = '100%';
      laneCanvas.style.height = '100%';
      laneCanvas.style.display = 'block';
      laneEl.appendChild(laneCanvas);

      const ctxL = laneCanvas.getContext('2d');
      if (ctxL) {
        const W = 340, H = 260;
        laneCanvas.width  = W;
        laneCanvas.height = H;

        let frame = 0;
        const vehicles = [
          { x: 80,  y: 120, w: 40, h: 22, label: 'car',    color: '#a0a0a0', lane: 1 },
          { x: 200, y: 90,  w: 50, h: 26, label: 'truck',  color: '#8a8a8a', lane: 2 },
          { x: 50,  y: 175, w: 38, h: 20, label: 'car',    color: '#b4b4b4', lane: 0 },
          { x: 260, y: 160, w: 44, h: 22, label: 'car',    color: '#969696', lane: 2 },
          { x: 140, y: 195, w: 36, h: 18, label: 'bike',   color: '#c0c0c0', lane: 1 },
        ];

        const lanes = [
          { x1: 0,   y1: H,   x2: W*0.35, y2: H*0.45 },
          { x1: W*0.33, y1: H, x2: W*0.42, y2: H*0.45 },
          { x1: W*0.66, y1: H, x2: W*0.58, y2: H*0.45 },
          { x1: W,   y1: H,   x2: W*0.65, y2: H*0.45 },
        ];

        const detColors = ['rgba(28,78,216,0.7)','rgba(21,128,61,0.7)','rgba(185,28,28,0.7)'];

        const drawLane = () => {
          ctxL.clearRect(0, 0, W, H);
          ctxL.fillStyle = '#e8e6e2';
          ctxL.fillRect(0, 0, W, H);

          ctxL.fillStyle = '#c8c6c2';
          ctxL.beginPath();
          ctxL.moveTo(0, H);
          ctxL.lineTo(W*0.25, H*0.4);
          ctxL.lineTo(W*0.75, H*0.4);
          ctxL.lineTo(W, H);
          ctxL.closePath();
          ctxL.fill();

          const dashOffset = (frame * 1.2) % 20;
          lanes.forEach((l, i) => {
            const alpha = i === 1 || i === 2 ? 0.7 : 0.4;
            ctxL.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctxL.lineWidth = i === 0 || i === 3 ? 2.5 : 1.5;
            ctxL.setLineDash(i === 1 || i === 2 ? [12, 8] : []);
            ctxL.lineDashOffset = -dashOffset;
            ctxL.beginPath();
            ctxL.moveTo(l.x1, l.y1);
            ctxL.lineTo(l.x2, l.y2);
            ctxL.stroke();
            ctxL.setLineDash([]);
          });

          const clrAlpha = 0.5 + Math.sin(frame * 0.05) * 0.1;
          [
            { x1: 0, y1: H, x2: W*0.35+2, y2: H*0.45, color: 'rgba(28,78,216,' + clrAlpha + ')' },
            { x1: W*0.33+2, y1: H, x2: W*0.42+2, y2: H*0.45, color: 'rgba(21,128,61,' + clrAlpha + ')' },
            { x1: W*0.66+2, y1: H, x2: W*0.58+2, y2: H*0.45, color: 'rgba(21,128,61,' + clrAlpha + ')' },
            { x1: W+2, y1: H, x2: W*0.65+2, y2: H*0.45, color: 'rgba(28,78,216,' + clrAlpha + ')' },
          ].forEach(l => {
            ctxL.strokeStyle = l.color;
            ctxL.lineWidth = 1.5;
            ctxL.beginPath();
            ctxL.moveTo(l.x1, l.y1);
            ctxL.lineTo(l.x2, l.y2);
            ctxL.stroke();
          });

          vehicles.forEach((v, i) => {
            const vy = v.y + Math.sin(frame * 0.012 + i) * 0.3;
            ctxL.fillStyle = 'rgba(0,0,0,0.1)';
            ctxL.beginPath();
            ctxL.ellipse(v.x + v.w/2, vy + v.h + 2, v.w*0.45, 4, 0, 0, Math.PI*2);
            ctxL.fill();

            ctxL.fillStyle = v.color;
            ctxL.beginPath();
            ctxL.roundRect(v.x, vy, v.w, v.h, 3);
            ctxL.fill();

            const boxColor = detColors[v.lane % detColors.length];
            ctxL.strokeStyle = boxColor;
            ctxL.lineWidth = 1.2;
            ctxL.setLineDash([]);
            ctxL.strokeRect(v.x - 3, vy - 3, v.w + 6, v.h + 6);

            ctxL.fillStyle = boxColor.replace('0.7','0.85');
            ctxL.fillRect(v.x - 3, vy - 14, 30, 11);
            ctxL.fillStyle = '#ffffff';
            ctxL.font = '500 7px var(--font-ibm-mono), monospace';
            ctxL.fillText(v.label.toUpperCase(), v.x, vy - 5);
          });

          ctxL.fillStyle = 'rgba(255,255,255,0.85)';
          ctxL.fillRect(6, 6, 120, 26);
          ctxL.strokeStyle = 'rgba(0,0,0,0.1)';
          ctxL.lineWidth = 0.5;
          ctxL.strokeRect(6, 6, 120, 26);
          ctxL.fillStyle = 'rgba(28,78,216,0.8)';
          ctxL.font = '500 7px var(--font-ibm-mono), monospace';
          ctxL.fillText('CLRNet  conf: 0.92', 12, 16);
          ctxL.fillStyle = 'rgba(21,128,61,0.8)';
          ctxL.fillText('YOLOv8  det: ' + vehicles.length + ' obj', 12, 27);

          ctxL.fillStyle = 'rgba(0,0,0,0.25)';
          ctxL.font = '400 6px var(--font-ibm-mono), monospace';
          ctxL.fillText('frame ' + String(frame).padStart(5,'0'), W-56, H-6);

          frame++;
          animFrame2 = requestAnimationFrame(drawLane);
        };
        drawLane();
      }
    }

    // ------------------------------------------
    // SMOOTH SCROLL
    // ------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href');
        if (targetId && targetId !== '#') {
          const t = document.querySelector(targetId);
          if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }
      });
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      burger?.removeEventListener('click', open);
      close?.removeEventListener('click', shut);
      links.forEach(l => l.removeEventListener('click', shut));
      if (animFrame1) cancelAnimationFrame(animFrame1);
      if (animFrame2) cancelAnimationFrame(animFrame2);
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const btn = formEl.querySelector('button');
    const suc = document.getElementById('formSuccess');
    if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
    
    fetch("https://formsubmit.co/ajax/nallapuvenkat6@gmail.com", {
      method: "POST",
      headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({
          name: (formEl.elements.namedItem('name') as HTMLInputElement).value,
          email: (formEl.elements.namedItem('email') as HTMLInputElement).value,
          role: (formEl.elements.namedItem('role') as HTMLInputElement).value,
          message: (formEl.elements.namedItem('message') as HTMLTextAreaElement).value
      })
    })
    .then(response => response.json())
    .then(data => {
      if (suc) suc.classList.add('visible'); 
      formEl.reset();
      if (btn) { btn.textContent = 'Send →'; btn.disabled = false; }
      setTimeout(() => {
        if (suc) suc.classList.remove('visible');
      }, 6000);
    })
    .catch(error => {
      console.error(error);
      if (btn) { btn.textContent = 'Error. Try Again.'; btn.disabled = false; }
    });
  };

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="header-inner">
          <Link className="logo" href="#">
            <Image src="/assests/favicon-32x32.png" width={20} height={20} alt="Axialnet Logo" />
            axialnet
          </Link>
          <nav className="main-nav">
            <Link href="#projects">Projects</Link>
            <Link href="#methods">Methods</Link>
            <Link href="#about">About</Link>
            <Link href="#contact">Contact</Link>
          </nav>
          <Link href="#contact" className="header-cta">Request Access</Link>
          <button className="burger" id="burger" aria-label="Menu">
            <span /><span />
          </button>
        </div>
      </header>

      <div className="mob-nav" id="mobNav">
        <button className="mob-nav__close" id="mobClose">✕</button>
        <nav>
          <Link href="#projects">Projects</Link>
          <Link href="#methods">Methods</Link>
          <Link href="#about">About</Link>
          <Link href="#contact">Contact</Link>
        </nav>
      </div>

      <section className="hero">
        <div className="hero__grid">
          <div className="hero__main">
            <div className="hero__label">
              <span className="dot-live" />
              axialnet · ML Studio
            </div>
            <h1 className="hero__h1">
              Machine learning<br />
              for <em>physical-world</em><br />
              engineering systems.
            </h1>
            <p className="hero__desc">
              Axialnet builds domain-specific AI systems for engineering fields that AI has largely bypassed — starting with geotechnical, extending to transportation and infrastructure.
            </p>
            <div className="hero__actions">
              <Link href="#projects" className="btn-primary">View Research</Link>
              <Link href="#contact" className="btn-text">Request early access →</Link>
            </div>
          </div>

          <div className="hero__panel">
            <div className="panel-header">
              <span className="panel-title">Flagship: GeoLLM — Live Inference</span>
              <span className="panel-status">● RUNNING</span>
            </div>
            <div className="panel-body">
              <canvas id="boringCanvas" width={380} height={310} />
            </div>
            <div className="panel-footer">
              <span>Model: Mistral-7B-QLoRA-geo</span>
              <span>Recall: 0.91</span>
            </div>
          </div>
        </div>

        <div className="hero__metrics">
          <div className="metric-item">
            <span className="metric-num">7B</span>
            <span className="metric-label">Base model params</span>
          </div>
          <div className="metric-sep" />
          <div className="metric-item">
            <span className="metric-num">&gt;0.90</span>
            <span className="metric-label">Target SPT recall</span>
          </div>
          <div className="metric-sep" />
          <div className="metric-item">
            <span className="metric-num">300k+</span>
            <span className="metric-label">Training instruction pairs</span>
          </div>
          <div className="metric-sep" />
          <div className="metric-item">
            <span className="metric-num">10</span>
            <span className="metric-label">Indian geology types</span>
          </div>
          <div className="metric-sep" />
          <div className="metric-item">
            <span className="metric-num">On-prem</span>
            <span className="metric-label">Ollama / GGUF deploy</span>
          </div>
        </div>
      </section>

      <div className="band">
        <div className="band__inner">
          <span>QLoRA Fine-tuning</span><span className="band-dot">·</span>
          <span>Hybrid BM25 + Dense Retrieval</span><span className="band-dot">·</span>
          <span>Reciprocal Rank Fusion</span><span className="band-dot">·</span>
          <span>BAAI/bge-m3 Embeddings</span><span className="band-dot">·</span>
          <span>GGUF / Ollama</span><span className="band-dot">·</span>
          <span>Synthetic Data Generation</span><span className="band-dot">·</span>
          <span>GPT-4o Bootstrapping</span>
        </div>
      </div>

      <section className="capability section-pad" id="capability">
        <div className="wrap">
          <div className="section-label">HOW WE WORK</div>
          <div className="capability-layout" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div>
              <h2 className="methods-h2">One pipeline. Many domains.</h2>
              <p className="proj-desc" style={{ maxWidth: '800px' }}>
                axialnet&apos;s model is a repeatable pipeline — domain data curation, parameter-efficient fine-tuning, and secure on-premise deployment — applied across engineering sub-verticals rather than built around a single product. GeoLLM and LaneDisciplineNet are both instances of this same underlying approach.
              </p>
            </div>
            
            <div className="flowchart-container reveal" style={{ '--delay': '100ms' } as React.CSSProperties}>
              <div className="flow-row" style={{ alignItems: 'flex-start', gap: '16px' }}>
                <div className="flow-box" style={{ flex: 1, padding: '24px', background: 'var(--white)', border: '1px solid var(--ink)', borderRadius: 'var(--r-md)' }}>
                  <span className="flow-num" style={{ color: 'var(--ink)' }}>01</span>
                  <h5 style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '12px' }}>DOMAIN DATA SYNTHESIS</h5>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--ink-3)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px', marginBottom: '4px' }}><span>Source</span><span>IS Codes, CAD, Logs</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px', marginBottom: '4px' }}><span>Process</span><span>GPT-4o Bootstrapping</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Output</span><span>High-precision pairs</span></div>
                  </div>
                </div>
                
                <div className="flow-arrow" style={{ paddingTop: '40px', color: 'var(--ink-4)' }}>→</div>
                
                <div className="flow-box" style={{ flex: 1, padding: '24px', background: 'var(--ink)', border: '1px solid var(--ink)', borderRadius: 'var(--r-md)', color: 'var(--white)' }}>
                  <span className="flow-num" style={{ color: 'var(--ink-4)' }}>02</span>
                  <h5 style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '12px', color: 'var(--white)' }}>PARAMETER-EFFICIENT FT</h5>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--ink-4)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}><span>Method</span><span>QLoRA (4-bit)</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', marginBottom: '4px' }}><span>Base</span><span>Llama 3 / Mistral</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Target</span><span>Domain Recall &gt; 0.90</span></div>
                  </div>
                </div>
                
                <div className="flow-arrow" style={{ paddingTop: '40px', color: 'var(--ink-4)' }}>→</div>
                
                <div className="flow-box" style={{ flex: 1, padding: '24px', background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' }}>
                  <span className="flow-num">03</span>
                  <h5 style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '12px' }}>AIR-GAPPED INFERENCE</h5>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--ink-4)', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px', marginBottom: '4px' }}><span>Format</span><span>GGUF / TensorRT</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '4px', marginBottom: '4px' }}><span>Hardware</span><span>Edge / On-Premise</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Security</span><span>Zero Cloud Dependency</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="projects section-pad" id="projects">
        <div className="wrap">
          <div className="section-label">ACTIVE RESEARCH</div>

          <div className="project-row reveal">
            <div className="project-row__meta">
              <span className="proj-num">01</span>
              <span className="proj-tag tag-active">Flagship · Live</span>
            </div>
            <div className="project-row__body">
              <h2 className="proj-title">GeoLLM</h2>
              <p className="proj-subtitle">Domain-specific LLM for geotechnical engineering</p>
              <p className="proj-desc">
                GeoLLM is a Mistral 7B model fine-tuned with QLoRA on geotechnical engineering data — SPT N-values, boring logs, site investigation reports, and Indian geology classifications. It is designed for on-premise deployment in engineering firms that cannot use cloud-hosted AI for proprietary site data.
              </p>
              <div className="proj-specs">
                <table className="spec-table">
                  <tbody>
                    <tr><td>Base model</td><td>Mistral 7B</td></tr>
                    <tr><td>Fine-tuning</td><td>QLoRA (4-bit)</td></tr>
                    <tr><td>Embeddings</td><td>BAAI/bge-m3</td></tr>
                    <tr><td>Retrieval</td><td>BM25 + Dense → RRF</td></tr>
                    <tr><td>Deployment</td><td>Ollama / GGUF (on-premise)</td></tr>
                    <tr><td>Target metric</td><td>SPT N-value recall &gt; 0.90</td></tr>
                    <tr><td>Training data</td><td>~300k instruction pairs · 10 Indian geology types</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="project-row__visual">
              <div className="strata-chart" id="strataChart" />
              <div className="chart-label">Soil profile · SPT N-value by depth</div>
            </div>
          </div>

          <div className="row-divider" />

          <div className="project-row reveal" style={{ '--delay': '100ms' } as React.CSSProperties}>
            <div className="project-row__meta">
              <span className="proj-num">02</span>
              <span className="proj-tag tag-active">Research · Proof of concept</span>
            </div>
            <div className="project-row__body">
              <h2 className="proj-title">LaneDisciplineNet</h2>
              <p className="proj-subtitle">Lane violation detection for Indian road conditions</p>
              <p className="proj-desc">
                A two-stage computer vision system combining YOLOv8 object detection with CLRNet lane detection for real-time lane discipline analysis in Indian mixed traffic conditions. Trained on the India Driving Dataset (IDD) using distributed training across A100 GPUs on Param Shivay HPC.
              </p>
              <div className="proj-specs">
                <table className="spec-table">
                  <tbody>
                    <tr><td>Detection</td><td>YOLOv8</td></tr>
                    <tr><td>Lane detection</td><td>CLRNet</td></tr>
                    <tr><td>Training dataset</td><td>IDD (India Driving Dataset)</td></tr>
                    <tr><td>Training compute</td><td>Param Shivay · A100/V100 DDP</td></tr>
                    <tr><td>Export</td><td>TensorRT FP16</td></tr>
                    <tr><td>Target</td><td>Real-time edge inference</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="project-row__visual project-row__visual--lane">
              <div className="lane-viz" id="laneViz" />
              <div className="chart-label">Traffic frame · lane detection overlay</div>
            </div>
          </div>
        </div>
      </section>

      <section className="methods section-pad" id="methods">
        <div className="wrap">
          <div className="section-label">METHODOLOGY</div>
          <div className="methods-layout-global">
            <div className="methods-intro reveal">
              <h2 className="methods-h2">Building AI from the<br />domain down.</h2>
              <p>General models fail in engineering contexts not due to a lack of intelligence, but a lack of precision. We use a standardized pipeline to develop highly precise, air-gapped systems tailored for physical-world engineering domains.</p>
              <br/>
              <p>The same pipeline underlies every axialnet project. Shown below as applied to GeoLLM.</p>
            </div>
            
            <div className="flowchart-container reveal" style={{ '--delay': '100ms' } as React.CSSProperties}>
              <div className="flow-row">
                <div className="flow-box">
                  <span className="flow-num">01</span>
                  <h5>RAW DOMAIN DATA</h5>
                  <p>IS Codes, CAD Specs, Proprietary Docs</p>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-box">
                  <span className="flow-num">02</span>
                  <h5>DATA SYNTHESIS</h5>
                  <p>Bootstrapped Instruction Pairs</p>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-box">
                  <span className="flow-num">03</span>
                  <h5>PEFT FINE-TUNING</h5>
                  <p>Task-Specific Adapters (QLoRA)</p>
                </div>
              </div>
              <div className="flow-row">
                 <div className="flow-vert-arrow" />
                 <div className="flow-vert-arrow" />
                 <div className="flow-vert-arrow">↓</div>
              </div>
              <div className="flow-row">
                <div className="flow-box">
                  <span className="flow-num">04</span>
                  <h5>USER QUERY</h5>
                  <p>Engineering Context & Parameters</p>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-box">
                  <span className="flow-num">05</span>
                  <h5>HYBRID RAG</h5>
                  <p>Sparse + Dense Fusion (RRF)</p>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-box">
                  <span className="flow-num">06</span>
                  <h5>AIR-GAPPED INFERENCE</h5>
                  <p>Local Edge / On-Prem Deployment</p>
                </div>
              </div>
            </div>

            <div className="methods-steps-grid reveal" style={{ '--delay': '150ms' } as React.CSSProperties}>
              <div className="method-step">
                <div className="step-head">
                  <h4>Data Curation & Synthesis</h4>
                </div>
                <p>Extracting proprietary practitioner data (e.g., IS Code references, CAD specs, boring logs) and using frontier models to bootstrap high-quality instruction pairs. This ensures the model learns strict physical-world calculation chains rather than semantic approximations.</p>
              </div>
              <div className="method-step">
                <div className="step-head">
                  <h4>PEFT Fine-Tuning</h4>
                </div>
                <p>Applying techniques like Quantized Low-Rank Adaptation (QLoRA) to state-of-the-art open weights. This achieves high recall on domain-specific engineering tasks while keeping VRAM requirements low enough for edge and on-prem deployment.</p>
              </div>
              <div className="method-step">
                <div className="step-head">
                  <h4>Hybrid RAG</h4>
                </div>
                <p>Fusing sparse retrieval (for exact standard/code matching) with dense embeddings (for semantic context). Results are dynamically re-ranked via Reciprocal Rank Fusion to build highly precise, depth-ordered context windows.</p>
              </div>
              <div className="method-step">
                <div className="step-head">
                  <h4>Air-Gapped Inference</h4>
                </div>
                <p>Exporting to optimized formats (like GGUF or TensorRT) for local execution. Infrastructure firms cannot upload proprietary site data or unreleased plans to cloud APIs; secure, on-premise inference is a hard requirement.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="wrap">
          <div className="section-label">ABOUT</div>
          <div className="about-layout">
            <div className="about-main reveal">
              <h2 className="about-h2">Built where civil engineering<br />meets machine learning.</h2>
              <div className="about-body">
                <p>Axialnet was founded at IIT (BHU) Varanasi. The thesis is simple: physical-world domains — geotechnical, structural, infrastructure engineering — have been almost entirely bypassed by the AI boom, because AI teams don&apos;t speak the domain.</p>
                <p>We do. We are building from the domain down: deep understanding first, then the models to match it.</p>
                <p>axialnet operates as a studio: each project is both a standalone product and a proof point for the underlying pipeline.</p>
              </div>
              <div className="founder-card">
                <div className="founder-avatar">VN</div>
                <div className="founder-info">
                  <strong>Venkat Nallapu</strong>
                  <span>Founder — B.Tech Civil Engineering (IIT BHU, 2027)</span>
                  <span>ML Engineering · Applied Research</span>
                </div>
              </div>
            </div>
            <div className="about-links reveal" style={{ '--delay': '150ms' } as React.CSSProperties}>
              <a href="https://github.com/axialnet" className="ext-link" target="_blank" rel="noreferrer">
                <span className="ext-link__label">GitHub</span>
                <span className="ext-link__arrow">↗</span>
              </a>
              <a href="https://linkedin.com/company/axialnet" className="ext-link" target="_blank" rel="noreferrer">
                <span className="ext-link__label">LinkedIn</span>
                <span className="ext-link__arrow">↗</span>
              </a>
              <a href="mailto:hello@axialnet.in" className="ext-link">
                <span className="ext-link__label">hello@axialnet.in</span>
                <span className="ext-link__arrow">↗</span>
              </a>
              <a href="https://axialnet.in" className="ext-link">
                <span className="ext-link__label">axialnet.in</span>
                <span className="ext-link__arrow">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="wrap">
          <div className="section-label">CONTACT</div>
          <div className="contact-layout">
            <div className="contact-left reveal">
              <h2 className="contact-h2">Collaborate or<br />request early access.</h2>
              <p>We are looking for geotechnical engineers, infrastructure firms, researchers, and teams in adjacent engineering domains who want AI that genuinely understands their field.</p>
              <div className="contact-items">
                <div className="contact-item">
                  <span className="contact-key">Email</span>
                  <a href="mailto:hello@axialnet.in">hello@axialnet.in</a>
                </div>
                <div className="contact-item">
                  <span className="contact-key">Phone</span>
                  <a href="tel:+917993013759">+91 79930 13759</a>
                </div>
              </div>
            </div>
            <form className="contact-form reveal" id="contactForm" style={{ '--delay': '150ms' } as React.CSSProperties} onSubmit={handleFormSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="you@org.com" required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="role">Role / Organisation</label>
                <input type="text" id="role" name="role" placeholder="Geotechnical engineer, researcher, etc." />
              </div>
              <div className="field">
                <label htmlFor="message">Context</label>
                <textarea id="message" name="message" rows={5} placeholder="What problem are you working on? What domain?" />
              </div>
              <button type="submit" className="btn-submit">Send →</button>
              <div className="form-success" id="formSuccess">Message received. We&apos;ll respond within 48 hours.</div>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-inner">
            <div className="footer-left">
              <span className="footer-logo">axialnet</span>
              <p>ML for physical-world engineering systems.</p>
            </div>
            <div className="footer-nav">
              <div className="footer-col">
                <span className="footer-col-head">Research</span>
                <Link href="#projects">GeoLLM</Link>
                <Link href="#projects">LaneDisciplineNet</Link>
                <Link href="#methods">Methods</Link>
                <Link href="/blog">Blog</Link>
              </div>
              <div className="footer-col">
                <span className="footer-col-head">Company</span>
                <Link href="#about">About</Link>
                <Link href="/careers">Careers</Link>
                <Link href="/faq">FAQ</Link>
                <a href="mailto:hello@axialnet.in">Contact</a>
                <a href="https://github.com/axialnet" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Axialnet.</span>
            <span>axialnet.in</span>
          </div>
        </div>
      </footer>
    </>
  );
}
