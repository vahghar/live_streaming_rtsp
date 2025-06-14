from pymongo import MongoClient
from flask import current_app, g

def get_db():
    if 'db_client' not in g:
        mongo_uri = current_app.config['MONGODB_URI']
        client = MongoClient(mongo_uri)
        db_name = mongo_uri.split('/')[-1].split('?')[0] if '/' in mongo_uri else 'livestream_db'
        db = client[db_name]
        try:
            db.command("ping")
            print("Successfully connected to MongoDB.")
        except Exception as e:
            print("MongoDB connection failed:", e)

        g.db_client = client
        g.db = db
    return g.db

def close_db(e=None):
    db_client = g.pop('db_client', None)
    if db_client is not None:
        db_client.close()
