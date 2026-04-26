"""
test_02_timer.py — State machine transitions and timer UI.
"""
import sys, os, time
sys.path.insert(0, os.path.dirname(__file__))

import pytest
from helpers import App


def test_start_match_shows_running_chip(app):
    a = App(app)
    a.start_match()
    assert a.has_class("#status-chip", "running")


def test_start_match_state_is_running_first_half(app):
    a = App(app)
    a.start_match()
    assert a.match_state() == "RUNNING_FIRST_HALF"


def test_secondary_button_visible_when_running(app):
    a = App(app)
    a.start_match()
    assert a.is_displayed("#timer-secondary-btn")


def test_secondary_button_shows_end_half_label(app):
    a = App(app)
    a.start_match()
    assert "End Half" in a.text("#timer-secondary-btn")


def test_timer_increments_after_start(app):
    a = App(app)
    a.start_match()
    time.sleep(2)
    display = a.text("#timer-display")
    assert display != "00:00", f"Timer did not increment; still shows {display}"


def test_pause_shows_paused_chip(app):
    a = App(app)
    a.start_match()
    a.pause()
    assert a.has_class("#status-chip", "paused")


def test_pause_state_is_paused_first_half(app):
    a = App(app)
    a.start_match()
    a.pause()
    assert a.match_state() == "PAUSED_FIRST_HALF"


def test_resume_shows_running_chip(app):
    a = App(app)
    a.start_match()
    a.pause()
    a.resume()
    assert a.has_class("#status-chip", "running")


def test_end_half_shows_confirmation_modal(app):
    a = App(app)
    a.start_match()
    a.click("#timer-secondary-btn")
    a.wait_modal_open()
    assert "End First Half" in a.modal_title() or a.is_displayed(".confirm-action-btn")


def test_cancel_end_half_modal_keeps_running(app):
    a = App(app)
    a.start_match()
    a.click("#timer-secondary-btn")
    a.wait_modal_open()
    a.dismiss()
    assert a.match_state() in ("RUNNING_FIRST_HALF", "PAUSED_FIRST_HALF")


def test_confirm_end_half_transitions_to_half_time(app):
    a = App(app)
    a.start_match()
    a.end_half()
    assert a.match_state() == "HALF_TIME"


def test_half_time_score_graphic_opens(app):
    a = App(app)
    a.start_match()
    a.click("#timer-secondary-btn")
    a.wait_modal_open()
    a.confirm()
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")
    a.wait_panel_closed("score-graphic-panel")


def test_half_time_secondary_button_hidden(app):
    a = App(app)
    a.start_match()
    a.end_half()
    assert not a.is_displayed("#timer-secondary-btn")


def test_start_second_half_transitions_to_running(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    assert a.match_state() == "RUNNING_SECOND_HALF"


def test_second_half_secondary_button_shows_end_match(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    assert "End Match" in a.text("#timer-secondary-btn")


def test_end_match_transitions_to_full_time(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.end_match()
    assert a.match_state() == "FULL_TIME"


def test_full_time_score_graphic_opens(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.click("#timer-secondary-btn")
    a.wait_modal_open()
    a.confirm()
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")
    a.wait_panel_closed("score-graphic-panel")


def test_full_time_reset_button_exists(app):
    from selenium.webdriver.common.by import By
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.end_match()
    reset = app.find_elements(By.ID, "resetbtn")
    assert len(reset) == 1, "Reset button should appear after full time"


def test_period_badge_updates_at_half_time(app):
    a = App(app)
    a.start_match()
    a.end_half()
    badge_text = a.text("#period-badge")
    assert "half" in badge_text.lower() or "time" in badge_text.lower() or "2" in badge_text
