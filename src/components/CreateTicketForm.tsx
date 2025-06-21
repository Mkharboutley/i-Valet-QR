import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { createTicket, getLatestTicketNumber } from '../services/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { getFirestoreInstance } from '../services/firebase';
import { useQRCodeGeneration } from '../hooks/useQRCodeGeneration';
import { createTicketData } from '../utils/ticketUtils';
import TicketFormFields from './TicketFormFields';
import { assignFirstFreeSlot } from '../utils/slotUtils'; // ✅ NEW IMPORT

const CreateTicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generateQRCode } = useQRCodeGeneration();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    plateNumber: '',
    carModel: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const latestTicketNumber = await getLatestTicketNumber();
      const newTicketNumber = latestTicketNumber + 1;

      const newTicketData = createTicketData(
        newTicketNumber,
        formData.plateNumber,
        formData.carModel
      );

      // 🔹 Step 1: Create ticket
      const ticketId = await createTicket(newTicketData);
      const correctTicketUrl = `${window.location.origin}/ticket/${ticketId}`;

      const firestore = getFirestoreInstance();
      const ticketRef = doc(firestore, 'tickets', ticketId);

      // 🔹 Step 2: Assign first available parking slot
      const slotNumber = await assignFirstFreeSlot(ticketId);

      // 🔹 Step 3: Update ticket with slot (if available) + ticket_url
      await updateDoc(ticketRef, {
        ticket_url: correctTicketUrl,
        ...(slotNumber !== null && { slot_number: slotNumber })
      });

      // 🔹 Step 4: Generate QR Code
      const qrCodeUrl = await new Promise<string>((resolve, reject) => {
        generateQRCode(correctTicketUrl).then(() => {
          import('qrcode').then(QRCode => {
            QRCode.toDataURL(correctTicketUrl, {
              width: 400,
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            }).then(resolve).catch(reject);
          });
        }).catch(reject);
      });

      // 🔹 Step 5: Navigate to QR screen
      navigate('/qr-display', {
        state: {
          qrCodeUrl,
          ticketData: newTicketData
        }
      });

      // 🔹 Step 6: Reset form
      setFormData({ plateNumber: '', carModel: '' });

    } catch (err) {
      console.error('Error creating ticket:', err);
      setError('فشل في إنشاء البطاقة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TicketFormFields
      formData={formData}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default CreateTicketForm;
