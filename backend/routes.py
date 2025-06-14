from flask import Blueprint, request, jsonify
from bson import ObjectId
from database import get_db

overlay_bp = Blueprint("overlay", __name__)

def serialize_overlay(overlay):
    overlay["_id"] = str(overlay["_id"])
    return overlay

@overlay_bp.route("/api/overlays", methods=["GET"])
def get_overlays():
    db = get_db()
    overlays = list(db['overlays'].find())
    return jsonify([serialize_overlay(o) for o in overlays]), 200

@overlay_bp.route("/api/overlays", methods=["POST"])
def create_overlay():
    db = get_db()
    data = request.get_json()
    db['overlays'].insert_one(data)
    return jsonify({"message": "Overlay created"}), 201

@overlay_bp.route("/api/overlays/<id>", methods=["PUT"])
def update_overlay(id):
    db = get_db()
    data = request.get_json()
    db['overlays'].update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Overlay updated"}), 200

@overlay_bp.route("/api/overlays/<id>", methods=["DELETE"])
def delete_overlay(id):
    db = get_db()
    db['overlays'].delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Overlay deleted"}), 200
