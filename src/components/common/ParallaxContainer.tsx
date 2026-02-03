"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ParallaxContainerProps {
    children: ReactNode;
    className?: string;
    speed?: number;
    direction?: "up" | "down";
}

export function ParallaxContainer({
    children,
    className,
    speed = 0.5,
    direction = "up",
}: ParallaxContainerProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const multiplier = direction === "up" ? -1 : 1;
    const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * multiplier]);

    return (
        <motion.div ref={ref} style={{ y }} className={cn(className)}>
            {children}
        </motion.div>
    );
}

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    speed?: number;
    scale?: boolean;
}

export function ParallaxImage({
    src,
    alt,
    className,
    speed = 0.3,
    scale = true,
}: ParallaxImageProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
    const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [1, scale ? 1.1 : 1, 1]);

    return (
        <div ref={ref} className={cn("overflow-hidden", className)}>
            <motion.img
                src={src}
                alt={alt}
                style={{ y, scale: scaleValue }}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

interface ParallaxSectionProps {
    children: ReactNode;
    className?: string;
    bgImage?: string;
    bgColor?: string;
    overlay?: boolean;
    overlayOpacity?: number;
}

export function ParallaxSection({
    children,
    className,
    bgImage,
    bgColor = "#f8fdf5",
    overlay = true,
    overlayOpacity = 0.7,
}: ParallaxSectionProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <section
            ref={ref}
            className={cn("relative overflow-hidden", className)}
            style={{ backgroundColor: bgColor }}
        >
            {bgImage && (
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        y: backgroundY,
                    }}
                />
            )}
            {overlay && bgImage && (
                <div
                    className="absolute inset-0 z-[1]"
                    style={{
                        background: `linear-gradient(to bottom, rgba(255,255,255,${overlayOpacity}), rgba(248,253,245,${overlayOpacity}))`,
                    }}
                />
            )}
            <div className="relative z-10">{children}</div>
        </section>
    );
}

// Floating Element Component
interface FloatingElementProps {
    children: ReactNode;
    className?: string;
    amplitude?: number;
    duration?: number;
    delay?: number;
}

export function FloatingElement({
    children,
    className,
    amplitude = 15,
    duration = 4,
    delay = 0,
}: FloatingElementProps) {
    return (
        <motion.div
            className={cn(className)}
            animate={{
                y: [-amplitude, amplitude, -amplitude],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
}

// Rotating Element
interface RotatingElementProps {
    children: ReactNode;
    className?: string;
    duration?: number;
    direction?: "clockwise" | "counterclockwise";
}

export function RotatingElement({
    children,
    className,
    duration = 20,
    direction = "clockwise",
}: RotatingElementProps) {
    return (
        <motion.div
            className={cn(className)}
            animate={{
                rotate: direction === "clockwise" ? 360 : -360,
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
            }}
        >
            {children}
        </motion.div>
    );
}

// Scale on Scroll
interface ScaleOnScrollProps {
    children: ReactNode;
    className?: string;
}

export function ScaleOnScroll({ children, className }: ScaleOnScrollProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"],
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}
