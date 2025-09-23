# Gemini API Key Setup Guide

## How to Get Your Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**
   - Use the same Google account you use for Google Docs

3. **Create a new API key**
   - Click "Create API Key"
   - Choose "Create API key in new project" or select an existing project
   - Copy the generated API key

4. **Configure the API key in the add-on**
   - Open your Google Doc
   - Go to Extensions → Meeting Notes Agent → Settings
   - Paste your API key in the "Gemini API Key" field
   - Click "Save Settings"

5. **Test the add-on**
   - Go to Extensions → Meeting Notes Agent → Add Meeting Notes to Document
   - Try processing a transcript

## Important Notes

- **Keep your API key secure** - don't share it publicly
- **Free tier limits** - Gemini has generous free usage limits
- **Billing** - Check Google AI Studio for current pricing if you exceed free limits

## Troubleshooting

If you still get API key errors:
1. Make sure you copied the entire API key (it should be about 39 characters)
2. Check that there are no extra spaces or characters
3. Verify the API key is active in Google AI Studio
4. Make sure you're using the correct Google account
5. Try going to Settings again and re-entering the API key

## Security Benefits

- **API key is stored securely** in Google Apps Script properties
- **No hardcoded keys** in your source code
- **Easy to update** through the Settings dialog
- **Encrypted storage** by Google's infrastructure
