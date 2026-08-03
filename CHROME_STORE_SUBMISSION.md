# Chrome Web Store Submission Notes

Use this checklist when submitting the Chrome Store compliance build.

## Build Artifact

Submit the extension package from:

- `release/template-helper-v5.0.11.zip`

The standalone HTML file is for GitHub/manual use and should not be submitted as the Chrome Web Store package.

## Single Purpose

The extension adds a template helper to the CRS portal. It reads the current customer number and typed note from the CRS page only after the user opens the helper, then pre-fills a local question/answer template for copying into Teams.

Suggested Chrome Web Store name:

- `Moderator Template Helper`

Suggested short description:

- `Helpt moderators lokaal een vraag- of antwoordtemplate te vullen vanuit het CRS-portaal.`

## Permissions Justification

- `host_permissions`: `https://crs.gw.dfnld.nl/*` limits helper injection and template communication to the CRS portal. `<all_urls>` is required by Chrome's `tabs.captureVisibleTab()` API for the user-requested CRS screenshot feature.
- `storage`: stores only extension-local preferences plus a random draft ID and open/collapsed state per Chrome tab. CRS clears its own session storage between forms, so this isolated tab state is required to reconnect the same tab to its local IndexedDB draft. Customer numbers, template text, and screenshots are not stored in the tab-state record.
- Screenshot capture remains restricted in code: the service worker accepts requests only from the active CRS tab and the content script is injected only on CRS.
- The extension does not read, inject into, or capture other websites.
- The compliance package does not request broad runtime script-injection permissions.

## Extension ID / Manifest Key

Do not add a random `key` value to `manifest.json`.

If a stable unpacked-development ID must match the Chrome Web Store item ID, use the public key from the Chrome Developer Dashboard:

1. Upload the ZIP as a Chrome Web Store item without publishing.
2. Open the item's Package tab.
3. Use View public key.
4. Copy the public key content into the manifest `key` field only if local unpacked builds need to match the Store item ID.

For normal Chrome Web Store uploads to the same item, the Store item keeps its own stable extension ID.

## Data Handling

The extension processes CRS page content locally in the browser:

- customer number
- typed CRS note text
- template text entered by the user
- local UI preferences such as theme, dock position, and last selected template mode

The extension does not transmit, sell, share, track, or analyze user data. It does not include analytics, ads, or external scripts. On startup, it makes one unauthenticated, read-only request to GitHub's public Releases API to compare the installed version with the latest stable release. The request does not include CRS content, template data, customer numbers, identifiers, credentials, or a referrer.

## Privacy Dashboard Guidance

The privacy/data-use answers in the Chrome Web Store dashboard must match the privacy policy and implementation:

- Disclose local handling of website content from the CRS portal.
- Disclose the anonymous GitHub Releases request used for the optional update marker; it sends no CRS or user-entered data.
- Do not claim analytics, ads, or third-party data sharing.
- Keep the privacy policy URL pointed at the repository privacy policy or another public copy of `PRIVACY.md`.

## Review Risk Notes

This branch removes likely review triggers:

- external company logo request from `template.html`
- unused legacy content script
- unused fallback background worker
- clipboard read iframe permission
- URL parameter HTML insertion into contenteditable fields
- official-company-style naming in Store-facing metadata
