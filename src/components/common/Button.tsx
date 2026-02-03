"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
    children: ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    disabled?: boolean;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

export function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    onClick,
    disabled = false,
    icon,
    iconPosition = "left",
}: ButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 overflow-hidden group";

    const variantStyles = {
        primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl",
        secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 shadow-lg hover:shadow-xl",
        outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white",
        ghost: "text-primary-600 hover:bg-primary-50",
    };

    const sizeStyles = {
        sm: "px-4 py-2 text-sm gap-2",
        md: "px-6 py-3 text-base gap-2",
        lg: "px-8 py-4 text-lg gap-3",
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {/* Shimmer effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
            />

            {icon && iconPosition === "left" && (
                <span className="relative z-10">{icon}</span>
            )}
            <span className="relative z-10">{children}</span>
            {icon && iconPosition === "right" && (
                <span className="relative z-10">{icon}</span>
            )}
        </motion.button>
    );
}

// Animated Icon Button
interface IconButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    ariaLabel: string;
}

export function IconButton({
    children,
    className,
    onClick,
    ariaLabel,
}: IconButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-primary-600 hover:from-primary-200 hover:to-primary-100 transition-colors shadow-md hover:shadow-lg",
                className
            )}
            aria-label={ariaLabel}
        >
            {children}
        </motion.button>
    );
}

// Floating Action Button
interface FABProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    ariaLabel: string;
}

export function FloatingActionButton({
    children,
    className,
    onClick,
    ariaLabel,
}: FABProps) {
    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
                "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl z-50",
                className
            )}
            aria-label={ariaLabel}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                    background: "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
            />
            {children}
        </motion.button>
    );
}
