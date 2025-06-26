import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken";
import axiosApi from "../../conf/axios";
import toast from "react-hot-toast";

import { useArtist } from "../auth/API/ArtistContext";
import axios from "axios";

const TICKET_KEY = "ticket_state";
const STATUS_MAP = {
  0: "Submitted",
  1: "Resolved",
  2: "Rejected",
};

export default function RequestTicketForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { headers, artist } = useArtist();
  const [ticketCategories, setTicketCategories] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [ticketPlan, setTicketPlan] = useState([]);
  const [amount, setAmount] = useState(null);
  const [tickets, setTickets] = useState([]);
  const oph_id = useSelector((state) => state.profile.profile);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef(new AbortController());
  const isSubmittingRef = useRef(false);

  const fetchPaymentPlans = async () => {
    try {
      const response = await axiosApi.get("/payments/plans", {
        headers: headers,
        signal: abortControllerRef.current.signal,
      });
      setAllPlans(response.data.data);
      const supportPlan = response.data.data.find(
        (plan) => plan.name === "Support Ticket"
      );
      if (supportPlan) {
        setTicketPlan([supportPlan.id]);
        setAmount(supportPlan.amount);
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const fetchTicketCategories = async () => {
    try {
      const response = await axiosApi.get("/ticket/ticket-categories", {
        headers: headers,
        signal: abortControllerRef.current.signal,
      });
      setTicketCategories(response.data.categories[0]);
      console.log(response.data.categories,"categories")
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.log(err);
      }
    }
  };

  const [formData, setFormData] = useState({
    category_id: "",
    description: "",
    attachments: [], // Change to an array to handle multiple files
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files.length > 0) {
      const fileReaders = [];
      const newAttachments = [];

      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        fileReaders.push(reader);

        reader.onloadend = () => {
          newAttachments.push({
            name: files[i].name,
            data: reader.result, // Store file as Base64
          });

          if (newAttachments.length === files.length) {
            setFormData((prev) => ({
              ...prev,
              attachments: newAttachments,
            }));
          }
        };

        reader.readAsDataURL(files[i]); // Convert file to Base64
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const submitTicket = async (formData, payment_id) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("category_id", formData.category_id);
      formDataObj.append("description", formData.description);

      // Handle attachments properly
      formData.attachments.forEach((attachment) => {
        // Convert Base64 to Blob
        const byteString = atob(attachment.data.split(",")[1]);
        const mimeString = attachment.data
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // Create File object
        const file = new File([blob], attachment.name, { type: mimeString });
        formDataObj.append("attachments", file);
      });

      // Only append payment_id if it exist (paid tickets)
      if (payment_id) {
        formDataObj.append("payment_id", payment_id);
      }

      const response = await axiosApi.post("/ticket", formDataObj, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        signal: abortControllerRef.current.signal,
      });

      if (response.status === 201) {
        // Clear form after submission (keep this part)
        setFormData({
          category_id: "",
          description: "",
          attachments: [],
        });

        // Don't navigate to success page here - this is now handled in the calling functions
        // The payment flow will navigate to success after successful submission
        // The general enquiry flow navigates to success directly

        // Just clear state and refresh tickets
        if (location.state) {
          navigate("/dashboard/request-ticket", { replace: true });
        }

        fetchTickets();
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error("Ticket Submission Failed");
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.category_id || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Find the selected category
    // const selectedCategory = ticketCategories.find(
    //   (cat) => String(cat.id) === String(formData.category_id)
    // );
    const selectedCategory=ticketCategories[0];
    console.log("Selected Category:", selectedCategory);
    // check if it's a Genral Enquiry
    const isGeneralEnquiry = true;``
    console.log("Is General Enquiry:", isGeneralEnquiry);

    sessionStorage.setItem(TICKET_KEY, JSON.stringify(formData));

    if (isGeneralEnquiry) {
      ;
      // If it's a General Enquiry, submit the ticket directly
      setIsSubmitting(true);
      try {
        await submitTicket(formData, null); // null payment_id for free tickets

        // Navigate to success page instead of showing toast
        navigate("/dashboard/success", {
          state: {
            heading: "Your request ticket has been successfully generated!",
            btnText: "View Requests",
            redirectTo: "/dashboard/request-ticket",
          },
          replace: true,
        });

        // Clear form data from session storage
        sessionStorage.removeItem(TICKET_KEY);
      } catch (error) {
        toast.error("Failed to submit ticket. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Navigate to payment page
      await navigate("/dashboard/payment", {
        state: {
          artist_id: artist.id,
          amount: amount,
          planIds: ticketPlan,
          returnPath: "/dashboard/request-ticket",
          heading: "Complete Ticket Payment",
          showSuccessToast: true,
          successMessage: "Ticket submitted successfully!",
        },
      });
    }
  };

  const handleContentCreation = async (paymentData) => {
    if (isSubmittingRef.current) return;
    try {
      const savedState = sessionStorage.getItem(TICKET_KEY);
      if (!savedState) return;

      const contentFormData = JSON.parse(savedState);
      await submitTicket(contentFormData, paymentData.newPaymentIds[0]);

      sessionStorage.removeItem(TICKET_KEY);
    } catch (error) {
      console.error("Error creating content:", error);
      toast.error("Failed to create content. Please try again.");
    }
  };

  useEffect(() => {
    const paymentResult = location.state;
    if (paymentResult?.status === "success" && !isSubmittingRef.current) {
      const controller = new AbortController();

      // Handle the payment return and ticket creation
      (async () => {
        try {
          await handleContentCreation(paymentResult.paymentData);

          // Show toast notification after successful ticket creation
          if (paymentResult.showSuccessToast && paymentResult.successMessage) {
            toast.success(paymentResult.successMessage, {
              duration: 4000,
              position: "top-right",
            });
          }

          // Clear location state to prevent duplicate processing
          navigate("/dashboard/request-ticket", { replace: true });
        } catch (error) {
          console.error("Error processing payment return:", error);
        }
      })();

      return () => {
        controller.abort();
      };
    }
  }, [location.state]);

  useEffect(() => {
    fetchPaymentPlans();
    fetchTicketCategories();
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axiosApi.get("/ticket", {
        headers: headers,
        signal: abortControllerRef.current.signal,
      });
      setTickets(response.data.data.slice(0, 5));
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.log(err);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] text-gray-100 px-6 p-6">
      <div className="max-w-xl">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
          REQUEST TICKET
        </h1>

        {/* Submitted Requests List */}
        <div className=" p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Submitted Requests</h2>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`flex justify-between items-center p-3 bg-gray-800/30 rounded-lg ${
                    ticket.status === 0
                      ? "border-t-2 border-yellow-200"
                      : ticket.status === 1
                      ? "border-t-2 border-green-200"
                      : "border-t-2 border-red-200"
                  }`}
                >
                  <div>
                    <p className="text-m text-cyan-400">
                      {ticket.description.substring(0, 50)}...
                    </p>
                    <p className="text-sm">{ticket.category_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      ticket.status === 0
                        ? "text-yellow-400"
                        : ticket.status === 1
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {STATUS_MAP[ticket.status]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No submitted requests yet</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Code */}
          <div className="space-y-2">
            <label className="block">
              Profile Code ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="profileCode"
              value={oph_id && oph_id.oph_id}
              onChange={handleChange}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400"
              disabled
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 appearance-none focus:outline-none focus:border-cyan-400"
                required
              >
                <option value="">Select Category</option>
        
                  <option key={ticketCategories.id} value={ticketCategories.id}>
                    {ticketCategories.name}</option>

              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write Description......"
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-gray-400">
                Upload Attachment (Optional)
              </span>
            </label>
            <input
              type="file"
              name="attachments"
              id="file-upload" // Make sure this ID matches the htmlFor above
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf"
              multiple={true} // Allow multiple file uploads
              className="hidden"
            />
            {formData.attachments.length > 0 && (
              <div className="text-sm text-cyan-400">
                Selected files:{" "}
                {formData.attachments.map((file) => file.name).join(", ")}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-cyan-400 text-gray-900 rounded-full py-3 font-semibold hover:bg-cyan-300 transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Request Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
