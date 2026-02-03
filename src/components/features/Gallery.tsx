"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionTitle, AnimatedSection, CircuitCorner } from "@/components/common";

// Gallery images from company profile (removed Safety and Planning categories)
const galleryImages = [
    { id: 1, title: "Construction Site", category: "Construction", description: "RCC structure work in progress", src: "/assets/images/services/civil.png" },
    { id: 2, title: "Steel Framework", category: "Construction", description: "Steel structure installation", src: "/assets/images/projects/success1.png" },
    { id: 3, title: "Interior Design", category: "Interior", description: "Premium office interior", src: "/assets/images/services/interior.png" },
    { id: 4, title: "Electrical Panel", category: "Electrical", description: "Sub-station installation", src: "/assets/images/services/electrical.png" },
    { id: 5, title: "Software Solutions", category: "Electrical", description: "ERP development", src: "/assets/images/services/software.png" },
];

const categories = ["All", "Construction", "Interior", "Architecture", "Electrical"];

export function Gallery() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

    const filteredImages = activeCategory === "All"
        ? galleryImages
        : galleryImages.filter(img => img.category === activeCategory);

    return (
        <section id="gallery" className="relative py-10 sm:py-14 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
            {/* Decorative elements - hidden on mobile for performance */}
            <div className="hidden sm:block">
                <CircuitCorner position="top-left" />
                <CircuitCorner position="bottom-right" />
            </div>

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                {/* Section Title */}
                <SectionTitle
                    subtitle="Our Work"
                    title="Image Gallery"
                    highlight="Gallery"
                    align="center"
                />

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
                                activeCategory === category
                                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                                    : "bg-white text-primary-700 hover:bg-primary-100 border border-primary-200"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                {/* Gallery Grid - Responsive */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
                >
                    {filteredImages.map((image, index) => (
                        <motion.div
                            key={image.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={cn(
                                "relative group cursor-pointer",
                                index % 5 === 0 && "md:col-span-2 md:row-span-2"
                            )}
                            onClick={() => setSelectedImage(image)}
                        >
                            <motion.div
                                className={cn(
                                    "relative rounded-2xl overflow-hidden bg-primary-100",
                                    index % 5 === 0 ? "aspect-square" : "aspect-[4/3]"
                                )}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Real Image with Reveal Animation */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-primary-200 via-primary-100 to-secondary-100"
                                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                                    whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <img
                                        src={image.src}
                                        alt={image.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </motion.div>

                                {/* Overlay */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
                                >
                                    <div className="text-white">
                                        <p className="font-bold">{image.title}</p>
                                        <p className="text-sm text-white/80">{image.description}</p>
                                    </div>
                                </motion.div>

                                {/* Category badge */}
                                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-700">
                                        {image.category}
                                    </span>
                                </div>

                                {/* Zoom icon */}
                                <motion.div
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    🔍
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Plan Drawing Section */}
                <AnimatedSection delay={0.3} className="mt-8">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 border border-primary-100">
                        <h3 className="text-lg sm:text-2xl font-bold text-primary-800 mb-4 sm:mb-6 text-center">
                            <span className="px-2 sm:px-3 py-1 bg-primary-100 rounded-lg">Plan</span>
                            {" "}
                            <span className="text-accent-500">Drawing</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            <motion.div
                                className="aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img 
                                    src="/assets/images/gallery/plan-drawing-1.svg" 
                                    alt="Architectural Floor Plan" 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <motion.div
                                className="aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img 
                                    src="/assets/images/gallery/plan-drawing-2.svg" 
                                    alt="Electrical Layout Plan" 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <motion.div
                                className="aspect-video rounded-lg sm:rounded-xl overflow-hidden border-2 border-primary-200 hover:border-primary-400 transition-colors sm:col-span-2 md:col-span-1"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img 
                                    src="/assets/images/gallery/plan-drawing-3.svg" 
                                    alt="Factory Layout Plan" 
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-primary-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image */}
                            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <span className="text-8xl opacity-50">📷</span>
                            </div>

                            {/* Info */}
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xl font-bold text-primary-800">{selectedImage.title}</h4>
                                        <p className="text-primary-600">{selectedImage.description}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-primary-100 rounded-full text-sm font-medium text-primary-700">
                                        {selectedImage.category}
                                    </span>
                                </div>
                            </div>

                            {/* Close button */}
                            <motion.button
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary-700 hover:bg-white transition-colors"
                                onClick={() => setSelectedImage(null)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                ✕
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
