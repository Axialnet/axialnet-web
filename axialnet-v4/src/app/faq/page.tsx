import Link from 'next/link';
import Image from 'next/image';

export default function FAQ() {
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
            <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>
            <div style={{ padding: '80px 40px', background: 'var(--ink-5)', border: '1px dashed var(--ink-4)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
              <h1 className="hero__h1" style={{ marginBottom: '24px' }}>FAQ [Under Development]</h1>
              <p className="proj-desc" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.25rem' }}>
                Answers to common questions regarding data safety, deployment time, pricing, and required data format.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
