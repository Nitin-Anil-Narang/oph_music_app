import React, { useState, useRef } from "react";

/* --------------------------------------------------
   Dummy starter data
-------------------------------------------------- */
const initialContentInfo = {
  project_type: "Single",
  video_type: "Music Video",
  release_date: "2025-08-15",
};

const initialAudio = {
  song_name: "Invisible",
  language: "English",
  genre: "Pop",
  sub_genre: "Indie Pop",
  mood: "Uplifting",
  lyrics: "We rise above the skyline...",
  primary_artist: "Rahul Sharma",
  featuring: "DJ Rhythm",
  lyricist: "Asha Rao",
  composer: "Rahul Sharma",
  producer: "Studio Beats",
  audio_url: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
};

const initialVideo = {
  credits: "Directed by A. Kumar | DOP: J. Patel",
  image: "https://via.placeholder.com/150?text=Cover+Image",
  video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
};

/* -------------------------------------------------- */

const ContentNew = () => {
  const [content, setContent] = useState(initialContentInfo);
  const [audio, setAudio] = useState(initialAudio);
  const [video, setVideo] = useState(initialVideo);
  const [rejectReasons, setRejectReasons] = useState({});

  const fileRefs = useRef({});

  const handleChange = (setter) => (field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = (e, field, setter) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setter((prev) => ({ ...prev, [field]: url }));
    }
  };

  const rejectSection = (sectionKey) => {
    const reason = prompt(
      `Reason for rejecting “${sectionKey.replace(/_/g, " ")}`
    );
    if (reason) {
      setRejectReasons((prev) => ({ ...prev, [sectionKey]: reason }));
      alert(`Rejected section ${sectionKey}: ${reason}`);
    }
  };

  const renderMediaInput = (field, value, setter) => {
    const lower = field.toLowerCase();
    const isImage = lower.includes("image");
    const isVideo = lower.includes("video");
    const isAudio = lower.includes("audio");

    return (
      <div>
        <div
          className="cursor-pointer"
          onClick={() => fileRefs.current[field]?.click()}
        >
          {isImage && (
            <img
              src={value}
              alt={field}
              className="w-40 h-40 object-cover rounded border mb-2"
            />
          )}
          {isVideo && (
            <video
              src={value}
              controls
              className="w-full max-w-xs rounded border mb-2"
            />
          )}
          {isAudio && (
            <audio controls className="w-full max-w-xs rounded border mb-2">
              <source src={value} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
        <input
          ref={(r) => (fileRefs.current[field] = r)}
          type="file"
          accept={isImage ? "image/*" : isVideo ? "video/*" : "audio/*"}
          className="hidden"
          onChange={(e) => handleFile(e, field, setter)}
        />
      </div>
    );
  };

  const renderTextInput = (field, value, onChange, multiline = false) => (
    <div className="flex flex-col">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full p-2 border rounded-md text-black"
        />
      ) : (
        <input
          type={field === "release_date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full p-2 border rounded-md text-black"
        />
      )}
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-[#0d3c44]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
      <div className="mt-4">
        <textarea
          placeholder={`Reason for rejecting ${title}`}
          value={rejectReasons[title.toLowerCase().replace(/\s/g, "_")] || ""}
          onChange={(e) =>
            setRejectReasons((prev) => ({
              ...prev,
              [title.toLowerCase().replace(/\s/g, "_")]: e.target.value,
            }))
          }
          className="w-full text-black p-2 border rounded-md mb-2"
        />
        <button
          onClick={() => rejectSection(title.toLowerCase().replace(/\s/g, "_"))}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
        >
          Reject {title}
        </button>
      </div>
    </div>
  );

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-gray-700 text-sm font-semibold mb-1 capitalize">
        {label.replace(/_/g, " ")}
      </label>
      {children}
    </div>
  );

  const renderContentSection = () => (
    <Section title="Content Info">
      {Object.entries(content).map(([key, value]) => (
        <Field key={key} label={key}>
          {renderTextInput(key, value, handleChange(setContent))}
        </Field>
      ))}
    </Section>
  );

  const renderAudioSection = () => (
    <Section title="Audio Details">
      {Object.entries(audio).map(([key, value]) => (
        <Field key={key} label={key}>
          {key === "lyrics"
            ? renderTextInput(key, value, handleChange(setAudio), true)
            : key.includes("audio")
            ? renderMediaInput(key, value, setAudio)
            : renderTextInput(key, value, handleChange(setAudio))}
        </Field>
      ))}
    </Section>
  );

  const renderVideoSection = () => (
    <Section title="Video Details">
      {Object.entries(video).map(([key, value]) => (
        <Field key={key} label={key}>
          {key === "credits"
            ? renderTextInput(key, value, handleChange(setVideo), true)
            : renderMediaInput(key, value, setVideo)}
        </Field>
      ))}
    </Section>
  );

  const handleApprove = () => alert("Content approved!");

  const handleRejectAll = () => {
    const reason =
      Object.values(rejectReasons).join("; ") || "General rejection";
    alert(`Rejected. Reasons: ${reason}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        {renderContentSection()}
        {renderAudioSection()}
        {renderVideoSection()}

        <div className="border-t pt-6 text-right space-x-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={handleRejectAll}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentNew;
