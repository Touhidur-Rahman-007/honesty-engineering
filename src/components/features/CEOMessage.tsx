"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedSection, CircuitCorner } from "@/components/common";
import { ceoAPI, type CEOInfo } from "@/lib/api";

export function CEOMessage() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [ceoData, setCeoData] = useState<CEOInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCEOData = async () => {
            try {
                const data = await ceoAPI.get();
                setCeoData(data);
            } catch (error) {
                console.error('Error fetching CEO data:', error);
                // Fallback to default
                setCeoData({
                    id: 1,
                    name: "Engr. Md. Anwarul Islam Raton",
                    designation: "Proprietor & CEO",
                    education: "BSc (EEE), MSc (ECE)",
                    phone: "+880 1716 57 34 48",
                    email: "",
                    message: "At Honesty Engineering, we deliver high quality services at competitive costs, focusing on expertise and quality over layers of oversight.",
                    photo_url: "/assets/images/team/ceo.png"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCEOData();
    }, []);

    if (loading) {
        return (
            <section className="relative py-10 sm:py-14 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative py-10 sm:py-14 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
            {/* Decorative elements */}
            <CircuitCorner position="top-right" />
            <CircuitCorner position="bottom-left" />

            {/* Background decorations */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-secondary-100/30 rounded-full blur-3xl -translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div ref={ref} className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <span
                            className="text-3xl md:text-4xl text-secondary-500"
                            style={{ fontFamily: "'Satisfy', cursive" }}
                        >
                            Greeting
                        </span>
                        <span
                            className="text-sm italic text-secondary-400 ml-2"
                            style={{ fontFamily: "'Satisfy', cursive" }}
                        >
                            from
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-secondary-600 mt-2">C.E.O.</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* CEO Photo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                {/* Frame decoration */}
                                <motion.div
                                    className="absolute -inset-3 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg"
                                    animate={isInView ? { rotate: [0, 2, -2, 0] } : {}}
                                    transition={{ duration: 5, repeat: Infinity }}
                                />
                                <div className="relative w-48 h-60 rounded-lg overflow-hidden border-4 border-white shadow-xl bg-primary-100">
                                    {/* CEO Photo */}
                                    <Image
                                        src={ceoData?.photo_url || "/assets/images/team/ceo.png"}
                                        alt={`${ceoData?.name} - ${ceoData?.designation}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* CEO Message */}
                        <AnimatedSection direction="up" delay={0.3} className="md:col-span-2">
                            <div className="space-y-3 text-primary-700 leading-relaxed text-sm sm:text-base">
                                {ceoData?.message ? (
                                    <div dangerouslySetInnerHTML={{ __html: ceoData.message }} />
                                ) : (
                                    <>
                                        <p>
                                            At <strong className="text-primary-800">Honesty Engineering</strong>, we deliver high quality services at competitive costs, focusing on expertise and quality over layers of oversight.
                                        </p>

                                        <p>
                                            Our team works closely with clients to ensure projects run efficiently and professionally. Every team member is carefully selected and trained for confident performance.
                                        </p>

                                        <p>
                                            Thank you for trusting <strong className="text-primary-800 italic">Honesty Engineering</strong>. We remain committed to integrity and excellence.
                                        </p>
                                    </>
                                )}

                                {/* Signature */}
                                <motion.div
                                    className="pt-4 border-t border-primary-200"
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    <div className="font-bold text-primary-800">{ceoData?.name || "Engr. Md. Anwarul Islam Raton"}</div>
                                    {ceoData?.education && <div className="text-sm text-primary-600">{ceoData.education}</div>}
                                    <div className="text-sm text-secondary-600 font-medium">{ceoData?.designation || "Proprietor & CEO"}</div>
                                    {ceoData?.phone && <div className="text-sm text-primary-600 mt-1">📞 {ceoData.phone}</div>}
                                    {ceoData?.email && <div className="text-sm text-primary-600">✉️ {ceoData.email}</div>}
                                </motion.div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Company Name at bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="text-center mt-6"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-secondary-600 tracking-wider">
                            HONESTY ENGINEERING
                        </h3>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
