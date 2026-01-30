"use client";
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleHoverStart = (e) => {
            if (e.target.closest('button, a, .group')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleHoverStart);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleHoverStart);
        };
    }, [isVisible]);

    if (typeof window === 'undefined') return null;

    return (
        <motion.div
            style={{
                left: cursorX,
                top: cursorY,
                translateX: '-50%',
                translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isHovering ? 2.5 : 1,
                backgroundColor: isHovering ? 'rgba(0, 102, 204, 0.15)' : 'rgba(255, 255, 255, 0.8)',
                border: isHovering ? '1px solid rgba(0, 102, 204, 0.5)' : 'none',
            }}
            className="fixed pointer-events-none z-[9999] w-4 h-4 rounded-full mix-blend-difference hidden md:block"
        />
    );
}
