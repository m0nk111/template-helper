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

    var SIDEBAR_DOCK_MODE_KEY = 'delta-template-helper-dock-mode';

    function getSavedDockMode() {
        try {
            return localStorage.getItem(SIDEBAR_DOCK_MODE_KEY) || 'right';
        } catch (storageError) {
            console.debug('Delta Vraag en Antwoord Template Helper: Dock mode could not be read.', storageError);
            return 'right';
        }
    }

    function saveDockMode(dockMode) {
        try {
            localStorage.setItem(SIDEBAR_DOCK_MODE_KEY, dockMode);
        } catch (storageError) {
            console.debug('Delta Vraag en Antwoord Template Helper: Dock mode could not be saved.', storageError);
        }
    }

    function getClosedTransform(dockMode) {
        if (dockMode === 'left') return 'translateX(-100%)';
        if (dockMode === 'top') return 'translateY(-100%)';
        if (dockMode === 'bottom') return 'translateY(100%)';
        return 'translateX(100%)';
    }

    function getOpenToggleIcon(dockMode) {
        if (dockMode === 'left') return '◀';
        if (dockMode === 'top') return '▲';
        if (dockMode === 'bottom') return '▼';
        return '▶';
    }

    function getClosedToggleIcon(dockMode) {
        if (dockMode === 'left') return '▶';
        if (dockMode === 'top') return '▼';
        if (dockMode === 'bottom') return '▲';
        return '◀';
    }

    function setSidebarOpen(sidebarContainer, toggleBtn, isOpen) {
        var dockMode = sidebarContainer.dataset.dockMode || getSavedDockMode();
        sidebarContainer.dataset.open = isOpen ? 'true' : 'false';
        sidebarContainer.style.transform = isOpen ? 'translate(0, 0)' : getClosedTransform(dockMode);
        toggleBtn.innerHTML = isOpen ? getOpenToggleIcon(dockMode) : getClosedToggleIcon(dockMode);
    }

    function applyDockMode(sidebarContainer, toggleBtn, dockMode) {
        var isOpen = sidebarContainer.dataset.open !== 'false';
        sidebarContainer.dataset.dockMode = dockMode;
        saveDockMode(dockMode);

        sidebarContainer.style.cssText = "position: fixed; z-index: 2147483647; background-color: white; display: flex; flex-direction: column; transition: transform 0.3s ease-in-out; overflow: visible;";

        if (dockMode === 'left') {
            sidebarContainer.style.top = '0';
            sidebarContainer.style.left = '0';
            sidebarContainer.style.width = '450px';
            sidebarContainer.style.maxWidth = '92vw';
            sidebarContainer.style.height = '100vh';
            sidebarContainer.style.boxShadow = '5px 0 25px rgba(0,0,0,0.3)';
            toggleBtn.style.cssText = "position: absolute; right: -36px; top: 50%; transform: translateY(-50%); width: 36px; height: 70px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 0 8px 8px 0; box-shadow: 3px 0 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
        } else if (dockMode === 'top') {
            sidebarContainer.style.left = '0';
            sidebarContainer.style.right = '0';
            sidebarContainer.style.top = '0';
            sidebarContainer.style.width = '100vw';
            sidebarContainer.style.height = 'min(620px, 72vh)';
            sidebarContainer.style.boxShadow = '0 5px 25px rgba(0,0,0,0.3)';
            toggleBtn.style.cssText = "position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%); width: 70px; height: 36px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 0 0 8px 8px; box-shadow: 0 3px 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
        } else if (dockMode === 'bottom') {
            sidebarContainer.style.left = '0';
            sidebarContainer.style.right = '0';
            sidebarContainer.style.bottom = '0';
            sidebarContainer.style.width = '100vw';
            sidebarContainer.style.height = 'min(620px, 72vh)';
            sidebarContainer.style.boxShadow = '0 -5px 25px rgba(0,0,0,0.3)';
            toggleBtn.style.cssText = "position: absolute; top: -36px; left: 50%; transform: translateX(-50%); width: 70px; height: 36px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px 8px 0 0; box-shadow: 0 -3px 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
        } else {
            sidebarContainer.style.top = '0';
            sidebarContainer.style.right = '0';
            sidebarContainer.style.width = '450px';
            sidebarContainer.style.maxWidth = '92vw';
            sidebarContainer.style.height = '100vh';
            sidebarContainer.style.boxShadow = '-5px 0 25px rgba(0,0,0,0.3)';
            toggleBtn.style.cssText = "position: absolute; left: -36px; top: 50%; transform: translateY(-50%); width: 36px; height: 70px; background-color: #002B54; color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; border-radius: 8px 0 0 8px; box-shadow: -3px 0 10px rgba(0,0,0,0.2); font-size: 18px; user-select: none;";
        }

        setSidebarOpen(sidebarContainer, toggleBtn, isOpen);
    }

    function createHeaderButton(label, title, clickHandler) {
        var button = document.createElement('button');
        button.type = 'button';
        button.innerText = label;
        button.title = title;
        button.style.cssText = "background: rgba(255,255,255,0.18); border: none; color: white; font-size: 12px; cursor: pointer; padding: 4px 7px; border-radius: 4px; min-width: 28px;";
        button.addEventListener('mouseover', function() { button.style.background = 'rgba(255,255,255,0.35)'; });
        button.addEventListener('mouseout', function() { button.style.background = 'rgba(255,255,255,0.18)'; });
        button.addEventListener('click', clickHandler);
        return button;
    }

    function resolveDockModeFromPointer(clientX, clientY) {
        if (clientY < window.innerHeight * 0.32) return 'top';
        if (clientY > window.innerHeight * 0.68) return 'bottom';
        return clientX < window.innerWidth / 2 ? 'left' : 'right';
    }

    function enableHeaderDrag(header, sidebarContainer, toggleBtn) {
        var dragState = null;

        header.addEventListener('pointerdown', function(e) {
            if (e.button !== 0 || e.target.closest('button')) return;

            dragState = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                lastX: e.clientX,
                lastY: e.clientY,
                moved: false
            };

            header.setPointerCapture(e.pointerId);
            header.style.cursor = 'grabbing';
            sidebarContainer.style.transition = 'none';
            e.preventDefault();
        });

        header.addEventListener('pointermove', function(e) {
            if (!dragState || e.pointerId !== dragState.pointerId) return;

            dragState.lastX = e.clientX;
            dragState.lastY = e.clientY;

            var deltaX = e.clientX - dragState.startX;
            var deltaY = e.clientY - dragState.startY;
            dragState.moved = dragState.moved || Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8;

            if (dragState.moved) {
                sidebarContainer.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
            }
        });

        header.addEventListener('pointerup', function(e) {
            if (!dragState || e.pointerId !== dragState.pointerId) return;

            var shouldDock = dragState.moved;
            var dockMode = resolveDockModeFromPointer(dragState.lastX, dragState.lastY);
            dragState = null;

            header.releasePointerCapture(e.pointerId);
            header.style.cursor = 'grab';
            sidebarContainer.style.transition = 'transform 0.3s ease-in-out';

            if (shouldDock) {
                sidebarContainer.dataset.open = 'true';
                applyDockMode(sidebarContainer, toggleBtn, dockMode);
            } else {
                setSidebarOpen(sidebarContainer, toggleBtn, sidebarContainer.dataset.open !== 'false');
            }
        });

        header.addEventListener('pointercancel', function(e) {
            if (!dragState || e.pointerId !== dragState.pointerId) return;

            dragState = null;
            header.style.cursor = 'grab';
            sidebarContainer.style.transition = 'transform 0.3s ease-in-out';
            setSidebarOpen(sidebarContainer, toggleBtn, sidebarContainer.dataset.open !== 'false');
        });
    }

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

                var toggleBtn = document.getElementById('delta-moderator-sidebar-toggle');
                if (toggleBtn) {
                    applyDockMode(sidebarContainer, toggleBtn, sidebarContainer.dataset.dockMode || getSavedDockMode());
                    setSidebarOpen(sidebarContainer, toggleBtn, true);
                }
            } else {
                // FIRST TIME CREATION: Build the sidebar UI overlay
                sidebarContainer = document.createElement('div');
                sidebarContainer.id = 'delta-moderator-sidebar-container';

                // --- TOGGLE TAB (Small sticky tab hanging explicitly outside the sidebar) ---
                var toggleBtn = document.createElement('div');
                toggleBtn.id = 'delta-moderator-sidebar-toggle';
                toggleBtn.title = "Verberg / Toon Vraag Template";

                // Toggle animation logic linked to the CSS transform property
                toggleBtn.onclick = function() {
                    setSidebarOpen(sidebarContainer, toggleBtn, sidebarContainer.dataset.open === 'false');
                };
                sidebarContainer.appendChild(toggleBtn);
                // ----------------------------------------

                // HEADER SECTION (Title & Hard Close Button)
                var header = document.createElement('div');
                header.style.cssText = "display: flex; justify-content: space-between; align-items: center; gap: 8px; background-color: #002B54; color: white; padding: 12px 15px; font-weight: bold; font-family: sans-serif;";
                header.title = "Sleep de balk naar links, rechts, boven of onderaan";
                header.style.cursor = 'grab';

                var headerTitle = document.createElement('div');
                headerTitle.innerText = "Delta Vraag Maken";
                headerTitle.style.cssText = "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";

                var headerControls = document.createElement('div');
                headerControls.style.cssText = "display: flex; align-items: center; gap: 4px; margin-left: auto;";
                headerControls.appendChild(createHeaderButton('↗', 'Open los venster', function() {
                    var iframe = document.getElementById('delta-moderator-sidebar-iframe');
                    var popupUrl = iframe ? iframe.src : finalUrl;
                    var popupWindow = window.open(popupUrl, 'delta-template-helper-window', 'popup=yes,width=500,height=760,left=80,top=80');
                    if (popupWindow) popupWindow.focus();
                    setSidebarOpen(sidebarContainer, toggleBtn, false);
                }));

                var closeBtn = document.createElement('button');
                closeBtn.innerText = "✖ Sluiten";
                closeBtn.style.cssText = "background: rgba(255,255,255,0.2); border: none; color: white; font-size: 13px; cursor: pointer; padding: 4px 8px; border-radius: 4px;";
                // Add hover effects cleanly through event listeners instead of massive CSS strings
                closeBtn.addEventListener('mouseover', function() { closeBtn.style.background = 'rgba(255,255,255,0.4)'; });
                closeBtn.addEventListener('mouseout', function() { closeBtn.style.background = 'rgba(255,255,255,0.2)'; });
                // Clicking close behaves the exact same way as clicking the toggle tab (soft close)
                closeBtn.onclick = function() { setSidebarOpen(sidebarContainer, toggleBtn, false); };
                header.appendChild(headerTitle);
                header.appendChild(headerControls);
                header.appendChild(closeBtn);
                enableHeaderDrag(header, sidebarContainer, toggleBtn);

                // 5. IFRAME MOUNTING
                // Create an isolated iframe to load our template.html file
                // Using an iframe prevents the CRS page's global CSS/JS from interfering with our template
                var iframe = document.createElement('iframe');
                iframe.id = 'delta-moderator-sidebar-iframe';
                // Allow the iframe to use the modern Clipboard API so copying text works
                iframe.setAttribute('allow', 'clipboard-read; clipboard-write');
                // Load the constructed URL (including payload parameters) into the iframe
                iframe.src = finalUrl;
                iframe.style.cssText = "flex-grow: 1; border: none; width: 100%; height: 100%; background: #f4f6f8;";

                // Assemble the DOM structure
                sidebarContainer.appendChild(header);
                sidebarContainer.appendChild(iframe);
                applyDockMode(sidebarContainer, toggleBtn, getSavedDockMode());
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
