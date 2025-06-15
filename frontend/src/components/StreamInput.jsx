import { useState } from "react"
import { Loader2, Play, AlertCircle } from "lucide-react"

const StreamInput = ({ onStreamReady }) => {
  const [rtspUrl, setRtspUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rtspUrl.trim()) {
      setError("Please enter a valid RTSP URL")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rtsp_url: rtspUrl }),
      })

      if (!response.ok) throw new Error("Failed to convert stream")

      const data = await response.json()
      onStreamReady(data.stream_url)
    } catch (err) {
      setError("Failed to start stream. Please check your RTSP URL and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="rtsp-url" className="block text-sm font-semibold text-gray-700">
              RTSP Stream URL
            </label>
            <div className="relative">
              <input
                id="rtsp-url"
                type="text"
                className="w-full h-14 px-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-200 bg-white"
                placeholder="rtsp://example.com:554/stream"
                value={rtspUrl}
                onChange={(e) => {
                  setRtspUrl(e.target.value)
                  setError("")
                }}
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Enter your RTSP camera or stream URL to begin conversion
            </p>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            disabled={loading || !rtspUrl.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Converting Stream...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Live Stream
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StreamInput
