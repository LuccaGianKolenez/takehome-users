import Providers from './providers';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{maxWidth:880, margin:'2rem auto', fontFamily:'Inter, system-ui'}}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
