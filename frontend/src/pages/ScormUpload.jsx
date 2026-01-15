import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ScormUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a .zip file');
    
    setLoading(true);
    setError(null);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/scorm/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload SCORM Package</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="file">
            SCORM .zip file
          </label>
          <input
            type="file"
            id="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-300 disabled:bg-green-300"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {uploadResult && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-300">
          <p className="text-green-800 font-semibold">Uploaded successfully!</p>
          <p className="text-sm text-gray-600 mt-2">
            To add this to a course, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-sm text-gray-600 mt-2">
            <li>Go to your Instructor Dashboard and "Edit" the course.</li>
            <li>Create a new Module (e.g., "SCORM Activity").</li>
            <li>
              Copy this ID below and paste it into the module's **Description** field.
            </li>
          </ol>
          <div className="mt-4 p-3 bg-gray-100 rounded-md">
            <p className="font-mono text-blue-700 font-bold">
              {uploadResult.folderId}
            </p>
          </div>
          <Link
            to={`/scorm/play/${uploadResult.folderId}`}
            target="_blank"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Test Launch &rarr;
          </Link>
        </div>
      )}
    </div>
  );
};

export default ScormUpload;