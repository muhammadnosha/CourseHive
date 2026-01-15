import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ScormPlayer = () => {
  const { id } = useParams(); // This 'id' is the folderId
  const launchUrl = `http://localhost:5000/scorm_packages/${id}/index.html`;

  return (
    <div className="w-full" style={{ height: 'calc(100vh - 100px)' }}>
      <p className="mb-2">
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </p>
      <iframe 
        src={launchUrl} 
        width="100%" 
        height="100%" 
        title="SCORM Content"
        className="border-2 border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default ScormPlayer;