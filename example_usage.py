#!/usr/bin/env python3
"""
Example usage of the Meeting Agent
"""

import os
from meeting_agent import MeetingAgent

def main():
    """Demonstrate how to use the Meeting Agent programmatically."""
    
    # Check for API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("Please set GEMINI_API_KEY environment variable")
        return
    
    # Sample transcript
    transcript = """
    Meeting: Q4 Product Planning
    Attendees: John Smith (CEO), Maria Garcia (CTO), Alex Johnson (Product Manager)
    
    John: Thanks everyone for joining. We need to finalize our Q4 product roadmap. 
    Maria, what's the status on the AI integration feature?
    
    Maria: We're about 70% complete. The core functionality is working, but we need 
    another 2-3 weeks for testing and optimization. The main challenge is ensuring 
    the AI responses are accurate and fast enough for real-time use.
    
    Alex: From a product perspective, our users are really excited about this feature. 
    We've seen a 40% increase in feature requests related to AI assistance. The main 
    user pain point is that our current system requires too many manual steps.
    
    John: What's the cost impact of this feature?
    
    Maria: We're looking at about $5,000/month in additional cloud costs for the AI 
    services, but we expect this to be offset by increased user engagement and 
    potential premium subscriptions.
    
    Alex: We're planning to launch this as a premium feature at $19.99/month. 
    Based on our market research, this pricing is competitive with similar tools.
    
    John: Sounds good. Let's target a November 15th launch date. Maria, can you 
    provide a detailed timeline by next week?
    
    Maria: Absolutely. I'll have the technical timeline ready by Friday.
    
    Alex: I'll work on the marketing materials and user onboarding flow.
    
    John: Perfect. Next meeting is scheduled for next Tuesday at 10 AM.
    """
    
    # Initialize the agent
    agent = MeetingAgent(api_key=api_key)
    
    # Generate structured notes
    notes = agent.generate_meeting_notes(
        transcript=transcript,
        project_title="Q4 Product Planning - AI Integration",
        client_name="TechStart Inc.",
        meeting_date="Oct 15, 2024",
        attendees="John Smith, Maria Garcia, Alex Johnson",
        contact_info="555-123-4567 | 456 Innovation Drive | Austin | TX 78701"
    )
    
    # Save to PDF
    pdf_filename = agent.save_to_pdf(notes, "q4_planning_meeting.pdf")
    
    print("✅ Meeting notes generated successfully!")
    print(f"📄 PDF saved as: {pdf_filename}")
    
    # Print a preview
    print("\n📋 Preview of generated notes:")
    print("=" * 60)
    lines = notes.split('\n')
    for i, line in enumerate(lines[:25]):  # Show first 25 lines
        print(line)
    if len(lines) > 25:
        print("...")
    print("=" * 60)

if __name__ == "__main__":
    main()

