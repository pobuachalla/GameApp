"""
Shared fixtures for the GAA match tracker Selenium test suite.

Session-scoped:  http_server, driver
Function-scoped: app  — navigates to a clean page with localStorage cleared
"""
import http.server
import os
import subprocess
import threading

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

SERVE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PORT      = 8887
BASE_URL  = f"http://127.0.0.1:{PORT}"


class _SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


@pytest.fixture(scope="session")
def http_server():
    # index.html loads js/bundle.js, which is gitignored — build it so a
    # fresh clone can run the suite without a manual step.
    subprocess.run(["node", "build.cjs"], cwd=SERVE_DIR, check=True)
    os.chdir(SERVE_DIR)
    server = http.server.HTTPServer(("127.0.0.1", PORT), _SilentHandler)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    yield BASE_URL
    # Daemon thread dies with the process; explicit shutdown blocks on Chrome
    # keep-alive connections so we skip it.


@pytest.fixture(scope="session")
def driver():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=430,932")
    # Capture browser console logs so tests can assert "no JS errors"
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    # Selenium Manager finds Chrome on PATH; only force the binary where the
    # default macOS install location actually exists.
    mac_chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if os.path.exists(mac_chrome):
        opts.binary_location = mac_chrome
    drv = webdriver.Chrome(options=opts)
    drv.implicitly_wait(0)
    yield drv
    drv.quit()


@pytest.fixture
def app(driver, http_server):
    """Return the driver pointed at a freshly-loaded, localStorage-cleared app."""
    driver.get(http_server)
    # Clear storage and neutralise the visibilitychange handler so it cannot
    # re-save state into localStorage while we navigate away.
    driver.execute_script("""
        localStorage.clear();
        window.saveStateImmediate = function() {};
    """)
    driver.get(http_server)
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "#timer-primary-btn"))
    )
    # Ensure no panel is still open from a previous test (CSS transition residue).
    WebDriverWait(driver, 5).until(lambda d: d.execute_script(
        "return document.querySelectorAll('.drw-panel.open,.drw-overlay.open').length === 0;"
    ))
    return driver
