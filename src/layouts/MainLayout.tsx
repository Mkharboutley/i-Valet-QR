
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDashboard = location.pathname === '/dashboard';
  const isTicketPage = location.pathname.startsWith('/ticket/');
  
  // Pages that should have no header at all
  const pagesWithNoHeader = ['/entry', '/create-ticket', '/scan-close'];
  // Show logo header on all pages except login, ticket pages, and pages with no header
  const shouldShowHeader = !isLoginPage && !isTicketPage && !pagesWithNoHeader.includes(location.pathname);

  if (isLoginPage || pagesWithNoHeader.includes(location.pathname) || isTicketPage) {
    return <>{children}</>;
  }

  return (
    <div className={`fixed-height-container ${isDashboard ? 'dashboard-content' : ''}`}>
      {/* Conditional header - shown on pages that need it */}
      {shouldShowHeader && (
        <header className="relative z-10 mobile-safe-top">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-center mobile-safe-left mobile-safe-right">
            <Link to="/dashboard">
              <Logo className="w-48 sm:w-64" />
            </Link>
          </div>
        </header>
      )}

      {/* Main Content with mobile optimizations */}
      <main className="flex-1 relative mobile-safe-bottom">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
