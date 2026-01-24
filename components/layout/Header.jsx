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
            <Link href="/" className="font-bold tracking-wide text-xl shrink-0" suppressHydrationWarning>
              Alrabie <span className="text-accent">Real Estate</span>
            </Link>

            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-neutral-200" suppressHydrationWarning>
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
            <div className="flex items-center gap-4 shrink-0" suppressHydrationWarning>
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
                className="lg:hidden text-2xl text-white hover:text-accent transition-colors p-2"
                onClick={() => setOpen(true)}
              >
                ☰
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
          className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-black border-l border-white/10 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`}
          aria-label="Mobile Menu"
        >
          <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/5">
            <span className="font-bold text-lg tracking-tight uppercase text-neutral-400">Navigation</span>
            <button
              aria-label="Close Menu"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
              onClick={() => setOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100%-80px)]">
            <div className="space-y-1 mb-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-4 rounded-xl transition-all duration-200 group ${pathname === item.href
                      ? 'bg-accent text-white font-bold shadow-lg shadow-accent/20'
                      : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                    }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="flex-1">{item.label}</span>
                  {pathname === item.href && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-6 border-t border-white/10 mt-2 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-widest mb-1">Signed in as</div>
                    <div className="text-white font-semibold">{user?.name}</div>
                    <div className="text-accent text-xs font-medium uppercase mt-0.5">{user?.role}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {isAdmin() && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors border border-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="mr-3">🏠</span> Dashboard
                        </Link>
                        <Link
                          href="/admin/leads"
                          className="flex items-center px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors border border-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="mr-3">📞</span> Leads
                          {notificationCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-[10px] font-bold shadow-lg">
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/admin/reports"
                          className="flex items-center px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors border border-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="mr-3">📊</span> Reports
                        </Link>
                      </>
                    )}
                    {isBroker() && (
                      <>
                        <Link
                          href="/broker/dashboard"
                          className="flex items-center px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors border border-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="mr-3">🏠</span> Dashboard
                        </Link>
                        <Link
                          href="/broker/leads"
                          className="flex items-center px-4 py-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors border border-white/5"
                          onClick={() => setOpen(false)}
                        >
                          <span className="mr-3">📞</span> Leads
                          {notificationCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-[10px] font-bold shadow-lg">
                              {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                          )}
                        </Link>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium border border-red-500/10"
                  >
                    <span className="mr-3">🚪</span> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 p-2">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-4 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors font-bold text-sm border border-white/5"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleRegisterClick();
                      setOpen(false);
                    }}
                    className="flex items-center justify-center px-4 py-4 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all font-bold text-sm shadow-lg shadow-accent/20"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </nav>
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


