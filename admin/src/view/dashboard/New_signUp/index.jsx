import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const NewSignupDetails = () => {
  const { ophid } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user-details/${ophid}`);
        setArtist(res.data.userDetails);
      } catch (error) {
        console.error("Error fetching artist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [ophid]);
  console.log(artist);
  

  const handleReject = () => {
    alert(`Rejected with reason: ${reason || "No reason provided"}`);
    setReason("");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  if (!artist) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Artist not found.</div>;
  }

  console.log(artist.personal_photo);
  

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
              <div className="text-gray-900">{artist.full_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Stage Name</label>
              <div className="text-gray-900">{artist.stage_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
              <div className="text-gray-900">{artist.email}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Contact Number</label>
              <div className="text-gray-900">{artist.contact_num}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Artist Type</label>
              <div className="text-gray-900">{artist.artist_type}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Location</label>
              <div className="text-gray-900">{artist.location}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Personal Photo</label>
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
      </div>
    </div>
  );
};

export default NewSignupDetails;
