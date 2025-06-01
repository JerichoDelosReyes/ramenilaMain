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
    }

    loadSettings() {        const defaultSettings = {
            general: {
                language: 'en',
                currency: 'USD',
                timezone: 'America/New_York',
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
            },
            notifications: {
                lowStockAlerts: true,
                lowStockThreshold: 10,
                outOfStockAlerts: true,
                expiryAlerts: true,
                dailyReports: true,
                weeklyReports: false,
                goalAlerts: false,
                dailyGoal: 1000
            }
        };

        const savedSettings = localStorage.getItem('ramenila_settings');
        if (savedSettings) {
            return { ...defaultSettings, ...JSON.parse(savedSettings) };
        }
        return defaultSettings;
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

        // Export buttons
        document.getElementById('export-inventory').addEventListener('click', () => {
            this.exportData('inventory');
        });

        document.getElementById('export-transactions').addEventListener('click', () => {
            this.exportData('transactions');
        });

        document.getElementById('export-all').addEventListener('click', () => {
            this.exportData('all');
        });

        // Import data
        document.getElementById('import-data').addEventListener('click', () => {
            this.importData();
        });

        // Reset data
        document.getElementById('clear-transactions').addEventListener('click', () => {
            this.clearTransactions();
        });

        document.getElementById('reset-all').addEventListener('click', () => {
            this.resetAllData();
        });

        // Add user functionality
        document.getElementById('add-user-btn').addEventListener('click', () => {
            document.getElementById('add-user-modal').style.display = 'block';
        });

        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUser();
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
    }    setupRealTimeUpdates() {
        // Currency changes
        document.getElementById('currency-select').addEventListener('change', (e) => {
            this.updateCurrencyDisplay(e.target.value);
        });
    }    loadCurrentSettings() {
        // General settings - Theme is managed by sidebar.js
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

        // Notification settings
        document.getElementById('low-stock-alerts').checked = this.settings.notifications.lowStockAlerts;
        document.getElementById('low-stock-threshold').value = this.settings.notifications.lowStockThreshold;
        document.getElementById('out-of-stock-alerts').checked = this.settings.notifications.outOfStockAlerts;
        document.getElementById('expiry-alerts').checked = this.settings.notifications.expiryAlerts;
        document.getElementById('daily-reports').checked = this.settings.notifications.dailyReports;
        document.getElementById('weekly-reports').checked = this.settings.notifications.weeklyReports;
        document.getElementById('goal-alerts').checked = this.settings.notifications.goalAlerts;
        document.getElementById('daily-goal').value = this.settings.notifications.dailyGoal;
    }

    saveAllSettings() {        // Collect all settings from form elements
        const newSettings = {
            general: {
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
            },
            notifications: {
                lowStockAlerts: document.getElementById('low-stock-alerts').checked,
                lowStockThreshold: parseInt(document.getElementById('low-stock-threshold').value),
                outOfStockAlerts: document.getElementById('out-of-stock-alerts').checked,
                expiryAlerts: document.getElementById('expiry-alerts').checked,
                dailyReports: document.getElementById('daily-reports').checked,
                weeklyReports: document.getElementById('weekly-reports').checked,
                goalAlerts: document.getElementById('goal-alerts').checked,
                dailyGoal: parseFloat(document.getElementById('daily-goal').value)
            }
        };

        // Save to localStorage
        localStorage.setItem('ramenila_settings', JSON.stringify(newSettings));        this.settings = newSettings;

        // Theme management is handled by sidebar.js
        
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
        });        return hours;
    }

    updateCurrencyDisplay(currency) {
        // Update currency symbols throughout the application
        const currencySymbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥'
        };
        
        // This would update currency display throughout the app
        console.log(`Currency changed to ${currency} (${currencySymbols[currency]})`);
    }

    exportData(type) {
        let data = {};
        let filename = '';

        switch(type) {
            case 'inventory':
                data = JSON.parse(localStorage.getItem('inventory') || '[]');
                filename = `ramenila_inventory_${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'transactions':
                data = JSON.parse(localStorage.getItem('transactions') || '[]');
                filename = `ramenila_transactions_${new Date().toISOString().split('T')[0]}.json`;
                break;
            case 'all':
                data = {
                    inventory: JSON.parse(localStorage.getItem('inventory') || '[]'),
                    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
                    settings: this.settings
                };
                filename = `ramenila_full_backup_${new Date().toISOString().split('T')[0]}.json`;
                break;
        }

        this.downloadJSON(data, filename);
        this.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully!`, 'success');
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    importData() {
        const fileInput = document.getElementById('import-file');
        const file = fileInput.files[0];

        if (!file) {
            this.showNotification('Please select a file to import', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Determine data type and import accordingly
                if (Array.isArray(data)) {
                    // Assume it's either inventory or transactions
                    if (data.length > 0 && data[0].hasOwnProperty('stock')) {
                        localStorage.setItem('inventory', JSON.stringify(data));
                        this.showNotification('Inventory data imported successfully!', 'success');
                    } else if (data.length > 0 && data[0].hasOwnProperty('orderNumber')) {
                        localStorage.setItem('transactions', JSON.stringify(data));
                        this.showNotification('Transaction data imported successfully!', 'success');
                    }
                } else if (data.hasOwnProperty('inventory') || data.hasOwnProperty('transactions')) {
                    // Full backup file
                    if (data.inventory) {
                        localStorage.setItem('inventory', JSON.stringify(data.inventory));
                    }
                    if (data.transactions) {
                        localStorage.setItem('transactions', JSON.stringify(data.transactions));
                    }
                    if (data.settings) {
                        localStorage.setItem('ramenila_settings', JSON.stringify(data.settings));
                        this.settings = data.settings;
                        this.loadCurrentSettings();
                    }
                    this.showNotification('All data imported successfully!', 'success');
                }
                
                fileInput.value = '';
            } catch (error) {
                this.showNotification('Error importing data. Please check file format.', 'error');
            }
        };
        
        reader.readAsText(file);
    }

    clearTransactions() {
        if (confirm('Are you sure you want to clear all transaction history? This action cannot be undone.')) {
            localStorage.removeItem('transactions');
            this.showNotification('Transaction history cleared successfully!', 'info');
        }
    }

    resetAllData() {
        if (confirm('Are you sure you want to reset ALL data? This will clear inventory, transactions, and settings. This action cannot be undone.')) {
            const confirmAgain = confirm('This is your final warning. All data will be permanently deleted. Do you want to continue?');
            if (confirmAgain) {
                localStorage.clear();
                this.showNotification('All data has been reset!', 'info');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        }
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
        
        const getRoleBadge = (role) => {
            return `<span class="role-badge ${role}">${role.charAt(0).toUpperCase() + role.slice(1)}</span>`;
        };

        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>${user.lastLogin}</td>
            <td><span class="status-badge ${user.status}">${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="settingsManager.editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="settingsManager.deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    }

    editUser(userId) {
        // In a real app, this would open an edit modal
        this.showNotification('Edit user functionality would be implemented here', 'info');
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            // Remove from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const updatedUsers = users.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Remove from table
            const rows = document.querySelectorAll('#users-tbody tr');
            rows.forEach(row => {
                const deleteBtn = row.querySelector('.delete-btn');
                if (deleteBtn && deleteBtn.onclick.toString().includes(userId)) {
                    row.remove();
                }
            });
            
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
