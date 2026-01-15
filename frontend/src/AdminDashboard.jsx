import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch all users ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users.');
    }
    setLoadingUsers(false);
  };

  // --- Fetch all courses ---
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to fetch courses.');
    }
    setLoadingCourses(false);
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // --- Delete a user ---
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This is irreversible.')) {
      try {
        await axios.delete(`/api/users/${userId}`);
        alert('User deleted successfully');
        fetchUsers(); // Refresh the user list
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  // --- Delete a course ---
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/courses/${courseId}`);
        alert('Course deleted');
        fetchCourses(); // Refresh course list
      } catch (err) {
        alert('Failed to delete course.');
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, Admin {user?.name}!
      </h1>
      <p className="text-xl text-gray-700">This is the Admin Control Panel.</p>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      {/* ====================== USER MANAGEMENT ====================== */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Role</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{u.name}</td>
                    <td className="py-2 px-4 border-b">{u.email}</td>
                    <td className="py-2 px-4 border-b capitalize">{u.role}</td>
                    <td className="py-2 px-4 border-b">
                      <button 
                        onClick={() => handleDeleteUser(u._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* ====================== COURSE MANAGEMENT ====================== */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : (
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course._id} className="p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="text-sm text-gray-500">By {course.instructor?.name || 'Unknown'}</p>
                </div>
                <div className="space-x-2">
                  <Link 
                    to={`/courses/${course._id}/edit`}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDeleteCourse(course._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
