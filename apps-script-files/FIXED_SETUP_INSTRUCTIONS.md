# 🚀 FIXED Setup Instructions

## The Problem:
You're getting a syntax error because `appsscript.json` is not a JavaScript file - it's a configuration file that needs to be handled differently.

## ✅ CORRECT Setup Steps:

### Step 1: Create Apps Script Project
1. Go to [script.google.com](https://script.google.com/)
2. Click "New Project"
3. You'll see a default `Code.gs` file

### Step 2: Copy the Main Code
1. **Delete** all content in `Code.gs`
2. **Copy** the entire content from `Code.gs` file in this folder
3. **Paste** it into the Apps Script editor
4. **Save** (Ctrl+S or Cmd+S)

### Step 3: Add HTML Files
1. Click the **"+"** next to "Files" in Apps Script
2. Select **"HTML"**
3. Name it **"TranscriptDialog"**
4. **Copy** content from `TranscriptDialog.html` and **paste** it
5. Repeat for **"SettingsDialog"** with `SettingsDialog.html`

### Step 4: Update Manifest (IMPORTANT!)
1. In Apps Script, click on **"Project Settings"** (gear icon) in the left sidebar
2. Scroll down to **"Script Properties"**
3. You'll see the manifest settings there
4. **DON'T** try to create an `appsscript.json` file - Apps Script handles this automatically

### Step 5: Deploy
1. Click **"Deploy"** → **"New deployment"**
2. Choose **"Add-on"**
3. Title: **"Meeting Notes Agent"**
4. Click **"Deploy"**

### Step 6: Install
1. Open Google Docs
2. **Extensions** → **Add-ons** → **Install add-ons**
3. Search for your add-on and install

## 🎯 That's it! 

The key is: **DON'T create an `appsscript.json` file** - Apps Script handles the manifest automatically when you deploy as an add-on.

---

## 🔧 If you still get errors:

1. **Make sure** you're copying the `Code.gs` content into the main `Code.gs` file
2. **Don't** try to create `appsscript.json` as a separate file
3. **Check** that the HTML files are named exactly: `TranscriptDialog` and `SettingsDialog`
4. **Save** after each step

**The manifest is handled automatically by Apps Script!** 🚀
