// Supabase Service Layer
import { initializeSupabase, getSupabase } from './supabase-config.js';

class SupabaseService {
    constructor() {
        this.supabase = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            this.supabase = await initializeSupabase();
            this.initialized = true;
            console.log('SupabaseService initialized successfully');
        } catch (error) {
            console.error('Failed to initialize SupabaseService:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.initialized || !this.supabase) {
            throw new Error('SupabaseService not initialized. Call initialize() first.');
        }
        return this.supabase;
    }

    // PRODUCTS METHODS
    async getProducts() {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            console.log('Raw data from database:', data);
            
            // Map database fields to match frontend expectations
            const mappedData = (data || []).map(product => ({
                ...product,
                image: product.image_url,
                minStock: product.min_stock
            }));
            
            console.log('Mapped data for frontend:', mappedData);
            
            return mappedData;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async addProduct(product) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
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
            
            const mappedData = data[0] ? {
                ...data[0],
                image: data[0].image_url,
                minStock: data[0].min_stock
            } : null;
            
            return mappedData;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id, product) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
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
            
            const mappedData = data[0] ? {
                ...data[0],
                image: data[0].image_url,
                minStock: data[0].min_stock
            } : null;
            
            return mappedData;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { error } = await client
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

    async updateStock(id, newStock) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
                .from('products')
                .update({ 
                    stock: newStock,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select();
            
            if (error) throw error;
            
            const mappedData = data[0] ? {
                ...data[0],
                image: data[0].image_url,
                minStock: data[0].min_stock
            } : null;
            
            return mappedData;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    // CATEGORIES METHODS
    async getCategories() {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
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
    async createBucketIfNotExists(bucketName = 'product-images') {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data: buckets, error: listError } = await client.storage.listBuckets();
            
            if (listError) {
                console.error('Error listing buckets:', listError);
                return false;
            }

            const bucketExists = buckets.some(bucket => bucket.name === bucketName);
            
            if (bucketExists) {
                console.log('Bucket already exists:', bucketName);
                return true;
            }

            const { data, error } = await client.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                fileSizeLimit: 5242880 // 5MB
            });

            if (error) {
                console.error('Error creating bucket:', error);
                return false;
            }

            console.log('Bucket created successfully:', bucketName);
            return true;
        } catch (error) {
            console.error('Error in createBucketIfNotExists:', error);
            return false;
        }
    }

    async uploadImage(file, bucket = 'product-images') {
        await this.initialize();
        const client = this.getClient();
        
        try {
            console.log('Starting image upload to bucket:', bucket);
            console.log('File details:', {
                name: file.name,
                size: file.size,
                type: file.type
            });

            // Validate file
            if (!file) {
                throw new Error('No file provided for upload');
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
            }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 5MB');
            }

            // Ensure bucket exists
            const bucketReady = await this.createBucketIfNotExists(bucket);
            if (!bucketReady) {
                console.warn('Bucket creation failed, trying upload anyway...');
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 15);
            const fileName = `${timestamp}_${randomId}.${fileExt}`;

            console.log('Uploading to path:', fileName);

            // Try to upload the file
            const { data, error } = await client.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: file.type
                });

            if (error) {
                console.error('Supabase upload error:', error);
                
                // Provide specific error messages
                if (error.message.includes('Bucket not found')) {
                    throw new Error('Storage bucket not found. Please contact administrator to set up image storage.');
                } else if (error.message.includes('File size')) {
                    throw new Error('File size exceeds the allowed limit (5MB).');
                } else if (error.message.includes('File type')) {
                    throw new Error('File type not allowed. Please use JPEG, PNG, GIF, or WebP images.');
                } else if (error.message.includes('Already exists')) {
                    throw new Error('A file with this name already exists. Please try again.');
                }
                
                throw new Error(`Upload failed: ${error.message}`);
            }

            console.log('Upload successful, data:', data);

            // Get the public URL
            const { data: publicUrlData } = client.storage
                .from(bucket)
                .getPublicUrl(fileName);

            if (!publicUrlData?.publicUrl) {
                throw new Error('Failed to generate public URL for uploaded image');
            }

            console.log('Public URL generated:', publicUrlData.publicUrl);
            return publicUrlData.publicUrl;

        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    async deleteImage(imagePath, bucket = 'product-images') {
        await this.initialize();
        const client = this.getClient();
        
        try {
            // Extract filename from URL if needed
            let fileName = imagePath;
            if (imagePath.includes('/')) {
                fileName = imagePath.split('/').pop();
            }

            const { error } = await client.storage
                .from(bucket)
                .remove([fileName]);

            if (error) {
                console.error('Error deleting image:', error);
                throw error;
            }
            
            console.log('Image deleted successfully:', fileName);
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // TRANSACTION METHODS
    async addTransaction(transaction) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
                .from('transactions')
                .insert([{
                    transaction_number: transaction.orderNumber,
                    items: JSON.stringify(transaction.items),
                    total: transaction.total,
                    payment_method: transaction.paymentMethod,
                    status: transaction.status || 'completed',
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            
            // Update product stocks
            for (const item of transaction.items) {
                await this.updateProductStock(item.id, -item.quantity);
            }
            
            return data[0];
        } catch (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }
    }

    async getTransactions(limit = 50, offset = 0) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);
            
            if (error) throw error;
            
            return this.processTransactionData(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    async updateProductStock(productId, quantityChange) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            // Get current stock
            const { data: product, error: fetchError } = await client
                .from('products')
                .select('stock')
                .eq('id', productId)
                .single();
            
            if (fetchError) throw fetchError;
            
            const newStock = product.stock + quantityChange;
            
            // Update stock
            const { error: updateError } = await client
                .from('products')
                .update({ 
                    stock: newStock,
                    updated_at: new Date().toISOString()
                })
                .eq('id', productId);
            
            if (updateError) throw updateError;
            
            return newStock;
        } catch (error) {
            console.error('Error updating product stock:', error);
            throw error;
        }
    }

    async getTransactionStats(startDate, endDate) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            let query = client
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

    // SETTINGS METHODS
    async getSettings() {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { data, error } = await client
                .from('settings')
                .select('*')
                .order('key');
            
            if (error) throw error;
            
            // Convert array to object
            const settings = {};
            (data || []).forEach(setting => {
                settings[setting.key] = setting.value;
            });
            
            return settings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    }

    async saveSetting(key, value) {
        await this.initialize();
        const client = this.getClient();
        
        try {
            const { error } = await client
                .from('settings')
                .upsert({ 
                    key: key, 
                    value: value,
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error saving setting:', error);
            throw error;
        }
    }

    processTransactionData(data) {
        return (data || []).map(transaction => ({
            ...transaction,
            items: typeof transaction.items === 'string' 
                ? JSON.parse(transaction.items) 
                : transaction.items || [],
            order_number: transaction.transaction_number || transaction.order_number,
            orderNumber: transaction.transaction_number || transaction.order_number,
            timestamp: transaction.created_at,
            paymentMethod: transaction.payment_method,
            payment_method: transaction.payment_method
        }));
    }
}

// Create and export singleton instance
const supabaseService = new SupabaseService();

// Initialize the service immediately
supabaseService.initialize().catch(error => {
    console.error('Failed to initialize SupabaseService:', error);
});

export default supabaseService;

// Make it globally available
window.supabaseService = supabaseService;
