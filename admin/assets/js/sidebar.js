// Toggle sidebar functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const mainContent = document.getElementById('mainContent');

// Set initial icon state (sidebar starts collapsed)
const icon = toggleBtn.querySelector('i');
icon.style.transform = 'rotate(180deg)';

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Rotate the toggle button icon
    if (sidebar.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
});

// Add active state to navigation items
const navLinks = document.querySelectorAll('.nav-link:not(.logout-link)');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Don't prevent default - allow navigation to occur
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.parentElement.classList.add('active');
        
        // Allow the browser to navigate to the href
    });
});