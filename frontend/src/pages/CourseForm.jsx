import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CourseForm = () => {
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Beginner',
  });
  const [modules, setModules] = useState([]);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); // 'id' is the courseId
  const navigate = useNavigate();

  // Fetches the course data (and its modules/quizzes)
  const fetchCourse = useCallback(async () => {
    if (id) {
      setLoading(true);
      try {
        const res = await axios.get(`/api/courses/${id}`);
        setCourse(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          difficulty: res.data.difficulty,
        });
        setModules(res.data.modules || []);
      } catch (err) {
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Module Handlers ---
  const handleModuleChange = (index, e) => {
    const updatedModules = modules.map((module, i) => 
      i === index ? { ...module, [e.target.name]: e.target.value } : module
    );
    setModules(updatedModules);
  };

  const addModule = () => {
    setModules([...modules, { title: '', description: '' }]);
  };

  const removeModule = (index) => {
    setModules(modules.filter((_, i) => i !== index));
  };
  
  // --- Quiz Handler ---
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuizTitle) return alert('Please enter a quiz title.');
    
    try {
      await axios.post('/api/quizzes', {
        title: newQuizTitle,
        courseId: id,
      });
      alert('Quiz created! Now add questions.');
      setNewQuizTitle('');
      fetchCourse(); // Refresh the quiz list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create quiz.');
    }
  };

  // --- Main Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const courseData = { ...formData, modules };

    try {
      if (id) {
        await axios.put(`/api/courses/${id}`, courseData);
        alert('Course updated successfully!');
      } else {
        await axios.post('/api/courses', courseData);
        alert('Course created successfully!');
      }
      navigate('/instructor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  // This just shows the "Create" form if there's no ID
  if (!id && !loading) {
    return (
      <div className="text-center p-10 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">Create a Course</h2>
        <p className="mb-4">To add modules and quizzes, you must first create the course.</p>
        <p>This form will be enabled once the course is created.</p>
        {/* Render a simplified form for creation */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto text-left">
          {/* ... (render title, description, difficulty fields) ... */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Course Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                   className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                      rows="4" className="w-full px-4 py-2 border rounded-lg" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-white">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold">
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </div>
    );
  }

  if (loading && !course) return <div>Loading course editor...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Edit Course: {course?.title}
      </h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      {/* --- Part 1: Main Course Details Form --- */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="title">Course Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange}
                 className="w-full px-4 py-2 border rounded-lg" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange}
                    rows="6" className="w-full px-4 py-2 border rounded-lg" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="difficulty">Difficulty</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg bg-white">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        
        {/* --- Part 2: Module Editor --- */}
        <div className="my-8 border-t pt-6">
          <h3 className="text-2xl font-semibold mb-4">Manage Modules</h3>
          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Module {index + 1}</h4>
                  <button type="button" onClick={() => removeModule(index)} 
                          className="text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-600">Title</label>
                  <input type="text" name="title" value={module.title} onChange={(e) => handleModuleChange(index, e)}
                         className="w-full px-3 py-2 border rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Description</label>
                  <textarea name="description" value={module.description} onChange={(e) => handleModuleChange(index, e)}
                            rows="2" className="w-full px-3 py-2 border rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addModule} 
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            + Add Module
          </button>
        </div>
        
        {/* --- Save Button for Details & Modules --- */}
        <button type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Saving...' : 'Save Course Details & Modules'}
        </button>
      </form>
      
      {/* --- Part 3: Quiz Manager --- */}
      <div className="my-8 border-t pt-6">
        <h3 className="text-2xl font-semibold mb-4">Manage Quizzes</h3>
        
        {/* List existing quizzes */}
        <div className="space-y-3 mb-6">
          {course?.quizzes.length > 0 ? (
            course.quizzes.map(quiz => (
              <div key={quiz._id} className="p-4 border rounded-md flex justify-between items-center">
                <span className="text-lg font-medium">{quiz.title}</span>
                <Link to={`/quiz/${quiz._id}/edit`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                  Manage Questions
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No quizzes created for this course yet.</p>
          )}
        </div>
        
        {/* Form to create a new quiz */}
        <form onSubmit={handleCreateQuiz} className="flex gap-4 p-4 border rounded-lg bg-gray-50">
          <input 
            type="text"
            value={newQuizTitle}
            onChange={(e) => setNewQuizTitle(e.target.value)}
            placeholder="New Quiz Title"
            className="flex-grow px-4 py-2 border rounded-lg"
          />
          <button type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;