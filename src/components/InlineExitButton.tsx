
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAuthInstance } from '../services/firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InlineExitButtonProps {
  className?: string;
}

const InlineExitButton: React.FC<InlineExitButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const auth = getAuthInstance();
      await signOut(auth);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        description: "نراك قريباً"
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "خطأ في تسجيل الخروج",
        description: "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className={`
        w-10 h-10 rounded-full 
        bg-white/10 hover:bg-white/20 
        backdrop-blur-xl border border-white/20 
        shadow-[0_8px_32px_rgba(0,0,0,0.2)]
        hover:shadow-[0_8px_48px_rgba(0,0,0,0.3)] 
        transition-all duration-300
        text-white
        active:scale-95
        flex items-center justify-center
        ${className}
      `}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
};

export default InlineExitButton;
