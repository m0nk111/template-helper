chrome.action.onClicked.addListener((tab) => {
    // Injecteer de scraper in de actieve (huidige) tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});