# Task 1: Analysis Workflow, Assumptions & Limitations
**Birhan Energies — Brent Oil Change Point Analysis**

## 1. Analysis Workflow

**Step 1 — Data Ingestion & Cleaning**
Load `BrentOilPrices.csv` (9,011 daily observations, 20-May-1987 to 14-Nov-2022). The raw file mixes two date formats (`DD-Mon-YY` before 22-Apr-2020, `Mon DD, YYYY` after); the loader (`scripts/data_loader.py`) parses both, sorts chronologically, and drops duplicate dates.

**Step 2 — Event Research**
Compile a structured dataset of 15 major geopolitical, economic, and OPEC-policy events (`data/raw/key_events.csv`) spanning wars, financial crises, sanctions, and production decisions, each with a verified start date and short description.

**Step 3 — Exploratory Data Analysis**
- Plot the raw price series to visually identify trends, shocks, and regime shifts, overlaid with event markers.
- Compute log returns (`log(price_t) - log(price_{t-1})`) to obtain a series that is closer to stationary and suitable for volatility analysis.
- Compute rolling volatility (90-day rolling std of log returns) to visualize volatility clustering.
- Formally test stationarity (Augmented Dickey-Fuller) on both the raw price and log-return series.

**Step 4 — Bayesian Change Point Modeling (Task 2)**
- Build a PyMC model with a discrete uniform prior over `tau` (the switch point), two regime means (and later, two regime volatilities), and a `pm.math.switch` function connecting the regime to the likelihood.
- Sample the posterior via MCMC (`pm.sample`), check convergence (r_hat, trace plots), and extract the posterior distribution of `tau`.

**Step 5 — Event Association & Impact Quantification**
- Compare the posterior mode/HDI of each detected change point against the researched events dataset (nearest event within a reasonable window, e.g. ±30 days).
- Quantify the shift: report the before/after mean price (or return), the percentage change, and the posterior probability supporting the shift.

**Step 6 — Communication**
- Summarize findings for investors, policymakers, and energy companies via a written report and an interactive dashboard (Task 3).

## 2. Time Series Properties (Preliminary Findings)

- **Trend**: The raw price series is strongly non-stationary — it trends upward across multiple decades (e.g., mean price rose from ~$17/bbl in the late 1980s to ~$102/bbl in the early 2010s), punctuated by sharp regime shifts around 2008, 2014-16, and 2020.
- **Stationarity**: The raw price series fails stationarity by inspection (and will be formally confirmed with ADF in the notebook); log returns are much closer to a stationary, mean-reverting series with approximately zero mean, making them the more appropriate series for volatility-focused modeling, while the raw price (or log price) remains appropriate for the mean-shift change point model itself.
- **Volatility patterns**: Volatility (90-day rolling std of log returns) is highly clustered rather than constant — it is visibly elevated during the 2008 financial crisis, the 2014-16 price collapse, and is at its historical maximum during the March-April 2020 COVID/price-war period. This volatility clustering motivates considering a change point model on variance as a future extension, in addition to mean.

**Modeling implication**: Because the raw price is non-stationary and features multiple distinct regimes, a single global mean/variance model would be a poor fit. A change point model that allows the mean (and potentially variance) to shift at one or more unknown points in time is well-suited to this data, and log price (rather than raw price) will be used as the modeled series to keep the scale of price changes proportionate across very different price regimes ($10s vs $100s).

## 3. Purpose of Change Point Models

Change point models detect the point(s) in time at which the statistical properties of a series (mean, variance, or both) shift abruptly, rather than assuming a single stable data-generating process for the whole series. In the context of Brent oil prices, this lets us move beyond eyeballing a chart to making a probabilistic statement: "there is a high-probability structural break around date X, with the average price shifting from $A to $B." This provides a principled way to locate structural breaks and, subsequently, to investigate what was happening in the world around that date.

## 4. Expected Outputs and Limitations of Change Point Analysis

**Expected outputs:**
- A posterior distribution over the switch point `tau` (converted to a calendar date), summarizing our uncertainty about exactly when the break occurred.
- Posterior distributions for the "before" and "after" parameters (e.g., mean log price), enabling probabilistic statements like "there is a 95% probability the mean shifted by at least $X."
- For multiple change points (extension), a segmented view of the whole series into distinct regimes.

**Limitations:**
- A single change point model can only detect one shift; the real series likely contains many. Extending to multiple change points is discussed as future work.
- The model outputs a date range/distribution — not a mechanistic explanation. Confirming *why* the shift occurred still requires matching against external context (the events dataset) and human judgement.
- Detected change points may reflect a genuinely nearby event, an unrelated coincidence, or an aggregation of several overlapping developments; disambiguating these is not fully automatable.

## 5. Correlation vs. Causation — Assumptions and Limitations

**This is the central methodological caveat of the whole project and is treated with care throughout:**

- **What change point detection can show**: That the statistical properties of the price series changed at approximately a given date, and that a plausible, temporally-associated event exists nearby.
- **What it cannot show**: That the event *caused* the price change. Oil prices are driven by a dense, overlapping web of factors — supply, demand, inventories, currency movements, speculation, weather, and simultaneous unrelated news — many of which are not in our event list and are not modeled explicitly.
- **Confounding and coincidence**: Multiple candidate events sometimes cluster near the same date (e.g., the Global Financial Crisis and OPEC's emergency cuts both fall in September-December 2008); attributing a detected shift to one specific event over another is an interpretive judgement, not a statistical proof.
- **No counterfactual**: We do not observe what oil prices *would have been* absent the event, so we cannot rule out that the shift was already underway for other reasons.
- **Practical stance**: All "impact" statements in this analysis are phrased as *statistical association with a plausible causal hypothesis*, not as proven causal effects. Where multiple events cluster near a single detected change point, this is stated explicitly rather than picking one narrative.

**Other assumptions and limitations:**
- Prices are the Brent benchmark only; not all producer/consumer regions are equally exposed to Brent-specific dynamics (vs. WTI or regional grades).
- The event list, while researched from reputable sources, is not exhaustive — some genuine drivers of price shifts are omitted, and some listed events may have had limited actual price impact.
- The initial model assumes a single change point with a constant mean before/after; real-world dynamics are more complex (multiple regimes, trends within regimes, changing volatility) and are addressed as extensions in Task 2 and the "Advanced Extensions" discussion.
- No adjustment is made for inflation; all prices are nominal USD/barrel as reported in the source data.
