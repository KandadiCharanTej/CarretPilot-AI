from crewai import Agent
from app.core.llm import LLM_MODEL
from app.tools.resume_tool import optimize_resume

resume_agent = Agent(
    role="Resume Strategist",
    goal="""
    Tailor the candidate's resume to perfectly match 
    the job description and pass ATS filters.
    """,
    backstory="""
    Expert HR specialist with a deep understanding of Applicant Tracking Systems (ATS).
    You excel at keyword injection and role-specific tailoring while maintaining
    the integrity of the candidate's experience.
    """,
    verbose=True,
    llm=LLM_MODEL
)

