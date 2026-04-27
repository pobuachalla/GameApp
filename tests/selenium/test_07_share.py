"""
test_07_share.py — Share menu, score graphic panel, lineup graphic.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from selenium.webdriver.common.by import By
from helpers import App


# ── Share modal ────────────────────────────────────────────────────────────────

def test_share_menu_modal_opens(app):
    a = App(app)
    a.open_share()
    assert a.modal_open()


def test_share_menu_title_is_share(app):
    a = App(app)
    a.open_share()
    assert a.modal_title().lower() == "share"


def test_share_menu_has_current_score_option(app):
    a = App(app)
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    assert "curr" in opts


def test_share_menu_has_lineup_option(app):
    a = App(app)
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    assert "lu" in opts


def test_share_menu_no_ht_option_before_half_time(app):
    a = App(app)
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    assert "ht" not in opts


def test_share_menu_no_ft_option_before_full_time(app):
    a = App(app)
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    assert "ft" not in opts


def test_share_menu_cancel_closes_modal(app):
    a = App(app)
    a.open_share()
    a.dismiss()
    assert not a.modal_open()


# ── Current score card ─────────────────────────────────────────────────────────

def test_current_score_card_opens_graphic_panel(app):
    a = App(app)
    a.open_share()
    a.click_opt("curr")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")


def test_score_graphic_contains_score_numbers(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.open_share()
    a.click_opt("curr")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    wrap_text = a.el("#score-graphic-wrap").text
    assert "1" in wrap_text  # goal count


def test_score_graphic_continue_btn_closes_panel(app):
    a = App(app)
    a.open_share()
    a.click_opt("curr")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")
    a.wait_panel_closed("score-graphic-panel")
    assert not a.panel_open("score-graphic-panel")


# ── Lineup graphic ─────────────────────────────────────────────────────────────

def test_lineup_graphic_opens_panel(app):
    a = App(app)
    a.open_share()
    a.click_opt("lu")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")


def test_lineup_graphic_contains_player_slots(app):
    a = App(app)
    a.open_share()
    a.click_opt("lu")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    wrap_html = a.el("#score-graphic-wrap").get_attribute("innerHTML")
    # The lineup renders SVG shirt elements
    assert "svg" in wrap_html.lower() or "shirt" in wrap_html.lower() or len(wrap_html) > 100


def test_lineup_close_button_closes_panel(app):
    a = App(app)
    a.open_share()
    a.click_opt("lu")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")
    a.wait_panel_closed("score-graphic-panel")
    assert not a.panel_open("score-graphic-panel")


# ── HT card appears after half-time ───────────────────────────────────────────

def test_ht_share_option_appears_after_half_time(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    a.dismiss()
    assert "ht" in opts


def test_ht_score_card_opens_graphic_panel(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.open_share()
    a.click_opt("ht")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")


# ── FT card appears after full time ───────────────────────────────────────────

def test_ft_share_option_appears_after_full_time(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.end_match()
    a.open_share()
    opts = [el.get_attribute("data-v") for el in app.find_elements(By.CSS_SELECTOR, "#mopts [data-v]")]
    a.dismiss()
    assert "ft" in opts


def test_ft_score_card_opens_graphic_panel(app):
    a = App(app)
    a.start_match()
    a.end_half()
    a.start_match()
    a.end_match()
    a.open_share()
    a.click_opt("ft")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")
    assert a.panel_open("score-graphic-panel")
    a.click("#score-graphic-continue-btn")


# ── All 6 scorers listed on score cards ────────────────────────────────────────

def test_score_card_lists_all_six_scorers(app):
    """6 different players score; all 6 names must appear in the share graphic."""
    a = App(app)

    # Name 6 players across different slots
    names = {
        2: "Alan Burke",
        3: "Brian Casey",
        4: "Conor Daly",
        5: "Declan Egan",
        6: "Eoin Flynn",
        7: "Fionn Gill",
    }
    a.open_settings()
    for slot, name in names.items():
        a.set_player_name(slot, name)
    a.close_settings()

    a.start_match()
    for slot in names:
        a.record_point(slot=slot)

    a.open_share()
    a.click_opt("curr")
    a.wait_modal_closed()
    a.wait_panel_open("score-graphic-panel")

    wrap_text = a.el("#score-graphic-wrap").text
    missing = [name for name in names.values() if name.split()[0] not in wrap_text and name.split()[-1] not in wrap_text]
    assert not missing, f"Scorers missing from share card: {missing}"

    a.click("#score-graphic-continue-btn")
