from flask import Flask
from flasgger import Swagger
from flask_cors import CORS
import copy
import os
from dotenv import load_dotenv
from database import get_db, close_db
from routes.stream import stream_bp
from routes.overlays import overlay_bp
from flask import send_from_directory
from flask import jsonify

load_dotenv()

app = Flask(__name__, static_folder="static")
CORS(app)

from flasgger import Swagger

swagger_template = {
    'info': {
        'version': '1.0',
        'title': 'Video Streaming API',
        'description': 'API for managing video streams and overlays'
    },
    'definitions': {
        "Overlay": {
            "type": "object",
            "properties": {
                "text": {"type": "string"},
                "fontSize": {"type": "integer", "default": 16},
                "color": {"type": "string", "default": "#ffffff"},
                "backgroundColor": {"type": "string", "default": "rgba(0,0,0,0.6)"},
                "x": {"type": "number", "default": 0},
                "y": {"type": "number", "default": 0},
                "visible": {"type": "boolean", "default": True}
            },
            "required": ["text"]
        }
    }
}

swagger_config = {
    'headers': [],
    'specs': [
        {
            'endpoint': 'apispec',
            'route': '/apispec.json'
        }
    ],
    'static_url_path': '/flasgger_static',
    'swagger_ui': True,
    'specs_route': '/api-docs/',
    'swagger_ui_bundle_js': '//unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js',
    'swagger_ui_standalone_preset_js': '//unpkg.com/swagger-ui-dist@3/swagger-ui-standalone-preset.js',
    'jquery_js': '//unpkg.com/jquery@2.2.4/dist/jquery.min.js',
    'swagger_ui_css': '//unpkg.com/swagger-ui-dist@3/swagger-ui.css',
}

Swagger(app, config=swagger_config, template=swagger_template)


app.config['MONGODB_URI'] = os.getenv("DATABASE_URI", "")

app.teardown_appcontext(close_db)

app.register_blueprint(overlay_bp)
app.register_blueprint(stream_bp)

@app.route("/")
def home():
    try:
        db = get_db()
        db.command('ping') 
        return "Welcome to this app's backend! Database connected."
    except Exception as e:
        return f"Welcome to this app's backend! Database connection failed: {e}"
    
@app.route('/static/hls/<path:filename>')
def serve_hls(filename):
    return send_from_directory(os.path.join(app.static_folder, 'hls'), filename)

@app.route('/swagger.json')
def swagger_spec():
    """Endpoint to serve Swagger JSON configuration"""
    safe_config = copy.deepcopy(swagger_config)
    return jsonify(safe_config)

if __name__ == "__main__":
    app.run(debug=True)