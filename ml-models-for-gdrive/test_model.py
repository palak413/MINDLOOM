#!/usr/bin/env python3
"""
Test script for the ultra-simple voice emotion model
"""

import joblib
import numpy as np
import os

def test_model():
    """Test if the model can be loaded and used"""
    try:
        print("🧪 Testing Ultra-Simple Voice Emotion Model...")
        
        # Check if model files exist
        model_path = "./ultra_simple_voice_emotion_model"
        if not os.path.exists(model_path):
            print("❌ Model directory not found!")
            return False
        
        print("✅ Model directory found")
        
        # Load model components
        print("📦 Loading model components...")
        model = joblib.load(f"{model_path}/ultra_simple_model.pkl")
        scaler = joblib.load(f"{model_path}/ultra_simple_scaler.pkl")
        label_encoder = joblib.load(f"{model_path}/ultra_simple_label_encoder.pkl")
        
        print("✅ Model components loaded successfully")
        
        # Test prediction with dummy data
        print("🔮 Testing prediction with dummy data...")
        dummy_features = np.random.rand(1, 18)  # 18 features
        dummy_features_scaled = scaler.transform(dummy_features)
        
        # Get prediction
        probabilities = model.predict_proba(dummy_features_scaled)[0]
        predicted_class = np.argmax(probabilities)
        confidence = probabilities[predicted_class]
        emotion = label_encoder.inverse_transform([predicted_class])[0]
        
        print(f"✅ Prediction successful!")
        print(f"   Emotion: {emotion}")
        print(f"   Confidence: {confidence:.3f}")
        print(f"   All probabilities: {dict(zip(label_encoder.classes_, probabilities))}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_model()
    if success:
        print("\n🎉 Model test completed successfully!")
    else:
        print("\n💥 Model test failed!")
