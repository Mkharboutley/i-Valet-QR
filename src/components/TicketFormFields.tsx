import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, AlertCircle, MapPin } from 'lucide-react';

interface FormData {
  plateNumber: string;
  carModel: string;
  slot_number?: number; // ✅ NEW
}

interface TicketFormFieldsProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string;
}

const TicketFormFields: React.FC<TicketFormFieldsProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isLoading,
  error
}) => {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <Car className="h-5 w-5" />
          أدخل معلومات السيارة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" dir="rtl">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="plateNumber">رقم اللوحة</Label>
            <Input
              id="plateNumber"
              value={formData.plateNumber}
              onChange={(e) => onInputChange('plateNumber', e.target.value)}
              className="text-center text-lg font-medium"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carModel">موديل السيارة</Label>
            <Input
              id="carModel"
              value={formData.carModel}
              onChange={(e) => onInputChange('carModel', e.target.value)}
              className="text-center text-lg font-medium"
              required
            />
          </div>

          {/* ✅ Display assigned slot if present */}
          {formData.slot_number !== undefined && (
            <div className="bg-green-100 border border-green-300 text-green-800 rounded-md px-4 py-2 text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              تم حجز موقف رقم <strong>{formData.slot_number}</strong>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            variant="gradient"
            size="lg"
            className="w-full mt-4"
          >
            {isLoading ? 'جاري الإنشاء...' : 'إنشاء البطاقة'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TicketFormFields;
