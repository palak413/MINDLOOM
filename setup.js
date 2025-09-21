#!/usr/bin/env node

/**
 * 🚀 MINDLOOM Complete Setup Script
 * 
 * This script sets up the entire MINDLOOM project including:
 * - Installing dependencies
 * - Downloading ML models
 * - Verifying installation
 * - Starting the application
 * 
 * Usage:
 *   node setup.js
 *   npm run setup
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class MINDLOOMSetup {
  constructor() {
    this.projectRoot = process.cwd();
    this.steps = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = {
      info: '📦',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      header: '🚀'
    }[type] || '📦';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, description) {
    try {
      this.log(`Running: ${description}`, 'info');
      execSync(command, { stdio: 'inherit', cwd: this.projectRoot });
      this.log(`Completed: ${description}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed: ${description}`, 'error');
      this.log(`Error: ${error.message}`, 'error');
      return false;
    }
  }

  async checkPrerequisites() {
    this.log('Checking prerequisites...', 'header');
    
    // Check Node.js version
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const version = parseInt(nodeVersion.replace('v', '').split('.')[0]);
      if (version >= 18) {
        this.log(`Node.js version: ${nodeVersion} ✅`, 'success');
      } else {
        this.log(`Node.js version: ${nodeVersion} ❌ (Requires 18+)`, 'error');
        return false;
      }
    } catch (error) {
      this.log('Node.js not found! Please install Node.js 18+', 'error');
      return false;
    }

    // Check npm
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      this.log(`npm version: ${npmVersion} ✅`, 'success');
    } catch (error) {
      this.log('npm not found!', 'error');
      return false;
    }

    return true;
  }

  async installDependencies() {
    this.log('Installing dependencies...', 'header');
    
    const steps = [
      ['npm install', 'Installing root dependencies'],
      ['cd backend && npm install', 'Installing backend dependencies'],
      ['cd frontend && npm install', 'Installing frontend dependencies']
    ];

    for (const [command, description] of steps) {
      const success = await this.runCommand(command, description);
      if (!success) return false;
    }

    return true;
  }

  async downloadModels() {
    this.log('Setting up ML models...', 'header');
    
    // Check if models already exist
    const verifierPath = path.join(this.projectRoot, 'scripts', 'verify-models.js');
    if (fs.existsSync(verifierPath)) {
      try {
        execSync('node scripts/verify-models.js', { stdio: 'inherit', cwd: this.projectRoot });
        this.log('Models verification completed', 'success');
      } catch (error) {
        this.log('Some models are missing. Please download them manually.', 'warning');
        this.log('See ML_MODELS_SETUP.md for instructions', 'info');
      }
    } else {
      this.log('Model verification script not found', 'warning');
    }

    return true;
  }

  async createEnvFiles() {
    this.log('Setting up environment files...', 'header');
    
    // Backend .env
    const backendEnvPath = path.join(this.projectRoot, 'backend', '.env');
    if (!fs.existsSync(backendEnvPath)) {
      const backendEnvContent = `# MINDLOOM Backend Environment Variables
PORT=8000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/mindloom
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_key_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
EMAIL_USER=your_email_here
EMAIL_PASS=your_password_here
BCRYPT_SALT_ROUNDS=10
`;
      fs.writeFileSync(backendEnvPath, backendEnvContent);
      this.log('Created backend/.env file', 'success');
    } else {
      this.log('backend/.env already exists', 'info');
    }

    // Frontend .env.local
    const frontendEnvPath = path.join(this.projectRoot, 'frontend', '.env.local');
    if (!fs.existsSync(frontendEnvPath)) {
      const frontendEnvContent = `# MINDLOOM Frontend Environment Variables
VITE_API_URL=http://localhost:8000/api/v1
`;
      fs.writeFileSync(frontendEnvPath, frontendEnvContent);
      this.log('Created frontend/.env.local file', 'success');
    } else {
      this.log('frontend/.env.local already exists', 'info');
    }

    return true;
  }

  async buildProject() {
    this.log('Building project...', 'header');
    
    const success = await this.runCommand('npm run build', 'Building frontend');
    return success;
  }

  async showNextSteps() {
    this.log('Setup completed! Next steps:', 'header');
    console.log('');
    console.log('🔧 Configuration:');
    console.log('  1. Update backend/.env with your API keys');
    console.log('  2. Update frontend/.env.local with your backend URL');
    console.log('  3. Download ML models: npm run download-models');
    console.log('');
    console.log('🚀 Running the application:');
    console.log('  • Development: npm run dev');
    console.log('  • Production: npm start');
    console.log('');
    console.log('📱 Access:');
    console.log('  • Frontend: http://localhost:3000');
    console.log('  • Backend API: http://localhost:8000');
    console.log('');
    console.log('📚 Documentation:');
    console.log('  • README.md - Complete setup guide');
    console.log('  • ML_MODELS_SETUP.md - ML models setup');
    console.log('  • DEPLOYMENT.md - Deployment guide');
    console.log('');
    this.log('Happy coding! 🌸', 'success');
  }

  async run() {
    console.log('🌸 MINDLOOM Complete Setup');
    console.log('==========================');
    console.log('');

    try {
      // Step 1: Check prerequisites
      const prereqsOk = await this.checkPrerequisites();
      if (!prereqsOk) {
        this.log('Prerequisites check failed. Please install required software.', 'error');
        return false;
      }

      // Step 2: Install dependencies
      const depsOk = await this.installDependencies();
      if (!depsOk) {
        this.log('Dependency installation failed.', 'error');
        return false;
      }

      // Step 3: Create environment files
      const envOk = await this.createEnvFiles();
      if (!envOk) {
        this.log('Environment setup failed.', 'error');
        return false;
      }

      // Step 4: Download models
      const modelsOk = await this.downloadModels();
      if (!modelsOk) {
        this.log('Model setup had issues. Check ML_MODELS_SETUP.md', 'warning');
      }

      // Step 5: Build project
      const buildOk = await this.buildProject();
      if (!buildOk) {
        this.log('Build failed. Check for errors above.', 'warning');
      }

      // Step 6: Show next steps
      await this.showNextSteps();

      return true;

    } catch (error) {
      this.log(`Setup failed: ${error.message}`, 'error');
      return false;
    }
  }
}

// Main execution
async function main() {
  const setup = new MINDLOOMSetup();
  const success = await setup.run();
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = MINDLOOMSetup;
