import ChallengeCard from './ChallengeCard.jsx'

export default function LazyChallengeCard({ challenge, ...props }) {
  return <ChallengeCard challenge={challenge} {...props} />
}