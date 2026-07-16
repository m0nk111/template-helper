# Template Helper

Template Helper is a Chrome extension and standalone HTML workflow for moderator templates.
It is built to reduce copy mistakes, keep formatting consistent, and speed up CRS-to-Teams handoff.

## Nederlandse versie

### Wat is dit?
Template Helper ondersteunt moderators met een vaste, snelle en consistente workflow voor vraag- en antwoordtemplates.

### Complete featurelijst
- Vier templateweergaven: V&A `Vraag Template` en `Antwoord Template`, plus TCC `Ticketcontrole Verzoek` en `Ticketcontrole Antwoord`.
- Een compacte domeinswitch wisselt tussen Technische Kennis V&A en Ticket Check Chat (TCC); de bestaande templateknop wisselt binnen het actieve domein tussen verzoek en antwoord.
- Werkt als Chrome extensie in CRS en als standalone HTML buiten CRS.
- Injecteert een blauwe `Vraag maken` knop direct bij het CRS-invoerveld.
- Leest automatisch `Klantnummer` en notitie uit CRS en prefilt relevante templatevelden.
- TCC-verzoek hergebruikt dezelfde CRS-prefill voor klantnummer en notitie.
- Tijdens een actief TCC-verzoek wordt de CRS-notitie live gesynchroniseerd; na een lokale template-aanpassing kies je expliciet of de nieuwe CRS-notitie de template-notitie mag overschrijven.
- In extension mode opent de template direct vanuit de workflow in een in-app zijpaneel.
- Docking-ondersteuning voor zijpaneel (links, rechts, boven, onder) met bewaarde positie.
- Drag-to-dock: sleep de blauwe sidebar-header om live te docken naar links, rechts, boven of onder.
- Sidebar toggle-tab om snel te verbergen/tonen zonder context te verliezen.
- Pop-out knop (`↗`) om de template los in een apart venster te openen.
- Dock mode persistence: onthoudt de laatst gebruikte dock-positie.
- SPA-resilience: injectie herstelt automatisch bij dynamische CRS redraws.
- Domeinbeperking: injectie draait alleen op CRS-URL's.
- Volledige rich-text invoervelden voor `Klantvraag`, `Vastloper`, `Gewenste uitkomst`, `Antwoord`, `Bron` en `Vervolgstap`.
- Screenshot/afbeelding invoer in rich-text velden inclusief formattering in de output.
- TCC-verzoek bevat klantnummer, notitie en verplichte screenshots; TCC-antwoord bevat één controlepunt, aanvulling in ticket en een `Akkoord`-schuifje.
- Lege TCC-antwoordregels worden in de Teams-output als `-` weergegeven; Akkoord start op `nee`.
- Live preview van het uiteindelijke bericht.
- Live preview update realtime tijdens typen/wijzigen.
- Clipboard output met nette label-opmaak voor Teams (HTML + plain text fallback).
- Clipboard fallback via legacy copy-flow als de moderne Clipboard API faalt.
- Teams-tip in de UI om `Ctrl+V` te gebruiken zodat opmaak en afbeeldingen behouden blijven.
- Validatie van verplichte velden met duidelijke foutmeldingen.
- Validatie is mode-afhankelijk: V&A houdt de bestaande verplichte velden, TCC-verzoek vereist klantnummer, notitie en screenshots, en TCC-antwoord heeft optionele tekstvelden.
- Plakken in rich-text velden wordt naar plain text genormaliseerd (behalve afbeeldingen) voor consistente output.
- Vooraf gedefinieerde wachtrijen voor snelle selectie.
- Shortcut `Ctrl+Enter` (of `Cmd+Enter`) om direct te kopieren.
- Template mode persistence: onthoudt laatst gebruikte template.
- Domein-persistence: onthoudt de laatst gebruikte V&A- of TCC-weergave.
- Theme persistence: onthoudt `light` of `dark`; default is light mode.
- Language persistence: onthoudt laatst gekozen taal.
- Korte druk op taal-knop: wisselt taal en vertaalt ingevulde inhoud.
- Taalwissel behoudt expliciet de huidige V&A/TCC- en verzoek/antwoord-weergave, vertaalt actieve rich-text inhoud en voorkomt onbedoelde mode flips.
- EN-only gedrag: met alleen `EN` actief wordt invoer uit andere talen altijd naar Engels vertaald.
- 2-seconden long-press op taal-knop opent het taalmenu.
- Taalmenu met checkbox-rotatie en brede internationale taalcatalogus.
- Taalmenu dwingt minimaal één actieve taal af (je kunt niet alles uitvinken).
- `Escape` sluit het taalmenu en buiten de menuzone klikken sluit het menu ook.
- Nieuwe installaties starten met `NL` en `EN` als actieve rotatietalen.
- UI-teksten blijven NL/EN; voor andere doeltalen blijft de UI Engels en vertaalt alleen inhoud.
- In extension mode gebruikt de iframe `clipboard-write` permissie voor stabieler kopieren in CRS.
- Herhaald klikken op `Vraag maken` hergebruikt de bestaande sidebar en ververst de context/prefill.
- URL-prefill ondersteuning voor kernvelden via query parameters, inclusief TCC-klantnummer en -notitie.
- Lokale text-beautifier voor geselecteerde talen bij blur.
- Versie-weergave in de footer (manifest/meta fallback).

### Enter-toets bugfix (v4.1.2)
- Een gewone `Enter` in een tekstveld voegt nu altijd een enkele nette regelafbreking toe (zelfde gedrag als `Shift+Enter`), in plaats van een geneste `<div>` die regeleinden liet "stapelen" bij bewerken, vertalen of kopieren.
- Plakken van meerdere regels gebruikt dezelfde consistente regelafbreking.

### Vertalen hardening (v4.1.1)
- Bescherming tegen Google Translate 5000-tekenslimiet per request.
- Proactieve chunking van langere teksten in veilige delen.
- Throttled request-queue om burst verkeer te voorkomen.
- Retry met exponential backoff bij tijdelijke fouten.
- Cooldown bij `429` rate limit en bij netwerk/time-out problemen.
- Duidelijke status- en fouttoasts in plaats van crashende UI-flow.
- Optionele Microsoft/Azure Translator provider is geimplementeerd, maar **standaard uit**; Google blijft default actief.

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
- Optionele Azure provider (niet standaard actief) kan handmatig worden geactiveerd via `localStorage` keys:

```javascript
localStorage.setItem('vraag-tmpl-translate-provider', 'azure');
localStorage.setItem('vraag-tmpl-azure-translator-key', '<your-azure-key>');
localStorage.setItem('vraag-tmpl-azure-translator-region', '<your-azure-region>');
// Optional override; default is https://api.cognitive.microsofttranslator.com/translate
localStorage.setItem('vraag-tmpl-azure-translator-endpoint', 'https://api.cognitive.microsofttranslator.com/translate');
```

## English version

### What is this?
Template Helper provides moderators with a consistent and fast template workflow for both question and answer handoff.

### Full feature set
- Four template views: V&A `Question Template` and `Answer Template`, plus TCC `Ticket Check Request` and `Ticket Check Answer`.
- A compact domain switch changes between Technical Knowledge Q&A and Ticket Check Chat (TCC); the existing template button switches between request and answer within the active domain.
- Works as a Chrome extension in CRS and as standalone HTML outside CRS.
- Injects a blue `Vraag maken` action button directly near the CRS input area.
- Automatically reads `Customer number` and note context from CRS and pre-fills relevant template fields.
- TCC request reuses the same CRS prefill for customer number and note.
- During an active TCC request, the CRS note stays synchronized live; after a local template edit, users explicitly choose whether a newer CRS note may overwrite the template note.
- In extension mode, the template opens directly from workflow context in an in-app sidebar.
- Sidebar docking support (left, right, top, bottom) with persisted dock position.
- Drag-to-dock: drag the blue sidebar header to dock live to left, right, top, or bottom.
- Sidebar toggle tab for fast hide/show without losing context.
- Pop-out button (`↗`) to open the template in a detached window.
- Dock mode persistence: remembers last used dock placement.
- SPA resilience: button/sidebar injection auto-recovers on dynamic CRS redraws.
- Domain scoping: injection runs only on CRS URLs.
- Full rich-text editable fields for `Customer question`, `Where are you stuck`, `Desired outcome`, `Answer`, `Source`, and `Next step`.
- Screenshot/image support inside rich-text fields with preserved formatting.
- TCC request includes customer number, note, and required screenshots; TCC answer includes one check item, ticket additions, and an `Approved` switch.
- Empty TCC answer lines render as `-` in the Teams output; Approved starts as `no`.
- Live preview of the final outbound message.
- Live preview updates in real time while typing/changing fields.
- Clipboard output with clean Teams formatting (HTML + plain text fallback).
- Clipboard fallback uses a legacy copy flow if the modern Clipboard API fails.
- Teams tip in UI to use `Ctrl+V` so formatting and screenshots are preserved.
- Required field validation with clear error feedback.
- Validation is mode-aware: V&A keeps its existing required fields, TCC request requires customer number, note, and screenshots, while TCC answer text fields are optional.
- Rich-text paste is normalized to plain text (except images) for consistent output.
- Predefined queue options for fast routing.
- `Ctrl+Enter` (or `Cmd+Enter`) shortcut to copy instantly.
- Template mode persistence: remembers the last used template.
- Domain persistence: remembers the last used V&A or TCC view.
- Theme persistence: remembers `light` or `dark`; default is light mode.
- Language persistence: remembers the last selected language.
- Short press on language button: switches language and translates filled content.
- Language switching explicitly keeps the current V&A/TCC and request/answer view, translates active rich-text content, and prevents unintended mode flips.
- EN-only behavior: with only `EN` active, content in any source language is translated to English.
- Exact 2-second long press on language button opens the language menu.
- Language menu with checkbox-based rotation and broad international catalog.
- Language menu enforces at least one active language (you cannot uncheck all).
- `Escape` closes the language menu and outside-click also closes it.
- New installs start with `NL` and `EN` enabled in rotation.
- UI stays Dutch/English only; for other target languages, UI remains English while content is translated.
- In extension mode, the iframe uses `clipboard-write` permission for more reliable copy behavior in CRS.
- Repeated clicks on `Vraag maken` reuse the existing sidebar and refresh context/prefill.
- URL prefill support for core fields via query parameters, including TCC customer number and note.
- Local text beautifier on blur for selected languages.
- Footer version rendering with manifest/meta fallback.

### Enter key bugfix (v4.1.2)
- A plain `Enter` in a rich-text field now always inserts a single clean line break (same behavior as `Shift+Enter`), instead of a nested `<div>` that caused line breaks to "stack" during editing, translation, or copying.
- Pasting multiple lines uses the same consistent line break behavior.

### Translation hardening (v4.1.1)
- Protection against the Google Translate 5000-character request hard limit.
- Proactive chunking for long text into safe request sizes.
- Throttled request queue to prevent burst traffic.
- Retry with exponential backoff on transient failures.
- Cooldown behavior for `429` rate limits and network/timeout incidents.
- Clear status/error toasts instead of UI crashes or stuck translation flow.
- Optional Microsoft/Azure Translator provider is implemented, but **disabled by default**; Google remains the active default.

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
- Optional Azure provider (inactive by default) can be enabled manually using `localStorage` keys:

```javascript
localStorage.setItem('vraag-tmpl-translate-provider', 'azure');
localStorage.setItem('vraag-tmpl-azure-translator-key', '<your-azure-key>');
localStorage.setItem('vraag-tmpl-azure-translator-region', '<your-azure-region>');
// Optional override; default is https://api.cognitive.microsofttranslator.com/translate
localStorage.setItem('vraag-tmpl-azure-translator-endpoint', 'https://api.cognitive.microsofttranslator.com/translate');
```
