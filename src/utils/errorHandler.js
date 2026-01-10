import { showError } from './toast'

/**
 * Standardized error handler for mutations
 * Extracts error messages from different error formats and displays toast
 *
 * @param {Error} error - The error object from mutation
 * @param {string} fallbackMessage - Default message if no specific error found
 */
export function handleMutationError(error, fallbackMessage = 'Operation failed') {
  const message = error?.response?.data?.error?.message || error?.message || fallbackMessage
  showError(message)

  // Log to error tracking service in production
  if (import.meta.env.PROD) {
    // Example: window.errorTracker?.log(error)
  }
}

export default handleMutationError
