# 📁 MINDLOOM ML Models - Google Drive Upload Instructions

## 🎯 **What You Have:**

✅ **Folder Created**: `ml-models-for-gdrive/`  
✅ **All ML Models**: CBT model, Voice emotion models, Enhanced models  
✅ **README File**: Complete documentation included  
✅ **Ready for Upload**: All files organized and ready  

## 🚀 **Upload to Google Drive:**

### **Step 1: Upload the Folder**
1. Go to [Google Drive](https://drive.google.com)
2. Click **"New"** → **"Folder upload"**
3. Select the `ml-models-for-gdrive` folder
4. Wait for upload to complete (may take 10-15 minutes due to large files)

### **Step 2: Make it Public**
1. Right-click on the uploaded folder
2. Select **"Share"**
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Copy the shareable link

### **Step 3: Update Download Script**
1. Open `scripts/download-models.js` in your project
2. Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your folder ID
3. Replace `YOUR_FILE_ID` with actual file IDs

## 📊 **What's Included:**

| Model | Size | Purpose |
|-------|------|---------|
| `model.safetensors` | ~255MB | CBT Therapy Model |
| `model.safetensors` (checkpoint) | ~50MB | Voice Emotion Detection |
| `enhanced_model.pkl` | ~15MB | Enhanced Voice Analysis |
| `simple_model.pkl` | ~8MB | Simple Voice Analysis |
| `ultra_simple_model.pkl` | ~5MB | Ultra Simple Voice Analysis |
| Various `.pkl` files | ~10MB | Scalers and encoders |

**Total Size**: Approximately 350MB

## 🔗 **After Upload:**

### **Get Your Shareable Link:**
1. Right-click folder → Share
2. Copy the link (looks like: `https://drive.google.com/drive/folders/1ABC...`)
3. Extract the folder ID from the URL

### **Update Your Project:**
1. Edit `scripts/download-models.js`
2. Replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your actual folder ID
3. Commit and push changes to GitHub

## 📝 **Example Update:**

```javascript
// In scripts/download-models.js
const CONFIG = {
  DRIVE_FOLDER_ID: '1ABC123DEF456GHI789', // Your actual folder ID
  DOWNLOAD_LINKS: {
    'ml-models.zip': 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
  }
};
```

## ✅ **Verification:**

After uploading and updating:
1. Test download: `npm run download-models`
2. Verify models: `npm run verify-models`
3. Start app: `npm run dev`

## 🎉 **Ready for Hackathon!**

Your MINDLOOM project now has:
- ✅ Complete source code on GitHub
- ✅ ML models on Google Drive
- ✅ Automated download system
- ✅ Comprehensive documentation
- ✅ Easy setup for judges

**Repository**: https://github.com/YashChaudhary841/MINDLOOM  
**ML Models**: Upload `ml-models-for-gdrive/` to Google Drive

---

**Next**: Upload the folder to Google Drive and share the link! 🚀
