# Chrome Web Store Submission Notes

Use this checklist when submitting the Chrome Store compliance build.

## Build Artifact

Submit the extension package from:

- `release/template-helper-v3.1.3.zip`

The standalone HTML file is for GitHub/manual use and should not be submitted as the Chrome Web Store package.

## Single Purpose

The extension adds a template helper to the CRS portal. It reads the current customer number and typed note from the CRS page only after the user opens the helper, then pre-fills a local question/answer template for copying into Teams.

## Permissions Justification

- `host_permissions`: required only for `https://crs.gw.dfnld.nl/*` so the helper button can be injected into the CRS portal.
- No broad host access is requested.
- No `activeTab` or `scripting` permission is requested in this compliance build.

## Data Handling

The extension processes CRS page content locally in the browser:

- customer number
- typed CRS note text
- template text entered by the user
- local UI preferences such as theme, dock position, and last selected template mode

The extension does not transmit, sell, share, track, or analyze user data. It does not include analytics, ads, remote APIs, or external scripts.

## Privacy Dashboard Guidance

The privacy/data-use answers in the Chrome Web Store dashboard must match the privacy policy and implementation:

- Disclose local handling of website content from the CRS portal.
- Do not claim that the extension sends data to external servers.
- Do not claim analytics, ads, or third-party data sharing.
- Keep the privacy policy URL pointed at the repository privacy policy or another public copy of `PRIVACY.md`.

## Review Risk Notes

This branch removes likely review triggers:

- external DELTA logo request from `template.html`
- unused legacy `content.js`
- unused fallback `background.js`
- `activeTab` and `scripting` permissions
- `clipboard-read` iframe permission
- URL parameter HTML insertion into contenteditable fields
