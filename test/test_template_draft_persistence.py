"""Browser-level coverage for tab-bound template draft persistence."""

from __future__ import annotations

import json
import os
import signal
import subprocess
import tempfile
import time
from collections.abc import Iterator
from pathlib import Path
from urllib.parse import urlencode

import pytest

from test_screenshot_removal import (
    CHROME_STARTUP_TIMEOUT_SECONDS,
    DEBUG_HOST,
    DevToolsPage,
    PROCESS_STOP_TIMEOUT_SECONDS,
    TEMPLATE_URL,
    find_free_tcp_port,
    wait_for_page_websocket_url,
    wait_for_template_script,
)


DRAFT_ID = 'draft-test-tab-1234'
CUSTOMER_NUMBER = '12345678'
SCREENSHOT_DATA_URL = (
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'
    'AAAADUlEQVR42mP8z8BQDwAFgwJ/lCwzqAAAAABJRU5ErkJggg=='
)


def build_template_url(customer_number: str, note: str = '') -> str:
    query = urlencode(
        {
            'draftId': DRAFT_ID,
            'klantnummer': customer_number,
            'klantvraag': note,
        }
    )
    return f'{TEMPLATE_URL}?{query}'


def wait_for_draft_ready(page: DevToolsPage) -> None:
    deadline = time.monotonic() + CHROME_STARTUP_TIMEOUT_SECONDS

    while time.monotonic() < deadline:
        if page.evaluate("typeof window.templateHelperDraftReady !== 'undefined'"):
            page.evaluate('window.templateHelperDraftReady')
            return
        time.sleep(0.1)

    raise AssertionError('Template draft persistence did not initialize in time.')


def stop_chrome_process_group(process: subprocess.Popen[bytes]) -> None:
    if process.poll() is not None:
        return

    try:
        os.killpg(process.pid, signal.SIGTERM)
    except ProcessLookupError:
        return

    try:
        process.wait(timeout=PROCESS_STOP_TIMEOUT_SECONDS)
    except subprocess.TimeoutExpired:
        os.killpg(process.pid, signal.SIGKILL)
        process.wait(timeout=PROCESS_STOP_TIMEOUT_SECONDS)


def navigate_template(page: DevToolsPage, url: str) -> None:
    page.evaluate('flushDraftSave()')
    page.evaluate(f'window.location.href = {json.dumps(url)}')
    wait_for_template_script(page)
    wait_for_draft_ready(page)


@pytest.fixture
def draft_page() -> Iterator[DevToolsPage]:
    debug_port = find_free_tcp_port()
    template_url = build_template_url(CUSTOMER_NUMBER, 'CRS startnotitie')

    with tempfile.TemporaryDirectory(prefix='template-helper-draft-chrome-') as profile_dir:
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
                template_url,
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        page: DevToolsPage | None = None

        try:
            page = DevToolsPage(wait_for_page_websocket_url(debug_port))
            wait_for_template_script(page)
            wait_for_draft_ready(page)
            yield page
        finally:
            if page is not None:
                page.close()
            stop_chrome_process_group(chrome_process)


def test_same_customer_restores_fields_and_screenshots_after_reload(
    draft_page: DevToolsPage,
) -> None:
    stored = draft_page.evaluate(
        f"""
        (async () => {{
          await window.templateHelperDraftReady;
          setDomainMode('va', false);
          setTemplateMode('vraag', false);

          const setField = (id, value) => {{
            const field = document.getElementById(id);
            if (field.tagName === 'DIV') field.innerHTML = value;
            else if (field.type === 'checkbox') field.checked = value;
            else field.value = value;
            field.dispatchEvent(new Event(field.type === 'checkbox' ? 'change' : 'input', {{ bubbles: true }}));
          }};

          setField('wachtrij', 'Internet en Vaste Telefonie');
          setField('klantnummer', '{CUSTOMER_NUMBER}');
          setField('klantvraag', 'De klantvraag blijft staan.');
          setField('vastloper', 'Hier liep ik vast.');
          setField('uitkomst', 'Dit is de gewenste uitkomst.');
          setField('antwoord', 'Het inhoudelijke antwoord blijft staan.');
          setField('bron', 'Broninformatie blijft staan.');
          setField('vervolgstap', 'De vervolgstap blijft staan.');
          setField('tccKlantnummer', '{CUSTOMER_NUMBER}');
          setField('tccNotitie', 'Lokale TCC-notitie blijft staan.');
          setField('tccNogControleren', 'TCC-controle blijft staan.');
          setField('tccAanvullen', 'TCC-aanvulling blijft staan.');
          setField('tccAkkoord', true);
          appendScreenshotToField('klantvraag', '{SCREENSHOT_DATA_URL}');
                    await flushDraftSave();

                    const questionClone = document.getElementById('klantvraag').cloneNode(true);
                    questionClone.querySelectorAll('.screenshot-remove').forEach((button) => button.remove());

          return {{
            draftId: new URLSearchParams(window.location.search).get('draftId'),
            customerNumber: document.getElementById('klantnummer').value,
                        question: questionClone.innerText,
            screenshotCount: document.querySelectorAll('#klantvraag .screenshot-item').length,
          }};
        }})()
        """
    )

    assert stored == {
        'draftId': DRAFT_ID,
        'customerNumber': CUSTOMER_NUMBER,
        'question': 'De klantvraag blijft staan.',
        'screenshotCount': 1,
    }

    navigate_template(draft_page, build_template_url(CUSTOMER_NUMBER, 'Nieuwe CRS-notitie'))

    restored = draft_page.evaluate(
        """
                (() => {
                    const questionClone = document.getElementById('klantvraag').cloneNode(true);
                    questionClone.querySelectorAll('.screenshot-remove').forEach((button) => button.remove());

                    return {
          queue: document.getElementById('wachtrij').value,
          customerNumber: document.getElementById('klantnummer').value,
                    question: questionClone.innerText,
          stuck: document.getElementById('vastloper').innerText,
          outcome: document.getElementById('uitkomst').innerText,
          answer: document.getElementById('antwoord').innerText,
          source: document.getElementById('bron').innerText,
          nextStep: document.getElementById('vervolgstap').innerText,
          tccCustomerNumber: document.getElementById('tccKlantnummer').value,
          tccNote: document.getElementById('tccNotitie').innerText,
          tccCheck: document.getElementById('tccNogControleren').innerText,
          tccAddition: document.getElementById('tccAanvullen').innerText,
          tccApproved: document.getElementById('tccAkkoord').checked,
          screenshotCount: document.querySelectorAll('#klantvraag .screenshot-item').length,
          removeButtons: document.querySelectorAll('#klantvraag .screenshot-remove').length,
          exportedImage: buildMessageHTML().includes('data:image/png;base64,'),
                    };
                })()
        """
    )

    assert restored == {
        'queue': 'Internet en Vaste Telefonie',
        'customerNumber': CUSTOMER_NUMBER,
        'question': 'De klantvraag blijft staan.',
        'stuck': 'Hier liep ik vast.',
        'outcome': 'Dit is de gewenste uitkomst.',
        'answer': 'Het inhoudelijke antwoord blijft staan.',
        'source': 'Broninformatie blijft staan.',
        'nextStep': 'De vervolgstap blijft staan.',
        'tccCustomerNumber': CUSTOMER_NUMBER,
        'tccNote': 'Lokale TCC-notitie blijft staan.',
        'tccCheck': 'TCC-controle blijft staan.',
        'tccAddition': 'TCC-aanvulling blijft staan.',
        'tccApproved': True,
        'screenshotCount': 1,
        'removeButtons': 1,
        'exportedImage': True,
    }

    removed = draft_page.evaluate(
        """
        (() => {
          document.querySelector('#klantvraag .screenshot-remove').click();
          return document.querySelectorAll('#klantvraag .screenshot-item').length;
        })()
        """
    )
    assert removed == 0


def test_different_customer_number_clears_previous_draft(
    draft_page: DevToolsPage,
) -> None:
    draft_page.evaluate(
        """
        (async () => {
          await window.templateHelperDraftReady;
          const field = document.getElementById('vastloper');
          field.innerText = 'Alleen voor de vorige klant.';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          await flushDraftSave();
        })()
        """
    )

    navigate_template(draft_page, build_template_url('87654321', 'Nieuwe klantnotitie'))

    result = draft_page.evaluate(
        """
        ({
          customerNumber: document.getElementById('klantnummer').value,
          question: document.getElementById('klantvraag').innerText,
          stuck: document.getElementById('vastloper').innerText,
          screenshotCount: document.querySelectorAll('.screenshot-item').length,
        })
        """
    )

    assert result == {
        'customerNumber': '87654321',
        'question': 'Nieuwe klantnotitie',
        'stuck': '',
        'screenshotCount': 0,
    }


def test_customer_draft_survives_temporary_empty_context_navigation(
    draft_page: DevToolsPage,
) -> None:
    draft_page.evaluate(
        """
        (async () => {
          await window.templateHelperDraftReady;
          const field = document.getElementById('vastloper');
          field.innerText = 'Blijf bewaard voor dezelfde klant.';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          await flushDraftSave();
        })()
        """
    )

    navigate_template(draft_page, build_template_url('', 'Tijdelijke CRS-pagina'))

    temporary_context = draft_page.evaluate(
        """
        (async () => {
          await flushDraftSave();
          return {
            customerNumber: document.getElementById('klantnummer').value,
            question: document.getElementById('klantvraag').innerText,
            stuck: document.getElementById('vastloper').innerText,
          };
        })()
        """
    )
    assert temporary_context == {
        'customerNumber': '',
        'question': 'Tijdelijke CRS-pagina',
        'stuck': '',
    }

    navigate_template(draft_page, build_template_url(CUSTOMER_NUMBER, 'Terug bij klant'))

    assert draft_page.evaluate(
        "document.getElementById('vastloper').innerText"
    ) == 'Blijf bewaard voor dezelfde klant.'


def test_clear_form_during_temporary_empty_context_deletes_customer_draft(
    draft_page: DevToolsPage,
) -> None:
    draft_page.evaluate(
        """
        (async () => {
          await window.templateHelperDraftReady;
          const field = document.getElementById('vastloper');
          field.innerText = 'Deze draft moet expliciet worden gewist.';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          await flushDraftSave();
        })()
        """
    )

    navigate_template(draft_page, build_template_url('', 'Tijdelijke CRS-pagina'))

    draft_page.evaluate(
        """
        (async () => {
          document.getElementById('btn-clear').click();
          await flushDraftSave();
        })()
        """
    )

    navigate_template(draft_page, build_template_url(CUSTOMER_NUMBER, 'Terug bij klant'))

    assert draft_page.evaluate(
        "document.getElementById('vastloper').innerText"
    ) == ''


def test_empty_customer_context_does_not_replace_customer_draft_and_number_transition_clears_it(
    draft_page: DevToolsPage,
) -> None:
    draft_page.evaluate(
        """
        (async () => {
          await window.templateHelperDraftReady;
          const field = document.getElementById('vastloper');
          field.innerText = 'Alleen voor klant 12345678.';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          await flushDraftSave();
        })()
        """
    )

    navigate_template(draft_page, build_template_url('', 'Notitie zonder klantnummer'))

    cleared = draft_page.evaluate(
        """
        ({
          customerNumber: document.getElementById('klantnummer').value,
          question: document.getElementById('klantvraag').innerText,
          stuck: document.getElementById('vastloper').innerText,
        })
        """
    )
    assert cleared == {
        'customerNumber': '',
        'question': 'Notitie zonder klantnummer',
        'stuck': '',
    }

    draft_page.evaluate('flushDraftSave()')
    navigate_template(draft_page, build_template_url('', 'Nieuwe notitie zonder klantnummer'))

    next_empty_context = draft_page.evaluate(
        "document.getElementById('klantvraag').innerText"
    )
    assert next_empty_context == 'Nieuwe notitie zonder klantnummer'

    navigate_template(draft_page, build_template_url('87654321', 'Nieuwe klant'))

    new_customer = draft_page.evaluate(
        """
        ({
          customerNumber: document.getElementById('klantnummer').value,
          question: document.getElementById('klantvraag').innerText,
          stuck: document.getElementById('vastloper').innerText,
        })
        """
    )
    assert new_customer == {
        'customerNumber': '87654321',
        'question': 'Nieuwe klant',
        'stuck': '',
    }


def test_tcc_local_note_still_uses_existing_conflict_flow(
    draft_page: DevToolsPage,
) -> None:
    result = draft_page.evaluate(
        """
        (async () => {
          await window.templateHelperDraftReady;
          setDomainMode('tcc', false);
          setTemplateMode('vraag', false);

          const note = document.getElementById('tccNotitie');
          note.innerText = 'Lokale notitie';
          note.dispatchEvent(new Event('input', { bubbles: true }));
          handleCrsNoteUpdate('Nieuwe CRS-notitie');

          return {
            note: note.innerText,
            dialogVisible: !document.getElementById('crsNoteConflictDialog').hidden,
          };
        })()
        """
    )

    assert result == {
        'note': 'Lokale notitie',
        'dialogVisible': True,
    }


def test_restored_html_is_sanitized_without_removing_valid_screenshots(
    draft_page: DevToolsPage,
) -> None:
    unsafe_html = (
        f'<script>window.__draftXss = true;</script>'
        '<span class="screenshot-item" contenteditable="false" onclick="window.__draftXss = true">'
        f'<img src="{SCREENSHOT_DATA_URL}" onerror="window.__draftXss = true">'
        '<button class="screenshot-remove" type="button" onmouseover="window.__draftXss = true">×</button>'
        '</span>'
        '<b>Veilige tekst</b>'
    )
    result = draft_page.evaluate(
        f"""
        (() => {{
          const holder = document.createElement('div');
          holder.innerHTML = sanitizeDraftHTML({json.dumps(unsafe_html)});
          return {{
            scripts: holder.querySelectorAll('script').length,
            images: holder.querySelectorAll('img').length,
            onerror: holder.querySelector('img')?.hasAttribute('onerror') || false,
                        eventAttributes: [...holder.querySelectorAll('*')].some((node) =>
                            [...node.attributes].some((attribute) => attribute.name.startsWith('on'))
                        ),
                        removeButtons: holder.querySelectorAll('.screenshot-remove').length,
            text: holder.innerText,
          }};
        }})()
        """
    )

    assert result == {
        'scripts': 0,
        'images': 1,
        'onerror': False,
        'eventAttributes': False,
        'removeButtons': 1,
        'text': '×Veilige tekst',
    }
