import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtist } from '../../API/ArtistContext';

const ProfileFormHeader = ({ title, showBack = true }) => {
  const navigate = useNavigate();
  const { logout } = useArtist();

  return (
    <div className="w-full bg-opacity-70 flex items-center justify-between mb-8">
      {/* <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        )}
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 text-sm text-red-400 hover:text-red-300"
      >
        Logout
      </button> */}
    </div>
  );
};

export default ProfileFormHeader;