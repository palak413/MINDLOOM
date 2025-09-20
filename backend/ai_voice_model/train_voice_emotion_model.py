import os
import json
import torch
import torchaudio
import librosa
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from datasets import Dataset, Audio
from transformers import (
    Wav2Vec2ForSequenceClassification,
    Wav2Vec2Processor,
    TrainingArguments,
    Trainer,
    EarlyStoppingCallback
)
import evaluate
import wandb
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class VoiceEmotionDataset:
    """Custom dataset class for voice emotion recognition"""
    
    def __init__(self, data_dir: str, emotions: List[str] = None):
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
                    'mfcc_mean': np.random.uniform(-10, 10, 13),
                    'mfcc_std': np.random.uniform(1, 5, 13),
                    'spectral_centroid_mean': self._get_emotion_spectral_centroid(emotion),
                    'spectral_rolloff_mean': np.random.uniform(2000, 8000),
                    'zero_crossing_rate_mean': np.random.uniform(0.01, 0.1),
                    'tempo': self._get_emotion_tempo(emotion),
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

class VoiceEmotionModel:
    """Voice Emotion Recognition Model using Wav2Vec2"""
    
    def __init__(self, model_name: str = "facebook/wav2vec2-base", num_labels: int = 7):
        self.model_name = model_name
        self.num_labels = num_labels
        self.processor = None
        self.model = None
        self.trainer = None
        
    def load_model(self):
        """Load the pre-trained model and processor"""
        print(f"Loading model: {self.model_name}")
        
        self.processor = Wav2Vec2Processor.from_pretrained(self.model_name)
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
            self.model_name,
            num_labels=self.num_labels,
            label2id={f"LABEL_{i}": i for i in range(self.num_labels)},
            id2label={i: f"LABEL_{i}" for i in range(self.num_labels)}
        )
        
        print("Model loaded successfully!")
    
    def preprocess_audio(self, audio_path: str, max_length: int = 160000) -> Dict:
        """Preprocess audio file for model input"""
        try:
            # Load audio file
            audio, sample_rate = librosa.load(audio_path, sr=16000)
            
            # Ensure audio is the right length
            if len(audio) > max_length:
                audio = audio[:max_length]
            else:
                audio = np.pad(audio, (0, max_length - len(audio)), 'constant')
            
            # Process with Wav2Vec2 processor
            inputs = self.processor(
                audio,
                sampling_rate=sample_rate,
                return_tensors="pt",
                padding=True,
                truncation=True
            )
            
            return {
                'input_values': inputs['input_values'].squeeze(),
                'attention_mask': inputs['attention_mask'].squeeze()
            }
            
        except Exception as e:
            print(f"Error preprocessing audio {audio_path}: {e}")
            return None
    
    def create_synthetic_audio(self, features: Dict, output_path: str):
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
    
    def train_model(self, train_dataset, eval_dataset, output_dir: str = "./voice_emotion_model"):
        """Train the voice emotion recognition model"""
        print("Starting model training...")
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=10,
            per_device_train_batch_size=4,
            per_device_eval_batch_size=4,
            warmup_steps=500,
            weight_decay=0.01,
            logging_dir=f"{output_dir}/logs",
            logging_steps=100,
            evaluation_strategy="steps",
            eval_steps=500,
            save_strategy="steps",
            save_steps=500,
            load_best_model_at_end=True,
            metric_for_best_model="eval_accuracy",
            greater_is_better=True,
            report_to="none",  # Disable wandb for now
            dataloader_num_workers=0,  # Avoid multiprocessing issues on Windows
        )
        
        # Create trainer
        self.trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=train_dataset,
            eval_dataset=eval_dataset,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=3)]
        )
        
        # Train the model
        print("Training started...")
        train_result = self.trainer.train()
        
        # Save the model
        self.trainer.save_model()
        self.processor.save_pretrained(output_dir)
        
        print(f"Training completed! Model saved to {output_dir}")
        return train_result
    
    def evaluate_model(self, test_dataset):
        """Evaluate the trained model"""
        print("Evaluating model...")
        
        predictions = self.trainer.predict(test_dataset)
        y_pred = np.argmax(predictions.predictions, axis=1)
        y_true = test_dataset['labels']
        
        # Calculate metrics
        accuracy = (y_pred == y_true).mean()
        print(f"Test Accuracy: {accuracy:.4f}")
        
        # Classification report
        emotion_labels = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
        report = classification_report(y_true, y_pred, target_names=emotion_labels)
        print("\nClassification Report:")
        print(report)
        
        # Confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                    xticklabels=emotion_labels, yticklabels=emotion_labels)
        plt.title('Voice Emotion Recognition - Confusion Matrix')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.tight_layout()
        plt.savefig('confusion_matrix.png')
        plt.show()
        
        return accuracy, report
    
    def predict_emotion(self, audio_path: str) -> Dict:
        """Predict emotion from audio file"""
        try:
            # Preprocess audio
            inputs = self.preprocess_audio(audio_path)
            if inputs is None:
                return {'error': 'Failed to preprocess audio'}
            
            # Make prediction
            with torch.no_grad():
                outputs = self.model(
                    input_values=inputs['input_values'].unsqueeze(0),
                    attention_mask=inputs['attention_mask'].unsqueeze(0)
                )
            
            # Get probabilities
            probabilities = torch.softmax(outputs.logits, dim=-1).squeeze().numpy()
            predicted_class = np.argmax(probabilities)
            confidence = probabilities[predicted_class]
            
            emotion_labels = ['happy', 'sad', 'angry', 'fear', 'surprise', 'disgust', 'neutral']
            
            return {
                'emotion': emotion_labels[predicted_class],
                'confidence': float(confidence),
                'probabilities': {
                    emotion_labels[i]: float(probabilities[i]) 
                    for i in range(len(emotion_labels))
                }
            }
            
        except Exception as e:
            return {'error': f'Prediction failed: {str(e)}'}

def main():
    """Main training pipeline"""
    print("🎤 Voice Emotion Recognition AI Model Training")
    print("=" * 50)
    
    # Initialize dataset
    dataset = VoiceEmotionDataset("./data")
    
    # Create synthetic dataset
    print("\n1. Creating dataset...")
    df = dataset.create_synthetic_dataset(num_samples_per_emotion=200)
    
    # Create data directory
    os.makedirs("./data", exist_ok=True)
    
    # Generate synthetic audio files
    print("\n2. Generating synthetic audio files...")
    for idx, row in df.iterrows():
        audio_path = f"./data/{row['file_path']}"
        dataset.create_synthetic_audio(row, audio_path)
        
        if idx % 50 == 0:
            print(f"Generated {idx + 1}/{len(df)} audio files...")
    
    # Prepare dataset for training
    print("\n3. Preparing dataset for training...")
    
    # Create labels
    labels = dataset.label_encoder.transform(df['emotion'].values)
    
    # Split dataset
    train_df, test_df, train_labels, test_labels = train_test_split(
        df, labels, test_size=0.2, random_state=42, stratify=labels
    )
    train_df, val_df, train_labels, val_labels = train_test_split(
        train_df, train_labels, test_size=0.2, random_state=42, stratify=train_labels
    )
    
    print(f"Training samples: {len(train_df)}")
    print(f"Validation samples: {len(val_df)}")
    print(f"Test samples: {len(test_df)}")
    
    # Initialize model
    print("\n4. Initializing model...")
    model = VoiceEmotionModel()
    model.load_model()
    
    # Create datasets for training
    def create_dataset(df, labels):
        dataset_data = []
        for idx, row in df.iterrows():
            audio_path = f"./data/{row['file_path']}"
            if os.path.exists(audio_path):
                dataset_data.append({
                    'audio_path': audio_path,
                    'label': labels[idx]
                })
        return Dataset.from_list(dataset_data)
    
    train_dataset = create_dataset(train_df, train_labels)
    val_dataset = create_dataset(val_df, val_labels)
    test_dataset = create_dataset(test_df, test_labels)
    
    # Train model
    print("\n5. Training model...")
    train_result = model.train_model(train_dataset, val_dataset)
    
    # Evaluate model
    print("\n6. Evaluating model...")
    accuracy, report = model.evaluate_model(test_dataset)
    
    # Save results
    results = {
        'training_loss': train_result.training_loss,
        'test_accuracy': accuracy,
        'model_name': model.model_name,
        'num_labels': model.num_labels,
        'training_samples': len(train_df),
        'test_samples': len(test_df),
        'timestamp': datetime.now().isoformat()
    }
    
    with open('training_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Training completed successfully!")
    print(f"📊 Test Accuracy: {accuracy:.4f}")
    print(f"💾 Model saved to: ./voice_emotion_model")
    print(f"📈 Results saved to: training_results.json")
    
    # Test prediction
    print("\n7. Testing prediction...")
    if len(test_df) > 0:
        test_audio = f"./data/{test_df.iloc[0]['file_path']}"
        prediction = model.predict_emotion(test_audio)
        print(f"Test prediction: {prediction}")

if __name__ == "__main__":
    main()
