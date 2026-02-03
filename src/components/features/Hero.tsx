"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  Button, 
  AnimatedWords, 
  FloatingElement, 
  CircuitLines, 
  CircuitCorner 
} from "@/components/common";

export function Hero() {
    const ref = useRef(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section
            ref={ref}
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 pt-16 sm:pt-16 lg:pt-0"
        >
            {/* Animated Background Pattern */}
            <motion.div
                className="absolute inset-0 opacity-10"
                style={{ y: backgroundY }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
                {/* Background pattern - simple dots only, no industrial layout */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </motion.div>

            {/* Circuit decorations */}
            <CircuitLines position="bottom" color="rgba(255,255,255,0.3)" />
            <CircuitCorner position="top-left" color="rgba(255,255,255,0.2)" />
            <CircuitCorner position="bottom-right" color="rgba(255,255,255,0.2)" />

            {/* Floating decorative elements */}
            <FloatingElement className="absolute top-20 left-10 hidden lg:block" amplitude={20} duration={5}>
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm" />
            </FloatingElement>
            <FloatingElement className="absolute top-40 right-20 hidden lg:block" amplitude={15} duration={6} delay={1}>
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm" />
            </FloatingElement>
            <FloatingElement className="absolute bottom-32 left-20 hidden lg:block" amplitude={25} duration={7} delay={2}>
                <div className="w-12 h-12 rounded-full bg-secondary-400/30 backdrop-blur-sm" />
            </FloatingElement>

            <motion.div
                className="container mx-auto px-4 relative z-10"
                style={{ opacity }}
            >
                <div className="grid lg:grid-cols-2 gap-2 lg:gap-12 items-center max-w-full overflow-hidden">
                    {/* Left Content */}
                    <div className="text-center lg:text-left order-2 lg:order-1 w-full">
                        {/* Main Heading - Desktop: original sizes, Mobile: smaller */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-[22px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-4 leading-tight"
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                            <AnimatedWords text="HONESTY ENGINEERING" />
                        </motion.h1>

                        {/* Highlighted Badge - GOVT. APPROVED */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center lg:justify-start mb-2 sm:mb-4"
                        >
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-accent-400 to-accent-500 text-primary-900 text-[10px] sm:text-sm font-bold shadow-lg">
                                <span className="text-sm sm:text-lg">🏆</span>
                                <span className="leading-tight whitespace-nowrap">GOVT. APPROVED 1st CLASS CONTRACTOR</span>
                            </div>
                        </motion.div>

                        {/* BEPZA Badge - Highlighted */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex justify-center lg:justify-start mb-3 sm:mb-6"
                        >
                            <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-white/25 backdrop-blur-sm border border-white/40 text-white text-[10px] sm:text-sm font-bold shadow-lg">
                                <span className="text-sm sm:text-lg">⭐</span>
                                <span className="leading-tight whitespace-nowrap">BEPZA ENLISTED COMPANY</span>
                            </div>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-[13px] leading-relaxed sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-8 max-w-xl mx-auto lg:mx-0"
                        >
                            Your trusted partner for comprehensive engineering solutions since 2018.
                        </motion.p>

                        {/* CTA Buttons - Mobile: centered stacked, Desktop: side by side */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center lg:justify-start items-center w-full max-w-[280px] sm:max-w-none mx-auto lg:mx-0"
                        >
                            <Button 
                                variant="secondary" 
                                size="lg" 
                                className="w-full sm:w-auto py-2.5 sm:py-4 text-[13px] sm:text-base font-semibold shadow-lg"
                                onClick={() => {
                                    const element = document.getElementById('products');
                                    if (element) {
                                        const headerHeight = 80;
                                        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                                        window.scrollTo({
                                            top: elementPosition,
                                            behavior: 'smooth',
                                        });
                                    }
                                }}
                            >
                                Explore Services
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 w-full sm:w-auto py-2.5 sm:py-4 text-[13px] sm:text-base font-semibold backdrop-blur-sm bg-white/15 shadow-lg"
                                onClick={() => setShowPdfModal(true)}
                            >
                                Company Profile
                            </Button>
                        </motion.div>
                    </div>

                    {/* Right Content - Service Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                        className="flex justify-center lg:justify-end order-1 lg:order-2 mb-0 lg:mb-0 w-full"
                    >
                        {/* Service Wheel Image */}
                        <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
                            
                            {/* Service Wheel Image */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                                <Image
                                    src="/assets/images/hero/service-wheel.jpeg"
                                    alt="Honesty Engineering Services"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </motion.div>

                </div>
            </motion.div>

            {/* Scroll Indicator - hidden on mobile to save space */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:flex"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2 text-white/80"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <span className="text-sm font-medium">Scroll Down</span>
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 120"
                    className="w-full h-16 md:h-24 fill-white"
                    preserveAspectRatio="none"
                >
                    <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" />
                </svg>
            </div>

            {/* PDF Modal */}
            <AnimatePresence>
                {showPdfModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowPdfModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowPdfModal(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            {/* PDF Viewer */}
                            <iframe
                                src="/assets/documents/Company-Profile.pdf"
                                className="w-full h-full"
                                title="Company Profile"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
