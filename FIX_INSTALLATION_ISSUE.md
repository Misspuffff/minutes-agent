# 🔧 Fix Installation Issue

The installation URL is showing a Google Drive error because the deployment isn't properly configured. Here's how to fix it:

## 🎯 **Step-by-Step Fix:**

### Step 1: Open Apps Script Project
1. Go to: https://script.google.com/d/1ODPeqh4dBlsqXakXR-DRGvE4xuexPYHv9DGdvkPpqHTgtoih-MQQfew7/edit
2. You should see your "Meeting Notes Agent" project

### Step 2: Check Current Deployments
1. **Click "Deploy"** → **"Manage deployments"**
2. **Look at the list** of deployments
3. **Find the one** with ID `AKfycbw5LElJiAnWmw-1TE4y4j1VI99NJPjmt7MZfXQq13wXk3JjkzqF7ysvh2-lJUTnWjMB`

### Step 3: Fix Deployment Type
1. **Click the gear icon** (⚙️) next to your deployment
2. **Change "Type"** from "Web app" to **"Add-on"**
3. **Click "Update"**

### Step 4: Get New Installation URL
1. **After updating**, you should see a new **"Add-on URL"** or **"Installation URL"**
2. **Copy this URL** - it should look different from the previous one

## 🎯 **Alternative Method: Create New Deployment**

If the above doesn't work:

### Step 1: Delete Old Deployment
1. **Click "Deploy"** → **"Manage deployments"**
2. **Click the trash icon** next to the problematic deployment
3. **Confirm deletion**

### Step 2: Create New Add-on Deployment
1. **Click "Deploy"** → **"New deployment"**
2. **Choose type**: **"Add-on"** (very important!)
3. **Title**: "Meeting Notes Agent"
4. **Description**: "AI-powered meeting transcript to structured notes converter"
5. **Click "Deploy"**

### Step 3: Get Installation URL
1. **Copy the "Add-on URL"** from the deployment dialog
2. **This should be the working installation URL**

## 🎯 **Verify the Fix**

The working installation URL should:
- ✅ **Not show** "Google Drive" error
- ✅ **Show** an installation page with "Install" button
- ✅ **Ask for permissions** when you click Install
- ✅ **Work** in Google Docs after installation

## 🆘 **If Still Not Working**

### Check Project Configuration
1. **In Apps Script project**, click **"Project Settings"** (gear icon)
2. **Make sure** "Show 'appsscript.json' manifest file in editor" is **checked**
3. **Click "appsscript.json"** in the file list
4. **Verify** it contains the add-on configuration

### Check Code Structure
1. **Make sure** your `Code.gs` has the `onOpen()` function
2. **Verify** the HTML files are properly named
3. **Check** that all files are saved

## 🎉 **Expected Result**

Once properly configured, the installation URL should:
1. **Open** an installation page (not Google Drive error)
2. **Show** "Install" button
3. **Request permissions** for Google Docs access
4. **Install successfully** in Google Docs
5. **Appear** in Extensions menu

## 🔧 **Quick Test**

After fixing the deployment:
1. **Click the new installation URL**
2. **Should see** installation page (not Google Drive error)
3. **Click "Install"**
4. **Authorize permissions**
5. **Open Google Docs** and check Extensions menu

**The key is making sure the deployment type is "Add-on", not "Web app"!**
