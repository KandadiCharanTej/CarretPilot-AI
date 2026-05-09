import os
from dotenv import load_dotenv

load_dotenv()

# Llama 3.1 70B is often more stable for native tool-use on Groq
LLM_MODEL = "groq/llama-3.1-70b-versatile"
