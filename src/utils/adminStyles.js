/**
 * Standardized styling classes for admin pages
 * Ensures consistency across all admin components
 */

// Form input styles
export const inputBaseClasses = "w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 dark:bg-zinc-900/50 text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"

export const textareaBaseClasses = "w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 dark:bg-zinc-900/50 text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"

export const selectBaseClasses = "w-full px-4 py-2.5 rounded-xl border border-border bg-surface/50 dark:bg-zinc-900/50 text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"

// Button styles
export const buttonSizes = {
  small: "px-3 py-1.5 text-xs rounded-lg",
  medium: "px-4 py-2 text-sm rounded-xl",
  large: "px-6 py-2.5 text-base rounded-xl"
}

// Search input styles
export const searchInputClasses = "pl-11 pr-4 py-2.5 rounded-xl border border-border bg-white dark:bg-zinc-900/60 text-sm text-heading placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all w-full md:w-64"

// Card styles
export const cardBaseClasses = "rounded-2xl border border-border bg-surface"

// Consistent spacing
export const spacing = {
  cardGrid: "gap-6",
  formFields: "gap-5",
  buttonGroup: "gap-3",
  inlineElements: "gap-2"
}
