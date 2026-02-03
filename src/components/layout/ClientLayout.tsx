"use client";

import { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress, WhatsAppButton } from "@/components/common";

interface ClientLayoutProps {
    children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <>
            <ScrollProgress />
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
