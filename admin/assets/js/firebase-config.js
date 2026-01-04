// Firebase Configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';
import configLoader from './config-loader.js';

let app = null;
let db = null;
let analytics = null;

// Initialize Firebase asynchronously
async function initializeFirebase() {
    if (app) return { app, db, analytics };
    
    try {
        const config = await configLoader.loadConfig();
        const firebaseConfig = config.FIREBASE;
        
        if (!firebaseConfig || !firebaseConfig.apiKey) {
            throw new Error('Missing Firebase configuration');
        }
        
        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        
        // Only initialize analytics in browser environment
        if (typeof window !== 'undefined') {
            try {
                analytics = getAnalytics(app);
            } catch (e) {
                console.warn('Analytics not available:', e);
            }
        }
        
        console.log('✅ Firebase initialized successfully');
        return { app, db, analytics };
    } catch (error) {
        console.error('❌ Failed to initialize Firebase:', error);
        throw error;
    }
}

// Export the initialization function and getters
export { initializeFirebase };

export const getDb = () => {
    if (!db) {
        throw new Error('Firebase not initialized. Call initializeFirebase() first.');
    }
    return db;
};

export const getApp = () => {
    if (!app) {
        throw new Error('Firebase not initialized. Call initializeFirebase() first.');
    }
    return app;
};

// Initialize immediately for global access
initializeFirebase().then(({ db: database }) => {
    window.firebaseDb = database;
}).catch(error => {
    console.error('Failed to initialize Firebase globally:', error);
});

export default { initializeFirebase, getDb, getApp };
