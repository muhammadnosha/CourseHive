import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProgressReport from './components/ProgressReport.jsx'; // For progress tracking

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [submissions, setSubmissions] = useState([]); // For child progress reports
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      try {
        // Get all children linked to this parent
        const res = await axios.get('/api/users/my-children');
        setChildren(res.data);
      } catch (error) {
        console.error("Failed to fetch children", error);
      }
      setLoadingChildren(false);
    };

    const fetchSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
        // Fetch all submissions relevant to the parent's children
        const res = await axios.get('/api/submissions/parent');
        setSubmissions(res.data);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
      setLoadingSubmissions(false);
    };

    fetchChildren();
    fetchSubmissions();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      {/* --- Header --- */}
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.name}!
      </h1>
      <p className="text-xl text-gray-700">This is your Parent Portal.</p>

      {/* --- Children Section --- */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Children's Progress</h2>

        {loadingChildren && <p>Loading children...</p>}

        {!loadingChildren && children.length === 0 && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No children linked to your account yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              When your child registers, tell them to use your email: <strong>{user.email}</strong>
            </p>
          </div>
        )}

        {/* --- Children Cards --- */}
        <div className="space-y-6">
          {children.map((child) => {
            // Filter submissions belonging to this child
            const childSubmissions = submissions.filter(
              (sub) => sub.student?._id === child._id
            );

            return (
              <div key={child._id} className="p-6 border rounded-lg shadow-sm bg-white">
                <h3 className="text-2xl font-bold text-blue-700">{child.name}</h3>
                <p className="text-gray-600 mb-4">{child.email}</p>

                <h4 className="text-lg font-semibold mb-2">Enrolled Courses:</h4>
                {child.coursesEnrolled && child.coursesEnrolled.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {child.coursesEnrolled.map((course) => (
                      <li key={course._id}>
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {course.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Not enrolled in any courses.</p>
                )}

                {/* --- Progress Report Section --- */}
                <div className="mt-6">
                  <ProgressReport
                    title={`${child.name}'s Quiz Report`}
                    submissions={childSubmissions}
                    loading={loadingSubmissions}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
