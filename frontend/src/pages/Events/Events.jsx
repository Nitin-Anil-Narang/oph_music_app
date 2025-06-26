import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSelectedEvent, fetchAllEvents } from "../../slice/events";
import formatDateAndAdjustMonth, { formatDateTime } from "../../utils/date";
import RegistrationModal from "../../components/registration/Registration";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../../conf/axios";
import { useArtist } from "../auth/API/ArtistContext";

export default function Events() {
  const { headers, artist } = useArtist();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id, setID] = useState(null);
  const eventID = useSelector((state) => state.event.selectedEvent);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const allEvents = useSelector((state) => state.event.allEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await dispatch(fetchAllEvents(headers));
      } catch (err) {
        setError("Failed to load events");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, headers]);

  const handleReg = async (data) => {
    ;
    
    if (location.state?.state === "success") {
    } else {
      dispatch(changeSelectedEvent({ data: data }));
      await navigate("/dashboard/payment", {
        state: {
          artist_id: artist.id,
          amount: (data.fees / 2).toFixed(0),
          planIds: [data.payment_plan_id],
          returnPath: "/dashboard/events",
          heading: "Complete Event Registration",
        },
      });
    }
  };

  const checkRegValid = (reg_date) => {
    const date = new Date();
    const reg = new Date(reg_date);
    return date <= reg;
  };

  const createEventReg = async () => {
    if (location.state?.status === "success") {
      const payment_id = location.state.paymentData.newPaymentIds[0];
      const response = await axiosApi.post(
        `/events/${eventID}/artist-booking`,
        {
          payment_id: payment_id,
        },
        {
          headers: headers,
        }
      );
      if (response.status == 200) {
        console.log("Success");
        navigate("/dashboard/success", {
          state: {
            heading: "Event spot has been booked successfully!",
            btnText: "View Events",
            redirectTo: "/dashboard/events",
          },
        });
      }
    }
  };

  useEffect(() => {
    createEventReg();
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="min-h-screen text-gray-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-gray-100 p-6 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (
    !allEvents ||
    (!allEvents.upcoming_events && !allEvents.previous_events)
  ) {
    return (
      <div className="min-h-screen text-gray-100 p-6 flex items-center justify-center">
        <div className="text-gray-400">No events found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100 md:py-0  md:p-6">
      <div className="">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] px-6 md:px-0 pt-6 md:pt-0">
          EVENTS
        </h1>

        <div className="space-y-6">
          {allEvents.upcoming_events?.length > 0 ? (
            allEvents.upcoming_events.map((event, ind) => (
              <div
                key={ind}
                className="flex md:mb-0 hover:bg-gray-900 transition-colors mb-5 hover:cursor-pointer gap-6 flex-col md:flex-row  rounded-lg p-2 md:p-4"
                // onClick={() => window.open(import.meta.env.VITE_WEBSITE_URL + 'events' + `/${event.id}`, '_blank')}
              >
                {/* Event Image */}
                <div className="md:w-[340px] px-6 md:px-0 w-[96vw] h-[250px] flex-shrink-0">
                  <img
                    src={event.thumbnail_url}
                    alt={event.name}
                    className="md:w-full w-[100vw] h-full object-cover rounded-lg"
                  />
                </div>

                {/* Event Details */}
                <div className="flex-1 px-6 space-y-3">
                  {/* Hashtags */}
                  {event.hashtags && (event.hashtags || []).length > 0 && (
                    <div className="flex gap-2">
                      {event.hashtags.map((tag) => (
                        <span key={tag} className="text-cyan-400 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Title */}
                  <h2 className="text-2xl font-semibold uppercase">
                    {event.name}
                  </h2>

                  {/* Date and Venue */}
                  {formatDateTime(event.event_date_time) && (
                    <div className="text-gray-400 text-sm">
                      {formatDateAndAdjustMonth(event.event_date_time)} -{" "}
                      {event.location}
                    </div>
                  )}

                  {/* Subtitle */}
                  {event.subtitle && (
                    <div className="text-cyan-400">{event.short_desc}</div>
                  )}

                  {/* Description */}
                  {event.long_desc && (
                    <p className="text-gray-400 text-sm">
                      {event.long_desc.length > 50
                        ? `${event.long_desc.substring(0, 100)}...`
                        : event.long_desc}
                    </p>
                  )}
                  {/* Registration Details */}
                  <div className="space-y-1 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
  <span className="text-gray-400">Registration fees:</span>
  <span className="text-red-400 line-through">₹{event.fees}</span>
  <span className="text-cyan-400 font-semibold">
    ₹{(event.fees / 2).toFixed(0)}
  </span>
  <span className="text-green-400 text-sm font-medium">
    (50% off for OPH Creators)
  </span>
</div>

                    <div>
                      <span className="text-gray-400">
                        Registration Start date to end date:{" "}
                      </span>

                      <span className="text-cyan-400">
                        {formatDateAndAdjustMonth(event.regn_start)} -{" "}
                        {formatDateAndAdjustMonth(event.regn_end)}
                      </span>
                    </div>
                    <div className="text-green-400 font-bold">
                      Winner rewards:{" "}
                      <span className="text-cyan-400">
                        ₹{event.winnerReward}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {checkRegValid(event.regn_end) ? (
                      event.is_registered == true ? (
                        <button
                          disabled={true}
                          onClick={(e) => {
                            e.preventDefault();
                            handleReg(event);
                          }}
                          className="px-6 py-2 bg-cyan-400 text-gray-900 rounded-full text-sm font-medium hover:bg-cyan-100 transition-colors"
                        >
                          Registered
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleReg(event);
                          }}
                          className="px-6 py-2 bg-cyan-400 text-gray-900 rounded-full text-sm font-medium hover:bg-cyan-300 transition-colors"
                        >
                          Register Now
                        </button>
                      )
                    ) : (
                      <button className="px-6 py-2 bg-gray-700 text-gray-300 rounded-full text-sm font-medium cursor-not-allowed">
                        Closed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No upcoming events</div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] px-6 md:px-0 md:pt-0">
          PREVIOUS EVENTS
        </h1>

        <div className="space-y-6">
          {allEvents.previous_events?.length > 0 ? (
            allEvents.previous_events.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row gap-6 opacity-[0.5]  rounded-lg p-4"
              >
                {/* Event Image */}
                <div className="md:w-[340px] w-[90vw] h-[250px] flex-shrink-0">
                  <img
                    src={event.thumbnail_url || "/placeholder.svg"}
                    alt={event.name}
                    className="md:w-full w-[80vw] h-full object-cover rounded-lg"
                  />
                </div>

                {/* Event Details */}
                <div className="flex-1 space-y-3">
                  {/* Hashtags */}
                  {event.hashtags && (event.hashtags || []).length > 0 && (
                    <div className="flex gap-2">
                      {event.hashtags.map((tag) => (
                        <span key={tag} className="text-cyan-400 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Title */}
                  <h2 className="text-2xl font-semibold uppercase">
                    {event.name}
                  </h2>

                  {/* Date and Venue */}
                  {formatDateTime(event.event_date_time) && (
                    <div className="text-gray-400 text-sm">
                      {formatDateAndAdjustMonth(event.event_date_time)} -{" "}
                      {event.location}
                    </div>
                  )}

                  {/* Subtitle */}
                  {event.subtitle && (
                    <div className="text-cyan-400">{event.short_desc}</div>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 text-sm">{event.description}</p>

                  {/* Registration Details */}
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Registration fees:</span>{" "}
                      <span className="text-cyan-400">₹ {event.fees}</span>{" "}
                      <span className="text-red-400">
                        (Special offer only for OPH Creators - 50% off)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Registration Start date to end date:{" "}
                      </span>

                      <span className="text-cyan-400">
                        {formatDateAndAdjustMonth(event.regn_start)} -{" "}
                        {formatDateAndAdjustMonth(event.regn_end)}
                      </span>
                    </div>
                    <div className="text-green-400 font-bold">
                      Winner rewards:{" "}
                      <span className="text-cyan-400">
                        ₹{event.winnerReward}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {checkRegValid(event.regn_end) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          openModal();
                          setID(event.id);
                        }}
                        className="px-6 py-2 bg-cyan-400 text-gray-900 rounded-full text-sm font-medium hover:bg-cyan-300 transition-colors"
                      >
                        Register Now
                      </button>
                    ) : (
                      <button className="px-6 py-2 bg-gray-700 text-gray-300 rounded-full text-sm font-medium cursor-not-allowed">
                        Closed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No previous events</div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <RegistrationModal id={id} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}
