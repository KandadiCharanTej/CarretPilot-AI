from crewai import Task, Crew
from app.agents.manager_agent import manager_agent
from app.agents.hunter_agent import hunter_agent
from app.agents.eligibility_agent import eligibility_agent
from app.agents.resume_agent import resume_agent
from app.agents.application_agent import application_agent, apply_tool
from app.tools.search_tool import search_web
from app.tools.resume_tool import optimize_resume

def create_workflow(student_profile=None):
    if student_profile is None:
        student_profile = {
            "name": "Student",
            "email": "student@example.com",
            "skills": ["Python", "AI", "FastAPI"], 
            "interests": ["AI Internships", "Hackathons"], 
            "cgpa": 8.5
        }
        
    hunt_task = Task(
        description=f"""
        Find the top 3 AI internships or hackathons 
        for a student with these interests: {student_profile.get('interests', [])}.
        Focus on quality and relevance.
        
        IMPORTANT: Use the 'Search Web' tool to find real, current opportunities.
        """,
        agent=hunter_agent,
        tools=[search_web],
        expected_output="A list of 3 specific opportunity URLs with brief descriptions."
    )


    eligibility_task = Task(
        description=f"""
        Analyze the found opportunities and select the single BEST fit 
        for the student profile:
        - Skills: {student_profile.get('skills', [])}
        - CGPA: {student_profile.get('cgpa', 0)}
        
        Output ONLY the URL of the selected opportunity.
        """,
        agent=eligibility_agent,
        expected_output="A single URL string.",
        context=[hunt_task]
    )

    resume_task = Task(
        description=f"""
        Take the student's current skills and profile: {student_profile.get('skills', [])}
        and optimize it for the selected opportunity found in the previous task.
        """,
        agent=resume_agent,
        tools=[optimize_resume],
        expected_output="A summary of optimized skills.",
        context=[eligibility_task]
    )

    apply_task = Task(
        description=f"""
        Apply to the selected opportunity using the Application Agent tool.
        You MUST provide the input to the tool in this EXACT format:
        URL|name|email|skills
        
        Use these details:
        - URL: (From the Eligibility Task)
        - Name: {student_profile.get('name', 'Student')}
        - Email: {student_profile.get('email', 'student@example.com')}
        - Skills: {', '.join(student_profile.get('skills', []))}
        """,
        agent=application_agent,
        tools=[apply_tool],
        expected_output="Application submission status.",
        context=[eligibility_task, resume_task]
    )



    crew = Crew(
        agents=[
            manager_agent,
            hunter_agent,
            eligibility_agent,
            resume_agent,
            application_agent
        ],
        tasks=[
            hunt_task,
            eligibility_task,
            resume_task,
            apply_task
        ],
        verbose=True
    )
    return crew

# For backward compatibility
crew = create_workflow()

