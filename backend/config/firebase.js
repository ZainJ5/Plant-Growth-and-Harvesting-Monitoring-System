const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccount = require(path.join(__dirname, '..', '@firebase-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export Firestore database instance
const db = admin.firestore();

module.exports = db;
