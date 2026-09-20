import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const description =
  'Build a resume or CV from ten print-ready templates, edit it live, and download a clean PDF. Everything stays in your browser — no account, no upload.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Inkwell — Resume & CV Builder',
    template: '%s · Inkwell',
  },
  description,
  applicationName: 'Inkwell',
  keywords: ['resume builder', 'CV builder', 'resume templates', 'PDF resume', 'ATS resume'],
  openGraph: { title: 'Inkwell — Resume & CV Builder', description, type: 'website' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#f7f4ef',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
