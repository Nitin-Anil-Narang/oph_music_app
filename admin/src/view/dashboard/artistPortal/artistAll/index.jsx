// Editable ArtistAll page with Save button per section and file previews
import React, { useState, useRef } from "react";

const initialPersonal = {
  full_name: "Rahul Sharma",
  stage_name: "DJ Rhythm",
  email: "rahul@example.com",
  contact_number: "+91 9876543210",
  artist_type: "DJ",
  location: "Mumbai, India",
};

const initialProfessional = {
  profession: "Music Producer",
  bio: "Rahul has been producing music for over 10 years...",
  video: "https://www.w3schools.com/html/mov_bbb.mp4",
  photo: "https://via.placeholder.com/150",
  spotify: "https://spotify.com/artist123",
  instagram: "https://instagram.com/rahul.music",
  facebook: "https://facebook.com/rahul.music",
  apple_music: "https://music.apple.com/artist/rahul",
  experience_yearly: 5,
  experience_monthly: 8,
  songs_planning_count: 12,
  songs_planning_type: "Albums",
};

const initialDocument = {
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
  const [personal, setPersonal] = useState(initialPersonal);
  const [professional, setProfessional] = useState(initialProfessional);
  const [document, setDocument] = useState(initialDocument);

  const fileInputRefs = useRef({});

  const handleChange = (sectionSetter) => (field, value) => {
    sectionSetter((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e, key, onChange) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChange(key, url);
    }
  };

  const renderInput = (key, value, onChange) => {
    const lower = key.toLowerCase();
    const isPhoto =
      lower.includes("photo") ||
      lower.includes("image") ||
      lower.includes("front") ||
      lower.includes("signature") ||
      lower.includes("aadhar") ||
      lower.includes("pan");
    const isVideo = lower.includes("video");

    if (isPhoto || isVideo) {
      return (
        <div>
          <div
            className="cursor-pointer"
            onClick={() => fileInputRefs.current[key]?.click()}
          >
            {isPhoto && (
              <img
                src={value}
                alt={key}
                className="w-40 h-40 rounded object-cover border mb-2"
              />
            )}
            {isVideo && (
              <video
                className="w-full max-w-xs rounded border mb-2"
                controls
                src={value}
              />
            )}
          </div>
          <input
            ref={(ref) => (fileInputRefs.current[key] = ref)}
            type="file"
            accept={isPhoto ? "image/*" : "video/*"}
            onChange={(e) => handleFileUpload(e, key, onChange)}
            className="hidden"
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(key, e.target.value)}
        className="w-full p-2 border rounded-md text-black"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        {/* Personal Details */}
        <Section
          title="Personal Details"
          data={personal}
          onChange={handleChange(setPersonal)}
          onSave={() => alert("Personal details saved")}
          renderInput={renderInput}
        />

        {/* Professional Details */}
        <Section
          title="Professional Details"
          data={professional}
          onChange={handleChange(setProfessional)}
          onSave={() => alert("Professional details saved")}
          renderInput={renderInput}
        />

        {/* Document Details */}
        <Section
          title="Document Details"
          data={document}
          onChange={handleChange(setDocument)}
          onSave={() => alert("Document details saved")}
          renderInput={renderInput}
        />
      </div>
    </div>
  );
};

const Section = ({ title, data, onChange, onSave, renderInput }) => (
  <div>
    <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <label className="block text-gray-700 text-sm font-semibold mb-1 capitalize">
            {key.replace(/_/g, " ")}
          </label>
          {renderInput(key, value, onChange)}
        </div>
      ))}
    </div>
    <div className="mt-6 text-right">
      <button
        onClick={onSave}
        className="bg-[#0d3c44] text-white px-6 py-2 rounded-md hover:bg-[#0a2d33]"
      >
        Save {title}
      </button>
    </div>
  </div>
);

export default ArtistAll;
