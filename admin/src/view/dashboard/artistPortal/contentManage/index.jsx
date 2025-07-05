import React, { useState, useRef } from "react";

/**********************
 * Dummy starter data *
 **********************/
const initialContent = {
  project_type: "EP",
  video_type: "Lyric Video",
  release_date: "2025-10-05",
};

const initialAudio = {
  song_name: "Rising Sun",
  language: "Hindi",
  genre: "Fusion",
  sub_genre: "Indie",
  mood: "Motivational",
  lyrics: "Jaago re, sapno ko apna bana lo…",
  primary_artist: "Rahul Sharma",
  featuring: "",
  lyricist: "Neha Gupta",
  composer: "Rahul Sharma",
  producer: "Beat Lab",
  audio_url: "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
};

const initialVideo = {
  credits: "Dir: S. Iyer | DOP: A. Singh",
  image: "https://via.placeholder.com/150?text=Thumbnail",
  video: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
};

/*********************************************************/

const contentManage = () => {
  const [content, setContent] = useState(initialContent);
  const [audio, setAudio] = useState(initialAudio);
  const [video, setVideo] = useState(initialVideo);

  const fileRefs = useRef({});

  const handleFile = (e, field, setter) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setter((prev) => ({ ...prev, [field]: url }));
    }
  };

  const renderMediaField = (field, value, setter) => {
    const lower = field.toLowerCase();
    const isImage = lower.includes("image");
    const isVideo = lower.includes("video");
    const isAudio = lower.includes("audio");

    const downloadName = `${field}.${
      isAudio ? "mp3" : isVideo ? "mp4" : "jpg"
    }`;

    return (
      <div className="space-y-2">
        <div
          className="cursor-pointer"
          onClick={() => fileRefs.current[field]?.click()}
        >
          {isImage && (
            <img
              src={value}
              alt={field}
              className="w-40 h-40 object-cover rounded border"
            />
          )}
          {isVideo && (
            <video
              src={value}
              controls
              className="w-full max-w-xs rounded border"
            />
          )}
          {isAudio && (
            <audio
              src={value}
              controls
              className="w-full max-w-xs rounded border"
            />
          )}
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={(r) => (fileRefs.current[field] = r)}
            type="file"
            accept={isImage ? "image/*" : isVideo ? "video/*" : "audio/*"}
            className="hidden"
            onChange={(e) => handleFile(e, field, setter)}
          />
          <button
            onClick={() => fileRefs.current[field]?.click()}
            className="text-sm px-3 py-1 bg-[#0d3c44] text-white rounded hover:bg-[#0a2d33]"
          >
            Change
          </button>
          <a
            href={value}
            download={downloadName}
            className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Download
          </a>
        </div>
      </div>
    );
  };

  const renderTextField = (sectionSetter, field, value, multiline = false) =>
    multiline ? (
      <textarea
        value={value}
        onChange={(e) =>
          sectionSetter((p) => ({ ...p, [field]: e.target.value }))
        }
        className="w-full p-2 border rounded text-black"
      />
    ) : (
      <input
        type={field === "release_date" ? "date" : "text"}
        value={value}
        onChange={(e) =>
          sectionSetter((p) => ({ ...p, [field]: e.target.value }))
        }
        className="w-full p-2 border rounded text-black"
      />
    );

  const Section = ({ title, children }) => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-[#0d3c44] border-b pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
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

  const renderContentInfo = () => (
    <Section title="Content Info">
      {Object.entries(content).map(([key, value]) => (
        <Field key={key} label={key}>
          {renderTextField(setContent, key, value)}
        </Field>
      ))}
    </Section>
  );

  const renderAudioDetails = () => (
    <Section title="Audio Details">
      {Object.entries(audio).map(([key, value]) => (
        <Field key={key} label={key}>
          {key.includes("audio")
            ? renderMediaField(key, value, setAudio)
            : key === "lyrics"
            ? renderTextField(setAudio, key, value, true)
            : renderTextField(setAudio, key, value)}
        </Field>
      ))}
    </Section>
  );

  const renderVideoDetails = () => (
    <Section title="Video Details">
      {Object.entries(video).map(([key, value]) => (
        <Field key={key} label={key}>
          {key === "credits"
            ? renderTextField(setVideo, key, value, true)
            : renderMediaField(key, value, setVideo)}
        </Field>
      ))}
    </Section>
  );

  const handleSave = () => {
    console.log({ content, audio, video });
    alert("Changes saved (console logged)!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-10">
        {renderContentInfo()}
        {renderAudioDetails()}
        {renderVideoDetails()}

        <div className="text-right border-t pt-6">
          <button
            onClick={handleSave}
            className="bg-[#0d3c44] text-white px-8 py-3 rounded-md hover:bg-[#0a2d33]"
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default contentManage;
