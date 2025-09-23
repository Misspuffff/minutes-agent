# Meeting Transcript to Structured Notes Agent

This agent converts meeting transcripts from Gemini into structured meeting notes following the exact format of professional meeting documentation.

## Features

- **Intelligent Content Extraction**: Uses Google's Gemini AI to intelligently parse meeting transcripts
- **Structured Format**: Converts raw transcripts into organized sections:
  - Project Kickoff (meeting details, attendees, contact info)
  - Client Vision (core ideas, problems being solved)
  - Target Market & Use Case (audience, pain points, market needs)
  - System Concept & Architecture (technical approach, system design)
  - User Experience & Installation (user interaction, installation process)
  - Technical & Engineering Considerations (challenges, requirements)
  - Cost & Market Positioning (pricing, competitive analysis)
  - Project Process & Next Steps (process, timeline, next steps)
  - Decisions Made (concrete decisions reached)
  - Data & Insights (key metrics, data points, insights)

- **PDF Generation**: Creates professional PDF documents matching the original format
- **Flexible Input**: Accepts transcript text directly or from files
- **Customizable**: Supports custom project details, attendees, dates, and contact information

## Installation

1. **Clone or download this repository**

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Get a Gemini API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Set it as an environment variable:
     ```bash
     export GEMINI_API_KEY="your_api_key_here"
     ```

## Usage

### Basic Usage

```bash
python meeting_agent.py "Your meeting transcript text here"
```

### With Custom Details

```bash
python meeting_agent.py "transcript.txt" \
  --project-title "Wireless Blind Spot System" \
  --client-name "Gregg Martin" \
  --meeting-date "Sep 18, 2025" \
  --attendees "Gregg, Joe, Jon, Glenn, Corey, Brendan, Maddy, Seth" \
  --contact-info "404-947-8746 | 440 Interstate North Parkway | Atlanta | GA 30339"
```

### From File

```bash
python meeting_agent.py transcript.txt --output "my_meeting_notes.pdf"
```

### Command Line Options

- `transcript`: Meeting transcript text or path to transcript file
- `--project-title`: Project title (default: "Project Meeting")
- `--client-name`: Client name (default: "Client")
- `--meeting-date`: Meeting date (default: current date)
- `--attendees`: Meeting attendees (default: "Meeting attendees")
- `--contact-info`: Contact information (default: "Contact information")
- `--output`: Output filename (default: auto-generated with timestamp)
- `--api-key`: Gemini API key (or set GEMINI_API_KEY environment variable)

## Example Output

The agent generates both PDF and text files with structured content like:

```
Project Kickoff
Wireless Blind Spot Identification System
Gregg Martin
Sep 18, 2025
404-947-8746 | 440 Interstate North Parkway | Atlanta | GA 30339
CONFIDENTIAL AND PROPRIETARY
Attendees: Gregg, Joe, Jon, Glenn, Corey, Brendan, Maddy, Seth

Client Vision
● Gregg's idea originated from his parents' experience: their new car lacked blind spot monitoring, despite having it in an earlier model.
● Identified gap: aftermarket solutions exist but are all hardwired, cumbersome, and expensive.
● Vision: Wireless, easy-to-install blind spot detection system that can be installed in ~5 minutes.
● Key differentiator: true wireless solution (currently unavailable on the market).

Target Market & Use Case
● Drivers without OEM blind spot systems who want safety features without replacing vehicles.
● Parents of teen drivers — safety reassurance for older cars passed down.
● Leased car owners — product must be easy to install/uninstall without permanent modifications.
...
```

## How It Works

1. **Transcript Input**: The agent receives meeting transcript text (either directly or from a file)
2. **AI Processing**: Uses Google's Gemini AI to intelligently parse and structure the content
3. **Section Extraction**: Extracts relevant information into predefined sections
4. **Formatting**: Applies consistent formatting with bullet points and hierarchical structure
5. **PDF Generation**: Creates a professional PDF document matching the original template format

## Requirements

- Python 3.7+
- Google Gemini API key
- Internet connection for AI processing

## Troubleshooting

### API Key Issues
- Make sure your Gemini API key is valid and has sufficient quota
- Check that the GEMINI_API_KEY environment variable is set correctly

### Installation Issues
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Make sure you're using Python 3.7 or higher

### Content Quality
- Provide clear, well-structured transcripts for best results
- Include relevant project details via command line options for better formatting

## License

This project is provided as-is for meeting documentation purposes.

