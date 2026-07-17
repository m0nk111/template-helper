# Browser Tests

The browser tests use isolated headless Chrome profiles. They validate the
template DOM, preview and Teams export behavior, as well as automatic collapsed
panel loading, extension-owned per-tab state after CRS clears `sessionStorage`,
and same-customer draft recovery across full CRS reloads.

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