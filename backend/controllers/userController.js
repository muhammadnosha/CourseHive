import User from '../models/User.js';
import Profile from '../models/Profile.js'; // <-- ADD THIS
import Submission from '../models/Submission.js'; // <-- ADD THIS

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
 const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a parent's children
// @route   GET /api/users/my-children
// @access  Private (Parent)
 const getMyChildren = async (req, res) => {
  try {
    // Find the parent and populate their children's details
    const parent = await User.findById(req.user._id)
      .populate({
        path: 'children', // Populate the 'children' array
        select: 'name email coursesEnrolled', // Select these fields from each child
        populate: { // *Then*, populate the 'coursesEnrolled' field *within* each child
          path: 'coursesEnrolled',
          select: 'title _id' // We only need the course title and _id
        }
      });
      
    if (!parent) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(parent.children);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error"});
  }
};

// @desc    Get current user profile (populated)
// @route   GET /api/users/me
// @access  Private
 const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('coursesEnrolled', 'title description')
      .populate('coursesCreated', 'title description')
      .populate('profile'); // optional: gamification or extra profile model

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent an admin from deleting their own account
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    // --- Delete Associated Data ---
    // 1. Delete their gamification profile
    await Profile.deleteOne({ user: user._id });
    
    // 2. Delete all their quiz submissions
    await Submission.deleteMany({ student: user._id });
    
    // TODO: Add logic to handle re-assigning instructor courses
    // TODO: Add logic to unlink children from a parent
    
    // --- Finally, delete the user ---
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error"});
  }
};

// --- Export all functions ---
export { getAllUsers, getMyChildren, getMe ,deleteUser};
