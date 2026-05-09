"""
apply.py — Core application automation engine.
Handles the full apply pipeline: open → fill → upload → submit → verify.
Includes self-correction and retry logic (Step 81-82).
"""

import time
import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from app.automation.utils import safe_fill, safe_click, safe_upload, take_screenshot, check_success

load_dotenv()

# Action log collector for live streaming to frontend
action_log = []


def log_action(agent: str, message: str):
    entry = f"[{agent}] {message}"
    action_log.append({"agent": agent, "message": message, "time": time.time()})
    try:
        print(entry)
    except UnicodeEncodeError:
        print(entry.encode('utf-8', errors='ignore').decode('utf-8'))


def get_action_logs():
    return action_log


def clear_logs():
    action_log.clear()


def apply_to_opportunity(
    url: str,
    name: str,
    email: str,
    skills: str,
    resume_path: str = None,
    max_retries: int = 3
) -> dict:
    """
    Full application pipeline with self-correction.
    Returns a status dict with result and logs.
    """
    clear_logs()
    log_action("Application Agent", f"Starting application to: {url}")

    for attempt in range(1, max_retries + 1):
        try:
            result = _run_application(url, name, email, skills, resume_path, attempt)
            if result["success"]:
                log_action("Application Agent", "✅ Application submitted successfully!")
                return result
            else:
                log_action("Application Agent", f"⚠️ Attempt {attempt} failed. Retrying...")
                time.sleep(2)
        except Exception as e:
            log_action("Application Agent", f"❌ Error on attempt {attempt}: {str(e)}")
            if attempt == max_retries:
                return {
                    "success": False,
                    "error": str(e),
                    "logs": action_log,
                    "screenshot": None
                }
            time.sleep(3)

    return {"success": False, "error": "Max retries exhausted.", "logs": action_log}


def _run_application(url, name, email, skills, resume_path, attempt):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        log_action("Application Agent", f"🌐 Opening website (attempt {attempt})...")
        page.goto(url, timeout=30000)
        page.wait_for_timeout(2000)

        log_action("Application Agent", "📝 Filling application form...")
        safe_fill(page, "input[name='name'], input[id='name'], input[placeholder*='name' i]", name)
        safe_fill(page, "input[name='email'], input[id='email'], input[type='email']", email)
        safe_fill(page, "textarea[name='skills'], input[name='skills'], textarea[id='skills']", skills)

        if resume_path and os.path.exists(resume_path):
            log_action("Application Agent", "📎 Uploading resume...")
            safe_upload(page, "input[type='file']", resume_path)
        else:
            log_action("Application Agent", "⚠️ No resume file found, skipping upload.")

        log_action("Application Agent", "🚀 Submitting application...")
        safe_click(page, "button[type='submit'], input[type='submit'], button:has-text('Submit'), button:has-text('Apply')")
        page.wait_for_timeout(3000)

        # Validation — check success
        log_action("Validation Agent", "🔍 Verifying submission...")
        success = check_success(
            page,
            success_selectors=[".success", "#success", "[data-success]", ".alert-success"],
            success_texts=["thank you", "submitted", "application received", "success", "applied"]
        )

        screenshot = take_screenshot(page, f"apply_attempt_{attempt}")
        browser.close()

        return {
            "success": success,
            "screenshot": screenshot,
            "logs": action_log
        }


def open_google():
    """Quick test to verify Playwright is working."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto("https://google.com")
        print("✅ Playwright is working! Browser opened successfully.")
        input("Press Enter to close...")
        browser.close()


if __name__ == "__main__":
    open_google()
