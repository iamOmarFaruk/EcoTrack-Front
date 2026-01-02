import toast from 'react-hot-toast'

/**
 * Centralized toast utility for consistent styling across the app
 */

// Custom toast styles
const toastStyles = {
  success: {
    style: {
      background: 'rgb(var(--color-surface))',
      border: '1px solid rgb(var(--color-primary) / 0.2)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      color: 'rgb(var(--color-primary))',
    },
    iconTheme: {
      primary: 'rgb(var(--color-primary))',
      secondary: 'rgb(var(--color-surface))',
    },
  },
  error: {
    style: {
      background: 'rgb(var(--color-surface))',
      border: '1px solid rgb(var(--color-danger) / 0.25)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      color: 'rgb(var(--color-danger))',
    },
    iconTheme: {
      primary: 'rgb(var(--color-danger))',
      secondary: 'rgb(var(--color-surface))',
    },
  },
  loading: {
    style: {
      background: 'rgb(var(--color-surface))',
      border: '1px solid rgb(var(--color-border))',
      borderRadius: 'var(--radius)',
      padding: '16px',
      color: 'rgb(var(--color-text))',
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
            className={`w-5 h-5 mt-0.5 ${isDanger ? 'text-danger' : 'text-secondary'}`} 
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
          <h3 className="text-sm font-medium text-heading">{title}</h3>
          <p className="text-sm text-text/80 mt-1 mb-3">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                if (onCancel) onCancel()
              }}
              className="px-3 py-1.5 text-sm font-medium bg-muted text-text rounded-md hover:bg-muted transition-colors"
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
                  ? 'bg-danger/15 text-danger hover:bg-danger/20'
                  : 'bg-secondary/15 text-secondary hover:bg-secondary/20'
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
        background: 'rgb(var(--color-surface))',
        border: `1px solid ${
          isDanger
            ? 'rgb(var(--color-danger) / 0.25)'
            : 'rgb(var(--color-secondary) / 0.25)'
        }`,
        borderRadius: 'var(--radius)',
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
