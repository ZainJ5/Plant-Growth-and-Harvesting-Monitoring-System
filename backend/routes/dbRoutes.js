import express from 'express';

const router = express.Router();

/**
 * Basic database health check endpoint
 */
router.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running'
  });
});

export default router;
