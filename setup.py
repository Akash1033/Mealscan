#!/usr/bin/env python3
"""
MealScan Setup Script
This script helps set up the MealScan application with proper environment configuration.
"""

import os
import sys
import subprocess
from pathlib import Path

def create_env_file():
    """Create .env file with default values"""
    env_content = """# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mealscan

# Hugging Face API Configuration (optional - get from https://huggingface.co/settings/tokens)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Open Food Facts API (optional - uses public API)
OPENFOODFACTS_API_URL=https://world.openfoodfacts.org
"""
    
    env_path = Path("backend/.env")
    if not env_path.exists():
        with open(env_path, "w") as f:
            f.write(env_content)
        print(f"✅ Created {env_path}")
        print("📝 Please edit the .env file and add your Hugging Face API key if you have one.")
    else:
        print(f"⚠️  {env_path} already exists. Skipping creation.")

def install_backend_dependencies():
    """Install Python dependencies"""
    print("📦 Installing backend dependencies...")
    print("Choose installation option:")
    print("1. Full version (with AI models) - requires more dependencies")
    print("2. Simple version (mock AI) - minimal dependencies")
    
    choice = input("Enter choice (1 or 2, default: 2): ").strip()
    
    if choice == "1":
        requirements_file = "backend/requirements.txt"
        print("Installing full version with AI models...")
    else:
        requirements_file = "backend/requirements_simple.txt"
        print("Installing simple version with mock AI...")
    
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", requirements_file], 
                      check=True, cwd=Path.cwd())
        print("✅ Backend dependencies installed successfully")
        return True, choice == "1"
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install backend dependencies: {e}")
        return False, False

def install_frontend_dependencies():
    """Install Node.js dependencies"""
    print("📦 Installing frontend dependencies...")
    try:
        subprocess.run(["npm", "install"], check=True, cwd=Path("frontend"))
        print("✅ Frontend dependencies installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        return False
    return True

def main():
    """Main setup function"""
    print("🚀 Setting up MealScan...")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("backend").exists() or not Path("frontend").exists():
        print("❌ Please run this script from the MealScan root directory")
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Install dependencies
    backend_success, is_full_version = install_backend_dependencies()
    frontend_success = install_frontend_dependencies()
    
    print("\n" + "=" * 50)
    if backend_success and frontend_success:
        print("🎉 Setup completed successfully!")
        print("\n📋 Next steps:")
        if is_full_version:
            print("1. Edit backend/.env and add your Hugging Face API key (optional)")
            print("2. Start MongoDB (if you want to use database features)")
            print("3. Start the backend: cd backend && python main.py")
        else:
            print("1. Start the simple backend: cd backend && python main_simple.py")
        print("2. Start the frontend: cd frontend && npm start")
        print("\n💡 Note: The app will work without MongoDB and Hugging Face API key,")
        print("   but with limited functionality.")
    else:
        print("❌ Setup completed with errors. Please check the messages above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
