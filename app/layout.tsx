import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Hallo! Abenteuer — German for Kids',
  description:
    'Playful German lessons, listening games and real-world conversations for young beginners.',
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
