import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "@/styles/globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.honestyengineeringbd.com"),
  title: "Honesty Engineering | GOVT. APPROVED 1st CLASS CONTRACTOR",
  description:
    "Honesty Engineering is a multidisciplinary engineering consultancy firm established in 2018 in Bangladesh. We provide comprehensive services in electrical works, civil construction, fire safety, interior works, and software solutions. BEPZA ENLISTED COMPANY.",
  keywords: [
    "Honesty Engineering",
    "Engineering Consultancy",
    "Bangladesh Construction",
    "Electrical Works",
    "Civil Construction",
    "Fire Safety",
    "Interior Design",
    "Software Solutions",
    "BEPZA",
    "Turnkey Projects",
    "Industrial Solutions",
    "Factory Setup",
    "RCC Structure",
    "Steel Structure",
    "Electrical Installation",
    "Sub-Station",
    "Automation",
    "Factory Furniture",
  ],
  authors: [{ name: "Honesty Engineering" }],
  creator: "Honesty Engineering",
  publisher: "Honesty Engineering",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.honestyengineeringbd.com",
    siteName: "Honesty Engineering",
    title: "Honesty Engineering | GOVT. APPROVED 1st CLASS CONTRACTOR",
    description:
      "Your trusted partner for comprehensive engineering solutions. Delivering excellence in construction, electrical systems, and innovative technology since 2018.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Honesty Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Honesty Engineering | GOVT. APPROVED 1st CLASS CONTRACTOR",
    description:
      "Your trusted partner for comprehensive engineering solutions. Delivering excellence since 2018.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.honestyengineeringbd.com",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Honesty Engineering",
  description: "Multidisciplinary engineering consultancy firm established in 2018 in Bangladesh",
  url: "https://www.honestyengineeringbd.com",
  logo: "https://www.honestyengineeringbd.com/logo.png",
  foundingDate: "2018",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Road # 18, House # 14 (Lift 4), Sector # 10",
    addressLocality: "Uttara",
    addressRegion: "Dhaka",
    postalCode: "1230",
    addressCountry: "BD",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+880-1976-57-34-48",
    contactType: "customer service",
    email: "info@honestyengineeringbd.com",
  },
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Engineering Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Electrical Works" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Civil Construction" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fire Safety" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Works" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Software Solutions" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7cb342" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-white`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
