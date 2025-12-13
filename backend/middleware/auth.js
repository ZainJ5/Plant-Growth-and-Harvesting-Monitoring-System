import jwt from 'jsonwebtoken';

/**
 * JWT Authentication Middleware
 * 
 * This middleware verifies JWT tokens from the Authorization header.
 * It extracts the token, verifies it, and attaches the decoded user data to req.user.
 * 
 * Usage: Add this middleware to any route that requires authentication.
 * Example: router.get('/profile', authenticateToken, (req, res) => { ... });
 */
export const authenticateToken = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers['authorization'];
  
  // Check if Authorization header exists
  // Format should be: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1]; // Split by space and get the token part
  
  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ 
      message: 'Access denied. No token provided.',
      error: 'Token is required in Authorization header as: Bearer <token>'
    });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    // jwt.verify() will throw an error if:
    // - Token is invalid
    // - Token is expired
    // - Secret doesn't match
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user data to the request object
    // This makes the user data available in the route handler
    req.user = decoded;
    
    // Call next() to proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return 401 Unauthorized
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Access denied. Token has expired.',
        error: 'Please login again to get a new token'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Access denied. Invalid token.',
        error: 'Token verification failed'
      });
    }
    
    // For any other errors
    return res.status(401).json({ 
      message: 'Access denied. Token verification failed.',
      error: error.message
    });
  }
};

