"""
linkedin_apply.py — LinkedIn Easy Apply automation (Phase 2).
WARNING: LinkedIn has aggressive anti-bot measures. Use only for demo/hackathon.
Start with your own demo form first (Step 76-78).
"""

import time
from playwright.sync_api import sync_playwright
from app.automation.utils import safe_fill, safe_click, take_screenshot


def linkedin_easy_apply(job_url: str, email: str, password: str) -> dict:
    """
    Attempt LinkedIn Easy Apply — includes login + apply flow.
    This is complex; only enable after internal demo form works.
    """
    logs = []

    def log(msg):
        logs.append(msg)
        print(f"[LinkedIn Agent] {msg}")

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)  # Keep visible for CAPTCHA
            page = browser.new_page()

            log("Navigating to LinkedIn login...")
            page.goto("https://www.linkedin.com/login")
            page.wait_for_timeout(2000)

            log("Entering credentials...")
            safe_fill(page, "#username", email)
            safe_fill(page, "#password", password)
            safe_click(page, "[data-litms-control-urn='login-submit']")
            page.wait_for_timeout(4000)

            log(f"Navigating to job: {job_url}")
            page.goto(job_url)
            page.wait_for_timeout(3000)

            log("Looking for Easy Apply button...")
            safe_click(page, ".jobs-apply-button")
            page.wait_for_timeout(2000)

            screenshot = take_screenshot(page, "linkedin_apply")
            browser.close()

            return {"success": True, "logs": logs, "screenshot": screenshot}

    except Exception as e:
        log(f"Error: {e}")
        return {"success": False, "error": str(e), "logs": logs}
