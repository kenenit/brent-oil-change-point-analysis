"""
data_loader.py

Utilities for loading and cleaning the Brent oil price dataset and the
researched key-events dataset.

The raw BrentOilPrices.csv file has a known quirk: the Date column uses two
different formats across its history:
  - 'DD-Mon-YY'   e.g. '20-May-87'   (20 May 1987 through 21 Apr 2020)
  - 'Mon DD, YYYY' e.g. 'Apr 22, 2020' (22 Apr 2020 through 30 Sep 2022 /
    14 Nov 2022 depending on the file version)

load_brent_prices() handles both formats transparently.
"""
from pathlib import Path
import pandas as pd
import numpy as np

DEFAULT_PRICE_PATH = Path(__file__).resolve().parents[1] / "data" / "raw" / "BrentOilPrices.csv"
DEFAULT_EVENTS_PATH = Path(__file__).resolve().parents[1] / "data" / "raw" / "key_events.csv"


def _parse_mixed_date(date_str: str) -> pd.Timestamp:
    """Parse a date string that may be in 'DD-Mon-YY' or 'Mon DD, YYYY' format."""
    date_str = date_str.strip()
    for fmt in ("%d-%b-%y", "%b %d, %Y"):
        try:
            return pd.to_datetime(date_str, format=fmt)
        except ValueError:
            continue
    # Last resort: let pandas infer (slower, but a safety net)
    return pd.to_datetime(date_str, errors="coerce")


def load_brent_prices(path: str | Path = DEFAULT_PRICE_PATH) -> pd.DataFrame:
    """
    Load and clean the raw Brent oil price CSV.

    Returns a DataFrame sorted by date with columns:
        Date (datetime64), Price (float), log_price (float), log_return (float)
    """
    df = pd.read_csv(path)
    df.columns = [c.strip() for c in df.columns]

    df["Date"] = df["Date"].apply(_parse_mixed_date)

    n_before = len(df)
    df = df.dropna(subset=["Date", "Price"])
    n_after = len(df)
    if n_after < n_before:
        print(f"Warning: dropped {n_before - n_after} rows with unparseable dates/prices")

    df = df.sort_values("Date").drop_duplicates(subset="Date").reset_index(drop=True)

    df["log_price"] = np.log(df["Price"])
    df["log_return"] = df["log_price"].diff()

    return df


def load_key_events(path: str | Path = DEFAULT_EVENTS_PATH) -> pd.DataFrame:
    """Load the researched key-events dataset with parsed date columns."""
    events = pd.read_csv(path)
    events["start_date"] = pd.to_datetime(events["start_date"])
    events["end_date"] = pd.to_datetime(events["end_date"])
    return events.sort_values("start_date").reset_index(drop=True)


if __name__ == "__main__":
    prices = load_brent_prices()
    print(f"Loaded {len(prices)} price rows: {prices['Date'].min().date()} to {prices['Date'].max().date()}")
    print(prices.head())
    print(prices.tail())

    events = load_key_events()
    print(f"\nLoaded {len(events)} key events")
    print(events[["event_id", "event_name", "start_date"]])
