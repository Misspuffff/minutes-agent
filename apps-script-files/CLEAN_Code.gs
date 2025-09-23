/**
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
  
  const url = CONFIG.GEMINI_API_URL + '?key=' + CONFIG.GEMINI_API_KEY;
  const response = UrlFetchApp.fetch(url, options);
  const responseData = JSON.parse(response.getContentText());
  
  if (responseData.error) {
    throw new Error('Gemini API Error: ' + responseData.error.message);
  }
  
  const content = responseData.candidates[0].content.parts[0].text;
  return parseGeminiResponse(content);
}

/**
 * Creates the prompt for Gemini
 */
function createPrompt(transcript) {
  return 'You are a professional meeting note-taker. Convert the following meeting transcript into structured meeting notes following this exact format:\n\n' +
    'STRUCTURE TO FOLLOW:\n' +
    '1. Project Kickoff - Meeting title, date, attendees, contact info\n' +
    '2. Client Vision - Core ideas, problems being solved, vision\n' +
    '3. Target Market & Use Case - Who will use this, pain points, market needs\n' +
    '4. System Concept & Architecture - Technical approach, system design, components\n' +
    '5. User Experience & Installation - How users interact, installation process\n' +
    '6. Technical & Engineering Considerations - Technical challenges, requirements, constraints\n' +
    '7. Cost & Market Positioning - Pricing, competitive analysis, market positioning\n' +
    '8. Project Process & Next Steps - Process, timeline, immediate next steps\n' +
    '9. Decisions Made - Concrete decisions reached during the meeting\n' +
    '10. Data & Insights - Key metrics, data points, insights shared\n\n' +
    'FORMATTING RULES:\n' +
    '- Use bullet points (●) for main points\n' +
    '- Use sub-bullets (○) for sub-points\n' +
    '- Use nested bullets (■) for further details\n' +
    '- Keep content concise but comprehensive\n' +
    '- Extract specific details like numbers, names, dates\n' +
    '- Maintain professional tone\n' +
    '- Include all relevant technical details\n' +
    '- Capture all decisions and next steps clearly\n\n' +
    'TRANSCRIPT TO CONVERT:\n' +
    transcript + '\n\n' +
    'Return ONLY a simple JSON object with section names as keys and formatted text content as values. ' +
    'Each value should be a single string with bullet points, not nested objects or arrays.';
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
        formattedData[key] = value.map(item => '● ' + item).join('\n');
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
  const doc = DocumentApp.create('Meeting Notes - ' + (transcriptData.projectTitle || 'Project Meeting'));
  
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
  const attendees = body.appendParagraph('Attendees: ' + (transcriptData.attendees || 'Meeting attendees'));
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
}
