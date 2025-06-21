
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const PermissionWarning: React.FC = () => {
  return (
    <Card className="mb-6 bg-yellow-500/20 glass-morphism-strong border border-yellow-400/30 shadow-2xl rounded-2xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-200 mb-2 font-light">Limited Admin Access</h3>
            <p className="text-sm text-yellow-300 leading-relaxed font-light">
              You are running in limited access mode. Some admin features like driver management and configuration 
              may not be fully available due to Firebase permission restrictions. Contact your system administrator 
              to configure proper Firestore security rules.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionWarning;
