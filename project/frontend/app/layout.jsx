import './globals.css';
import { GlobalProvider } from '../lib/GlobalContext';
import Nav from '../components/Nav';

export const metadata = {
  title: 'CTRL.PANEL',
  description: 'System control interface',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GlobalProvider>
          <div className="app-shell">
            <Nav />
            <main className="main-content">
              {children}
            </main>
          </div>
        </GlobalProvider>
      </body>
    </html>
  );
}
