import React, { useState, useEffect } from "react";
import axiosApi from "../../../../conf/axios";
import { useParams } from "react-router-dom";

const ArtistNew = () => {
  const { ophid } = useParams();
  const [artist, setArtist] = useState({});
  const [personalReason, setPersonalReason] = useState("");
  const [professionalReason, setProfessionalReason] = useState("");
  const [documentReason, setDocumentReason] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
  try {
    const res = await axiosApi.get(`/under-review/${ophid}`);
    const { userDetails = {}, professionalDetails = {}, documentationDetails = {} } = res.data;

    // Safe parse photos
    let photos = [];
    if (professionalDetails.PhotoURLs) {
      try {
        photos = JSON.parse(professionalDetails.PhotoURLs);
      } catch (e) {
        console.error("Error parsing PhotoURLs:", e);
      }
    }
    const firstPhoto = photos.length > 0 ? photos[0] : "";

    const experienceMonths = (professionalDetails.ExperienceMonthly % 12) || 0;
    const experienceYears = Math.floor( professionalDetails.ExperienceMonthly / 12);

    // Generic fallback
    const getValue = (val, fallback = "Not Provided") =>
      val && val.toString().trim() !== "" ? val : fallback;

    const newArtist = {
      ophid: getValue(userDetails.ophid),
      full_name: getValue(userDetails.full_name),
      stage_name: getValue(userDetails.stage_name),
      email: getValue(userDetails.email),
      contact_number: getValue(userDetails.contact_num),
      artist_type: getValue(userDetails.artist_type),
      personal_photo: getValue(userDetails.personal_photo, "https://avatars.githubusercontent.com/u/49544693?v=4"),
      location: getValue(userDetails.location),
      profession: getValue(professionalDetails.Profession),
      bio: getValue(professionalDetails.Bio),
      video: getValue(professionalDetails.VideoURL, "https://www.w3schools.com/html/mov_bbb.mp4"),
      photo: firstPhoto || "https://avatars.githubusercontent.com/u/49544693?v=4",
      spotify: getValue(professionalDetails.SpotifyLink),
      instagram: getValue(professionalDetails.InstagramLink),
      facebook: getValue(professionalDetails.FacebookLink),
      apple_music: getValue(professionalDetails.AppleMusicLink),
      experience_yearly: getValue(experienceYears),
      experience_monthly: getValue(experienceMonths),
      songs_planning_count: getValue(professionalDetails.SongsPlanningCount),
      songs_planning_type: getValue(professionalDetails.SongsPlanningType),
      aadhar_front: getValue(documentationDetails.AadharFrontURL, "https://avatars.githubusercontent.com/u/49544693?v=4"),
      aadhar_back: getValue(documentationDetails.AadharBackURL, "https://avatars.githubusercontent.com/u/49544693?v=4"),
      pan_front: getValue(documentationDetails.PanFrontURL, "https://avatars.githubusercontent.com/u/49544693?v=4"),
      signature: getValue(documentationDetails.SignatureImageURL, "https://avatars.githubusercontent.com/u/49544693?v=4"),
      bank_name: getValue(documentationDetails.BankName),
      account_holder: getValue(documentationDetails.AccountHolderName),
      account_number: getValue(documentationDetails.AccountNumber),
      ifsc_code: getValue(documentationDetails.IFSCCode),
    };

    setArtist(newArtist);
  } catch (err) {
    console.error("Error fetching artist data:", err);
  }
};

    if (ophid) {
      fetchArtist();
    }
  }, [ophid]);

  const handleReject = (section, reason) => {
    alert(`Rejected ${section} with reason: ${reason || "No reason provided"}`);
    if (section === "Personal") setPersonalReason("");
    else if (section === "Professional") setProfessionalReason("");
    else if (section === "Documentation") setDocumentReason("");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        {/* Personal Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artist.ophid && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">OPH ID</label>
                <div className="text-gray-900">{artist.ophid}</div>
              </div>
            )}
            {artist.full_name && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
                <div className="text-gray-900">{artist.full_name}</div>
              </div>
            )}
            {artist.stage_name && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Stage Name</label>
                <div className="text-gray-900">{artist.stage_name}</div>
              </div>
            )}
            {artist.email && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
                <div className="text-gray-900">{artist.email}</div>
              </div>
            )}
            {artist.contact_number && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Contact Number</label>
                <div className="text-gray-900">{artist.contact_number}</div>
              </div>
            )}
            {artist.artist_type && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Artist Type</label>
                <div className="text-gray-900">{artist.artist_type}</div>
              </div>
            )}
            {artist.location && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Location</label>
                <div className="text-gray-900">{artist.location}</div>
              </div>
            )}
            {artist.personal_photo && (
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Personal Photo</label>
                <img
                  src={artist.personal_photo}
                  alt="Artist"
                  className="mt-2 w-40 h-40 object-cover rounded-xl border"
                />
              </div>
            )}
          </div>

          {/* Personal Reject Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Reject Personal Details</h3>
            <textarea
              value={personalReason}
              onChange={(e) => setPersonalReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
            />
            <button
              onClick={() => handleReject("Personal", personalReason)}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
            >
              Reject Personal
            </button>
          </div>
        </div>

        {/* Professional Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">Professional Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artist.profession && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Profession</label>
                <div className="text-gray-900">{artist.profession}</div>
              </div>
            )}
            {artist.bio && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Bio</label>
                <div className="text-gray-900">{artist.bio}</div>
              </div>
            )}
            {artist.spotify && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Spotify</label>
                <a
                  href={artist.spotify}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.spotify}
                </a>
              </div>
            )}
            {artist.instagram && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Instagram</label>
                <a
                  href={artist.instagram}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.instagram}
                </a>
              </div>
            )}
            {artist.facebook && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Facebook</label>
                <a
                  href={artist.facebook}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.facebook}
                </a>
              </div>
            )}
            {artist.apple_music && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Apple Music</label>
                <a
                  href={artist.apple_music}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {artist.apple_music}
                </a>
              </div>
            )}
            {artist.experience_yearly !== undefined && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Experience (Years)</label>
                <div className="text-gray-900">{artist.experience_yearly}</div>
              </div>
            )}
            {artist.experience_monthly !== undefined && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Experience (Months)</label>
                <div className="text-gray-900">{artist.experience_monthly}</div>
              </div>
            )}
            {artist.songs_planning_count && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Songs Planning Count</label>
                <div className="text-gray-900">{artist.songs_planning_count}</div>
              </div>
            )}
            {artist.songs_planning_type && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Songs Planning Type</label>
                <div className="text-gray-900">{artist.songs_planning_type}</div>
              </div>
            )}
            {artist.photo && (
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Photo</label>
                <img
                  src={artist.photo}
                  alt="Professional"
                  className="mt-2 w-48 h-48 object-cover rounded-xl border"
                />
              </div>
            )}
            {artist.video && (
              <div className="sm:col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-1">Video</label>
                <video controls className="mt-2 w-full max-w-md rounded-xl border">
                  <source src={artist.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Professional Reject Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Reject Professional Details</h3>
            <textarea
              value={professionalReason}
              onChange={(e) => setProfessionalReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
            />
            <button
              onClick={() => handleReject("Professional", professionalReason)}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
            >
              Reject Professional
            </button>
          </div>
        </div>

        {/* Document Details */}
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">Document Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artist.aadhar_front && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Aadhar Front</label>
                <img
                  src={artist.aadhar_front}
                  alt="Aadhar Front"
                  className="mt-2 w-48 h-32 object-cover rounded-xl border"
                />
              </div>
            )}
            {artist.aadhar_back && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Aadhar Back</label>
                <img
                  src={artist.aadhar_back}
                  alt="Aadhar Back"
                  className="mt-2 w-48 h-32 object-cover rounded-xl border"
                />
              </div>
            )}
            {artist.pan_front && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">PAN Card</label>
                <img
                  src={artist.pan_front}
                  alt="PAN Card"
                  className="mt-2 w-48 h-32 object-cover rounded-xl border"
                />
              </div>
            )}
            {artist.signature && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Signature</label>
                <img
                  src={artist.signature}
                  alt="Signature"
                  className="mt-2 w-48 h-32 object-cover rounded-xl border"
                />
              </div>
            )}
            {artist.bank_name && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Bank Name</label>
                <div className="text-gray-900">{artist.bank_name}</div>
              </div>
            )}
            {artist.account_holder && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Account Holder Name</label>
                <div className="text-gray-900">{artist.account_holder}</div>
              </div>
            )}
            {artist.account_number && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Account Number</label>
                <div className="text-gray-900">{artist.account_number}</div>
              </div>
            )}
            {artist.ifsc_code && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">IFSC Code</label>
                <div className="text-gray-900">{artist.ifsc_code}</div>
              </div>
            )}
          </div>

          {/* Document Reject Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-700">Reject Documentation Details</h3>
            <textarea
              value={documentReason}
              onChange={(e) => setDocumentReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
            />
            <button
              onClick={() => handleReject("Documentation", documentReason)}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
            >
              Reject Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistNew;
