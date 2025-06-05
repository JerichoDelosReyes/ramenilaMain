// Toggle sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    // Support both toggleBtn and toggleSidebar IDs
    const toggleBtn = document.getElementById('toggleBtn') || document.getElementById('toggleSidebar');
    const mainContent = document.getElementById('mainContent');

    if (!toggleBtn) {
        console.error('Toggle button not found!');
        return;
    }

    // Function to check if we're on a mobile device
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Set initial state based on screen size
    function setInitialState() {
        const icon = toggleBtn.querySelector('i');
        
        if (isMobile()) {
            // On mobile, sidebar should always be visible but collapsed
            sidebar.classList.add('collapsed'); // Keep it collapsed by default
            sidebar.style.transform = 'translateX(0)'; // Always visible
            mainContent.classList.add('expanded'); // Expand main content
            icon.style.transform = 'rotate(0deg)'; // Set icon rotation
        } else {
            // On desktop, start with collapsed sidebar as before
            sidebar.style.transform = ''; // Reset any transform
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
            icon.style.transform = 'rotate(0deg)';
        }
    }

// Call on page load
setInitialState();

// Track previous width to detect orientation changes
let previousWidth = window.innerWidth;

// Handle resize with debounce for performance
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(function() {
        // Check if crossing the mobile breakpoint
        const wasMobile = previousWidth <= 768;
        const isMobileNow = window.innerWidth <= 768;
        
        if (wasMobile !== isMobileNow) {
            // We've crossed the breakpoint, reset the sidebar state
            setInitialState();
        } else if (isMobileNow) {
            // Still on mobile, but possibly changed orientation
            // Update overlay and make sure things fit properly
            updateOverlay();
        }
        
        previousWidth = window.innerWidth;
    }, 250);
});

toggleBtn.addEventListener('click', function() {
    // Always toggle the collapsed state regardless of mobile or desktop
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Rotate the toggle button icon
    const icon = toggleBtn.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
        icon.style.transform = 'rotate(0deg)';
    } else {
        icon.style.transform = 'rotate(180deg)';
    }
    
    // Always keep sidebar visible, just change its width
    sidebar.style.transform = 'translateX(0)';
    
    // Update overlay if applicable
    if (typeof updateOverlay === 'function') {
        updateOverlay();
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
        
        // If on mobile, close the sidebar after navigation
        if (isMobile() && !sidebar.classList.contains('collapsed')) {
            setTimeout(() => {
                toggleBtn.click();
            }, 150);
        }
    });
});

// Create and add overlay for mobile devices
function createOverlay() {
    // Create overlay div if it doesn't exist
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        // Add click event to collapse sidebar
        overlay.addEventListener('click', function() {
            if (isMobile() && !sidebar.classList.contains('collapsed')) {
                toggleBtn.click();
            }
        });
    }
}

// Update overlay visibility - we're keeping the sidebar always visible
// so we only need the overlay for when the sidebar is fully expanded on mobile
function updateOverlay() {
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        if (isMobile() && !sidebar.classList.contains('collapsed')) {
            // Only show overlay when sidebar is expanded on mobile
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    }
}

// Create overlay
createOverlay();

// Update overlay when sidebar is toggled
toggleBtn.addEventListener('click', updateOverlay);

// Update overlay on resize
window.addEventListener('resize', updateOverlay);

// Set active menu item based on current page
const currentPath = window.location.pathname;
const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);

document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === pageName || (pageName === '' && href === 'dashboard.html') || 
        (pageName === 'index.html' && href === 'dashboard.html')) {
        link.parentElement.classList.add('active');
    }
});

}); // Close the DOMContentLoaded event handler