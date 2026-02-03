"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / totalHeight) * 100;
            setProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-400 z-50"
            style={{ scaleX: progress / 100, transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
        />
    );
}

export function WhatsAppButton() {
    const whatsappNumber = "8801976573448";
    const whatsappMessage = "Hello, I'm interested in your engineering services.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl z-50 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Contact on WhatsApp"
        >
            <motion.svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </motion.svg>

            {/* Pulse effect */}
            <motion.div
                className="absolute inset-0 rounded-full bg-green-400"
                animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            />
        </motion.a>
    );
}

// Keep ScrollToTop as hidden export for backwards compatibility
export function ScrollToTop() {
    // Removed - replaced with WhatsApp button
    return null;
}

export function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center"
                >
                    <motion.div className="text-center">
                        {/* Animated Logo */}
                        <motion.div
                            className="w-32 h-32 mx-auto mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <svg viewBox="0 0 60 60" className="w-full h-full">
                                <circle
                                    cx="30"
                                    cy="30"
                                    r="28"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="2"
                                />
                                <motion.circle
                                    cx="30"
                                    cy="30"
                                    r="28"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="175"
                                    strokeDashoffset="175"
                                    animate={{ strokeDashoffset: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <path
                                    d="M 30 12 C 21 12 14 19 14 28 C 14 34 17 39 22 43 L 22 48 L 38 48 L 38 43 C 43 39 46 34 46 28 C 46 19 39 12 30 12"
                                    fill="rgba(255,255,255,0.2)"
                                    stroke="white"
                                    strokeWidth="1.5"
                                />
                                <path
                                    d="M 30 24 C 25 29 25 37 30 44 C 35 37 35 29 30 24"
                                    fill="white"
                                />
                            </svg>
                        </motion.div>

                        {/* Company Name */}
                        <motion.h2
                            className="text-white text-2xl font-bold mb-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            HONESTY ENGINEERING
                        </motion.h2>

                        {/* Loading text */}
                        <motion.p
                            className="text-white/80 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            Building Excellence...
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Cursor follower effect
export function CursorFollower() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // Only show on larger screens
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed w-8 h-8 rounded-full pointer-events-none z-[99] mix-blend-difference"
                    style={{
                        background: "radial-gradient(circle, rgba(124, 179, 66, 0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                        x: mousePosition.x - 16,
                        y: mousePosition.y - 16,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 28,
                    }}
                />
            )}
        </AnimatePresence>
    );
}
