/**
 * Environment Configuration
 * Centralized access to all environment variables with defaults
 */

// Firebase Configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// API Configuration
export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000, // 10 seconds default timeout
}

// Image & CDN Configuration
export const imageConfig = {
  placeholderBase: import.meta.env.VITE_PLACEHOLDER_IMAGE_BASE || 'https://via.placeholder.com',
  unsplashBase: import.meta.env.VITE_UNSPLASH_BASE_URL || 'https://images.unsplash.com',
}

// Default Images
export const defaultImages = {
  hero: import.meta.env.VITE_DEFAULT_HERO_IMAGE || 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop',
  challengesHero: import.meta.env.VITE_CHALLENGES_HERO_IMAGE || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2070&auto=format&fit=crop',
  eventsHero: import.meta.env.VITE_EVENTS_HERO_IMAGE || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=2070&auto=format&fit=crop',
  homeFeature: import.meta.env.VITE_HOME_FEATURE_IMAGE || 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=500&q=80',
  aboutHero: import.meta.env.VITE_ABOUT_HERO_IMAGE || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
  contactHero: import.meta.env.VITE_CONTACT_HERO_IMAGE || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop',
  tipsHero: import.meta.env.VITE_TIPS_HERO_IMAGE || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
  loginHero: import.meta.env.VITE_LOGIN_HERO_IMAGE || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2348&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  registerHero: import.meta.env.VITE_REGISTER_HERO_IMAGE || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2348&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
}

// App Configuration
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'EcoTrack',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'support@ecotrack.com',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
}

// Helper functions
export const utils = {
  /**
   * Generate placeholder image URL
   * @param {number} width - Image width
   * @param {number} height - Image height
   * @param {string} text - Text to display
   * @param {string} bgColor - Background color (hex without #)
   * @param {string} textColor - Text color (hex without #)
   */
  getPlaceholderImage: (width = 400, height = 300, text = '', bgColor = '10b981', textColor = 'ffffff') => {
    const encodedText = encodeURIComponent(text)
    return `${imageConfig.placeholderBase}/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`
  },

  /**
   * Check if all required environment variables are set
   */
  validateConfig: () => {
    const required = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
    ]

    const missing = required.filter(key => !import.meta.env[key])

    if (missing.length > 0) {
      return false
    }

    return true
  },

  /**
   * Get environment info for debugging
   */
  getEnvInfo: () => ({
    mode: appConfig.mode,
    isDevelopment: appConfig.isDevelopment,
    isProduction: appConfig.isProduction,
    apiBaseUrl: apiConfig.baseUrl,
    appName: appConfig.name,
    version: appConfig.version,
  })
}

// Default export with all configurations
export default {
  firebase: firebaseConfig,
  api: apiConfig,
  images: imageConfig,
  defaultImages,
  app: appConfig,
  utils
}