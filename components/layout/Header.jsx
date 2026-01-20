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
                  className={`hover:text-accent focus-ring transition-all duration-200 pb-1 border-b-2 ${
                    pathname === item.href 
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
          className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-neutral-900 border-l border-white/10 transform transition-transform z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}
          aria-label="Mobile Menu"
        >
          <div className="p-4 flex items-center justify-between">
            <span className="font-semibold">Menu</span>
            <button aria-label="Close Menu" className="focus-ring" onClick={() => setOpen(false)}>✕</button>
          </div>
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`px-3 py-2 rounded hover:bg-white/5 focus-ring transition-colors ${
                  pathname === item.href ? 'bg-white/5 text-accent' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t border-white/10 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-neutral-300">
                    Welcome, {user?.name}
                  </div>
                  {isAdmin() && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/leads"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring relative"
                        onClick={() => setOpen(false)}
                      >
                        Leads
                        {notificationCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-bold">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/admin/approvals"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring"
                        onClick={() => setOpen(false)}
                      >
                        Approvals
                      </Link>
                      <Link
                        href="/admin/reports"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring"
                        onClick={() => setOpen(false)}
                      >
                        📊 Monthly Reports
                      </Link>
                    </>
                  )}
                  {isBroker() && (
                    <>
                      <Link
                        href="/broker/dashboard"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/broker/leads"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring relative"
                        onClick={() => setOpen(false)}
                      >
                        Leads
                        {notificationCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-bold">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/broker/add-property"
                        className="block px-3 py-2 rounded hover:bg-white/5 focus-ring"
                        onClick={() => setOpen(false)}
                      >
                        + Add Property
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-white/5 focus-ring"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      handleLoginClick();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-white/5 focus-ring"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      handleRegisterClick();
                      setOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-white/5 focus-ring"
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


