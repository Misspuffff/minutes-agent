#!/bin/bash

# Setup script for Meeting Agent

echo "🚀 Setting up Meeting Agent..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.7 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for API key
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY environment variable not set"
    echo "Please set your Gemini API key:"
    echo "export GEMINI_API_KEY='your_api_key_here'"
    echo ""
    echo "You can get an API key from: https://makersuite.google.com/app/apikey"
else
    echo "✅ GEMINI_API_KEY is set"
fi

# Make scripts executable
chmod +x meeting_agent.py
chmod +x test_agent.py

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To test the agent, run:"
echo "python3 test_agent.py"
echo ""
echo "To use the agent, run:"
echo "python3 meeting_agent.py 'your_transcript_here'"
echo ""
echo "For more options, run:"
echo "python3 meeting_agent.py --help"

