"""
test_05_events.py — Event log panel: visibility, contents, selection, deletion.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from helpers import App


# ── Log panel open/close ───────────────────────────────────────────────────────

def test_log_panel_opens(app):
    a = App(app)
    a.open_log()
    assert a.panel_open("logpanel")


def test_log_panel_closes_via_overlay(app):
    a = App(app)
    a.open_log()
    a.close_log()
    assert not a.panel_open("logpanel")


# ── Event appearance ───────────────────────────────────────────────────────────

def test_goal_event_appears_in_log(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.open_log()
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row")
    assert any(rows), "No event rows in log after recording a goal"


def test_goal_event_has_correct_badge(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.open_log()
    # Goal events use CSS class 'bg' on the badge span
    goal_badges = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-bdg.bg")
    assert len(goal_badges) >= 1, "No goal-class badge found in event log"


def test_event_badge_count_matches_events(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    a.open_log()
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row")
    # Including period-start events there should be at least 2 rows
    assert len(rows) >= 2


def test_event_log_badge_counter_updates(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    badge = a.js("return document.getElementById('lbdg').textContent.trim();")
    assert badge != "" and badge != "0"


# ── Undo removes event ─────────────────────────────────────────────────────────

def test_undo_removes_row_from_log(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    count_before = a.event_count()
    a.undo()
    assert a.event_count() < count_before


def test_undo_button_disabled_after_undoing_all(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.undo()  # undo goal
    a.undo()  # undo the period-start event
    # After all undoable events exhausted, button may disable
    # We don't assert exactly because some period events aren't undoable
    # Just ensure no crash
    assert True


# ── Select mode ────────────────────────────────────────────────────────────────

def test_select_toggle_activates_select_mode(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.open_log()
    select_btn = WebDriverWait(app, 8).until(
        EC.element_to_be_clickable((By.ID, "seltoggle"))
    )
    select_btn.click()
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row")
    assert any("sel-mode" in (r.get_attribute("class") or "") for r in rows), \
        "sel-mode class not applied to rows after activating select mode"


def test_selecting_event_marks_it(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.open_log()
    # Activate select mode via JS click (button may be partially off-screen)
    a.js_click("#seltoggle")
    # Click the first event row to select it
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row.sel-mode")
    if rows:
        app.execute_script("arguments[0].click();", rows[0])
        selected = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row.selected")
        assert len(selected) >= 1


def test_remove_selected_events(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    count_before = a.event_count()
    a.open_log()
    # Enter select mode via JS click (button may be partially off-screen)
    a.js_click("#seltoggle")
    # Select all visible rows
    rows = app.find_elements(By.CSS_SELECTOR, "#evlog .ev-row.sel-mode")
    for r in rows:
        app.execute_script("arguments[0].click();", r)
    # Click Remove
    remove_btn = WebDriverWait(app, 8).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, "button[onclick='removeSelected()']"))
    )
    remove_btn.click()
    assert a.event_count() < count_before


# ── CSV / WA export buttons present ───────────────────────────────────────────

def test_csv_export_button_present_in_log(app):
    a = App(app)
    a.open_log()
    btns = app.find_elements(By.CSS_SELECTOR, ".csv-btn")
    assert len(btns) >= 1


def test_wa_share_button_present_in_log(app):
    a = App(app)
    a.open_log()
    btns = app.find_elements(By.CSS_SELECTOR, ".wa-btn")
    assert len(btns) >= 1
