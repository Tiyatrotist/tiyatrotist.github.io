import type { Metadata } from 'next';
import CustomCursor from '@/components/CustomCursor';
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
    <html lang="tr">
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
