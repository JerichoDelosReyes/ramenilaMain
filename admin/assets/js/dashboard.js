// Dashboard functionality
import supabaseService from './supabase-service.js';

document.addEventListener('DOMContentLoaded', function() {
    // Update current date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load and display dashboard data
    loadDashboardData();
    
    // Animate stats cards on load
    animateStatsCards();
});

async function loadDashboardData() {
    try {
        // Load products and transactions data
        const [products, transactions] = await Promise.all([
            supabaseService.getProducts(),
            supabaseService.getTransactions()
        ]);
        
        // Calculate today's stats
        const today = new Date().toDateString();
        const todayTransactions = transactions.filter(t => 
            new Date(t.created_at).toDateString() === today && t.status === 'completed'
        );
        
        const todaySales = todayTransactions.reduce((sum, t) => sum + parseFloat(t.total), 0);
        const ordersToday = todayTransactions.length;
        const totalProducts = products.length;
        const lowStockItems = products.filter(p => p.stock <= p.min_stock).length;
        
        // Update dashboard stats
        updateDashboardStats({
            todaySales: `₱${todaySales.toLocaleString()}`,
            ordersToday: ordersToday.toString(),
            totalProducts: totalProducts.toString(),
            lowStockItems: lowStockItems.toString()
        });
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Show default values on error
        updateDashboardStats({
            todaySales: '₱0',
            ordersToday: '0',
            totalProducts: '0',
            lowStockItems: '0'
        });
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
        second: '2-digit'
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
        todaySales: document.querySelector('.stat-card:nth-child(1) .stat-number'),
        ordersToday: document.querySelector('.stat-card:nth-child(2) .stat-number'),
        totalProducts: document.querySelector('.stat-card:nth-child(3) .stat-number'),
        lowStockItems: document.querySelector('.stat-card:nth-child(4) .stat-number')
    };
    
    Object.keys(stats).forEach(key => {
        if (statElements[key]) {
            statElements[key].textContent = stats[key];
        }
    });
}
    
    // Update the stats cards with new data
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = stats.todaySales;
        statCards[1].querySelector('h3').textContent = stats.ordersToday;
        statCards[2].querySelector('h3').textContent = stats.totalProducts;
        statCards[3].querySelector('h3').textContent = stats.lowStockItems;
    }
}
