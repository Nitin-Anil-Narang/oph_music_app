import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      <p className="mt-4 text-cyan-400 text-center">
        🎵 Loading inspiration, empowering artists, and unlocking possibilities through our platform...
      </p>
    </div>
  );
};

export default Loading;