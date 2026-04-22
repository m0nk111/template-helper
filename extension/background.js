chrome.action.onClicked.addListener((tab) => {
    // Mocht het automatische script niet afgaan door een ander bedrijfsdomein, 
    // injecteer met 1 klik geforceerd de blauwe knop/zijbalk via 'activeTab' rechten
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['inject.js']
    });
});
