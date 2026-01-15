import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import Submission from '../models/Submission.js';
import Course from '../models/Course.js';
import Profile from '../models/Profile.js';

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private (Instructor, Admin)
export const createQuiz = async (req, res) => {
  const { title, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to add quiz to this course' });
    }

    const quiz = new Quiz({
      title,
      course: courseId,
      instructor: req.user._id,
    });

    const createdQuiz = await quiz.save();

    // Add quiz to course
    course.quizzes.push(createdQuiz._id);
    await course.save();

    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a question to a quiz
// @route   POST /api/quizzes/:quizId/questions
// @access  Private (Instructor, Admin)
export const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { questionText, options } = req.body; // only these two fields now

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is the instructor or admin
    if (quiz.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    const question = new Question({
      quiz: quizId,
      questionText,
      questionType: 'MCQ', // hardcoded type
      options,
    });

    const createdQuestion = await question.save();

    // Add question to quiz
    quiz.questions.push(createdQuestion._id);
    await quiz.save();

    res.status(201).json(createdQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a quiz (for students to take)
// @route   GET /api/quizzes/:quizId
// @access  Private (Student)
export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate('questions', '-correctAnswer'); // hide correct answers

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // TODO: Check if student is enrolled in the course
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a quiz (for instructors to edit)
// @route   GET /api/quizzes/:quizId/edit
// @access  Private (Instructor, Admin)
export const getQuizForInstructor = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate('questions'); // include correct answers

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user is the instructor or admin
    if (quiz.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit a quiz
// @route   POST /api/quizzes/:quizId/submit
// @access  Private (Student)
export const submitQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // --- Simplified auto-grading (all MCQs) ---
    let score = 0;
    for (const subAnswer of answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === subAnswer.question
      );
      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.text === subAnswer.answer) {
          score += 1;
        }
      }
    }

    const totalPoints = quiz.questions.length;
    const finalScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    const submission = new Submission({
      quiz: quizId,
      student: req.user._id,
      course: quiz.course,
      answers,
      score: finalScore,
      graded: true, // auto-graded
    });

    await submission.save();

    // --- Gamification Rewards ---
    if (finalScore >= 50) {
      const profile = await Profile.findOne({ user: req.user._id });

      if (profile) {
        // +100 points for passing
        profile.points += 100;

        // Badge: First Quiz Passed
        const firstBadge = "First Quiz Passed";
        if (!profile.badges.some(b => b.name === firstBadge)) {
          profile.badges.push({
            name: firstBadge,
            icon: "🏅",
            dateEarned: new Date(),
          });
        }

        // Badge: Perfect Score
        if (finalScore === 100 && !profile.badges.some(b => b.name === "Perfect Score!")) {
          profile.badges.push({
            name: "Perfect Score!",
            icon: "🎯",
            dateEarned: new Date(),
          });
        }

        await profile.save();
      }
    }

    res.status(201).json({
      message: 'Quiz submitted!',
      score: finalScore,
      submissionId: submission._id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
