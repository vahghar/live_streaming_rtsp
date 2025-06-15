from flask import Blueprint, request, jsonify
import subprocess, os, uuid
from flasgger import swag_from

stream_bp = Blueprint("stream", __name__)
HLS_DIR = os.path.join("static", "hls")

ffmpeg_path = r"C:\Users\Pushpa_Rawat\Downloads\ffmpeg-7.1.1-essentials_build\ffmpeg-7.1.1-essentials_build\bin\ffmpeg.exe"

@stream_bp.route("/convert", methods=["POST"])
@swag_from({
    "tags": ["Stream"],
    "summary": "Convert RTSP stream to HLS",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "type": "object",
                "properties": {
                    "rtsp_url": {
                        "type": "string",
                        "example": "rtsp://example.com/stream"
                    }
                }
            }
        }
    ],
    "responses": {
        200: {
            "description": "Stream conversion started",
            "schema": {
                "type": "object",
                "properties": {
                    "stream_url": {
                        "type": "string",
                        "example": "/static/hls/stream_id/index.m3u8"
                    }
                }
            }
        },
        400: {
            "description": "Missing RTSP URL"
        },
        500: {
            "description": "FFmpeg conversion error"
        }
    }
})
def convert_rtsp_to_hls():
    data = request.get_json()
    rtsp_url = data.get("rtsp_url")
    if not rtsp_url:
        return jsonify({"error": "Missing RTSP URL"}), 400

    stream_id = str(uuid.uuid4())
    stream_path = os.path.join(HLS_DIR, stream_id)
    os.makedirs(stream_path, exist_ok=True)

    hls_file = os.path.join(stream_path, "index.m3u8")
    command = [
        ffmpeg_path, "-i", rtsp_url,
        "-c:v", "libx264", "-f", "hls",
        "-hls_time", "2", "-hls_list_size", "3",
        "-hls_flags", "delete_segments",
        hls_file
    ]

    proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print(f"FFmpeg started with PID: {proc.pid}")
    return jsonify({"stream_url": f"/static/hls/{stream_id}/index.m3u8"})
