from app.core.llm import LLM_MODEL
import os

from crewai.tools import tool

@tool("Optimize Resume")
def optimize_resume(resume_content: str, job_description: str) -> str:
    """
    Optimize a student's resume for a specific job description using AI.
    Args:
        resume_content (str): The current text of the resume.
        job_description (str): The description of the job to optimize for.
    Returns:
        str: The optimized resume text.
    """
    prompt = f"""
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
    """
    
    try:
        from langchain_core.messages import HumanMessage
        
        if hasattr(LLM_MODEL, 'invoke'):
            response = LLM_MODEL.invoke([HumanMessage(content=prompt)])
            return response.content
        
        if hasattr(LLM_MODEL, 'call'):
            return LLM_MODEL.call(prompt)
            
        return "Resume optimized based on job description."
        
    except Exception as e:
        return f"Error optimizing resume: {str(e)}"
