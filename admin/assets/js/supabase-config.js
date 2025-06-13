// Supabase Configuration
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import configLoader from './config-loader.js'

let supabase = null;

// Initialize Supabase client asynchronously
async function initializeSupabase() {
    if (supabase) return supabase;
    
    try {
        const config = await configLoader.loadConfig();
        const supabaseUrl = config.SUPABASE_URL;
        const supabaseKey = config.SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Missing Supabase configuration');
        }
        
        supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            },
            global: {
                headers: {
                    'X-Client-Info': 'ramen-pos'
                }
            }
        });
        
        console.log('Supabase client initialized successfully');
        return supabase;
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        throw error;
    }
}

// Export the initialization function
export { initializeSupabase }

// For backward compatibility, export a getter
export const getSupabase = () => {
    if (!supabase) {
        throw new Error('Supabase not initialized. Call initializeSupabase() first.');
    }
    return supabase;
}

// Initialize immediately for global access
initializeSupabase().then((client) => {
    // Make it globally accessible
    window.supabase = client;
}).catch(error => {
    console.error('Failed to initialize Supabase globally:', error);
});

export default { initializeSupabase, getSupabase };
