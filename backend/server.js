import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js'; // <-- ADD THIS
import gamificationRoutes from './routes/gamificationRoutes.js'; // <-- ADD THIS
import submissionRoutes from './routes/submissionRoutes.js'; // <-- ADD THIS
import { fileURLToPath } from 'url'; // <-- Make sure this is imported
import scormRoutes from './routes/scormRoutes.js'; // <-- 1. ADD THIS IMPORT
import paymentRoutes from './routes/paymentRoutes.js'; // <-- 1. ADD THIS

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url); // <-- 2. ADD THIS
const __dirname = path.dirname(__filename); // <-- 3. ADD THIS

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes); // <-- ADD THIS
app.use('/api/gamification', gamificationRoutes); // <-- ADD THIS
app.use('/api/submissions', submissionRoutes);
app.use('/api/scorm', scormRoutes); // <-- 4. ADD THIS ROUTE
app.use('/scorm_packages', express.static(path.join(__dirname, 'public/scorm_packages')));
app.use('/api/payments', paymentRoutes); // <-- 2. ADD THIS

// --- Database Connection ---
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Connected to MongoDB');
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });




