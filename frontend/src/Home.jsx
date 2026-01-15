import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/courses');
        setCourses(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="text-center">
      <header className="bg-blue-600 text-white p-16 rounded-lg shadow-lg mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to KidiCode!</h1>
        <p className="text-xl mb-8">STEM & AI Coding Courses for Kids in Pakistan</p>
        <Link 
          to="/register" 
          className="bg-white text-blue-600 font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition duration-300"
        >
          Get Started Today
        </Link>
      </header>

      <section>
        <h2 className="text-3xl font-semibold mb-8">Our Courses</h2>
        {loading && <p>Loading courses...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course._id} className="bg-white border rounded-lg shadow-md p-6 text-left">
              <h3 className="text-2xl font-bold mb-2 text-blue-700">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500 mb-4">
                Instructor: {course.instructor ? course.instructor.name : 'N/A'}
              </p>
              <Link 
                to={`/courses/${course._id}`} // You'll need to create this route
                className="text-blue-600 font-semibold hover:underline"
              >
                Learn More &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;