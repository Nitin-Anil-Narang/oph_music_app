import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import WebsiteNavbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import MobileNavbar from "../pages/NavPages/Home/components/MobileNavbar/MobileNavbar";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSuccessStories, fetchWebsiteConfig } from "../slice/website_config";
import { fetchArtists } from "../slice/artist";
import { fetchTopPicks } from "../slice/top_pick";
import { fetchEvents } from "../slice/event";
import { fetchReels } from "../slice/content";
import { fetchHistoryLeaderboard } from "../slice/leaderboard";

const NavLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/home" || pathname === "/";

  // useEffect(() => {
  //   dispatch(fetchWebsiteConfig());
  //   dispatch(fetchArtists());
  //   dispatch(fetchTopPicks());
  //   dispatch(fetchEvents());
  //   dispatch(fetchReels());
  //   dispatch(fetchHistoryLeaderboard());
  //   dispatch(fetchSuccessStories());
  // }, [dispatch]);
  return (
    <div>
      <WebsiteNavbar />
      <main className={isHomePage ? "" : "pb-0 lg:pb-20 lg:pb-0"}>
        <Outlet />
      </main>
      {!isHomePage && <MobileNavbar />}
      <Footer className={!isHomePage ? "pb-24 lg:pb-0" : ""} />
    </div>
  );
};

export default NavLayout;
