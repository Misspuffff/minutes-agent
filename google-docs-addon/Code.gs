/**
 * Meeting Notes Agent - Google Docs Add-on
 * Converts meeting transcripts into structured meeting notes
 */

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
 * Creates the add-on menu in Google Docs
 */
function onOpen() {
  const ui = DocumentApp.getUi();
  ui.createMenu('Meeting Notes Agent')
    .addItem('Add Meeting Notes to Document', 'showTranscriptDialog')
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
    // Check if API key is configured first
    const apiKey = getGeminiApiKey();
    
    // Extract structured content using Gemini
    const structuredData = callGeminiAPI(transcriptData.transcript);
    
    // Add structured notes to current document
    addMeetingNotesToDocument(structuredData, transcriptData);
    
    return {
      success: true,
      message: 'Meeting notes added to document successfully!'
    };
    
  } catch (error) {
    console.error('Error processing transcript:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process transcript. ';
    
    if (error.toString().includes('API key not configured')) {
      errorMessage += 'Please go to Settings to configure your Gemini API key first.';
    } else if (error.toString().includes('Gemini API Error')) {
      errorMessage += 'There was an issue with the Gemini API. Please check your API key and try again.';
    } else {
      errorMessage += 'Please check your API key and try again.';
    }
    
    return {
      success: false,
      error: error.toString(),
      message: errorMessage
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
 * Tests the API key by making a simple request
 */
function testApiKey() {
  try {
    const apiKey = getGeminiApiKey();
    
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
      return {
        success: false,
        message: `API key test failed: ${responseData.error.message}`
      };
    }
    
    return {
      success: true,
      message: 'API key is working correctly!'
    };
    
  } catch (error) {
    return {
      success: false,
      message: `API key test failed: ${error.toString()}`
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
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // Add a page break to separate from existing content
  body.appendPageBreak();
  
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
}
