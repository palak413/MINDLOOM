#!/usr/bin/env python3
"""
Enhanced Voice Emotion Recognition Model Training Script
This script trains a more accurate AI model for voice emotion recognition.
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
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class EnhancedVoiceEmotionDataset:
    """Enhanced dataset class for voice emotion recognition"""
    
    def __init__(self, data_dir: str, emotions: list = None):
        self.data_dir = Path(data_dir)
        self.emotions = emotions or ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        
    def create_enhanced_synthetic_dataset(self, num_samples_per_emotion: int = 200) -> pd.DataFrame:
        """Create an enhanced synthetic dataset with more realistic features"""
        print("Creating enhanced synthetic voice emotion dataset...")
        
        data = []
        for emotion in self.emotions:
            for i in range(num_samples_per_emotion):
                # Generate more realistic synthetic audio features
                sample = {
                    'file_path': f"enhanced_{emotion}_{i:03d}.wav",
                    'emotion': emotion,
                    'duration': np.random.uniform(3.0, 10.0),  # 3-10 seconds
                    'sample_rate': 16000,
                    'pitch_mean': self._get_emotion_pitch(emotion),
                    'pitch_std': self._get_emotion_pitch_std(emotion),
                    'energy_mean': self._get_emotion_energy(emotion),
                    'energy_std': self._get_emotion_energy_std(emotion),
                    'spectral_centroid_mean': self._get_emotion_spectral_centroid(emotion),
                    'spectral_rolloff_mean': self._get_emotion_spectral_rolloff(emotion),
                    'zero_crossing_rate_mean': self._get_emotion_zcr(emotion),
                    'tempo': self._get_emotion_tempo(emotion),
                    'is_synthetic': True
                }
                data.append(sample)
        
        df = pd.DataFrame(data)
        print(f"Created enhanced synthetic dataset with {len(df)} samples")
        return df
    
    def _get_emotion_pitch(self, emotion: str) -> float:
        """Get typical pitch range for emotion with more realistic values"""
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
    
    def _get_emotion_spectral_rolloff(self, emotion: str) -> float:
        """Get typical spectral rolloff for emotion"""
        rolloff_ranges = {
            'happy': np.random.uniform(4000, 7000),
            'sad': np.random.uniform(2000, 4000),
            'angry': np.random.uniform(5000, 8000),
            'fear': np.random.uniform(3500, 6000),
            'surprise': np.random.uniform(4500, 7500),
            'disgust': np.random.uniform(2500, 4500),
            'neutral': np.random.uniform(3000, 5000)
        }
        return rolloff_ranges[emotion]
    
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
    
    def create_enhanced_synthetic_audio(self, features: dict, output_path: str):
        """Create more realistic synthetic audio from features"""
        try:
            # Generate synthetic audio based on features
            duration = features.get('duration', 5.0)
            sample_rate = 16000
            t = np.linspace(0, duration, int(sample_rate * duration))
            
            # Create a more complex audio signal
            base_freq = features.get('pitch_mean', 200)
            
            # Multiple harmonics for more realistic sound
            audio = np.sin(2 * np.pi * base_freq * t)
            audio += 0.3 * np.sin(2 * np.pi * base_freq * 2 * t)  # Second harmonic
            audio += 0.1 * np.sin(2 * np.pi * base_freq * 3 * t)  # Third harmonic
            
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
            
            # Add some noise and modulation
            noise_level = features.get('energy_mean', 0.05)
            audio += np.random.normal(0, noise_level, len(audio))
            
            # Apply envelope
            envelope = np.exp(-t * 0.3)  # Slower decay for more realistic sound
            audio *= envelope
            
            # Normalize
            audio = audio / np.max(np.abs(audio)) * 0.4
            
            # Save as WAV file
            import soundfile as sf
            sf.write(output_path, audio, sample_rate)
            
        except Exception as e:
            print(f"Error creating enhanced synthetic audio: {e}")

class EnhancedVoiceEmotionModel:
    """Enhanced Voice Emotion Recognition Model"""
    
    def __init__(self, num_labels: int = 7):
        self.num_labels = num_labels
        self.model = None
        self.scaler = StandardScaler()
        self.emotions = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        
    def extract_enhanced_features(self, audio_path: str) -> np.ndarray:
        """Extract enhanced audio features for classification"""
        try:
            # Load audio file
            audio, sample_rate = librosa.load(audio_path, sr=16000)
            
            # Extract comprehensive features
            features = []
            
            # Pitch features (more detailed)
            pitches, magnitudes = librosa.piptrack(y=audio, sr=sample_rate)
            pitch_values = pitches[pitches > 0]
            if len(pitch_values) > 0:
                features.extend([
                    np.mean(pitch_values),
                    np.std(pitch_values),
                    np.max(pitch_values),
                    np.min(pitch_values),
                    np.median(pitch_values),
                    np.percentile(pitch_values, 25),
                    np.percentile(pitch_values, 75)
                ])
            else:
                features.extend([0] * 7)
            
            # Energy features (RMS)
            rms = librosa.feature.rms(y=audio)[0]
            features.extend([
                np.mean(rms),
                np.std(rms),
                np.max(rms),
                np.min(rms),
                np.median(rms)
            ])
            
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=audio, sr=sample_rate)[0]
            features.extend([
                np.mean(spectral_centroids),
                np.std(spectral_centroids),
                np.max(spectral_centroids),
                np.min(spectral_centroids)
            ])
            
            # Spectral rolloff
            spectral_rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sample_rate)[0]
            features.extend([
                np.mean(spectral_rolloff),
                np.std(spectral_rolloff)
            ])
            
            # Zero crossing rate
            zcr = librosa.feature.zero_crossing_rate(audio)[0]
            features.extend([
                np.mean(zcr),
                np.std(zcr),
                np.max(zcr),
                np.min(zcr)
            ])
            
            # MFCC features (more coefficients)
            mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=13)
            for i in range(13):
                features.extend([
                    np.mean(mfccs[i]),
                    np.std(mfccs[i])
                ])
            
            # Chroma features
            chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate)
            features.extend([
                np.mean(chroma),
                np.std(chroma)
            ])
            
            # Spectral contrast
            contrast = librosa.feature.spectral_contrast(y=audio, sr=sample_rate)
            features.extend([
                np.mean(contrast),
                np.std(contrast)
            ])
            
            # Tempo
            tempo, _ = librosa.beat.beat_track(y=audio, sr=sample_rate)
            features.append(tempo)
            
            return np.array(features)
            
        except Exception as e:
            print(f"Error extracting enhanced features from {audio_path}: {e}")
            return np.zeros(50)  # Return zero features if extraction fails
    
    def train_enhanced_model(self, X_train, y_train, X_val, y_val):
        """Train an enhanced model with multiple algorithms"""
        from sklearn.ensemble import VotingClassifier
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Create multiple models
        rf_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            random_state=42,
            n_jobs=-1
        )
        
        svm_model = SVC(
            kernel='rbf',
            C=1.0,
            gamma='scale',
            probability=True,
            random_state=42
        )
        
        mlp_model = MLPClassifier(
            hidden_layer_sizes=(200, 100, 50),
            max_iter=2000,
            random_state=42,
            early_stopping=True,
            validation_fraction=0.1
        )
        
        # Create ensemble model
        self.model = VotingClassifier(
            estimators=[
                ('rf', rf_model),
                ('svm', svm_model),
                ('mlp', mlp_model)
            ],
            voting='soft'  # Use predicted probabilities
        )
        
        print("Training enhanced ensemble model...")
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate on validation set
        val_score = self.model.score(X_val_scaled, y_val)
        print(f"Validation accuracy: {val_score:.4f}")
        
        return val_score
    
    def predict_emotion(self, audio_path: str) -> dict:
        """Predict emotion from audio file"""
        try:
            features = self.extract_enhanced_features(audio_path)
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
    print("🎤 Enhanced Voice Emotion Recognition AI Model Training")
    print("=" * 60)
    
    # Initialize dataset
    dataset = EnhancedVoiceEmotionDataset("./data")
    
    # Create enhanced synthetic dataset
    print("\n1️⃣ Creating enhanced dataset...")
    df = dataset.create_enhanced_synthetic_dataset(num_samples_per_emotion=300)
    
    # Create data directory
    os.makedirs("./data", exist_ok=True)
    
    # Generate enhanced synthetic audio files
    print("\n2️⃣ Generating enhanced synthetic audio files...")
    for idx, row in df.iterrows():
        audio_path = os.path.join("./data", row['file_path'])
        dataset.create_enhanced_synthetic_audio(row, audio_path)
        
        if (idx + 1) % 50 == 0:
            print(f"   Generated {idx + 1}/{len(df)} audio files...")
    
    print(f"   ✅ Generated {len(df)} enhanced synthetic audio files")
    
    # Prepare dataset for training
    print("\n3️⃣ Preparing dataset for training...")
    
    # Extract enhanced features for all audio files
    print("   Extracting enhanced features from audio files...")
    features_list = []
    labels_list = []
    
    # Initialize model to get extract_enhanced_features method
    model = EnhancedVoiceEmotionModel()
    
    for idx, row in df.iterrows():
        audio_path = os.path.join("./data", row['file_path'])
        if os.path.exists(audio_path):
            features = model.extract_enhanced_features(audio_path)
            features_list.append(features)
            labels_list.append(row['emotion'])
        
        if (idx + 1) % 50 == 0:
            print(f"   Processed {idx + 1}/{len(df)} files...")
    
    X = np.array(features_list)
    y = np.array(labels_list)
    
    print(f"   ✅ Extracted enhanced features from {len(features_list)} audio files")
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
    
    # Train enhanced model
    print("\n4️⃣ Training enhanced model...")
    val_score = model.train_enhanced_model(X_train, y_train, X_val, y_val)
    
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
    plt.title('Enhanced Voice Emotion Recognition - Confusion Matrix')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.tight_layout()
    plt.savefig('enhanced_confusion_matrix.png')
    print("   💾 Enhanced confusion matrix saved as 'enhanced_confusion_matrix.png'")
    
    # Save enhanced model and scaler
    print("\n6️⃣ Saving enhanced model...")
    os.makedirs("./enhanced_voice_emotion_model", exist_ok=True)
    
    import joblib
    joblib.dump(model.model, "./enhanced_voice_emotion_model/enhanced_model.pkl")
    joblib.dump(model.scaler, "./enhanced_voice_emotion_model/enhanced_scaler.pkl")
    
    # Save model info
    model_info = {
        'model_type': 'VotingClassifier (RF + SVM + MLP)',
        'num_features': X.shape[1],
        'num_labels': len(emotion_labels),
        'emotions': emotion_labels,
        'test_accuracy': float(test_score),
        'validation_accuracy': float(val_score),
        'training_samples': len(X_train),
        'validation_samples': len(X_val),
        'test_samples': len(X_test),
        'timestamp': datetime.now().isoformat(),
        'feature_extraction': 'Enhanced (50 features)',
        'algorithms': ['RandomForest', 'SVM', 'MLPClassifier']
    }
    
    with open('./enhanced_voice_emotion_model/enhanced_model_info.json', 'w') as f:
        json.dump(model_info, f, indent=2)
    
    print("   ✅ Enhanced model saved successfully!")
    
    # Test prediction
    print("\n7️⃣ Testing enhanced prediction...")
    if len(df) > 0:
        test_audio = os.path.join("./data", df.iloc[0]['file_path'])
        prediction = model.predict_emotion(test_audio)
        print(f"   🎯 Enhanced test prediction: {prediction}")
    
    print("\n🎉 Enhanced Voice Emotion Recognition Model Training Complete!")
    print("📊 Enhanced Model Performance:")
    print(f"   - Test Accuracy: {test_score:.4f}")
    print(f"   - Validation Accuracy: {val_score:.4f}")
    print(f"   - Model Type: VotingClassifier (Ensemble)")
    print(f"   - Features: {X.shape[1]} (Enhanced)")
    print(f"   - Emotions: {len(emotion_labels)}")
    print("\n💾 Enhanced files saved:")
    print("   - ./enhanced_voice_emotion_model/enhanced_model.pkl")
    print("   - ./enhanced_voice_emotion_model/enhanced_scaler.pkl")
    print("   - ./enhanced_voice_emotion_model/enhanced_model_info.json")
    print("   - enhanced_confusion_matrix.png")
    
    print("\n🚀 Next steps:")
    print("1. Test the enhanced model with: python test_enhanced_model.py")
    print("2. Start the enhanced API server with: python enhanced_voice_api.py")

if __name__ == "__main__":
    main()
