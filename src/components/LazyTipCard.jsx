import TipCard from './TipCard.jsx'

export default function LazyTipCard({ tip, showContent = true, showActions, onEdit, onDelete, onUpvote, onLoginRequired, canModify, ...props }) {
  return (
    <TipCard
      tip={tip}
      showContent={showContent}
      showActions={showActions}
      onEdit={onEdit}
      onDelete={onDelete}
      onUpvote={onUpvote}
      onLoginRequired={onLoginRequired}
      canModify={canModify}
      {...props}
    />
  )
}