export default function SectionHeading({ title, subtitle, badge, centered = true }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      <div className={`flex flex-col ${centered ? 'items-center' : 'items-start'} space-y-4`}>
        {badge && (
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
            {badge}
          </span>
        )}

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold tracking-tight text-heading leading-tight max-w-4xl">
          {title}
        </h2>

        {subtitle && (
          <p className={`text-base sm:text-lg text-text/70 max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}

        <div className={`h-1.5 w-12 rounded-full bg-primary/30 mt-2 ${centered ? 'mx-auto' : ''}`} />
      </div>
    </div>
  )
}




