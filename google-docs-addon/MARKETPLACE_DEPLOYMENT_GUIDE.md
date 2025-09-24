# 🚀 Google Workspace Marketplace Deployment Guide

## Preflight Setup (Do Once)

### 1. Use Default Apps Script Project ✅
**Simplified Approach**: We'll use the default Apps Script project for personal use.

1. Go to [script.google.com](https://script.google.com/) and open your project
2. Click ⚙️ **Project settings**
3. **Keep the default GCP project** (no need to change it)
4. Note your **Script ID** from the Project settings page (you'll need this later)

### 2. Set Up OAuth Consent Screen (Optional for Personal Use)
**Note**: For personal add-ons, you can skip this step initially. You'll only need it if you want to publish to Marketplace.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your default Apps Script project (or create a new one if needed)
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Choose **User type: External** (for personal/public use)
5. Fill in required fields:
   - App name: "Meeting Notes Agent"
   - User support email: Your email
   - Developer contact information: Your email
6. Add scopes (these will be automatically detected from your manifest):
   - `https://www.googleapis.com/auth/documents.currentonly`
   - `https://www.googleapis.com/auth/script.external_request`
7. Add yourself as a test user
8. Save and continue

### 3. Enable Google Workspace Marketplace SDK (Optional)
**Note**: Only needed if you want to publish to Marketplace later.

1. In your GCP project, go to **APIs & Services** → **Library**
2. Search for "Google Workspace Marketplace SDK"
3. Click on it and press **Enable**

## Manifest Configuration ✅

Your `appsscript.json` is now properly configured with:

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

## Step 1: Create Deployment in Apps Script

1. In Apps Script Editor, click **Deploy** → **New deployment**
2. Choose **Type: Add-on**
3. Fill in description: "Meeting Notes Agent - Convert transcripts to structured meeting notes"
4. Click **Create Version**
5. Click **Deploy**

**Important**: 
- Each code change requires creating a **New version** and editing the existing deployment
- **Do not** create multiple deployments - edit the existing one
- Save your **Script ID** from Project settings - you'll need it for Marketplace configuration

## Step 1.5: Simple Personal Installation (Recommended)

**For personal use, you can skip Marketplace entirely:**

1. After deploying, you'll get a **Web App URL**
2. Copy this URL and share it with anyone who should have access
3. Users can install directly from this URL
4. No Marketplace setup required!

## Step 2: Configure Marketplace SDK (Optional)

**Skip this step if you're using the simple personal installation method above.**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your default Apps Script project
3. Navigate to **APIs & Services** → **Google Workspace Marketplace SDK**
4. Click **App Configuration**

### App Configuration:
1. Choose **Editor add-on (Docs)**
2. Enter your **Script ID** (from Apps Script → Project settings)
3. Enter the **Version** number you just deployed
4. Save configuration

### Store Listing:
1. Click **Store Listing** tab
2. Fill in minimum required fields:
   - **App name**: "Meeting Notes Agent"
   - **Short description**: "Convert meeting transcripts into structured meeting notes using AI"
   - **Detailed description**: "Transform raw meeting transcripts into professional, structured meeting notes with sections for project details, client vision, technical considerations, and next steps. Powered by AI for accurate content extraction."
   - **App icons**: Upload 128x128 and 512x512 PNG icons
   - **Screenshots**: Add screenshots of your add-on in action
3. Set **Visibility**: **Unlisted** (recommended for personal use)
   - **Unlisted**: Available via direct link, not searchable in Marketplace
   - **Public**: Available to everyone (requires Google review process)

### Publishing:
1. Click **Publish**
2. **Unlisted** apps are available immediately via direct link (no review required)
3. **Public** apps require Google review process (can take weeks)

## Step 3: Install for Personal Use

### Method 1: Simple Web App Installation (Easiest)
1. After deploying in Apps Script, you'll get a **Web App URL**
2. Share this URL with anyone who should have access
3. Users visit the URL and click "Install" to add to their Google account
4. **No Marketplace setup required!**

### Method 2: Marketplace Installation (If you completed Step 2)
1. After publishing, you'll get a direct installation link
2. Share this link with anyone who should have access
3. Users click the link to install directly to their Google account
4. No admin console required for personal Google accounts

### Method 3: Public Apps (if you choose Public visibility)
1. Users can find and install from Google Workspace Marketplace
2. Search for "Meeting Notes Agent" in the Marketplace
3. Click "Install" to add to their Google account

## Step 4: Users Access the Add-on

Once installed, users can access the add-on in Google Docs:

1. Open Google Docs
2. Go to **Extensions** → **Add-ons** → **Manage add-ons**
3. Find "Meeting Notes Agent" and install (if not already installed)
4. The add-on appears under **Extensions** menu
5. Users can also access via the sidebar when opening documents
6. For unlisted apps: Users install via the direct link you provide

## Updating Your Add-on

**Important**: Follow this process to avoid breaking existing installations:

### In Apps Script:
1. Make your code changes
2. Go to **Deploy** → **Manage deployments**
3. Click **Edit** on your existing deployment
4. Create **New version**
5. Click **Deploy**

### In Marketplace SDK:
1. Go to **App Configuration**
2. Update the **Version** number to match your new deployment
3. Click **Save/Publish**

**Do not** create a brand-new deployment ID unless you intend to migrate users - it breaks triggers and links.

## Quick Test Loop (Recommended)

### Simple Method (No Marketplace):
1. ✅ Use default Apps Script project
2. ✅ Apps Script Add-on deployment created
3. ✅ Get Web App URL from deployment
4. ✅ Install via Web App URL to your personal account
5. ✅ Open Docs and test the add-on functionality

### Marketplace Method:
1. ✅ External OAuth consent set to External
2. ✅ Apps Script Add-on deployment created
3. ✅ Marketplace SDK configured (Editor add-on + Script ID + Version)
4. ✅ Visibility set to Unlisted
5. ✅ Install via direct link to your personal account
6. ✅ Open Docs and test the add-on functionality

## Troubleshooting Common Issues

### Add-on Not Appearing in Docs
- **Check**: Verify you installed the add-on via the direct link (for unlisted apps)
- **Check**: Confirm Marketplace visibility matches your intended use (Unlisted/Public)
- **Check**: Ensure you're using the correct Google account

### Changes Not Reflected
- **Problem**: You edited code but didn't create New version
- **Solution**: Go to Manage deployments → Edit → New version → Deploy
- **Then**: Update Marketplace SDK with new version number

### Consent Warnings / User Cap Issues
- **Problem**: Unverified-app warnings or user-count limits
- **Solution**: Complete OAuth verification on your standard GCP project
- **Note**: External apps may hit limits with sensitive scopes - verification helps

### Wrong IDs Error
- **Problem**: Using incorrect Script ID or Version
- **Solution**: Double-check Script ID from Apps Script Project settings
- **Solution**: Ensure Version matches your deployed version exactly

## Security Best Practices

1. **Minimal Scopes**: Only request permissions you actually need
2. **External OAuth**: Use External user type for personal/public apps
3. **API Key Security**: Store API keys in Apps Script Properties, not in code
4. **Error Handling**: Implement proper error handling for API failures
5. **User Data**: Be transparent about data usage and storage
6. **Unlisted Apps**: Use Unlisted visibility for personal use to avoid public review

## Support Resources

- [Google Workspace Add-ons Documentation](https://developers.google.com/apps-script/add-ons/)
- [Google Workspace Marketplace SDK](https://developers.google.com/apps-marketplace/)
- [Apps Script Deployment Guide](https://developers.google.com/apps-script/concepts/deployments)
- [OAuth Consent Screen Setup](https://developers.google.com/workspace/marketplace/how-to-configure-publish)

---

**Need Help?** If you encounter issues not covered here, check the Google Workspace Add-ons documentation or contact Google Workspace support for Marketplace-specific issues.
