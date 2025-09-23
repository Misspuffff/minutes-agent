# 🚀 Complete Setup Guide - Google Docs Add-on

## The Issue:
Add-ons need OAuth permissions to work, which requires deploying as a web application first.

## ✅ CORRECT Setup Steps:

### Step 1: Create Apps Script Project
1. Go to [script.google.com](https://script.google.com/)
2. Click "New Project"
3. Delete all content in `Code.gs`
4. Copy the content from `Code.gs` file in this folder
5. Paste it into Apps Script
6. Save (Ctrl+S or Cmd+S)

### Step 2: Add HTML Files
1. Click "+" next to "Files"
2. Select "HTML"
3. Name it "TranscriptDialog"
4. Copy content from `TranscriptDialog.html` and paste it
5. Repeat for "SettingsDialog" with `SettingsDialog.html`

### Step 3: Deploy as Web Application (REQUIRED FIRST!)
1. Click "Deploy" → "New deployment"
2. Choose "Web app" (NOT add-on yet!)
3. Description: "Meeting Notes Agent Web App"
4. Execute as: "Me"
5. Who has access: "Anyone"
6. Click "Deploy"
7. **Authorize** the permissions when prompted
8. Copy the web app URL (you'll need this)

### Step 4: Deploy as Add-on (NOW!)
1. Click "Deploy" → "New deployment"
2. Choose "Add-on"
3. Title: "Meeting Notes Agent"
4. Description: "Convert meeting transcripts into structured meeting notes"
5. Click "Deploy"

### Step 5: Install the Add-on
1. Open Google Docs
2. Go to "Extensions" → "Add-ons" → "Install add-ons"
3. Search for "Meeting Notes Agent"
4. Click "Install"
5. **Authorize** the permissions

## 🎯 Why This Works:

- **Web app deployment** gets the OAuth permissions working
- **Add-on deployment** makes it available in Google Docs
- **Authorization** allows it to access your documents and create new ones

## 🔧 If It Still Doesn't Work:

### Check Permissions:
1. Go to [myaccount.google.com/permissions](https://myaccount.google.com/permissions)
2. Look for "Google Apps Script"
3. Make sure it has the right permissions

### Alternative Method:
1. In Google Docs, go to "Extensions" → "Apps Script"
2. Create a new script
3. Copy the code there
4. Save and run it once to authorize
5. Then deploy as add-on

## 🚀 Test It:

1. Open a Google Doc
2. Select some text
3. Go to "Extensions" → "Meeting Notes Agent"
4. Click "Convert Transcript to Meeting Notes"
5. It should work!

---

## 📝 Quick Summary:

1. **Deploy as web app first** (gets OAuth working)
2. **Deploy as add-on** (makes it available in Docs)
3. **Install from add-ons store**
4. **Authorize permissions**
5. **Start using!**

**The key is deploying as web app FIRST to get the permissions!** 🚀
