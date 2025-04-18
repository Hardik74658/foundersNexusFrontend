import React, { useEffect, useState } from 'react';

// SVG placeholder for fallbacks
const SVG_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Cpath d='M12 6v3m0 6v3M6 12h3m6 0h3' stroke='%23999' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E`;

/**
 * A React hook to safely load SVG assets with fallback
 * 
 * @param path - Path to the SVG file
 * @returns The SVG URL or a placeholder if loading fails
 */
export function useSvgAsset(path: string): string {
  const [svgUrl, setSvgUrl] = useState<string>(SVG_PLACEHOLDER);
  
  useEffect(() => {
    let isMounted = true;
    
    const loadSvg = async () => {
      try {
        // Handle different import formats
        const module = await import(/* @vite-ignore */ path);
        const url = module.default?.src || module.default || SVG_PLACEHOLDER;
        
        if (isMounted) {
          setSvgUrl(url);
        }
      } catch (error) {
        console.warn(`Failed to load SVG from path: ${path}`, error);
        if (isMounted) {
          setSvgUrl(SVG_PLACEHOLDER);
        }
      }
    };
    
    loadSvg();
    
    return () => {
      isMounted = false;
    };
  }, [path]);
  
  return svgUrl;
}

/**
 * A React component that displays an SVG with fallback
 */
export const SvgIcon: React.FC<{
  path: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ path, alt = 'icon', className = '', style = {} }) => {
  const svgUrl = useSvgAsset(path);
  
  return (
    <div 
      className={`svg-icon ${className}`}
      style={{
        ...style,
        WebkitMask: `url(${svgUrl}) no-repeat center / contain`,
        mask: `url(${svgUrl}) no-repeat center / contain`,
        backgroundColor: 'currentColor'
      }}
      role="img"
      aria-label={alt}
    />
  );
};

/**
 * Creates a style object for SVG background with proper fallback
 */
export function createSvgStyle(path: string): React.CSSProperties {
  return {
    WebkitMask: `url(${path}) no-repeat center / contain`,
    mask: `url(${path}) no-repeat center / contain`,
    backgroundColor: 'currentColor'
  };
}
