import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Settings } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Proposal Generator',
  description: 'Generate personalized Upwork proposals using AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Proposal Generator
            </Link>
            <Link 
              href="/settings" 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}