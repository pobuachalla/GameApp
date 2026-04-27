"""
App helper — wraps common Selenium interactions for the GAA match tracker.

Usage:
    from helpers import App
    a = App(driver)       # wrap the driver
    a.start_match()
    a.record_goal(slot=2)
    assert a.score()['us_g'] == 1
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException

TIMEOUT = 8


class App:
    def __init__(self, driver):
        self.d    = driver
        self.wait = WebDriverWait(driver, TIMEOUT)

    # ── Raw DOM helpers ────────────────────────────────────────────────────────

    def el(self, css):
        return self.d.find_element(By.CSS_SELECTOR, css)

    def els(self, css):
        return self.d.find_elements(By.CSS_SELECTOR, css)

    def text(self, css):
        return self.el(css).text.strip()

    def attr(self, css, name):
        return self.el(css).get_attribute(name) or ""

    def classes(self, css):
        return self.attr(css, "class").split()

    def has_class(self, css, cls):
        return cls in self.classes(css)

    def click(self, css):
        self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, css))).click()

    def js(self, script, *args):
        return self.d.execute_script(script, *args)

    def js_click(self, css):
        """Click an element via JavaScript — bypasses overlay/visibility restrictions."""
        el = self.d.find_element(By.CSS_SELECTOR, css)
        self.d.execute_script("arguments[0].click();", el)

    def is_displayed(self, css):
        try:
            return self.el(css).is_displayed()
        except NoSuchElementException:
            return False

    def is_enabled(self, css):
        try:
            return self.el(css).is_enabled()
        except NoSuchElementException:
            return False

    # ── Modal helpers ──────────────────────────────────────────────────────────

    def modal_open(self):
        style = self.d.find_element(By.ID, "modal").get_attribute("style") or ""
        return "display: block" in style

    def wait_modal_open(self):
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "display: block"
            in (d.find_element(By.ID, "modal").get_attribute("style") or "")
        )

    def wait_modal_closed(self):
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "display: block"
            not in (d.find_element(By.ID, "modal").get_attribute("style") or "")
        )

    def modal_title(self):
        return self.text("#mtitle")

    def click_opt(self, data_v):
        """Click a modal option button by its data-v attribute value."""
        sel = f'#mopts [data-v="{data_v}"]'
        self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, sel))).click()

    def dismiss(self):
        """Close the modal by clicking the Cancel button."""
        self.wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, "button[onclick='closeMod()']")
            )
        ).click()
        self.wait_modal_closed()

    def confirm(self):
        """Click the primary confirmation button (.confirm-action-btn)."""
        self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".confirm-action-btn"))
        ).click()

    # ── Panel helpers (all panels use the .open class) ─────────────────────────

    def panel_open(self, panel_id):
        cls = self.d.find_element(By.ID, panel_id).get_attribute("class") or ""
        return "open" in cls.split()

    def wait_panel_open(self, panel_id):
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "open"
            in (d.find_element(By.ID, panel_id).get_attribute("class") or "").split()
        )

    def wait_panel_closed(self, panel_id):
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "open"
            not in (d.find_element(By.ID, panel_id).get_attribute("class") or "").split()
        )

    # ── Timer / state-machine helpers ──────────────────────────────────────────

    def start_match(self):
        """Click the primary timer button to start the first half."""
        self.click("#timer-primary-btn")
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "running"
            in (
                d.find_element(By.CSS_SELECTOR, "#status-chip").get_attribute("class")
                or ""
            )
        )

    def pause(self):
        self.click("#timer-primary-btn")
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "paused"
            in (
                d.find_element(By.CSS_SELECTOR, "#status-chip").get_attribute("class")
                or ""
            )
        )

    def resume(self):
        self.click("#timer-primary-btn")
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "running"
            in (
                d.find_element(By.CSS_SELECTOR, "#status-chip").get_attribute("class")
                or ""
            )
        )

    def end_half(self, dismiss_graphic=True):
        """End the first half via the secondary button and confirm the modal."""
        self.click("#timer-secondary-btn")
        self.wait_modal_open()
        self.confirm()
        self.wait_modal_closed()
        if dismiss_graphic:
            self.wait_panel_open("score-graphic-panel")
            self.click("#score-graphic-continue-btn")
            self.wait_panel_closed("score-graphic-panel")

    def end_match(self, dismiss_graphic=True):
        """End the match via the secondary button and confirm the modal."""
        self.click("#timer-secondary-btn")
        self.wait_modal_open()
        self.confirm()
        self.wait_modal_closed()
        if dismiss_graphic:
            self.wait_panel_open("score-graphic-panel")
            self.click("#score-graphic-continue-btn")
            self.wait_panel_closed("score-graphic-panel")

    def match_state(self):
        return self.js("return state.matchState;")

    # ── Score helpers ──────────────────────────────────────────────────────────

    def score(self):
        return {
            "us_g":    int(self.text("#gc")),
            "us_p":    int(self.text("#pc")),
            "opp_g":   int(self.text("#og")),
            "opp_p":   int(self.text("#op")),
            "us_tot":  int(self.text("#utotal").strip("()")),
            "opp_tot": int(self.text("#ototal").strip("()")),
        }

    # ── Player helpers ─────────────────────────────────────────────────────────

    def player_classes(self, slot):
        return (
            self.d.find_element(By.CSS_SELECTOR, f'[data-s="{slot}"]').get_attribute(
                "class"
            )
            or ""
        ).split()

    def player_has(self, slot, cls):
        return cls in self.player_classes(slot)

    def player_disabled(self, slot):
        return not self.d.find_element(
            By.CSS_SELECTOR, f'[data-s="{slot}"]'
        ).is_enabled()

    def click_player(self, slot):
        self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, f'[data-s="{slot}"]'))
        ).click()
        self.wait_modal_open()

    # ── Action flows ───────────────────────────────────────────────────────────

    def record_goal(self, slot=2, how="From Play", restart="Won"):
        self.click_player(slot)
        self.click_opt("Goal")
        self.click_opt(how)
        self.wait_modal_open()
        self.click_opt(restart)
        self.wait_modal_closed()

    def record_point(self, slot=2, how="From Play", restart="Won"):
        self.click_player(slot)
        self.click_opt("Point")
        self.click_opt(how)
        self.wait_modal_open()
        self.click_opt(restart)
        self.wait_modal_closed()

    def record_wide(self, slot=2, how="From Play"):
        self.click_player(slot)
        self.click_opt("Wide")
        self.click_opt(how)
        self.wait_modal_open()
        self.dismiss()

    def yellow_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self.click_opt("Yellow Card")
        self.wait_modal_closed()

    def black_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self.click_opt("Black Card")
        self.wait_modal_closed()

    def red_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self.click_opt("Red Card")
        self.wait_modal_closed()

    def substitute(self, slot_off=2, sub_on=17):
        """Sub player at slot_off off; bring bench player sub_on on."""
        self.click_player(slot_off)
        self.click_opt("Substitution")
        self.wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, f'#mopts .abtn[data-v="{sub_on}"]')
            )
        ).click()
        self.wait_modal_closed()

    # ── Score adjustments ──────────────────────────────────────────────────────

    def adj_add(self, side, kind, how="From Play", restart="Won"):
        """Add a goal ('g') or point ('p') for 'us' or 'opp' via the edit button."""
        self.click(f".score-adj-btn[onclick=\"openScoreModal('{side}')\"]")
        self.wait_modal_open()
        self.click_opt(f"{kind}+")
        self.click_opt(how)
        self.wait_modal_open()
        self.click_opt(restart)
        self.wait_modal_closed()

    def adj_remove(self, side, kind):
        """Remove a goal ('g') or point ('p') for 'us' or 'opp'."""
        self.click(f".score-adj-btn[onclick=\"openScoreModal('{side}')\"]")
        self.wait_modal_open()
        self.click_opt(f"{kind}-")
        self.wait_modal_closed()

    # ── Panel controls ─────────────────────────────────────────────────────────

    def open_settings(self):
        self.click("button[onclick='openSettings()']")
        self.wait_panel_open("setpanel")

    def close_settings(self):
        self.js_click("button[onclick='closeSettings()']")
        self.wait_panel_closed("setpanel")

    def open_log(self):
        self.open_stats()
        self.click("button[onclick='openLog()']")
        self.wait_panel_open("logpanel")

    def close_log(self):
        self.el("#logovly").click()
        self.wait_panel_closed("logpanel")

    def open_stats(self):
        self.click("button[onclick='openStats()']")
        self.wait_panel_open("statspanel")

    def close_stats(self):
        self.el("#statsoverlay").click()
        self.wait_panel_closed("statspanel")

    def open_share(self):
        self.click("button[onclick='openShareMenu()']")
        self.wait_modal_open()

    # ── Settings helpers ───────────────────────────────────────────────────────

    def set_team_name(self, side, name):
        """Set a team name directly via JS (bypasses typeahead)."""
        field = "sun" if side == "us" else "son"
        self.js(
            f"document.getElementById('{field}').value = arguments[0]; flushSettings();",
            name,
        )

    def set_player_name(self, slot, name):
        """Set a player name in the settings panel (panel must be open)."""
        self.js("switchSetupTab('team');")
        inp = self.wait.until(
            EC.element_to_be_clickable((By.ID, f"sn{slot}"))
        )
        inp.clear()
        inp.send_keys(name)
        self.js("flushSettings();")

    def event_count(self):
        """Number of events in state.evts."""
        return self.js("return state.evts.length;")

    def undo(self):
        self.click("#undobtn")

    def undo_enabled(self):
        return self.d.find_element(By.ID, "undobtn").is_enabled()
