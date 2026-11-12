import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { signupUser } from "../../API/profile";
import axiosApi from "../../../../conf/axios";
import PlayBtn from "../../../../../public/assets/images/playButton.png";
import Struggle from "../../../../../public/assets/images/struggle.png";
import Elipse from "../../../../../public/assets/images/elipse.png";
import Elipse2 from "../../../../../public/assets/images/elipse2.png";
import { useArtist } from "../../API/ArtistContext";
import FilterSelect from "../../../../components/FilterSelect/FilterSelect";
import CustomVideoPlayer from "../../../../components/CustomVideoPlayer/CustomVideoPlayer";

const artistTypeData = {
  "Independent artist": [
    "Everything to Build your Music Career",
    "Make Your Music Discoverable.",
    "More Opportunities. More Income.",
    "Make the Music you Love. Leave the Rest to Us",
    "Let the Right People Find You",
    "No Location Barriers on Events",
    "Give Your Story a Place to Live",
    "Get Seen. Track Your Growth. Get Rewarded.",
    "Plan Your Release. Reach More People.",
    "Keep 100% of What You Earn.",
    "Take Your Music to TV",
    "Get Your Moment in the Spotlight",
    "Make Yourself Findable.",
  ],

  "Special artist": [
    "Tell Your Story. Show Your Work.",
    "Get Discovered. Stay Visible.",
    "Compete From Your Own Space",
    "Be Heard - Let Your Songs Be at One Place",
    "Stay in Control of Your Identity",
    "Your Room Can Be Your Stage.",
    "Be Found. Connect Directly.",
    "Keep 100% of What You Earn.",
    "More Events. More Opportunities.",
    "One Decision. Life-Time Membership.",
    "Be Found. Be Heard.",
    "Regular Opportunities",
    "Where Music Finds You.",
  ],
};


const SignUpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [videoModal, setVideoModal] = useState(false);

  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [displayArtistType, setDisplayArtistType] =
    useState("Independent artist");

  const fetchPageMedia = async () => {
    try {
      const response = await axiosApi.get("/page-media?page_name=signup");
      if (response.data.success && response.data.data) {
        setVideo(response.data.data.video_url);
        setThumbnail(response.data.data.thumbnail_url);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const { login } = useArtist();
  const [formData, setFormData] = useState({
    name: "",
    stageName: "",
    email: "",
    contactNumber: "",
    artistType: "",
    password: "",
    confirmPassword: "",
    step: "/auth/payment",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (location.state?.status === "cancelled") {
      toast.error(
        "Payment is mandatory. Please complete the payment to continue.",
      );
      navigate("/auth/login", { replace: true, state: {} });
    } else if (location.state?.status === "success") {
      toast.success("Payment successful.");
      navigate("/dashboard", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.stageName.trim())
      newErrors.stageName = "Stage name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact number is required";
    else if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Must be 10 digits";

    if (!formData.artistType.trim())
      newErrors.artistType = "Artist type is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(formData.password)
    )
      newErrors.password =
        "Include uppercase, lowercase, number, and special character";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const getFieldError = (name, value, formData) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        break;
      case "stageName":
        if (!value.trim()) return "Stage name is required";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        break;
      case "contactNumber":
        if (!value) return "Contact number is required";
        if (!/^\d{10}$/.test(value)) return "Must be 10 digits";
        break;
      case "artistType":
        if (!value) return "Artist type is required";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(value))
          return "Include uppercase, lowercase, number, and special character";
        break;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      const error = getFieldError(name, value, updatedFormData);

      const confirmPasswordError =
        name === "password"
          ? getFieldError(
              "confirmPassword",
              updatedFormData.confirmPassword,
              updatedFormData,
            )
          : errors.confirmPassword;

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
        ...(name === "password" && { confirmPassword: confirmPasswordError }),
      }));

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      const response = await signupUser(formData);
      console.log(response);

      if (response.success) {
        login(response.token);
        navigate("/auth/payment", {
          state: {
            from: "Registration",
            user_type: formData.artistType,
            backPath: "/auth/signup",
          },
          replace: true,
        });
      }
    } catch (e) {
      console.log(e);

      toast.error(e.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchPageMedia();
  }, []);

  return (
    <>
      <div className="min-h-screen pb-20 xl:px-16 lg:px-10 px-4 pt-10 lg:pt-40 bg-cover bg-center relative">
        <div className="w-full container mx-auto py-4 lg:py-8 relative z-10 flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-1/2">
            <div
              className="bg-contain bg-no-repeat flex flex-col items-center text-center"
              style={{ backgroundImage: `url(${Struggle})` }}
            >
              <h1 className="text-cyan-400 text-lg lg:text-xl font-extrabold mb-3 lg:mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] mt-8 sm:mt-0">
                IT’S TIME TO BE DISCOVERED{" "}
              </h1>
              <p className="text-gray-400 mb-6 lg:mb-8 text-xs sm:text-xs">
                OPH Community isn’t just a platform. It’s a family. And today,
                the doors of that family are open to you.
              </p>
            </div>

            {/* Video Section - Mobile Only */}
            <div className="lg:hidden w-full mb-6">
              <div className="w-full h-[220px] xs:h-[260px] sm:h-[300px] overflow-hidden rounded-xl relative shadow-lg">
                {thumbnail && (
                  <img
                    src={thumbnail}
                    alt="Sign Up"
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}

                {video && (
                  <button
                    onClick={() => setVideoModal(true)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent focus:outline-none z-10 hover:scale-105 transition-transform"
                  >
                    <img
                      src={PlayBtn}
                      alt="Play"
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Full Name:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-1.5 rounded-xl bg-transparent border-t border-l border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                  placeholder="Martin"
                />
                {errors.name && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Stage Name:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stageName"
                  value={formData.stageName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-1.5 rounded-xl bg-transparent border-t border-l border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                  placeholder="Enter Stage Name"
                />
                {errors.stageName && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.stageName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Email:<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 sm:py-1.5 rounded-xl bg-transparent border-t border-l border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                  placeholder="abc@gmail.com"
                />
                {errors.email && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Contact Number:<span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <select className="px-3 sm:px-4 py-2 sm:py-1.5 rounded-l-xl bg-transparent border-t border-l border-r-0 border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-xs sm:text-sm">
                    <option className="bg-gray-900 text-white">IND +91</option>
                  </select>
                  <input
                    type="tel"
                    maxLength={10}
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-1.5 rounded-r-xl bg-transparent border-t border-l-0 border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                    placeholder="0000 0000 00"
                  />
                </div>
                {errors.contactNumber && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.contactNumber}
                  </div>
                )}
              </div>

              {/* Artist Type Dropdown */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Artist Type :<span className="text-red-500">*</span>
                </label>
                <FilterSelect
                  value={
                    formData.artistType === "Independent artist"
                      ? "Independent Artist"
                      : formData.artistType === "Special artist"
                        ? "Specialist Artist"
                        : ""
                  }
                  placeholder="Select Artist Type"
                  ariaLabel="Artist Type"
                  className="w-full flex items-center justify-between px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-b from-white/20 to-white/5 border-t border-l border-r border-white/20 border-b-transparent text-gray-100 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-lg transition-all cursor-pointer"
                  options={[
                    {
                      value: "Independent artist",
                      label: "Independent Artist",
                    },
                    { value: "Special artist", label: "Specialist Artist" },
                  ]}
                  onChange={(val) =>
                    handleChange({ target: { name: "artistType", value: val } })
                  }
                />
                {errors.artistType && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.artistType}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-1.5 rounded-xl bg-transparent border-t border-l border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 pr-10 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                    placeholder="••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.58 6.58l10.3194 10.3194M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 lg:mb-4">
                  Confirm Password:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 sm:py-1.5 rounded-xl bg-transparent border-t border-l border-r border-white/20 border-b-transparent text-gray-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 pr-10 transition-colors shadow-lg bg-gradient-to-b from-white/20 to-white/5 text-sm"
                    placeholder="••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.58 6.58l10.3194 10.3194M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 sm:py-2 px-4 bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold rounded-full transition-colors duration-200 shadow-md text-sm sm:text-base mt-4"
              >
                Create Account
              </button>
            </form>
          </div>

          {/* Image Section - Desktop Only */}
          <div className="hidden lg:block lg:w-[45%] mt-[40px] relative">
            <div className="aspect-[3/4] lg:aspect-[5/6] overflow-hidden rounded-lg relative">
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt="Sign Up"
                  className="w-full h-full object-cover rounded-lg"
                />
              )}

              {video && (
                <button
                  onClick={() => setVideoModal(true)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent focus:outline-none z-10"
                >
                  <img src={PlayBtn} alt="Play" className="w-24 h-24" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {videoModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setVideoModal(false)}
          >
            <div
              className="relative w-full max-w-2xl bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setVideoModal(false)}
                className="absolute top-2 right-4 text-white text-3xl font-bold z-50 hover:text-cyan-400"
              >
                ✕
              </button>

              {/* Video */}
              <CustomVideoPlayer
                id="signup-video-player"
                src={video}
                className="w-full h-auto max-h-[75vh] rounded-lg"
                autoPlay
                pauseOtherVideos={true}
              />
            </div>
          </div>
        )}

        <img
          src={Elipse}
          className="hidden lg:block absolute h-[600px] right-0"
          alt=""
        />
        <img
          src={Elipse2}
          className="hidden lg:block absolute h-[600px] top-[500px] left-0"
          alt=""
        />
        <img
          src={Elipse2}
          className="absolute h-[600px] top-[1000px] left-0 pointer-events-none opacity-50 lg:opacity-100"
          alt=""
        />
        <img
          src={Elipse}
          className="absolute h-[600px] right-0 pointer-events-none opacity-50 lg:opacity-100"
          alt=""
        />
        <img
          src={Elipse2}
          className="absolute h-[600px] bottom-[1500px] left-0 pointer-events-none opacity-50 lg:opacity-100"
          alt=""
        />

        <img
          src={Elipse}
          className="absolute h-[600px] bottom-[650px] right-0 pointer-events-none opacity-50 lg:opacity-100"
          alt=""
        />

        <img
          src={Elipse2}
          className="absolute h-[600px] bottom-[700px] left-0 pointer-events-none opacity-50 lg:opacity-100"
          alt=""
        />

        <h1 className="text-xl sm:text-3xl text-left text-white font-bold mt-8">
          <span className="text-[#5DC9DE]">THIS IS WHERE YOU BELONG:</span>A
          HOME FOR EVERY ARTIST.
        </h1>
        <h2 className="text-left mt-3 text-xs sm:text-sm text-[#9BA3B7] leading-relaxed">
          You don’t need a Big Name, a Big Following, or the Big Connections to
          belong here. If Music is your World, this is your Home.
        </h2>

        <div className="pt-6 sm:pt-12 lg:pt-6">
          <h2 className="uppercase text-base sm:text-xl font-semibold">
            TWO DOORS. ONE FAMILY. BUILT FOR TWO DIFFERENT ARTISTS.
          </h2>
          <h2 className="uppercase text-xs sm:text-base font-semibold mt-2 text-[#5DC9DE]">
            Every Artist Has a Different Journey. Which One Is Yours?
          </h2>

          {/* Artist Type Selector Buttons - Mobile Only */}
          <div className="lg:hidden flex mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => setDisplayArtistType("Independent artist")}
              className={`flex-1 py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-200 relative ${
                displayArtistType === "Independent artist"
                  ? "text-[#5DC9DE]"
                  : "text-gray-400"
              }`}
            >
              Independent Artist
              {displayArtistType === "Independent artist" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5DC9DE]"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDisplayArtistType("Special artist")}
              className={`flex-1 py-2.5 sm:py-3 font-semibold text-sm sm:text-base transition-all duration-200 relative ${
                displayArtistType === "Special artist"
                  ? "text-[#5DC9DE]"
                  : "text-gray-400"
              }`}
            >
              Specialist Artist
              {displayArtistType === "Special artist" && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#5DC9DE]"></div>
              )}
            </button>
          </div>

          {/* Desktop Two-Column Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 mt-8">
            {/* Independent Artist Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Independent Artists
              </h3>
              <ol className="list-none space-y-2">
                {artistTypeData["Independent artist"].map((item, index) => (
                  <h3
                    key={index}
                    className="before:content-['•'] before:text-base drop-shadow-[0_0_5px_rgba(255,255,255,0.319)] before:mr-2 text-sm"
                  >
                    {item}
                  </h3>
                ))}
              </ol>
            </div>
            {/* Specialist Artist Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Specialist Artists
              </h3>
              <ol className="list-none space-y-2">
                {artistTypeData["Special artist"].map((item, index) => (
                  <h3
                    key={index}
                    className="before:content-['•'] before:text-base drop-shadow-[0_0_5px_rgba(255,255,255,0.319)] before:mr-2 text-sm"
                  >
                    {item}
                  </h3>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Mobile Full-Width Layout */}
        <div className="lg:hidden w-full mt-6 sm:mt-8">
          {/* Independent Artist */}
          {displayArtistType === "Independent artist" && (
            <div className="w-full">
              <ol className="list-none space-y-2 px-4">
                {artistTypeData["Independent artist"].map((item, index) => (
                  <h3
                    key={index}
                    className="before:content-['•'] before:text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.319)] before:mr-2 text-xs"
                  >
                    {item}
                  </h3>
                ))}
              </ol>
            </div>
          )}
          {/* Specialist Artist */}
          {displayArtistType === "Special artist" && (
            <div className="w-full">
              <ol className="list-none space-y-2 px-4">
                {artistTypeData["Special artist"].map((item, index) => (
                  <h3
                    key={index}
                    className="before:content-['•'] before:text-sm drop-shadow-[0_0_5px_rgba(255,255,255,0.319)] before:mr-2 text-xs"
                  >
                    {item}
                  </h3>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="pt-6 sm:pt-12">
          <div className="hidden lg:block"></div>

          <div className="relative">
            <h2 className="mt-6 sm:mt-8 text-xs sm:text-lg text-[#5DC9DE] font-bold leading-normal">
              + Built Two Different Doors because your needs are different.
              Choose the path that fits you - get exactly what you need, and not
              what you don’t.
            </h2>
          </div>

          {/* Mobile Full-Width Layout */}
          <div className="lg:hidden w-full mt-6 sm:mt-8 px-2 sm:px-4">
            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              1. Marketing Functions:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>100% Google Ads marketing by the OPH Community</h3>
              <h3>100% Facebook Ads marketing by the OPH Community</h3>
              <h3>
                All creatives and artist branding will be managed by the OPH
                Community
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              2. Creative Function
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>Teaser</h3>
              <h3>Song Reel</h3>
              <h3>Poster</h3>
              <h3>Distribution Poster</h3>
              <h3>Thumbnail</h3>
              <h3>Artist Story</h3>
            </ul>
            <p className="text-gray-400 mt-3 text-xs sm:text-sm">
              This will be{" "}
              <span className="text-[#5DC9DE]">
                created by the OPH Community
              </span>
            </p>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              3. Distribution Audio Functions:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                Distribution across all music platforms (including Indian
                platforms)
              </h3>
              <h3>Artist profile linking on Instagram</h3>
              <h3>
                Creation of new profiles on Apple Music and Spotify (if the
                artist doesn't already have one)
              </h3>
              <h3>Caller tunes will be made available</h3>
              <h3>Image design will be handled by the OPH Community</h3>
              <h3>
                All data will be accessible through the Artist Portal, managed
                by the OPH Community.
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              4. Ownership:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                Full ownership will remain with the artist, with no
                interference.
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              5. TV Release:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                The artist's music video will have the opportunity to be
                released on TV platforms across various channels.
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              6. Revenue Model:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                100% of the revenue from both audio and video will go to the
                artist.
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              7. Withdrawal Threshold:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                No limit or threshold on the withdrawal amount. Artists can
                withdraw any amount, even as low as ₹100.
              </h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              8. Exposure:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>
                The artist's EPK and profile will be displayed on the official
                OPH Community website, providing connections and networking
                opportunities.
              </h3>
            </ul>

            <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              9. Support:
            </h2>
            <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
              <h3>Call Support</h3>
              <h3>Chat Support</h3>
              <h3>Ticket Raising System</h3>
              <h3>Access To a Personal Portal</h3>
            </ul>

            <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

            <p className="underline text-[#5DC9DE] font-bold text-base sm:text-xl before:text-base sm:before:text-lg before:mr-2 w-full px-1 sm:px-3">
              First Time Ever in India – Only for Limited Thousand Artist
            </p>
            <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-medium before:content-['•'] before:text-base sm:before:text-lg before:mr-2 w-full px-1 sm:px-3">
              One Time Artist Documentation Registration fees –{" "}
              <span className="text-[#5DC9DE] font-black">
                2,999 for lifetime Access
              </span>
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium before:content-['•'] before:text-base sm:before:text-lg before:mr-2 w-full px-1 sm:px-3">
              Pay as You Go Per{" "}
              <span className="text-[#5DC9DE] font-black">
                Song Registration Documentation fees – 799
              </span>
            </p>
          </div>

          {/* Desktop Two-Column Content Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12 mt-8">
            {/* Left Column */}
            <div>
              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                1. EPK Artist Profile | Your Whole Identity, All in One Place.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Your Work - Songs, projects, credits, and everything you've
                  created.
                </li>
                <li>
                  Your Story - Where you come from, why you make music, and what
                  drives you.
                </li>
                <li>
                  Your Socials - Instagram, YouTube, and more, all in one place.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Share one link and let people discover who you are and what you
                create. Your story deserves a place of its own.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                2. Direct Connect | 0% Commission. 0 Middlemen.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>No agent. No manager. No one taking cut.</li>
                <li>Paid, free, or revenue-share - you decide.</li>
                <li>No more lost opportunities. Connect directly.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Your rate. Your terms. Your money. Keep What You Earn
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                3. Song Release | You Make the Music. We Handle the Rest.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Release on our platform + YouTube, or your own channel - your
                  choice.
                </li>
                <li>
                  Marketing, promotion &amp; distribution handled, so you can
                  focus on creating.
                </li>
                <li>
                  Song Registration is optional - release when you're ready,
                  with no pressure.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                You make the music. We make sure it doesn't get lost in the
                crowd.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                4. Give Your Old Songs a Second Life
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Bring previously released songs back into the spotlight. Old
                  or new, every good song deserves another chance.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                The song wasn't bad. It just needed another opportunity. Every
                Song Deserves a 2nd chance. Here, it gets one.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                5. 100% Ownership + 100% Revenue
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Your Rights stays 100% yours, and so does the Revenue it
                  generates. We don't take any ownership or a cut.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                You created it. It's yours. No questions, no compromises.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                6. Release Calendar | Your Music. Your Timing.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Book your release date months in advance - just like booking a
                  flight.
                </li>
                <li>
                  Add your title, credits &amp; metadata whenever you're ready -
                  no rush.
                </li>
                <li>
                  Plan your releases around festivals, birthdays, anniversaries,
                  wedding seasons &amp; more.
                </li>
                <li>
                  Want your song release 4-5 days before your favourite
                  occasion? Lock your date early.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                You're the boss of your release date. You're in control of when
                your music gets its moment.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                7. Events &amp; Competitions | Everyone Gets a Chance
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Save on travel, hotels &amp; food - no expensive trips
                  required.
                </li>
                <li>Members get 50% off every event, always.</li>
                <li>Win and earn directly through your portal.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                You shouldn't have to afford a flight, a hotel, or a long
                journey just to be heard. Your talent deserves a chance,
                wherever you are.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                8. TV Release | From Your Screen to Big Screen.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Today's independent artists deserve opportunities beyond
                  digital platforms. We're opening one more door. Selected songs
                  can get an opportunity for TV release, with Approvals.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                An opportunity that once felt reserved for labels can now have a
                door open for you.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                9. Analytics | Know Your Music Performance.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  YouTube, Instagram &amp; Audio platforms - all in one
                  dashboard.
                </li>
                <li>
                  Once your Data is Ready, your Analytics are too. No waiting
                  for Days or Months.
                </li>
                <li>
                  Let the data guide your next move - See what's working, where
                  you're heard, and what's growing.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Stop creating in the dark. See your numbers. Understand your
                audience. Grow smarter.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                10. Leaderboard, KPI &amp; Artist Spotlight
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>Leaderboard - See your rank across the community.</li>
                <li>
                  KPI System - Track your growth and know what to improve.
                </li>
                <li>
                  Artist Spotlight - Top performers get featured with free
                  visibility.
                </li>
                <li>
                  Rewards - Earn performance-based rewards at no extra cost.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Hard work can go unnoticed. Here, your progress gets seen. You
                shouldn't have to wait to be recognized. Let your work speak.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                11. Income &amp; Withdrawal | Your Money Stays in your Pocket.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  See your complete income in your portal - where it came from
                  and how much you earned.
                </li>
                <li>
                  No confusing delays or "wait until next quarter" excuses.
                </li>
                <li>Withdraw whenever you want, even ₹1. No minimum limit.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Here, everything stays transparent. Your money is yours and you
                shouldn't have to ask for it.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                12. Support + One-Time Membership
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>Ticket, Call or Chat - When you need. We're here.</li>
                <li>One time Membership fees and stay forever.</li>
                <li>No subscriptions. No auto-renewals.</li>
                <li>Once joined - You're the family and will stay forever.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Because belonging shouldn't come with a monthly price tag.
              </p>
            </div>

            {/* Right Column */}
            <div>
              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
               1. ★ Exclusive | Showcase Your Work | First 2 Songs Free.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>Your first 2 showcases are completely free.</li>
                <li>
                  Add songs where you contributed through singing, music,
                  lyrics, mixing, mastering, and more. (While keeping your
                  rights in the Project)
                </li>
                <li>
                  Let clients hear your work and see your contribution before
                  they decide.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Let your work speak for you - now you have the proof.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                2. ★ Exclusive | Your Profile. Your Control.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Edit your profile directly from your portal, whenever you
                  want.
                </li>
                <li>Keep your profile fresh with your latest work.</li>
                <li>Stay in complete control - your profile, your identity.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Your identity should always be in your hands.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                3. Get Found for Work Across India | Let Your Name Travel.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Be discovered by producers, directors, and artists looking for
                  your skills.
                </li>
                <li>
                  Message directly. Deal directly. No agents. No commission.
                </li>
                <li>
                  Collaborate with artists across India - paid or creative, you
                  decide.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Your talent never needed a shortcut. It just needed the right
                door.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
               4. KPI | See Your Growth. Know Your Progress.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  KPI System - Track your performance, measure your growth, and
                  understand where you stand all directly from your portal.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                You deserve to see how far your talent is taking you.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                5. Competitions | Your Chance to Be Seen.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Take your smaller steps towards to get known to this Family.
                </li>
                <li>Members get 50% off every event, always.</li>
                <li>Win and earn directly through your portal</li>
                <h4>
                  Talent lives in every corner of India. Your location shouldn't
                  decide your opportunity.
                </h4>
              </ul>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
               6. EPK Artist Profile | Your Whole Identity, All in One Place.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Your Work - Songs, projects, credits, and everything you've
                  created.
                </li>
                <li>
                  Your Story - Where you come from, why you make music, and what
                  drives you.
                </li>
                <li>
                  Your Socials - Instagram, YouTube, and more, all in one place.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Share one link and let people discover who you are and what you
                create. Your story deserves a place of its own.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                7. Direct Connect | Let Opportunities Find You.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>Connect directly with industry professionals.</li>
                <li>
                  No agents or middlemen standing between you and the
                  opportunity.
                </li>
                <li>Discuss, collaborate, and build connections directly.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Your talent shouldn't have to pass through someone else to reach
                the right opportunity.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
               8. 0% Commission | What You Earn Is Yours.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Keep 100% of what you earn. No one takes a cut from your deal.
                </li>
                <li>Set your own rate and terms.</li>
                <li>
                  Paid, free, or revenue share - you decide what works for you.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Your work. Your deal. Your choice.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
              9. Events | Opportunities without Borders.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Virtual events - from a village in Bihar to a home in
                  Bangalore, everyone gets a fair chance.
                </li>
                <li>
                  Save on travel, hotels &amp; food - no expensive trips
                  required.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                "I can't afford to travel" should never stand between you and
                your dream.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                10. One-Time Membership | Join Once. Stay Forever.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>Become the Member of the Family.</li>
                <li>No subscriptions. No auto-renewals. No recurring fees.</li>
                <li>Once you join, you're family - and you stay forever.</li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Because family doesn't charge you every month just to belong.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                11. Income &amp; Withdrawal | What You Earn, You Keep.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>See every event earning inside your portal.</li>
                <li>Withdraw anytime, even ₹1 - no minimum limit.</li>
                <li>
                  Income Section will remain locked until you receive any
                  Earning or Reward.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                When your work earns, you should have control of what you earn.
              </p>

              <div className="container w-full h-[1px] mx-auto bg-[#666666] my-4 sm:my-5 opacity-30 relative"></div>

              <h2 className="mt-4 sm:mt-8 text-base sm:text-2xl font-semibold">
                12. Support | You're Never Alone.
              </h2>
              <ul className="list-disc px-4 sm:px-5 mt-3 text-gray-400 space-y-2 text-xs sm:text-sm">
                <li>
                  Ticket, Call or Chat Whenever you feel stuck, reach out. We're
                  here to listen, guide, and help.
                </li>
                <li>
                  Whether it's a question, a problem, or simply something you
                  don't understand - you'll always have someone to turn to.
                </li>
              </ul>
              <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                Every artist needs someone in their corner. We're here to be
                yours.
              </p>
            </div>
          </div>

          <div className="container w-full h-[1px] mx-auto bg-[#666666] my-5 opacity-30 relative"></div>

          <h2 className="text-center mt-8 sm:mt-12 text-xl sm:text-3xl font-bold">
            The Beginning of this Community. Starting Soon — with Only the First
            1000 Artists.
          </h2>

          <div className="hidden lg:grid lg:grid-cols-2 gap-12 mt-8">
            {/* Left Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                One Time Membership Registration –{" "}
                <span className="text-[#5DC9DE]">
                  ₹2,999 for Lifetime Access.
                </span>
              </h3>
              <h3 className="text-lg font-semibold text-white mb-4">
                Pay as You Go ₹ 799 Per{" "}
                <span className="text-[#5DC9DE]">
                  Song Registration + Marketing fees (With More Included)
                </span>
              </h3>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                One Time Membership Registration –{" "}
                <span className="text-[#5DC9DE]">
                  ₹1,499 for Lifetime Access.
                </span>
              </h3>
              <h3 className="text-lg font-semibold text-white mb-4">
                Start by Showcasing{" "}
                <span className="text-[#5DC9DE]">
                  Your Work - First 2 Songs Free.
                </span>
              </h3>
            </div>
          </div>

          <h2
            className="text-center mt-6 sm:mt-8 leading-relaxed mx-auto px-4 sm:px-0 uppercase"
            style={{
              fontSize: "clamp(18px, 5vw, 32px)",
              fontWeight: 400,
              color: "#E5E7EB",
              maxWidth: "1334px",
            }}
          >
            The Heart of the Platform
          </h2>

          <h3
            className="text-center mt-6 sm:mt-8 leading-relaxed mx-auto px-4 sm:px-0"
          >
            Search. Find. Connect. Work — No One in Between.
          </h3>

          <h2 className="mt-8 sm:mt-10 text-center text-xl sm:text-3xl font-bold">
            OPH COMMUNITY
          </h2>
          <p className="text-gray-400 text-center mt-2 sm:mt-5 text-xs sm:text-lg">
            Find the right people. Talk directly. Turn connections into
            opportunities.
          </p>

          <div className="w-full flex justify-center">
            <button
              className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full text-black mt-5 bg-[#5DC9DE] font-bold w-full sm:w-auto"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
