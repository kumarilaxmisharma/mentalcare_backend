from flask import Flask, request, jsonify
import pandas as pd
import joblib

# Initialize the Flask application
app = Flask(__name__)

# --- Load the Model and Columns ---
# This is crucial for ensuring the data structure is identical to the training phase
try:
    model = joblib.load('mental_health_model.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("✅ Model and columns loaded successfully.")
except FileNotFoundError:
    model = None
    model_columns = None
    print("🔴 Error: Model files not found. Ensure 'mental_health_model.pkl' and 'model_columns.pkl' are present.")

# In ml-service/app.py

def preprocess_input(input_data):
    """
    Cleans, transforms, and prepares raw JSON input into a machine-readable DataFrame.
    """
    df = pd.DataFrame([input_data])

    # ✅ FIX: Standardize all 'unknown' variations at the beginning
    df.replace(["Not sure"], "Don't know", inplace=True)

    # 1. Gender Cleaning
    gender_map = {'Female': 0, 'Non-Binary': 1, 'Male': 2}
    df['gender'] = df['gender'].map(gender_map)

    # 2. Age Group Mapping
    age_map = {'55+': 1, '45-54': 2, '35-44': 3, '25-34': 4, '18-24': 5}
    df['age_group'] = df['age_group'].map(age_map)

    # 3. Ordinal Mapping
    ordinal_maps = {
        'work_interfere': {'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, "Don't know": -1},
        'leave': {'Very difficult': 0, 'Somewhat difficult': 1, "Don't know": 2, 'Somewhat easy': 3, 'Very easy': 4},
        'nb_employees': {'1-5': 0, '6-25': 1, '26-100': 2, '100-500': 3, '500-1000': 4, 'More than 1000': 5},
        'coworkers': {'No': 0, 'Some of them': 1, 'Yes': 2},
        'supervisor': {'No': 0, 'Some of them': 1, 'Yes': 2},
        'mental_health_consequence': {'No': 0, 'Maybe': 1, 'Yes': 2},
        'phys_health_consequence': {'No': 0, 'Maybe': 1, 'Yes': 2},
        'mental_health_interview': {'No': 0, 'Maybe': 1, 'Yes': 2},
        'phys_health_interview': {'No': 0, 'Maybe': 1, 'Yes': 2}
    }
    for col, mapping in ordinal_maps.items():
        if col in df.columns:
            # ✅ FIX: Fill any unmapped/null values with -1 (for "Don't know")
            df[col] = df[col].map(mapping).fillna(-1)

    # 4. Yes/No/Don't Know Mapping
    yes_no_unknown_cols = ['self_employed', 'benefits', 'care_options', 'wellness_program', 'seek_help', 'anonymity', 'mental_vs_physical']
    for col in yes_no_unknown_cols:
        if col in df.columns:
            # ✅ FIX: Fill any unmapped/null values with -1
            df[col] = df[col].map({'No': 0, 'Yes': 1, "Don't know": -1}).fillna(-1)

    # 5. Simple Yes/No Mapping
    binary_cols = ['family_history', 'treatment', 'remote_work', 'tech_company', 'obs_consequence']
    for col in binary_cols:
        if col in df.columns:
            # ✅ FIX: Fill any unmapped/null values with 0 (for "No")
            df[col] = df[col].map({'No': 0, 'Yes': 1}).fillna(0)

    # Ensure final DataFrame has the same columns in the same order as training data
    return df.reindex(columns=model_columns, fill_value=0)

# --- Define the Prediction Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500

    try:
        # The endpoint now expects the full JSON object with named keys
        input_data = request.get_json()

        # ✅ ADD THIS LINE TO DEBUG
        print("Received data for prediction:", input_data)

        # Preprocess the raw JSON into a model-ready DataFrame
        processed_df = preprocess_input(input_data)
        
        # Make a prediction
        prediction = model.predict(processed_df)
        
        # Convert prediction to a standard Python integer
        raw_prediction = int(prediction[0])

        # Map the numerical prediction to a human-readable risk level
        risk_map = {
            0: 'Low Concern',
            1: 'Moderate Concern',
            2: 'High Concern'
        }
        risk_level = risk_map.get(raw_prediction)

        return jsonify({'risk_level_label': risk_level, 'risk_level_code': raw_prediction})

    except Exception as e:
        return jsonify({'error': f'An error occurred during prediction: {str(e)}'}), 500

# This allows the script to be run directly for testing
if __name__ == '__main__':
    app.run(port=5001, debug=True)