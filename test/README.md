# Browser Tests

The screenshot-removal test opens the local `extension/template.html` in an
isolated headless Chrome profile and validates the DOM, preview, and Teams export
behavior.

Requirements:

- Google Chrome, available as `google-chrome`
- Python 3 with `pytest` and `websocket-client`

Run the test from the repository root:

```sh
pytest -q test/test_screenshot_removal.py
```

Install missing Python dependencies with:

```sh
python3 -m pip install --user pytest websocket-client
```