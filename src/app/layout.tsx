import type { Metadata } from 'next';
import DevToolsNotice from '@/components/DevToolsNotice';
import './globals.css';

export const metadata: Metadata = {
  title: 'TIYATROTIST — Digital Environment',
  description: 'A black-and-white, dot-typography-driven digital environment and landing experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DevToolsNotice />
        {children}
      </body>
    </html>
  );
}
