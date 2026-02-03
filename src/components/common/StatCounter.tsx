"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    duration?: number;
}

export function StatCounter({
    value,
    suffix = "",
    prefix = "",
    label,
    icon,
    className,
    duration = 2,
}: StatCounterProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration,
                ease: "easeOut",
                onUpdate: (latest) => {
                    setDisplayValue(Math.round(latest));
                },
            });
            return () => controls.stop();
        }
    }, [isInView, value, duration]);

    return (
        <motion.div
            ref={ref}
            className={cn(
                "text-center p-6 rounded-2xl bg-white border border-primary-100 shadow-md",
                className
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 15px 40px rgba(124, 179, 66, 0.15)" }}
        >
            {icon && (
                <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    {icon}
                </motion.div>
            )}
            <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2 tabular-nums">
                {prefix}
                {displayValue}
                {suffix}
            </div>
            <div className="text-primary-500 font-medium">{label}</div>
        </motion.div>
    );
}

interface StatsGridProps {
    stats: {
        value: number;
        suffix?: string;
        prefix?: string;
        label: string;
        icon?: React.ReactNode;
    }[];
    className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-2 md:grid-cols-4 gap-6",
                className
            )}
        >
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                    <StatCounter {...stat} />
                </motion.div>
            ))}
        </div>
    );
}

// Progress Bar with animation
interface ProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    color?: "primary" | "secondary" | "accent";
    className?: string;
}

export function ProgressBar({
    value,
    max = 100,
    label,
    showValue = true,
    color = "primary",
    className,
}: ProgressBarProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const percentage = (value / max) * 100;

    const colorStyles = {
        primary: "from-primary-400 to-primary-600",
        secondary: "from-secondary-400 to-secondary-600",
        accent: "from-accent-400 to-accent-600",
    };

    return (
        <div ref={ref} className={cn("w-full", className)}>
            {(label || showValue) && (
                <div className="flex justify-between mb-2 text-sm">
                    {label && <span className="text-primary-700 font-medium">{label}</span>}
                    {showValue && (
                        <span className="text-primary-500">{value}%</span>
                    )}
                </div>
            )}
            <div className="h-3 bg-primary-100 rounded-full overflow-hidden">
                <motion.div
                    className={cn(
                        "h-full bg-gradient-to-r rounded-full",
                        colorStyles[color]
                    )}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

// Circular Progress
interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    className?: string;
}

export function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    label,
    className,
}: CircularProgressProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = (value / max) * 100;

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2,
                ease: "easeOut",
                onUpdate: (latest) => {
                    setDisplayValue(Math.round(latest));
                },
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className={cn("relative inline-flex", className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e8f5e9"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={
                        isInView
                            ? { strokeDashoffset: circumference - (percentage / 100) * circumference }
                            : { strokeDashoffset: circumference }
                    }
                    transition={{ duration: 2, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7cb342" />
                        <stop offset="100%" stopColor="#0288d1" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">{displayValue}%</span>
                {label && <span className="text-xs text-primary-500 mt-1">{label}</span>}
            </div>
        </div>
    );
}
