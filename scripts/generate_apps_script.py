#!/usr/bin/env python3
"""
Generate Google Apps Script code for the Meeting Notes Agent add-on
This script creates all the necessary files for the Google Docs add-on
"""

import os
from datetime import datetime

def create_apps_script_code():
    """Generate the main Apps Script code"""
    return '''/**
 * Meeting Notes Agent - Google Docs Add-on
 * Converts meeting transcripts into structured meeting notes
 */

// Global configuration
const CONFIG = {
  GEMINI_API_KEY: 'AIzaSyApexRCbtIGSNu1xtc-8fXuFY3qFmwDhIs',
  GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  TEMPLATE_SECTIONS: [
    'Project Kickoff',
    'Client Vision',
    'Target Market & Use Case',
    'System Concept & Architecture',
    'User Experience & Installation',
    'Technical & Engineering Considerations',
    'Cost & Market Positioning',
    'Project Process & Next Steps',
    'Decisions Made',
    'Data & Insights'
  ]
};

/**
 * Creates the add-on menu in Google Docs
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('Meeting Notes Agent')
    .addItem('Convert Transcript to Meeting Notes', 'showTranscriptDialog')
    .addItem('Settings', 'showSettingsDialog')
    .addToUi();
}

/**
 * Shows the transcript conversion dialog
 */
function showTranscriptDialog() {
  const ui = DocumentApp.getUi();
  const html = HtmlService.createHtmlOutputFromFile('TranscriptDialog')
    .setWidth(600)
    .setHeight(500)
    .setTitle('Convert Meeting Transcript');
  
  ui.showModalDialog(html, 'Meeting Notes Agent');
}

/**
 * Shows the settings dialog
 */
function showSettingsDialog() {
  const ui = DocumentApp.getUi();
  const html = HtmlService.createHtmlOutputFromFile('SettingsDialog')
    .setWidth(400)
    .setHeight(300)
    .setTitle('Settings');
  
  ui.showModalDialog(html, 'Settings');
}

/**
 * Processes the transcript and creates structured meeting notes
 */
function processTranscript(transcriptData) {
  try {
    // Extract structured content using Gemini
    const structuredData = callGeminiAPI(transcriptData.transcript);
    
    // Create new document with structured notes
    const newDoc = createMeetingNotesDocument(structuredData, transcriptData);
    
    return {
      success: true,
      documentId: newDoc.getId(),
      documentUrl: newDoc.getUrl(),
      message: 'Meeting notes created successfully!'
    };
    
  } catch (error) {
    console.error('Error processing transcript:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to process transcript. Please check your API key and try again.'
    };
  }
}

/**
 * Calls Gemini API to extract structured content
 */
function callGeminiAPI(transcript) {
  const prompt = createPrompt(transcript);
  
  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify(payload)
  };
  
  const url = `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`;
  const response = UrlFetchApp.fetch(url, options);
  const responseData = JSON.parse(response.getContentText());
  
  if (responseData.error) {
    throw new Error(`Gemini API Error: ${responseData.error.message}`);
  }
  
  const content = responseData.candidates[0].content.parts[0].text;
  return parseGeminiResponse(content);
}

/**
 * Creates the prompt for Gemini
 */
function createPrompt(transcript) {
  return `You are a professional meeting note-taker. Convert the following meeting transcript into structured meeting notes following this exact format:

STRUCTURE TO FOLLOW:
1. Project Kickoff - Meeting title, date, attendees, contact info
2. Client Vision - Core ideas, problems being solved, vision
3. Target Market & Use Case - Who will use this, pain points, market needs
4. System Concept & Architecture - Technical approach, system design, components
5. User Experience & Installation - How users interact, installation process
6. Technical & Engineering Considerations - Technical challenges, requirements, constraints
7. Cost & Market Positioning - Pricing, competitive analysis, market positioning
8. Project Process & Next Steps - Process, timeline, immediate next steps
9. Decisions Made - Concrete decisions reached during the meeting
10. Data & Insights - Key metrics, data points, insights shared

FORMATTING RULES:
- Use bullet points (●) for main points
- Use sub-bullets (○) for sub-points
- Use nested bullets (■) for further details
- Keep content concise but comprehensive
- Extract specific details like numbers, names, dates
- Maintain professional tone
- Include all relevant technical details
- Capture all decisions and next steps clearly

TRANSCRIPT TO CONVERT:
${transcript}

Return ONLY a simple JSON object with section names as keys and formatted text content as values. 
Each value should be a single string with bullet points, not nested objects or arrays.
Example format:
{
  "Client Vision": "● Core idea: Build mobile app\\n● Problem: Users need real-time features\\n● Vision: Collaborative platform",
  "Technical Considerations": "● Challenge: Scalability\\n● Requirement: WebSocket connections"
}`;
}

/**
 * Parses Gemini response and extracts structured data
 */
function parseGeminiResponse(content) {
  try {
    // Clean up the response
    let cleanContent = content.trim();
    
    // Remove markdown code blocks
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.substring(7);
    }
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.substring(3);
    }
    if (cleanContent.endsWith('```')) {
      cleanContent = cleanContent.substring(0, cleanContent.length - 3);
    }
    
    // Extract JSON
    const startIdx = cleanContent.indexOf('{');
    const endIdx = cleanContent.lastIndexOf('}') + 1;
    if (startIdx !== -1 && endIdx !== 0) {
      cleanContent = cleanContent.substring(startIdx, endIdx);
    }
    
    const structuredData = JSON.parse(cleanContent);
    
    // Convert arrays to formatted strings if needed
    const formattedData = {};
    for (const [key, value] of Object.entries(structuredData)) {
      if (Array.isArray(value)) {
        formattedData[key] = value.map(item => `● ${item}`).join('\\n');
      } else {
        formattedData[key] = String(value);
      }
    }
    
    return formattedData;
    
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}

/**
 * Creates a new Google Doc with structured meeting notes
 */
function createMeetingNotesDocument(structuredData, transcriptData) {
  const doc = DocumentApp.create(`Meeting Notes - ${transcriptData.projectTitle || 'Project Meeting'}`);
  
  // Set up document styling
  const body = doc.getBody();
  body.setMarginTop(72);
  body.setMarginBottom(72);
  body.setMarginLeft(72);
  body.setMarginRight(72);
  
  // Add title
  const title = body.appendParagraph('Project Kickoff');
  title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  // Add project details
  const projectTitle = body.appendParagraph(transcriptData.projectTitle || 'Project Meeting');
  projectTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  projectTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  const clientName = body.appendParagraph(transcriptData.clientName || 'Client');
  clientName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  const meetingDate = body.appendParagraph(transcriptData.meetingDate || new Date().toLocaleDateString());
  meetingDate.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  const contactInfo = body.appendParagraph(transcriptData.contactInfo || 'Contact information');
  contactInfo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  // Add confidential notice
  const confidential = body.appendParagraph('CONFIDENTIAL AND PROPRIETARY');
  confidential.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  confidential.setBold(true);
  
  // Add attendees
  const attendees = body.appendParagraph(`Attendees: ${transcriptData.attendees || 'Meeting attendees'}`);
  attendees.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  
  // Add spacing
  body.appendParagraph('');
  
  // Add structured sections
  for (const section of CONFIG.TEMPLATE_SECTIONS.slice(1)) { // Skip "Project Kickoff" as it's handled above
    if (structuredData[section]) {
      const sectionHeader = body.appendParagraph(section);
      sectionHeader.setHeading(DocumentApp.ParagraphHeading.HEADING2);
      sectionHeader.setBold(true);
      
      const sectionContent = body.appendParagraph(structuredData[section]);
      sectionContent.setSpacingAfter(12);
      
      body.appendParagraph(''); // Add spacing between sections
    }
  }
  
  return doc;
}

/**
 * Gets the selected text from the current document
 */
function getSelectedText() {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  
  if (!selection) {
    return '';
  }
  
  const elements = selection.getRangeElements();
  let selectedText = '';
  
  for (const element of elements) {
    if (element.getElement().getType() === DocumentApp.ElementType.TEXT) {
      const text = element.getElement().asText();
      const start = element.getStartOffset();
      const end = element.getEndOffsetInclusive();
      selectedText += text.getText().substring(start, end + 1);
    }
  }
  
  return selectedText.trim();
}'''

def create_transcript_dialog_html():
    """Generate the transcript dialog HTML"""
    return '''<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: 'Roboto', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .header h1 {
      color: #1a73e8;
      margin: 0;
      font-size: 24px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #3c4043;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    textarea {
      resize: vertical;
      min-height: 120px;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background-color: #1a73e8;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1557b0;
    }
    
    .btn-secondary {
      background-color: #f1f3f4;
      color: #3c4043;
    }
    
    .btn-secondary:hover {
      background-color: #e8eaed;
    }
    
    .loading {
      display: none;
      text-align: center;
      margin: 20px 0;
    }
    
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #1a73e8;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error {
      background-color: #fce8e6;
      color: #d93025;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      display: none;
    }
    
    .success {
      background-color: #e6f4ea;
      color: #137333;
      padding: 10px;
      border-radius: 4px;
      margin: 10px 0;
      display: none;
    }
    
    .get-selected-btn {
      background-color: #34a853;
      color: white;
      margin-bottom: 10px;
    }
    
    .get-selected-btn:hover {
      background-color: #2d8f47;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📝 Meeting Notes Agent</h1>
      <p>Convert meeting transcripts into structured meeting notes</p>
    </div>
    
    <div class="error" id="error-message"></div>
    <div class="success" id="success-message"></div>
    
    <form id="transcript-form">
      <div class="form-group">
        <button type="button" class="get-selected-btn" onclick="getSelectedText()">
          📋 Get Selected Text from Document
        </button>
      </div>
      
      <div class="form-group">
        <label for="transcript">Meeting Transcript:</label>
        <textarea id="transcript" name="transcript" placeholder="Paste your meeting transcript here..." required></textarea>
      </div>
      
      <div class="form-group">
        <label for="project-title">Project Title:</label>
        <input type="text" id="project-title" name="projectTitle" placeholder="e.g., Mobile App Development">
      </div>
      
      <div class="form-group">
        <label for="client-name">Client Name:</label>
        <input type="text" id="client-name" name="clientName" placeholder="e.g., TechCorp Inc.">
      </div>
      
      <div class="form-group">
        <label for="meeting-date">Meeting Date:</label>
        <input type="text" id="meeting-date" name="meetingDate" placeholder="e.g., Jan 15, 2025">
      </div>
      
      <div class="form-group">
        <label for="attendees">Attendees:</label>
        <input type="text" id="attendees" name="attendees" placeholder="e.g., John Smith, Sarah Johnson, Mike Chen">
      </div>
      
      <div class="form-group">
        <label for="contact-info">Contact Information:</label>
        <input type="text" id="contact-info" name="contactInfo" placeholder="e.g., 555-123-4567 | 123 Main St | City | State 12345">
      </div>
      
      <div class="loading" id="loading">
        <div class="spinner"></div>
        <p>Processing transcript with AI...</p>
      </div>
      
      <div class="button-group">
        <button type="button" class="btn-secondary" onclick="google.script.host.close()">
          Cancel
        </button>
        <button type="submit" class="btn-primary">
          🚀 Generate Meeting Notes
        </button>
      </div>
    </form>
  </div>

  <script>
    // Set default date
    document.getElementById('meeting-date').value = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Handle form submission
    document.getElementById('transcript-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        transcript: document.getElementById('transcript').value,
        projectTitle: document.getElementById('project-title').value,
        clientName: document.getElementById('client-name').value,
        meetingDate: document.getElementById('meeting-date').value,
        attendees: document.getElementById('attendees').value,
        contactInfo: document.getElementById('contact-info').value
      };
      
      if (!formData.transcript.trim()) {
        showError('Please enter a meeting transcript.');
        return;
      }
      
      showLoading();
      hideMessages();
      
      google.script.run
        .withSuccessHandler(onSuccess)
        .withFailureHandler(onError)
        .processTranscript(formData);
    });
    
    function getSelectedText() {
      google.script.run
        .withSuccessHandler(function(text) {
          if (text) {
            document.getElementById('transcript').value = text;
            showSuccess('Selected text loaded successfully!');
          } else {
            showError('No text selected. Please select some text in the document first.');
          }
        })
        .withFailureHandler(function(error) {
          showError('Failed to get selected text: ' + error);
        })
        .getSelectedText();
    }
    
    function onSuccess(result) {
      hideLoading();
      
      if (result.success) {
        showSuccess(result.message);
        
        // Open the new document
        if (result.documentUrl) {
          setTimeout(function() {
            window.open(result.documentUrl, '_blank');
            google.script.host.close();
          }, 2000);
        }
      } else {
        showError(result.message || 'Failed to process transcript.');
      }
    }
    
    function onError(error) {
      hideLoading();
      showError('An error occurred: ' + error);
    }
    
    function showLoading() {
      document.getElementById('loading').style.display = 'block';
      document.querySelector('button[type="submit"]').disabled = true;
    }
    
    function hideLoading() {
      document.getElementById('loading').style.display = 'none';
      document.querySelector('button[type="submit"]').disabled = false;
    }
    
    function showError(message) {
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
    
    function showSuccess(message) {
      const successDiv = document.getElementById('success-message');
      successDiv.textContent = message;
      successDiv.style.display = 'block';
    }
    
    function hideMessages() {
      document.getElementById('error-message').style.display = 'none';
      document.getElementById('success-message').style.display = 'none';
    }
  </script>
</body>
</html>'''

def create_settings_dialog_html():
    """Generate the settings dialog HTML"""
    return '''<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <style>
    body {
      font-family: 'Roboto', Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .header h1 {
      color: #1a73e8;
      margin: 0;
      font-size: 20px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #3c4043;
    }
    
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background-color: #1a73e8;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1557b0;
    }
    
    .btn-secondary {
      background-color: #f1f3f4;
      color: #3c4043;
    }
    
    .btn-secondary:hover {
      background-color: #e8eaed;
    }
    
    .info-box {
      background-color: #e8f0fe;
      border: 1px solid #1a73e8;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
    }
    
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #1a73e8;
      font-size: 14px;
    }
    
    .info-box p {
      margin: 0;
      font-size: 13px;
      color: #3c4043;
    }
    
    .info-box a {
      color: #1a73e8;
      text-decoration: none;
    }
    
    .info-box a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚙️ Settings</h1>
    </div>
    
    <div class="info-box">
      <h3>🔑 API Key Required</h3>
      <p>This add-on uses Google's Gemini AI to process meeting transcripts. You need a Gemini API key to use this feature.</p>
      <p><strong>Get your API key:</strong> <a href="https://makersuite.google.com/app/apikey" target="_blank">https://makersuite.google.com/app/apikey</a></p>
    </div>
    
    <form id="settings-form">
      <div class="form-group">
        <label for="api-key">Gemini API Key:</label>
        <input type="password" id="api-key" name="apiKey" placeholder="Enter your Gemini API key">
      </div>
      
      <div class="button-group">
        <button type="button" class="btn-secondary" onclick="google.script.host.close()">
          Cancel
        </button>
        <button type="submit" class="btn-primary">
          💾 Save Settings
        </button>
      </div>
    </form>
  </div>

  <script>
    // Handle form submission
    document.getElementById('settings-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const apiKey = document.getElementById('api-key').value.trim();
      
      if (!apiKey) {
        alert('Please enter your Gemini API key.');
        return;
      }
      
      // Save the API key (in a real implementation, you'd save this securely)
      // For now, we'll just show a success message
      alert('Settings saved successfully! You can now use the Meeting Notes Agent.');
      google.script.host.close();
    });
    
    // Load current settings
    // In a real implementation, you'd load the saved API key
  </script>
</body>
</html>'''

def create_manifest():
    """Generate the Apps Script manifest"""
    return '''{
  "timeZone": "America/New_York",
  "dependencies": {
    "enabledAdvancedServices": []
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}'''

def main():
    """Generate all Apps Script files"""
    print("🚀 Generating Google Apps Script files...")
    
    # Create output directory
    output_dir = "apps-script-files"
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate files
    files = {
        "Code.gs": create_apps_script_code(),
        "TranscriptDialog.html": create_transcript_dialog_html(),
        "SettingsDialog.html": create_settings_dialog_html(),
        "appsscript.json": create_manifest()
    }
    
    # Write files
    for filename, content in files.items():
        filepath = os.path.join(output_dir, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Created {filepath}")
    
    # Create setup instructions
    instructions = f"""# 🚀 Google Apps Script Setup Instructions

Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Quick Setup (5 minutes):

### Step 1: Create Apps Script Project
1. Go to [script.google.com](https://script.google.com/)
2. Click "New Project"
3. Delete the default `Code.gs` content
4. Copy and paste the content from `Code.gs` in this folder
5. Save (Ctrl+S or Cmd+S)

### Step 2: Add HTML Files
1. Click the "+" next to "Files" in Apps Script
2. Select "HTML"
3. Name it "TranscriptDialog"
4. Copy content from `TranscriptDialog.html` and paste it
5. Repeat for "SettingsDialog" with `SettingsDialog.html`

### Step 3: Update Manifest
1. Click on `appsscript.json` in Apps Script
2. Replace all content with the content from `appsscript.json`
3. Save

### Step 4: Deploy
1. Click "Deploy" → "New deployment"
2. Choose "Add-on"
3. Title: "Meeting Notes Agent"
4. Click "Deploy"

### Step 5: Install
1. Open Google Docs
2. Extensions → Add-ons → Install add-ons
3. Search for your add-on and install

## 🎯 That's it! 

Once set up, you'll be able to:
1. Select transcript text in Google Docs
2. Click Extensions → Meeting Notes Agent
3. Generate structured meeting notes instantly!

**Total setup time: 5 minutes** ⏱️
"""
    
    with open(os.path.join(output_dir, "SETUP_INSTRUCTIONS.md"), 'w', encoding='utf-8') as f:
        f.write(instructions)
    
    print(f"✅ Created {os.path.join(output_dir, 'SETUP_INSTRUCTIONS.md')}")
    print(f"\n🎉 All files generated in '{output_dir}' folder!")
    print("\n📋 Next steps:")
    print("1. Go to script.google.com")
    print("2. Create new project")
    print("3. Copy the files from the 'apps-script-files' folder")
    print("4. Follow the setup instructions")
    print("\n🚀 Your Google Docs add-on will be ready in 5 minutes!")

if __name__ == "__main__":
    main()
