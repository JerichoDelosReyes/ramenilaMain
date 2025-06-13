// Transaction History Management System
import supabaseService from './supabase-service.js';

// Loading overlay functions
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
        }, 100); // Reduced to 0.1 second delay
    }
}

class TransactionHistory {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.currentTransaction = null;
        this.sortColumn = 'created_at';
        this.sortDirection = 'desc';
        this.isLoading = false;
        this.searchQuery = '';
        
        // Show loading overlay initially
        showLoadingOverlay();
        
        this.initializeSystem();
    }    async initializeSystem() {
        try {
            console.log('🔄 Initializing Transaction History System...');
            
            // Check if required DOM elements exist
            const tbody = document.getElementById('transactions-tbody');
            if (!tbody) {
                throw new Error('Required DOM element "transactions-tbody" not found');
            }
            
            this.showLoading();
              console.log('📋 Loading transactions...');
            
            // Show a quick notification that we're loading
            this.showNotification('Loading transaction history...', 'info');
            
            // Start loading transactions with quick fallback
            const loadingPromise = this.loadTransactions();
            
            // Quick fallback after 2 seconds if no data loaded
            const quickFallbackPromise = new Promise((resolve) => {
                setTimeout(() => {
                    if (this.transactions.length === 0) {
                        console.log('⚡ Quick fallback: Loading sample data due to slow response');
                        this.loadSampleData();
                    }
                    resolve();
                }, 2000);
            });
            
            // Wait for either the actual load or the quick fallback
            await Promise.race([loadingPromise, quickFallbackPromise]);
            
            console.log('⚙️ Setting up event listeners...');
            this.setupEventListeners();
            
            console.log('📊 Updating summary cards...');
            this.updateSummaryCards();
            
            console.log('🖼️ Displaying transactions...');
            this.displayTransactions();
            
            this.hideLoading();
            
            console.log('✅ Transaction History System initialized successfully');
            console.log(`📈 Loaded ${this.transactions.length} transactions`);
            
            // Set up auto-refresh every 30 seconds
            setInterval(() => {
                console.log('🔄 Auto-refreshing transactions...');
                this.loadTransactions();
            }, 30000);
            
        } catch (error) {
            console.error('❌ Transaction History initialization failed:', error);
            this.hideLoading();
            this.showErrorState();
            throw error;
        } finally {
            // Hide loading overlay after initialization attempt
            hideLoadingOverlay();
        }
    }

    showLoading() {
        this.isLoading = true;
        const tbody = document.getElementById('transactions-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #873E23; margin-bottom: 15px;"></i>
                            <div>Loading transactions...</div>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    hideLoading() {
        this.isLoading = false;
    }    async loadTransactions() {
        try {
            console.log('📋 Loading transactions from Supabase...');
              // Add timeout for database call
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Database request timed out after 5 seconds')), 5000);
            });
            
            const loadPromise = supabaseService.getTransactions();
            
            // Race between actual load and timeout
            const rawTransactions = await Promise.race([loadPromise, timeoutPromise]);
            
            console.log(`✅ Raw transactions loaded: ${rawTransactions.length}`);
            console.log('Raw transactions from database:', rawTransactions);
            
            if (rawTransactions.length === 0) {
                console.log('⚠️ No transactions found in database');
                this.transactions = [];
                this.filteredTransactions = [];
                this.showEmptyState();
                return;
            }
            
            // Process and format transactions
            console.log('🔄 Processing transaction data...');
            this.transactions = rawTransactions.map(transaction => {
                const processed = {
                    ...transaction,
                    id: transaction.id,
                    order_number: transaction.transaction_number || transaction.order_number,
                    orderNumber: transaction.transaction_number || transaction.order_number,
                    timestamp: transaction.created_at,
                    items: this.parseItems(transaction.items),
                    total: parseFloat(transaction.total || 0),
                    subtotal: parseFloat(transaction.subtotal || 0),
                    tax: parseFloat(transaction.tax_amount || 0),
                    discount: parseFloat(transaction.discount_amount || 0),
                    payment_method: transaction.payment_method,
                    paymentMethod: transaction.payment_method,
                    status: transaction.status || 'completed',
                    customer_name: transaction.customer_name,
                    customerName: transaction.customer_name
                };
                
                console.log(`✅ Processed transaction: ${processed.order_number} - ₱${processed.total}`);
                return processed;
            });

            console.log(`✅ Processed ${this.transactions.length} transactions successfully`);
            
            // Sort by timestamp (newest first)
            this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            this.filteredTransactions = [...this.transactions];
            this.displayTransactions();
            this.updateSummaryCards();
            
            console.log('🎉 Transaction loading completed successfully');
              } catch (error) {
            console.error("❌ Error loading transactions:", error);
            console.log('🔄 Attempting to load with sample data...');
            
            // Show notification about the error
            this.showNotification('Database connection issue. Loading with sample data.', 'warning');
            
            // Load sample data as fallback
            this.loadSampleData();
        }
    }

    loadSampleData() {
        console.log('📋 Loading sample transaction data...');
        
        // Sample transactions for demonstration
        this.transactions = [
            {
                id: 1,
                order_number: 'ORD-2024-001',
                timestamp: new Date().toISOString(),
                created_at: new Date().toISOString(),
                items: [
                    { name: 'Shoyu Ramen', quantity: 2, price: 350 },
                    { name: 'Gyoza', quantity: 1, price: 180 }
                ],
                total: 880,
                subtotal: 880,
                tax: 0,
                discount: 0,
                payment_method: 'cash',
                paymentMethod: 'cash',
                status: 'completed',
                customer_name: 'Sample Customer',
                customerName: 'Sample Customer'
            },
            {
                id: 2,
                order_number: 'ORD-2024-002',
                timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                created_at: new Date(Date.now() - 3600000).toISOString(),
                items: [
                    { name: 'Miso Ramen', quantity: 1, price: 380 },
                    { name: 'Takoyaki', quantity: 1, price: 250 }
                ],
                total: 630,
                subtotal: 630,
                tax: 0,
                discount: 0,
                payment_method: 'gcash',
                paymentMethod: 'gcash',
                status: 'completed',
                customer_name: 'Demo User',
                customerName: 'Demo User'
            }
        ];
        
        console.log(`✅ Loaded ${this.transactions.length} sample transactions`);        
        this.filteredTransactions = [...this.transactions];
        this.displayTransactions();
        this.updateSummaryCards();
        
        console.log('🎉 Sample data loading completed');
    }

    parseItems(items) {
        if (!items) return [];
        if (typeof items === 'string') {
            try {
                return JSON.parse(items);
            } catch (e) {
                console.error('Error parsing transaction items:', e);
                return [];
            }
        }
        if (Array.isArray(items)) return items;
        return [];
    }

    showEmptyState() {
        const tbody = document.getElementById('transactions-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 60px; color: #666;">
                        <div class="empty-state">
                            <i class="fas fa-receipt" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.3;"></i>
                            <h3 style="margin: 0 0 10px 0; color: #666;">No Transactions Found</h3>
                            <p style="margin: 0; font-size: 0.9rem;">Transactions will appear here once customers start placing orders.</p>
                            <button onclick="window.location.href='transaction.html'" style="margin-top: 20px; padding: 10px 20px; background: #873E23; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-plus"></i> Process New Transaction
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showErrorState() {
        const tbody = document.getElementById('transactions-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 60px; color: #666;">
                        <div class="error-state">
                            <i class="fas fa-exclamation-triangle" style="font-size: 4rem; margin-bottom: 20px; color: #dc3545;"></i>
                            <h3 style="margin: 0 0 10px 0; color: #dc3545;">Failed to Load Transactions</h3>
                            <p style="margin: 0 0 20px 0; font-size: 0.9rem;">Please check your connection and try again.</p>
                            <button onclick="transactionHistory.loadTransactions()" style="padding: 10px 20px; background: #873E23; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                <i class="fas fa-redo"></i> Retry
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    setupEventListeners() {
        // Search functionality with debouncing
        let searchTimeout;
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchTransactions(e.target.value);
                }, 300);
            });
        }

        // Filter buttons
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadTransactions();
            });
        }

        // Export buttons
        const exportCsvBtn = document.getElementById('export-csv');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }

        const exportPdfBtn = document.getElementById('export-pdf');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportToPDF();
            });
        }

        // Pagination
        const prevPageBtn = document.getElementById('prev-page');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.displayTransactions();
                }
            });
        }

        const nextPageBtn = document.getElementById('next-page');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.displayTransactions();
                }
            });
        }

        // Items per page
        const itemsPerPageSelect = document.getElementById('items-per-page');
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.displayTransactions();
            });
        }

        // Sortable table headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column);
            });
        });

        // Modal close functionality
        this.setupModalHandlers();
    }    setupModalHandlers() {
        // Close modals when clicking outside or on close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
            if (e.target.classList.contains('close-btn') || e.target.classList.contains('close')) {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal);
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    this.closeModal(modal);
                });
            }
        });
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.classList.remove('modal-open');
        }
    }

    searchTransactions(query) {
        this.searchQuery = query.toLowerCase();
        this.filteredTransactions = this.transactions.filter(transaction => {
            const orderNumber = (transaction.order_number || '').toLowerCase();
            const customerName = (transaction.customer_name || '').toLowerCase();
            const paymentMethod = (transaction.payment_method || '').toLowerCase();
            const status = (transaction.status || '').toLowerCase();
            const total = (transaction.total || 0).toString();
            
            return orderNumber.includes(this.searchQuery) ||
                   customerName.includes(this.searchQuery) ||
                   paymentMethod.includes(this.searchQuery) ||
                   status.includes(this.searchQuery) ||
                   total.includes(this.searchQuery);
        });
        
        this.currentPage = 1;
        this.displayTransactions();
        this.updateSummaryCards();
    }

    applyFilters() {
        const statusFilter = document.getElementById('status-filter')?.value || '';
        const paymentFilter = document.getElementById('payment-filter')?.value || '';
        const dateFrom = document.getElementById('date-from')?.value || '';
        const dateTo = document.getElementById('date-to')?.value || '';

        this.filteredTransactions = this.transactions.filter(transaction => {
            const status = transaction.status || '';
            const paymentMethod = transaction.payment_method || '';
            const transactionDate = new Date(transaction.timestamp);
            
            // Status filter
            if (statusFilter && status !== statusFilter) {
                return false;
            }
            
            // Payment method filter
            if (paymentFilter && paymentMethod !== paymentFilter) {
                return false;
            }
            
            // Date range filter
            if (dateFrom && transactionDate < new Date(dateFrom)) {
                return false;
            }
            
            if (dateTo && transactionDate > new Date(dateTo + 'T23:59:59')) {
                return false;
            }
            
            return true;
        });

        // Apply search query if exists
        if (this.searchQuery) {
            this.searchTransactions(this.searchQuery);
        } else {
            this.currentPage = 1;
            this.displayTransactions();
            this.updateSummaryCards();
        }
    }

    clearFilters() {
        const statusFilter = document.getElementById('status-filter');
        const paymentFilter = document.getElementById('payment-filter');
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');
        const searchInput = document.getElementById('search-transactions');
        
        if (statusFilter) statusFilter.value = '';
        if (paymentFilter) paymentFilter.value = '';
        if (dateFrom) dateFrom.value = '';
        if (dateTo) dateTo.value = '';
        if (searchInput) searchInput.value = '';
        
        this.searchQuery = '';
        this.filteredTransactions = [...this.transactions];
        this.currentPage = 1;
        this.displayTransactions();
        this.updateSummaryCards();
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredTransactions.sort((a, b) => {
            let aValue, bValue;
            
            switch(column) {
                case 'timestamp':
                    aValue = new Date(a.timestamp || a.created_at);
                    bValue = new Date(b.timestamp || b.created_at);
                    break;
                case 'order_number':
                    aValue = a.order_number || '';
                    bValue = b.order_number || '';
                    break;
                case 'total':
                    aValue = parseFloat(a.total || 0);
                    bValue = parseFloat(b.total || 0);
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
                    break;
                case 'payment_method':
                    aValue = a.payment_method || '';
                    bValue = b.payment_method || '';
                    break;
                default:
                    aValue = a[column] || '';
                    bValue = b[column] || '';
            }

            if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateSortIndicators();
        this.displayTransactions();
    }

    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(header => {
            const icon = header.querySelector('i');
            if (icon) {
                if (header.dataset.column === this.sortColumn) {
                    icon.className = this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
                } else {
                    icon.className = 'fas fa-sort';
                }
            }
        });
    }

    updateSummaryCards() {
        const completed = this.filteredTransactions.filter(t => t.status === 'completed').length;
        const pending = this.filteredTransactions.filter(t => t.status === 'pending').length;
        const cancelled = this.filteredTransactions.filter(t => t.status === 'cancelled').length;
        const refunded = this.filteredTransactions.filter(t => t.status === 'refunded').length;
        
        const totalRevenue = this.filteredTransactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + (parseFloat(t.total) || 0), 0);

        const totalElement = document.getElementById('total-transactions');
        const completedElement = document.getElementById('completed-transactions');
        const pendingElement = document.getElementById('pending-transactions');
        const cancelledElement = document.getElementById('cancelled-transactions');
        const refundedElement = document.getElementById('refunded-transactions');
        const revenueElement = document.getElementById('total-revenue');

        if (totalElement) totalElement.textContent = this.filteredTransactions.length;
        if (completedElement) completedElement.textContent = completed;
        if (pendingElement) pendingElement.textContent = pending;
        if (cancelledElement) cancelledElement.textContent = cancelled;
        if (refundedElement) refundedElement.textContent = refunded;
        if (revenueElement) revenueElement.textContent = `₱${totalRevenue.toFixed(2)}`;
    }

    displayTransactions() {
        const tbody = document.getElementById('transactions-tbody');
        
        if (!tbody || this.isLoading) {
            return;
        }

        if (this.filteredTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.3;"></i>
                        <div>No transactions found matching your criteria.</div>
                        <button onclick="transactionHistory.clearFilters()" style="margin-top: 15px; padding: 8px 16px; background: #873E23; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Clear Filters
                        </button>
                    </td>
                </tr>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentTransactions = this.filteredTransactions.slice(startIndex, endIndex);

        tbody.innerHTML = currentTransactions.map(transaction => this.createTransactionRow(transaction)).join('');
        this.updatePaginationInfo();
    }

    createTransactionRow(transaction) {
        const timestamp = new Date(transaction.timestamp || transaction.created_at);
        const formattedDate = timestamp.toLocaleDateString();
        const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const statusClass = this.getStatusClass(transaction.status);
        const paymentBadge = this.getPaymentBadge(transaction.payment_method);
        
        return `
            <tr>
                <td>
                    <strong>${transaction.order_number || 'N/A'}</strong>
                </td>
                <td>
                    <div class="date-time">
                        <div class="date">${formattedDate}</div>
                        <div class="time text-muted">${formattedTime}</div>
                    </div>
                </td>
                <td>
                    <div class="transaction-items">
                        ${this.formatTransactionItems(transaction.items)}
                    </div>
                </td>
                <td>
                    ${paymentBadge}
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${transaction.status || 'Unknown'}</span>
                </td>
                <td>
                    <strong>₱${parseFloat(transaction.total || 0).toFixed(2)}</strong>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action view" onclick="transactionHistory.viewTransaction('${transaction.order_number}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-action print" onclick="transactionHistory.printReceipt('${transaction.order_number}')" title="Print Receipt">
                            <i class="fas fa-print"></i>
                        </button>
                        ${transaction.status === 'completed' ? `
                            <button class="btn-action refund" onclick="transactionHistory.showRefundModal('${transaction.order_number}')" title="Process Refund">
                                <i class="fas fa-undo"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }

    formatTransactionItems(items) {
        if (!items || !Array.isArray(items)) {
            return '<span class="text-muted">No items data</span>';
        }
        
        return items.map(item => `
            <div class="item-line">
                ${item.quantity}x ${item.name || item.product_name} 
                <span class="item-price">₱${parseFloat(item.price || 0).toFixed(2)}</span>
            </div>
        `).join('');
    }

    getStatusClass(status) {
        switch(status) {
            case 'completed': return 'status-completed';
            case 'pending': return 'status-pending';
            case 'cancelled': return 'status-cancelled';
            case 'refunded': return 'status-refunded';
            default: return 'status-unknown';
        }
    }

    getPaymentBadge(paymentMethod) {
        const method = paymentMethod || 'unknown';
        const icon = method === 'card' ? 'credit-card' : method === 'cash' ? 'money-bill' : 'question';
        return `<span class="payment-badge payment-${method}">
            <i class="fas fa-${icon}"></i> ${method.toUpperCase()}
        </span>`;
    }    updatePaginationInfo() {
        const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredTransactions.length);
        
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = 
                `Showing ${startItem}-${endItem} of ${this.filteredTransactions.length} transactions`;
        }
        
        // Update the "Page X of Y" display
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
        }
        
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
    }

    viewTransaction(orderNumber) {
        const transaction = this.transactions.find(t => t.order_number === orderNumber);
        
        if (!transaction) {
            this.showNotification('Transaction not found', 'error');
            return;
        }

        this.currentTransaction = transaction;
        this.showTransactionModal();
    }

    showTransactionModal() {
        const modal = document.getElementById('transaction-modal');
        const transaction = this.currentTransaction;
        
        if (!modal || !transaction) return;
        
        const timestamp = new Date(transaction.timestamp || transaction.created_at);
        const formattedDate = timestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderNumberEl = document.getElementById('modal-order-number');
        const timestampEl = document.getElementById('modal-timestamp');
        const statusEl = document.getElementById('modal-status');
        const paymentMethodEl = document.getElementById('modal-payment-method');
        const totalEl = document.getElementById('modal-total');
        const itemsEl = document.getElementById('modal-items');

        if (orderNumberEl) orderNumberEl.textContent = transaction.order_number || 'N/A';
        if (timestampEl) timestampEl.textContent = formattedDate;
        if (statusEl) {
            statusEl.textContent = transaction.status || 'Unknown';
            statusEl.className = `status-badge ${this.getStatusClass(transaction.status)}`;
        }
        if (paymentMethodEl) paymentMethodEl.textContent = transaction.payment_method || 'Unknown';
        if (totalEl) totalEl.textContent = `₱${parseFloat(transaction.total || 0).toFixed(2)}`;

        // Display items
        if (itemsEl) {
            if (transaction.items && Array.isArray(transaction.items)) {                itemsEl.innerHTML = transaction.items.map(item => `
                    <div class="item-row">
                        <span class="item-name">${item.name || item.product_name}</span>
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price">₱${parseFloat(item.price || 0).toFixed(2)}</span>
                    </div>
                `).join('');
            } else {
                itemsEl.innerHTML = '<div class="text-muted">No items data available</div>';
            }        }

        this.showModal(modal);
    }

    showRefundModal(orderNumber = null) {
        const modal = document.getElementById('refund-modal');
        
        if (orderNumber) {
            const orderNumberInput = document.getElementById('refund-order-number');
            if (orderNumberInput) orderNumberInput.value = orderNumber;
        }
          if (modal) {
            this.showModal(modal);
        }
    }    async processRefund() {
        const orderNumber = document.getElementById('refund-order-number')?.value;
        const reason = document.getElementById('refund-reason')?.value;
        const amount = document.getElementById('refund-amount')?.value;
        const notes = document.getElementById('refund-notes')?.value;

        if (!orderNumber || !reason) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Find the transaction
            const transaction = this.transactions.find(t => t.order_number === orderNumber);
            if (!transaction) {
                this.showNotification('Transaction not found', 'error');
                return;
            }

            // Prepare refund data
            const refundData = {
                reason: reason,
                notes: notes || (amount ? `Partial refund: ₱${amount}` : 'Full refund'),
                amount: amount ? parseFloat(amount) : null
            };

            console.log('Processing refund with data:', refundData);

            const result = await supabaseService.refundTransaction(transaction.id, refundData);

            if (result) {                this.showNotification('Refund processed successfully', 'success');
                const refundModal = document.getElementById('refund-modal');
                if (refundModal) this.closeModal(refundModal);
                
                // Clear the form
                document.getElementById('refund-order-number').value = '';
                document.getElementById('refund-reason').selectedIndex = 0;
                document.getElementById('refund-amount').value = '';
                document.getElementById('refund-notes').value = '';
                
                // Refresh the transactions list
                await this.loadTransactions();
            }
        } catch (error) {
            console.error('Error processing refund:', error);
            this.showNotification(`Error processing refund: ${error.message}`, 'error');
        }
    }

    exportToCSV() {
        const headers = ['Order Number', 'Date', 'Items', 'Total', 'Payment Method', 'Status'];
        const csvContent = [
            headers.join(','),
            ...this.filteredTransactions.map(transaction => {
                const date = new Date(transaction.timestamp || transaction.created_at).toLocaleDateString();
                const items = transaction.items ? 
                    transaction.items.map(item => `${item.quantity}x ${item.name || item.product_name}`).join('; ') : 
                    'No items';
                
                return [
                    `"${transaction.order_number || ''}"`,
                    `"${date}"`,
                    `"${items}"`,
                    `"₱${parseFloat(transaction.total || 0).toFixed(2)}"`,
                    `"${transaction.payment_method || ''}"`,
                    `"${transaction.status || ''}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.showNotification('Transactions exported to CSV', 'success');
    }

    exportToPDF() {
        this.showNotification('PDF export feature coming soon!', 'info');
    }

    printReceipt(orderNumber) {
        const transaction = this.transactions.find(t => t.order_number === orderNumber);
        
        if (!transaction) {
            this.showNotification('Transaction not found', 'error');
            return;
        }

        const printWindow = window.open('', '_blank');
        const receiptHTML = this.generateReceiptHTML(transaction);
        
        printWindow.document.write(receiptHTML);
        printWindow.document.close();
        printWindow.print();
    }

    generateReceiptHTML(transaction) {
        const timestamp = new Date(transaction.timestamp || transaction.created_at);
        const formattedDate = timestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - ${transaction.order_number}</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 20px; }
                    .receipt { max-width: 400px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                    .order-info { margin: 15px 0; }
                    .items { margin: 15px 0; }
                    .item { display: flex; justify-content: space-between; margin: 5px 0; }
                    .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
                    .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
                </style>
            </head>
            <body>
                <div class="receipt">
                    <div class="header">
                        <h2>RAMENILA</h2>
                        <p>Thank you for your order!</p>
                    </div>
                    
                    <div class="order-info">
                        <p><strong>Order #:</strong> ${transaction.order_number}</p>
                        <p><strong>Date:</strong> ${formattedDate}</p>
                        <p><strong>Payment:</strong> ${transaction.payment_method || 'N/A'}</p>
                        <p><strong>Status:</strong> ${transaction.status || 'N/A'}</p>
                    </div>
                    
                    <div class="items">
                        <h3>Items:</h3>
                        ${transaction.items && Array.isArray(transaction.items) ? 
                            transaction.items.map(item => `
                                <div class="item">
                                    <span>${item.quantity}x ${item.name || item.product_name}</span>
                                    <span>₱${parseFloat(item.price || 0).toFixed(2)}</span>
                                </div>
                            `).join('') : 
                            '<p>No items data available</p>'
                        }
                    </div>
                    
                    <div class="total">
                        <div class="item">
                            <span>TOTAL:</span>
                            <span>₱${parseFloat(transaction.total || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>Visit us again soon!</p>
                        <p>Generated on ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            background: #333;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        `;
        
        switch(type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'info':
                notification.style.backgroundColor = '#17a2b8';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#212529';
                break;
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Transaction History system when page loads
let transactionHistory;

function initializeTransactionHistory() {
    console.log('🚀 Initializing Transaction History System...');
    try {
        transactionHistory = new TransactionHistory();
        window.transactionHistory = transactionHistory;
        console.log('✅ Transaction History System initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize Transaction History System:', error);
        // Show error message to user
        const tbody = document.getElementById('transactions-tbody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #dc3545;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>System Initialization Error</h3>
                        <p>Failed to initialize Transaction History: ${error.message}</p>
                        <button onclick="location.reload()" style="margin-top: 15px; padding: 10px 20px; background: #873E23; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Reload Page
                        </button>
                    </td>
                </tr>
            `;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeTransactionHistory);

// Also try to initialize after a short delay if DOM ready already fired
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeTransactionHistory);
} else {
    // DOM has already loaded
    setTimeout(initializeTransactionHistory, 100);
}

// Export for global access
export { transactionHistory };
