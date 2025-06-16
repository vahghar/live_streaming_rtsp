🚀 Getting Started
1. Clone the Repository

git clone https://github.com/vahghar/live_streaming_rtsp.git
cd live_streaming_rtsp

🔧 Backend Setup (Flask)
2. Create and Activate Virtual Environment

cd backend
pyhton -m venv venv
source venv/bin/activate or venv\Scripts\activate
pip install -r requirements.txt

⚠️ Note: Ensure ffmpeg is installed and added to your system PATH.
You can check this by running: ffmpeg --version

📘 API Documentation
Once your backend is running, visit:
http://localhost:5000/api-docs

💻 Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

🌐 Using the Application

🔗 Input RTSP Stream
Open the frontend in your browser.

Paste your RTSP URL (e.g., from an IP camera or a test stream).

Click Start Live Stream.

The backend uses FFmpeg to convert the RTSP stream to HLS.

The live video stream will appear shortly on the page.

🖊️ Add Overlay (Text / Logo)
Click the Add Overlay button.

Enter the following:

Text: Your custom overlay text.

Font Size & Color: Customize appearance.

The overlay will appear at a random position on the video.

Drag and position the overlay anywhere on the video stream.

Click Save to finalize the overlay.
