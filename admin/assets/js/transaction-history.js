// Transaction History Management System
class TransactionHistory {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentTransaction = null;
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadTransactions();
        this.setupEventListeners();
        this.updateSummaryCards();
        this.displayTransactions();
    }

    loadTransactions() {
        // Load transactions from localStorage
        const savedTransactions = localStorage.getItem('transactions');
        if (savedTransactions) {
            this.transactions = JSON.parse(savedTransactions);
        } else {
            // Generate sample data if no transactions exist
            this.generateSampleData();
        }
        this.filteredTransactions = [...this.transactions];
    }

    generateSampleData() {
        const sampleTransactions = [
            {
                orderNumber: 'RM123456',
                timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                items: [
                    { name: 'Tonkotsu Ramen', quantity: 2, price: 12.99 },
                    { name: 'Gyoza (6 pcs)', quantity: 1, price: 6.99 }
                ],
                total: 32.97,
                paymentMethod: 'card',
                status: 'completed'
            },
            {
                orderNumber: 'RM123457',
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                items: [
                    { name: 'Shoyu Ramen', quantity: 1, price: 11.99 },
                    { name: 'Green Tea', quantity: 2, price: 2.99 }
                ],
                total: 17.97,
                paymentMethod: 'cash',
                status: 'completed'
            },
            {
                orderNumber: 'RM123458',
                timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                items: [
                    { name: 'Miso Ramen', quantity: 1, price: 12.49 }
                ],
                total: 12.49,
                paymentMethod: 'card',
                status: 'refunded'
            },
            {
                orderNumber: 'RM123459',
                timestamp: new Date().toISOString(), // Today
                items: [
                    { name: 'Tsukemen', quantity: 1, price: 13.99 },
                    { name: 'Karaage', quantity: 1, price: 7.99 },
                    { name: 'Beer', quantity: 1, price: 4.99 }
                ],
                total: 26.97,
                paymentMethod: 'cash',
                status: 'completed'
            },
            {
                orderNumber: 'RM123460',
                timestamp: new Date().toISOString(), // Today
                items: [
                    { name: 'Tantanmen', quantity: 2, price: 13.49 }
                ],
                total: 26.98,
                paymentMethod: 'card',
                status: 'cancelled'
            }
        ];

        this.transactions = sampleTransactions;
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('search-transactions').addEventListener('input', (e) => {
            this.searchTransactions(e.target.value);
        });

        // Filter buttons
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });        document.getElementById('clear-filters').addEventListener('click', () => {
            this.clearFilters();
        });

        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.displayTransactions();
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.displayTransactions();
            }
        });

        // Modal close handlers
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Refund functionality
        document.getElementById('refund-transaction').addEventListener('click', () => {
            this.showRefundModal();
        });

        document.getElementById('confirm-refund').addEventListener('click', () => {
            this.processRefund();
        });

        // Print receipt from modal
        document.getElementById('print-receipt-modal').addEventListener('click', () => {
            this.printReceipt();
        });
    }

    searchTransactions(query) {
        if (!query.trim()) {
            this.filteredTransactions = [...this.transactions];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredTransactions = this.transactions.filter(transaction => {
                return transaction.orderNumber.toLowerCase().includes(searchTerm) ||
                       transaction.items.some(item => item.name.toLowerCase().includes(searchTerm)) ||
                       transaction.paymentMethod.toLowerCase().includes(searchTerm) ||
                       transaction.status.toLowerCase().includes(searchTerm);
            });
        }
        this.currentPage = 1;
        this.displayTransactions();
        this.updateSummaryCards();
    }

    applyFilters() {
        const statusFilter = document.getElementById('status-filter').value;
        const paymentFilter = document.getElementById('payment-filter').value;
        const dateFrom = document.getElementById('date-from').value;
        const dateTo = document.getElementById('date-to').value;

        this.filteredTransactions = this.transactions.filter(transaction => {
            let matchesStatus = !statusFilter || transaction.status === statusFilter;
            let matchesPayment = !paymentFilter || transaction.paymentMethod === paymentFilter;
            
            let matchesDate = true;
            const transactionDate = new Date(transaction.timestamp).toISOString().split('T')[0];
            
            if (dateFrom && transactionDate < dateFrom) {
                matchesDate = false;
            }
            if (dateTo && transactionDate > dateTo) {
                matchesDate = false;
            }

            return matchesStatus && matchesPayment && matchesDate;
        });

        this.currentPage = 1;
        this.displayTransactions();
        this.updateSummaryCards();
    }

    clearFilters() {
        document.getElementById('status-filter').value = '';
        document.getElementById('payment-filter').value = '';
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        document.getElementById('search-transactions').value = '';
        
        this.filteredTransactions = [...this.transactions];
        this.currentPage = 1;
        this.displayTransactions();
        this.updateSummaryCards();
    }

    updateSummaryCards() {
        const transactions = this.filteredTransactions;
        const totalTransactions = transactions.length;
        const totalRevenue = transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + t.total, 0);
        
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = transactions.filter(t => 
            new Date(t.timestamp).toISOString().split('T')[0] === today
        ).length;
        
        const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

        document.getElementById('total-transactions').textContent = totalTransactions;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('today-transactions').textContent = todayTransactions;
        document.getElementById('avg-order-value').textContent = `$${avgOrderValue.toFixed(2)}`;
    }

    displayTransactions() {
        const tbody = document.getElementById('transactions-tbody');
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageTransactions = this.filteredTransactions.slice(startIndex, endIndex);

        tbody.innerHTML = '';

        if (pageTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #666;">
                        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 15px; display: block;"></i>
                        No transactions found
                    </td>
                </tr>
            `;
        } else {
            pageTransactions.forEach(transaction => {
                const row = this.createTransactionRow(transaction);
                tbody.appendChild(row);
            });
        }

        this.updatePaginationInfo();
    }

    createTransactionRow(transaction) {
        const row = document.createElement('tr');
        
        const formatDate = (timestamp) => {
            return new Date(timestamp).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        const getStatusBadge = (status) => {
            return `<span class="status-badge status-${status}">${status}</span>`;
        };

        const getPaymentBadge = (method) => {
            return `<span class="payment-badge payment-${method}">${method}</span>`;
        };

        const itemsText = transaction.items.length === 1 
            ? transaction.items[0].name 
            : `${transaction.items[0].name} +${transaction.items.length - 1} more`;

        row.innerHTML = `
            <td><strong>${transaction.orderNumber}</strong></td>
            <td>${formatDate(transaction.timestamp)}</td>
            <td>${itemsText}</td>
            <td>${getPaymentBadge(transaction.paymentMethod)}</td>
            <td>${getStatusBadge(transaction.status)}</td>
            <td><strong>$${transaction.total.toFixed(2)}</strong></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view-btn" onclick="transactionHistory.viewTransaction('${transaction.orderNumber}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${transaction.status === 'completed' ? `
                        <button class="action-btn refund-btn" onclick="transactionHistory.showRefundModal('${transaction.orderNumber}')">
                            <i class="fas fa-undo"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;

        return row;
    }

    updatePaginationInfo() {
        const totalItems = this.filteredTransactions.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItems);

        document.getElementById('showing-info').textContent = 
            `Showing ${startItem}-${endItem} of ${totalItems} transactions`;
        
        document.getElementById('page-info').textContent = 
            `Page ${this.currentPage} of ${totalPages}`;

        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    viewTransaction(orderNumber) {
        const transaction = this.transactions.find(t => t.orderNumber === orderNumber);
        if (!transaction) return;

        this.currentTransaction = transaction;
        const modal = document.getElementById('transaction-modal');
        const detailsContainer = document.getElementById('transaction-details');

        let itemsHtml = '';
        transaction.items.forEach(item => {
            itemsHtml += `
                <div class="item-row">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-details">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
                    </div>
                    <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });

        detailsContainer.innerHTML = `
            <div class="transaction-detail">
                <h3>Order Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Order Number:</span>
                    <span class="detail-value">${transaction.orderNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date & Time:</span>
                    <span class="detail-value">${new Date(transaction.timestamp).toLocaleString()}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge status-${transaction.status}">${transaction.status}</span>
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">
                        <span class="payment-badge payment-${transaction.paymentMethod}">${transaction.paymentMethod}</span>
                    </span>
                </div>
            </div>
            
            <div class="transaction-detail">
                <h3>Order Items</h3>
                <div class="items-list">
                    ${itemsHtml}
                    <div class="item-row" style="border-top: 2px solid #873E23; margin-top: 15px; padding-top: 15px;">
                        <div class="item-info">
                            <div class="item-name" style="font-size: 1.1rem;"><strong>Total Amount</strong></div>
                        </div>
                        <div class="item-total" style="font-size: 1.2rem; color: #873E23;">
                            <strong>$${transaction.total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    showRefundModal(orderNumber = null) {
        if (orderNumber) {
            this.currentTransaction = this.transactions.find(t => t.orderNumber === orderNumber);
        }
        
        if (!this.currentTransaction || this.currentTransaction.status !== 'completed') {
            this.showNotification('Cannot process refund for this transaction', 'error');
            return;
        }

        document.getElementById('refund-amount').textContent = `$${this.currentTransaction.total.toFixed(2)}`;
        document.getElementById('transaction-modal').style.display = 'none';
        document.getElementById('refund-modal').style.display = 'block';
    }

    processRefund() {
        if (!this.currentTransaction) return;

        const reason = document.getElementById('refund-reason').value;
        const notes = document.getElementById('refund-notes').value;

        // Update transaction status
        this.currentTransaction.status = 'refunded';
        this.currentTransaction.refundReason = reason;
        this.currentTransaction.refundNotes = notes;
        this.currentTransaction.refundDate = new Date().toISOString();

        // Save to localStorage
        localStorage.setItem('transactions', JSON.stringify(this.transactions));

        // Update display
        this.displayTransactions();
        this.updateSummaryCards();

        // Close modal and show notification
        document.getElementById('refund-modal').style.display = 'none';
        this.showNotification('Refund processed successfully', 'success');

        // Reset form
        document.getElementById('refund-reason').value = 'customer-request';
        document.getElementById('refund-notes').value = '';
    }

    exportToCSV() {
        const headers = ['Order Number', 'Date', 'Items', 'Payment Method', 'Status', 'Total'];
        const csvContent = [
            headers.join(','),
            ...this.filteredTransactions.map(transaction => [
                transaction.orderNumber,
                new Date(transaction.timestamp).toLocaleString(),
                transaction.items.map(item => `${item.name} x${item.quantity}`).join('; '),
                transaction.paymentMethod,
                transaction.status,
                transaction.total.toFixed(2)
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showNotification('Transaction data exported successfully', 'success');
    }

    printReport() {
        window.print();
    }

    printReceipt() {
        if (!this.currentTransaction) return;

        const printWindow = window.open('', '_blank');
        const transaction = this.currentTransaction;

        let itemsHtml = '';
        transaction.items.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${item.name}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">$${item.price.toFixed(2)}</td>
                    <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
            `;
        });

        printWindow.document.write(`
            <html>
                <head>
                    <title>Receipt - ${transaction.orderNumber}</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .header h1 { margin: 0; font-size: 24px; }
                        .order-info { margin-bottom: 20px; }
                        .order-info div { margin: 5px 0; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { padding: 8px; border-bottom: 1px solid #ddd; }
                        th { text-align: left; font-weight: bold; }
                        .total { font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right; }
                        .footer { text-align: center; margin-top: 30px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Ramenila</h1>
                        <p>Receipt</p>
                    </div>
                    
                    <div class="order-info">
                        <div><strong>Order #:</strong> ${transaction.orderNumber}</div>
                        <div><strong>Date:</strong> ${new Date(transaction.timestamp).toLocaleString()}</div>
                        <div><strong>Payment:</strong> ${transaction.paymentMethod.toUpperCase()}</div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <div class="total">
                        Total: $${transaction.total.toFixed(2)}
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your visit!</p>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    }    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
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
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(-100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize Transaction History system when page loads
let transactionHistory;
document.addEventListener('DOMContentLoaded', () => {
    transactionHistory = new TransactionHistory();
});

// Export for global access
window.transactionHistory = transactionHistory;
