# RTSP Stream Manager - User Guide

## API Documentation
[Interactive API Docs](./index.html)

## Setup
```bash
# 1. Clone repo
git clone https://github.com/your-repo.git
cd RTSP-Stream-App

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Generate docs
python generate_docs.py
```

## Key Features
- **Add RTSP Streams**: POST `/api/convert`
- **Manage Overlays**: CRUD at `/api/overlays`

![Screenshot](./screenshot.png)