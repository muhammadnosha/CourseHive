import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

// Component for the "Add Question" form
// Component for the "Add Question" form
const AddQuestionForm = ({ quizId, onQuestionAdded }) => {
  const [questionText, setQuestionText] = useState('');
  
  // MCQ state is now the only state
  const [options, setOptions] = useState([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectOption = (index) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let questionData = {
      quizId,
      questionText,
      options, // Send options directly
    };

    // Basic validation
    if (options.length < 2 || options.some(opt => !opt.text)) {
      return alert('Please fill all options for MCQ.');
    }
    if (!options.some(opt => opt.isCorrect)) {
      return alert('Please mark one option as correct.');
    }
    
    try {
      await axios.post(`/api/quizzes/${quizId}/questions`, questionData);
      alert('Question added!');
      // Reset form
      setQuestionText('');
      setOptions([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
      onQuestionAdded(); // Callback to refresh the question list
    } catch (err) {
      alert('Failed to add question: ' + err.response?.data?.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-xl font-bold mb-4">Add New MCQ</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Question Text</label>
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                  rows="3" className="w-full px-4 py-2 border rounded-lg" required />
      </div>

      {/* This is no longer conditional */}
      <div className="space-y-3">
        <label className="block text-gray-700 font-semibold">Options</label>
        {options.map((opt, index) => (
          <div key={index} className="flex items-center gap-2">
            <input type="radio" name="correctOption" 
                   checked={opt.isCorrect} onChange={() => handleCorrectOption(index)} />
            <input type="text" placeholder={`Option ${index + 1}`} value={opt.text}
                   onChange={(e) => handleOptionChange(index, e.target.value)}
                   className="flex-grow px-3 py-2 border rounded-md" />
          </div>
        ))}
        <button type="button" onClick={() => setOptions([...options, { text: '', isCorrect: false }])}
                className="text-sm text-blue-600 hover:underline">
          + Add another option
        </button>
      </div>
      
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 mt-4">
        Save Question
      </button>
    </form>
  );
};

// Main Component for the Quiz Editor Page
const QuizEditor = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quizId } = useParams();

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      // Use the new endpoint to get correct answers
      const res = await axios.get(`/api/quizzes/${quizId}/edit`);
      setQuiz(res.data);
    } catch (err) {
      setError('Failed to load quiz data.');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  if (loading) return <div>Loading Quiz Editor...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to={`/courses/${quiz.course}/edit`} className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Course Editor
      </Link>
      <h1 className="text-3xl font-bold mb-6">Manage Quiz: {quiz.title}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Add Question Form */}
        <div>
          <AddQuestionForm quizId={quiz._id} onQuestionAdded={fetchQuiz} />
        </div>

        {/* Right Column: List of Existing Questions */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Existing Questions ({quiz.questions.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {quiz.questions.length > 0 ? (
              quiz.questions.map((q, index) => (
                <div key={q._id} className="p-4 border rounded-md bg-gray-50">
                  <p className="font-semibold">{index + 1}. {q.questionText}</p>
                  <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{q.questionType}</span>
                  {/* TODO: Add Edit/Delete buttons */}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No questions added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;




