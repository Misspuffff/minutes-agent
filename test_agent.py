#!/usr/bin/env python3
"""
Test script for the Meeting Agent
"""

import os
import sys
from meeting_agent import MeetingAgent

def test_agent():
    """Test the meeting agent with sample data."""
    
    # Check if API key is available
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable not set")
        print("Please set your Gemini API key:")
        print("export GEMINI_API_KEY='your_api_key_here'")
        return False
    
    try:
        # Initialize agent
        print("🚀 Initializing Meeting Agent...")
        agent = MeetingAgent(api_key=api_key)
        
        # Read sample transcript
        print("📖 Reading sample transcript...")
        with open('sample_transcript.txt', 'r') as f:
            transcript = f.read()
        
        # Generate notes
        print("🤖 Generating structured meeting notes...")
        notes = agent.generate_meeting_notes(
            transcript=transcript,
            project_title="Mobile App Real-Time Collaboration Feature",
            client_name="TechCorp Inc.",
            meeting_date="Jan 15, 2025",
            attendees="Sarah Johnson, Mike Chen, Lisa Rodriguez, David Kim",
            contact_info="555-123-4567 | 123 Tech Street | San Francisco | CA 94105"
        )
        
        # Save to PDF
        print("📄 Generating PDF...")
        pdf_filename = agent.save_to_pdf(notes, "test_meeting_notes.pdf")
        
        # Save to text
        text_filename = "test_meeting_notes.txt"
        with open(text_filename, 'w', encoding='utf-8') as f:
            f.write(notes)
        
        print("✅ Test completed successfully!")
        print(f"📄 PDF saved as: {pdf_filename}")
        print(f"📝 Text saved as: {text_filename}")
        
        # Show preview of generated content
        print("\n📋 Preview of generated content:")
        print("=" * 50)
        preview_lines = notes.split('\n')[:20]
        for line in preview_lines:
            print(line)
        print("...")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_agent()
    sys.exit(0 if success else 1)

