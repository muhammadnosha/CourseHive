import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import FakePaymentModal from '../components/FakePaymentModal.jsx'; // <-- Added for payment modal

const CoursePage = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- Payment modal state
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      setError('Failed to load course.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // --- Enroll Handler (for free courses or subscribed users) ---
  const handleEnroll = async () => {
    try {
      await axios.post(`/api/courses/${id}/enroll`);
      alert('Enrolled successfully!');
      fetchCourse(); // Refetch to update UI
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to enroll.');
    }
  };

  // --- Fake Payment Simulation Handler ---
  const handleFakePayment = async () => {
    try {
      await axios.post(`/api/payments/purchase-course/${id}`);
      alert('Purchase successful! You are now enrolled.');
      await fetchCourse();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed.');
    }
  };

  if (loading) return <div className="text-center p-10">Loading Course...</div>;
  if (error) return <div className="text-center text-red-500 p-10">{error}</div>;
  if (!course) return null;

  const isEnrolled = course.students.some(student => student._id === user?._id);
  const isInstructor = course.instructor._id === user?._id;
  const isAdmin = user?.role === 'admin';

  // --- Helper to render buttons depending on price/enrollment ---
  const renderEnrollButton = () => {
    if (!user || user.role !== 'student') return null;

    if (isEnrolled) {
      return (
        <span className="bg-green-100 text-green-800 font-semibold py-2 px-6 rounded-lg">
          Enrolled
        </span>
      );
    }

    // Free Course
    if (course.price === 0) {
      return (
        <button
          onClick={handleEnroll}
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
        >
          Enroll for Free
        </button>
      );
    }

    // Paid Course
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Buy Course (${course.price.toFixed(2)})
      </button>
    );
  };

  return (
    <>
      {/* --- Payment Modal --- */}
      <FakePaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFakePayment}
        title={course.title}
        amount={course.price}
      />

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-2">
              {course.difficulty}
            </span>
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">By {course.instructor.name}</p>
          </div>
          <div className="flex items-center gap-4">
            {renderEnrollButton()}

            {user && (isInstructor || isAdmin) && (
              <Link
                to={`/courses/${id}/edit`}
                className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                Edit Course
              </Link>
            )}
          </div>
        </div>

        {/* --- About Section --- */}
        <div className="border-t my-6 pt-6">
          <h2 className="text-2xl font-semibold mb-4">About this course</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{course.description}</p>
        </div>

        {/* --- Modules Section --- */}
        <div className="border-t my-6 pt-6">
          <h2 className="text-2xl font-semibold mb-4">Modules</h2>
          {course.modules.length > 0 ? (
            <div className="space-y-3">
              {course.modules.map((module, index) => {
                const isScorm = /^\d+$/.test(module.description.trim());
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-md flex justify-between items-center">
                    <div>
                      <strong className="text-lg">{module.title}</strong>
                      {!isScorm && <p className="text-gray-600">{module.description}</p>}
                    </div>
                    {isScorm && (
                      isEnrolled ? (
                        <Link
                          to={`/scorm/play/${module.description.trim()}`}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                          Launch Activity
                        </Link>
                      ) : (
                        <span className="text-gray-500">Enroll to launch</span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No modules yet.</p>
          )}
        </div>

        {/* --- Quizzes Section --- */}
        <div className="border-t my-6 pt-6">
          <h2 className="text-2xl font-semibold mb-4">Quizzes</h2>
          {course.quizzes.length > 0 ? (
            <div className="space-y-3">
              {course.quizzes.map((quiz) => (
                <div key={quiz._id} className="p-4 border rounded-md flex justify-between items-center">
                  <span className="text-lg font-medium">{quiz.title}</span>
                  {isEnrolled ? (
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Start Quiz
                    </Link>
                  ) : (
                    <span className="text-gray-500">Enroll to take quiz</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No quizzes yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePage;
