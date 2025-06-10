// Settings Management System
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeSystem();
    }

    initializeSystem() {
        this.setupTabs();
        this.setupEventListeners();
        this.loadCurrentSettings();
        this.initializeDefaultUsers();
    }

    loadSettings() {
        const defaultSettings = {
            general: {
                theme: 'light',
                language: 'en',
                currency: 'PHP',
                timezone: 'Asia/Manila',
                dateFormat: 'MM/DD/YYYY',
                timeFormat: '12'
            },
            restaurant: {
                name: 'Ramenila',
                address: '',
                phone: '',
                email: '',
                hours: {
                    monday: { open: '11:00', close: '22:00', isOpen: true },
                    tuesday: { open: '11:00', close: '22:00', isOpen: true },
                    wednesday: { open: '11:00', close: '22:00', isOpen: true },
                    thursday: { open: '11:00', close: '22:00', isOpen: true },
                    friday: { open: '11:00', close: '23:00', isOpen: true },
                    saturday: { open: '11:00', close: '23:00', isOpen: true },
                    sunday: { open: '12:00', close: '21:00', isOpen: true }
                }
            },
            pos: {
                cashEnabled: true,
                cardEnabled: true,
                mobileEnabled: false,
                taxRate: 8.25,
                tipSuggestions: '15,18,20,25',
                autoPrint: true,
                emailReceipts: false,
                receiptFooter: 'Thank you for visiting Ramenila!'
            }
        };

        const savedSettings = localStorage.getItem('ramenila_settings');
        if (savedSettings) {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
        return defaultSettings;
    }

    initializeDefaultUsers() {
        // Initialize default users if not already in localStorage
        const existingUsers = localStorage.getItem('users');
        if (!existingUsers) {
            const defaultUsers = [
                {
                    id: 1,
                    name: 'Admin User',
                    email: 'jericho.dlsreyes@gmail.com',
                    role: 'admin',
                    lastLogin: 'Today, 2:30 PM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Manager User',
                    email: 'justinecoronel001@gmail.com',
                    role: 'manager',
                    lastLogin: 'Yesterday, 5:45 PM',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Cashier User',
                    email: 'norona.leeadrian022804@gmail.com',
                    role: 'cashier',
                    lastLogin: '2 days ago',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab pane
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === `${targetTab}-tab`) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    }

    setupEventListeners() {
        // Save settings button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveAllSettings();
        });

        // Add user functionality
        document.getElementById('add-user-btn').addEventListener('click', () => {
            document.getElementById('add-user-modal').style.display = 'block';
        });

        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUser();
        });

        // Edit user form
        document.getElementById('edit-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateUser();
        });

        // Modal close handlers
        document.querySelectorAll('.modal .close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Real-time settings update
        this.setupRealTimeUpdates();
    }

    setupRealTimeUpdates() {
        // Theme changes
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        // Currency changes
        document.getElementById('currency-select').addEventListener('change', (e) => {
            this.updateCurrencyDisplay(e.target.value);
        });
    }

    loadCurrentSettings() {
        // General settings
        document.getElementById('theme-select').value = this.settings.general.theme;
        document.getElementById('language-select').value = this.settings.general.language;
        document.getElementById('currency-select').value = this.settings.general.currency;
        document.getElementById('timezone-select').value = this.settings.general.timezone;
        document.getElementById('date-format').value = this.settings.general.dateFormat;
        document.getElementById('time-format').value = this.settings.general.timeFormat;

        // Restaurant settings
        document.getElementById('restaurant-name').value = this.settings.restaurant.name;
        document.getElementById('restaurant-address').value = this.settings.restaurant.address;
        document.getElementById('restaurant-phone').value = this.settings.restaurant.phone;
        document.getElementById('restaurant-email').value = this.settings.restaurant.email;

        // Operating hours
        Object.keys(this.settings.restaurant.hours).forEach(day => {
            const dayData = this.settings.restaurant.hours[day];
            const dayElement = document.querySelector(`.day-hours:nth-child(${Object.keys(this.settings.restaurant.hours).indexOf(day) + 1})`);
            if (dayElement) {
                const timeInputs = dayElement.querySelectorAll('input[type="time"]');
                const checkbox = dayElement.querySelector('input[type="checkbox"]');
                
                if (timeInputs[0]) timeInputs[0].value = dayData.open;
                if (timeInputs[1]) timeInputs[1].value = dayData.close;
                if (checkbox) checkbox.checked = dayData.isOpen;
            }
        });

        // POS settings
        document.getElementById('cash-enabled').checked = this.settings.pos.cashEnabled;
        document.getElementById('card-enabled').checked = this.settings.pos.cardEnabled;
        document.getElementById('mobile-enabled').checked = this.settings.pos.mobileEnabled;
        document.getElementById('tax-rate').value = this.settings.pos.taxRate;
        document.getElementById('tip-suggestions').value = this.settings.pos.tipSuggestions;
        document.getElementById('auto-print').checked = this.settings.pos.autoPrint;
        document.getElementById('email-receipts').checked = this.settings.pos.emailReceipts;
        document.getElementById('receipt-footer').value = this.settings.pos.receiptFooter;
    }

    saveAllSettings() {
        // Collect all settings from form elements
        const newSettings = {
            general: {
                theme: document.getElementById('theme-select').value,
                language: document.getElementById('language-select').value,
                currency: document.getElementById('currency-select').value,
                timezone: document.getElementById('timezone-select').value,
                dateFormat: document.getElementById('date-format').value,
                timeFormat: document.getElementById('time-format').value
            },
            restaurant: {
                name: document.getElementById('restaurant-name').value,
                address: document.getElementById('restaurant-address').value,
                phone: document.getElementById('restaurant-phone').value,
                email: document.getElementById('restaurant-email').value,
                hours: this.collectOperatingHours()
            },
            pos: {
                cashEnabled: document.getElementById('cash-enabled').checked,
                cardEnabled: document.getElementById('card-enabled').checked,
                mobileEnabled: document.getElementById('mobile-enabled').checked,
                taxRate: parseFloat(document.getElementById('tax-rate').value),
                tipSuggestions: document.getElementById('tip-suggestions').value,
                autoPrint: document.getElementById('auto-print').checked,
                emailReceipts: document.getElementById('email-receipts').checked,
                receiptFooter: document.getElementById('receipt-footer').value
            }
        };

        // Save to localStorage
        localStorage.setItem('ramenila_settings', JSON.stringify(newSettings));
        this.settings = newSettings;

        // Apply theme if changed
        this.applyTheme(newSettings.general.theme);

        this.showNotification('Settings saved successfully!', 'success');
    }

    collectOperatingHours() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const hours = {};

        days.forEach((day, index) => {
            const dayElement = document.querySelector(`.day-hours:nth-child(${index + 1})`);
            if (dayElement) {
                const timeInputs = dayElement.querySelectorAll('input[type="time"]');
                const checkbox = dayElement.querySelector('input[type="checkbox"]');
                
                hours[day] = {
                    open: timeInputs[0] ? timeInputs[0].value : '11:00',
                    close: timeInputs[1] ? timeInputs[1].value : '22:00',
                    isOpen: checkbox ? checkbox.checked : true
                };
            }
        });

        return hours;
    }

    applyTheme(theme) {
        const body = document.body;
        body.classList.remove('light-theme', 'dark-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (theme === 'light') {
            body.classList.add('light-theme');
        } else {
            // Auto theme - detect system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
        }
    }

    updateCurrencyDisplay(currency) {
        // Update currency symbols throughout the application
        const currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'PHP': '₱'
        };
        
        // This would update currency display throughout the app
        console.log(`Currency changed to ${currency} (${currencySymbols[currency]})`);
    }

    addUser() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;
        const password = document.getElementById('user-password').value;

        if (!name || !email || !role || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate adding user (in a real app, this would make an API call)
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            role: role,
            lastLogin: 'Never',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        // Save to localStorage (in real app, send to server)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Add to table
        this.addUserToTable(newUser);

        // Clear form and close modal
        document.getElementById('add-user-form').reset();
        document.getElementById('add-user-modal').style.display = 'none';
        
        this.showNotification('User added successfully!', 'success');
    }

    addUserToTable(user) {
        const tbody = document.getElementById('users-tbody');
        const row = document.createElement('tr');
        row.setAttribute('data-user-id', user.id);
        
        const getRoleBadge = (role) => {
            return `<span class="role-badge ${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
        };

        const getStatusBadge = (status) => {
            return `<span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
        };

        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>${user.lastLogin}</td>
            <td>${getStatusBadge(user.status)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="settingsManager.editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.role !== 'admin' ? `
                <button class="action-btn delete-btn" onclick="settingsManager.deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </td>
        `;
        
        tbody.appendChild(row);
    }

    editUser(userId) {
        // Get user data from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id == userId);
        
        if (!user) {
            this.showNotification('User not found', 'error');
            return;
        }

        // Populate edit form
        document.getElementById('edit-user-id').value = user.id;
        document.getElementById('edit-user-name').value = user.name;
        document.getElementById('edit-user-email').value = user.email;
        document.getElementById('edit-user-role').value = user.role;
        document.getElementById('edit-user-status').value = user.status;
        document.getElementById('edit-user-password').value = '';

        // Show edit modal
        document.getElementById('edit-user-modal').style.display = 'block';
    }

    updateUser() {
        const userId = parseInt(document.getElementById('edit-user-id').value);
        const name = document.getElementById('edit-user-name').value;
        const email = document.getElementById('edit-user-email').value;
        const role = document.getElementById('edit-user-role').value;
        const status = document.getElementById('edit-user-status').value;
        const password = document.getElementById('edit-user-password').value;

        if (!name || !email || !role || !status) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id == userId);

        if (userIndex === -1) {
            this.showNotification('User not found', 'error');
            return;
        }

        // Update user data
        users[userIndex] = {
            ...users[userIndex],
            name: name,
            email: email,
            role: role,
            status: status,
            updatedAt: new Date().toISOString()
        };

        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Update the table row
        this.updateUserInTable(users[userIndex]);

        // Close modal and show notification
        document.getElementById('edit-user-modal').style.display = 'none';
        this.showNotification('User updated successfully!', 'success');
    }

    updateUserInTable(user) {
        const row = document.querySelector(`tr[data-user-id="${user.id}"]`);
        if (!row) return;

        const getRoleBadge = (role) => {
            return `<span class="role-badge ${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
        };

        const getStatusBadge = (status) => {
            return `<span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
        };

        // Update row content
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>${user.lastLogin}</td>
            <td>${getStatusBadge(user.status)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="settingsManager.editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                ${user.role !== 'admin' ? `
                <button class="action-btn delete-btn" onclick="settingsManager.deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>` : ''}
            </td>
        `;
    }

    deleteUser(userId) {
        // Get user data to check role
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.id == userId);
        
        if (!user) {
            this.showNotification('User not found', 'error');
            return;
        }

        // Prevent deletion of admin users
        if (user.role === 'admin') {
            this.showNotification('Cannot delete administrator users', 'error');
            return;
        }

        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            // Remove from localStorage
            const updatedUsers = users.filter(u => u.id != userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Remove from table
            const row = document.querySelector(`tr[data-user-id="${userId}"]`);
            if (row) {
                row.remove();
            }
            
            this.showNotification('User deleted successfully!', 'success');
        }
    }    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize Settings Manager when page loads
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});

// Export for global access
window.settingsManager = settingsManager;
