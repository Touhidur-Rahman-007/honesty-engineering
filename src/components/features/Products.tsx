"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  CircuitCorner 
} from "@/components/common";

// Products data from company profile
const products = [
    { name: "Bus-bars", image: "/assets/images/products/busbar.png", category: "Electrical" },
    { name: "KSB Submersible Pumps", image: "/assets/images/products/boiler.png", category: "Pumps" },
    { name: "Industrial Generators", image: "/assets/images/products/generator.png", category: "Power" },
    { name: "Fire Suppression Systems", image: "/assets/images/services/fire.png", category: "Safety" },
];

const categories = ["All", "Electrical", "Pumps", "Power", "Safety"];

export function Products() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [activeCategory, setActiveCategory] = useState("All");
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <section id="products" className="relative py-10 sm:py-14 bg-white overflow-hidden">
            {/* Decorative elements */}
            <CircuitCorner position="top-right" />
            <CircuitCorner position="bottom-left" />

            {/* Background decorations */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 hidden sm:block" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                {/* Section Title */}
                <SectionTitle
                    subtitle="What We Supply"
                    title="Our Products"
                    highlight="Products"
                    align="center"
                />

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                    {categories.map((category) => (
                        <motion.button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-3 py-1.5 sm:px-5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base",
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

                {/* Products Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.name}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group relative"
                            onMouseEnter={() => setHoveredProduct(product.name)}
                            onMouseLeave={() => setHoveredProduct(null)}
                        >
                            <motion.div
                                className="relative bg-white rounded-2xl overflow-hidden shadow-md border border-primary-100 aspect-square"
                                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(124, 179, 66, 0.2)" }}
                            >
                                {/* Product Image */}
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        initial={{ scale: 1 }}
                                        whileHover={{ scale: 1.15 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent" />
                                </div>

                                {/* Overlay on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/40 to-transparent flex items-end p-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: hoveredProduct === product.name ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-white">
                                        <p className="font-bold">{product.name}</p>
                                        <p className="text-sm text-white/80">{product.category}</p>
                                    </div>
                                </motion.div>

                                {/* Category badge */}
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-700">
                                        {product.category}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Product name (visible on mobile) */}
                            <div className="mt-3 text-center md:hidden">
                                <p className="font-medium text-primary-800 text-sm">{product.name}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
