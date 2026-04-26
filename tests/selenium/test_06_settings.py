"""
test_06_settings.py — Setup panel: team names, sport/size toggles, player names.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from helpers import App


# ── Panel open/close ───────────────────────────────────────────────────────────

def test_settings_panel_opens(app):
    a = App(app)
    a.open_settings()
    assert a.panel_open("setpanel")


def test_settings_panel_closes(app):
    a = App(app)
    a.open_settings()
    a.close_settings()
    assert not a.panel_open("setpanel")


# ── Team names ─────────────────────────────────────────────────────────────────

def test_us_team_name_updates_scoreboard(app):
    a = App(app)
    a.set_team_name("us", "Donaghmore")
    label = a.text("#uslbl")
    assert "DONAGHMORE" in label.upper()


def test_opp_team_name_updates_scoreboard(app):
    a = App(app)
    a.set_team_name("opp", "Ratoath")
    label = a.text("#opplbl")
    assert "RATOATH" in label.upper()


def test_us_team_name_reflects_in_state(app):
    a = App(app)
    a.set_team_name("us", "Trim")
    assert a.js("return state.usN;") == "Trim"


def test_opp_team_name_reflects_in_state(app):
    a = App(app)
    a.set_team_name("opp", "Navan O'Mahonys")
    assert "Navan" in a.js("return state.oppN;")


def test_empty_us_name_falls_back_to_default(app):
    a = App(app)
    a.set_team_name("us", "")
    name = a.js("return state.usN;")
    assert name != "" and name is not None


# ── Sport toggle ───────────────────────────────────────────────────────────────

def test_sport_toggle_switches_to_football(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "sport-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('sport-chk').click()")
    a.close_settings()
    assert a.js("return state.sport;") == "football"


def test_sport_toggle_switches_back_to_hurling(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "sport-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('sport-chk').click()")
    app.execute_script("document.getElementById('sport-chk').click()")
    a.close_settings()
    assert a.js("return state.sport;") == "hurling"


# ── Team size toggle ───────────────────────────────────────────────────────────

def test_team_size_toggle_to_13(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "size-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('size-chk').click()")
    a.close_settings()
    assert a.js("return state.teamSize;") == 13


def test_team_size_toggle_rebuilds_grid_to_13(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "size-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('size-chk').click()")
    a.close_settings()
    buttons = app.find_elements(By.CSS_SELECTOR, "[data-s]")
    assert len(buttons) == 13


def test_team_size_toggle_back_to_15(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "size-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('size-chk').click()")
    app.execute_script("document.getElementById('size-chk').click()")
    a.close_settings()
    assert a.js("return state.teamSize;") == 15


def test_team_size_grid_returns_to_15_buttons(app):
    a = App(app)
    a.open_settings()
    chk = app.find_element(By.ID, "size-chk")
    if not chk.is_selected():
        app.execute_script("document.getElementById('size-chk').click()")
    app.execute_script("document.getElementById('size-chk').click()")
    a.close_settings()
    buttons = app.find_elements(By.CSS_SELECTOR, "[data-s]")
    assert len(buttons) == 15


# ── Player names ───────────────────────────────────────────────────────────────

def test_player_name_saved_to_state(app):
    a = App(app)
    a.open_settings()
    a.set_player_name(1, "Seán O'Brien")
    assert "Seán" in a.js("return state.pnames[1] || '';") or \
           "Sean" in a.js("return state.pnames[1] || '';")


def test_multiple_player_names_saved(app):
    a = App(app)
    a.open_settings()
    a.set_player_name(1, "Goalkeeper")
    a.set_player_name(2, "Corner Back")
    name1 = a.js("return state.pnames[1] || '';")
    name2 = a.js("return state.pnames[2] || '';")
    assert "Goalkeeper" in name1 or name1 != ""
    assert "Corner" in name2 or name2 != ""


# ── Captain assignment ─────────────────────────────────────────────────────────

def test_captain_button_sets_captain_in_state(app):
    a = App(app)
    a.open_settings()
    # Use JS click — button may be partially outside 430px viewport
    a.js_click(".cap-btn[data-cap='5']")
    captain = a.js("return state.captain;")
    assert captain == 5


def test_captain_is_none_when_not_set(app):
    a = App(app)
    captain = a.js("return state.captain;")
    assert captain is None


# ── Location and referee ───────────────────────────────────────────────────────

def test_location_field_exists_in_settings(app):
    a = App(app)
    a.open_settings()
    # Element may be outside the 430px viewport; check DOM presence
    assert len(app.find_elements(By.ID, "sloc")) == 1


def test_referee_field_exists_in_settings(app):
    a = App(app)
    a.open_settings()
    # Check element exists in DOM; may be partially outside 430px viewport
    assert len(app.find_elements(By.ID, "sref")) == 1
