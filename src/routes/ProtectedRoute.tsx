import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../services/userRoleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email);
      if (user) {
        setAuthenticated(true);
        try {
          const role = await getUserRole();
          console.log('User role:', role);
          setUserRole(role);
        } catch (error) {
          console.error('Error getting user role:', error);
          setUserRole('user'); // Default to user
        }
      } else {
        setAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="text-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Always redirect to login if not authenticated, except for the login page itself
  if (!authenticated && location.pathname !== '/login') {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Prevent authenticated users from accessing login page
  if (authenticated && location.pathname === '/login') {
    return <Navigate to={userRole === 'admin' ? '/dashboard' : '/entry'} replace />;
  }

  // Role-based route protection
  if (authenticated && userRole) {
    const adminOnlyPaths = ['/dashboard', '/test-voice'];
    const isAdminPath = adminOnlyPaths.some(path => location.pathname.startsWith(path));
    
    if (isAdminPath && userRole !== 'admin') {
      return <Navigate to="/entry\" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;