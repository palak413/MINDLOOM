#!/usr/bin/env node

/**
 * 🤖 ML Models Download Script
 * 
 * This script automatically downloads ML models from Google Drive
 * and places them in the correct directories for MINDLOOM.
 * 
 * Usage:
 *   node scripts/download-models.js
 *   npm run download-models
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  // Google Drive folder ID
  DRIVE_FOLDER_ID: '1AbYxAAFPcSYvXUMvx2WJv7NsH83Q6gop',
  
  // Direct download links (replace with your actual shareable links)
  DOWNLOAD_LINKS: {
    'ml-models.zip': 'https://drive.google.com/uc?export=download&id=YOUR_FILE_ID',
    // Add more direct links as needed
  },
  
  // Model directories to create
  DIRECTORIES: [
    'ml_cbt_service/cbt_model',
    'results/checkpoint-150',
    'backend/ai_voice_model/enhanced_voice_emotion_model',
    'backend/ai_voice_model/simple_voice_emotion_model',
    'backend/ai_voice_model/ultra_simple_voice_emotion_model',
    'backend/ai_voice_model/voice_emotion_model'
  ],
  
  // Expected files after extraction
  EXPECTED_FILES: [
    'ml_cbt_service/cbt_model/model.safetensors',
    'ml_cbt_service/cbt_model/config.json',
    'ml_cbt_service/cbt_model/tokenizer.json',
    'results/checkpoint-150/model.safetensors',
    'results/checkpoint-150/optimizer.pt',
    'backend/ai_voice_model/enhanced_voice_emotion_model/enhanced_model.pkl',
    'backend/ai_voice_model/simple_voice_emotion_model/simple_model.pkl',
    'backend/ai_voice_model/ultra_simple_voice_emotion_model/ultra_simple_model.pkl'
  ]
};

class ModelDownloader {
  constructor() {
    this.projectRoot = process.cwd();
    this.downloadDir = path.join(this.projectRoot, 'temp-models');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📦',
      success: '✅',
      error: '❌',
      warning: '⚠️'
    }[type] || '📦';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async createDirectories() {
    this.log('Creating model directories...');
    
    for (const dir of CONFIG.DIRECTORIES) {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        this.log(`Created directory: ${dir}`, 'success');
      }
    }
  }

  async downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.downloadDir, filename);
      const file = fs.createWriteStream(filePath);
      
      this.log(`Downloading ${filename}...`);
      
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          this.log(`Downloaded ${filename}`, 'success');
          resolve(filePath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      }).on('error', reject);
    });
  }

  async extractZip(zipPath, extractTo) {
    return new Promise((resolve, reject) => {
      try {
        // Try to use unzip command (Linux/Mac)
        execSync(`unzip -o "${zipPath}" -d "${extractTo}"`, { stdio: 'inherit' });
        this.log('Extracted models successfully', 'success');
        resolve();
      } catch (error) {
        try {
          // Try PowerShell (Windows)
          execSync(`powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractTo}' -Force"`, { stdio: 'inherit' });
          this.log('Extracted models successfully (PowerShell)', 'success');
          resolve();
        } catch (psError) {
          reject(new Error('Failed to extract zip file. Please install unzip or use PowerShell.'));
        }
      }
    });
  }

  async verifyModels() {
    this.log('Verifying model installation...');
    
    let allFound = true;
    
    for (const file of CONFIG.EXPECTED_FILES) {
      const fullPath = path.join(this.projectRoot, file);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        this.log(`✅ ${file} (${sizeMB}MB)`, 'success');
      } else {
        this.log(`❌ Missing: ${file}`, 'error');
        allFound = false;
      }
    }
    
    return allFound;
  }

  async cleanup() {
    if (fs.existsSync(this.downloadDir)) {
      fs.rmSync(this.downloadDir, { recursive: true, force: true });
      this.log('Cleaned up temporary files', 'success');
    }
  }

  async downloadModels() {
    try {
      this.log('🚀 Starting ML Models Download...');
      
      // Create directories
      await this.createDirectories();
      
      // Create download directory
      if (!fs.existsSync(this.downloadDir)) {
        fs.mkdirSync(this.downloadDir, { recursive: true });
      }
      
      // Check if models already exist
      const modelsExist = await this.verifyModels();
      if (modelsExist) {
        this.log('All models already exist! Skipping download.', 'warning');
        return true;
      }
      
      // Download models
      this.log('📥 Downloading models from Google Drive...');
      this.log('⚠️  Please ensure you have updated the download links in this script!', 'warning');
      
      // For now, show manual instructions
      this.log('Manual download required:', 'warning');
      this.log('1. Go to: https://drive.google.com/drive/folders/YOUR_FOLDER_ID', 'info');
      this.log('2. Download ml-models.zip', 'info');
      this.log('3. Extract to project root', 'info');
      this.log('4. Run: npm run verify-models', 'info');
      
      return false;
      
    } catch (error) {
      this.log(`Error: ${error.message}`, 'error');
      return false;
    } finally {
      await this.cleanup();
    }
  }
}

// Main execution
async function main() {
  const downloader = new ModelDownloader();
  
  console.log('🤖 MINDLOOM ML Models Downloader');
  console.log('================================');
  
  const success = await downloader.downloadModels();
  
  if (success) {
    console.log('\n🎉 All models downloaded successfully!');
    console.log('You can now run: npm start');
  } else {
    console.log('\n⚠️  Manual download required.');
    console.log('Please follow the instructions above or check ML_MODELS_SETUP.md');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ModelDownloader;
