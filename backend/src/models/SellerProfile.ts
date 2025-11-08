import { pool } from '../config/database';

export interface ISellerProfile {
  id?: string;
  user_id: string;
  business_name: string;
  business_type?: 'individual' | 'business' | 'organization';
  description?: string;
  business_email?: string;
  business_phone?: string;
  business_address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  tax_id?: string;
  bank_account_info?: any; // Tokenized
  stripe_account_id?: string;
  stripe_onboarding_complete?: boolean;
  kyc_status?: 'pending' | 'verified' | 'rejected';
  kyc_documents?: any[];
  verification_notes?: string;
  settings?: {
    auto_accept_orders?: boolean;
    notification_preferences?: {
      email?: boolean;
      sms?: boolean;
    };
  };
  ratings?: {
    average: number;
    count: number;
  };
  total_sales?: number;
  total_orders?: number;
  commission_rate?: number;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export class SellerProfile {
  // Create seller profile
  static async create(data: ISellerProfile): Promise<ISellerProfile> {
    const query = `
      INSERT INTO seller_profiles (
        user_id, business_name, business_type, description, business_email, 
        business_phone, business_address, kyc_status, settings, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.user_id,
      data.business_name,
      data.business_type || 'individual',
      data.description || null,
      data.business_email || null,
      data.business_phone || null,
      JSON.stringify(data.business_address || {}),
      data.kyc_status || 'pending',
      JSON.stringify(data.settings || { auto_accept_orders: true, notification_preferences: { email: true, sms: false } }),
      data.is_active !== undefined ? data.is_active : true
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find seller by ID
  static async findById(id: string): Promise<ISellerProfile | null> {
    const query = 'SELECT * FROM seller_profiles WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find seller by user ID
  static async findByUserId(userId: string): Promise<ISellerProfile | null> {
    const query = 'SELECT * FROM seller_profiles WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  // Update seller profile
  static async update(id: string, data: Partial<ISellerProfile>): Promise<ISellerProfile | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.business_name !== undefined) {
      fields.push(`business_name = $${paramCount++}`);
      values.push(data.business_name);
    }
    if (data.business_type !== undefined) {
      fields.push(`business_type = $${paramCount++}`);
      values.push(data.business_type);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.business_email !== undefined) {
      fields.push(`business_email = $${paramCount++}`);
      values.push(data.business_email);
    }
    if (data.business_phone !== undefined) {
      fields.push(`business_phone = $${paramCount++}`);
      values.push(data.business_phone);
    }
    if (data.business_address !== undefined) {
      fields.push(`business_address = $${paramCount++}`);
      values.push(JSON.stringify(data.business_address));
    }
    if (data.stripe_account_id !== undefined) {
      fields.push(`stripe_account_id = $${paramCount++}`);
      values.push(data.stripe_account_id);
    }
    if (data.stripe_onboarding_complete !== undefined) {
      fields.push(`stripe_onboarding_complete = $${paramCount++}`);
      values.push(data.stripe_onboarding_complete);
    }
    if (data.kyc_status !== undefined) {
      fields.push(`kyc_status = $${paramCount++}`);
      values.push(data.kyc_status);
    }
    if (data.settings !== undefined) {
      fields.push(`settings = $${paramCount++}`);
      values.push(JSON.stringify(data.settings));
    }
    if (data.total_sales !== undefined) {
      fields.push(`total_sales = $${paramCount++}`);
      values.push(data.total_sales);
    }
    if (data.total_orders !== undefined) {
      fields.push(`total_orders = $${paramCount++}`);
      values.push(data.total_orders);
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.is_active);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE seller_profiles
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Get all sellers with filters
  static async findAll(filters?: {
    kyc_status?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ISellerProfile[]> {
    let query = `
      SELECT sp.*, u.name as user_name, u.email as user_email, u.avatar as user_avatar
      FROM seller_profiles sp
      JOIN users u ON sp.user_id = u.id
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.kyc_status) {
      query += ` AND sp.kyc_status = $${paramCount++}`;
      values.push(filters.kyc_status);
    }
    if (filters?.is_active !== undefined) {
      query += ` AND sp.is_active = $${paramCount++}`;
      values.push(filters.is_active);
    }

    query += ' ORDER BY sp.created_at DESC';

    if (filters?.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    }
    if (filters?.offset) {
      query += ` OFFSET $${paramCount++}`;
      values.push(filters.offset);
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Get seller statistics
  static async getStats(sellerId: string): Promise<any> {
    const query = `
      SELECT 
        sp.*,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_cents), 0) as total_revenue_cents,
        COUNT(DISTINCT CASE WHEN o.status = 'pending' THEN o.id END) as pending_orders,
        COUNT(DISTINCT p.id) as total_products,
        COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_products
      FROM seller_profiles sp
      LEFT JOIN orders o ON sp.id = o.seller_id
      LEFT JOIN products p ON sp.id = p.seller_id
      WHERE sp.id = $1
      GROUP BY sp.id
    `;

    const result = await pool.query(query, [sellerId]);
    return result.rows[0] || null;
  }
}

export default SellerProfile;
