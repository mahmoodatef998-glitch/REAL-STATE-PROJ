"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLeadNotifications } from '../../hooks/useLeads';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isAdmin, isBroker } = useAuth();
  const { data: notificationCount = 0 } = useLeadNotifications(isAuthenticated && (isBroker || isAdmin));

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl glass-effect rounded-2xl px-6 py-4 flex items-center justify-between" suppressHydrationWarning>
        {/* Logo */}
        <Link href="/" className="font-bold tracking-tighter text-xl shrink-0 text-white group" suppressHydrationWarning>
          Alrabie <span className="text-accent group-hover:text-white transition-colors">Real Estate</span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-white/70" suppressHydrationWarning>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-white transition-all duration-300 ${pathname === item.href ? 'text-white' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4">
              {(isAdmin() || isBroker()) && (
                <Link
                  href={isAdmin() ? "/admin/dashboard" : "/broker/dashboard"}
                  className="px-4 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 rounded-xl text-xs font-bold text-accent transition-all"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-white/60 text-xs font-medium uppercase tracking-widest">{user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-white/70 hover:text-white text-xs font-bold transition-all"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-5 py-2.5 bg-accent hover:bg-accent/80 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-accent/20"
              >
                Join Now
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-28 z-[49] lg:hidden glass-effect rounded-3xl p-8 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-bold tracking-tight ${pathname === item.href ? 'text-accent' : 'text-white/70'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {(isAdmin() || isBroker()) && (
                    <Link
                      href={isAdmin() ? "/admin/dashboard" : "/broker/dashboard"}
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-4 bg-accent text-white rounded-2xl font-bold text-center"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-bold"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }}
                    className="py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setShowRegisterModal(true); setIsMenuOpen(false); }}
                    className="py-4 bg-accent text-white rounded-2xl text-sm font-bold"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
      />
    </>
  );
}
