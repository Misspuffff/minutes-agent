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
 * Required function for add-on homepage trigger
 */
function onHomepage() {
  return CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader()
      .setTitle('Meeting Notes Agent')
      .setSubtitle('Convert transcripts to structured meeting notes'))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Welcome to Meeting Notes Agent! Click the button below to start converting your meeting transcripts into structured notes.'))
      .addWidget(CardService.newTextButton()
        .setText('Generate Meeting Notes')
        .setOnClickAction(CardService.newAction()
          .setFunctionName('showSidebar'))))
    .build();
}

/**
 * Required function for contextual triggers
 */
function showSidebar() {
  showTranscriptDialog();
}

/**
 * Required function for file scope granted trigger
 */
function onFileScopeGranted() {
  console.log('File scope granted for document:', DocumentApp.getActiveDocument().getName());
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
  CHATGPT_API_URL: 'https://api.openai.com/v1/chat/completions',
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
    console.log('Starting transcript processing...');
    
    // Check if API key is configured first
    const apiKey = getChatGPTApiKey();
    console.log('API key retrieved:', apiKey.substring(0, 10) + '...');
    
    // Auto-parse meeting data from transcript if not provided
    console.log('Starting auto-parsing...');
    const parsedData = autoParseMeetingData(transcriptData.transcript, transcriptData);
    console.log('Auto-parsing completed:', parsedData);
    
    // Extract structured content using ChatGPT
    console.log('Starting content extraction...');
    const structuredData = callChatGPTAPI(transcriptData.transcript);
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
      errorMessage += 'Please go to Settings to configure your ChatGPT API key first.';
    } else if (error.toString().includes('ChatGPT API Error')) {
      errorMessage += 'There was an issue with the ChatGPT API. Please check your API key and try again.';
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
 * Auto-parses meeting data from transcript using ChatGPT
 */
function autoParseMeetingData(transcript, providedData) {
  try {
    const apiKey = getChatGPTApiKey();
    
    console.log('Starting auto-parsing with ChatGPT API key:', apiKey.substring(0, 10) + '...');
    
    const prompt = 'Analyze this meeting transcript and extract the following information. If information is not available, use reasonable defaults or leave blank.\n\n' +
      'TRANSCRIPT:\n' +
      transcript + '\n\n' +
      'Please extract and return ONLY a JSON object with these fields:\n' +
      '{\n' +
      '  "projectTitle": "extracted project title or \'Project Meeting\'",\n' +
      '  "clientName": "extracted client/company name or \'Client\'",\n' +
      '  "meetingDate": "extracted date or current date",\n' +
      '  "attendees": "extracted attendee names or \'Meeting attendees\'",\n' +
      '  "contactInfo": "extracted contact information or \'Contact information\'"\n' +
      '}\n\n' +
      'Return ONLY the JSON object, no other text.';

    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional meeting analyst. Extract structured information from meeting transcripts and return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      payload: JSON.stringify(payload)
    };

    console.log('Making ChatGPT API call...');
    
    const response = UrlFetchApp.fetch(CONFIG.CHATGPT_API_URL, options);
    const responseData = JSON.parse(response.getContentText());

    if (responseData.error) {
      console.error('ChatGPT API Error:', responseData.error);
      throw new Error(`ChatGPT API Error: ${responseData.error.message}`);
    }

    const extractedText = responseData.choices[0].message.content;
    console.log('ChatGPT Response:', extractedText.substring(0, 100) + '...');
    
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
 * Gets the ChatGPT API key from script properties
 */
function getChatGPTApiKey() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('CHATGPT_API_KEY');
  
  if (!apiKey) {
    throw new Error('ChatGPT API key not configured. Please go to Settings to add your API key.');
  }
  
  return apiKey;
}


/**
 * Sets the ChatGPT API key in script properties
 */
function setChatGPTApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('ChatGPT API key cannot be empty');
  }
  
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('CHATGPT_API_KEY', apiKey.trim());
  
  return { success: true, message: 'ChatGPT API key saved successfully!' };
}

/**
 * Checks if API key is configured
 */
function checkApiKeyStatus() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('CHATGPT_API_KEY');
  return !!apiKey;
}

/**
 * Debug function to help troubleshoot API issues
 */
function debugApiKey() {
  try {
    const properties = PropertiesService.getScriptProperties();
    const apiKey = properties.getProperty('CHATGPT_API_KEY');
    
    if (!apiKey) {
      return {
        success: false,
        message: 'No ChatGPT API key found in script properties'
      };
    }
    
    if (!apiKey.startsWith('sk-')) {
      return {
        success: false,
        message: `Invalid ChatGPT API key format. Found: ${apiKey.substring(0, 10)}...`
      };
    }
    
    // Test with a very simple request
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Test"
        }
      ],
      max_tokens: 5
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(CONFIG.CHATGPT_API_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.error) {
      return {
        success: false,
        message: `ChatGPT API Error: ${responseData.error.message}`
      };
    }
    
    return {
      success: true,
      message: `ChatGPT API key working! Response: ${responseData.choices[0].message.content}`
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
 * Test function for ChatGPT integration
 */
function testChatGPTIntegration() {
  try {
    console.log('Testing ChatGPT integration...');
    
    const testTranscript = "This is a test meeting transcript. Project: Test Project. Client: Test Client. Date: Today. Attendees: John, Jane.";
    
    const transcriptData = {
      transcript: testTranscript
    };
    
    const result = processTranscript(transcriptData);
    console.log('ChatGPT test result:', result);
    
    return {
      success: true,
      message: `ChatGPT test completed: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`
    };
    
  } catch (error) {
    console.error('ChatGPT test error:', error);
    return {
      success: false,
      message: `ChatGPT test failed: ${error.toString()}`
    };
  }
}

/**
 * Tests the API key by making a simple request
 */
function testApiKey() {
  try {
    const apiKey = getChatGPTApiKey();
    
    // First, validate the API key format
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return {
        success: false,
        message: 'Invalid ChatGPT API key format. API key should start with "sk-"'
      };
    }
    
    // Make a simple test request
    const payload = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test."
        }
      ],
      max_tokens: 10
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(CONFIG.CHATGPT_API_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.error) {
      let errorMessage = responseData.error.message;
      
      // Provide more helpful error messages
      if (errorMessage.includes('API key not valid')) {
        errorMessage = 'ChatGPT API key is invalid. Please check your API key in Apps Script project settings.';
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'ChatGPT API quota exceeded. Please check your OpenAI account billing.';
      } else if (errorMessage.includes('permission')) {
        errorMessage = 'ChatGPT API key lacks required permissions.';
      }
      
      return {
        success: false,
        message: `ChatGPT API key test failed: ${errorMessage}`
      };
    }
    
    return {
      success: true,
      message: 'ChatGPT API key is working correctly!'
    };
    
  } catch (error) {
    let errorMessage = error.toString();
    
    // Provide more helpful error messages
    if (errorMessage.includes('API key not configured')) {
      errorMessage = 'ChatGPT API key not found. Please add CHATGPT_API_KEY to Apps Script project properties.';
    } else if (errorMessage.includes('401')) {
      errorMessage = 'Unauthorized. Please check your ChatGPT API key.';
    } else if (errorMessage.includes('403')) {
      errorMessage = 'Forbidden. Please check ChatGPT API key permissions.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }
    
    return {
      success: false,
      message: `ChatGPT API key test failed: ${errorMessage}`
    };
  }
}


/**
 * Calls ChatGPT API to extract structured content
 */
function callChatGPTAPI(transcript) {
  const apiKey = getChatGPTApiKey();
  const prompt = createPrompt(transcript);
  
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional meeting note-taker. Convert meeting transcripts into structured meeting notes."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 2048
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch(CONFIG.CHATGPT_API_URL, options);
  const responseData = JSON.parse(response.getContentText());
  
  if (responseData.error) {
    throw new Error(`ChatGPT API Error: ${responseData.error.message}`);
  }
  
  const content = responseData.choices[0].message.content;
  return parseChatGPTResponse(content);
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
 * Parses ChatGPT response and extracts structured data
 */
function parseChatGPTResponse(content) {
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
    console.error('Error parsing ChatGPT response:', error);
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
