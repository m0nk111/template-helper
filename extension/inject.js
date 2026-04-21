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
            var finalUrl = url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag;

            // 3. Injecteer de template direct in de crs-pagina als een sidebar aan de rechterkant
            var sidebarContainer = document.getElementById('delta-moderator-sidebar-container');
            if (sidebarContainer) {
                // Update iframe met nieuwe data
                document.getElementById('delta-moderator-sidebar-iframe').src = finalUrl;
                // Sidebar openklappen (naar binnen schuiven)
                sidebarContainer.style.transform = 'translateX(0)';
                var toggleBtn = document.getElementById('delta-moderator-sidebar-toggle');
                if(toggleBtn) toggleBtn.innerHTML = "▶"; // Pijltje wijst naar rechts (inklappen)
            } else {
                // Maak de zijbalk aan
                sidebarContainer = document.createElement('div');
                sidebarContainer.id = 'delta-moderator-sidebar-container';
                // Vastzetten aan de rechterkant, met een smooth transform (slide) animatie
                sidebarContainer.style.cssText = "position: fixed; top: 0; right: 0; width: 450px; height: 100vh; z-index: 2147483647; box-shadow: -5px 0 25px rgba(0,0,0,0.3); background-color: white; display: flex; flex-direction: column; transition: transform 0.3s ease-in-out; transform: translateX(0);";
                
                // --- Het inklapbare "uitsteekseltje" ---
                var toggleBtn = document.createElement('div');
                toggleBtn.id = 'delta-moderator-sidebar-toggle';
                // Maak de knop vast aan de linkerkant (maar búiten) de sidebar Container
                toggleBtn.style.cssText = "position: absolute; left: -36px; top: 50%; transform: translateY(-50%); width: 36px; height: 70px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px 0 0 8px; box-shadow: -3px 0 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
                toggleBtn.innerHTML = "▶"; // Omdat hij default open is
                toggleBtn.title = "Verberg / Toon Vraag Template";
                
                // Toggle animatie logic op het uitsteekseltje
                toggleBtn.onclick = function() {
                    // Check huidige staat op basis van transform string
                    if (sidebarContainer.style.transform === 'translateX(0px)' || sidebarContainer.style.transform === 'translateX(0)') {
                        sidebarContainer.style.transform = 'translateX(450px)'; // Klap in (verberg de breedte)
                        toggleBtn.innerHTML = "◀"; // Pijltje naar links (openklappen)
                    } else {
                        sidebarContainer.style.transform = 'translateX(0)'; // Klap uit (zichtbaar maken)
                        toggleBtn.innerHTML = "▶"; // Pijltje wijst naar rechts (klaar om weer in te klappen)
                    }
                };
                sidebarContainer.appendChild(toggleBtn);
                // ----------------------------------------
                
                // Titelbalkje met header. CloseBtn is nu optioneel eigenlijk, maar handig als hard-close/hide
                var header = document.createElement('div');
                header.style.cssText = "display: flex; justify-content: space-between; align-items: center; background-color: #002B54; color: white; padding: 12px 15px; font-weight: bold; font-family: sans-serif;";
                header.innerText = "Delta Vraag Maken";
                
                var closeBtn = document.createElement('button');
                closeBtn.innerText = "✖ Sluiten";
                closeBtn.style.cssText = "background: rgba(255,255,255,0.2); border: none; color: white; font-size: 13px; cursor: pointer; padding: 4px 8px; border-radius: 4px;";
                closeBtn.addEventListener('mouseover', function() { closeBtn.style.background = 'rgba(255,255,255,0.4)'; });
                closeBtn.addEventListener('mouseout', function() { closeBtn.style.background = 'rgba(255,255,255,0.2)'; });
                closeBtn.onclick = function() { 
                    // Bij Sluiten klappen we hem in en past de toggle netjes mee aan (lijkt op collapse behaviour)
                    sidebarContainer.style.transform = 'translateX(450px)';
                    toggleBtn.innerHTML = "◀"; 
                };
                
                header.appendChild(closeBtn);
                
                // Het iframe laadt de Chrome web accessible template in
                var iframe = document.createElement('iframe');
                iframe.id = 'delta-moderator-sidebar-iframe';
                iframe.src = finalUrl;
                iframe.style.cssText = "flex-grow: 1; border: none; width: 100%; height: 100%; background: #f4f6f8;";
                
                sidebarContainer.appendChild(header);
                sidebarContainer.appendChild(iframe);
                document.body.appendChild(sidebarContainer);
            }
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
