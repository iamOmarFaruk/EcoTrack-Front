import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Typewriter component that animates text as if it's being typed.
 * @param {Object} props
 * @param {string} props.text - The text to animate
 * @param {number} props.speed - Speed of typing in ms per character (default: 30)
 * @param {number} props.delay - Delay before starting the animation in ms (default: 500)
 * @param {string} props.className - Tailwind classes for the text
 */
export const Typewriter = ({ text, speed = 30, delay = 500, className = "" }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStarted(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!isStarted) return;

        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [isStarted, text, speed]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className={`inline-block w-[2px] h-[1.1em] ml-0.5 bg-primary-light align-middle ${displayedText.length === text.length ? 'hidden' : ''}`}
            />
        </motion.span>
    );
};
