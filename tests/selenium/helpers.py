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
from selenium.common.exceptions import NoSuchElementException, TimeoutException

TIMEOUT = 12

_JS_CLICK = "arguments[0].click();"
_TIMER_PRIMARY_BTN = "#timer-primary-btn"
_STATUS_CHIP       = "#status-chip"
_HOW_FROM_PLAY     = "From Play"


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
        self.d.execute_script(_JS_CLICK, el)

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

    # ── Confirm drawer (cfmpanel) ──────────────────────────────────────────────

    def wait_modal_open(self):
        """Waits for the confirm drawer (cfmpanel) to open."""
        self.wait_panel_open("cfmpanel")

    def wait_modal_closed(self):
        """Waits for the confirm drawer (cfmpanel) to close."""
        self.wait_panel_closed("cfmpanel")

    def modal_open(self):
        return self.panel_open("cfmpanel")

    def modal_title(self):
        return self.text("#cfm-title")

    def confirm(self):
        """Click the confirm button in cfmpanel."""
        self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "#cfmpanel .cfm-btn"))
        ).click()

    def dismiss(self):
        """Dismiss the currently open panel by clicking its overlay."""
        for oid in ("cfmovly", "rstovly", "scrovly", "sharovly", "plyovly", "subovly"):
            try:
                overlay = self.d.find_element(By.ID, oid)
                cls = overlay.get_attribute("class") or ""
                if "open" in cls.split():
                    self.d.execute_script(_JS_CLICK, overlay)
                    return
            except NoSuchElementException:
                continue

    # ── Click options (data-v across all visible panels / psAction buttons) ─────

    def click_opt(self, data_v):
        """Click an option by data-v value across all open panels, or by psAction."""
        # psAction buttons in player sheet
        ps_sel = f'[onclick="psAction(\'{data_v}\')"]'
        # data-v in any panel body
        dv_sel = (
            f'#ply-body [data-v="{data_v}"], '
            f'#scr-body [data-v="{data_v}"], '
            f'#sub-list [data-v="{data_v}"], '
            f'#share-opts-wrap [data-v="{data_v}"], '
            f'#sharpanel [data-v="{data_v}"]'
        )
        # Restart special cases
        if data_v in ("Won", "Win"):
            btn = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#rstpanel .ps-poss-won"))
            )
            self.d.execute_script(_JS_CLICK, btn)
            return
        if data_v in ("Lost", "Loss"):
            btn = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#rstpanel .ps-poss-lost"))
            )
            self.d.execute_script(_JS_CLICK, btn)
            return
        # Try psAction button first
        try:
            btn = WebDriverWait(self.d, 2).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ps_sel))
            )
            self.d.execute_script(_JS_CLICK, btn)
            return
        except TimeoutException:
            pass
        # Fall back to data-v selector
        btn = self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, dv_sel))
        )
        self.d.execute_script(_JS_CLICK, btn)

    # ── Timer / state-machine helpers ──────────────────────────────────────────

    def start_match(self):
        """Click the primary timer button to start the first half."""
        self.click(_TIMER_PRIMARY_BTN)
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "running"
            in (
                d.find_element(By.CSS_SELECTOR, _STATUS_CHIP).get_attribute("class")
                or ""
            )
        )

    def pause(self):
        self.click(_TIMER_PRIMARY_BTN)
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "paused"
            in (
                d.find_element(By.CSS_SELECTOR, _STATUS_CHIP).get_attribute("class")
                or ""
            )
        )

    def resume(self):
        self.click(_TIMER_PRIMARY_BTN)
        WebDriverWait(self.d, TIMEOUT).until(
            lambda d: "running"
            in (
                d.find_element(By.CSS_SELECTOR, _STATUS_CHIP).get_attribute("class")
                or ""
            )
        )

    def end_half(self, dismiss_graphic=True):
        """End the first half via the secondary button and confirm."""
        self.click("#timer-secondary-btn")
        self.wait_panel_open("cfmpanel")
        self.confirm()
        self.wait_panel_closed("cfmpanel")
        if dismiss_graphic:
            self.wait_panel_open("score-graphic-panel")
            self.click("#score-graphic-continue-btn")
            self.wait_panel_closed("score-graphic-panel")

    def end_match(self, dismiss_graphic=True):
        """End the match via the secondary button and confirm."""
        self.click("#timer-secondary-btn")
        self.wait_panel_open("cfmpanel")
        self.confirm()
        self.wait_panel_closed("cfmpanel")
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

    # ── Player sheet helpers ───────────────────────────────────────────────────

    def click_player(self, slot):
        """Click a player button; waits for player sheet to open."""
        self.wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, f'[data-s="{slot}"]'))
        ).click()
        self.wait_panel_open("plysheet")

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

    def _pick_restart(self, result="Won"):
        """Pick a restart result in the restart drawer."""
        self.wait_panel_open("rstpanel")
        if result in ("Won", "Win"):
            btn = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#rstpanel .ps-poss-won"))
            )
            self.d.execute_script(_JS_CLICK, btn)
        elif result in ("Lost", "Loss"):
            btn = self.wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "#rstpanel .ps-poss-lost"))
            )
            self.d.execute_script(_JS_CLICK, btn)
        else:
            # "Unclear" — third poss button
            btns = self.d.find_elements(By.CSS_SELECTOR, "#rstpanel .ps-poss-btn")
            if len(btns) > 2:
                self.d.execute_script(_JS_CLICK, btns[2])
        self.wait_panel_closed("rstpanel")

    def _close_player_sheet(self):
        self.wait_panel_closed("plysheet")

    # ── Action flows ───────────────────────────────────────────────────────────

    def _js_wait_click(self, css):
        """Wait for an element to be clickable then click it via JS to avoid interception."""
        btn = self.wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, css)))
        self.d.execute_script(_JS_CLICK, btn)

    def record_goal(self, slot=2, how=_HOW_FROM_PLAY, restart="Won"):
        self.click_player(slot)
        self.click_opt("Goal")
        self._js_wait_click(f'#ply-body [data-v="{how}"]')
        self._pick_restart(restart)
        self._close_player_sheet()

    def record_point(self, slot=2, how=_HOW_FROM_PLAY, restart="Won"):
        self.click_player(slot)
        self.click_opt("Point")
        self._js_wait_click(f'#ply-body [data-v="{how}"]')
        self._pick_restart(restart)
        self._close_player_sheet()

    def record_wide(self, slot=2, how=_HOW_FROM_PLAY):
        self.click_player(slot)
        self.click_opt("Wide")
        self._js_wait_click(f'#ply-body [data-v="{how}"]')
        self._pick_restart("Won")
        self._close_player_sheet()

    def yellow_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self._js_wait_click('#ply-body [data-v="Yellow Card"]')
        self._close_player_sheet()

    def black_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self._js_wait_click('#ply-body [data-v="Black Card"]')
        self._close_player_sheet()

    def red_card(self, slot=2):
        self.click_player(slot)
        self.click_opt("Card")
        self._js_wait_click('#ply-body [data-v="Red Card"]')
        self._close_player_sheet()

    def substitute(self, slot_off=2, sub_on=17):
        """Sub player at slot_off off; bring bench player sub_on on."""
        self.click_player(slot_off)
        self.click_opt("Substitution")
        self.wait_panel_open("subpanel")
        self._js_wait_click(f'#sub-list [data-v="{sub_on}"]')
        self.wait_panel_closed("subpanel")

    # ── Score adjustments ──────────────────────────────────────────────────────

    def adj_add(self, side, kind, how=_HOW_FROM_PLAY, restart="Won"):
        """Add a goal ('g') or point ('p') for 'us' or 'opp' via the edit button."""
        self.click(f".score-adj-btn[onclick=\"openScoreModal('{side}')\"]")
        self.wait_panel_open("scrpanel")
        # Click the data-act button (g+, p+)
        btn = self.wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, f'#scr-body [data-act="{kind}+"]')
            )
        )
        self.d.execute_script(_JS_CLICK, btn)
        # Wait for how-scored sub-view then click how
        btn = self.wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, f'#scr-body [data-v="{how}"]')
            )
        )
        self.d.execute_script(_JS_CLICK, btn)
        self._pick_restart(restart)

    def adj_remove(self, side, kind):
        """Remove a goal ('g') or point ('p') for 'us' or 'opp'."""
        self.click(f".score-adj-btn[onclick=\"openScoreModal('{side}')\"]")
        self.wait_panel_open("scrpanel")
        btn = self.wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, f'#scr-body [data-act="{kind}-"]')
            )
        )
        self.d.execute_script(_JS_CLICK, btn)
        self.wait_panel_closed("scrpanel")

    # ── Panel controls ─────────────────────────────────────────────────────────

    def open_settings(self):
        self.click("button[onclick='openSettings()']")
        self.wait_panel_open("setpanel")

    def close_settings(self):
        self.js_click("button[onclick='closeSettings()']")
        self.wait_panel_closed("setpanel")

    def open_log(self):
        self.open_stats()
        self.js_click("button[onclick='openLog()']")
        self.wait_panel_open("logpanel")

    def close_log(self):
        self.el("#logovly").click()
        self.wait_panel_closed("logpanel")

    def open_stats(self):
        self.click("button[onclick='openStats()']")
        self.wait_panel_open("statspanel")
        # Wait for the 300 ms CSS slide-in transition to complete so that
        # element.text reads correctly (transform:translateY affects innerText).
        WebDriverWait(self.d, TIMEOUT).until(lambda d: d.execute_script(
            "return getComputedStyle(document.getElementById('statspanel')).transform"
            " === 'matrix(1, 0, 0, 1, 0, 0)';"
        ))

    def close_stats(self):
        self.el("#statsoverlay").click()
        self.wait_panel_closed("statspanel")

    def open_share(self):
        self.click("button[onclick='openShareMenu()']")
        self.wait_panel_open("sharpanel")

    # ── Settings helpers ───────────────────────────────────────────────────────

    def set_age_grade(self, grade):
        """Select an age grade pill in the settings panel (panel must be open).
        Pass '' to select the 'Not set' (—) pill."""
        label = "—" if grade == "" else grade
        self.js(
            """
            var pills = document.querySelectorAll('#sage-pills .age-grade-pill');
            for (var i = 0; i < pills.length; i++) {
                if (pills[i].textContent.trim() === arguments[0]) {
                    ageGradePick(pills[i]);
                    break;
                }
            }
            """,
            label,
        )

    def get_age_grade(self):
        """Return the active age grade from state (e.g. 'U14', '' if not set)."""
        return self.js("return state.ageGrade || '';")

    def get_age_grade_category_text(self):
        """Return the visible category badge text ('Go Games', 'Juvenile', 'Adult', or '')."""
        return self.js(
            "var el = document.getElementById('sage-category');"
            "return el ? el.textContent.trim() : '';"
        )

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
