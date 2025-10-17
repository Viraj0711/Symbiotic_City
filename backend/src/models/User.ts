import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import { IUser } from '../config/database';

export class User {
  // Create a new user
  static async create(userData: Partial<IUser>): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userData.password!, 12);
    
    const query = `
      INSERT INTO users (name, email, password, avatar, bio, location, role, gender, site_owner_data, preferences, wallet, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    
    const values = [
      userData.name,
      userData.email?.toLowerCase(),
      hashedPassword,
      userData.avatar || null,
      userData.bio || null,
      userData.location || null,
      userData.role || 'USER',
      userData.gender || 'prefer-not-to-say',
      JSON.stringify(userData.site_owner_data || null),
      JSON.stringify(userData.preferences || {
        energy_types: ['hydrogen', 'solar', 'wind'],
        price_range: { min: 0, max: 1000 },
        delivery_radius: 50
      }),
      JSON.stringify(userData.wallet || {
        balance: 0,
        green_credits: 100,
        carbon_offset: 0
      }),
      userData.is_active !== undefined ? userData.is_active : true,
      userData.email_verified !== undefined ? userData.email_verified : false
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<IUser | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  // Update user
  static async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email.toLowerCase());
    }
    if (userData.password !== undefined) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      fields.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (userData.avatar !== undefined) {
      fields.push(`avatar = $${paramCount++}`);
      values.push(userData.avatar);
    }
    if (userData.bio !== undefined) {
      fields.push(`bio = $${paramCount++}`);
      values.push(userData.bio);
    }
    if (userData.location !== undefined) {
      fields.push(`location = $${paramCount++}`);
      values.push(userData.location);
    }
    if (userData.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }
    if (userData.last_login !== undefined) {
      fields.push(`last_login = $${paramCount++}`);
      values.push(userData.last_login);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Delete user
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Compare password
  static async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  // Find all users with filters
  static async findAll(filters?: { role?: string; is_active?: boolean }): Promise<IUser[]> {
    let query = 'SELECT * FROM users WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.role) {
      query += ` AND role = $${paramCount++}`;
      values.push(filters.role);
    }
    if (filters?.is_active !== undefined) {
      query += ` AND is_active = $${paramCount++}`;
      values.push(filters.is_active);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }
}

export default User;