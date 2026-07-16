'use strict';

const CAPTURE_SCREENSHOT_MESSAGE_TYPE = 'template-helper:capture-screenshot';
const CRS_URL_PREFIX = 'https://crs.gw.dfnld.nl/';
const MAX_SCREENSHOT_DATA_URL_LENGTH = 20 * 1024 * 1024;

function isCrsUrl(url) {
  return typeof url === 'string' && url.startsWith(CRS_URL_PREFIX);
}

function isCaptureRequest(message) {
  return !!message && typeof message === 'object' && !Array.isArray(message) &&
    Object.keys(message).length === 1 && message.type === CAPTURE_SCREENSHOT_MESSAGE_TYPE;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!isCaptureRequest(message)) return;

  const senderTab = sender.tab;
  if (!senderTab || !senderTab.active || !isCrsUrl(senderTab.url) || typeof senderTab.windowId !== 'number') {
    sendResponse({ ok: false, errorCode: 'invalid-capture-context' });
    return;
  }

  chrome.tabs.captureVisibleTab(senderTab.windowId, { format: 'png' }, (imageDataUrl) => {
    if (chrome.runtime.lastError || typeof imageDataUrl !== 'string' || imageDataUrl.length > MAX_SCREENSHOT_DATA_URL_LENGTH) {
      sendResponse({ ok: false, errorCode: 'capture-failed' });
      return;
    }

    sendResponse({ ok: true, imageDataUrl });
  });

  return true;
});