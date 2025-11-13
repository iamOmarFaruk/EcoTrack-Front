import LazySection from './LazySection.jsx'
import TipCard from './TipCard.jsx'
import { TipCardSkeleton } from './Skeleton.jsx'

export default function LazyTipCard({ tip, showContent = true, showActions, onEdit, onDelete, onLoginRequired, ...props }) {
  return (
    <LazySection
      fallback={<TipCardSkeleton />}
      {...props}
    >
      <TipCard 
        tip={tip} 
        showContent={showContent} 
        showActions={showActions}
        onEdit={onEdit}
        onDelete={onDelete}
        onLoginRequired={onLoginRequired}
      />
    </LazySection>
  )
}