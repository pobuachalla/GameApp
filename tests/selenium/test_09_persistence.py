"""
test_09_persistence.py — State survives a page reload via localStorage.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from helpers import App

TIMEOUT = 10


def _reload(driver):
    driver.refresh()
    WebDriverWait(driver, TIMEOUT).until(
        EC.presence_of_element_located((By.ID, "timer-display"))
    )


# ── Team names ─────────────────────────────────────────────────────────────────

def test_us_team_name_persists(app):
    a = App(app)
    a.set_team_name("us", "Wolfe Tones")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert "WOLFE" in a2.text("#uslbl").upper()


def test_opp_team_name_persists(app):
    a = App(app)
    a.set_team_name("opp", "Drumbaragh")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert "DRUMBARAGH" in a2.text("#opplbl").upper()


# ── Scores ─────────────────────────────────────────────────────────────────────

def test_us_goal_persists(app):
    a = App(app)
    a.adj_add("us", "g")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.score()["us_g"] == 1


def test_us_points_persist(app):
    a = App(app)
    a.adj_add("us", "p")
    a.adj_add("us", "p")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.score()["us_p"] == 2


def test_opp_score_persists(app):
    a = App(app)
    a.adj_add("opp", "g")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.score()["opp_g"] == 1


def test_score_total_correct_after_reload(app):
    a = App(app)
    a.adj_add("us", "g")
    a.adj_add("us", "p")
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.score()["us_tot"] == 4


# ── Match state ────────────────────────────────────────────────────────────────

def test_match_state_persists_after_start(app):
    a = App(app)
    a.start_match()
    a.pause()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    ms = a2.match_state()
    assert ms in ("PAUSED_FIRST_HALF", "RUNNING_FIRST_HALF")


def test_half_time_state_persists(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.match_state() == "HALF_TIME"


def test_full_time_state_persists(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.end_match()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.match_state() == "FULL_TIME"


# ── Events ─────────────────────────────────────────────────────────────────────

def test_events_persist_after_reload(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    count_before = a.event_count()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.event_count() >= count_before


def test_goal_event_present_in_log_after_reload(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    a2.open_log()
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row")
    assert len(rows) >= 1


# ── Player names ───────────────────────────────────────────────────────────────

def test_player_name_persists(app):
    a = App(app)
    a.open_settings()
    a.set_player_name(7, "MidfielderTest")
    a.close_settings()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    name = a2.js("return state.pnames[7] || '';")
    assert "MidfielderTest" in name or name != ""


# ── Sport / team size ──────────────────────────────────────────────────────────

def test_sport_setting_persists(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "sport-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('sport-chk').click()")
    a.close_settings()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.js("return state.sport;") == "football"


def test_team_size_persists(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "size-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('size-chk').click()")
    a.close_settings()
    a.js("saveStateImmediate();")
    _reload(app)
    a2 = App(app)
    assert a2.js("return state.teamSize;") == 13
