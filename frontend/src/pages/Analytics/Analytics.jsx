import { ChevronDown } from "lucide-react";
import Chart from "../../components/Chart/Chart";
import React,{ useEffect, useState } from "react";
import axiosApi from "../../conf/axios";
import { useArtist } from "../auth/API/ArtistContext";

export default function AnalyticsDashboard() {
  const { artist, headers } = useArtist();
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState(null);
  const [totalViews, setTotalViews] = useState(0);
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({
    viewsData: [],
    engagementData: [],
    durationData: [],
    incomeData: [],
  });
  const [revenue, setRevenue] = useState({
    usd: 0,
    inr: 0,
  });
  const [durationOptions] = useState([
    { label: "Last 7 Day", value: 7 },
    { label: "Last 10 Days", value: 10 },
    { label: "Last 15 Days", value: 15 },
    { label: "Last 30 Days", value: 30 },
  ]);
  const [selectedDuration, setSelectedDuration] = useState(7);

  // Update the initial useEffect to handle both content and analytics loading
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch contents
        console.log("Artist ID:", artist);
        const contentsResponse = await axiosApi.get(
          `/content/search?artist_id=${artist.id}&lastNDays=${selectedDuration}`,
          headers
        );
        const fetchedContents = contentsResponse.data.data;
        setContents(fetchedContents);

        if (fetchedContents.length > 0) {
          const firstContent = fetchedContents[0];
          setSelectedContent(firstContent);

          // Fetch streams for the first content
          const streamsResponse = await axiosApi.get(
            `/analytics/content/${firstContent.id}/streams?lastNDays=${selectedDuration}`,
            headers
          );
          console.log("Streams Response:", streamsResponse.data.data);
          
          setStreams(streamsResponse.data.data);

          if (streamsResponse.data.data.length > 0) {
            // Fetch analytics for the first stream
            await handleStreamChange(
              streamsResponse.data.data[0].content_stream_id
            );
          }
        }
      } catch (error) {
        setError("Failed to fetch Analytics. Try again later.");
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [selectedDuration]); // Add selectedDuration as dependency

  // Fetch streams when content changes
  const handleContentChange = async (contentId) => {
    try {
      // First fetch the streams
      const response = await axiosApi.get(
        `/analytics/content/${contentId}/streams?lastNDays=${selectedDuration}`,
        headers
      );

      // Then fetch the contents if not already available
      if (contents.length === 0) {
        const contentsResponse = await axiosApi.get(
          `/content/search?artist_id=${artist.artist.id}&lastNDays=${selectedDuration}`,
          headers
        );
        setContents(contentsResponse.data.data);
      }

      setStreams(response.data.data);
      if (response.data.data.length > 0) {
        handleStreamChange(response.data.data[0].content_stream_id);
      }
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  // Fetch analytics when stream changes
  const handleStreamChange = async (contentStreamId) => {
    try {
      const response = await axiosApi.get(
        `/analytics/content-stream/${contentStreamId}?lastNDays=${selectedDuration}`,
        headers
      );
      const data = response.data.data;

      // Transform API data to match chart format
      const viewsData =
        data.streams?.map((item) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.value,
        })) || [];

      const engagementData =
        data.likes?.map((item) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.value,
        })) || [];

      const durationData =
        data.avg_view_duration?.map((item) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.value,
        })) || [];

      const incomeData =
        data.income?.map((item) => ({
          name: new Date(item.date).toLocaleDateString(),
          value: item.value,
        })) || [];

      // Calculate total income
      const totalViews = viewsData.reduce((sum, item) => sum + item.value, 0);
      const totalEngagement = engagementData.reduce(
        (sum, item) => sum + item.value,
        0
      );
      const avgDuration =
        durationData.reduce((sum, item) => sum + item.value, 0) /
        (durationData.length || 1);
      const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);
      setTotalViews(totalViews);
      setTotalEngagement(totalEngagement);
      setAvgDuration(avgDuration);
      setTotalIncome(totalIncome);
      // Update revenue calculation
      const usdIncome = totalIncome / 85; // Assuming 1 USD = 85 INR
      setRevenue({
        usd: usdIncome,
        inr: totalIncome,
      });

      setAnalyticsData({
        viewsData,
        engagementData,
        durationData,
        incomeData,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-2 text-cyan-400">Loading Analytics...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-4 text-red-400">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500/20 rounded hover:bg-red-500/30"
          >
            Try Again
          </button>
        </div>
      )}
      {!isLoading && !error && (
        <div className="min-h-[calc(100vh-70px)] px-8 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-cyan-400 text-xl font-extrabold mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">ANALYTICS</h1>
                           <div className="relative">
                <button
                  className="flex items-center px-4 py-2 w-[150px] bg-white/10 border border-white/30 border-cyan-200 rounded-full text-sm text-white-400 appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 shadow-lg shadow-white/20"
                  onClick={(e) => {
                    e.preventDefault();
                    const selectElement = e.currentTarget.querySelector('select');
                    if (selectElement) {
                      selectElement.focus();
                      selectElement.click();
                    }
                  }}
                >
                  <select
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full"
                    value={selectedDuration}
                    onChange={(e) => {
                      setSelectedDuration(Number(e.target.value));
                      if (streams.length > 0) {
                        handleStreamChange(streams[0].content_stream_id);
                      }
                    }}
                  >
                    {durationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white-400 pointer-events-none" />
                </button>
              </div>
            </div>

            {/* Song Selection and Platform */}
                                <div className="flex gap-4">
                          <div className="flex-1 relative">
                            <select
                              className="w-full appearance-none bg-gray-800/50 border border-gray-700 rounded-lg p-3 pr-10 text-gray-200 focus:outline-none focus:border-cyan-400 truncate"
                              value={selectedContent?.id || ""}
                              onChange={async (e) => {
                                const contentId = e.target.value;
                                console.log("Selected Content ID:", contentId);
                                console.log("Contents Array:", contents);
                        
                                // Find the selected content in the current contents array
                                const selected = contents.find(
                                  (content) => content.id == contentId
                                );
                                console.log("Selected Content:", selected);
                        
                                if (!selected) {
                                  console.error(
                                    "Selected content not found in contents array"
                                  );
                                  return;
                                }
                        
                                // Update the selected content immediately
                                setSelectedContent(selected);
                        
                                // Then fetch the streams and analytics
                                try {
                                  const streamsResponse = await axiosApi.get(
                                    `/analytics/content/${contentId}/streams?lastNDays=${selectedDuration}`,
                                    headers
                                  );
                                  setStreams(streamsResponse.data.data);
                                  if (streamsResponse.data.data.length > 0) {
                                    await handleStreamChange(
                                      streamsResponse.data.data[0].content_stream_id
                                    );
                                  }
                                } catch (error) {
                                  console.error("Error fetching streams:", error);
                                }
                              }}
                            >
                              {contents.map((content) => (
                                <option key={content.id} value={content.id}>
                                  {content.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 pointer-events-none" />
                          </div>
                          <div className="relative">
                            <select
                              className="w-full appearance-none bg-cyan-400 border border-gray-700 rounded-lg p-3 pr-10 text-black font-bold focus:outline-none focus:border-cyan-400 truncate"
                              onChange={(e) => handleStreamChange(e.target.value)}
                            >
                              {streams.map((stream) => (
                                <option
                                  key={stream.content_stream_id}
                                  value={stream.content_stream_id}
                                >
                                  {stream.stream_name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
                          </div>
                        </div>

            {/* Video Preview */}
            <div className="overflow-hidden flex items-stretch justify-start">
              <div className="relative">
                <img
                  src={
                    selectedContent?.thumbnails ? selectedContent?.thumbnails[0] :
                    "/assets/images/ytVideoBg.png"
                  }
                  alt="Video thumbnail"
                  className="w-[400px] h-[200px] object-cover rounded-lg"
                />
              </div>
              <div className="px-4 py-1">
                <h3 className="text-lg font-semibold">
                  {selectedContent?.name || "No content selected"}
                </h3>
                <p className="text-sm text-cyan-400">
                  {totalViews >= 1000000
                    ? `${(totalViews / 1000000).toFixed(2)}M`
                    : totalViews >= 1000
                    ? `${Math.round(totalViews / 1000)}T`
                    : totalViews}{" "}
                  Views
                </p>
                <p className="text-gray-400 text-sm">
                  {selectedContent?.bio || "No description available"}
                </p>
              </div>
            </div>

            {/* Revenue Section */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400">Generated Revenue:</p>
                  <p className="text-xl font-bold text-cyan-400">
                    ${revenue.usd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-center">
                  <p className="text-xl font-bold text-cyan-400">
                    INR {revenue.inr.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <Chart
                type="line"
                data={analyticsData.viewsData}
                title="Views"
                subtitle="Count"
                metric={
                  totalViews >= 1000000
                    ? `${(totalViews / 1000000).toFixed(2)}M`
                    : totalViews >= 1000
                    ? `${totalViews / 1000}K`
                    : totalViews
                }
                colors={["#22d3ee"]}
              />

              <Chart
                type="bar"
                data={analyticsData.engagementData}
                title="Engagement"
                subtitle="Count"
                metric={
                  totalEngagement >= 1000000
                    ? `${(totalEngagement / 1000000).toFixed(2)}M`
                    : totalEngagement >= 1000
                    ? `${totalEngagement / 1000}K`
                    : totalEngagement
                }
                colors={["#a855f7"]}
              />

              <Chart
                type="area"
                data={analyticsData.durationData}
                title="Average View Durations"
                subtitle="In Seconds"
                metric={`${avgDuration.toFixed(0)} Seconds`}
                colors={["#22c55e"]}
              />

              <Chart
                type="area"
                data={analyticsData.incomeData}
                title="Income"
                subtitle="In Rupees"
                metric={`₹${totalIncome.toLocaleString()}`}
                colors={["#22c55e"]}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
