import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  answer: {
    type: String, // Stores the selected option index or the text/code answer
    required: true,
  },
});

const SubmissionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    default: 0,
  },
  graded: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Submission = mongoose.model('Submission', SubmissionSchema);

export default Submission;