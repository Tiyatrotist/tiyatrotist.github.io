/**
 * TIYATROTIST — Particle Physics Sandbox Project Route
 * Route: /[lang]/sandbox (Mirrors /[lang]/projects/sandbox)
 */

import ProjectDetailPage from '../projects/[slug]/page';
import { Metadata } from 'next';

interface SandboxPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'tr' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isTr = lang === 'tr';
  return {
    title: isTr ? 'Particle Sandbox — TIYATROTIST' : 'Particle Sandbox — TIYATROTIST',
    description: isTr
      ? 'İnteraktif monokrom yerçekimi, kum, sıvı ve kozmik partikül fiziği projesi.'
      : 'Interactive monochrome gravity, sand, fluid, and cosmic particle physics project.',
  };
}

export default async function SandboxPage({ params }: SandboxPageProps) {
  const { lang } = await params;
  return <ProjectDetailPage params={Promise.resolve({ lang, slug: 'sandbox' })} />;
}
