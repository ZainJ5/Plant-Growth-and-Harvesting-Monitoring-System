const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Try to load firebase-key.json, fallback to serviceAccountKey.json if it doesn't exist
let serviceAccount;
try {
  serviceAccount = require(path.join(__dirname, 'firebase-key.json'));
} catch (error) {
  // Fallback to serviceAccountKey.json if firebase-key.json doesn't exist
  try {
    serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
  } catch (fallbackError) {
    throw new Error('Firebase service account key file not found. Please ensure firebase-key.json or serviceAccountKey.json exists in the project root.');
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export Firestore database instance
const db = admin.firestore();

module.exports = db;
