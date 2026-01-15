import mongoose from 'mongoose';

// Define the Module schema
const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // You could add lessons/videos here later if needed
});

// Define the Course schema
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    modules: [ModuleSchema],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
    price: {
      type: Number,
      required: true,
      default: 0, // Default to 0 (free)
    },
  },
  { timestamps: true }
);

// Create the Course model
const Course = mongoose.model('Course', CourseSchema);

export default Course;
