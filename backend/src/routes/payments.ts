import { Router, Response, Request } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { pool } from '../config/database';

const router = Router();

// Stripe integration (install: npm install stripe)
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create Payment Intent
 * This creates a Stripe PaymentIntent for checkout
 * The client uses the client_secret to complete payment
 */
router.post(
  '/create-payment-intent',
  authenticateToken,
  [
    body('amount_cents').isInt({ min: 50 }).withMessage('Amount must be at least 50 cents'),
    body('currency').optional().isIn(['usd', 'eur', 'gbp', 'cad']).withMessage('Invalid currency'),
    body('cart_items').isArray({ min: 1 }).withMessage('Cart items required'),
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

      const { amount_cents, currency = 'usd', cart_items, shipping_address } = req.body;

      // TODO: Validate cart items and calculate actual amount from database
      // For now, trust the client-provided amount (DO NOT DO THIS IN PRODUCTION!)
      
      // In production, you should:
      // 1. Fetch products from database
      // 2. Calculate total from server-side prices
      // 3. Validate stock availability
      // 4. Apply any discounts server-side

      // Check if Stripe is configured
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ 
          error: 'Payment gateway not configured',
          message: 'Please set STRIPE_SECRET_KEY in environment variables' 
        });
      }

      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

      // Create PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount_cents,
        currency,
        metadata: {
          buyer_id: req.user.id,
          cart_items: JSON.stringify(cart_items)
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency
      });
    } catch (error: any) {
      console.error('Create payment intent error:', error);
      res.status(500).json({ 
        error: 'Failed to create payment intent',
        message: error.message 
      });
    }
  }
);

/**
 * Stripe Webhook Handler
 * Receives webhook events from Stripe (payment succeeded, failed, etc.)
 * IMPORTANT: This endpoint must be publicly accessible
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    if (!sig) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    let event;
    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);

        // TODO: Create order in database
        // 1. Extract cart_items from metadata
        // 2. Create order record
        // 3. Create payment record
        // 4. Update product stock
        // 5. Send confirmation email to buyer
        // 6. Notify seller

        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed:', failedPayment.id);
        
        await handlePaymentFailure(failedPayment);
        break;

      case 'charge.refunded':
        const refund = event.data.object;
        console.log('Charge refunded:', refund.id);
        
        await handleRefund(refund);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { id: payment_intent_id, amount, currency, metadata } = paymentIntent;
    const cart_items = JSON.parse(metadata.cart_items || '[]');
    const buyer_id = metadata.buyer_id;

    if (!buyer_id || cart_items.length === 0) {
      console.error('Invalid payment metadata');
      return;
    }

    // Group items by seller
    const itemsBySeller: any = {};
    for (const item of cart_items) {
      if (!itemsBySeller[item.seller_id]) {
        itemsBySeller[item.seller_id] = [];
      }
      itemsBySeller[item.seller_id].push(item);
    }

    // Create order for each seller
    for (const [seller_id, items] of Object.entries(itemsBySeller)) {
      const subtotal = (items as any[]).reduce((sum, item) => sum + (item.price_cents * item.quantity), 0);
      const platform_fee = Math.floor(subtotal * 0.10); // 10% platform fee
      const seller_amount = subtotal - platform_fee;

      // Generate unique order number
      const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const orderQuery = `
        INSERT INTO orders (
          order_number, buyer_id, seller_id, status, payment_status, fulfillment_status,
          subtotal_cents, shipping_cost_cents, tax_cents, discount_cents, total_cents, currency,
          shipping_address, items
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;

      const orderValues = [
        order_number,
        buyer_id,
        seller_id,
        'pending',
        'paid',
        'unfulfilled',
        subtotal,
        0, // shipping calculated separately
        0, // tax calculated separately
        0, // discount
        subtotal,
        currency,
        JSON.stringify(metadata.shipping_address || {}),
        JSON.stringify(items)
      ];

      const orderResult = await pool.query(orderQuery, orderValues);
      const order = orderResult.rows[0];

      // Create payment record
      const paymentQuery = `
        INSERT INTO payments (
          order_id, payment_intent_id, amount_cents, currency,
          payment_method, status, gateway, platform_fee_cents, seller_amount_cents
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const paymentValues = [
        order.id,
        payment_intent_id,
        subtotal,
        currency,
        'card',
        'succeeded',
        'stripe',
        platform_fee,
        seller_amount
      ];

      await pool.query(paymentQuery, paymentValues);

      // Update product stock
      for (const item of items as any[]) {
        await pool.query(
          'UPDATE products SET stock = stock - $1, sales_count = sales_count + $1 WHERE id = $2',
          [item.quantity, item.product_id]
        );
      }

      console.log(`Order ${order_number} created successfully for seller ${seller_id}`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(paymentIntent: any) {
  try {
    const { id: payment_intent_id, last_payment_error } = paymentIntent;
    
    console.log('Payment failed:', payment_intent_id);
    console.log('Failure reason:', last_payment_error?.message);

    // TODO: Send notification to buyer about payment failure
    // TODO: Log failure for analytics
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle refund
 */
async function handleRefund(charge: any) {
  try {
    const { payment_intent: payment_intent_id, amount_refunded } = charge;

    // Find payment and order
    const paymentQuery = 'SELECT * FROM payments WHERE payment_intent_id = $1';
    const paymentResult = await pool.query(paymentQuery, [payment_intent_id]);
    
    if (paymentResult.rows.length === 0) {
      console.error('Payment not found for refund');
      return;
    }

    const payment = paymentResult.rows[0];

    // Update payment status
    await pool.query(
      'UPDATE payments SET status = $1, refunded_at = CURRENT_TIMESTAMP WHERE id = $2',
      ['refunded', payment.id]
    );

    // Update order status
    await pool.query(
      'UPDATE orders SET status = $1, payment_status = $2, refund_reason = $3 WHERE id = $4',
      ['refunded', 'refunded', 'Customer requested refund', payment.order_id]
    );

    console.log(`Refund processed for payment ${payment_intent_id}`);
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

/**
 * Get payment status
 */
router.get('/status/:payment_intent_id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { payment_intent_id } = req.params;

    const query = `
      SELECT p.*, o.order_number, o.status as order_status
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE p.payment_intent_id = $1 AND o.buyer_id = $2
    `;

    const result = await pool.query(query, [payment_intent_id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment: result.rows[0] });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

/**
 * Request payout (for sellers)
 */
router.post('/request-payout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get seller profile
    const sellerQuery = 'SELECT * FROM seller_profiles WHERE user_id = $1';
    const sellerResult = await pool.query(sellerQuery, [req.user.id]);

    if (sellerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Seller profile not found' });
    }

    const seller = sellerResult.rows[0];

    // Check if seller has completed Stripe onboarding
    if (!seller.stripe_account_id || !seller.stripe_onboarding_complete) {
      return res.status(400).json({ 
        error: 'Please complete payment account setup before requesting payouts' 
      });
    }

    // Calculate available balance (paid orders not yet paid out)
    const balanceQuery = `
      SELECT 
        COALESCE(SUM(p.seller_amount_cents), 0) as available_balance_cents,
        array_agg(o.id) as order_ids
      FROM orders o
      JOIN payments p ON o.id = p.order_id
      WHERE o.seller_id = $1 
        AND p.status = 'succeeded'
        AND o.id NOT IN (
          SELECT unnest(orders_included) 
          FROM payouts 
          WHERE seller_id = $1 AND status IN ('paid', 'processing')
        )
    `;

    const balanceResult = await pool.query(balanceQuery, [seller.id]);
    const available_balance_cents = parseInt(balanceResult.rows[0].available_balance_cents || 0);
    const order_ids = balanceResult.rows[0].order_ids;

    if (available_balance_cents < 1000) { // Minimum $10 payout
      return res.status(400).json({ 
        error: 'Minimum payout amount is $10.00',
        available_balance: `$${(available_balance_cents / 100).toFixed(2)}`
      });
    }

    // Create payout record
    const payoutQuery = `
      INSERT INTO payouts (
        seller_id, amount_cents, currency, status, payout_method,
        orders_included, scheduled_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE + INTERVAL '3 days')
      RETURNING *
    `;

    const payoutValues = [
      seller.id,
      available_balance_cents,
      'usd',
      'pending',
      'stripe_connect',
      order_ids
    ];

    const payoutResult = await pool.query(payoutQuery, payoutValues);

    // TODO: Initiate Stripe Connect transfer
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const transfer = await stripe.transfers.create({
    //   amount: available_balance_cents,
    //   currency: 'usd',
    //   destination: seller.stripe_account_id,
    // });

    res.json({
      message: 'Payout request submitted successfully',
      payout: payoutResult.rows[0],
      estimated_arrival: '3-5 business days'
    });
  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({ error: 'Failed to request payout' });
  }
});

export default router;
