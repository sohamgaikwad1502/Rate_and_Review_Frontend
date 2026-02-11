import React from 'react';

const LoadingSpinner = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
  };

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div
        className={`animate-spin rounded-full border-gray-200 border-t-primary-600 ${sizeClasses[size]}`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;