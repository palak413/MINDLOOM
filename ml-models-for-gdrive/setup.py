#!/usr/bin/env python3
"""
Setup script for Voice Emotion Recognition AI Model
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    print("🎤 Voice Emotion Recognition AI Model Setup")
    print("=" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python version: {python_version.major}.{python_version.minor}.{python_version.micro}")
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found. Please run this script from the ai_voice_model directory")
        sys.exit(1)
    
    # Install requirements
    print("\n📦 Installing Python packages...")
    if not run_command("pip install -r requirements.txt", "Installing requirements"):
        print("💡 Try running: pip install --upgrade pip")
        print("💡 Then run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Create necessary directories
    print("\n📁 Creating directories...")
    directories = ["data", "voice_emotion_model", "logs"]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")
    
    # Check if PyTorch is working
    print("\n🧪 Testing PyTorch installation...")
    try:
        import torch
        print(f"✅ PyTorch version: {torch.__version__}")
        print(f"✅ CUDA available: {torch.cuda.is_available()}")
    except ImportError:
        print("❌ PyTorch not properly installed")
        sys.exit(1)
    
    # Check if transformers is working
    print("\n🧪 Testing Transformers installation...")
    try:
        import transformers
        print(f"✅ Transformers version: {transformers.__version__}")
    except ImportError:
        print("❌ Transformers not properly installed")
        sys.exit(1)
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Train the model: python train.py")
    print("2. Start the API server: python voice_emotion_api.py")
    print("3. Test the API: curl -X POST -F 'audio=@test.wav' http://localhost:5001/predict")
    
    print("\n💡 Tips:")
    print("- The model will be trained on synthetic data initially")
    print("- For better accuracy, collect real voice emotion data")
    print("- The API runs on port 5001 by default")
    print("- Check the logs for detailed information")

if __name__ == "__main__":
    main()
