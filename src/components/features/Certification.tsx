"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionTitle } from "@/components/common";

const certifications = [
    { label: "Trade License", value: "004737", icon: "📋" },
    { label: "TIN Certificate", value: "817588536183", icon: "📄" },
    { label: "VAT Registration", value: "002418684-0403", icon: "🏛️" },
    { label: "BEPZA License", value: "DEPZCHA062", icon: "✅" },
];

export function Certification() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <section id="certification" className="relative py-20 overflow-hidden" ref={ref}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500" />
            
            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Our Certifications
                    </h2>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Government approved and officially registered business credentials
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert.label}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative group"
                        >
                            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 hover:bg-white/25 transition-all duration-300">
                                {/* Icon */}
                                <motion.div
                                    className="text-4xl mb-3"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    {cert.icon}
                                </motion.div>
                                
                                {/* Value */}
                                <div className="text-xl md:text-2xl font-bold text-white mb-2">
                                    {cert.value}
                                </div>
                                
                                {/* Label */}
                                <div className="text-sm md:text-base text-white/80 font-medium">
                                    {cert.label}
                                </div>

                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom decorative line */}
                <motion.div
                    className="mt-12 flex justify-center"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                >
                    <div className="w-32 h-1 bg-white/30 rounded-full" />
                </motion.div>
            </div>
        </section>
    );
}
