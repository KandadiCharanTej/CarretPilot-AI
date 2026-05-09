from crewai import Agent
from app.core.llm import LLM_MODEL

eligibility_agent = Agent(
    role="Eligibility Analyst",

    goal="""
    Analyze opportunities and determine
    eligibility for students.
    """,

    backstory="""
    AI specialist that evaluates skills,
    experience, and opportunity fit.
    """,

    verbose=True,
    llm=LLM_MODEL
)
