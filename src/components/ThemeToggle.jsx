import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Tooltip from './ui/Tooltip'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const themes = ['system', 'dark', 'light']

    const cycleTheme = () => {
        const currentIndex = themes.indexOf(theme)
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
    }

    const getIcon = () => {
        switch (theme) {
            case 'dark':
                return <Moon size={18} />
            case 'light':
                return <Sun size={18} />
            default:
                return <Monitor size={18} />
        }
    }

    return (
        <Tooltip content="Change theme">
            <button
                onClick={cycleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 shadow-sm text-text/70 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={`Current theme: ${theme}. Click to cycle theme.`}
            >
                {getIcon()}
            </button>
        </Tooltip>
    )
}
