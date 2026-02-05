// File Upload Utility for Admin Panel
// Note: API_BASE is defined in api.js
const UploadUtils = {
    /**
     * Create a file upload field with preview
     * @param {Object} options - Configuration options
     * @param {string} options.name - Input field name
     * @param {string} options.label - Label text
     * @param {string} options.folder - Upload folder name
     * @param {string} options.currentImage - Current image URL (for edit mode)
     * @param {boolean} options.required - Whether field is required
     * @param {string} options.accept - Accepted file types
     * @returns {string} HTML string
     */
    createImageUploadField(options = {}) {
        const {
            name = 'image',
            label = 'Image',
            folder = 'general',
            currentImage = '',
            required = false,
            accept = 'image/*',
            helpText = 'Max file size: 10MB. Supported formats: JPG, PNG, GIF, WEBP'
        } = options;

        const fieldId = `upload-${name}`;
        const previewId = `preview-${name}`;
        const urlInputId = `url-${name}`;
        const progressId = `progress-${name}`;
        const deleteButtonId = `delete-${name}`;

        return `
            <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">${label}${required ? ' <span class="text-red-500">*</span>' : ''}</label>
                
                <!-- File Upload Button -->
                <div class="flex items-center gap-3">
                    <label for="${fieldId}" class="cursor-pointer px-4 py-2 text-white rounded-lg font-semibold transition-all shadow hover:shadow-lg" style="background: linear-gradient(135deg, #8bc34a 0%, #689f38 100%);" onmouseover="this.style.background='linear-gradient(135deg, #9ccc65 0%, #7cb342 100%)';" onmouseout="this.style.background='linear-gradient(135deg, #8bc34a 0%, #689f38 100%);'">
                        <i class="fas fa-upload mr-2"></i>Choose File
                    </label>
                    <input 
                        type="file" 
                        id="${fieldId}" 
                        accept="${accept}" 
                        class="hidden" 
                        data-folder="${folder}"
                        data-url-input="${urlInputId}"
                        data-preview="${previewId}"
                        data-progress="${progressId}"
                        data-delete="${deleteButtonId}"
                        onchange="UploadUtils.handleFileSelect(this)"
                    >
                    <span id="${progressId}" class="text-sm text-gray-600"></span>
                </div>
                
                <!-- Hidden URL Input (submitted with form) -->
                <input type="hidden" id="${urlInputId}" name="${name}" value="${currentImage}" ${required ? 'required' : ''}>
                
                <!-- Image Preview -->
                <div id="${previewId}" class="mt-3 ${currentImage ? '' : 'hidden'}">
                    <div class="relative inline-block group">
                        <img src="${currentImage}" alt="Preview" class="max-h-40 rounded-lg shadow-md border-2 border-gray-200">
                        <button 
                            type="button" 
                            id="${deleteButtonId}"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                            onclick="UploadUtils.removeImage('${previewId}', '${urlInputId}', '${deleteButtonId}')"
                        >
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                ${helpText ? `<p class="text-xs text-gray-500">${helpText}</p>` : ''}
            </div>
        `;
    },

    /**
     * Handle file selection and upload
     * @param {HTMLInputElement} input - File input element
     */
    async handleFileSelect(input) {
        const file = input.files[0];
        if (!file) return;

        const folder = input.dataset.folder || 'general';
        const urlInputId = input.dataset.urlInput;
        const previewId = input.dataset.preview;
        const progressId = input.dataset.progress;
        const deleteButtonId = input.dataset.delete;

        const progressEl = document.getElementById(progressId);
        const urlInput = document.getElementById(urlInputId);
        const preview = document.getElementById(previewId);

        try {
            // Show uploading status
            progressEl.textContent = 'Uploading...';
            progressEl.className = 'text-sm text-blue-600 font-medium';

            // Upload file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            const response = await fetch(`${API_BASE}/upload.php`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(result.message || 'Upload failed');
            }

            const uploadedFile = result.data.files[0];
            const imageUrl = uploadedFile.url || uploadedFile.path;

            // Update hidden input
            urlInput.value = imageUrl;

            // Show preview
            preview.innerHTML = `
                <div class="relative inline-block group">
                    <img src="${imageUrl}" alt="Preview" class="max-h-40 rounded-lg shadow-md border-2 border-gray-200">
                    <button 
                        type="button" 
                        id="${deleteButtonId}"
                        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        onclick="UploadUtils.removeImage('${previewId}', '${urlInputId}', '${deleteButtonId}')"
                    >
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            preview.classList.remove('hidden');

            // Show success message
            progressEl.textContent = '✓ Uploaded successfully';
            progressEl.className = 'text-sm text-green-600 font-medium';

            // Clear success message after 3 seconds
            setTimeout(() => {
                progressEl.textContent = '';
            }, 3000);

            // Clear file input
            input.value = '';

        } catch (error) {
            console.error('Upload error:', error);
            progressEl.textContent = `✗ ${error.message}`;
            progressEl.className = 'text-sm text-red-600 font-medium';
        }
    },

    /**
     * Remove image from preview and clear URL
     * @param {string} previewId - Preview element ID
     * @param {string} urlInputId - URL input element ID
     * @param {string} deleteButtonId - Delete button ID
     */
    removeImage(previewId, urlInputId, deleteButtonId) {
        const preview = document.getElementById(previewId);
        const urlInput = document.getElementById(urlInputId);

        if (confirm('Remove this image?')) {
            preview.classList.add('hidden');
            preview.innerHTML = '';
            urlInput.value = '';
        }
    },

    /**
     * Upload multiple files
     * @param {FileList} files - Files to upload
     * @param {string} folder - Target folder
     * @returns {Promise<Array>} Array of uploaded file URLs
     */
    async uploadMultipleFiles(files, folder = 'general') {
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
        }
        formData.append('folder', folder);

        const response = await fetch(`${API_BASE}/upload.php`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (!result.success || !result.data) {
            throw new Error(result.message || 'Upload failed');
        }

        return result.data.files.map(f => f.url || f.path);
    },

    /**
     * Delete file from server
     * @param {string} filePath - File path to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteFile(filePath) {
        try {
            const response = await fetch(`${API_BASE}/upload.php?path=${encodeURIComponent(filePath)}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            return result.success;
        } catch (error) {
            console.error('Delete error:', error);
            return false;
        }
    }
};

// Legacy ImageUploader for backward compatibility
const ImageUploader = {
    // Show file upload dialog
    async selectFile(accept = 'image/*') {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    resolve(file);
                } else {
                    reject(new Error('No file selected'));
                }
            };
            
            input.click();
        });
    },
    
    // Upload file to server
    async upload(file, folder = 'general') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        
        try {
            Utils.showLoader();
            
            // Simulate upload - replace with actual backend endpoint
            const response = await fetch(`${API_BASE}/upload.php`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }
            
            const data = await response.json();
            Utils.hideLoader();
            
            if (data.success) {
                Utils.showToast('Image uploaded successfully');
                return data.file_path;
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (error) {
            Utils.hideLoader();
            Utils.showToast('Failed to upload image: ' + error.message, 'error');
            throw error;
        }
    },
    
    // Preview image before upload
    previewImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsDataURL(file);
        });
    },
    
    // Add image picker to input field
    attachToInput(inputId, folder = 'general', previewId = null) {
        const input = document.getElementById(inputId);
        if (!input) return;
        
        // Create upload button
        const uploadBtn = document.createElement('button');
        uploadBtn.type = 'button';
        uploadBtn.className = 'mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all';
        uploadBtn.innerHTML = '<i class="fas fa-upload mr-2"></i>Upload Image';
        
        // Create preview container
        let previewContainer = previewId ? document.getElementById(previewId) : null;
        if (!previewContainer) {
            previewContainer = document.createElement('div');
            previewContainer.className = 'mt-2';
            input.parentNode.appendChild(previewContainer);
        }
        
        uploadBtn.onclick = async () => {
            try {
                const file = await this.selectFile();
                
                // Show preview
                if (file.type.startsWith('image/')) {
                    const previewUrl = await this.previewImage(file);
                    previewContainer.innerHTML = `
                        <div class="relative inline-block">
                            <img src="${previewUrl}" alt="Preview" class="w-40 h-40 object-cover rounded-lg border-2 border-blue-500">
                            <div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                <i class="fas fa-check mr-1"></i>Selected
                            </div>
                        </div>
                    `;
                }
                
                // Upload file
                const filePath = await this.upload(file, folder);
                input.value = filePath;
                
                // Dispatch change event
                input.dispatchEvent(new Event('change'));
            } catch (error) {
                console.error('Upload error:', error);
            }
        };
        
        input.parentNode.appendChild(uploadBtn);
    },
    
    // Show upload modal with preview
    showUploadModal(folder = 'general', onUpload = null) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 modal-backdrop flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-cloud-upload-alt mr-2 text-blue-600"></i>
                        Upload Image
                    </h3>
                    <button onclick="this.closest('.modal-backdrop').remove()" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div id="dropZone" class="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <i class="fas fa-cloud-upload-alt text-6xl text-gray-400 mb-4"></i>
                    <p class="text-gray-700 font-semibold mb-2">Click to upload or drag & drop</p>
                    <p class="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                
                <div id="previewArea" class="hidden mt-6">
                    <p class="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                    <img id="previewImage" src="" alt="Preview" class="w-full h-64 object-cover rounded-xl border-2 border-gray-200">
                    <div class="flex gap-3 mt-4">
                        <button id="uploadBtn" class="flex-1 btn-primary px-6 py-3 text-white rounded-xl font-semibold hover:shadow-2xl">
                            <i class="fas fa-upload mr-2"></i>Upload Image
                        </button>
                        <button onclick="document.getElementById('previewArea').classList.add('hidden'); document.getElementById('dropZone').classList.remove('hidden');" class="px-6 py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const dropZone = modal.querySelector('#dropZone');
        const previewArea = modal.querySelector('#previewArea');
        const previewImage = modal.querySelector('#previewImage');
        const uploadBtn = modal.querySelector('#uploadBtn');
        
        let selectedFile = null;
        
        // Click to select
        dropZone.onclick = async () => {
            try {
                selectedFile = await this.selectFile();
                const previewUrl = await this.previewImage(selectedFile);
                
                previewImage.src = previewUrl;
                dropZone.classList.add('hidden');
                previewArea.classList.remove('hidden');
            } catch (error) {
                console.error('File selection error:', error);
            }
        };
        
        // Drag and drop
        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-500', 'bg-blue-50');
        };
        
        dropZone.ondragleave = () => {
            dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        };
        
        dropZone.ondrop = async (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'bg-blue-50');
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                selectedFile = file;
                const previewUrl = await this.previewImage(file);
                
                previewImage.src = previewUrl;
                dropZone.classList.add('hidden');
                previewArea.classList.remove('hidden');
            }
        };
        
        // Upload button
        uploadBtn.onclick = async () => {
            if (!selectedFile) return;
            
            try {
                const filePath = await this.upload(selectedFile, folder);
                modal.remove();
                
                if (onUpload) {
                    onUpload(filePath);
                }
            } catch (error) {
                console.error('Upload error:', error);
            }
        };
    }
};

// Make it globally available
window.ImageUploader = ImageUploader;
