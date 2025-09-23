#!/usr/bin/env python3
"""
Meeting Transcript to Structured Notes Agent

This agent converts meeting transcripts from Gemini into structured meeting notes
following the exact format of the provided PDF template.
"""

import os
import json
import argparse
from datetime import datetime
from typing import Dict, List, Any
import google.generativeai as genai
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors


class MeetingAgent:
    """Agent that converts meeting transcripts into structured notes."""
    
    def __init__(self, api_key: str = None):
        """Initialize the agent with Gemini API key."""
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY environment variable or pass api_key parameter.")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Define the structured format template
        self.template_sections = [
            "Project Kickoff",
            "Client Vision", 
            "Target Market & Use Case",
            "System Concept & Architecture",
            "User Experience & Installation",
            "Technical & Engineering Considerations",
            "Cost & Market Positioning",
            "Project Process & Next Steps",
            "Decisions Made",
            "Data & Insights"
        ]
    
    def extract_structured_content(self, transcript: str) -> Dict[str, Any]:
        """Extract structured content from transcript using Gemini."""
        
        prompt = f"""
        You are a professional meeting note-taker. Convert the following meeting transcript into structured meeting notes following this exact format:

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
        {transcript}

        Return ONLY a simple JSON object with section names as keys and formatted text content as values. 
        Each value should be a single string with bullet points, not nested objects or arrays.
        Example format:
        {{
          "Client Vision": "● Core idea: Build mobile app\\n● Problem: Users need real-time features\\n● Vision: Collaborative platform",
          "Technical Considerations": "● Challenge: Scalability\\n● Requirement: WebSocket connections"
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Parse the JSON response
            content = response.text.strip()
            
            # Try to extract JSON from the response
            if content.startswith('```json'):
                content = content[7:-3]
            elif content.startswith('```'):
                content = content[3:-3]
            
            # Try to find JSON in the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx != -1 and end_idx != 0:
                content = content[start_idx:end_idx]
            
            structured_data = json.loads(content)
            
            # Convert arrays to formatted strings
            formatted_data = {}
            for key, value in structured_data.items():
                if isinstance(value, list):
                    # Convert list to bullet-pointed string
                    formatted_value = '\n'.join([f'● {item}' for item in value])
                    formatted_data[key] = formatted_value
                else:
                    formatted_data[key] = str(value)
            
            return formatted_data
            
        except Exception as e:
            print(f"Error processing transcript: {e}")
            print(f"Response content: {response.text if 'response' in locals() else 'No response'}")
            return self._fallback_extraction(transcript)
    
    def _fallback_extraction(self, transcript: str) -> Dict[str, str]:
        """Fallback extraction method if Gemini fails."""
        return {
            "Project Kickoff": "Meeting details extracted from transcript",
            "Client Vision": "Vision and goals discussed in the meeting",
            "Target Market & Use Case": "Target audience and use cases identified",
            "System Concept & Architecture": "Technical approach and system design",
            "User Experience & Installation": "User interaction and installation process",
            "Technical & Engineering Considerations": "Technical challenges and requirements",
            "Cost & Market Positioning": "Pricing and market analysis",
            "Project Process & Next Steps": "Process and next steps",
            "Decisions Made": "Key decisions reached",
            "Data & Insights": "Important data points and insights"
        }
    
    def generate_meeting_notes(self, transcript: str, project_title: str = None, 
                             client_name: str = None, meeting_date: str = None,
                             attendees: str = None, contact_info: str = None) -> str:
        """Generate structured meeting notes from transcript."""
        
        # Extract structured content
        structured_data = self.extract_structured_content(transcript)
        
        # Generate the formatted notes
        notes = self._format_notes(structured_data, project_title, client_name, 
                                 meeting_date, attendees, contact_info)
        
        return notes
    
    def _format_notes(self, structured_data: Dict[str, str], project_title: str = None,
                     client_name: str = None, meeting_date: str = None,
                     attendees: str = None, contact_info: str = None) -> str:
        """Format the structured data into the final notes format."""
        
        # Default values
        project_title = project_title or "Project Meeting"
        client_name = client_name or "Client"
        meeting_date = meeting_date or datetime.now().strftime("%b %d, %Y")
        attendees = attendees or "Meeting attendees"
        contact_info = contact_info or "Contact information"
        
        notes = f"""Project Kickoff
{project_title}
{client_name}
{meeting_date}
{contact_info}
CONFIDENTIAL AND PROPRIETARY
Attendees: {attendees}

"""
        
        # Add each section
        for section in self.template_sections[1:]:  # Skip "Project Kickoff" as it's handled above
            if section in structured_data:
                notes += f"{section}\n"
                notes += f"{structured_data[section]}\n\n"
        
        return notes
    
    def save_to_pdf(self, notes: str, filename: str = None) -> str:
        """Save the notes to a PDF file matching the original format."""
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"meeting_notes_{timestamp}.pdf"
        
        # Create PDF document
        doc = SimpleDocTemplate(filename, pagesize=letter)
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            textColor=colors.black
        )
        
        section_style = ParagraphStyle(
            'CustomSection',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=8,
            textColor=colors.black
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            textColor=colors.black
        )
        
        # Parse and format content
        story = []
        lines = notes.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                story.append(Spacer(1, 6))
                continue
                
            # Check if it's a title (Project Kickoff)
            if line == "Project Kickoff":
                story.append(Paragraph(line, title_style))
            # Check if it's a section header
            elif any(line.startswith(section) for section in self.template_sections):
                story.append(Paragraph(line, section_style))
            # Regular content
            else:
                story.append(Paragraph(line, body_style))
        
        # Build PDF
        doc.build(story)
        return filename


def main():
    """Main function to run the meeting agent."""
    parser = argparse.ArgumentParser(description='Convert meeting transcripts to structured notes')
    parser.add_argument('transcript', help='Meeting transcript text or path to transcript file')
    parser.add_argument('--project-title', help='Project title')
    parser.add_argument('--client-name', help='Client name')
    parser.add_argument('--meeting-date', help='Meeting date')
    parser.add_argument('--attendees', help='Meeting attendees')
    parser.add_argument('--contact-info', help='Contact information')
    parser.add_argument('--output', help='Output filename (default: auto-generated)')
    parser.add_argument('--api-key', help='Gemini API key (or set GEMINI_API_KEY env var)')
    
    args = parser.parse_args()
    
    # Read transcript
    if os.path.isfile(args.transcript):
        with open(args.transcript, 'r', encoding='utf-8') as f:
            transcript = f.read()
    else:
        transcript = args.transcript
    
    # Initialize agent
    agent = MeetingAgent(api_key=args.api_key)
    
    # Generate notes
    print("Generating structured meeting notes...")
    notes = agent.generate_meeting_notes(
        transcript=transcript,
        project_title=args.project_title,
        client_name=args.client_name,
        meeting_date=args.meeting_date,
        attendees=args.attendees,
        contact_info=args.contact_info
    )
    
    # Save to PDF
    pdf_filename = agent.save_to_pdf(notes, args.output)
    
    print(f"Meeting notes generated successfully!")
    print(f"PDF saved as: {pdf_filename}")
    
    # Also save as text file
    text_filename = pdf_filename.replace('.pdf', '.txt')
    with open(text_filename, 'w', encoding='utf-8') as f:
        f.write(notes)
    print(f"Text version saved as: {text_filename}")


if __name__ == "__main__":
    main()

