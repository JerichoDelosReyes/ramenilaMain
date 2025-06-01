// Menu.js - Complete menu functionality
class MenuManager {
    constructor() {
        this.cart = [];
        this.isCartOpen = false;
        this.currentCategory = 'all';
        this.init();
        this.initSmoothScroll();
    }    init() {
        this.setupEventListeners();
        this.setupCategoryFilters();
        this.loadCartFromStorage();
        this.updateCartUI();
        this.initMobileMenu();
        this.initThemeToggle();
    }

    initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const icon = mobileMenuToggle.querySelector('i');

        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Change hamburger icon
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-menu') && 
                !e.target.closest('.mobile-menu-toggle') && 
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                const button = e.target.closest('.add-to-cart-btn');
                const itemData = JSON.parse(button.dataset.item);
                this.addToCart(itemData);
            }
        });

        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Cart overlay click
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                this.toggleCart();
            });
        }

        // Prevent modal close when clicking inside modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('auth-modal') || e.target.classList.contains('order-modal')) {
                e.stopPropagation();
            }
        });
    }

    setupCategoryFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                this.filterByCategory(category);
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.3s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1
            });
        }

        this.updateCartUI();
        this.saveCartToStorage();
        this.showAddToCartNotification(item.name);
    }

    showAddToCartNotification(itemName) {
        showNotification(`${itemName} added to cart`, 'success');
    }

    removeFromCart(itemId) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            this.cart = this.cart.filter(i => i.id !== itemId);
            this.updateCartUI();
            this.saveCartToStorage();
            showNotification(`${item.name} removed from cart`, 'success');
        }
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.updateCartUI();
            this.saveCartToStorage();
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartFooter = document.getElementById('cart-footer');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total');

        // Update cart count for both desktop and mobile
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        if (mobileCartCount) {
            mobileCartCount.textContent = totalItems;
            mobileCartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update cart items
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                        <p class="empty-cart-subtitle">Add some delicious ramen to get started!</p>
                    </div>
                `;
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="menuManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="menuManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="menuManager.removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');

                // Update totals
                const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const tax = subtotal * 0.08;
                const total = subtotal + tax;

                if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
                if (cartTax) cartTax.textContent = `$${tax.toFixed(2)}`;
                if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
                if (cartFooter) cartFooter.style.display = 'block';
            }
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        this.isCartOpen = !this.isCartOpen;
        
        if (cartSidebar) {
            cartSidebar.classList.toggle('open', this.isCartOpen);
        }
        if (cartOverlay) {
            cartOverlay.classList.toggle('active', this.isCartOpen);
        }
        
        // Prevent body scroll when cart is open
        document.body.style.overflow = this.isCartOpen ? 'hidden' : '';
    }

    saveCartToStorage() {
        localStorage.setItem('ramenila_cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('ramenila_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    clearCart() {
        this.cart = [];
        this.updateCartUI();
        this.saveCartToStorage();
    }

    initSmoothScroll() {
        const filterBtns = document.querySelectorAll('.filter-btn[href^="#"]');
        const headerOffset = 100; // Adjust this value based on your header height

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }            });
        });
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = document.getElementById('themeIcon');
        
        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        const body = document.body;
        const themeIcon = document.getElementById('themeIcon');
        
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        
        localStorage.setItem('theme', theme);
    }
}

// Authentication Modal Functions
function openAuthModal(type) {
    const overlay = document.getElementById('auth-modal-overlay');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        if (type === 'login') {
            loginModal.style.display = 'block';
            registerModal.style.display = 'none';
        } else {
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        }
        
        // Add animation class
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}

function closeAuthModal() {
    const overlay = document.getElementById('auth-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

function switchAuthModal(type) {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (type === 'login') {
        loginModal.style.display = 'block';
        registerModal.style.display = 'none';
    } else {
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    }
}

// Order Processing Functions
function proceedToCheckout() {
    if (menuManager.cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // For now, just open the authentication modal
    openAuthModal('login');
}

function handleKioskOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        type: 'kiosk'
    };
    
    processOrder(customerData);
}

function handleDeliveryOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        type: 'delivery'
    };
    
    processOrder(customerData);
}

function processOrder(customerData) {
    // Generate order code
    const orderCode = `RM-${Date.now().toString().slice(-6)}`;
    const orderTotal = menuManager.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = orderTotal * 0.08;
    const finalTotal = orderTotal + tax;
    
    // Prepare order data
    const orderData = {
        code: orderCode,
        customer: customerData,
        items: [...menuManager.cart],
        subtotal: orderTotal,
        tax: tax,
        total: finalTotal,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save order to localStorage (in real app, this would go to backend)
    const orders = JSON.parse(localStorage.getItem('ramenila_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('ramenila_orders', JSON.stringify(orders));
    
    // Show order confirmation
    showOrderConfirmation(orderData);
    
    // Clear cart and close auth modal
    menuManager.clearCart();
    closeAuthModal();
}

function showOrderConfirmation(orderData) {
    const overlay = document.getElementById('order-modal-overlay');
    const orderMessage = document.getElementById('order-message');
    const orderCodeDisplay = document.getElementById('order-code-display');
    const orderInfo = document.getElementById('order-info');
    
    if (overlay) {
        // Update order details
        if (orderMessage) {
            orderMessage.textContent = orderData.customer.type === 'delivery' 
                ? 'Your delivery order has been placed successfully!'
                : 'Your kiosk order has been placed successfully!';
        }
        
        if (orderCodeDisplay) {
            orderCodeDisplay.textContent = `#${orderData.code}`;
        }
        
        if (orderInfo) {
            orderInfo.innerHTML = `
                <div class="order-summary">
                    <h4>Order Summary</h4>
                    <div class="order-customer">
                        <p><strong>Customer:</strong> ${orderData.customer.name}</p>
                        <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
                        ${orderData.customer.address ? `<p><strong>Address:</strong> ${orderData.customer.address}</p>` : ''}
                        <p><strong>Order Type:</strong> ${orderData.customer.type === 'delivery' ? 'Delivery' : 'Kiosk Pickup'}</p>
                    </div>
                    <div class="order-items">
                        <h5>Items Ordered:</h5>
                        ${orderData.items.map(item => `
                            <div class="order-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-totals">
                        <div class="total-line">
                            <span>Subtotal:</span>
                            <span>$${orderData.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-line">
                            <span>Tax (8%):</span>
                            <span>$${orderData.tax.toFixed(2)}</span>
                        </div>
                        <div class="total-line final-total">
                            <span>Total:</span>
                            <span>$${orderData.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Show modal
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => overlay.classList.add('active'), 10);
    }
}

function closeOrderModal() {
    const overlay = document.getElementById('order-modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

function showOrderModal(orderType) {
    const modalContent = orderType === 'kiosk' 
        ? {
            title: 'Kiosk Ordering',
            message: 'Visit any of our locations to use our digital kiosk for quick ordering. No online payment required!',
            action: 'Find Locations'
        }
        : {
            title: 'Delivery Service',
            message: 'Schedule your ramen delivery and pay when it arrives at your door. Fresh and hot!',
            action: 'Call for Delivery'
        };
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="order-modal">
            <button class="modal-close">&times;</button>
            <div class="modal-icon">
                <i class="fas ${orderType === 'kiosk' ? 'fa-utensils' : 'fa-truck'}"></i>
            </div>
            <h3>${modalContent.title}</h3>
            <p>${modalContent.message}</p>
            <div class="modal-actions">
                <button class="modal-btn primary">${modalContent.action}</button>
                <button class="modal-btn secondary modal-close-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .order-modal {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
                position: relative;
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
                padding: 5px;
                line-height: 1;
            }
            
            .modal-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #8B4513, #A0522D);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 25px;
                color: white;
                font-size: 2rem;
            }
            
            .order-modal h3 {
                font-size: 1.5rem;
                color: #8B4513;
                margin-bottom: 15px;
            }
            
            .order-modal p {
                color: #6B4423;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .modal-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-btn.primary {
                background: linear-gradient(135deg, #8B4513, #A0522D);
                color: white;
            }
            
            .modal-btn.secondary {
                background: #f5f5f5;
                color: #666;
            }
            
            .modal-btn:hover {
                transform: translateY(-2px);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Add modal to body
    document.body.appendChild(modalOverlay);
    
    // Close modal functionality
    const closeModal = () => {
        modalOverlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    };
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    
    // Primary action
    modalOverlay.querySelector('.modal-btn.primary').addEventListener('click', () => {
        if (orderType === 'kiosk') {
            // Scroll to locations section in the main page
            window.location.href = '../index.html#locations';
        } else {
            // Open phone dialer (for mobile) or show phone number
            window.open('tel:+6282734567', '_self');
        }
        closeModal();
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const styles = {
        success: {
            background: '#4CAF50',
            icon: '<i class="fas fa-check-circle"></i>'
        },
        error: {
            background: '#f44336',
            icon: '<i class="fas fa-times-circle"></i>'
        }
    };
    
    const style = styles[type];
    
    notification.innerHTML = `${style.icon} ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: ${style.background};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        justify-content: center;
        font-weight: 500;
        animation: slideInTop 0.3s ease forwards;
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const keyframes = document.createElement('style');
        keyframes.id = 'notification-styles';
        keyframes.textContent = `
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
            @media (max-width: 768px) {
                .notification {
                    width: 90%;
                    min-width: unset;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(keyframes);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLoginModal();
    // Initialize other menu functionality
    window.menuManager = new MenuManager();
});

function initializeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    const accountBtn = document.getElementById('accountBtn');
    const mobileAccountBtn = document.getElementById('mobileAccountBtn');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Desktop account button
    if (accountBtn) {
        accountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            setTimeout(() => loginModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });
    }

    // Mobile account button
    if (mobileAccountBtn) {
        mobileAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            setTimeout(() => loginModal.classList.add('active'), 10);
            document.body.style.overflow = 'hidden';
        });
    }

    // Close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            setTimeout(() => {
                loginModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });
    }

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
            setTimeout(() => {
                loginModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email === 'user@gmail.com' && password === 'user') {
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = '../admin/dashboard.html';
                }, 1000);
            } else {
                showNotification('Invalid credentials. Please try again.', 'error');
            }
        });
    }
}
