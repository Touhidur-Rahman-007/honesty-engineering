"use client";

import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.98,
        y: 20,
    },
    enter: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        y: -20,
        transition: {
            duration: 0.3,
            ease: "easeIn" as const,
        },
    },
};

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                className="w-full"
            >
                {/* Page Transition Overlay */}
                <motion.div
                    className="fixed inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 z-50 pointer-events-none"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "top" }}
                />
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
