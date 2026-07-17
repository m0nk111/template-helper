"""Browser-level regression coverage for the persistent CRS sidebar trigger."""

from __future__ import annotations

import json
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
    PROCESS_STOP_TIMEOUT_SECONDS,
    TEMPLATE_URL,
    find_free_tcp_port,
    stop_chrome,
)


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
INJECT_SCRIPT = (REPOSITORY_ROOT / 'extension' / 'inject.js').read_text(
    encoding='utf-8'
)
SIDEBAR_FIXTURE = """<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8">
    <style>
      .main-sidebar { width: 36px; }
      .main-sidebar.is-expanded { width: 120px; }
      .sidebar-menu-item { list-style: none; }
      .nav-link { display: block; color: #fff; }
    </style>
  </head>
  <body>
    <aside class="main-sidebar" id="crs-sidebar">
      <nav class="sidebar">
        <div id="cssmenu">
          <ul class="sidebar-menu nav-list-bottom" id="crs-bottom-menu">
            <li class="sidebar-menu-item nav-item" title="Profiel">
              <a class="nav-link" href="javascript:void(0);" id="IWBUTTON_MT_INGELOGDE_MEDEWERKER">
                <span class="menu-title">Profiel</span>
              </a>
            </li>
            <li class="sidebar-menu-item nav-item" title="Instellingen">
              <a class="nav-link" href="javascript:void(0);">Instellingen</a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
    <span class="ut_DFI_EL_PARTY_ID">12345678</span>
    <textarea id="IWMEMO_SCRIPT_EIGENINPUT">Eerste notitie</textarea>
    <script>
      window.chrome = {
        runtime: {
          getURL: function() { return '__TEMPLATE_URL__'; },
          sendMessage: function(message, callback) {
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


def wait_for_sidebar_trigger(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        if page.evaluate("!!document.getElementById('moderator-vraag-menu-item')"):
            return
        time.sleep(0.1)

    raise AssertionError('The Vraag maken sidebar trigger was not injected in time.')


def wait_for_crs_fixture_dom(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        if page.evaluate(
            "document.readyState === 'complete' && !!document.getElementById('IWBUTTON_MT_INGELOGDE_MEDEWERKER')"
        ):
            return
        time.sleep(0.1)

    raise AssertionError('The CRS sidebar fixture did not finish loading in time.')


@pytest.fixture
def crs_page() -> Iterator[DevToolsPage]:
    debug_port = find_free_tcp_port()

    with tempfile.TemporaryDirectory(prefix='template-helper-crs-') as fixture_dir:
        fixture_path = Path(fixture_dir) / 'crs-sidebar-fixture.html'
        fixture_path.write_text(
            SIDEBAR_FIXTURE.replace('__TEMPLATE_URL__', TEMPLATE_URL),
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
            wait_for_sidebar_trigger(page)
            yield page
        finally:
            if page is not None:
                page.close()
            stop_chrome(chrome_process)


def test_sidebar_trigger_uses_question_mark_and_label_before_profile(
    crs_page: DevToolsPage,
) -> None:
    collapsed = crs_page.evaluate(
        """
        (() => {
          const item = document.getElementById('moderator-vraag-menu-item');
          const profile = document.getElementById('IWBUTTON_MT_INGELOGDE_MEDEWERKER').closest('li');
          const label = item.querySelector('.moderator-vraag-menu-label');
          return {
            beforeProfile: profile.previousElementSibling === item,
            itemTitle: item.title,
            icon: item.querySelector('.moderator-vraag-menu-icon').textContent,
            label: label.textContent,
            labelVisible: getComputedStyle(label).display !== 'none',
            legacyButtonPresent: !!document.getElementById('moderator-vraag-btn'),
          };
        })()
        """
    )

    assert collapsed == {
        'beforeProfile': True,
        'itemTitle': 'Vraag maken',
        'icon': '?',
        'label': 'Vraag maken',
        'labelVisible': False,
        'legacyButtonPresent': False,
    }

    expanded = crs_page.evaluate(
        """
        (() => new Promise((resolve) => {
          document.getElementById('crs-sidebar').classList.add('is-expanded');
          requestAnimationFrame(() => {
            const label = document.querySelector('.moderator-vraag-menu-label');
            resolve({ labelVisible: getComputedStyle(label).display !== 'none' });
          });
        }))()
        """
    )

    assert expanded == {'labelVisible': True}


def test_sidebar_trigger_survives_rerender_without_note_field(
    crs_page: DevToolsPage,
) -> None:
    result = crs_page.evaluate(
        """
        (() => new Promise((resolve) => {
          document.getElementById('IWMEMO_SCRIPT_EIGENINPUT').remove();
          const menu = document.getElementById('crs-bottom-menu');
          menu.innerHTML = `
            <li class="sidebar-menu-item nav-item" title="Profiel">
              <a class="nav-link" href="javascript:void(0);" id="IWBUTTON_MT_INGELOGDE_MEDEWERKER">
                <span class="menu-title">Profiel</span>
              </a>
            </li>`;

          requestAnimationFrame(() => {
            const item = document.getElementById('moderator-vraag-menu-item');
            const profile = document.getElementById('IWBUTTON_MT_INGELOGDE_MEDEWERKER').closest('li');
            resolve({
              triggerCount: document.querySelectorAll('#moderator-vraag-menu-item').length,
              beforeProfile: profile.previousElementSibling === item,
            });
          });
        }))()
        """
    )

    assert result == {
        'triggerCount': 1,
        'beforeProfile': True,
    }


def test_sidebar_trigger_reads_current_crs_context_at_click_time(
    crs_page: DevToolsPage,
) -> None:
    result = crs_page.evaluate(
        """
        (() => {
          document.querySelector('.ut_DFI_EL_PARTY_ID').textContent = '87654321';
          document.getElementById('IWMEMO_SCRIPT_EIGENINPUT').value = 'Bijgewerkte notitie';
          document.querySelector('#moderator-vraag-menu-item a').click();

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
        'customerNote': 'Bijgewerkte notitie',
    }