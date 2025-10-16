import { pool } from '../config/database';
import { IEnergyProduct } from '../config/database';

export class EnergyProduct {
  // Create a new energy product
  static async create(productData: Partial<IEnergyProduct>): Promise<IEnergyProduct> {
    const query = `
      INSERT INTO energy_products (
        title, description, category, site_id, owner_id,
        pricing, availability, specifications, delivery,
        location, images, certifications, status, featured, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;
    
    const values = [
      productData.title,
      productData.description,
      productData.category,
      productData.site_id || null,
      productData.owner_id,
      JSON.stringify(productData.pricing),
      JSON.stringify(productData.availability),
      JSON.stringify(productData.specifications),
      JSON.stringify(productData.delivery),
      JSON.stringify(productData.location),
      productData.images || [],
      productData.certifications || [],
      productData.status || 'pending_approval',
      productData.featured || false,
      productData.tags || []
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find product by ID
  static async findById(id: string): Promise<IEnergyProduct | null> {
    const query = 'SELECT * FROM energy_products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find all products with filters
  static async findAll(filters?: {
    category?: string;
    owner_id?: string;
    status?: string;
    featured?: boolean;
  }): Promise<IEnergyProduct[]> {
    let query = 'SELECT * FROM energy_products WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.category) {
      query += ` AND category = $${paramCount++}`;
      values.push(filters.category);
    }
    if (filters?.owner_id) {
      query += ` AND owner_id = $${paramCount++}`;
      values.push(filters.owner_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters?.featured !== undefined) {
      query += ` AND featured = $${paramCount++}`;
      values.push(filters.featured);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update product
  static async update(id: string, productData: Partial<IEnergyProduct>): Promise<IEnergyProduct | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (productData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(productData.title);
    }
    if (productData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(productData.description);
    }
    if (productData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(productData.status);
    }
    if (productData.featured !== undefined) {
      fields.push(`featured = $${paramCount++}`);
      values.push(productData.featured);
    }
    if (productData.pricing !== undefined) {
      fields.push(`pricing = $${paramCount++}`);
      values.push(JSON.stringify(productData.pricing));
    }
    if (productData.availability !== undefined) {
      fields.push(`availability = $${paramCount++}`);
      values.push(JSON.stringify(productData.availability));
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE energy_products 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete product
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM energy_products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Increment view count
  static async incrementViews(id: string): Promise<void> {
    const query = `
      UPDATE energy_products 
      SET analytics = jsonb_set(
        analytics,
        '{views}',
        to_jsonb((analytics->>'views')::int + 1)
      )
      WHERE id = $1
    `;
    await pool.query(query, [id]);
  }
}

export default EnergyProduct;