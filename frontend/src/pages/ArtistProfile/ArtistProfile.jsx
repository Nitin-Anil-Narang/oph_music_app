import { Play, Pause, Edit3 } from "lucide-react";
import { Instagram, Facebook, Music, Apple } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import axiosApi from "../../conf/axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { updateProfileImage } from "../auth/API/profile";
import { useArtist } from "../auth/API/ArtistContext";

Modal.setAppElement('#root');

export default function ArtistProfile() {
  const [profile, setProfile] = useState({});
  const userData = localStorage.getItem("userData");
  const parsedData = JSON.parse(userData);
  const id = parsedData.artist.id;
  const { headers } = useArtist();
  const [audio, setAudio] = useState(null);
  const [playingSongId, setPlayingSongId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handlePlayPause = (song) => {
    if (audio && playingSongId === song.id) {
      if (!audio.paused) {
        audio.pause();
        setPlayingSongId(null);
      } else {
        audio.play();
        setPlayingSongId(song.id);
      }
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(song.audio_file_url);
      newAudio.play();
      setAudio(newAudio);
      setPlayingSongId(song.id);
      newAudio.onended = () => setPlayingSongId(null);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosApi.get(`/artists/${id}`);
      if (response.status === 200) {
        setProfile(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await axiosApi.post(
        "/auth/change-password",
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${parsedData.token}` } }
      );
      if (response.status === 200) {
        toast.success("Password changed successfully");
        localStorage.clear();
        navigate("/auth/login");
        window.location.reload();
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error("Error changing password. Please try again.");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);
      await updateProfileImage(formData, headers);
      await fetchProfile();
    }
  };

  return (
    profile && (
      <div className="min-h-[calc(100vh-70px)] text-gray-100 px-4 sm:px-8 py-6 overflow-x-hidden">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start gap-6 flex-wrap">
            <div className="relative">
              <img
                src={profile.profile_img_url}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-cyan-600 cursor-pointer"
                onClick={openModal}
              />
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
              <button
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              >
                <Edit3 className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                {profile.legal_name}
              </h1>
              <p className="text-gray-400">
                Stage Name: <span className="text-cyan-400">{profile.stage_name}</span>
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-gray-400">OPH Artist Code: <span className="text-white">#{profile.oph_id}</span></p>
            <p className="text-gray-400">Profession: <span className="text-white">{profile.profession}</span></p>
          </div>

          {/* Bio */}
          <p className="text-gray-400 leading-relaxed">{profile.bio}</p>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4">
            {profile.instagram_url && (
              <a href={profile.instagram_url} target="_blank">
                <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </button>
              </a>
            )}
            {profile.facebook_url && (
              <a href={profile.facebook_url} target="_blank">
                <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </button>
              </a>
            )}
            {profile.spotify_url && (
              <a href={profile.spotify_url} target="_blank">
                <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                  <Music className="w-5 h-5" />
                </button>
              </a>
            )}
            {profile.apple_music_url && (
              <a href={profile.apple_music_url} target="_blank">
                <button className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
                  <Apple className="w-5 h-5" />
                </button>
              </a>
            )}
          </div>

          {/* Songs Table */}
          <div className="overflow-x-auto mt-8">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-center text-gray-300 border-b border-gray-800 text-xs">
                  <th className="pb-4 font-normal">#</th>
                  <th className="pb-4 font-normal">SONG NAME</th>
                  <th className="pb-4 font-normal">PLAYS</th>
                  <th className="pb-4 font-normal">TIME</th>
                  <th className="pb-4 font-normal">PLAY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {profile?.songs?.map((song, index) => (
                  <tr key={song.id} className="group text-center">
                    <td className="py-4">{index + 1}</td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <div className="max-w-[120px] truncate">
                          <div className="font-medium">{song.name}</div>
                          <div className="text-sm text-gray-400">{song.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{song.total_views}</td>
                    <td className="py-4">{song.duration_in_minutes}</td>
                    <td className="py-4">
                      <button
                        className="p-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
                        onClick={() => handlePlayPause(song)}
                      >
                        {playingSongId === song.id && !audio?.paused ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Divider */}
          <hr className="border-gray-700 my-8" />

          {/* Change Password */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Change Password:</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="password"
                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400"
                placeholder="••••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                className="px-6 py-3 bg-cyan-400 text-gray-900 rounded-lg font-medium hover:bg-cyan-300 transition-colors"
                onClick={handleChangePassword}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Toast */}
        <ToastContainer />

        {/* Modal for artist story video */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center px-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-75"
        >
          <div className="relative bg-black rounded-lg p-0 max-w-3xl w-full">
            <button
              className="absolute top-2 right-2 text-white text-2xl z-10"
              onClick={closeModal}
            >
              &times;
            </button>
            <video
              src={profile.artist_story}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Modal>
      </div>
    )
  );
}
