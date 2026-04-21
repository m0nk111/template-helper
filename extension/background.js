chrome.action.onClicked.addListener((tab) => {
    // Injecteer de scraper in de actieve (huidige) tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "open_popup") {
        // Maak een robuust en gefocust venster, liefst sticky/on-top (als het OS dit toelaat)
        chrome.windows.create({
            url: request.url,
            type: "popup",
            width: request.width || 450,
            height: request.height || 800,
            left: request.left || 0,
            top: request.top || 0,
            focused: true
        }, (win) => {
            // Probeer hem achteraf hard 'alwaysOnTop' in te stellen
            if (win) {
                chrome.windows.update(win.id, { alwaysOnTop: true }, () => {
                    if(chrome.runtime.lastError) {
                        console.log("AlwaysOnTop gracefully fallback op OS beheer.");
                    }
                });
            }
            sendResponse({status: "ok"});
        });
        return true; // Asynchrone response aanzetten
    }
});