import React from 'react';

const ProgressReport = ({ title, submissions, loading }) => {
  if (loading) {
    return <p>Loading progress report...</p>;
  }

  if (submissions.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No submissions found.</p>
      </div>
    );
  }

  // Group submissions by course
  const groupedByCourse = submissions.reduce((acc, sub) => {
    // Ensure course and quiz objects exist
    if (!sub.course || !sub.quiz) return acc;

    const courseId = sub.course._id;
    if (!acc[courseId]) {
      acc[courseId] = { 
        title: sub.course.title, 
        submissions: [] 
      };
    }
    acc[courseId].submissions.push(sub);
    return acc;
  }, {});

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="space-y-6">
        {Object.values(groupedByCourse).map(course => (
          <div key={course.title} className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-blue-700 mb-4">{course.title}</h3>
            <ul className="space-y-3">
              {course.submissions.map(sub => (
                <li key={sub._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md">
                  <div>
                    <span className="font-semibold">{sub.quiz.title}</span>
                    {/* Show student name if it exists (for Parent/Instructor) */}
                    {sub.student?.name && (
                      <span className="text-sm text-gray-600 ml-2">({sub.student.name})</span>
                    )}
                  </div>
                  <span className={`font-bold text-lg ${sub.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    Score: {sub.score.toFixed(0)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressReport;