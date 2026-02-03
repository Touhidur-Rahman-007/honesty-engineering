"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
    once?: boolean;
    amount?: number;
}

export function AnimatedSection({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 0.6,
    once = true,
    amount = 0.3,
}: AnimatedSectionProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount });

    const getInitialPosition = () => {
        switch (direction) {
            case "up":
                return { opacity: 0, y: 60 };
            case "down":
                return { opacity: 0, y: -60 };
            case "left":
                return { opacity: 0, x: -60 };
            case "right":
                return { opacity: 0, x: 60 };
            case "none":
                return { opacity: 0 };
            default:
                return { opacity: 0, y: 60 };
        }
    };

    const getFinalPosition = () => {
        switch (direction) {
            case "up":
            case "down":
                return { opacity: 1, y: 0 };
            case "left":
            case "right":
                return { opacity: 1, x: 0 };
            case "none":
                return { opacity: 1 };
            default:
                return { opacity: 1, y: 0 };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={getInitialPosition()}
            animate={isInView ? getFinalPosition() : getInitialPosition()}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Stagger container for multiple items
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    delayChildren?: number;
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
    delayChildren = 0.1,
}: StaggerContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delayChildren,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Individual stagger item
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "down" | "left" | "right";
}

export function StaggerItem({
    children,
    className,
    direction = "up",
}: StaggerItemProps) {
    const getVariants = (): Variants => {
        const distance = 30;
        switch (direction) {
            case "up":
                return {
                    hidden: { opacity: 0, y: distance },
                    visible: { opacity: 1, y: 0 },
                };
            case "down":
                return {
                    hidden: { opacity: 0, y: -distance },
                    visible: { opacity: 1, y: 0 },
                };
            case "left":
                return {
                    hidden: { opacity: 0, x: -distance },
                    visible: { opacity: 1, x: 0 },
                };
            case "right":
                return {
                    hidden: { opacity: 0, x: distance },
                    visible: { opacity: 1, x: 0 },
                };
            default:
                return {
                    hidden: { opacity: 0, y: distance },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    return (
        <motion.div
            variants={getVariants()}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
