"""Browser-level coverage for rich-text tables and screenshots."""

from __future__ import annotations

import json

from test_screenshot_removal import SCREENSHOT_DATA_URL, DevToolsPage, template_page


RICH_TEXT_FIELD_IDS = (
    'klantvraag',
    'vastloper',
    'uitkomst',
    'antwoord',
    'bron',
    'vervolgstap',
    'tccNotitie',
    'tccScreenshots',
    'tccNogControleren',
    'tccAanvullen',
)

SAFE_TABLE_HTML = (
    '<table style="border-collapse: collapse; border-spacing: 8px; table-layout: fixed; background-color: #f4f6f8">'
    '<colgroup><col span="1" style="width: 52px; color: #005a9e"></colgroup>'
    '<thead><tr><th style="border: 1px solid #606060; padding: 4px">Vraag</th>'
    '<th style="border: 1px solid #606060; padding: 4px">Antwoord</th></tr></thead>'
    '<tbody><tr><td rowspan="2" style="text-align: left">Internet</td>'
    '<td style="color: #005a9e; background-color: #ffbf47; border: 1px solid #606060; padding: 4px; text-decoration: underline #005a9e">Geen signaal</td></tr>'
    '<tr><td colspan="1">Controleer verbinding</td></tr></tbody></table>'
)

WIDE_TABLE_HTML = (
    '<table style="width: 1200px; border-collapse: collapse"><thead><tr>'
    + ''.join(
        f'<th style="border: 1px solid #606060; padding: 4px">Kolom {column}</th>'
        for column in range(1, 13)
    )
    + '</tr></thead><tbody><tr>'
    + ''.join(
        f'<td style="border: 1px solid #606060; padding: 4px">Waarde {column}</td>'
        for column in range(1, 13)
    )
    + '</tr></tbody></table>'
)


def test_all_rich_text_fields_preserve_table_layout_and_strip_pasted_colors(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          const fieldIds = {json.dumps(RICH_TEXT_FIELD_IDS)};
          const tableHtml = {json.dumps(SAFE_TABLE_HTML)};
          const fieldModes = {{
            klantvraag: ['va', 'vraag'],
            vastloper: ['va', 'vraag'],
            uitkomst: ['va', 'vraag'],
            antwoord: ['va', 'antwoord'],
            bron: ['va', 'antwoord'],
            vervolgstap: ['va', 'antwoord'],
            tccNotitie: ['tcc', 'vraag'],
            tccScreenshots: ['tcc', 'vraag'],
            tccNogControleren: ['tcc', 'antwoord'],
            tccAanvullen: ['tcc', 'antwoord'],
          }};
          const results = {{}};

          for (const fieldId of fieldIds) {{
            const [domain, template] = fieldModes[fieldId];
            setDomainMode(domain, false);
            setTemplateMode(template, false);
            const field = document.getElementById(fieldId);
            field.innerHTML = '';
            field.focus();
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(field);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            const clipboardData = new DataTransfer();
            clipboardData.setData('text/html',
              tableHtml + '<script>window.__pasteXss = true;</script>' +
              '<a href="javascript:alert(1)" onclick="window.__pasteXss = true">Unsafe</a>' +
              '<a href="https://example.test/review">External review</a>' +
              '<span style="color: #005a9e; background-color: #ffbf47">Tekst zonder opmaak</span>' +
              '<strong>Vet zonder opmaak</strong><em>Cursief zonder opmaak</em>' +
              '<img src="https://example.test/unsafe.png" onerror="window.__pasteXss = true">'
            );
            clipboardData.setData('text/plain', 'Internet Geen signaal Controleer verbinding');
            field.dispatchEvent(new ClipboardEvent('paste', {{
              bubbles: true,
              cancelable: true,
              clipboardData,
            }}));

            const table = field.querySelector('table');
            const firstCell = field.querySelector('td');
            const coloredCell = firstCell?.nextElementSibling;
            const sanitized = sanitizeDraftHTML(
              tableHtml + '<span style="color: #005a9e; background-color: #ffbf47">Tekst zonder opmaak</span>'
            );
            const sanitizedTemplate = document.createElement('template');
            sanitizedTemplate.innerHTML = sanitized;
            const sanitizedCell = sanitizedTemplate.content.querySelector('td:nth-child(2)');
            const sanitizedCol = sanitizedTemplate.content.querySelector('col');
            results[fieldId] = {{
              tableCount: field.querySelectorAll('table').length,
              headerCount: field.querySelectorAll('th').length,
              cellCount: field.querySelectorAll('td').length,
              rowSpan: firstCell?.getAttribute('rowspan') || '',
              hasCollapsedBorders: table ? getComputedStyle(table).borderCollapse === 'collapse' : false,
              hasFixedLayout: table?.style.tableLayout === 'fixed',
              hasColWidth: sanitizedCol?.style.width === '52px',
              hasTableBackground: table?.style.backgroundColor !== '',
              hasCellColor: coloredCell?.style.color !== '',
              hasCellBackground: coloredCell?.style.backgroundColor !== '',
              hasCellBorder: coloredCell?.style.borderTopStyle === 'solid' && coloredCell?.style.borderTopWidth === '1px',
              hasPastedColor: field.innerHTML.includes('#005a9e') || field.innerHTML.includes('#ffbf47'),
              hasPastedInlineFormatting: /<(?:strong|em)\b/i.test(field.innerHTML),
              hasSanitizedCellBorder: sanitizedCell?.style.borderStyle === 'solid' && sanitizedCell?.style.borderWidth === '1px',
              hasSanitizedCellPadding: sanitizedCell?.style.padding === '4px',
              hasSanitizedColor: /color/.test(sanitizedCell?.getAttribute('style') || '') || /color/.test(sanitizedCol?.getAttribute('style') || ''),
              hasSanitizedTextDecoration: sanitizedCell?.style.textDecoration !== '',
              hasSanitizedTextStyle: sanitized.includes('<span style='),
              scripts: field.querySelectorAll('script').length,
              activeLinks: field.querySelectorAll('a[href]').length,
              externalImages: field.querySelectorAll('img[src^="https:"]').length,
              eventAttributes: [...field.querySelectorAll('*')].some((node) =>
                [...node.attributes].some((attribute) => attribute.name.startsWith('on'))
              ),
            }};
          }}

          return results;
        }})()
        """
    )

    for field_id, field_result in result.items():
        assert field_result == {
            'tableCount': 1,
            'headerCount': 2,
            'cellCount': 3,
            'rowSpan': '2',
            'hasCollapsedBorders': True,
            'hasFixedLayout': True,
            'hasColWidth': True,
            'hasTableBackground': False,
            'hasCellColor': False,
            'hasCellBackground': False,
            'hasCellBorder': True,
            'hasPastedColor': False,
            'hasPastedInlineFormatting': False,
            'hasSanitizedCellBorder': True,
            'hasSanitizedCellPadding': True,
            'hasSanitizedColor': False,
            'hasSanitizedTextDecoration': False,
            'hasSanitizedTextStyle': False,
            'scripts': 0,
            'activeLinks': 0,
            'externalImages': 0,
            'eventAttributes': False,
        }, field_id


def test_wide_preview_table_scrolls_without_overflowing_the_preview_or_export(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('va', false);
          setTemplateMode('antwoord', false);
          const field = document.getElementById('antwoord');
          field.innerHTML = {json.dumps(WIDE_TABLE_HTML)};

          const exported = buildMessageHTML();
          updatePreview();

          const preview = document.getElementById('preview');
          const tableContainer = preview.querySelector('.preview-table-container');
          const table = tableContainer?.querySelector('table');

          return {{
            preview: {{
              tableContainers: preview.querySelectorAll('.preview-table-container').length,
              overflowX: tableContainer ? getComputedStyle(tableContainer).overflowX : '',
              isScrollable: tableContainer
                ? tableContainer.scrollWidth > tableContainer.clientWidth
                : false,
              previewOverflows: preview.scrollWidth > preview.clientWidth,
              pageOverflows: document.documentElement.scrollWidth > document.documentElement.clientWidth,
              tableWidth: table ? Math.round(table.getBoundingClientRect().width) : 0,
              containerWidth: tableContainer?.clientWidth || 0,
            }},
            export: {{
              hasTable: exported.includes('<table'),
              headerCount: (exported.match(/<th(?:\\s|>)/g) || []).length,
              hasPreviewWrapper: exported.includes('preview-table-container'),
            }},
          }};
        }})()
        """
    )

    assert result['preview']['tableContainers'] == 1
    assert result['preview']['overflowX'] == 'auto'
    assert result['preview']['isScrollable'] is True
    assert result['preview']['previewOverflows'] is False
    assert result['preview']['pageOverflows'] is False
    assert result['preview']['tableWidth'] > result['preview']['containerWidth']
    assert result['export'] == {
        'hasTable': True,
        'headerCount': 12,
        'hasPreviewWrapper': False,
    }


def test_all_rich_text_fields_have_screenshot_buttons_and_clean_separators(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          const fieldIds = {json.dumps(RICH_TEXT_FIELD_IDS)};
          const dataUrl = {json.dumps(SCREENSHOT_DATA_URL)};
          const results = {{}};

          for (const fieldId of fieldIds) {{
            const field = document.getElementById(fieldId);
            const button = field.closest('.form-group')
              ?.querySelector(`[data-screenshot-target="${{fieldId}}"]`);
            field.innerHTML = 'Voorafgaande inhoud<br>';
            const appended = appendScreenshotToField(fieldId, dataUrl);
            const afterAppend = {{
              screenshotCount: field.querySelectorAll('.screenshot-item').length,
              brCount: field.querySelectorAll('br').length,
              firstNode: field.firstChild?.nodeName || '',
              lastNode: field.lastChild?.nodeName || '',
            }};
            field.querySelector('.screenshot-remove')?.click();

            results[fieldId] = {{
              hasButton: button?.classList.contains('btn-capture-screenshot') || false,
              appended,
              afterAppend,
              afterRemove: {{
                html: field.innerHTML,
                brCount: field.querySelectorAll('br').length,
                screenshotCount: field.querySelectorAll('.screenshot-item').length,
              }},
            }};
          }}

          return {{
            targetFields: screenshotTargetFields,
            results,
          }};
        }})()
        """
    )

    assert set(result['targetFields']) == set(RICH_TEXT_FIELD_IDS)
    assert len(result['targetFields']) == len(RICH_TEXT_FIELD_IDS)

    for field_id, field_result in result['results'].items():
        assert field_result == {
            'hasButton': True,
            'appended': True,
            'afterAppend': {
                'screenshotCount': 1,
                'brCount': 1,
                'firstNode': '#text',
                'lastNode': 'SPAN',
            },
            'afterRemove': {
                'html': 'Voorafgaande inhoud<br>',
                'brCount': 1,
                'screenshotCount': 0,
            },
        }, field_id


def test_screenshot_separators_remain_single_and_exported_tables_keep_layout(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('va', false);
          setTemplateMode('antwoord', false);
          const field = document.getElementById('antwoord');
          const dataUrl = {json.dumps(SCREENSHOT_DATA_URL)};
          field.innerHTML = {json.dumps(SAFE_TABLE_HTML)};
          appendScreenshotToField('antwoord', dataUrl);
          appendScreenshotToField('antwoord', dataUrl);

          const exported = buildMessageHTML();
          document.querySelectorAll('#antwoord .screenshot-remove')[0].click();

          return {{
            afterFirstRemoval: {{
              screenshotCount: field.querySelectorAll('.screenshot-item').length,
              brCount: field.querySelectorAll('br').length,
              firstNode: field.firstChild?.nodeName || '',
              lastNode: field.lastChild?.nodeName || '',
            }},
            exported: {{
              tableCount: (exported.match(/<table/g) || []).length,
              hasBackground: exported.includes('background-color: rgb(244, 246, 248);'),
              hasCellColor: exported.includes('color: rgb(0, 90, 158);'),
              hasCellBorder: exported.includes('border-style: solid;') && exported.includes('border-width: 1px;'),
              hasScreenshot: exported.includes(dataUrl),
              hasScreenshotControl: exported.includes('screenshot-remove'),
              hasSeparatorMetadata: exported.includes('data-screenshot-separator'),
            }},
          }};
        }})()
        """
    )

    assert result['afterFirstRemoval'] == {
        'screenshotCount': 1,
        'brCount': 1,
        'firstNode': 'TABLE',
        'lastNode': 'SPAN',
    }
    assert result['exported'] == {
        'tableCount': 1,
        'hasBackground': False,
        'hasCellColor': False,
        'hasCellBorder': True,
        'hasScreenshot': True,
        'hasScreenshotControl': False,
        'hasSeparatorMetadata': False,
    }


def test_pasted_screenshot_controls_are_bound_for_removal(
    template_page: DevToolsPage,
) -> None:
    result = template_page.evaluate(
        f"""
        (() => {{
          setDomainMode('va', false);
          setTemplateMode('antwoord', false);
          const field = document.getElementById('antwoord');
          field.innerHTML = '';
          field.focus();
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(field);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);

          const clipboardData = new DataTransfer();
          clipboardData.setData('text/html',
            '<span class="screenshot-item" contenteditable="false" onclick="window.__pasteXss = true">' +
            '<img src="{SCREENSHOT_DATA_URL}" alt="Screenshot">' +
            '<button class="screenshot-remove" type="button" onmouseover="window.__pasteXss = true">×</button>' +
            '</span>'
          );
          clipboardData.setData('text/plain', 'Screenshot');
          field.dispatchEvent(new ClipboardEvent('paste', {{
            bubbles: true,
            cancelable: true,
            clipboardData,
          }}));

          const removeButton = field.querySelector('.screenshot-remove');
          const beforeRemoval = field.querySelectorAll('.screenshot-item').length;
          const eventAttributesBeforeRemoval = [...field.querySelectorAll('*')].some((node) =>
            [...node.attributes].some((attribute) => attribute.name.startsWith('on'))
          );
          removeButton?.click();

          return {{
            removeButtons: field.querySelectorAll('.screenshot-remove').length,
            beforeRemoval,
            afterRemoval: field.querySelectorAll('.screenshot-item').length,
            eventAttributesBeforeRemoval,
          }};
        }})()
        """
    )

    assert result == {
        'removeButtons': 0,
        'beforeRemoval': 1,
        'afterRemoval': 0,
        'eventAttributesBeforeRemoval': False,
    }