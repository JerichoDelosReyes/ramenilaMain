// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update current date and time
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Animate stats cards on load
    animateStatsCards();
});

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

// Simulated data updates (you can replace with real API calls)
function updateDashboardStats() {
    // This function can be called to update stats with real data
    const stats = {
        todaySales: '₱12,450',
        ordersToday: '47',
        totalProducts: '23',
        lowStockItems: '5'
    };
    
    // Update the stats cards with new data
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('h3').textContent = stats.todaySales;
        statCards[1].querySelector('h3').textContent = stats.ordersToday;
        statCards[2].querySelector('h3').textContent = stats.totalProducts;
        statCards[3].querySelector('h3').textContent = stats.lowStockItems;
    }
}
