# 🔧 Proper Add-on Setup Guide

The installation URL isn't working because we need to configure the Apps Script project as a web app first. Here's how to fix it:

## 🎯 Method 1: Manual Setup (Recommended)

### Step 1: Open Apps Script Project
1. Go to: https://script.google.com/d/1ODPeqh4dBlsqXakXR-DRGvE4xuexPYHv9DGdvkPpqHTgtoih-MQQfew7/edit
2. You should see your "Meeting Notes Agent" project

### Step 2: Deploy as Web App
1. **Click "Deploy"** → **"New deployment"**
2. **Choose type**: "Web app" (not "Add-on")
3. **Description**: "Meeting Notes Agent Web App"
4. **Execute as**: "Me"
5. **Who has access**: "Anyone with Google account"
6. **Click "Deploy"**

### Step 3: Get Installation URL
1. **Copy the Web App URL** from the deployment
2. **This URL will work** for installation

## 🎯 Method 2: Use Google Docs Add-on Store

### Step 1: Publish to Add-on Store
1. In your Apps Script project
2. **Click "Deploy"** → **"Manage deployments"**
3. **Click the gear icon** next to your deployment
4. **Change type** to "Add-on"
5. **Update deployment**

### Step 2: Install from Add-ons Menu
1. **Open Google Docs**
2. **Extensions** → **Add-ons** → **Get add-ons**
3. **Search for "Meeting Notes Agent"**
4. **Install** (if published)

## 🎯 Method 3: Direct Installation (Easiest)

### Step 1: Create Installation Script
1. **Open your Apps Script project**
2. **Add this function** to Code.gs:

```javascript
function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  var ui = DocumentApp.getUi();
  ui.createMenu('Meeting Notes Agent')
    .addItem('Convert Transcript to Meeting Notes', 'showTranscriptDialog')
    .addItem('Settings', 'showSettingsDialog')
    .addToUi();
}
```

### Step 2: Deploy as Add-on
1. **Click "Deploy"** → **"New deployment"**
2. **Type**: "Add-on"
3. **Title**: "Meeting Notes Agent"
4. **Click "Deploy"**

### Step 3: Install Add-on
1. **Get the installation URL** from deployment
2. **Click the URL** to install
3. **Authorize permissions**
4. **Install the add-on**

## ✅ Verify Installation

1. **Open Google Docs**
2. **Create new document**
3. **Look for "Extensions"** menu
4. **Click "Extensions"** → **"Meeting Notes Agent"**
5. **You should see the menu options!**

## 🔧 Configure API Key

1. **Extensions** → **Meeting Notes Agent** → **Settings**
2. **Enter your Gemini API key**
3. **Click "Save Settings"**

## 🎯 Test the Add-on

1. **Extensions** → **Meeting Notes Agent** → **Convert Transcript to Meeting Notes**
2. **Paste a sample transcript**
3. **Fill in meeting details**
4. **Click "Generate Meeting Notes"**
5. **Check that formatted notes appear in your document**

## 🆘 Troubleshooting

### "Add-on not found"
- Make sure you deployed as "Add-on" type, not "Web app"
- Check that you're signed into the correct Google account
- Try refreshing Google Docs

### "Permission denied"
- Click "Allow" when prompted for permissions
- Make sure you have access to the Apps Script project

### "API key error"
- Go to Settings and enter a valid Gemini API key
- Get a new API key from Google AI Studio if needed

## 🎉 Success!

Once properly set up, you'll have a working meeting notes converter right in Google Docs!

**The key is deploying as an "Add-on" type, not a "Web app" type.**
