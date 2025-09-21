from flask import Flask, request, jsonify
import torch
import librosa
import numpy as np
import os
import json
from pathlib import Path
import tempfile
import logging
from datetime import datetime
from train_voice_emotion_model import VoiceEmotionModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Global model instance
model = None
model_loaded = False

def load_model():
    """Load the trained voice emotion model"""
    global model, model_loaded
    
    try:
        model_path = "./voice_emotion_model"
        
        if not os.path.exists(model_path):
            logger.error(f"Model path {model_path} does not exist!")
            return False
        
        logger.info("Loading voice emotion recognition model...")
        model = VoiceEmotionModel()
        model.load_model()
        
        # Load the trained weights if they exist
        if os.path.exists(f"{model_path}/pytorch_model.bin"):
            model.model.load_state_dict(torch.load(f"{model_path}/pytorch_model.bin", map_location='cpu'))
            logger.info("Loaded trained model weights")
        
        model_loaded = True
        logger.info("✅ Model loaded successfully!")
        return True
        
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return False

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_emotion():
    """Predict emotion from uploaded audio file"""
    global model, model_loaded
    
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded',
            'message': 'Voice emotion model is not available'
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
            # Predict emotion
            logger.info(f"Analyzing audio file: {audio_file.filename}")
            prediction = model.predict_emotion(temp_path)
            
            if 'error' in prediction:
                return jsonify({
                    'error': 'Prediction failed',
                    'message': prediction['error']
                }), 500
            
            # Add metadata
            result = {
                'success': True,
                'emotion': prediction['emotion'],
                'confidence': prediction['confidence'],
                'probabilities': prediction['probabilities'],
                'metadata': {
                    'filename': audio_file.filename,
                    'timestamp': datetime.now().isoformat(),
                    'model_version': '1.0.0'
                }
            }
            
            logger.info(f"Prediction successful: {prediction['emotion']} (confidence: {prediction['confidence']:.3f})")
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
    emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
    return jsonify({
        'emotions': emotions,
        'count': len(emotions),
        'description': 'Supported emotion categories for voice recognition'
    })

@app.route('/model_info', methods=['GET'])
def get_model_info():
    """Get information about the loaded model"""
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    return jsonify({
        'model_name': model.model_name if model else 'Unknown',
        'num_labels': model.num_labels if model else 0,
        'model_loaded': model_loaded,
        'supported_formats': ['wav', 'mp3', 'm4a', 'flac'],
        'max_duration': '10 seconds',
        'sample_rate': '16000 Hz'
    })

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """Predict emotions for multiple audio files"""
    global model, model_loaded
    
    if not model_loaded:
        return jsonify({
            'error': 'Model not loaded'
        }), 500
    
    try:
        if 'audio_files' not in request.files:
            return jsonify({
                'error': 'No audio files provided',
                'message': 'Please upload audio files with key "audio_files"'
            }), 400
        
        audio_files = request.files.getlist('audio_files')
        
        if len(audio_files) == 0:
            return jsonify({
                'error': 'No audio files selected'
            }), 400
        
        if len(audio_files) > 10:  # Limit batch size
            return jsonify({
                'error': 'Too many files',
                'message': 'Maximum 10 files allowed per batch'
            }), 400
        
        results = []
        
        for i, audio_file in enumerate(audio_files):
            try:
                # Save temporarily
                with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                    audio_file.save(temp_file.name)
                    temp_path = temp_file.name
                
                try:
                    prediction = model.predict_emotion(temp_path)
                    
                    if 'error' not in prediction:
                        results.append({
                            'filename': audio_file.filename,
                            'emotion': prediction['emotion'],
                            'confidence': prediction['confidence'],
                            'success': True
                        })
                    else:
                        results.append({
                            'filename': audio_file.filename,
                            'error': prediction['error'],
                            'success': False
                        })
                        
                finally:
                    try:
                        os.unlink(temp_path)
                    except:
                        pass
                        
            except Exception as e:
                results.append({
                    'filename': audio_file.filename,
                    'error': str(e),
                    'success': False
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total_files': len(audio_files),
            'successful_predictions': sum(1 for r in results if r.get('success', False))
        })
        
    except Exception as e:
        logger.error(f"Error in batch_predict: {e}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large',
        'message': 'Audio file size exceeds maximum allowed size (10MB)'
    }), 413

@app.errorhandler(400)
def bad_request(e):
    """Handle bad request error"""
    return jsonify({
        'error': 'Bad request',
        'message': str(e)
    }), 400

@app.errorhandler(500)
def internal_error(e):
    """Handle internal server error"""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    # Load model on startup
    logger.info("🚀 Starting Voice Emotion Recognition API...")
    
    if load_model():
        logger.info("✅ Model loaded successfully!")
        logger.info("🌐 API endpoints available:")
        logger.info("  - POST /predict - Predict emotion from single audio file")
        logger.info("  - POST /batch_predict - Predict emotions from multiple files")
        logger.info("  - GET /emotions - Get supported emotions")
        logger.info("  - GET /model_info - Get model information")
        logger.info("  - GET /health - Health check")
        
        # Start Flask app
        app.run(
            host='0.0.0.0',
            port=5001,
            debug=False,
            threaded=True
        )
    else:
        logger.error("❌ Failed to load model. Exiting...")
        exit(1)
