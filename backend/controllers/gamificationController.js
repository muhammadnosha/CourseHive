import Profile from '../models/Profile.js';
import User from '../models/User.js'; // <-- MAKE SURE THIS IS IMPORTED

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    // Find top profiles and populate user info
    let leaderboard = await Profile.find({})
      .sort({ points: -1 })
      .limit(10)
      .populate('user', 'name');
      
    // --- THIS IS THE FIX ---
    // Filter out any profiles where the user has been deleted (is null)
    leaderboard = leaderboard.filter(profile => profile.user !== null);
    // --- END FIX ---
      
    res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my profile (points and badges)
// @route   GET /api/profile/me
// @access  Private
//
// --- THIS IS THE UPDATED FUNCTION ---
//
export const getMyProfile = async (req, res) => {
  try {
    // 1. Try to find the profile
    let profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      // 2. If it doesn't exist, create it on-demand
      console.log(`No profile found for user ${req.user._id}, creating one...`);
      profile = new Profile({
        user: req.user._id,
        points: 0,
        badges: [],
      });
      await profile.save();
      
      // 3. Link this new profile back to the User document
      await User.findByIdAndUpdate(req.user._id, { profile: profile._id });
      console.log(`Profile created and linked to user.`);
    }
    
    // 4. At this point, 'profile' is valid. Populate and return.
    const populatedProfile = await profile.populate('user', 'name email');
    res.status(200).json(populatedProfile);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};