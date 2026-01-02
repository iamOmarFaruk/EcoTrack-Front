import Button from '../components/ui/Button.jsx'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function NotFound() {
  useDocumentTitle('404 - Not Found')
  const isLoading = useMinimumLoading(300)
  
  if (isLoading) {
    return <EcoLoader />
  }
  
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-lg">
        {/* Error content */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold tracking-tight text-heading">
            4<span className="text-surface/900">0</span>4
          </h1>
          <h2 className="text-2xl font-semibold text-text">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-text/80 leading-relaxed">
            Looks like this page got lost in the forest. 🌿<br />
            Don't worry, we'll help you find your way back home.
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button as={Link} to="/" className="min-w-[140px]">
            Go Home
          </Button>
          <Button 
            as={Link} 
            to="/challenges" 
            variant="secondary" 
            className="min-w-[140px]"
          >
            View Challenges
          </Button>
        </div>
        
        {/* Additional help text */}
        <p className="mt-6 text-sm text-text/70">
          If you believe this is an error, please{' '}
          <Link 
            to="/contact" 
            className="text-primary hover:text-primary underline"
          >
            contact us
          </Link>
        </p>
      </div>
    </div>
  )
}


