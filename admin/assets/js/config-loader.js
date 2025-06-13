// Environment Configuration Loader
class ConfigLoader {
    constructor() {
        this.config = null;
        this.isLoaded = false;
    }

    async loadConfig() {
        if (this.isLoaded) return this.config;

        try {
            // For client-side apps, we need to handle env vars differently
            // In a production environment, these should be injected at build time
            
            // Check if we're running in development with a local server
            const isDev = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('local');

            if (isDev) {
                // For development, try to load from .env file via fetch
                try {
                    const response = await fetch('/.env');
                    if (response.ok) {
                        const envText = await response.text();
                        this.config = this.parseEnvFile(envText);
                    } else {
                        // Fallback to embedded config for development
                        this.config = this.getEmbeddedConfig();
                    }
                } catch (error) {
                    console.warn('Could not load .env file, using embedded config:', error);
                    this.config = this.getEmbeddedConfig();
                }
            } else {
                // For production, use environment variables or embedded config
                this.config = {
                    SUPABASE_URL: process.env.SUPABASE_URL || this.getEmbeddedConfig().SUPABASE_URL,
                    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || this.getEmbeddedConfig().SUPABASE_ANON_KEY
                };
            }

            this.isLoaded = true;
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Fallback to embedded config
            this.config = this.getEmbeddedConfig();
            this.isLoaded = true;
            return this.config;
        }
    }

    parseEnvFile(envText) {
        const config = {};
        const lines = envText.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    config[key.trim()] = valueParts.join('=').trim();
                }
            }
        }
        
        return config;
    }

    getEmbeddedConfig() {
        // This is a fallback - in production, these should come from environment variables
        return {
            SUPABASE_URL: 'https://quhvblahkpwxdurcuahx.supabase.co',
            SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aHZibGFoa3B3eGR1cmN1YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDQ3OTcsImV4cCI6MjA2NTMyMDc5N30.Eg_s-CUIvtlzRZcZwJGp6Ipn6uWK9FctcN914p89hTU'
        };
    }

    get(key) {
        if (!this.isLoaded) {
            throw new Error('Configuration not loaded. Call loadConfig() first.');
        }
        return this.config[key];
    }
}

// Create a singleton instance
const configLoader = new ConfigLoader();

export default configLoader;
