import json
import sys
from os.path import abspath, dirname

sys.path.append(abspath(dirname(__file__)))

from backend.app import app

with app.test_client() as client:
    response = client.get('/swagger.json')
    with open('docs/api/swagger.json', 'w') as f:
        json.dump(response.json, f, indent=2)
    print("Swagger JSON generated at docs/api/swagger.json")