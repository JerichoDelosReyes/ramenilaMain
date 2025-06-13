// Inventory Management System
import supabaseService from './supabase-service.js';



let products = [];

let editingProductId = null;

// Image Upload and Crop Functionality
let cropper = null;
let currentImageData = null;

// Image upload elements
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');
const removeImageBtn = document.getElementById('removeImageBtn');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');

// Crop modal elements
const cropModal = document.getElementById('cropModal');
const closeCropModal = document.getElementById('closeCropModal');
const cropImage = document.getElementById('cropImage');
const cropPreview = document.getElementById('cropPreview');
const cancelCrop = document.getElementById('cancelCrop');
const applyCrop = document.getElementById('applyCrop');

// Delete modal elements
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDelete = document.getElementById('cancelDelete');
const confirmDelete = document.getElementById('confirmDelete');
const deleteProductName = document.getElementById('deleteProductName');

// Variable to track product being deleted
let productToDeleteId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Show loading overlay initially
    showLoadingOverlay();
    
    initializeInventory();
    setupEventListeners();
    initializeImageUpload();
});

function showLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 400); // Fast loading - 0.4 second delay
    }
}

async function initializeInventory() {
    showLoadingOverlay();
    try {
        products = await supabaseService.getProducts();
        console.log('Products loaded from Supabase:', products);
        console.log('Number of products:', products.length);
        
        // Debug: Log first product details if available
        if (products.length > 0) {
            console.log('First product details:', products[0]);
        }
        
        renderProducts();
        updateActiveNavItem();
        updateDashboardStats();
        
        // Add debug info after rendering
        setTimeout(() => addImageDebugInfo(), 1000);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products from database', 'error');
    } finally {
        hideLoadingOverlay();
    }
}


function setupEventListeners() {
    // Modal controls
    document.getElementById('addProductBtn').addEventListener('click', openAddProductModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
      // Delete modal controls
    closeDeleteModal.addEventListener('click', closeDeleteModalHandler);
    cancelDelete.addEventListener('click', closeDeleteModalHandler);
    confirmDelete.addEventListener('click', handleDeleteConfirmation);
    
    // Form submission
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    
    // Category change listener to update image based on category
    document.getElementById('productCategory').addEventListener('change', updateImageBasedOnCategory);
    
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('stockFilter').addEventListener('change', filterProducts);
    
    // Close modal when clicking outside
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
      // Close delete modal when clicking outside
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) {
            closeDeleteModalHandler();
        }
    });
}

// Update image field based on selected category
function updateImageBasedOnCategory() {
    const category = document.getElementById('productCategory').value;
    
    // Only update if no custom image has been uploaded
    if (!currentImageData || isDefaultCategoryImage(previewImg.src)) {
        const categoryImages = {
            'drinks': 'assets/img/drinks.png',
            'desserts': 'assets/img/desserts.png',
            'sides': 'assets/img/sides.png'
        };
        
        const newImage = categoryImages[category] || 'assets/img/ramen.png';
        previewImg.src = newImage;
        currentImageData = null; // Reset custom image data
        
        console.log(`Updated preview image to: ${newImage} for category: ${category}`);
    }
}

// Helper function to check if current image is a default category image
function isDefaultCategoryImage(imageSrc) {
    const defaultImages = [
        'assets/img/ramen.png',
        'assets/img/drinks.png', 
        'assets/img/desserts.png',
        'assets/img/sides.png'
    ];
    
    return defaultImages.some(defaultImg => imageSrc.includes(defaultImg));
}

function renderProducts(productsToRender = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    console.log('Rendering products:', productsToRender); // Debug log

    productsGrid.innerHTML = productsToRender.map(product => {
        const stockStatus = getStockStatus(product);
        const stockClass = stockStatus.toLowerCase().replace(' ', '-');
        
        // Enhanced image resolution logic
        let productImage = resolveProductImage(product);
        
        console.log(`Product ${product.name}: resolved image = ${productImage}`); // Debug log
        
        return `
            <div class="product-card ${stockClass}">
                <div class="product-image">
                    <img src="${productImage}" alt="${product.name}" 
                         onerror="handleImageError(this, '${product.category}')" 
                         onload="console.log('✓ Image loaded: ${productImage.replace(/'/g, '\\\'')}')"
                         loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-header">
                        <div>
                            <div class="product-name">${product.name}</div>
                            <div class="product-category">${product.category}</div>
                        </div>
                    </div>
                    <div class="product-price">₱${product.price.toFixed(2)}</div>
                    <div class="product-stock">
                        <span class="stock-info">${product.stock} ${product.unit} available</span>
                        <span class="stock-status ${stockClass}">${stockStatus}</span>
                    </div>
                    <div class="product-description">${product.description}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Enhanced image resolution function
function resolveProductImage(product) {
    console.log(`Resolving image for ${product.name}:`, {
        image: product.image,
        image_url: product.image_url,
        category: product.category
    });
    
    // Priority 1: Custom uploaded image (Supabase URL or base64)
    let productImage = product.image || product.image_url;
    
    // Priority 2: Check if it's a valid custom image (not default or empty)
    const isCustomImage = productImage && 
                         productImage !== '' && 
                         productImage !== null && 
                         !productImage.includes('assets/img/ramen.png') &&
                         !productImage.includes('assets/img/drinks.png') &&
                         !productImage.includes('assets/img/desserts.png') &&
                         !productImage.includes('assets/img/sides.png');
    
    if (isCustomImage) {
        console.log(`Using custom image for ${product.name}: ${productImage}`);
        return productImage;
    }
    
    // Priority 3: Use category-specific default images
    const categoryImages = {
        'drinks': 'assets/img/drinks.png',
        'desserts': 'assets/img/desserts.png',
        'sides': 'assets/img/sides.png',
        'ramen': 'assets/img/ramen.png'  // Default fallback
    };
    
    const resolvedImage = categoryImages[product.category] || categoryImages['ramen'];
    console.log(`Using category default for ${product.name}: ${resolvedImage}`);
    
    return resolvedImage;
}

// Enhanced error handling for failed images
window.handleImageError = function(imgElement, category) {
    console.error(`Image failed to load for ${imgElement.alt}, falling back to category default`);
    
    const fallbackImages = {
        'drinks': 'assets/img/drinks.png',
        'desserts': 'assets/img/desserts.png',
        'sides': 'assets/img/sides.png'
    };
    
    const fallback = fallbackImages[category] || 'assets/img/ramen.png';
    
    // Prevent infinite loop by only setting fallback if it's different
    if (imgElement.src !== fallback) {
        console.log(`Setting fallback image: ${fallback}`);
        imgElement.src = fallback;
    } else {
        console.error(`Even fallback image failed: ${fallback}`);
        // Last resort: show error text
        imgElement.style.display = 'none';
        imgElement.parentElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f8f9fa; color: #666; border: 2px dashed #dee2e6;">
                <div style="text-align: center;">
                    <i class="fas fa-image" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                    <div>Image not available</div>
                </div>
            </div>
        `;
    }
};

function getStockStatus(product) {
    if (product.stock === 0) {
        return 'Out of Stock';
    } else if (product.stock <= product.minStock) {
        return 'Low Stock';
    } else {
        return 'In Stock';
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        let matchesStock = true;
        if (stockFilter) {
            const stockStatus = getStockStatus(product).toLowerCase().replace(' ', '-');
            matchesStock = stockStatus === stockFilter;
        }
        
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    renderProducts(filteredProducts);
}

function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    resetForm();
    document.getElementById('productModal').classList.add('show');
    document.body.classList.add('modal-open');
}

function resetForm() {
    document.getElementById('productForm').reset();
    currentImageData = null;
    previewImg.src = 'assets/img/ramen.png';
    removeImageBtn.style.display = 'none';
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';

    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('minStock').value = product.minStock;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productDescription').value = product.description;

    previewImg.src = product.image;
    currentImageData = product.image;

    // Show remove button if it's an uploaded image (contains supabase URL)
    if (product.image && product.image.includes('supabase')) {
        removeImageBtn.style.display = 'inline-flex';
    } else {
        removeImageBtn.style.display = 'none';
    }

    document.getElementById('productModal').classList.add('show');
    document.body.classList.add('modal-open');
}


function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    productToDeleteId = id;
    deleteProductName.textContent = `"${product.name}" will be permanently deleted.`;
    deleteModal.classList.add('show');
    document.body.classList.add('modal-open');
}

async function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const minStock = parseInt(document.getElementById('minStock').value);
    const unit = document.getElementById('productUnit').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    // Validate required fields
    if (!name || !category || isNaN(price) || isNaN(stock) || isNaN(minStock) || !unit) {
        showNotification("Please fill in all required fields", "error");
        return;
    }

    if (price <= 0 || stock < 0 || minStock < 0) {
        showNotification("Invalid number values", "error");
        return;
    }

    // Image handling - prioritize uploaded images over default category images
    let productImage = currentImageData;
    
    if (!productImage || 
        productImage.includes('assets/img/ramen.png') || 
        productImage.includes('assets/img/drinks.png') || 
        productImage.includes('assets/img/desserts.png')) {
        
        // Use default category images if no custom image uploaded
        if (category === "drinks") {
            productImage = "assets/img/drinks.png";
        } else if (category === "desserts") {
            productImage = "assets/img/desserts.png";
        } else {
            productImage = "assets/img/ramen.png";
        }
    }

    const formData = {
        name,
        category,
        price,
        stock,
        minStock,
        unit,
        description,
        image: productImage
    };

    try {
        if (editingProductId) {
            // Update existing product
            const existingProduct = products.find(p => p.id === editingProductId);
            
            // If image changed and old image was uploaded (not a default asset), delete it
            if (existingProduct && 
                existingProduct.image !== productImage && 
                existingProduct.image && 
                existingProduct.image.includes('supabase')) {
                
                try {
                    // Extract file path from URL for deletion
                    const urlParts = existingProduct.image.split('/');
                    const fileName = urlParts[urlParts.length - 1].split('?')[0];
                    await supabaseService.deleteImage(fileName);
                } catch (deleteError) {
                    console.warn('Could not delete old image:', deleteError);
                }
            }
            
            await supabaseService.updateProduct(editingProductId, formData);
            showNotification("Product updated successfully!", "success");
        } else {
            // Add new product
            await supabaseService.addProduct(formData);
            showNotification("Product added successfully!", "success");
        }

        await initializeInventory(); // Refresh product list from Supabase
        closeModal();                // Close modal
        resetForm();                 // Clear form
    } catch (error) {
        console.error("Error saving product:", error);
        showNotification("Failed to save product", "error");
    }
}


// Image upload functionality
function initializeImageUpload() {
    try {
        // Check if elements exist
        if (!uploadBtn) {
            console.error('Upload button not found');
            return;
        }
        if (!removeImageBtn) {
            console.error('Remove image button not found');
            return;
        }
        if (!imagePreview) {
            console.error('Image preview not found');
            return;
        }

        // Upload button click
        uploadBtn.addEventListener('click', () => {
            imageUpload.click();
        });

        // Image preview click
        imagePreview.addEventListener('click', () => {
            imageUpload.click();
        });

        // Remove image button click
        removeImageBtn.addEventListener('click', removeImage);

        // File input change
        imageUpload.addEventListener('change', handleImageUpload);

        // Drag and drop functionality
        imagePreview.addEventListener('dragover', handleDragOver);
        imagePreview.addEventListener('dragenter', handleDragEnter);
        imagePreview.addEventListener('dragleave', handleDragLeave);
        imagePreview.addEventListener('drop', handleDrop);

        // Crop modal close
        if (closeCropModal) {
            closeCropModal.addEventListener('click', closeCropModalHandler);
        }
        if (cancelCrop) {
            cancelCrop.addEventListener('click', closeCropModalHandler);
        }
        if (applyCrop) {
            applyCrop.addEventListener('click', applyCropHandler);
        }

        // Close crop modal on outside click
        if (cropModal) {
            cropModal.addEventListener('click', (e) => {
                if (e.target === cropModal) {
                    closeCropModalHandler();
                }
            });
        }

        console.log('Image upload functionality initialized successfully');
    } catch (error) {
        console.error('Error initializing image upload:', error);
    }
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    processImageFile(file);
}

function showCropModal() {
    try {
        if (!cropModal) {
            throw new Error('Crop modal element not found');
        }
        if (!cropImage) {
            throw new Error('Crop image element not found');
        }
        if (typeof Cropper === 'undefined') {
            throw new Error('Cropper.js library not loaded');
        }

        cropModal.style.display = 'flex';
        document.body.classList.add('modal-open');

        // Initialize cropper
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(cropImage, {
            aspectRatio: 1, // Square aspect ratio for consistent product images
            viewMode: 1,
            autoCropArea: 1,
            responsive: true,
            checkOrientation: false,
            crop: function(event) {
                // Update preview
                updateCropPreview();
            }
        });

        console.log('Crop modal opened successfully');
    } catch (error) {
        console.error('Error showing crop modal:', error);
        showNotification(`Error opening image editor: ${error.message}`, 'error');
    }
}

function updateCropPreview() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    if (canvas) {
        cropPreview.src = canvas.toDataURL('image/jpeg', 0.9);
    }
}

function closeCropModalHandler() {
    cropModal.style.display = 'none';
    document.body.classList.remove('modal-open');

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }

    // Reset file input
    imageUpload.value = '';
}

async function applyCropHandler() {
    if (!cropper) return;

    try {
        const canvas = cropper.getCroppedCanvas({
            width: 300,
            height: 300,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high'
        });

        if (canvas) {
            // Show loading state
            applyCrop.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            applyCrop.disabled = true;

            // Convert canvas to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/jpeg', 0.9);
            });

            if (!blob) {
                throw new Error('Failed to create image blob');
            }

            // Create a file from the blob
            const timestamp = Date.now();
            const file = new File([blob], `product-${timestamp}.jpg`, { type: 'image/jpeg' });

            console.log('Uploading file:', file.name, 'Size:', file.size, 'bytes');

            let imageUrl;
            try {
                // Try to upload to Supabase
                imageUrl = await supabaseService.uploadImage(file);
                console.log('Upload successful, URL:', imageUrl);
            } catch (uploadError) {
                console.warn('Supabase upload failed, falling back to base64:', uploadError);
                // Fallback to base64 if Supabase upload fails
                imageUrl = canvas.toDataURL('image/jpeg', 0.9);
                showNotification('Image saved locally (Supabase upload failed)', 'warning');
            }
            
            // Update preview and store URL
            previewImg.src = imageUrl;
            currentImageData = imageUrl;

            // Show remove button for uploaded images
            if (removeImageBtn) {
                removeImageBtn.style.display = 'inline-flex';
            }

            if (imageUrl.startsWith('data:')) {
                showNotification('Image cropped successfully (stored locally)', 'success');
            } else {
                showNotification('Image uploaded and cropped successfully!', 'success');
            }
            
            closeCropModalHandler();
        }
    } catch (error) {
        console.error('Error processing image:', error);
        showNotification(`Failed to process image: ${error.message}`, 'error');
    } finally {
        // Reset button state
        applyCrop.innerHTML = '<i class="fas fa-check"></i> Apply Crop';
        applyCrop.disabled = false;
    }
}

function removeImage() {
    // Reset to default category image
    const category = document.getElementById('productCategory').value;
    updateImageBasedOnCategory();
    
    // Clear current image data
    currentImageData = null;
    
    // Hide remove button
    removeImageBtn.style.display = 'none';
    
    showNotification('Image removed successfully!', 'success');
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    imagePreview.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    imagePreview.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    imagePreview.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        } else {
            showNotification('Please drop a valid image file', 'error');
        }
    }
}

function processImageFile(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image file size must be less than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        cropImage.src = e.target.result;
        
        // Update image info
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const imageInfo = document.getElementById('imageInfo');
        if (imageInfo) {
            imageInfo.textContent = `${file.name} (${fileSize}MB)`;
        }
        
        showCropModal();
    };
    reader.readAsDataURL(file);
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');
    document.body.classList.remove('modal-open');
    editingProductId = null;
    resetForm();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
        color: ${type === 'warning' ? '#212529' : 'white'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transition: transform 0.3s ease;
        max-width: 400px;
        text-align: center;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in from top
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove notification after 4 seconds for warnings, 3 for others
    const delay = type === 'warning' ? 4000 : 3000;
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, delay);
}

function updateActiveNavItem() {
    // Update sidebar active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Set inventory as active
    const inventoryNavItem = document.querySelector('a[href="inventory.html"]')?.parentElement;
    if (inventoryNavItem) {
        inventoryNavItem.classList.add('active');
    }
}

function updateDashboardStats() {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    // Update stats if elements exist
    const statsElements = {
        totalProducts: document.querySelector('.stat-card .stat-number'),
        lowStock: document.querySelectorAll('.stat-card .stat-number')[1],
        outOfStock: document.querySelectorAll('.stat-card .stat-number')[2],
        totalValue: document.querySelectorAll('.stat-card .stat-number')[3]
    };

    if (statsElements.totalProducts) statsElements.totalProducts.textContent = totalProducts;
    if (statsElements.lowStock) statsElements.lowStock.textContent = lowStockProducts;
    if (statsElements.outOfStock) statsElements.outOfStock.textContent = outOfStockProducts;
    if (statsElements.totalValue) statsElements.totalValue.textContent = `₱${totalValue.toLocaleString()}`;
}

// Delete Modal Functions
function closeDeleteModalHandler() {
    deleteModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    productToDeleteId = null;
}

async function handleDeleteConfirmation() {
    if (productToDeleteId) {
        try {
            const product = products.find(p => p.id === productToDeleteId);
            
            // Delete associated image if it's uploaded to Supabase
            if (product && 
                product.image && 
                product.image.includes('supabase') &&
                !product.image.includes('assets/img/')) {
                
                try {
                    const urlParts = product.image.split('/');
                    const fileName = urlParts[urlParts.length - 1].split('?')[0];
                    await supabaseService.deleteImage(fileName);
                } catch (deleteError) {
                    console.warn('Could not delete product image:', deleteError);
                }
            }
            
            await supabaseService.deleteProduct(productToDeleteId);
            showNotification(`Product deleted successfully`, 'success');
            await initializeInventory();
            closeDeleteModalHandler();
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Failed to delete product', 'error');
        }
    }
}


// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInTop {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutTop {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// Add image debugging info to dashboard
function addImageDebugInfo() {
    if (products.length === 0) return;
    
    const debugInfo = {
        totalProducts: products.length,
        customImages: 0,
        defaultImages: 0,
        brokenImages: 0
    };
    
    products.forEach(product => {
        const image = product.image || product.image_url;
        if (image && !isDefaultCategoryImage(image)) {
            debugInfo.customImages++;
        } else {
            debugInfo.defaultImages++;
        }
    });
    
    console.log('📊 Image Debug Info:', debugInfo);
    
    // Add a small debug panel if there are issues
    if (debugInfo.brokenImages > 0 || debugInfo.customImages === 0) {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; background: #f8d7da; 
            color: #721c24; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb;
            max-width: 300px; font-size: 0.9em; z-index: 1000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        `;
        debugPanel.innerHTML = `
            <strong>🔍 Image Debug</strong><br>
            Products: ${debugInfo.totalProducts}<br>
            Custom Images: ${debugInfo.customImages}<br>
            Default Images: ${debugInfo.defaultImages}<br>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            <button onclick="window.open('quick-debug.html', '_blank')" style="margin-top: 10px; margin-left: 5px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Debug Tool</button>
        `;
        document.body.appendChild(debugPanel);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (debugPanel.parentElement) {
                debugPanel.remove();
            }
        }, 10000);
    }
}

addImageDebugInfo();
