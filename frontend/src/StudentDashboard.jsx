import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProgressReport from './components/ProgressReport.jsx';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [submissions, setSubmissions] = useState([]); 
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const res = await axios.get('/api/users/me');
        setData(res.data);
      } catch (error) {
        console.error('Failed to fetch student data', error);
      } finally {
        setLoadingData(false);
      }
    };

    const fetchSubmissions = async () => {
      try {
        setLoadingSubmissions(true);
        const res = await axios.get('/api/submissions/me');
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

  // Format expiry date
  const expiry = data.subscription?.expiryDate
    ? new Date(data.subscription.expiryDate).toLocaleDateString('en-US')
    : '';

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* --- Header --- */}
      <h1 className="text-3xl font-bold mb-4">
        👋 Welcome, {user?.name}!
      </h1>
      <p className="text-xl text-gray-700">This is your Student Dashboard.</p>

      {/* --- Subscription Section --- */}
      <div className="mb-6 mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold">My Subscription</h3>
        {data.subscription?.status === 'active' ? (
          <p className="text-green-600">
            Status: <span className="font-bold capitalize">{data.subscription.plan}</span> 
            {' '} (Active until {expiry})
          </p>
        ) : (
          <p className="text-red-600">
            Status: <span className="font-bold">Inactive</span>
          </p>
        )}
      </div>

      {/* --- Gamification Summary --- */}
      <div className="my-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">My Progress Summary</h2>
        <div className="flex gap-8">
          <div>
            <p className="text-lg text-gray-700">Total Points</p>
            <p className="text-4xl font-bold text-blue-600">{data.profile?.points || 0}</p>
          </div>
          <div>
            <p className="text-lg text-gray-700">Badges</p>
            <p className="text-4xl font-bold text-blue-600">{data.profile?.badges?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* --- Enrolled Courses --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
        {data.coursesEnrolled?.length > 0 ? (
          <div className="space-y-4">
            {data.coursesEnrolled.map((course) => (
              <div
                key={course._id}
                className="p-6 border rounded-lg shadow-sm bg-white flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold text-blue-700">{course.title}</h3>
                  <p className="text-gray-600">{course.description.substring(0, 80)}...</p>
                </div>
                <Link
                  to={`/courses/${course._id}`}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
                >
                  Go to Course
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">You are not enrolled in any courses yet.</p>
            <Link to="/" className="text-blue-600 hover:underline">
              Browse courses
            </Link>
          </div>
        )}
      </div>

      {/* --- Progress Report Section --- */}
      <div className="mt-10">
        <ProgressReport
          title="Detailed Quiz Performance"
          submissions={submissions}
          loading={loadingSubmissions}
        />
      </div>
    </div>
  );
};

export default StudentDashboard;
