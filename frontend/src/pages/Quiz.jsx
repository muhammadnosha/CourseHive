import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Quiz = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: "answer text" }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/quizzes/${quizId}`);
        setQuiz(res.data);
        // Initialize answers state
        const initialAnswers = {};
        res.data.questions.forEach(q => {
          initialAnswers[q._id] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Clear previous errors

    // 1. Add the filtering logic
    const answersArray = Object.keys(answers).map(key => ({
      question: key,
      answer: answers[key],
    }));
    
    // Filter out any answers where the value is still an empty string
    const filteredAnswers = answersArray.filter(a => a.answer !== '');

    const submissionData = {
      answers: filteredAnswers,
    };

    try {
      const res = await axios.post(`/api/quizzes/${quizId}/submit`, submissionData);
      alert(`Quiz Submitted! Your score: ${res.data.score.toFixed(2)}%`);
      // Use quiz.course from state, not res.data.course
      navigate(`/courses/${quiz.course}`); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz.');
      // 2. Add setLoading(false) to the catch block
      setLoading(false); 
    }
  };
  // --- END OF FIX ---

  if (loading && !quiz) return <div className="text-center p-10">Loading Quiz...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;
  if (!quiz) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {quiz.questions.map((q, index) => (
            <div key={q._id} className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4">
                Question {index + 1}: {q.questionText}
              </h3>
              
             {/* All questions are now MCQs */}
             <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center p-3 rounded-md hover:bg-gray-50">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt.text}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      className="mr-3"
                    />
                    {opt.text}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 mt-8 disabled:bg-green-300"
        >
          {loading ? 'Submitting...' : 'Submit Quiz'}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default Quiz;