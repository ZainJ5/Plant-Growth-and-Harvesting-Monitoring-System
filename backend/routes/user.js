import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Dummy user data for authentication
 * In a real application, this would come from a database
 * 
 * TODO: Replace this with actual database queries based on user's choice:
 * - Option 1: Keep dummy user
 * - Option 2: MongoDB
 * - Option 3: MySQL
 * - Option 4: PostgreSQL
 * 
 * Password: "password123" (hashed using bcrypt)
 */
const DUMMY_USER = {
  id: 1,
  email: 'user@example.com',
  // Pre-hashed password for "password123" using bcrypt
  // In production, this would be stored in a database
  password: '$2b$10$rT5nBPX/6dUee3ekbBPTpeEi5ZK9LaFIpIJWcLmkNnz1BsnZEOqse',
  username: 'johndoe',
  name: 'John Doe'
};

/**
 * POST /user/login
 * 
 * Authenticates a user and returns a JWT token.
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * Response (Success):
 * {
 *   "message": "Login successful",
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * 
 * Response (Error):
 * {
 *   "message": "Invalid credentials"
 * }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // TODO: Replace this with database query
    // For now, check against dummy user
    if (email !== DUMMY_USER.email) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Verify password using bcrypt.compare
    // TODO: Replace this with database password check
    const isValidPassword = await bcrypt.compare(password, DUMMY_USER.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    // Payload contains user data that will be available in req.user after verification
    const token = jwt.sign(
      { 
        id: DUMMY_USER.id,
        email: DUMMY_USER.email,
        username: DUMMY_USER.username 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES || '1d' 
      }
    );

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

/**
 * GET /user/profile
 * 
 * Protected route that returns the authenticated user's profile.
 * Requires a valid JWT token in the Authorization header.
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success):
 * {
 *   "message": "Profile retrieved successfully",
 *   "user": {
 *     "id": 1,
 *     "email": "user@example.com",
 *     "username": "johndoe"
 *   }
 * }
 * 
 * Response (Error - No Token):
 * {
 *   "message": "Access denied. No token provided."
 * }
 * 
 * Response (Error - Invalid Token):
 * {
 *   "message": "Access denied. Invalid token."
 * }
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    // It contains the decoded JWT payload (id, email, username)
    
    // TODO: Replace this with database query to get full user profile
    // For now, return data from the decoded token
    const userProfile = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username
    };

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user: userProfile
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      message: 'Server error retrieving profile',
      error: error.message 
    });
  }
});

export default router;

