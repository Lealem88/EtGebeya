-- Insert Users
INSERT INTO users (name, email, password, avatar, phone, location, joinDate, bio, trustScore, totalSold, totalRatings, isVerified) VALUES
('John Smith', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', '+1 (555) 123-4567', 'New York, NY', '2024-03-15', 'Tech enthusiast', 4.8, 47, 52, true),
('Sarah Johnson', 'sarah@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', '+1 (555) 234-5678', 'Los Angeles, CA', '2023-11-20', 'Professional photographer', 4.9, 83, 91, true);

-- Insert Categories
INSERT INTO categories (name, slug, icon, image) VALUES
('Phones', 'phones', '📱', '/categories/phones.jpg'),
('Laptops', 'laptops', '💻', '/categories/laptops.jpg'),
('Tablets', 'tablets', '📟', '/categories/tablets.jpg'),
('Headphones', 'headphones', '🎧', '/categories/headphones.jpg');

-- Insert Brands
INSERT INTO brands (category_slug, name, logo) VALUES
('phones', 'Apple', '🍎'),
('phones', 'Samsung', '🔷'),
('laptops', 'Apple', '🍎'),
('laptops', 'Dell', '💎');

-- Insert Models
INSERT INTO models (brand_id, name) VALUES
(1, 'iPhone 16 Pro Max'),
(1, 'iPhone 16 Pro'),
(2, 'Galaxy S25 Ultra'),
(3, 'MacBook Pro 16" M4 Max'),
(4, 'XPS 16');

-- Insert Products
INSERT INTO products (sellerId, title, description, price, category, brand, model, `condition`, location, isFeatured) VALUES
(1, 'iPhone 16 Pro Max 256GB - Natural Titanium', 'Brand new iPhone 16 Pro Max in Natural Titanium. 256GB storage, A18 Pro chip.', 1199.00, 'phones', 'Apple', 'iPhone 16 Pro Max', 'New', 'New York, NY', true),
(2, 'MacBook Pro 16" M4 Max - 48GB RAM', 'Top of the line MacBook Pro 16-inch with M4 Max chip.', 2799.00, 'laptops', 'Apple', 'MacBook Pro 16" M4 Max', 'Used', 'San Francisco, CA', true);

-- Insert Product Images
INSERT INTO product_images (product_id, image_url, is_cover) VALUES
(1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', true),
(2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', true);

-- Insert Specs
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES
(1, 'storage', '256GB'),
(1, 'ram', '8GB'),
(2, 'storage', '1TB SSD'),
(2, 'ram', '48GB');

-- Insert Features
INSERT INTO product_features (product_id, feature) VALUES
(1, '5G'),
(1, 'Face ID'),
(2, 'Liquid Retina XDR'),
(2, 'Thunderbolt 5');
