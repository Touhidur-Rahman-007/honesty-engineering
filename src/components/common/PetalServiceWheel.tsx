"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PetalServiceWheelProps {
    className?: string;
    size?: "sm" | "md" | "lg";
}

const services = [
    { name: "RCC & Steel\nStructure", angle: -54 },
    { name: "Electrical &\nMechanical\nSolution", angle: 18 },
    { name: "Factory\nProduction\nFurniture", angle: 90 },
    { name: "Interior\nWorks", angle: 162 },
    { name: "Fire\nSafety", angle: 234 },
];

// Create a smooth petal/leaf shape path matching the reference image
const createPetalPath = (cx: number, cy: number, angle: number, outerRadius: number, innerRadius: number) => {
    const rad = (angle * Math.PI) / 180;
    const spreadAngle = 28;
    const spreadRad = (spreadAngle * Math.PI) / 180;
    
    const startAngle = rad - spreadRad;
    const endAngle = rad + spreadRad;
    
    // Points
    const innerX1 = cx + Math.cos(startAngle) * innerRadius;
    const innerY1 = cy + Math.sin(startAngle) * innerRadius;
    const innerX2 = cx + Math.cos(endAngle) * innerRadius;
    const innerY2 = cy + Math.sin(endAngle) * innerRadius;
    
    const outerX = cx + Math.cos(rad) * outerRadius;
    const outerY = cy + Math.sin(rad) * outerRadius;
    
    const midRadius = (outerRadius + innerRadius) / 2;
    const ctrlOut1X = cx + Math.cos(startAngle + spreadRad * 0.3) * (outerRadius * 0.85);
    const ctrlOut1Y = cy + Math.sin(startAngle + spreadRad * 0.3) * (outerRadius * 0.85);
    const ctrlOut2X = cx + Math.cos(endAngle - spreadRad * 0.3) * (outerRadius * 0.85);
    const ctrlOut2Y = cy + Math.sin(endAngle - spreadRad * 0.3) * (outerRadius * 0.85);
    
    return `
        M ${innerX1} ${innerY1}
        Q ${ctrlOut1X} ${ctrlOut1Y} ${outerX} ${outerY}
        Q ${ctrlOut2X} ${ctrlOut2Y} ${innerX2} ${innerY2}
        Q ${cx + Math.cos(rad) * (innerRadius * 0.9)} ${cy + Math.sin(rad) * (innerRadius * 0.9)} ${innerX1} ${innerY1}
        Z
    `;
};

export function PetalServiceWheel({ className, size = "lg" }: PetalServiceWheelProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const sizeStyles = {
        sm: "w-64 h-64",
        md: "w-80 h-80 md:w-96 md:h-96",
        lg: "w-[380px] h-[380px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] lg:w-[580px] lg:h-[580px]",
    };

    return (
        <div ref={ref} className={cn("relative", sizeStyles[size], className)}>
            {/* Soft glow background */}
            <motion.div
                className="absolute inset-[-20px] sm:inset-[-40px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(200,230,201,0.3) 40%, transparent 70%)" }}
                animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <svg viewBox="0 0 500 500" className="w-full h-full relative z-10">
                <defs>
                    {/* Petal gradients - soft green shades matching reference */}
                    <linearGradient id="petal0" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5E1A5" />
                        <stop offset="50%" stopColor="#AED581" />
                        <stop offset="100%" stopColor="#9CCC65" />
                    </linearGradient>
                    <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5E1A5" />
                        <stop offset="50%" stopColor="#AED581" />
                        <stop offset="100%" stopColor="#9CCC65" />
                    </linearGradient>
                    <linearGradient id="petal2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5E1A5" />
                        <stop offset="50%" stopColor="#AED581" />
                        <stop offset="100%" stopColor="#9CCC65" />
                    </linearGradient>
                    <linearGradient id="petal3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5E1A5" />
                        <stop offset="50%" stopColor="#AED581" />
                        <stop offset="100%" stopColor="#9CCC65" />
                    </linearGradient>
                    <linearGradient id="petal4" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#C5E1A5" />
                        <stop offset="50%" stopColor="#AED581" />
                        <stop offset="100%" stopColor="#9CCC65" />
                    </linearGradient>

                    {/* Subtle shadow filter */}
                    <filter id="petalShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15"/>
                    </filter>

                    {/* Hover glow */}
                    <filter id="hoverGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* Center gradient */}
                    <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="70%" stopColor="#f8fdf5" />
                        <stop offset="100%" stopColor="#e8f5e9" />
                    </radialGradient>
                </defs>

                {/* SERVICE PETALS */}
                {services.map((service, index) => {
                    const angleRad = (service.angle * Math.PI) / 180;
                    const textDistance = 145;
                    const textX = 250 + Math.cos(angleRad) * textDistance;
                    const textY = 250 + Math.sin(angleRad) * textDistance;
                    const isHovered = hoveredIndex === index;

                    return (
                        <motion.g
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.1 * index, type: "spring", stiffness: 100 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{ cursor: "pointer" }}
                        >
                            {/* Petal shape */}
                            <motion.path
                                d={createPetalPath(250, 250, service.angle, 200, 70)}
                                fill={`url(#petal${index})`}
                                stroke="#8BC34A"
                                strokeWidth="1"
                                filter="url(#petalShadow)"
                                animate={{ 
                                    scale: isHovered ? 1.08 : 1,
                                    filter: isHovered ? "url(#hoverGlow)" : "url(#petalShadow)"
                                }}
                                transition={{ duration: 0.2 }}
                                style={{ transformOrigin: "250px 250px" }}
                            />

                            {/* Service name text */}
                            <text
                                x={textX}
                                y={textY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#1a1a1a"
                                fontSize="13"
                                fontWeight="700"
                                fontFamily="system-ui, -apple-system, sans-serif"
                                fontStyle="italic"
                            >
                                {service.name.split("\n").map((line, i) => (
                                    <tspan 
                                        key={i} 
                                        x={textX} 
                                        dy={i === 0 ? `-${(service.name.split("\n").length - 1) * 8}px` : "16px"}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        </motion.g>
                    );
                })}

                {/* CENTER CIRCLE */}
                <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                >
                    {/* White center circle with border */}
                    <circle 
                        cx="250" 
                        cy="250" 
                        r="65" 
                        fill="url(#centerGrad)" 
                        stroke="#7CB342"
                        strokeWidth="2"
                    />

                    {/* Bulb icon - updated design */}
                    <g transform="translate(250, 250)">
                        {/* Bulb outline - thick green stroke, no fill */}
                        <path
                            d="M0 -38 C-22 -38 -35 -20 -35 0 C-35 12 -28 22 -18 30 L-18 36 C-18 38 -16 40 -14 40 L14 40 C16 40 18 38 18 36 L18 30 C28 22 35 12 35 0 C35 -20 22 -38 0 -38"
                            fill="none"
                            stroke="#7cb342"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Plant stem */}
                        <path
                            d="M0 25 L0 0"
                            stroke="#7cb342"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        {/* Left leaf */}
                        <motion.path
                            d="M0 8 C-8 4 -14 8 -12 16 C-10 20 -4 18 0 12"
                            fill="#7cb342"
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ delay: 0.8, duration: 0.3 }}
                        />
                        {/* Right leaf */}
                        <motion.path
                            d="M0 -2 C8 -6 14 -2 12 6 C10 10 4 8 0 2"
                            fill="#7cb342"
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ delay: 0.9, duration: 0.3 }}
                        />
                        {/* Bottom bars - green */}
                        <rect x="-14" y="42" width="28" height="4" rx="1" fill="#7cb342" />
                        <rect x="-11" y="48" width="22" height="3" rx="1" fill="#7cb342" />
                    </g>

                    {/* HONESTY text - blue */}
                    <text
                        x="250"
                        y="310"
                        textAnchor="middle"
                        fill="#0288D1"
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="system-ui, -apple-system, sans-serif"
                    >
                        Honesty
                    </text>
                </motion.g>
            </svg>
        </div>
    );
}
