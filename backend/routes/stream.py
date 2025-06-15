from flask import Blueprint, request, jsonify
import subprocess, os, uuid

stream_bp = Blueprint("stream", __name__)
HLS_DIR = os.path.join("static", "hls")

ffmpeg_path = r"C:\Users\Pushpa_Rawat\Downloads\ffmpeg-7.1.1-essentials_build\ffmpeg-7.1.1-essentials_build\bin\ffmpeg.exe"

@stream_bp.route("/convert", methods=["POST"])
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

    subprocess.Popen(command)
    return jsonify({"stream_url": f"/static/hls/{stream_id}/index.m3u8"})
