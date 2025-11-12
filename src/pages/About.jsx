import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useMinimumLoading } from '../hooks/useMinimumLoading.js'
import EcoLoader from '../components/EcoLoader.jsx'

export default function About() {
  useDocumentTitle('About')
  const isLoading = useMinimumLoading(300)

  if (isLoading) {
    return <EcoLoader />
  }

  return (
    <div className="prose max-w-none">
      <h1>About EcoTrack</h1>
      <p>
        EcoTrack helps people build sustainable habits through challenges, tips, and events.
        We care about clean design, great UX, and meaningful impact.
      </p>
    </div>
  )
}


