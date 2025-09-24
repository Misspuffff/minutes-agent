# 🎯 Personal Setup Guide for maddyclaypoole@gmail.com

## Quick Setup Steps

### 1. Sign In to Personal Account
- Sign out of company account
- Sign in with `maddyclaypoole@gmail.com`
- Go to: https://script.google.com

### 2. Create New Project
- Click "New project"
- Name: `Meeting Notes Agent - Personal`
- Delete default Code.gs content

### 3. Copy Code Files
Copy the code from the files below into your project:

#### Code.gs (Main file)
```javascript
/**
 * Meeting Notes Agent - Google Docs Add-on
 * Converts meeting transcripts into structured meeting notes
 */

/**
 * Called when the add-on is opened
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('Meeting Notes Agent')
    .addItem('📝 Generate Meeting Notes', 'showTranscriptDialog')
    .addItem('⚙️ Settings', 'showSettingsDialog')
    .addToUi();
}

/**
 * Required function for add-on deployment
 */
function doGet() {
  return HtmlService.createHtmlOutput(`
    <html>
      <head>
        <title>Meeting Notes Agent</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; }
          .success { color: #4CAF50; font-size: 18px; margin: 20px 0; }
          .info { color: #666; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎉 Meeting Notes Agent</h1>
          <div class="success">✅ Add-on is working!</div>
          <div class="info">This add-on is now available in your Google Docs.</div>
          <div class="info">Look for "Meeting Notes Agent" in the Extensions menu.</div>
          <div class="info">Or use the menu that appears when you open a Google Docs document.</div>
        </div>
      </body>
    </html>
  `);
}

// Global configuration
const CONFIG = {
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
 * Shows the transcript conversion dialog
 */
function showTranscriptDialog() {
  const ui = DocumentApp.getUi();
  const html = HtmlService.createHtmlOutputFromFile('TranscriptDialog')
    .setWidth(600)
    .setHeight(500)
    .setTitle('Add Meeting Notes to Document');
  
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
 * Processes the transcript and adds structured meeting notes to current document
 */
function processTranscript(transcriptData) {
  try {
    console.log('Starting transcript processing...');
    
    // Check if API key is configured first
    const apiKey = getGeminiApiKey();
    console.log('API key retrieved:', apiKey.substring(0, 10) + '...');
    
    // Auto-parse meeting data from transcript if not provided
    console.log('Starting auto-parsing...');
    const parsedData = autoParseMeetingData(transcriptData.transcript, transcriptData);
    console.log('Auto-parsing completed:', parsedData);
    
    // Extract structured content using Gemini
    console.log('Starting content extraction...');
    const structuredData = callGeminiAPI(transcriptData.transcript);
    console.log('Content extraction completed:', Object.keys(structuredData));
    
    // Add structured notes to current document
    console.log('Adding notes to document...');
    addMeetingNotesToDocument(structuredData, parsedData);
    console.log('Document update completed');
    
    return {
      success: true,
      message: 'Meeting notes added to document successfully!'
    };
    
  } catch (error) {
    console.error('Error processing transcript:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process transcript. ';
    
    if (error.toString().includes('API key not configured')) {
      errorMessage += 'Please go to Settings to configure your Gemini API key first.';
    } else if (error.toString().includes('Gemini API Error')) {
      errorMessage += 'There was an issue with the Gemini API. Please check your API key and try again.';
    } else if (error.toString().includes('getActiveDocument')) {
      errorMessage += 'Document access error. Please make sure you have a Google Docs document open.';
    } else if (error.toString().includes('JSON')) {
      errorMessage += 'Data parsing error. Please try with a different transcript.';
    } else {
      errorMessage += `Error: ${error.toString()}`;
    }
    
    return {
      success: false,
      error: error.toString(),
      message: errorMessage
    };
  }
}

/**
 * Auto-parses meeting data from transcript using AI
 */
function autoParseMeetingData(transcript, providedData) {
  try {
    const apiKey = getGeminiApiKey();
    
    // Skip auto-parsing if API key test failed recently
    console.log('Starting auto-parsing with API key:', apiKey.substring(0, 10) + '...');
    
    const prompt = `Analyze this meeting transcript and extract the following information. If information is not available, use reasonable defaults or leave blank.

TRANSCRIPT:
${transcript}

Please extract and return ONLY a JSON object with these fields:
{
  "projectTitle": "extracted project title or 'Project Meeting'",
  "clientName": "extracted client/company name or 'Client'",
  "meetingDate": "extracted date or current date",
  "attendees": "extracted attendee names or 'Meeting attendees'",
  "contactInfo": "extracted contact information or 'Contact information'"
}

Return ONLY the JSON object, no other text.`;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500
      }
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    const url = `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;
    console.log('Making API call to:', url.substring(0, 50) + '...');
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());

    if (responseData.error) {
      console.error('API Error:', responseData.error);
      throw new Error(`Gemini API Error: ${responseData.error.message}`);
    }

        const extractedText = responseData.candidates[0].content.parts[0].text;
        console.log('API Response:', extractedText.substring(0, 100) + '...');
        
        // Clean the response text (remove markdown formatting)
        const cleanText = extractedText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        console.log('Cleaned text:', cleanText.substring(0, 100) + '...');
        
        const parsedData = JSON.parse(cleanText);

    // Merge with provided data (provided data takes precedence)
    return {
      projectTitle: providedData.projectTitle || parsedData.projectTitle || 'Project Meeting',
      clientName: providedData.clientName || parsedData.clientName || 'Client',
      meetingDate: providedData.meetingDate || parsedData.meetingDate || new Date().toLocaleDateString(),
      attendees: providedData.attendees || parsedData.attendees || 'Meeting attendees',
      contactInfo: providedData.contactInfo || parsedData.contactInfo || 'Contact information'
    };

  } catch (error) {
    console.error('Error auto-parsing meeting data:', error);
    
    // Fallback to provided data or defaults
    return {
      projectTitle: providedData.projectTitle || 'Project Meeting',
      clientName: providedData.clientName || 'Client',
      meetingDate: providedData.meetingDate || new Date().toLocaleDateString(),
      attendees: providedData.attendees || 'Meeting attendees',
      contactInfo: providedData.contactInfo || 'Contact information'
    };
  }
}

/**
 * Gets the Gemini API key from script properties
 */
function getGeminiApiKey() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please go to Settings to add your API key.');
  }
  
  return apiKey;
}

/**
 * Sets the Gemini API key in script properties
 */
function setGeminiApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('API key cannot be empty');
  }
  
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('GEMINI_API_KEY', apiKey.trim());
  
  return { success: true, message: 'API key saved successfully!' };
}

/**
 * Checks if API key is configured
 */
function checkApiKeyStatus() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('GEMINI_API_KEY');
  return !!apiKey;
}

/**
 * Debug function to help troubleshoot API issues
 */
function debugApiKey() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const apiKey = properties.getProperty('GEMINI_API_KEY');
    
    if (!apiKey) {
      return {
        success: false,
        message: 'No API key found in script properties'
      };
    }
    
    if (!apiKey.startsWith('AIza')) {
      return {
        success: false,
        message: `Invalid API key format. Found: ${apiKey.substring(0, 10)}...`
      };
    }
    
    // Test with a very simple request
    const payload = {
      contents: [{
        parts: [{
          text: "Test"
        }]
      }],
      generationConfig: {
        maxOutputTokens: 5
      }
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const url = `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.error) {
      return {
        success: false,
        message: `API Error: ${responseData.error.message}`
      };
    }
    
    return {
      success: true,
      message: `API key working! Response: ${responseData.candidates[0].content.parts[0].text}`
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Debug error: ${error.toString()}`
    };
  }
}

/**
 * Test function to debug transcript processing
 */
function testTranscriptProcessing() {
  try {
    console.log('Testing transcript processing...');
    
    const testTranscript = "This is a test meeting transcript. Project: Test Project. Client: Test Client. Date: Today. Attendees: John, Jane.";
    
    const transcriptData = {
      transcript: testTranscript
    };
    
    const result = processTranscript(transcriptData);
    console.log('Test result:', result);
    
    return {
      success: true,
      message: `Test completed: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`
    };
    
  } catch (error) {
    console.error('Test error:', error);
    return {
      success: false,
      message: `Test failed: ${error.toString()}`
    };
  }
}

/**
 * Tests the API key by making a simple request
 */
function testApiKey() {
  try {
    const apiKey = getGeminiApiKey();
    
    // First, validate the API key format
    if (!apiKey || !apiKey.startsWith('AIza')) {
      return {
        success: false,
        message: 'Invalid API key format. API key should start with "AIza"'
      };
    }
    
    // Make a simple test request
    const payload = {
      contents: [{
        parts: [{
          text: "Hello, this is a test."
        }]
      }],
      generationConfig: {
        maxOutputTokens: 10,
      }
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };
    
    const url = `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.error) {
      let errorMessage = responseData.error.message;
      
      // Provide more helpful error messages
      if (errorMessage.includes('API key not valid')) {
        errorMessage = 'API key is invalid. Please check your API key in Apps Script project settings.';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your Google Cloud Console billing.';
      } else if (errorMessage.includes('permission')) {
        errorMessage = 'API key lacks required permissions. Please enable Generative AI API.';
      }
      
      return {
        success: false,
        message: `API key test failed: ${errorMessage}`
      };
    }
    
    return {
      success: true,
      message: 'API key is working correctly!'
    };
    
  } catch (error) {
    let errorMessage = error.toString();
    
    // Provide more helpful error messages
    if (errorMessage.includes('API key not configured')) {
      errorMessage = 'API key not found. Please add GEMINI_API_KEY to Apps Script project properties.';
    } else if (errorMessage.includes('401')) {
      errorMessage = 'Unauthorized. Please check your API key.';
    } else if (errorMessage.includes('403')) {
      errorMessage = 'Forbidden. Please check API key permissions.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }
    
    return {
      success: false,
      message: `API key test failed: ${errorMessage}`
    };
  }
}

/**
 * Calls Gemini API to extract structured content
 */
function callGeminiAPI(transcript) {
  const apiKey = getGeminiApiKey();
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
  
  const url = `${CONFIG.GEMINI_API_URL}?key=${apiKey}`;
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
        formattedData[key] = value.map(item => `● ${item}`).join('\n');
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
 * Adds structured meeting notes to the current document
 */
function addMeetingNotesToDocument(structuredData, transcriptData) {
  try {
    console.log('Attempting to get active document...');
    
    // Get the active document
    const doc = DocumentApp.getActiveDocument();
    if (!doc) {
      throw new Error('No active document found. Please open a Google Docs document and try again.');
    }
    console.log('Successfully got active document:', doc.getName());
    
    const body = doc.getBody();
    console.log('Got document body');
  
    // Add a page break to separate from existing content
    body.appendPageBreak();
    console.log('Added page break');
    
    // Add title
    const title = body.appendParagraph('Project Kickoff');
    title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    title.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added title');
    
    // Add project details
    const projectTitle = body.appendParagraph(transcriptData.projectTitle || 'Project Meeting');
    projectTitle.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    projectTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added project title:', transcriptData.projectTitle);
    
    const clientName = body.appendParagraph(transcriptData.clientName || 'Client');
    clientName.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added client name:', transcriptData.clientName);
    
    const meetingDate = body.appendParagraph(transcriptData.meetingDate || new Date().toLocaleDateString());
    meetingDate.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added meeting date:', transcriptData.meetingDate);
    
    const contactInfo = body.appendParagraph(transcriptData.contactInfo || 'Contact information');
    contactInfo.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added contact info:', transcriptData.contactInfo);
    
    // Add confidential notice
    const confidential = body.appendParagraph('CONFIDENTIAL AND PROPRIETARY');
    confidential.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    confidential.setBold(true);
    console.log('Added confidential notice');
    
    // Add attendees
    const attendees = body.appendParagraph(`Attendees: ${transcriptData.attendees || 'Meeting attendees'}`);
    attendees.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
    console.log('Added attendees:', transcriptData.attendees);
    
    // Add spacing
    body.appendParagraph('');
    console.log('Added spacing');
    
    // Add structured sections
    let sectionsAdded = 0;
    for (const section of CONFIG.TEMPLATE_SECTIONS.slice(1)) { // Skip "Project Kickoff" as it's handled above
      if (structuredData[section]) {
        const sectionHeader = body.appendParagraph(section);
        sectionHeader.setHeading(DocumentApp.ParagraphHeading.HEADING2);
        sectionHeader.setBold(true);
        
        const sectionContent = body.appendParagraph(structuredData[section]);
        sectionContent.setSpacingAfter(12);
        
        body.appendParagraph(''); // Add spacing between sections
        sectionsAdded++;
        console.log('Added section:', section);
      }
    }
    console.log('Total sections added:', sectionsAdded);
    
    // Check if we created a new document
    const createdDocUrl = PropertiesService.getScriptProperties().getProperty('LAST_CREATED_DOC_URL');
    if (createdDocUrl) {
      // Clear the stored URL
      PropertiesService.getScriptProperties().deleteProperty('LAST_CREATED_DOC_URL');
      console.log('New document created with URL:', createdDocUrl);
    }
    
  } catch (error) {
    console.error('Error adding meeting notes to document:', error);
    console.error('Error stack:', error.stack);
    throw new Error(`Failed to add meeting notes to document: ${error.toString()}`);
  }
}

/**
 * Formats meeting notes for display when document access fails
 */
function formatMeetingNotesForDisplay(structuredData, transcriptData) {
  let formatted = '';
  
  // Add header
  formatted += 'PROJECT KICKOFF\n';
  formatted += '================\n\n';
  
  // Add project details
  formatted += `Project: ${transcriptData.projectTitle || 'Project Meeting'}\n`;
  formatted += `Client: ${transcriptData.clientName || 'Client'}\n`;
  formatted += `Date: ${transcriptData.meetingDate || new Date().toLocaleDateString()}\n`;
  formatted += `Attendees: ${transcriptData.attendees || 'Meeting attendees'}\n`;
  formatted += `Contact: ${transcriptData.contactInfo || 'Contact information'}\n\n`;
  
  formatted += 'CONFIDENTIAL AND PROPRIETARY\n\n';
  
  // Add structured sections
  for (const section of CONFIG.TEMPLATE_SECTIONS.slice(1)) { // Skip "Project Kickoff" as it's handled above
    if (structuredData[section]) {
      formatted += `${section.toUpperCase()}\n`;
      formatted += '='.repeat(section.length) + '\n';
      formatted += `${structuredData[section]}\n\n`;
    }
  }
  
  return formatted;
}

/**
 * Gets the selected text from the current document
 */
function getSelectedText() {
  try {
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
  } catch (error) {
    console.error('Error getting selected text:', error);
    // Fallback: return empty string if selection fails
    return '';
  }
}
```

#### TranscriptDialog.html (Create new HTML file)
```html
<!DOCTYPE html>
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
    
    .info-box {
      background-color: #e8f0fe;
      border: 1px solid #1a73e8;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #1a73e8;
      font-size: 16px;
    }
    
    .info-box p {
      margin: 5px 0;
      color: #3c4043;
      font-size: 14px;
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
    
    textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #dadce0;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      resize: vertical;
      min-height: 200px;
      font-family: inherit;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    
    .btn {
      padding: 12px 24px;
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
    
    .btn-primary:disabled {
      background-color: #dadce0;
      cursor: not-allowed;
    }
    
    .btn-secondary {
      background-color: #34a853;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #2d8f47;
    }
    
    .btn-secondary:disabled {
      background-color: #dadce0;
      cursor: not-allowed;
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
    
    .loading {
      text-align: center;
      padding: 20px;
      color: #5f6368;
    }
    
    .spinner {
      border: 2px solid #f3f3f3;
      border-top: 2px solid #1a73e8;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 10px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 AI Meeting Notes Generator</h1>
    </div>
    
    <div class="info-box">
      <h3>✨ Auto-Parse Everything</h3>
      <p>Just paste your meeting transcript below. The AI will automatically extract:</p>
      <ul style="margin: 5px 0; padding-left: 20px;">
        <li>Project title and client name</li>
        <li>Meeting date and attendees</li>
        <li>Contact information</li>
        <li>Structured meeting notes</li>
      </ul>
    </div>
    
    <div class="error" id="error-message"></div>
    <div class="success" id="success-message"></div>
    
    <form id="transcript-form">
      <div class="form-group">
        <button type="button" class="btn btn-secondary" onclick="getSelectedText()">
          📋 Get Selected Text from Document
        </button>
      </div>
      
      <div class="form-group">
        <label for="transcript">Meeting Transcript:</label>
        <textarea id="transcript" name="transcript" placeholder="Paste your meeting transcript here... The AI will automatically extract all meeting details and create structured notes." required></textarea>
      </div>
      
      <div class="button-group">
        <button type="button" id="generate-btn" class="btn btn-primary" onclick="generateMeetingNotes()">
          🚀 Generate Meeting Notes
        </button>
      </div>
    </form>
  </div>

  <script>
    function showError(message) {
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      const successDiv = document.getElementById('success-message');
      successDiv.style.display = 'none';
    }
    
    function showSuccess(message) {
      const successDiv = document.getElementById('success-message');
      successDiv.textContent = message;
      successDiv.style.display = 'block';
      
      const errorDiv = document.getElementById('error-message');
      errorDiv.style.display = 'none';
    }
    
    function getSelectedText() {
      const btn = document.querySelector('.btn-secondary');
      btn.disabled = true;
      btn.textContent = 'Getting text...';
      
      google.script.run
        .withSuccessHandler(function(selectedText) {
          btn.disabled = false;
          btn.textContent = '📋 Get Selected Text from Document';
          
          if (selectedText && selectedText.trim()) {
            document.getElementById('transcript').value = selectedText;
            showSuccess('Selected text loaded successfully!');
          } else {
            showError('No text selected. Please select some text in the document first.');
          }
        })
        .withFailureHandler(function(error) {
          btn.disabled = false;
          btn.textContent = '📋 Get Selected Text from Document';
          showError('Failed to get selected text: ' + error);
        })
        .getSelectedText();
    }
    
    function generateMeetingNotes() {
      const transcript = document.getElementById('transcript').value.trim();
      
      if (!transcript) {
        showError('Please enter a meeting transcript.');
        return;
      }
      
      const generateBtn = document.getElementById('generate-btn');
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<span class="spinner"></span>Generating...';
      
      // Hide previous messages
      document.getElementById('error-message').style.display = 'none';
      document.getElementById('success-message').style.display = 'none';
      
      const transcriptData = {
        transcript: transcript
        // No manual fields needed - AI will auto-parse everything
      };
      
      google.script.run
        .withSuccessHandler(function(result) {
          generateBtn.disabled = false;
          generateBtn.textContent = '🚀 Generate Meeting Notes';
          
          if (result.success) {
            showSuccess(result.message);
            // Clear the form
            document.getElementById('transcript').value = '';
          } else {
            showError(result.message);
          }
        })
        .withFailureHandler(function(error) {
          generateBtn.disabled = false;
          generateBtn.textContent = '🚀 Generate Meeting Notes';
          showError('Failed to generate meeting notes: ' + error);
        })
        .processTranscript(transcriptData);
    }
  </script>
</body>
</html>
```

#### SettingsDialog.html (Create new HTML file)
```html
<!DOCTYPE html>
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
    
    .info-box {
      background-color: #e8f0fe;
      border: 1px solid #1a73e8;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #1a73e8;
      font-size: 16px;
    }
    
    .info-box p {
      margin: 5px 0;
      color: #3c4043;
      font-size: 14px;
    }
    
    .info-box code {
      background-color: #f1f3f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    
    .status-indicator {
      background-color: #f8f9fa;
      border: 1px solid #dadce0;
      border-radius: 4px;
      padding: 10px;
      margin: 10px 0;
    }
    
    .status-indicator.success {
      background-color: #e6f4ea;
      border-color: #34a853;
      color: #137333;
    }
    
    .status-indicator.error {
      background-color: #fce8e6;
      border-color: #ea4335;
      color: #d93025;
    }
    
    .status-indicator.warning {
      background-color: #fef7e0;
      border-color: #f9ab00;
      color: #b06000;
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-top: 20px;
    }
    
    .btn {
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
      background-color: #f8f9fa;
      color: #3c4043;
      border: 1px solid #dadce0;
    }
    
    .btn-secondary:hover {
      background-color: #f1f3f4;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚙️ Settings</h1>
    </div>
    
    <div class="info-box">
      <h3>🔑 API Key Configuration</h3>
      <p>This add-on uses Google's Gemini AI to process meeting transcripts. Your API key is configured in the Apps Script project properties.</p>
      <p><strong>To update your API key:</strong> Go to the Apps Script project settings and modify the <code>GEMINI_API_KEY</code> property.</p>
    </div>
    
    <div class="error" id="error-message"></div>
    <div class="success" id="success-message"></div>
    
    <div class="status-indicator" id="api-status">
      <strong>API Key Status:</strong> <span id="status-text">Checking...</span>
    </div>
    
    <div class="button-group">
      <button type="button" id="test-btn" class="btn btn-secondary">🧪 Test API Key</button>
      <button type="button" id="debug-btn" class="btn btn-secondary">🔍 Debug API</button>
      <button type="button" id="test-processing-btn" class="btn btn-secondary">⚡ Test Processing</button>
      <button type="button" id="refresh-btn" class="btn btn-primary">🔄 Refresh Status</button>
    </div>
  </div>

  <script>
    function showError(message) {
      const errorDiv = document.getElementById('error-message');
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      
      const successDiv = document.getElementById('success-message');
      successDiv.style.display = 'none';
    }
    
    function showSuccess(message) {
      const successDiv = document.getElementById('success-message');
      successDiv.textContent = message;
      successDiv.style.display = 'block';
      
      const errorDiv = document.getElementById('error-message');
      errorDiv.style.display = 'none';
    }
    
    function updateStatus(status, message) {
      const statusDiv = document.getElementById('api-status');
      const statusText = document.getElementById('status-text');
      
      statusDiv.className = 'status-indicator ' + status;
      statusText.textContent = message;
    }
    
    function testApiKey() {
      const testBtn = document.getElementById('test-btn');
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
      
      google.script.run
        .withSuccessHandler(function(result) {
          testBtn.disabled = false;
          testBtn.textContent = '🧪 Test API Key';
          
          if (result.success) {
            showSuccess(result.message);
            updateStatus('success', '✅ Working correctly');
          } else {
            showError(result.message);
            updateStatus('error', '❌ ' + result.message);
          }
        })
        .withFailureHandler(function(error) {
          testBtn.disabled = false;
          testBtn.textContent = '🧪 Test API Key';
          showError('Test failed: ' + error);
          updateStatus('error', '❌ Test failed');
        })
        .testApiKey();
    }
    
    function debugApiKey() {
      const debugBtn = document.getElementById('debug-btn');
      debugBtn.disabled = true;
      debugBtn.textContent = 'Debugging...';
      
      google.script.run
        .withSuccessHandler(function(result) {
          debugBtn.disabled = false;
          debugBtn.textContent = '🔍 Debug API';
          
          if (result.success) {
            showSuccess(result.message);
            updateStatus('success', '✅ Working');
          } else {
            showError(result.message);
            updateStatus('error', '❌ ' + result.message);
          }
        })
        .withFailureHandler(function(error) {
          debugBtn.disabled = false;
          debugBtn.textContent = '🔍 Debug API';
          showError('Debug failed: ' + error);
          updateStatus('error', '❌ Debug failed');
        })
        .debugApiKey();
    }
    
    function testTranscriptProcessing() {
      const testBtn = document.getElementById('test-processing-btn');
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
      
      google.script.run
        .withSuccessHandler(function(result) {
          testBtn.disabled = false;
          testBtn.textContent = '⚡ Test Processing';
          
          if (result.success) {
            showSuccess(result.message);
            updateStatus('success', '✅ Processing works');
          } else {
            showError(result.message);
            updateStatus('error', '❌ Processing failed');
          }
        })
        .withFailureHandler(function(error) {
          testBtn.disabled = false;
          testBtn.textContent = '⚡ Test Processing';
          showError('Test failed: ' + error);
          updateStatus('error', '❌ Test failed');
        })
        .testTranscriptProcessing();
    }
    
    function refreshStatus() {
      const refreshBtn = document.getElementById('refresh-btn');
      refreshBtn.disabled = true;
      refreshBtn.textContent = 'Refreshing...';
      
      google.script.run
        .withSuccessHandler(function(hasKey) {
          refreshBtn.disabled = false;
          refreshBtn.textContent = '🔄 Refresh Status';
          
          if (hasKey) {
            updateStatus('success', '✅ Configured');
            showSuccess('API key is configured in script properties');
          } else {
            updateStatus('warning', '⚠️ Not configured');
            showError('API key not found in script properties');
          }
        })
        .withFailureHandler(function(error) {
          refreshBtn.disabled = false;
          refreshBtn.textContent = '🔄 Refresh Status';
          showError('Failed to check status: ' + error);
          updateStatus('error', '❌ Error checking status');
        })
        .checkApiKeyStatus();
    }
    
    // Load current API key status on page load
    window.onload = function() {
      refreshStatus();
    };
    
    // Add event listeners
    document.getElementById('test-btn').addEventListener('click', testApiKey);
    document.getElementById('debug-btn').addEventListener('click', debugApiKey);
    document.getElementById('test-processing-btn').addEventListener('click', testTranscriptProcessing);
    document.getElementById('refresh-btn').addEventListener('click', refreshStatus);
  </script>
</body>
</html>
```

### 4. Set Up API Key
- Click "Project settings" (gear icon)
- Scroll to "Script properties"
- Click "Add script property"
- Property: `GEMINI_API_KEY`
- Value: Your Gemini API key (starts with `AIza`)

### 5. Deploy
- Click "Deploy" → "New deployment"
- Type: `Add-on`
- Description: `Meeting Notes Agent - Personal`
- Click "Deploy"

### 6. Install
- Copy the deployment URL
- Open Google Docs
- Go to Extensions → Add-ons → Get add-ons
- Paste URL and install

## 🎯 That's It!

Your personal add-on will work across all your Google Docs without organization restrictions!

