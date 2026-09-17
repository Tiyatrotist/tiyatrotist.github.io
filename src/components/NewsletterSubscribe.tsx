/**
 * TIYATROTIST — Newsletter & Updates Subscription Box
 *
 * Minimalist single-input subscriber box for release and essay notifications.
 * Persists directly into Supabase newsletter_subscribers table.
 */

'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Locale } from '@/dictionaries';

interface NewsletterSubscribeProps {
  lang?: Locale;
  className?: string;
}

export default function NewsletterSubscribe({ lang = 'tr', className }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'already'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage(lang === 'tr' ? 'Geçerli bir e-posta adresi girin.' : 'Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email: email.trim().toLowerCase(),
        lang,
      });

      if (error) {
        if (error.code === '23505' || error.message.includes('unique')) {
          setStatus('already');
        } else {
          setErrorMessage(error.message);
          setStatus('error');
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Abonelik oluşturulamadı.');
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`newsletter-section ${className || ''}`}
      style={{
        margin: '3rem 0',
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      <div style={{ maxWidth: '600px' }}>
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.15em',
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'block',
            marginBottom: '0.5rem',
          }}
        >
          [ {lang === 'tr' ? 'BÜLTEN // GÜNCELLEMELER' : 'DISPATCH // UPDATES'} ]
        </span>
        <h3
          style={{
            fontSize: '1.2rem',
            fontWeight: 500,
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.01em',
          }}
        >
          {lang === 'tr'
            ? 'Yeni bir proje veya yazı yayınlandığında haberdar olun.'
            : 'Get notified when a new project or essay is released.'}
        </h3>
        <p
          style={{
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.5)',
            margin: '0 0 1.5rem 0',
          }}
        >
          {lang === 'tr'
            ? 'Spam yok. Sadece derin düşünceler, mimari notlar ve yeni monokrom araçlar.'
            : 'Zero marketing noise. Only deep essays, architectural breakdowns and new monochrome instruments.'}
        </p>

        {status === 'success' ? (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '4px',
              color: '#10b981',
              fontSize: '0.8rem',
            }}
          >
            ✓ {lang === 'tr' ? 'Aboneliğiniz başarıyla kaydedildi. Teşekkürler!' : 'Subscription confirmed. Thank you!'}
          </div>
        ) : status === 'already' ? (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '0.8rem',
            }}
          >
            [!] {lang === 'tr' ? 'Bu e-posta adresi zaten bülten listemizde kayıtlı.' : 'This email address is already subscribed.'}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === 'tr' ? 'e-posta adresiniz…' : 'your email address…'}
              required
              disabled={loading}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: '0.65rem 1rem',
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '4px',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              data-cursor="expand"
              style={{
                padding: '0.65rem 1.25rem',
                background: '#ffffff',
                color: '#000000',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 600,
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              {loading ? (lang === 'tr' ? 'KAYDEDİLİYOR…' : 'JOINING…') : (lang === 'tr' ? 'ABONE OL' : 'SUBSCRIBE')}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ color: '#ff4d4f', fontSize: '0.72rem', marginTop: '0.6rem', margin: '0.6rem 0 0 0' }}>
            {errorMessage}
          </p>
        )}
      </div>
    </section>
  );
}
