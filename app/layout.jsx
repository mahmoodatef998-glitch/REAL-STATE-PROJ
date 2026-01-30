import './globals.css';
import { ReactQueryClientProvider } from '../components/providers/ReactQueryClientProvider';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import SmoothScroll from '../components/providers/SmoothScroll';

export const metadata = {
  title: 'Alrabie Real Estate | Premier Properties in Ajman, UAE',
  description: 'We design the places where people love to be together.',
  icons: {
    icon: '/favicon.ico'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only focus-ring inline-block p-2 bg-neutral-900 text-accent">
          Skip to content
        </a>
        <ErrorBoundary>
          <ReactQueryClientProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
              <SmoothScroll>
                <LanguageProvider>
                  <AuthProvider>
                    <Header />
                    <main id="main">
                      {children}
                    </main>
                    <Footer />
                  </AuthProvider>
                </LanguageProvider>
              </SmoothScroll>
            </ThemeProvider>
          </ReactQueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}


