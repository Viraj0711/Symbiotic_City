import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#059669', // Emerald-600
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]}`}
        style={{ color }}
      />
      {text && (
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  children,
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <LoadingSpinner text={text} size="lg" />
        </div>
      )}
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = false,
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 ${width} ${height} ${
        rounded ? 'rounded-full' : 'rounded'
      } ${className}`}
    />
  );
};

interface CardSkeletonProps {
  lines?: number;
  showImage?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  lines = 3,
  showImage = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      {showImage && <Skeleton className="mb-4" height="h-48" rounded={false} />}
      <Skeleton className="mb-3" height="h-6" width="w-3/4" />
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={index === lines - 1 ? 'w-1/2' : 'w-full'}
          height="h-4"
          width={index === lines - 1 ? 'w-1/2' : 'w-full'}
        />
      ))}
    </div>
  );
};

interface PageLoadingProps {
  title?: string;
  description?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading...',
  description = 'Please wait while we load the content.',
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="xl" text={title} />
        {description && (
          <p className="mt-4 text-gray-500 max-w-md mx-auto">{description}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;