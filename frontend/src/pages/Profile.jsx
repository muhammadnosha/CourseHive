import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- Add error state
  const { user } = useAuth(); // Get user info from context

  useEffect(() => {
    // This route gets the user's gamification profile
    axios.get('/api/gamification/profile/me')
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error(err);
        // Set the error message from the backend
        setError(err.response?.data?.message || 'Error fetching profile'); 
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading profile...</p>;

  // Show a detailed error if one occurred
  if (error) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg">
        <p className="font-bold">Could not load profile.</p>
        <p>Error: {error}</p>
        <p className="text-sm mt-2">(This is common for users created before the profile system. Try the manual database fix.)</p>
      </div>
    );
  }
  
  // This should not be hit if error handling is correct, but a good safeguard
  if (!profile) return <p>Could not load profile.</p>; 

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{profile.user.name}</h1>
        <p className="text-xl text-gray-500 mb-6">{profile.user.email}</p>
        
        <div className="bg-blue-600 text-white p-6 rounded-lg inline-block">
          <p className="text-lg">Total Points</p>
          <p className="text-5xl font-bold">{profile.points}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">My Badges</h2>
        {profile.badges.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {profile.badges.map((badge, index) => (
              <div key={index} className="text-center p-4 bg-gray-100 rounded-lg">
                <span className="text-4xl">🏅</span> {/* Placeholder icon */}
                <p className="font-semibold mt-2">{badge.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No badges earned yet. Keep learning!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;