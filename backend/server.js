import express from "express";
import { connectDB } from "./utils/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/user.js";
import plantRoutes from "./routes/plantRoutes.js";
import dotenv from "dotenv";
import memorystore from "memorystore";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

// Fail fast if critical env vars are missing
const requiredEnv = ['JWT_SECRET', 'SESSION_SECRET', 'PLANTS_ID_API_KEY'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
        `Missing required environment variables: ${missingEnv.join(
            ', '
        )}. Please define them in your environment (e.g. .env file).`
    );
    process.exit(1);
}

const app = express();
const MemoryStore = memorystore(session);
const port = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(express.json());
app.use(
    session({
        cookie: {
            maxAge: 86400000,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        },
        store: new MemoryStore({
            checkPeriod: 86400000
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/", plantRoutes);

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