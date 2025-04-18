/**
 * Safely imports a file with fallback for error handling
 */

// Placeholder for SVG files when import fails
const SVG_PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Crect width='24' height='24' fill='%23f0f0f0'/%3E%3Cpath d='M12 6v3m0 6v3M6 12h3m6 0h3' stroke='%23999' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E`;

/**
 * Safely imports a module with error handling
 * 
 * @param importPath - Path to the module to import
 * @param setStateCallback - Function to set state with the imported module
 * @param fallback - Optional fallback value if import fails
 */
export function safeImport<T>(
  importPath: string, 
  setStateCallback: (value: T) => void,
  fallback: T = SVG_PLACEHOLDER as unknown as T
): void {
  import(/* @vite-ignore */ importPath)
    .then((module: any) => {
      // Handle different module formats
      const value = module.default?.src || module.default || fallback;
      setStateCallback(value as T);
    })
    .catch((error) => {
      console.warn(`Failed to import: ${importPath}`, error);
      setStateCallback(fallback);
    });
}

/**
 * Creates a handler function for safely importing SVGs
 * 
 * @param setStateFunction - The state setter function
 * @returns A function that imports the SVG and updates state
 */
export function createSvgImportHandler(
  setStateFunction: (value: string | undefined) => void
): (importPath: string) => void {
  return (importPath: string) => {
    safeImport<string | undefined>(
      importPath, 
      setStateFunction, 
      SVG_PLACEHOLDER
    );
  };
}
