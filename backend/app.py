from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import get_db, close_db
from routes import overlay_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MONGODB_URI'] = os.getenv("DATABASE_URI", "")

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "a_very_secret_key_for_your_app")

app.teardown_appcontext(close_db)

app.register_blueprint(overlay_bp)


@app.route("/")
def home():
    try:
        db = get_db()
        db.command('ping') 
        return "Welcome to this app's backend! Database connected."
    except Exception as e:
        return f"Welcome to this app's backend! Database connection failed: {e}"

if __name__ == "__main__":
    app.run(debug=True)

