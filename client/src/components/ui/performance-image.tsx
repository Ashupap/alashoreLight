import { useState, useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";

interface PerformanceImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: "lazy" | "eager";
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export const PerformanceImage = memo(function PerformanceImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxZjI5Mzc7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTQ0ZTRhO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWQpIi8+PC9zdmc+",
  onLoad,
  onError,
  loading = "lazy",
  style,
  width,
  height,
  aspectRatio,
}: PerformanceImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Calculate container styles to prevent layout shifts
  const containerStyle = {
    ...style,
    aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined),
    width: width || style?.width,
    height: height || style?.height,
  };

  return (
    <div 
      ref={imgRef} 
      className={`relative ${className?.includes('absolute') ? '' : 'overflow-hidden'}`}
      style={containerStyle}
    >
      {/* Invisible seamless loading background */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-transparent via-slate-600/5 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent" />
        </div>
      )}
      
      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          sizes={sizes}
          width={width}
          height={height}
          className={className || "w-full h-full object-contain"}
          style={{ 
            willChange: isLoaded ? 'auto' : 'opacity',
            transform: 'translateZ(0)',
            imageRendering: 'crisp-edges',
            backfaceVisibility: 'hidden',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : loading}
          decoding="async"
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
});