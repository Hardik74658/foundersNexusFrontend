import { CometChat } from '@cometchat/chat-sdk-javascript';

/**
 * This function blends two colors by percentage.
 * @param {string} color - The base color in hex format
 * @param {number} percentage - Percentage to blend
 * @param {string} blendWith - The color to blend with in hex format
 * @returns {string} - The blended color in hex format
 */
function blendColorWith(color: string, percentage: number, blendWith: string): string {
  try {
    const baseR = parseInt(color.substring(1, 3), 16);
    const baseG = parseInt(color.substring(3, 5), 16);
    const baseB = parseInt(color.substring(5, 7), 16);

    const blendR = parseInt(blendWith.substring(1, 3), 16);
    const blendG = parseInt(blendWith.substring(3, 5), 16);
    const blendB = parseInt(blendWith.substring(5, 7), 16);

    const newR = Math.min(Math.max(0, Math.round(baseR + (blendR - baseR) * (percentage / 100))), 255)
      .toString(16)
      .padStart(2, '0');
    const newG = Math.min(Math.max(0, Math.round(baseG + (blendG - baseG) * (percentage / 100))), 255)
      .toString(16)
      .padStart(2, '0');
    const newB = Math.min(Math.max(0, Math.round(baseB + (blendB - baseB) * (percentage / 100))), 255)
      .toString(16)
      .padStart(2, '0');

    return `#${newR}${newG}${newB}`;
  } catch (error) {
    console.warn('Error in blendColorWith:', error);
    return color; // Return original color if blending fails
  }
}

/**
 * Generates extended primary colors based on the primary color
 */
export function generateExtendedColors(): void {
  try {
    // Get the theme mode
    const isDarkMode = document.querySelector('[data-theme="dark"]') !== null;
    
    // Find the root element
    const root = document.documentElement;
    if (!root) return;
    
    // Get primary color from CSS variable
    const primaryColor = getComputedStyle(root).getPropertyValue('--cometchat-primary-color').trim() || '#6852D6';
    
    if (!primaryColor) return;
    
    // Define color blending percentages based on theme
    const lightModePercentages = [100, 88, 77, 66, 55, 44, 33, 22, 11, 11];
    const darkModePercentages = [80, 72, 64, 56, 48, 40, 32, 24, 16, 8];
    const percentages = isDarkMode ? darkModePercentages : lightModePercentages;
    
    // Colors to blend with
    const blendColor = isDarkMode ? '#000000' : '#FFFFFF';
    const lastBlendColor = !isDarkMode ? '#000000' : '#FFFFFF';
    
    // Generate and set extended colors
    let extendedVar: number;
    percentages.forEach((percentage, index) => {
      const isLastIndex = index === percentages.length - 1;
      const color = isLastIndex ? lastBlendColor : blendColor;
      
      if (index === 0) {
        extendedVar = 50;
      } else if (index === 1) {
        extendedVar = 100;
      } else {
        extendedVar += 100;
      }
      
      const adjustedColor = blendColorWith(primaryColor, percentage, color);
      root.style.setProperty(`--cometchat-extended-primary-color-${extendedVar}`, adjustedColor);
    });
  } catch (error) {
    console.warn('Error in generateExtendedColors:', error);
  }
}

/**
 * Gets a localized string
 * @param {string} key - The localization key
 * @returns {string} - The localized string or the key itself if not found
 */
export function getLocalizedString(key: string): string {
  // Simple implementation that just returns the key
  return key;
}

/**
 * Setup localization - this is a stub that doesn't actually call setLanguage
 * since it's not available in the library
 * @param {string} language - The language code
 */
export function setupLocalization(language = 'en'): void {
  // Simply log that we're setting up localization
  console.log(`Setting up localization for language: ${language}`);
  // Don't try to call any methods that don't exist
}

// Add type definition for CometChat user status
export enum CometChatUserStatus {
  ONLINE = "online",
  OFFLINE = "offline"
}

/**
 * Get user status text based on status
 * @param {CometChat.User} user - The CometChat user
 * @returns {string} - The status text
 */
export function getUserStatusText(user: CometChat.User): string {
  if (!user) return "";
  
  const status = user.getStatus();
  return status === CometChatUserStatus.ONLINE ? "Online" : "Offline";
}
