import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardRedirect from './DashboardRedirect.jsx';

// Dashboard Imports
import StudentDashboard from './StudentDashboard.jsx';
import InstructorDashboard from './InstructorDashboard.jsx';
import ParentDashboard from './ParentDashboard.jsx';
import AdminDashboard from './AdminDashboard.jsx';

// New Page Imports
import CoursePage from './pages/CoursePage.jsx';
import CourseForm from './pages/CourseForm.jsx';
import Quiz from './pages/Quiz.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Profile from './pages/Profile.jsx';
import QuizEditor from './pages/QuizEditor.jsx';

import ScormUpload from './pages/ScormUpload.jsx'; // <-- ADD THIS
import ScormPlayer from './pages/ScormPlayer.jsx'; // <-- ADD THIS
import SubscriptionPage from './pages/SubscriptionPage.jsx'; // <-- 1. Import


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} 
          />
    <Route 
  path="/profile" 
  element={
    <ProtectedRoute roles={['student']}>
      <Profile />
    </ProtectedRoute>
  } 
/>
          <Route 
            path="/quiz/:quizId" 
            element={<ProtectedRoute roles={['student']}><Quiz /></ProtectedRoute>} 
          />
          
          {/* Student */}
          <Route 
            path="/student/dashboard" 
            element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} 
          />
          
          {/* Instructor */}
          <Route 
            path="/instructor/dashboard" 
            element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/courses/new" 
            element={<ProtectedRoute roles={['instructor', 'admin']}><CourseForm /></ProtectedRoute>} 
          />
          <Route 
            path="/courses/:id/edit" 
            element={<ProtectedRoute roles={['instructor', 'admin']}><CourseForm /></ProtectedRoute>} 
          />

          {/* Parent */}
          <Route 
            path="/parent/dashboard" 
            element={<ProtectedRoute roles={['parent']}><ParentDashboard /></ProtectedRoute>} 
          />
          
          {/* Admin */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/quiz/:quizId/edit" 
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <QuizEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/scorm/upload" 
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <ScormUpload />
              </ProtectedRoute>
            } 
          />
          
          {/* SCORM Player (for Students) */}
          <Route 
            path="/scorm/play/:id" 
            element={
              <ProtectedRoute roles={['student', 'instructor', 'admin']}>
                <ScormPlayer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscribe" 
            element={
              <ProtectedRoute roles={['student']}>
                <SubscriptionPage />
              </ProtectedRoute>
            } 
          />
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;