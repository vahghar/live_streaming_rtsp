import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Radio, Maximize2, Volume2 } from "lucide-react";
import OverlayControls from "./OverlayControls";

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [customText, setCustomText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsPlaying(true);
        video.play().catch((err) => {
          setError("Failed to play stream. Check the URL or network.");
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        setError(`HLS Error: ${data.details}`);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support for Safari
      video.src = url;
      video.play().catch((err) => {
        setError("Failed to play stream. Check the URL or network.");
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [url]);

  useEffect(() => {
    if (showTimestamp) {
      const interval = setInterval(() => {
        setTimestamp(new Date().toLocaleTimeString());
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimestamp("");
    }
  }, [showTimestamp]);

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => setError("Play failed."));
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    videoRef.current.volume = e.target.value;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Radio className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-bold text-gray-900">Live Stream</h3>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                LIVE
              </div>
              <div className="flex items-center space-x-2 text-gray-500">
                <Volume2 className="w-4 h-4" />
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Player with Overlay */}
        <div className="relative bg-black aspect-video">
          <video
            ref={videoRef}
            controls
            className="w-full h-full"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          {error && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white bg-red-600 p-2 rounded">
              {error}
            </div>
          )}

          {/* Overlay content */}
          <OverlayControls
            showTimestamp={showTimestamp}
            toggleTimestamp={() => setShowTimestamp(!showTimestamp)}
            customText={customText}
            setCustomText={setCustomText}
          />

          {/* Timestamp Overlay */}
          {showTimestamp && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md">
              {timestamp}
            </div>
          )}

          {/* Custom Text Overlay */}
          {customText && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-md">
              {customText}
            </div>
          )}
        </div>

        {/* Stream Info and Controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Stream URL: {url}</span>
            <div>
              <button
                onClick={handlePlayPause}
                className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="1"
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;