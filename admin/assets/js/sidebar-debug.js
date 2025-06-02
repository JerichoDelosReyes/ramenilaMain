// Debug version of sidebar.js with enhanced logging
console.log('=== SIDEBAR.JS DEBUG VERSION LOADED ===');

// Toggle sidebar functionality
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');
const mainContent = document.getElementById('mainContent');
const icon = toggleBtn?.querySelector('i');

console.log('Sidebar elements found:', {
    sidebar: !!sidebar,
    toggleBtn: !!toggleBtn,
    mainContent: !!mainContent,
    icon: !!icon
});

// Load saved sidebar state or default to collapsed (closed)
const savedSidebarState = localStorage.getItem('sidebarState') || 'collapsed';
console.log('Loaded sidebar state:', savedSidebarState);

// Apply the saved state
if (savedSidebarState === 'collapsed') {
    sidebar?.classList.add('collapsed');
    mainContent?.classList.add('expanded');
    if (icon) icon.style.transform = 'rotate(180deg)';
} else {
    sidebar?.classList.remove('collapsed');
    mainContent?.classList.remove('expanded');
    if (icon) icon.style.transform = 'rotate(0deg)';
}

toggleBtn?.addEventListener('click', function() {
    sidebar?.classList.toggle('collapsed');
    mainContent?.classList.toggle('expanded');
    
    // Save the current state to localStorage
    const currentState = sidebar?.classList.contains('collapsed') ? 'collapsed' : 'expanded';
    localStorage.setItem('sidebarState', currentState);
    
    // Rotate the toggle button icon
    if (sidebar?.classList.contains('collapsed')) {
        if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
        if (icon) icon.style.transform = 'rotate(0deg)';
    }
});

// Add active state to navigation items
const navLinks = document.querySelectorAll('.nav-link:not(.logout-link)');
console.log('Found nav links:', navLinks.length);

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
    console.log('=== THEME TOGGLE INITIALIZATION ===');
    
    const themeToggle = document.getElementById('themeToggle');
    const themeCheckbox = document.getElementById('themeCheckbox');
    const themeLabel = document.getElementById('themeLabel');
    
    console.log('Theme elements found:', {
        themeToggle: !!themeToggle,
        themeCheckbox: !!themeCheckbox,
        themeLabel: !!themeLabel
    });
    
    if (!themeToggle || !themeCheckbox) {
        console.error('Theme toggle elements not found!');
        console.log('Available elements with id:');
        document.querySelectorAll('[id]').forEach(el => {
            console.log('- ID:', el.id, 'Element:', el.tagName);
        });
        return;
    }
    
    // Load saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    console.log('Loading saved theme:', savedTheme);
    console.log('Current body classes before setTheme:', document.body.classList.toString());
    
    setTheme(savedTheme);
    
    // Add click event listener to the toggle switch
    themeCheckbox.addEventListener('change', function(e) {
        console.log('=== THEME TOGGLE CLICKED ===');
        console.log('Checkbox checked:', e.target.checked);
        console.log('Current body classes:', document.body.classList.toString());
        console.log('Current localStorage theme:', localStorage.getItem('adminTheme'));
        toggleTheme();
    });
    
    function setTheme(theme) {
        console.log('=== SET THEME FUNCTION ===');
        console.log('Setting theme to:', theme);
        console.log('Body classes before clear:', document.body.classList.toString());
        
        // Clear any existing theme classes
        document.body.classList.remove('dark-mode');
        console.log('Body classes after clear:', document.body.classList.toString());
        
        if (theme === 'dark') {
            console.log('Applying dark theme...');
            // Add dark mode class
            document.body.classList.add('dark-mode');
            // Update toggle state
            if (themeCheckbox) {
                themeCheckbox.checked = true;
                console.log('Checkbox set to checked');
            }
            if (themeLabel) {
                themeLabel.textContent = 'Light Mode';
                console.log('Label updated to: Light Mode');
            }
            // Save to localStorage
            localStorage.setItem('adminTheme', 'dark');
            console.log('Saved dark theme to localStorage');
        } else {
            console.log('Applying light theme...');
            // Light mode - no class needed, just update controls
            if (themeCheckbox) {
                themeCheckbox.checked = false;
                console.log('Checkbox set to unchecked');
            }
            if (themeLabel) {
                themeLabel.textContent = 'Dark Mode';
                console.log('Label updated to: Dark Mode');
            }
            // Save to localStorage
            localStorage.setItem('adminTheme', 'light');
            console.log('Saved light theme to localStorage');
        }
        
        console.log('Theme applied. Final state:');
        console.log('- Body classes:', document.body.classList.toString());
        console.log('- Checkbox checked:', themeCheckbox?.checked);
        console.log('- Label text:', themeLabel?.textContent);
        console.log('- LocalStorage theme:', localStorage.getItem('adminTheme'));
        console.log('- CSS primary color:', getComputedStyle(document.body).getPropertyValue('--primary-color'));
        console.log('- Background color:', getComputedStyle(document.body).backgroundColor);
    }
    
    function toggleTheme() {
        console.log('=== TOGGLE THEME FUNCTION ===');
        const currentTheme = localStorage.getItem('adminTheme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('Toggling theme from', currentTheme, 'to', newTheme);
        setTheme(newTheme);
    }
    
    // Emergency reset function - call this from browser console if needed
    window.resetTheme = function() {
        console.log('=== RESET THEME ===');
        localStorage.removeItem('adminTheme');
        document.body.classList.remove('dark-mode');
        if (themeCheckbox) themeCheckbox.checked = false;
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        console.log('Theme reset to light mode');
    };
    
    // Force light mode function
    window.forceLightMode = function() {
        console.log('=== FORCE LIGHT MODE ===');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('adminTheme', 'light');
        if (themeCheckbox) themeCheckbox.checked = false;
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
        console.log('Forced light mode');
    };
    
    // Force dark mode function
    window.forceDarkMode = function() {
        console.log('=== FORCE DARK MODE ===');
        document.body.classList.add('dark-mode');
        localStorage.setItem('adminTheme', 'dark');
        if (themeCheckbox) themeCheckbox.checked = true;
        if (themeLabel) themeLabel.textContent = 'Light Mode';
        console.log('Forced dark mode');
    };
    
    // Debug function to check current state
    window.debugTheme = function() {
        console.log('=== THEME DEBUG INFO ===');
        console.log('Body classes:', document.body.classList.toString());
        console.log('LocalStorage theme:', localStorage.getItem('adminTheme'));
        console.log('Checkbox checked:', themeCheckbox?.checked);
        console.log('Checkbox element:', themeCheckbox);
        console.log('Theme label text:', themeLabel?.textContent);
        console.log('CSS Variables:');
        console.log('- --primary-color:', getComputedStyle(document.body).getPropertyValue('--primary-color'));
        console.log('- --background-color:', getComputedStyle(document.body).getPropertyValue('--background-color'));
        console.log('- --surface-color:', getComputedStyle(document.body).getPropertyValue('--surface-color'));
        console.log('- --text-primary:', getComputedStyle(document.body).getPropertyValue('--text-primary'));
        console.log('=======================');
    };
    
    console.log('Theme toggle initialization complete');
});

console.log('=== SIDEBAR.JS DEBUG VERSION COMPLETE ===');
