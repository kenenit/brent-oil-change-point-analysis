import sys
from pathlib import Path

import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.event_matcher import match_change_point_to_events, summarize_impact


def test_match_finds_known_nearby_event():
    matches = match_change_point_to_events("2020-02-27", window_days=45)
    assert len(matches) >= 1
    assert "COVID-19 Demand Collapse" in matches["event_name"].values


def test_match_respects_window():
    # A date far from any real event should return no matches with a tight window
    matches = match_change_point_to_events("1995-01-01", window_days=5)
    assert len(matches) == 0


def test_match_sorted_by_absolute_distance():
    matches = match_change_point_to_events("2020-02-27", window_days=45)
    distances = matches["days_from_change_point"].abs().tolist()
    assert distances == sorted(distances)


def test_summarize_impact_log_scale():
    import numpy as np
    msg = summarize_impact(np.log(50), np.log(100), is_log=True)
    assert "100.0%" in msg
    assert "increase" in msg


def test_summarize_impact_price_scale_decrease():
    msg = summarize_impact(100, 50, is_log=False)
    assert "50.0%" in msg
    assert "decrease" in msg
