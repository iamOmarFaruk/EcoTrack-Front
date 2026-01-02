export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-heading font-bold tracking-tight text-heading">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-text">{subtitle}</p> : null}
    </div>
  )
}


