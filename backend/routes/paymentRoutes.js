import express from 'express';
import { purchaseCourse, purchaseSubscription } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/purchase-course/:courseId')
  .post(protect, authorize('student'), purchaseCourse);
  
router.route('/subscribe')
  .post(protect, authorize('student'), purchaseSubscription);

export default router;