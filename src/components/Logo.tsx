
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <img 
        src="/lovable-uploads/0497bb70-1b84-4cff-b0f6-0cff13bd15fe.png"
        alt="iVALET"
        className="w-full h-auto logo-elegant-animation"
      />
    </div>
  );
};

export default Logo;
