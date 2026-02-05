"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common";

interface NavItem {
    label: string;
    href: string;
    isExternal?: boolean;
    hasDropdown?: boolean;
}

// Service categories for dropdown
const serviceCategories = [
    { icon: "⚡", label: "Electrical Works", href: "/services#electrical" },
    { icon: "🏗️", label: "Civil Construction", href: "/services#civil" },
    { icon: "📐", label: "Electrical Design", href: "/services#electricalDesign" },
    { icon: "🔥", label: "Fire Safety", href: "/services#fireSafety" },
    { icon: "🏭", label: "Factory Furniture", href: "/services#factory" },
    { icon: "🎨", label: "Interior Works", href: "/services#interior" },
    { icon: "💻", label: "Software Solutions", href: "/services#software" },
    { icon: "🔧", label: "Other Services", href: "/services#other" },
];

const navItems: NavItem[] = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "/services", isExternal: true, hasDropdown: true },
    { label: "Projects", href: "#projects" },
    { label: "Gallery", href: "#gallery" },
    { label: "Clients", href: "#clients" },
    { label: "Contact", href: "#contact" },
    { label: "Certification", href: "/certification", isExternal: true },
];

// Glassmorphism Button Component (iPhone-style)
function GlassButton({ 
    children, 
    onClick, 
    isScrolled,
    className,
    isActive = false,
}: { 
    children: React.ReactNode; 
    onClick?: () => void;
    isScrolled: boolean;
    className?: string;
    isActive?: boolean;
}) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "relative px-4 py-2 font-semibold text-[14px] group cursor-pointer",
                isScrolled 
                    ? "text-primary-700" 
                    : "text-white",
                className
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Content */}
            <span className="relative z-10 flex items-center gap-1">
                {children}
            </span>
            {/* Bottom border - 75% width, centered */}
            <span className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 transition-all duration-300 ease-out",
                "group-hover:w-3/4",
                isScrolled ? "bg-primary-500" : "bg-white",
                isActive && "w-3/4"
            )} />
        </motion.button>
    );
}

// Services Dropdown Component
function ServicesDropdown({ isScrolled, onClose }: { isScrolled: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    
    const handleServiceClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        onClose();
        // Extract the hash from href
        const hash = href.split("#")[1];
        if (pathname?.startsWith("/services")) {
            if (typeof window !== "undefined") {
                window.location.hash = hash;
                window.dispatchEvent(new CustomEvent("serviceHashChange", { detail: { hash } }));
                (window as { __setActiveService?: (key: string) => void }).__setActiveService?.(hash);
            }
        } else {
            router.push(href);
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-6 w-72 p-3 rounded-3xl",
                "border border-white/30",
                "backdrop-blur-3xl",
                isScrolled 
                    ? "bg-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.15)]" 
                    : "bg-black/70 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            )}
            style={{
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                backdropFilter: "blur(40px) saturate(200%)",
            }}
        >
            {/* Dropdown arrow */}
            <div className={cn(
                "absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 rounded-sm",
                "border-l border-t border-white/30",
                isScrolled ? "bg-white/70" : "bg-black/30"
            )} style={{
                WebkitBackdropFilter: "blur(30px)",
                backdropFilter: "blur(30px)",
            }} />
            
            <div className="grid grid-cols-2 gap-2">
                {serviceCategories.map((service, index) => (
                    <motion.div
                        key={service.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                    >
                        <a
                            href={service.href}
                            onClick={(e) => handleServiceClick(e, service.href)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200",
                                "hover:scale-105",
                                isScrolled 
                                    ? "hover:bg-primary-100/60 text-primary-700" 
                                    : "hover:bg-white/20 text-white"
                            )}
                        >
                            <span className="text-lg">{service.icon}</span>
                            <span className="text-xs font-medium leading-tight">{service.label}</span>
                        </a>
                    </motion.div>
                ))}
            </div>
            
            {/* View All Services Link */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-2 pt-2 border-t border-white/20"
            >
                <Link
                    href="/services"
                    onClick={onClose}
                    className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200",
                        isScrolled 
                            ? "bg-primary-500/20 text-primary-700 hover:bg-primary-500/30" 
                            : "bg-white/20 text-white hover:bg-white/30"
                    )}
                >
                    View All Services
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </motion.div>
        </motion.div>
    );
}

// Logo Component with actual logo image
function Logo({ size = "md", isScrolled }: { size?: "sm" | "md" | "lg"; isScrolled?: boolean }) {
    const sizeStyles = {
        sm: { container: "w-10 h-10", text: "text-base" },
        md: { container: "w-14 h-14", text: "text-xl sm:text-2xl" },
        lg: { container: "w-20 h-20", text: "text-2xl" },
    };

    return (
        <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
        >
            {/* Logo Image */}
            <div className={cn("relative", sizeStyles[size].container)}>
                <Image
                    src={isScrolled ? "/assets/images/branding/logo.png" : "/assets/images/branding/logoWhite.png"}
                    alt="Honesty Engineering Logo"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <div className="flex flex-col">
                <span
                    className={cn("font-bold text-secondary-600", sizeStyles[size].text)}
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    Honesty Engineering
                </span>
            </div>
        </motion.div>
    );
}

// Quote Modal Component
function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/honesty-engineering/backend/api";
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const subject = formData.service
                ? `Quote Request - ${formData.service}`
                : "Quote Request";
            const messageParts = [
                formData.company ? `Company: ${formData.company}` : null,
                formData.message ? `Message: ${formData.message}` : null
            ].filter(Boolean);

            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject,
                message: messageParts.length ? messageParts.join("\n") : "Quote request"
            };

            const response = await fetch(`${API_BASE}/contact.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result?.success) {
                throw new Error(result?.error || result?.message || "Failed to submit request");
            }

            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", phone: "", company: "", service: "", message: "" });
                onClose();
            }, 3000);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to submit request";
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />
                
                {/* Modal */}
                <motion.div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">Get a Quote</h2>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors p-1 cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-white/80 mt-1">Fill out the form and we&apos;ll get back to you</p>
                    </div>

                    {/* Form */}
                    {isSubmitted ? (
                        <motion.div
                            className="p-8 text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-primary-800 mb-2">Thank You!</h3>
                            <p className="text-primary-600">We&apos;ll contact you shortly.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                        placeholder="+880 1XXX-XXXXXX"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Company</label>
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Company Name"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Service Required *</label>
                                <select
                                    required
                                    value={formData.service}
                                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="">Select a service</option>
                                    <option value="rcc-steel">RCC & Steel Structure</option>
                                    <option value="electrical">Electrical & Mechanical Solution</option>
                                    <option value="factory">Factory Production Furniture</option>
                                    <option value="interior">Interior Works</option>
                                    <option value="fire-safety">Fire Safety</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-primary-700 mb-1">Message</label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>
                            
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const servicesDropdownRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const pathname = usePathname();
    const router = useRouter();
    const isServicesPage = pathname?.startsWith("/services");
    const navigateToService = (href: string) => {
        const hash = href.split("#")[1];
        if (!hash) {
            router.push("/services");
            return;
        }

        if (isServicesPage) {
            if (typeof window !== "undefined") {
                window.location.hash = hash;
                window.dispatchEvent(new CustomEvent("serviceHashChange", { detail: { hash } }));
                (window as { __setActiveService?: (key: string) => void }).__setActiveService?.(hash);
            }
            return;
        }

        router.push(href);
    };
    
    // Check if we're on homepage or other pages
    const isHomePage = pathname === "/";
    // On non-home pages, always show scrolled style for visibility
    const showScrolledStyle = isScrolled || !isHomePage;

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileMenuOpen) {
                return;
            }
            if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
                setIsServicesDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isQuoteModalOpen || isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            // Reset services dropdown when mobile menu closes
            setIsServicesDropdownOpen(false);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isQuoteModalOpen, isMobileMenuOpen]);

    // Smooth scroll function - handles both same-page and cross-page navigation
    const handleNavigation = (href: string) => {
        if (href.startsWith("#")) {
            // It's an anchor link
            if (isHomePage) {
                // On homepage, scroll to section
                const targetId = href.substring(1);
                const element = document.getElementById(targetId);
                if (element) {
                    const headerHeight = 80;
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: "smooth",
                    });
                }
            } else {
                // On other pages, navigate to homepage with hash
                router.push("/" + href);
            }
        }
    };

    // Handle mobile service category navigation
    const handleMobileServiceClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        setIsServicesDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigateToService(href);
    };

    return (
        <>
            <motion.header
                className="fixed top-0 left-0 right-0 z-50"
                style={{
                    backgroundColor: showScrolledStyle ? 'rgba(255,255,255,0.85)' : 'transparent',
                    backdropFilter: showScrolledStyle ? 'blur(20px) saturate(180%)' : 'none',
                    WebkitBackdropFilter: showScrolledStyle ? 'blur(20px) saturate(180%)' : 'none',
                    boxShadow: showScrolledStyle ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
                    transition: 'background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="relative z-10">
                            <Logo size={showScrolledStyle ? "sm" : "md"} isScrolled={showScrolledStyle} />
                        </Link>

                        {/* Desktop Navigation - Glassmorphism Buttons */}
                        <div className="hidden lg:flex items-center gap-2">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="relative"
                                    ref={item.hasDropdown ? servicesDropdownRef : undefined}
                                    onMouseEnter={() => item.hasDropdown && setIsServicesDropdownOpen(true)}
                                    onMouseLeave={() => item.hasDropdown && setIsServicesDropdownOpen(false)}
                                >
                                    {item.hasDropdown ? (
                                        // Services button with dropdown
                                        <>
                                            <GlassButton
                                                isScrolled={showScrolledStyle}
                                                onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
                                            >
                                                {item.label}
                                                <motion.svg 
                                                    className="w-3 h-3 ml-1" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                    animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </motion.svg>
                                            </GlassButton>
                                            <AnimatePresence>
                                                {isServicesDropdownOpen && (
                                                    <ServicesDropdown 
                                                        isScrolled={showScrolledStyle} 
                                                        onClose={() => setIsServicesDropdownOpen(false)} 
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </>
                                    ) : item.isExternal ? (
                                        // External link (like Certification)
                                        <Link href={item.href}>
                                            <GlassButton isScrolled={showScrolledStyle}>
                                                {item.label}
                                            </GlassButton>
                                        </Link>
                                    ) : (
                                        // Internal anchor link
                                        <GlassButton 
                                            isScrolled={showScrolledStyle}
                                            onClick={() => handleNavigation(item.href)}
                                        >
                                            {item.label}
                                        </GlassButton>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button - Glassmorphism style */}
                        <div className="hidden lg:block">
                            <motion.button
                                onClick={() => setIsQuoteModalOpen(true)}
                                className={cn(
                                    "relative px-6 py-2.5 rounded-2xl font-bold text-[14px] transition-all duration-300 overflow-hidden",
                                    "border",
                                    "backdrop-blur-xl",
                                    showScrolledStyle 
                                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-primary-400/50 shadow-[0_4px_30px_rgba(46,125,50,0.3)] hover:shadow-[0_8px_40px_rgba(46,125,50,0.4)]" 
                                        : "bg-white/20 text-white border-white/40 shadow-[0_4px_30px_rgba(255,255,255,0.2)] hover:bg-white/30"
                                )}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                    backdropFilter: "blur(20px) saturate(180%)",
                                }}
                            >
                                <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10">Get Quote</span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="lg:hidden relative z-10 w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                className="w-6 h-0.5 rounded-full"
                                style={{
                                    backgroundColor: (showScrolledStyle || isMobileMenuOpen) ? '#2E7D32' : '#ffffff',
                                    transition: 'background-color 0.4s ease',
                                }}
                                animate={{
                                    rotate: isMobileMenuOpen ? 45 : 0,
                                    y: isMobileMenuOpen ? 8 : 0,
                                }}
                            />
                            <motion.span
                                className="w-6 h-0.5 rounded-full"
                                style={{
                                    backgroundColor: (showScrolledStyle || isMobileMenuOpen) ? '#2E7D32' : '#ffffff',
                                    transition: 'background-color 0.4s ease',
                                }}
                                animate={{
                                    opacity: isMobileMenuOpen ? 0 : 1,
                                }}
                            />
                            <motion.span
                                className="w-6 h-0.5 rounded-full"
                                style={{
                                    backgroundColor: (showScrolledStyle || isMobileMenuOpen) ? '#2E7D32' : '#ffffff',
                                    transition: 'background-color 0.4s ease',
                                }}
                                animate={{
                                    rotate: isMobileMenuOpen ? -45 : 0,
                                    y: isMobileMenuOpen ? -8 : 0,
                                }}
                            />
                        </motion.button>
                    </nav>
                </div>

                {/* Decorative bottom border */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isScrolled ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.header>

            {/* Mobile Menu Overlay - Glassmorphism Effect */}
            <motion.div
                className="fixed inset-0 z-40 lg:hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(232,245,233,0.8) 50%, rgba(200,230,201,0.75) 100%)',
                    backdropFilter: 'blur(30px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                }}
                initial={{ opacity: 0, x: "100%" }}
                animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? "0%" : "100%",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-100/30 via-transparent to-primary-200/20 pointer-events-none" />
                <div className="flex flex-col items-center justify-start h-full gap-3 pt-24 relative z-10 overflow-y-auto pb-8 px-4">
                    {navItems.map((item, index) => (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: 50 }}
                            animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="w-full max-w-[280px]"
                        >
                            {item.hasDropdown ? (
                                // Services with expandable menu on mobile
                                <div className="flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
                                        className="text-lg font-bold text-primary-800 hover:text-primary-500 transition-all duration-300 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] w-full text-center flex items-center justify-center gap-2 cursor-pointer"
                                        style={{
                                            WebkitBackdropFilter: "blur(20px)",
                                            backdropFilter: "blur(20px)",
                                        }}
                                    >
                                        {item.label}
                                        <motion.svg 
                                            className="w-4 h-4" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                            animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </motion.svg>
                                    </button>
                                    {/* Mobile service categories - expandable */}
                                    <AnimatePresence>
                                        {isServicesDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 gap-2 mt-3 p-3 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/20">
                                                    {serviceCategories.map((service) => (
                                                        <a
                                                            key={service.label}
                                                            href={service.href}
                                                            onClick={(e) => handleMobileServiceClick(e, service.href)}
                                                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-700 bg-white/40 hover:bg-white/60 transition-all shadow-sm"
                                                        >
                                                            <span className="text-base">{service.icon}</span>
                                                            <span className="text-xs leading-tight">{service.label}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                                {/* View All Services button */}
                                                <Link
                                                    href="/services"
                                                    onClick={() => {
                                                        setIsServicesDropdownOpen(false);
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className="flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-primary-500/20 text-primary-700 hover:bg-primary-500/30 transition-all w-full"
                                                >
                                                    View All Services
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : item.isExternal ? (
                                <Link
                                    href={item.href}
                                    className="block text-lg font-bold text-primary-800 hover:text-primary-500 transition-all duration-300 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        WebkitBackdropFilter: "blur(20px)",
                                        backdropFilter: "blur(20px)",
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    className="w-full text-lg font-bold text-primary-800 hover:text-primary-500 transition-all duration-300 cursor-pointer bg-white/40 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                                    onClick={() => {
                                        handleNavigation(item.href);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    style={{
                                        WebkitBackdropFilter: "blur(20px)",
                                        backdropFilter: "blur(20px)",
                                    }}
                                >
                                    {item.label}
                                </button>
                            )}
                        </motion.div>
                    ))}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        className="mt-4"
                    >
                        <motion.button
                            onClick={() => { setIsMobileMenuOpen(false); setIsQuoteModalOpen(true); }}
                            className="px-10 py-3 text-base font-bold rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white border border-primary-400/50 shadow-[0_8px_32px_rgba(46,125,50,0.3)]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                WebkitBackdropFilter: "blur(20px)",
                                backdropFilter: "blur(20px)",
                            }}
                        >
                            Get Quote
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Quote Modal */}
            <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
        </>
    );
}
