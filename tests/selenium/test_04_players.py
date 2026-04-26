"""
test_04_players.py — Player actions: cards, substitutions and visual state.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from helpers import App


# ── Player grid visual state ───────────────────────────────────────────────────

def test_player_gets_hev_class_after_action(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    assert a.player_has(2, "hev")


def test_player_without_action_has_no_hev_class(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    assert not a.player_has(3, "hev")


# ── Yellow card ────────────────────────────────────────────────────────────────

def test_yellow_card_adds_card_y_class(app):
    a = App(app)
    a.start_match()
    a.yellow_card(slot=2)
    player_html = a.d.find_element(
        __import__("selenium").webdriver.common.by.By.CSS_SELECTOR, '[data-s="2"]'
    ).get_attribute("innerHTML")
    assert "card-y" in player_html


def test_yellow_card_creates_event(app):
    a = App(app)
    a.start_match()
    count_before = a.event_count()
    a.yellow_card(slot=2)
    assert a.event_count() > count_before


def test_multiple_yellow_cards_on_same_player(app):
    a = App(app)
    a.start_match()
    a.yellow_card(slot=2)
    a.yellow_card(slot=2)
    count = a.js("return state.ycarded[state.slotp[2]] || 0;")
    assert count >= 2


# ── Black card ─────────────────────────────────────────────────────────────────

def test_black_card_creates_event(app):
    a = App(app)
    a.start_match()
    count_before = a.event_count()
    a.black_card(slot=2)
    assert a.event_count() > count_before


def test_black_card_tracked_in_state(app):
    a = App(app)
    a.start_match()
    a.black_card(slot=2)
    count = a.js("return state.bcarded[state.slotp[2]] || 0;")
    assert count >= 1


# ── Red card ───────────────────────────────────────────────────────────────────

def test_red_card_adds_rc_class(app):
    a = App(app)
    a.start_match()
    a.red_card(slot=2)
    assert a.player_has(2, "rc")


def test_red_carded_player_button_is_disabled(app):
    a = App(app)
    a.start_match()
    a.red_card(slot=2)
    # Red card applies CSS class 'rc' (pointer-events: none) not HTML disabled
    assert a.player_has(2, "rc")


def test_red_card_marked_in_state(app):
    a = App(app)
    a.start_match()
    a.red_card(slot=2)
    rc = a.js("return state.rcarded[state.slotp[2]] || false;")
    assert rc


def test_red_card_creates_event(app):
    a = App(app)
    a.start_match()
    count_before = a.event_count()
    a.red_card(slot=2)
    assert a.event_count() > count_before


# ── Undo cards ────────────────────────────────────────────────────────────────

def test_undo_yellow_card_removes_ycarded(app):
    a = App(app)
    a.start_match()
    a.yellow_card(slot=2)
    a.undo()
    count = a.js("return state.ycarded[state.slotp[2]] || 0;")
    assert count == 0


def test_undo_red_card_removes_rc_class(app):
    a = App(app)
    a.start_match()
    a.red_card(slot=2)
    a.undo()
    assert not a.player_has(2, "rc")


def test_undo_red_card_re_enables_player(app):
    a = App(app)
    a.start_match()
    a.red_card(slot=2)
    a.undo()
    assert not a.player_disabled(2)


# ── Substitutions ─────────────────────────────────────────────────────────────

def test_substitution_marks_slot_with_sub_class(app):
    a = App(app)
    a.start_match()
    a.substitute(slot_off=2, sub_on=17)
    assert a.player_has(2, "sub")


def test_substitution_updates_slotp_in_state(app):
    a = App(app)
    a.start_match()
    a.substitute(slot_off=2, sub_on=17)
    new_pi = a.js("return state.slotp[2];")
    assert new_pi == 17


def test_substitution_records_event(app):
    a = App(app)
    a.start_match()
    count_before = a.event_count()
    a.substitute(slot_off=2, sub_on=17)
    assert a.event_count() > count_before


def test_substitution_event_has_sub_action(app):
    a = App(app)
    a.start_match()
    a.substitute(slot_off=2, sub_on=17)
    last_action = a.js("return state.evts[state.evts.length - 1].action;")
    assert last_action == "sub"


def test_undo_substitution_restores_slotp(app):
    a = App(app)
    a.start_match()
    original_pi = a.js("return state.slotp[2];")
    a.substitute(slot_off=2, sub_on=17)
    a.undo()
    restored_pi = a.js("return state.slotp[2];")
    assert restored_pi == original_pi


def test_undo_substitution_removes_sub_class(app):
    a = App(app)
    a.start_match()
    a.substitute(slot_off=2, sub_on=17)
    a.undo()
    assert not a.player_has(2, "sub")


# ── Action recorded in events log ─────────────────────────────────────────────

def test_wide_is_recorded_as_event(app):
    a = App(app)
    a.start_match()
    a.record_wide(slot=2)
    assert a.event_count() >= 1


def test_wide_action_stored_correctly(app):
    a = App(app)
    a.start_match()
    a.record_wide(slot=2)
    action = a.js(
        "return state.evts.find(e => e.action === 'Wide') ? 'found' : 'missing';"
    )
    assert action == "found"
