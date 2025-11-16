import toast from 'react-hot-toast'

/**
 * Centralized toast utility for consistent styling across the app
 */

// Custom toast styles
const toastStyles = {
  success: {
    style: {
      background: '#fff',
      border: '1px solid #d1fae5',
      borderRadius: '8px',
      padding: '16px',
      color: '#065f46',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    style: {
      background: '#fff',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      padding: '16px',
      color: '#991b1b',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
  loading: {
    style: {
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      color: '#374151',
    },
  },
}

// Success toast
export const showSuccess = (message) => {
  return toast.success(message, toastStyles.success)
}

// Error toast
export const showError = (message) => {
  return toast.error(message, toastStyles.error)
}

// Loading toast
export const showLoading = (message) => {
  return toast.loading(message, toastStyles.loading)
}

// Dismiss toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId)
}

// Confirmation dialog toast (delete, etc.)
export const showConfirmation = ({
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger', // 'danger' or 'warning'
}) => {
  const isDanger = type === 'danger'
  
  return toast(
    (t) => (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg 
            className={`w-5 h-5 mt-0.5 ${isDanger ? 'text-red-600' : 'text-amber-600'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1 mb-3">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                if (onCancel) onCancel()
              }}
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                if (onConfirm) await onConfirm()
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isDanger
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        background: '#fff',
        border: `1px solid ${isDanger ? '#fed7d7' : '#fef3c7'}`,
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
      },
    }
  )
}

// Delete confirmation (specific case)
export const showDeleteConfirmation = ({
  itemName = 'item',
  onConfirm,
  onCancel,
}) => {
  return showConfirmation({
    title: `Delete ${itemName}`,
    message: `Are you sure you want to delete this ${itemName.toLowerCase()}? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm,
    onCancel,
    type: 'danger',
  })
}

export default {
  success: showSuccess,
  error: showError,
  loading: showLoading,
  dismiss: dismissToast,
  confirmation: showConfirmation,
  deleteConfirmation: showDeleteConfirmation,
}
