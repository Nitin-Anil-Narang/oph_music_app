import React, { useState, useEffect } from "react";
import { Camera, Plus, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../../../conf/axios";
import { useArtist } from "../../auth/API/ArtistContext";
import Loading from "../../../components/Loading";
import { toast, ToastContainer } from "react-toastify";

export default function VideoMetadataForm() {
  const navigate = useNavigate();
  const { contentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [songName, setSongName] = useState('');
  const { headers } = useArtist();
  const [formData, setFormData] = useState({
    credits: "",
    thumbnails: [],
    video_file: null,
    existing_thumbnails: [],
    existing_video_url: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPaidForLyricalVideo, setHasPaidForLyricalVideo] = useState(false); // Add state for lyrical video payment

  useEffect(() => {
    const abortController = new AbortController();
    let isFirstMount = true;

    const fetchVideoMetadata = async () => {
      if (!contentId) {
        setError('No content ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosApi.get(`/content/${contentId}/video-metadata`, {
          headers: headers,
          signal: abortController.signal
        });

        if (abortController.signal.aborted) return;

        if (response.data.success) {
          const { video_metadata } = response.data.data;
          setSongName(video_metadata.content_name);
          
          setFormData(prev => ({
            ...prev,
            credits: video_metadata.credits || '',
            existing_thumbnails: video_metadata.thumbnails || [],
            existing_video_url: video_metadata.video_file_url || null,
            reject_reason: video_metadata.reject_reason || null
          }));

          // Check if the user has paid for a lyrical video
          const paymentInfo = JSON.parse(sessionStorage.getItem('paymentInfo'));
          if (paymentInfo && paymentInfo.hasPaidForLyricalVideo) {
            setHasPaidForLyricalVideo(true);
          }
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching video metadata:', err);
          setError('Failed to load video metadata');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    if (isFirstMount) {
      fetchVideoMetadata();
      isFirstMount = false;
    }

    return () => {
      abortController.abort();
    };
  }, [contentId, headers]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.thumbnails.length + files.length > 3) {
      toast.error("Maximum 3 thumbnails allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      thumbnails: [...prev.thumbnails, ...files].slice(0, 3),
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      thumbnails: prev.thumbnails.filter((_, i) => i !== index),
    }));
  };

  const removeExistingPhoto = async (index) => {
    try {
      setIsRemoving(true);
      setFormData(prev => ({
        ...prev,
        existing_thumbnails: prev.existing_thumbnails.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        video_file: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    if (formData.thumbnails.length === 0 && formData.existing_thumbnails.length === 0) {
      toast.error('At least one thumbnail is required');
      return;
    }

    if (!hasPaidForLyricalVideo && !formData.video_file && !formData.existing_video_url) {
      toast.error('Video file is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("credits", formData.credits);
      
      if (formData.video_file) {
        formDataToSend.append("video_file", formData.video_file);
      }

      formData.thumbnails.forEach((thumbnail) => {
        formDataToSend.append('thumbnails', thumbnail);
      });

      const response = await axiosApi.post(`/content/video-metadata/${contentId}`, formDataToSend, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });
      
      

      if (response.data.success) {
        navigate("/dashboard/success");
      }
    } catch (error) {
      console.error("Error uploading video metadata:", error);
      toast.error('Failed to upload video metadata. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  console.log(formData,"formData");

  return (
    <div className="min-h-[calc(100vh-70px)] text-gray-100 px-8 p-6">
      <div className="max-w-xl space-y-8">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">VIDEO METADATA</h1>
          {
            formData.reject_reason && <p className="text-red-700">Reason: {formData.reject_reason}</p>
          }

        {(isLoading || isRemoving || isUploading) && <Loading />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Song Name Display */}
          <div className="space-y-2">
            <label className="block text-gray-400">Song Name:</label>
                        <input
              disabled
              value={songName}
              className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              type="text"
            />
          </div>

          {/* Credits */}
          <div className="space-y-2">
            <label className="block">
              Credits <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.credits}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, credits: e.target.value }))
              }
              placeholder="Enter credits..."
              rows={4}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-gray-400" />
              <span>Upload Maximum 3 Pictures</span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Existing thumbnails */}
              {formData.thumbnails.map((photo, index) => (
                <div key={`new-${index}`} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Existing thumbnails from server */}
              {formData.existing_thumbnails?.map((url, index) => (
                <div key={`existing-${index}`} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Existing thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {formData.thumbnails.length + formData.existing_thumbnails.length < 3 && (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    multiple
                  />
                  <div className="aspect-square border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center hover:border-cyan-400 transition-colors">
                    <Plus className="w-8 h-8 text-gray-500" />
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Video Upload */}
          {!hasPaidForLyricalVideo && (
            <div className="space-y-2">
              <label className="block">
                Upload Video File <span className="text-red-500">*</span>
              </label>
              {formData.existing_video_url && !formData.video_file && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400">Existing video file:</p>
                  <video
                    src={formData.existing_video_url}
                    className="w-full mt-2 rounded-lg"
                    controls
                  />
                </div>
              )}
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-400 transition-colors">
                  {formData.video_file ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-cyan-400">
                        {formData.video_file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, video_file: null }))
                        }
                        className="p-1 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="w-8 h-8 text-gray-500" />
                      <span className="text-gray-500">
                        {formData.existing_video_url 
                          ? 'Upload New Video File' 
                          : 'Upload Video File'}
                      </span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 text-gray-900 rounded-full py-3 font-semibold hover:bg-cyan-300 transition-colors disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}