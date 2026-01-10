import { motion } from 'framer-motion'
import { Card } from './Card.jsx'
import clsx from 'clsx'

export default function ImpactCard({
    label,
    value,
    unit,
    icon: Icon,
    accentColor = 'primary',
    className,
    children // For animated number
}) {
    const accentClasses = {
        primary: 'bg-primary/10 text-primary ring-primary/20',
        secondary: 'bg-secondary/10 text-secondary ring-secondary/20',
        accent: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
    }

    return (
        <Card className={clsx(
            "relative overflow-hidden border-border",
            className
        )}>
            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4">
                    <div className={clsx(
                        "flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition-transform duration-500",
                        accentClasses[accentColor] || accentClasses.primary
                    )}>
                        {Icon && <Icon className="h-6 w-6" strokeWidth={2} />}
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-bold tracking-wide text-heading uppercase">
                            {label}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                            <h3 className="text-3xl font-black tracking-tight text-heading">
                                {children || value}
                            </h3>
                            <span className="text-sm font-bold text-text/60">
                                {unit}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static bottom accent line */}
            <div className={clsx(
                "absolute bottom-0 left-0 h-[2px] w-full opacity-40",
                accentColor === 'primary' ? 'bg-primary' : 'bg-secondary'
            )} />
        </Card>
    )
}
