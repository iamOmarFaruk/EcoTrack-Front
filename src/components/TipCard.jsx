import Button from './ui/Button.jsx'
import { Card, CardContent } from './ui/Card.jsx'
import { useState } from 'react'
import { formatDate } from '../utils/formatDate.js'

export default function TipCard({ tip }) {
  const [upvotes, setUpvotes] = useState(tip.upvotes)
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">
        <h3 className="text-base font-semibold">{tip.title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {tip.authorName} • {formatDate(tip.createdAt)}
        </p>
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{tip.content}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-xs text-slate-600">Upvotes: {upvotes}</span>
          <Button className="h-8 px-3 text-xs" onClick={() => setUpvotes((n) => n + 1)}>Upvote</Button>
        </div>
      </CardContent>
    </Card>
  )
}


