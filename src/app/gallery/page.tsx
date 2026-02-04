"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionTitle, CircuitCorner } from "@/components/common";

// Complete gallery images organized by category
const allGalleryImages = [
    // Construction
    { id: 1, title: "RCC Structure Work", category: "Construction", description: "RCC structure work in progress at factory site", src: "/assets/images/services/civil.png" },
    { id: 2, title: "Steel Framework", category: "Construction", description: "Steel structure installation for industrial building", src: "/assets/images/projects/success1.png" },
    { id: 3, title: "Foundation Work", category: "Construction", description: "Deep foundation construction", src: "/assets/images/services/civil.png" },
    { id: 4, title: "Building Construction", category: "Construction", description: "Multi-story building construction", src: "/assets/images/projects/project1.jpeg" },
    
    // Interior
    { id: 5, title: "Office Interior", category: "Interior", description: "Premium office interior design", src: "/assets/images/services/interior.png" },
    { id: 6, title: "Factory Interior", category: "Interior", description: "Industrial workspace interior", src: "/assets/images/services/furniture.png" },
    { id: 7, title: "Conference Room", category: "Interior", description: "Modern conference room setup", src: "/assets/images/services/interior.png" },
    
    // Electrical
    { id: 8, title: "Electrical Panel", category: "Electrical", description: "Sub-station installation", src: "/assets/images/services/electrical.png" },
    { id: 9, title: "Power Distribution", category: "Electrical", description: "Industrial power distribution setup", src: "/assets/images/services/electrical.png" },
    { id: 10, title: "Automation System", category: "Electrical", description: "Factory automation implementation", src: "/assets/images/services/software.png" },
    { id: 11, title: "Lighting Installation", category: "Electrical", description: "LED lighting system installation", src: "/assets/images/services/electrical.png" },
    
    // Architecture
    { id: 12, title: "Building Design", category: "Architecture", description: "Modern architectural design", src: "/assets/images/projects/project2.jpeg" },
    { id: 13, title: "Factory Layout", category: "Architecture", description: "Industrial factory layout planning", src: "/assets/images/projects/project3.jpeg" },
    
    // Projects
    { id: 14, title: "Rich Cotton Apparels", category: "Projects", description: "Complete turnkey project", src: "/assets/images/projects/Rich Cotton Apparels Ltd.png" },
    { id: 15, title: "Philko Sports Ltd", category: "Projects", description: "Factory setup project", src: "/assets/images/projects/Philko Sports Ltd.png" },
    { id: 16, title: "Scandex BD Ltd", category: "Projects", description: "Production line setup", src: "/assets/images/projects/Scandex BD Ltd.png" },
];

const categories = ["All", "Construction", "Interior", "Electrical", "Architecture", "Projects"];

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState<typeof allGalleryImages[0] | null>(null);

    const filteredImages = activeCategory === "All"
        ? allGalleryImages
        : allGalleryImages.filter(img => img.category === activeCategory);

    return (
        <main className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                    <motion.h1 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Image Gallery
                    </motion.h1>
                    <motion.p 
                        className="text-white/80 text-lg max-w-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Explore our complete portfolio of projects, showcasing our expertise in construction, 
                        electrical systems, interior design, and more.
                    </motion.p>
                </div>
            </div>

            {/* Gallery Content */}
            <section className="relative py-16 overflow-hidden">
                <CircuitCorner position="top-right" />
                <CircuitCorner position="bottom-left" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Category Filter */}
                    <motion.div 
                        className="flex flex-wrap justify-center gap-3 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "px-5 py-2.5 rounded-full font-medium transition-all duration-300 cursor-pointer",
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
                    </motion.div>

                    {/* Image Count */}
                    <p className="text-center text-primary-600 mb-8">
                        Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
                        {activeCategory !== "All" && ` in ${activeCategory}`}
                    </p>

                    {/* Gallery Grid */}
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, delay: index * 0.03 }}
                                    className="relative group cursor-pointer"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <motion.div
                                        className="relative rounded-2xl overflow-hidden bg-primary-100 aspect-[4/3]"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div className="text-white">
                                                <p className="font-bold">{image.title}</p>
                                                <p className="text-sm text-white/80">{image.description}</p>
                                            </div>
                                        </div>

                                        {/* Category badge */}
                                        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-700">
                                                {image.category}
                                            </span>
                                        </div>

                                        {/* Zoom icon */}
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            🔍
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

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
                            <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200">
                                <img 
                                    src={selectedImage.src} 
                                    alt={selectedImage.title}
                                    className="w-full h-full object-cover"
                                />
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
        </main>
    );
}
