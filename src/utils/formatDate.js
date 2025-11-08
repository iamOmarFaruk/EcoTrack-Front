export function formatDate(dateString, options = { dateStyle: 'medium' }) {
  try {
    const dt = new Date(dateString)
    return new Intl.DateTimeFormat(undefined, options).format(dt)
  } catch {
    return dateString
  }
}


