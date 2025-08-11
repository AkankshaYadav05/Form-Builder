import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import formRoutes from "./routes/FormRoutes.js";
import responseRoutes from "./routes/responses.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',  // your React app origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // allow DELETE method
  allowedHeaders: ['Content-Type', 'Authorization'], // other headers if needed
}));

app.use(express.json({ limit: '50mb' })); // Increase JSON body size limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase form data limit
app.use("/api", responseRoutes);

// Test route
app.get("/api/forms/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Use form routes for /api/forms
app.use("/api/forms", formRoutes);

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/formDB")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
