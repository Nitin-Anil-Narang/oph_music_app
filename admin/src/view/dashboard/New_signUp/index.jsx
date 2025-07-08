import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosApi from "../../../conf/axios";

const NewSignupDetails = () => {
  const { ophid } = useParams();
  const [artist, setArtist] = useState(null);
  const [txnList, setTxnList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [showAllTxns, setShowAllTxns] = useState(false);
  const [copiedTxnId, setCopiedTxnId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosApi.get(`/user-details/${ophid}`);
        setArtist(res.data.userDetails);

        const txnRes = await axiosApi.get(`/transaction-details/${ophid}`);
        let txnArray = txnRes.data.transactions || [];
        txnArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setTxnList(txnArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ophid]);

  const handleReject = () => {
    alert(`Rejected with reason: ${reason || "No reason provided"}`);
    setReason("");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedTxnId(text);
    setTimeout(() => {
      setCopiedTxnId(null);
    }, 2000);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} — ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  if (!artist) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Artist not found.</div>;
  }

  const displayedTxns = showAllTxns ? txnList : txnList.slice(0, 1);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        <div>
          <h2 className="text-2xl font-bold text-[#0d3c44] mb-6 border-b pb-2">
            Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Full Name</label>
              <div className="text-gray-900">{artist.full_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Stage Name</label>
              <div className="text-gray-900">{artist.stage_name}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
              <div className="text-gray-900">{artist.email}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Contact Number</label>
              <div className="text-gray-900">{artist.contact_num}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Artist Type</label>
              <div className="text-gray-900">{artist.artist_type}</div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Location</label>
              <div className="text-gray-900">{artist.location}</div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-1">Personal Photo</label>
              <img
                src={artist.personal_photo ? artist.personal_photo : "https://avatars.githubusercontent.com/u/49544693?v=4"}
                alt="Artist"
                className="mt-2 w-40 h-40 object-cover rounded-xl border"
              />
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="border rounded-xl p-6 bg-gray-50 shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Transactions</h3>
            {txnList.length > 1 && (
              <button
                onClick={() => setShowAllTxns(!showAllTxns)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                {showAllTxns ? "Hide" : "Show all"}
              </button>
            )}
          </div>
          {txnList.length > 0 ? (
            <ul className="space-y-2">
              {displayedTxns.map((txn, index) => (
                <li
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-gray-800 font-medium break-words flex items-center gap-2">
                      ID: {txn.transactionId}
                      {index === 0 && (
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          Recent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(txn.transactionId)}
                        className="text-blue-600 text-sm border border-blue-500 px-2 py-0.5 rounded hover:bg-blue-50"
                      >
                        Copy
                      </button>
                      {copiedTxnId === txn.transactionId && (
                        <span className="text-green-600 text-sm font-medium">Copied!</span>
                      )}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    Time: {formatDateTime(txn.createdAt)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No transactions available</div>
          )}
        </div>

        {/* Reject Section */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Reject Artist</h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full h-24 text-black p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d3c44]"
          />
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl shadow hover:bg-red-700 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewSignupDetails;
