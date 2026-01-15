import User from '../models/User.js';
import Course from '../models/Course.js';
import Profile from '../models/Profile.js';

// @desc    Simulate purchasing a single course
// @route   POST /api/payments/purchase-course/:courseId
// @access  Private (Student)
export const purchaseCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const user = await User.findById(req.user._id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    if (user.coursesEnrolled.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    
    // --- Grant Access ---
    course.students.push(user._id);
    user.coursesEnrolled.push(course._id);
    
    await course.save();
    await user.save();
    
    // Award 50 points (same as enrolling)
    await Profile.findOneAndUpdate(
      { user: user._id },
      { $inc: { points: 50 } }
    );
    // --- End ---
    
    res.status(200).json({ message: 'Purchase successful! You are now enrolled.' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Simulate purchasing a subscription
// @route   POST /api/payments/subscribe
// @access  Private (Student)
export const purchaseSubscription = async (req, res) => {
  const { plan } = req.body; // 'monthly' or 'yearly'
  
  try {
    const expiryDate = new Date();
    if (plan === 'monthly') {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (plan === 'yearly') {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    // --- Grant Access ---
    await User.findByIdAndUpdate(req.user._id, {
      'subscription.status': 'active',
      'subscription.plan': plan,
      'subscription.expiryDate': expiryDate,
    });
    // --- End ---
    
    // Award 500 points for subscribing
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { points: 500 } }
    );

    res.status(200).json({ message: 'Subscription successful!' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};