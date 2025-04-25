import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/auth/AuthContext';
import { GroupProvider } from '@/context/group/GroupContext';
import { DrinkProvider } from '@/context/drink/DrinkContext';
import { EventProvider } from '@/context/event/EventContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hangover Club',
  description: 'Gamificando a bebedeira desde 2025',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <AuthProvider>
          <GroupProvider>
            <DrinkProvider>
              <EventProvider>
                {children}
              </EventProvider>
            </DrinkProvider>
          </GroupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
