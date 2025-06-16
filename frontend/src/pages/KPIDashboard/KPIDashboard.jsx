import React,{ useEffect, useState } from 'react';
import Chart from "../../components/Chart/Chart";
import axiosApi from '../../conf/axios';
import Loading from '../../components/Loading';
import { useArtist } from '../auth/API/ArtistContext';
import { ChevronDown } from 'lucide-react';

export default function KPIDashboard() {
  const { headers } = useArtist();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artistImage, setArtistImage] = useState(null);
  const [artistRank, setArtistRank] = useState(null);
  const [duration, setDuration] = useState(7); // Default to 7 days

  const durationOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 10, label: 'Last 10 Days' },
    { value: 15, label: 'Last 15 Days' },
    { value: 30, label: 'Last 30 Days' }
  ];

  // Fetch artist rank
  const fetchArtistRank = async () => {
    try {
      const response = await axiosApi.get(
        `/leaderboard/artist-rank`,
        { headers }
      );
      // setArtistRank(response.data.data.rank===null ? 'NA' : response.data.data.rank);
    } catch (err) {
      console.error('Error fetching artist rank:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both KPI data and artist rank
        await Promise.all([
          fetchKpiData(),
          fetchArtistRank()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [duration]);

  const fetchKpiData = async () => {
    try {
      // Calculate start_date and end_date
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - duration);
  
      const formattedStartDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const formattedEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
      const response = await axiosApi.get(
        `/leaderboard/artist-history?last_n_days=${duration}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`,
        { headers }
      );
      
      const data = response.data.data.mergedData ?? [];
      if(!data.length) {
        setArtistRank(response.data.data.rank===null ? 'NA' : response.data.data.rank);
      }
      else {
      setArtistRank(data[0].rank=== null ? 'NA' : data[0].rank);
      }
      console.log("KPI Data:", data);
      setArtistImage(response.data.data.profile_img_url);
  
      // Transform data for charts
      const performanceData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
        Growth: item.metrics.views,
        Rank: item.rank || 0,
        Songs: item.metrics.content_count,
        Traffic: item.metrics.views,
        Performance: (item.metrics.views + item.metrics.engagements) / 2

      }));
  
      const trafficData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.metrics.views
      }));
  
      const songsData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.metrics.content_count
      }));
  
      const audienceData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.metrics.engagements
      }));
  
      const eventsData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.metrics.event_participation
      }));
  
      const durationData = data.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.metrics.avg_view_duration
      }));
  
      setKpiData({
        performanceData,
        trafficData,
        songsData,
        audienceData,
        eventsData,
        durationData
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-[calc(100vh-70px) px-8 py-6">
      {loading ? <Loading /> :
     <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
            KEY PERFORMANCE INDICATORS
          </h1>
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
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
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

        {/* Ranking Position */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex justify-between items-center">
          <div>
            <p className="text-white-400">Your Ranking Position</p>
            <p className="text-xl font-semibold text-cyan-200">
              {artistRank ? `${artistRank}th` : 'N/A'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-700">
            <img
              src={artistImage || "/placeholder.svg?height=40&width=40"}
              alt="Profile"
              className="w-full h-full rounded-full"
            />
          </div>
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Overall Performance */}
          <Chart
            type="bar"
            data={kpiData?.performanceData || []}
            title="Overall performance"
            subtitle="Combined metrics"
            colors={["#a855f7", "#22d3ee", "#f97316"]}
            stacked={true}
            showLegend={true}
            height={250}
            keys={[ "Songs", "Traffic", "Performance"]}
          />

          {/* Website Traffic */}
          <Chart
            type="area"
            data={kpiData?.trafficData || []}
            title="Website Artist page traffic"
            subtitle="In Millions"
            metric={`${(kpiData?.trafficData.reduce((sum, item) => sum + item.value, 0) / 1000000).toFixed(2)}M`}
            colors={["#22c55e"]}
            height={250}
          />

          {/* Two Column Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Chart
              type="line"
              data={kpiData?.songsData || []}
              title="Total Number of Songs"
              subtitle="In Numbers"
              metric={kpiData?.songsData.reduce((sum, item) => Math.max(sum, parseInt(item.value)), 0)}
              colors={["#eab308"]}
              height={200}
            />

            <Chart
              type="bar"
              data={kpiData?.audienceData || []}
              title="Total Audience Reached"
              subtitle="In Millions"
              metric={`${(kpiData?.audienceData.reduce((sum, item) => sum + item.value, 0) / 1000000).toFixed(2)}M`}
              colors={["#a855f7"]}
              height={200}
            />
          </div>

          {/* Event Participation */}
          <Chart
            type="bar"
            data={kpiData?.eventsData || []}
            title="Event Participation"
            subtitle="In Numbers"
            metric={`${kpiData?.eventsData.reduce((sum, item) => sum + item.value, 0)} Events`}
            colors={["#22d3ee"]}
            height={250}
          />

          {/* Average View Duration */}
          <Chart
            type="area"
            data={kpiData?.durationData || []}
            title="Average Views Durations"
            subtitle="In Seconds"
            metric={`${(kpiData?.durationData.reduce((sum, item) =>  (sum+ parseInt(item.value)), 0) / kpiData?.durationData.length).toFixed(0)} Seconds`}
            colors={["#22d3ee"]}
            height={250}
          />
        </div>
      </div>}
    </div>
  );
}
