// Simplified theme debug script
console.log('=== THEME DEBUG SCRIPT LOADED ===');

// Check if elements exist
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const themeToggle = document.getElementById('themeToggle');
    const themeCheckbox = document.getElementById('themeCheckbox');
    const themeLabel = document.getElementById('themeLabel');
    
    console.log('Theme elements found:');
    console.log('- themeToggle:', !!themeToggle);
    console.log('- themeCheckbox:', !!themeCheckbox);
    console.log('- themeLabel:', !!themeLabel);
    
    if (themeCheckbox) {
        console.log('Adding event listener to checkbox');
        themeCheckbox.addEventListener('change', function(e) {
            console.log('Checkbox changed! Checked:', e.target.checked);
            console.log('Current localStorage theme:', localStorage.getItem('adminTheme'));
            
            // Simple toggle
            if (e.target.checked) {
                console.log('Applying dark mode...');
                document.body.classList.add('dark-mode');
                localStorage.setItem('adminTheme', 'dark');
                if (themeLabel) themeLabel.textContent = 'Light Mode';
            } else {
                console.log('Applying light mode...');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('adminTheme', 'light');
                if (themeLabel) themeLabel.textContent = 'Dark Mode';
            }
            
            console.log('After toggle - Body classes:', document.body.classList.toString());
            console.log('After toggle - localStorage:', localStorage.getItem('adminTheme'));
        });
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('adminTheme') || 'light';
    console.log('Loading saved theme:', savedTheme);
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeCheckbox) themeCheckbox.checked = true;
        if (themeLabel) themeLabel.textContent = 'Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        if (themeCheckbox) themeCheckbox.checked = false;
        if (themeLabel) themeLabel.textContent = 'Dark Mode';
    }
    
    console.log('Initial setup complete');
    console.log('Body classes:', document.body.classList.toString());
    console.log('Checkbox checked:', themeCheckbox?.checked);
});

// Add global debug functions
window.debugThemeSimple = function() {
    console.log('=== SIMPLE THEME DEBUG ===');
    console.log('Body classes:', document.body.classList.toString());
    console.log('localStorage theme:', localStorage.getItem('adminTheme'));
    console.log('Checkbox element:', document.getElementById('themeCheckbox'));
    console.log('Checkbox checked:', document.getElementById('themeCheckbox')?.checked);
    console.log('Theme label:', document.getElementById('themeLabel')?.textContent);
    console.log('CSS primary color:', getComputedStyle(document.body).getPropertyValue('--primary-color'));
    console.log('Body background:', getComputedStyle(document.body).backgroundColor);
};
