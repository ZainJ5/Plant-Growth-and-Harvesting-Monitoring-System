import express from "express";
import { connectDB } from "./utils/db.js";
import dbRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import memorystore from "memorystore";
import session from "express-session";
import cookieParser from "cookie-parser";

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const MemoryStore = memorystore(session);
const port = 5000;

app.use(express.json());    
app.use(session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || "The Secret"
    })
);
app.use(cookieParser());

app.use(dbRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(port, () => {
    console.log(`Server Running on port: ${port}`);
    connectDB();
});