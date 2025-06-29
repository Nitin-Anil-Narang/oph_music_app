import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useArtist } from "../auth/API/ArtistContext";
import axiosApi from "../../conf/axios";
import Loading from "../../components/Loading";
import { useParams } from "react-router-dom";

const PaymentScreen = () => {
  const { logout } = useArtist();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ophid = queryParams.get("ophid");
  const [trans, setTrans] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const from = location.state.from;

  const {
    amount = 0,
    planIds = [],
    paymentIds = [], 
    returnPath = "/create-profile/personal-details",
    heading = "Payment Required",
  } = location.state || {};

  const handlePaymentSuccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = {
        OPH_ID: ophid,
        Transaction_ID: trans,
        Review: 0,
        Status: "Under Review",
        step: '/auth/create-profile/personal-details',
        from : from
        // plan_ids: planIds,
      };
      console.log("Submitting payment form data:", formData);

      const response = await axiosApi.post("/auth/payment", formData);

      if(response.data.success)
      {
        const path = `/auth/create-profile/personal-details?ophid=${ophid}`
        navigate(path)
      }
      

      const CalenderRes = axiosApi.post("/")
      
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (returnPath.includes("auth")) {
      logout();
    }
    navigate(returnPath, {
      state: {
        status: "cancelled",
      },
      replace: true,
    });
  };

  return (
    <div className="relative">
      {loading && <Loading />}
      <div className="bg-black min-h-[calc(100vh-70px)] text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] text-center">
          {heading} <span className="text-cyan-400">₹{amount}/-</span>
        </h1>

        <div className="flex flex-col items-center gap-6 max-w-md w-full">
          <img
            src="/qr.png"
            alt="QR Code"
            className="w-48 h-48 drop-shadow-[0_0_15px_rgb(252 253 253 / 45%))]"
          />

          <h2 className="text-xl text-center">SCAN QR AND PAY WITH UPI</h2>

          <div className="text-gray-400 text-sm text-center">
            Scan QR code, complete payment and enter the transaction ID below
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <form onSubmit={handlePaymentSuccess} className="w-full space-y-4">
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={trans}
              onChange={(e) => setTrans(e.target.value)}
              className="w-full bg-gray-800 rounded-md px-4 py-3 text-white"
              required
              disabled={loading}
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full border border-cyan-400 text-cyan-400 py-3 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full bg-cyan-400 text-black py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
