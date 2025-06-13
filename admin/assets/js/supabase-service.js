// Supabase Service Layer
import { supabase } from './supabase-config.js';

class SupabaseService {
    constructor() {
        this.supabase = supabase;
    }

    // PRODUCTS METHODS
    async getProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .insert([{
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                    min_stock: product.minStock,
                    unit: product.unit,
                    description: product.description,
                    image_url: product.image
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .update({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                    min_stock: product.minStock,
                    unit: product.unit,
                    description: product.description,
                    image_url: product.image,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const { error } = await this.supabase
                .from('products')
                .update({ is_active: false })
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // TRANSACTIONS METHODS
    async getTransactions() {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    async addTransaction(transaction) {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .insert([{
                    transaction_number: transaction.transactionNumber,
                    items: transaction.items,
                    subtotal: transaction.subtotal,
                    tax_amount: transaction.taxAmount || 0,
                    discount_amount: transaction.discountAmount || 0,
                    total: transaction.total,
                    payment_method: transaction.paymentMethod,
                    payment_status: transaction.paymentStatus || 'completed',
                    status: transaction.status || 'completed',
                    cashier_name: transaction.cashierName,
                    customer_name: transaction.customerName,
                    notes: transaction.notes
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async updateTransaction(id, updates) {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }
    }

    async refundTransaction(id, refundData) {
        try {
            const { data, error } = await this.supabase
                .from('transactions')
                .update({
                    status: 'refunded',
                    refund_reason: refundData.reason,
                    refund_notes: refundData.notes,
                    refund_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }

    // USERS METHODS
    async getUsers() {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async addUser(user) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([{
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status || 'active'
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async updateUser(id, user) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const { error } = await this.supabase
                .from('users')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // SETTINGS METHODS
    async getSettings() {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .select('*');
            
            if (error) throw error;
            
            // Convert to the expected format
            const settings = {};
            data.forEach(setting => {
                const category = setting.category;
                const key = setting.key.replace(`${category}_`, '');
                
                if (!settings[category]) {
                    settings[category] = {};
                }
                
                settings[category][key] = JSON.parse(setting.value);
            });
            
            return settings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    }

    async updateSetting(key, value, category) {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .upsert({
                    key: key,
                    value: JSON.stringify(value),
                    category: category,
                    updated_at: new Date().toISOString()
                })
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating setting:', error);
            throw error;
        }
    }

    async saveAllSettings(settings) {
        try {
            const settingsArray = [];
            
            Object.keys(settings).forEach(category => {
                Object.keys(settings[category]).forEach(key => {
                    settingsArray.push({
                        key: `${category}_${key}`,
                        value: JSON.stringify(settings[category][key]),
                        category: category
                    });
                });
            });
            
            const { error } = await this.supabase
                .from('settings')
                .upsert(settingsArray);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            throw error;
        }
    }

    // CATEGORIES METHODS
    async getCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('name');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // IMAGE METHODS
    async uploadImage(file, bucket = 'product-images') {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await this.supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrl } = this.supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return publicUrl.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async deleteImage(imagePath, bucket = 'product-images') {
        try {
            const { error } = await this.supabase.storage
                .from(bucket)
                .remove([imagePath]);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // ANALYTICS METHODS
    async getTransactionStats(startDate, endDate) {
        try {
            let query = this.supabase
                .from('transactions')
                .select('*');
            
            if (startDate) {
                query = query.gte('created_at', startDate);
            }
            
            if (endDate) {
                query = query.lte('created_at', endDate);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            // Calculate statistics
            const stats = {
                totalTransactions: data.length,
                totalRevenue: data.reduce((sum, t) => sum + parseFloat(t.total), 0),
                averageOrderValue: data.length > 0 ? data.reduce((sum, t) => sum + parseFloat(t.total), 0) / data.length : 0,
                completedTransactions: data.filter(t => t.status === 'completed').length,
                refundedTransactions: data.filter(t => t.status === 'refunded').length
            };
            
            return stats;
        } catch (error) {
            console.error('Error fetching transaction stats:', error);
            throw error;
        }
    }

    async getLowStockProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .lte('stock', 'min_stock')
                .eq('is_active', true)
                .order('stock', { ascending: true });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching low stock products:', error);
            throw error;
        }
    }

    // UTILITY METHODS
    async testConnection() {
        try {
            const { data, error } = await this.supabase
                .from('settings')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    }

    // Generate unique transaction number
    generateTransactionNumber() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const time = now.getTime().toString().slice(-6);
        return `TXN${year}${month}${day}${time}`;
    }
}

// Create and export singleton instance
const supabaseService = new SupabaseService();
export default supabaseService;

// Make it globally available
window.supabaseService = supabaseService;
