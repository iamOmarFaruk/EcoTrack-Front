import LazySection from './LazySection.jsx'
import ChallengeCard from './ChallengeCard.jsx'
import { ChallengeCardSkeleton } from './Skeleton.jsx'

export default function LazyChallengeCard({ challenge, ...props }) {
  return (
    <LazySection
      fallback={<ChallengeCardSkeleton />}
      {...props}
    >
      <ChallengeCard challenge={challenge} />
    </LazySection>
  )
}