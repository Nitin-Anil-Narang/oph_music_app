import React, { useEffect, useState, useRef, useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axiosApi from "../../../../../conf/axios";
import PlayButton from "../../../../../../public/assets/images/play_button.png";
import { Image, Shimmer } from "react-shimmer";
import { Link } from "react-router-dom";
import { buildResourcePath } from "../../../../../utils/resourceSlug";
import toast from "react-hot-toast";
import CustomVideoPlayer from "../../../../../components/CustomVideoPlayer/CustomVideoPlayer";

function SuccessSlider({ searchText, title }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [allSuccess, setAllSuccess] = useState([]);

  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await axiosApi.get("/allStories");
        const sortedData = (response.data.data || []).sort(
          (a, b) => b.views - a.views,
        );
        setAllSuccess(sortedData);
      } catch (err) {
        console.error("Error fetching success stories:", err);
        toast.error("Failed to load success stories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuccessStories();
  }, []);

  const filteredSuccess = useMemo(() => {
    if (searchText) {
      return allSuccess.filter((story) => {
        const searchLower = searchText.toLowerCase();
        return (
          story.title.toLowerCase().includes(searchLower) ||
          story.artist_name?.toLowerCase().includes(searchLower) ||
          story.credit_name?.toLowerCase().includes(searchLower) ||
          (story.keywords && story.keywords.toLowerCase().split(',').some(keyword => 
            keyword.trim().includes(searchLower)
          ))
        );
      });
    }
    return allSuccess;
  }, [searchText, allSuccess]);

  const openModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setIsModalOpen(true);
    setIsPlaying(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo("");
    setIsPlaying(false);
  };

  const modalVideoRef = useRef(null);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleMouseUp = (videoUrl) => {
    if (!isDragging) {
      openModal(videoUrl);
    }
  };

  const stopAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    setPlayingIndex(null);
  };

  const settings = {
    infinite: filteredSuccess.length >= 3,
    speed: 500,
    slidesToShow: filteredSuccess.length >= 3 ? 3 : filteredSuccess.length,
    slidesToScroll: 1,
    autoplay: !isModalOpen,
    autoplaySpeed: 3000,
    dots: false,
    arrows: false,
    centerMode: filteredSuccess.length >= 3,
    centerPadding: filteredSuccess.length >= 3 ? "15%" : "0",
    beforeChange: () => setIsDragging(true),
    afterChange: () => {
      setIsDragging(false);
      stopAllVideos();
    },
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow:
            filteredSuccess.length >= 3 ? 3 : filteredSuccess.length,
          centerPadding: filteredSuccess.length >= 3 ? "12%" : "0",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow:
            filteredSuccess.length >= 2 ? 2 : filteredSuccess.length,
          centerPadding: filteredSuccess.length >= 2 ? "6%" : "0",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "20%",
          infinite: filteredSuccess.length >= 2,
          centerMode: filteredSuccess.length >= 2,
        },
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (filteredSuccess.length === 0) {
    return (
      <div className="bg-black text-white py-12 text-center">
        <div className="container mx-auto px-4 lg:px-16">
          <h2 className="text-xl lg:text-5xl font-bold uppercase mt-4">
            No Success Stories Found
          </h2>
          {searchText && (
            <p className="text-gray-400 mt-4 text-lg">
              No content found matching "{searchText}".
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="stories-section" className="bg-black text-white py-[16px] lg:py-12">
      <div className="container mx-auto mb-[16px] lg:mb-16 px-4 lg:px-16">
        {title ? (
          <h2 className="text-[#5DC9DE] text-3xl md:text-4xl font-bold uppercase drop-shadow-[0_0_20px_white] text-center">
            {title}
          </h2>
        ) : (
          <h1 className="text-2xl md:text-5xl font-bold text-center mb-10 leading-tight uppercase mt-4">
            Success Stories
          </h1>
        )}
      </div>

      <div className="success-slider w-full px-4 lg:px-16">
        {filteredSuccess.length <= 2 ? (
          <div className="flex justify-center flex-wrap gap-6 md:gap-8 lg:gap-10">
            {filteredSuccess.map((success, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <div
                  className="relative overflow-hidden rounded-2xl cursor-pointer shadow-lg transform transition-transform duration-300 hover:scale-105"
                  style={{ aspectRatio: "3/4.5" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => handleMouseUp(success.video_url)}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src={success.thumbnail_url}
                      fallback={<Shimmer width={400} height={500} />}
                      alt={success.title}
                      NativeImgProps={{
                        className: "w-full h-full object-cover",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                    <img
                      src={PlayButton}
                      alt="Play"
                      className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <Link
                    to={buildResourcePath("story", success.id, success.title)}
                    className="block text-xl md:text-2xl font-semibold mb-2 hover:text-[#5DC9DE] hover:cursor-pointer"
                  >
                    {success.title}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings}>
            {filteredSuccess.map((success, index) => (
              <div key={index} className="px-3 lg:px-6">
                <div
                  className="relative overflow-hidden rounded-2xl cursor-pointer shadow-lg transform transition-transform duration-300 hover:scale-105"
                  style={{ aspectRatio: "3/4.5" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => handleMouseUp(success.video_url)}
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden">
                    <Image
                      src={success.thumbnail_url}
                      fallback={<Shimmer width={400} height={500} />}
                      alt={success.title}
                      NativeImgProps={{
                        className: "w-full h-full object-cover",
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                    <img
                      src={PlayButton}
                      alt="Play"
                      className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
                    />
                  </div>
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <Link
                    to={buildResourcePath("story", success.id, success.title)}
                    className="block text-xl md:text-2xl font-semibold mb-2 hover:text-[#5DC9DE] hover:cursor-pointer"
                  >
                    {success.title}
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        )}

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <div
              className="relative bg-black rounded-lg shadow-2xl w-full max-w-[360px] aspect-[9/16] mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-[40px] font-bold z-50 hover:opacity-80"
              >
                &times;
              </button>
              <div className="relative w-full h-full">
                <CustomVideoPlayer
                  ref={modalVideoRef}
                  id="video-player-success"
                  src={selectedVideo}
                  className="rounded-lg w-full h-full object-contain"
                  autoPlay
                  orientation="portrait"
                  pauseOtherVideos={true}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessSlider;
