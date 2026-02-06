const axios = require('axios');
require('dotenv').config();

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
 * Sends Base64 image to Plant.id v3 API for health identification
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<Object>} Essential health results: is_healthy, disease names, and suggestions
 */
async function identifyPlantHealth(base64Image) {
  try {
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
        }
      }
    );

    // Extract essential health results
    const healthResult = response.data.health;
    
    if (!healthResult) {
      return {
        is_healthy: null,
        diseases: [],
        suggestions: []
      };
    }

    // Extract disease names
    const diseases = healthResult.diseases 
      ? healthResult.diseases.map(disease => ({
          name: disease.name,
          probability: disease.probability
        }))
      : [];

    // Extract suggestions
    const suggestions = healthResult.suggestions || [];

    return {
      is_healthy: healthResult.is_healthy,
      diseases: diseases,
      suggestions: suggestions
    };

  } catch (error) {
    console.error('Error calling Plant.id API:', error.message);
    if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
      throw new Error(`Plant.id API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
}

module.exports = {
  convertBufferToBase64,
  identifyPlantHealth
};
