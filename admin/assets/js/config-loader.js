// Environment Configuration Loader
class ConfigLoader {
    constructor() {
        this.config = null;
        this.isLoaded = false;
    }

    async loadConfig() {
        if (this.isLoaded) return this.config;

        try {
            // Wait a bit for script tags to load
            await this.waitForConfig();
            
            // First check if config is already loaded via script tag
            if (window.RAMENILA_CONFIG && window.RAMENILA_CONFIG.SUPABASE_URL) {
                this.config = window.RAMENILA_CONFIG;
                console.log('✅ Loaded config from window.RAMENILA_CONFIG');
                this.isLoaded = true;
                return this.config;
            }

            // Try to load config.js dynamically
            const possiblePaths = [
                '/config.js',
                '../config.js',
                '../../config.js',
                '../../../config.js'
            ];

            for (const path of possiblePaths) {
                try {
                    await this.loadScript(path);
                    if (window.RAMENILA_CONFIG && window.RAMENILA_CONFIG.SUPABASE_URL) {
                        this.config = window.RAMENILA_CONFIG;
                        console.log('✅ Loaded config from:', path);
                        this.isLoaded = true;
                        return this.config;
                    }
                } catch (e) {
                    // Try next path
                }
            }

            // If no config found, use embedded (empty) config
            console.warn('Could not load config.js from any path');
            this.config = this.getEmbeddedConfig();
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

    async waitForConfig(maxWait = 1000) {
        const start = Date.now();
        while (Date.now() - start < maxWait) {
            if (window.RAMENILA_CONFIG && window.RAMENILA_CONFIG.SUPABASE_URL) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return false;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
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
        // Configuration must be loaded from config.js file
        // Never commit API keys to the repository
        console.error('No config.js file found. Please copy config.example.js to config.js and add your Supabase credentials');
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
