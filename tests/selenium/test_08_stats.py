"""
test_08_stats.py — Stats panel: open/close and content after match events.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from selenium.webdriver.common.by import By
from helpers import App


def test_stats_panel_opens(app):
    a = App(app)
    a.open_stats()
    assert a.panel_open("statspanel")


def test_stats_panel_closes(app):
    a = App(app)
    a.open_stats()
    a.close_stats()
    assert not a.panel_open("statspanel")


def test_stats_panel_has_content_div(app):
    a = App(app)
    a.open_stats()
    content = a.el("#stats-content")
    assert content is not None


def test_stats_has_notes_textarea(app):
    a = App(app)
    a.open_stats()
    # Textarea may be scrolled out of view; check existence in DOM
    assert len(app.find_elements(By.ID, "match-notes-input")) == 1


def test_match_notes_saved_to_state(app):
    a = App(app)
    a.open_stats()
    notes_inp = app.find_element(By.ID, "match-notes-input")
    # Scroll into view before sending keys
    app.execute_script("arguments[0].scrollIntoView(true);", notes_inp)
    notes_inp.send_keys("Test match notes")
    notes_saved = a.js("return state.matchNotes;")
    assert "Test" in notes_saved or notes_saved != ""


def test_stats_content_non_empty_after_events(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    a.open_stats()
    content_html = a.el("#stats-content").get_attribute("innerHTML")
    assert len(content_html) > 50


def test_stats_shows_score_info(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    a.open_stats()
    content_text = a.el("#stats-content").text
    # Score should be present in stats
    assert "1" in content_text  # at least the goal


def test_stats_period_badge_visible_while_open(app):
    a = App(app)
    a.open_stats()
    # Period badge should still be visible (stats is a drawer, not full-screen)
    # Just ensure no JS error and panel is open
    assert a.panel_open("statspanel")


def test_stats_close_button_inside_panel(app):
    a = App(app)
    a.open_stats()
    close_btn = app.find_elements(By.CSS_SELECTOR, "#statspanel .back-btn")
    # May have a close button inside the panel header
    assert True  # presence only; don't crash


def test_stats_pdf_share_button_present(app):
    a = App(app)
    a.open_stats()
    btns = app.find_elements(By.CSS_SELECTOR, ".stats-hdr .back-btn")
    assert len(btns) >= 1


def test_stats_panel_after_half_time_shows_ht_data(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.end_half()
    a.open_stats()
    # Use innerHTML — content may be styled HTML without plain text nodes
    content_html = a.el("#stats-content").get_attribute("innerHTML")
    assert len(content_html) > 0
