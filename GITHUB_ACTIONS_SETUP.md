# 🚀 GitHub Actions Setup for Apps Script Deployment

## Overview
This setup automates deployment of your Google Docs add-on from GitHub to Apps Script using GitHub Actions and Google's `clasp` tool.

## Prerequisites
- GitHub repository
- Google Apps Script project
- Google Cloud Project with Apps Script API enabled

## Step 1: Install Google Clasp

### Install globally:
```bash
npm install -g @google/clasp
```

### Or install locally in your project:
```bash
cd google-docs-addon
npm install @google/clasp
```

## Step 2: Authenticate with Google

1. **Enable Apps Script API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Enable "Google Apps Script API"

2. **Login to Clasp:**
   ```bash
   clasp login
   ```
   - This will open a browser window for Google authentication
   - Grant necessary permissions

## Step 3: Create Apps Script Project

1. **Create new project:**
   ```bash
   cd google-docs-addon
   clasp create --type standalone --title "Meeting Notes Agent"
   ```

2. **Update .clasp.json:**
   - Copy the Script ID from the output
   - Update `.clasp.json` with your Script ID

## Step 4: Configure GitHub Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:

### Required Secrets:
- `APPS_SCRIPT_ID`: Your Apps Script project ID
- `APPS_SCRIPT_CREDENTIALS`: Service account credentials (JSON)

### Creating Service Account Credentials:

1. **Go to Google Cloud Console:**
   - APIs & Services → Credentials
   - Create Credentials → Service Account
   - Name: "github-actions-apps-script"
   - Role: "Editor"

2. **Create Key:**
   - Click on the service account
   - Keys → Add Key → Create New Key
   - Choose JSON format
   - Download the JSON file

3. **Add to GitHub Secrets:**
   - Copy the entire JSON content
   - Add as `APPS_SCRIPT_CREDENTIALS` secret

## Step 5: Initial Manual Setup

1. **Push your code manually first:**
   ```bash
   clasp push
   ```

2. **Create initial deployment:**
   - Go to Apps Script console
   - Deploy → New deployment
   - Type: Add-on
   - Description: "Initial deployment"
   - Copy the Deployment ID

3. **Update GitHub Actions workflow:**
   - Add your Deployment ID to the workflow file
   - Or create a new secret `DEPLOYMENT_ID`

## Step 6: Test Automation

1. **Make a change to your code**
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Test automated deployment"
   git push origin main
   ```

3. **Check GitHub Actions:**
   - Go to Actions tab in your repository
   - Watch the deployment workflow run

## Step 7: Marketplace Integration

After successful deployment:

1. **Update Marketplace SDK:**
   - Go to Google Cloud Console
   - Google Workspace Marketplace SDK
   - Update version number
   - Publish changes

## Workflow Features

### Automatic Triggers:
- ✅ **Push to main branch** - Deploys when you push changes
- ✅ **Manual trigger** - Deploy on demand via GitHub UI
- ✅ **Path filtering** - Only deploys when add-on files change

### Deployment Process:
1. **Checkout code** from GitHub
2. **Install dependencies** (clasp)
3. **Push to Apps Script** using clasp
4. **Create deployment** (if configured)

## Troubleshooting

### Common Issues:

1. **Authentication Error:**
   ```bash
   clasp login --creds credentials.json
   ```

2. **Permission Denied:**
   - Ensure Apps Script API is enabled
   - Check service account permissions

3. **Script ID Not Found:**
   - Verify Script ID in `.clasp.json`
   - Ensure project exists in Apps Script

### Debug Commands:
```bash
# Check login status
clasp login --status

# List projects
clasp list

# Test push
clasp push --dry-run
```

## Advanced Configuration

### Custom Deployment Script:
Create `scripts/deploy.js`:
```javascript
const { execSync } = require('child_process');

// Custom deployment logic
console.log('Starting deployment...');
execSync('clasp push', { stdio: 'inherit' });
console.log('Deployment completed!');
```

### Environment-Specific Deployments:
- **Development:** Deploy to test project
- **Production:** Deploy to production project
- **Staging:** Deploy to staging project

## Security Best Practices

1. **Never commit credentials** to repository
2. **Use GitHub Secrets** for sensitive data
3. **Rotate service account keys** regularly
4. **Limit service account permissions** to minimum required

## Benefits

- ✅ **Automated deployments** from GitHub
- ✅ **Version control** integration
- ✅ **Rollback capability** via Git
- ✅ **Team collaboration** through GitHub
- ✅ **CI/CD pipeline** for professional development

---

**Need Help?** Check the [clasp documentation](https://github.com/google/clasp) or [GitHub Actions documentation](https://docs.github.com/en/actions).
