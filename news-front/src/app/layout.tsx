import { AuthProvider } from '@/contexts/AuthContext';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ЖКХ Казахстан — Актуальные новости',
  description:
    'Актуальные новости жилищно-коммунального хозяйства Казахстана. Водоснабжение, электроснабжение, теплоснабжение и другие коммунальные вопросы.',
  keywords: 'ЖКХ, Казахстан, новости, коммунальные услуги, водоснабжение',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}