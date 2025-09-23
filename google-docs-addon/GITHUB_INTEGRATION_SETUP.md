# GitHub Integration Setup for Google Apps Script

This guide will help you connect your Google Apps Script add-on to GitHub for automatic deployment and version control.

## Prerequisites

- Node.js installed on your computer
- Git installed
- GitHub account
- Google account with Apps Script access

## Step 1: Install Google Apps Script CLI

```bash
# Install the Google Apps Script CLI globally
npm install -g @google/clasp
```

## Step 2: Authenticate with Google

```bash
# Login to your Google account
clasp login
```

This will open a browser window for you to authenticate with your Google account.

## Step 3: Create a New Apps Script Project

```bash
# Navigate to your project directory
cd /Users/maddyclaypoole/Desktop/minutes-agent/google-docs-addon

# Create a new Apps Script project
clasp create --type standalone --title "Meeting Notes Agent"
```

This will create a new Apps Script project and generate a `.clasp.json` file.

## Step 4: Initialize Git Repository

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Meeting Notes Agent add-on"
```

## Step 5: Create GitHub Repository

1. Go to GitHub.com and create a new repository
2. Name it something like `meeting-notes-agent`
3. Don't initialize with README (since you already have files)
4. Copy the repository URL

## Step 6: Connect Local Repository to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/meeting-notes-agent.git

# Push to GitHub
git push -u origin main
```

## Step 7: Configure Automatic Deployment

### Option A: Manual Push and Deploy (Recommended)

Create a deployment script:

```bash
# Create deploy.sh script
cat > deploy.sh << 'EOF'
#!/bin/bash

# Pull latest changes
git pull origin main

# Push to Apps Script
clasp push

echo "Deployment complete!"
EOF

# Make it executable
chmod +x deploy.sh
```

### Option B: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Google Apps Script

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install clasp
      run: npm install -g @google/clasp
    
    - name: Deploy to Apps Script
      run: |
        echo "${{ secrets.CLASP_TOKEN }}" > ~/.clasprc.json
        clasp push
      env:
        CLASP_TOKEN: ${{ secrets.CLASP_TOKEN }}
```

## Step 8: Workflow

### Daily Development Workflow:

1. **Make changes locally:**
   ```bash
   # Edit your files
   code Code.gs
   code TranscriptDialog.html
   ```

2. **Test locally (optional):**
   ```bash
   # Push to Apps Script for testing
   clasp push
   ```

3. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Add new feature: better error handling"
   git push origin main
   ```

4. **Deploy to production:**
   ```bash
   # Run deployment script
   ./deploy.sh
   ```

## Step 9: Environment Setup

Create a `.gitignore` file:

```gitignore
# Apps Script
.clasp.json
.clasprc.json

# Node modules
node_modules/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db
```

## Step 10: Project Structure

Your final project structure should look like:

```
meeting-notes-agent/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── Code.gs
├── TranscriptDialog.html
├── SettingsDialog.html
├── appsscript.json
├── .clasp.json
├── .gitignore
├── deploy.sh
└── README.md
```

## Benefits of This Setup

✅ **Version Control** - Track all changes in GitHub
✅ **Collaboration** - Multiple developers can work on the project
✅ **Backup** - Your code is safely stored in GitHub
✅ **Rollback** - Easy to revert to previous versions
✅ **Documentation** - Track changes with commit messages
✅ **CI/CD** - Automatic deployment (with GitHub Actions)

## Troubleshooting

### Common Issues:

1. **Authentication Error:**
   ```bash
   clasp login --no-localhost
   ```

2. **Permission Denied:**
   - Make sure you have access to the Apps Script project
   - Check that the project ID in `.clasp.json` is correct

3. **Push Failed:**
   ```bash
   # Check project status
   clasp status
   
   # Force push if needed
   clasp push --force
   ```

## Next Steps

1. Set up the GitHub repository
2. Configure the deployment workflow
3. Test the integration
4. Start developing with version control!

This setup will allow you to make changes locally, commit them to GitHub, and deploy them to your Google Apps Script add-on automatically.
