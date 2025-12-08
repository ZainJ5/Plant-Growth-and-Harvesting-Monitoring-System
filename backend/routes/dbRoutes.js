/*
* This file contains database routes that can be directly used in the front and
  backend of the code.
*/
import { db, insertData, getData } from "../utils/db.js";
import express from "express";
import bcrypt from "bcrypt";
import { where, query, collection } from "firebase/firestore";

const router = express.Router();

/* 
* Insert user into the database
* Returns: an object with success for error handling and if false, contains an
    error message.
* Accepts an object with name data in the request body.
* With types:
*   data = {
        firstname: string,
        lastname: string,
        username: string with no spaces,
        email: case sensitive string,
        password: string
    }
* Document/user id is assigned randomly.
* password stored is encrypted using bcrypt.
*/
router.post("/api/user/insert", async (req, res) => {
    try {
        // Receiving the user data here
        const data = req.body.data;

        if (!data) {
            return res.status(400).json({ 
                success: false, message: "No data provided."
            });
        }

        // Now check if the email already exists in the database
        const q = query(
            collection(db, "users"), where("email", "==", data.email)
        );

        let result = await getData(q);

        if (result.length >= 1) { // some result returned (user exists)
            return res.status(500).json({ 
                success: false, message: "User already exists."
            });
        }

        // Now hash the password and insert the data
        let newData = {...data, password: await bcrypt.hash(data.password, 10)};
        result = await insertData("users", newData);
    
        if (result.success == true) {
            res.status(200).json({ success: true });
        }
        else {
            res.status(500).json({ 
                success: false, message: "Could not create user."
            });
        }
    }
    catch (error) {
        res.status(500).json({ 
            success: false, message: `Could not add user, Error: ${error}`
        });
    }
});

export default router;