import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function About() {
  useDocumentTitle('About')
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


