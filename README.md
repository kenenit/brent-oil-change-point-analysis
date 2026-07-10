# Change Point Analysis and Statistical Modeling of Brent Oil Prices

**Birhan Energies — 10 Academy Week 10 Challenge**

Analyzing how major geopolitical and economic events relate to structural changes in Brent crude oil prices (1987–2022), using Bayesian change point detection, and surfacing the results through an interactive dashboard.

## Project Status

- [x] Repository & environment setup
- [ ] Task 1: Foundation — workflow, event research, EDA plan
- [ ] Task 2: Bayesian change point modeling (PyMC)
- [ ] Task 3: Interactive dashboard (Flask + React)

## Repository Structure

```
├── .vscode/                 # Editor settings
├── .github/workflows/       # CI (pytest on push/PR)
├── data/
│   ├── raw/                 # Original BrentOilPrices.csv, events.csv
│   └── processed/           # Cleaned / feature-engineered data
├── notebooks/                # Analysis notebooks (EDA, modeling)
├── scripts/                  # Reusable Python modules
├── src/                      # Package source (shared logic)
├── tests/                    # Unit tests
├── reports/                  # Written report, figures
├── dashboard/                 # Task 3: Flask backend + React frontend
├── requirements.txt
└── README.md
```

## Setup

```bash
git clone <repo-url>
cd brent-oil-change-point-analysis
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Data

Place the raw dataset at `data/raw/BrentOilPrices.csv` with columns:
- `Date` — format `day-month-year` (e.g., `20-May-87`)
- `Price` — USD per barrel

Coverage: 20 May 1987 – 30 Sep 2022.

## How to Run

```bash
# Launch analysis notebooks
jupyter notebook notebooks/

# Run tests
pytest tests/ -v
```

Dashboard run instructions are documented in `dashboard/README.md` (added in Task 3).

## Team

Tutors: Kerod, Feven, Mahbubah — Slack: `#all-week10`

## License

Educational project for 10 Academy — Week 10 Challenge.
