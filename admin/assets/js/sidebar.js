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
    icon.style.transform = 'rotate(0deg)';
} else {
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
    icon.style.transform = 'rotate(180deg)';
}

toggleBtn.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');    // Save the current state to localStorage
    const currentState = sidebar.classList.contains('collapsed') ? 'collapsed' : 'expanded';
    localStorage.setItem('sidebarState', currentState);
      // Rotate the toggle button icon
    if (sidebar.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = 'rotate(180deg)';
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
    const themeCheckbox = document.getElementById('themeCheckbox');
    const themeLabel = document.getElementById('themeLabel');
    
    if (!themeToggle || !themeCheckbox) {
        console.error('Theme toggle elements not found!');
        return;
    }
      // Load saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    console.log('Loading saved theme:', savedTheme);
    
    // Flag to prevent event loops during programmatic updates
    let isUpdatingTheme = false;
      // Set initial theme
    console.log('Initial setup - savedTheme:', savedTheme);
    setTheme(savedTheme);
    
    // Add multiple event listeners for better compatibility
    // Listen to the toggle container click
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isUpdatingTheme) {
                console.log('Ignoring toggle click - update in progress');
                return;
            }
            console.log('Theme toggle container clicked!');
            toggleTheme();
        });
    }
    
    // Listen to the checkbox directly
    if (themeCheckbox) {
        themeCheckbox.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent bubbling to container
            if (isUpdatingTheme) {
                console.log('Ignoring checkbox click - update in progress');
                return;
            }
            console.log('Checkbox clicked directly!');
            toggleTheme();
        });
    }
    
    // Listen to the slider (visual toggle)
    const slider = themeToggle?.querySelector('.slider');
    if (slider) {
        slider.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isUpdatingTheme) {
                console.log('Ignoring slider click - update in progress');
                return;
            }
            console.log('Slider clicked!');
            toggleTheme();
        });
    }
      function setTheme(theme) {
        console.log('Setting theme to:', theme);
        isUpdatingTheme = true; // Prevent event loops
        
        // Clear any existing theme classes
        document.body.classList.remove('dark-mode');
          if (theme === 'dark') {
            // Add dark mode class
            document.body.classList.add('dark-mode');
            // Update toggle state
            if (themeCheckbox) themeCheckbox.checked = true;
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
            // Save to localStorage
            localStorage.setItem('adminTheme', 'dark');
        } else {
            // Light mode - no class needed, just update controls
            if (themeCheckbox) themeCheckbox.checked = false;
            if (themeLabel) themeLabel.textContent = 'Light Mode';
            // Save to localStorage
            localStorage.setItem('adminTheme', 'light');
        }
        
        console.log('Theme applied. Body classes:', document.body.classList.toString());
        console.log('Checkbox checked:', themeCheckbox?.checked);
        console.log('LocalStorage theme:', localStorage.getItem('adminTheme'));
        
        // Reset the flag after a short delay to allow for the update to complete
        setTimeout(() => {
            isUpdatingTheme = false;
        }, 100);
    }
    
    function toggleTheme() {
        const currentTheme = localStorage.getItem('adminTheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    }      // Emergency reset function - call this from browser console if needed
    window.resetTheme = function() {
        localStorage.removeItem('adminTheme');
        setTheme('light');
        console.log('Theme reset to light mode');
    };
    
    // Force light mode function
    window.forceLightMode = function() {
        setTheme('light');
        console.log('Forced light mode');
    };
    
    // Force dark mode function
    window.forceDarkMode = function() {
        setTheme('dark');
        console.log('Forced dark mode');
    };
    
    // Debug function to check current state
    window.debugTheme = function() {
        console.log('=== Theme Debug Info ===');
        console.log('Body classes:', document.body.classList.toString());
        console.log('LocalStorage theme:', localStorage.getItem('adminTheme'));
        console.log('Checkbox checked:', themeCheckbox?.checked);
        console.log('Checkbox element:', themeCheckbox);
        console.log('Theme label text:', themeLabel?.textContent);
        console.log('=======================');
    };
});