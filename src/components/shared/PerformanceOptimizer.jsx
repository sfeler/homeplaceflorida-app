import { useEffect } from 'react';

/**
 * Performance Optimizer Component
 * Handles various performance optimizations for Core Web Vitals
 */
export default function PerformanceOptimizer() {
  useEffect(() => {
    // 1. Preconnect to external domains
    const preconnectDomains = [
      'https://client.crisp.chat',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // 2. DNS prefetch for external resources
    const dnsPrefetchDomains = [
      'https://images.unsplash.com',
      'https://www.youtube.com'
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // 3. Lazy load images with Intersection Observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));

    // 4. Optimize font loading
    if ('fonts' in document) {
      // Preload critical fonts
      const fontFaces = [
        new FontFace('Inter', 'url(/fonts/inter.woff2)', {
          weight: '400',
          style: 'normal',
          display: 'swap'
        })
      ];

      fontFaces.forEach(fontFace => {
        fontFace.load().then(loadedFont => {
          document.fonts.add(loadedFont);
        }).catch(err => {
          console.warn('Font loading failed:', err);
        });
      });
    }

    // 5. Prefetch critical pages on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const criticalPages = ['/Listings', '/About', '/Contact'];
        criticalPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      });
    }

    // 6. Monitor Core Web Vitals (if available)
    if ('web-vital' in window || typeof window.webVitals !== 'undefined') {
      // Web Vitals monitoring would go here
      // This is a placeholder for future implementation
    }

    // 7. Reduce layout shift by setting image dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      if (!img.hasAttribute('width') && !img.hasAttribute('height')) {
        img.style.aspectRatio = 'auto';
      }
    });

    // 8. Optimize third-party scripts
    // Delay non-critical scripts until after page load
    const delayScripts = () => {
      const scripts = document.querySelectorAll('script[data-delay]');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          if (attr.name !== 'data-delay') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });
        newScript.textContent = script.textContent;
        script.parentNode.replaceChild(newScript, script);
      });
    };

    // Delay script loading until page is interactive
    if (document.readyState === 'complete') {
      delayScripts();
    } else {
      window.addEventListener('load', delayScripts);
    }

    // 9. Service Worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          registration => {
            console.log('ServiceWorker registration successful:', registration.scope);
          },
          err => {
            console.log('ServiceWorker registration failed:', err);
          }
        );
      });
    }

    // 10. Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
}

/**
 * Image component with lazy loading and optimization
 */
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  loading = 'lazy',
  ...props 
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
      {...props}
    />
  );
}

/**
 * Link component with prefetch on hover
 */
export function PrefetchLink({ href, children, ...props }) {
  const handleMouseEnter = () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  return (
    <a href={href} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </a>
  );
}

/**
 * Defer component rendering until idle
 */
export function DeferredComponent({ children, fallback = null }) {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        setShouldRender(true);
      });
    } else {
      setTimeout(() => {
        setShouldRender(true);
      }, 1);
    }
  }, []);

  return shouldRender ? children : fallback;
}

