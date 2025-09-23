# 🔐 GitHub Secret Setup

## Your Clasp Token:

**IMPORTANT**: The token has been generated and is stored locally. To get it:

1. **Run this command** in your terminal:
   ```bash
   cat ~/.clasprc.json
   ```

2. **Copy the entire JSON output** (from `{` to `}`)

## Steps to Add GitHub Secret:

1. **Go to**: https://github.com/misspufffff/minutes-agent/settings/secrets/actions

2. **Click**: "New repository secret"

3. **Name**: `CLASP_TOKEN`

4. **Value**: Copy the entire JSON above (from `{"token":` to `}`)

5. **Click**: "Add secret"

## ✅ Once Done:

Your automated deployment will be ready! Every time you push changes to GitHub, they'll automatically deploy to your Google Apps Script add-on.

## 🎯 Test It:

After adding the secret, make a small change to any file and push:

```bash
git add .
git commit -m "Test automated deployment"
git push origin main
```

Then check the Actions tab in your GitHub repository to see the deployment in action!
