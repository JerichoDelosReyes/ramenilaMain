-- Ramenila Database Setup Script
-- Execute this script in your Supabase SQL Editor to set up the complete database

-- Clean up existing tables (if any)
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop views if they exist
DROP VIEW IF EXISTS transaction_stats CASCADE;
DROP VIEW IF EXISTS low_stock_products CASCADE;
DROP VIEW IF EXISTS product_sales_analysis CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'pieces',
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'completed',
    status VARCHAR(50) NOT NULL DEFAULT 'completed',
    cashier_name VARCHAR(255),
    customer_name VARCHAR(255),
    notes TEXT,
    refund_reason TEXT,
    refund_notes TEXT,
    refund_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'cashier')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    password_hash TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_images table
CREATE TABLE product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name VARCHAR(255),
    image_size INTEGER,
    is_primary BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_transactions_date ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_payment_method ON transactions(payment_method);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- Insert default categories
INSERT INTO categories (name, display_name, description, image_url) VALUES
('ramen', 'Ramen', 'Traditional Japanese noodle soup', 'assets/img/ramen.png'),
('drinks', 'Drinks', 'Beverages and refreshments', 'assets/img/drinks.png'),
('desserts', 'Desserts', 'Sweet treats and desserts', 'assets/img/desserts.png'),
('sides', 'Sides', 'Side dishes and appetizers', 'assets/img/sides.png');

-- Insert sample products
INSERT INTO products (name, category, price, stock, min_stock, unit, description, image_url) VALUES
('Tonkotsu Ramen', 'ramen', 280.00, 50, 10, 'bowls', 'Rich pork bone broth with tender chashu', 'assets/img/ramen.png'),
('Shoyu Ramen', 'ramen', 260.00, 45, 10, 'bowls', 'Light soy sauce based broth', 'assets/img/ramen.png'),
('Miso Ramen', 'ramen', 270.00, 40, 10, 'bowls', 'Fermented soybean paste broth', 'assets/img/ramen.png'),
('Gyoza (6 pcs)', 'sides', 120.00, 100, 20, 'pieces', 'Pan-fried pork dumplings', 'assets/img/sides.png'),
('Chicken Karaage', 'sides', 150.00, 80, 15, 'pieces', 'Japanese fried chicken', 'assets/img/sides.png'),
('Green Tea', 'drinks', 80.00, 200, 30, 'cups', 'Hot Japanese green tea', 'assets/img/drinks.png'),
('Soft Drinks', 'drinks', 60.00, 150, 25, 'cans', 'Assorted soft drinks', 'assets/img/drinks.png'),
('Mochi Ice Cream', 'desserts', 90.00, 60, 10, 'pieces', 'Sweet rice cake with ice cream', 'assets/img/desserts.png'),
('Dorayaki', 'desserts', 110.00, 40, 8, 'pieces', 'Pancake sandwich with filling', 'assets/img/desserts.png');

-- Insert default settings
INSERT INTO settings (key, value, category, description) VALUES
('general_theme', '"light"', 'general', 'Application theme'),
('general_language', '"en"', 'general', 'Application language'),
('general_currency', '"PHP"', 'general', 'Default currency'),
('general_timezone', '"Asia/Manila"', 'general', 'Default timezone'),
('general_date_format', '"MM/DD/YYYY"', 'general', 'Date format'),
('general_time_format', '"12"', 'general', 'Time format'),
('restaurant_name', '"Ramenila"', 'restaurant', 'Restaurant name'),
('restaurant_address', '""', 'restaurant', 'Restaurant address'),
('restaurant_phone', '""', 'restaurant', 'Restaurant phone'),
('restaurant_email', '""', 'restaurant', 'Restaurant email'),
('pos_cash_enabled', 'true', 'pos', 'Enable cash payments'),
('pos_card_enabled', 'true', 'pos', 'Enable card payments'),
('pos_mobile_enabled', 'false', 'pos', 'Enable mobile payments'),
('pos_tax_rate', '8.25', 'pos', 'Tax rate percentage'),
('pos_tip_suggestions', '"15,18,20,25"', 'pos', 'Tip suggestions'),
('pos_auto_print', 'true', 'pos', 'Auto print receipts'),
('pos_email_receipts', 'false', 'pos', 'Email receipts'),
('pos_receipt_footer', '"Thank you for visiting Ramenila!"', 'pos', 'Receipt footer text');

-- Insert default users
INSERT INTO users (name, email, role, status, last_login) VALUES
('Admin User', 'jericho.dlsreyes@gmail.com', 'admin', 'active', NOW()),
('Manager User', 'justinecoronel001@gmail.com', 'manager', 'active', NOW() - INTERVAL '1 day'),
('Cashier User', 'norona.leeadrian022804@gmail.com', 'cashier', 'active', NOW() - INTERVAL '2 days');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for authentication)
CREATE POLICY "Enable all operations for all users" ON products FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON transactions FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON settings FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON categories FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON product_images FOR ALL USING (true);

-- Create useful views
CREATE VIEW transaction_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_transactions,
    SUM(total) as total_revenue,
    AVG(total) as average_order_value,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
    COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_transactions
FROM transactions
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW low_stock_products AS
SELECT 
    id,
    name,
    category,
    stock,
    min_stock,
    (min_stock - stock) as stock_deficit
FROM products
WHERE stock <= min_stock AND is_active = true
ORDER BY stock_deficit DESC;

-- Add comments
COMMENT ON DATABASE postgres IS 'Ramenila Restaurant Management System Database';
COMMENT ON TABLE products IS 'Product inventory and catalog';
COMMENT ON TABLE transactions IS 'Transaction history and sales records';
COMMENT ON TABLE users IS 'System users and staff management';
COMMENT ON TABLE settings IS 'Application configuration settings';
COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE product_images IS 'Product image storage references';

-- Success message
SELECT 'Ramenila database setup completed successfully!' as message;
