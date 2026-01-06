import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const options = [
        { value: 'light', label: 'Light', icon: Sun },
        { value: 'dark', label: 'Dark', icon: Moon },
        { value: 'system', label: 'System', icon: Monitor }
    ]

    const activeOption = options.find((opt) => opt.value === theme) || options[0]

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text hover:bg-bg-muted transition-colors"
                aria-label="Toggle theme"
            >
                <activeOption.icon size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-32 min-w-[120px] divide-y divide-border rounded-xl border border-border bg-surface shadow-lg ring-1 ring-black/5 z-50"
                    >
                        <div className="p-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setTheme(option.value)
                                        setIsOpen(false)
                                    }}
                                    className={clsx(
                                        'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors',
                                        theme === option.value
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text hover:bg-bg-muted'
                                    )}
                                >
                                    <option.icon size={16} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
