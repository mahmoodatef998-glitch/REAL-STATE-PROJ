const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} = require('../validators/authValidator');

const router = express.Router();

// Cache for JWT_SECRET to avoid reloading
let cachedJWTSecret = null;

// Generate JWT token
const generateToken = (user) => {
  // Try to get JWT_SECRET from cache first, then process.env, then global
  let secret = cachedJWTSecret || process.env.JWT_SECRET || global.JWT_SECRET;
  
  // If still not found, try loading dotenv again (only once to avoid performance issues)
  if (!secret) {
    const path = require('path');
    const configPath = path.join(__dirname, '../config.env');
    console.log('🔄 JWT_SECRET not found, trying to reload from:', configPath);
    try {
      const result = require('dotenv').config({ path: configPath });
      if (result.error) {
        console.error('❌ Failed to reload JWT_SECRET:', result.error);
      } else {
        secret = process.env.JWT_SECRET;
        // If successfully loaded, cache it for future use
        if (secret) {
          secret = secret.trim().replace(/^["']|["']$/g, '');
          cachedJWTSecret = secret;
          process.env.JWT_SECRET = secret;
          global.JWT_SECRET = secret;
          console.log('✅ JWT_SECRET loaded and cached');
        }
      }
    } catch (err) {
      console.error('❌ Failed to reload JWT_SECRET:', err);
    }
  } else {
    // Clean up secret (remove quotes and whitespace) and cache it
    secret = secret.trim().replace(/^["']|["']$/g, '');
    cachedJWTSecret = secret;
    process.env.JWT_SECRET = secret;
    global.JWT_SECRET = secret;
  }
  
  console.log('🔑 generateToken called for user:', user.email, 'ID:', user.id);
  console.log('🔑 JWT_SECRET sources checked:');
  console.log('   - cachedJWTSecret:', !!cachedJWTSecret);
  console.log('   - process.env.JWT_SECRET:', !!process.env.JWT_SECRET);
  console.log('   - global.JWT_SECRET:', !!global.JWT_SECRET);
  console.log('🔑 Final secret exists:', !!secret, 'Length:', secret ? secret.length : 0);
  
  if (!secret) {
    console.error('❌ JWT_SECRET is not configured!');
    console.error('❌ All sources checked - none available');
    
    // Last resort: try to load from config.env one more time
    try {
      const path = require('path');
      const fs = require('fs');
      const configPath = path.join(__dirname, '../config.env');
      
      if (fs.existsSync(configPath)) {
        const result = require('dotenv').config({ path: configPath });
        secret = process.env.JWT_SECRET;
        if (secret) {
          secret = secret.trim().replace(/^["']|["']$/g, '');
          cachedJWTSecret = secret;
          process.env.JWT_SECRET = secret;
          global.JWT_SECRET = secret;
          console.log('✅ JWT_SECRET loaded from config.env as emergency fallback');
        }
      }
    } catch (err) {
      console.error('❌ Emergency JWT_SECRET load failed:', err);
    }
    
    // If still no secret, use fallback
    if (!secret) {
      if (global.JWT_SECRET) {
        secret = global.JWT_SECRET;
        cachedJWTSecret = secret;
        console.log('✅ Using global.JWT_SECRET as last resort fallback');
      } else {
        console.error('❌ CRITICAL: No JWT_SECRET available. Using temporary fallback.');
        secret = 'TEMPORARY-FALLBACK-SECRET-RESTART-SERVER';
        cachedJWTSecret = secret;
        global.JWT_SECRET = secret;
        console.error('⚠️  WARNING: This is a temporary fallback. Please check config.env and restart server!');
      }
    }
  }
  
  if (!user.id) {
    console.error('❌ User ID is missing:', user);
    throw new Error('User ID is required for token generation');
  }
  
  try {
    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };
    console.log('🔑 Token payload:', payload);
    
    const token = jwt.sign(payload, secret, { expiresIn: '7d' });
    console.log('✅ Token created successfully');
    
    return token;
  } catch (error) {
    console.error('❌ Token generation failed:', error);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};

// Register
router.post('/register', validateRegister, handleValidationErrors, async (req, res, next) => {
  try {
    const { name, email, password, role, phone, whatsapp } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this email' 
      });
    }

    // Determine status
    const userRole = role || 'client';
    const userStatus = userRole === 'broker' ? 'pending' : 'approved';

    // Validate phone for brokers
    if (userRole === 'broker' && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required for broker registration'
      });
    }

    console.log(`📝 Registration attempt: ${name} (${email}) as ${userRole} - Status: ${userStatus}`);

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      status: userStatus,
      phone,
      whatsapp
    });

    console.log(`✅ User created: ${user.name} (${user.email}) - Role: ${user.role}, Status: ${user.status}`);

    // If broker, don't return token - needs admin approval
    if (userRole === 'broker') {
      console.log(`⏳ Broker account created with pending status. Awaiting admin approval.`);
      return res.status(201).json({
        success: true,
        message: 'Registration successful. Your account is pending admin approval. You will be notified once approved.',
        requiresApproval: true,
        user: user.toJSON()
      });
    }

    // Generate token for non-broker users
    try {
      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: user.toJSON()
      });
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      return res.status(500).json({ 
        success: false,
        error: 'Registration successful but failed to generate token. Please check server configuration.' 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
});

// Login
router.post('/login', validateLogin, handleValidationErrors, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.email, 'Status:', user.status);

    // Check if user has a password hash
    if (!user.password) {
      console.error('❌ User has no password hash:', user.email);
      return res.status(500).json({ success: false, error: 'User account error. Please contact administrator.' });
    }

    // Validate password
    try {
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        console.log('❌ Invalid password for:', email);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      console.log('✅ Password validated for:', email);
    } catch (passwordError) {
      console.error('❌ Password validation error:', passwordError);
      return res.status(500).json({ success: false, error: 'Password validation failed. Please try again.' });
    }

    // Check if user account is approved
    if (user.status === 'pending') {
      console.log('⏳ User account is pending approval:', user.email);
      return res.status(403).json({ 
        success: false,
        error: 'Your account is pending admin approval. Please wait for approval before logging in.',
        requiresApproval: true,
        status: 'pending'
      });
    }

    if (user.status === 'rejected') {
      console.log('❌ User account is rejected:', user.email);
      return res.status(403).json({ 
        success: false,
        error: 'Your account has been rejected. Please contact the administrator.',
        rejected: true,
        status: 'rejected'
      });
    }

    // Generate token
    try {
      console.log('🔑 Generating token for user:', user.email);
      const token = generateToken(user);
      console.log('✅ Token generated successfully for:', user.email);
      
      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: user.toJSON()
      });
    } catch (tokenError) {
      console.error('❌ Token generation error:', tokenError);
      console.error('❌ Token error name:', tokenError.name);
      console.error('❌ Token error message:', tokenError.message);
      console.error('❌ Token error stack:', tokenError.stack);
      
      // Provide more detailed error message
      let errorMessage = 'Failed to generate authentication token. Please check server configuration.';
      if (tokenError.message.includes('JWT_SECRET')) {
        errorMessage = 'Server configuration error. Please contact administrator.';
      }
      
      return res.status(500).json({ 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? tokenError.message : undefined
      });
    }
  } catch (error) {
    console.error('❌ Login route error:', error);
    console.error('❌ Error stack:', error.stack);
    next(error);
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user: user.toJSON() });
  } catch (error) {
    console.error('Profile error:', error);
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { name, phone, whatsapp, avatar } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (avatar !== undefined) updateData.avatar = avatar;

    await user.update(updateData);

    res.json({ success: true, message: 'Profile updated successfully', user: user.toJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Old password and new password are required' });
    }

    const isValidPassword = await user.validatePassword(oldPassword);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid old password' });
    }

    await user.updatePassword(newPassword);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    next(error);
  }
});

// Verify token (for frontend to check if token is still valid)
router.get('/verify', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        valid: false,
        error: 'User not found' 
      });
    }

    res.json({ 
      valid: true,
      user: user.toJSON() 
    });
  } catch (error) {
    console.error('Verify token error:', error);
    next(error);
  }
});

module.exports = router;
