import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { doc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import InlineExitButton from '@/components/InlineExitButton';

const ScanClose: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const navigate = useNavigate();
  const db = getFirestoreInstance();

  const updateStatus = (message: string, type: 'success' | 'error') => {
    setStatusMsg(message);
    setStatusType(type);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      async (result) => {
        const decodedText = result.data;
        const match = decodedText.match(/\/ticket\/([a-zA-Z0-9-]+)/);

        if (!match) {
          return updateStatus('❌ رمز غير صالح', 'error');
        }

        const ticketId = match[1];

        try {
          const ticketRef = doc(db, 'tickets', ticketId);
          await updateDoc(ticketRef, {
            status: 'completed',
            completed_at: Timestamp.now()
          });

          updateStatus('✅ تم تسليم السيارة بنجاح', 'success');
          scanner.stop();
          
          // Return to entry page after success
          setTimeout(() => {
            navigate('/entry');
          }, 2000);
        } catch (err) {
          console.error('Firestore error:', err);
          updateStatus('⚠️ حدث خطأ أثناء تحديث الحالة', 'error');
        }
      },
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scanner.start().catch((err) => {
      console.error('Camera error:', err);
      updateStatus('📵 لا يمكن الوصول إلى الكاميرا', 'error');
    });

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [db, navigate]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Inline Exit Button - positioned with safe area */}
      <InlineExitButton className="fixed top-4 right-4 z-50" />
      
      {/* Camera View */}
      <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />

      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 animated-gradient opacity-30" />

      {/* Centered Content with Glass Morphism */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        {/* Glass morphism container for all content */}
        <div className="glass-card p-8 w-full max-w-sm space-y-6 text-center">
          {/* Header */}
          <h2 className="text-2xl font-bold text-white mb-6">
            امسح رمز QR لإغلاق البطاقة
          </h2>
          
          {/* Status Message */}
          {statusMsg && (
            <div className={`text-lg font-medium p-4 rounded-xl backdrop-blur-xl
              ${statusType === 'success' 
                ? 'bg-green-500/20 text-green-200 border border-green-500/30' 
                : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}
            >
              {statusMsg}
            </div>
          )}

          {/* Scanning Frame - Completely transparent with no blur */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Main scanning frame - removed glass morphism and blur */}
            <div className="w-full h-full border-2 border-white/10 rounded-3xl relative">
              {/* Animated scanning overlay - made completely transparent */}
              <div className="absolute inset-0 border-2 border-transparent rounded-3xl" />
              {/* Corner indicators - minimal visibility */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
            </div>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => navigate('/entry')}
            className="w-full glass-morphism hover:glass-morphism-strong text-white border border-white/20 rounded-xl h-12"
          >
            <ArrowRight className="h-5 w-5 ml-2" />
            رجوع
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanClose;