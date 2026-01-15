import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  badges: [{
    name: String,
    icon: String, // e.g., "trophy"
    dateEarned: {
      type: Date,
      default: Date.now,
    },
  }],
  // You can add more gamification fields here
}, { timestamps: true });

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;