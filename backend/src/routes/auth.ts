import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { body, validationResult } from 'express-validator';
import { OAuthService } from '../utils/oauth';

const router = Router();

// JWT token generation
const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(
    { userId },
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
    .isIn(['USER', 'SITE_OWNER', 'ADMIN', 'MODERATOR'])
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
    const token = generateToken(user.id!);

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
    const token = generateToken(user.id!);

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
        password: `oauth_${oauthUser.provider}_${Date.now()}`, // Random password for OAuth users
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
    const token = generateToken(user.id!);

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
    const token = generateToken(user.id!);

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
    const token = generateToken(user.id!);

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
    const token = generateToken(user.id!);

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

export default router;
