import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../../../conf/axios";
import { Lock, Unlock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const ArtistAll = () => {
  const { ophid } = useParams();
  const [personal, setPersonal] = useState({});
  const [professional, setProfessional] = useState({});
  const [document, setDocument] = useState({});

  const [locks, setLocks] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosApi.get(`/completed/${ophid}`);
        console.log(res);

        const { userDetails, professionalDetails, documentationDetails } = res.data;

        const personalData = {
          full_name: userDetails.full_name || "",
          stage_name: userDetails.stage_name || "",
          email: userDetails.email || "",
          contact_number: userDetails.contact_num || "",
          artist_type: userDetails.artist_type || "",
          location: userDetails.location || "",
          personal_photo: userDetails.personal_photo || "",
        };

        const professionalData = {
          profession: professionalDetails.Profession || "",
          bio: professionalDetails.Bio || "",
          video: professionalDetails.VideoURL || "",
          photos: JSON.parse(professionalDetails.PhotoURLs || "[]"),
          spotify: professionalDetails.SpotifyLink || "",
          instagram: professionalDetails.InstagramLink || "",
          facebook: professionalDetails.FacebookLink || "",
          apple_music: professionalDetails.AppleMusicLink || "",
          experience_monthly: professionalDetails.ExperienceMonthly || 0,
          experience_yearly: 0,
          songs_planning_count: professionalDetails.SongsPlanningCount || "",
          songs_planning_type: professionalDetails.SongsPlanningType || "",
        };

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

        // Initialize locks
        const newLocks = {};
        [personalData, professionalData, documentData].forEach((sectionData, sectionIdx) => {
          Object.keys(sectionData).forEach((key) => {
            if (key === "photos" && Array.isArray(sectionData[key])) {
              sectionData[key].forEach((_, idx) => {
                newLocks[`${sectionIdx}_${key}_${idx}`] = true;
              });
            } else {
              newLocks[`${sectionIdx}_${key}`] = true;
            }
          });
        });

        setPersonal(personalData);
        setProfessional(professionalData);
        setDocument(documentData);
        setLocks(newLocks);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (sectionSetter) => (field, value) => {
    sectionSetter((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e, key, onChange, index = null) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (index !== null) {
        onChange("photos", (prevPhotos) => {
          const updated = [...prevPhotos];
          updated[index] = url;
          return updated;
        });
      } else {
        onChange(key, url);
      }
    }
  };

  const toggleLock = (lockKey) => {
    setLocks((prev) => ({ ...prev, [lockKey]: !prev[lockKey] }));
  };

  const showConfirmationToast = (onConfirm) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to save?
          <div className="mt-2 flex justify-center gap-4">
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => {
                onConfirm();
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </span>
      ),
      { duration: 5000 }
    );
  };

  const handleSaveSection = (sectionName, currentData) => {
    showConfirmationToast(() => {
      console.log(`${sectionName} final data:`, currentData);
    });
  };

  const renderInput = (key, value, onChange, allData, lockKey, sectionIdx) => {
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

    if (key === "photos" && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-4">
          {value.map((photoUrl, index) => {
            const photoKey = `${sectionIdx}_${key}_${index}`;
            const locked = locks[photoKey];

            return (
              <div key={index} className="relative">
                <div
                  className={`cursor-pointer ${locked ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => {
                    if (!locked) fileInputRefs.current[photoKey]?.click();
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={`photo-${index}`}
                    className="w-32 h-32 rounded object-cover border mb-2"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                    Click to replace
                  </div>
                </div>
                <input
                  ref={(ref) => (fileInputRefs.current[photoKey] = ref)}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(e, key, (field, updater) => {
                      onChange(field, updater);
                    }, index)
                  }
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => toggleLock(photoKey)}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full border shadow hover:bg-gray-100 transition"
                >
                  {locks[photoKey] ? (
                    <Lock size={16} className="text-gray-600" />
                  ) : (
                    <Unlock size={16} className="text-green-600" />
                  )}
                </button>
              </div>
            );
          })}

          {/* Add new photo button */}
          <div className="w-full">
            <button
              type="button"
              onClick={() => {
                fileInputRefs.current[`add_new_${sectionIdx}_${key}`]?.click();
              }}
              className="mt-2 px-3 py-1 bg-[#0d3c44] text-white rounded hover:bg-[#0a2d33]"
            >
              Add New Photo
            </button>

            <input
              ref={(ref) => (fileInputRefs.current[`add_new_${sectionIdx}_${key}`] = ref)}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const newUrl = URL.createObjectURL(file);
                  onChange("photos", [...allData.photos, newUrl]);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      );
    }

    const locked = locks[lockKey];

    if (isPhoto || isVideo) {
      return (
        <div className="relative">
          <div
            className={`cursor-pointer ${locked ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => {
              if (!locked) fileInputRefs.current[lockKey]?.click();
            }}
          >
            {isPhoto && value && (
              <>
                <img
                  src={value}
                  alt={key}
                  className="w-40 h-40 rounded object-cover border mb-2"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                  Click to replace
                </div>
              </>
            )}
            {isVideo && value && (
              <>
                <video
                  className="w-full max-w-xs rounded border mb-2"
                  controls
                  src={value}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                  Click to replace
                </div>
              </>
            )}
            {!value && (
              <div className="text-gray-400 border border-dashed p-4 rounded">
                Click to upload
              </div>
            )}
          </div>
          <input
            ref={(ref) => (fileInputRefs.current[lockKey] = ref)}
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
        disabled={locked}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        <Section
          title="Personal Details"
          data={personal}
          onChange={handleChange(setPersonal)}
          onSave={() => handleSaveSection("Personal Details", personal)}
          renderInput={renderInput}
          sectionIdx={0}
          locks={locks}
          toggleLock={toggleLock}
        />

        <Section
          title="Professional Details"
          data={professional}
          onChange={handleChange(setProfessional)}
          onSave={() => handleSaveSection("Professional Details", professional)}
          renderInput={renderInput}
          sectionIdx={1}
          locks={locks}
          toggleLock={toggleLock}
        />

        <Section
          title="Document Details"
          data={document}
          onChange={handleChange(setDocument)}
          onSave={() => handleSaveSection("Document Details", document)}
          renderInput={renderInput}
          sectionIdx={2}
          locks={locks}
          toggleLock={toggleLock}
        />
      </div>
    </div>
  );
};

const Section = ({
  title,
  data,
  onChange,
  onSave,
  renderInput,
  sectionIdx,
  locks,
  toggleLock,
}) => (
  <div>
    <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
      {title}
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {Object.entries(data).map(([key, value]) => {
        const lockKey = `${sectionIdx}_${key}`;
        return (
          <div key={key}>
            <label className="block text-gray-700 text-sm font-semibold mb-1 capitalize">
              {key.replace(/_/g, " ")}
            </label>
            <div className="relative">
              {renderInput(key, value, onChange, data, lockKey, sectionIdx)}
              {key !== "photos" && (
                <button
                  type="button"
                  onClick={() => toggleLock(lockKey)}
                  className="absolute top-1 right-1 p-1 bg-white rounded-full border shadow hover:bg-gray-100 transition"
                >
                  {locks[lockKey] ? (
                    <Lock size={16} className="text-gray-600" />
                  ) : (
                    <Unlock size={16} className="text-green-600" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
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
