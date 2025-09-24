# 🆕 Fresh Apps Script Project Setup

## The Problem
Your current Apps Script project is connected to your Kickr GCP account, which prevents you from switching to a different project. We need to create a completely fresh project.

## Solution: Create Brand New Apps Script Project

### Step 1: Create New Apps Script Project
1. Go to [script.google.com](https://script.google.com/)
2. Click **"New Project"** (this creates a fresh project with no GCP connections)
3. Give it a name: "Meeting Notes Agent - Fresh"

### Step 2: Copy Your Code Files
You'll need to copy these files to your new project:

#### Copy `Code.gs`:
1. In your new project, replace the default `Code.gs` content
2. Copy the entire content from your current `Code.gs` file
3. Paste it into the new project's `Code.gs`

#### Copy `appsscript.json`:
1. In your new project, click **"appsscript.json"** in the file list
2. Replace the default content with your updated manifest:

```json
{
  "timeZone": "America/New_York",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents.currentonly",
    "https://www.googleapis.com/auth/script.external_request"
  ],
  "addOns": {
    "docs": {
      "homepageTrigger": {
        "runFunction": "onHomepage",
        "enabled": true
      },
      "contextualTriggers": [{
        "universalActions": [{
          "label": "Generate Meeting Notes",
          "runFunction": "showSidebar"
        }]
      }],
      "onFileScopeGrantedTrigger": {
        "runFunction": "onFileScopeGranted"
      }
    }
  }
}
```

#### Copy HTML Files:
1. Create **"TranscriptDialog.html"** - copy content from your current file
2. Create **"SettingsDialog.html"** - copy content from your current file

### Step 3: Verify Project Settings
1. Click ⚙️ **Project settings**
2. Confirm it shows **"GCP: Standard"** (should be default)
3. **Do NOT change the GCP project** - leave it as default
4. Note your new **Script ID** (different from the old one)

### Step 4: Deploy Fresh Project
1. Click **Deploy** → **New deployment**
2. Choose **Type: Add-on**
3. Description: "Meeting Notes Agent - Fresh Project"
4. Click **Create Version**
5. Click **Deploy**

### Step 5: Test Installation
1. Copy the **Web App URL** from your deployment
2. Open the URL in a new tab
3. Click **"Install"** to add to your Google account
4. Open Google Docs and test the add-on

## Benefits of Fresh Project
- ✅ **No GCP connection issues** - starts with default project
- ✅ **Clean slate** - no legacy settings or connections
- ✅ **Your own Script ID** - completely independent
- ✅ **Simple deployment** - no complex setup required

## What You'll Need to Copy
Make sure you have these files ready to copy:
- `Code.gs` (your main script)
- `appsscript.json` (updated manifest)
- `TranscriptDialog.html` (if you have it)
- `SettingsDialog.html` (if you have it)

## After Setup
Once your fresh project is working:
1. You can delete the old project (connected to Kickr)
2. Use the new project for all future development
3. Share the new Web App URL with users

This approach completely avoids the GCP project switching issue! 🎉
