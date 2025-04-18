/**
 * Utility functions for handling asset imports with fallbacks
 */

// Placeholder SVG for fallback
const PLACEHOLDER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z'/%3E%3C/svg%3E`;

/**
 * Safely imports an SVG with a fallback if it fails
 * 
 * @param importPath - The path to the SVG
 * @param onSuccess - Optional callback when the import succeeds
 * @returns A promise that resolves to the SVG source or a placeholder
 */
export async function importSvgWithFallback(
  importPath: string, 
  onSuccess?: (module: any) => void
): Promise<string> {
  try {
    // Try dynamic import
    const module = await import(/* @vite-ignore */ importPath);
    
    // Extract the SVG source
    const svgSrc = module.default?.src || module.default || PLACEHOLDER_SVG;
    
    // Call success callback if provided
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(module);
    }
    
    return svgSrc;
  } catch (error) {
    console.warn(`Failed to import SVG: ${importPath}`, error);
    return PLACEHOLDER_SVG;
  }
}

/**
 * Gets an SVG or placeholder synchronously (for use in render functions)
 * 
 * @param svgSrc - The current SVG source
 * @param fallbackText - Optional text to include in the fallback
 * @returns The SVG source or a placeholder
 */
export function getSvgOrPlaceholder(svgSrc: string | undefined, fallbackText?: string): string {
  if (svgSrc) return svgSrc;
  
  if (fallbackText) {
    // Create a custom SVG with the fallback text
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f2f2f2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='8' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3E${fallbackText}%3C/text%3E%3C/svg%3E`;
  }
  
  return PLACEHOLDER_SVG;
}

/**
 * Creates a style object for SVG backgrounds with mask
 * 
 * @param svgUrl - The SVG URL or data URI
 * @returns A style object for React components
 */
export function createSvgMaskStyle(svgUrl: string | undefined): React.CSSProperties {
  if (!svgUrl) return {};
  
  return {
    WebkitMask: `url("${svgUrl}") no-repeat center / contain`,
    mask: `url("${svgUrl}") no-repeat center / contain`,
    backgroundColor: 'currentColor'
  };
}
