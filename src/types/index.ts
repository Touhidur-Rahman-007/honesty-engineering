// Common types used across the application

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  title: string;
  icon: string;
  color: string;
  items: readonly string[];
}

export interface Client {
  name: string;
  logo: string;
}

export interface Product {
  name: string;
  image: string;
  category: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  category: string;
  description: string;
  src: string;
}

export interface SuccessStory {
  title: string;
  description: string;
  type: string;
  image: string;
}

export interface TeamMember {
  name: string;
  designation: string;
  education?: string;
  phone: string;
  image?: string;
}

export interface Address {
  street: string;
  sector?: string;
  area: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface ContactInfo {
  address: Address;
  phone: string;
  email: string;
  website: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  address: Address;
  credentials: {
    tradeLicense: string;
    tin: string;
    vat: string;
    bepza: string;
  };
  social: {
    facebook: string;
    linkedin: string;
    whatsapp: string;
  };
  founding: {
    year: number;
  };
}
