export default function SectionHeading({ title, subtitle, centered = false }) {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <div className={`flex flex-col ${centered ? 'items-center' : ''}`}>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-heading">
          {title}
        </h2>
        <div className={`h-1.5 w-20 mt-3 rounded-full bg-gradient-to-r from-primary to-secondary ${centered ? 'mx-auto' : ''}`} />
      </div>
      {subtitle ? (
        <p className={`mt-4 text-base sm:text-lg text-text/80 max-w-3xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}



