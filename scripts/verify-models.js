#!/usr/bin/env node

/**
 * 🔍 ML Models Verification Script
 * 
 * This script verifies that all required ML models are present
 * and properly installed for MINDLOOM.
 * 
 * Usage:
 *   node scripts/verify-models.js
 *   npm run verify-models
 */

const fs = require('fs');
const path = require('path');

// Expected files and their minimum sizes (in bytes)
const EXPECTED_FILES = [
  {
    path: 'ml_cbt_service/cbt_model/model.safetensors',
    minSize: 100 * 1024 * 1024, // 100MB
    description: 'CBT Therapy Model'
  },
  {
    path: 'ml_cbt_service/cbt_model/config.json',
    minSize: 1024, // 1KB
    description: 'CBT Model Config'
  },
  {
    path: 'ml_cbt_service/cbt_model/tokenizer.json',
    minSize: 1024 * 1024, // 1MB
    description: 'CBT Tokenizer'
  },
  {
    path: 'results/checkpoint-150/model.safetensors',
    minSize: 10 * 1024 * 1024, // 10MB
    description: 'Voice Emotion Model'
  },
  {
    path: 'results/checkpoint-150/optimizer.pt',
    minSize: 1024 * 1024, // 1MB
    description: 'Model Optimizer'
  },
  {
    path: 'backend/ai_voice_model/enhanced_voice_emotion_model/enhanced_model.pkl',
    minSize: 1024 * 1024, // 1MB
    description: 'Enhanced Voice Model'
  },
  {
    path: 'backend/ai_voice_model/simple_voice_emotion_model/simple_model.pkl',
    minSize: 1024 * 1024, // 1MB
    description: 'Simple Voice Model'
  },
  {
    path: 'backend/ai_voice_model/ultra_simple_voice_emotion_model/ultra_simple_model.pkl',
    minSize: 1024 * 1024, // 1MB
    description: 'Ultra Simple Voice Model'
  }
];

class ModelVerifier {
  constructor() {
    this.projectRoot = process.cwd();
    this.results = {
      total: EXPECTED_FILES.length,
      found: 0,
      missing: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      info: '📦',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      header: '🔍'
    }[type] || '📦';
    
    console.log(`${prefix} ${message}`);
  }

  formatSize(bytes) {
    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
    } else if (bytes >= 1024) {
      return `${(bytes / 1024).toFixed(2)}KB`;
    } else {
      return `${bytes}B`;
    }
  }

  verifyFile(fileInfo) {
    const fullPath = path.join(this.projectRoot, fileInfo.path);
    
    try {
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const size = stats.size;
        
        if (size >= fileInfo.minSize) {
          this.log(`${fileInfo.description}: Found (${this.formatSize(size)})`, 'success');
          this.results.found++;
          return true;
        } else {
          this.log(`${fileInfo.description}: Too small (${this.formatSize(size)} < ${this.formatSize(fileInfo.minSize)})`, 'warning');
          this.results.errors.push(`${fileInfo.path}: File too small`);
          return false;
        }
      } else {
        this.log(`${fileInfo.description}: Missing`, 'error');
        this.results.missing++;
        this.results.errors.push(`${fileInfo.path}: File not found`);
        return false;
      }
    } catch (error) {
      this.log(`${fileInfo.description}: Error checking file`, 'error');
      this.results.errors.push(`${fileInfo.path}: ${error.message}`);
      return false;
    }
  }

  async verifyAllModels() {
    this.log('Starting ML Models Verification...', 'header');
    console.log('='.repeat(50));
    
    for (const fileInfo of EXPECTED_FILES) {
      this.verifyFile(fileInfo);
    }
    
    console.log('='.repeat(50));
    this.printSummary();
    
    return this.results.found === this.results.total;
  }

  printSummary() {
    this.log('Verification Summary:', 'header');
    this.log(`Total files: ${this.results.total}`);
    this.log(`Found: ${this.results.found}`, 'success');
    this.log(`Missing: ${this.results.missing}`, 'error');
    
    if (this.results.errors.length > 0) {
      this.log('\nIssues found:', 'warning');
      this.results.errors.forEach(error => {
        this.log(`  • ${error}`, 'error');
      });
    }
    
    if (this.results.found === this.results.total) {
      this.log('\n🎉 All models verified successfully!', 'success');
      this.log('Your MINDLOOM app is ready to run with full AI capabilities.', 'success');
    } else {
      this.log('\n⚠️  Some models are missing or invalid.', 'warning');
      this.log('Please download the missing models from Google Drive.', 'warning');
      this.log('See ML_MODELS_SETUP.md for instructions.', 'info');
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      project: 'MINDLOOM',
      verification: this.results,
      files: EXPECTED_FILES.map(fileInfo => ({
        path: fileInfo.path,
        description: fileInfo.description,
        exists: fs.existsSync(path.join(this.projectRoot, fileInfo.path)),
        size: fs.existsSync(path.join(this.projectRoot, fileInfo.path)) 
          ? fs.statSync(path.join(this.projectRoot, fileInfo.path)).size 
          : 0
      }))
    };
    
    const reportPath = path.join(this.projectRoot, 'model-verification-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`Verification report saved to: ${reportPath}`, 'info');
  }
}

// Main execution
async function main() {
  const verifier = new ModelVerifier();
  
  console.log('🔍 MINDLOOM ML Models Verifier');
  console.log('===============================');
  
  const success = await verifier.verifyAllModels();
  verifier.generateReport();
  
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ModelVerifier;
