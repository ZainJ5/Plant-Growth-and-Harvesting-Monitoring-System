import express from "express";
import { connectDB } from "./utils/db.js";
import dbRoutes from "./routes/dbRoutes.js";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(dbRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server Running on port: ${port}`);
    connectDB();
});