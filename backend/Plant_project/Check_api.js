const axios = require('axios');
require('dotenv').config();

// Get your key from the .env file
const API_KEY = process.env.PLANT_ID_API_KEY; 
const API_URL = "https://plant.id/api/v3/usage";

async function checkConnection() {
    console.log("Checking connection to Plant.id...");

    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("-----------------------------------------");
        console.log("✅ SUCCESS: Your backend is connected!");
        console.log("-----------------------------------------");
        console.log("Usage Details:");
        console.log(`- Total Credits: ${response.data.total}`);
        console.log(`- Used Credits: ${response.data.used}`);
        console.log(`- Remaining: ${response.data.remaining}`);
        console.log("-----------------------------------------");
        
    } catch (error) {
        console.error("❌ CONNECTION FAILED");
        if (error.response) {
            // The server responded with a status code outside the 2xx range
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${JSON.stringify(error.response.data)}`);
            console.log("\nTip: Check if your API key in .env is copied correctly.");
        } else {
            console.error(`Error: ${error.message}`);
        }
    }
}

checkConnection();