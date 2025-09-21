# 🤖 MINDLOOM ML Models

This folder contains all the Machine Learning models required for MINDLOOM to function with full AI capabilities.

## 📁 **Folder Structure**

```
ml-models-for-gdrive/
├── cbt_model/                          # CBT Therapy Model
│   ├── model.safetensors              # Main CBT model (~255MB)
│   ├── config.json                     # Model configuration
│   ├── tokenizer.json                  # Text tokenizer
│   ├── tokenizer_config.json           # Tokenizer settings
│   ├── special_tokens_map.json         # Special tokens mapping
│   ├── training_args.bin               # Training arguments
│   └── vocab.txt                       # Vocabulary file
├── checkpoint-150/                     # Voice Emotion Model
│   ├── model.safetensors              # Voice emotion detection (~50MB)
│   ├── optimizer.pt                    # Model optimizer
│   ├── scheduler.pt                     # Learning rate scheduler
│   ├── config.json                     # Model configuration
│   └── training_args.bin               # Training arguments
├── enhanced_voice_emotion_model/        # Enhanced Voice Analysis
│   ├── enhanced_model.pkl              # Enhanced model (~15MB)
│   ├── enhanced_scaler.pkl             # Data scaler
│   └── enhanced_label_encoder.pkl       # Label encoder
├── simple_voice_emotion_model/          # Simple Voice Analysis
│   ├── simple_model.pkl                # Simple model (~8MB)
│   ├── simple_scaler.pkl               # Data scaler
│   └── simple_label_encoder.pkl        # Label encoder
├── ultra_simple_voice_emotion_model/   # Ultra Simple Voice Analysis
│   ├── ultra_simple_model.pkl          # Ultra simple model (~5MB)
│   ├── ultra_simple_scaler.pkl        # Data scaler
│   └── ultra_simple_label_encoder.pkl  # Label encoder
└── voice_emotion_model/                # Basic Voice Emotion Model
    ├── model.pkl                       # Basic model (~3MB)
    ├── scaler.pkl                      # Data scaler
    └── label_encoder.pkl               # Label encoder
```

## 🚀 **How to Use**

### **For MINDLOOM Users:**

1. **Download this entire folder** to your MINDLOOM project root
2. **Extract the contents** maintaining the folder structure
3. **Run verification**: `npm run verify-models`
4. **Start MINDLOOM**: `npm run dev`

### **For Developers:**

1. **Clone MINDLOOM**: `git clone https://github.com/YashChaudhary841/MINDLOOM.git`
2. **Download models**: `npm run download-models`
3. **Verify installation**: `npm run verify-models`
4. **Start development**: `npm run dev`

## 📊 **Model Information**

### **CBT Therapy Model** (`cbt_model/`)
- **Purpose**: Cognitive Behavioral Therapy analysis and suggestions
- **Input**: Text conversations and journal entries
- **Output**: Therapy recommendations, mood analysis, cognitive distortions
- **Framework**: Transformers (Hugging Face)
- **Size**: ~255MB

### **Voice Emotion Models** (`checkpoint-150/`, `*_voice_emotion_model/`)
- **Purpose**: Real-time emotion detection from voice/audio
- **Input**: Audio files, voice streams
- **Output**: Emotion labels (happy, sad, angry, anxious, calm, etc.)
- **Framework**: PyTorch, Scikit-learn
- **Sizes**: 3MB - 50MB

## 🔧 **Installation Instructions**

### **Method 1: Automated (Recommended)**
```bash
# In your MINDLOOM project directory
npm run download-models
npm run verify-models
```

### **Method 2: Manual**
1. Download this folder to your MINDLOOM project root
2. Ensure folder structure matches exactly
3. Run `npm run verify-models` to check installation

## ⚠️ **Important Notes**

- **File Integrity**: Do not modify or rename any files
- **Folder Structure**: Maintain exact folder structure as shown above
- **Permissions**: Ensure all files are readable by your application
- **Storage**: Total size is approximately 350MB

## 🆘 **Troubleshooting**

### **Issue: Models not found**
- Check folder structure matches exactly
- Verify all files downloaded completely
- Run `npm run verify-models` for detailed check

### **Issue: Permission denied**
- Ensure files are not locked by other applications
- Check file permissions (especially on Linux/Mac)

### **Issue: Model loading errors**
- Verify file integrity (no corruption during download)
- Check Python dependencies are installed
- Ensure sufficient memory (models require RAM)

## 📞 **Support**

If you encounter issues:
1. Check the main MINDLOOM repository: https://github.com/YashChaudhary841/MINDLOOM
2. Read ML_MODELS_SETUP.md for detailed instructions
3. Open an issue on GitHub
4. Contact: [your-email@domain.com]

---

**Note**: These models are essential for MINDLOOM's AI-powered features. Without them, the application will run in demo mode with limited functionality.

**MINDLOOM** - Where technology meets empathy 🌸