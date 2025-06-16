# 📺 RTSP Live Streaming App – User Guide

This guide will help you set up and use the RTSP live streaming app with overlay support.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vahghar/live_streaming_rtsp.git
cd live_streaming_rtsp
```

---

## 🔧 Backend Setup (Flask)

### 2. Create and Activate Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate the environment:

- **Linux/macOS**:
  ```bash
  source venv/bin/activate
  ```

- **Windows**:
  ```bash
  venv\Scripts\activate
  ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ Ensure **ffmpeg** is installed and added to your system PATH.  
> Check it by running:
> ```bash
> ffmpeg --version
> ```

---

## 📘 API Documentation

Once your backend is running, visit:
```
http://localhost:5000/api-docs
```

---

## 💻 Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

Your frontend should now be running at `http://localhost:5173`.

---

## 🌐 Using the Application

### 🔗 Input RTSP Stream

1. Open the frontend in your browser.
2. Paste your **RTSP URL** (e.g., from an IP camera or test source).
3. Click **Start Live Stream**.
4. The backend will convert the stream to **HLS** using **FFmpeg**.
5. The video will appear shortly on the page.

### 🖊️ Add Overlay (Text / Logo)

1. Click the **Add Overlay** button.
2. Enter the following:
   - **Text**: Custom message.
   - **Font Size** & **Color**: Customize appearance.
3. Overlay will appear at a random position.
4. Drag and drop to reposition it.
5. Click **Save** to finalize the overlay.

---

## ✅ Requirements

- Python 3.x
- Node.js & npm
- FFmpeg installed and accessible from terminal
- Modern web browser