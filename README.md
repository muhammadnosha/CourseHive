# CourseHive

Web-Based eLearning Platform for Course Creation and Management

CourseHive is a web-based eLearning platform designed to facilitate online course creation, enrollment, and learning management. The platform enables instructors to deliver multimedia lessons while allowing students to track their progress and engage through interactive learning features. Role-based access ensures secure and structured management of educational content.

## Project Overview

The goal of CourseHive is to provide a centralized Learning Management System (LMS) that simplifies online education by bringing together course creation, student enrollment, progress tracking, and engagement tools into a single platform. The system supports administrators, instructors, and students with dedicated functionalities for efficient learning management.

## Key Features

- Course creation and management with multimedia lesson support
- Student enrollment and progress tracking
- Role-based access control (Admin, Instructor, Student)
- Instructor–student management system
- Admin dashboard with analytics and insights
- Integrated feedback and discussion system
- Course completion certification
- Responsive user interface for seamless learning across devices

## Technology Stack

Frontend
- React.js
- JavaScript (ES6+)
- HTML5
- CSS3

Backend
- Node.js
- Express.js

Database
- MongoDB

Integrations and Tools
- RESTful APIs
- Git and GitHub

## Application Architecture

CourseHive follows the MERN stack architecture with a clear separation of concerns:

- Frontend handles user interaction, course browsing, and progress visualization
- Backend exposes RESTful APIs, manages authentication, and enforces business logic
- Database stores user profiles, course data, enrollment records, and learning progress

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/muhammadnosha/CourseHive.git
```

2. Navigate to the project directory
```bash
cd CourseHive
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Install frontend dependencies
```bash
cd ../frontend
npm install
```

5. Start the backend server
```bash
# from the backend directory
npm run server
```

6. Start the frontend application
```bash
# from the frontend directory
npm run dev
```

Ensure MongoDB is running and required environment variables (e.g., MONGODB_URI, JWT_SECRET, PORT) are properly configured before starting the application.

## Use Cases

This project is suitable for:

- Demonstrating full-stack MERN development skills
- Academic or final-year projects
- Portfolio showcase for web developers
- Learning LMS system design and role-based access control
- Building real-world eLearning platforms

## Future Improvements

- Advanced analytics for learner performance
- AI-based course recommendations
- Live classes and video conferencing integration
- Mobile application support
- Gamification features to enhance learner engagement

