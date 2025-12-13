import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import { db, getData } from '../utils/db.js';
import { where, query, collection } from 'firebase/firestore';

const router = express.Router();

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

    // Check if database is connected
    if (!db) {
      return res.status(500).json({ 
        message: 'Database not connected. Please try again later.' 
      });
    }

    // Query Firebase Firestore for user with matching email
    const q = query(
      collection(db, 'users'),
      where('email', '==', email)
    );

    const users = await getData(q);

    // Check if user exists
    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Get the first user (email should be unique)
    const user = users[0];

    // Verify password using bcrypt.compare
    // The password in Firebase is stored as a hashed string
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    // Payload contains user data that will be available in req.user after verification
    const token = jwt.sign(
      { 
        id: user.id, // Firestore document ID (from getData function)
        email: user.email,
        username: user.username || null
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
    
    // Check if database is connected
    if (!db) {
      return res.status(500).json({ 
        message: 'Database not connected. Please try again later.' 
      });
    }

    // Query Firebase Firestore for user by email (from JWT token)
    const q = query(
      collection(db, 'users'),
      where('email', '==', req.user.email)
    );

    const users = await getData(q);

    // Check if user exists
    if (users.length === 0) {
      return res.status(404).json({ 
        message: 'User profile not found' 
      });
    }

    // Get the user data from Firebase
    const user = users[0];

    // Return user profile (exclude password for security)
    const userProfile = {
      id: user.id,
      email: user.email,
      username: user.username || null,
      firstname: user.firstname || null,
      lastname: user.lastname || null,
      // Add any other user fields you want to return
      // DO NOT include password or password_hash
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

