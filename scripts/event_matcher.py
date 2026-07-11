"""
event_matcher.py

Utilities to associate a detected change point date with the closest
researched key event, within a given tolerance window.
"""
import sys
from pathlib import Path
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.data_loader import load_key_events


def match_change_point_to_events(change_point_date, events: pd.DataFrame = None, window_days: int = 30):
    """
    Find researched events within `window_days` of a detected change point date.

    Parameters
    ----------
    change_point_date : str or pd.Timestamp
        The detected change point date (e.g. posterior mode of tau).
    events : pd.DataFrame, optional
        Events dataframe with a 'start_date' column. Loaded via load_key_events()
        if not provided.
    window_days : int
        Tolerance window in days on either side of the change point.

    Returns
    -------
    pd.DataFrame
        Matching events sorted by absolute distance (days) to the change point,
        with an added 'days_from_change_point' column. Empty if no match found.
    """
    if events is None:
        events = load_key_events()

    change_point_date = pd.Timestamp(change_point_date)
    events = events.copy()
    events["days_from_change_point"] = (events["start_date"] - change_point_date).dt.days

    matches = events[events["days_from_change_point"].abs() <= window_days].copy()
    matches = matches.sort_values(
        key=lambda s: s.abs() if s.name == "days_from_change_point" else s,
        by="days_from_change_point"
    )
    return matches.reset_index(drop=True)


def summarize_impact(mean_before, mean_after, unit="USD/barrel", is_log=False):
    """
    Produce a human-readable impact statement given before/after means.

    If is_log is True, the inputs are treated as means of log(price) and
    converted back to price scale before computing the percent change.
    """
    import numpy as np

    if is_log:
        price_before = np.exp(mean_before)
        price_after = np.exp(mean_after)
    else:
        price_before = mean_before
        price_after = mean_after

    pct_change = (price_after - price_before) / price_before * 100
    direction = "increase" if pct_change >= 0 else "decrease"

    return (
        f"Average price shifted from ${price_before:.2f} to ${price_after:.2f} {unit}, "
        f"a {abs(pct_change):.1f}% {direction}."
    )


if __name__ == "__main__":
    # Quick manual test
    matches = match_change_point_to_events("2020-02-27", window_days=30)
    print(matches[["event_name", "start_date", "days_from_change_point"]])
    print()
    print(summarize_impact(4.13, 3.45, is_log=True))
