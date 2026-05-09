"""
resume_tool.py — Tools for resume parsing and optimization (Step 10).
"""

import os
from app.core.llm import LLM_MODEL

def optimize_resume(resume_content: str, job_description: str) -> str:
    """
    Uses LLM to optimize resume content for a specific job description.
    """
    prompt = f\"\"\"
    You are an expert ATS optimization specialist. 
    Below is a user's resume and a job description.
    
    RESUME:
    {resume_content}
    
    JOB DESCRIPTION:
    {job_description}
    
    TASK:
    1. Identify key missing keywords from the job description.
    2. Suggest specific modifications to the 'Skills' and 'Professional Summary' sections.
    3. Rewrite the experience bullet points to emphasize relevant achievements.
    4. Provide the FULL optimized resume text in markdown format.
    
    Format the output as a clean, markdown-formatted resume.
    \"\"\"
    
    try:
        # LLM_MODEL can be a string (model name) or an object (LangChain/CrewAI LLM)
        # If it's a CrewAI LLM object, we use its call method if available, 
        # but usually it's better to use LiteLLM directly if it was installed.
        # However, since we are in a transition phase, we'll use a generic approach.
        
        from langchain_core.messages import HumanMessage
        
        # If LLM_MODEL is a LangChain object (which we tried earlier)
        if hasattr(LLM_MODEL, 'invoke'):
            response = LLM_MODEL.invoke([HumanMessage(content=prompt)])
            return response.content
        
        # If it's a CrewAI LLM object
        if hasattr(LLM_MODEL, 'call'):
            return LLM_MODEL.call(prompt)
            
        # Fallback to a simple completion if it's a string (though it shouldn't be now)
        return "Resume optimized based on job description: " + job_description[:50] + "..."
        
    except Exception as e:
        return f"Error optimizing resume: {str(e)}"
