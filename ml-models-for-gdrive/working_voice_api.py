from flask import Flask, request, jsonify
import joblib
import librosa
import numpy as np
import os
import json
import tempfile
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global model components
model = None
scaler = None
label_encoder = None
model_loaded = False

def load_model():
    """Load the trained ultra-simple voice emotion model"""
    global model, scaler, label_encoder, model_loaded
    
    try:
        model_path = "./ultra_simple_voice_emotion_model"
        
        if not os.path.exists(model_path):
            logger.error(f"Model path {model_path} does not exist!")
            return False
        
        logger.info("Loading ultra-simple voice emotion recognition model...")
        
        # Load model components
        model = joblib.load(f"{model_path}/ultra_simple_model.pkl")
        scaler = joblib.load(f"{model_path}/ultra_simple_scaler.pkl")
        label_encoder = joblib.load(f"{model_path}/ultra_simple_label_encoder.pkl")
        
        model_loaded = True
        logger.info("✅ Ultra-simple model loaded successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Failed to load ultra-simple model: {e}")
        return False

def extract_ultra_simple_features(audio_path: str) -> np.ndarray:
    """Extract ultra-simple audio features for classification"""
    try:
        # Load audio file
        audio, sample_rate = librosa.load(audio_path, sr=16000)
        
        # Extract ultra-simple features (only basic ones)
        features = []
        
        # Pitch features
        pitches, magnitudes = librosa.piptrack(y=audio, sr=sample_rate)
        pitch_values = pitches[pitches > 0]
        if len(pitch_values) > 0:
            features.extend([
                float(np.mean(pitch_values)),
                float(np.std(pitch_values)),
                float(np.max(pitch_values)),
                float(np.min(pitch_values))
            ])
        else:
            features.extend([0.0, 0.0, 0.0, 0.0])
        
        # Energy features (RMS)
        rms = librosa.feature.rms(y=audio)[0]
        features.extend([
            float(np.mean(rms)),
            float(np.std(rms)),
            float(np.max(rms)),
            float(np.min(rms))
        ])
        
        # Spectral features
        spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sample_rate)[0]
        features.extend([
            float(np.mean(spectral_centroids)),
            float(np.std(spectral_centroids))
        ])
        
        # Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(audio)[0]
        features.extend([
            float(np.mean(zcr)),
            float(np.std(zcr))
        ])
        
        # MFCC features (first 3 coefficients only)
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=3)
        for i in range(3):
            features.extend([
                float(np.mean(mfccs[i])),
                float(np.std(mfccs[i]))
            ])
        
        return np.array(features, dtype=np.float32)
        
    except Exception as e:
        logger.error(f"Error extracting ultra-simple features from {audio_path}: {e}")
        return np.zeros(18, dtype=np.float32)  # Return zero features if extraction fails

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'model_type': 'ultra_simple',
        'accuracy': '77%',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_emotion():
    """Predict emotion from uploaded audio file"""
    global model, scaler, label_encoder, model_loaded
    
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'message': 'Ultra-simple voice emotion model is not available'
        }), 500
    
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({
                'error': 'No audio file provided',
                'message': 'Please upload an audio file with key "audio"'
            }), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({
                'error': 'No audio file selected',
                'message': 'Please select an audio file to upload'
            }), 400
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio_file.save(temp_file.name)
            temp_path = temp_file.name
        
        try:
            # Extract features and predict
            logger.info(f"Analyzing audio file: {audio_file.filename}")
            
            features = extract_ultra_simple_features(temp_path)
            features_scaled = scaler.transform(features.reshape(1, -1))
            
            # Get prediction probabilities
            probabilities = model.predict_proba(features_scaled)[0]
            predicted_class = np.argmax(probabilities)
            confidence = probabilities[predicted_class]
            
            emotion = label_encoder.inverse_transform([predicted_class])[0]
            
            # Get all emotion probabilities
            emotion_probabilities = {}
            for i, emotion_name in enumerate(label_encoder.classes_):
                emotion_probabilities[emotion_name] = float(probabilities[i])
            
            result = {
                'success': True,
                'emotion': emotion,
                'confidence': float(confidence),
                'probabilities': emotion_probabilities,
                'metadata': {
                    'filename': audio_file.filename,
                    'timestamp': datetime.now().isoformat(),
                    'model_version': 'ultra_simple_1.0.0',
                    'model_type': 'RandomForestClassifier',
                    'accuracy': '77%',
                    'features': 18
                }
            }
            
            logger.info(f"Prediction successful: {emotion} (confidence: {confidence:.3f})")
            return jsonify(result)
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_path)
            except:
                pass
                
    except Exception as e:
        logger.error(f"Error in predict_emotion: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/emotions', methods=['GET'])
def get_emotions():
    """Get list of supported emotions"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    emotions = list(label_encoder.classes_)
    return jsonify({
        'emotions': emotions,
        'count': len(emotions),
        'description': 'Supported emotion categories for ultra-simple voice recognition'
    })

@app.route('/model_info', methods=['GET'])
def get_model_info():
    """Get information about the loaded model"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    try:
        # Load model info from JSON file
        with open('./ultra_simple_voice_emotion_model/ultra_simple_model_info.json', 'r') as f:
            model_info = json.load(f)
        
        return jsonify({
            'model_type': model_info.get('model_type', 'RandomForestClassifier'),
            'num_features': model_info.get('num_features', 18),
            'num_labels': model_info.get('num_labels', 7),
            'emotions': model_info.get('emotions', []),
            'test_accuracy': model_info.get('test_accuracy', 0.77),
            'validation_accuracy': model_info.get('validation_accuracy', 0.7143),
            'model_loaded': model_loaded,
            'supported_formats': ['wav', 'mp3', 'm4a', 'flac'],
            'max_duration': '10 seconds',
            'sample_rate': '16000 Hz',
            'feature_extraction': 'Ultra-Simple (18 features)'
        })
        
    except Exception as e:
        return jsonify({
            'model_type': 'RandomForestClassifier',
            'num_features': 18,
            'num_labels': 7,
            'emotions': list(label_encoder.classes_) if label_encoder else [],
            'test_accuracy': 0.77,
            'validation_accuracy': 0.7143,
            'model_loaded': model_loaded,
            'supported_formats': ['wav', 'mp3', 'm4a', 'flac'],
            'max_duration': '10 seconds',
            'sample_rate': '16000 Hz',
            'feature_extraction': 'Ultra-Simple (18 features)',
            'error': f'Could not load model info: {e}'
        })

if __name__ == '__main__':
    # Load model on startup
    logger.info("🚀 Starting Ultra-Simple Voice Emotion Recognition API...")
    
    if load_model():
        logger.info("✅ Ultra-simple model loaded successfully!")
        logger.info("🌐 API endpoints available:")
        logger.info("  - POST /predict - Predict emotion from single audio file")
        logger.info("  - GET /emotions - Get supported emotions")
        logger.info("  - GET /model_info - Get model information")
        logger.info("  - GET /health - Health check")
        logger.info("📊 Model Performance: 77% accuracy")
        
        # Start Flask app
        app.run(
            host='0.0.0.0',
            port=5001,
            debug=False,
            threaded=True
        )
    else:
        logger.error("❌ Failed to load ultra-simple model. Exiting...")
        exit(1)
