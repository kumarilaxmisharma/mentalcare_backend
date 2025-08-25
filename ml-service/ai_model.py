# import pandas as pd
# import joblib
# from xgboost import XGBClassifier
# from flask import Flask, request, jsonify


# @app.route('/predict', methods=['POST'])
# def predict():
#     input_data = request.json
#     result = predict_risk(input_data)
#     return jsonify(result)

# # --- Part 1: Load the Trained Model ---
# # Load the pre-trained XGBoost model and the list of feature columns
# try:
#     model = joblib.load('mental_health_model.pkl')
#     model_columns = joblib.load('model_columns.pkl')
#     print("✅ Model and columns loaded successfully.")
# except FileNotFoundError:
#     print("🔴 Error: Model files not found. Please ensure 'mental_health_model.pkl' and 'model_columns.pkl' are in the same directory.")
#     model = None
#     model_columns = None

# # --- Part 2: Data Processing Function ---
# def preprocess_input(input_data):
#     """
#     Cleans, transforms, and prepares raw input data into a machine-readable format.

#     Args:
#         input_data (dict): A dictionary containing the user's questionnaire answers.

#     Returns:
#         pd.DataFrame: A single-row DataFrame ready for prediction.
#     """
#     # Convert the input dictionary to a pandas DataFrame
#     df = pd.DataFrame([input_data])

#     # 1. Gender Cleaning
#     gender_map = {'Female': 0, 'Non-Binary': 1, 'Male': 2}
#     df['gender'] = df['gender'].map(gender_map)

#     # 2. Age Group Mapping
#     age_map = {'55+': 1, '45-54': 2, '35-44': 3, '25-34': 4, '18-24': 5}
#     df['age_group'] = df['age_group'].map(age_map)

#     # 3. Ordinal Mapping (features with a clear order)
#     ordinal_maps = {
#         'work_interfere': {'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, "Don't know": -1},
#         'leave': {'Very difficult': 0, 'Somewhat difficult': 1, "Don't know": 2, 'Somewhat easy': 3, 'Very easy': 4},
#         'nb_employees': {'1-5': 0, '6-25': 1, '26-100': 2, '100-500': 3, '500-1000': 4, 'More than 1000': 5},
#         'coworkers': {'No': 0, 'Some of them': 1, 'Yes': 2},
#         'supervisor': {'No': 0, 'Some of them': 1, 'Yes': 2},
#         'mental_health_consequence': {'No': 0, 'Maybe': 1, 'Yes': 2},
#         'phys_health_consequence': {'No': 0, 'Maybe': 1, 'Yes': 2},
#         'mental_health_interview': {'No': 0, 'Maybe': 1, 'Yes': 2},
#         'phys_health_interview': {'No': 0, 'Maybe': 1, 'Yes': 2}
#     }
#     for col, mapping in ordinal_maps.items():
#         df[col] = df[col].map(mapping)

#     # 4. Yes/No/Don't Know Mapping
#     yes_no_unknown_cols = ['self_employed', 'benefits', 'care_options', 'wellness_program', 'seek_help', 'anonymity', 'mental_vs_physical']
#     for col in yes_no_unknown_cols:
#         df[col] = df[col].map({'No': 0, 'Yes': 1, "Don't know": -1})
        
#     # 5. Simple Yes/No Mapping
#     binary_cols = ['family_history', 'treatment', 'remote_work', 'tech_company', 'obs_consequence']
#     for col in binary_cols:
#         df[col] = df[col].map({'No': 0, 'Yes': 1})

#     # Ensure the final DataFrame has the same columns in the same order as the training data
#     return df.reindex(columns=model_columns, fill_value=0)

# # --- Part 3: Prediction Function ---
# # In ai_model.py

# def predict_risk(input_data):
#     """
#     Takes raw user input, preprocesses it, and returns the predicted risk level.
#     """
#     if model is None:
#         return {"error": "Model not loaded. Cannot make predictions."}

#     # Preprocess the input data
#     processed_df = preprocess_input(input_data)
    
#     # Make a prediction (returns 0, 1, or 2)
#     prediction = model.predict(processed_df)[0]
    
#     # Map the numerical prediction back to a human-readable label
#     risk_labels = {
#         0: "Low Concern",
#         1: "Moderate Concern",
#         2: "High Concern"
#     }
    
#     # Use direct access since the prediction will always be 0, 1, or 2
#     risk_level = risk_labels[prediction]

#     return {
#         "risk_level_code": int(prediction),
#         "risk_level_label": risk_level
#     }

# # --- Example Usage (for testing) ---
# if __name__ == '__main__':
#     # This block will only run when you execute `python ai_model.py` directly
    
#     # Sample input representing one user's answers
#     sample_input = {
#         'age_group': '25-34',
#         'gender': 'Female',
#         'self_employed': 'No',
#         'family_history': 'No',
#         'treatment': 'Yes',
#         'work_interfere': 'Sometimes',
#         'nb_employees': '100-500',
#         'remote_work': 'No',
#         'tech_company': 'Yes',
#         'benefits': 'Yes',
#         'care_options': 'Yes',
#         'wellness_program': 'No',
#         'seek_help': 'Yes',
#         'anonymity': 'Yes',
#         'leave': 'Somewhat easy',
#         'mental_health_consequence': 'No',
#         'phys_health_consequence': 'No',
#         'coworkers': 'Some of them',
#         'supervisor': 'Yes',
#         'mental_health_interview': 'No',
#         'phys_health_interview': 'Maybe',
#         'mental_vs_physical': 'Yes',
#         'obs_consequence': 'No'
#     }

#     # Get the prediction
#     result = predict_risk(sample_input)
#     print(f"--- Prediction Result ---")
#     print(f"Predicted Risk Level: {result['risk_level_label']} (Code: {result['risk_level_code']})")