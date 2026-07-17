"""Browser-level regression coverage for the automatic CRS template panel."""

from __future__ import annotations

import json
import re
import subprocess
import tempfile
import time
from collections.abc import Iterator
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

import pytest

from test_screenshot_removal import (
    CHROME_STARTUP_TIMEOUT_SECONDS,
    DEBUG_HOST,
    DevToolsPage,
    TEMPLATE_URL,
    find_free_tcp_port,
    stop_chrome,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
INJECT_SCRIPT = (REPOSITORY_ROOT / 'extension' / 'inject.js').read_text(
    encoding='utf-8'
)
CRS_FIXTURE = """<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
  </head>
  <body>
    <main id="crs-fixture-ready"></main>
    <span class="ut_DFI_EL_PARTY_ID">12345678</span>
    <textarea id="IWMEMO_SCRIPT_EIGENINPUT">Eerste notitie</textarea>
    <script>
            const extensionTabStateKey = 'test-template-helper-tab-state';
      window.chrome = {
        runtime: {
          getURL: function() { return '__TEMPLATE_URL__'; },
          sendMessage: function(message, callback) {
                        if (message.type === 'template-helper:get-tab-state') {
                            const storedState = localStorage.getItem(extensionTabStateKey);
                            const tabState = storedState
                                ? JSON.parse(storedState)
                                : { draftId: crypto.randomUUID(), isOpen: false };
                            localStorage.setItem(extensionTabStateKey, JSON.stringify(tabState));
                            callback({ ok: true, tabState });
                            return;
                        }
                        if (message.type === 'template-helper:set-tab-state') {
                            const tabState = JSON.parse(localStorage.getItem(extensionTabStateKey));
                            tabState.isOpen = message.isOpen;
                            localStorage.setItem(extensionTabStateKey, JSON.stringify(tabState));
                            callback({ ok: true });
                            return;
                        }
            callback({ ok: true, imageDataUrl: 'data:image/png;base64,AA==' });
          }
        }
      };
    </script>
  </body>
</html>
"""


def wait_for_crs_page_websocket_url(debug_port: int, page_url: str) -> str:
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
            if target.get('type') == 'page' and target.get('url', '').startswith(page_url):
                return str(target['webSocketDebuggerUrl'])

        time.sleep(0.1)

    raise AssertionError('Chrome did not open the CRS sidebar fixture in time.')


def wait_for_template_panel(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        panel_exists = page.evaluate(
            "!!document.getElementById('moderator-template-sidebar-container')"
        )
        if panel_exists:
            return
        time.sleep(0.1)

    raise AssertionError('The template panel was not initialized in time.')


def wait_for_iframe_customer(page: DevToolsPage, customer_number: str) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        current_customer = page.evaluate(
            "new URL(document.getElementById('moderator-template-sidebar-iframe').src).searchParams.get('klantnummer')"
        )
        if current_customer == customer_number:
            return
        time.sleep(0.1)

    raise AssertionError('The template panel did not refresh its CRS context in time.')


def wait_for_crs_fixture_dom(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        fixture_is_ready = page.evaluate(
            "document.readyState === 'complete' && !!document.getElementById('crs-fixture-ready')"
        )
        if fixture_is_ready:
            return
        time.sleep(0.1)

    raise AssertionError('The CRS fixture did not finish loading in time.')


def reload_crs_page(page: DevToolsPage) -> None:
    previous_time_origin = page.evaluate('performance.timeOrigin')
    page.evaluate('window.location.reload(); true')
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        try:
            reload_state = page.evaluate(
                """
                ({
                  timeOrigin: performance.timeOrigin,
                  isReady: document.readyState === 'complete'
                    && !!document.getElementById('crs-fixture-ready'),
                })
                """
            )
        except AssertionError as error:
            if 'Inspected target navigated or closed' not in str(error):
                raise
            time.sleep(0.1)
            continue

        if (
            reload_state['timeOrigin'] != previous_time_origin
            and reload_state['isReady']
        ):
            return
        time.sleep(0.1)

    raise AssertionError('The CRS fixture did not reload in time.')


@pytest.fixture
def crs_page() -> Iterator[DevToolsPage]:
    debug_port = find_free_tcp_port()

    with tempfile.TemporaryDirectory(prefix='template-helper-crs-') as fixture_dir:
        fixture_path = Path(fixture_dir) / 'crs-panel-fixture.html'
        fixture_path.write_text(
            CRS_FIXTURE.replace('__TEMPLATE_URL__', TEMPLATE_URL),
            encoding='utf-8',
        )
        fixture_url = fixture_path.as_uri()

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
                f'--user-data-dir={fixture_dir}/profile',
                fixture_url,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        page: DevToolsPage | None = None

        try:
            page = DevToolsPage(wait_for_crs_page_websocket_url(debug_port, fixture_url))
            wait_for_crs_fixture_dom(page)
            page.evaluate(INJECT_SCRIPT)
            wait_for_template_panel(page)
            yield page
        finally:
            if page is not None:
                page.close()
            stop_chrome(chrome_process)


def test_template_panel_loads_collapsed_without_a_crs_trigger(
    crs_page: DevToolsPage,
) -> None:
    result = crs_page.evaluate(
        """
        (() => {
          const container = document.getElementById('moderator-template-sidebar-container');
          const toggle = document.getElementById('moderator-template-sidebar-toggle');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          const params = new URL(iframe.src).searchParams;
          return {
            panelCount: document.querySelectorAll('#moderator-template-sidebar-container').length,
            isOpen: container.dataset.open,
            transform: container.style.transform,
            toggleVisible: getComputedStyle(toggle).display !== 'none',
            toggleTagName: toggle.tagName,
            toggleExpanded: toggle.getAttribute('aria-expanded'),
            toggleLabel: toggle.getAttribute('aria-label'),
            customerNumber: params.get('klantnummer'),
            customerNote: params.get('klantvraag'),
            menuTriggerPresent: !!document.getElementById('moderator-vraag-menu-item'),
            legacyButtonPresent: !!document.getElementById('moderator-vraag-btn'),
          };
        })()
        """
    )

    assert result == {
        'panelCount': 1,
        'isOpen': 'false',
        'transform': 'translateX(100%)',
        'toggleVisible': True,
        'toggleTagName': 'BUTTON',
        'toggleExpanded': 'false',
        'toggleLabel': 'Vraag Template uitklappen',
        'customerNumber': '12345678',
        'customerNote': 'Eerste notitie',
        'menuTriggerPresent': False,
        'legacyButtonPresent': False,
    }


def test_blue_toggle_expands_existing_template_panel(
    crs_page: DevToolsPage,
) -> None:
    result = crs_page.evaluate(
        """
        (() => {
          const container = document.getElementById('moderator-template-sidebar-container');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          const iframeSrc = iframe.src;
          document.getElementById('moderator-template-sidebar-toggle').click();
          return {
            isOpen: container.dataset.open,
            transform: container.style.transform,
            toggleExpanded: document.getElementById('moderator-template-sidebar-toggle').getAttribute('aria-expanded'),
            toggleLabel: document.getElementById('moderator-template-sidebar-toggle').getAttribute('aria-label'),
            sameIframe: iframe === document.getElementById('moderator-template-sidebar-iframe'),
            sameIframeSrc: iframeSrc === iframe.src,
          };
        })()
        """
    )

    assert result == {
        'isOpen': 'true',
        'transform': 'translate(0px, 0px)',
        'toggleExpanded': 'true',
        'toggleLabel': 'Vraag Template inklappen',
        'sameIframe': True,
        'sameIframeSrc': True,
    }


def test_panel_state_and_draft_id_survive_crs_session_storage_clear(
    crs_page: DevToolsPage,
) -> None:
    before_reload = crs_page.evaluate(
        """
        (() => {
          document.getElementById('moderator-template-sidebar-toggle').click();
          const container = document.getElementById('moderator-template-sidebar-container');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          return {
            isOpen: container.dataset.open,
            draftId: new URL(iframe.src).searchParams.get('draftId'),
          };
        })()
        """
    )
    assert before_reload['isOpen'] == 'true'
    assert isinstance(before_reload['draftId'], str)
    assert re.fullmatch(r'[A-Za-z0-9_-]{8,128}', before_reload['draftId'])

    crs_page.evaluate('sessionStorage.clear()')
    reload_crs_page(crs_page)
    crs_page.evaluate(INJECT_SCRIPT)
    wait_for_template_panel(crs_page)

    after_reload = crs_page.evaluate(
        """
        (() => {
          const container = document.getElementById('moderator-template-sidebar-container');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          return {
            isOpen: container.dataset.open,
            transform: container.style.transform,
            draftId: new URL(iframe.src).searchParams.get('draftId'),
          };
        })()
        """
    )

    assert after_reload == {
        'isOpen': 'true',
        'transform': 'translate(0px, 0px)',
        'draftId': before_reload['draftId'],
    }

    crs_page.evaluate(
        "document.getElementById('moderator-template-sidebar-toggle').click()"
    )
    crs_page.evaluate('sessionStorage.clear()')
    reload_crs_page(crs_page)
    crs_page.evaluate(INJECT_SCRIPT)
    wait_for_template_panel(crs_page)

    after_closed_reload = crs_page.evaluate(
        """
        (() => {
          const container = document.getElementById('moderator-template-sidebar-container');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          return {
            isOpen: container.dataset.open,
                        transform: container.style.transform,
            draftId: new URL(iframe.src).searchParams.get('draftId'),
          };
        })()
        """
    )
    assert after_closed_reload == {
        'isOpen': 'false',
        'transform': 'translateX(100%)',
        'draftId': before_reload['draftId'],
    }


def test_template_panel_reinitializes_after_crs_body_replacement(
    crs_page: DevToolsPage,
) -> None:
    initial_draft_id = crs_page.evaluate(
        """
        new URL(
          document.getElementById('moderator-template-sidebar-iframe').src
        ).searchParams.get('draftId')
        """
    )
    crs_page.evaluate(
        "document.body.replaceChildren(document.createElement('main'))"
    )
    wait_for_template_panel(crs_page)
    result = crs_page.evaluate(
        """
        (() => {
          const container = document.getElementById('moderator-template-sidebar-container');
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          return {
            panelCount: document.querySelectorAll('#moderator-template-sidebar-container').length,
            isOpen: container.dataset.open,
            draftId: new URL(iframe.src).searchParams.get('draftId'),
            menuTriggerPresent: !!document.getElementById('moderator-vraag-menu-item'),
          };
        })()
        """
    )

    assert result == {
        'panelCount': 1,
        'isOpen': 'false',
        'draftId': initial_draft_id,
        'menuTriggerPresent': False,
    }


def test_template_panel_refreshes_changed_customer_context_automatically(
    crs_page: DevToolsPage,
) -> None:
    crs_page.evaluate(
        """
        (() => {
          document.querySelector('.ut_DFI_EL_PARTY_ID').textContent = '87654321';
          document.getElementById('IWMEMO_SCRIPT_EIGENINPUT').value = 'Nieuwe klantnotitie';
        })()
        """
    )
    wait_for_iframe_customer(crs_page, '87654321')

    result = crs_page.evaluate(
        """
        (() => {
          const iframe = document.getElementById('moderator-template-sidebar-iframe');
          const params = new URL(iframe.src).searchParams;
          return {
            customerNumber: params.get('klantnummer'),
            customerNote: params.get('klantvraag'),
          };
        })()
        """
    )

    assert result == {
        'customerNumber': '87654321',
        'customerNote': 'Nieuwe klantnotitie',
    }