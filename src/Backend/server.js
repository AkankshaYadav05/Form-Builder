import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/users.js";
import formRoutes from "./routes/FormRoutes.js";
import responseRoutes from "./routes/responses.js";

// ===== Setup __dirname in ES modules =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== CORS =====
app.use(cors({
  origin: "http://localhost:5173", // frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ===== Multer Configuration =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads')); // save in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // or add timestamp for uniqueness
  }
});

const upload = multer({ storage });

// ===== File Upload Endpoint =====
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Return file path for frontend to save in DB
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// ===== Serve Uploaded Files =====
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ===== Session =====
app.use(session({
  secret: "SECRET_KEY", // move to .env in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1:27017/formDB",
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// ===== Routes =====
app.use("/api/users", userRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/responses", responseRoutes);

// ===== Test Route =====
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend is working!" });
});

// ===== MongoDB Connection & Start Server =====
mongoose.connect("mongodb://127.0.0.1:27017/formDB")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));
