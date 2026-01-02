export default function EcoLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="relative h-16 w-16 sm:h-20 sm:w-20">
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgb(var(--color-primary) / 0.45), rgb(var(--color-primary) / 0.25), rgb(var(--color-secondary) / 0.15))',
          }}
        ></div>
        <div className="relative h-full w-full overflow-hidden rounded-full ring-1 ring-primary/40">
          <img
            src="/logo.png"
            alt=""
            className="h-full w-full animate-spin-slow select-none pointer-events-none object-contain p-1"
            draggable="false"
          />
        </div>
      </div>
    </div>
  )
}
