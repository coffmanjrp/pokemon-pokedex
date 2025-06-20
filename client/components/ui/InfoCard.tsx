import React from 'react';

interface InfoCardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses = {
  default: 'bg-white rounded-lg shadow-sm border border-gray-100',
  outlined: 'bg-white border border-gray-200 rounded-lg',
  filled: 'bg-gray-50 border border-gray-100 rounded-lg',
};

export function InfoCard({ 
  title, 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}: InfoCardProps) {
  const baseClasses = variantClasses[variant];
  const paddingClasses = sizeClasses[size];
  
  return (
    <div className={`${baseClasses} ${paddingClasses} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}