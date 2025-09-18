from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os

# --- Initialization ---
app = Flask(__name__)
CORS(app)

# The path should be relative to where you run the command (the 'project1' root)
model_path = "./cbt_model" 
distortion_classifier = None

# --- Load the Model ---
if not os.path.exists(model_path):
    print(f"❌ Error: Model directory not found at '{model_path}'")
else:
    try:
        print("Loading CBT model...")
        distortion_classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
        print("✅ CBT model loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

# --- API Endpoint ---
@app.route('/predict', methods=['POST'])
def predict():
    if not distortion_classifier:
        return jsonify({'error': 'Model is not loaded. Check server logs.'}), 500

    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided in JSON payload'}), 400

    journal_text = data.get('text')
    if not isinstance(journal_text, str) or not journal_text.strip():
        return jsonify({'error': 'Text must be a non-empty string'}), 400

    try:
        # Get all predictions sorted by score
        results = distortion_classifier(journal_text, top_k=None)
        
        # --- THIS IS THE FIX ---
        # The result is a simple list, so we just need the first item.
        top_prediction = results[0]

        response = {
            'predicted_distortion': top_prediction['label'],
            'confidence_score': round(top_prediction['score'], 4)
        }
        return jsonify(response)
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'An error occurred during prediction.'}), 500

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)