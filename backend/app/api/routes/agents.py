"""
agents.py — API routes for triggering agent workflows and streaming live logs.
Implements /agents/run and /agents/logs endpoints (Steps 63, 80).
"""

import asyncio
import json
from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from app.automation.apply import get_action_logs, clear_logs, log_action
from app.core.status import agent_status

router = APIRouter()



class StudentProfile(BaseModel):
    name: str = "Student"
    email: str = "student@example.com"
    skills: List[str] = []
    interests: List[str] = []
    cgpa: float = 0.0


class ApplyRequest(BaseModel):
    url: str
    name: str
    email: str
    skills: str
    resume_path: Optional[str] = None


def run_workflow_background(profile: dict):
    """Background task for running the full AI workflow."""
    global agent_status
    try:
        agent_status["is_running"] = True
        agent_status["error"] = None
        agent_status["result"] = None

        clear_logs()
        
        log_action("Manager Agent", "🎯 Coordinating the CareerPilot Swarm...")
        agent_status["manager"] = "coordinating"

        log_action("Hunter Agent", "🔍 Searching for top opportunities...")
        agent_status["hunter"] = "searching"

        # Import here to avoid circular imports
        from app.agents.workflow import create_workflow
        crew = create_workflow(profile)
        
        # Kickoff handles the task sequence: Hunt -> Eligibility -> Resume -> Apply
        result = crew.kickoff()

        # Update statuses post-execution (simulated as kickoff runs the whole chain)
        agent_status["hunter"] = "done"
        agent_status["eligibility"] = "done"
        agent_status["resume"] = "done"
        agent_status["application"] = "done"
        agent_status["manager"] = "done"
        
        agent_status["result"] = str(result)
        agent_status["is_running"] = False
        
        log_action("System", "✅ One Perfect Flow complete. Application submitted successfully!")

    except Exception as e:
        agent_status["error"] = str(e)
        agent_status["is_running"] = False
        log_action("Manager Agent", f"❌ Workflow error: {str(e)}")


@router.post("/run")
def run_agents(profile: StudentProfile, background_tasks: BackgroundTasks):
    """Trigger the full multi-agent workflow in the background."""
    if agent_status["is_running"]:
        return {"status": "already_running", "message": "Workflow already in progress."}
    
    # Reset status
    for key in ["manager", "hunter", "eligibility", "resume", "application"]:
        agent_status[key] = "idle"

    background_tasks.add_task(run_workflow_background, profile.model_dump())
    return {"status": "started", "message": "AI workflow initiated. Check Mission Control for live updates."}


@router.get("/status")
def get_status():
    """Get current agent statuses and live logs."""
    return {
        "agents": {
            "manager": agent_status["manager"],
            "hunter": agent_status["hunter"],
            "eligibility": agent_status["eligibility"],
            "resume": agent_status["resume"],
            "application": agent_status["application"],
        },
        "is_running": agent_status["is_running"],
        "result": agent_status["result"],
        "error": agent_status["error"],
        "logs": get_action_logs(),
    }



@router.get("/logs/stream")
async def stream_logs():
    """Server-Sent Events stream for live log updates (Step 80)."""
    async def event_generator():
        last_count = 0
        for _ in range(120):  # Stream for up to 2 minutes
            logs = get_action_logs()
            if len(logs) > last_count:
                new_logs = logs[last_count:]
                for log_entry in new_logs:
                    data = json.dumps(log_entry)
                    yield f"data: {data}\n\n"
                last_count = len(logs)
            
            if not agent_status["is_running"] and last_count > 0:
                yield f"data: {json.dumps({'agent': 'System', 'message': '✅ Workflow complete.'})}\n\n"
                break
            
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/apply")
def apply_to_opportunity_route(req: ApplyRequest):
    """Directly trigger the Application Agent for a specific opportunity."""
    from app.automation.apply import apply_to_opportunity
    
    agent_status["application"] = "applying"
    log_action("Application Agent", f"🎯 Applying to: {req.url}")

    result = apply_to_opportunity(
        url=req.url,
        name=req.name,
        email=req.email,
        skills=req.skills,
        resume_path=req.resume_path
    )

    agent_status["application"] = "done" if result.get("success") else "failed"

    return {
        "success": result.get("success"),
        "screenshot": result.get("screenshot"),
        "logs": get_action_logs(),
        "error": result.get("error")
    }
