import { Router, Request, Response } from 'express';
import { emailService } from '../utils/emailService';

const router = Router();

// Test welcome email
router.post('/test-welcome', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const result = await emailService.sendWelcomeEmail(email, name);
    
    if (result) {
      res.json({ message: 'Welcome email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test verification email
router.post('/test-verification', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const testToken = 'test-verification-token-123456';
    const result = await emailService.sendEmailVerification(email, name, testToken);
    
    if (result) {
      res.json({ message: 'Verification email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test password reset email
router.post('/test-reset', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const testToken = 'test-reset-token-123456';
    const result = await emailService.sendPasswordReset(email, name, testToken);
    
    if (result) {
      res.json({ message: 'Password reset email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test event reminder email
router.post('/test-event', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const result = await emailService.sendEventReminder(
      email,
      name,
      'Community Garden Workshop',
      'November 15, 2025 at 2:00 PM',
      'Central Community Center, 123 Main St'
    );
    
    if (result) {
      res.json({ message: 'Event reminder email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test promotional email
router.post('/test-promo', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const result = await emailService.sendPromotionalEmail(
      email,
      name,
      '🌍 Join Our Sustainability Challenge!',
      'We\'re launching a month-long sustainability challenge! Complete daily eco-friendly tasks, earn points, and win amazing prizes while making a positive impact on our planet. Are you ready to make a difference?',
      'Join the Challenge',
      'http://localhost:5173/challenges'
    );
    
    if (result) {
      res.json({ message: 'Promotional email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

// Test order confirmation email
router.post('/test-order', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    const result = await emailService.sendMarketplaceOrderConfirmation(
      email,
      name,
      'SC2025110001',
      [
        'Reusable Bamboo Cutlery Set',
        'Organic Cotton Tote Bag',
        'Solar-Powered LED Lantern'
      ],
      '$45.99'
    );
    
    if (result) {
      res.json({ message: 'Order confirmation email sent successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

export default router;
