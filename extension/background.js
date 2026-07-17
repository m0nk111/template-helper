'use strict';

const CAPTURE_SCREENSHOT_MESSAGE_TYPE = 'template-helper:capture-screenshot';
const GET_TAB_STATE_MESSAGE_TYPE = 'template-helper:get-tab-state';
const SET_TAB_STATE_MESSAGE_TYPE = 'template-helper:set-tab-state';
const CRS_URL_PREFIX = 'https://crs.gw.dfnld.nl/';
const MAX_SCREENSHOT_DATA_URL_LENGTH = 20 * 1024 * 1024;
const TAB_STATE_STORAGE_PREFIX = 'template-helper:tab-state:';

function isValidDraftId(draftId) {
  return typeof draftId === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(draftId);
}

function createDraftId() {
  return crypto.randomUUID();
}

function getTabStateStorageKey(tabId) {
  return `${TAB_STATE_STORAGE_PREFIX}${tabId}`;
}

function isValidTabState(tabState) {
  return !!tabState && typeof tabState === 'object' &&
    isValidDraftId(tabState.draftId) && typeof tabState.isOpen === 'boolean';
}

async function getOrCreateTabState(tabId) {
  const storageKey = getTabStateStorageKey(tabId);
  const storedValues = await chrome.storage.session.get(storageKey);
  const storedState = storedValues[storageKey];
  if (isValidTabState(storedState)) return storedState;

  const tabState = { draftId: createDraftId(), isOpen: false };
  await chrome.storage.session.set({ [storageKey]: tabState });
  return tabState;
}

async function setTabOpenState(tabId, isOpen) {
  const storageKey = getTabStateStorageKey(tabId);
  const currentState = await getOrCreateTabState(tabId);
  await chrome.storage.session.set({
    [storageKey]: { ...currentState, isOpen }
  });
}

function isCrsUrl(url) {
  return typeof url === 'string' && url.startsWith(CRS_URL_PREFIX);
}

function isCaptureRequest(message) {
  return !!message && typeof message === 'object' && !Array.isArray(message) &&
    Object.keys(message).length === 1 && message.type === CAPTURE_SCREENSHOT_MESSAGE_TYPE;
}

function getCaptureErrorCode() {
  const errorMessage = chrome.runtime.lastError?.message || '';
  return /permission/i.test(errorMessage) ? 'capture-permission-denied' : 'capture-failed';
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === GET_TAB_STATE_MESSAGE_TYPE || message?.type === SET_TAB_STATE_MESSAGE_TYPE) {
    const tabId = sender.tab?.id;
    if (!Number.isInteger(tabId) || tabId < 0) {
      sendResponse({ ok: false, errorCode: 'invalid-tab-context' });
      return;
    }

    if (message.type === SET_TAB_STATE_MESSAGE_TYPE && typeof message.isOpen !== 'boolean') {
      sendResponse({ ok: false, errorCode: 'invalid-tab-state' });
      return;
    }

    const operation = message.type === GET_TAB_STATE_MESSAGE_TYPE
      ? getOrCreateTabState(tabId).then((tabState) => ({ ok: true, tabState }))
      : setTabOpenState(tabId, message.isOpen).then(() => ({ ok: true }));

    operation
      .then(sendResponse)
      .catch(() => sendResponse({ ok: false, errorCode: 'tab-state-unavailable' }));
    return true;
  }

  if (!isCaptureRequest(message)) return;

  const senderTab = sender.tab;
  if (!senderTab || !senderTab.active || !isCrsUrl(senderTab.url) || typeof senderTab.windowId !== 'number') {
    sendResponse({ ok: false, errorCode: 'invalid-capture-context' });
    return;
  }

  chrome.tabs.captureVisibleTab(senderTab.windowId, { format: 'png' }, (imageDataUrl) => {
    if (chrome.runtime.lastError || typeof imageDataUrl !== 'string' || imageDataUrl.length > MAX_SCREENSHOT_DATA_URL_LENGTH) {
      sendResponse({ ok: false, errorCode: getCaptureErrorCode() });
      return;
    }

    sendResponse({ ok: true, imageDataUrl });
  });

  return true;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (!Number.isInteger(tabId) || tabId < 0) return;
  chrome.storage.session.remove(getTabStateStorageKey(tabId)).catch(() => {});
});