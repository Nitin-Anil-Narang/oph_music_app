import HeroSection from "./components/HeroSection/HeroSection";
import EventsNewReleases from "./components/EventsNewReleases/EventsNewReleases";
import ArtistRankingSection from "./components/ArtistRankingSection/ArtistRankingSection";
import React,{ useEffect, useState } from "react";
import axiosApi from "../../conf/axios";
import getToken from "../../utils/getToken";

function Home() {
  const artistsdata = {

  };
  const [isLoading,setIsLoading] = useState(true);
  const [firstEvent,setFirstEvent] = useState(null);
  const [secondEvent,setSecondEvent] = useState(false);
  const [error,setError] = useState(null);
  const fetchFirstEvent = async()=>{
    const token = getToken();
    setIsLoading(true);
    try{
      const response = await axiosApi.get('/events/artist-events',{
        headers:{
            Authorization: `Bearer ${token}`
            }
    });
      if(response.status == 200){
       setFirstEvent(response.data.upcoming_events[0]);
       setSecondEvent(response.data.upcoming_events[1]);
      }
    }
    catch(err){
      console.log(err);
      setError("Failed to Load Data. Try Again Later")
    }
    finally{
      setIsLoading(false)
    }
 }

 useEffect(()=>{
  fetchFirstEvent();
 },[])

  return (
    <div>
      {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-2 text-cyan-400">Loading  data...</p>
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
      {
        !isLoading && !error &&  (
          <>
           <HeroSection firstEvent={firstEvent} />
      <EventsNewReleases secondEvent={secondEvent} />
      <ArtistRankingSection data={artistsdata} selectedMonth={"January"} />
          </>)
      }
    </div>
  );
}

export default Home;
