import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSelectedEvent, fetchAllEvents } from "../../slice/events";
import formatDateAndAdjustMonth, { formatDateTime } from "../../utils/date";
import RegistrationModal from "../../components/registration/Registration";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../../conf/axios";
import { useArtist } from "../auth/API/ArtistContext";

export default function Events() {
  const { headers, artist, ophid } = useArtist();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [id, setID] = useState(null);
  // const eventID = useSelector((state) => state.event.selectedEvent);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  // const allEvents = useSelector((state) => state.event.allEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistBookEvents, setArtistBookEvents] = useState([])

  const musicEvents = [
    {
      event_id: 1,
      hashtags: ["#Competition", "#Music", "#Winners"],
      competitionName: "Live Stage Singing Competition",
      dateTime: "28 December, 2025 – 09:00 PM",
      location: "Purplish Club, Bandra, Mumbai",
      description:
        "An exciting live stage performance where talented singers battle it out for the top spot.",
      registrationFees: {
        normal: "150",
        specialOffer: {
          availableFor: "OPH Creators",
          discount: "50%",
        },
      },
      registrationPeriod: {
        start: "15 Dec, 2025",
        end: "18 Dec, 2025",
      },
      winnerReward: "10,000",
      image: "https://events.com/wp-content/uploads/2022/09/BLOG-How-To-Plan-a-Music-Festival-A-Complete-Guide.png",
      is_register: true,
    },
    {
      event_id: 2,
      hashtags: ["#MusicFest", "#TalentHunt", "#SoloSinging"],
      competitionName: "Voice of the City",
      dateTime: "12 August, 2025 – 06:30 PM",
      location: "Echo Auditorium, Pune",
      description:
        "Showcase your singing skills at one of the city's most prestigious solo singing contests.",
      registrationFees: {
        normal: "200",
        specialOffer: {
          availableFor: "Students",
          discount: "30%",
        },
      },
      registrationPeriod: {
        start: "01 August, 2025",
        end: "10 August, 2025",
      },
      winnerReward: "15,000",
      image: "https://cdn.evbstatic.com/s3-build/fe/build/images/75d81eed66f040a590ed5744b3367d8c-music.webp",
      is_register: true
    },
    {
      event_id: 3,
      hashtags: ["#DuetBattle", "#SingersUnite", "#LiveEvent"],
      competitionName: "Duet Singing Showdown",
      dateTime: "5 February, 2025 – 08:00 PM",
      location: "Rhythm House, Delhi",
      description:
        "Calling all duet singers! Participate in this exciting competition to win hearts and prizes.",
      registrationFees: {
        normal: "300 per duo",
        specialOffer: {
          availableFor: "Early Birds",
          discount: "20%",
        },
      },
      registrationPeriod: {
        start: "20 Jan, 2025",
        end: "02 Feb, 2025",
      },
      winnerReward: "20,000",
      image: "https://blogmedia.evbstatic.com/wp-content/uploads/rally-legacy/2018/03/12071132/twenty20_e20435f0-557d-4778-b264-988fce1ac53d-2.jpg",
      is_register: false
    },
    {
      event_id: 4,
      hashtags: ["#Music", "#BattleOfBands", "#RockNight"],
      competitionName: "Battle of the Bands",
      dateTime: "22 March, 2025 – 07:00 PM",
      location: "The Soundbox, Bengaluru",
      description:
        "Join us for a night of electrifying band performances competing for the ultimate title.",
      registrationFees: {
        normal: "500 per band",
        specialOffer: {
          availableFor: "College Bands",
          discount: "40%",
        },
      },
      registrationPeriod: {
        start: "01 Mar, 2025",
        end: "18 Mar, 2025",
      },
      winnerReward: "25,000",
      image: "https://freerangestock.com/sample/120648/singer-performing-at-a-live-concert.jpg",
      is_register: false
    }
  ];



  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
  //       await dispatch(fetchAllEvents(headers));
  //     } catch (err) {
  //       setError("Failed to load events");
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch, headers]);

  useEffect(() => {

    const fetchData = async () => {

      try{
        const response = await axiosApi.get("/event/get-event",{
          headers
        })

        if(response.data.success)
        {
          setArtistBookEvents(response.data.data)
        }
      }

      catch(err)
      {
        console.error(err)
      }

    }

    fetchData()

  },[])

  const handleReg = (data) => {
    navigate("/auth/payment", {
      state: {
        artist_id: ophid,
        amount: (parseInt(data.registrationFees.normal) / 2).toFixed(0),
        event_id: data.event_id,
        // planIds: [data.payment_plan_id],
        returnPath: "/dashboard/events",
        heading: "Complete Event Registration",
        from: "Event Registeration"
      },
    });

    // if (location.state?.state === "success") {
    // } else {
    //   // dispatch(changeSelectedEvent({ data: data }));
    //   await navigate("/dashboard/payment", {
    //     state: {
    //       artist_id: ophid,
    //       amount: (parseInt(data.registrationFees.normal) / 2).toFixed(0),
    //       // planIds: [data.payment_plan_id],
    //       returnPath: "/dashboard/events",
    //       heading: "Complete Event Registration",
    //     },
    //   });
    // }
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

  // if (
  //   !allEvents ||
  //   (!allEvents.upcoming_events && !allEvents.previous_events)
  // ) {
  //   return (
  //     <div className="min-h-screen text-gray-100 p-6 flex items-center justify-center">
  //       <div className="text-gray-400">No events found</div>
  //     </div>
  //   );
  // }

  if (
    !musicEvents.length > 0) {
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
          {musicEvents.length > 0 ? (
            musicEvents.map((event, ind) => (
              event.is_register && (<div
                key={ind}
                className="flex md:mb-0 hover:bg-gray-900 transition-colors mb-5 hover:cursor-pointer gap-6 flex-col md:flex-row  rounded-lg p-2 md:p-4"
              // onClick={() => window.open(import.meta.env.VITE_WEBSITE_URL + 'events' + `/${event.id}`, '_blank')}
              >
                {/* Event Image */}
                <div className="md:w-[340px] px-6 md:px-0 w-[96vw] h-[250px] flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.competitionName}
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
                    {event.competitionName}
                  </h2>

                  {/* Date and Venue */}
                  {formatDateTime(event.dateTime) && (
                    <div className="text-gray-400 text-sm">
                      {formatDateAndAdjustMonth(event.dateTime)} -{" "}
                      {event.location}
                    </div>
                  )}

                  {/* Subtitle */}
                  {event.description && (
                    <div className="text-cyan-400">{event.description}</div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <p className="text-gray-400 text-sm">
                      {event.description.length > 50
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                    </p>
                  )}
                  {/* Registration Details */}
                  <div className="space-y-1 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-gray-400">Registration fees:</span>
                      <span className="text-red-400 line-through">₹{event.registrationFees.normal}</span>
                      <span className="text-cyan-400 font-semibold">
                        ₹{(parseInt(event.registrationFees.normal) / 2).toFixed(0)}
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
                        {formatDateAndAdjustMonth(event.registrationPeriod.start)} -{" "}
                        {formatDateAndAdjustMonth(event.registrationPeriod.end)}
                      </span>
                    </div>
                    <div className="text-green-400 font-bold">
                      Winner rewards:{" "}
                      <span className="text-cyan-400">
                        ₹{event.registrationPeriod.winnerReward}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div>
                    {checkRegValid(event.registrationPeriod.end) ? (
                      event.is_register == true ? (
                        <button

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
            )) : (
            <div className="text-gray-400">No upcoming events</div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h1 className="text-cyan-400 text-xl font-extrabold mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,1)] px-6 md:px-0 md:pt-0">
          PREVIOUS EVENTS
        </h1>

        <div className="space-y-6">
          {musicEvents.length > 0 ? (
            musicEvents.map((event) => (
              !event.is_register && (<div
                key={event.id}
                className="flex flex-col md:flex-row gap-6 opacity-[0.5]  rounded-lg p-4"
              >
                {/* Event Image */}
                <div className="md:w-[340px] w-[90vw] h-[250px] flex-shrink-0">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.competitionName}
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
                    {event.competitionName}
                  </h2>

                  {/* Date and Venue */}
                  {formatDateTime(event.dateTime) && (
                    <div className="text-gray-400 text-sm">
                      {formatDateAndAdjustMonth(event.dateTime)} -{" "}
                      {event.location}
                    </div>
                  )}

                  {/* Subtitle */}
                  {event.description && (
                    <div className="text-cyan-400">{event.description}</div>
                  )}

                  {/* Description */}
                  <p className="text-gray-400 text-sm">{event.description}</p>

                  {/* Registration Details */}
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-gray-400">Registration fees:</span>{" "}
                      <span className="text-cyan-400">₹ {event.registrationFees.normal}</span>{" "}
                      <span className="text-red-400">
                        (Special offer only for OPH Creators - 50% off)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">
                        Registration Start date to end date:{" "}
                      </span>

                      <span className="text-cyan-400">
                        {formatDateAndAdjustMonth(event.registrationPeriod.start)} -{" "}
                        {formatDateAndAdjustMonth(event.registrationPeriod.end)}
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
                    {checkRegValid(event.registrationPeriod.end) ? (
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
            )) : (
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
