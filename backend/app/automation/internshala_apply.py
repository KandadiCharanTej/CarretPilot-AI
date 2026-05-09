"""
internshala_apply.py — Internshala automation for student internship applications.
Much safer than LinkedIn. Good first real-world target after demo form.
"""

import time
from playwright.sync_api import sync_playwright
from app.automation.utils import safe_fill, safe_click, safe_upload, take_screenshot, check_success


def internshala_apply(
    internship_url: str,
    email: str,
    password: str,
    cover_letter: str = "I am highly motivated and eager to contribute.",
    resume_path: str = None
) -> dict:
    """Apply to an Internshala internship."""
    logs = []

    def log(msg):
        logs.append(msg)
        print(f"[Internshala Agent] {msg}")

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()

            log("Navigating to Internshala login...")
            page.goto("https://internshala.com/login")
            page.wait_for_timeout(2000)

            log("Logging in...")
            safe_fill(page, "#email", email)
            safe_fill(page, "#password", password)
            safe_click(page, "#login_submit")
            page.wait_for_timeout(4000)

            log(f"Opening internship: {internship_url}")
            page.goto(internship_url)
            page.wait_for_timeout(3000)

            log("Clicking Apply button...")
            safe_click(page, ".apply_button, .btn-primary, #apply-button")
            page.wait_for_timeout(2000)

            log("Filling cover letter...")
            safe_fill(page, "textarea[name='cover_letter'], #cover_letter", cover_letter)

            if resume_path:
                log("Uploading resume...")
                safe_upload(page, "input[type='file']", resume_path)

            log("Submitting application...")
            safe_click(page, ".submit, button[type='submit'], #submit_application")
            page.wait_for_timeout(3000)

            success = check_success(
                page,
                success_selectors=[".success-message", ".applied"],
                success_texts=["successfully applied", "application submitted", "thank you"]
            )

            screenshot = take_screenshot(page, "internshala_apply")
            browser.close()

            return {"success": success, "logs": logs, "screenshot": screenshot}

    except Exception as e:
        log(f"Error: {str(e)}")
        return {"success": False, "error": str(e), "logs": logs}
