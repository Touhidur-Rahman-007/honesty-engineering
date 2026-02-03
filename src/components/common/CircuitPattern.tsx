"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircuitPatternProps {
    className?: string;
    color?: string;
    animated?: boolean;
    density?: "low" | "medium" | "high";
}

export function CircuitPattern({
    className,
    color = "#0288d1",
    animated = true,
    density = "medium",
}: CircuitPatternProps) {
    const getDensity = () => {
        switch (density) {
            case "low":
                return 6;
            case "medium":
                return 10;
            case "high":
                return 15;
            default:
                return 10;
        }
    };

    const nodes = getDensity();
    const paths = generateCircuitPaths(nodes, color);

    return (
        <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
            <svg
                className="w-full h-full"
                viewBox="0 0 400 400"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {paths.map((path, index) => (
                    <motion.path
                        key={index}
                        d={path.d}
                        stroke={color}
                        strokeWidth="1"
                        fill="none"
                        opacity={0.3}
                        filter="url(#glow)"
                        initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
                        animate={animated ? { pathLength: 1 } : { pathLength: 1 }}
                        transition={{
                            duration: 2,
                            delay: index * 0.1,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Circuit Nodes */}
                {Array.from({ length: nodes }).map((_, index) => {
                    const x = 40 + (index % 5) * 80;
                    const y = 40 + Math.floor(index / 5) * 80;
                    return (
                        <motion.circle
                            key={`node-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={color}
                            opacity={0.4}
                            initial={animated ? { scale: 0 } : { scale: 1 }}
                            animate={animated ? { scale: 1 } : { scale: 1 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.05 + 1,
                                type: "spring",
                                stiffness: 200,
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
}

function generateCircuitPaths(nodes: number, color: string) {
    const paths: { d: string }[] = [];

    // Generate horizontal lines
    for (let i = 0; i < 4; i++) {
        const y = 40 + i * 80;
        paths.push({ d: `M 20 ${y} L 380 ${y}` });
    }

    // Generate vertical lines
    for (let i = 0; i < 5; i++) {
        const x = 40 + i * 80;
        paths.push({ d: `M ${x} 20 L ${x} 380` });
    }

    // Generate diagonal connections
    paths.push({ d: "M 40 40 L 120 120" });
    paths.push({ d: "M 280 40 L 360 120" });
    paths.push({ d: "M 40 280 L 120 360" });
    paths.push({ d: "M 280 280 L 360 360" });

    return paths;
}

// Animated Circuit Lines (for decorative borders)
interface CircuitLinesProps {
    className?: string;
    color?: string;
    position?: "top" | "bottom" | "left" | "right";
}

export function CircuitLines({
    className,
    color = "#0288d1",
    position = "bottom",
}: CircuitLinesProps) {
    const isHorizontal = position === "top" || position === "bottom";

    return (
        <div
            className={cn(
                "absolute overflow-hidden pointer-events-none",
                {
                    "left-0 right-0 h-24": isHorizontal,
                    "top-0 bottom-0 w-24": !isHorizontal,
                    "bottom-0": position === "bottom",
                    "top-0": position === "top",
                    "left-0": position === "left",
                    "right-0": position === "right",
                },
                className
            )}
        >
            <svg
                className="w-full h-full"
                viewBox={isHorizontal ? "0 0 400 100" : "0 0 100 400"}
                preserveAspectRatio="none"
            >
                {isHorizontal ? (
                    <>
                        <motion.path
                            d="M 0 50 L 100 50 L 120 30 L 200 30 L 220 50 L 300 50 L 320 70 L 400 70"
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                            opacity={0.3}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <motion.circle cx="50" cy="50" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="150" cy="30" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="260" cy="50" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="360" cy="70" r="4" fill={color} opacity={0.5} />
                    </>
                ) : (
                    <>
                        <motion.path
                            d="M 50 0 L 50 100 L 30 120 L 30 200 L 50 220 L 50 300 L 70 320 L 70 400"
                            stroke={color}
                            strokeWidth="2"
                            fill="none"
                            opacity={0.3}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <motion.circle cx="50" cy="50" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="30" cy="150" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="50" cy="260" r="4" fill={color} opacity={0.5} />
                        <motion.circle cx="70" cy="360" r="4" fill={color} opacity={0.5} />
                    </>
                )}
            </svg>
        </div>
    );
}

// Decorative Corner Circuit
interface CircuitCornerProps {
    className?: string;
    color?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function CircuitCorner({
    className,
    color = "#0288d1",
    position = "bottom-right",
}: CircuitCornerProps) {
    const getTransform = () => {
        switch (position) {
            case "top-left":
                return "rotate(180deg)";
            case "top-right":
                return "rotate(270deg)";
            case "bottom-left":
                return "rotate(90deg)";
            case "bottom-right":
                return "rotate(0deg)";
            default:
                return "rotate(0deg)";
        }
    };

    const getPosition = () => {
        switch (position) {
            case "top-left":
                return "top-0 left-0";
            case "top-right":
                return "top-0 right-0";
            case "bottom-left":
                return "bottom-0 left-0";
            case "bottom-right":
                return "bottom-0 right-0";
            default:
                return "bottom-0 right-0";
        }
    };

    return (
        <div
            className={cn(
                "absolute w-32 h-32 pointer-events-none",
                getPosition(),
                className
            )}
            style={{ transform: getTransform() }}
        >
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
            >
                <motion.path
                    d="M 100 100 L 100 60 L 80 60 L 80 40 L 60 40 L 60 20 L 40 20 L 40 0"
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    opacity={0.4}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle
                    cx="100"
                    cy="60"
                    r="3"
                    fill={color}
                    opacity={0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                />
                <motion.circle
                    cx="60"
                    cy="40"
                    r="3"
                    fill={color}
                    opacity={0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 }}
                />
                <motion.circle
                    cx="40"
                    cy="20"
                    r="3"
                    fill={color}
                    opacity={0.6}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 }}
                />
            </svg>
        </div>
    );
}
