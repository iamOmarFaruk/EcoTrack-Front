export default function Logo({ className = "h-8 w-8" }) {
  return (
    <img
      className={className}
      src="/logo.png"
      alt="EcoTrack logo"
      loading="eager"
      decoding="async"
      draggable="false"
    />
  )
}

