// Firebase Service Layer
import { initializeFirebase, getDb } from './firebase-config.js';
import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    Timestamp,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class FirebaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            const { db } = await initializeFirebase();
            this.db = db;
            this.initialized = true;
            console.log('✅ FirebaseService initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize FirebaseService:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.initialized || !this.db) {
            throw new Error('FirebaseService not initialized. Call initialize() first.');
        }
        return this.db;
    }

    // PRODUCTS METHODS
    async getProducts() {
        await this.initialize();
        
        try {
            console.log('Fetching products...');
            
            const productsRef = collection(this.db, 'products');
            // Simple query first - filter client-side to avoid index requirements
            const snapshot = await getDocs(productsRef);
            const products = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                // Filter for active products client-side
                if (data.is_active === true || data.is_active === undefined) {
                    products.push({
                        id: docSnap.id,
                        name: data.name || '',
                        category: data.category || '',
                        description: data.description || '',
                        price: parseFloat(data.price) || 0,
                        stock: parseInt(data.stock) || 0,
                        min_stock: parseInt(data.min_stock) || 0,
                        minStock: parseInt(data.min_stock) || 0,
                        unit: data.unit || 'pcs',
                        image: data.image_url || data.image || '',
                        image_url: data.image_url || data.image || '',
                        is_active: data.is_active !== false,
                        created_at: data.created_at?.toDate?.() || data.created_at || new Date()
                    });
                }
            });
            
            // Sort by created_at descending
            products.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                return dateB - dateA;
            });
            
            console.log('Number of active products found:', products.length);
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getActiveProducts() {
        return this.getProducts();
    }

    async addProduct(product) {
        await this.initialize();
        
        try {
            const productsRef = collection(this.db, 'products');
            
            const productData = {
                name: product.name,
                category: product.category,
                price: parseFloat(product.price),
                stock: parseInt(product.stock),
                min_stock: parseInt(product.minStock || 0),
                unit: product.unit || 'pcs',
                description: product.description || '',
                image_url: product.image || '',
                is_active: true,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            };
            
            const docRef = await addDoc(productsRef, productData);
            
            console.log('✅ Product added with ID:', docRef.id);
            
            return {
                id: docRef.id,
                ...productData,
                image: productData.image_url,
                minStock: productData.min_stock
            };
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id, product) {
        await this.initialize();
        
        try {
            const productRef = doc(this.db, 'products', id);
            
            const updateData = {
                name: product.name,
                category: product.category,
                price: parseFloat(product.price),
                stock: parseInt(product.stock),
                min_stock: parseInt(product.minStock || 0),
                unit: product.unit || 'pcs',
                description: product.description || '',
                image_url: product.image || '',
                updated_at: serverTimestamp()
            };
            
            await updateDoc(productRef, updateData);
            
            console.log('✅ Product updated:', id);
            
            return {
                id,
                ...updateData,
                image: updateData.image_url,
                minStock: updateData.min_stock
            };
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        await this.initialize();
        
        console.log('FirebaseService: Attempting PERMANENT delete for product ID:', id);
        
        try {
            const productRef = doc(this.db, 'products', id);
            
            // Get product name for logging
            const productDoc = await getDoc(productRef);
            const productName = productDoc.exists() ? productDoc.data().name : 'Unknown Product';
            
            console.log(`Permanently deleting product: "${productName}" (ID: ${id})`);
            
            await deleteDoc(productRef);
            
            console.log(`✅ "${productName}" permanently deleted from database`);
            return true;
        } catch (error) {
            console.error('FirebaseService: Error permanently deleting product:', error);
            throw error;
        }
    }

    async updateStock(id, newStock) {
        await this.initialize();
        
        try {
            const productRef = doc(this.db, 'products', id);
            
            await updateDoc(productRef, {
                stock: parseInt(newStock),
                updated_at: serverTimestamp()
            });
            
            // Get updated product
            const productDoc = await getDoc(productRef);
            const data = productDoc.data();
            
            return {
                id,
                ...data,
                image: data.image_url,
                minStock: data.min_stock
            };
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    async updateProductStock(productId, quantityChange) {
        await this.initialize();
        
        try {
            const productRef = doc(this.db, 'products', productId);
            const productDoc = await getDoc(productRef);
            
            if (!productDoc.exists()) {
                throw new Error('Product not found');
            }
            
            const currentStock = productDoc.data().stock || 0;
            const newStock = currentStock + quantityChange;
            
            await updateDoc(productRef, {
                stock: newStock,
                updated_at: serverTimestamp()
            });
            
            return newStock;
        } catch (error) {
            console.error('Error updating product stock:', error);
            throw error;
        }
    }

    // CATEGORIES METHODS
    async getCategories() {
        await this.initialize();
        
        try {
            const categoriesRef = collection(this.db, 'categories');
            const snapshot = await getDocs(categoriesRef);
            const categories = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                if (data.is_active === true || data.is_active === undefined) {
                    categories.push({
                        id: docSnap.id,
                        ...data
                    });
                }
            });
            
            // Sort by name
            categories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // IMAGE METHODS (Storage disabled - using URL strings only)
    async uploadImage(file, folder = 'product-images') {
        // Storage is disabled - return a placeholder or use base64
        console.warn('Firebase Storage is disabled. Image upload not available.');
        
        // Convert file to base64 data URL as fallback
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                console.log('✅ Image converted to base64');
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async deleteImage(imagePath) {
        // Storage is disabled - just return success
        console.warn('Firebase Storage is disabled. Image deletion skipped.');
        return true;
    }

    // TRANSACTION METHODS
    async addTransaction(transactionData) {
        await this.initialize();
        
        try {
            console.log('📋 FirebaseService: Adding transaction to database...');
            console.log('📋 Transaction data received:', transactionData);

            const transactionsRef = collection(this.db, 'transactions');
            
            // Parse items if string
            const items = typeof transactionData.items === 'string' 
                ? JSON.parse(transactionData.items) 
                : transactionData.items;

            const insertData = {
                transaction_number: transactionData.transactionNumber,
                items: items,
                subtotal: parseFloat(transactionData.subtotal),
                tax_amount: parseFloat(transactionData.tax_amount || 0),
                discount_amount: parseFloat(transactionData.discount_amount || 0),
                total: parseFloat(transactionData.total),
                amount_paid: parseFloat(transactionData.amount_paid || transactionData.total),
                change_amount: parseFloat(transactionData.change_amount || 0),
                customer_name: transactionData.customer_name || null,
                payment_method: transactionData.paymentMethod,
                status: transactionData.status || 'completed',
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            };
            
            console.log('📋 Insert data:', insertData);
            
            const docRef = await addDoc(transactionsRef, insertData);
            
            console.log('✅ Transaction inserted successfully with ID:', docRef.id);
            
            // Update product stocks
            console.log('📦 Updating stock for items:', items);
            
            for (const item of items) {
                try {
                    console.log(`📦 Updating stock for product ${item.id}: -${item.quantity}`);
                    await this.updateProductStock(item.id, -item.quantity);
                } catch (stockError) {
                    console.error(`❌ Failed to update stock for product ${item.id}:`, stockError);
                }
            }
            
            console.log('✅ All stock updates completed');
            
            return {
                id: docRef.id,
                ...insertData
            };
        } catch (error) {
            console.error('❌ Error adding transaction:', error);
            throw error;
        }
    }

    async getTransactions(limitCount = 50, offset = 0) {
        await this.initialize();
        
        try {
            const transactionsRef = collection(this.db, 'transactions');
            // Use Firestore's native ordering and limiting for better performance
            const q = query(
                transactionsRef, 
                orderBy('created_at', 'desc'),
                limit(limitCount)
            );
            const snapshot = await getDocs(q);
            const transactions = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                transactions.push({
                    id: docSnap.id,
                    ...data,
                    items: data.items || [],
                    order_number: data.transaction_number,
                    orderNumber: data.transaction_number,
                    timestamp: data.created_at?.toDate?.() || data.created_at,
                    created_at: data.created_at?.toDate?.() || data.created_at,
                    paymentMethod: data.payment_method,
                    payment_method: data.payment_method
                });
            });
            
            return transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Fallback to fetching all if index not ready
            if (error.code === 'failed-precondition') {
                console.log('Index not ready, falling back to client-side sorting...');
                return this.getTransactionsFallback(limitCount);
            }
            throw error;
        }
    }

    async getTransactionsFallback(limitCount = 50) {
        try {
            const transactionsRef = collection(this.db, 'transactions');
            const snapshot = await getDocs(transactionsRef);
            const transactions = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                transactions.push({
                    id: docSnap.id,
                    ...data,
                    items: data.items || [],
                    order_number: data.transaction_number,
                    orderNumber: data.transaction_number,
                    timestamp: data.created_at?.toDate?.() || data.created_at,
                    created_at: data.created_at?.toDate?.() || data.created_at,
                    paymentMethod: data.payment_method,
                    payment_method: data.payment_method
                });
            });
            
            // Sort by created_at descending and limit
            transactions.sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
                const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
                return dateB - dateA;
            });
            
            return transactions.slice(0, limitCount);
        } catch (error) {
            console.error('Error in fallback transactions fetch:', error);
            throw error;
        }
    }

    async getTransactionStats(startDate, endDate) {
        await this.initialize();
        
        try {
            const transactionsRef = collection(this.db, 'transactions');
            const snapshot = await getDocs(transactionsRef);
            let transactions = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                const createdAt = data.created_at?.toDate?.() || new Date(data.created_at);
                
                let include = true;
                if (startDate && createdAt < new Date(startDate)) include = false;
                if (endDate && createdAt > new Date(endDate)) include = false;
                
                if (include) {
                    transactions.push({ id: docSnap.id, ...data });
                }
            });
            
            // Calculate statistics
            const stats = {
                totalTransactions: transactions.length,
                totalRevenue: transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0),
                averageOrderValue: transactions.length > 0 
                    ? transactions.reduce((sum, t) => sum + parseFloat(t.total || 0), 0) / transactions.length 
                    : 0,
                completedTransactions: transactions.filter(t => t.status === 'completed').length,
                refundedTransactions: transactions.filter(t => t.status === 'refunded').length
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
        
        try {
            const settingsRef = collection(this.db, 'settings');
            const snapshot = await getDocs(settingsRef);
            
            const settings = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                settings[data.key || doc.id] = data.value;
            });
            
            return settings;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    }

    async saveSetting(key, value) {
        await this.initialize();
        
        try {
            const settingsRef = collection(this.db, 'settings');
            
            // Check if setting exists
            const q = query(settingsRef, where('key', '==', key));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                // Create new setting
                await addDoc(settingsRef, {
                    key: key,
                    value: value,
                    updated_at: serverTimestamp()
                });
            } else {
                // Update existing setting
                const docRef = doc(this.db, 'settings', snapshot.docs[0].id);
                await updateDoc(docRef, {
                    value: value,
                    updated_at: serverTimestamp()
                });
            }
            
            return true;
        } catch (error) {
            console.error('Error saving setting:', error);
            throw error;
        }
    }

    // Test database connection
    async testConnection() {
        await this.initialize();
        
        try {
            console.log('Testing Firebase connection...');
            const productsRef = collection(this.db, 'products');
            const q = query(productsRef, limit(1));
            const snapshot = await getDocs(q);
            
            console.log('✅ Connection test successful. Documents found:', snapshot.size);
            return true;
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
    }

    // Debug method to check all products regardless of status
    async getAllProductsDebug() {
        await this.initialize();
        
        try {
            console.log('=== DEBUG: Fetching ALL products (active and inactive) ===');
            const productsRef = collection(this.db, 'products');
            const q = query(productsRef, orderBy('created_at', 'desc'));
            
            const snapshot = await getDocs(q);
            const products = [];
            
            snapshot.forEach((doc, index) => {
                const data = doc.data();
                console.log(`${index + 1}. ${data.name} (ID: ${doc.id.substring(0, 8)}...) - is_active: ${data.is_active}`);
                products.push({ id: doc.id, ...data });
            });
            
            const activeCount = products.filter(p => p.is_active === true).length;
            const inactiveCount = products.filter(p => p.is_active === false).length;
            
            console.log(`Active products: ${activeCount}, Inactive products: ${inactiveCount}`);
            
            return products;
        } catch (error) {
            console.error('Error in debug fetch:', error);
            throw error;
        }
    }

    // Cleanup method to permanently delete inactive products
    async cleanupInactiveProducts() {
        await this.initialize();
        
        try {
            console.log('=== CLEANUP: Finding inactive products ===');
            
            const productsRef = collection(this.db, 'products');
            const q = query(productsRef, where('is_active', '==', false));
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log('No inactive products found to clean up');
                return { deleted: 0, products: [] };
            }
            
            const inactiveProducts = [];
            const deletePromises = [];
            
            snapshot.forEach(docSnap => {
                const data = docSnap.data();
                inactiveProducts.push(data.name);
                deletePromises.push(deleteDoc(doc(this.db, 'products', docSnap.id)));
            });
            
            await Promise.all(deletePromises);
            
            console.log(`✅ Successfully deleted ${inactiveProducts.length} inactive products`);
            
            return { 
                deleted: inactiveProducts.length, 
                products: inactiveProducts 
            };
            
        } catch (error) {
            console.error('Error in cleanup:', error);
            throw error;
        }
    }

    // REFUND METHODS
    async refundTransaction(transactionId, refundData) {
        await this.initialize();
        
        try {
            console.log('💸 Processing refund for transaction:', transactionId);
            console.log('💸 Refund data:', refundData);
            
            const transactionRef = doc(this.db, 'transactions', transactionId);
            const transactionDoc = await getDoc(transactionRef);
            
            if (!transactionDoc.exists()) {
                throw new Error('Transaction not found');
            }
            
            const transaction = transactionDoc.data();
            
            // Prepare refund data
            const refundUpdateData = {
                status: 'refunded',
                refund_reason: refundData.reason,
                refund_notes: refundData.notes || '',
                refund_date: serverTimestamp(),
                updated_at: serverTimestamp()
            };
            
            // Add refund amount
            if (refundData.amount) {
                refundUpdateData.refund_amount = parseFloat(refundData.amount);
                refundUpdateData.refund_notes = `${refundData.notes || 'Partial refund'} - Amount: ₱${refundData.amount}`;
            } else {
                refundUpdateData.refund_amount = transaction.total;
                refundUpdateData.refund_notes = refundData.notes || 'Full refund';
            }
            
            console.log('💸 Updating transaction with refund data:', refundUpdateData);
            
            await updateDoc(transactionRef, refundUpdateData);
            
            // If full refund, restore stock
            if (!refundData.amount || refundData.amount >= transaction.total) {
                console.log('💸 Processing full refund - restoring stock');
                
                const items = transaction.items || [];
                
                for (const item of items) {
                    try {
                        console.log(`📦 Restoring stock for product ${item.id}: +${item.quantity}`);
                        await this.updateProductStock(item.id, item.quantity);
                    } catch (stockError) {
                        console.error(`❌ Failed to restore stock for product ${item.id}:`, stockError);
                    }
                }
                
                console.log('✅ Stock restoration completed');
            } else {
                console.log('💸 Partial refund - stock not restored');
            }
            
            // Get updated transaction
            const updatedDoc = await getDoc(transactionRef);
            const updatedTransaction = { id: updatedDoc.id, ...updatedDoc.data() };
            
            console.log('✅ Refund processed successfully:', updatedTransaction);
            return updatedTransaction;
        } catch (error) {
            console.error('❌ Error processing refund:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const firebaseService = new FirebaseService();

// Initialize the service immediately
firebaseService.initialize().catch(error => {
    console.error('Failed to initialize FirebaseService:', error);
});

export default firebaseService;

// Make it globally available (for backward compatibility)
window.firebaseService = firebaseService;
// Also keep the old name for compatibility
window.supabaseService = firebaseService;
