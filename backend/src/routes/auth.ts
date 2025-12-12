import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { body, validationResult } from 'express-validator';
import { OAuthService } from '../utils/oauth';
import { emailService } from '../utils/emailService';
import crypto from 'crypto';

const router = Router();

// JWT token generation
const generateToken = (userId: string, role: string, email: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(
    { userId, role, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['USER', 'SITE_OWNER'])
    .withMessage('Invalid role specified')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register new user
router.post('/register', validateRegistration, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password, name, role, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists with this email address'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      role: role || 'USER',
      gender: gender || 'prefer-not-to-say',
      bio: `Hello! I'm ${name} and I'm excited to be part of the Symbiotic City community.`,
      location: 'Community Member',
      is_active: true,
      email_verified: false
    });

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if ((error as any).code === '23505') {
      return res.status(409).json({
        error: 'User already exists with this email address'
      });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last login
    await User.update(user.id!, { last_login: new Date() });

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    
    if ((error as any).name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const token = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    // Update allowed fields
    const { name, bio, location, avatar } = req.body;
    
    const updatedUser = await User.update(user.id!, {
      name,
      bio,
      location,
      avatar
    });

    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if ((error as any).name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Auth service is running with PostgreSQL (Supabase)',
    timestamp: new Date().toISOString()
  });
});

// OAuth Handlers
router.post('/oauth/facebook', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Get user info from Facebook
    const oauthUser = await OAuthService.getFacebookUser(code);

    // Check if user exists
    let user = await User.findByEmail(oauthUser.email);

    if (!user) {
      // Create new user
      user = await User.create({
        email: oauthUser.email,
        password: crypto.randomBytes(32).toString('hex'), // Cryptographically secure random password
        name: oauthUser.name,
        role: 'USER',
        avatar: oauthUser.avatar,
        bio: `Connected via ${oauthUser.provider}`,
        location: 'Community Member',
        is_active: true,
        email_verified: true, // OAuth emails are pre-verified
      });
    }

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Update last login
    await User.update(user.id!, { last_login: new Date() });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'OAuth authentication successful',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'OAuth authentication failed' });
  }
});

router.post('/oauth/google', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Get user info from Google
    const oauthUser = await OAuthService.getGoogleUser(code);

    // Check if user exists
    let user = await User.findByEmail(oauthUser.email);

    if (!user) {
      // Create new user
      user = await User.create({
        email: oauthUser.email,
        password: `oauth_${oauthUser.provider}_${Date.now()}`,
        name: oauthUser.name,
        role: 'USER',
        avatar: oauthUser.avatar,
        bio: `Connected via ${oauthUser.provider}`,
        location: 'Community Member',
        is_active: true,
        email_verified: true,
      });
    }

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Update last login
    await User.update(user.id!, { last_login: new Date() });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'OAuth authentication successful',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'OAuth authentication failed' });
  }
});

router.post('/oauth/twitter', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Get user info from Twitter
    const oauthUser = await OAuthService.getTwitterUser(code);

    // Check if user exists
    let user = await User.findByEmail(oauthUser.email);

    if (!user) {
      // Create new user
      user = await User.create({
        email: oauthUser.email,
        password: crypto.randomBytes(32).toString('hex'),
        name: oauthUser.name,
        role: 'USER',
        avatar: oauthUser.avatar,
        bio: `Connected via ${oauthUser.provider}`,
        location: 'Community Member',
        is_active: true,
        email_verified: true,
      });
    }

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Update last login
    await User.update(user.id!, { last_login: new Date() });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'OAuth authentication successful',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'OAuth authentication failed' });
  }
});

router.post('/oauth/instagram', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Get user info from Instagram
    const oauthUser = await OAuthService.getInstagramUser(code);

    // Check if user exists
    let user = await User.findByEmail(oauthUser.email);

    if (!user) {
      // Create new user
      user = await User.create({
        email: oauthUser.email,
        password: crypto.randomBytes(32).toString('hex'),
        name: oauthUser.name,
        role: 'USER',
        avatar: oauthUser.avatar,
        bio: `Connected via ${oauthUser.provider}`,
        location: 'Community Member',
        is_active: true,
        email_verified: true,
      });
    }

    // Generate JWT token
    const token = generateToken(user.id!, user.role, user.email);

    // Update last login
    await User.update(user.id!, { last_login: new Date() });

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'OAuth authentication successful',
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  } catch (error) {
    console.error('Instagram OAuth error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'OAuth authentication failed' });
  }
});

// Request password reset
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists with this email, a password reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Send password reset email
    await emailService.sendPasswordReset(user.email, user.name, resetToken);

    res.json({ message: 'If an account exists with this email, a password reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password with token
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    // Validate password strength
    if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and contain uppercase, lowercase, and number' 
      });
    }

    // TODO: Verify token and find user
    // For now, this is a placeholder
    // You'll need to add token verification logic when you add reset token fields to User model

    res.json({ message: 'Password reset functionality will be fully implemented with database token storage' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Change password (authenticated)
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const jwtToken = authHeader.substring(7);
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // Verify token
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET) as any;
    
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid token or user not found' });
    }

    // Verify current password
    const isPasswordValid = await User.comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Validate new password strength
    if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        error: 'New password must be at least 8 characters and contain uppercase, lowercase, and number' 
      });
    }

    // Update password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.update(user.id!, { password: hashedPassword });

    // Send confirmation email
    try {
      await emailService.sendPasswordChanged(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send password change email:', emailError);
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    
    if ((error as any).name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
