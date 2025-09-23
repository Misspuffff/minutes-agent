# 🔑 Gemini API Key Setup Guide

The error "API key not valid" means you need to get a proper Gemini API key and configure it correctly.

## 🎯 **Step 1: Get a Valid Gemini API Key**

### Option A: Google AI Studio (Recommended)
1. **Go to**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"**
4. **Copy the API key** (starts with `AIza...`)

### Option B: Google Cloud Console
1. **Go to**: https://console.cloud.google.com/
2. **Create a new project** or select existing
3. **Enable the Generative AI API**
4. **Go to "Credentials"** → **"Create Credentials"** → **"API Key"**
5. **Copy the API key**

## 🎯 **Step 2: Configure API Key in Add-on**

### Method 1: Through Settings Dialog
1. **Open Google Docs**
2. **Extensions** → **Meeting Notes Agent** → **Settings**
3. **Paste your API key** in the text field
4. **Click "Save Settings"**
5. **Click "Test API Key"** to verify

### Method 2: Direct Configuration
1. **Go to your Apps Script project**: https://script.google.com/d/1ODPeqh4dBlsqXakXR-DRGvE4xuexPYHv9DGdvkPpqHTgtoih-MQQfew7/edit
2. **Click "Project Settings"** (gear icon)
3. **Scroll down** to "Script Properties"
4. **Add new property**:
   - **Property**: `GEMINI_API_KEY`
   - **Value**: Your API key
5. **Click "Save Script Properties"**

## 🎯 **Step 3: Test the API Key**

### In the Add-on:
1. **Extensions** → **Meeting Notes Agent** → **Settings**
2. **Click "Test API Key"**
3. **Should show**: "API key is working correctly!"

### In Apps Script:
1. **Open Apps Script project**
2. **Click "Run"** next to `testApiKey` function
3. **Check the execution log** for success/error

## 🔧 **Common Issues & Solutions**

### "API key not valid"
- ✅ **Check**: API key starts with `AIza...`
- ✅ **Verify**: Copied the entire key (no spaces/extra characters)
- ✅ **Ensure**: API key is from Google AI Studio or Google Cloud Console

### "API key not configured"
- ✅ **Check**: API key is saved in Settings
- ✅ **Verify**: Script Properties contains `GEMINI_API_KEY`
- ✅ **Try**: Re-saving the API key

### "Quota exceeded"
- ✅ **Check**: API usage limits in Google Cloud Console
- ✅ **Verify**: Billing is enabled (if required)
- ✅ **Wait**: For quota to reset (usually daily)

### "Permission denied"
- ✅ **Check**: API key has proper permissions
- ✅ **Verify**: Generative AI API is enabled
- ✅ **Ensure**: Project has access to the API

## 🎯 **Step 4: Verify Everything Works**

1. **Configure API key** using one of the methods above
2. **Test API key** in Settings
3. **Try converting a transcript**:
   - **Extensions** → **Meeting Notes Agent** → **Convert Transcript to Meeting Notes**
   - **Paste a sample transcript**
   - **Fill in meeting details**
   - **Click "Generate Meeting Notes"**

## 🆘 **Still Having Issues?**

### Check API Key Format
- ✅ **Starts with**: `AIza`
- ✅ **Length**: Usually 39 characters
- ✅ **No spaces**: Before or after the key
- ✅ **No quotes**: Don't include quotes when pasting

### Check API Key Permissions
- ✅ **Google AI Studio**: Should work immediately
- ✅ **Google Cloud Console**: May need additional setup
- ✅ **Billing**: Some APIs require billing to be enabled

### Test with Simple Request
You can test your API key directly in a browser:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY
```

## 🎉 **Success!**

Once configured properly, you should see:
- ✅ **"API key is working correctly!"** in Settings
- ✅ **Successful transcript conversion** in the add-on
- ✅ **Formatted meeting notes** added to your document

**The key is getting a valid API key from Google AI Studio and configuring it properly in the add-on!**
