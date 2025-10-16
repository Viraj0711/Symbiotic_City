import { pool } from '../config/database';
import { IOrder } from '../config/database';

export class Order {
  // Create a new order
  static async create(orderData: Partial<IOrder>): Promise<IOrder> {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO orders (
        order_id, buyer_id, seller_id, product_id, site_id,
        order_details, delivery, payment, status, sustainability
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      orderId,
      orderData.buyer_id,
      orderData.seller_id,
      orderData.product_id,
      orderData.site_id || null,
      JSON.stringify(orderData.order_details),
      JSON.stringify(orderData.delivery),
      JSON.stringify(orderData.payment),
      orderData.status || 'pending',
      JSON.stringify(orderData.sustainability || {
        carbon_offset: 0,
        sustainability_score: 0,
        certifications: []
      })
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Find order by ID
  static async findById(id: string): Promise<IOrder | null> {
    const query = 'SELECT * FROM orders WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Find order by order_id
  static async findByOrderId(orderId: string): Promise<IOrder | null> {
    const query = 'SELECT * FROM orders WHERE order_id = $1';
    const result = await pool.query(query, [orderId]);
    return result.rows[0] || null;
  }

  // Find all orders with filters
  static async findAll(filters?: {
    buyer_id?: string;
    seller_id?: string;
    status?: string;
  }): Promise<IOrder[]> {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (filters?.buyer_id) {
      query += ` AND buyer_id = $${paramCount++}`;
      values.push(filters.buyer_id);
    }
    if (filters?.seller_id) {
      query += ` AND seller_id = $${paramCount++}`;
      values.push(filters.seller_id);
    }
    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update order status
  static async updateStatus(id: string, status: string): Promise<IOrder | null> {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  // Delete order
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM orders WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export default Order;