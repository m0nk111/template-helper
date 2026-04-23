/**
 * INJECTION SCRIPT (CONTENT SCRIPT)
 * This script is injected directly into the DOM of the target page (e.g., CRS).
 * It listens to page elements and renders our custom UI components next to them.
 */

// 1. DOMAIN VALIDATION
// Verify we are actually operating on the CRS domain to save browser CPU cycles
if (!window.location.href.toLowerCase().includes('crs')) {
    // If we're on the wrong domain, halt execution to prevent throwing errors or wasting memory.
    console.debug('Delta Vraag en Antwoord Template Helper: Not the CRS domain, halting injection.');
} else {

    // Main function responsible for building and placing our custom action button
    function createVraagButton() {
        // Prevent duplicate injections: check if our button already exists on the page
        if (document.getElementById('moderator-vraag-btn')) return;

        // TARGET ACQUISITION: Find the specific text area where the CRM loads user input
        var targetArea = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
        // If the textarea hasn't loaded yet (or we're on the wrong page within CRS), abort
        if (!targetArea) return; 

        // 2. BUTTON CREATION
        // Create our custom "Create Question" (Vraag Maken) button dynamically
        var btn = document.createElement('button');
        btn.id = 'moderator-vraag-btn';
        btn.innerText = 'Vraag maken';
        // Inline CSS styling to match corporate identity layout
        btn.style.cssText = "background-color: #002B54; color: white; border: none; padding: 3px 8px; border-radius: 3px; font-weight: normal; cursor: pointer; margin-bottom: 8px; font-size: 12px;";

        // 3. BUTTON CLICK HANDLER (When the user clicks our injected button)
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // DATA EXTRACTION: Scrape the page DOM to find the customer ID and context question
            var klnrEl = document.querySelector('.ut_DFI_EL_PARTY_ID');
            var klantnummer = klnrEl ? encodeURIComponent(klnrEl.innerText.trim()) : '';

            var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
            var klantvraag = notitieEl ? encodeURIComponent(notitieEl.value.trim()) : '';

            // URL CONSTRUCTION: Bind the extracted data as URL parameters
            // chrome.runtime.getURL gets the exact internal chrome-extension:// path for our bundled HTML
            var url = chrome.runtime.getURL("template.html");
            var finalUrl = url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag;

            // 4. SIDEBAR RENDERING LOGIC
            var sidebarContainer = document.getElementById('delta-moderator-sidebar-container');
            if (sidebarContainer) {
                // If sidebar is already created, just update the iframe URL with new data
                document.getElementById('delta-moderator-sidebar-iframe').src = finalUrl;
                
                // Show the sidebar by translating it back to X: 0
                sidebarContainer.style.transform = 'translateX(0)';
                
                // Update the toggle button icon to point right (indicating "click to close")
                var toggleBtn = document.getElementById('delta-moderator-sidebar-toggle');
                if(toggleBtn) toggleBtn.innerHTML = "▶"; 
            } else {
                // FIRST TIME CREATION: Build the sidebar UI overlay
                sidebarContainer = document.createElement('div');
                sidebarContainer.id = 'delta-moderator-sidebar-container';
                // Attach the sidebar rigidly to the right side of the screen with a smooth sliding transition
                sidebarContainer.style.cssText = "position: fixed; top: 0; right: 0; width: 450px; height: 100vh; z-index: 2147483647; box-shadow: -5px 0 25px rgba(0,0,0,0.3); background-color: white; display: flex; flex-direction: column; transition: transform 0.3s ease-in-out; transform: translateX(0);";
                
                // --- TOGGLE TAB (Small sticky tab hanging explicitly outside the sidebar) ---
                var toggleBtn = document.createElement('div');
                toggleBtn.id = 'delta-moderator-sidebar-toggle';
                // Attach tab rigidly to the left border (outside) of the main sidebar container
                toggleBtn.style.cssText = "position: absolute; left: -36px; top: 50%; transform: translateY(-50%); width: 36px; height: 70px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px 0 0 8px; box-shadow: -3px 0 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
                toggleBtn.innerHTML = "▶"; // Default state is open 
                toggleBtn.title = "Verberg / Toon Vraag Template";
                
                // Toggle animation logic linked to the CSS transform property
                toggleBtn.onclick = function() {
                    // If currently opened (X = 0), slide it out of view (X = 450px width)
                    if (sidebarContainer.style.transform === 'translateX(0px)' || sidebarContainer.style.transform === 'translateX(0)') {
                        sidebarContainer.style.transform = 'translateX(450px)';
                        // Update arrow tab to point left (indicating "click to open")
                        toggleBtn.innerHTML = "◀"; 
                    } else {
                        // Else, bring it back into view
                        sidebarContainer.style.transform = 'translateX(0)';
                        toggleBtn.innerHTML = "▶"; 
                    }
                };
                sidebarContainer.appendChild(toggleBtn);
                // ----------------------------------------
                
                // HEADER SECTION (Title & Hard Close Button)
                var header = document.createElement('div');
                header.style.cssText = "display: flex; justify-content: space-between; align-items: center; background-color: #002B54; color: white; padding: 12px 15px; font-weight: bold; font-family: sans-serif;";
                header.innerText = "Delta Vraag Maken";
                
                var closeBtn = document.createElement('button');
                closeBtn.innerText = "✖ Sluiten";
                closeBtn.style.cssText = "background: rgba(255,255,255,0.2); border: none; color: white; font-size: 13px; cursor: pointer; padding: 4px 8px; border-radius: 4px;";
                // Add hover effects cleanly through event listeners instead of massive CSS strings
                closeBtn.addEventListener('mouseover', function() { closeBtn.style.background = 'rgba(255,255,255,0.4)'; });
                closeBtn.addEventListener('mouseout', function() { closeBtn.style.background = 'rgba(255,255,255,0.2)'; });
                // Clicking close behaves the exact same way as clicking the toggle tab (soft close)
                closeBtn.onclick = function() { 
                    sidebarContainer.style.transform = 'translateX(450px)';
                    toggleBtn.innerHTML = "◀"; 
                };
                header.appendChild(closeBtn);
                
                // 5. IFRAME MOUNTING
                // Create an isolated iframe to load our template.html file 
                // Using an iframe prevents the CRS page's global CSS/JS from interfering with our template
                var iframe = document.createElement('iframe');
                iframe.id = 'delta-moderator-sidebar-iframe';
                // Load the constructed URL (including payload parameters) into the iframe
                iframe.src = finalUrl;
                iframe.style.cssText = "flex-grow: 1; border: none; width: 100%; height: 100%; background: #f4f6f8;";
                
                // Assemble the DOM structure
                sidebarContainer.appendChild(header);
                sidebarContainer.appendChild(iframe);
                // Mount to main document
                document.body.appendChild(sidebarContainer);
            }
        });

        // 6. MOUNT INITIAL BUTTON
        // Inject the button directly above the 'targetArea' textarea
        targetArea.parentNode.insertBefore(btn, targetArea);
    }

    // Execute injection explicitly during script load
    createVraagButton();

    // 7. SINGLE PAGE APPLICATION (SPA) SUPPORT
    // Many modern corporate websites load data dynamically without refreshing the page (React, Angular).
    // A MutationObserver watches the DOM stream continuously for changes. 
    // If the page redraws or loads new data, this ensures our button gets re-injected automatically.
    var observer = new MutationObserver(createVraagButton);
    observer.observe(document.body, { childList: true, subtree: true });
}
