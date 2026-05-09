import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Ensure we use the stable W environment if available (bypasses Windows path limits)
W_PYTHON = r"C:\W\Scripts\python.exe"
if os.path.exists(W_PYTHON) and sys.executable.lower() != W_PYTHON.lower():
    print(f"Hint: For full 'Perfect Flow' with LiteLLM, run: {W_PYTHON} {__file__}")


from app.agents.workflow import crew

def main():
    print("Starting CareerPilot 'One Perfect Flow'...")
    # Student profile for the perfect flow demo
    student_profile = {
        "name": "Kandadi Charan Tej",
        "email": "charantej@example.com",
        "skills": ["React", "FastAPI", "AI Agents", "Python"],
        "interests": ["AI Software Engineering", "Hackathons"],
        "cgpa": 9.2
    }
    
    from app.agents.workflow import create_workflow
    demo_crew = create_workflow(student_profile)
    
    result = demo_crew.kickoff()
    print("\n--- Mission Accomplished ---")
    print(result)

if __name__ == "__main__":
    main()

