-- Migration: Add Seller Tables and Update User Table
-- Description: Adds seller_profiles, products, orders, payments, and payouts tables

-- Add seller role to users table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'user_role_enum'
  ) THEN
    CREATE TYPE user_role_enum AS ENUM ('USER', 'SELLER', 'SITE_OWNER', 'ADMIN', 'MODERATOR');
  END IF;
END $$;

-- Update users table to support seller role
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS seller_profile_id UUID;

-- Create seller_profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100), -- 'individual', 'business', 'organization'
  description TEXT,
  business_email VARCHAR(255),
  business_phone VARCHAR(50),
  business_address JSONB, -- {street, city, state, postal_code, country}
  tax_id VARCHAR(100), -- Business tax ID or SSN (encrypted)
  bank_account_info JSONB, -- Tokenized bank info (DO NOT store raw details)
  stripe_account_id VARCHAR(255), -- Stripe Connect account ID
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  kyc_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  kyc_documents JSONB[], -- Array of document metadata
  verification_notes TEXT,
  settings JSONB DEFAULT '{"auto_accept_orders": true, "notification_preferences": {"email": true, "sms": false}}',
  ratings JSONB DEFAULT '{"average": 0, "count": 0}',
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00, -- Platform commission percentage
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(300) UNIQUE,
  description TEXT,
  short_description VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price_cents INTEGER NOT NULL, -- Store price in cents to avoid floating point issues
  compare_at_price_cents INTEGER, -- Original price for showing discounts
  currency VARCHAR(3) DEFAULT 'USD',
  sku VARCHAR(100),
  barcode VARCHAR(100),
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  weight_grams INTEGER, -- Product weight for shipping calculations
  dimensions JSONB, -- {length, width, height, unit}
  images JSONB[], -- Array of image URLs with metadata
  thumbnail VARCHAR(500), -- Main product image
  tags TEXT[], -- Array of tags for search/filtering
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'archived', 'out_of_stock'
  visibility VARCHAR(50) DEFAULT 'visible', -- 'visible', 'hidden'
  featured BOOLEAN DEFAULT FALSE,
  is_digital BOOLEAN DEFAULT FALSE, -- Digital vs physical product
  digital_file_url VARCHAR(500), -- For digital products
  shipping_required BOOLEAN DEFAULT TRUE,
  shipping_options JSONB, -- Array of shipping methods and costs
  meta_title VARCHAR(255), -- SEO
  meta_description TEXT, -- SEO
  variant_options JSONB, -- {color: ['red', 'blue'], size: ['S', 'M', 'L']}
  reviews_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_variants table (for products with options like size/color)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  option1_name VARCHAR(100), -- e.g., 'Size'
  option1_value VARCHAR(100), -- e.g., 'Medium'
  option2_name VARCHAR(100), -- e.g., 'Color'
  option2_value VARCHAR(100), -- e.g., 'Blue'
  option3_name VARCHAR(100),
  option3_value VARCHAR(100),
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER,
  stock INTEGER DEFAULT 0,
  image_url VARCHAR(500),
  barcode VARCHAR(100),
  weight_grams INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- Human-readable order number
  buyer_id UUID NOT NULL REFERENCES users(id),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled', -- 'unfulfilled', 'fulfilled', 'partially_fulfilled'
  
  -- Order totals (all in cents)
  subtotal_cents INTEGER NOT NULL,
  shipping_cost_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Shipping info
  shipping_address JSONB NOT NULL, -- {name, street, city, state, postal_code, country, phone}
  billing_address JSONB, -- Can be same as shipping
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  estimated_delivery_date DATE,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  
  -- Additional data
  customer_notes TEXT,
  seller_notes TEXT,
  cancel_reason TEXT,
  refund_reason TEXT,
  items JSONB NOT NULL, -- Array of order items with product details
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_intent_id VARCHAR(255) UNIQUE, -- Stripe PaymentIntent ID
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL, -- 'card', 'bank_transfer', 'wallet'
  payment_method_details JSONB, -- {brand: 'visa', last4: '4242', country: 'US'}
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'cancelled', 'refunded'
  gateway VARCHAR(50) DEFAULT 'stripe', -- 'stripe', 'razorpay', 'paypal'
  gateway_response JSONB, -- Store full gateway response for debugging
  platform_fee_cents INTEGER DEFAULT 0, -- Platform commission
  seller_amount_cents INTEGER NOT NULL, -- Amount going to seller after fees
  failure_reason TEXT,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payouts table (for paying sellers)
CREATE TABLE IF NOT EXISTS payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'paid', 'failed', 'cancelled'
  payout_method VARCHAR(50) DEFAULT 'bank_transfer', -- 'bank_transfer', 'stripe_connect'
  gateway_payout_id VARCHAR(255), -- External payout ID (Stripe Transfer ID)
  gateway_response JSONB,
  orders_included UUID[], -- Array of order IDs included in this payout
  scheduled_date DATE,
  transferred_at TIMESTAMP,
  failure_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images TEXT[], -- Array of review image URLs
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_stripe_account ON seller_profiles(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_intent_id ON payments(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payouts_seller_id ON payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_seller_profiles_updated_at BEFORE UPDATE ON seller_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for testing)
-- You can uncomment these if you want seed data

-- Sample seller profile
-- INSERT INTO seller_profiles (user_id, business_name, business_type, description, business_email, kyc_status)
-- VALUES (
--   (SELECT id FROM users LIMIT 1),
--   'Green Energy Solutions',
--   'business',
--   'We provide sustainable energy products for homes and businesses',
--   'sales@greenenergy.com',
--   'verified'
-- );

COMMENT ON TABLE seller_profiles IS 'Stores seller/vendor profile information including KYC and payment details';
COMMENT ON TABLE products IS 'Product catalog for marketplace sellers';
COMMENT ON TABLE product_variants IS 'Product variations (e.g., different sizes, colors)';
COMMENT ON TABLE orders IS 'Customer orders from marketplace sellers';
COMMENT ON TABLE payments IS 'Payment transactions linked to orders';
COMMENT ON TABLE payouts IS 'Payouts to sellers for completed orders';
COMMENT ON TABLE product_reviews IS 'Customer reviews and ratings for products';
