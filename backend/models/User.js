import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import Profile from './Profile.js'; // Import Profile

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'parent', 'instructor', 'admin'],
      default: 'student',
    },
    // Link for student to their parent
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Link for parent to their children
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Courses a student is enrolled in
    coursesEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    // Courses an instructor has created
    coursesCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    // Link to gamification profile
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },

    // --- Subscription Information ---
    subscription: {
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
      },
      plan: {
        type: String,
        enum: ['monthly', 'yearly', 'none'],
        default: 'none',
      },
      expiryDate: {
        type: Date,
      },
    },
    // --- End Subscription ---
  },
  { timestamps: true }
);

// --- Mongoose Middleware ---

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Automatically create a gamification profile when a new user is created
UserSchema.post('save', async function (doc, next) {
  if (this.isNew) {
    try {
      await Profile.create({ user: this._id });
    } catch (error) {
      console.error('Failed to create profile for user:', this._id, error);
    }
  }
  next();
});

// --- Instance Methods ---

// Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
