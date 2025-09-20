#!/usr/bin/env python3
"""
Voice Emotion Recognition Model Training Script
This script trains a custom AI model for voice emotion recognition using Wav2Vec2.
"""

import os
import sys
import argparse
import json
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Train Voice Emotion Recognition Model')
    parser.add_argument('--epochs', type=int, default=10, help='Number of training epochs')
    parser.add_argument('--batch-size', type=int, default=4, help='Batch size for training')
    parser.add_argument('--samples-per-emotion', type=int, default=200, help='Number of synthetic samples per emotion')
    parser.add_argument('--output-dir', type=str, default='./voice_emotion_model', help='Output directory for trained model')
    parser.add_argument('--data-dir', type=str, default='./data', help='Directory for training data')
    parser.add_argument('--model-name', type=str, default='facebook/wav2vec2-base', help='Base model name')
    
    args = parser.parse_args()
    
    print("🎤 Voice Emotion Recognition AI Model Training")
    print("=" * 60)
    print(f"📊 Training Configuration:")
    print(f"   - Epochs: {args.epochs}")
    print(f"   - Batch Size: {args.batch_size}")
    print(f"   - Samples per Emotion: {args.samples_per_emotion}")
    print(f"   - Output Directory: {args.output_dir}")
    print(f"   - Data Directory: {args.data_dir}")
    print(f"   - Base Model: {args.model_name}")
    print("=" * 60)
    
    try:
        # Import training modules
        from train_voice_emotion_model import VoiceEmotionDataset, VoiceEmotionModel
        
        # Create directories
        os.makedirs(args.data_dir, exist_ok=True)
        os.makedirs(args.output_dir, exist_ok=True)
        
        # Initialize dataset
        print("\n1️⃣ Creating dataset...")
        dataset = VoiceEmotionDataset(args.data_dir)
        
        # Create synthetic dataset
        df = dataset.create_synthetic_dataset(num_samples_per_emotion=args.samples_per_emotion)
        
        # Generate synthetic audio files
        print("\n2️⃣ Generating synthetic audio files...")
        for idx, row in df.iterrows():
            audio_path = os.path.join(args.data_dir, row['file_path'])
            dataset.create_synthetic_audio(row, audio_path)
            
            if (idx + 1) % 50 == 0:
                print(f"   Generated {idx + 1}/{len(df)} audio files...")
        
        print(f"   ✅ Generated {len(df)} synthetic audio files")
        
        # Prepare dataset for training
        print("\n3️⃣ Preparing dataset for training...")
        
        from sklearn.model_selection import train_test_split
        labels = dataset.label_encoder.transform(df['emotion'].values)
        
        # Split dataset
        train_df, test_df, train_labels, test_labels = train_test_split(
            df, labels, test_size=0.2, random_state=42, stratify=labels
        )
        train_df, val_df, train_labels, val_labels = train_test_split(
            train_df, train_labels, test_size=0.2, random_state=42, stratify=train_labels
        )
        
        print(f"   📈 Training samples: {len(train_df)}")
        print(f"   📊 Validation samples: {len(val_df)}")
        print(f"   🧪 Test samples: {len(test_df)}")
        
        # Initialize model
        print("\n4️⃣ Initializing model...")
        model = VoiceEmotionModel(model_name=args.model_name)
        model.load_model()
        
        # Create datasets for training
        from datasets import Dataset
        
        def create_dataset(df, labels):
            dataset_data = []
            for idx, row in df.iterrows():
                audio_path = os.path.join(args.data_dir, row['file_path'])
                if os.path.exists(audio_path):
                    dataset_data.append({
                        'audio_path': audio_path,
                        'label': labels[idx]
                    })
            return Dataset.from_list(dataset_data)
        
        train_dataset = create_dataset(train_df, train_labels)
        val_dataset = create_dataset(val_df, val_labels)
        test_dataset = create_dataset(test_df, test_labels)
        
        print(f"   ✅ Created training datasets")
        
        # Train model
        print("\n5️⃣ Training model...")
        print("   🚀 Starting training process...")
        
        train_result = model.train_model(
            train_dataset, 
            val_dataset, 
            output_dir=args.output_dir
        )
        
        print("   ✅ Training completed!")
        
        # Evaluate model
        print("\n6️⃣ Evaluating model...")
        accuracy, report = model.evaluate_model(test_dataset)
        
        # Save results
        results = {
            'training_loss': train_result.training_loss,
            'test_accuracy': accuracy,
            'model_name': args.model_name,
            'num_labels': model.num_labels,
            'training_samples': len(train_df),
            'validation_samples': len(val_df),
            'test_samples': len(test_df),
            'epochs': args.epochs,
            'batch_size': args.batch_size,
            'samples_per_emotion': args.samples_per_emotion,
            'timestamp': str(Path().cwd()),
            'classification_report': report
        }
        
        results_file = os.path.join(args.output_dir, 'training_results.json')
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n✅ Training completed successfully!")
        print(f"📊 Test Accuracy: {accuracy:.4f}")
        print(f"💾 Model saved to: {args.output_dir}")
        print(f"📈 Results saved to: {results_file}")
        
        # Test prediction
        print("\n7️⃣ Testing prediction...")
        if len(test_df) > 0:
            test_audio = os.path.join(args.data_dir, test_df.iloc[0]['file_path'])
            prediction = model.predict_emotion(test_audio)
            print(f"   🎯 Test prediction: {prediction}")
        
        print("\n🎉 Voice Emotion Recognition Model Training Complete!")
        print("🚀 You can now start the API server with: python voice_emotion_api.py")
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Please install required packages: pip install -r requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Training Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
