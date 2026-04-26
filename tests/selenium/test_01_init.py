"""
test_01_init.py — Verify the app loads correctly in its initial state.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from helpers import App


def test_page_title(app):
    assert "GAA" in app.title or app.title != ""


def test_no_js_errors_on_load(app):
    logs = app.get_log("browser")
    severe = [
        l for l in logs
        if l.get("level") == "SEVERE"
        # Ignore expected CORS/network failures from third-party analytics scripts
        and "cloudflareinsights.com" not in l.get("message", "")
        and "cdn-cgi" not in l.get("message", "")
    ]
    assert severe == [], f"JS errors on load: {severe}"


def test_initial_score_zeros(app):
    a = App(app)
    s = a.score()
    assert s["us_g"] == 0
    assert s["us_p"] == 0
    assert s["opp_g"] == 0
    assert s["opp_p"] == 0


def test_initial_totals_zero(app):
    a = App(app)
    s = a.score()
    assert s["us_tot"] == 0
    assert s["opp_tot"] == 0


def test_timer_shows_zero(app):
    a = App(app)
    assert a.text("#timer-display") == "00:00"


def test_undo_button_disabled_initially(app):
    a = App(app)
    assert not a.undo_enabled()


def test_player_grid_has_15_slots(app):
    a = App(app)
    buttons = a.els("[data-s]")
    assert len(buttons) == 15


def test_secondary_timer_button_hidden_initially(app):
    a = App(app)
    assert not a.is_displayed("#timer-secondary-btn")


def test_status_chip_hidden_initially(app):
    a = App(app)
    assert not a.is_displayed("#status-chip")


def test_match_state_is_pre_match(app):
    a = App(app)
    assert a.match_state() == "PRE_MATCH"


def test_score_graphic_panel_closed_initially(app):
    a = App(app)
    assert not a.panel_open("score-graphic-panel")


def test_event_log_empty_initially(app):
    a = App(app)
    assert a.event_count() == 0
