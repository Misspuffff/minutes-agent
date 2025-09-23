# 🚀 Automated Deployment Setup Guide

This guide will set up automated deployment so that when you push changes to GitHub, your Google Apps Script add-on updates automatically. No more copy-pasting!

## 📋 Prerequisites

1. ✅ GitHub repository (already done)
2. ✅ Google account with Apps Script access
3. ✅ Gemini API key

## 🔧 Step 1: Enable Apps Script API

1. Go to [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
2. Enable "Google Apps Script API"
3. Wait 2-3 minutes for the API to propagate

## 🎯 Step 2: Create Apps Script Project

### Option A: Using CLI (Recommended)
```bash
cd google-docs-addon
npx clasp create --type standalone --title "Meeting Notes Agent"
```

### Option B: Manual Creation
1. Go to [script.google.com](https://script.google.com/)
2. Click "New Project"
3. Copy the Script ID from the URL (looks like: `1ABC123...`)
4. Update `.clasp.json` with your Script ID

## 🔑 Step 3: Get Clasp Token for GitHub

1. **Generate token**:
   ```bash
   cd google-docs-addon
   npx clasp login --creds ~/.clasprc.json
   ```

2. **Copy the token** from `~/.clasprc.json`:
   ```bash
   cat ~/.clasprc.json
   ```

## 🔐 Step 4: Configure GitHub Secrets

1. Go to your GitHub repository: https://github.com/misspufffff/minutes-agent
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CLASP_TOKEN`
5. Value: Paste the token from step 3
6. Click **Add secret**

## 🚀 Step 5: Test Automated Deployment

1. **Make a small change** to any file in `google-docs-addon/`
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```
3. **Check GitHub Actions**: Go to your repo → Actions tab
4. **Verify deployment**: Check your Apps Script project for updates

## 🎉 You're Done!

Now every time you:
1. Make changes to your code
2. Commit and push to GitHub
3. GitHub Actions automatically deploys to your Apps Script add-on

## 📁 Project Structure

```
google-docs-addon/
├── Code.gs                    # Main Apps Script code
├── TranscriptDialog.html      # Transcript input dialog
├── SettingsDialog.html        # Settings configuration dialog
├── appsscript.json           # Apps Script manifest
├── .clasp.json              # Apps Script CLI configuration
├── package.json              # Node.js dependencies
└── .github/workflows/       # GitHub Actions CI/CD
    └── deploy.yml           # Automated deployment workflow
```

## 🔧 Development Workflow

1. **Edit code** in your local files
2. **Test locally** (optional):
   ```bash
   cd google-docs-addon
   npx clasp push
   ```
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```
4. **Automatic deployment** happens via GitHub Actions
5. **Your add-on updates** automatically in Google Docs!

## 🐛 Troubleshooting

### "Apps Script API not enabled"
- Go to [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
- Enable "Google Apps Script API"
- Wait 2-3 minutes

### "Script ID not found"
- Update `.clasp.json` with correct Script ID
- Make sure you're in the right Apps Script project

### "CLASP_TOKEN invalid"
- Regenerate token: `npx clasp login --creds ~/.clasprc.json`
- Update GitHub secret with new token

### Deployment fails
- Check GitHub Actions logs
- Verify all files are in `google-docs-addon/` directory
- Make sure `.clasp.json` has correct Script ID

## 🎯 Benefits

- ✅ **No more copy-pasting** code manually
- ✅ **Version control** for your add-on
- ✅ **Automatic updates** when you push changes
- ✅ **Collaborative development** with others
- ✅ **Backup** of your code on GitHub
- ✅ **Rollback** capability if something breaks

## 📞 Support

If you run into issues:
1. Check the GitHub Actions logs
2. Verify your Script ID in `.clasp.json`
3. Make sure CLASP_TOKEN secret is set correctly
4. Ensure Apps Script API is enabled

Happy coding! 🚀
