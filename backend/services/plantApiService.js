import axios from 'axios';

// const PLANT_ID_API_KEY = process.env.PLANTS_ID_API_KEY;
const PLANT_ID_API_URL = 'https://api.plant.id/v3/identification';

/**
 * Converts an image buffer to Base64 string
 * @param {Buffer} imageBuffer - The image buffer from multer
 * @returns {string} Base64 encoded string
 */
export function convertBufferToBase64(imageBuffer) {
  return imageBuffer.toString('base64');
}

/**
 * Sends Base64 image to Plant.id v3 API for health identification
 * @param {string} base64Image - Base64 encoded image string
 * @returns {Promise<Object>} Essential health results: is_healthy, disease names, and suggestions
 */
export async function identifyPlantHealth(base64Image) {
  try {
    const response = await axios.post(
      PLANT_ID_API_URL,
      {
        images: [base64Image],
        health: 'all'
      },
      {
        headers: {
          'Api-Key': process.env.PLANTS_ID_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract essential health results
    const healthResult = response.data.result;

    console.log(healthResult);

    if (!healthResult) {
      return {
        is_healthy: null,
        diseases: [],
        suggestions: []
      };
    }

    // Extract disease names
    const diseases = healthResult.disease
      ? healthResult.disease.suggestions.map(dis => ({
          name: dis.name,
          probability: dis.probability,
          suggestions: dis.suggestions
        }))
      : [];

    const dieseasesQuestions = {
      question: healthResult.disease.question.text,
      options: healthResult.disease.question.options
    };

    // Extract suggestions
    const classification = healthResult.classification.suggestions || [];

    return {
      is_healthy: healthResult.is_healthy,
      is_plant: healthResult.is_plant,
      diseases: diseases,
      dieseasesQuestions: dieseasesQuestions,
      classification: classification
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