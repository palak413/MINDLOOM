# 🤖 ML Models Setup Guide

## 📋 **Required ML Models**

Due to GitHub's file size limitations, the following ML models need to be downloaded separately:

### **Core Models (Required for Full Functionality)**

| Model | Size | Purpose | Location |
|-------|------|---------|----------|
| `model.safetensors` | ~255MB | CBT Therapy Model | `ml_cbt_service/cbt_model/` |
| `model.safetensors` | ~50MB | Voice Emotion Detection | `results/checkpoint-150/` |
| `enhanced_model.pkl` | ~15MB | Enhanced Voice Analysis | `backend/ai_voice_model/enhanced_voice_emotion_model/` |
| `simple_model.pkl` | ~8MB | Simple Voice Analysis | `backend/ai_voice_model/simple_voice_emotion_model/` |
| `ultra_simple_model.pkl` | ~5MB | Ultra Simple Voice Analysis | `backend/ai_voice_model/ultra_simple_voice_emotion_model/` |

## 🚀 **Quick Setup (Automated)**

### **Option 1: Use the Download Script**
```bash
# Run the automated download script
npm run download-models
# or
node scripts/download-models.js
```

### **Option 2: Manual Download**
1. **Download from Google Drive**: [ML Models Folder](https://drive.google.com/drive/folders/1AbYxAAFPcSYvXUMvx2WJv7NsH83Q6gop)
2. **Extract to project root**: The models will be placed in correct directories
3. **Verify installation**: Run `npm run verify-models`

## 📁 **Directory Structure After Download**

```
project1/
├── ml_cbt_service/
│   └── cbt_model/
│       ├── model.safetensors ✅
│       ├── config.json ✅
│       ├── tokenizer.json ✅
│       └── training_args.bin ✅
├── results/
│   └── checkpoint-150/
│       ├── model.safetensors ✅
│       ├── optimizer.pt ✅
│       └── scheduler.pt ✅
└── backend/
    └── ai_voice_model/
        ├── enhanced_voice_emotion_model/
        │   ├── enhanced_model.pkl ✅
        │   ├── enhanced_scaler.pkl ✅
        │   └── enhanced_label_encoder.pkl ✅
        ├── simple_voice_emotion_model/
        │   ├── simple_model.pkl ✅
        │   ├── simple_scaler.pkl ✅
        │   └── simple_label_encoder.pkl ✅
        └── ultra_simple_voice_emotion_model/
            ├── ultra_simple_model.pkl ✅
            ├── ultra_simple_scaler.pkl ✅
            └── ultra_simple_label_encoder.pkl ✅
```

## 🔧 **Manual Installation Steps**

### **Step 1: Download Models**
1. Go to: [Google Drive ML Models](https://drive.google.com/drive/folders/YOUR_FOLDER_ID)
2. Download the `ml-models.zip` file
3. Extract it to your project root directory

### **Step 2: Verify Installation**
```bash
# Check if all models are present
npm run verify-models

# Expected output:
# ✅ CBT Model: Found
# ✅ Voice Emotion Model: Found  
# ✅ Enhanced Voice Model: Found
# ✅ Simple Voice Model: Found
# ✅ Ultra Simple Voice Model: Found
```

### **Step 3: Test Models**
```bash
# Test voice emotion detection
npm run test-voice-model

# Test CBT model
npm run test-cbt-model
```

## 🚨 **Troubleshooting**

### **Issue: Models not found**
```bash
# Re-download models
npm run download-models --force

# Or manually check directories
ls ml_cbt_service/cbt_model/
ls results/checkpoint-150/
ls backend/ai_voice_model/*/
```

### **Issue: Permission denied**
```bash
# Fix permissions (Linux/Mac)
chmod +x scripts/download-models.js

# Or run as administrator (Windows)
# Right-click PowerShell -> Run as Administrator
```

### **Issue: Download fails**
- Check internet connection
- Verify Google Drive link is accessible
- Try downloading manually from the Drive link

## 📊 **Model Information**

### **CBT Therapy Model**
- **Purpose**: Cognitive Behavioral Therapy analysis
- **Input**: Text conversations
- **Output**: Therapy suggestions and mood analysis
- **Framework**: Transformers (Hugging Face)

### **Voice Emotion Models**
- **Purpose**: Real-time emotion detection from voice
- **Input**: Audio files/streams
- **Output**: Emotion labels (happy, sad, angry, etc.)
- **Framework**: Scikit-learn, PyTorch

## 🔗 **Alternative Download Sources**

If Google Drive is not accessible:
- **Dropbox**: [Alternative Link](https://dropbox.com/your-link)
- **OneDrive**: [Alternative Link](https://onedrive.com/your-link)
- **Direct Download**: Contact project maintainer

## 📞 **Support**

If you encounter issues:
1. Check this guide first
2. Run `npm run verify-models`
3. Open an issue on GitHub
4. Contact: [your-email@domain.com]

---

**Note**: These models are essential for the AI-powered features of MINDLOOM. Without them, the app will run in demo mode with limited functionality.
