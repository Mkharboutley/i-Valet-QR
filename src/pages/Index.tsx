
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Users, Clock, BarChart3 } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Car,
      title: 'Valet Management',
      description: 'Streamlined vehicle pickup and delivery system',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      icon: Users,
      title: 'Driver Coordination',
      description: 'Efficient driver assignment and tracking',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-400/30'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Live status updates and ETA notifications',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-400/30'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive reporting and insights',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Hero Section */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
                <img 
                  src="/lovable-uploads/b2860a75-786b-473b-9558-918995cd240e.png" 
                  alt="iVALET" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-6">
              Welcome to iVALET System
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Professional valet management system with real-time tracking, voice messaging, 
              and comprehensive analytics for seamless vehicle service operations.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/dashboard">
                <Button className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-gray-200 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3 text-lg"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">System Features</h2>
          <p className="text-xl text-gray-300">Powerful tools for modern valet operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-black/30"
            >
              <div className={`p-4 rounded-xl ${feature.bgColor} ${feature.borderColor} border backdrop-blur-md mb-4 inline-block`}>
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black/20 backdrop-blur-xl border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of valet management with our comprehensive system.
            </p>
            <Link to="/dashboard">
              <Button className="bg-blue-600/70 backdrop-blur-md hover:bg-blue-600/90 text-white border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 px-8 py-3 text-lg">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
