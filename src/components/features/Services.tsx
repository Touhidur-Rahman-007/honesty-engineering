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
  AnimatedCard, 
  IconCard, 
  CircuitCorner 
} from "@/components/common";
import { servicesAPI, serviceCategoriesAPI, type Service, type ServiceCategory } from "@/lib/api";

interface GroupedServices {
    [key: string]: {
        category: ServiceCategory;
        services: Service[];
    };
}

export function Services() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServicesData = async () => {
            try {
                const [services, categories] = await Promise.all([
                    servicesAPI.getAll(),
                    serviceCategoriesAPI.getAll()
                ]);

                // Group services by category
                const grouped: GroupedServices = {};
                
                categories.forEach(category => {
                    const categoryServices = services.filter(
                        s => s.category_id === category.id && s.is_active === 1
                    );
                    
                    if (categoryServices.length > 0) {
                        grouped[category.slug] = {
                            category,
                            services: categoryServices.sort((a, b) => a.display_order - b.display_order)
                        };
                    }
                });

                setGroupedServices(grouped);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServicesData();
    }, []);

    const getCategoryColor = (slug: string): string => {
        const colors: { [key: string]: string } = {
            'electrical': 'from-yellow-400 to-orange-500',
            'civil': 'from-blue-400 to-blue-600',
            'electrical-design': 'from-purple-400 to-purple-600',
            'fire-safety': 'from-red-400 to-red-600',
            'factory-furniture': 'from-gray-400 to-gray-600',
            'interior': 'from-pink-400 to-pink-600',
            'software': 'from-green-400 to-teal-500',
        };
        return colors[slug] || 'from-primary-400 to-primary-600';
    };

    const getCategoryIcon = (slug: string, iconFromDB?: string): string => {
        if (iconFromDB) return iconFromDB;
        
        const icons: { [key: string]: string } = {
            'electrical': '⚡',
            'civil': '🏗️',
            'electrical-design': '📐',
            'fire-safety': '🔥',
            'factory-furniture': '🏭',
            'interior': '🎨',
            'software': '💻',
        };
        return icons[slug] || '🔧';
    };

    if (loading) {
        return (
            <section id="services" className="relative py-8 sm:py-12 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="relative py-8 sm:py-12 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
            {/* Decorative elements */}
            <div className="hidden sm:block">
                <CircuitCorner position="top-left" />
                <CircuitCorner position="bottom-right" />
            </div>

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                {/* Section Title */}
                <SectionTitle
                    subtitle="What We Offer"
                    title="Services"
                    highlight="Services"
                    align="center"
                />

                {/* Services Grid - Mobile optimized */}
                <div className="space-y-8 sm:space-y-12 mt-6 sm:mt-10">
                    {Object.entries(groupedServices).map(([slug, { category, services }], categoryIndex) => (
                        <AnimatedSection key={slug} delay={categoryIndex * 0.1}>
                            {/* Category Title */}
                            <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                <motion.div
                                    className={cn(
                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl bg-gradient-to-br",
                                        getCategoryColor(slug)
                                    )}
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {getCategoryIcon(slug, category.icon)}
                                </motion.div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-primary-800">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="text-xs sm:text-sm text-primary-600">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Service Items */}
                            <StaggerContainer className="grid gap-2 sm:gap-3">
                                {services.map((service, index) => (
                                    <StaggerItem key={service.id}>
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="group flex items-start gap-3 p-3 sm:p-4 bg-white rounded-lg border border-primary-100 hover:border-primary-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                            whileHover={{ x: 8 }}
                                        >
                                            <div className={cn(
                                                "flex-shrink-0 w-2 h-2 rounded-full mt-1.5 sm:mt-2 bg-gradient-to-br",
                                                getCategoryColor(slug)
                                            )} />
                                            <div className="flex-1">
                                                <h4 className="text-sm sm:text-base font-semibold text-primary-800 group-hover:text-primary-600 transition-colors">
                                                    {service.title}
                                                </h4>
                                                {service.description && (
                                                    <p className="text-xs sm:text-sm text-primary-600 mt-1 line-clamp-2">
                                                        {service.description}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {/* Arrow indicator */}
                                            <motion.div
                                                className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                initial={{ x: -10 }}
                                                whileHover={{ x: 0 }}
                                            >
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </motion.div>
                                        </motion.div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            {/* Divider */}
                            {categoryIndex < Object.keys(groupedServices).length - 1 && (
                                <div className="mt-6 sm:mt-8 border-t border-primary-200" />
                            )}
                        </AnimatedSection>
                    ))}
                </div>

                {Object.keys(groupedServices).length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-primary-600">No services available at the moment.</p>
                    </div>
                )}

                {/* CTA Section */}
                <AnimatedSection delay={0.6} className="mt-10 sm:mt-16 text-center">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 sm:p-10 shadow-2xl">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
                            Need a Custom Solution?
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base mb-5 sm:mb-6 max-w-2xl mx-auto">
                            We provide tailored engineering solutions to meet your specific needs. Let's discuss your project.
                        </p>
                        <motion.button
                            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-white text-primary-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const element = document.getElementById('contact');
                                if (element) {
                                    const headerHeight = 80;
                                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                                    window.scrollTo({
                                        top: elementPosition,
                                        behavior: 'smooth',
                                    });
                                }
                            }}
                        >
                            Contact Us Now
                        </motion.button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
