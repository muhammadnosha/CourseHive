import express from 'express';
import { 
  createQuiz, 
  addQuestion, 
  getQuiz, 
  getQuizForInstructor, 
  submitQuiz 
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ---------------------------
// Instructor/Admin routes
// ---------------------------

// Create a new quiz
router.route('/')
  .post(protect, authorize('admin', 'instructor'), createQuiz);

// Add a question to a quiz
router.route('/:quizId/questions')
  .post(protect, authorize('admin', 'instructor'), addQuestion);

// Get a quiz (for instructors to edit, includes correct answers)
router.route('/:quizId/edit')
  .get(protect, authorize('admin', 'instructor'), getQuizForInstructor);

// ---------------------------
// Student routes
// ---------------------------

// Get a quiz (for students to take)
router.route('/:quizId')
  .get(protect, authorize('student'), getQuiz);

// Submit a quiz
router.route('/:quizId/submit')
  .post(protect, authorize('student'), submitQuiz);

export default router;
