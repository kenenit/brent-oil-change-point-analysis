# Scripts

Reusable, testable Python modules that back the notebooks and the dashboard backend.

| Script | Purpose |
|---|---|
| `data_loader.py` | Load and clean the raw Brent price CSV, compute log returns |
| `change_point_model.py` | Build and sample the PyMC change point model |
| `event_matcher.py` | Match detected change points to the researched events dataset |

These are imported by the notebooks (`from scripts.data_loader import ...`) and by the Flask backend in Task 3, so logic is written once and reused everywhere.
