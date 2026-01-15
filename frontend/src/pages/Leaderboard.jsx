import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/gamification/leaderboard')
      .then(res => setLeaderboard(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol className="space-y-4">
          {leaderboard.map((profile, index) => (
            
            // --- THIS IS THE FIX ---
            // Only render if profile.user is not null
            profile.user && (
              <li key={profile._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-700 w-10">
                    {index + 1}
                  </span>
                  <span className="text-xl font-medium ml-4">{profile.user.name}</span>
                </div>
                <span className="text-xl font-bold text-blue-600">
                  {profile.points} pts
                </span>
              </li>
            )
            // --- END FIX ---
            
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;