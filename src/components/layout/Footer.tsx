"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo, CircuitCorner } from "@/components/common";

const footerLinks = {
    services: [
        { label: "Electrical Works", href: "#services" },
        { label: "Civil Construction", href: "#services" },
        { label: "Fire Safety", href: "#services" },
        { label: "Interior Works", href: "#services" },
        { label: "Software Solutions", href: "#services" },
    ],
    licenses: [
        { label: "Trade License: 004737", href: "#" },
        { label: "TIN: 817588536183", href: "#" },
        { label: "VAT: 002418684-0403", href: "#" },
        { label: "BEPZA: DEPZCHA062", href: "#" },
    ],
    contact: [
        { label: "info@honestyengineeringbd.com", href: "mailto:info@honestyengineeringbd.com" },
        { label: "+880 1976 57 34 48", href: "tel:+8801976573448" },
        { label: "www.honestyengineeringbd.com", href: "https://www.honestyengineeringbd.com" },
    ],
};

export function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-primary-50 to-primary-100 overflow-hidden">
            {/* Decorative circuit corners */}
            <CircuitCorner position="top-right" />
            <CircuitCorner position="bottom-left" />

            {/* Quote Section */}
            <div className="relative bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 py-10 sm:py-16">
                <motion.div
                    className="container mx-auto px-4 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="text-3xl sm:text-5xl text-white/80 mb-3 sm:mb-4"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring" }}
                    >
                        ❝
                    </motion.div>
                    <motion.p
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white italic max-w-3xl mx-auto px-4"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        WE DO NOT MAKE DEALS
                        <br />
                        WE BUILD RELATION...
                    </motion.p>
                </motion.div>

                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" className="w-full h-12 fill-primary-50">
                        <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1350,45 1440,30 L1440,60 L0,60 Z" />
                    </svg>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-10 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
                    {/* Logo & Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Logo size="lg" className="mb-6" />
                        <p className="text-primary-600 mb-6 leading-relaxed">
                            A multidisciplinary engineering consultancy firm established in 2018.
                            GOVT. APPROVED 1st CLASS CONTRACTOR & BEPZA ENLISTED COMPANY.
                        </p>
                    </motion.div>

                    {/* Services Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h4 className="text-lg font-bold text-primary-800 mb-6">Our Services</h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-primary-600 hover:text-primary-500 transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover:bg-primary-500 transition-colors" />
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Licenses & Certificates */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h4 className="text-lg font-bold text-primary-800 mb-6">Licenses & Certificates</h4>
                        <ul className="space-y-3">
                            {footerLinks.licenses.map((link, index) => (
                                <motion.li
                                    key={link.label}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <span className="text-primary-600 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                                        {link.label}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="text-lg font-bold text-primary-800 mb-6">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-xl">📍</span>
                                <p className="text-primary-600">
                                    Road # 18, House # 14 (Lift 4), Sector # 10,
                                    <br />
                                    Uttara, Dhaka-1230
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">📞</span>
                                <a
                                    href="tel:+8801976573448"
                                    className="text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    +880 1976 57 34 48
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">✉️</span>
                                <a
                                    href="mailto:info@honestyengineeringbd.com"
                                    className="text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    info@honestyengineeringbd.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xl">🌐</span>
                                <a
                                    href="https://www.honestyengineeringbd.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-500 transition-colors"
                                >
                                    www.honestyengineeringbd.com
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-primary-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-600">
                        <p>
                            © {new Date().getFullYear()} Honesty Engineering. All rights reserved.
                        </p>
                        <p>
                            Powered by{" "}
                            <a
                                href="https://zyrotech.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-secondary-600 hover:text-secondary-500 transition-colors"
                            >
                                Zyrotech Bangladesh
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
