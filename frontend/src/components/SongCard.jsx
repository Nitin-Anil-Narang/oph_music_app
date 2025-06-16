import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import axiosApi from "../conf/axios";
import formatDateAndAdjustMonth from "../utils/date";

const SongCard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);

  useEffect(() => {
    axiosApi
      .get("/content/upcoming-release-details", {
        headers: {
          Authorization: `Bearer ${parsedData.token}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
        } else {
          // setError("No data found");
        }
      })
      .catch((err) => {
        // setError("Something went wrong!");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>{error}</div>;

  const releaseDate = data.content.release_date;
  const title = data.content.name;
  const thumbnailUrl = "/assets/images/song-thumbnail-placeholder.png"; // or from API if available
  const thumbnailAlt = `${title} Thumbnail`;

  const daysUntilRelease = differenceInDays(
    new Date(releaseDate).setHours(0, 0, 0, 0), // Normalize releaseDate to midnight
    new Date().setHours(0, 0, 0, 0) // Normalize current date to midnight
  );
  
  const isReleaseTomorrow = daysUntilRelease === 1;
  const bannerMessage = isReleaseTomorrow
    ? "Your Song Is Gonna Release Tomorrow"
    : `Your Song Is Gonna Release In ${daysUntilRelease} Days`;

  return (
    <div
      onClick={() => navigate("/dashboard/song-details")}
      style={{
        backgroundImage: "url('/assets/images/songUploadCardBg.png')",
      }}
      className="p-10 mt-8 rounded-lg hover:cursor-pointer flex flex-col md:flex-row md:justify-between md:items-center gap-6"
    >
      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-xl font-bold uppercase tracking-wide text-[#5DC9DE]">
            {bannerMessage}
          </h2>
          <h2 className="text-white text-2xl md:text-xl font-extrabold mt-1">
            {title}
          </h2>
        </div>

        <div className="space-y-2 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Release Date:</span>
            <span className="font-medium text-white">
              {new Date(releaseDate).toLocaleDateString('en-GB')} {/* Format as dd/MM/yyyy */}
            </span>
          </div>
        </div>

        <button className="bg-[#5DC9DE] text-black rounded-full shadow-[inset_0_-25px_18px_-14px_rgba(93,201,222,0.2),0_1px_2px_rgba(93,201,222,0.15),0_2px_4px_rgba(93,201,222,0.15),0_4px_8px_rgba(93,201,222,0.15),0_8px_16px_rgba(93,201,222,0.15),0_16px_32px_rgba(93,201,222,0.15)]
cursor-pointer inline-block font-sans px-8 py-2 text-center text-base
transition-all duration-250 border-0 select-none hover:shadow-[inset_0_-25px_18px_-14px_rgba(93,201,222,0.35),0_1px_2px_rgba(93,201,222,0.25),0_2px_4px_rgba(93,201,222,0.25),0_4px_8px_rgba(93,201,222,0.25),0_8px_16px_rgba(93,201,222,0.25),0_16px_32px_rgba(93,201,222,0.25)]">
          Get Details
        </button>
      </div>

      {/* <div className="w-48 h-48 rounded-lg overflow-hidden">
        <img
          src={thumbnailUrl}
          // alt={thumbnailAlt}
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
};

export default SongCard;
