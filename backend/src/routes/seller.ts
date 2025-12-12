import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest, requireSellerOrAdmin } from '../middleware/auth.js';
import { SellerProfile, ISellerProfile } from '../models/SellerProfile.js';
import { Product } from '../models/ProductModel.js';
import { User } from '../models/User.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Apply authentication to all seller routes
router.use(authenticateToken);

// Create/Apply for seller account
router.post(
  '/apply',
  [
    body('business_name').trim().isLength({ min: 2, max: 255 }).withMessage('Business name must be between 2 and 255 characters'),
    body('business_type').optional().isIn(['individual', 'business', 'organization']).withMessage('Invalid business type'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Description too long'),
    body('business_email').optional().isEmail().withMessage('Invalid business email'),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if user already has a seller profile
      const existingProfile = await SellerProfile.findByUserId(req.user.id);
      if (existingProfile) {
        return res.status(409).json({ error: 'You already have a seller profile' });
      }

      const {
        business_name,
        business_type,
        description,
        business_email,
        business_phone,
        business_address
      } = req.body;

      // Create seller profile
      const sellerProfile = await SellerProfile.create({
        user_id: req.user.id,
        business_name,
        business_type: business_type || 'individual',
        description,
        business_email: business_email || req.user.email,
        business_phone,
        business_address,
        kyc_status: 'pending'
      });

      // Update user role to SELLER
      await User.update(req.user.id, { 
        role: 'SELLER',
        is_seller: true,
        seller_profile_id: sellerProfile.id
      });

      res.status(201).json({
        message: 'Seller application submitted successfully',
        seller_profile: sellerProfile
      });
    } catch (error) {
      console.error('Seller application error:', error);
      res.status(500).json({ error: 'Failed to submit seller application' });
    }
  }
);

// Get current seller profile
router.get('/profile', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    // Get seller statistics
    const stats = await SellerProfile.getStats(sellerProfile.id!);

    res.json({
      seller_profile: sellerProfile,
      stats
    });
  } catch (error) {
    console.error('Get seller profile error:', error);
    res.status(500).json({ error: 'Failed to fetch seller profile' });
  }
});

// Update seller profile
router.put(
  '/profile',
  [
    body('business_name').optional().trim().isLength({ min: 2, max: 255 }),
    body('description').optional().isLength({ max: 2000 }),
    body('business_email').optional().isEmail(),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sellerProfile = await SellerProfile.findByUserId(req.user.id);
      if (!sellerProfile) {
        return res.status(404).json({ error: 'Seller profile not found' });
      }

      const {
        business_name,
        description,
        business_email,
        business_phone,
        business_address,
        settings
      } = req.body;

      const updatedProfile = await SellerProfile.update(sellerProfile.id!, {
        business_name,
        description,
        business_email,
        business_phone,
        business_address,
        settings
      });

      res.json({
        message: 'Seller profile updated successfully',
        seller_profile: updatedProfile
      });
    } catch (error) {
      console.error('Update seller profile error:', error);
      res.status(500).json({ error: 'Failed to update seller profile' });
    }
  }
);

// Get seller products
router.get('/products', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const { status, category, search, limit = '20', offset = '0' } = req.query;

    const { products, total } = await Product.findAll({
      seller_id: sellerProfile.id!,
      status: status as string,
      category: category as string,
      search: search as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    });

    res.json({
      products,
      total,
      page: Math.floor(parseInt(offset as string) / parseInt(limit as string)) + 1,
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post(
  '/products',
  [
    body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Title must be between 3 and 255 characters'),
    body('description').optional().isLength({ max: 5000 }),
    body('category').notEmpty().withMessage('Category is required'),
    body('price_cents').isInt({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive number'),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const sellerProfile = await SellerProfile.findByUserId(req.user.id);
      if (!sellerProfile) {
        return res.status(404).json({ error: 'Seller profile not found' });
      }

      // Whitelist allowed fields
      const {
        title,
        description,
        category,
        price_cents,
        stock,
        images,
        tags
      } = req.body;

      const product = await Product.create({
        seller_id: sellerProfile.id!,
        title,
        description,
        category,
        price_cents,
        stock: stock || 0,
        images,
        tags,
        status: 'active' // Set default status
      });

      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

// Update product
router.put('/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify ownership
    if (product.seller_id !== sellerProfile.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to edit this product' });
    }

    // Whitelist allowed fields
    const {
      title,
      description,
      price_cents,
      stock,
      images,
      tags,
      status
    } = req.body;

    const updatedProduct = await Product.update(req.params.id, {
      title,
      description,
      price_cents,
      stock,
      images,
      tags,
      ...(status && ['active', 'inactive', 'draft'].includes(status) ? { status } : {})
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Verify ownership
    if (product.seller_id !== sellerProfile.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'You do not have permission to delete this product' });
    }

    await Product.delete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get seller orders
router.get('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const { status, limit = '20', offset = '0' } = req.query;

    // Query orders for this seller
    const query = `
      SELECT o.*, u.name as buyer_name, u.email as buyer_email
      FROM orders o
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = $1
      ${status ? 'AND o.status = $2' : ''}
      ORDER BY o.created_at DESC
      LIMIT $${status ? '3' : '2'} OFFSET $${status ? '4' : '3'}
    `;

    const values = status 
      ? [sellerProfile.id, status, parseInt(limit as string), parseInt(offset as string)]
      : [sellerProfile.id, parseInt(limit as string), parseInt(offset as string)];

    const { pool } = await import('../config/database.js');
    const result = await pool.query(query, values);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM orders WHERE seller_id = $1 ${status ? 'AND status = $2' : ''}
    `;
    const countValues = status ? [sellerProfile.id, status] : [sellerProfile.id];
    const countResult = await pool.query(countQuery, countValues);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      orders: result.rows,
      total,
      page: Math.floor(parseInt(offset as string) / parseInt(limit as string)) + 1,
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/orders/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const { status, tracking_number, seller_notes } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { pool } = await import('../config/database.js');
    
    // Verify order belongs to seller
    const orderCheck = await pool.query('SELECT * FROM orders WHERE id = $1 AND seller_id = $2', [req.params.id, sellerProfile.id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    // Update order
    const updateFields: string[] = ['status = $1'];
    const values: any[] = [status];
    let paramCount = 2;

    if (tracking_number) {
      updateFields.push(`tracking_number = $${paramCount++}`);
      values.push(tracking_number);
    }
    if (seller_notes) {
      updateFields.push(`seller_notes = $${paramCount++}`);
      values.push(seller_notes);
    }
    if (status === 'shipped') {
      updateFields.push(`shipped_at = CURRENT_TIMESTAMP`);
    }
    if (status === 'delivered') {
      updateFields.push(`delivered_at = CURRENT_TIMESTAMP`);
    }

    values.push(req.params.id);

    const updateQuery = `
      UPDATE orders
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get seller dashboard stats
router.get('/dashboard/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const sellerProfile = await SellerProfile.findByUserId(req.user.id);
    if (!sellerProfile) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const stats = await SellerProfile.getStats(sellerProfile.id!);

    // Get pending payout amount
    const { pool } = await import('../config/database.js');
    const payoutQuery = `
      SELECT COALESCE(SUM(total_cents - platform_fee_cents), 0) as pending_payout_cents
      FROM orders o
      JOIN payments p ON o.id = p.order_id
      WHERE o.seller_id = $1 
        AND p.status = 'succeeded'
        AND o.id NOT IN (
          SELECT unnest(orders_included) FROM payouts WHERE seller_id = $1 AND status IN ('paid', 'processing')
        )
    `;
    const payoutResult = await pool.query(payoutQuery, [sellerProfile.id]);
    const pending_payout_cents = parseInt(payoutResult.rows[0].pending_payout_cents || 0);

    res.json({
      ...stats,
      pending_payout_cents,
      pending_payout_display: `$${(pending_payout_cents / 100).toFixed(2)}`
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
