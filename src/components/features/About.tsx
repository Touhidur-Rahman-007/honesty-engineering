"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  CircuitCorner, 
  GradientCard 
} from "@/components/common";

export function About() {
    return (
        <section id="about" className="relative py-10 sm:py-14 bg-white overflow-hidden">
            {/* Decorative elements - hidden on mobile */}
            <div className="hidden sm:block">
                <CircuitCorner position="bottom-right" />
            </div>

            {/* Background decoration - hidden on mobile */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 hidden md:block" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 hidden md:block" />

            <div className="container mx-auto px-4 relative z-10">
                <SectionTitle
                    subtitle="Who We Are"
                    title="About Company"
                    highlight="Company"
                    align="center"
                />

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mt-6 sm:mt-8">
                    {/* Left Content */}
                    <AnimatedSection direction="left">
                        <div className="space-y-3 sm:space-y-4 text-primary-700 leading-relaxed text-sm sm:text-base">
                            <p>
                                <strong className="text-primary-800">Honesty Engineering Consultancy</strong> is a multidisciplinary firm established in <span className="font-semibold text-secondary-600">2018</span>, based in <span className="font-semibold">Bangladesh</span>.
                            </p>

                            <p>
                                We provide comprehensive services across:
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    "Electrical Safety",
                                    "Fire Safety",
                                    "Building Safety",
                                    "Sustainable Development",
                                    "Automation",
                                    "Construction Solutions",
                                ].map((item, index) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-primary-500" />
                                        <span className="text-sm">{item}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <p>
                                With strong expertise, we deliver landmark projects on time and within budget, specializing in energy-saving, safety assessments, and equipment supply.
                            </p>
                        </div>
                    </AnimatedSection>

                    {/* Right Content - Mission & Vision */}
                    <div className="space-y-6">
                        <AnimatedSection direction="right" delay={0.2}>
                            <GradientCard gradientFrom="#7cb342" gradientTo="#0288d1">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            <span className="text-2xl">🎯</span>
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-primary-800">OUR MISSION</h3>
                                    </div>
                                    <p className="text-primary-700 leading-relaxed text-sm">
                                        To be a leading provider of strategies delivering long-term commercial benefits with economical, efficient, and flexible solutions.
                                    </p>
                                </div>
                            </GradientCard>
                        </AnimatedSection>

                        <AnimatedSection direction="right" delay={0.4}>
                            <GradientCard gradientFrom="#0288d1" gradientTo="#7cb342">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            <span className="text-2xl">👁️</span>
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-secondary-800">OUR VISION</h3>
                                    </div>
                                    <p className="text-primary-700 leading-relaxed text-sm">
                                        To continually improve, contributing to environmental and social progress, establishing Honesty Engineering as a sustainable organization.
                                    </p>
                                </div>
                            </GradientCard>
                        </AnimatedSection>
                    </div>
                </div>


            </div>
        </section>
    );
}
