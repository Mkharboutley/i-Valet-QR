import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from '../services/firebase';
import { getUserRole } from '../services/userRoleUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Logo from '@/components/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole();
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام iVALET"
      });

      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/entry', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى التحقق من البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] relative bg-[#0a0f1a] flex items-center justify-center overflow-hidden">
      {/* Animated background with gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.9),rgba(17,24,39,1))]" />
        <div className="absolute inset-0">
          {/* Animated glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-[128px] animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px] animate-pulse delay-1000" />
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md relative z-10 p-6">
        {/* Logo */}
        <div className="text-center mb-16 px-8">
          <Logo className="w-full animate-fade-in" />
        </div>

        {/* Login Form Card */}
        <div className="bg-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/[0.1]">
          <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
            <div className="space-y-5">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="h-14 bg-white/[0.05] border-white/[0.1] text-white placeholder:text-gray-400 text-right text-lg rounded-2xl px-6
                  focus:bg-white/[0.08] focus:border-white/[0.15] transition-all duration-300"
                required
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="h-14 bg-white/[0.05] border-white/[0.1] text-white placeholder:text-gray-400 text-right text-lg rounded-2xl px-6
                  focus:bg-white/[0.08] focus:border-white/[0.15] transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-14 text-lg rounded-2xl transition-all duration-500 transform
                ${isLoading 
                  ? 'bg-gray-600/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 hover:scale-[1.02]'
                }
                backdrop-blur-xl border-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]
                text-white font-medium`}
            >
              {isLoading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;