from crewai import Agent
from app.core.llm import LLM_MODEL

manager_agent = Agent(
    role="Career Workflow Manager",
    goal="""
    Manage and coordinate all career opportunity workflows.
    Delegate tasks to specialized agents.
    """,
    backstory="""
    You are an advanced AI manager responsible for
    orchestrating autonomous career workflows.
    """,
    verbose=True,
    llm=LLM_MODEL
)
