# Template Helper

Template Helper is a Chrome extension and standalone HTML workflow for moderator templates.
It is built to reduce copy mistakes, keep formatting consistent, and speed up CRS-to-Teams handoff.

## Nederlandse versie

### Wat is dit?
Template Helper ondersteunt moderators met een vaste, snelle en consistente workflow voor vraag- en antwoordtemplates.

### Complete featurelijst
- Twee template modes: `Vraag Template` en `Antwoord Template`.
- Werkt als Chrome extensie in CRS en als standalone HTML buiten CRS.
- In extension mode opent de template direct vanuit de workflow in een in-app zijpaneel.
- Docking-ondersteuning voor zijpaneel (links, rechts, boven, onder) met bewaarde positie.
- Volledige rich-text invoervelden voor `Klantvraag`, `Vastloper`, `Gewenste uitkomst`, `Antwoord`, `Bron` en `Vervolgstap`.
- Screenshot/afbeelding invoer in rich-text velden inclusief formattering in de output.
- Live preview van het uiteindelijke bericht.
- Clipboard output met nette label-opmaak voor Teams (HTML + plain text fallback).
- Teams-tip in de UI om `Ctrl+V` te gebruiken zodat opmaak en afbeeldingen behouden blijven.
- Validatie van verplichte velden met duidelijke foutmeldingen.
- Vooraf gedefinieerde wachtrijen voor snelle selectie.
- Shortcut `Ctrl+Enter` (of `Cmd+Enter`) om direct te kopieren.
- Template mode persistence: onthoudt laatst gebruikte template.
- Theme persistence: onthoudt `light` of `dark`; default is light mode.
- Language persistence: onthoudt laatst gekozen taal.
- Korte druk op taal-knop: wisselt taal en vertaalt ingevulde inhoud.
- EN-only gedrag: met alleen `EN` actief wordt invoer uit andere talen altijd naar Engels vertaald.
- 2-seconden long-press op taal-knop opent het taalmenu.
- Taalmenu met checkbox-rotatie en brede internationale taalcatalogus.
- Nieuwe installaties starten met `NL` en `EN` als actieve rotatietalen.
- UI-teksten blijven NL/EN; voor andere doeltalen blijft de UI Engels en vertaalt alleen inhoud.
- URL-prefill ondersteuning voor kernvelden via query parameters.
- Lokale text-beautifier voor geselecteerde talen bij blur.
- Versie-weergave in de footer (manifest/meta fallback).

### Vertalen hardening (v4.1.1)
- Bescherming tegen Google Translate 5000-tekenslimiet per request.
- Proactieve chunking van langere teksten in veilige delen.
- Throttled request-queue om burst verkeer te voorkomen.
- Retry met exponential backoff bij tijdelijke fouten.
- Cooldown bij `429` rate limit en bij netwerk/time-out problemen.
- Duidelijke status- en fouttoasts in plaats van crashende UI-flow.

### Installatie
1. Download de nieuwste release-asset op [GitHub Releases](https://github.com/m0nk111/template-helper/releases/latest).
2. Voor extensie-installatie: pak de ZIP uit en laad de map via `chrome://extensions/` met Developer mode aan.
3. Voor standalone-gebruik: open `standalone-template-v[versie].html` direct in je browser.

### Upgrade vanaf oudere versie
1. Open `chrome://extensions/`.
2. Verwijder eerst de oude Template Helper extensie.
3. Installeer daarna pas de nieuwe versie.

### Ontwikkelaar informatie
- Single source of truth: bewerk alleen `extension/template.html` en `extension/script.js`.
- Genereer standalone via `scripts/build-standalone.sh`.
- Maak release artifacts via `scripts/pack.sh`.
- Output komt in `release/` als versiegebonden ZIP en standalone HTML.
- Lokale test: laad `extension/` als unpacked extension in Chrome Developer mode.

## English version

### What is this?
Template Helper provides moderators with a consistent and fast template workflow for both question and answer handoff.

### Full feature set
- Two template modes: `Question Template` and `Answer Template`.
- Works as a Chrome extension in CRS and as standalone HTML outside CRS.
- In extension mode, the template opens directly from workflow context in an in-app sidebar.
- Sidebar docking support (left, right, top, bottom) with persisted dock position.
- Full rich-text editable fields for `Customer question`, `Where are you stuck`, `Desired outcome`, `Answer`, `Source`, and `Next step`.
- Screenshot/image support inside rich-text fields with preserved formatting.
- Live preview of the final outbound message.
- Clipboard output with clean Teams formatting (HTML + plain text fallback).
- Teams tip in UI to use `Ctrl+V` so formatting and screenshots are preserved.
- Required field validation with clear error feedback.
- Predefined queue options for fast routing.
- `Ctrl+Enter` (or `Cmd+Enter`) shortcut to copy instantly.
- Template mode persistence: remembers the last used template.
- Theme persistence: remembers `light` or `dark`; default is light mode.
- Language persistence: remembers the last selected language.
- Short press on language button: switches language and translates filled content.
- EN-only behavior: with only `EN` active, content in any source language is translated to English.
- Exact 2-second long press on language button opens the language menu.
- Language menu with checkbox-based rotation and broad international catalog.
- New installs start with `NL` and `EN` enabled in rotation.
- UI stays Dutch/English only; for other target languages, UI remains English while content is translated.
- URL prefill support for core fields via query parameters.
- Local text beautifier on blur for selected languages.
- Footer version rendering with manifest/meta fallback.

### Translation hardening (v4.1.1)
- Protection against the Google Translate 5000-character request hard limit.
- Proactive chunking for long text into safe request sizes.
- Throttled request queue to prevent burst traffic.
- Retry with exponential backoff on transient failures.
- Cooldown behavior for `429` rate limits and network/timeout incidents.
- Clear status/error toasts instead of UI crashes or stuck translation flow.

### Installation
1. Download the latest release asset from [GitHub Releases](https://github.com/m0nk111/template-helper/releases/latest).
2. For extension mode: extract the ZIP and load it via `chrome://extensions/` with Developer mode enabled.
3. For standalone mode: open `standalone-template-v[version].html` directly in your browser.

### Upgrade from older versions
1. Open `chrome://extensions/`.
2. Remove the old Template Helper extension first.
3. Install the new version afterwards.

### Developer notes
- Single source of truth: only edit `extension/template.html` and `extension/script.js`.
- Generate standalone via `scripts/build-standalone.sh`.
- Build release artifacts via `scripts/pack.sh`.
- Artifacts are written to `release/` as versioned ZIP and standalone HTML.
- Local testing: load `extension/` as an unpacked extension in Chrome Developer mode.
