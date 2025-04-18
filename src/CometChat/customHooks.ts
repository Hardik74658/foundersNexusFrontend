import { useEffect, useState } from 'react';

/**
 * Custom hook to detect system color scheme preference (light or dark)
 * 
 * @returns {'light' | 'dark'} The current system color scheme
 */
export default function useSystemColorScheme(): 'light' | 'dark' {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Safari & older browsers
    else if (mediaQuery.addListener) {
      // @ts-ignore - For compatibility with older browsers
      mediaQuery.addListener(handleChange);
      return () => {
        // @ts-ignore - For compatibility with older browsers
        mediaQuery.removeListener(handleChange);
      };
    }
  }, []);

  return colorScheme;
}
