"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    highlight?: string;
    className?: string;
    align?: "left" | "center" | "right";
    size?: "sm" | "md" | "lg" | "xl";
    decoration?: boolean;
}

export function SectionTitle({
    title,
    subtitle,
    highlight,
    className,
    align = "center",
    size = "lg",
    decoration = true,
}: SectionTitleProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    const alignStyles = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    const sizeStyles = {
        sm: "text-xl sm:text-2xl md:text-3xl",
        md: "text-2xl sm:text-3xl md:text-4xl",
        lg: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
        xl: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    };

    // Split the title to highlight a word
    const renderTitle = () => {
        if (!highlight) {
            return title;
        }

        const parts = title.split(highlight);
        return (
            <>
                {parts[0]}
                <span className="relative">
                    <span className="relative z-10 text-secondary-600">{highlight}</span>
                    <motion.span
                        className="absolute bottom-2 left-0 right-0 h-3 bg-accent-300/50 -z-0 rounded"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{ transformOrigin: "left" }}
                    />
                </span>
                {parts[1]}
            </>
        );
    };

    return (
        <div
            ref={ref}
            className={cn("relative mb-12", alignStyles[align], className)}
        >
            {/* Decorative badge above title */}
            {subtitle && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        "inline-block mb-4",
                        align === "center" && "mx-auto"
                    )}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        {subtitle}
                    </span>
                </motion.div>
            )}

            {/* Main title */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={cn(
                    "font-bold text-primary-800 leading-tight",
                    sizeStyles[size]
                )}
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                {renderTitle()}
            </motion.h2>

            {/* Decorative line */}
            {decoration && (
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className={cn(
                        "mt-6 h-1 bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 rounded-full",
                        align === "center" && "mx-auto w-24",
                        align === "left" && "w-24",
                        align === "right" && "ml-auto w-24"
                    )}
                    style={{ transformOrigin: align === "right" ? "right" : "left" }}
                />
            )}
        </div>
    );
}

// Area of Interest Title (matching company profile design)
interface AreaTitleProps {
    area: string;
    interest: string;
    className?: string;
}

export function AreaTitle({ area, interest, className }: AreaTitleProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className={cn("inline-flex items-center gap-3 mb-6", className)}
        >
            <span
                className="text-2xl md:text-3xl italic text-secondary-600"
                style={{ fontFamily: "'Satisfy', cursive" }}
            >
                {area}
            </span>
            <span className="text-xl md:text-2xl font-bold">
                <span className="px-3 py-1 bg-primary-500 text-white rounded-lg">
                    {interest.split(" ")[0]}
                </span>
                {" "}
                <span className="text-accent-500">{interest.split(" ").slice(1).join(" ")}</span>
            </span>
        </motion.div>
    );
}

// Logo component
interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
    const sizeStyles = {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-20 h-20",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-lg",
        lg: "text-2xl",
    };

    return (
        <motion.div
            className={cn("flex items-center gap-3", className)}
            whileHover={{ scale: 1.02 }}
        >
            {/* Logo Image */}
            <div className={cn("relative", sizeStyles[size])}>
                <Image
                    src="/assets/images/branding/logo.jpeg"
                    alt="Honesty Engineering Logo"
                    fill
                    className="object-contain"
                />
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span
                        className={cn("font-bold text-secondary-600", textSizes[size])}
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Honesty Engineering
                    </span>
                </div>
            )}
        </motion.div>
    );
}
