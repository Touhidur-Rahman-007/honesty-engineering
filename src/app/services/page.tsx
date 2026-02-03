"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AreaTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
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
            "PFI, MDB, SDB Supply & Standard Earthing",
            "Thermography & Insulation Testing",
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
            "Sub-Station & Earthing Layout Design",
            "PA System Layout & Design",
            "Industrial Machine Layout Design",
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
            "ERP Systems",
            "SaaS Products",
            "Web / Desktop Application",
            "Custom Software Solutions",
        ],
    },
    other: {
        title: "Other Services",
        icon: "🔧",
        color: "from-indigo-400 to-indigo-600",
        items: [
            "Bus-bar Supply & Installation",
            "Generator Installation",
            "Boiler Installation",
            "Steam Line & Pipe Line Works",
            "Landscape & Carpeting",
            "Consultation",
        ],
    },
};

type ServiceKey = keyof typeof servicesData;

declare global {
    interface Window {
        __setActiveService?: (key: ServiceKey) => void;
    }
}

export default function ServicesPage() {
    const [activeService, setActiveService] = useState<ServiceKey>("electrical");
    const ref = useRef(null);
    const serviceDetailRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    // Handle hash navigation - when page loads with a hash like #software, select that service
    useEffect(() => {
        const setFromHash = (hash?: string) => {
            if (hash && hash in servicesData) {
                setActiveService(hash as ServiceKey);
                // Scroll to service detail section after a brief delay
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        serviceDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    });
                });
            }
        };

        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "");
            setFromHash(hash);
        };

        // Handle custom event from header navigation (when already on services page)
        const handleCustomHashChange = (e: Event) => {
            const hash = (e as CustomEvent<{ hash: string }>).detail?.hash;
            setFromHash(hash);
        };

        // Expose global setter for header fallback
        window.__setActiveService = (key: ServiceKey) => setFromHash(key);

        // Check hash on initial load
        handleHashChange();

        // Listen for hash changes (in case user navigates via browser)
        window.addEventListener("hashchange", handleHashChange);
        // Listen for custom event from header navigation
        window.addEventListener("serviceHashChange", handleCustomHashChange);
        
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("serviceHashChange", handleCustomHashChange);
            delete window.__setActiveService;
        };
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-28">
            {/* Decorative elements */}
            <div className="hidden sm:block">
                <CircuitCorner position="top-left" />
                <CircuitCorner position="bottom-right" />
            </div>

            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl hidden md:block" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl hidden md:block" />

            <div ref={ref} className="container mx-auto px-4 relative z-10 py-8">
                <SectionTitle
                    subtitle="What We Offer"
                    title="Our Services"
                    highlight="Services"
                    align="center"
                />

                {/* One Point Solution Banner */}
                <AnimatedSection className="mb-8">
                    <motion.div
                        className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-white"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.p
                            className="text-sm sm:text-base mb-1"
                            style={{ fontFamily: "'Satisfy', cursive" }}
                        >
                            We Do
                        </motion.p>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
                            <span className="px-2 sm:px-3 py-1 bg-primary-400 rounded-lg">TURNKEY PROJECTS</span>
                        </h3>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 text-primary-100">
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
                    ref={serviceDetailRef}
                    key={activeService}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-4xl mx-auto scroll-mt-32"
                >
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 border border-primary-100">
                        {/* Service Header */}
                        <div className="flex items-center gap-3 sm:gap-4 mb-6">
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

            </div>
        </main>
    );
}
