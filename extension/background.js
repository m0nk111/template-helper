chrome.action.onClicked.addListener((tab) => {
    // Injecteer de scraper in de actieve (huidige) tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_popup") {
        // Maak een robuust en gefocust venster
        chrome.windows.create({
            url: request.url,
            type: "popup",
            width: request.width || 450,
            height: request.height || 800,
            left: request.left || 0,
            top: request.top || 0,
            focused: true
        }, (win) => {
            sendResponse({status: "ok"});
        });
        return true; // Asynchrone response aanzetten
    }
});
