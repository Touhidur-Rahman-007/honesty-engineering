"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/common";

// Certificate data with PDF paths
const certificates = [
    { 
        label: "Trade License", 
        value: "004737",
        year: "2026",
        pdfPath: "/assets/documents/trade-license-2026.pdf",
        icon: "📜"
    },
    { 
        label: "TIN Certificate", 
        value: "817588536183",
        year: "2018",
        pdfPath: "/assets/documents/tin-certificate-2018.pdf",
        icon: "📋"
    },
    { 
        label: "VAT & BIN Certificate", 
        value: "002418684-0403",
        year: "2019",
        pdfPath: "/assets/documents/vat-bin-certificate-2019.pdf",
        icon: "📑"
    },
    { 
        label: "BEPZA License", 
        value: "DEPZCHA062",
        year: "2026",
        pdfPath: "/assets/documents/bepza-2026.pdf",
        icon: "🏛️"
    },
];

export default function CertificationPage() {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    const openPdf = (pdfPath: string) => {
        setSelectedPdf(pdfPath);
    };

    const closePdf = () => {
        setSelectedPdf(null);
    };

    return (
        <main className="min-h-screen pt-28 pb-20">
            <div className="w-full max-w-6xl mx-auto px-4">
                {/* Header */}
                <AnimatedSection delay={0.1} className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-4">
                        Our Certifications
                    </h1>
                    <p className="text-primary-600 text-lg max-w-2xl mx-auto">
                        Honesty Engineering is a fully licensed and certified company. 
                        Click on any certificate to view the official document.
                    </p>
                </AnimatedSection>

                {/* Certificates Grid */}
                <AnimatedSection delay={0.2}>
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 sm:p-8">
                        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {certificates.map((cert) => (
                                <StaggerItem key={cert.label}>
                                    <motion.button
                                        onClick={() => openPdf(cert.pdfPath)}
                                        className="w-full p-5 rounded-xl bg-white/10 backdrop-blur-sm text-white text-left hover:bg-white/20 transition-all cursor-pointer"
                                        whileHover={{ scale: 1.03, y: -5 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="text-3xl mb-3">{cert.icon}</div>
                                        <div className="text-xl font-bold mb-1">{cert.value}</div>
                                        <div className="text-sm opacity-80 mb-3">{cert.label}</div>
                                        <div className="flex items-center gap-2 text-xs bg-white/20 rounded-full px-3 py-1.5 w-fit">
                                            <span>📄</span>
                                            <span>View PDF ({cert.year})</span>
                                        </div>
                                    </motion.button>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>
                </AnimatedSection>

                {/* Quick Info */}
                <AnimatedSection delay={0.3} className="mt-8">
                    <div className="bg-primary-50 rounded-xl p-6 text-center">
                        <p className="text-primary-700">
                            <span className="font-semibold">GOVT. APPROVED 1st CLASS CONTRACTOR</span> • 
                            <span className="ml-2">BEPZA ENLISTED COMPANY</span>
                        </p>
                    </div>
                </AnimatedSection>
            </div>

            {/* PDF Viewer Modal */}
            {selectedPdf && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={closePdf}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b bg-primary-50">
                            <h3 className="font-bold text-primary-800">Certificate Viewer</h3>
                            <div className="flex items-center gap-2">
                                <a
                                    href={selectedPdf}
                                    download
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                                >
                                    ⬇️ Download
                                </a>
                                <button
                                    onClick={closePdf}
                                    className="w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        {/* PDF Embed */}
                        <div className="flex-1 bg-gray-100">
                            <iframe
                                src={selectedPdf}
                                className="w-full h-full"
                                title="Certificate PDF"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </main>
    );
}
