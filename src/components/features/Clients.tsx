"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  CircuitCorner 
} from "@/components/common";

// Clients data from company profile - with logo images
const clients = [
    { name: "Rich Cotton Apparels Ltd", logo: "/assets/images/clients/rich cotton.png" },
    { name: "Scandex", logo: "/assets/images/clients/scandex.png" },
    { name: "Silken Sewing Ltd", logo: "/assets/images/clients/silken.png" },
    { name: "Philko Inc", logo: "/assets/images/clients/philko.png" },
    { name: "Bashundhara Group", logo: "/assets/images/clients/bashundhara.png" },
    { name: "GL Osman Group", logo: "/assets/images/clients/gl osman group.png" },
    { name: "Advance Group", logo: "/assets/images/clients/advance group.png" },
    { name: "SK Dreams", logo: "/assets/images/clients/sk dreams.png" },
    { name: "RP Group", logo: "/assets/images/clients/rp group.png" },
    { name: "AL", logo: "/assets/images/clients/al.png" },
    { name: "Gazipur Agriculture University", logo: "/assets/images/clients/gazipur agriculture university.png" },
    { name: "Pan Pacific Hotels and Resorts", logo: "/assets/images/clients/pan pacific.png" },
    { name: "Posmi Sweaters Limited", logo: "/assets/images/clients/posmi sweaters.png" },
    { name: "Saadatia", logo: "/assets/images/clients/saadatia.png" },
    { name: "Hyopshin", logo: "/assets/images/clients/hyopshin.png" },
    { name: "Bangladesh Metro", logo: "/assets/images/clients/bangladesh metro.png" },
];

export function Clients() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id="clients" className="relative py-8 sm:py-12 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
            {/* Decorative elements */}
            <CircuitCorner position="top-left" />
            <CircuitCorner position="bottom-right" />

            {/* Background decorations */}
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 hidden sm:block" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                <SectionTitle
                    subtitle="Trusted Partners"
                    title="Our Clients"
                    highlight="Clients"
                    align="center"
                />

                {/* Client Logos Grid - Responsive grid */}
                <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto">
                    {clients.map((client, index) => (
                        <motion.div
                            key={client.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: index * 0.03 }}
                            className="aspect-square bg-white rounded-xl shadow-sm border border-primary-100 flex flex-col items-center justify-center p-2 cursor-pointer group relative overflow-hidden"
                        >
                            {/* Client Logo Image */}
                            <img
                                src={client.logo}
                                alt={client.name}
                                className="w-full h-full object-contain p-1"
                            />
                            {/* Client name - visible on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/95 via-primary-800/80 to-primary-700/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2">
                                <span className="text-[10px] sm:text-xs text-center text-white font-bold leading-tight">
                                    {client.name}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Infinite scroll marquee - Hidden on mobile for performance */}
                <AnimatedSection delay={0.5} className="mt-6 sm:mt-10 hidden sm:block">
                    <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-4 sm:p-6 overflow-hidden">
                        <h3 className="text-center text-base sm:text-lg font-semibold text-primary-700 mb-4 sm:mb-6">
                            Trusted by Industry Leaders
                        </h3>

                        <div className="relative">
                            {/* Gradient masks */}
                            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

                            {/* Marquee */}
                            <motion.div
                                className="flex gap-12"
                                animate={{ x: [0, -1500] }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            >
                                {[...clients, ...clients].map((client, index) => (
                                    <div
                                        key={`${client.name}-${index}`}
                                        className="flex items-center gap-3 flex-shrink-0"
                                    >
                                        <img 
                                            src={client.logo} 
                                            alt={client.name}
                                            className="w-10 h-10 object-contain"
                                        />
                                        <span className="text-primary-600 font-medium whitespace-nowrap">
                                            {client.name}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>

            </div>
        </section>
    );
}
