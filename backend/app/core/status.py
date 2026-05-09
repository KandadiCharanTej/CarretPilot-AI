"""
status.py — Shared state for agent status tracking.
"""

agent_status = {
    "manager": "idle",
    "hunter": "idle",
    "eligibility": "idle",
    "resume": "idle",
    "application": "idle",
    "is_running": False,
    "result": None,
    "error": None,
}
