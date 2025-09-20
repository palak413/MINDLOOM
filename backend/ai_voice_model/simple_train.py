#!/usr/bin/env python3
"""
Simplified Voice Emotion Recognition Model Training Script
This script trains a custom AI model for voice emotion recognition using Wav2Vec2.
"""

import os
import sys
import json
import torch
import torchaudio
import librosa
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class SimpleVoiceEmotionDataset:
    """Simplified dataset class for voice emotion recognition"""
    
    def __init__(self, data_dir: str, emotions: list = None):
        self.data_dir = Path(data_dir)
        self.emotions = emotions or ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        self.label_encoder = LabelEncoder()
        self.label_encoder.fit(self.emotions)
        
    def create_synthetic_dataset(self, num_samples_per_emotion: int = 100) -> pd.DataFrame:
        """Create a synthetic dataset for demonstration purposes"""
        print("Creating synthetic voice emotion dataset...")
        
        data = []
        for emotion in self.emotions:
            for i in range(num_samples_per_emotion):
                # Generate synthetic audio features
                sample = {
                    'file_path': f"synthetic_{emotion}_{i:03d}.wav",
                    'emotion': emotion,
                    'duration': np.random.uniform(2.0, 8.0),  # 2-8 seconds
                    'sample_rate': 16000,
                    'pitch_mean': self._get_emotion_pitch(emotion),
                    'pitch_std': np.random.uniform(20, 80),
                    'energy_mean': self._get_emotion_energy(emotion),
                    'energy_std': np.random.uniform(0.01, 0.05),
                    'is_synthetic': True
                }
                data.append(sample)
        
        df = pd.DataFrame(data)
        print(f"Created synthetic dataset with {len(df)} samples")
        return df
    
    def _get_emotion_pitch(self, emotion: str) -> float:
        """Get typical pitch range for emotion"""
        pitch_ranges = {
            'happy': np.random.uniform(200, 300),
            'sad': np.random.uniform(100, 180),
            'angry': np.random.uniform(180, 250),
            'fear': np.random.uniform(200, 280),
            'surprise': np.random.uniform(220, 320),
            'disgust': np.random.uniform(120, 200),
            'neutral': np.random.uniform(150, 220)
        }
        return pitch_ranges[emotion]
    
    def _get_emotion_energy(self, emotion: str) -> float:
        """Get typical energy level for emotion"""
        energy_ranges = {
            'happy': np.random.uniform(0.08, 0.15),
            'sad': np.random.uniform(0.02, 0.06),
            'angry': np.random.uniform(0.10, 0.18),
            'fear': np.random.uniform(0.06, 0.12),
            'surprise': np.random.uniform(0.08, 0.16),
            'disgust': np.random.uniform(0.03, 0.08),
            'neutral': np.random.uniform(0.04, 0.08)
        }
        return energy_ranges[emotion]
    
    def create_synthetic_audio(self, features: dict, output_path: str):
        """Create synthetic audio from features (for demonstration)"""
        try:
            # Generate synthetic audio based on features
            duration = features.get('duration', 3.0)
            sample_rate = 16000
            t = np.linspace(0, duration, int(sample_rate * duration))
            
            # Create a simple sine wave with modulation based on emotion
            base_freq = features.get('pitch_mean', 200)
            audio = np.sin(2 * np.pi * base_freq * t)
            
            # Add some noise and modulation
            noise_level = features.get('energy_mean', 0.05)
            audio += np.random.normal(0, noise_level, len(audio))
            
            # Apply envelope
            envelope = np.exp(-t * 0.5)  # Decay envelope
            audio *= envelope
            
            # Normalize
            audio = audio / np.max(np.abs(audio)) * 0.3
            
            # Save as WAV file
            import soundfile as sf
            sf.write(output_path, audio, sample_rate)
            
        except Exception as e:
            print(f"Error creating synthetic audio: {e}")

class SimpleVoiceEmotionModel:
    """Simplified Voice Emotion Recognition Model"""
    
    def __init__(self, num_labels: int = 7):
        self.num_labels = num_labels
        self.model = None
        self.label_encoder = LabelEncoder()
        self.emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        self.label_encoder.fit(self.emotions)
        
    def extract_features(self, audio_path: str) -> np.ndarray:
        """Extract audio features for classification"""
        try:
            # Load audio file
            audio, sample_rate = librosa.load(audio_path, sr=16000)
            
            # Extract features
            features = []
            
            # Pitch features
            pitches, magnitudes = librosa.piptrack(y=audio, sr=sample_rate)
            pitch_values = pitches[pitches > 0]
            if len(pitch_values) > 0:
                features.extend([
                    np.mean(pitch_values),
                    np.std(pitch_values),
                    np.max(pitch_values),
                    np.min(pitch_values)
                ])
            else:
                features.extend([0, 0, 0, 0])
            
            # Energy features
            rms = librosa.feature.rms(y=audio)[0]
            features.extend([
                np.mean(rms),
                np.std(rms),
                np.max(rms),
                np.min(rms)
            ])
            
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sample_rate)[0]
            features.extend([
                np.mean(spectral_centroids),
                np.std(spectral_centroids)
            ])
            
            # Zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(audio)[0]
            features.extend([
                np.mean(zcr),
                np.std(zcr)
            ])
            
            # MFCC features (first 5 coefficients)
            mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=5)
            for i in range(5):
                features.extend([
                    np.mean(mfccs[i]),
                    np.std(mfccs[i])
                ])
            
            return np.array(features)
            
        except Exception as e:
            print(f"Error extracting features from {audio_path}: {e}")
            return np.zeros(20)  # Return zero features if extraction fails
    
    def train_simple_model(self, X_train, y_train, X_val, y_val):
        """Train a simple neural network model"""
        from sklearn.neural_network import MLPClassifier
        from sklearn.preprocessing import StandardScaler
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_val_scaled = scaler.transform(X_val)
        
        # Train MLP classifier
        self.model = MLPClassifier(
            hidden_layer_sizes=(100, 50),
            max_iter=1000,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1
        )
        
        print("Training simple neural network model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate on validation set
        val_score = self.model.score(X_val_scaled, y_val)
        print(f"Validation accuracy: {val_score:.4f}")
        
        return scaler
    
    def predict_emotion(self, audio_path: str, scaler) -> dict:
        """Predict emotion from audio file"""
        try:
            features = self.extract_features(audio_path)
            features_scaled = scaler.transform(features.reshape(1, -1))
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(features_scaled)[0]
            predicted_class = np.argmax(probabilities)
            confidence = probabilities[predicted_class]
            
            emotion = self.emotions[predicted_class]
            
            return {
                'emotion': emotion,
                'confidence': float(confidence),
                'probabilities': {
                    self.emotions[i]: float(probabilities[i]) 
                    for i in range(len(self.emotions))
                }
            }
            
        except Exception as e:
            return {'error': f'Prediction failed: {str(e)}'}

def main():
    """Main training pipeline"""
    print("🎤 Simplified Voice Emotion Recognition AI Model Training")
    print("=" * 60)
    
    # Initialize dataset
    dataset = SimpleVoiceEmotionDataset("./data")
    
    # Create synthetic dataset
    print("\n1️⃣ Creating dataset...")
    df = dataset.create_synthetic_dataset(num_samples_per_emotion=50)
    
    # Create data directory
    os.makedirs("./data", exist_ok=True)
    
    # Generate synthetic audio files
    print("\n2️⃣ Generating synthetic audio files...")
    for idx, row in df.iterrows():
        audio_path = os.path.join("./data", row['file_path'])
        dataset.create_synthetic_audio(row, audio_path)
        
        if (idx + 1) % 25 == 0:
            print(f"   Generated {idx + 1}/{len(df)} audio files...")
    
    print(f"   ✅ Generated {len(df)} synthetic audio files")
    
    # Prepare dataset for training
    print("\n3️⃣ Preparing dataset for training...")
    
    # Extract features for all audio files
    print("   Extracting features from audio files...")
    features_list = []
    labels_list = []
    
    # Initialize model to get extract_features method
    model = SimpleVoiceEmotionModel()
    
    for idx, row in df.iterrows():
        audio_path = os.path.join("./data", row['file_path'])
        if os.path.exists(audio_path):
            features = model.extract_features(audio_path)
            features_list.append(features)
            labels_list.append(row['emotion'])
        
        if (idx + 1) % 25 == 0:
            print(f"   Processed {idx + 1}/{len(df)} files...")
    
    X = np.array(features_list)
    y = dataset.label_encoder.transform(labels_list)
    
    print(f"   ✅ Extracted features from {len(features_list)} audio files")
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.2, random_state=42, stratify=y_train
    )
    
    print(f"   📈 Training samples: {len(X_train)}")
    print(f"   📊 Validation samples: {len(X_val)}")
    print(f"   🧪 Test samples: {len(X_test)}")
    
    # Initialize model
    print("\n4️⃣ Training model...")
    model = SimpleVoiceEmotionModel()
    
    # Train model
    scaler = model.train_simple_model(X_train, y_train, X_val, y_val)
    
    # Evaluate model
    print("\n5️⃣ Evaluating model...")
    X_test_scaled = scaler.transform(X_test)
    test_score = model.model.score(X_test_scaled, y_test)
    print(f"   📊 Test Accuracy: {test_score:.4f}")
    
    # Get predictions for detailed evaluation
    y_pred = model.model.predict(X_test_scaled)
    
    # Classification report
    emotion_labels = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
    report = classification_report(y_test, y_pred, target_names=emotion_labels)
    print("\n📋 Classification Report:")
    print(report)
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=emotion_labels, yticklabels=emotion_labels)
    plt.title('Voice Emotion Recognition - Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    plt.savefig('confusion_matrix.png')
    print("   💾 Confusion matrix saved as 'confusion_matrix.png'")
    
    # Save model and scaler
    print("\n6️⃣ Saving model...")
    os.makedirs("./voice_emotion_model", exist_ok=True)
    
    import joblib
    joblib.dump(model.model, "./voice_emotion_model/model.pkl")
    joblib.dump(scaler, "./voice_emotion_model/scaler.pkl")
    joblib.dump(model.label_encoder, "./voice_emotion_model/label_encoder.pkl")
    
    # Save model info
    model_info = {
        'model_type': 'MLPClassifier',
        'num_features': X.shape[1],
        'num_labels': len(emotion_labels),
        'emotions': emotion_labels,
        'test_accuracy': float(test_score),
        'training_samples': len(X_train),
        'validation_samples': len(X_val),
        'test_samples': len(X_test),
        'timestamp': datetime.now().isoformat()
    }
    
    with open('./voice_emotion_model/model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print("   ✅ Model saved successfully!")
    
    # Test prediction
    print("\n7️⃣ Testing prediction...")
    if len(df) > 0:
        test_audio = os.path.join("./data", df.iloc[0]['file_path'])
        prediction = model.predict_emotion(test_audio, scaler)
        print(f"   🎯 Test prediction: {prediction}")
    
    print("\n🎉 Voice Emotion Recognition Model Training Complete!")
    print("📊 Model Performance:")
    print(f"   - Test Accuracy: {test_score:.4f}")
    print(f"   - Model Type: MLPClassifier")
    print(f"   - Features: {X.shape[1]}")
    print(f"   - Emotions: {len(emotion_labels)}")
    print("\n💾 Files saved:")
    print("   - ./voice_emotion_model/model.pkl")
    print("   - ./voice_emotion_model/scaler.pkl")
    print("   - ./voice_emotion_model/label_encoder.pkl")
    print("   - ./voice_emotion_model/model_info.json")
    print("   - confusion_matrix.png")
    
    print("\n🚀 Next steps:")
    print("1. Test the model with: python test_model.py")
    print("2. Start the API server with: python simple_voice_api.py")

if __name__ == "__main__":
    main()
