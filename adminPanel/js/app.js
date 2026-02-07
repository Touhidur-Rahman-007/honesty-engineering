// Admin Panel Main JavaScript
// Note: API_BASE is defined in api.js

// Auth storage helper
const AuthStorage = {
    set(username) {
        try {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUsername', username || 'Admin');
        } catch (error) {
            // Ignore localStorage errors
        }

        try {
            sessionStorage.setItem('adminLoggedIn', 'true');
            sessionStorage.setItem('adminUsername', username || 'Admin');
        } catch (error) {
            // Ignore sessionStorage errors
        }

        document.cookie = `adminLoggedIn=true; path=/; max-age=${60 * 60 * 24 * 7}`;
        document.cookie = `adminUsername=${encodeURIComponent(username || 'Admin')}; path=/; max-age=${60 * 60 * 24 * 7}`;
    },
    clear() {
        try {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
        } catch (error) {
            // Ignore localStorage errors
        }

        try {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
        } catch (error) {
            // Ignore sessionStorage errors
        }

        document.cookie = 'adminLoggedIn=; path=/; max-age=0';
        document.cookie = 'adminUsername=; path=/; max-age=0';
    },
    isLoggedIn() {
        try {
            if (localStorage.getItem('adminLoggedIn') === 'true') return true;
        } catch (error) {
            // Ignore localStorage errors
        }

        try {
            if (sessionStorage.getItem('adminLoggedIn') === 'true') return true;
        } catch (error) {
            // Ignore sessionStorage errors
        }

        return document.cookie.includes('adminLoggedIn=true');
    },
    getUsername() {
        try {
            const name = localStorage.getItem('adminUsername');
            if (name) return name;
        } catch (error) {
            // Ignore localStorage errors
        }

        try {
            const name = sessionStorage.getItem('adminUsername');
            if (name) return name;
        } catch (error) {
            // Ignore sessionStorage errors
        }

        const match = document.cookie.match(/adminUsername=([^;]+)/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }

        return 'Admin';
    }
};

function updateAdminHeader() {
    const name = AuthStorage.getUsername();
    const nameEl = document.getElementById('admin-name');
    const initialEl = document.getElementById('admin-initial');

    if (nameEl) nameEl.textContent = name;
    if (initialEl) initialEl.textContent = name.trim().charAt(0).toUpperCase() || 'A';
}

// Check authentication (session + storage)
async function checkAuth() {
    if (AuthStorage.isLoggedIn()) {
        return true;
    }

    try {
        const response = await fetch('/honesty-engineering/backend/api/auth.php', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            if (result?.data?.logged_in) {
                AuthStorage.set(result.data.username || 'Admin');
                return true;
            }
        }
    } catch (error) {
        // Ignore auth check errors
    }

    window.location.href = 'login.html';
    return false;
}

// Logout function
async function logout() {
    try {
        await fetch('/honesty-engineering/backend/api/auth.php', {
            method: 'DELETE',
            credentials: 'include'
        });
    } catch (error) {
        // Ignore logout errors
    }

    AuthStorage.clear();
    window.location.href = 'login.html';
}

// Router
const router = {
    currentPage: 'dashboard',
    
    init() {
        this.handleHashChange();
        window.addEventListener('hashchange', () => this.handleHashChange());
        this.setupNavigation();
    },
    
    handleHashChange() {
        const hash = window.location.hash.slice(1) || 'dashboard';
        this.currentPage = hash;
        this.loadPage(hash);
        this.updateActiveNav(hash);
        this.updatePageTitle(hash);
    },
    
    loadPage(page) {
        const content = document.getElementById('content');
        
        switch(page) {
            case 'dashboard':
                content.innerHTML = dashboardPage();
                loadDashboardStats();
                break;
            case 'site-config':
                loadSiteConfig();
                break;
            case 'hero':
                loadHeroSection();
                break;
            case 'about':
                loadAboutSection();
                break;
            case 'ceo':
                loadCEOSection();
                break;
            case 'services':
                loadServicesSection();
                break;
            case 'products':
                loadProductsSection();
                break;
            case 'projects':
                loadProjectsSection();
                break;
            case 'clients':
                loadClientsSection();
                break;
            case 'gallery':
                loadGallerySection();
                break;
            case 'contact':
                loadContactInquiries();
                break;
            default:
                content.innerHTML = `<div class="bg-white p-8 rounded-lg shadow text-center">
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                    <p class="text-gray-600">The page you're looking for doesn't exist.</p>
                </div>`;
        }
    },
    
    updateActiveNav(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${page}`) {
                link.classList.add('active');
            }
        });
    },
    
    updatePageTitle(page) {
        const titles = {
            'dashboard': 'Dashboard',
            'site-config': 'Site Configuration',
            'hero': 'Hero Section',
            'about': 'About Section',
            'ceo': 'CEO Message',
            'services': 'Services Management',
            'products': 'Products Management',
            'projects': 'Projects Management',
            'clients': 'Clients Management',
            'gallery': 'Gallery Management',
            'contact': 'Contact Inquiries'
        };
        document.getElementById('page-title').textContent = titles[page] || 'Admin Panel';
    },
    
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.location.hash = href;
            });
        });
    }
};

// Dashboard Page
function dashboardPage() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" id="statsContainer">
            <div class="stat-card relative overflow-hidden" style="background: linear-gradient(135deg, #689f38 0%, #558b2f 100%);">
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-white/90 text-sm font-medium">Total Services</p>
                        <p class="text-4xl font-bold mt-2" id="stat-services">0</p>
                        <p class="text-white/75 text-xs mt-1">Active services</p>
                    </div>
                    <div class="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-tools text-3xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card relative overflow-hidden" style="background: linear-gradient(135deg, #7cb342 0%, #689f38 100%);">
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-white/90 text-sm font-medium">Total Products</p>
                        <p class="text-4xl font-bold mt-2" id="stat-products">0</p>
                        <p class="text-white/75 text-xs mt-1">In catalog</p>
                    </div>
                    <div class="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-box text-3xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card relative overflow-hidden" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);">
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-white/90 text-sm font-medium">Total Clients</p>
                        <p class="text-4xl font-bold mt-2" id="stat-clients">0</p>
                        <p class="text-white/75 text-xs mt-1">Trusted partners</p>
                    </div>
                    <div class="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-users text-3xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="stat-card relative overflow-hidden" style="background: linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%);">
                <div class="relative z-10 flex items-center justify-between">
                    <div>
                        <p class="text-white/90 text-sm font-medium">Gallery Images</p>
                        <p class="text-4xl font-bold mt-2" id="stat-gallery">0</p>
                        <p class="text-white/75 text-xs mt-1">Total images</p>
                    </div>
                    <div class="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i class="fas fa-images text-3xl"></i>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-project-diagram text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Projects</h3>
                        <p class="text-xs text-gray-500">Total completed</p>
                    </div>
                </div>
                <p class="text-4xl font-bold text-purple-600" id="stat-projects">0</p>
                <a href="#projects" class="block mt-4 text-purple-600 hover:text-purple-700 text-sm font-semibold">
                    View All Projects <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <i class="fas fa-envelope-open-text text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Inquiries</h3>
                        <p class="text-xs text-gray-500">Contact messages</p>
                    </div>
                </div>
                <p class="text-4xl font-bold" style="color: #689f38;" id="stat-inquiries">0</p>
                <a href="#contact" class="block mt-4 text-sm font-semibold hover:underline" style="color: #7cb342;">
                    View All Inquiries <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
            
            <div class="card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #aed581 0%, #9ccc65 100%);">
                        <i class="fas fa-chart-line text-white text-xl"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Overview</h3>
                        <p class="text-xs text-gray-500">Site statistics</p>
                    </div>
                </div>
                <p class="text-4xl font-bold" style="color: #7cb342;" id="stat-total">0</p>
                <p class="text-sm text-gray-600 mt-2">Total content items</p>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);">
                        <i class="fas fa-bolt text-white text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">Quick Actions</h3>
                </div>
                <div class="space-y-3">
                    <a href="#services" class="block p-4 rounded-xl transition-all transform hover:scale-105 group" style="background: linear-gradient(135deg, rgba(139, 195, 74, 0.08) 0%, rgba(124, 179, 66, 0.12) 100%); border: 1px solid rgba(139, 195, 74, 0.2);" onmouseover="this.style.background='linear-gradient(135deg, rgba(139, 195, 74, 0.15) 0%, rgba(124, 179, 66, 0.18) 100%)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(139, 195, 74, 0.08) 0%, rgba(124, 179, 66, 0.12) 100%);'">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);">
                                <i class="fas fa-plus text-white"></i>
                            </div>
                            <div>
                                <p class="font-semibold" style="color: #558b2f;">Add New Service</p>
                                <p class="text-xs" style="color: #689f38;">Create a new service entry</p>
                            </div>
                        </div>
                    </a>
                    <a href="#products" class="block p-4 rounded-xl transition-all transform hover:scale-105 group" style="background: linear-gradient(135deg, rgba(156, 204, 101, 0.08) 0%, rgba(139, 195, 74, 0.12) 100%); border: 1px solid rgba(156, 204, 101, 0.2);" onmouseover="this.style.background='linear-gradient(135deg, rgba(156, 204, 101, 0.15) 0%, rgba(139, 195, 74, 0.18) 100%)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(156, 204, 101, 0.08) 0%, rgba(139, 195, 74, 0.12) 100%);'">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform" style="background: linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%);">
                                <i class="fas fa-plus text-white"></i>
                            </div>
                            <div>
                                <p class="font-semibold" style="color: #558b2f;">Add New Product</p>
                                <p class="text-xs" style="color: #689f38;">Create a new product entry</p>
                            </div>
                        </div>
                    </a>
                    <a href="#projects" class="block p-4 rounded-xl transition-all transform hover:scale-105 group" style="background: linear-gradient(135deg, rgba(174, 213, 129, 0.08) 0%, rgba(156, 204, 101, 0.12) 100%); border: 1px solid rgba(174, 213, 129, 0.2);" onmouseover="this.style.background='linear-gradient(135deg, rgba(174, 213, 129, 0.15) 0%, rgba(156, 204, 101, 0.18) 100%)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(174, 213, 129, 0.08) 0%, rgba(156, 204, 101, 0.12) 100%);'">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform" style="background: linear-gradient(135deg, #aed581 0%, #9ccc65 100%);">
                                <i class="fas fa-plus text-white"></i>
                            </div>
                            <div>
                                <p class="font-semibold" style="color: #558b2f;">Add New Project</p>
                                <p class="text-xs" style="color: #689f38;">Document a completed project</p>
                            </div>
                        </div>
                    </a>
                    <a href="#clients" class="block p-4 rounded-xl transition-all transform hover:scale-105 group" style="background: linear-gradient(135deg, rgba(124, 179, 66, 0.08) 0%, rgba(104, 159, 56, 0.12) 100%); border: 1px solid rgba(124, 179, 66, 0.2);" onmouseover="this.style.background='linear-gradient(135deg, rgba(124, 179, 66, 0.15) 0%, rgba(104, 159, 56, 0.18) 100%)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(124, 179, 66, 0.08) 0%, rgba(104, 159, 56, 0.12) 100%);'">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform" style="background: linear-gradient(135deg, #7cb342 0%, #689f38 100%);">
                                <i class="fas fa-plus text-white"></i>
                            </div>
                            <div>
                                <p class="font-semibold" style="color: #558b2f;">Add New Client</p>
                                <p class="text-xs" style="color: #689f38;">Add a client to portfolio</p>
                            </div>
                        </div>
                    </a>
                    <a href="#gallery" class="block p-4 rounded-xl transition-all transform hover:scale-105 group" style="background: linear-gradient(135deg, rgba(197, 225, 165, 0.08) 0%, rgba(174, 213, 129, 0.12) 100%); border: 1px solid rgba(197, 225, 165, 0.2);" onmouseover="this.style.background='linear-gradient(135deg, rgba(197, 225, 165, 0.15) 0%, rgba(174, 213, 129, 0.18) 100%)';" onmouseout="this.style.background='linear-gradient(135deg, rgba(197, 225, 165, 0.08) 0%, rgba(174, 213, 129, 0.12) 100%);'">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform" style="background: linear-gradient(135deg, #c5e1a5 0%, #aed581 100%);">
                                <i class="fas fa-upload text-white"></i>
                            </div>
                            <div>
                                <p class="font-semibold" style="color: #558b2f;">Upload Gallery Image</p>
                                <p class="text-xs" style="color: #689f38;">Add images to gallery</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
            
            <div class="card p-6">
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);">
                        <i class="fas fa-envelope-open-text text-white text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">Recent Contact Inquiries</h3>
                </div>
                <div id="recentInquiries" class="space-y-3">
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                        <p>Loading inquiries...</p>
                    </div>
                </div>
                <a href="#contact" class="block mt-5 text-center py-3 px-4 text-white rounded-xl font-semibold transition-all transform shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%)'; this.style.transform='scale(1)';">
                    View All Inquiries <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        </div>
    `;
}

// Load real dashboard statistics
async function loadDashboardStats() {
    try {
        const [services, products, clients, gallery, projects, inquiries] = await Promise.all([
            API.getServices().catch(() => ({data: []})),
            API.getProducts().catch(() => ({data: []})),
            API.getClients().catch(() => ({data: []})),
            API.getGallery().catch(() => ({data: []})),
            API.getProjects().catch(() => ({data: []})),
            API.getContactInquiries({ page: 1, limit: 50 }).catch(() => ({data: { items: [], pagination: { total: 0 } }}))
        ]);
        
        // Update stat counters
        const serviceCount = (services.data || []).reduce((sum, cat) => sum + (cat.services ? cat.services.length : 0), 0);
        const productCount = (products.data || []).reduce((sum, cat) => sum + (cat.products ? cat.products.length : 0), 0);
        const clientCount = clients.data?.length || 0;
        const galleryCount = gallery.data?.images?.length || 0;
        const projectCount = projects.data?.length || 0;
        const inquiryCount = inquiries.data?.pagination?.total || inquiries.data?.items?.length || 0;
        
        animateCounter('stat-services', serviceCount);
        animateCounter('stat-products', productCount);
        animateCounter('stat-clients', clientCount);
        animateCounter('stat-gallery', galleryCount);
        animateCounter('stat-projects', projectCount);
        animateCounter('stat-inquiries', inquiryCount);
        animateCounter('stat-total', serviceCount + productCount + clientCount + galleryCount + projectCount);
        
        // Load recent inquiries
        const recentInquiriesContainer = document.getElementById('recentInquiries');
        const recentInquiries = inquiries.data?.items?.slice(0, 3) || [];
        
        if (recentInquiries.length === 0) {
            recentInquiriesContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-inbox text-2xl mb-2"></i>
                    <p>No inquiries yet</p>
                </div>
            `;
        } else {
            recentInquiriesContainer.innerHTML = recentInquiries.map((inquiry, index) => {
                const colors = ['blue', 'purple', 'pink', 'green'];
                const color = colors[index % colors.length];
                const initials = inquiry.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                
                return `
                    <div class="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-3">
                            <div class="w-10 h-10 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                ${initials}
                            </div>
                            <div class="flex-1">
                                <p class="font-semibold text-gray-800">${inquiry.name}</p>
                                <p class="text-sm text-gray-600 mt-1 line-clamp-2">${inquiry.message}</p>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="badge" style="background: rgba(139, 195, 74, 0.12); color: #558b2f;">
                                        <i class="fas fa-clock mr-1"></i>${Utils.formatDate(inquiry.created_at)}
                                    </span>
                                    ${inquiry.subject ? `<span class="badge" style="background: rgba(156, 204, 101, 0.15); color: #689f38;">
                                        <i class="fas fa-tag mr-1"></i>${inquiry.subject}
                                    </span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Animate counter with smooth increment
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1000;
    const steps = 30;
    const stepValue = target / steps;
    let current = 0;
    
    const interval = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            element.textContent = target;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Load functions for each section (to be implemented)
async function loadSiteConfig() {
    Utils.showLoader();
    try {
        const data = await API.getSiteConfig();
        const config = data?.data || {};
        
        document.getElementById('content').innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Site Configuration</h2>
                    <button onclick="saveSiteConfig()" class="px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                        <i class="fas fa-save mr-2"></i>Save Changes
                    </button>
                </div>
                
                <form id="siteConfigForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                            <input type="text" name="company_name" value="${config.company_name || ''}" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                            <input type="text" name="tagline" value="${config.tagline || ''}" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" name="email" value="${config.email || ''}" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input type="text" name="phone" value="${config.phone || ''}" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea name="address" rows="2" 
                                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">${config.address || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="border-t pt-6">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                                <input type="url" name="facebook_url" value="${config.facebook_url || ''}" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                <input type="url" name="linkedin_url" value="${config.linkedin_url || ''}" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                                <input type="url" name="twitter_url" value="${config.twitter_url || ''}" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                                <input type="url" name="instagram_url" value="${config.instagram_url || ''}" 
                                    class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        Utils.showToast('Failed to load site config', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function saveSiteConfig() {
    const form = document.getElementById('siteConfigForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    Utils.showLoader();
    try {
        await API.updateSiteConfig(data);
        Utils.showToast('Site configuration updated successfully');
    } catch (error) {
        Utils.showToast('Failed to update site config', 'error');
    } finally {
        Utils.hideLoader();
    }
}

// Hero Section Functions
function showHeroForm(hero = null) {
    const formContainer = document.getElementById('heroFormContainer');
    const isEdit = hero !== null;
    
    formContainer.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-gray-800">${isEdit ? 'Edit Hero Item' : 'Add Hero Item'}</h3>
                <button onclick="closeHeroForm()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <form id="heroForm" class="space-y-6">
                <input type="hidden" name="id" value="${hero?.id || ''}">
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input type="text" name="title" value="${hero?.title || ''}" required
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input type="text" name="subtitle" value="${hero?.subtitle || ''}"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" rows="3"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">${hero?.description || ''}</textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">CTA Text</label>
                        <input type="text" name="cta_text" value="${hero?.cta_text || ''}"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">CTA Link</label>
                        <input type="text" name="cta_link" value="${hero?.cta_link || ''}"
                            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Display Order *</label>
                    <input type="number" name="display_order" value="${hero?.display_order || 1}" required
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                </div>
                
                <div>
                    ${UploadUtils.createImageUploadField({
                        name: 'background_image',
                        label: 'Background Image',
                        folder: 'hero',
                        required: !isEdit,
                        currentImage: hero?.background_image || null
                    })}
                </div>
                
                <div class="flex gap-3 justify-end pt-4 border-t">
                    <button type="button" onclick="closeHeroForm()" 
                        class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" 
                        class="px-6 py-2.5 text-white rounded-lg font-semibold transition-all shadow-lg"
                        style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);"
                        onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';"
                        onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                        ${isEdit ? 'Update Hero Item' : 'Create Hero Item'}
                    </button>
                </div>
            </form>
        </div>
    `;
    
    formContainer.classList.remove('hidden');
    
    // If in edit mode and has background image, show preview
    if (isEdit && hero?.background_image) {
        setTimeout(() => {
            const previewContainer = document.getElementById('background_image_preview');
            const urlInput = document.querySelector('[name="background_image"]');
            if (previewContainer && urlInput && hero.background_image) {
                urlInput.value = hero.background_image;
                previewContainer.innerHTML = `
                    <div class="relative inline-block">
                        <img src="${ImagePath.resolve(hero.background_image)}" alt="Current image" class="w-32 h-32 object-cover rounded-lg border">
                        <button type="button" onclick="UploadUtils.removeImage('background_image_preview', 'background_image')" 
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                            <i class="fas fa-times text-xs"></i>
                        </button>
                    </div>
                `;
            }
        }, 100);
    }
    
    // Handle form submission
    const form = document.getElementById('heroForm');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await handleHeroSubmit(isEdit);
    };
}

function closeHeroForm() {
    document.getElementById('heroFormContainer').classList.add('hidden');
}

async function handleHeroSubmit(isEdit) {
    const form = document.getElementById('heroForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    Utils.showLoader();
    try {
        if (isEdit) {
            await API.updateHero(data.id, data);
            Utils.showToast('Hero item updated successfully');
        } else {
            await API.createHero(data);
            Utils.showToast('Hero item created successfully');
        }
        closeHeroForm();
        loadHeroSection();
    } catch (error) {
        Utils.showToast(error.message || 'Failed to save hero item', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function editHero(id) {
    Utils.showLoader();
    try {
        const response = await API.getHero();
        const items = response.data || [];
        const hero = items.find(item => item.id === id);
        
        if (hero) {
            showHeroForm(hero);
        } else {
            Utils.showToast('Hero item not found', 'error');
        }
    } catch (error) {
        Utils.showToast('Failed to load hero item', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteHero(id) {
    if (!confirm('Are you sure you want to delete this hero item?')) {
        return;
    }
    
    Utils.showLoader();
    try {
        await API.deleteHero(id);
        Utils.showToast('Hero item deleted successfully');
        loadHeroSection();
    } catch (error) {
        Utils.showToast('Failed to delete hero item', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function loadHeroSection() {
    const content = document.getElementById('content');
    Utils.showLoader();
    try {
        const response = await API.getHero();
        const items = response.data || [];
        
        content.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow mb-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Hero Section Management</h2>
                    <button onclick="showHeroForm()" class="px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                        <i class="fas fa-plus mr-2"></i>Add Hero Item
                    </button>
                </div>
                
                <div id="heroList" class="space-y-4">
                    ${items.map(item => `
                        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-lg text-gray-800">${item.title}</h3>
                                    <p class="text-gray-600 text-sm mt-1">${item.subtitle || ''}</p>
                                    <p class="text-xs text-gray-500 mt-2">Order: ${item.display_order}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editHero(${item.id})" class="px-3 py-2 text-white rounded-lg transition-all" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);'">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteHero(${item.id})" class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="heroFormContainer" class="hidden"></div>
        `;
    } catch (error) {
        console.error('Hero section error:', error);
        content.innerHTML = '<div class="bg-white p-8 rounded-lg shadow text-center"><p class="text-red-600">Failed to load hero section</p></div>';
        Utils.showToast('Failed to load hero section', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function loadServicesSection() {
    const content = document.getElementById('content');
    Utils.showLoader();
    try {
        const sortBy = localStorage.getItem('services_sort') || 'display_order';
        const sortOrder = localStorage.getItem('services_order') || 'ASC';
        const selectedCategory = localStorage.getItem('services_category') || 'all';
        const response = await API.getServices(`?sort=${sortBy}&order=${sortOrder}`);
        const categories = response.data || [];
        
        // Flatten all services
        let allServices = categories.flatMap(category => {
            const items = category.services || [];
            return items.map(service => ({
                ...service,
                category_id: category.id,
                category_name: category.name,
                category_slug: category.slug
            }));
        });
        
        // Filter by category if not 'all'
        const services = selectedCategory === 'all' 
            ? allServices 
            : allServices.filter(s => s.category_slug === selectedCategory);
        
        document.getElementById('content').innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Services Management</h2>
                    <div class="flex items-center gap-3">
                        <select onchange="filterServicesByCategory(this.value)" class="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                            <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories</option>
                            ${categories.map(cat => `
                                <option value="${cat.slug}" ${selectedCategory === cat.slug ? 'selected' : ''}>${cat.name} (${cat.services?.length || 0})</option>
                            `).join('')}
                        </select>
                        <select onchange="sortServices(this.value)" class="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                            <option value="display_order_ASC" ${sortBy === 'display_order' && sortOrder === 'ASC' ? 'selected' : ''}>Order (Default)</option>
                            <option value="title_ASC" ${sortBy === 'title' && sortOrder === 'ASC' ? 'selected' : ''}>Name (A-Z)</option>
                            <option value="title_DESC" ${sortBy === 'title' && sortOrder === 'DESC' ? 'selected' : ''}>Name (Z-A)</option>
                        </select>
                        <button onclick="showServiceForm()" class="px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                            <i class="fas fa-plus mr-2"></i>Add Service
                        </button>
                    </div>
                </div>
                
                <div class="mb-4 text-sm text-gray-600">
                    Showing ${services.length} of ${allServices.length} service${services.length !== 1 ? 's' : ''}
                    ${selectedCategory !== 'all' ? '<span class="ml-2 text-blue-600">• Drag to reorder services in this category</span>' : ''}
                </div>
                
                <div id="servicesList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${services.map((service, index) => `
                        <div class="service-item border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white cursor-move" data-id="${service.id}" data-order="${service.display_order || index}">
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex items-start gap-3 flex-1">
                                    <div class="drag-handle text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                                        <i class="fas fa-grip-vertical text-lg"></i>
                                    </div>
                                    <div class="text-2xl text-green-600">${service.icon || '❖'}</div>
                                    <div class="flex-1">
                                        <h3 class="font-semibold text-gray-800">${service.title}</h3>
                                        <p class="text-xs text-gray-500 mt-1">${service.category_name || 'Uncategorized'}</p>
                                        <span class="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Order: ${service.display_order || index}</span>
                                    </div>
                                </div>
                                <div class="flex gap-1">
                                    <button onclick="editService(${service.id})" class="p-2 text-white rounded-lg transition-all" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);'">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button onclick="deleteService(${service.id})" class="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 line-clamp-2">${service.description || ''}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="serviceFormModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Add/Edit Service</h3>
                        <button onclick="closeServiceForm()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <form id="serviceForm" class="space-y-4">
                        <input type="hidden" name="id">
                        <div>
                            <label class="block text-sm font-medium mb-2">Title</label>
                            <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Category</label>
                            <select name="category_id" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                                ${categories.length === 0 ? '<option value="">No categories</option>' : categories.map(cat => `
                                    <option value="${cat.id}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea name="description" rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                        <input type="hidden" name="icon" value="❖">
                        <div class="flex gap-3">
                            <button type="submit" class="px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                                <i class="fas fa-save mr-2"></i>Save
                            </button>
                            <button type="button" onclick="closeServiceForm()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Setup form submission
        document.getElementById('serviceForm').addEventListener('submit', handleServiceSubmit);
        
        // Initialize drag and drop for services
        initializeServicesDragDrop();
    } catch (error) {
        Utils.showToast('Failed to load services', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function initializeServicesDragDrop() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    let draggedElement = null;
    let placeholder = null;
    
    const items = servicesList.querySelectorAll('.service-item');
    
    items.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', (e) => {
            draggedElement = item;
            item.classList.add('opacity-50');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        item.addEventListener('dragend', (e) => {
            item.classList.remove('opacity-50');
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
            placeholder = null;
            
            // Save new order
            saveServicesOrder();
        });
        
        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (draggedElement !== item) {
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    item.parentNode.insertBefore(draggedElement, item);
                } else {
                    item.parentNode.insertBefore(draggedElement, item.nextSibling);
                }
            }
        });
    });
}

async function saveServicesOrder() {
    const servicesList = document.getElementById('servicesList');
    if (!servicesList) return;
    
    const items = servicesList.querySelectorAll('.service-item');
    const orders = [];
    
    items.forEach((item, index) => {
        orders.push({
            id: parseInt(item.dataset.id),
            display_order: index + 1
        });
    });
    
    try {
        await API.updateServiceOrder(orders);
        Utils.showToast('Service order updated successfully');
    } catch (error) {
        console.error('Failed to update order:', error);
        Utils.showToast('Failed to update service order', 'error');
    }
}

function showServiceForm(service = null) {
    const modal = document.getElementById('serviceFormModal');
    const form = document.getElementById('serviceForm');
    
    if (service) {
        form.querySelector('[name="id"]').value = service.id;
        form.querySelector('[name="title"]').value = service.title || '';
        form.querySelector('[name="description"]').value = service.description || '';
        form.querySelector('[name="icon"]').value = '❖';
        const categoryField = form.querySelector('[name="category_id"]');
        if (categoryField && service.category_id) categoryField.value = service.category_id;
    } else {
        form.reset();
        form.querySelector('[name="icon"]').value = '❖';
    }
    
    modal.classList.remove('hidden');
}

function closeServiceForm() {
    document.getElementById('serviceFormModal').classList.add('hidden');
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;
    
    // Show loader in button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Saving...';
    
    try {
        if (id) {
            await API.updateService(id, data);
            Utils.showToast('Service updated successfully');
        } else {
            await API.createService(data);
            Utils.showToast('Service created successfully');
        }
        closeServiceForm();
        await loadServicesSection();
    } catch (error) {
        console.error('Service submit error:', error);
        Utils.showToast('Failed to save service: ' + (error.message || 'Unknown error'), 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function editService(id) {
    Utils.showLoader();
    try {
        const response = await API.getServices();
        const categories = response.data || [];
        const services = categories.flatMap(category => {
            const items = category.services || [];
            return items.map(service => ({
                ...service,
                category_id: category.id,
                category_name: category.name
            }));
        });
        const service = services.find(s => s.id == id);
        if (service) {
            showServiceForm(service);
        }
    } catch (error) {
        Utils.showToast('Failed to load service', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteService(id) {
    const confirmed = await Utils.confirmDelete(
        'This service will be permanently deleted. This action cannot be undone.',
        'Delete Service?'
    );
    if (!confirmed) return;
    
    try {
        Utils.showLoader();
        await API.deleteService(id);
        Utils.showToast('Service deleted successfully');
        Utils.hideLoader();
        await loadServicesSection();
    } catch (error) {
        console.error('Delete service error:', error);
        Utils.showToast('Failed to delete service: ' + (error.message || 'Unknown error'), 'error');
        Utils.hideLoader();
    }
}

async function loadProductsSection() {
    const content = document.getElementById('content');
    Utils.showLoader();
    try {
        const sortBy = localStorage.getItem('products_sort') || 'display_order';
        const sortOrder = localStorage.getItem('products_order') || 'ASC';
        const selectedCategory = localStorage.getItem('products_category') || 'all';
        const response = await API.getProducts(`?sort=${sortBy}&order=${sortOrder}`);
        console.log('Products response:', response);
        const categories = response.data || [];
        
        // Flatten all products
        let allProducts = categories.flatMap(category => {
            const items = category.products || [];
            return items.map(product => ({
                ...product,
                category_id: category.id,
                category_name: category.name,
                category_slug: category.slug
            }));
        });
        
        // Filter by category if not 'all'
        const products = selectedCategory === 'all' 
            ? allProducts 
            : allProducts.filter(p => p.category_slug === selectedCategory);
        
        content.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Products Management</h2>
                    <div class="flex items-center gap-3">
                        <select onchange="filterProductsByCategory(this.value)" class="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                            <option value="all" ${selectedCategory === 'all' ? 'selected' : ''}>All Categories</option>
                            ${categories.map(cat => `
                                <option value="${cat.slug}" ${selectedCategory === cat.slug ? 'selected' : ''}>${cat.name} (${cat.products?.length || 0})</option>
                            `).join('')}
                        </select>
                        <select onchange="sortProducts(this.value)" class="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                            <option value="display_order_ASC" ${sortBy === 'display_order' && sortOrder === 'ASC' ? 'selected' : ''}>Order (Default)</option>
                            <option value="name_ASC" ${sortBy === 'name' && sortOrder === 'ASC' ? 'selected' : ''}>Name (A-Z)</option>
                            <option value="name_DESC" ${sortBy === 'name' && sortOrder === 'DESC' ? 'selected' : ''}>Name (Z-A)</option>
                            <option value="created_at_DESC" ${sortBy === 'created_at' && sortOrder === 'DESC' ? 'selected' : ''}>Newest First</option>
                            <option value="created_at_ASC" ${sortBy === 'created_at' && sortOrder === 'ASC' ? 'selected' : ''}>Oldest First</option>
                        </select>
                        <button onclick="showProductForm()" class="px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                            <i class="fas fa-plus mr-2"></i>Add Product
                        </button>
                    </div>
                </div>
                
                <div class="mb-4 text-sm text-gray-600">
                    Showing ${products.length} of ${allProducts.length} product${products.length !== 1 ? 's' : ''}
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${products.length === 0 ? '<p class="col-span-full text-center text-gray-500 py-8">No products found. Click "Add Product" to create one.</p>' : 
                    products.map(product => `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            ${product.image ? `<img src="${ImagePath.resolve(product.image)}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-3">` : ''}
                            <div class="flex items-start justify-between mb-3">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-800">${product.name}</h3>
                                    <p class="text-xs text-gray-500 mt-1">${product.category_name || 'Uncategorized'}</p>
                                </div>
                                <div class="flex gap-1">
                                    <button onclick="editProduct(${product.id})" class="p-2 text-white rounded-lg transition-all" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);'">
                                        <i class="fas fa-edit text-xs"></i>
                                    </button>
                                    <button onclick="deleteProduct(${product.id})" class="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 line-clamp-2">${product.description || ''}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="productFormModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Add/Edit Product</h3>
                        <button onclick="closeProductForm()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <form id="productForm" class="space-y-4">
                        <input type="hidden" name="id">
                        <div>
                            <label class="block text-sm font-medium mb-2">Product Name</label>
                            <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Category</label>
                            <select name="category_id" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                                ${categories.length === 0 ? '<option value="">No categories</option>' : categories.map(cat => `
                                    <option value="${cat.id}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Description</label>
                            <textarea name="description" rows="4" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Product Image URL</label>
                            <input type="text" name="image" placeholder="https://example.com/image.jpg" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            <p class="text-xs text-gray-500 mt-1">Upload files via Upload section or paste image URL</p>
                        </div>
                        <div class="flex gap-3">
                            <button type="submit" class="px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                                <i class="fas fa-save mr-2"></i>Save
                            </button>
                            <button type="button" onclick="closeProductForm()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    } catch (error) {
        console.error('Products error:', error);
        content.innerHTML = '<div class="bg-white p-8 rounded-lg shadow text-center"><p class="text-red-600">Failed to load products</p><p class="text-sm text-gray-600 mt-2">' + error.message + '</p></div>';
        Utils.showToast('Failed to load products', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function showProductForm(product = null) {
    const modal = document.getElementById('productFormModal');
    const form = document.getElementById('productForm');
    
    if (product) {
        form.querySelector('[name="id"]').value = product.id;
        form.querySelector('[name="name"]').value = product.name || '';
        form.querySelector('[name="description"]').value = product.description || '';
        
        // Set image value in hidden input (upload field)
        const imageInput = form.querySelector('[name="image"]');
        if (imageInput) {
            imageInput.value = product.image || '';
            // Update preview if image exists
            if (product.image) {
                const previewId = imageInput.id.replace('url-', 'preview-');
                const preview = document.getElementById(previewId);
                if (preview) {
                    preview.innerHTML = `
                        <div class="relative inline-block group">
                            <img src="${ImagePath.resolve(product.image)}" alt="Preview" class="max-h-40 rounded-lg shadow-md border-2 border-gray-200">
                            <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                onclick="UploadUtils.removeImage('${previewId}', '${imageInput.id}', 'delete-image')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    preview.classList.remove('hidden');
                }
            }
        }
        
        const categoryField = form.querySelector('[name="category_id"]');
        if (categoryField && product.category_id) categoryField.value = product.category_id;
    } else {
        form.reset();
        // Clear any image previews
        const imagePreviews = form.querySelectorAll('[id^="preview-"]');
        imagePreviews.forEach(preview => {
            preview.classList.add('hidden');
            preview.innerHTML = '';
        });
    }
    
    modal.classList.remove('hidden');
}

function closeProductForm() {
    document.getElementById('productFormModal').classList.add('hidden');
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;
    
    Utils.showLoader();
    try {
        if (id) {
            await API.updateProduct(id, data);
            Utils.showToast('Product updated successfully');
        } else {
            await API.createProduct(data);
            Utils.showToast('Product created successfully');
        }
        closeProductForm();
        loadProductsSection();
    } catch (error) {
        Utils.showToast('Failed to save product', 'error');
        Utils.hideLoader();
    }
}

async function editProduct(id) {
    Utils.showLoader();
    try {
        const response = await API.getProducts();
        const categories = response.data || [];
        const products = categories.flatMap(category => {
            const items = category.products || [];
            return items.map(product => ({
                ...product,
                category_id: category.id,
                category_name: category.name
            }));
        });
        const product = products.find(p => p.id == id);
        if (product) {
            showProductForm(product);
        }
    } catch (error) {
        Utils.showToast('Failed to load product', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteProduct(id) {
    const confirmed = await Utils.confirmDelete('This product will be permanently deleted.', 'Delete Product?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteProduct(id);
        Utils.showToast('Product deleted successfully');
        await loadProductsSection();
    } catch (error) {
        console.error('Delete product error:', error);
        Utils.showToast('Failed to delete product', 'error');
        Utils.hideLoader();
    }
}

async function loadClientsSection() {
    Utils.showLoader();
    try {
        const sortBy = localStorage.getItem('clients_sort') || 'display_order';
        const sortOrder = localStorage.getItem('clients_order') || 'ASC';
        const response = await API.getClients(`?sort=${sortBy}&order=${sortOrder}`);
        const clients = response.data || [];
        
        document.getElementById('content').innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Clients Management</h2>
                    <div class="flex items-center gap-3">
                        <select onchange="sortClients(this.value)" class="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                            <option value="display_order_ASC" ${sortBy === 'display_order' && sortOrder === 'ASC' ? 'selected' : ''}>Order (Default)</option>
                            <option value="name_ASC" ${sortBy === 'name' && sortOrder === 'ASC' ? 'selected' : ''}>Name (A-Z)</option>
                            <option value="name_DESC" ${sortBy === 'name' && sortOrder === 'DESC' ? 'selected' : ''}>Name (Z-A)</option>
                        </select>
                        <button onclick="showClientForm()" class="px-5 py-2.5 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                            <i class="fas fa-plus mr-2"></i>Add Client
                        </button>
                    </div>
                </div>
                
                <div class="mb-4 text-sm text-gray-600">
                    Showing ${clients.length} client${clients.length !== 1 ? 's' : ''}
                    ${clients.length > 1 ? '<span class="ml-2 text-blue-600">• Drag to reorder</span>' : ''}
                </div>
                
                <div id="clientsGrid" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    ${clients.length === 0 ? 
                        '<p class="col-span-full text-center text-gray-500 py-8">No clients found. Click "Add Client" to create one.</p>' 
                        : 
                        clients.map(client => `
                            <div class="client-item border rounded-lg p-4 text-center hover:shadow-lg transition-shadow relative group cursor-move" data-id="${client.id}">
                                <div class="absolute top-2 left-2 text-gray-300 group-hover:text-gray-500">
                                    <i class="fas fa-grip-vertical text-sm"></i>
                                </div>
                                ${client.logo ? `<img src="${ImagePath.resolve(client.logo)}" alt="${client.name}" class="w-20 h-20 object-contain mx-auto mb-2">` : 
                                `<div class="w-20 h-20 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                                    <i class="fas fa-building text-gray-400 text-2xl"></i>
                                </div>`}
                                <p class="text-sm font-medium text-gray-800">${client.name}</p>
                                <div class="absolute top-2 right-2 hidden group-hover:flex gap-1">
                                    <button onclick="editClient(${client.id})" class="p-1 text-white rounded text-xs transition-all" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);'">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteClient(${client.id})" class="p-1 bg-red-500 text-white rounded text-xs">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
            
            <div id="clientFormModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Add/Edit Client</h3>
                        <button onclick="closeClientForm()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <form id="clientForm" class="space-y-4">
                        <input type="hidden" name="id">
                        <div>
                            <label class="block text-sm font-medium mb-2">Client Name</label>
                            <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                        </div>
                        ${UploadUtils.createImageUploadField({
                            name: 'logo',
                            label: 'Client Logo',
                            folder: 'clients',
                            required: false
                        })}
                        <div class="flex gap-3">
                            <button type="submit" class="px-6 py-3 text-white rounded-xl font-semibold transition-all shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                                <i class="fas fa-save mr-2"></i>Save
                            </button>
                            <button type="button" onclick="closeClientForm()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
        initializeClientsDragDrop();
    } catch (error) {
        console.error('Clients error:', error);
        Utils.showToast('Failed to load clients', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function showClientForm(client = null) {
    const modal = document.getElementById('clientFormModal');
    const form = document.getElementById('clientForm');
    
    if (client) {
        form.querySelector('[name="id"]').value = client.id;
        form.querySelector('[name="name"]').value = client.name || '';
        
        // Set logo value in hidden input (upload field)
        const logoInput = form.querySelector('[name="logo"]');
        if (logoInput) {
            logoInput.value = client.logo || '';
            // Update preview if logo exists
            if (client.logo) {
                const previewId = logoInput.id.replace('url-', 'preview-');
                const preview = document.getElementById(previewId);
                if (preview) {
                    preview.innerHTML = `
                        <div class="relative inline-block group">
                            <img src="${ImagePath.resolve(client.logo)}" alt="Preview" class="max-h-40 rounded-lg shadow-md border-2 border-gray-200">
                            <button type="button" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                onclick="UploadUtils.removeImage('${previewId}', '${logoInput.id}', 'delete-logo')">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    preview.classList.remove('hidden');
                }
            }
        }
    } else {
        form.reset();
        // Clear any image previews
        const imagePreviews = form.querySelectorAll('[id^="preview-"]');
        imagePreviews.forEach(preview => {
            preview.classList.add('hidden');
            preview.innerHTML = '';
        });
    }
    
    modal.classList.remove('hidden');
}

function closeClientForm() {
    document.getElementById('clientFormModal').classList.add('hidden');
}

function initializeClientsDragDrop() {
    const clientsGrid = document.getElementById('clientsGrid');
    if (!clientsGrid) return;

    let draggedElement = null;
    const items = clientsGrid.querySelectorAll('.client-item');

    items.forEach(item => {
        item.setAttribute('draggable', 'true');

        item.addEventListener('dragstart', (e) => {
            draggedElement = item;
            item.classList.add('opacity-50');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('opacity-50');
            saveClientsOrder();
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedElement !== item) {
                const rect = item.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                if (e.clientY < midpoint) {
                    item.parentNode.insertBefore(draggedElement, item);
                } else {
                    item.parentNode.insertBefore(draggedElement, item.nextSibling);
                }
            }
        });
    });
}

async function saveClientsOrder() {
    const clientsGrid = document.getElementById('clientsGrid');
    if (!clientsGrid) return;

    const items = clientsGrid.querySelectorAll('.client-item');
    const orders = [];

    items.forEach((item, index) => {
        orders.push({
            id: parseInt(item.dataset.id, 10),
            display_order: index + 1
        });
    });

    try {
        await API.updateClientOrder(orders);
        Utils.showToast('Client order updated successfully');
    } catch (error) {
        console.error('Failed to update client order:', error);
        Utils.showToast('Failed to update client order', 'error');
    }
}

async function handleClientSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;
    
    Utils.showLoader();
    try {
        if (id) {
            await API.updateClient(id, data);
            Utils.showToast('Client updated successfully');
        } else {
            await API.createClient(data);
            Utils.showToast('Client created successfully');
        }
        closeClientForm();
        loadClientsSection();
    } catch (error) {
        Utils.showToast('Failed to save client', 'error');
        Utils.hideLoader();
    }
}

async function editClient(id) {
    Utils.showLoader();
    try {
        const response = await API.getClients();
        const client = response.data.find(c => c.id == id);
        if (client) {
            showClientForm(client);
        }
    } catch (error) {
        Utils.showToast('Failed to load client', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteClient(id) {
    const confirmed = await Utils.confirmDelete('This client will be permanently deleted.', 'Delete Client?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteClient(id);
        Utils.showToast('Client deleted successfully');
        await loadClientsSection();
    } catch (error) {
        console.error('Delete client error:', error);
        Utils.showToast('Failed to delete client', 'error');
        Utils.hideLoader();
    }
}

async function loadContactInquiries(filterStatus = '') {
    Utils.showLoader();
    try {
        const storedSearch = localStorage.getItem('contact_search') || '';
        const storedSort = localStorage.getItem('contact_sort') || 'created_at_DESC';
        const apiStatus = filterStatus === 'all' ? '' : filterStatus;
        const response = await API.getContactInquiries({ page: 1, limit: 100, status: apiStatus });
        let inquiries = response.data?.items || [];

        if (filterStatus === '') {
            inquiries = inquiries.filter(inquiry => (inquiry.status || 'new') !== 'archived');
        }

        if (filterStatus === 'sent') {
            inquiries = inquiries.filter(inquiry => (inquiry.reply_count || 0) > 0);
        }

        if (storedSearch.trim()) {
            const term = storedSearch.trim().toLowerCase();
            inquiries = inquiries.filter(inquiry => {
                const haystack = [
                    inquiry.name,
                    inquiry.email,
                    inquiry.phone,
                    inquiry.subject,
                    inquiry.message
                ].join(' ').toLowerCase();
                return haystack.includes(term);
            });
        }

        const [sortField, sortDir] = storedSort.split('_');
        inquiries.sort((a, b) => {
            let left = a[sortField];
            let right = b[sortField];

            if (sortField === 'created_at') {
                left = new Date(left || 0).getTime();
                right = new Date(right || 0).getTime();
                return sortDir === 'ASC' ? left - right : right - left;
            }

            left = (left || '').toString().toLowerCase();
            right = (right || '').toString().toLowerCase();
            if (left === right) return 0;
            const comparison = left.localeCompare(right);
            return sortDir === 'ASC' ? comparison : -comparison;
        });
        
        const statusColors = {
            'new': 'bg-blue-100 text-blue-800',
            'read': 'bg-gray-100 text-gray-800',
            'replied': 'bg-green-100 text-green-800',
            'archived': 'bg-yellow-100 text-yellow-800'
        };
        
        document.getElementById('content').innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-gray-800">Contact Inquiries</h2>
                    <div class="flex flex-wrap gap-2">
                        <input
                            type="text"
                            placeholder="Search name, email, subject..."
                            value="${storedSearch}"
                            oninput="setContactSearch(this.value)"
                            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                        <select id="statusFilter" onchange="loadContactInquiries(this.value)" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="" ${filterStatus === '' ? 'selected' : ''}>Active</option>
                            <option value="new" ${filterStatus === 'new' ? 'selected' : ''}>New</option>
                            <option value="read" ${filterStatus === 'read' ? 'selected' : ''}>Read</option>
                            <option value="replied" ${filterStatus === 'replied' ? 'selected' : ''}>Replied</option>
                            <option value="archived" ${filterStatus === 'archived' ? 'selected' : ''}>Archived</option>
                            <option value="all" ${filterStatus === 'all' ? 'selected' : ''}>All</option>
                        </select>
                        <select id="contactSort" onchange="setContactSort(this.value)" class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                            <option value="created_at_DESC" ${storedSort === 'created_at_DESC' ? 'selected' : ''}>Newest First</option>
                            <option value="created_at_ASC" ${storedSort === 'created_at_ASC' ? 'selected' : ''}>Oldest First</option>
                            <option value="email_ASC" ${storedSort === 'email_ASC' ? 'selected' : ''}>Email (A-Z)</option>
                            <option value="email_DESC" ${storedSort === 'email_DESC' ? 'selected' : ''}>Email (Z-A)</option>
                            <option value="subject_ASC" ${storedSort === 'subject_ASC' ? 'selected' : ''}>Subject (A-Z)</option>
                            <option value="subject_DESC" ${storedSort === 'subject_DESC' ? 'selected' : ''}>Subject (Z-A)</option>
                        </select>
                    </div>
                </div>
                
                <div class="space-y-3">
                    ${inquiries.length === 0 ? '<p class="text-gray-500 text-center py-8">No inquiries found</p>' : 
                    inquiries.map(inquiry => `
                        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-start justify-between">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <h3 class="font-semibold text-gray-800">${inquiry.name}</h3>
                                        <span class="text-xs px-2 py-1 ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'} rounded capitalize">${inquiry.status || 'new'}</span>
                                        ${inquiry.subject ? `<span class="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">${inquiry.subject}</span>` : ''}
                                        ${(inquiry.reply_count || 0) > 0 ? `<span class="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded">Replies: ${inquiry.reply_count}</span>` : ''}
                                    </div>
                                    <div class="text-sm text-gray-600 space-y-1">
                                        <p><i class="fas fa-envelope mr-2"></i>${inquiry.email}</p>
                                        ${inquiry.phone ? `<p><i class="fas fa-phone mr-2"></i>${inquiry.phone}</p>` : ''}
                                        <p class="mt-2 text-gray-700">${inquiry.message.length > 100 ? inquiry.message.substring(0, 100) + '...' : inquiry.message}</p>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-2">
                                        <i class="fas fa-clock mr-1"></i>${Utils.formatDate(inquiry.created_at)}
                                    </p>
                                </div>
                                <div class="flex flex-col gap-2 ml-4">
                                    <button onclick="viewInquiry(${inquiry.id})" class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        <i class="fas fa-eye mr-1"></i>View
                                    </button>
                                    <button onclick="replyToInquiry(${inquiry.id})" class="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                        <i class="fas fa-reply mr-1"></i>Reply
                                    </button>
                                    ${(inquiry.reply_count || 0) > 0 ? `
                                        <button onclick="viewReplies(${inquiry.id})" class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                                            <i class="fas fa-comments mr-1"></i>View Replies (${inquiry.reply_count})
                                        </button>
                                    ` : ''}
                                    ${inquiry.status === 'archived' ? `
                                        <button onclick="unarchiveInquiry(${inquiry.id})" class="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm">
                                            <i class="fas fa-undo mr-1"></i>Unarchive
                                        </button>
                                    ` : `
                                        <button onclick="archiveInquiry(${inquiry.id})" class="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                                            <i class="fas fa-archive mr-1"></i>Archive
                                        </button>
                                    `}
                                    <button onclick="deleteInquiry(${inquiry.id})" class="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                        <i class="fas fa-trash mr-1"></i>Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- View Modal -->
            <div id="viewInquiryModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Inquiry Details</h3>
                        <button onclick="closeViewModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div id="inquiryDetails"></div>
                </div>
            </div>
            
            <!-- Reply Modal -->
            <div id="replyInquiryModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Reply to Inquiry</h3>
                        <button onclick="closeReplyModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <form id="replyForm" class="space-y-4">
                        <input type="hidden" id="replyInquiryId">
                        <div id="replyInquiryInfo"></div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Your Reply</label>
                            <textarea id="replyMessage" rows="6" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Type your reply here..."></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Attachment (Optional, Max 10MB)</label>
                            <input type="file" id="replyAttachment" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" accept="*/*">
                            <p class="text-xs text-gray-500 mt-1">Supported: Documents, Images, PDFs (Max 10MB)</p>
                        </div>
                        <div class="flex gap-3">
                            <button type="submit" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                <i class="fas fa-paper-plane mr-2"></i>Send Reply
                            </button>
                            <button type="button" onclick="closeReplyModal()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- View Replies Modal -->
            <div id="viewRepliesModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold">Sent Replies</h3>
                        <button onclick="closeRepliesModal()" class="text-gray-500 hover:text-gray-700">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div id="repliesListContent"></div>
                </div>
            </div>
        `;
        
        document.getElementById('replyForm').addEventListener('submit', handleReplySubmit);
    } catch (error) {
        console.error('Contact inquiries error:', error);
        Utils.showToast('Failed to load inquiries', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteInquiry(id) {
    const confirmed = await Utils.confirmDelete('This inquiry will be permanently deleted.', 'Delete Inquiry?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteInquiry(id);
        Utils.showToast('Inquiry deleted successfully');
        await loadContactInquiries();
    } catch (error) {
        console.error('Delete inquiry error:', error);
        Utils.showToast('Failed to delete inquiry', 'error');
        Utils.hideLoader();
    }
}

async function viewInquiry(id) {
    Utils.showLoader();
    try {
        const response = await API.getContactInquiry(id);
        const inquiry = response.data;
        
        const statusColors = {
            'new': 'bg-blue-100 text-blue-800',
            'read': 'bg-gray-100 text-gray-800',
            'replied': 'bg-green-100 text-green-800',
            'archived': 'bg-yellow-100 text-yellow-800'
        };
        
        document.getElementById('inquiryDetails').innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <span class="text-xs px-3 py-1 ${statusColors[inquiry.status]} rounded-full capitalize font-semibold">${inquiry.status}</span>
                    <span class="text-xs text-gray-500">#${inquiry.id}</span>
                </div>
                
                <div class="border-b pb-4">
                    <h4 class="font-semibold text-lg mb-2">${inquiry.name}</h4>
                    <div class="space-y-1 text-sm text-gray-600">
                        <p><i class="fas fa-envelope mr-2 text-blue-500"></i>${inquiry.email}</p>
                        ${inquiry.phone ? `<p><i class="fas fa-phone mr-2 text-green-500"></i>${inquiry.phone}</p>` : ''}
                        ${inquiry.subject ? `<p><i class="fas fa-tag mr-2 text-purple-500"></i>${inquiry.subject}</p>` : ''}
                        <p><i class="fas fa-clock mr-2 text-gray-500"></i>${Utils.formatDate(inquiry.created_at)}</p>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold mb-2">Message:</h5>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-gray-700 whitespace-pre-wrap">${inquiry.message}</p>
                    </div>
                </div>
                
                ${inquiry.replies && inquiry.replies.length > 0 ? `
                    <div>
                        <h5 class="font-semibold mb-2">Reply History:</h5>
                        <div class="space-y-3">
                            ${inquiry.replies.map(reply => `
                                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-semibold text-blue-800">${reply.sent_by}</span>
                                        <div class="flex items-center gap-2">
                                            <span class="text-xs text-gray-500">${Utils.formatDate(reply.sent_at)}</span>
                                            <button onclick="deleteReply(${reply.id}, ${inquiry.id}); closeViewModal();" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p class="text-gray-700 whitespace-pre-wrap text-sm">${reply.reply_message}</p>
                                    ${reply.attachment_filename ? `
                                        <div class="mt-2 p-2 bg-white rounded border border-blue-200">
                                            <i class="fas fa-paperclip text-blue-600 mr-2"></i>
                                            <a href="${ImagePath.resolve(reply.attachment_path)}" target="_blank" class="text-blue-600 hover:underline text-sm">
                                                ${reply.attachment_filename}
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex gap-2 pt-4 border-t">
                    <button onclick="replyToInquiry(${inquiry.id}); closeViewModal();" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        <i class="fas fa-reply mr-2"></i>Reply
                    </button>
                    ${inquiry.status === 'archived' ? `
                        <button onclick="unarchiveInquiry(${inquiry.id}); closeViewModal();" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                            <i class="fas fa-undo mr-2"></i>Unarchive
                        </button>
                    ` : `
                        <button onclick="archiveInquiry(${inquiry.id}); closeViewModal();" class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                            <i class="fas fa-archive mr-2"></i>Archive
                        </button>
                    `}
                    <button onclick="deleteInquiry(${inquiry.id}); closeViewModal();" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <i class="fas fa-trash mr-2"></i>Delete
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('viewInquiryModal').classList.remove('hidden');
    } catch (error) {
        Utils.showToast('Failed to load inquiry details', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function closeViewModal() {
    document.getElementById('viewInquiryModal').classList.add('hidden');
}

async function replyToInquiry(id) {
    Utils.showLoader();
    try {
        const response = await API.getContactInquiry(id);
        const inquiry = response.data;
        
        document.getElementById('replyInquiryId').value = inquiry.id;
        document.getElementById('replyInquiryInfo').innerHTML = `
            <div class="bg-gray-50 p-4 rounded-lg space-y-2">
                <p class="font-semibold">${inquiry.name}</p>
                <p class="text-sm text-gray-600"><i class="fas fa-envelope mr-2"></i>${inquiry.email}</p>
                <p class="text-sm text-gray-700 mt-2"><strong>Original Message:</strong></p>
                <p class="text-sm text-gray-600">${inquiry.message}</p>
            </div>
        `;
        
        document.getElementById('replyInquiryModal').classList.remove('hidden');
    } catch (error) {
        Utils.showToast('Failed to load inquiry', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function closeReplyModal() {
    document.getElementById('replyInquiryModal').classList.add('hidden');
    document.getElementById('replyMessage').value = '';
    document.getElementById('replyAttachment').value = '';
}

async function viewReplies(id) {
    Utils.showLoader();
    try {
        const response = await API.getContactInquiry(id);
        const inquiry = response.data;
        
        if (!inquiry.replies || inquiry.replies.length === 0) {
            Utils.showToast('No replies found', 'error');
            Utils.hideLoader();
            return;
        }
        
        document.getElementById('repliesListContent').innerHTML = `
            <div class="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 class="font-semibold text-lg mb-2">${inquiry.name}</h4>
                <p class="text-sm text-gray-600"><i class="fas fa-envelope mr-2"></i>${inquiry.email}</p>
                <p class="text-sm text-gray-600 mt-2"><strong>Subject:</strong> ${inquiry.subject || 'No subject'}</p>
            </div>
            
            <div class="space-y-4">
                <h5 class="font-semibold text-gray-700">All Sent Replies (${inquiry.replies.length})</h5>
                ${inquiry.replies.map((reply, index) => `
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <span class="text-xs font-semibold text-blue-800">Reply #${index + 1} by ${reply.sent_by}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-gray-500">${Utils.formatDate(reply.sent_at)}</span>
                                <button onclick="deleteReply(${reply.id}, ${inquiry.id})" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p class="text-gray-700 whitespace-pre-wrap text-sm mb-2">${reply.reply_message}</p>
                        ${reply.attachment_filename ? `
                            <div class="mt-2 p-2 bg-white rounded border border-blue-200">
                                <i class="fas fa-paperclip text-blue-600 mr-2"></i>
                                <a href="${ImagePath.resolve(reply.attachment_path)}" target="_blank" class="text-blue-600 hover:underline text-sm">
                                    ${reply.attachment_filename} (${formatFileSize(reply.attachment_size)})
                                </a>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.getElementById('viewRepliesModal').classList.remove('hidden');
    } catch (error) {
        Utils.showToast('Failed to load replies', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function closeRepliesModal() {
    document.getElementById('viewRepliesModal').classList.add('hidden');
}

async function deleteReply(replyId, inquiryId) {
    const confirmed = await Utils.confirmDelete('This reply and its attachment (if any) will be permanently deleted.', 'Delete Reply?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteReply(replyId);
        Utils.showToast('Reply deleted successfully');
        closeRepliesModal();
        loadContactInquiries();
    } catch (error) {
        console.error('Delete reply error:', error);
        Utils.showToast('Failed to delete reply', 'error');
        Utils.hideLoader();
    }
}

function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function handleReplySubmit(e) {
    e.preventDefault();
    
    const inquiryId = document.getElementById('replyInquiryId').value;
    const replyMessage = document.getElementById('replyMessage').value.trim();
    const attachmentInput = document.getElementById('replyAttachment');
    const attachment = attachmentInput.files[0];
    
    if (!replyMessage) {
        Utils.showToast('Please enter a reply message', 'error');
        return;
    }
    
    // Check file size (10MB limit)
    if (attachment && attachment.size > 10 * 1024 * 1024) {
        Utils.showToast('File size exceeds 10MB limit', 'error');
        return;
    }
    
    Utils.showLoader();
    try {
        await API.replyInquiry(inquiryId, replyMessage, attachment);
        Utils.showToast('Reply sent successfully');
        closeReplyModal();
        loadContactInquiries();
    } catch (error) {
        Utils.showToast('Failed to send reply', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function archiveInquiry(id) {
    Utils.showLoader();
    try {
        await API.archiveInquiry(id);
        Utils.showToast('Inquiry archived successfully');
        const filter = document.getElementById('statusFilter')?.value || '';
        loadContactInquiries(filter);
    } catch (error) {
        Utils.showToast('Failed to archive inquiry', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function unarchiveInquiry(id) {
    Utils.showLoader();
    try {
        await API.unarchiveInquiry(id);
        Utils.showToast('Inquiry unarchived successfully');
        const filter = document.getElementById('statusFilter')?.value || '';
        loadContactInquiries(filter);
    } catch (error) {
        Utils.showToast('Failed to unarchive inquiry', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function loadAboutSection() {
    Utils.showLoader();
    try {
        const response = await API.getAbout();
        const about = response.data?.about || {};
        const features = response.data?.features || [];
        
        document.getElementById('content').innerHTML = `
            <div class="card p-8">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);">
                            <i class="fas fa-info-circle text-white text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">About Section</h2>
                            <p class="text-gray-600 text-sm">Manage about content</p>
                        </div>
                    </div>
                    <button onclick="saveAbout()" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                        <i class="fas fa-save mr-2"></i>Save Changes
                    </button>
                </div>
                
                <form id="aboutForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input type="text" name="title" value="${about.title || ''}" required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea name="description" rows="6" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">${about.description || ''}</textarea>
                        </div>
                        <div class="md:col-span-2">
                            ${UploadUtils.createImageUploadField({
                                name: 'image',
                                label: 'About Image',
                                folder: 'about',
                                currentImage: about.image || '',
                                required: false
                            })}
                        </div>
                    </div>
                </form>

                <div class="mt-8">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Features</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${features.length === 0 ? '<p class="text-gray-500">No features found.</p>' :
                        features.map(feature => `
                            <div class="p-4 border rounded-xl bg-gray-50">
                                <div class="flex items-center gap-3">
                                    <i class="${feature.icon || 'fas fa-check'} text-green-600"></i>
                                    <span class="font-semibold text-gray-800">${feature.title}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        Utils.showToast('Failed to load about section', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function saveAbout() {
    const form = document.getElementById('aboutForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    Utils.showLoader();
    try {
        await API.updateAbout(data);
        Utils.showToast('About section updated successfully');
    } catch (error) {
        Utils.showToast('Failed to update about section', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function loadCEOSection() {
    Utils.showLoader();
    try {
        const response = await API.getCEO();
        const ceo = response.data || {};
        
        document.getElementById('content').innerHTML = `
            <div class="card p-8">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%);">
                            <i class="fas fa-user-tie text-white text-2xl"></i>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">CEO Message</h2>
                            <p class="text-gray-600 text-sm">Update CEO information and message</p>
                        </div>
                    </div>
                    <button onclick="saveCEO()" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                        <i class="fas fa-save mr-2"></i>Save Changes
                    </button>
                </div>
                
                <form id="ceoForm" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-user mr-1"></i>Full Name
                            </label>
                            <input type="text" name="name" value="${ceo.name || ''}" required
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-briefcase mr-1"></i>Designation
                            </label>
                            <input type="text" name="designation" value="${ceo.designation || ''}" placeholder="Chief Executive Officer"
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-graduation-cap mr-1"></i>Education
                            </label>
                            <input type="text" name="education" value="${ceo.education || ''}" placeholder="B.Sc in Engineering"
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-phone mr-1"></i>Phone
                            </label>
                            <input type="text" name="phone" value="${ceo.phone || ''}" placeholder="+8801..."
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-envelope mr-1"></i>Email
                            </label>
                            <input type="email" name="email" value="${ceo.email || ''}" placeholder="ceo@company.com"
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            ${UploadUtils.createImageUploadField({
                                name: 'image',
                                label: 'CEO Photo',
                                folder: 'team',
                                currentImage: ceo.image || '',
                                required: false
                            })}
                        </div>
                        
                        <div>
                            ${UploadUtils.createImageUploadField({
                                name: 'signature_image',
                                label: 'CEO Signature',
                                folder: 'team',
                                currentImage: ceo.signature_image || '',
                                required: false
                            })}
                        </div>
                        
                        <div class="md:col-span-2">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">
                                <i class="fas fa-quote-left mr-1"></i>CEO Message
                            </label>
                            <textarea name="message" rows="8" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">${ceo.message || ''}</textarea>
                        </div>
                    </div>
                </form>
            </div>
        `;
    } catch (error) {
        Utils.showToast('Failed to load CEO section', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function saveCEO() {
    const form = document.getElementById('ceoForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    Utils.showLoader();
    try {
        await API.updateCEO(data);
        Utils.showToast('CEO information updated successfully');
    } catch (error) {
        Utils.showToast('Failed to update CEO information', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function loadProjectsSection() {
    Utils.showLoader();
    try {
        const response = await API.getProjects();
        const projects = response.data || [];
        
        document.getElementById('content').innerHTML = `
            <div class="card p-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg, #7cb342 0%, #689f38 100%);">
                            <i class="fas fa-project-diagram text-white text-xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">Projects Management</h2>
                    </div>
                    <button onclick="showProjectForm()" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                        <i class="fas fa-plus mr-2"></i>Add Project
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${projects.length === 0 ? '<p class="text-gray-500 text-center col-span-full py-8">No projects yet</p>' :
                    projects.map(project => `
                        <div class="card group relative overflow-hidden border-2 border-gray-100 hover:border-green-500 transition-all duration-300">
                            ${project.featured_image ? `
                                <img src="${ImagePath.resolve(project.featured_image)}" alt="${project.title}" class="w-full h-48 object-cover">
                            ` : `
                                <div class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <i class="fas fa-image text-gray-400 text-4xl"></i>
                                </div>
                            `}
                            <div class="p-4">
                                <h3 class="font-bold text-lg text-gray-800 mb-1">${project.title}</h3>
                                <p class="text-sm text-gray-600 mb-2">${project.client_name || 'N/A'}</p>
                                <p class="text-xs text-gray-500 line-clamp-2">${project.description || ''}</p>
                                ${project.location ? `<p class="text-xs text-gray-500 mt-2"><i class="fas fa-map-marker-alt mr-1"></i>${project.location}</p>` : ''}
                                <div class="flex items-center justify-between mt-4">
                                    <span class="badge" style="background: rgba(139, 195, 74, 0.12); color: #558b2f;">
                                        ${project.project_type || project.status || 'General'}
                                    </span>
                                    <div class="flex gap-1">
                                        <button onclick="editProject(${project.id})" class="p-2 text-white rounded-lg transition-colors" style="background: linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #8bc34a 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #7cb342 100%);'">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button onclick="deleteProject(${project.id})" class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Project Form Modal -->
            <div id="projectFormModal" class="hidden fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-gray-800">
                            <i class="fas fa-project-diagram mr-2 text-purple-600"></i>
                            Add/Edit Project
                        </h3>
                        <button onclick="closeProjectForm()" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <form id="projectForm" class="space-y-4">
                        <input type="hidden" name="id">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Project Title *</label>
                                <input type="text" name="title" required 
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
                                <input type="text" name="client_name" 
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Project Type</label>
                                <input type="text" name="project_type" placeholder="Electrical, Civil, Mechanical"
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input type="text" name="location" 
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea name="description" rows="4" 
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"></textarea>
                            </div>
                            <div>
                                ${UploadUtils.createImageUploadField({
                                    name: 'featured_image',
                                    label: 'Featured Image',
                                    folder: 'projects',
                                    required: false
                                })}
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Completion Date</label>
                                <input type="date" name="completion_date" 
                                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                            </div>
                        </div>
                        <div class="flex gap-3 pt-4">
                            <button type="submit" class="flex-1 btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                                <i class="fas fa-save mr-2"></i>Save Project
                            </button>
                            <button type="button" onclick="closeProjectForm()" class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    } catch (error) {
        Utils.showToast('Failed to load projects', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function showProjectForm(project = null) {
    const modal = document.getElementById('projectFormModal');
    const form = document.getElementById('projectForm');
    
    if (project) {
        form.querySelector('[name="id"]').value = project.id;
        form.querySelector('[name="title"]').value = project.title || '';
        form.querySelector('[name="client_name"]').value = project.client_name || '';
        form.querySelector('[name="project_type"]').value = project.project_type || '';
        form.querySelector('[name="location"]').value = project.location || '';
        form.querySelector('[name="description"]').value = project.description || '';
        form.querySelector('[name="featured_image"]').value = project.featured_image || '';
        form.querySelector('[name="completion_date"]').value = project.completion_date || '';
    } else {
        form.reset();
    }
    
    modal.classList.remove('hidden');
}

function closeProjectForm() {
    document.getElementById('projectFormModal').classList.add('hidden');
}

async function handleProjectSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;
    
    Utils.showLoader();
    try {
        if (id) {
            await API.updateProject(id, data);
            Utils.showToast('Project updated successfully');
        } else {
            await API.createProject(data);
            Utils.showToast('Project created successfully');
        }
        closeProjectForm();
        loadProjectsSection();
    } catch (error) {
        Utils.showToast('Failed to save project', 'error');
        Utils.hideLoader();
    }
}

async function editProject(id) {
    Utils.showLoader();
    try {
        const response = await API.getProjects();
        const project = response.data.find(p => p.id == id);
        if (project) {
            showProjectForm(project);
        }
    } catch (error) {
        Utils.showToast('Failed to load project', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteProject(id) {
    const confirmed = await Utils.confirmDelete('This project will be permanently deleted.', 'Delete Project?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteProject(id);
        Utils.showToast('Project deleted successfully');
        await loadProjectsSection();
    } catch (error) {
        console.error('Delete project error:', error);
        Utils.showToast('Failed to delete project', 'error');
        Utils.hideLoader();
    }
}

async function loadGallerySection() {
    Utils.showLoader();
    try {
        const response = await API.getGallery();
        const images = response.data?.images || [];
        const categories = response.data?.categories || [];
        
        document.getElementById('content').innerHTML = `
            <div class="card p-6">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <i class="fas fa-images text-white text-xl"></i>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-800">Gallery Management</h2>
                    </div>
                    <button onclick="showGalleryForm()" class="btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                        <i class="fas fa-upload mr-2"></i>Upload Image
                    </button>
                </div>
                
                <!-- Category Filters -->
                <div class="flex flex-wrap gap-2 mb-6">
                    <button onclick="filterGallery('all', this)" class="gallery-filter-btn active px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
                        All (${images.length})
                    </button>
                    ${categories.map(cat => `
                        <button onclick="filterGallery('${cat.slug}', this)" class="gallery-filter-btn px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
                            ${cat.name} (${images.filter(img => img.category_slug === cat.slug).length})
                        </button>
                    `).join('')}
                </div>
                
                <div id="galleryGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    ${images.length === 0 ? '<p class="text-gray-500 text-center col-span-full py-8">No images in gallery yet</p>' :
                    images.map(image => `
                        <div class="gallery-item group relative overflow-hidden rounded-xl border-2 border-gray-100 hover:border-green-500 transition-all duration-300" data-category="${image.category_slug}">
                            <img src="${ImagePath.resolve(image.image_path)}" alt="${image.title || 'Gallery'}" class="w-full h-48 object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div class="absolute bottom-0 left-0 right-0 p-3">
                                    <p class="text-white font-semibold text-sm mb-1">${image.title || 'Untitled'}</p>
                                    <p class="text-white/80 text-xs mb-2">${image.category_name || 'General'}</p>
                                    <div class="flex gap-1">
                                        <button onclick="editGalleryImage(${image.id})" class="flex-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            <i class="fas fa-edit text-xs"></i>
                                        </button>
                                        <button onclick="deleteGalleryImage(${image.id})" class="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                            <i class="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Gallery Form Modal -->
            <div id="galleryFormModal" class="hidden fixed inset-0 modal-backdrop flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-2xl font-bold text-gray-800">
                            <i class="fas fa-images mr-2 text-pink-600"></i>
                            Add/Edit Gallery Image
                        </h3>
                        <button onclick="closeGalleryForm()" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <form id="galleryForm" class="space-y-4">
                        <input type="hidden" name="id">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Image Title</label>
                            <input type="text" name="title" required 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select name="category_slug" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                                ${categories.length === 0 ? '<option value="general">General</option>' : categories.map(cat => `
                                    <option value="${cat.slug}">${cat.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            ${UploadUtils.createImageUploadField({
                                name: 'image_path',
                                label: 'Gallery Image',
                                folder: 'gallery',
                                required: true
                            })}
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                            <textarea name="description" rows="3" 
                                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"></textarea>
                        </div>
                        <div class="flex gap-3 pt-4">
                            <button type="submit" class="flex-1 btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                                <i class="fas fa-save mr-2"></i>Save Image
                            </button>
                            <button type="button" onclick="closeGalleryForm()" class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.getElementById('galleryForm').addEventListener('submit', handleGallerySubmit);
    } catch (error) {
        Utils.showToast('Failed to load gallery', 'error');
    } finally {
        Utils.hideLoader();
    }
}

function filterGallery(category, button) {
    const items = document.querySelectorAll('.gallery-item');
    const buttons = document.querySelectorAll('.gallery-filter-btn');
    
    buttons.forEach(btn => {
        btn.classList.remove('active', 'bg-green-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    if (button) {
        button.classList.add('active', 'bg-green-500', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-700');
    }
    
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function showGalleryForm(image = null) {
    const modal = document.getElementById('galleryFormModal');
    const form = document.getElementById('galleryForm');
    
    if (image) {
        form.querySelector('[name="id"]').value = image.id;
        form.querySelector('[name="title"]').value = image.title || '';
        const categoryField = form.querySelector('[name="category_slug"]');
        if (categoryField) categoryField.value = image.category_slug || categoryField.value;
        form.querySelector('[name="image_path"]').value = image.image_path || '';
        form.querySelector('[name="description"]').value = image.description || '';
    } else {
        form.reset();
    }
    
    modal.classList.remove('hidden');
}

function closeGalleryForm() {
    document.getElementById('galleryFormModal').classList.add('hidden');
}

async function handleGallerySubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const id = data.id;
    delete data.id;
    
    Utils.showLoader();
    try {
        if (id) {
            await API.updateGalleryImage(id, data);
            Utils.showToast('Gallery image updated successfully');
        } else {
            await API.createGalleryImage(data);
            Utils.showToast('Gallery image added successfully');
        }
        closeGalleryForm();
        loadGallerySection();
    } catch (error) {
        Utils.showToast('Failed to save gallery image', 'error');
        Utils.hideLoader();
    }
}

async function editGalleryImage(id) {
    Utils.showLoader();
    try {
        const response = await API.getGallery();
        const image = (response.data?.images || []).find(img => img.id == id);
        if (image) {
            showGalleryForm(image);
        }
    } catch (error) {
        Utils.showToast('Failed to load image', 'error');
    } finally {
        Utils.hideLoader();
    }
}

async function deleteGalleryImage(id) {
    const confirmed = await Utils.confirmDelete('This image will be permanently deleted.', 'Delete Image?');
    if (!confirmed) return;
    
    Utils.showLoader();
    try {
        await API.deleteGalleryImage(id);
        Utils.showToast('Gallery image deleted successfully');
        await loadGallerySection();
    } catch (error) {
        console.error('Delete gallery error:', error);
        Utils.showToast('Failed to delete image', 'error');
        Utils.hideLoader();
    }
}

// ============================================
// SORTING FUNCTIONS
// ============================================
function filterServicesByCategory(categorySlug) {
    localStorage.setItem('services_category', categorySlug);
    loadServicesSection();
}

function filterProductsByCategory(categorySlug) {
    localStorage.setItem('products_category', categorySlug);
    loadProductsSection();
}

function sortServices(value) {
    const [sortBy, sortOrder] = value.split('_');
    localStorage.setItem('services_sort', sortBy);
    localStorage.setItem('services_order', sortOrder);
    loadServicesSection();
}

function sortProducts(value) {
    const [sortBy, sortOrder] = value.split('_');
    localStorage.setItem('products_sort', sortBy);
    localStorage.setItem('products_order', sortOrder);
    loadProductsSection();
}

function sortClients(value) {
    const [sortBy, sortOrder] = value.split('_');
    localStorage.setItem('clients_sort', sortBy);
    localStorage.setItem('clients_order', sortOrder);
    loadClientsSection();
}

function setContactSearch(value) {
    localStorage.setItem('contact_search', value);
    const filter = document.getElementById('statusFilter')?.value || '';
    loadContactInquiries(filter);
}

function setContactSort(value) {
    localStorage.setItem('contact_sort', value);
    const filter = document.getElementById('statusFilter')?.value || '';
    loadContactInquiries(filter);
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    const isAuthed = await checkAuth();
    if (isAuthed) {
        updateAdminHeader();
        router.init();
    }
});
