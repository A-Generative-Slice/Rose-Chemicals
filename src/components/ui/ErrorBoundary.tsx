'use client';

import React from 'react';
import { ExclamationTriangleIcon, XCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryProps {
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  showRetry?: boolean;
  onRetry?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  type = 'error',
  showRetry = true,
  onRetry,
  className = '',
  children
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <ExclamationTriangleIcon className="w-12 h-12 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      case 'info':
        return <InformationCircleIcon className="w-12 h-12 text-blue-500" />;
      default:
        return <XCircleIcon className="w-12 h-12 text-red-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className={`rounded-lg border-2 p-8 max-w-md w-full text-center ${getBackgroundColor()}`}>
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {children}
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorBoundary;
