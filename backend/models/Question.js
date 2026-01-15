import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['MCQ'], // Only allow MCQ
    default: 'MCQ', // Automatically set it to MCQ
    required: true,
  },
  // For MCQ
  options: [{
    text: String,
    isCorrect: Boolean,
  }],
  // For Subjective/Coding
  correctAnswer: {
    type: String, // Can store sample answer or test case logic (as JSON string)
  },
}, { timestamps: true });

const Question = mongoose.model('Question', QuestionSchema);

export default Question;