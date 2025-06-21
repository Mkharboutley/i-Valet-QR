
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-12 shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
              <Home className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button 
              variant="outline"
              className="w-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
