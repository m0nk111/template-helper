// Zoek uit of we in het CRS zijn
if (!window.location.href.toLowerCase().includes('crs')) {
    // Stop onmiddellijk met uitvoeren als de URL 'crs' niet bevat, scheelt processor/browser-rekenwerk
    console.debug('Delta Vraag en Antwoord Template Helper: Niet the CRS site, injectie gestopt.');
} else {
    function createVraagButton() {
        // Check of de knop al bestaat
        if (document.getElementById('moderator-vraag-btn')) return;

        // Check of dit de bekende CRS weergave is
        var targetArea = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
        if (!targetArea) return; 

        // Maak de knop aan
        var btn = document.createElement('button');
        btn.id = 'moderator-vraag-btn';
        btn.innerText = 'Vraag maken';
        btn.style.cssText = "background-color: #002B54; color: white; border: none; padding: 3px 8px; border-radius: 3px; font-weight: normal; cursor: pointer; margin-bottom: 8px; font-size: 12px;";

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // 1. Haal de gegevens uit het pagina
            var klnrEl = document.querySelector('.ut_DFI_EL_PARTY_ID');
            var klantnummer = klnrEl ? encodeURIComponent(klnrEl.innerText.trim()) : '';

            var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
            var klantvraag = notitieEl ? encodeURIComponent(notitieEl.value.trim()) : '';

            // 2. Haal de interne URL op van de ingebouwde template
            var url = chrome.runtime.getURL("template.html");

            // 3. Open de template in een nieuwe tab mét de data
            window.open(url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag, '_blank');
        });

        // Plaats de knop net boven het notitieveld
        targetArea.parentNode.insertBefore(btn, targetArea);
    }

    // Probeer de knop in te laden
    createVraagButton();

    // CRM's laden vaak dynamisch (SPA/React/Angular), observe de DOM
    var observer = new MutationObserver(createVraagButton);
    observer.observe(document.body, { childList: true, subtree: true });
}
