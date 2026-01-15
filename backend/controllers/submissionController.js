import Submission from '../models/Submission.js';
import User from '../models/User.js';

// @desc    Get all submissions for the logged-in student
// @route   GET /api/submissions/me
// @access  Private (Student)
export const getSubmissionsForStudent = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate('course', 'title')
      .populate('quiz', 'title')
      .sort({ createdAt: -1 });
      
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for an instructor's courses
// @route   GET /api/submissions/instructor
// @access  Private (Instructor)
export const getSubmissionsForInstructor = async (req, res) => {
  try {
    // Find courses this instructor created
    const user = await User.findById(req.user._id);
    
    // Find all submissions that belong to those courses
    const submissions = await Submission.find({ course: { $in: user.coursesCreated } })
      .populate('course', 'title')
      .populate('quiz', 'title')
      .populate('student', 'name email') // Need to know which student
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all submissions for a parent's children
// @route   GET /api/submissions/parent
// @access  Private (Parent)
export const getSubmissionsForParent = async (req, res) => {
  try {
    // Find this parent's children
    const parent = await User.findById(req.user._id);
    
    // Find all submissions that belong to those children
    const submissions = await Submission.find({ student: { $in: parent.children } })
      .populate('course', 'title')
      .populate('quiz', 'title')
      .populate('student', 'name') // Need to know which child
      .sort({ createdAt: -1 });
      
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};