import React,{ useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosApi from "../../conf/axios";
import { fetchNotifications } from "../../slice/notification";
import {useArtist} from "../auth/API/ArtistContext"
import Noti from "../../../public/assets/images/noti.png";
const Notification = () => {
  const {headers} = useArtist()
  const dispatch = useDispatch();
  const newNots = useSelector((state) => state.notification.new);
  const earlier = useSelector((state) => state.notification.earlier);

  useEffect(() => {
    dispatch(fetchNotifications({headers}));
  }, []); // Fetch notifications on mount

  useEffect(() => {
    const updateNotifications = async () => {
      if (!newNots || newNots.length === 0) return;

      try {
        await Promise.all(
          newNots.map((note) =>
            axiosApi.put(
              `/notifications/${note.id}/read`,
              {}, // Empty body
              { headers: headers }
            )
          )
        );
        console.log("Notifications updated successfully");
      } catch (err) {
        console.error("Error updating notifications:", err);
      }
    };

    updateNotifications();
  }, [newNots]); // Runs when `newNots` is updated

  const NotificationItem = ({ title, description, link }) => (
    <div
    onClick={() => {
      if (link) {
        window.open(link, '_blank');
      }


    }}
    className="flex gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 p-2 bg-cyan-950 rounded-lg flex items-center justify-center">
          {/* ADD MUSIC ICON */}
           <img src={Noti} alt="" />
        </div>
      </div>
      <div>
        <h3 className="text-white font-medium mb-1">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-[calc(100vh-70px)] text-white">
      <div className="px-8 py-6">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)]">NOTIFICATION</h1>

        <div className="mb-8">
          <h2 className="text-cyan-400 text-xs mb-4">NEW</h2>
          {newNots && newNots.length > 0 ? (
            <div className="bg-[#151D26]">
              {
                newNots.map((note) => <NotificationItem key={note.id} {...note} />)
              }
            </div>
          ) : (
            <p className="text-gray-600">No New Notifications</p>
          )}
        </div>

        <div>
          <h2 className="text-cyan-400 text-xs mb-4">EARLIER</h2>
          {earlier && earlier.length > 0 ? (
            earlier.map((note) => <NotificationItem key={note.id} {...note} />)
          ) : (
            <p className="text-gray-600">No Earlier Notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
