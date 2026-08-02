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
    "Direct Control Over Your Music",
    "100% Revenue Retention",
    "Creative Freedom & Ownership",
    "Build Your Own Brand",
    "Direct Fan Connection",
    "Flexible Release Schedule",
    "No Label Restrictions",
    "Full Artistic Control",
    "Independent Promotion Rights",
    "Personal Artist Portal",
    "Real-time Analytics Dashboard",
    "Direct Collaboration Network",
  ],

  "Special artist": [
    "Professional Production Support",
    "Expert Marketing Team",
    "Advanced Distribution Network",
    "Premium Branding Services",
    "Dedicated Artist Manager",
    "Priority Release Strategy",
    "Enhanced Visibility",
    "Professional Studio Access",
    "Specialized Promotion Campaigns",
    "Industry Connections",
    "Advanced Analytics & Insights",
    "Exclusive Collaboration Opportunities",
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
                SIGN UP
              </h1>
              <p className="text-gray-400 mb-6 lg:mb-8 text-xs sm:text-xs">
                OPH Community, along with all artists and fans, warmly welcomes
                you. Once you sign up, you’ll become a valued member of our
                music family.
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
                    { value: "Independent artist", label: "Independent Artist" },
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

        <div className="container w-full h-[1px] mx-auto bg-[#959494] my-5 opacity-30 relative"></div>

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
          <span className="text-[#5DC9DE]">ABOUT:</span> WHAT WE PROVIDE TO
          ARTIST
        </h1>
        <h2 className="text-left mt-3 text-xs sm:text-sm text-[#9BA3B7] leading-relaxed">
         Everything will be supported by OPH COMMUNITY Artist only need to focus on their Creative Work – Making Music
        </h2>

        <div className="pt-6 sm:pt-12 lg:pt-6">
          <h2 className="uppercase text-base sm:text-xl font-semibold">
            OPH Community Music Platform Function
          </h2>
          <h2 className="uppercase text-xs sm:text-base font-semibold mt-2 text-[#5DC9DE]">
            YOUR MUSIC, YOUR RIGHTS, YOUR STAGE
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
                Independent Artist
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
                Specialist Artist
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
              + Everything Included Mentioned below (Free of Cost by OPH
              COMMUNITY) Only for our Talented Indian Music Artist
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

            {/* Right Column - Duplicate */}
            <div>
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
          </div>

          <div className="container w-full h-[1px] mx-auto bg-[#666666] my-5 opacity-30 relative"></div>

          <p className="text-center mt-6 sm:mt-8 leading-relaxed mx-auto px-4 sm:px-0" style={{ fontSize: 'clamp(18px, 5vw, 32px)', fontWeight: 400, color: '#E5E7EB', maxWidth: '1334px' }}>
            Now – No hassle for Anything just Make your Music Peacefully – Rest live on
            India's Only Real Music Community
          </p>

          <h2 className="mt-8 sm:mt-10 text-center text-xl sm:text-3xl font-bold">
            OPH COMMUNITY
          </h2>
          <p className="text-gray-400 text-center mt-2 sm:mt-5 text-xs sm:text-lg">
            Now its time to bridge a gap between artists music and their
            audience
          </p>

          <div className="w-full flex justify-center">
            <button
              className="px-8 sm:px-10 py-2.5 sm:py-3 rounded-full text-black mt-5 bg-[#5DC9DE] font-bold w-full sm:w-auto"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Lets Start
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
