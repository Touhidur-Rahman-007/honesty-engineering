// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost/honesty-engineering/backend/api';

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data || data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

// Hero Section API
export interface HeroItem {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_url: string;
    button_text?: string;
    button_link?: string;
    display_order: number;
    is_active: number;
}

export const heroAPI = {
    getAll: () => fetchAPI<HeroItem[]>('/hero.php'),
};

// About Section API
export interface AboutFeature {
    id: number;
    icon: string;
    title: string;
    description: string;
    display_order: number;
}

export interface AboutSection {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    mission?: string;
    vision?: string;
    image_url?: string;
}

export interface AboutData {
    about: AboutSection;
    features: AboutFeature[];
}

export const aboutAPI = {
    get: () => fetchAPI<AboutData>('/about.php'),
};

// CEO Information API
export interface CEOInfo {
    id: number;
    name: string;
    designation: string;
    education?: string;
    phone?: string;
    email?: string;
    message: string;
    photo_url?: string;
}

export const ceoAPI = {
    get: () => fetchAPI<CEOInfo>('/ceo.php'),
};

// Services API
export interface Service {
    id: number;
    title: string;
    description: string;
    icon?: string;
    image_url?: string;
    category_id?: number;
    category_name?: string;
    category_slug?: string;
    is_featured: number;
    display_order: number;
    is_active: number;
}

export const servicesAPI = {
    getAll: (params?: { category?: string; featured?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.featured) queryParams.append('featured', '1');
        const query = queryParams.toString();
        return fetchAPI<Service[]>(`/services.php${query ? `?${query}` : ''}`);
    },
};

// Service Categories API
export interface ServiceCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    display_order: number;
}

export const serviceCategoriesAPI = {
    getAll: () => fetchAPI<ServiceCategory[]>('/service-categories.php'),
};

// Products API
export interface Product {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    category?: string;
    specifications?: string;
    price?: number;
    is_featured: number;
    display_order: number;
    is_active: number;
}

export const productsAPI = {
    getAll: (params?: { category?: string; featured?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.featured) queryParams.append('featured', '1');
        const query = queryParams.toString();
        return fetchAPI<Product[]>(`/products.php${query ? `?${query}` : ''}`);
    },
};

// Gallery API
export interface GalleryImage {
    id: number;
    title: string;
    description?: string;
    image_path: string;
    thumbnail_path?: string;
    category_id?: number;
    category_name?: string;
    category_slug?: string;
    is_featured: number;
    display_order: number;
    created_at: string;
}

export interface GalleryCategory {
    id: number;
    name: string;
    slug: string;
    display_order: number;
}

export const galleryAPI = {
    getImages: async (params?: { category?: string; featured?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.featured) queryParams.append('featured', '1');
        const query = queryParams.toString();
        const response = await fetchAPI<{ images: GalleryImage[]; categories: GalleryCategory[] } | GalleryImage[]>(`/gallery.php${query ? `?${query}` : ''}`);
        // Handle both array response and object response
        if (Array.isArray(response)) {
            return response;
        } else if (response && typeof response === 'object' && 'images' in response) {
            return response.images;
        }
        return [];
    },
    getCategories: () => fetchAPI<GalleryCategory[]>('/gallery.php?action=categories'),
};

// Clients API
export interface Client {
    id: number;
    name: string;
    logo_url?: string;
    website?: string;
    description?: string;
    display_order: number;
    is_active: number;
}

export const clientsAPI = {
    getAll: () => fetchAPI<Client[]>('/clients.php'),
};

// Projects API
export interface Project {
    id: number;
    title: string;
    description?: string;
    image_url?: string;
    client?: string;
    location?: string;
    duration?: string;
    category?: string;
    is_featured: number;
    display_order: number;
    is_active: number;
}

export const projectsAPI = {
    getAll: (params?: { featured?: boolean }) => {
        const queryParams = new URLSearchParams();
        if (params?.featured) queryParams.append('featured', '1');
        const query = queryParams.toString();
        return fetchAPI<Project[]>(`/projects.php${query ? `?${query}` : ''}`);
    },
};

// Site Config API
export interface SiteConfig {
    id: number;
    site_name: string;
    site_tagline?: string;
    site_description?: string;
    email?: string;
    phone?: string;
    address?: string;
    facebook?: string;
    linkedin?: string;
    whatsapp?: string;
    logo_url?: string;
    favicon_url?: string;
}

export const siteConfigAPI = {
    get: () => fetchAPI<SiteConfig>('/site-config.php'),
};

// Contact API
export interface ContactInquiry {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactAPI = {
    submit: (data: ContactInquiry) =>
        fetchAPI('/contact.php', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};
