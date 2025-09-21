#!/usr/bin/env python3
"""
Simple and Reliable Voice Emotion Recognition Model
This creates a working model with consistent features.
"""

import os
import json
import librosa
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class SimpleVoiceEmotionDataset:
    """Simple dataset class for voice emotion recognition"""
    
    def __init__(self, data_dir: str, emotions: list = None):
        self.data_dir = Path(data_dir)
        self.emotions = emotions or ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        
    def create_simple_synthetic_dataset(self, num_samples_per_emotion: int = 100) -> pd.DataFrame:
        """Create a simple synthetic dataset"""
        print("Creating simple synthetic voice emotion dataset...")
        
        data = []
        for emotion in self.emotions:
            for i in range(num_samples_per_emotion):
                sample = {
                    'file_path': f"simple_{emotion}_{i:03d}.wav",
                    'emotion': emotion,
                    'duration': np.random.uniform(3.0, 8.0),
                    'sample_rate': 16000,
                    'pitch_mean': self._get_emotion_pitch(emotion),
                    'pitch_std': self._get_emotion_pitch_std(emotion),
                    'energy_mean': self._get_emotion_energy(emotion),
                    'energy_std': self._get_emotion_energy_std(emotion),
                    'spectral_centroid_mean': self._get_emotion_spectral_centroid(emotion),
                    'zero_crossing_rate_mean': self._get_emotion_zcr(emotion),
                    'tempo': self._get_emotion_tempo(emotion),
                    'is_synthetic': True
                }
                data.append(sample)
        
        df = pd.DataFrame(data)
        print(f"Created simple synthetic dataset with {len(df)} samples")
        return df
    
    def _get_emotion_pitch(self, emotion: str) -> float:
        """Get typical pitch range for emotion"""
        pitch_ranges = {
            'happy': np.random.uniform(180, 280),
            'sad': np.random.uniform(80, 160),
            'angry': np.random.uniform(160, 240),
            'fear': np.random.uniform(200, 300),
            'surprise': np.random.uniform(220, 320),
            'disgust': np.random.uniform(100, 180),
            'neutral': np.random.uniform(140, 200)
        }
        return pitch_ranges[emotion]
    
    def _get_emotion_pitch_std(self, emotion: str) -> float:
        """Get pitch standard deviation for emotion"""
        pitch_std_ranges = {
            'happy': np.random.uniform(20, 50),
            'sad': np.random.uniform(10, 30),
            'angry': np.random.uniform(30, 60),
            'fear': np.random.uniform(25, 55),
            'surprise': np.random.uniform(35, 65),
            'disgust': np.random.uniform(15, 35),
            'neutral': np.random.uniform(15, 40)
        }
        return pitch_std_ranges[emotion]
    
    def _get_emotion_energy(self, emotion: str) -> float:
        """Get typical energy level for emotion"""
        energy_ranges = {
            'happy': np.random.uniform(0.08, 0.18),
            'sad': np.random.uniform(0.02, 0.08),
            'angry': np.random.uniform(0.12, 0.25),
            'fear': np.random.uniform(0.06, 0.15),
            'surprise': np.random.uniform(0.10, 0.20),
            'disgust': np.random.uniform(0.03, 0.10),
            'neutral': np.random.uniform(0.04, 0.12)
        }
        return energy_ranges[emotion]
    
    def _get_emotion_energy_std(self, emotion: str) -> float:
        """Get energy standard deviation for emotion"""
        energy_std_ranges = {
            'happy': np.random.uniform(0.01, 0.03),
            'sad': np.random.uniform(0.005, 0.02),
            'angry': np.random.uniform(0.02, 0.05),
            'fear': np.random.uniform(0.01, 0.03),
            'surprise': np.random.uniform(0.015, 0.04),
            'disgust': np.random.uniform(0.008, 0.025),
            'neutral': np.random.uniform(0.01, 0.03)
        }
        return energy_std_ranges[emotion]
    
    def _get_emotion_spectral_centroid(self, emotion: str) -> float:
        """Get typical spectral centroid for emotion"""
        centroid_ranges = {
            'happy': np.random.uniform(2000, 3500),
            'sad': np.random.uniform(1000, 2000),
            'angry': np.random.uniform(2500, 4000),
            'fear': np.random.uniform(1800, 3000),
            'surprise': np.random.uniform(2200, 3600),
            'disgust': np.random.uniform(1200, 2200),
            'neutral': np.random.uniform(1500, 2500)
        }
        return centroid_ranges[emotion]
    
    def _get_emotion_zcr(self, emotion: str) -> float:
        """Get typical zero crossing rate for emotion"""
        zcr_ranges = {
            'happy': np.random.uniform(0.02, 0.08),
            'sad': np.random.uniform(0.01, 0.04),
            'angry': np.random.uniform(0.03, 0.10),
            'fear': np.random.uniform(0.02, 0.07),
            'surprise': np.random.uniform(0.025, 0.09),
            'disgust': np.random.uniform(0.015, 0.05),
            'neutral': np.random.uniform(0.02, 0.06)
        }
        return zcr_ranges[emotion]
    
    def _get_emotion_tempo(self, emotion: str) -> float:
        """Get typical tempo for emotion"""
        tempo_ranges = {
            'happy': np.random.uniform(140, 180),
            'sad': np.random.uniform(60, 100),
            'angry': np.random.uniform(120, 160),
            'fear': np.random.uniform(100, 140),
            'surprise': np.random.uniform(130, 170),
            'disgust': np.random.uniform(80, 120),
            'neutral': np.random.uniform(90, 130)
        }
        return tempo_ranges[emotion]
    
    def create_simple_synthetic_audio(self, features: dict, output_path: str):
        """Create simple synthetic audio from features"""
        try:
            # Generate synthetic audio based on features
            duration = features.get('duration', 5.0)
            sample_rate = 16000
            t = np.linspace(0, duration, int(sample_rate * duration))
            
            # Create a simple audio signal
            base_freq = features.get('pitch_mean', 200)
            
            # Simple sine wave with harmonics
            audio = np.sin(2 * np.pi * base_freq * t)
            audio += 0.3 * np.sin(2 * np.pi * base_freq * 2 * t)
            
            # Add modulation based on emotion
            emotion = features.get('emotion', 'neutral')
            if emotion in ['happy', 'surprise']:
                # Add vibrato
                vibrato = 0.1 * np.sin(2 * np.pi * 5 * t)
                audio *= (1 + vibrato)
            elif emotion in ['sad', 'disgust']:
                # Add tremolo
                tremolo = 0.2 * np.sin(2 * np.pi * 3 * t)
                audio *= (1 + tremolo)
            
            # Add some noise
            noise_level = features.get('energy_mean', 0.05)
            audio += np.random.normal(0, noise_level, len(audio))
            
            # Apply envelope
            envelope = np.exp(-t * 0.3)
            audio *= envelope
            
            # Normalize
            audio = audio / np.max(np.abs(audio)) * 0.4
            
            # Save as WAV file
            import soundfile as sf
            sf.write(output_path, audio, sample_rate)
            
        except Exception as e:
            print(f"Error creating simple synthetic audio: {e}")

class SimpleVoiceEmotionModel:
    """Simple Voice Emotion Recognition Model"""
    
    def __init__(self, num_labels: int = 7):
        self.num_labels = num_labels
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        
    def extract_simple_features(self, audio_path: str) -> np.ndarray:
        """Extract simple audio features for classification"""
        try:
            # Load audio file
            audio, sample_rate = librosa.load(audio_path, sr=16000)
            
            # Extract simple features
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
            
            # Energy features (RMS)
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
            
            # Tempo
            tempo, _ = librosa.beat.beat_track(y=audio, sr=sample_rate)
            features.append(tempo)
            
            return np.array(features)
            
        except Exception as e:
            print(f"Error extracting simple features from {audio_path}: {e}")
            return np.zeros(22)  # Return zero features if extraction fails
    
    def train_simple_model(self, X_train, y_train, X_val, y_val):
        """Train a simple Random Forest model"""
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Create Random Forest model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        print("Training simple Random Forest model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate on validation set
        val_score = self.model.score(X_val_scaled, y_val)
        print(f"Validation accuracy: {val_score:.4f}")
        
        return val_score
    
    def predict_emotion(self, audio_path: str) -> dict:
        """Predict emotion from audio file"""
        try:
            features = self.extract_simple_features(audio_path)
            features_scaled = self.scaler.transform(features.reshape(1, -1))
            
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
    print("🎤 Simple Voice Emotion Recognition AI Model Training")
    print("=" * 60)
    
    # Initialize dataset
    dataset = SimpleVoiceEmotionDataset("./simple_data")
    
    # Create simple synthetic dataset
    print("\n1️⃣ Creating simple dataset...")
    df = dataset.create_simple_synthetic_dataset(num_samples_per_emotion=150)
    
    # Create data directory
    os.makedirs("./simple_data", exist_ok=True)
    
    # Generate simple synthetic audio files
    print("\n2️⃣ Generating simple synthetic audio files...")
    for idx, row in df.iterrows():
        audio_path = os.path.join("./simple_data", row['file_path'])
        dataset.create_simple_synthetic_audio(row, audio_path)
        
        if (idx + 1) % 50 == 0:
            print(f"   Generated {idx + 1}/{len(df)} audio files...")
    
    print(f"   ✅ Generated {len(df)} simple synthetic audio files")
    
    # Prepare dataset for training
    print("\n3️⃣ Preparing dataset for training...")
    
    # Extract simple features for all audio files
    print("   Extracting simple features from audio files...")
    features_list = []
    labels_list = []
    
    # Initialize model to get extract_simple_features method
    model = SimpleVoiceEmotionModel()
    
    for idx, row in df.iterrows():
        audio_path = os.path.join("./simple_data", row['file_path'])
        if os.path.exists(audio_path):
            features = model.extract_simple_features(audio_path)
            features_list.append(features)
            labels_list.append(row['emotion'])
        
        if (idx + 1) % 50 == 0:
            print(f"   Processed {idx + 1}/{len(df)} files...")
    
    X = np.array(features_list)
    y = np.array(labels_list)
    
    print(f"   ✅ Extracted simple features from {len(features_list)} audio files")
    print(f"   📊 Feature dimension: {X.shape[1]}")
    
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
    
    # Train simple model
    print("\n4️⃣ Training simple model...")
    val_score = model.train_simple_model(X_train, y_train, X_val, y_val)
    
    # Evaluate model
    print("\n5️⃣ Evaluating model...")
    X_test_scaled = model.scaler.transform(X_test)
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
    plt.title('Simple Voice Emotion Recognition - Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    plt.savefig('simple_confusion_matrix.png')
    print("   💾 Simple confusion matrix saved as 'simple_confusion_matrix.png'")
    
    # Save simple model and scaler
    print("\n6️⃣ Saving simple model...")
    os.makedirs("./simple_voice_emotion_model", exist_ok=True)
    
    import joblib
    joblib.dump(model.model, "./simple_voice_emotion_model/simple_model.pkl")
    joblib.dump(model.scaler, "./simple_voice_emotion_model/simple_scaler.pkl")
    joblib.dump(model.label_encoder, "./simple_voice_emotion_model/simple_label_encoder.pkl")
    
    # Save model info
    model_info = {
        'model_type': 'RandomForestClassifier',
        'num_features': X.shape[1],
        'num_labels': len(emotion_labels),
        'emotions': emotion_labels,
        'test_accuracy': float(test_score),
        'validation_accuracy': float(val_score),
        'training_samples': len(X_train),
        'validation_samples': len(X_val),
        'test_samples': len(X_test),
        'timestamp': datetime.now().isoformat(),
        'feature_extraction': 'Simple (22 features)',
        'algorithm': 'RandomForest'
    }
    
    with open('./simple_voice_emotion_model/simple_model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print("   ✅ Simple model saved successfully!")
    
    # Test prediction
    print("\n7️⃣ Testing simple prediction...")
    if len(df) > 0:
        test_audio = os.path.join("./simple_data", df.iloc[0]['file_path'])
        prediction = model.predict_emotion(test_audio)
        print(f"   🎯 Simple test prediction: {prediction}")
    
    print("\n🎉 Simple Voice Emotion Recognition Model Training Complete!")
    print("📊 Simple Model Performance:")
    print(f"   - Test Accuracy: {test_score:.4f}")
    print(f"   - Validation Accuracy: {val_score:.4f}")
    print(f"   - Model Type: RandomForestClassifier")
    print(f"   - Features: {X.shape[1]} (Simple)")
    print(f"   - Emotions: {len(emotion_labels)}")
    print("\n💾 Simple files saved:")
    print("   - ./simple_voice_emotion_model/simple_model.pkl")
    print("   - ./simple_voice_emotion_model/simple_scaler.pkl")
    print("   - ./simple_voice_emotion_model/simple_label_encoder.pkl")
    print("   - ./simple_voice_emotion_model/simple_model_info.json")
    print("   - simple_confusion_matrix.png")
    
    print("\n🚀 Next steps:")
    print("1. Test the simple model with: python test_simple_model.py")
    print("2. Start the simple API server with: python simple_voice_api.py")

if __name__ == "__main__":
    main()