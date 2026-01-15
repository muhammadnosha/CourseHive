import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, phone, password, role, parentEmail } = req.body;

  try {
    // Check if user already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: 'User with this phone number already exists' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: role || 'student',
    });

    // If student and parentEmail is provided, link them
    if (user.role === 'student' && parentEmail) {
      const parent = await User.findOne({ email: parentEmail, role: 'parent' });
      if (parent) {
        user.parent = parent._id;
      } else {
        // You might want to handle this differently
        // e.g., invite parent or require parent to exist
        console.warn(`Parent with email ${parentEmail} not found or is not a parent.`);
      }
    }
    
    await user.save();

    // If parent was found and user is student, add student to parent's children array
    if (user.parent) {
        await User.findByIdAndUpdate(user.parent, {
            $push: { children: user._id }
        });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
