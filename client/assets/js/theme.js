// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme.js loaded successfully');
    
    // Simple theme switching without debounce
    let isThemeSwitching = false;
    
    // Get theme toggle buttons
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    console.log('Theme toggle buttons found:', {
        desktop: !!themeToggle,
        mobile: !!mobileThemeToggle
    });
      // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('Saved theme preference:', savedTheme);
    
    // Apply the saved theme on page load
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateToggleIcons('dark');
    } else {
        // Ensure light theme is properly applied
        document.body.classList.remove('dark-mode');
        updateToggleIcons('light');
        // Set light theme in localStorage if no preference exists
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Function to update toggle button icons
    function updateToggleIcons(theme) {
        const desktopIcon = themeToggle?.querySelector('i');
        const mobileIcon = mobileThemeToggle?.querySelector('i');
        
        if (theme === 'dark') {
            // Dark mode active - show sun icon
            if (desktopIcon) {
                desktopIcon.classList.remove('fa-moon');
                desktopIcon.classList.add('fa-sun');
            }
            if (mobileIcon) {
                mobileIcon.classList.remove('fa-moon');
                mobileIcon.classList.add('fa-sun');
            }
        } else {
            // Light mode active - show moon icon
            if (desktopIcon) {
                desktopIcon.classList.remove('fa-sun');
                desktopIcon.classList.add('fa-moon');
            }
            if (mobileIcon) {
                mobileIcon.classList.remove('fa-sun');
                mobileIcon.classList.add('fa-moon');
            }
        }
    }    // Simple function to toggle theme
    function toggleTheme() {
        // Prevent rapid theme switching
        if (isThemeSwitching) {
            console.log('Theme switch already in progress, ignoring...');
            return;
        }
        
        isThemeSwitching = true;
        console.log('Toggle theme called');
        const isDarkMode = document.body.classList.contains('dark-mode');
        console.log('Current mode before toggle:', isDarkMode ? 'dark' : 'light');
        
        if (isDarkMode) {
            // Switch to light mode
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            console.log('Switched to light mode');
            updateToggleIcons('light');
        } else {
            // Switch to dark mode
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            console.log('Switched to dark mode');
            updateToggleIcons('dark');
        }
        
        // Reset switching flag quickly
        setTimeout(() => {
            isThemeSwitching = false;
        }, 100);
        
        // Update button titles
        updateButtonTitles();
    }    
    // Add event listeners to theme toggle buttons
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Desktop theme toggle event listener added');
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
        console.log('Mobile theme toggle event listener added');
    }
    
    // Update button titles based on current theme
    function updateButtonTitles() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const title = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        if (themeToggle) {
            themeToggle.title = title;
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.title = title;
        }
    }
    
    // Initial title update
    updateButtonTitles();
    
    // Update titles when theme changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateButtonTitles();
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
});