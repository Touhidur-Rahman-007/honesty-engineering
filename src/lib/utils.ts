import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Spring configurations
export const springConfig = {
  type: "spring",
  stiffness: 100,
  damping: 15
};

export const smoothSpring = {
  type: "spring",
  stiffness: 50,
  damping: 20
};

// Transition presets
export const quickTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1]
};

export const smoothTransition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96]
};

export const slowTransition = {
  duration: 1,
  ease: [0.43, 0.13, 0.23, 0.96]
};

// Viewport settings for scroll animations
export const viewportSettings = {
  once: true,
  amount: 0.3
};
