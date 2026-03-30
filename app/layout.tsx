import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Assistant',
  description: 'Personal AI productivity tools',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="flex min-h-screen bg-gray-50">
          <aside className="w-56 bg-white border-r border-gray-200 fixed top-0 left-0 h-full p-6">
            <h1 className="text-lg font-semibold text-gray-900 mb-8">
              🤖 AI Assistant
            </h1>
            <nav className="flex flex-col gap-2">
              <Link
                href="/standup"
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                📋 Daily Standup
              </Link>
              <Link
                href="/email"
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                ✉️ Email Drafter
              </Link>
              <Link
                href="/decisions"
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                📓 Decision Logger
              </Link>
            </nav>
          </aside>
          <main className="ml-56 flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
