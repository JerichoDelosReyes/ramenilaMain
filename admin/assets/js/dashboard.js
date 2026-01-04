// Dashboard functionality
import supabaseService from './firebase-service.js';

// Skeleton loading functions
function showDashboardSkeleton() {
    // Show skeleton for stats cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const content = card.querySelector('.stat-content');
        if (content) {
            content.innerHTML = `
                <div class="skeleton skeleton-stat-value"></div>
                <div class="skeleton skeleton-stat-label"></div>
            `;
        }
    });
    
    // Show skeleton for recent orders table
    const ordersTable = document.getElementById('recentOrdersTable');
    if (ordersTable) {
        const tbody = ordersTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                tbody.innerHTML += `
                    <tr class="skeleton-row">
                        <td><div class="skeleton skeleton-text" style="width: 80px;"></div></td>
                        <td><div class="skeleton skeleton-text" style="width: 120px;"></div></td>
                        <td><div class="skeleton skeleton-text" style="width: 60px;"></div></td>
                        <td><div class="skeleton skeleton-text" style="width: 70px;"></div></td>
                    </tr>
                `;
            }
        }
    }
    
    // Show skeleton for low stock alerts
    const alertsList = document.querySelector('.alerts-list');
    if (alertsList) {
        alertsList.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            alertsList.innerHTML += `
                <div class="alert-item skeleton-alert">
                    <div class="skeleton skeleton-text" style="width: 100px;"></div>
                    <div class="skeleton skeleton-text" style="width: 60px;"></div>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Dashboard initializing...');
    
    // Show skeleton loading initially
    showDashboardSkeleton();
    
    // Update current date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load and display dashboard data
    loadDashboardData();
    
    // Animate stats cards on load
    animateStatsCards();
    
    // Set up auto-refresh every 5 minutes
    setInterval(() => {
        console.log('🔄 Auto-refreshing dashboard data...');
        loadDashboardData();
    }, 5 * 60 * 1000);
});

async function loadDashboardData() {
    try {
        console.log('📊 Loading dashboard data...');
        
        // Load products and transactions data
        const [products, transactions] = await Promise.all([
            supabaseService.getProducts(),
            supabaseService.getTransactions()
        ]);
        
        console.log(`✅ Loaded ${products.length} products and ${transactions.length} transactions`);
        
        // Calculate today's stats
        const today = new Date().toDateString();
        const todayTransactions = transactions.filter(t => 
            new Date(t.created_at).toDateString() === today && t.status === 'completed'
        );
        
        const todaySales = todayTransactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0);
        const ordersToday = todayTransactions.length;
        const totalProducts = products.length;
        const lowStockProducts = products.filter(p => p.stock <= p.min_stock);
        const lowStockItems = lowStockProducts.length;
        
        // Update dashboard stats
        updateDashboardStats({
            todaySales: `₱${todaySales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            ordersToday: ordersToday.toString(),
            totalProducts: totalProducts.toString(),
            lowStockItems: lowStockItems.toString()
        });
        
        // Update recent orders (last 5 transactions)
        const recentTransactions = transactions
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
        updateRecentOrders(recentTransactions);
        
        // Update low stock alerts
        updateLowStockAlerts(lowStockProducts.slice(0, 5)); // Show top 5 low stock items
        
        console.log('📊 Dashboard data updated successfully');
        
        // Show success notification
        showNotification('Dashboard data updated successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        
        // Show error notification
        showNotification('Error loading dashboard data. Using default values.', 'error');
        
        // Show default values on error
        updateDashboardStats({
            todaySales: '₱0.00',
            ordersToday: '0',
            totalProducts: '0',
            lowStockItems: '0'
        });
        
        // Show error states for dynamic content
        showErrorState();
    }
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function animateStatsCards() {
    const statsCards = document.querySelectorAll('.stat-card');
    statsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Update dashboard stats with real data
function updateDashboardStats(stats) {
    const statElements = {
        todaySales: document.querySelector('.stat-card:nth-child(1) .stat-content h3'),
        ordersToday: document.querySelector('.stat-card:nth-child(2) .stat-content h3'),
        totalProducts: document.querySelector('.stat-card:nth-child(3) .stat-content h3'),
        lowStockItems: document.querySelector('.stat-card:nth-child(4) .stat-content h3')
    };
    
    Object.keys(stats).forEach(key => {
        if (statElements[key]) {
            statElements[key].textContent = stats[key];
        }
    });
}

// Update recent orders table with real data
function updateRecentOrders(transactions) {
    const tbody = document.querySelector('.orders-table tbody');
    if (!tbody) return;
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #666; padding: 20px;">
                    <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                    <div>No recent orders found</div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = transactions.map(transaction => {
        const timestamp = new Date(transaction.created_at);
        const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Parse items
        let itemsDisplay = 'No items';
        try {
            const items = typeof transaction.items === 'string' ? JSON.parse(transaction.items) : transaction.items;
            if (Array.isArray(items) && items.length > 0) {
                itemsDisplay = items.length === 1 
                    ? `${items[0].name} x${items[0].quantity}`
                    : `${items[0].name} +${items.length - 1} more`;
            }
        } catch (e) {
            console.warn('Error parsing transaction items:', e);
        }
        
        const statusClass = getStatusClass(transaction.status);
        const statusText = transaction.status ? 
            transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 
            'Unknown';
        
        return `
            <tr>
                <td><strong>${transaction.transaction_number || 'N/A'}</strong></td>
                <td>${transaction.customer_name || 'Walk-in Customer'}</td>
                <td>${itemsDisplay}</td>
                <td><strong>₱${parseFloat(transaction.total || 0).toFixed(2)}</strong></td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>${timeString}</td>
            </tr>
        `;
    }).join('');
}

// Update low stock alerts with real data
function updateLowStockAlerts(lowStockProducts) {
    const container = document.querySelector('.low-stock-items');
    if (!container) return;
    
    if (lowStockProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #28a745; padding: 20px;">
                <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>All products are adequately stocked!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = lowStockProducts.map(product => {
        const stockLevel = getStockLevel(product.stock, product.min_stock);
        const stockLevelClass = getStockLevelClass(product.stock, product.min_stock);
        
        return `
            <div class="stock-item">
                <div class="item-info">
                    <h4>${product.name}</h4>
                    <p>Only ${product.stock} ${product.unit || 'items'} left (Min: ${product.min_stock})</p>
                </div>
                <div class="stock-level ${stockLevelClass}">${stockLevel}</div>
            </div>
        `;
    }).join('');
}

// Helper function to determine stock level
function getStockLevel(currentStock, minStock) {
    if (currentStock === 0) return 'Out of Stock';
    if (currentStock <= minStock * 0.5) return 'Critical';
    if (currentStock <= minStock) return 'Low';
    return 'Normal';
}

// Helper function to get stock level CSS class
function getStockLevelClass(currentStock, minStock) {
    if (currentStock === 0) return 'outofstock';
    if (currentStock <= minStock * 0.5) return 'critical';
    if (currentStock <= minStock) return 'low';
    return 'normal';
}

// Helper function to get status class for styling
function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'completed': return 'completed';
        case 'pending': return 'pending';
        case 'preparing': return 'pending';
        case 'cancelled': return 'cancelled';
        case 'refunded': return 'refunded';
        default: return 'pending';
    }
}

// Show loading state when data loading fails
function showErrorState() {
    const recentOrdersTable = document.querySelector('.orders-table tbody');
    const lowStockContainer = document.querySelector('.low-stock-items');
    
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #dc3545; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <div>Error loading recent orders</div>
                </td>
            </tr>
        `;
    }
    
    if (lowStockContainer) {
        lowStockContainer.innerHTML = `
            <div style="text-align: center; color: #dc3545; padding: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Error loading stock information</div>
            </div>
        `;
    }
}

// Show loading state while data is being fetched
function showLoadingState() {
    const recentOrdersTable = document.querySelector('.orders-table tbody');
    const lowStockContainer = document.querySelector('.low-stock-items');
    
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: #666; padding: 20px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <div>Loading recent orders...</div>
                </td>
            </tr>
        `;
    }
    
    if (lowStockContainer) {
        lowStockContainer.innerHTML = `
            <div style="text-align: center; color: #666; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 10px;"></i>
                <div>Loading stock information...</div>
            </div>
        `;
    }
}

// Show notification messages
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
