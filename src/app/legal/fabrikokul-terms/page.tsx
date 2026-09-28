import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fabrikokul Terms of Service | TIYATROTIST',
  description: 'Terms governing use of the Fabrikokul social publishing integration.',
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.75rem',
};

export default function FabrikokulTermsPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="page-tag">FABRIKOKUL / LEGAL</p>
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Effective date: September 28, 2026</p>
      </header>

      <article className="page-content">
        <section style={sectionStyle}>
          <h2>1. Service</h2>
          <p>
            Fabrikokul is a social-media publishing integration operated by TIYATROTIST. It lets an
            authenticated user connect accounts they control, prepare content, upload drafts, and—when
            separately authorized—publish content to supported platforms such as TikTok.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2. Eligibility and account control</h2>
          <p>
            You may connect only accounts you own or are authorized to manage. You are responsible for
            safeguarding your login credentials, reviewing every post, and maintaining accurate account
            permissions. Platform authorization can be revoked from the relevant platform at any time.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>3. Acceptable use</h2>
          <p>
            You must comply with applicable law and the rules of each connected platform. You may not use
            Fabrikokul to publish unlawful, deceptive, infringing, abusive, or unauthorized content, or to
            interfere with the service or another person&apos;s account.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>4. Publishing and third-party platforms</h2>
          <p>
            Connected platforms control their own APIs, review processes, visibility rules, rate limits, and
            availability. A scheduled or submitted item is not guaranteed to publish. You remain responsible
            for checking the final post, audience, caption, media, and platform-specific settings.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Availability and changes</h2>
          <p>
            Fabrikokul is provided on an as-available basis. Features may change or be suspended to maintain
            security, comply with platform requirements, or address technical issues. These terms may be
            updated when the service or legal requirements change.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. Contact</h2>
          <p>
            Questions about these terms can be sent through the{' '}
            <Link href="/en/contact" style={{ textDecoration: 'underline' }}>
              TIYATROTIST contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
