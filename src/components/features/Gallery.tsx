"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionTitle, AnimatedSection, CircuitCorner } from "@/components/common";
import { galleryAPI, type GalleryImage, type GalleryCategory } from "@/lib/api";

export function Gallery() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [allImages, setAllImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const [imagesData, categoriesData] = await Promise.all([
                    galleryAPI.getImages(),
                    galleryAPI.getCategories()
                ]);
                
                setAllImages(Array.isArray(imagesData) ? imagesData : []);
                setImages(Array.isArray(imagesData) ? imagesData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                setAllImages([]);
                setImages([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    useEffect(() => {
        if (activeCategory === "all") {
            setImages(allImages);
        } else {
            setImages(allImages.filter(img => img.category_slug === activeCategory));
        }
    }, [activeCategory, allImages]);

    return (
        <section id="gallery" className="relative py-8 sm:py-12 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
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

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {/* Category Filter */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
                            <motion.button
                                onClick={() => setActiveCategory("all")}
                                className={cn(
                                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer",
                                    activeCategory === "all"
                                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                                        : "bg-white text-primary-700 hover:bg-primary-100 border border-primary-200"
                                )}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                All ({allImages.length})
                            </motion.button>
                            
                            {categories.map((category) => {
                                const count = allImages.filter(img => img.category_slug === category.slug).length;
                                return (
                                    <motion.button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.slug)}
                                        className={cn(
                                            "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer",
                                            activeCategory === category.slug
                                                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                                                : "bg-white text-primary-700 hover:bg-primary-100 border border-primary-200"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {category.name} ({count})
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Gallery Grid */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                            >
                                {images.map((image, index) => (
                                    <motion.div
                                        key={image.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-primary-50"
                                        onClick={() => setSelectedImage(image)}
                                        whileHover={{ y: -5 }}
                                    >
                                        {/* Image */}
                                        <Image
                                            src={image.image_path}
                                            alt={image.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                                            <h3 className="text-white font-bold text-xs sm:text-sm mb-1">
                                                {image.title}
                                            </h3>
                                            {image.description && (
                                                <p className="text-white/80 text-[10px] sm:text-xs line-clamp-2">
                                                    {image.description}
                                                </p>
                                            )}
                                            {image.category_name && (
                                                <span className="mt-2 inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-[10px] sm:text-xs font-medium">
                                                    {image.category_name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Featured Badge */}
                                        {image.is_featured === 1 && (
                                            <div className="absolute top-2 right-2 bg-accent-500 text-primary-900 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                                ⭐ Featured
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {images.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-primary-600">No images found in this category.</p>
                            </div>
                        )}

                        {/* View All Link */}
                        <div className="text-center mt-8 sm:mt-12">
                            <Link href="/gallery">
                                <motion.button
                                    className="px-5 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Full Gallery →
                                </motion.button>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <div className="flex flex-col md:flex-row">
                                {/* Image */}
                                <div className="relative md:w-2/3 aspect-video md:aspect-auto">
                                    <Image
                                        src={selectedImage.image_path}
                                        alt={selectedImage.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                
                                {/* Details */}
                                <div className="md:w-1/3 p-6 bg-primary-50">
                                    <h2 className="text-2xl font-bold text-primary-800 mb-3">
                                        {selectedImage.title}
                                    </h2>
                                    {selectedImage.description && (
                                        <p className="text-primary-600 leading-relaxed mb-4">
                                            {selectedImage.description}
                                        </p>
                                    )}
                                    {selectedImage.category_name && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-primary-700 font-medium">Category:</span>
                                            <span className="px-3 py-1 bg-white rounded-full text-primary-600 text-sm">
                                                {selectedImage.category_name}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
