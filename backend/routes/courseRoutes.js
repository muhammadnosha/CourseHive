import express from 'express';
import { 
  getAllCourses, 
  createCourse, 
  getCourseById, 
  updateCourse, 
  deleteCourse,
  enrollStudent
} from '../controllers/courseController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllCourses)
  .post(protect, authorize('admin', 'instructor'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, authorize('admin', 'instructor'), updateCourse)
  .delete(protect, authorize('admin', 'instructor'), deleteCourse);
  
router.route('/:id/enroll')
  .post(protect, authorize('student'), enrollStudent);
  
export default router;