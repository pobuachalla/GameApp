"""
test_03_scoring.py — Score recording, totals, adjustments and undo.
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from helpers import App


# ── Player-recorded scores ─────────────────────────────────────────────────────

def test_goal_increments_goal_count(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    assert a.score()["us_g"] == 1


def test_goal_adds_three_to_total(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    assert a.score()["us_tot"] == 3


def test_point_increments_point_count(app):
    a = App(app)
    a.start_match()
    a.record_point(slot=2)
    assert a.score()["us_p"] == 1


def test_point_adds_one_to_total(app):
    a = App(app)
    a.start_match()
    a.record_point(slot=2)
    assert a.score()["us_tot"] == 1


def test_goal_and_point_accumulate(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_point(slot=3)
    s = a.score()
    assert s["us_g"] == 1
    assert s["us_p"] == 1
    assert s["us_tot"] == 4


def test_two_goals_accumulate(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_goal(slot=3)
    assert a.score()["us_g"] == 2
    assert a.score()["us_tot"] == 6


def test_multiple_points_accumulate(app):
    a = App(app)
    a.start_match()
    for slot in [2, 3, 4]:
        a.record_point(slot=slot)
    assert a.score()["us_p"] == 3
    assert a.score()["us_tot"] == 3


def test_goal_from_free_increases_score(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2, how="From Free")
    assert a.score()["us_g"] == 1


def test_point_from_free_increases_score(app):
    a = App(app)
    a.start_match()
    a.record_point(slot=2, how="From Free")
    assert a.score()["us_p"] == 1


def test_wide_does_not_change_score(app):
    a = App(app)
    a.start_match()
    a.record_wide(slot=2)
    s = a.score()
    assert s["us_g"] == 0 and s["us_p"] == 0 and s["us_tot"] == 0


def test_opp_score_unaffected_by_us_goal(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    s = a.score()
    assert s["opp_g"] == 0 and s["opp_p"] == 0


# ── Score adjustments (edit button) ───────────────────────────────────────────

def test_adj_add_goal_increments_us_goals(app):
    a = App(app)
    a.adj_add("us", "g")
    assert a.score()["us_g"] == 1


def test_adj_add_goal_adds_three_to_total(app):
    a = App(app)
    a.adj_add("us", "g")
    assert a.score()["us_tot"] == 3


def test_adj_add_point_increments_us_points(app):
    a = App(app)
    a.adj_add("us", "p")
    assert a.score()["us_p"] == 1


def test_adj_remove_goal_decrements_us_goals(app):
    a = App(app)
    a.adj_add("us", "g")
    a.adj_remove("us", "g")
    assert a.score()["us_g"] == 0


def test_adj_remove_point_decrements_us_points(app):
    a = App(app)
    a.adj_add("us", "p")
    a.adj_remove("us", "p")
    assert a.score()["us_p"] == 0


def test_adj_score_cannot_go_below_zero(app):
    a = App(app)
    a.adj_remove("us", "g")   # already 0 — should be a no-op
    assert a.score()["us_g"] == 0


def test_adj_add_opp_goal(app):
    a = App(app)
    a.adj_add("opp", "g")
    assert a.score()["opp_g"] == 1


def test_adj_add_opp_point(app):
    a = App(app)
    a.adj_add("opp", "p")
    assert a.score()["opp_p"] == 1


def test_adj_add_opp_total_correct(app):
    a = App(app)
    a.adj_add("opp", "g")
    a.adj_add("opp", "p")
    assert a.score()["opp_tot"] == 4


# ── Undo ───────────────────────────────────────────────────────────────────────

def test_undo_enabled_after_event(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    assert a.undo_enabled()


def test_undo_reverts_goal(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    # record_goal pushes two undo entries: the goal and the restart outcome
    a.undo()  # undo restart
    a.undo()  # undo goal
    assert a.score()["us_g"] == 0


def test_undo_reverts_total(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.undo()  # undo restart
    a.undo()  # undo goal
    assert a.score()["us_tot"] == 0


def test_undo_reverts_point(app):
    a = App(app)
    a.start_match()
    a.record_point(slot=2)
    a.undo()  # undo restart
    a.undo()  # undo point
    assert a.score()["us_p"] == 0


def test_undo_removes_event_from_log(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    count_before = a.event_count()
    a.undo()
    assert a.event_count() < count_before


def test_undo_adj_reverts_score(app):
    a = App(app)
    a.adj_add("us", "g")
    a.undo()  # undo restart
    a.undo()  # undo adjustment
    assert a.score()["us_g"] == 0


def test_undo_after_multiple_goals(app):
    a = App(app)
    a.start_match()
    a.record_goal(slot=2)
    a.record_goal(slot=3)
    a.undo()  # undo restart for second goal
    a.undo()  # undo second goal
    assert a.score()["us_g"] == 1
