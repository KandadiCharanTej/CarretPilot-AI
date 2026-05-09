from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(
    api_key=os.getenv("TAVILY_API_KEY")
)

from crewai.tools import tool

@tool("Search Web")
def search_web(query: str) -> str:
    """
    Search the web using Tavily for relevant information.
    Args:
        query (str): The search query to look up.
    Returns:
        str: The search results as a string.
    """

    response = client.search(query=query)
    return str(response)
