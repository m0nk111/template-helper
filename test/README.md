# Browser Tests

The browser tests use isolated headless Chrome profiles. They validate the
template DOM, preview and Teams export behavior, as well as automatic collapsed
panel loading, extension-owned per-tab state after CRS clears `sessionStorage`,
Scripting/Ticket/Actions customer-code aliases, and customer-isolated draft recovery
across repeated CRS context switches.

Requirements:

- Google Chrome, available as `google-chrome`
- Python 3 with `pytest` and `websocket-client`

Run all tests from the repository root:

```sh
pytest -q
```

Install missing Python dependencies with:

```sh
python3 -m pip install --user pytest websocket-client
```