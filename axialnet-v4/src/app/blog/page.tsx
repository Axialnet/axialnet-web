"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../globals.css'; // Optional if layout already imports it, but nice to be safe

export default function Blog() {
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

    return () => {
      window.removeEventListener('scroll', onScroll);
      burger?.removeEventListener('click', open);
      close?.removeEventListener('click', shut);
      links.forEach(l => l.removeEventListener('click', shut));
    };
  }, []);

  const posts = [
    {
      id: 1,
      date: 'OCT 24, 2023',
      category: 'ENGINEERING',
      title: 'GeoLLM: Bootstrapping Synthetic Data for Soil Classification',
      desc: 'How we used GPT-4o to synthesize over 300k instruction pairs from IS Codes and legacy CAD logs, enabling precise parameter-efficient fine-tuning on a local Mistral-7B instance.',
      href: '#'
    },
    {
      id: 2,
      date: 'SEP 12, 2023',
      category: 'RESEARCH',
      title: 'Hybrid RAG using Reciprocal Rank Fusion for Engineering Docs',
      desc: 'Retrieving precise engineering parameters requires more than dense embeddings. A deep dive into combining BM25 sparse retrieval with BAAI/bge-m3 dense vectors.',
      href: '#'
    },
    {
      id: 3,
      date: 'AUG 05, 2023',
      category: 'COMPUTER VISION',
      title: 'LaneDisciplineNet: Edge Inference in Unstructured Traffic',
      desc: 'Deploying a dual YOLOv8 + CLRNet pipeline on TensorRT. Challenges in processing India Driving Dataset (IDD) on edge hardware.',
      href: '#'
    }
  ];

  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="header-inner">
          <Link className="logo" href="/">
            <Image src="/assests/favicon-32x32.png" width={20} height={20} alt="Axialnet Logo" />
            axialnet
          </Link>
          <nav className="main-nav">
            <Link href="/">Home</Link>
            <Link href="/#projects">Projects</Link>
            <Link href="/#methods">Methods</Link>
            <Link href="/#about">About</Link>
          </nav>
          <Link href="/#contact" className="header-cta">Request Access</Link>
          <button className="burger" id="burger" aria-label="Menu">
            <span /><span />
          </button>
        </div>
      </header>

      <div className="mob-nav" id="mobNav">
        <button className="mob-nav__close" id="mobClose">✕</button>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/#projects">Projects</Link>
          <Link href="/#methods">Methods</Link>
          <Link href="/#about">About</Link>
        </nav>
      </div>

      <main className="blog-main" style={{ paddingTop: '160px', paddingBottom: '96px', minHeight: '100vh', background: 'var(--white)' }}>
        <div className="wrap">
          <div className="section-label reveal">RESEARCH & UPDATES</div>
          
          <h1 className="hero__h1 reveal" style={{ '--delay': '100ms' } as React.CSSProperties}>
            Engineering, data,<br />and <em>applied</em> AI.
          </h1>
          
          <p className="hero__desc reveal" style={{ '--delay': '200ms', maxWidth: '600px', marginBottom: '80px' } as React.CSSProperties}>
            Notes on building parameter-efficient models, air-gapped deployments, and domain-specific AI for the physical world.
          </p>

          <div className="blog-grid" style={{ display: 'grid', gap: '48px', gridTemplateColumns: '1fr' }}>
            {posts.map((post, i) => (
              <Link href={post.href} key={post.id} className="blog-card reveal" style={{ 
                '--delay': `${300 + i * 100}ms`, 
                display: 'block', 
                borderTop: '1px solid var(--line)', 
                paddingTop: '32px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'opacity 0.3s'
              } as React.CSSProperties}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <div style={{ flex: '0 0 200px' }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink-4)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      {post.date}
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', color: 'var(--ink)', backgroundColor: 'var(--surface)', display: 'inline-block', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.1em' }}>
                      {post.category}
                    </div>
                  </div>
                  <div style={{ flex: '1', minWidth: '300px' }}>
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.75rem', fontWeight: '400', lineHeight: '1.3', color: 'var(--ink)', margin: '0 0 16px 0' }}>
                      {post.title}
                    </h2>
                    <p style={{ fontFamily: 'var(--sans)', fontSize: '1rem', color: 'var(--ink-3)', lineHeight: '1.6', margin: '0', maxWidth: '700px' }}>
                      {post.desc}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-wrap">
          <div className="footer-left">
            <span className="footer-logo">axialnet</span>
            <span className="footer-tag">Domain-specific AI for engineering</span>
          </div>
          <div className="footer-right">
            <span>© {new Date().getFullYear()} Axialnet</span>
            <Link href="/blog">Blog</Link>
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
