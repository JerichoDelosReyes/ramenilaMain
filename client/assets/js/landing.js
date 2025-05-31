/* filepath: c:\VSC Projects\Ramenila\client\assets\js\landing.js */
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
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Change hamburger icon
            const icon = mobileMenuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
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
    
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
        <div class="order-modal">
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
    
    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
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
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #999;
                cursor: pointer;
                padding: 5px;
                line-height: 1;
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
            
            .order-modal h3 {
                font-size: 1.5rem;
                color: #8B4513;
                margin-bottom: 15px;
            }
            
            .order-modal p {
                color: #6B4423;
                line-height: 1.6;
                margin-bottom: 30px;
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
            
            .modal-btn.secondary {
                background: #f5f5f5;
                color: #666;
            }
            
            .modal-btn:hover {
                transform: translateY(-2px);
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
    const closeModal = () => {
        modalOverlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(modalOverlay);
        }, 300);
    };
    
    modalOverlay.querySelector('.modal-close').addEventListener('click', closeModal);
    modalOverlay.querySelector('.modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
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

// Animate elements on scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.feature-card, .menu-item, .about-feature, .order-method, .location-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    // Add animation styles
    const animationStyles = `
        <style>
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', animationStyles);
}

// Menu filter functionality (for future enhancement)
function initMenuFilter() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Add category filters if needed
    // This is a placeholder for future menu filtering functionality
}

// Contact form handling (if added later)
function initContactForm() {
    const contactForms = document.querySelectorAll('form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Form submission will be handled in a future update
        });
    });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add notification styles
    const styles = {
        success: {
            background: '#4CAF50',
            icon: '<i class="fas fa-check-circle"></i>'
        },
        error: {
            background: '#f44336',
            icon: '<i class="fas fa-times-circle"></i>'
        }
    };
    
    const style = styles[type];
    
    notification.innerHTML = `${style.icon} ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
        background: ${style.background};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        justify-content: center;
        font-weight: 500;
        animation: slideInTop 0.3s ease forwards;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const keyframes = document.createElement('style');
        keyframes.id = 'notification-styles';
        keyframes.textContent = `
            @keyframes slideInTop {
                from {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutTop {
                from {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-50%) translateY(-100%);
                    opacity: 0;
                }
            }
            @media (max-width: 768px) {
                .notification {
                    width: 90%;
                    min-width: unset;
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(keyframes);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Preload images for better performance
function preloadImages() {
    const images = [
        'client/assets/img/middleramen.png',
        'client/assets/img/ramenlogo.png',
        'client/assets/img/accounts.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core functionality
    initSmoothScrolling();
    initNavbarScrollEffect();
    initMobileMenu();
    initOrderButtons();
    initScrollAnimations();
    initContactForm();
    initLoginModal();
    
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

// Export functions for potential external use
window.RamenilaApp = {
    showOrderModal,
    showNotification,
    updateActiveSection
};

// Show Kiosk modal for mobile button
function showKioskModal() {
    // Trigger same action as desktop kiosk button
    const mainKioskBtn = document.querySelector('.kiosk-btn');
    if (mainKioskBtn) {
        mainKioskBtn.click();
    }
}

// Login Modal Functionality
function initLoginModal() {
    if (loginModal && closeModal) {
        // Show modal when account button is clicked (desktop)
        if (accountBtn) {
            accountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'flex';
            });
        }

        // Show modal when mobile account button is clicked
        if (mobileAccountBtn) {
            mobileAccountBtn.addEventListener('click', (e) => {
                e.preventDefault();
                loginModal.style.display = 'flex';
            });
        }

        // Close modal when close button is clicked
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
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
