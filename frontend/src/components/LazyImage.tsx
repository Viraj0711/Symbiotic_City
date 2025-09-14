import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from './LoadingSpinner';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  onLoad,
  onError,
  fallbackSrc,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
    
    // Try fallback image if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsError(false);
      setIsLoading(true);
      return;
    }
    
    onError?.();
  };

  const imageContent = isInView ? (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
    />
  ) : null;

  return (
    <div className="relative">
      {/* Placeholder or skeleton while loading */}
      {(isLoading || !isInView) && (
        <div className={`absolute inset-0 ${className}`}>
          {placeholder ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              {placeholder}
            </div>
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className={`absolute inset-0 ${className} bg-gray-100 flex items-center justify-center text-gray-400`}>
          <div className="text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Failed to load</span>
          </div>
        </div>
      )}

      {/* The actual image */}
      <div ref={imgRef}>
        {imageContent}
      </div>
    </div>
  );
};

export default LazyImage;