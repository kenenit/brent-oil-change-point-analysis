import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.data_loader import load_brent_prices, load_key_events, _parse_mixed_date


def test_parse_mixed_date_old_format():
    assert _parse_mixed_date("20-May-87") == pd.Timestamp("1987-05-20")


def test_parse_mixed_date_new_format():
    assert _parse_mixed_date("Apr 22, 2020") == pd.Timestamp("2020-04-22")


def test_load_brent_prices_shape_and_columns():
    df = load_brent_prices()
    assert len(df) > 8000
    for col in ["Date", "Price", "log_price", "log_return"]:
        assert col in df.columns


def test_load_brent_prices_sorted_and_no_duplicates():
    df = load_brent_prices()
    assert df["Date"].is_monotonic_increasing
    assert df["Date"].duplicated().sum() == 0


def test_load_brent_prices_no_nan_price():
    df = load_brent_prices()
    assert df["Price"].isna().sum() == 0


def test_log_return_matches_manual_calc():
    df = load_brent_prices()
    manual = np.log(df["Price"].iloc[5]) - np.log(df["Price"].iloc[4])
    assert np.isclose(df["log_return"].iloc[5], manual)


def test_load_key_events_shape_and_dates():
    events = load_key_events()
    assert len(events) >= 10
    assert events["start_date"].dtype.kind == "M"  # datetime64
    assert events["start_date"].is_monotonic_increasing
