import { pool } from '../config/database';

export interface IProduct {
  id?: string;
  seller_id: string;
  title: string;
  slug?: string;
  description?: string;
  short_description?: string;
  category: string;
  subcategory?: string;
  price_cents: number;
  compare_at_price_cents?: number;
  currency?: string;
  sku?: string;
  barcode?: string;
  stock?: number;
  low_stock_threshold?: number;
  weight_grams?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  images?: any[];
  thumbnail?: string;
  tags?: string[];
  status?: 'draft' | 'active' | 'archived' | 'out_of_stock';
  visibility?: 'visible' | 'hidden';
  featured?: boolean;
  is_digital?: boolean;
  digital_file_url?: string;
  shipping_required?: boolean;
  shipping_options?: any;
  meta_title?: string;
  meta_description?: string;
  variant_options?: any;
  reviews_count?: number;
  average_rating?: number;
  views_count?: number;
  sales_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class Product {
  // Create product
  static async create(data: IProduct): Promise<IProduct> {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const query = `
      INSERT INTO products (
        seller_id, title, slug, description, short_description, category, subcategory,
        price_cents, compare_at_price_cents, currency, sku, barcode, stock, low_stock_threshold,
        weight_grams, dimensions, images, thumbnail, tags, status, visibility, featured,
        is_digital, digital_file_url, shipping_required, shipping_options,
        meta_title, meta_description, variant_options
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
      RETURNING *
    `;

    const values = [
      data.seller_id,
      data.title,
      slug,
      data.description || null,
      data.short_description || null,
      data.category,
      data.subcategory || null,
      data.price_cents,
      data.compare_at_price_cents || null,
      data.currency || 'USD',
      data.sku || null,
      data.barcode || null,
      data.stock || 0,
      data.low_stock_threshold || 10,
      data.weight_grams || null,
      JSON.stringify(data.dimensions || {}),
      JSON.stringify(data.images || []),
      data.thumbnail || null,
      data.tags || [],
      data.status || 'draft',
      data.visibility || 'visible',
      data.featured || false,
      data.is_digital || false,
      data.digital_file_url || null,
      data.shipping_required !== undefined ? data.shipping_required : true,
      JSON.stringify(data.shipping_options || {}),
      data.meta_title || data.title,
      data.meta_description || data.short_description || null,
      JSON.stringify(data.variant_options || {})
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find product by ID
  static async findById(id: string): Promise<IProduct | null> {
    const query = `
      SELECT p.*, sp.business_name as seller_name
      FROM products p
      LEFT JOIN seller_profiles sp ON p.seller_id = sp.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find product by slug
  static async findBySlug(slug: string): Promise<IProduct | null> {
    const query = `
      SELECT p.*, sp.business_name as seller_name
      FROM products p
      LEFT JOIN seller_profiles sp ON p.seller_id = sp.id
      WHERE p.slug = $1
    `;
    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  // Update product
  static async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
      // Update slug if title changes
      const newSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      fields.push(`slug = $${paramCount++}`);
      values.push(newSlug);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.short_description !== undefined) {
      fields.push(`short_description = $${paramCount++}`);
      values.push(data.short_description);
    }
    if (data.category !== undefined) {
      fields.push(`category = $${paramCount++}`);
      values.push(data.category);
    }
    if (data.subcategory !== undefined) {
      fields.push(`subcategory = $${paramCount++}`);
      values.push(data.subcategory);
    }
    if (data.price_cents !== undefined) {
      fields.push(`price_cents = $${paramCount++}`);
      values.push(data.price_cents);
    }
    if (data.compare_at_price_cents !== undefined) {
      fields.push(`compare_at_price_cents = $${paramCount++}`);
      values.push(data.compare_at_price_cents);
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramCount++}`);
      values.push(data.stock);
    }
    if (data.images !== undefined) {
      fields.push(`images = $${paramCount++}`);
      values.push(JSON.stringify(data.images));
    }
    if (data.thumbnail !== undefined) {
      fields.push(`thumbnail = $${paramCount++}`);
      values.push(data.thumbnail);
    }
    if (data.tags !== undefined) {
      fields.push(`tags = $${paramCount++}`);
      values.push(data.tags);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.visibility !== undefined) {
      fields.push(`visibility = $${paramCount++}`);
      values.push(data.visibility);
    }
    if (data.featured !== undefined) {
      fields.push(`featured = $${paramCount++}`);
      values.push(data.featured);
    }
    if (data.shipping_required !== undefined) {
      fields.push(`shipping_required = $${paramCount++}`);
      values.push(data.shipping_required);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete product
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Find all products with filters
  static async findAll(filters?: {
    seller_id?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ products: IProduct[]; total: number }> {
    let query = `
      SELECT p.*, sp.business_name as seller_name
      FROM products p
      LEFT JOIN seller_profiles sp ON p.seller_id = sp.id
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.seller_id) {
      query += ` AND p.seller_id = $${paramCount++}`;
      values.push(filters.seller_id);
    }
    if (filters?.category) {
      query += ` AND p.category = $${paramCount++}`;
      values.push(filters.category);
    }
    if (filters?.status) {
      query += ` AND p.status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters?.featured !== undefined) {
      query += ` AND p.featured = $${paramCount++}`;
      values.push(filters.featured);
    }
    if (filters?.search) {
      query += ` AND (p.title ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }
    if (filters?.min_price) {
      query += ` AND p.price_cents >= $${paramCount++}`;
      values.push(filters.min_price);
    }
    if (filters?.max_price) {
      query += ` AND p.price_cents <= $${paramCount++}`;
      values.push(filters.max_price);
    }

    // Get total count
    const countQuery = query.replace('SELECT p.*, sp.business_name as seller_name', 'SELECT COUNT(*) as total');
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    query += ' ORDER BY p.created_at DESC';

    if (filters?.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    }
    if (filters?.offset) {
      query += ` OFFSET $${paramCount++}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return { products: result.rows, total };
  }

  // Increment view count
  static async incrementViews(id: string): Promise<void> {
    const query = 'UPDATE products SET views_count = views_count + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Update stock
  static async updateStock(id: string, quantity: number): Promise<IProduct | null> {
    const query = `
      UPDATE products
      SET stock = stock + $1,
          status = CASE 
            WHEN stock + $1 <= 0 THEN 'out_of_stock'
            ELSE status
          END
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, id]);
    return result.rows[0] || null;
  }
}

export default Product;
