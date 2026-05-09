from tavily import TavilyClient
from langchain.tools import tool
import os
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)

@tool("Search Web")
def search_web(query: str) -> str:
    """Search the web using Tavily for relevant information."""
    response = client.search(query=query)
    return str(response)
