// components/OverlayControls.jsx
import { useState, useEffect } from "react"
import { Eye, Clock, Type } from "lucide-react"

const OverlayControls = ({ showTimestamp, toggleTimestamp, customText, setCustomText }) => {
  return (
    <div className="absolute top-4 left-4 z-50 space-y-3 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-md border border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={showTimestamp}
          onChange={toggleTimestamp}
          className="accent-blue-600"
        />
        <label className="text-gray-700 flex items-center space-x-1 text-sm">
          <Clock className="w-4 h-4" />
          <span>Live Timestamp</span>
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Type className="w-4 h-4 text-gray-600" />
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Custom overlay text"
          className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </div>
  )
}

export default OverlayControls
