import React from 'react';
import { QrCode } from 'lucide-react';

const QRScannerArea: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <QrCode className="h-16 w-16 text-white/60" />
      <p className="text-white/60 text-center text-sm">
        امسح رمز QR أو أدخل التفاصيل أدناه
      </p>
    </div>
  );
};

export default QRScannerArea;