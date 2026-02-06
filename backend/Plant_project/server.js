const express = require('express');
const multer = require('multer');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config({ path: '.env' });

const { getPlantDiagnosis } = require('./plantService');
const db = require('./firebase-config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

/**
 * POST /api/check-health
 * Accepts an image file and returns plant health diagnosis
 */
app.post('/api/check-health', upload.single('image'), async (req, res) => {
  try {
    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No image file provided',
        message: 'Please upload an image file with the field name "image"'
      });
    }

    // Get plant diagnosis from Plant.id API
    const diagnosisResult = await getPlantDiagnosis(req.file.buffer);

    // Extract health data with proper validation
    const healthData = diagnosisResult.health || {};
    
    // Extract is_healthy - ensure it's a boolean or null
    const isHealthy = typeof healthData.is_healthy === 'boolean' 
      ? healthData.is_healthy 
      : null;
    
    // Extract diseases - ensure it's always an array
    let diseases = [];
    if (healthData.diseases) {
      if (Array.isArray(healthData.diseases)) {
        diseases = healthData.diseases;
      } else {
        // If diseases is not an array, wrap it
        diseases = [healthData.diseases];
      }
    }
    
    // Extract suggestions - ensure it's always an array
    const suggestions = Array.isArray(healthData.suggestions) 
      ? healthData.suggestions 
      : [];

    // Extract relevant data for Firestore
    const plantData = {
      is_plant: diagnosisResult.is_plant || null,
      is_healthy: isHealthy,
      suggestions: suggestions,
      diseases: diseases,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      created_at: new Date().toISOString(),
      // Store full result for reference
      full_result: diagnosisResult
    };

    // Save to Firestore collection 'plant_logs'
    try {
      const docRef = await db.collection('plant_logs').add(plantData);
      console.log('✅ SUCCESS: Plant diagnosis saved to Firestore');
      console.log(`   📄 Document ID: ${docRef.id}`);
      console.log(`   📊 Saved Data Summary:`, {
        is_plant: plantData.is_plant,
        is_healthy: plantData.is_healthy,
        diseases_count: plantData.diseases.length,
        diseases: plantData.diseases.length > 0 
          ? plantData.diseases.map(d => d.name || d.disease_name || JSON.stringify(d)).join(', ')
          : 'None detected',
        suggestions_count: plantData.suggestions.length,
        created_at: plantData.created_at
      });
    } catch (firestoreError) {
      console.error('❌ Error saving to Firestore:', firestoreError);
      // Don't fail the request if Firestore save fails, just log it
    }

    // Return full JSON result to client
    res.status(200).json({
      success: true,
      data: diagnosisResult
    });

  } catch (error) {
    console.error('Error in /api/check-health:', error);

    // Determine appropriate status code
    let statusCode = 500;
    if (error.message.includes('Invalid API key') || error.message.includes('401') || error.message.includes('403')) {
      statusCode = 401;
    } else if (error.message.includes('Invalid request') || error.message.includes('400') || error.message.includes('Image file too large') || error.message.includes('Only image files')) {
      statusCode = 400;
    } else if (error.message.includes('No response')) {
      statusCode = 503;
    }

    res.status(statusCode).json({
      success: false,
      error: error.message || 'Internal server error',
      message: 'Failed to process plant health diagnosis'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Plant Health Diagnosis API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Plant Health Diagnosis API',
    endpoints: {
      health: 'GET /health',
      checkHealth: 'POST /api/check-health (requires image file)'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Image file size exceeds 10MB limit'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Plant Health Diagnosis API server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/check-health`);
});
