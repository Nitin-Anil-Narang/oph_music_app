import { ChartArea, ChevronDown, CalendarDays } from "lucide-react";
import Chart from "../../components/Chart/Chart";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import axiosApi from "../../conf/axios";
import { useArtist } from "../auth/API/ArtistContext";
import CustomVideoPlayer from "../../components/CustomVideoPlayer/CustomVideoPlayer";
import NavbarRight from "../../components/Navbar/NavbarRight";
import NavbarLeft from "../../components/Navbar/NavbarLeft";
import FilterSelect from "../../components/FilterSelect/FilterSelect";
import "./styles.css";

const PLATFORM_COLORS = {
  spotify: "#1DB954", // Spotify green
  "jio saavn": "#00BCD4", // Jio Saavn turquoise
  jiosaavn: "#00BCD4",
  telegram: "#2AABEE", // Telegram blue
  "youtube music": "#FF0000", // YouTube Music red
  youtubemusic: "#FF0000",
  "apple music": "#FC3C44", // Apple Music pinkish-red
  applemusic: "#FC3C44",
  gaana: "#F4511E", // Gaana orange
};

const AUDIO_CHART_COLORS_FALLBACK = [
  "#22d3ee",
  "#8959D3",
  "#14b8a6",
  "#6366f1",
  "#f59e0b",
  "#ec4899",
];

function getPlatformColor(platformLabel, idx) {
  const key = String(platformLabel).toLowerCase().replace(/\s+/g, " ").trim();
  return (
    PLATFORM_COLORS[key] ??
    AUDIO_CHART_COLORS_FALLBACK[idx % AUDIO_CHART_COLORS_FALLBACK.length]
  );
}

function sameSongId(metricSongId, selectedId) {
  if (metricSongId == null || selectedId == null) return false;
  const a = Number(metricSongId);
  const b = Number(selectedId);
  return Number.isFinite(a) && Number.isFinite(b) && a === b;
}

/** API/DB often returns numeric fields as strings; `0 + "1500"` becomes `"01500"` (wrong). */
function toNum(v) {
  if (v == null || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const AUDIO_TZ = "Asia/Kolkata";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Prefer S3 year/month bucket, else derive from a timestamp. */
function audioMonthKeyFromRow(row) {
  if (row?.year != null && row?.month) {
    const mi = MONTH_NAMES.indexOf(String(row.month));
    const y = parseInt(row.year, 10);
    if (mi >= 0 && Number.isFinite(y)) {
      return `${y}-${String(mi + 1).padStart(2, "0")}`;
    }
  }
  return audioMonthKeyFromDate(row?.audioDate);
}

/** YYYY-MM in AUDIO_TZ for sorting / bucketing. */
function audioMonthKeyFromDate(isoOrDate) {
  if (isoOrDate == null || isoOrDate === "") return "";
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: AUDIO_TZ,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  return y && m ? `${y}-${m}` : "";
}

/** X-axis label: month + year only (no day). */
function audioMonthLabelFromKey(monthKey) {
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) return "Unknown";
  const [ys, ms] = monthKey.split("-");
  const y = Number(ys);
  const m = Number(ms);
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString("en-GB", {
    timeZone: AUDIO_TZ,
    month: "short",
    year: "numeric",
  });
}

function prevAudioMonthKey(monthKey) {
  if (!/^\d{4}-\d{2}$/.test(monthKey)) return "";
  const [y0, m0] = monthKey.split("-").map(Number);
  let m = m0 - 1;
  let y = y0;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  return `${y}-${String(m).padStart(2, "0")}`;
}

/** Latest snapshot per calendar month (same platform). */
function aggregateAudioPointsByMonth(points) {
  const byMonth = new Map();
  for (const p of points) {
    const key = p.monthKey || "";
    if (!key) continue;
    const t = p.date ? new Date(p.date).getTime() : 0;
    const cur = byMonth.get(key);
    if (!cur || t >= new Date(cur.date).getTime()) {
      byMonth.set(key, {
        monthKey: key,
        monthLabel: p.monthLabel || audioMonthLabelFromKey(key),
        value: toNum(p.value),
        date: p.date,
      });
    }
  }
  return Array.from(byMonth.values()).sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey),
  );
}

/** First month with streams > 0: prepend previous month @ 0 for a visible ramp. */
function audioChartDataWithBaseline(monthPoints) {
  if (!monthPoints.length) return [];
  const sorted = [...monthPoints].sort((a, b) =>
    a.monthKey.localeCompare(b.monthKey),
  );
  const mapped = sorted.map((p) => ({
    name: p.monthLabel,
    value: toNum(p.value),
    monthKey: p.monthKey,
  }));
  const first = mapped[0];
  if (first.value <= 0) {
    return mapped.map(({ name, value }) => ({ name, value }));
  }
  const prevKey = prevAudioMonthKey(first.monthKey);
  const baselineLabel = prevKey ? audioMonthLabelFromKey(prevKey) : "Start";
  return [
    { name: baselineLabel, value: 0 },
    ...mapped.map(({ name, value }) => ({ name, value })),
  ];
}

/* ── Mobile-only sub-components ─────────────────────────────────────── */

function MobileSongPlatformSelect({
  songValue,
  songOptions,
  onSongChange,
  platformValue,
  onPlatformChange,
  selectedContent,
  contents,
}) {
  console.log(selectedContent);

  console.log(contents);

  const [songOpen, setSongOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const ref = useRef(null);
  const songBtnRef = useRef(null);
  const platformBtnRef = useRef(null);
  const [songDropStyle, setSongDropStyle] = useState({});
  const [platformDropStyle, setPlatformDropStyle] = useState({});
  const platforms = ["YouTube", "Instagram", "Audio Platform"];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setSongOpen(false);
        setPlatformOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openSong = () => {
    const rect = songBtnRef.current?.getBoundingClientRect();
    if (rect)
      setSongDropStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    setSongOpen((p) => !p);
    setPlatformOpen(false);
  };

  const openPlatform = () => {
    const rect = platformBtnRef.current?.getBoundingClientRect();
    if (rect)
      setPlatformDropStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    setPlatformOpen((p) => !p);
    setSongOpen(false);
  };

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden border border-gray-700"
    >
      {/* Song section — dark top half */}
      <div
        ref={songBtnRef}
        className="bg-[#1a1f2e] px-4 py-4 flex items-start justify-between cursor-pointer"
        onClick={openSong}
      >
        <div>
          <p className="text-gray-400 text-sm mb-1">Song Name:</p>
          <p className="text-white font-semibold text-base">
            {songValue || "Select a Song"}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-white mt-1 shrink-0 transition-transform ${songOpen ? "rotate-180" : ""}`}
        />
      </div>
      {/* Platform section — cyan bottom half */}
      <div
        ref={platformBtnRef}
        className="bg-[#5DC9DE] px-4 py-4 flex items-center justify-between cursor-pointer"
        onClick={openPlatform}
      >
        <span className="font-semibold text-black text-base">
          {platformValue || "Select Platform"}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-black shrink-0 transition-transform ${platformOpen ? "rotate-180" : ""}`}
        />
      </div>
      {/* Song dropdown — portal */}
      {songOpen &&
        ReactDOM.createPortal(
          <ul
            style={songDropStyle}
            className="max-h-60 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg"
          >
            {songOptions.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-3 cursor-pointer hover:bg-white/10 truncate ${songValue === opt.label ? "bg-white/10" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSongChange(opt.value);
                  setSongOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
      {/* Platform dropdown — portal */}
      {platformOpen &&
        ReactDOM.createPortal(
          <ul
            style={platformDropStyle}
            className="max-h-60 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg"
          >
            <li
              className="px-4 py-3 cursor-pointer hover:bg-white/10"
              onMouseDown={(e) => {
                e.preventDefault();
                onPlatformChange("");
                setPlatformOpen(false);
              }}
            >
              Select Platform
            </li>
            {platforms.map((p) => (
              <li
                key={p}
                className={`px-4 py-3 cursor-pointer hover:bg-white/10 ${platformValue === p ? "bg-white/10" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPlatformChange(p);
                  setPlatformOpen(false);
                }}
              >
                {p}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}

function MobileDurationSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [dropStyle, setDropStyle] = useState({});

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect)
      setDropStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    setOpen((p) => !p);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="w-full rounded-full bg-[#1a1f2e] border border-gray-700 px-4 py-4 flex items-center justify-center gap-2 text-white font-semibold text-base"
      >
        <CalendarDays className="w-5 h-5" />
        <span>{value || "Duration"}</span>
      </button>
      {open &&
        ReactDOM.createPortal(
          <ul
            style={dropStyle}
            className="max-h-60 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 text-white shadow-lg"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-3 cursor-pointer hover:bg-white/10 ${value === opt.label ? "bg-white/10" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

export default function AnalyticsDashboard() {
  const { ophid, headers } = useArtist();
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [contents, setContents] = useState({
    dbMetrics: [],
    s3Metrics: [],
  });
  const [selectedContent, setSelectedContent] = useState("");
  const [streams, setStreams] = useState([]);
  const [selectedStream, setSelectedStream] = useState("");
  const [totalViews, setTotalViews] = useState(0);
  const [totalEngagement, setTotalEngagement] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [exchangeRate] = useState(1 / 92.7); // Fixed conversion rate: 1 USD = 92.7 INR, so 1 INR = 0.01079 USD
  const chartsPerPage = 3;

  const [analyticsData, setAnalyticsData] = useState({
    viewsData: [],
    engagementData: [],
    durationData: [],
    incomeData: [],
  });
  const [revenue, setRevenue] = useState({
    usd: 0,
    inr: 0,
  });
  const [durationOptions] = useState([
    { label: "Last 7 Day", value: 7 },
    { label: "Last 10 Days", value: 10 },
    { label: "Last 15 Days", value: 15 },
    { label: "Last 30 Days", value: 30 },
  ]);

  const filteredDurationOptions = durationOptions;
  const [selectedDuration, setSelectedDuration] = useState(7);

  useEffect(() => {
    const fetchContent = async () => {
      if (!ophid) return;
      setIsLoading(true);

      try {
        const response = await axiosApi.get(`/getMetricByOph?OPH_ID=${ophid}`);

        if (response.data.success) {
          const db = response.data.data;
          setContents({
            dbMetrics: Array.isArray(db) ? db : [],
            s3Metrics: Array.isArray(response.data.s3Metrics)
              ? response.data.s3Metrics
              : [],
          });

          setSelectedContentId(null);

          console.log("Fetched content:", response.data);
        } else {
          console.warn("No metrics found for OPH_ID:", ophid);
          setContents({ dbMetrics: [], s3Metrics: [] });
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setContents({ dbMetrics: [], s3Metrics: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [ophid]);

  useEffect(() => {
    const fetchBySongId = async () => {
      if (!selectedContent || !selectedContent[0]?.song_id) return; // ✅ Wait until a song is selected

      const songId = selectedContent[0].song_id;

      try {
        console.log("Fetching video data for song:", songId);
        setIsLoading(true);

        const response = await axiosApi.get(`/getVideoyId/${songId}`);
        console.log("res", response.data);

        if (response.status === 200) {
          setVideoData(response.data); // ✅ store separately for reuse
          console.log("✅ Fetched content by song ID:", response.data);
        } else {
          console.warn("⚠️ No data found for this song ID:", songId);
          setVideoData(null);
        }
      } catch (error) {
        console.error("❌ Error fetching data by song_id:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBySongId();
  }, [selectedContent]);

  console.log("Video Data Available:", videoData);

  console.log(contents);

  const mapMetricRow = (metric, extra = {}) => {
    const streams =
      metric.audio_platform_streams != null &&
      metric.audio_platform_streams !== ""
        ? Number(metric.audio_platform_streams)
        : null;
    const revenueRaw = metric.audio_platform_revenue;
    const revenueNum =
      revenueRaw != null && revenueRaw !== "" ? Number(revenueRaw) : null;
    return {
      name: metric.song_name,
      song_name: metric.song_name,
      date: metric.updated_at || null,
      Id: metric.Id || metric.id,
      song_id: metric.song_id,
      video_url: metric.video_url,
      image_url: metric.image_url,
      credits: metric.credits,
      youtube_views: toNum(metric.youtube_views),
      youtube_engagement: toNum(metric.youtube_engagement),
      youtube_avg_view_duration:
        metric.youtube_avg_view_duration ?? "00:00:00",
      youtube_revenue: metric.youtube_revenue ?? "0.00",
      insta_engagement: toNum(metric.insta_engagement),
      Notes: metric.Notes ?? "",
      audio_platform_name: metric.audio_platform_name ?? null,
      audio_platform_streams: Number.isFinite(streams) ? streams : null,
      audio_platform_revenue: Number.isFinite(revenueNum)
        ? revenueNum
        : null,
      audioDate:
        metric.audioDate ?? metric.updated_at ?? metric.created_at ?? null,
      year: metric.year ?? extra.year,
      month: metric.month ?? extra.month,
      fromS3: Boolean(extra.fromS3),
    };
  };

  const submitMetric = React.useMemo(() => {
    const db = (contents.dbMetrics || []).map((m) =>
      mapMetricRow(m, { fromS3: false }),
    );
    const s3 = (contents.s3Metrics || []).map((m) =>
      mapMetricRow(m, { fromS3: true, year: m.year, month: m.month }),
    );
    return [...db, ...s3];
  }, [contents]);

  const submitMetricRef = useRef(submitMetric);
  submitMetricRef.current = submitMetric;

  console.log("Combined metrics:", submitMetric);

  const inrToUsd = (inr) => inr * exchangeRate;

  const rows = Array.isArray(selectedContent)
    ? selectedContent
    : selectedContent
      ? [selectedContent]
      : [];

  const audioChartRows = rows.filter(
    (c) =>
      toNum(c.audio_platform_streams) > 0 &&
      c.audio_platform_name != null &&
      String(c.audio_platform_name).trim() !== "",
  );

  const parseDuration = (durationStr) => {
    if (!durationStr) return 0;
    const parts = durationStr.split(":").map(Number);
    const [h = 0, m = 0, s = 0] = parts;
    return h * 3600 + m * 60 + s; // total seconds
  };

  const chartData = Array.isArray(selectedContent)
    ? (() => {
        const dataMap = new Map();
        selectedContent
          .filter((c) => !c.fromS3)
          .forEach((c) => {
          const dateKey = c.date
            ? new Date(c.date).toLocaleDateString("en-GB", {
                timeZone: "Asia/Kolkata",
              })
            : "Unknown Date";
          const existing = dataMap.get(dateKey);
          const newData = {
            name: dateKey,
            date: c.date,
            value: c.youtube_views || 0,
            valueEngagement: c.youtube_engagement || 0,
            valueDuration: parseDuration(c.youtube_avg_view_duration),
            valueInstagram: c.insta_engagement || 0,
          };

          if (
            !existing ||
            new Date(c.date).getTime() > new Date(existing.date).getTime()
          ) {
            dataMap.set(dateKey, newData);
          }
        });
        return Array.from(dataMap.values()).sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      })()
    : selectedContent
      ? [
          {
            name: selectedContent.date
              ? new Date(selectedContent.date).toLocaleDateString("en-GB", {
                  timeZone: "Asia/Kolkata",
                })
              : "Unknown Date",
            date: selectedContent.date,
            value: selectedContent.youtube_views,
            valueEngagement: selectedContent.youtube_engagement,
            valueInstagram: selectedContent.insta_engagement,
            valueDuration: parseDuration(
              selectedContent.youtube_avg_view_duration,
            ),
          },
        ]
      : [];

  const AudiochartData = audioChartRows.map((c) => {
    const monthKey = audioMonthKeyFromRow(c);
    return {
      name: c.audio_platform_name,
      date: c.audioDate,
      monthKey,
      monthLabel: monthKey ? audioMonthLabelFromKey(monthKey) : "Unknown",
      value: Number(c.audio_platform_streams) || 0,
    };
  });

  const totalDurationSeconds = chartData.reduce(
    (sum, d) => sum + toNum(d.valueDuration),
    0,
  );

  const engagementMetric = Array.isArray(selectedContent)
    ? selectedContent.reduce((sum, c) => sum + toNum(c.youtube_engagement), 0)
    : toNum(selectedContent?.youtube_engagement);

  const InstagramMetric = Array.isArray(selectedContent)
    ? selectedContent.reduce((sum, c) => sum + toNum(c.insta_engagement), 0)
    : toNum(selectedContent?.insta_engagement);

  /** Dedupe by string id — Map treats 23 and "23" as different keys, which duplicated <option> keys. */
  const uniqueSongs = Array.from(
    new Map(
      submitMetric.flatMap((c) => {
        const sid = c.song_id;
        if (sid != null && String(sid).trim() !== "") {
          return [[String(sid), c]];
        }
        const fid = c.Id ?? c.id;
        if (fid != null && String(fid).trim() !== "") {
          return [[`id-${String(fid)}`, { ...c, song_id: fid }]];
        }
        return [];
      }),
    ).values(),
  );

  // normalize to rows (array) and compute totals

  const totalRevenueINR = (() => {
    if (selectedStream === "Audio Platform") {
      const latest = new Map();
      for (const r of rows) {
        const plat = String(r.audio_platform_name ?? "").trim();
        if (!plat) continue;
        const t = r.audioDate ? new Date(r.audioDate).getTime() : 0;
        const prev = latest.get(plat);
        if (!prev || t >= prev.t) {
          latest.set(plat, { t, v: toNum(r.audio_platform_revenue) });
        }
      }
      return Array.from(latest.values()).reduce((sum, x) => sum + x.v, 0);
    }
    if (selectedStream === "YouTube") {
      return rows.reduce((sum, r) => sum + toNum(r.youtube_revenue), 0);
    }
    return 0;
  })();

  const filterByDuration = (data, dateField) => {
    const currentDate = new Date();
    const cutoffDate = new Date();
    cutoffDate.setDate(currentDate.getDate() - selectedDuration);

    return data.filter((d) => {
      if (!d[dateField]) return false;
      const itemDate = new Date(d[dateField]);
      return itemDate >= cutoffDate && itemDate <= currentDate;
    });
  };

  const filteredChartData = filterByDuration(chartData, "date");
  const filteredAudioChartData =
    selectedStream === "Audio Platform"
      ? AudiochartData
      : filterByDuration(AudiochartData, "date");

  /** One chart per audio platform (S3 / DB rows), sorted by total streams desc. */
  const audioPlatformChartGroups = (() => {
    const byPlatform = new Map();
    for (const d of filteredAudioChartData) {
      const label =
        d.name != null && String(d.name).trim() !== ""
          ? String(d.name).trim()
          : "Unknown platform";
      if (!byPlatform.has(label)) byPlatform.set(label, []);
      byPlatform.get(label).push(d);
    }
    for (const pts of byPlatform.values()) {
      pts.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }
    return Array.from(byPlatform.entries())
      .map(([label, pts]) => [label, aggregateAudioPointsByMonth(pts)])
      .sort((a, b) => {
        const latest = (arr) =>
          arr.length ? toNum(arr[arr.length - 1].value) : 0;
        return latest(b[1]) - latest(a[1]);
      });
  })();

  console.log("🔍 FILTER RESULTS:", {
    originalChartData: chartData.length,
    filteredChartData: filteredChartData.length,
    selectedStream,
    data: filteredChartData,
  });

  const getPaginatedCharts = (charts) => {
    const start = currentPage * chartsPerPage;
    return charts.slice(start, start + chartsPerPage);
  };

  const totalPages = (charts) => Math.ceil(charts.length / chartsPerPage);

  console.log("DEBUG selectedContent:", selectedContent);

  console.log(
    "testLine",
    AudiochartData.map((d) => ({
      date: d.date,
      value: d.value,
    })),
  );

  console.log(
    "test",
    chartData.map((d) => ({ name: d.name, value: d.valueDuration })),
  );

  console.log(chartData);

  console.log(selectedContent);

  return (
    <>
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-2 text-cyan-400">Loading Analytics...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-4 text-red-400">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500/20 rounded hover:bg-red-500/30"
          >
            Try Again
          </button>
        </div>
      )}
      {!isLoading && !error && (
        <div className="min-h-[calc(100vh-70px)] px-[16px] py-[16px] lg:px-8 lg:py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center  mb-4">
              <div className="flex lg:items-center flex-col lg:flex-row justify-between w-full">
                <div className="flex items-center justify-between lg:justify-end mb-[16px] block lg:hidden">
                  <NavbarLeft />
                  <NavbarRight />
                </div>
                <h2 className="text-[#5DC9DE] text-2xl sm:text-3xl font-bold uppercase drop-shadow-[0_0_15px_rgba(34,211,238,1)]">
                  ANALYTICS
                </h2>

                <div className="flex justify-end">
                  {selectedStream !== "Audio Platform" && (
                  <div className="hidden lg:block w-48">
                    <FilterSelect
                      value={
                        filteredDurationOptions.find(
                          (o) => o.value === selectedDuration,
                        )?.label || ""
                      }
                      placeholder="Select Duration"
                      ariaLabel="Duration"
                      options={filteredDurationOptions.map((o) => ({
                        value: String(o.value),
                        label: o.label,
                      }))}
                      onChange={(val) => setSelectedDuration(Number(val))}
                    />
                  </div>
                  )}
                </div>
              </div>
              <div className="hidden lg:block">
                <NavbarRight />
              </div>
            </div>

            {/* Song + Platform connected card — Mobile */}
            <div className="lg:hidden flex flex-col gap-3">
              <MobileSongPlatformSelect
                songValue={
                  selectedContent?.[0]?.song_name ||
                  selectedContent?.[0]?.name ||
                  ""
                }
                songOptions={uniqueSongs.map((c) => ({
                  value: String(c.song_id),
                  label: c.song_name || c.name,
                }))}
                onSongChange={(songId) => {
                  console.log("Clicked:", songId);

                  const selectedRows = submitMetricRef.current.filter(
                    (metric) => sameSongId(metric.song_id, songId),
                  );

                  console.log("Rows:", selectedRows);

                  setSelectedContent(selectedRows);
                }}
                platformValue={selectedStream || ""}
                onPlatformChange={setSelectedStream}
                selectedContent={selectedContent}
                contents={contents}
              />
              {selectedStream !== "Audio Platform" && (
              <MobileDurationSelect
                value={
                  filteredDurationOptions.find((o) => o.value === selectedDuration)
                    ?.label || ""
                }
                options={filteredDurationOptions.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
                onChange={(val) => setSelectedDuration(Number(val))}
              />
              )}
            </div>

            {/* Song Selection and Platform — Desktop */}
            <div className="hidden lg:flex flex-row gap-4">
              <div className="flex-1">
                <FilterSelect
                  value={
                    selectedContent?.[0]?.song_name ||
                    selectedContent?.[0]?.name ||
                    ""
                  }
                  placeholder="Select a Song"
                  ariaLabel="Song"
                  options={uniqueSongs.map((c) => ({
                    value: String(c.song_id),
                    label: c.song_name || c.name,
                  }))}
                  onChange={(songId) => {
                    const selectedRows = submitMetricRef.current.filter(
                      (metric) => sameSongId(metric.song_id, songId),
                    );
                    if (selectedRows.length > 0)
                      setSelectedContent(selectedRows);
                  }}
                />
              </div>
              <div className="w-48">
                <FilterSelect
                  value={selectedStream || ""}
                  placeholder="Select Platform"
                  ariaLabel="Platform"
                  options={["YouTube", "Instagram", "Audio Platform"]}
                  onChange={setSelectedStream}
                />
              </div>
            </div>

            {/* Video Preview */}
            {selectedStream !== "Audio Platform" && (
              <div className="overflow-hidden flex items-stretch flex-col md:flex-row justify-start gap-[16px] md:gap-0">
                <div className="relative">
                  {videoData?.video_url ? (
                    <CustomVideoPlayer
                      src={videoData.video_url}
                      poster={
                        videoData?.image_url
                          ? JSON.parse(videoData.image_url)[0]
                          : "/assets/images/ytVideoBg.png"
                      }
                      className="w-full md:w-[400px] h-[200px] object-cover rounded-lg"
                      pauseOtherVideos={true}
                    />
                  ) : (
                    <img
                      src={
                        videoData?.image_url
                          ? JSON.parse(videoData.image_url)[0]
                          : "/assets/images/ytVideoBg.png"
                      }
                      alt="Video thumbnail"
                      className="w-full md:w-[400px] h-[200px] object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="px-0 md:px-4 py-1">
                  <h3 className="text-lg font-semibold">
                    {selectedContent?.[0]?.song_name || "No content selected"}
                  </h3>

                  <p className="text-sm text-cyan-400">
                    {selectedContent
                      ? Array.isArray(selectedContent)
                        ? selectedContent.reduce(
                            (sum, c) => sum + toNum(c.youtube_views),
                            0,
                          )
                        : Number(selectedContent?.youtube_views || 0)
                      : "--"}{" "}
                    {selectedContent ? "Views" : ""}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {videoData?.credits ||
                      selectedContent?.[0]?.credits ||
                      "No description available"}
                  </p>
                </div>
              </div>
            )}

            {/* Revenue Section */}
            {(selectedStream === "YouTube" ||
              selectedStream === "Audio Platform") && (
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-400">
                      Generated Revenue (USD):
                    </p>
                    <p className="text-xl font-bold text-cyan-400">
                      ${inrToUsd(totalRevenueINR).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <p className="text-sm text-gray-400">
                      Generated Revenue (INR):
                    </p>
                    <p className="text-xl font-bold text-cyan-400">
                      ₹{totalRevenueINR}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Charts */}
            {/* Charts */}
            <div className="space-y-6">
              {selectedStream &&
                rows.length > 0 &&
                (() => {
                  let chartsArray = [];

                  if (selectedStream === "YouTube") {
                    chartsArray = [
                      <Chart
                        key="views"
                        type="line"
                        data={filteredChartData.map((d) => ({
                          name: d.name,
                          value: d.value,
                        }))}
                        title="Views"
                        subtitle="Count in Millions"
                        metric={rows.reduce(
                          (sum, r) => sum + toNum(r.youtube_views),
                          0,
                        )}
                        colors={["#22d3ee"]}
                      />,
                      <Chart
                        key="engagement"
                        type="bar"
                        data={filteredChartData.map((d) => ({
                          name: d.name,
                          value: d.valueEngagement,
                        }))}
                        title="Engagement"
                        subtitle="Count in Millions"
                        metric={engagementMetric}
                        colors={["#8959D3"]}
                        showLegend={true}
                        legendLabel={
                          selectedContent?.[0]?.song_name ||
                          selectedContent?.[0]?.name ||
                          "Song"
                        }
                      />,
                      <Chart
                        key="duration"
                        type="area"
                        data={filteredChartData.map((d) => ({
                          name: d.name,
                          value: d.valueDuration,
                        }))}
                        title="Average View Duration"
                        subtitle="Total Seconds"
                        metric={totalDurationSeconds}
                        colors={["#34a853"]}
                      />,
                    ];
                  }

                  if (selectedStream === "Instagram") {
                    chartsArray = [
                      <Chart
                        key="instagram"
                        type="bar"
                        data={filteredChartData.map((d) => ({
                          name: d.name,
                          value: d.valueInstagram,
                        }))}
                        title="Instagram Engagement"
                        subtitle="Count in Millions"
                        metric={InstagramMetric}
                        colors={["#22d3ee"]}
                      />,
                    ];
                  }

                  if (selectedStream === "Audio Platform") {
                    chartsArray = audioPlatformChartGroups
                      .filter(([, pts]) => pts.length > 0)
                      .map(([platformLabel, points], idx) => (
                        <Chart
                          key={`audio-${platformLabel}-${idx}`}
                          type="area"
                          data={audioChartDataWithBaseline(points)}
                          title={platformLabel}
                          subtitle="Streams by month"
                          metric={
                            points.length
                              ? toNum(points[points.length - 1].value)
                              : 0
                          }
                          yFromZero
                          colors={[getPlatformColor(platformLabel, idx)]}
                        />
                      ));
                  }

                  const paginatedCharts = getPaginatedCharts(chartsArray);

                  return (
                    <>
                      {paginatedCharts.length === 0 && (
                        <p className="text-gray-400 text-sm">
                          {selectedStream === "Audio Platform"
                            ? "No audio platform stream data for this song."
                            : "No chart data in the selected duration."}
                        </p>
                      )}
                      {paginatedCharts.map((chart, idx) => (
                        <div key={idx}>{chart}</div>
                      ))}

                      {chartsArray.length > chartsPerPage && (
                        <div className="flex justify-between mt-4">
                          <button
                            disabled={currentPage === 0}
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 0))
                            }
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            disabled={
                              currentPage >= totalPages(chartsArray) - 1
                            }
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages(chartsArray) - 1),
                              )
                            }
                            className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
