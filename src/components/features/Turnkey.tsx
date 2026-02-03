"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export function Turnkey() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            id="turnkey"
            ref={ref}
            className="py-8 sm:py-12 bg-gradient-to-br from-primary-50 via-white to-secondary-50"
        >
            <div className="container mx-auto px-4">
                {/* Simple Turnkey Banner - matching the design */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-r from-primary-500 via-primary-500 to-primary-400 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center"
                >
                    <motion.p
                        className="text-white/90 text-base sm:text-lg mb-2"
                        style={{ fontFamily: "'Satisfy', cursive" }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        We Do
                    </motion.p>
                    
                    <motion.div
                        className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl mb-3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
                            TURNKEY PROJECTS
                        </h2>
                    </motion.div>
                    
                    <motion.h3
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        ONE POINT SOLUTION
                    </motion.h3>
                </motion.div>

                {/* See All Services Button */}
                <motion.div
                    className="mt-6 sm:mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Link href="/services">
                        <motion.button
                            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            See All Services →
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
