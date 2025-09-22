import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import userRoutes from "./routes/users.js";
import formRoutes from "./routes/FormRoutes.js";
import responseRoutes from "./routes/responses.js";

const app = express();

// ===== CORS =====
app.use(cors({
  origin: "http://localhost:5173", // your frontend
  credentials: true,               // allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ===== Session =====
app.use(session({
  secret: "SECRET_KEY",  // move to .env for production
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

// ===== MongoDB Connection =====
mongoose.connect("mongodb://127.0.0.1:27017/formDB")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));
