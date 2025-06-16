from flask import Blueprint, request, jsonify, current_app
import subprocess, os, uuid, logging
from flasgger import swag_from

stream_bp = Blueprint("stream", __name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HLSConverter")

ffmpeg_path = "ffmpeg"

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
        400: { "description": "Missing RTSP URL" },
        500: { "description": "FFmpeg conversion error" }
    }
})
def convert_rtsp_to_hls():
    data = request.get_json() or {}
    rtsp_url = data.get("rtsp_url")
    if not rtsp_url:
        return jsonify({"error": "Missing RTSP URL"}), 400

    # Build an absolute path under <project_root>/static/hls
    hls_base = os.path.join(current_app.root_path, "static", "hls")
    stream_id = str(uuid.uuid4())
    out_dir = os.path.join(hls_base, stream_id)
    os.makedirs(out_dir, exist_ok=True)

    # Define your playlist and segment filenames
    playlist        = os.path.join(out_dir, "index.m3u8")
    segment_pattern = os.path.join(out_dir, "seg_%03d.ts")

    # FFmpeg command: force TCP, name segments explicitly
    command = [
        ffmpeg_path,
        "-rtsp_transport", "tcp",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-f", "hls",
        "-hls_time", "2",
        "-hls_list_size", "3",
        "-hls_flags", "delete_segments",
        "-hls_segment_filename", segment_pattern,
        playlist,
    ]

    # Spawn FFmpeg in the background (so this request returns immediately)
    proc = subprocess.Popen(
        command,
        cwd=current_app.root_path,  # ensures 'static/hls/...' paths resolve
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    logger.info("Started FFmpeg PID=%d, writing to %s", proc.pid, playlist)

    # Return the URL your front‑end player should hit
    return jsonify({
        "stream_url": f"/static/hls/{stream_id}/index.m3u8"
    }), 200
