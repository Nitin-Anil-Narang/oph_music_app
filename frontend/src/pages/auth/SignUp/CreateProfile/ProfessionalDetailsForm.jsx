import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AiOutlineDown } from "react-icons/ai";
import {
  getProfessionalDetails,
  updateProfessionalDetails,
} from "../../API/profile";
import ProfileFormHeader from "../components/ProfileFormHeader";
import Loading from "../../../../components/Loading";
import { useArtist } from "../../API/ArtistContext";
import { fetchVideoForScreen } from "../../../../utils/fetchVideo";
import PlayBtn from "../../../../../public/assets/images/playButton.png";
import MusicBg from "../../../../../public/assets/images/music_bg.png";
import Elipse from "../../../../../public/assets/images/elipse2.png";
import axiosApi from "../../../../conf/axios";
import { useLocation } from "react-router-dom";
const ProfessionalDetailsForm = () => {
  const { headers } = useArtist();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professions, setProfessions] = useState([]);
  const [videoBio, setVideoBio] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Track video play state
  const videoRef = useRef(null);
  const [video, setVideo] = useState(null);
  const [rejectReason, setRejectReason] = useState(null);
  
  const fetchVideo = async () => {
    try {
      const response = await axiosApi.get(
        "artist-website-configs?param=signup_video"
      );
      setVideo(response.data.data[0]);
    } catch (err) {
      console.log(err);
    }
  };
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  useEffect(() => {
    fetchVideo();
  }, []);
  const [formData, setFormData] = useState({
    profession: "",
    bio: "",
    photos: [],
    spotifyUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    appleMusicUrl: "",
    experienceYears: 0,
    experienceMonths: 0,
    songsPlanned: 0,
    songPlanningDuration: "monthly",
  });
console.log(formData,"formdata");

  useEffect(() => {
    fetchRejectReason(); 
    fetchProfessionalDetails(); 
  }, []);

  useEffect(() => {
    const loadVideo = async () => {
      const url = await fetchVideoForScreen("professional_video");
      setVideoUrl(url);
    };
    loadVideo();
  }, []);
  const fetchProfessionalDetails = async () => {
    try {
      const response = await getProfessionalDetails(headers);
      if (response.success) {
        const data = response.data;
        setProfessions(data.professions);
        setFormData({
          profession: data.artist.profession_id || "",
          bio: data.artist.bio || "",
          photos: data.artist.photos || [],
          spotifyUrl: data.artist.spotify_url || "",
          instagramUrl: data.artist.instagram_url || "",
          facebookUrl: data.artist.facebook_url || "",
          appleMusicUrl: data.artist.apple_music_url || "",
          experienceYears: Math.floor((data.artist.exp_in_months || 0) / 12),
          experienceMonths: (data.artist.exp_in_months || 0) % 12,
          songsPlanned: data.artist.songs_planned_per_month || 0,
        });
        setVideoBio(data.artist.video_bio || null);
      }
    } catch (error) {
      toast.error("Failed to fetch professional details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    setLoading(true);
    // Add validation checks
    if (!formData.profession) {
      toast.error("Please select your profession");
      setLoading(false);
      return;
    }
    if (!formData.bio && !videoBio) {
      toast.error("Please add your bio");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all text fields
      formDataToSend.append("profession_id", formData.profession);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("spotify_url", formData.spotifyUrl);
      formDataToSend.append("instagram_url", formData.instagramUrl);
      formDataToSend.append("facebook_url", formData.facebookUrl);
      formDataToSend.append("apple_music_url", formData.appleMusicUrl);

      // Calculate and append experience in months
      const experienceMonths =
        formData.experienceYears * 12 + formData.experienceMonths;
      formDataToSend.append("exp_in_months", experienceMonths);

      // Append number of songs planned
      formDataToSend.append("songs_planned_per_month", formData.songsPlanned);
      formDataToSend.append("song_planning_duration", formData.songPlanningDuration);

      // Append photos
      if (formData.photos.length > 0) {
        formData.photos.forEach((photo) => {
          formDataToSend.append("photos", photo);
        });
      }

      // Append video bio if it exists
      if (videoBio) {
        formDataToSend.append("video_bio", videoBio);
      }

      const response = await updateProfessionalDetails(formDataToSend, headers);
      if (response.success) {
        toast.success("Professional details updated successfully");
        navigate("/auth/create-profile/documentation-details");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update professional details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoBio(file);
    }
  };

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };
  const fetchRejectReason = async () => {
    try {
      const artistId = localStorage.getItem("artist_id"); // Get artist ID from localStorage
      const response = await axiosApi.get(`/artists/${artistId}`);
      console.log(response.data, "response.data"); // Log the response data
      
      if (response.data) {
        setRejectReason(response.data.data.reject_reason || "");
        
      }
      console.log(rejectReason, "rejectReason"); // Log the reject reason
      
    } catch (error) {
      console.error("Error fetching reject reason:", error);
      toast.error("Failed to fetch reject reason.");
    }
  };
  

  return (
    <div className="relative bg-cover bg-center">
      {loading && <Loading />}
      
      <img
        src={MusicBg}
        className="absolute top-[50%] -z-10 inset-0 md:top-[20%]"
        alt=""
        srcSet=""
      />
      <img
        src={Elipse}
        className="absolute top-[50%] -z-10 inset-0 w-[30%] md:top-[20%]"
        alt=""
        srcSet=""
      />
      <div className="min-h-screen z-10  bg-opacity-70 text-white p-6">
        <ProfileFormHeader title="PROFESSIONAL DETAILS" />
        <div className=" mt-20 min-h-[calc(100vh-70px)] text-white p-6 flex flex-col items-center  mx-auto">
          <div className="relative flex justify-center">
            {video && (
              <video
                ref={videoRef}
                src={video.value}
                onPlay={handlePlay}
                onPause={handlePause}
                onClick={togglePlayPause}
                className="w-[800px] h-[50vh]  object-cover "
                controls={false} // Disable default controls
              />
            )}
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent focus:outline-none"
              >
                <img src={PlayBtn} alt="Play" className="w-32 h-32" />
              </button>
            )}
          </div>
          <h2 className="text-cyan-400 uppercase text-2xl mt-4 font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] text-center">
            Professional Details
          </h2>
          {rejectReason && (
        <div className="text-red-500">
          <strong>Reject Reason:</strong> {rejectReason}
        </div>
      )}
          <form
            className="space-y-4 px-[5%] sm:px-[10%] md:px-[15%] xl:px-[25%] mt-10"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="block text-white mb-1">
                Profession: <span className="text-red-500">*</span>{" "}
              </label>

              <div className="relative w-full">
                {/* Select Box */}
                <select
                  className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
                   focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200 appearance-none"
                  value={formData.profession}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      profession: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Profession</option>
                  {professions.map((profession) => (
                    <option key={profession.id} value={profession.id}>
                      {profession.name}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow Icon */}
                <AiOutlineDown className="absolute text-[13px] top-1/2 right-3 transform -translate-y-1/2 text-white pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-white mb-1">
                Add Bio: <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-[150px]  border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 py-2 text-white bg-[rgba(30,30,30,0.7)] rounded-2xl outline-none shadow-inner
                   focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                placeholder="About you..."
                row={6}
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
              />
              <div className="text-cyan-400 text-sm mt-1">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer underline"
                >
                  + Upload Video About Yourself
                </label>
              </div>
            </div>

            <div className="relative mb-8">
              {videoBio ? (
                <video
                  src={
                    typeof videoBio === "string"
                      ? videoBio
                      : URL.createObjectURL(videoBio)
                  }
                  className="w-full rounded-lg"
                  controls
                />
              ) : null}
            </div>

            <div>
              <label className="block text-white mb-1">
                Upload Your Photos: <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="p-4 border-2 border-dashed border-gray-700 rounded flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="text-gray-400 text-sm">*Maximum 5 photos</span>
              </label>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        photo instanceof File
                          ? URL.createObjectURL(photo)
                          : photo
                      }
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => handleDeletePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  platform: "Spotify",
                  value: formData.spotifyUrl,
                  key: "spotifyUrl",
                },
                {
                  platform: "Instagram",
                  value: formData.instagramUrl,
                  key: "instagramUrl",
                },
                {
                  platform: "Facebook",
                  value: formData.facebookUrl,
                  key: "facebookUrl",
                },
                {
                  platform: "Apple Music",
                  value: formData.appleMusicUrl,
                  key: "appleMusicUrl",
                },
              ].map(({ platform, value, key }) => (
                <div key={key}>
                  <label className="block text-white mb-1">
                    Add {platform} URL:
                  </label>
                  <input
                    type="text"
                    placeholder={`${platform} URL`}
                    value={value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
                   focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-white mb-1">
                Experience: <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm mb-1">Years</label>
                  <input
                    min={0}
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experienceYears: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
                   focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-1">
                    Months
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.experienceMonths}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experienceMonths: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
                   focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-grow">
                <label className="block w-full mb-1">
                  Number of songs planning:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  min={0}
                  type="number"
                  value={formData.songsPlanned}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      songsPlanned: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
       focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                />
              </div>

              <div>
                <label className="block w-full mb-1">
                  Song planning duration:{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.songPlanningDuration  } // Bind it to the form data
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      songPlanningDuration: e.target.value || "monthly", // Update with selected value
                    }))
                  }
                  className="w-full h-12 border-l-[1px] border-t-[1px] border-r-[1px] backdrop-blur-md border-[#757475] px-4 text-white bg-[rgba(30,30,30,0.7)] rounded-full outline-none shadow-inner
       focus:ring-2 focus:bg-[rgb(93 ,201,222,0.5)] outline-none  focus:border-[#5DC8DF]  transition duration-200"
                >
                  <option  value="monthly">Per Monthly</option>
                  <option value="quarterly">Per Quarterly</option>
                  <option value="yearly">Per Yearlyy</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 text-black py-3 rounded-full hover:font-bold mt-6 flex items-center  justify-center"
            >
              Continue <span className="ml-2">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsForm;
