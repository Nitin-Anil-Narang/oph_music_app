import React, { useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { AiOutlineDown } from "react-icons/ai";
import {
  getProfessionalDetails,
  updateProfessionalDetails,
} from "../../API/profile";
import ProfileFormHeader from "../components/ProfileFormHeader";
import Loading from "../../../../components/Loading";
import { useArtist } from "../../API/ArtistContext";
// import { fetchVideoForScreen } from "../../../../utils/fetchVideo";
import MusicBg from "../../../../../public/assets/images/music_bg.png";
import Elipse from "../../../../../public/assets/images/elipse2.png";
import axiosApi from "../../../../conf/axios";
import { uploadVideoViaPresignedPut } from "../../../../utils/presignedVideoUpload";
import { data, useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CustomVideoPlayer from "../../../../components/CustomVideoPlayer/CustomVideoPlayer";

const ProfessionalDetailsForm = () => {
  const { headers, ophid } = useArtist();
  const navigate = useNavigate();
  // Keep this for "fetch details" + "submit" only.
  // (Previously it could stay stuck forever if prereqs weren't ready.)
  const [loading, setLoading] = useState(false);
  const [videoBio, setVideoBio] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [rejectReason, setRejectReason] = useState(null);
  const [searchParams] = useSearchParams();
  const [professions, setProfessions] = useState([]);
  const [professionsLoading, setProfessionsLoading] = useState(true);
  const location = useLocation();
  const user_type = location.state?.user_type;

  const shouldHideSongsPlanned = ophid?.includes("SA");

  const fetchPageMedia = async () => {
    try {
      const response = await axiosApi.get(
        "/page-media?page_name=professional_details",
      );
      if (response.data.success && response.data.data) {
        setVideo(response.data.data.video_url);
        setThumbnail(response.data.data.thumbnail_url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch professions from API
  const fetchProfessions = async () => {
    try {
      setProfessionsLoading(true);
      const response = await axiosApi.get("/get_professions");
      if (response.data && response.data.success) {
        setProfessions(response.data.data || []);
      } else {
        console.error("Failed to fetch professions:", response.data?.message);
        toast.error("Failed to fetch professions");
      }
    } catch (error) {
      console.error("Error fetching professions:", error);
      toast.error("Failed to fetch professions");
    } finally {
      setProfessionsLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    profession: "",
    professionName: "",
    bio: "",
    photos: [],
    spotifyUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    appleMusicUrl: "",
    ExperienceYearly: 0,
    experienceMonths: 0,
    songsPlanned: 0,
    songPlanningDuration: "",
  });

  const [checkSimilarData, setcheckSimilarData] = useState({
    profession: "",
    professionName: "",
    bio: "",
    photos: [],
    spotifyUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    appleMusicUrl: "",
    ExperienceYearly: 0,
    experienceMonths: 0,
    songsPlanned: 0,
    songPlanningDuration: "",
  });

  useEffect(() => {
    fetchProfessions();
    fetchPageMedia();
  }, []);

  useEffect(() => {
    if (!ophid) return;
    if (!headers?.Authorization) return;
    fetchProfessionalDetails();
  }, [ophid, headers?.Authorization]);

  useEffect(() => {
    if (!formData.professionName) return;
    if (formData.profession) return;
    if (!Array.isArray(professions) || professions.length === 0) return;
    const professionId =
      professions.find((p) => p.name === formData.professionName)?.id || "";
    if (!professionId) return;
    setFormData((prev) => ({ ...prev, profession: professionId }));
    setcheckSimilarData((prev) => ({ ...prev, profession: professionId }));
  }, [professions, formData.professionName, formData.profession]);

  const checkSimilarity = () => {
    let isSimilarity = false;

    if (
      formData.profession === checkSimilarData.profession &&
      formData.bio === checkSimilarData.bio &&
      formData.spotifyUrl === checkSimilarData.spotifyUrl &&
      formData.instagramUrl === checkSimilarData.instagramUrl &&
      formData.facebookUrl === checkSimilarData.facebookUrl &&
      formData.appleMusicUrl === checkSimilarData.appleMusicUrl &&
      formData.ExperienceYearly === checkSimilarData.ExperienceYearly &&
      formData.experienceMonths === checkSimilarData.experienceMonths &&
      formData.songPlanningDuration === checkSimilarData.songPlanningDuration &&
      formData.songsPlanned === checkSimilarData.songsPlanned &&
      formData.url === checkSimilarData.url &&
      JSON.stringify(formData.photos) ===
        JSON.stringify(checkSimilarData.photos)
    ) {
      toast.error("Please check rejection reason and make update");
      isSimilarity = true;
    }
    return isSimilarity;
  };

  const fetchProfessionalDetails = async () => {
    setLoading(true);
    try {
      const response = await getProfessionalDetails(headers, ophid);

      if (response.success && response.data.length > 0) {
        const data = response.data;
        const artist = data[0];

        const professionId =
          professions.find((p) => p.name === artist.Profession)?.id || "";
        setFormData({
          profession: professionId,
          professionName: artist.Profession || "",
          bio: artist.Bio || "",
          photos: JSON.parse(artist.PhotoURLs) || [],
          spotifyUrl: artist.SpotifyLink || "",
          instagramUrl: artist.InstagramLink || "",
          facebookUrl: artist.FacebookLink || "",
          appleMusicUrl: artist.AppleMusicLink || "",
          ExperienceYearly: Math.floor((artist.ExperienceMonthly || 0) / 12),
          experienceMonths: (artist.ExperienceMonthly || 0) % 12,
          songPlanningDuration: artist.SongsPlanningType || "",
          songsPlanned: artist.SongsPlanningCount || 0,
          step_status: artist.step_status,
          url: artist.VideoURL,
        });

        setcheckSimilarData({
          profession: professionId,
          professionName: artist.Profession || "",
          bio: artist.Bio || "",
          photos: JSON.parse(artist.PhotoURLs) || [],
          spotifyUrl: artist.SpotifyLink || "",
          instagramUrl: artist.InstagramLink || "",
          facebookUrl: artist.FacebookLink || "",
          appleMusicUrl: artist.AppleMusicLink || "",
          ExperienceYearly: Math.floor((artist.ExperienceMonthly || 0) / 12),
          experienceMonths: (artist.ExperienceMonthly || 0) % 12,
          songPlanningDuration: artist.SongsPlanningType || "",
          songsPlanned: artist.SongsPlanningCount || 0,
          step_status: artist.step_status,
          url: artist.VideoURL,
        });

        setVideoBio(artist.VideoURL || null);
        setVideoUrl(artist.VideoURL);

        if (response.data[0].reject_reason != null) {
          setRejectReason(response.data[0].reject_reason);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch professional details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.ExperienceYearly === 0 && formData.experienceMonths === 0) {
      toast.error("Please enter your experience");
      setLoading(false);
      return;
    }

    if (formData.songsPlanned === 0 && !ophid.includes("SA")) {
      toast.error("Please enter number of songs");
      setLoading(false);
      return;
    }

    if (formData.photos.length === 0) {
      toast.error("Please upload atleast one image");
      setLoading(false);
      return;
    }

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
    if (!shouldHideSongsPlanned && !formData.songPlanningDuration) {
      toast.error("Please select song planning duration");
      setLoading(false);
      return;
    }

    if (formData.step_status === "rejected") {
      const result = checkSimilarity();
      if (result) {
        setLoading(false);
        return;
      }
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("OPH_ID", ophid);
      const selectedProfession = professions.find(
        (p) => p.id == formData.profession,
      );
      formDataToSend.append(
        "Profession",
        selectedProfession ? selectedProfession.name : "",
      );
      formDataToSend.append("Bio", formData.bio);
      formDataToSend.append("SpotifyLink", formData.spotifyUrl);
      formDataToSend.append("InstagramLink", formData.instagramUrl);
      formDataToSend.append("FacebookLink", formData.facebookUrl);
      formDataToSend.append("AppleMusicLink", formData.appleMusicUrl);
      let stepPath;
      if (
        formData.step_status === "under review" ||
        formData.step_status === null
      ) {
        stepPath = "/auth/create-profile/documentation-details";
      } else if (formData.step_status === "rejected") {
        stepPath = `/auth/profile-status`;
      }
      formDataToSend.append("step", stepPath);

      formDataToSend.append("ExperienceMonthly", formData.experienceMonths);
      formDataToSend.append("ExperienceYearly", formData.ExperienceYearly);

      if (ophid && shouldHideSongsPlanned) {
        formDataToSend.append("SongsPlanningCount", "NA");
        formDataToSend.append("SongsPlanningType", "NA");
      } else {
        formDataToSend.append("SongsPlanningCount", formData.songsPlanned);
        formDataToSend.append(
          "SongsPlanningType",
          formData.songPlanningDuration,
        );
      }

      formData.photos.forEach((photo) => {
        if (typeof photo === "string") {
          formDataToSend.append("photoURLs[]", photo);
        } else if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        }
      });

      let videoFinalUrl = null;
      if (
        typeof videoBio === "string" &&
        videoBio &&
        !videoBio.startsWith("blob:")
      ) {
        videoFinalUrl = videoBio;
      } else if (videoBio instanceof File) {
        videoFinalUrl = await uploadVideoViaPresignedPut(axiosApi, videoBio, {
          purpose: "professional",
          headers,
        });
      }
      if (videoFinalUrl) {
        formDataToSend.append("VideoURL", videoFinalUrl);
      }

      const response = await updateProfessionalDetails(formDataToSend, headers);
      const res = await axiosApi.post(`/increment-count/${ophid}`);
      if (response.success) {
        toast.success("Professional details updated successfully");
        const path = `${response.step}`;
        navigate(path, {
          state: {
            user_type: user_type,
            backPath: "/auth/create-profile/professional-details",
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update professional details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentCount = formData.photos.length;
    const newCount = newFiles.length;

    if (currentCount + newCount > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newFiles],
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoBio(file);
    }
  };

  useEffect(() => {
    if (videoBio && typeof videoBio !== "string") {
      const objectUrl = URL.createObjectURL(videoBio);
      setVideoUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (typeof videoBio === "string") {
      setVideoUrl(videoBio);
    }
  }, [videoBio]);

  const handleDeletePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="relative bg-cover bg-center">
      {loading && <Loading />}

      <img
        src={MusicBg}
        className="absolute top-[50%] -z-10 inset-0 md:top-[20%]"
        alt=""
      />
      <img
        src={Elipse}
        className="absolute top-[50%] -z-10 inset-0 w-[30%] md:top-[20%]"
        alt=""
      />
      <div className="min-h-screen z-10  bg-opacity-70 text-white p-6">
        <ProfileFormHeader title="PROFESSIONAL DETAILS" />
        <div className=" mt-20 min-h-[calc(100vh-70px)] text-white p-6 flex flex-col items-center  mx-auto">
          {video && (
            <div className="relative flex justify-center mb-6 w-full max-w-[800px] mx-auto sm:rounded-lg rounded-3xl overflow-hidden">
              <CustomVideoPlayer
                src={video}
                poster={thumbnail || undefined}
                className="w-full h-[49vh] bg-black"
                pauseOtherVideos={true}
                allowFullscreen={true}
                showPlayButtonOverlay
                playOverlayVariant="purple"
              />
            </div>
          )}
          <h2 className="text-cyan-400 uppercase text-2xl mt-4 font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] text-center">
            Professional Details
          </h2>
          {rejectReason && (
            <div className="text-red-500">
              <strong>Reject Reason:</strong> {rejectReason}
            </div>
          )}
          <form
            className="space-y-6 sm:px-[10%] md:px-[15%] xl:px-[25%] mt-10 w-full max-w-[900px]"
            onSubmit={handleSubmit}
          >
            <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Profession: <span className="text-red-500">*</span>{" "}
                </label>

                <div className="relative w-full">
                  <select
                    className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg appearance-none"
                    value={formData.profession}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        profession: e.target.value,
                      }))
                    }
                    disabled={professionsLoading}
                  >
                    <option value="">
                      {professionsLoading
                        ? "Loading professions..."
                        : "Select Profession"}
                    </option>
                    {professions.map((profession) => (
                      <option key={profession.id} value={profession.id}>
                        {profession.name}
                      </option>
                    ))}
                  </select>
                  <AiOutlineDown className="absolute text-[13px] top-1/2 right-6 transform -translate-y-1/2 text-white pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Add Bio: <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full lg:w-auto h-[150px] bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                  placeholder="About you..."
                  rows={6}
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
            </div>

            {/* KEEPING CUSTOM VIDEO PLAYER UNTOUCHED */}
            {videoUrl && (
              <div className="aspect-[1/1] w-full max-w-[280px] sm:max-w-[320px] h-[280px] sm:h-[320px] mx-auto overflow-hidden rounded-lg relative my-6">
                <CustomVideoPlayer
                  src={videoUrl}
                  className="w-full h-full object-cover rounded-lg"
                  pauseOtherVideos={true}
                  allowFullscreen={false}
                  showPlayButtonOverlay
                  playOverlayVariant="purple"
                />
              </div>
            )}

            <div>
              <label className="block text-white mb-2 font-medium">
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
                className="p-5 border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-[rgba(30,30,30,0.3)] hover:bg-[rgba(30,30,30,0.5)] transition duration-200"
              >
                <span className="text-gray-400 text-sm">*Maximum 5 photos</span>
              </label>

              {Array.isArray(formData.photos) && formData.photos.length > 0 && (
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
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
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
                  <label className="block text-white mb-2 font-medium">
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
                    className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                  />
                </div>
              ))}
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Experience: <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-white text-xs mb-1 opacity-80">
                      Years
                    </label>
                    <input
                      min={0}
                      type="number"
                      value={formData.ExperienceYearly}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ExperienceYearly: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-xs mb-1 opacity-80">
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
                      className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {!shouldHideSongsPlanned && (
                <div className="space-y-6">
                  <div>
                    <label className="block w-full mb-2 font-medium">
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
                      className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                    />
                  </div>

                  <div>
                    <label className="block w-full mb-2 font-medium">
                      Song planning duration:{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.songPlanningDuration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          songPlanningDuration: e.target.value,
                        }))
                      }
                      className="w-full lg:w-auto h-12 bg-transparent rounded-xl px-6 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent shadow-lg"
                    >
                      <option value="">Select One</option>
                      <option value="monthly">Per Monthly</option>
                      <option value="quarterly">Per Quarterly</option>
                      <option value="yearly">Per Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 text-black py-2 rounded-full font-semibold hover:font-bold mt-8 flex items-center justify-center transition duration-200 shadow-md"
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
