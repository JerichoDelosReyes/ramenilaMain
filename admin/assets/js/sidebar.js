// Toggle sidebar functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const mainContent = document.getElementById('mainContent');
const icon = toggleBtn.querySelector('i');

// Load saved sidebar state or default to collapsed (closed)
const savedSidebarState = localStorage.getItem('sidebarState') || 'collapsed';

// Apply the saved state
if (savedSidebarState === 'collapsed') {
    sidebar.classList.add('collapsed');
    mainContent.classList.add('expanded');
    icon.style.transform = 'rotate(180deg)';
} else {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
    icon.style.transform = 'rotate(0deg)';
}

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Save the current state to localStorage
    const currentState = sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
    localStorage.setItem('sidebarState', currentState);
    
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

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found!');
        return;
    }
    
    // Load saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    console.log('Loading saved theme:', savedTheme);
    setTheme(savedTheme);
    
    // Add click event listener
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Theme toggle clicked!');
        toggleTheme();
    });
    
    function setTheme(theme) {
        console.log('Setting theme to:', theme);
        
        // Force remove dark-mode class first
        document.body.classList.remove('dark-mode');
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            if (themeText) themeText.textContent = 'Light Mode';
            localStorage.setItem('adminTheme', 'dark');
        } else {
            // Ensure we're in light mode
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            if (themeText) themeText.textContent = 'Dark Mode';
            localStorage.setItem('adminTheme', 'light');
        }
        
        console.log('Theme set. Body classes:', document.body.classList.toString());
        console.log('LocalStorage theme:', localStorage.getItem('adminTheme'));
    }
    
    function toggleTheme() {
        const currentTheme = localStorage.getItem('adminTheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('Toggling from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    }
    
    // Emergency reset function - you can call this from browser console
    window.resetTheme = function() {
        localStorage.removeItem('adminTheme');
        setTheme('light');
        console.log('Theme reset to light mode');
    };
});