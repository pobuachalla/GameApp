"""
Shared fixtures for the GAA match tracker Selenium test suite.

Session-scoped:  http_server, driver
Function-scoped: app  — navigates to a clean page with localStorage cleared
"""
import http.server
import os
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
    opts.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
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
    return driver
