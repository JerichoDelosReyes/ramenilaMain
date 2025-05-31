// Transaction/POS JavaScript functionality
class POSSystem {    constructor() {
        this.cart = [];
        this.currentOrder = null;
        this.orderNumber = this.generateOrderNumber();
        this.paymentMethod = 'cash';
        this.customerType = 'regular'; // Track customer type for discounts
        this.initializeSystem();
    }    initializeSystem() {
        this.loadMenuItems();
        this.setupEventListeners();
        this.updateDateTime();
        this.toggleCashPaymentFields(); // Initialize payment fields visibility
        setInterval(() => this.updateDateTime(), 1000);
    }

    generateOrderNumber() {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        return `RM${timestamp}`;
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const dateTimeString = now.toLocaleDateString('en-US', options);
        const dateTimeElement = document.getElementById('current-datetime');
        if (dateTimeElement) {
            dateTimeElement.textContent = dateTimeString;
        }
    }    loadMenuItems() {
        console.log('Loading menu items...');
        // Test products for transaction page (separate from inventory)
        this.testProducts = [
            {
                id: 1,
                name: 'Tonkotsu Ramen',
                description: 'Rich pork bone broth with tender chashu',
                category: 'ramen',
                price: 295.00,
                stock: 15,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCf35w8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 2,
                name: 'Shoyu Ramen',
                description: 'Clear soy sauce based broth with green onions',
                category: 'ramen',
                price: 275.00,
                stock: 12,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCf35w8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 3,
                name: 'Miso Ramen',
                description: 'Rich fermented soybean paste broth',
                category: 'ramen',
                price: 285.00,
                stock: 8,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCf35w8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 4,
                name: 'Spicy Tantanmen',
                description: 'Spicy sesame and minced pork ramen',
                category: 'ramen',
                price: 315.00,
                stock: 6,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCf35w8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 5,
                name: 'Gyoza (6 pcs)',
                description: 'Pan-fried pork and vegetable dumplings',
                category: 'sides',
                price: 185.00,
                stock: 20,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfpZ88L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 6,
                name: 'Chicken Karaage',
                description: 'Japanese style fried chicken pieces',
                category: 'sides',
                price: 215.00,
                stock: 14,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfkpc8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 7,
                name: 'Edamame',
                description: 'Steamed young soybeans with sea salt',
                category: 'sides',
                price: 125.00,
                stock: 25,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfq5g8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 8,
                name: 'Takoyaki (6 pcs)',
                description: 'Octopus balls with takoyaki sauce',
                category: 'sides',
                price: 235.00,
                stock: 0,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfkJk8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 9,
                name: 'Green Tea',
                description: 'Hot Japanese green tea',
                category: 'drinks',
                price: 75.00,
                stock: 30,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfkYU8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 10,
                name: 'Ramune Soda',
                description: 'Traditional Japanese marble soda',
                category: 'drinks',
                price: 95.00,
                stock: 18,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfpKQ8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 11,
                name: 'Japanese Beer',
                description: 'Cold Asahi or Sapporo draft beer',
                category: 'drinks',
                price: 145.00,
                stock: 12,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfkLo8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 12,
                name: 'Extra Chashu',
                description: 'Additional braised pork belly slices',
                category: 'toppings',
                price: 55.00,
                stock: 22,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfpZA8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 13,
                name: 'Soft Boiled Egg',
                description: 'Perfectly cooked ramen egg',
                category: 'toppings',
                price: 35.00,
                stock: 28,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCfpJU8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            },
            {
                id: 14,
                name: 'Extra Noodles',
                description: 'Additional portion of ramen noodles',
                category: 'toppings',
                price: 45.00,
                stock: 35,
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRkY4RUEiLz4KPHN2ZyB4PSIxNiIgeT0iMTYiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KPHA+PGVtb2ppPjCf35w8L2Vtb2ppPjwvcD4KPC9zdmc+Cjwvc3ZnPgo='
            }
        ];

        this.filteredProducts = [...this.testProducts];
        this.renderMenuTable();
    }    renderMenuTable() {
        console.log('Rendering menu table...');
        const tableBody = document.getElementById('menuTableBody');
        if (!tableBody) {
            console.error('menuTableBody not found!');
            return;
        }

        tableBody.innerHTML = '';

        this.filteredProducts.forEach(product => {
            const row = this.createTableRow(product);
            tableBody.appendChild(row);
        });
        console.log('Table rendered with', this.filteredProducts.length, 'products');
    }    createTableRow(product) {
        const row = document.createElement('tr');
        const isOutOfStock = product.stock === 0;
        
        if (isOutOfStock) {
            row.classList.add('out-of-stock');
        }

        // Get image based on category
        const categoryImage = this.getCategoryImage(product.category);

        row.innerHTML = `
            <td>
                <img src="${categoryImage}" alt="${product.name}" class="product-image">
            </td>
            <td>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
            </td>
            <td>
                <span class="category-badge ${product.category}">${product.category}</span>
            </td>
            <td>
                <span class="product-price">₱${product.price.toFixed(2)}</span>
            </td>
            <td>
                <span class="stock-info ${this.getStockClass(product.stock)}">
                    ${isOutOfStock ? 'Out of Stock' : `${product.stock} available`}
                </span>
            </td>
        `;

        // Add click event to the entire row for adding to cart
        if (!isOutOfStock) {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => this.addToCart(product));
            row.title = 'Click to add to cart';
        }

        return row;
    }

    getCategoryImage(category) {
        const imageMap = {
            'ramen': 'assets/img/ramen.png',
            'toppings': 'assets/img/toppings.png',
            'drinks': 'assets/img/drinks.png',
            'sides': 'assets/img/sides.png'
        };
        return imageMap[category] || 'assets/img/ramen.png'; // Default to ramen if category not found
    }

    getStockClass(stock) {
        if (stock === 0) return 'stock-out';
        if (stock <= 5) return 'stock-low';
        return 'stock-available';
    }

    filterProducts(category) {
        if (category === 'all') {
            this.filteredProducts = [...this.testProducts];
        } else {
            this.filteredProducts = this.testProducts.filter(product => product.category === category);
        }
        this.renderMenuTable();
    }

    searchProducts(searchTerm) {
        const term = searchTerm.toLowerCase();
        this.filteredProducts = this.testProducts.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
        this.renderMenuTable();
    }

    setupEventListeners() {
        // Category filter tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProducts(e.target.dataset.category);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }        // Payment method change
        const paymentMethod = document.getElementById('paymentMethod');
        if (paymentMethod) {
            paymentMethod.addEventListener('change', (e) => {
                this.paymentMethod = e.target.value;
                this.toggleCashPaymentFields();
                this.calculateChange();
            });
        }        // Customer type change
        const customerType = document.getElementById('customerType');
        if (customerType) {
            customerType.addEventListener('change', (e) => {
                console.log('Customer type changed to:', e.target.value);
                this.customerType = e.target.value;
                this.updateCartDisplay(); // Recalculate with discount
                
                // Show notification about discount change
                if (this.customerType === 'regular') {
                    this.showNotification('Discount removed', 'info');
                } else {
                    this.showNotification('20% discount applied', 'success');
                }
            });
        }

        // Amount received input
        const amountReceived = document.getElementById('amountReceived');
        if (amountReceived) {
            amountReceived.addEventListener('input', () => {
                this.calculateChange();
            });
        }

        // Clear cart button
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }        // Process order button (old ID - keeping for compatibility)
        const processOrderBtn = document.getElementById('processOrderBtn');
        if (processOrderBtn) {
            processOrderBtn.addEventListener('click', () => {
                this.processOrder();
            });
        }

        // Proceed to Payment button (new ID)
        const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
        if (proceedToPaymentBtn) {
            proceedToPaymentBtn.addEventListener('click', () => {
                this.processOrder();
            });
        }

        // Modal close buttons
        const closeOrderModal = document.getElementById('closeOrderModal');
        if (closeOrderModal) {
            closeOrderModal.addEventListener('click', () => {
                this.closeOrderModal();
            });
        }

        // New order button
        const newOrderBtn = document.getElementById('newOrderBtn');
        if (newOrderBtn) {
            newOrderBtn.addEventListener('click', () => {
                this.startNewOrder();
            });
        }

        // Print receipt button
        const printReceiptBtn = document.getElementById('printReceiptBtn');
        if (printReceiptBtn) {
            printReceiptBtn.addEventListener('click', () => {
                this.printReceipt();
            });
        }

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
    }    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({...item, quantity: 1});
        }
        this.updateCartDisplay();
        this.showNotification(`${item.name} added to cart`, 'success');
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartDisplay();
    }    updateQuantity(itemId, change) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                this.updateCartDisplay();
            }
        }
    }    // Calculate discount based on customer type
    calculateDiscount(subtotal) {
        const discountRates = {
            'regular': 0,
            'pwd': 0.20,     // 20% discount for PWD
            'senior': 0.20   // 20% discount for Senior Citizens
        };
        
        const discountRate = discountRates[this.customerType] || 0;
        const discount = subtotal * discountRate;
        console.log(`Calculating discount: customerType=${this.customerType}, rate=${discountRate}, subtotal=${subtotal}, discount=${discount}`);
        return discount;
    }

    // Get discount type label
    getDiscountTypeLabel() {
        const labels = {
            'pwd': '20% PWD',
            'senior': '20% Senior Citizen'
        };
        return labels[this.customerType] || '';
    }    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const subtotalElement = document.getElementById('subtotal');
        const discountElement = document.getElementById('discount');
        const discountRowElement = document.getElementById('discountRow');
        const discountTypeElement = document.getElementById('discountType');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');
        const processOrderBtn = document.getElementById('processOrderBtn');
        const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
        
        // Reset discount display
        if (discountRowElement) discountRowElement.style.display = 'none';
        if (discountElement) discountElement.textContent = '-₱0.00';
        if (discountTypeElement) discountTypeElement.textContent = 'Discount:';
        
        if (this.cart.length === 0) {
            if (cartItems) cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>No items in cart</p></div>';
            if (subtotalElement) subtotalElement.textContent = '₱0.00';
            if (taxElement) taxElement.textContent = '₱0.00';
            if (totalElement) totalElement.textContent = '₱0.00';
            if (processOrderBtn) processOrderBtn.disabled = true;
            if (proceedToPaymentBtn) proceedToPaymentBtn.disabled = true;
            return;
        }

        // Calculate subtotal
        let subtotal = 0;
        let totalItems = 0;

        if (cartItems) {
            cartItems.innerHTML = '';
            this.cart.forEach(item => {
                subtotal += item.price * item.quantity;
                totalItems += item.quantity;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="pos.updateQuantity(${item.id}, -1)" class="qty-btn minus">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="pos.updateQuantity(${item.id}, 1)" class="qty-btn plus">+</button>
                        <button onclick="pos.removeFromCart(${item.id})" class="remove-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }

        // Calculate discount
        const discount = this.calculateDiscount(subtotal);
        const discountedSubtotal = subtotal - discount;
        
        // Calculate tax (12% on discounted amount)
        const tax = discountedSubtotal * 0.12;
        
        // Calculate final total
        const finalTotal = discountedSubtotal + tax;

        // Update display elements
        if (subtotalElement) subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        
        // Show/hide discount row and update text based on customer type
        if (discount > 0) {
            if (discountRowElement) {
                discountRowElement.style.display = 'flex';
                if (discountElement) discountElement.textContent = `-₱${discount.toFixed(2)}`;
                if (discountTypeElement) {
                    const discountLabel = this.customerType === 'pwd' ? '20% PWD Discount:' : 
                                        this.customerType === 'senior' ? '20% Senior Discount:' : 
                                        'Discount:';
                    discountTypeElement.textContent = discountLabel;
                }
            }
        }
        
        if (taxElement) taxElement.textContent = `₱${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `₱${finalTotal.toFixed(2)}`;
        
        // Enable/disable process order button
        if (processOrderBtn) processOrderBtn.disabled = this.cart.length === 0;
        if (proceedToPaymentBtn) proceedToPaymentBtn.disabled = this.cart.length === 0;

        this.calculateChange();
    }

    clearCart() {
        this.cart = [];
        this.updateCartDisplay();
        this.showNotification('Cart cleared', 'info');
    }    toggleCashPaymentFields() {
        const cashPayment = document.getElementById('cashPayment');
        if (cashPayment) {
            if (this.paymentMethod === 'cash') {
                cashPayment.style.display = 'block';
            } else {
                cashPayment.style.display = 'none';
            }
        }
    }calculateChange() {
        const amountReceived = document.getElementById('amountReceived');
        const changeAmount = document.getElementById('changeAmount');
        
        if (amountReceived && changeAmount && this.paymentMethod === 'cash') {
            // Calculate total with discount and tax
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const discount = this.calculateDiscount(subtotal);
            const discountedSubtotal = subtotal - discount;
            const tax = discountedSubtotal * 0.12;
            const total = discountedSubtotal + tax;
            
            const received = parseFloat(amountReceived.value) || 0;
            const change = received - total;
            
            if (change >= 0) {
                changeAmount.textContent = `₱${change.toFixed(2)}`;
                changeAmount.style.color = 'var(--success-color)';
            } else {
                changeAmount.textContent = `₱${Math.abs(change).toFixed(2)} short`;
                changeAmount.style.color = 'var(--error-color)';
            }
        }
    }    processOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Cart is empty', 'error');
            return;
        }

        // Calculate final total with discount and tax
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = this.calculateDiscount(subtotal);
        const discountedSubtotal = subtotal - discount;
        const tax = discountedSubtotal * 0.12;
        const total = discountedSubtotal + tax;
        
        // Validate payment for cash transactions
        if (this.paymentMethod === 'cash') {
            const amountReceived = document.getElementById('amountReceived');
            const received = parseFloat(amountReceived.value) || 0;
            
            if (received < total) {
                this.showNotification('Insufficient amount received', 'error');
                return;
            }
        }

        // Show processing notification
        this.showNotification('Processing order...', 'info');

        // Simulate processing delay
        setTimeout(() => {
            this.completeTransaction(total, subtotal, discount, tax);
        }, 2000);
    }    completeTransaction(total, subtotal, discount, tax) {
        const customerName = 'Walk-in Customer'; // Default since customer name field was removed
        const orderType = 'dine-in'; // Default to dine-in since order type field was removed
        
        const transaction = {
            orderNumber: this.orderNumber,
            customerName: customerName,
            customerType: this.customerType,
            orderType: orderType,
            items: [...this.cart],
            subtotal: subtotal,
            discount: discount,
            discountType: this.customerType !== 'regular' ? this.getDiscountTypeLabel() : null,
            tax: tax,
            total: total,
            paymentMethod: this.paymentMethod,
            timestamp: new Date().toISOString(),
            status: 'completed'
        };

        // Save transaction to localStorage
        this.saveTransaction(transaction);

        // Show order completion modal
        this.showOrderModal(transaction);

        // Reset for next order
        this.cart = [];
        this.orderNumber = this.generateOrderNumber();
        this.updateCartDisplay();
        
        // Clear payment fields
        const amountReceived = document.getElementById('amountReceived');
        if (amountReceived) amountReceived.value = '';
          // Reset customer type to regular for next order
        const customerTypeSelect = document.getElementById('customerType');
        if (customerTypeSelect) {
            customerTypeSelect.value = 'regular';
            this.customerType = 'regular';
        }
        
        this.showNotification('Order completed successfully!', 'success');
    }

    saveTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('ramenila_transactions') || '[]');
        transactions.unshift(transaction);
        
        // Keep only last 100 transactions
        if (transactions.length > 100) {
            transactions.splice(100);
        }
        
        localStorage.setItem('ramenila_transactions', JSON.stringify(transactions));
    }    showOrderModal(transaction) {
        const modal = document.getElementById('orderModal');
        const orderReceipt = document.getElementById('orderReceipt');
        
        if (modal && orderReceipt) {
            let itemsHtml = '';
            transaction.items.forEach(item => {
                itemsHtml += `
                    <div class="receipt-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });

            let discountHtml = '';
            if (transaction.discount > 0) {
                discountHtml = `
                    <div class="receipt-item">
                        <span>Discount (${transaction.discountType}):</span>
                        <span>-₱${transaction.discount.toFixed(2)}</span>
                    </div>
                `;
            }

            orderReceipt.innerHTML = `
                <div class="receipt-header">
                    <h3>Ramenila</h3>
                    <p>Order #${transaction.orderNumber}</p>
                    <p>${new Date(transaction.timestamp).toLocaleString()}</p>
                </div>                <div class="receipt-details">
                    <p><strong>Customer:</strong> ${transaction.customerName}</p>
                    <p><strong>Customer Type:</strong> ${transaction.customerType.charAt(0).toUpperCase() + transaction.customerType.slice(1)}</p>
                    <p><strong>Payment Method:</strong> ${transaction.paymentMethod.toUpperCase()}</p>
                </div>
                <div class="receipt-items">
                    <h4>Items Ordered:</h4>
                    ${itemsHtml}
                </div>
                <div class="receipt-summary">
                    <div class="receipt-item">
                        <span>Subtotal:</span>
                        <span>₱${transaction.subtotal.toFixed(2)}</span>
                    </div>
                    ${discountHtml}
                    <div class="receipt-item">
                        <span>Tax (12%):</span>
                        <span>₱${transaction.tax.toFixed(2)}</span>
                    </div>
                    <div class="receipt-item total">
                        <strong>Total: ₱${transaction.total.toFixed(2)}</strong>
                    </div>
                </div>
            `;

            modal.style.display = 'block';
        }
    }

    closeOrderModal() {
        const modal = document.getElementById('orderModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    startNewOrder() {
        this.closeOrderModal();
        // Cart is already cleared in completeTransaction
    }

    printReceipt() {
        window.print();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize POS system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.pos = new POSSystem();
});
