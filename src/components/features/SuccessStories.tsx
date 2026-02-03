"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  GradientCard, 
  CircuitCorner 
} from "@/components/common";

// Success stories from company profile
const successStories = [
    {
        title: "Rich Cotton Apparels Ltd",
        description: "Complete turnkey project including electrical, civil construction, and interior works.",
        type: "Turnkey Project",
        image: "/assets/images/projects/rich-cotton.jpg",
    },
    {
        title: "Philko Sports Ltd",
        description: "Contract signing and full project implementation for factory setup.",
        type: "Factory Setup",
        image: "/assets/images/projects/philko.jpg",
    },
    {
        title: "Scandex BD Ltd",
        description: "Successful project handover with complete electrical and fire safety systems.",
        type: "Project Completion",
        image: "/assets/images/projects/scandex.jpg",
    },
];

export function SuccessStories() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id="projects" className="relative py-8 sm:py-12 bg-white overflow-hidden">
            {/* Decorative elements */}
            <CircuitCorner position="top-right" />
            <CircuitCorner position="bottom-left" />

            {/* Background decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                {/* Our Success Section */}
                <div>
                    <SectionTitle
                        subtitle="Project Highlights"
                        title="Our Success"
                        highlight="Success"
                        align="center"
                    />

                    <StaggerContainer className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
                        {/* Rich Cotton Apparels Ltd */}
                        <StaggerItem>
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary-100"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
                                    <img 
                                        src="/assets/images/projects/Rich%20Cotton%20Apparels%20Ltd.png" 
                                        alt="Rich Cotton Apparels Ltd" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-secondary-500">
                                    <p className="text-white text-sm font-medium text-center">
                                        <span className="font-bold">Rich Cotton Apparels Ltd</span><br />
                                        Turnkey Project
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>

                        {/* Philko Sports Ltd - Contract Signing */}
                        <StaggerItem>
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary-100"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-50 overflow-hidden">
                                    <img 
                                        src="/assets/images/projects/Contract%20Signing%20at%20Philko%20Sports%20Ltd%20with%20MD.png" 
                                        alt="Contract Signing at Philko Sports Ltd with MD" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-secondary-500">
                                    <p className="text-white text-sm font-medium text-center">
                                        Contract Signing at<br />
                                        <span className="font-bold">Philko Sports Ltd</span><br />
                                        with MD
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>

                        {/* Scandex BD Ltd - Project Handover */}
                        <StaggerItem>
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary-100"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
                                    <img 
                                        src="/assets/images/projects/Project%20Handover%20at%20Scandex%20BD%20Ltd.png" 
                                        alt="Project Handover at Scandex BD Ltd" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-secondary-500">
                                    <p className="text-white text-sm font-medium text-center">
                                        Project Handover at<br />
                                        <span className="font-bold">Scandex BD Ltd</span>
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>

                        {/* Philko Sports Ltd - Factory */}
                        <StaggerItem>
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary-100"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                                    <img 
                                        src="/assets/images/projects/Philko%20Sports%20Ltd.png" 
                                        alt="Philko Sports Ltd Factory Setup" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-secondary-500">
                                    <p className="text-white text-sm font-medium text-center">
                                        <span className="font-bold">Philko Sports Ltd</span><br />
                                        Factory Setup
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>

                        {/* Scandex BD Ltd - Factory */}
                        <StaggerItem>
                            <motion.div
                                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-primary-100"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                                    <img 
                                        src="/assets/images/projects/Scandex%20BD%20Ltd.png" 
                                        alt="Scandex BD Ltd Production Line" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 bg-secondary-500">
                                    <p className="text-white text-sm font-medium text-center">
                                        <span className="font-bold">Scandex BD Ltd</span><br />
                                        Production Line
                                    </p>
                                </div>
                            </motion.div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>

                {/* Stats */}
                <AnimatedSection delay={0.5} className="mt-10">
                    <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 rounded-2xl p-8 text-white">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            {[
                                { value: "100+", label: "Projects Completed" },
                                { value: "15+", label: "Happy Clients" },
                                { value: "8+", label: "Years Experience" },
                                { value: "100%", label: "Client Satisfaction" },
                            ].map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="p-4"
                                >
                                    <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
