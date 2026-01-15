import express from 'express';
import { getLeaderboard, getMyProfile } from '../controllers/gamificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/leaderboard').get(getLeaderboard);
router.route('/profile/me').get(protect, getMyProfile);

export default router;