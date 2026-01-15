import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProgressReport from './components/ProgressReport.jsx'; // Added for student progress

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]); // For student progress
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        // Get instructor profile + created courses
        const res = await axios.get('/api/users/me');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch instructor data', error);
      } finally {
        setLoadingData(false);
      }
    };

    const fetchSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        // Get students’ quiz/task submissions for progress tracking
        const res = await axios.get('/api/submissions/instructor');
        setSubmissions(res.data);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchData();
    fetchSubmissions();
  }, []);

  if (loadingData) return <p>Loading dashboard...</p>;
  if (!data) return <p>Could not load dashboard data.</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold mb-4">
        Welcome, Instructor {user?.name}!
      </h1>
      <p className="text-xl text-gray-700">
        This is your Instructor Dashboard.
      </p>
{/* --- ADD THIS BUTTON --- */}
<div className="mt-8 mb-4">
        <Link 
          to="/scorm/upload"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
        >
          Upload SCORM Package
        </Link>
      </div>
      {/* --- END --- */}
      {/* My Courses Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">My Courses</h2>
          <Link
            to="/courses/new"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            + Create New Course
          </Link>
        </div>

        {data.coursesCreated?.length > 0 ? (
          <div className="space-y-4">
            {data.coursesCreated.map((course) => (
              <div
                key={course._id}
                className="p-6 border rounded-lg shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-blue-700">
                    {course.title}
                  </h3>
                  <p className="text-gray-600">
                    {course.description.substring(0, 80)}...
                  </p>
                </div>
                <div className="space-x-2">
                  <Link
                    to={`/courses/${course._id}/edit`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/courses/${course._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              You have not created any courses yet.
            </p>
          </div>
        )}
      </div>

      {/* Progress Report Section */}
      <div className="mt-10">
        <ProgressReport
          title="Student Progress Monitor"
          submissions={submissions}
          loading={loadingSubmissions}
        />
      </div>
    </div>
  );
};

export default InstructorDashboard;
