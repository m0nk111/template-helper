# Browser Tests

The browser tests use isolated headless Chrome profiles. They validate the
template DOM, preview and Teams export behavior, as well as automatic collapsed
panel loading, same-tab panel state across full CRS reloads, and draft recovery
inside CRS pages.

Requirements:

- Google Chrome, available as `google-chrome`
- Python 3 with `pytest` and `websocket-client`

Run the test from the repository root:

```sh
pytest -q test/test_screenshot_removal.py test/test_sidebar_vraag_trigger.py
```

Install missing Python dependencies with:

```sh
python3 -m pip install --user pytest websocket-client
```