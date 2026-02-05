'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { SectionTitle } from '@/components/common/SectionTitle';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  category_name: string;
  category_slug: string;
  category_color: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  service_count: number;
}

interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  services: Service[];
}

export default function ServicesByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [groupedServices, setGroupedServices] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'display_order' | 'title'>('display_order');

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/backend/api/service-categories.php');
      const data = await response.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' 
        ? `/backend/api/services.php?sort=${sortBy}`
        : `/backend/api/services.php?category=${selectedCategory}&sort=${sortBy}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        if (selectedCategory === 'all') {
          setGroupedServices(data.data);
        } else {
          // For single category, wrap in array format
          const categoryData = data.data;
          setGroupedServices([{
            id: 0,
            name: categoryData.category,
            slug: categoryData.category,
            icon: '',
            color: '',
            services: categoryData.services
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  return (
    <AnimatedSection className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Our Services"
          subtitle="Comprehensive solutions for your industrial needs"
        />

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Services
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.slug
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: selectedCategory === category.slug ? category.color : undefined
              }}
            >
              {category.name}
              {category.service_count > 0 && (
                <span className="ml-2 text-xs opacity-75">
                  ({category.service_count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex justify-end mb-8">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'display_order' | 'title')}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="display_order">Default Order</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : (
          /* Services Display */
          <div className="space-y-16">
            <AnimatePresence mode="wait">
              {groupedServices.map((category, categoryIndex) => (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  {selectedCategory === 'all' && (
                    <div className="flex items-center gap-4 mb-8">
                      {category.icon && (
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl"
                          style={{ backgroundColor: category.color }}
                        >
                          <i className={category.icon}></i>
                        </div>
                      )}
                      <h3 className="text-3xl font-bold text-gray-800">
                        {category.name}
                      </h3>
                      <div 
                        className="h-1 flex-grow rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  )}

                  {/* Services Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.services.map((service, serviceIndex) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: serviceIndex * 0.05 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                      >
                        <div className="p-6">
                          {/* Service Icon */}
                          {service.icon && (
                            <div 
                              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
                              style={{ backgroundColor: service.category_color || '#3B82F6' }}
                            >
                              <i className={service.icon}></i>
                            </div>
                          )}

                          {/* Service Title */}
                          <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                            {service.title}
                          </h4>

                          {/* Service Description */}
                          <p className="text-gray-600 leading-relaxed">
                            {service.description}
                          </p>

                          {/* Category Badge */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: service.category_color || '#3B82F6' }}
                            >
                              {service.category_name}
                            </span>
                          </div>
                        </div>

                        {/* Hover Effect Border */}
                        <div 
                          className="h-1 w-0 group-hover:w-full transition-all duration-300"
                          style={{ backgroundColor: service.category_color || '#3B82F6' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* No Services Message */}
            {groupedServices.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No services found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
