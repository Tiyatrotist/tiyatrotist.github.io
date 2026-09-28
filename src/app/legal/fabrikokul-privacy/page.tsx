import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fabrikokul Privacy Policy | TIYATROTIST',
  description: 'Privacy information for the Fabrikokul social publishing integration.',
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '0.75rem',
};

export default function FabrikokulPrivacyPage() {
  return (
    <main className="page-container">
      <header className="page-header">
        <p className="page-tag">FABRIKOKUL / LEGAL</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">Effective date: September 28, 2026</p>
      </header>

      <article className="page-content">
        <section style={sectionStyle}>
          <h2>1. Scope</h2>
          <p>
            This policy explains how TIYATROTIST processes information when you use Fabrikokul to connect
            and publish through third-party social platforms, including TikTok.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2. Information processed</h2>
          <p>
            With your authorization, Fabrikokul may process basic account information supplied by a connected
            platform, authorization tokens, the content and media you choose to upload, publishing settings,
            and limited technical logs needed for security and troubleshooting. Fabrikokul does not ask for
            or store your TikTok password.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>3. How information is used</h2>
          <p>
            Information is used only to identify the connected account, provide the publishing features you
            request, maintain service security, diagnose failures, and comply with legal obligations. It is
            not sold or used for third-party advertising.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>4. Sharing and service providers</h2>
          <p>
            Data is transmitted to a connected platform only when required to authenticate your account or
            carry out an action you request. Hosting and infrastructure providers may process limited data on
            behalf of TIYATROTIST. Information may also be disclosed when required by law or to protect the
            security of users and the service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Retention and control</h2>
          <p>
            Authorization data is retained while the connection remains active and may be removed when you
            disconnect the account or request deletion, subject to limited security backups and legal
            retention duties. You can also revoke Fabrikokul&apos;s platform access from the connected platform&apos;s
            settings.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. Security and children</h2>
          <p>
            Reasonable technical and organizational safeguards are used to protect stored information. No
            system can guarantee absolute security. Fabrikokul is not directed to children under 13 and does
            not knowingly collect their personal information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>7. Contact and requests</h2>
          <p>
            Privacy questions and access, correction, or deletion requests can be sent through the{' '}
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
