"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AreaTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  AnimatedCard, 
  IconCard, 
  CircuitCorner 
} from "@/components/common";

// Services data extracted from company profile images
const servicesData = {
    electrical: {
        title: "Electrical Works",
        icon: "⚡",
        color: "from-yellow-400 to-orange-500",
        items: [
            "Sub-Station Supply & Installation",
            "PFI, MDB, SDB Supply & Standard Earthing & Boring",
            "Thermography, Earthing & Insulation Testing",
            "Automation & Instrumentation",
            "All Kinds of Electrical Wiring",
        ],
    },
    civil: {
        title: "Civil Construction",
        icon: "🏗️",
        color: "from-blue-400 to-blue-600",
        items: [
            "RCC & Steel Structure Works as per RSC & BNBC",
            "Architecture, Structural Design & Drawing",
        ],
    },
    electricalDesign: {
        title: "Electrical Design",
        icon: "📐",
        color: "from-purple-400 to-purple-600",
        items: [
            "Electrical Single Line Diagram (SLD)",
            "Electrical Layout Design (ELD)",
            "Lighting Protection System (LPS)",
            "Sub-Station & Earthing Layout Design (BNBC, RSC, BS-7671 & IEC)",
            "PA System Layout & Design",
            "Air & Steam Distribution Line Design",
            "Industrial Production Machine Layout Design",
        ],
    },
    fireSafety: {
        title: "Fire Safety",
        icon: "🔥",
        color: "from-red-400 to-red-600",
        items: [
            "Fire Detection & Alarm System",
            "Fire Hydrant & Sprinkler System",
            "Fire Door & Fire Separation",
            "Automatic Gas Suspension System",
        ],
    },
    factory: {
        title: "Factory Furniture",
        icon: "🏭",
        color: "from-gray-400 to-gray-600",
        items: [
            "QC Table",
            "Swing Table",
            "Operator Chair",
            "Line Table",
            "Industrial Rack",
            "Cutting Table",
            "Finishing Table",
        ],
    },
    interior: {
        title: "Interior Works",
        icon: "🎨",
        color: "from-pink-400 to-pink-600",
        items: [
            "Residential Interior Design",
            "Commercial Interior Design",
            "Corporate Interior Design",
            "Architectural Support",
        ],
    },
    software: {
        title: "Software Solutions",
        icon: "💻",
        color: "from-green-400 to-teal-500",
        items: [
            "ERP Systems (Enterprise Resource Planning)",
            "SaaS Products",
            "Web / Desktop Application Development",
            "Custom Software Solutions",
        ],
    },
    other: {
        title: "Other Services",
        icon: "🔧",
        color: "from-indigo-400 to-indigo-600",
        items: [
            "Bus-bar Supply & Installation",
            "Generator Installation Works",
            "Boiler Installation Works",
            "Steam Line & Air Compressor Pipe Line Works",
            "Landscape",
            "Carpeting",
            "Consultation",
        ],
    },
};

type ServiceKey = keyof typeof servicesData;

export function Services() {
    const [activeService, setActiveService] = useState<ServiceKey>("electrical");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    return (
        <section id="services" className="relative py-8 sm:py-12 bg-gradient-to-b from-primary-50 to-white overflow-hidden">
            {/* Decorative elements - hidden on mobile for performance */}
            <div className="hidden sm:block">
                <CircuitCorner position="top-left" />
                <CircuitCorner position="bottom-right" />
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl hidden md:block" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl hidden md:block" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                <SectionTitle
                    subtitle="What We Offer"
                    title="Our Services"
                    highlight="Services"
                    align="center"
                />

                {/* One Point Solution Banner */}
                <AnimatedSection className="mb-6 sm:mb-10">
                    <motion.div
                        className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center text-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.p
                            className="text-base sm:text-lg md:text-xl mb-2"
                            style={{ fontFamily: "'Satisfy', cursive" }}
                        >
                            We Do
                        </motion.p>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                            <span className="px-3 sm:px-4 py-1 bg-primary-400 rounded-lg">TURNKEY PROJECTS</span>
                        </h3>
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-3 sm:mt-4 text-primary-100">
                            ONE POINT SOLUTION
                        </p>
                    </motion.div>
                </AnimatedSection>

                {/* Service Category Tabs */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {Object.entries(servicesData).map(([key, service]) => (
                        <motion.button
                            key={key}
                            onClick={() => setActiveService(key as ServiceKey)}
                            className={cn(
                                "px-3 py-2 sm:px-4 rounded-full font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base",
                                activeService === key
                                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                                    : "bg-white text-primary-700 hover:bg-primary-100 border border-primary-200"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{service.icon}</span>
                            <span className="hidden sm:inline">{service.title}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Active Service Details */}
                <motion.div
                    key={activeService}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 border border-primary-100">
                        {/* Service Header */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <motion.div
                                className={cn(
                                    "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl sm:text-3xl",
                                    servicesData[activeService].color
                                )}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                                {servicesData[activeService].icon}
                            </motion.div>
                            <div>
                                <AreaTitle area="Area of" interest={servicesData[activeService].title} />
                            </div>
                        </div>

                        {/* Service Items */}
                        <StaggerContainer className="space-y-3 sm:space-y-4">
                            {servicesData[activeService].items.map((item, index) => (
                                <StaggerItem key={item}>
                                    <motion.div
                                        className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors group"
                                        whileHover={{ x: 10 }}
                                    >
                                        <span className="text-primary-500 font-bold text-sm sm:text-base">❖</span>
                                        <span className="text-primary-700 group-hover:text-primary-800 transition-colors text-sm sm:text-base">
                                            {item}
                                        </span>
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </motion.div>

                {/* "ALL OUR SERVICES" SECTION - HIDDEN
                    📍 Location: Services.tsx line ~225
                    🔧 To RESTORE: Change "false &&" to "true &&" below
                */}
                {false && (
                <AnimatedSection delay={0.3} className="mt-10 sm:mt-16">
                    <h3 className="text-xl sm:text-2xl font-bold text-center text-primary-800 mb-6 sm:mb-8">All Our Services</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {Object.entries(servicesData).map(([key, service], index) => (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                whileHover={{ y: -5 }}
                                onClick={() => setActiveService(key as ServiceKey)}
                                className={cn(
                                    "p-4 rounded-xl bg-white border cursor-pointer transition-all",
                                    activeService === key
                                        ? "border-primary-400 shadow-lg"
                                        : "border-primary-100 hover:border-primary-300"
                                )}
                            >
                                <div className="text-3xl mb-2">{service.icon}</div>
                                <div className="font-semibold text-primary-800 text-sm">{service.title}</div>
                                <div className="text-xs text-primary-500 mt-1">{service.items.length} services</div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>
                )}
            </div>
        </section>
    );
}
