import { lazy } from 'react';

// Performance utilities

// Lazy load components with timeout fallback
export function createLazyComponent<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(() => {
    return Promise.race([
      factory(),
      new Promise<{ default: T }>((_, reject) =>
        setTimeout(() => reject(new Error('Component load timeout')), 10000)
      )
    ]);
  });

  return LazyComponent;
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Preload critical assets
export function preloadAssets(assets: string[]): Promise<void[]> {
  return Promise.all(assets.map(preloadImage));
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Throttle scroll events
export function throttleScroll(callback: () => void, delay: number = 16) {
  let isThrottled = false;
  
  return () => {
    if (!isThrottled) {
      isThrottled = true;
      requestAnimationFrame(() => {
        callback();
        isThrottled = false;
      });
    }
  };
}

// Critical resource preloader with DNS prefetch
export function preloadCriticalResources() {
  if (typeof window !== 'undefined') {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com', 
      'images.unsplash.com',
      'unsplash.com'
    ];
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
    
    // Preconnect to critical domains
    const preconnectDomains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${domain}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // Preload hero video
    const videoLink = document.createElement('link');
    videoLink.rel = 'preload';
    videoLink.as = 'video';
    videoLink.href = '/attached_assets/Alashore-Marine-Factory_1755929476699.mp4';
    document.head.appendChild(videoLink);
    
    // Preload critical images
    const criticalImages = [
      '/attached_assets/shrimp-optimized.webp',
      '/attached_assets/generated_images/Fresh_pomfret_fish_2d9ae908.png',
      '/attached_assets/generated_images/Fresh_sheer_fish_527da6a7.png'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Optimized web vitals monitoring with reduced logging
let clsTimeout: NodeJS.Timeout;
export function measureWebVitals() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure First Contentful Paint
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('FCP:', entry.startTime);
        }
        if (entry.name === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
      }
    });
    
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    
    // Debounced CLS measurement to reduce console spam
    let cumulativeLayoutShiftScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cumulativeLayoutShiftScore += (entry as any).value;
        }
      }
      
      // Debounce CLS logging to reduce spam
      clearTimeout(clsTimeout);
      clsTimeout = setTimeout(() => {
        if (cumulativeLayoutShiftScore > 0.1) {
          console.warn('High CLS detected:', cumulativeLayoutShiftScore);
        }
      }, 1000);
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

// Initialize all performance optimizations
export function initializePerformance() {
  if (typeof window !== 'undefined') {
    // Run critical optimizations immediately
    preloadCriticalResources();
    
    // Run monitoring after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', measureWebVitals);
    } else {
      measureWebVitals();
    }
    
    // Prefetch likely next pages on hover
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
      if (link && !link.dataset.prefetched) {
        link.dataset.prefetched = 'true';
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }
    });
  }
}

// Reduce layout shifts by setting explicit dimensions
export function preventLayoutShifts() {
  // Set explicit dimensions for images to prevent CLS
  const style = document.createElement('style');
  style.textContent = `
    img:not([width]):not([height]) {
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
    
    /* Prevent font swap flash */
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    
    /* Optimize animations for performance */
    * {
      will-change: auto;
    }
    
    .animate-in {
      will-change: transform, opacity;
    }
    
    .animate-in.complete {
      will-change: auto;
    }
  `;
  document.head.appendChild(style);
}