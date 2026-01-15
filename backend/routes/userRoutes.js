import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
// Make sure to import getMe
import { getAllUsers, getMyChildren, getMe,deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllUsers);

// New route for parents to see their children
router.route('/my-children')
  .get(protect, authorize('parent'), getMyChildren);
  
// New route for any logged-in user to get their own populated data
router.route('/me')
  .get(protect, getMe);

// Add other routes: GET /:id, PUT /:id, DELETE /id
router.route('/:id')
  .delete(protect, authorize('admin'), deleteUser);

export default router;