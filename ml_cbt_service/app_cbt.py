from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import os

app = Flask(__name__)
CORS(app)

model_path = "./cbt_model"

# Check if model exists before loading
if not os.path.exists(model_path):
    print(f"Error: Model directory not found at {model_path}")
    print("Please run train_cbt.py to train and save the model first.")
    distortion_classifier = None
else:
    print("Loading CBT model...")
    distortion_classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
    print("CBT model loaded successfully.")

@app.route('/detect-distortions', methods=['POST'])
def detect():
    if not distortion_classifier:
        return jsonify({'error': 'Model is not loaded.'}), 500

    data = request.json
    journal_text = data.get('text')
    if not journal_text:
        return jsonify({'error': 'No text provided'}), 400

    results = distortion_classifier(journal_text, top_k=None)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=False, port=5001)