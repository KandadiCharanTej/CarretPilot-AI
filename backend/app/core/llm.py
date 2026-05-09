import os
from dotenv import load_dotenv

load_dotenv()

# Standard CrewAI / LiteLLM model string.
# This works perfectly in the C:\W environment where LiteLLM is correctly installed.
LLM_MODEL = "groq/llama3-70b-8192"
