import express from "express";
import { connectDB } from "./utils/db.js";
import dbRoutes from "./routes/dbRoutes.js";
import userRoutes from "./routes/user.js";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/", dbRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server Running on port: ${port}`);
    connectDB();
});