import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'
import Tooltip from './ui/Tooltip.jsx'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const options = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor }
    ]

    return (
        <div className="flex items-center gap-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 shadow-sm px-1 py-1">
            {options.map((option) => {
                const Icon = option.icon
                const isActive = theme === option.value

                return (
                    <Tooltip key={option.value} content={`Switch to ${option.label} mode`}>
                        <button
                            onClick={() => setTheme(option.value)}
                            className={clsx(
                                "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-offset-black",
                                isActive
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-text/70 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                            aria-pressed={isActive}
                        >
                            <Icon size={14} />
                            <span className="hidden sm:inline">{option.label}</span>
                        </button>
                    </Tooltip>
                )
            })}
        </div>
    )
}
