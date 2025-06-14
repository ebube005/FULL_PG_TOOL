from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

@app.route('/save-rankings', methods=['POST'])
def save_rankings():
    try:
        data = request.get_json(force=True)
        print("Received data:", data)  # Should log slider values

        if not data:
            print("Error: No data received or JSON format is wrong.")
            return jsonify({"error": "No data received"}), 400

        # Save timestamped version
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamped_filename = f"rankings_{timestamp}.json"
        timestamped_filepath = os.path.join(DATA_DIR, timestamped_filename)

        # Try writing files
        with open(timestamped_filepath, "w") as f:
            json.dump(data, f, indent=2)
        print(" Saved:", timestamped_filename)

        latest_filepath = os.path.join(DATA_DIR, "latest_rankings.json")
        with open(latest_filepath, "w") as f:
            json.dump(data, f, indent=2)
        print("Updated: latest_rankings.json")

        return jsonify({"message": "User rankings saved successfully."}), 200

    except Exception as e:
        print("Exception occurred:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)