import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useArtist } from "../API/ArtistContext";
import "../../../../src/index.css"; // Import CSS for styling
import axiosApi from "../../../conf/axios";

const MembershipForm = ({ id }) => {
  const [searchParams] = useSearchParams();
  const ophid = searchParams.get("ophid");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const { artist, headers } = useArtist();

  useEffect(() => {
    const fetchMembershipForm = async () => {
      try {
        formDataToSend.append("OPH_ID", ophid);
        const artist_id = JSON.parse(localStorage.getItem("userData")).artist.id;
        console.log("Artist ID:", JSON.parse(localStorage.getItem("userData")).artist.id);
        const response = await axiosApi.get(`/artists/membership-form/${artist_id}`, { headers });
        console.log("API Response:", response.data);
        console.log(ophid);
        
        if (typeof response.data === "string") {
          setContent(response.data);
        } else {
          setError("Received an unexpected response. Please check the API endpoint.");
        }
      } catch (error) {
        console.error("Error fetching membership form:", error);
        setError("Error fetching membership form. Please try again later.");
      }
    };

    fetchMembershipForm();
  }, [id]);

  console.log(ophid);
  return (
    <div className="w-100 overflow-x-hidden"> 
      <h2 className="form-title">Membership Form</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : content ? (
        // Option 1: Render using iframe to prevent styling conflicts
        <iframe
          title="Membership Form"
          srcDoc={content}
          className="membership-form-iframe"
        />
      ) : (
        <p className="loading-message">Loading form...</p>
      )}
    </div>
  );
};

export default MembershipForm;
