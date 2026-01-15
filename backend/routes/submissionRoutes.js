import express from 'express';
import { 
  getSubmissionsForStudent,
  getSubmissionsForInstructor,
  getSubmissionsForParent
} from '../controllers/submissionController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student route
router.route('/me')
  .get(protect, authorize('student'), getSubmissionsForStudent);
  
// Instructor route
router.route('/instructor')
  .get(protect, authorize('instructor'), getSubmissionsForInstructor);

// Parent route
router.route('/parent')
  .get(protect, authorize('parent'), getSubmissionsForParent);
  
export default router;