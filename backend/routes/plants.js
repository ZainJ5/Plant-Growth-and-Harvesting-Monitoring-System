import express from 'express';
import { db, insertData, getData } from '../utils/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { where, query, collection, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

const router = express.Router();

/**
 * POST /api/plants
 * 
 * Create a new plant for the authenticated user
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   "name": "Tomato Plant",
 *   "species": "Solanum lycopersicum",
 *   "location": "Garden Bed A",
 *   "plantDate": "2025-01-15",
 *   "soilMoisture": 65,
 *   "temperature": 24.5,
 *   "humidity": 60,
 *   "notes": "Healthy growth stage"
 * }
 * 
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "Plant created successfully",
 *   "plantId": "doc_id_here",
 *   "plant": { ...plant data with id }
 * }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, species, location, plantDate, soilMoisture, temperature, humidity, notes } = req.body;

    // Validate required fields
    if (!name || !species) {
      return res.status(400).json({
        success: false,
        message: 'Plant name and species are required'
      });
    }

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Create plant object with user association
    const plantData = {
      userId: req.user.id, // From JWT token
      name,
      species,
      location: location || '',
      plantDate: plantDate || new Date().toISOString().split('T')[0],
      soilMoisture: soilMoisture || 0,
      temperature: temperature || 0,
      humidity: humidity || 0,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const result = await insertData('plants', plantData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Plant created successfully',
        plantId: result.docID,
        plant: { id: result.docID, ...plantData }
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create plant'
      });
    }

  } catch (error) {
    console.error('Create plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating plant',
      error: error.message
    });
  }
});

/**
 * GET /api/plants
 * 
 * Get all plants for the authenticated user
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "Plants retrieved successfully",
 *   "plants": [
 *     {
 *       "id": "plant_doc_id",
 *       "name": "Tomato Plant",
 *       "species": "Solanum lycopersicum",
 *       "soilMoisture": 65,
 *       ...
 *     }
 *   ]
 * }
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Query all plants for this user
    const q = query(
      collection(db, 'plants'),
      where('userId', '==', req.user.id)
    );

    const plants = await getData(q);

    res.status(200).json({
      success: true,
      message: 'Plants retrieved successfully',
      plants: plants
    });

  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving plants',
      error: error.message
    });
  }
});

/**
 * GET /api/plants/:plantId
 * 
 * Get a specific plant by ID (only if it belongs to the user)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "Plant retrieved successfully",
 *   "plant": { ...plant data }
 * }
 */
router.get('/:plantId', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.params;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Get the plant document
    const plantRef = doc(db, 'plants', plantId);
    const plantSnap = await getDoc(plantRef);

    if (!plantSnap.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    const plantData = plantSnap.data();

    // Verify the plant belongs to the current user
    if (plantData.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This plant does not belong to you'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Plant retrieved successfully',
      plant: { id: plantId, ...plantData }
    });

  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving plant',
      error: error.message
    });
  }
});

/**
 * PUT /api/plants/:plantId
 * 
 * Update a plant (only if it belongs to the user)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   "name": "Updated Tomato",
 *   "soilMoisture": 70,
 *   "temperature": 25,
 *   "humidity": 65,
 *   "notes": "Growing well"
 * }
 * 
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "Plant updated successfully",
 *   "plant": { ...updated plant data }
 * }
 */
router.put('/:plantId', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.params;
    const updateData = req.body;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Get the plant document first
    const plantRef = doc(db, 'plants', plantId);
    const plantSnap = await getDoc(plantRef);

    if (!plantSnap.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    const plantData = plantSnap.data();

    // Verify the plant belongs to the current user
    if (plantData.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This plant does not belong to you'
      });
    }

    // Prepare update data (don't allow changing userId or createdAt)
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update the document
    await updateDoc(plantRef, dataToUpdate);

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      plant: { id: plantId, ...plantData, ...dataToUpdate }
    });

  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating plant',
      error: error.message
    });
  }
});

/**
 * DELETE /api/plants/:plantId
 * 
 * Delete a plant (only if it belongs to the user)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response (Success):
 * {
 *   "success": true,
 *   "message": "Plant deleted successfully"
 * }
 */
router.delete('/:plantId', authenticateToken, async (req, res) => {
  try {
    const { plantId } = req.params;

    if (!db) {
      return res.status(500).json({
        success: false,
        message: 'Database not connected'
      });
    }

    // Get the plant document first
    const plantRef = doc(db, 'plants', plantId);
    const plantSnap = await getDoc(plantRef);

    if (!plantSnap.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    const plantData = plantSnap.data();

    // Verify the plant belongs to the current user
    if (plantData.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This plant does not belong to you'
      });
    }

    // Delete the document
    await deleteDoc(plantRef);

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully'
    });

  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting plant',
      error: error.message
    });
  }
});

export default router;
