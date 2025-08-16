# In your 'ml-service' folder, this is the content of 'app.py'

from flask import Flask, request, jsonify
import joblib
import numpy as np

# Initialize the Flask application
app = Flask(__name__)

# Load your trained model from the file you downloaded from Colab
# Make sure the filename here matches the file you downloaded.
try:
    model = joblib.load('mental_health_model.pkl')
except FileNotFoundError:
    model = None

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model file not found. Make sure mental_health_model.pkl is in the ml-service folder.'}), 500

    try:
        data = request.get_json()
        answers = data['answers']
        
        # Ensure the input is a list of numbers
        if not isinstance(answers, list) or not all(isinstance(x, (int, float)) for x in answers):
            return jsonify({'error': 'Input must be a list of numbers.'}), 400

        # The model expects a 2D array for prediction, so we wrap the answers in another list
        features = [np.array(answers)]
        
        # Make a prediction
        prediction = model.predict(features)
        
        # Convert the prediction (which is a numpy array) to a standard Python number
        raw_prediction = int(prediction[0])

        # Map the numerical prediction to a human-readable risk level
        # You may need to adjust this map to match your model's labels
        risk_map = {0: 'Low', 1: 'Moderate', 2: 'High'}
        risk_level = risk_map.get(raw_prediction, 'Unknown')

        return jsonify({'riskLevel': risk_level})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# This allows the script to be run directly for testing
if __name__ == '__main__':
    app.run(port=5000, debug=True)