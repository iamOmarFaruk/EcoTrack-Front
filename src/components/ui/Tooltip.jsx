import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({ children, content, position = 'top', delay = 300 }) {
    const [isVisible, setIsVisible] = useState(false)
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [actualPosition, setActualPosition] = useState(position)
    const triggerRef = useRef(null)
    const tooltipRef = useRef(null)
    const timeoutRef = useRef(null)

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current || !tooltipRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        const tooltipWidth = tooltipRect.width
        const tooltipHeight = tooltipRect.height
        const padding = 8
        const offset = 8

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        let finalPosition = position
        let x = 0
        let y = 0

        // Calculate center point of trigger
        const triggerCenterX = triggerRect.left + triggerRect.width / 2
        const triggerCenterY = triggerRect.top + triggerRect.height / 2

        // Check available space in each direction
        const spaceAbove = triggerRect.top
        const spaceBelow = viewportHeight - triggerRect.bottom
        const spaceLeft = triggerRect.left
        const spaceRight = viewportWidth - triggerRect.right

        const fits = {
            top: spaceAbove >= tooltipHeight + offset + padding,
            bottom: spaceBelow >= tooltipHeight + offset + padding,
            left: spaceLeft >= tooltipWidth + offset + padding,
            right: spaceRight >= tooltipWidth + offset + padding,
        }

        // Determine best position if preferred position doesn't fit
        if (!fits[position]) {
            const verticalPreference = spaceAbove > spaceBelow ? 'top' : 'bottom'
            const horizontalPreference = spaceLeft > spaceRight ? 'left' : 'right'

            if (fits[verticalPreference]) {
                finalPosition = verticalPreference
            } else if (fits[horizontalPreference]) {
                finalPosition = horizontalPreference
            } else {
                // Fallback to any available side or default to bottom
                finalPosition = Object.entries(fits).find(([, ok]) => ok)?.[0] || 'bottom'
            }
        }

        // Calculate coordinates based on final position
        switch (finalPosition) {
            case 'top':
                x = triggerCenterX
                y = triggerRect.top - offset
                break
            case 'bottom':
                x = triggerCenterX
                y = triggerRect.bottom + offset
                break
            case 'left':
                x = triggerRect.left - offset
                y = triggerCenterY
                break
            case 'right':
                x = triggerRect.right + offset
                y = triggerCenterY
                break
            default:
                x = triggerCenterX
                y = triggerRect.top - offset
        }

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
        const halfTooltipWidth = tooltipWidth / 2
        const halfTooltipHeight = tooltipHeight / 2

        switch (finalPosition) {
            case 'top':
                x = clamp(x, halfTooltipWidth + padding, viewportWidth - halfTooltipWidth - padding)
                y = clamp(y, tooltipHeight + padding, viewportHeight - padding)
                break
            case 'bottom':
                x = clamp(x, halfTooltipWidth + padding, viewportWidth - halfTooltipWidth - padding)
                y = clamp(y, padding, viewportHeight - tooltipHeight - padding)
                break
            case 'left':
                x = clamp(x, tooltipWidth + padding, viewportWidth - padding)
                y = clamp(y, halfTooltipHeight + padding, viewportHeight - halfTooltipHeight - padding)
                break
            case 'right':
                x = clamp(x, padding, viewportWidth - tooltipWidth - padding)
                y = clamp(y, halfTooltipHeight + padding, viewportHeight - halfTooltipHeight - padding)
                break
            default:
                x = clamp(x, halfTooltipWidth + padding, viewportWidth - halfTooltipWidth - padding)
                y = clamp(y, tooltipHeight + padding, viewportHeight - padding)
        }

        setCoords({ x, y })
        setActualPosition(finalPosition)
    }, [position])

    const showTooltip = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true)
        }, delay)
    }, [delay])

    const hideTooltip = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsVisible(false)
    }, [])

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    // Recalculate position when tooltip becomes visible and while it stays visible
    useLayoutEffect(() => {
        if (!isVisible) return

        const handleUpdate = () => calculatePosition()
        handleUpdate()

        window.addEventListener('scroll', handleUpdate, true)
        window.addEventListener('resize', handleUpdate)

        const resizeObserver = typeof ResizeObserver !== 'undefined'
            ? new ResizeObserver(handleUpdate)
            : null

        if (resizeObserver) {
            if (triggerRef.current) resizeObserver.observe(triggerRef.current)
            if (tooltipRef.current) resizeObserver.observe(tooltipRef.current)
        }

        return () => {
            window.removeEventListener('scroll', handleUpdate, true)
            window.removeEventListener('resize', handleUpdate)
            resizeObserver?.disconnect()
        }
    }, [isVisible, calculatePosition])

    const getTooltipStyles = () => {
        const base = {
            position: 'fixed',
            zIndex: 9999,
            pointerEvents: 'none',
        }

        switch (actualPosition) {
            case 'top':
                return {
                    ...base,
                    left: coords.x,
                    top: coords.y,
                    transform: 'translate(-50%, -100%)',
                }
            case 'bottom':
                return {
                    ...base,
                    left: coords.x,
                    top: coords.y,
                    transform: 'translate(-50%, 0)',
                }
            case 'left':
                return {
                    ...base,
                    left: coords.x,
                    top: coords.y,
                    transform: 'translate(-100%, -50%)',
                }
            case 'right':
                return {
                    ...base,
                    left: coords.x,
                    top: coords.y,
                    transform: 'translate(0, -50%)',
                }
            default:
                return base
        }
    }

    const getArrowStyles = () => {
        const base = 'absolute w-2 h-2 bg-zinc-800 dark:bg-zinc-700 rotate-45'

        switch (actualPosition) {
            case 'top':
                return `${base} -bottom-1 left-1/2 -translate-x-1/2`
            case 'bottom':
                return `${base} -top-1 left-1/2 -translate-x-1/2`
            case 'left':
                return `${base} -right-1 top-1/2 -translate-y-1/2`
            case 'right':
                return `${base} -left-1 top-1/2 -translate-y-1/2`
            default:
                return base
        }
    }

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-flex"
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>
            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isVisible && content && (
                        <motion.div
                            ref={tooltipRef}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={getTooltipStyles()}
                        >
                            <div className="relative px-3 py-1.5 text-xs font-medium text-white bg-zinc-800 dark:bg-zinc-700 rounded-lg shadow-xl whitespace-nowrap max-w-xs">
                                {content}
                                <div className={getArrowStyles()} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}
