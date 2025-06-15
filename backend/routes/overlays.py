from flask import Blueprint, request, jsonify
from bson import ObjectId
from database import get_db
from flasgger import swag_from

overlay_bp = Blueprint("overlay", __name__)

def serialize_overlay(overlay):
    overlay["_id"] = str(overlay["_id"])
    return overlay

@overlay_bp.route("/api/overlays", methods=["GET"])
@swag_from({
    "tags": ["Overlays"],
    "summary": "Get all overlays",
    "responses": {
        200: {
            "description": "List of all overlays",
            "schema": {
                "type": "array",
                "items": {
                    "$ref": "#/definitions/Overlay"
                }
            }
        }
    }
})
def get_overlays():
    db = get_db()
    overlays = list(db['overlays'].find())
    return jsonify([serialize_overlay(o) for o in overlays]), 200

@overlay_bp.route("/api/overlays", methods=["POST"])
@swag_from({
    "tags": ["Overlays"],
    "summary": "Create a new overlay",
    "parameters": [
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "$ref": "#/definitions/Overlay"
            }
        }
    ],
    "responses": {
        201: {
            "description": "Overlay created successfully",
            "schema": {
                "$ref": "#/definitions/CreateResponse"
            }
        },
        400: {
            "description": "Invalid input data"
        }
    }
})
def create_overlay():
    db = get_db()
    data = request.get_json()
    data.setdefault('visible', True)
    data.setdefault('x', 0)
    data.setdefault('y', 0)
    result = db['overlays'].insert_one(data)
    return jsonify({
        "message": "Overlay created",
        "id": str(result.inserted_id)
    }), 201

@overlay_bp.route("/api/overlays/<id>", methods=["PUT"])
@swag_from({
    "tags": ["Overlays"],
    "summary": "Update an existing overlay",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "type": "string",
            "required": True,
            "description": "Overlay ID"
        },
        {
            "name": "body",
            "in": "body",
            "required": True,
            "schema": {
                "$ref": "#/definitions/OverlayUpdate"
            }
        }
    ],
    "responses": {
        200: {
            "description": "Overlay updated successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Overlay updated"
                    }
                }
            }
        },
        404: {
            "description": "Overlay not found"
        }
    }
})
def update_overlay(id):
    db = get_db()
    data = request.get_json()
    data.pop('_id', None)
    db['overlays'].update_one({"_id": ObjectId(id)}, {"$set": data})
    return jsonify({"message": "Overlay updated"}), 200

@overlay_bp.route("/api/overlays/<id>", methods=["DELETE"])
@swag_from({
    "tags": ["Overlays"],
    "summary": "Delete an overlay",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "type": "string",
            "required": True,
            "description": "Overlay ID"
        }
    ],
    "responses": {
        200: {
            "description": "Overlay deleted successfully",
            "schema": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "example": "Overlay deleted"
                    }
                }
            }
        },
        404: {
            "description": "Overlay not found"
        }
    }
})
def delete_overlay(id):
    db = get_db()
    db['overlays'].delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Overlay deleted"}), 200
