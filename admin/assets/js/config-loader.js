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
                // For development, try to load from env.config file via fetch
                try {
                    const response = await fetch('/env.config');
                    if (response.ok) {
                        const envText = await response.text();
                        this.config = this.parseEnvFile(envText);
                    } else {
                        // Fallback to embedded config for development
                        this.config = this.getEmbeddedConfig();
                    }
                } catch (error) {
                    console.warn('Could not load env.config file, using embedded config:', error);
                    this.config = this.getEmbeddedConfig();
                }
            } else {
                // For production, also try to load from env.config file
                try {
                    const response = await fetch('/env.config');
                    if (response.ok) {
                        const envText = await response.text();
                        this.config = this.parseEnvFile(envText);
                    } else {
                        this.config = this.getEmbeddedConfig();
                    }
                } catch (error) {
                    console.warn('Could not load env.config file:', error);
                    this.config = this.getEmbeddedConfig();
                }
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
        // Configuration must be loaded from env.config file
        // Never commit API keys to the repository
        console.error('No env.config file found. Please create an env.config file with SUPABASE_URL and SUPABASE_ANON_KEY');
        return {
            SUPABASE_URL: '',
            SUPABASE_ANON_KEY: ''
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
