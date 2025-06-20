import { useState } from "react"
import StreamInput from "./components/StreamInput"
import VideoPlayer from "./components/VideoPlayer"
import { Play, Zap, Shield, Globe, Menu, X } from "lucide-react"

function App() {
  const [streamUrl, setStreamUrl] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                StreamCast
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="https://rtsp-api-docs.onrender.com/api-docs/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                API Docs
              </a>
              <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Real-time RTSP Streaming
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Convert RTSP to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Live Stream
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your RTSP camera feeds into accessible web streams instantly. No complex setup, no technical
            expertise required. Just paste your URL and stream.
          </p>

          {/* Stream Input */}
          <div className="mb-16">
            <StreamInput onStreamReady={(url) => setStreamUrl(url)} />
          </div>

          {/* Video Player */}
          {streamUrl && (
            <div className="mb-16">
              <VideoPlayer url={streamUrl} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold">StreamCast</span>
              </div>
              <p className="text-gray-400 max-w-md">
                The most reliable RTSP to web streaming solution for modern applications.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
