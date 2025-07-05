import React, { useState } from "react";

// Dummy data for artist
const artist = {
  full_name: "Rahul Sharma",
  stage_name: "DJ Rhythm",
  email: "rahul@example.com",
  contact_number: "+91 9876543210",
  artist_type: "DJ",
  personal_photo: "https://avatars.githubusercontent.com/u/49544693?v=4",
  location: "Mumbai, India",
  profession: "Music Producer",
  bio: "Rahul has been producing music for over 10 years...",
  video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  photo: "https://avatars.githubusercontent.com/u/49544693?v=4",
  spotify: "https://spotify.com/artist123",
  instagram: "https://instagram.com/rahul.music",
  facebook: "https://facebook.com/rahul.music",
  apple_music: "https://music.apple.com/artist/rahul",
  experience_yearly: 5,
  experience_monthly: 8,
  songs_planning_count: 12,
  songs_planning_type: "Albums",
  aadhar_front: "https://avatars.githubusercontent.com/u/49544693?v=4",
  aadhar_back: "https://avatars.githubusercontent.com/u/49544693?v=4",
  pan_front: "https://avatars.githubusercontent.com/u/49544693?v=4",
  signature: "https://avatars.githubusercontent.com/u/49544693?v=4",
  bank_name: "State Bank of India",
  account_holder: "Rahul Sharma",
  account_number: "123456789012",
  ifsc_code: "SBIN0001234",
};

const ArtistAll = () => {
  const [reason, setReason] = useState("");
  const handleReject = () => {
    alert(`Rejected with reason: ${reason || "No reason provided"}`);
    setReason("");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        {/* Personal Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Full Name
              </label>
              <div className="text-gray-900">{artist.full_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Stage Name
              </label>
              <div className="text-gray-900">{artist.stage_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Email
              </label>
              <div className="text-gray-900">{artist.email}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Contact Number
              </label>
              <div className="text-gray-900">{artist.contact_number}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Artist Type
              </label>
              <div className="text-gray-900">{artist.artist_type}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Location
              </label>
              <div className="text-gray-900">{artist.location}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Personal Photo
              </label>
              <img
                src={artist.personal_photo}
                alt="Artist"
                className="mt-2 w-40 h-40 object-cover rounded-xl border"
              />
            </div>
          </div>
        </div>
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Reject Artist</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
          />
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
        {/* Professional Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
            Professional Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Profession
              </label>
              <div className="text-gray-900">{artist.profession}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Bio
              </label>
              <div className="text-gray-900">{artist.bio}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Spotify
              </label>
              <a
                href={artist.spotify}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.spotify}
              </a>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Instagram
              </label>
              <a
                href={artist.instagram}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.instagram}
              </a>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Facebook
              </label>
              <a
                href={artist.facebook}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.facebook}
              </a>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Apple Music
              </label>
              <a
                href={artist.apple_music}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {artist.apple_music}
              </a>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Experience (Years)
              </label>
              <div className="text-gray-900">{artist.experience_yearly}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Experience (Months)
              </label>
              <div className="text-gray-900">{artist.experience_monthly}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Songs Planning Count
              </label>
              <div className="text-gray-900">{artist.songs_planning_count}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Songs Planning Type
              </label>
              <div className="text-gray-900">{artist.songs_planning_type}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Photo
              </label>
              <img
                src={artist.photo}
                alt="Professional"
                className="mt-2 w-48 h-48 object-cover rounded-xl border"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Video
              </label>
              <video
                controls
                className="mt-2 w-full max-w-md rounded-xl border"
              >
                <source src={artist.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Reject Artist</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
          />
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
        {/* Document Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
            Document Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Aadhar Front
              </label>
              <img
                src={artist.aadhar_front}
                alt="Aadhar Front"
                className="mt-2 w-48 h-32 object-cover rounded-xl border"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Aadhar Back
              </label>
              <img
                src={artist.aadhar_back}
                alt="Aadhar Back"
                className="mt-2 w-48 h-32 object-cover rounded-xl border"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                PAN Card
              </label>
              <img
                src={artist.pan_front}
                alt="PAN Front"
                className="mt-2 w-48 h-32 object-cover rounded-xl border"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Signature
              </label>
              <img
                src={artist.signature}
                alt="Signature"
                className="mt-2 w-48 h-32 object-cover rounded-xl border"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Bank Name
              </label>
              <div className="text-gray-900">{artist.bank_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Account Holder Name
              </label>
              <div className="text-gray-900">{artist.account_holder}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                Account Number
              </label>
              <div className="text-gray-900">{artist.account_number}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">
                IFSC Code
              </label>
              <div className="text-gray-900">{artist.ifsc_code}</div>
            </div>
          </div>
        </div>

        {/* Reject Section */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Reject Artist</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
          />
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistAll;
