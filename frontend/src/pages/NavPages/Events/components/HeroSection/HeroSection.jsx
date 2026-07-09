import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosApi from "../../../../../conf/axios";
import {
  isRegistrationOpenByDateTime,
  isRegistrationNotStartedYetByDateTime,
} from "../../../../../utils/date";

const instagramUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]{0,29})$/;
const instagramUrlRegex =
  /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+\/?(?:\?[^#\s]*)?$/;

export default function HeroSection({ professions = [] }) {
  const navigate = useNavigate();
  const location = useLocation();

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingEventId, setBookingEventId] = useState(null);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState([]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false,
    autoplay: !isModalOpen,
    autoplaySpeed: 2500,
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
  };

  useEffect(() => {
    let cancelled = false;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axiosApi.get("/events_status");
        const raw = Array.isArray(res.data.data)
          ? res.data.data
          : (res.data?.events ?? []);
        const mapped = raw
          .filter((e) => e?.event_type === "upcoming")
          .map((e) => ({
            id: e.event_id,
            name: e.EventName,
            event_date_time: e.dateTime,
            location: (e.location || "").trim(),
            description: e.description,
            hashtags: e.hashtags,
            fees: Number(e.registrationFee_normal) || 0,
            registrationFee_offer_availableFor:
              e.registrationFee_offer_availableFor,
            registrationFee_offer_discount: e.registrationFee_offer_discount,
            registrationStart: e.registrationStart,
            registrationEnd: e.registrationEnd,
            reward_amount:
              Number(String(e.winnerReward).replace(/,/g, "")) || 0,
            thumbnail_url: e.image || e.thumbnail_url || "",
            raw: e,
          }));

        if (!cancelled) setUpcomingEvents(mapped);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch upcoming events:", err);
          toast.error("Unable to load upcoming events", {
            position: "top-right",
            theme: "dark",
            transition: Bounce,
          });
          setUpcomingEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!upcomingEvents || upcomingEvents.length === 0) {
      setTimers([]);
      return;
    }

    const updateTimers = () => {
      const now = new Date();
      const newTimers = upcomingEvents.map((event) => {
        const eventDate = new Date(event.event_date_time);
        const diff = eventDate - now;
        if (isNaN(eventDate) || diff <= 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return { days, hours, minutes, seconds };
      });
      setTimers(newTimers);
    };

    if (!isModalOpen) {
      updateTimers();
      const id = setInterval(updateTimers, 1000);
      return () => clearInterval(id);
    }
  }, [upcomingEvents, isModalOpen]);

  const handleBookSpot = (event, eventId) => {
    if (!isRegistrationOpenByDateTime(event)) {
      if (isRegistrationNotStartedYetByDateTime(event)) {
        toast.info("Registration has not started yet for this event.", {
          position: "top-right",
          theme: "dark",
          transition: Bounce,
        });
      } else {
        toast.info("Registration has closed for this event.", {
          position: "top-right",
          theme: "dark",
          transition: Bounce,
        });
      }
      return;
    }
    setBookingEventId(eventId);
    setIsModalOpen(true);
  };

  const dateFormat = (dateIso) => {
    const dt = new Date(dateIso);
    if (isNaN(dt)) return "";
    return dt.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  const RegistrationModal = () => {
    const [form, setForm] = useState({
      first_name: "",
      last_name: "",
      email: "",
      instagram_handle: "",
      phone: "",
      profession_id: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onChange = (e) =>
      setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (ev) => {
      ev.preventDefault();
      if (isSubmitting) return;

      const isValidInstagram =
        instagramUsernameRegex.test(form.instagram_handle?.trim()) ||
        instagramUrlRegex.test(form.instagram_handle?.trim());
      if (!isValidInstagram) {
        toast.error(
          "Invalid Instagram! Please enter a valid Instagram username or profile link.",
          {
            position: "top-right",
            autoClose: 4000,
            theme: "dark",
            transition: Bounce,
          },
        );
        return;
      }
      if (!isValidEmail(form.email)) {
        toast.error("Invalid Email!", { position: "top-right", theme: "dark" });
        return;
      }
      if (!isValidPhoneNumber(form.phone)) {
        toast.error("Invalid Phone! Must be 10 digits.", {
          position: "top-right",
          theme: "dark",
        });
        return;
      }

      const current = upcomingEvents.find((e) => e.id === bookingEventId) || {};
      if (!isRegistrationOpenByDateTime(current)) {
        toast.error(
          isRegistrationNotStartedYetByDateTime(current)
            ? "Registration has not started yet for this event."
            : "Registration has closed for this event.",
          { position: "top-right", theme: "dark", transition: Bounce },
        );
        return;
      }

      setIsSubmitting(true);
      try {
        toast.success("Redirecting to payment...", {
          position: "top-right",
          theme: "dark",
          transition: Bounce,
        });
        setIsModalOpen(false);

        navigate("/auth/payment", {
          state: {
            OPH_ID: `${form.first_name} ${form.last_name}`.trim(),
            event_id: current.id,
            returnPath: "/events/online-music-events",
            heading: "Complete Event Registration",
            from: "Event Registration",
            outside_user: true,
            booking_details: {
              first_name: form.first_name,
              last_name: form.last_name,
              email: form.email,
              phone: form.phone,
              instagram_handle: form.instagram_handle,
              profession_id: form.profession_id,
            },
          },
        });
      } catch (err) {
        console.error("Navigation error:", err);
        toast.error("Failed to redirect to payment", {
          position: "top-right",
          theme: "dark",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="relative bg-gray-800 rounded-lg w-[90%] sm:w-full sm:max-w-md max-h-[85vh] overflow-y-auto mx-auto">
          <form onSubmit={onSubmit} className="space-y-3 p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm sm:text-lg font-semibold">
                Register for Event
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="first_name"
                value={form.first_name}
                onChange={onChange}
                required
                placeholder="First name*"
                className="w-full px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600"
              />
              <input
                name="last_name"
                value={form.last_name}
                onChange={onChange}
                required
                placeholder="Last name*"
                className="w-full px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600"
              />
            </div>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              required
              type="email"
              placeholder="Email*"
              className="w-full px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600"
            />
            <input
              name="instagram_handle"
              value={form.instagram_handle}
              onChange={onChange}
              required
              placeholder="username or https://instagram.com/username"
              className="w-full px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600"
            />
            <div className="flex gap-2">
              <select className="w-16 px-2 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600 appearance-none text-center">
                <option>+91</option>
              </select>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                required
                placeholder="Phone*"
                className="flex-1 px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600"
              />
            </div>
            <div className="relative w-full">
              <select
                name="profession_id"
                value={form.profession_id}
                onChange={onChange}
                required
                className="w-full px-3 py-2 text-sm rounded-md bg-[#2d3748] text-white border border-gray-600 appearance-none pr-8"
              >
                <option value="">Select Profession</option>
                {professions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <button
              disabled={isSubmitting}
              className="w-full bg-[#5DC9DE] text-black py-2 text-sm rounded-md font-medium"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="text-center h-[60vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full w-12 h-12 border-b-2 border-[#5DC9DE] mb-4" />
          <div className="text-[#5DC9DE]">Loading upcoming events...</div>
        </div>
      )}

      {!loading && upcomingEvents.length === 0 && (
        <div className="text-center pt-[130px] pb-[65px]  lg:py-20">
          <p className="text-gray-400">No upcoming events right now.</p>
        </div>
      )}

      {!loading && upcomingEvents.length > 0 && (
        <div className="relative w-full overflow-hidden bg-black">
          <button
            className="absolute top-1/2 left-4 z-50 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full hidden sm:block"
            onClick={() => sliderRef.current && sliderRef.current.slickPrev()}
            aria-label="Previous"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            className="absolute top-1/2 right-4 z-50 transform -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full hidden sm:block"
            onClick={() => sliderRef.current && sliderRef.current.slickNext()}
            aria-label="Next"
          >
            <ArrowRight size={20} />
          </button>

          <Slider ref={sliderRef} {...settings}>
            {upcomingEvents.map((event, idx) => (
              <div key={event.id ?? idx} className="relative min-h-[60dvh] md:h-screen w-full">
                <img
                  src={event.thumbnail_url}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/95" />

                <div
                  className="absolute inset-0 flex sm:items-end items-center sm:pb-24 pb-10 pt-[150px] cursor-pointer"
                  onClick={() => {
                    if (!isDragging) navigate(`/events/${event.id}`);
                  }}
                >
                  <div className="container mx-auto px-4 xl:px-16 w-full flex flex-col lg:flex-row justify-between items-center">
                    {/* Left: date, title, countdown */}
                    <div className="flex flex-col">
                      <div className="text-xs sm:text-sm font-semibold text-[#5DC9DE] mb-1 tracking-wide lg:text-lg lg:mb-2">
                        {dateFormat(event.event_date_time)} – {event.location}
                      </div>

                      <h1
                        className="uppercase font-black text-2xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-tight"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDragging) navigate(`/events/${event.id}`);
                        }}
                      >
                        {event.name}
                      </h1>

                      {timers[idx] && (
                        <div className="flex gap-2 mt-4">
                          <CountdownBox value={timers[idx].days} label="Days" />
                          <CountdownBox
                            value={timers[idx].hours}
                            label="Hours"
                          />
                          <CountdownBox
                            value={timers[idx].minutes}
                            label="Minute"
                          />
                          <CountdownBox
                            value={timers[idx].seconds}
                            label="Second"
                          />
                        </div>
                      )}

                      {/* Mobile-only: Chance to Win badge + Book button */}
                      <div className="lg:hidden mt-4 w-full flex items-center justify-center bg-gradient-to-r from-gray-900/90 to-[#0C0D27]/90 border border-white/10 rounded-xl py-3 px-4 shadow-xl backdrop-blur-md">
                        <span className="text-xs sm:text-sm tracking-widest font-bold uppercase text-white mr-2">
                          CHANCE TO WIN
                        </span>
                        <span className="text-[#2DDA89] text-base sm:text-lg font-black tracking-wide">
                          ₹{event.reward_amount ?? 0}
                        </span>
                      </div>
                      <div
                        className={`lg:hidden mt-3 w-full py-3.5 rounded-full text-sm font-extrabold tracking-wide text-center transition-all duration-300 ${
                          isRegistrationOpenByDateTime(event)
                            ? "bg-[#5DC9DE] text-black cursor-pointer hover:bg-[#4cb5c8] active:scale-[0.98] shadow-lg"
                            : "bg-gray-600 text-white cursor-not-allowed opacity-60"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookSpot(event, event.id);
                        }}
                        title={
                          isRegistrationNotStartedYetByDateTime(event)
                            ? "Registration has not started yet"
                            : !isRegistrationOpenByDateTime(event)
                              ? "Registration has closed"
                              : undefined
                        }
                      >
                        Book Your Spot Now
                      </div>
                    </div>

                    {/* Desktop-only: Chance to Win card + Book button */}
                    <div
                      className="hidden lg:flex mt-0 flex-col items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="bg-gradient-to-b from-[#FFFFFF26] to-[#FFFFFF00] w-[285px] rounded-xl py-5 px-6 backdrop-blur-[12px] text-center">
                        <span className="text-[18px] uppercase text-white block text-center">
                          Chance to Win
                        </span>
                        <span className="text-[#2DDA89] text-[40px] font-extrabold">
                          ₹{event.reward_amount ?? 0}
                        </span>
                      </div>
                      <div
                        className={`mt-4 px-6 py-2 rounded-3xl text-black text-lg font-semibold ${
                          isRegistrationOpenByDateTime(event)
                            ? "bg-[#5DC9DE] cursor-pointer hover:bg-[#4db8cc]"
                            : "bg-gray-500 cursor-not-allowed opacity-70"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookSpot(event, event.id);
                        }}
                        title={
                          isRegistrationNotStartedYetByDateTime(event)
                            ? "Registration has not started yet"
                            : !isRegistrationOpenByDateTime(event)
                              ? "Registration has closed"
                              : undefined
                        }
                      >
                        Book Your Spot Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          {isModalOpen && <RegistrationModal />}
        </div>
      )}
    </>
  );
}

function CountdownBox({ value, label }) {
  return (
    <div
      className="
        w-[80px] sm:w-[92px]
        rounded-md p-3 transition-colors
        bg-gradient-to-b from-[#3A3A3A] via-[#222222] to-[#111111]
        lg:bg-gradient-to-b lg:from-[#FFFFFF33] lg:to-[#FFFFFF00]
      "
    >
      <div className="text-white text-2xl lg:text-4xl text-center font-semibold">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[#9BA3B7] text-center text-sm lg:text-base">
        {label}
      </div>
    </div>
  );
}
