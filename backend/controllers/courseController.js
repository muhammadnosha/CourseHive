import Course from '../models/Course.js';
import User from '../models/User.js';
import Profile from '../models/Profile.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name');
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name')
      .populate('students', 'name')
      .populate('quizzes', 'title');
      
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin, Instructor)
export const createCourse = async (req, res) => {
  const { title, description, difficulty, modules } = req.body;
  
  try {
    const course = new Course({
      title,
      description,
      difficulty,
      modules,
      instructor: req.user._id,
    });

    const createdCourse = await course.save();
    
    // Add course to instructor's created list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { coursesCreated: createdCourse._id }
    });
    
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin, Instructor)
export const updateCourse = async (req, res) => {
  const { title, description, difficulty, modules } = req.body;
  
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this course' });
    }
    
    course.title = title || course.title;
    course.description = description || course.description;
    course.difficulty = difficulty || course.difficulty;
    course.modules = modules || course.modules;

    const updatedCourse = await course.save();
    res.status(200).json(updatedCourse);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin, Instructor)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this course' });
    }
    
    // TODO: Also delete associated Quizzes, Submissions, etc. This is complex.
    await course.deleteOne();
    
    // TODO: Remove course from users' enrolled/created lists

    res.status(200).json({ message: 'Course removed' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- UPDATED FUNCTION ---
// @desc    Enroll a student in a course (for FREE courses or SUBSCRIBED users)
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
export const enrollStudent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    if (user.coursesEnrolled.includes(course._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // --- NEW PAYMENT LOGIC ---
    // Check if the course is paid
    if (course.price > 0) {
      // If it's paid, check if the user has an active subscription
      if (user.subscription.status !== 'active' || user.subscription.expiryDate < new Date()) {
        return res.status(403).json({ 
          message: 'This is a paid course. Please purchase it or subscribe to enroll.' 
        });
      }
      // If subscribed, allow free access to paid course
    }
    // --- END PAYMENT LOGIC ---
    
    course.students.push(user._id);
    user.coursesEnrolled.push(course._id);
    
    await course.save();
    await user.save();
    
    // Award 50 points for enrolling
    await Profile.findOneAndUpdate(
      { user: user._id },
      { $inc: { points: 50 } }
    );
    
    res.status(200).json({ message: 'Enrolled successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
