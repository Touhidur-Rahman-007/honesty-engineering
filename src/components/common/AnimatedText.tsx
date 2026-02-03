"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    variant?: "fadeIn" | "slideUp" | "typewriter" | "reveal" | "gradient";
}

export function AnimatedText({
    children,
    className,
    delay = 0,
    duration = 0.6,
    as = "div",
    variant = "fadeIn",
}: AnimatedTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const MotionComponent = motion[as] as typeof motion.div;

    const getVariantStyles = () => {
        switch (variant) {
            case "fadeIn":
                return {
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                };
            case "slideUp":
                return {
                    initial: { opacity: 0, y: 50 },
                    animate: { opacity: 1, y: 0 },
                };
            case "reveal":
                return {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                };
            case "gradient":
                return {
                    initial: { opacity: 0, backgroundPosition: "0% 50%" },
                    animate: { opacity: 1, backgroundPosition: "100% 50%" },
                };
            default:
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                };
        }
    };

    const variantStyles = getVariantStyles();

    return (
        <MotionComponent
            ref={ref}
            initial={variantStyles.initial}
            animate={isInView ? variantStyles.animate : variantStyles.initial}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={cn(className)}
        >
            {children}
        </MotionComponent>
    );
}

// Character by character animation
interface AnimatedCharactersProps {
    text: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

export function AnimatedCharacters({
    text,
    className,
    delay = 0,
    staggerDelay = 0.03,
}: AnimatedCharactersProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    const charVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn("inline-block", className)}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : "normal" }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
}

// Word by word animation
interface AnimatedWordsProps {
    text: string;
    className?: string;
    delay?: number;
    staggerDelay?: number;
}

export function AnimatedWords({
    text,
    className,
    delay = 0,
    staggerDelay = 0.08,
}: AnimatedWordsProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: delay,
            },
        },
    };

    const wordVariants = {
        hidden: { opacity: 0, y: 30, rotateX: -20 },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1] as const,
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn("inline-block", className)}
        >
            {text.split(" ").map((word, index) => (
                <motion.span
                    key={index}
                    variants={wordVariants}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </motion.span>
    );
}

// Counter animation
interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    duration?: number;
}

export function AnimatedCounter({
    value,
    suffix = "",
    prefix = "",
    className,
    duration = 2,
}: AnimatedCounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.span
            ref={ref}
            className={cn("inline-block tabular-nums", className)}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        >
            {prefix}
            <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isInView && (
                    <CounterNumber value={value} duration={duration} />
                )}
            </motion.span>
            {suffix}
        </motion.span>
    );
}

function CounterNumber({ value, duration }: { value: number; duration: number }) {
    const nodeRef = useRef<HTMLSpanElement>(null);

    return (
        <motion.span
            ref={nodeRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: duration }}
            >
                {value}
            </motion.span>
        </motion.span>
    );
}
