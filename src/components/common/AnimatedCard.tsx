"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    hoverEffect?: "lift" | "glow" | "scale" | "tilt" | "border";
    clickable?: boolean;
    onClick?: () => void;
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    hoverEffect = "lift",
    clickable = true,
    onClick,
}: AnimatedCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const getHoverStyles = () => {
        switch (hoverEffect) {
            case "lift":
                return {
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(124, 179, 66, 0.25)",
                };
            case "glow":
                return {
                    boxShadow: "0 0 40px rgba(124, 179, 66, 0.4), 0 0 80px rgba(124, 179, 66, 0.2)",
                };
            case "scale":
                return {
                    scale: 1.05,
                };
            case "tilt":
                return {
                    rotateX: -5,
                    rotateY: 5,
                };
            case "border":
                return {
                    borderColor: "rgba(124, 179, 66, 0.5)",
                };
            default:
                return { y: -10 };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={clickable ? getHoverStyles() : undefined}
            whileTap={clickable ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={cn(
                "cursor-pointer",
                className
            )}
            style={{
                transformStyle: "preserve-3d",
            }}
        >
            {children}
        </motion.div>
    );
}

// Premium Card with gradient border
interface GradientCardProps {
    children: ReactNode;
    className?: string;
    gradientFrom?: string;
    gradientTo?: string;
    delay?: number;
}

export function GradientCard({
    children,
    className,
    gradientFrom = "#7cb342",
    gradientTo = "#0288d1",
    delay = 0,
}: GradientCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                "relative p-[2px] rounded-2xl overflow-hidden group cursor-pointer",
                className
            )}
            style={{
                background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            }}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-50%] bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
            </div>
            <div className="relative bg-white rounded-2xl p-6 h-full">
                {children}
            </div>
        </motion.div>
    );
}

// Glass Card
interface GlassCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    blur?: number;
}

export function GlassCard({
    children,
    className,
    delay = 0,
    blur = 20,
}: GlassCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(124, 179, 66, 0.2)",
            }}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/20",
                className
            )}
            style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
            }}
        >
            {children}
        </motion.div>
    );
}

// Icon Card for services
interface IconCardProps {
    icon: ReactNode;
    title: string;
    description?: string;
    className?: string;
    delay?: number;
}

export function IconCard({
    icon,
    title,
    description,
    className,
    delay = 0,
}: IconCardProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
                y: -8,
                boxShadow: "0 20px 40px -12px rgba(124, 179, 66, 0.25)",
            }}
            className={cn(
                "relative bg-white rounded-2xl p-6 border border-primary-100 group cursor-pointer transition-colors hover:border-primary-300",
                className
            )}
        >
            <motion.div
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mb-4 text-primary-600"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {icon}
            </motion.div>
            <h3 className="text-lg font-semibold text-primary-800 mb-2 group-hover:text-primary-600 transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-primary-600 text-sm leading-relaxed">
                    {description}
                </p>
            )}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-b-2xl"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "left" }}
            />
        </motion.div>
    );
}
