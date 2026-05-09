from crewai import Agent
from app.core.llm import LLM_MODEL
from app.tools.search_tool import search_web

hunter_agent = Agent(
    role="Opportunity Hunter",
    goal="""
    Find internships, hackathons,
    workshops, and opportunities.
    """,
    backstory="""
    Expert AI researcher specialized
    in discovering student opportunities.
    """,
    llm=LLM_MODEL
)
