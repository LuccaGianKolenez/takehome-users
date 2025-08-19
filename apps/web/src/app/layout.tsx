import Providers from './providers';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ fontFamily: 'Inter, system-ui', maxWidth: 1000, margin: '2rem auto' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
