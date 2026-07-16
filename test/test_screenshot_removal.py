"""Browser-level coverage for removable screenshots in the template UI."""

from __future__ import annotations

import json
import socket
import subprocess
import tempfile
import time
from collections.abc import Iterator
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import urlopen

import pytest
import websocket


DEBUG_HOST = '127.0.0.1'
CHROME_STARTUP_TIMEOUT_SECONDS = 10
PROCESS_STOP_TIMEOUT_SECONDS = 5
REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_URL = (REPOSITORY_ROOT / 'extension' / 'template.html').as_uri()
SCREENSHOT_DATA_URL = (
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'
    'AAAADUlEQVR42mP8z8BQDwAFgwJ/lCwzqAAAAABJRU5ErkJggg=='
)


class DevToolsPage:
    """Minimal Chrome DevTools Protocol client for page JavaScript evaluation."""

    def __init__(self, websocket_url: str) -> None:
        self.connection = websocket.create_connection(
            websocket_url,
            origin='http://localhost',
            timeout=CHROME_STARTUP_TIMEOUT_SECONDS,
        )
        self.next_request_id = 1

    def close(self) -> None:
        self.connection.close()

    def evaluate(self, expression: str) -> Any:
        request_id = self.next_request_id
        self.next_request_id += 1
        self.connection.send(
            json.dumps(
                {
                    'id': request_id,
                    'method': 'Runtime.evaluate',
                    'params': {
                        'expression': expression,
                        'awaitPromise': True,
                        'returnByValue': True,
                    },
                }
            )
        )

        while True:
            response = json.loads(self.connection.recv())
            if response.get('id') != request_id:
                continue

            if 'error' in response:
                raise AssertionError(f"DevTools evaluation failed: {response['error']}")

            result = response['result']
            if 'exceptionDetails' in result:
                raise AssertionError(
                    f"Page JavaScript raised an exception: {result['exceptionDetails']}"
                )

            return result['result'].get('value')


def find_free_tcp_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.bind((DEBUG_HOST, 0))
        return int(server.getsockname()[1])


def wait_for_page_websocket_url(debug_port: int) -> str:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS
    endpoint = f'http://{DEBUG_HOST}:{debug_port}/json/list'

    while time.monotonic() < deadline:
        try:
            with urlopen(endpoint, timeout=1) as response:  # noqa: S310
                targets = json.load(response)
        except (OSError, URLError, json.JSONDecodeError):
            time.sleep(0.1)
            continue

        for target in targets:
            if target.get('type') == 'page' and target.get('url', '').startswith(TEMPLATE_URL):
                return str(target['webSocketDebuggerUrl'])

        time.sleep(0.1)

    raise AssertionError('Chrome did not open extension/template.html in time.')


def wait_for_template_script(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        if page.evaluate("typeof appendScreenshotToField === 'function'"):
            return
        time.sleep(0.1)

    raise AssertionError('Template script did not initialize in time.')


def stop_chrome(process: subprocess.Popen[bytes]) -> None:
    if process.poll() is not None:
        return

    process.terminate()
    try:
        process.wait(timeout=PROCESS_STOP_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait(timeout=PROCESS_STOP_TIMEOUT_SECONDS)


@pytest.fixture
def template_page() -> Iterator[DevToolsPage]:
    debug_port = find_free_tcp_port()

    with tempfile.TemporaryDirectory(prefix='template-helper-chrome-') as profile_dir:
        chrome_process = subprocess.Popen(
            [
                'google-chrome',
                '--headless=new',
                '--disable-gpu',
                '--no-default-browser-check',
                '--no-first-run',
                '--remote-allow-origins=*',
                f'--remote-debugging-address={DEBUG_HOST}',
                f'--remote-debugging-port={debug_port}',
                f'--user-data-dir={profile_dir}',
                TEMPLATE_URL,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        page: DevToolsPage | None = None

        try:
            page = DevToolsPage(wait_for_page_websocket_url(debug_port))
            wait_for_template_script(page)
            yield page
        finally:
            if page is not None:
                page.close()
            stop_chrome(chrome_process)


def test_screenshot_can_be_removed_without_leaking_controls_into_export(
    template_page: DevToolsPage,
) -> None:
    inserted = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('tcc', false);
          setTemplateMode('vraag', false);

          const dataUrl = '{SCREENSHOT_DATA_URL}';
          const appended = appendScreenshotToField('tccScreenshots', dataUrl);
          const field = document.getElementById('tccScreenshots');
          const exported = buildMessageHTML();

          return {{
            appended,
            screenshotItems: field.querySelectorAll('.screenshot-item').length,
            images: field.querySelectorAll('img').length,
            removeButtons: field.querySelectorAll('.screenshot-remove').length,
            previewImages: document.querySelectorAll('#preview img').length,
            exportedImage: exported.includes(dataUrl),
            exportedWrapper: exported.includes('screenshot-item'),
            exportedRemoveButton: exported.includes('screenshot-remove'),
          }};
        }})()
        """
    )

    assert inserted == {
        'appended': True,
        'screenshotItems': 1,
        'images': 1,
        'removeButtons': 1,
        'previewImages': 1,
        'exportedImage': True,
        'exportedWrapper': False,
        'exportedRemoveButton': False,
    }

    removed = template_page.evaluate(
        """
        (() => {
          document.querySelector('#tccScreenshots .screenshot-remove').click();
          const field = document.getElementById('tccScreenshots');

          return {
            screenshotItems: field.querySelectorAll('.screenshot-item').length,
            images: field.querySelectorAll('img').length,
            previewImages: document.querySelectorAll('#preview img').length,
          };
        })()
        """
    )

    assert removed == {
        'screenshotItems': 0,
        'images': 0,
        'previewImages': 0,
    }


def test_removing_later_screenshot_does_not_accumulate_line_breaks(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('tcc', false);
          setTemplateMode('vraag', false);

          const dataUrl = '{SCREENSHOT_DATA_URL}';
          appendScreenshotToField('tccScreenshots', dataUrl);
          appendScreenshotToField('tccScreenshots', dataUrl);
          document.querySelectorAll('#tccScreenshots .screenshot-remove')[1].click();
          appendScreenshotToField('tccScreenshots', dataUrl);

          const field = document.getElementById('tccScreenshots');
          return {{
            screenshotItems: field.querySelectorAll('.screenshot-item').length,
            images: field.querySelectorAll('img').length,
            lineBreaks: field.querySelectorAll('br').length,
          }};
        }})()
        """
    )

    assert result == {
        'screenshotItems': 2,
        'images': 2,
        'lineBreaks': 1,
    }


def test_removing_first_screenshot_does_not_accumulate_line_breaks(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('tcc', false);
          setTemplateMode('vraag', false);

          const dataUrl = '{SCREENSHOT_DATA_URL}';
          appendScreenshotToField('tccScreenshots', dataUrl);
          appendScreenshotToField('tccScreenshots', dataUrl);
          document.querySelectorAll('#tccScreenshots .screenshot-remove')[0].click();
          appendScreenshotToField('tccScreenshots', dataUrl);

          const field = document.getElementById('tccScreenshots');
          return {{
            screenshotItems: field.querySelectorAll('.screenshot-item').length,
            images: field.querySelectorAll('img').length,
            lineBreaks: field.querySelectorAll('br').length,
          }};
        }})()
        """
    )

    assert result == {
        'screenshotItems': 2,
        'images': 2,
        'lineBreaks': 1,
    }


def test_removing_middle_screenshot_does_not_accumulate_line_breaks(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('tcc', false);
          setTemplateMode('vraag', false);

          const dataUrl = '{SCREENSHOT_DATA_URL}';
          appendScreenshotToField('tccScreenshots', dataUrl);
          appendScreenshotToField('tccScreenshots', dataUrl);
          appendScreenshotToField('tccScreenshots', dataUrl);
          document.querySelectorAll('#tccScreenshots .screenshot-remove')[1].click();
          appendScreenshotToField('tccScreenshots', dataUrl);

          const field = document.getElementById('tccScreenshots');
          return {{
            screenshotItems: field.querySelectorAll('.screenshot-item').length,
            images: field.querySelectorAll('img').length,
            lineBreaks: field.querySelectorAll('br').length,
          }};
        }})()
        """
    )

    assert result == {
        'screenshotItems': 3,
        'images': 3,
        'lineBreaks': 2,
    }