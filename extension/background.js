/**
 * BACKGROUND SERVICE WORKER
 * This script runs globally in the background of the browser.
 * It manages extension-level events rather than interacting directly with loaded web pages.
 */

chrome.action.onClicked.addListener((tab) => {
    // FALLBACK INJECTION MECHANISM
    // Normally, the extension automatically injects via 'content_scripts' in manifest.json.
    // However, if the automatic injection fails or is blocked (e.g., due to different corporate domains),
    // this acts as a manual override. When the user clicks the extension icon in the toolbar,
    // this utilizes 'activeTab' permissions to forcefully inject our helper code ('inject.js') 
    // into the currently focused browser tab.
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['inject.js']
    });
});
