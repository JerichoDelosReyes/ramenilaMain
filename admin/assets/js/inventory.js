// Inventory Management System
let products = [
    // Ramen Section
    {
        id: 1,
        name: "Hakodate Ramen",
        category: "ramen",
        price: 150,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Traditional Hakodate-style ramen with rich seafood broth",
        image: "../client/assets/img/HAKODATE.png"
    },
    {
        id: 2,
        name: "Kitakata Ramen",
        category: "ramen",
        price: 270,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Famous for its thick, wavy noodles and light soy sauce-based broth",
        image: "../client/assets/img/KITAKITA.png"
    },
    {
        id: 3,
        name: "Spicy Ramen",
        category: "ramen",
        price: 150,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Hot and flavorful ramen with spicy miso-based broth",
        image: "../client/assets/img/SPICYRAMEN.png"
    },
    {
        id: 4,
        name: "Shoyu Ramen",
        category: "ramen",
        price: 200,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Classic soy sauce-based ramen with tender chashu pork",
        image: "../client/assets/img/SHOYURAMEN.png"
    },
    {
        id: 5,
        name: "Tokushima Ramen",
        category: "ramen",
        price: 250,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Rich pork bone broth with dark soy sauce and raw egg",
        image: "../client/assets/img/TOKUSHIMA.png"
    },
    {
        id: 6,
        name: "Yamagata Ramen",
        category: "ramen",
        price: 150,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Regional specialty with chicken-based broth and thin noodles",
        image: "../client/assets/img/YAMAGATA.png"
    },
    {
        id: 7,
        name: "Takayama Ramen",
        category: "ramen",
        price: 200,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Rich and savory broth with local mountain vegetables",
        image: "../client/assets/img/TAKAYAMARAMEN.png"
    },
    {
        id: 8,
        name: "Shio Ramen",
        category: "ramen",
        price: 200,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Light and delicate salt-based broth with tender pork",
        image: "../client/assets/img/SHIORAMEN.png"
    },
    {
        id: 9,
        name: "Miso Ramen",
        category: "ramen",
        price: 200,
        stock: 50,
        minStock: 10,
        unit: "bowls",
        description: "Hearty miso-based broth with corn and butter",
        image: "../client/assets/img/MISORAMEN.png"
    },
    // Sides Section
    {
        id: 10,
        name: "Pork Gyoza (6pcs)",
        category: "sides",
        price: 150,
        stock: 100,
        minStock: 20,
        unit: "plates",
        description: "Pan-fried dumplings with juicy pork filling",
        image: "../client/assets/img/PORKGYOZA.png"
    },
    {
        id: 11,
        name: "Chicken Karaage",
        category: "sides",
        price: 180,
        stock: 80,
        minStock: 15,
        unit: "plates",
        description: "Crispy Japanese fried chicken with mayo dip",
        image: "../client/assets/img/PORKKARAAGE.png"
    },
    {
        id: 12,
        name: "Edamame",
        category: "sides",
        price: 120,
        stock: 100,
        minStock: 20,
        unit: "plates",
        description: "Steamed young soybeans with sea salt",
        image: "../client/assets/img/Edamame.png"
    },
    {
        id: 13,
        name: "Takoyaki (6pcs)",
        category: "sides",
        price: 160,
        stock: 80,
        minStock: 15,
        unit: "plates",
        description: "Octopus balls with takoyaki sauce and bonito flakes",
        image: "../client/assets/img/TAKOYAKI.png"
    },
    // Drinks Section
    {
        id: 14,
        name: "Hot Green Tea",
        category: "drinks",
        price: 80,
        stock: 100,
        minStock: 20,
        unit: "cups",
        description: "Traditional Japanese green tea",
        image: "../client/assets/img/HOT GREEN TEA.png"
    },
    {
        id: 15,
        name: "Iced Lemon Tea",
        category: "drinks",
        price: 90,
        stock: 100,
        minStock: 20,
        unit: "glasses",
        description: "Refreshing iced tea with fresh lemon",
        image: "../client/assets/img/ICED LEMON TEA.png"
    },
    {
        id: 16,
        name: "Soft Drinks",
        category: "drinks",
        price: 60,
        stock: 200,
        minStock: 40,
        unit: "cans",
        description: "Coke, Sprite, Orange, or Royal",
        image: "../client/assets/img/SOFTDRINKS.png"
    },
    {
        id: 17,
        name: "Japanese Beer",
        category: "drinks",
        price: 150,
        stock: 100,
        minStock: 20,
        unit: "bottles",
        description: "Asahi or Sapporo (18+ only)",
        image: "../client/assets/img/BEER.png"
    },
    // Desserts Section
    {
        id: 18,
        name: "Mochi Ice Cream (3pcs)",
        category: "desserts",
        price: 140,
        stock: 60,
        minStock: 15,
        unit: "plates",
        description: "Vanilla, strawberry, and green tea flavors",
        image: "../client/assets/img/MOCHI.png"
    },
    {
        id: 19,
        name: "Dorayaki",
        category: "desserts",
        price: 120,
        stock: 50,
        minStock: 10,
        unit: "pieces",
        description: "Pancake sandwich with sweet red bean filling",
        image: "../client/assets/img/DORAYAKI.png"
    }
];

let editingProductId = null;

// Image Upload and Crop Functionality
let cropper = null;
let currentImageData = null;

// Image upload elements
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');
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
    initializeInventory();
    setupEventListeners();
    initializeImageUpload();
});

function initializeInventory() {
    renderProducts();
    updateActiveNavItem();
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
    if (!currentImageData || 
        previewImg.src.includes('assets/img/ramen.png') || 
        previewImg.src.includes('assets/img/drinks.png') || 
        previewImg.src.includes('assets/img/toppings.png')) {
        
        if (category === 'drinks') {
            previewImg.src = 'assets/img/drinks.png';
        } else if (category === 'toppings') {
            previewImg.src = 'assets/img/toppings.png';
        } else {
            previewImg.src = 'assets/img/ramen.png';
        }
        currentImageData = null; // Reset custom image data
    }
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
      productsGrid.innerHTML = productsToRender.map(product => {
        const stockStatus = getStockStatus(product);
        const stockClass = stockStatus.toLowerCase().replace(' ', '-');
        
        // Select the correct image based on category
        let productImage = product.image;
        if (product.image === 'assets/img/ramen.png') {
            if (product.category === 'drinks') {
                productImage = 'assets/img/drinks.png';
            } else if (product.category === 'toppings') {
                productImage = 'assets/img/toppings.png';
            }
        }
        
        return `
            <div class="product-card ${stockClass}">
                <div class="product-image">
                    <img src="${productImage}" alt="${product.name}" onerror="this.src='assets/img/ramen.png'">
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
                        <button class="btn btn-primary btn-small" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>                        <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

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
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    
    // Populate form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('minStock').value = product.minStock;
    document.getElementById('productUnit').value = product.unit;
    document.getElementById('productDescription').value = product.description;
    
    // Set the image preview
    previewImg.src = product.image;
    currentImageData = product.image;
    
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

function handleFormSubmit(e) {
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
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate positive numbers
    if (price <= 0 || stock < 0 || minStock < 0) {
        showNotification('Price must be positive and stock values cannot be negative', 'error');
        return;
    }
    
    // Set default image based on category if no custom image is uploaded
    let productImage = currentImageData || previewImg.src;
    if (!currentImageData) {
        if (category === 'drinks') {
            productImage = 'assets/img/drinks.png';
        } else if (category === 'toppings') {
            productImage = 'assets/img/toppings.png';
        } else {
            productImage = 'assets/img/ramen.png';
        }
    }
    
    const formData = {
        name: name,
        category: category,
        price: price,
        stock: stock,
        minStock: minStock,
        unit: unit,
        description: description,
        image: productImage
    };
    
    if (editingProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...formData };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product
        const newProduct = {
            id: Math.max(...products.map(p => p.id)) + 1,
            ...formData
        };
        products.push(newProduct);
        showNotification('Product added successfully!', 'success');
    }
    
    renderProducts();
    closeModal();
    resetForm();
}

// Image upload functionality
function initializeImageUpload() {
    // Upload button click
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    // Image preview click
    imagePreview.addEventListener('click', () => {
        imageUpload.click();
    });

    // File input change
    imageUpload.addEventListener('change', handleImageUpload);

    // Crop modal close
    closeCropModal.addEventListener('click', closeCropModalHandler);
    cancelCrop.addEventListener('click', closeCropModalHandler);
    applyCrop.addEventListener('click', applyCropHandler);

    // Close crop modal on outside click
    cropModal.addEventListener('click', (e) => {
        if (e.target === cropModal) {
            closeCropModalHandler();
        }
    });
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image file size must be less than 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        cropImage.src = e.target.result;
        showCropModal();
    };
    reader.readAsDataURL(file);
}

function showCropModal() {
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

function applyCropHandler() {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    if (canvas) {
        // Convert to base64 and update preview
        const croppedImageData = canvas.toDataURL('image/jpeg', 0.9);
        previewImg.src = croppedImageData;
        currentImageData = croppedImageData;

        showNotification('Image uploaded and cropped successfully!', 'success');
        closeCropModalHandler();
    }
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
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in from top
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

// Delete Modal Functions
function closeDeleteModalHandler() {
    deleteModal.classList.remove('show');
    document.body.classList.remove('modal-open');
    productToDeleteId = null;
}

function handleDeleteConfirmation() {
    if (productToDeleteId) {
        const product = products.find(p => p.id === productToDeleteId);
        const productName = product ? product.name : 'Product';
        
        products = products.filter(p => p.id !== productToDeleteId);
        renderProducts();
        showNotification(`${productName} deleted successfully`, 'success');
        closeDeleteModalHandler();
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
