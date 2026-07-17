"""Contract tests for extension-owned per-tab state in the service worker."""

from __future__ import annotations

import subprocess
from pathlib import Path


REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
BACKGROUND_SCRIPT = REPOSITORY_ROOT / 'extension' / 'background.js'

NODE_TAB_STATE_TEST = r"""
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const storedValues = {};
let messageListener;
let tabRemovedListener;

global.chrome = {
  runtime: {
    onMessage: {
      addListener(listener) {
        messageListener = listener;
      },
    },
  },
  storage: {
    session: {
      async get(key) {
        return { [key]: storedValues[key] };
      },
      async set(values) {
        Object.assign(storedValues, values);
      },
      async remove(key) {
        delete storedValues[key];
      },
    },
  },
  tabs: {
    captureVisibleTab() {
      throw new Error('Screenshot capture is outside this test.');
    },
    onRemoved: {
      addListener(listener) {
        tabRemovedListener = listener;
      },
    },
  },
};

const backgroundPath = process.argv[1];
vm.runInThisContext(fs.readFileSync(backgroundPath, 'utf8'), {
  filename: backgroundPath,
});

function sendMessage(message, tabId) {
  return new Promise((resolve, reject) => {
    const keepsChannelOpen = messageListener(
      message,
      {
        tab: {
          id: tabId,
          active: true,
          url: 'https://crs.gw.dfnld.nl/',
          windowId: 1,
        },
      },
      resolve,
    );
    if (keepsChannelOpen !== true) {
      reject(new Error('The asynchronous response channel was not kept open.'));
    }
  });
}

(async () => {
  const firstState = await sendMessage(
    { type: 'template-helper:get-tab-state' },
    41,
  );
  assert.strictEqual(firstState.ok, true);
  assert.strictEqual(firstState.tabState.isOpen, false);
  assert.match(firstState.tabState.draftId, /^[A-Za-z0-9_-]{8,128}$/);

  await sendMessage(
    { type: 'template-helper:set-tab-state', isOpen: true },
    41,
  );
  const restoredState = await sendMessage(
    { type: 'template-helper:get-tab-state' },
    41,
  );
  assert.deepStrictEqual(restoredState.tabState, {
    draftId: firstState.tabState.draftId,
    isOpen: true,
  });

  const otherTabState = await sendMessage(
    { type: 'template-helper:get-tab-state' },
    42,
  );
  assert.notStrictEqual(
    otherTabState.tabState.draftId,
    firstState.tabState.draftId,
  );
  assert.strictEqual(otherTabState.tabState.isOpen, false);

  tabRemovedListener(41);
  await Promise.resolve();
  const replacementState = await sendMessage(
    { type: 'template-helper:get-tab-state' },
    41,
  );
  assert.notStrictEqual(
    replacementState.tabState.draftId,
    firstState.tabState.draftId,
  );
})();
"""


def test_background_preserves_and_isolates_extension_tab_state() -> None:
    result = subprocess.run(
        ['node', '-e', NODE_TAB_STATE_TEST, str(BACKGROUND_SCRIPT)],
        check=False,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr