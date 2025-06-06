/* filepath: c:\VSC Projects\Ramenila\client\assets\js\landing.js */
/* eslint-disable no-unused-vars */
// Modern Ramenila Landing Page JavaScript

// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const orderButtons = document.querySelectorAll('.order-btn, .kiosk-btn, .delivery-btn');

// Login Modal Elements
const loginModal = document.getElementById('loginModal');
const accountBtn = document.getElementById('accountBtn');
const mobileAccountBtn = document.getElementById('mobileAccountBtn');
const closeModal = document.getElementById('closeModal');
const loginForm = document.getElementById('loginForm');

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveNavLink(link);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Change navbar appearance on scroll
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(139, 69, 19, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 30px rgba(139, 69, 19, 0.1)';
        }
        
        // Update active section based on scroll position
        updateActiveSection();
        
        lastScrollY = currentScrollY;
    });
}

// Update active section based on scroll position
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // Offset for navbar
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    console.log('Initializing mobile menu...');
    console.log('mobileMenuToggle:', mobileMenuToggle);
    console.log('navMenu:', navMenu);
    
    // Clear any existing listeners to prevent duplication
    const newMobileMenuToggle = mobileMenuToggle ? mobileMenuToggle.cloneNode(true) : null;
    if (mobileMenuToggle && mobileMenuToggle.parentNode) {
        mobileMenuToggle.parentNode.replaceChild(newMobileMenuToggle, mobileMenuToggle);
    }
    
    if (newMobileMenuToggle && navMenu) {
        newMobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile menu toggle clicked');
            
            // Toggle menu visibility
            navMenu.classList.toggle('active');
            newMobileMenuToggle.classList.toggle('active');
            
            // Change hamburger icon
            const icon = newMobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                console.log('Menu opened, active state:', navMenu.classList.contains('active'));
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                console.log('Menu closed, active state:', navMenu.classList.contains('active'));
            }
        });
          // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Order button functionality
function initOrderButtons() {
    orderButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const buttonText = button.textContent.toLowerCase();
            
            if (buttonText.includes('kiosk')) {
                showOrderModal('kiosk');
            } else if (buttonText.includes('delivery')) {
                showOrderModal('delivery');
            }
        });
    });
}

// Show order modal/notification
function showOrderModal(orderType) {
    // Check if a modal overlay already exists to prevent duplicates
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        return; // Exit early if modal already exists
    }
    
    const modalContent = orderType === 'kiosk' 
        ? {
            title: 'Kiosk Ordering',
            message: 'Visit any of our locations to use our digital kiosk for quick ordering. No online payment required!',
            action: 'Find Locations'
        }
        : {
            title: 'Delivery Service',
            message: 'Schedule your ramen delivery and pay when it arrives at your door. Fresh and hot!',
            action: 'Call for Delivery'
        };
    
    // Check if dark mode is active
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="order-modal ${isDarkMode ? 'dark-theme' : ''}">
            <button class="modal-close">&times;</button>
            <div class="modal-icon">
                <i class="fas ${orderType === 'kiosk' ? 'fa-utensils' : 'fa-truck'}"></i>
            </div>
            <h3>${modalContent.title}</h3>
            <p>${modalContent.message}</p>
            <div class="modal-actions">
                <button class="modal-btn primary">${modalContent.action}</button>
                <button class="modal-btn secondary modal-close-btn">Close</button>
            </div>
        </div>
    `;
    
    // Add modal styles with dark mode support
    const modalStyles = `
        <style>            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
            }
            
            body.dark-mode .modal-overlay {
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(10px) saturate(80%);
                -webkit-backdrop-filter: blur(10px) saturate(80%);
            }
            
            .order-modal {
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
                position: relative;
            }
              /* Dark theme styles for the modal */
            .order-modal.dark-theme {
                background: #1a1a1a;
                color: #f0f0f0;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(210, 105, 30, 0.2);
                border: 1px solid #333;
                background-image: linear-gradient(to bottom right, rgba(210, 105, 30, 0.05), transparent);
            }
              .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 1.2rem;
                color: #999;
                cursor: pointer;
                padding: 8px;
                line-height: 1;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f2f2f2;
                transition: all 0.3s ease;
            }
            
            .order-modal.dark-theme .modal-close {
                color: #eee;
                background: #444;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            .modal-close:hover {
                transform: rotate(90deg);
                background: #e0e0e0;
                color: #777;
            }
            
            .order-modal.dark-theme .modal-close:hover {
                background: #555;
                color: white;
            }
            
            .modal-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #8B4513, #A0522D);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 25px;
                color: white;
                font-size: 2rem;
            }
              .order-modal.dark-theme .modal-icon {
                background: linear-gradient(135deg, #D2691E, #A52A2A);
                box-shadow: 0 0 20px rgba(210, 105, 30, 0.4);
                position: relative;
                overflow: hidden;
                animation: pulse 3s infinite ease-in-out;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 20px rgba(210, 105, 30, 0.3); }
                50% { box-shadow: 0 0 30px rgba(210, 105, 30, 0.5); }
                100% { box-shadow: 0 0 20px rgba(210, 105, 30, 0.3); }
            }
            
            .order-modal.dark-theme .modal-icon::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                opacity: 0.5;
            }
            
            .order-modal h3 {
                font-size: 1.5rem;
                color: #8B4513;
                margin-bottom: 15px;
            }
              .order-modal.dark-theme h3 {
                color: #D2691E;
                text-shadow: 0 0 10px rgba(210, 105, 30, 0.3);
                letter-spacing: 0.5px;
            }
            
            .order-modal p {
                color: #6B4423;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            
            .order-modal.dark-theme p {
                color: #bbb;
                line-height: 1.7;
                font-weight: 300;
                letter-spacing: 0.2px;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .modal-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-btn.primary {
                background: linear-gradient(135deg, #8B4513, #A0522D);
                color: white;
            }
              .order-modal.dark-theme .modal-btn.primary {
                background: linear-gradient(135deg, #D2691E, #A52A2A);
                box-shadow: 0 0 15px rgba(210, 105, 30, 0.25);
                border: none;
                position: relative;
                overflow: hidden;
                z-index: 1;
            }
            
            .order-modal.dark-theme .modal-btn.primary::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.7s ease;
                z-index: -1;
            }
            
            .order-modal.dark-theme .modal-btn.primary:hover::before {
                left: 100%;
            }
            
            .modal-btn.secondary {
                background: #f5f5f5;
                color: #666;
                transition: all 0.3s ease;
            }
            
            .order-modal.dark-theme .modal-btn.secondary {
                background: #333;
                color: #ccc;
                border: 1px solid #555;
                position: relative;
                overflow: hidden;
            }
            
            .order-modal.dark-theme .modal-btn.secondary::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.05);
                transform: scaleX(0);
                transform-origin: right;
                transition: transform 0.3s ease;
            }
            
            .order-modal.dark-theme .modal-btn.secondary:hover::before {
                transform: scaleX(1);
                transform-origin: left;
            }
            
            .modal-btn:hover {
                transform: translateY(-2px);
            }
            
            .order-modal.dark-theme .modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Add modal to body
    document.body.appendChild(modalOverlay);
      // Close modal functionality
    // Create a flag to track if modal is already closing to prevent double-click issues
    let isClosing = false;
    
    const closeModal = (e) => {
        // Prevent default behavior and stop propagation if event exists
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
            e.stopPropagation();
        }
        
        if (isClosing) return; // Prevent multiple close attempts
        isClosing = true;
        
        modalOverlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            if (document.body.contains(modalOverlay)) {
                document.body.removeChild(modalOverlay);
            }
            
            // Reset the closing flag after a short delay to allow new modals to be opened
            setTimeout(() => {
                isClosing = false;
            }, 100);
        }, 300);
    };
    
    // Use a single handler function with event delegation for all close actions
    const closeButton = modalOverlay.querySelector('.modal-close');
    const closeButtonSecondary = modalOverlay.querySelector('.modal-close-btn');
    
    if (closeButton) {
        // Remove any existing event listeners to prevent duplication
        const newCloseButton = closeButton.cloneNode(true);
        closeButton.parentNode.replaceChild(newCloseButton, closeButton);
        // Add new event listener
        newCloseButton.addEventListener('click', closeModal);
    }
    
    if (closeButtonSecondary) {
        // Remove any existing event listeners to prevent duplication
        const newCloseButtonSecondary = closeButtonSecondary.cloneNode(true);
        closeButtonSecondary.parentNode.replaceChild(newCloseButtonSecondary, closeButtonSecondary);
        // Add new event listener
        newCloseButtonSecondary.addEventListener('click', closeModal);
    }
    
    // Handle overlay click to close modal
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal(e);
    });
    
    // Primary action
    modalOverlay.querySelector('.modal-btn.primary').addEventListener('click', () => {
        if (orderType === 'kiosk') {
            // Scroll to locations section
            document.querySelector('#locations').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Open phone dialer (for mobile) or show phone number
            window.open('tel:+6282734567', '_self');
        }
        closeModal();
    });
}

// Enhanced Hero Stats Animation
function initHeroStatsAnimation() {
    const stats = document.querySelectorAll('.stat');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Add entrance animation
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            stat.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 600 + (index * 200));
    });
    
    // Add count-up animation for numbers
    const countUpNumber = (element, target, duration = 2000) => {
        const startTime = performance.now();
        const startValue = 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth count-up
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target * easeOutQuart));
            
            if (target === 10) {
                element.textContent = currentValue + '+';
            } else if (target === 24) {
                element.textContent = currentValue + '/7';
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                
                // Trigger count-up animation
                const numberElement = entry.target.querySelector('.stat-number');
                const currentText = numberElement.textContent;
                
                if (currentText.includes('10+')) {
                    setTimeout(() => countUpNumber(numberElement, 10, 1500), 800);
                } else if (currentText.includes('24/7')) {
                    setTimeout(() => countUpNumber(numberElement, 24, 1500), 800);
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    });
    
    stats.forEach(stat => statsObserver.observe(stat));
    
    // Add interactive hover effects
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', () => {
            stat.style.transform = 'translateY(-8px) scale(1.05)';
            
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(139, 69, 19, 0.2);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                top: 50%;
                left: 50%;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;
            
            stat.style.position = 'relative';
            stat.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        stat.addEventListener('mouseleave', () => {
            stat.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        stat.addEventListener('click', () => {
            stat.style.transform = 'translateY(-4px) scale(1.02)';
            setTimeout(() => {
                stat.style.transform = 'translateY(-8px) scale(1.05)';
            }, 150);
        });
    });
}

// Add ripple animation keyframes
const addRippleAnimation = () => {
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Mobile menu close on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const mobileMenu = document.querySelector('.nav-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Login Modal Functionality
function initLoginModal() {
    if (loginModal && closeModal) {
        // Show modal when account button is clicked (desktop)
        if (accountBtn) {
            accountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'flex';
                setTimeout(() => loginModal.classList.add('active'), 10);
                document.body.style.overflow = 'hidden';
            });
        }

        // Show modal when mobile account button is clicked
        if (mobileAccountBtn) {
            mobileAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'flex';
                setTimeout(() => loginModal.classList.add('active'), 10);
                document.body.style.overflow = 'hidden';
            });
        }

        // Close modal when close button is clicked
        closeModal.addEventListener('click', () => {
            loginModal.classList.remove('active');
            setTimeout(() => {
                loginModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                setTimeout(() => {
                    loginModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300);
            }
        });

        // Handle login form submission
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Check credentials
                if (email === 'user@gmail.com' && password === 'user') {
                    showNotification('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'admin/dashboard.html';
                    }, 1000);
                } else {
                    showNotification('Invalid credentials. Please try again.', 'error');
                }
            });
        }
    }
}

// Smooth scroll to top functionality
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize all functionality when DOM is loaded
// Empty placeholder functions for any missing initializers
function initScrollAnimations() {
    // This function can be implemented later
    console.log('Scroll animations not yet implemented');
}

function initContactForm() {
    // This function can be implemented later
    console.log('Contact form not yet implemented');
}

// Function to preload images
function preloadImages() {
    const images = [
        'client/assets/img/ramenlogo.png',
        'client/assets/img/middleramen.png',
        'client/assets/img/accounts.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    initSmoothScrolling();
    initNavbarScrollEffect();
    initMobileMenu();
    initOrderButtons();
    initScrollAnimations();
    initContactForm();
    initLoginModal();
    initHeroStatsAnimation();
    addRippleAnimation();
    
    // Preload images
    preloadImages();
    
    // Set initial active section
    updateActiveSection();
    
    console.log('🍜 Ramenila website initialized successfully!');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Update any layout-dependent calculations
    updateActiveSection();
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                transform: translateX(150%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            .notification.success {
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
                color: white;
            }
            .notification.error {
                background: linear-gradient(135deg, #F44336, #C62828);
                color: white;
            }
            .notification-content {
                display: flex;
                align-items: center;
            }
            .notification-content i {
                font-size: 1.5rem;
                margin-right: 15px;
            }
            .notification-content p {
                margin: 0;
                font-size: 0.95rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Export functions for potential external use
window.RamenilaApp = {
    showOrderModal,
    showNotification,
    updateActiveSection
};

// Show Kiosk modal for mobile button
function showKioskModal() {
    // Use the order modal directly for kiosk
    showOrderModal('kiosk');
}

// Function to handle kiosk ordering directly from HTML
function showKioskOrderModal() {
    // Use the reliable showOrderModal function for consistent behavior
    showOrderModal('kiosk');
}

// Show Login modal function that can be called from HTML
function showLoginModal() {
    if (loginModal) {
        loginModal.style.display = 'flex';
        setTimeout(() => loginModal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }
}
