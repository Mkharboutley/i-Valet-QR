
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  hasPermissionError: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ hasPermissionError }) => {
  const navigate = useNavigate();

  return (
    <header className="glass-morphism-strong border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex-1">
            {hasPermissionError && (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-light">Limited access mode - Some admin features may be restricted</span>
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={() => navigate('/test-voice')}
              variant="outline"
              className="glass-morphism hover:glass-morphism-strong border-white/20 hover:border-white/30 text-gray-200 hover:text-white transition-all duration-300 font-light"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Test Voice
            </Button>
            <Button 
              onClick={() => navigate('/create-ticket')}
              className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 font-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
