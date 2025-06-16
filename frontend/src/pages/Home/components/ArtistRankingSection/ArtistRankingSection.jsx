import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SongCard from "../../../../components/SongCard";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ArtistRankingSection = ({ data, selectedMonth }) => {
  const leaderboard = useSelector((state) => state.newRelease.leaderboard);
  console.log(leaderboard);

  const [currentMonth, setCurrentMonth] = useState("");

  function getCurrentMonth() {
    const date = new Date();
    const options = { month: "long" }; // 'long' for full month name, e.g., "January"
    const month = date.toLocaleString("en-US", options);
    setCurrentMonth(month);
  }
  useEffect(() => {
    getCurrentMonth();
  }, []);

  const handleProfileClick = (artistId) => {
    // Add your view profile logic here
    console.log(`Viewing profile for artist with id: ${artistId}`);
    window.open(
      `${import.meta.env.VITE_WEBSITE_URL}artists/${artistId}`,
      "_blank"
    );
  };

  return (
    <div className="text-white px-8 p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
          LEADERBOARD
        </h2>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
          {currentMonth}
        </h2>
      </div>

      {/* Header */}
      <div className="flex items-center text-gray-300 text-sm uppercase mb-4 px-4 border-b border-gray-700">
        <div className="flex-1">#</div>
        <div className="flex-1">Artist</div>
        <div className="flex-1">Stage Name</div>
        <div className="flex-1 hidden sm:block">Location</div>
        <div className="flex-1 text-center">Songs</div>
        <div className="flex-1 text-center">Reach</div>
        <div className="flex-1 hidden sm:block text-center">Profile</div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {leaderboard.length > 0 ? (
          leaderboard.map((artist, index) => (
            <div
              key={artist.id}
              className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-900/30 transition-colors"
              onClick={() => handleProfileClick(artist.artist_id)} // Make the row clickable
            >
              <div className="flex-1">
                {artist.rank === 1 ? (
                  <span className="bg-[#ECAB43] text-black font-bold px-2 py-1">
                    {artist.rank < 10 ? "0" + artist.rank : artist.rank}
                  </span>
                ) : artist.rank === 2 ? (
                  <span className="bg-[#2DDA89] text-black font-bold px-2 py-1">
                    {artist.rank < 10 ? "0" + artist.rank : artist.rank}
                  </span>
                ) : artist.rank === 3 ? (
                  <span className="bg-[#5DC9DE] text-black font-bold px-2 py-1">
                    {artist.rank < 10 ? "0" + artist.rank : artist.rank}
                  </span>
                ) : (
                  <span className="text-base px-2 py-1 font-bold">
                    {artist.rank < 10 ? "0" + artist.rank : artist.rank}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={artist.profile_img_url}
                    alt={artist.stage_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 text-gray-300 truncate">
                {artist.stage_name}
              </div>
              <div className="flex-1 text-gray-300 hidden sm:block">
                {artist.location}
              </div>
              <div className="flex-1 text-center text-gray-300">
                {artist.total_songs}
              </div>
              <div className="flex-1 text-center text-gray-300">
                {artist.total_reach}
              </div>
              {/* Hidden on small screens */}
              <div className="flex-1 items-center justify-center sm:flex hidden">
                <button
                  className="px-4 py-2 text-sm text-white rounded-full bg-[#6F4FA0] hover:text-black transition-colors"
                  onClick={() => handleProfileClick(artist.artist_id)}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">
            No data available for this month.
          </p>
        )}
      </div>
      {/* <SongCard
        title="New Event"
        thumbnailUrl="https://placehold.co/400"
        releaseDate="2024-01-01"
      /> */}
    </div>
  );
};

export default ArtistRankingSection;
