
import { useState } from 'react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

export const useQRCodeGeneration = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { toast } = useToast();

  const generateQRCode = async (url: string): Promise<void> => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء رمز QR",
        variant: "destructive"
      });
    }
  };

  const resetQRCode = () => {
    setQrCodeUrl('');
  };

  return {
    qrCodeUrl,
    generateQRCode,
    resetQRCode
  };
};
