"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLeadNotifications } from '../../hooks/useLeads';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout, canManageProperties, isAdmin, isBroker } = useAuth();

  // Fetch notification count for brokers/admins only when authenticated
  const { data: notificationCount = 0 } = useLeadNotifications(isAuthenticated && (isBroker || isAdmin));

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-900/95 border-b border-white/10 shadow-lg" suppressHydrationWarning>
        <div className="container-x" suppressHydrationWarning>
          <div className="flex items-center justify-between h-20 gap-8" suppressHydrationWarning>
            {/* Logo */}
            <Link href="/" className="font-bold tracking-tight text-lg sm:text-xl shrink-0" suppressHydrationWarning>
              Alrabie <span className="text-accent underline decoration-accent/30 underline-offset-4">Real Estate</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-medium text-neutral-200" suppressHydrationWarning>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-accent focus-ring transition-all duration-200 pb-1 border-b-2 ${pathname === item.href
                    ? 'text-accent border-accent'
                    : 'border-transparent hover:border-accent/50'
                    }`}
                  suppressHydrationWarning
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth Section */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0" suppressHydrationWarning>
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-neutral-800/60 rounded-lg border border-neutral-700" suppressHydrationWarning>
                    <div className="flex flex-col items-end">
                      <span className="text-white font-semibold text-sm">{user?.name}</span>
                      <span className="text-accent text-xs font-medium uppercase tracking-wide">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {isAdmin() && (
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-neutral-800/40 rounded-lg border border-neutral-700">
                      <Link
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-md hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/leads"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md relative"
                      >
                        Leads
                        {notificationCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold shadow-lg">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/admin/approvals"
                        className="px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-md hover:bg-yellow-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Approvals
                      </Link>
                      <Link
                        href="/admin/reports"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <span>📊</span>
                        <span>Reports</span>
                      </Link>
                    </div>
                  )}

                  {/* Broker Actions */}
                  {isBroker() && (
                    <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-neutral-800/40 rounded-lg border border-neutral-700">
                      <Link
                        href="/broker/dashboard"
                        className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-md hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/broker/leads"
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md relative"
                      >
                        Leads
                        {notificationCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold shadow-lg">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/broker/add-property"
                        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        + Add Property
                      </Link>
                    </div>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="hidden lg:block px-5 py-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 text-sm font-medium border border-transparent hover:border-neutral-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <button
                    onClick={handleLoginClick}
                    className="px-5 py-2.5 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg transition-all duration-200 text-sm font-medium border border-transparent hover:border-neutral-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="px-6 py-2.5 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                  >
                    Register
                  </button>
                </div>
              )}

              <button
                aria-label="Open Menu"
                className="lg:hidden text-white hover:text-accent transition-all p-2 bg-white/5 rounded-lg active:scale-95 border border-white/10"
                onClick={() => setOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {open && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed top-0 right-0 h-screen w-[280px] bg-neutral-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-[100] ${open ? 'translate-x-0' : 'translate-x-full'}`}
          aria-label="Mobile Menu"
        >
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-neutral-800/20">
              <span className="font-bold text-sm tracking-widest uppercase text-neutral-400">Navigation</span>
              <button
                aria-label="Close Menu"
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
                onClick={() => setOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pt-4">
              <nav className="px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${pathname === item.href
                        ? 'bg-accent/10 text-accent font-bold border border-accent/20'
                        : 'text-neutral-200 hover:bg-white/5 hover:text-white'
                      }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="px-4 mt-6">
                <div className="h-px bg-white/5" />
              </div>

              {isAuthenticated && (
                <div className="p-4 space-y-3">
                  <div className="px-4 py-3 bg-neutral-800/30 rounded-xl border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase font-black tracking-widest mb-1">Account</div>
                    <div className="text-white font-bold text-sm truncate">{user?.name}</div>
                    <div className="text-accent text-[11px] font-bold uppercase mt-0.5">{user?.role}</div>
                  </div>

                  <div className="space-y-1">
                    {isAdmin() && (
                      <div className="grid grid-cols-1 gap-1.5">
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          🏰 Dashboard
                        </Link>
                        <Link
                          href="/admin/leads"
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-2">📞 Leads</span>
                          {notificationCount > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-[10px] font-bold text-white">
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/admin/approvals"
                          className="flex items-center px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          ✅ Approvals
                        </Link>
                        <Link
                          href="/admin/reports"
                          className="flex items-center px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          📊 Reports
                        </Link>
                      </div>
                    )}
                    {isBroker() && (
                      <div className="grid grid-cols-1 gap-1.5">
                        <Link
                          href="/broker/dashboard"
                          className="flex items-center px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          🏠 Dashboard
                        </Link>
                        <Link
                          href="/broker/leads"
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-800/40 text-neutral-200 hover:text-white border border-white/5 text-sm font-medium"
                          onClick={() => setOpen(false)}
                        >
                          <span className="flex items-center gap-2">📞 Leads</span>
                          {notificationCount > 0 && (
                            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-[10px] font-bold text-white">
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/broker/add-property"
                          className="flex items-center px-4 py-3 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/20 text-sm font-bold"
                          onClick={() => setOpen(false)}
                        >
                          ➕ Add Property
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-neutral-800/20">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm border border-red-500/10"
                >
                  Sign Out
                </button>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors font-bold text-sm border border-white/5"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleRegisterClick();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all font-bold text-sm shadow-xl shadow-accent/20"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={handleCloseModals}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}


