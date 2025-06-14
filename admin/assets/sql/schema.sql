-- Ramenila Database Schema for Supabase (PostgreSQL)
-- Execute this SQL code in your Supabase SQL Editor

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
    category VARCHAR(100) NOT NULL, -- Keep for backward compatibility
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
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
    change_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (change_amount >= 0),
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

-- Create users table (for user management)
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

-- Create product_images table for image management
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

-- Create a view for transaction statistics
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

-- Create a view for low stock products
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

-- Create a view for product sales analysis
CREATE VIEW product_sales_analysis AS
SELECT 
    p.id,
    p.name,
    p.category,
    COUNT(t.id) as total_orders,
    SUM(CAST(item->>'quantity' AS INTEGER)) as total_quantity_sold,
    SUM(CAST(item->>'quantity' AS INTEGER) * CAST(item->>'price' AS DECIMAL)) as total_revenue
FROM products p
LEFT JOIN transactions t ON t.items @> JSON_BUILD_ARRAY(JSON_BUILD_OBJECT('name', p.name))
LEFT JOIN LATERAL JSON_ARRAY_ELEMENTS(t.items) AS item ON true
WHERE item->>'name' = p.name
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC;

COMMENT ON DATABASE postgres IS 'Ramenila Restaurant Management System Database';
COMMENT ON TABLE products IS 'Product inventory and catalog';
COMMENT ON TABLE transactions IS 'Transaction history and sales records';
COMMENT ON TABLE users IS 'System users and staff management';
COMMENT ON TABLE settings IS 'Application configuration settings';
COMMENT ON TABLE categories IS 'Product categories';
COMMENT ON TABLE product_images IS 'Product image storage references';
    