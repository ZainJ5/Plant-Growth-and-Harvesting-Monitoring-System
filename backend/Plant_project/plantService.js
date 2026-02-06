const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Try to load .env, fallback to Key.env if .env doesn't exist
if (fs.existsSync(path.join(__dirname, '.env'))) {
  require('dotenv').config({ path: '.env' });
} else if (fs.existsSync(path.join(__dirname, 'Key.env'))) {
  require('dotenv').config({ path: 'Key.env' });
} else {
  require('dotenv').config(); // Default behavior
}

const PLANT_ID_API_KEY = process.env.PLANT_ID_API_KEY;
const PLANT_ID_API_URL = 'https://api.plant.id/v3/identification';

/**
 * Converts an image buffer to Base64 string
 * @param {Buffer} imageBuffer - The image buffer from multer
 * @returns {string} Base64 encoded string
 */
function convertBufferToBase64(imageBuffer) {
  return imageBuffer.toString('base64');
}

/**
 * Gets plant diagnosis from Plant.id API
 * @param {Buffer} imageBuffer - The image buffer from multer
 * @returns {Promise<Object>} Full API response including is_plant, is_healthy, and suggestions
 */
async function getPlantDiagnosis(imageBuffer) {
  try {
    // Validate API key
    if (!PLANT_ID_API_KEY) {
      throw new Error('PLANT_ID_API_KEY is not set in environment variables');
    }

    // Convert image buffer to Base64
    const base64Image = convertBufferToBase64(imageBuffer);

    // Validate image size (Plant.id API has limits)
    const imageSizeInMB = imageBuffer.length / (1024 * 1024);
    if (imageSizeInMB > 10) {
      throw new Error('Image size exceeds 10MB limit');
    }

    // Send POST request to Plant.id API
    const response = await axios.post(
      PLANT_ID_API_URL,
      {
        images: [base64Image],
        health: 'all'
      },
      {
        headers: {
          'Api-Key': PLANT_ID_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    return response.data;

  } catch (error) {
    // Handle API errors
    if (error.response) {
      // API returned an error response
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401 || status === 403) {
        throw new Error(`Invalid API key: ${status} - ${JSON.stringify(data)}`);
      } else if (status === 400) {
        throw new Error(`Invalid request: ${JSON.stringify(data)}`);
      } else if (status === 413) {
        throw new Error('Image file too large');
      } else {
        throw new Error(`Plant.id API error: ${status} - ${JSON.stringify(data)}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from Plant.id API. Please check your internet connection.');
    } else {
      // Error in setting up the request
      throw new Error(`Error calling Plant.id API: ${error.message}`);
    }
  }
}

module.exports = {
  getPlantDiagnosis
};
