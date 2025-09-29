import express from 'express';
import EnergyProduct from '../models/EnergyProduct';
import Order from '../models/Order';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get all energy products (with filters and pagination)
router.get('/products', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      sortBy = 'featured',
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build filter object
    const filter: any = { status: 'active' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter['pricing.amount'] = {};
      if (minPrice) filter['pricing.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['pricing.amount'].$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    // Build sort object
    let sort: any = {};
    switch (sortBy) {
      case 'price_low':
        sort = { 'pricing.amount': 1 };
        break;
      case 'price_high':
        sort = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sort = { 'reviews.averageRating': -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default: // featured
        sort = { featured: -1, createdAt: -1 };
    }

    const products = await EnergyProduct.find(filter)
      .populate('ownerId', 'name email siteOwnerData.verified')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await EnergyProduct.countDocuments(filter);

    res.json({
      products,
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
    const product = await EnergyProduct.findById(req.params.id)
      .populate('ownerId', 'name email siteOwnerData.verified siteOwnerData.companyName');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    await EnergyProduct.findByIdAndUpdate(req.params.id, {
      $inc: { 'analytics.views': 1 }
    });

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

    const productData = {
      ...req.body,
      ownerId: user.id,
      status: 'pending_approval'
    };

    const product = new EnergyProduct(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
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
    if (product.ownerId.toString() !== user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await EnergyProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ message: 'Error updating product', error: error.message });
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
    if (product.ownerId.toString() !== user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await EnergyProduct.findByIdAndDelete(req.params.id);
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

    const products = await EnergyProduct.find({ ownerId: user.id });
    
    // Calculate dashboard statistics
    const stats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      totalRevenue: products.reduce((sum, p) => sum + p.analytics.revenue, 0),
      totalViews: products.reduce((sum, p) => sum + p.analytics.views, 0),
      totalInquiries: products.reduce((sum, p) => sum + p.analytics.inquiries, 0),
      totalSales: products.reduce((sum, p) => sum + p.analytics.sales, 0)
    };

    const orders = await Order.find({ sellerId: user.id })
      .populate('buyerId', 'name email')
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats,
      products,
      recentOrders: orders
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

    const product = await EnergyProduct.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check availability
    if (product.availability.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    const totalPrice = product.pricing.amount * quantity;

    const order = new Order({
      buyerId: user.id,
      sellerId: product.ownerId,
      productId: product._id,
      siteId: product.siteId,
      orderDetails: {
        quantity,
        unit: product.pricing.unit,
        unitPrice: product.pricing.amount,
        totalPrice,
        currency: product.pricing.currency
      },
      delivery: {
        method: req.body.deliveryMethod || 'delivery',
        address: deliveryAddress,
        scheduledDate: req.body.scheduledDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        cost: product.delivery.cost
      },
      payment: {
        method: paymentMethod,
        status: 'pending',
        greenCreditsUsed: req.body.greenCreditsUsed || 0,
        cashAmount: totalPrice - (req.body.greenCreditsUsed || 0)
      }
    });

    await order.save();

    // Update product analytics
    await EnergyProduct.findByIdAndUpdate(productId, {
      $inc: { 
        'analytics.inquiries': 1,
        'availability.quantity': -quantity
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// Get user's orders
router.get('/orders', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const user = req.user;
    const { type = 'buyer' } = req.query;

    const filter = type === 'buyer' 
      ? { buyerId: user.id }
      : { sellerId: user.id };

    const orders = await Order.find(filter)
      .populate('productId', 'title images category')
      .populate(type === 'buyer' ? 'sellerId' : 'buyerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
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
    if (order.sellerId.toString() !== user.id.toString() && user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Add to timeline
    order.timeline.push({
      status,
      timestamp: new Date(),
      note: `Status updated by ${user.email}`
    });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ message: 'Error updating order status' });
  }
});

export default router;
