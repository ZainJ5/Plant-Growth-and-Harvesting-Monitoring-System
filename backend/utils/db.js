/*
* This file contains the main database-related functions.
* These are general purpose functions that connect the database, and also help
  perform read/write operations.
*/

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; // This is for analytics

let app;  // Main firestore app
export let db;   // instance of the database. Exported for use in other files.

export function connectDB() {
    const firebaseConfig = {
        apiKey: process.env.DB_API_KEY,
        authDomain: process.env.DB_AUTH_DOMAIN,
        projectId: process.env.DB_PROJECT_ID,
        storageBucket: process.env.DB_STORAGE_BUCKET,
        messagingSenderId: process.env.DB_SENDER_ID,
        appId: process.env.DB_APP_ID,
        // measurementId: process.env.DB_MEASUREMENT_ID // For analytics
    };

    // Initializing the firestore app and the database instance
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);

        if (app) {
            console.log("Connected the database.");
            return true; // Success
        }
        else {
            console.log("Could not connect the database.");
            return false; // Failure
        }
    } catch (error) {
        console.error("Could not connect the database. Error: ", error);
        return false; // Possibly server error 500
    }
}

/* 
* Data expected to be an object.
* Returns: an object with success for error handling and if its true, then docID
  is also returned.
*/
export async function insertData(collectionName, data) {
    if (!db) {
        console.error("Database not initialized");
        return { success: false };
    }

    try {
        /* 
        * inserting the document inside the collection.
        * addDoc returns a reference to document.
        * Doing this to get the new document's id.
        */
        const docRef = await addDoc(collection(db, collectionName), data);

        console.log ("Data inserted. Document ID: ", docRef.id);
        return { success: true, docID: docRef.id };
    } catch (error) {
        console.error("Error inserting document: ", error);
        return { success: false };
    }
}

/*
* simple function to fetch data from the db using some query.
* Returns: data in the form of an array that contains the data objects.
    If empty array [], no data found.
* query is expected to be in the firestore format.
* For example: 
    query(collection(db, collectionName), where("email", "==", someEmail))
* Remember that db has been exported from this file and can be imported elswhere
  for use. Such as writing queries.
*/
export async function getData(query) {
    const querySnapshot = await getDocs(query);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}