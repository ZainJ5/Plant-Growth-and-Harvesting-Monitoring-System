/**
 * Plant API Service
 * 
 * This service handles all API calls related to plants
 * Automatically includes the JWT token from localStorage
 */

const API_BASE_URL = 'http://localhost:5000/api/plants';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to create headers with authorization
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

export const plantAPI = {
  /**
   * Create a new plant
   * @param {Object} plantData - Plant data to create
   * @returns {Promise<Object>} - Created plant data
   */
  async createPlant(plantData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(plantData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  },

  /**
   * Get all plants for the user
   * @returns {Promise<Array>} - Array of plants
   */
  async getAllPlants() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  },

  /**
   * Get a specific plant by ID
   * @param {string} plantId - Plant document ID
   * @returns {Promise<Object>} - Plant data
   */
  async getPlantById(plantId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${plantId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching plant:', error);
      throw error;
    }
  },

  /**
   * Update a plant
   * @param {string} plantId - Plant document ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} - Updated plant data
   */
  async updatePlant(plantId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${plantId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updateData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  },

  /**
   * Delete a plant
   * @param {string} plantId - Plant document ID
   * @returns {Promise<Object>} - Deletion confirmation
   */
  async deletePlant(plantId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${plantId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  },

  /**
   * Update sensor readings for a plant
   * @param {string} plantId - Plant document ID
   * @param {Object} readings - Sensor readings object
   * @returns {Promise<Object>} - Updated plant data
   */
  async updateSensorReadings(plantId, readings) {
    try {
      const response = await fetch(`${API_BASE_URL}/${plantId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          soilMoisture: readings.soilMoisture,
          temperature: readings.temperature,
          humidity: readings.humidity
        })
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating sensor readings:', error);
      throw error;
    }
  }
};

export default plantAPI;
