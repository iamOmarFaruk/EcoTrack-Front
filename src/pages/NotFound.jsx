import Button from '../components/ui/Button.jsx'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFound() {
  useDocumentTitle('404 - Not Found')
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">404</h1>
      <p className="mt-2 text-slate-600">The page you’re looking for doesn’t exist.</p>
      <Button as={Link} to="/" className="mt-6">Go Home</Button>
    </div>
  )
}


