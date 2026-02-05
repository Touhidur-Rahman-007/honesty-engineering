// API Helper Functions
const API_BASE = '/honesty-engineering/backend/api';
const API = {
    baseURL: API_BASE,
    
    // Generic fetch wrapper
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Site Config
    getSiteConfig() {
        return this.request('/site-config.php');
    },
    
    updateSiteConfig(data) {
        return this.request('/site-config.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // Hero Section
    getHero() {
        return this.request('/hero.php');
    },
    
    updateHero(data) {
        return this.request('/hero.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // About Section
    getAbout() {
        return this.request('/about.php');
    },
    
    updateAbout(data) {
        return this.request('/about.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // CEO Info
    getCEO() {
        return this.request('/ceo.php');
    },
    
    updateCEO(data) {
        return this.request('/ceo.php', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // Services
    getServices(query = '') {
        return this.request('/services.php' + query);
    },
    
    createService(data) {
        return this.request('/services.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    updateService(id, data) {
        return this.request(`/services.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    deleteService(id) {
        return this.request(`/services.php?id=${id}`, {
            method: 'DELETE'
        });
    },
    
    // Products
    getProducts(query = '') {
        return this.request('/products.php' + query);
    },
    
    createProduct(data) {
        return this.request('/products.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    updateProduct(id, data) {
        return this.request(`/products.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    deleteProduct(id) {
        return this.request(`/products.php?id=${id}`, {
            method: 'DELETE'
        });
    },
    
    // Projects
    getProjects() {
        return this.request('/projects.php');
    },
    
    createProject(data) {
        return this.request('/projects.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    updateProject(id, data) {
        return this.request(`/projects.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    deleteProject(id) {
        return this.request(`/projects.php?id=${id}`, {
            method: 'DELETE'
        });
    },
    
    // Clients
    getClients(query = '') {
        return this.request('/clients.php' + query);
    },
    
    createClient(data) {
        return this.request('/clients.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    updateClient(id, data) {
        return this.request(`/clients.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    deleteClient(id) {
        return this.request(`/clients.php?id=${id}`, {
            method: 'DELETE'
        });
    },
    
    // Gallery
    getGallery() {
        return this.request('/gallery.php');
    },
    
    createGalleryImage(data) {
        return this.request('/gallery.php', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    updateGalleryImage(id, data) {
        return this.request(`/gallery.php?id=${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    deleteGalleryImage(id) {
        return this.request(`/gallery.php?id=${id}`, {
            method: 'DELETE'
        });
    },
    
    // Contact Inquiries
    getContactInquiries(params = {}) {
        const { page = 1, limit = 20, status = '' } = params;
        const query = new URLSearchParams({
            action: 'list',
            page: String(page),
            limit: String(limit)
        });
        if (status) {
            query.set('status', status);
        }
        return this.request(`/contact.php?${query.toString()}`);
    },

    getContactInquiry(id) {
        return this.request(`/contact.php?action=view&id=${id}`);
    },

    replyInquiry(inquiryId, replyMessage) {
        return this.request('/contact.php?action=reply', {
            method: 'POST',
            body: JSON.stringify({ inquiry_id: inquiryId, reply_message: replyMessage })
        });
    },

    archiveInquiry(id) {
        return this.request('/contact.php?action=archive', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
    },

    deleteInquiry(id) {
        return this.request('/contact.php?action=delete', {
            method: 'POST',
            body: JSON.stringify({ id })
        });
    }
};

// Utility Functions
const Utils = {
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} mr-2"></i>
            ${message}
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    confirmDelete(message = 'Are you sure you want to delete this item?', title = 'Confirm Delete') {
        return new Promise((resolve) => {
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]';
            modal.innerHTML = `
                <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                    <div class="text-center">
                        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                            <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-3">${title}</h3>
                        <p class="text-gray-600 mb-6">${message}</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="confirmBtn" class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl">
                            <i class="fas fa-trash mr-2"></i>Delete
                        </button>
                        <button id="cancelBtn" class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all">
                            <i class="fas fa-times mr-2"></i>Cancel
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Handle confirm
            modal.querySelector('#confirmBtn').onclick = () => {
                modal.remove();
                resolve(true);
            };
            
            // Handle cancel
            modal.querySelector('#cancelBtn').onclick = () => {
                modal.remove();
                resolve(false);
            };
            
            // Close on backdrop click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            };
        });
    },
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    showLoader() {
        // Remove existing loader if any
        const existingLoader = document.getElementById('loader');
        if (existingLoader) return; // Don't create duplicate
        
        const loader = document.createElement('div');
        loader.id = 'loader';
        loader.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="bg-white p-6 rounded-lg shadow-xl">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
                <p class="mt-4 text-gray-700 font-medium">Loading...</p>
            </div>
        `;
        document.body.appendChild(loader);
    },
    
    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) loader.remove();
    }
};
