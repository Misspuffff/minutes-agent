# Meeting Notes Agent

A Google Docs add-on that automatically converts meeting transcripts into structured, professional meeting notes using Google's Gemini AI.

## Features

- 🤖 **AI-Powered Processing** - Uses Gemini AI to intelligently parse transcripts
- 📝 **Structured Format** - Converts transcripts into professional meeting minutes
- 🔒 **Secure API Key Storage** - API keys stored securely in Google Apps Script properties
- 📄 **Direct Integration** - Adds formatted notes directly to your current document
- ⚙️ **Easy Configuration** - Simple settings dialog for API key management

## Quick Start

### 1. Install the Add-on

1. Open Google Docs
2. Go to **Extensions → Apps Script**
3. Copy the code from this repository into your Apps Script project
4. Save and authorize the script

### 2. Configure API Key

1. Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. In Google Docs, go to **Extensions → Meeting Notes Agent → Settings**
3. Enter your API key and click **Save Settings**

### 3. Use the Add-on

1. Go to **Extensions → Meeting Notes Agent → Add Meeting Notes to Document**
2. Paste your meeting transcript
3. Fill in meeting details (project title, client, date, etc.)
4. Click **Generate Meeting Notes**
5. Formatted meeting minutes will be added to your document!

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- Google account with Apps Script access
- Gemini API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/meeting-notes-agent.git
cd meeting-notes-agent

# Install Google Apps Script CLI
npm install -g @google/clasp

# Login to Google
clasp login

# Create Apps Script project
clasp create --type standalone --title "Meeting Notes Agent"
```

### Development Workflow

```bash
# Make changes to your code
code Code.gs

# Test locally
clasp push

# Commit changes
git add .
git commit -m "Add new feature"
git push origin main

# Deploy to production
./deploy.sh
```

## Project Structure

```
meeting-notes-agent/
├── Code.gs                    # Main Apps Script code
├── TranscriptDialog.html      # Transcript input dialog
├── SettingsDialog.html        # Settings configuration dialog
├── appsscript.json           # Apps Script manifest
├── .clasp.json              # Apps Script CLI configuration
├── deploy.sh                 # Deployment script
├── package.json              # Node.js dependencies
└── .github/workflows/       # GitHub Actions CI/CD
```

## API Key Management

The add-on uses Google Apps Script's PropertiesService for secure API key storage:

- ✅ No hardcoded API keys in source code
- ✅ Encrypted storage by Google's infrastructure
- ✅ Easy to update through Settings dialog
- ✅ Secure retrieval with proper error handling

## Meeting Notes Format

The add-on structures meeting notes into these sections:

1. **Project Kickoff** - Meeting details, attendees, contact info
2. **Client Vision** - Core ideas, problems being solved, vision
3. **Target Market & Use Case** - Who will use this, pain points, market needs
4. **System Concept & Architecture** - Technical approach, system design
5. **User Experience & Installation** - User interaction, installation process
6. **Technical & Engineering Considerations** - Technical challenges, requirements
7. **Cost & Market Positioning** - Pricing, competitive analysis
8. **Project Process & Next Steps** - Process, timeline, next steps
9. **Decisions Made** - Concrete decisions reached during the meeting
10. **Data & Insights** - Key metrics, data points, insights

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Manual Deployment

```bash
./deploy.sh
```

### Automatic Deployment

The project includes GitHub Actions for automatic deployment:

1. Push changes to the `main` branch
2. GitHub Actions automatically deploys to Google Apps Script
3. Your add-on is updated instantly!

## Troubleshooting

### Common Issues

**API Key Errors:**
- Make sure you've configured your API key in Settings
- Verify your API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)
- Use the "Test API Key" button in Settings to verify

**Deployment Issues:**
- Ensure you're logged in: `clasp login`
- Check project status: `clasp status`
- Verify `.clasp.json` has the correct project ID

**Permission Errors:**
- Make sure you have access to the Apps Script project
- Check that the project ID in `.clasp.json` is correct

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Setup Guide](API_KEY_SETUP.md)
- 🔧 [GitHub Integration Guide](GITHUB_INTEGRATION_SETUP.md)
- 🐛 [Report Issues](https://github.com/YOUR_USERNAME/meeting-notes-agent/issues)

## Acknowledgments

- Built with Google Apps Script
- Powered by Google's Gemini AI
- Uses Google Docs API for document manipulation