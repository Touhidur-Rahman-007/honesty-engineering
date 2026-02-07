"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  CircuitCorner 
} from "@/components/common";
import { productsAPI, type Product } from "@/lib/api";

export function Products() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [products, setProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productsAPI.getAll();
                const activeProducts = data.filter(p => p.is_active === 1);
                setAllProducts(activeProducts);
                setProducts(activeProducts);
                
                // Extract unique categories
                const uniqueCategories = ["All", ...Array.from(new Set(activeProducts.map(p => p.category).filter(Boolean)))];
                setCategories(uniqueCategories as string[]);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (activeCategory === "All") {
            setProducts(allProducts);
        } else {
            setProducts(allProducts.filter(p => p.category === activeCategory));
        }
    }, [activeCategory, allProducts]);

    return (
        <section id="products" className="relative py-8 sm:py-12 bg-white overflow-hidden">
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

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                            {categories.map((category) => (
                                <motion.button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "px-3 py-1.5 sm:px-5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base cursor-pointer",
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
                        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {products.map((product, index) => (
                                <StaggerItem key={product.id}>
                                    <motion.div
                                        className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -8 }}
                                        onHoverStart={() => setHoveredProduct(product.name)}
                                        onHoverEnd={() => setHoveredProduct(null)}
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
                                            {product.image_url ? (
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-4xl">
                                                    📦
                                                </div>
                                            )}
                                            
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            
                                            {/* Category Badge */}
                                            {product.category && (
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium text-primary-700">
                                                    {product.category}
                                                </div>
                                            )}

                                            {/* Featured Badge */}
                                            {product.is_featured === 1 && (
                                                <div className="absolute top-2 left-2 bg-accent-500 text-primary-900 px-2 py-0.5 rounded-full text-xs font-bold">
                                                    ⭐ Featured
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 sm:p-4">
                                            <h3 className="font-bold text-primary-800 text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-primary-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                            
                                            {/* View Details Button */}
                                            <motion.div
                                                className="mt-3 flex items-center gap-1 text-primary-600 text-xs sm:text-sm font-medium"
                                                initial={{ opacity: 0 }}
                                                animate={hoveredProduct === product.name ? { opacity: 1 } : { opacity: 0 }}
                                            >
                                                <span>View Details</span>
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </motion.div>
                                        </div>

                                        {/* Decorative corner */}
                                        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-3xl" />
                                    </motion.div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>

                        {products.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-primary-600">No products found in this category.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
