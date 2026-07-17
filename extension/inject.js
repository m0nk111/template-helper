/**
 * INJECTION SCRIPT (CONTENT SCRIPT)
 * This script is injected directly into the DOM of the target page (e.g., CRS).
 * It listens to page elements and renders our custom UI components next to them.
 */

// 1. DOMAIN VALIDATION
// Verify we are actually operating on the CRS domain to save browser CPU cycles
if (!window.location.href.toLowerCase().includes('crs')) {
    // If we're on the wrong domain, halt execution to prevent throwing errors or wasting memory.
    console.debug('Moderator Template Helper: Not the CRS domain, halting injection.');
} else {

    var SIDEBAR_DOCK_MODE_KEY = 'moderator-template-helper-dock-mode';
    var MAX_CUSTOMER_NUMBER_LENGTH = 100;
    var GET_TAB_STATE_MESSAGE_TYPE = 'template-helper:get-tab-state';
    var SET_TAB_STATE_MESSAGE_TYPE = 'template-helper:set-tab-state';
    var CRS_NOTE_UPDATE_MESSAGE_TYPE = 'template-helper:crs-note-update';
    var CRS_NOTE_SYNC_DELAY_MS = 300;
    var TEMPLATE_SCREENSHOT_REQUEST_MESSAGE_TYPE = 'template-helper:screenshot-request';
    var TEMPLATE_SCREENSHOT_RESULT_MESSAGE_TYPE = 'template-helper:screenshot-result';
    var TEMPLATE_SCREENSHOT_ERROR_MESSAGE_TYPE = 'template-helper:screenshot-error';
    var CAPTURE_SCREENSHOT_MESSAGE_TYPE = 'template-helper:capture-screenshot';
    var SCREENSHOT_TARGET_FIELDS = [
        'klantvraag', 'vastloper', 'uitkomst', 'antwoord', 'bron', 'vervolgstap',
        'tccNotitie', 'tccScreenshots', 'tccNogControleren', 'tccAanvullen'
    ];
    var SCREENSHOT_CAPTURE_ERROR_CODES = [
        'capture-failed',
        'capture-in-progress',
        'capture-permission-denied',
        'capture-timeout',
        'invalid-capture-context',
        'sidebar-unavailable'
    ];
    var CRS_SCREENSHOT_CAPTURE_TIMEOUT_MS = 9000;
    var TAB_STATE_MESSAGE_RETRY_DELAY_MS = 100;
    var TAB_STATE_MESSAGE_MAX_ATTEMPTS = 3;
    var isScreenshotCaptureInProgress = false;
    var activeScreenshotCaptureRequestId = null;
    var screenshotCaptureTimeoutId = null;
    var fallbackDraftId = null;
    var currentTabState = null;

    function isValidDraftId(draftId) {
        return typeof draftId === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(draftId);
    }

    function createDraftId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }

        if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
            var randomValues = new Uint32Array(4);
            window.crypto.getRandomValues(randomValues);
            return Array.from(randomValues, function(value) { return value.toString(16); }).join('-');
        }

        return 'tab-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }

    function isValidTabState(tabState) {
        return !!tabState && typeof tabState === 'object' &&
            isValidDraftId(tabState.draftId) && typeof tabState.isOpen === 'boolean';
    }

    function getFallbackTabState() {
        if (!isValidDraftId(fallbackDraftId)) fallbackDraftId = createDraftId();
        return { draftId: fallbackDraftId, isOpen: false };
    }

    function loadTabState(callback, attemptNumber) {
        var currentAttempt = attemptNumber || 1;
        try {
            chrome.runtime.sendMessage({ type: GET_TAB_STATE_MESSAGE_TYPE }, function(response) {
                if (chrome.runtime.lastError || !response || !response.ok || !isValidTabState(response.tabState)) {
                    if (currentAttempt < TAB_STATE_MESSAGE_MAX_ATTEMPTS) {
                        setTimeout(function() {
                            loadTabState(callback, currentAttempt + 1);
                        }, TAB_STATE_MESSAGE_RETRY_DELAY_MS);
                        return;
                    }
                    currentTabState = getFallbackTabState();
                } else {
                    currentTabState = response.tabState;
                }
                callback();
            });
        } catch (storageError) {
            currentTabState = getFallbackTabState();
            callback();
        }
    }

    function getTabDraftId() {
        if (!isValidTabState(currentTabState)) currentTabState = getFallbackTabState();
        return currentTabState.draftId;
    }

    function getSavedDockMode() {
        try {
            return localStorage.getItem(SIDEBAR_DOCK_MODE_KEY) || 'right';
        } catch (storageError) {
            console.debug('Moderator Template Helper: Dock mode could not be read.', storageError);
            return 'right';
        }
    }

    function saveDockMode(dockMode) {
        try {
            localStorage.setItem(SIDEBAR_DOCK_MODE_KEY, dockMode);
        } catch (storageError) {
            console.debug('Moderator Template Helper: Dock mode could not be saved.', storageError);
        }
    }

    function getSavedSidebarOpen() {
        return isValidTabState(currentTabState) && currentTabState.isOpen;
    }

    function saveSidebarOpen(isOpen, attemptNumber) {
        var currentAttempt = attemptNumber || 1;
        if (!isValidTabState(currentTabState)) currentTabState = getFallbackTabState();
        currentTabState = { draftId: currentTabState.draftId, isOpen: isOpen };

        try {
            chrome.runtime.sendMessage({
                type: SET_TAB_STATE_MESSAGE_TYPE,
                isOpen: isOpen
            }, function() {
                if (chrome.runtime.lastError) {
                    if (currentAttempt < TAB_STATE_MESSAGE_MAX_ATTEMPTS) {
                        setTimeout(function() {
                            saveSidebarOpen(isOpen, currentAttempt + 1);
                        }, TAB_STATE_MESSAGE_RETRY_DELAY_MS);
                        return;
                    }
                    console.debug('Moderator Template Helper: Sidebar state could not be saved.', chrome.runtime.lastError);
                }
            });
        } catch (storageError) {
            console.debug('Moderator Template Helper: Sidebar state could not be saved.', storageError);
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
        saveSidebarOpen(isOpen);
        sidebarContainer.style.transform = isOpen ? 'translate(0, 0)' : getClosedTransform(dockMode);
        toggleBtn.innerHTML = isOpen ? getOpenToggleIcon(dockMode) : getClosedToggleIcon(dockMode);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggleBtn.setAttribute('aria-label', isOpen ? 'Vraag Template inklappen' : 'Vraag Template uitklappen');
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

        toggleBtn.style.border = 'none';
        toggleBtn.style.padding = '0';
        toggleBtn.style.fontFamily = 'inherit';
        toggleBtn.style.appearance = 'none';
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

            var movementX = e.clientX - dragState.startX;
            var movementY = e.clientY - dragState.startY;
            dragState.moved = dragState.moved || Math.abs(movementX) > 8 || Math.abs(movementY) > 8;

            if (dragState.moved) {
                sidebarContainer.style.transform = 'translate(' + movementX + 'px, ' + movementY + 'px)';
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

    function sendCrsNoteUpdate(note) {
        var iframe = document.getElementById('moderator-template-sidebar-iframe');
        if (!iframe || !iframe.contentWindow) return;

        try {
            var templateOrigin = new URL(iframe.src).origin;
            iframe.contentWindow.postMessage({
                type: CRS_NOTE_UPDATE_MESSAGE_TYPE,
                note: String(note || '')
            }, templateOrigin);
        } catch (messageError) {
            console.debug('Moderator Template Helper: CRS note could not be synchronized.', messageError);
        }
    }

    function sendCurrentCrsNoteUpdate() {
        var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
        sendCrsNoteUpdate(notitieEl ? notitieEl.value : '');
    }

    function attachLiveCrsNoteSync(notitieEl) {
        if (notitieEl.dataset.templateHelperLiveSync === 'true') return;

        var syncTimer = null;
        var queueNoteSync = function() {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(function() {
                sendCrsNoteUpdate(notitieEl.value || '');
            }, CRS_NOTE_SYNC_DELAY_MS);
        };

        notitieEl.dataset.templateHelperLiveSync = 'true';
        notitieEl.addEventListener('input', queueNoteSync);
    }

    function hasExactMessageKeys(data, keys) {
        return !!data && typeof data === 'object' && !Array.isArray(data) &&
            Object.keys(data).length === keys.length &&
            keys.every(function(key) {
                return Object.prototype.hasOwnProperty.call(data, key);
            });
    }

    function getTemplateIframe() {
        return document.getElementById('moderator-template-sidebar-iframe');
    }

    function getTemplateOrigin(iframe) {
        try {
            return new URL(iframe.src).origin;
        } catch (originError) {
            console.debug('Moderator Template Helper: Template origin could not be resolved.', originError);
            return null;
        }
    }

    function sendScreenshotResponse(iframe, data) {
        var templateOrigin = getTemplateOrigin(iframe);
        if (!templateOrigin || !iframe.contentWindow) return;

        iframe.contentWindow.postMessage(data, templateOrigin);
    }

    function sendScreenshotError(iframe, request, errorCode) {
        var safeErrorCode = SCREENSHOT_CAPTURE_ERROR_CODES.includes(errorCode) ? errorCode : 'capture-failed';
        sendScreenshotResponse(iframe, {
            type: TEMPLATE_SCREENSHOT_ERROR_MESSAGE_TYPE,
            targetField: request.targetField,
            requestId: request.requestId,
            errorCode: safeErrorCode
        });
    }

    function finishScreenshotCapture(sidebarContainer, previousVisibility, requestId) {
        if (activeScreenshotCaptureRequestId !== requestId) return false;

        clearTimeout(screenshotCaptureTimeoutId);
        screenshotCaptureTimeoutId = null;
        sidebarContainer.style.visibility = previousVisibility;
        activeScreenshotCaptureRequestId = null;
        isScreenshotCaptureInProgress = false;
        return true;
    }

    function captureCrsScreenshot(iframe, request) {
        if (isScreenshotCaptureInProgress) {
            sendScreenshotError(iframe, request, 'capture-in-progress');
            return;
        }

        var sidebarContainer = document.getElementById('moderator-template-sidebar-container');
        if (!sidebarContainer) {
            sendScreenshotError(iframe, request, 'sidebar-unavailable');
            return;
        }

        isScreenshotCaptureInProgress = true;
        activeScreenshotCaptureRequestId = request.requestId;
        var previousVisibility = sidebarContainer.style.visibility;
        sidebarContainer.style.visibility = 'hidden';

        screenshotCaptureTimeoutId = setTimeout(function() {
            if (!finishScreenshotCapture(sidebarContainer, previousVisibility, request.requestId)) return;
            sendScreenshotError(iframe, request, 'capture-timeout');
        }, CRS_SCREENSHOT_CAPTURE_TIMEOUT_MS);

        window.requestAnimationFrame(function() {
            window.requestAnimationFrame(function() {
                try {
                    chrome.runtime.sendMessage({ type: CAPTURE_SCREENSHOT_MESSAGE_TYPE }, function(response) {
                        if (!finishScreenshotCapture(sidebarContainer, previousVisibility, request.requestId)) return;

                        if (chrome.runtime.lastError || !response || response.ok !== true || typeof response.imageDataUrl !== 'string') {
                            var errorCode = response && typeof response.errorCode === 'string'
                                ? response.errorCode
                                : 'capture-failed';
                            sendScreenshotError(iframe, request, errorCode);
                            return;
                        }

                        sendScreenshotResponse(iframe, {
                            type: TEMPLATE_SCREENSHOT_RESULT_MESSAGE_TYPE,
                            targetField: request.targetField,
                            requestId: request.requestId,
                            imageDataUrl: response.imageDataUrl
                        });
                    });
                } catch (captureError) {
                    if (!finishScreenshotCapture(sidebarContainer, previousVisibility, request.requestId)) return;
                    console.debug('Moderator Template Helper: Screenshot capture could not be requested.', captureError);
                    sendScreenshotError(iframe, request, 'capture-failed');
                }
            });
        });
    }

    window.addEventListener('message', function(event) {
        var iframe = getTemplateIframe();
        if (!iframe || event.source !== iframe.contentWindow) return;

        var templateOrigin = getTemplateOrigin(iframe);
        if (!templateOrigin || event.origin !== templateOrigin) return;

        var data = event.data;
        if (!hasExactMessageKeys(data, ['type', 'targetField', 'requestId']) ||
            data.type !== TEMPLATE_SCREENSHOT_REQUEST_MESSAGE_TYPE ||
            !SCREENSHOT_TARGET_FIELDS.includes(data.targetField) ||
            typeof data.requestId !== 'string' ||
            data.requestId.length < 8 || data.requestId.length > 100) return;

        captureCrsScreenshot(iframe, data);
    });

    function readCurrentCrsContext() {
        var customerNumberElement = document.querySelector('.ut_DFI_EL_PARTY_ID');
        var noteElement = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');

        return {
            customerNumber: customerNumberElement
                ? customerNumberElement.innerText.trim().slice(0, MAX_CUSTOMER_NUMBER_LENGTH)
                : '',
            customerNote: noteElement ? noteElement.value.trim() : ''
        };
    }

    function createTemplateUrl(crsContext) {
        var urlParams = new URLSearchParams();
        urlParams.set('klantnummer', crsContext.customerNumber);
        urlParams.set('klantvraag', crsContext.customerNote);
        urlParams.set('draftId', getTabDraftId());
        return chrome.runtime.getURL('template.html') + '?' + urlParams.toString();
    }

    function initializeTemplatePanel() {
        if (!document.body) return null;

        var crsContext = readCurrentCrsContext();
        var sidebarContainer = document.getElementById('moderator-template-sidebar-container');
        if (sidebarContainer) {
            var existingToggleButton = sidebarContainer.querySelector('#moderator-template-sidebar-toggle');
            var existingIframe = sidebarContainer.querySelector('#moderator-template-sidebar-iframe');
            if (existingToggleButton && existingIframe) {
                if (sidebarContainer.dataset.customerNumber !== crsContext.customerNumber) {
                    sidebarContainer.dataset.customerNumber = crsContext.customerNumber;
                    existingIframe.src = createTemplateUrl(crsContext);
                }
                return sidebarContainer;
            }
            sidebarContainer.remove();
        }

        var finalUrl = createTemplateUrl(crsContext);

        sidebarContainer = document.createElement('div');
        sidebarContainer.id = 'moderator-template-sidebar-container';
        sidebarContainer.dataset.open = getSavedSidebarOpen() ? 'true' : 'false';
        sidebarContainer.dataset.customerNumber = crsContext.customerNumber;

        var toggleFocusStyle = document.createElement('style');
        toggleFocusStyle.textContent = '#moderator-template-sidebar-toggle:focus-visible { outline: 3px solid #ffbf47; outline-offset: 2px; }';
        sidebarContainer.appendChild(toggleFocusStyle);

        var toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.id = 'moderator-template-sidebar-toggle';
        toggleButton.setAttribute('aria-controls', 'moderator-template-sidebar-iframe');
        toggleButton.title = 'Verberg / Toon Vraag Template';
        toggleButton.onclick = function() {
            setSidebarOpen(sidebarContainer, toggleButton, sidebarContainer.dataset.open === 'false');
        };
        sidebarContainer.appendChild(toggleButton);

        var header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; gap: 8px; background-color: #002B54; color: white; padding: 12px 15px; font-weight: bold; font-family: sans-serif;';
        header.title = 'Sleep de balk naar links, rechts, boven of onderaan';
        header.style.cursor = 'grab';

        var headerTitle = document.createElement('div');
        headerTitle.innerText = 'Vraag Template';
        headerTitle.style.cssText = 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

        var headerControls = document.createElement('div');
        headerControls.style.cssText = 'display: flex; align-items: center; gap: 4px; margin-left: auto;';
        headerControls.appendChild(createHeaderButton('↗', 'Open los venster', function() {
            var iframe = document.getElementById('moderator-template-sidebar-iframe');
            var popupUrl = iframe ? iframe.src : finalUrl;
            var popupWindow = window.open(popupUrl, 'moderator-template-helper-window', 'popup=yes,width=500,height=760,left=80,top=80');
            if (popupWindow) popupWindow.focus();
            setSidebarOpen(sidebarContainer, toggleButton, false);
        }));

        var closeButton = document.createElement('button');
        closeButton.innerText = '✖ Sluiten';
        closeButton.style.cssText = 'background: rgba(255,255,255,0.2); border: none; color: white; font-size: 13px; cursor: pointer; padding: 4px 8px; border-radius: 4px;';
        closeButton.addEventListener('mouseover', function() { closeButton.style.background = 'rgba(255,255,255,0.4)'; });
        closeButton.addEventListener('mouseout', function() { closeButton.style.background = 'rgba(255,255,255,0.2)'; });
        closeButton.onclick = function() { setSidebarOpen(sidebarContainer, toggleButton, false); };
        header.appendChild(headerTitle);
        header.appendChild(headerControls);
        header.appendChild(closeButton);
        enableHeaderDrag(header, sidebarContainer, toggleButton);

        var templateIframe = document.createElement('iframe');
        templateIframe.id = 'moderator-template-sidebar-iframe';
        templateIframe.setAttribute('allow', 'clipboard-write');
        templateIframe.addEventListener('load', sendCurrentCrsNoteUpdate);
        templateIframe.src = finalUrl;
        templateIframe.style.cssText = 'flex-grow: 1; border: none; width: 100%; height: 100%; background: #f4f6f8;';

        sidebarContainer.appendChild(header);
        sidebarContainer.appendChild(templateIframe);
        applyDockMode(sidebarContainer, toggleButton, getSavedDockMode());
        document.body.appendChild(sidebarContainer);
        return sidebarContainer;
    }

    function reconcileTemplatePanel() {
        var noteElement = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
        if (noteElement) attachLiveCrsNoteSync(noteElement);

        var legacyButton = document.getElementById('moderator-vraag-btn');
        if (legacyButton) legacyButton.remove();

        var menuItem = document.getElementById('moderator-vraag-menu-item');
        if (menuItem) menuItem.remove();

        initializeTemplatePanel();
    }

    var reconciliationTimerId = null;
    function scheduleTemplatePanelReconciliation() {
        if (reconciliationTimerId !== null) return;

        reconciliationTimerId = setTimeout(function() {
            reconciliationTimerId = null;
            reconcileTemplatePanel();
        }, 0);
    }

    var observer = new MutationObserver(scheduleTemplatePanelReconciliation);
    function startTemplatePanelLifecycle() {
        if (!document.documentElement) {
            document.addEventListener('DOMContentLoaded', startTemplatePanelLifecycle, { once: true });
            return;
        }

        reconcileTemplatePanel();

        // The html root survives CRS body replacements, so panel recovery remains active.
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    loadTabState(startTemplatePanelLifecycle);
}
