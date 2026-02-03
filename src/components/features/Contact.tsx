"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  SectionTitle, 
  AnimatedSection, 
  StaggerContainer, 
  StaggerItem, 
  Button, 
  CircuitCorner, 
  CircuitLines 
} from "@/components/common";

// Contact information from company profile
const contactInfo = {
    address: "Road # 18, House # 14 (Lift 4), Sector # 10, Uttara, Dhaka-1230",
    hotline: "+880 1976 57 34 48",
    email: "info@honestyengineeringbd.com",
    website: "www.honestyengineeringbd.com",
    md: {
        name: "Engr. Md. Anwarul Islam Raton",
        education: "BSc (EEE), MSc (ECE)",
        designation: "Proprietor & CEO",
        phone: "+880 1716 57 34 48",
    },
    manager: {
        name: "Engr. Md. Abdul Malek",
        designation: "Manager",
        phone: "+880 1327 41 28 51",
    },
};

export function Contact() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        alert("Message sent successfully!");
    };

    return (
        <section id="contact" className="relative py-10 sm:py-14 bg-white overflow-hidden">
            {/* Decorative elements - hidden on mobile */}
            <div className="hidden sm:block">
                <CircuitCorner position="top-right" />
                <CircuitLines position="bottom" />
            </div>

            {/* Background decorations - hidden on mobile */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 hidden md:block" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 hidden md:block" />

            <div ref={ref} className="container mx-auto px-4 relative z-10">
                <SectionTitle
                    subtitle="Get in Touch"
                    title="Contact Us"
                    highlight="Contact"
                    align="center"
                />

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 mt-6 sm:mt-8 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <AnimatedSection direction="left">
                        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8 border border-primary-100">
                            <h3 className="text-lg sm:text-xl font-bold text-primary-800 mb-4 sm:mb-6">Send us a Message</h3>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-primary-700 mb-2">
                                            Full Name *
                                        </label>
                                        <motion.input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-primary-50/50"
                                            placeholder="Your name"
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary-700 mb-2">
                                            Email Address *
                                        </label>
                                        <motion.input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-primary-50/50"
                                            placeholder="your@email.com"
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-primary-700 mb-2">
                                            Phone Number
                                        </label>
                                        <motion.input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-primary-50/50"
                                            placeholder="+880 1XXX XXX XXX"
                                            whileFocus={{ scale: 1.01 }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-primary-700 mb-2">
                                            Subject *
                                        </label>
                                        <motion.select
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-primary-50/50"
                                            whileFocus={{ scale: 1.01 }}
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Project Quote">Project Quote</option>
                                            <option value="Electrical Works">Electrical Works</option>
                                            <option value="Civil Construction">Civil Construction</option>
                                            <option value="Fire Safety">Fire Safety</option>
                                            <option value="Interior Works">Interior Works</option>
                                            <option value="Software Solutions">Software Solutions</option>
                                            <option value="Partnership">Partnership</option>
                                        </motion.select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary-700 mb-2">
                                        Message *
                                    </label>
                                    <motion.textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-primary-50/50 resize-none"
                                        placeholder="How can we help you?"
                                        whileFocus={{ scale: 1.01 }}
                                    />
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-semibold text-white transition-all",
                                        isSubmitting
                                            ? "bg-primary-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl"
                                    )}
                                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                ⏳
                                            </motion.span>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </AnimatedSection>

                    {/* Contact Information */}
                    <AnimatedSection direction="right" delay={0.2}>
                        <div className="space-y-6">
                            {/* Contact Cards */}
                            <StaggerContainer className="space-y-4">
                                {/* Address */}
                                <StaggerItem>
                                    <motion.div
                                        className="bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex items-start gap-4"
                                        whileHover={{ x: 5, boxShadow: "0 10px 30px rgba(124, 179, 66, 0.15)" }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center text-2xl flex-shrink-0">
                                            📍
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-primary-800 mb-1">Head Office</h4>
                                            <p className="text-primary-600 text-sm">{contactInfo.address}</p>
                                        </div>
                                    </motion.div>
                                </StaggerItem>

                                {/* Phone */}
                                <StaggerItem>
                                    <motion.a
                                        href={`tel:${contactInfo.hotline.replace(/\s/g, "")}`}
                                        className="block bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex items-start gap-4"
                                        whileHover={{ x: 5, boxShadow: "0 10px 30px rgba(124, 179, 66, 0.15)" }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center text-2xl flex-shrink-0">
                                            📞
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-primary-800 mb-1">Hotline</h4>
                                            <p className="text-secondary-600 font-medium">{contactInfo.hotline}</p>
                                        </div>
                                    </motion.a>
                                </StaggerItem>

                                {/* Email */}
                                <StaggerItem>
                                    <motion.a
                                        href={`mailto:${contactInfo.email}`}
                                        className="block bg-white rounded-2xl p-6 shadow-md border border-primary-100 flex items-start gap-4"
                                        whileHover={{ x: 5, boxShadow: "0 10px 30px rgba(124, 179, 66, 0.15)" }}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-50 flex items-center justify-center text-2xl flex-shrink-0">
                                            ✉️
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-primary-800 mb-1">Email</h4>
                                            <p className="text-primary-600">{contactInfo.email}</p>
                                        </div>
                                    </motion.a>
                                </StaggerItem>

                            </StaggerContainer>

                            {/* Key Contacts */}
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
                                <h4 className="font-bold text-lg mb-4">Key Contacts</h4>
                                <div className="space-y-4">
                                    {/* MD */}
                                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <p className="font-semibold">{contactInfo.md.name}</p>
                                        <p className="text-sm opacity-80">{contactInfo.md.education}</p>
                                        <p className="text-sm opacity-80">{contactInfo.md.designation}</p>
                                        <p className="text-sm mt-1">{contactInfo.md.phone}</p>
                                    </div>
                                    {/* Manager */}
                                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                                        <p className="font-semibold">{contactInfo.manager.name}</p>
                                        <p className="text-sm opacity-80">{contactInfo.manager.designation}</p>
                                        <p className="text-sm mt-1">{contactInfo.manager.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
}
