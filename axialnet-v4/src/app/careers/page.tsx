import Link from 'next/link';
import Image from 'next/image';

export default function Careers() {
  return (
    <>
      <header className="site-header" id="siteHeader">
        <div className="header-inner">
          <Link className="logo" href="/">
            <Image src="/assests/favicon-32x32.png" width={20} height={20} alt="Axialnet Logo" />
            axialnet
          </Link>
          <nav className="main-nav">
            <Link href="/">Back to Home</Link>
          </nav>
        </div>
      </header>

      <main style={{ paddingTop: '160px', paddingBottom: '160px', minHeight: '80vh' }}>
        <section className="section-pad">
          <div className="wrap">
            <div className="section-label">CAREERS & COLLABORATION</div>
            <div style={{ padding: '80px 40px', background: 'var(--ink-5)', border: '1px dashed var(--ink-4)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
              <h1 className="hero__h1" style={{ marginBottom: '24px' }}>Careers [Under Development]</h1>
              <p className="proj-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem' }}>
                This page is for researchers and engineers who want to contribute. Splitting this from the client contact form improves both conversion and the quality of inbound messages.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
