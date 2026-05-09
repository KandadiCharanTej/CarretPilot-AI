"""
utils.py — Shared Playwright utilities for automation agents.
Handles browser lifecycle, screenshots, and common actions.
"""

import os
import time
from playwright.sync_api import sync_playwright, Page, Browser


def get_browser(headless: bool = False):
    """Launch and return a Chromium browser instance."""
    p = sync_playwright().start()
    browser = p.chromium.launch(headless=headless)
    return p, browser


def safe_fill(page: Page, selector: str, value: str, timeout: int = 5000):
    """Fill a field, retrying once with extended timeout on failure."""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.fill(selector, value)
        return True
    except Exception:
        try:
            page.wait_for_selector(selector, timeout=timeout * 2)
            page.fill(selector, value)
            return True
        except Exception as e:
            print(f"[WARN] Could not fill selector '{selector}': {e}")
            return False


def safe_click(page: Page, selector: str, timeout: int = 5000):
    """Click an element, retrying once on failure."""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.click(selector)
        return True
    except Exception:
        try:
            # Try alternate: JavaScript click as fallback
            element = page.query_selector(selector)
            if element:
                element.evaluate("el => el.click()")
                return True
        except Exception as e:
            print(f"[WARN] Could not click selector '{selector}': {e}")
            return False


def safe_upload(page: Page, selector: str, file_path: str, timeout: int = 5000):
    """Upload a file to an input element."""
    try:
        page.wait_for_selector(selector, timeout=timeout)
        page.set_input_files(selector, file_path)
        return True
    except Exception as e:
        print(f"[WARN] Could not upload file to '{selector}': {e}")
        return False


def take_screenshot(page: Page, name: str = "screenshot"):
    """Save a screenshot as evidence of automation."""
    os.makedirs("screenshots", exist_ok=True)
    path = f"screenshots/{name}_{int(time.time())}.png"
    page.screenshot(path=path)
    return path


def check_success(page: Page, success_selectors: list[str], success_texts: list[str]) -> bool:
    """Check if submission was successful via selectors or page text."""
    content = page.content().lower()
    for text in success_texts:
        if text.lower() in content:
            return True
    for selector in success_selectors:
        try:
            el = page.query_selector(selector)
            if el:
                return True
        except Exception:
            pass
    return False
