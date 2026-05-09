"""
application_agent.py — CrewAI Application Agent (ACTION layer).
This agent uses Playwright tools to apply to opportunities autonomously.
"""

from crewai import Agent
from app.core.llm import LLM_MODEL
from langchain.tools import tool
from app.automation.apply import apply_to_opportunity, get_action_logs
import os


@tool("Apply to Opportunity")
def apply_tool(opportunity_data: str) -> str:
    """
    Apply to a job/internship opportunity.
    Input should be a string with: URL, name, email, skills (comma-separated values).
    Format: URL|name|email|skills
    """
    try:
        parts = opportunity_data.split("|")
        url = parts[0].strip() if len(parts) > 0 else "http://localhost:3000/demo-apply"
        name = parts[1].strip() if len(parts) > 1 else "Student"
        email = parts[2].strip() if len(parts) > 2 else "student@example.com"
        skills = parts[3].strip() if len(parts) > 3 else "Python, AI"

        # Find resume from uploads folder
        resume_path = None
        uploads_dir = "uploads"
        if os.path.exists(uploads_dir):
            files = [f for f in os.listdir(uploads_dir) if f.endswith(".pdf")]
            if files:
                resume_path = os.path.join(uploads_dir, files[-1])

        result = apply_to_opportunity(url, name, email, skills, resume_path)
        
        logs = get_action_logs()
        log_summary = "\n".join([f"[{l['agent']}] {l['message']}" for l in logs])

        if result.get("success"):
            return f"✅ Successfully applied to {url}\n\nAction Log:\n{log_summary}"
        else:
            return f"❌ Application failed after retries.\nError: {result.get('error')}\n\nAction Log:\n{log_summary}"
    
    except Exception as e:
        return f"❌ Tool error: {str(e)}"


application_agent = Agent(
    role="Application Agent",

    goal="""
    Autonomously apply to internships, hackathons, and opportunities on behalf of students.
    Fill forms, upload resumes, submit applications, and verify success.
    Retry intelligently if something fails.
    """,

    backstory="""
    You are an elite AI automation specialist with deep expertise in web automation.
    You navigate websites, fill forms with precision, upload documents, and submit applications.
    If an attempt fails, you analyze the error and adapt your strategy — you never give up easily.
    Your mission is to maximize the student's application success rate.
    """,

    verbose=True,
    llm=LLM_MODEL,
    tools=[apply_tool],
    max_iter=5  # Self-correction: try up to 5 strategies
)
