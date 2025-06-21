
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const NotificationsTab: React.FC = () => {
  return (
    <Card className="glass-morphism-strong rounded-2xl shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white font-light">System Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 border-l-4 border-yellow-400 glass-morphism rounded-r-xl border border-yellow-400/20">
          <p className="font-medium text-white mb-2 font-light">System Update Available</p>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            New voice messaging features are ready to install.
          </p>
        </div>
        <div className="p-6 border-l-4 border-green-400 glass-morphism rounded-r-xl border border-green-400/20">
          <p className="font-medium text-white mb-2 font-light">All Systems Operational</p>
          <p className="text-sm text-gray-300 leading-relaxed font-light">
            Voice messaging and real-time updates are working normally.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsTab;
