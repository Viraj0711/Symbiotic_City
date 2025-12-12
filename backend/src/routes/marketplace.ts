import express from 'express';
import { EnergyProduct } from '../models/EnergyProduct';
import { Order } from '../models/Order';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { pool } from '../config/database';

const router = express.Router();

// Get all energy products (with filters and pagination)
router.get('/products', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      status = 'active',
      sortBy = 'featured',
      page = '1',
      limit = '20',
      search
    } = req.query;

    // Build WHERE clause with parameterized queries (prevents SQL injection)
    const conditions: string[] = ['status = $1'];
    const values: any[] = [status];
    let paramCount = 2;

    if (category && category !== 'all') {
      conditions.push(`category = $${paramCount++}`);
      values.push(category);
    }

    if (minPrice) {
      conditions.push(`(pricing->>'amount')::numeric >= $${paramCount++}`);
      values.push(Number(minPrice));
    }

    if (maxPrice) {
      conditions.push(`(pricing->>'amount')::numeric <= $${paramCount++}`);
      values.push(Number(maxPrice));
    }

    if (search) {
      conditions.push(`(
        title ILIKE $${paramCount} OR 
        description ILIKE $${paramCount} OR 
        $${paramCount + 1} = ANY(tags)
      )`);
      values.push(`%${search}%`, search);
      paramCount += 2;
    }

    // Build ORDER BY clause (prevent SQL injection by whitelisting)
    let orderBy = 'featured DESC, created_at DESC';
    switch (sortBy) {
      case 'price_low':
        orderBy = "(pricing->>'amount')::numeric ASC";
        break;
      case 'price_high':
        orderBy = "(pricing->>'amount')::numeric DESC";
        break;
      case 'newest':
        orderBy = 'created_at DESC';
        break;
    }

    const whereClause = conditions.join(' AND ');
    const offset = (Number(page) - 1) * Number(limit);

    // Get products with parameterized query
    const productsQuery = `
      SELECT * FROM energy_products 
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    values.push(Number(limit), offset);

    const productsResult = await pool.query(productsQuery, values);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM energy_products WHERE ${whereClause}`;
    const countResult = await pool.query(countQuery, values.slice(0, -2));

    const total = parseInt(countResult.rows[0].count);

    res.json({
      products: productsResult.rows,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await EnergyProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    await EnergyProduct.incrementViews(req.params.id);

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create new energy product (site owners only)
router.post('/products', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    
    // Check if user is a site owner
    if (user.role !== 'SITE_OWNER') {
      return res.status(403).json({ message: 'Only site owners can create products' });
    }

    // Whitelist allowed fields to prevent mass assignment
    const {
      title,
      description,
      category,
      site_id,
      pricing,
      availability,
      specifications,
      delivery,
      location,
      images,
      certifications,
      tags
    } = req.body;

    const product = await EnergyProduct.create({
      title,
      description,
      category,
      site_id,
      owner_id: user.id,
      pricing,
      availability,
      specifications,
      delivery,
      location,
      images,
      certifications,
      tags,
      status: 'pending_approval' // Always set status server-side
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product' });
  }
});

// Update energy product (owner only)
router.put('/products/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const product = await EnergyProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner_id !== user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Whitelist allowed fields
    const {
      title,
      description,
      pricing,
      availability,
      specifications,
      delivery,
      location,
      images,
      certifications,
      tags
    } = req.body;

    await EnergyProduct.update(req.params.id, {
      title,
      description,
      pricing,
      availability,
      specifications,
      delivery,
      location,
      images,
      certifications,
      tags
    });
    const updatedProduct = await EnergyProduct.findById(req.params.id);

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product' });
  }
});

// Delete energy product (owner only)
router.delete('/products/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const product = await EnergyProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner_id !== user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await EnergyProduct.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Get site owner's products and analytics
router.get('/owner/dashboard', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;

    if (user.role !== 'SITE_OWNER') {
      return res.status(403).json({ message: 'Only site owners can access this endpoint' });
    }

    // Get products with parameterized query
    const productsQuery = 'SELECT * FROM energy_products WHERE owner_id = $1';
    const productsResult = await pool.query(productsQuery, [user.id]);
    const products = productsResult.rows;
    
    // Calculate dashboard statistics
    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalRevenue: products.reduce((sum, p) => sum + ((p.analytics?.revenue as number) || 0), 0),
      totalViews: products.reduce((sum, p) => sum + ((p.analytics?.views as number) || 0), 0),
      totalInquiries: products.reduce((sum, p) => sum + ((p.analytics?.inquiries as number) || 0), 0),
      totalSales: products.reduce((sum, p) => sum + ((p.analytics?.sales as number) || 0), 0)
    };

    // Get recent orders with parameterized query
    const ordersQuery = `
      SELECT * FROM orders 
      WHERE seller_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    const ordersResult = await pool.query(ordersQuery, [user.id]);

    res.json({
      stats,
      products,
      recentOrders: ordersResult.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Create order
router.post('/orders', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const { productId, quantity, deliveryAddress, paymentMethod } = req.body;

    // Validate required fields
    if (!productId || !quantity || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate quantity is a positive number
    if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Validate UUID format for productId
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(productId)) {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }

    const product = await EnergyProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check availability
    const availableQty = (product.availability as any)?.quantity || 0;
    if (availableQty < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    const pricing = product.pricing as any;
    const totalPrice = pricing.amount * quantity;

    const order = await Order.create({
      buyer_id: user.id,
      seller_id: product.owner_id,
      product_id: productId,
      site_id: product.site_id,
      order_details: {
        quantity,
        unit: pricing.unit,
        unit_price: pricing.amount,
        total_price: totalPrice,
        currency: pricing.currency
      },
      delivery: {
        method: req.body.deliveryMethod || 'delivery',
        address: deliveryAddress,
        scheduled_date: req.body.scheduledDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        cost: (product.delivery as any)?.cost || 0
      },
      payment: {
        method: paymentMethod,
        status: 'pending',
        green_credits_used: req.body.greenCreditsUsed || 0,
        cash_amount: totalPrice - (req.body.greenCreditsUsed || 0)
      }
    });

    // Update product analytics and quantity
    const updateQuery = `
      UPDATE energy_products 
      SET 
        analytics = jsonb_set(
          COALESCE(analytics, '{}'::jsonb), 
          '{inquiries}', 
          to_jsonb(COALESCE((analytics->>'inquiries')::int, 0) + 1)
        ),
        availability = jsonb_set(
          availability, 
          '{quantity}', 
          to_jsonb(GREATEST(0, (availability->>'quantity')::int - $2))
        )
      WHERE id = $1
    `;
    await pool.query(updateQuery, [productId, quantity]);

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Error creating order' });
  }
});

// Get user's orders
router.get('/orders', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const { type = 'buyer' } = req.query;

    const filterField = type === 'buyer' ? 'buyer_id' : 'seller_id';
    const ordersQuery = `
      SELECT * FROM orders 
      WHERE ${filterField} = $1 
      ORDER BY created_at DESC
    `;
    const ordersResult = await pool.query(ordersQuery, [user.id]);

    res.json(ordersResult.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to update status
    if (order.seller_id !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Add to timeline
    const currentTimeline = ((order as any).timeline as any[]) || [];
    const newTimelineEntry = {
      status,
      timestamp: new Date().toISOString(),
      note: `Status updated by ${user.email}`
    };
    currentTimeline.push(newTimelineEntry);

    // Update order with parameterized query
    const updateQuery = `
      UPDATE orders 
      SET 
        status = $1,
        timeline = $2::jsonb,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(updateQuery, [
      status,
      JSON.stringify(currentTimeline),
      req.params.id
    ]);

    // If order is completed, update product analytics
    if (status === 'completed') {
      const analyticsQuery = `
        UPDATE energy_products 
        SET analytics = jsonb_set(
          COALESCE(analytics, '{}'::jsonb), 
          '{sales}', 
          to_jsonb(COALESCE((analytics->>'sales')::int, 0) + 1)
        )
        WHERE id = $1
      `;
      await pool.query(analyticsQuery, [order.product_id]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Error updating order status' });
  }
});

export default router;
