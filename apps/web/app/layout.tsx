import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cosmos — Touch-First Development Platform',
  description:
    'The world\'s first touch-first, AI-native, open-source development platform unifying code editing, visual design, data pipelines, and multi-agent AI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">{children}</body>
    </html>
  );
}
