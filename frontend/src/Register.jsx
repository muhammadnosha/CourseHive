import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'student',
    parentEmail: '',
  });

  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const { name, email, phone, password, role, parentEmail } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only send parentEmail if role is student
    const dataToSubmit = { ...formData };
    if (dataToSubmit.role !== 'student') {
      delete dataToSubmit.parentEmail;
    }

    const success = await register(dataToSubmit);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={name} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">Phone (e.g., 03001234567)</label>
          <input type="tel" id="phone" name="phone" value={phone} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required minLength="6" />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="role">I am a...</label>
          <select id="role" name="role" value={role} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>

        {role === 'student' && (
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="parentEmail">
              Parent's Email (Optional)
            </label>
            <input type="email" id="parentEmail" name="parentEmail" value={parentEmail} onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-500 mt-1">
              If your parent is already registered, this will link your accounts.
            </p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;