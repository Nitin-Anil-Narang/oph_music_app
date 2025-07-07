import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../../../conf/axios";

const ArtistAll = () => {
  const { ophid } = useParams();
  const [personal, setPersonal] = useState({});
  const [professional, setProfessional] = useState({});
  const [document, setDocument] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosApi.get(`/under-review/${ophid}`); 
        const { userDetails, professionalDetails, documentationDetails } = res.data;

        // Personal details
        const personalData = {
          full_name: userDetails.full_name || "",
          stage_name: userDetails.stage_name || "",
          email: userDetails.email || "",
          contact_number: userDetails.contact_num || "",
          artist_type: userDetails.artist_type || "",
          location: userDetails.location || "",
          personal_photo: userDetails.personal_photo || "",
        };

        // Professional details
        const professionalData = {
          profession: professionalDetails.Profession || "",
          bio: professionalDetails.Bio || "",
          video: professionalDetails.VideoURL || "",
          // Using first image from array as main photo preview
          photo: JSON.parse(professionalDetails.PhotoURLs || "[]")[0] || "",
          spotify: professionalDetails.SpotifyLink || "",
          instagram: professionalDetails.InstagramLink || "",
          facebook: professionalDetails.FacebookLink || "",
          apple_music: professionalDetails.AppleMusicLink || "",
          experience_monthly: professionalDetails.ExperienceMonthly || 0,
          experience_yearly: 0, // Derived, shown read-only
          songs_planning_count: professionalDetails.SongsPlanningCount || "",
          songs_planning_type: professionalDetails.SongsPlanningType || "",
        };

        // Document details
        const documentData = {
          aadhar_front: documentationDetails.AadharFrontURL || "",
          aadhar_back: documentationDetails.AadharBackURL || "",
          pan_front: documentationDetails.PanFrontURL || "",
          signature: documentationDetails.SignatureImageURL || "",
          bank_name: documentationDetails.BankName || "",
          account_holder: documentationDetails.AccountHolderName || "",
          account_number: documentationDetails.AccountNumber || "",
          ifsc_code: documentationDetails.IFSCCode || "",
        };

        setPersonal(personalData);
        setProfessional(professionalData);
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    fetchData();
  }, []);

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

  const renderInput = (key, value, onChange, allData = {}) => {
    const lower = key.toLowerCase();
    const isPhoto =
      lower.includes("photo") ||
      lower.includes("image") ||
      lower.includes("front") ||
      lower.includes("signature") ||
      lower.includes("aadhar") ||
      lower.includes("pan");
    const isVideo = lower.includes("video");

    if (key === "experience_yearly") {
      const months = parseInt(allData.experience_monthly || 0);
      const years = Math.floor(months / 12);
      return (
        <div className="w-full p-2 border rounded-md text-black bg-gray-100">
          {years}
        </div>
      );
    }

    if (isPhoto || isVideo) {
      return (
        <div>
          <div
            className="cursor-pointer"
            onClick={() => fileInputRefs.current[key]?.click()}
          >
            {isPhoto && value && (
              <img
                src={value}
                alt={key}
                className="w-40 h-40 rounded object-cover border mb-2"
              />
            )}
            {isVideo && value && (
              <video
                className="w-full max-w-xs rounded border mb-2"
                controls
                src={value}
              />
            )}
            {!value && <div className="text-gray-400">Click to upload</div>}
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
          {renderInput(key, value, onChange, data)}
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
