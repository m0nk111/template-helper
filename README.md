# Template Helper

Template Helper is a Chrome extension and standalone HTML workflow for moderator templates.
It is built to reduce copy mistakes, keep formatting consistent, and speed up CRS-to-Teams handoff.

## Nederlandse versie

### Wat is dit?
Template Helper ondersteunt moderators met een vaste, snelle en consistente workflow voor vraag- en antwoordtemplates.

### Nieuw in v5.0.4
- Drafts worden lokaal afzonderlijk bewaard per CRS-browsertab en bevestigd klantnummer. Na wisselen tussen meerdere klanten komen tekstvelden en screenshots uitsluitend terug bij de juiste klant.
- Een tijdelijke CRS-context zonder klantnummer toont geen eerdere klantgegevens en kan geen klantdraft automatisch of via `Wissen` verwijderen.

### Nieuw in v5.0.3
- CRS wist bij sommige wisselingen via de linker navigatie zijn eigen sessieopslag. Template Helper bewaart het draft-ID en de open/ingeklapte status daarom nu per echte Chrome-tab in afgeschermde extensieopslag.
- Tekstvelden en screenshots blijven in lokale IndexedDB-opslag staan en worden met het behouden draft-ID voor dezelfde klant hersteld.

### Nieuw in v5.0.2
- De open of ingeklapte stand van Template Helper blijft per CRS-browsertab behouden na een volledige paginareload of navigatie via de linker CRS-navigatie.
- Dezelfde tab gebruikt bij dezelfde klant opnieuw hetzelfde draft-ID, zodat eerder ingevoerde tekstvelden en screenshots automatisch uit de lokale draft worden hersteld.

### Nieuw in v5.0.1
- Template Helper wordt automatisch ingeklapt geladen op iedere ondersteunde CRS-pagina; de blauwe toggle-tab is de enige bediening die nodig is om het reeds geladen paneel te openen.
- Het paneel herstelt na dynamische CRS-contentvervanging en ververst de klantprefill wanneer CRS binnen hetzelfde document naar een andere klant wisselt.

### Nieuw in v4.3.3
- Een draft voor dezelfde klant blijft behouden als CRS tijdelijk geen klantnummer levert of de template niet kan laden. De tijdelijke pagina toont geen klantgegevens en kan de bewaarde draft niet automatisch aanpassen of verwijderen.
- Met `Wissen` verwijder je een bewaarde draft ook bewust tijdens zo'n tijdelijke contextloze pagina.

### Nieuw in v4.3.2
- Brede geplakte tabellen blijven binnen het voorbeeldvak. Gebruik de horizontale scrollbar direct bij de tabel; de sidebar en de rest van de preview blijven op breedte.
- De Teams/clipboard-output behoudt de oorspronkelijke tabel zonder preview-specifieke wrapper of scrollbarstijl.

### Nieuw in v4.3.1
- Veilig plakken uit CRS en Teams behoudt nu tabellen, celopmaak, lijsten en nadruk in alle rich-text velden; onveilige HTML, externe afbeeldingen en actieve links worden verwijderd.
- De screenshotknop staat nu bij elk rich-text veld. Screenshotverwijdering laat geen extra witruimte achter en blijft compatibel met oudere tijdelijke drafts.

### Nieuw in v4.3.0
- Ingevulde velden en screenshots blijven tijdelijk behouden binnen dezelfde CRS-browsertab en worden hersteld wanneer je opnieuw `Vraag maken` opent voor dezelfde klant.
- Bij een nieuw klantnummer, of een overgang tussen wel en geen klantnummer, wordt de oude draft bewust gewist zodat klantgegevens niet doorlopen naar een andere context.
- Herstelde invoer wordt veilig gevalideerd en na 24 uur automatisch opgeruimd. `Waar loop je vast` verduidelijkt nu dat het om het script gaat.

### Complete featurelijst
- Vier templateweergaven: V&A `Vraag Template` en `Antwoord Template`, plus TCC `Ticketcontrole Verzoek` en `Ticketcontrole Antwoord`.
- Een compacte domeinswitch wisselt tussen Technische Kennis V&A en Ticket Check Chat (TCC); de bestaande templateknop wisselt binnen het actieve domein tussen verzoek en antwoord.
- Werkt als Chrome extensie in CRS en als standalone HTML buiten CRS.
- Laadt automatisch op iedere ondersteunde CRS-pagina en start ingeklapt; alleen het bestaande blauwe uitsteekseltje blijft zichtbaar om het reeds geladen paneel uit te klappen.
- Leest automatisch `Klantnummer` en notitie uit CRS en prefilt relevante templatevelden.
- TCC-verzoek hergebruikt dezelfde CRS-prefill voor klantnummer en notitie.
- Tijdens een actief TCC-verzoek wordt de CRS-notitie live gesynchroniseerd; na een lokale template-aanpassing kies je expliciet of de nieuwe CRS-notitie de template-notitie mag overschrijven.
- Met de compacte `📸`-knop bij elk rich-text veld maak je in de CRS-sidebar zonder toetsenbord een screenshot van het zichtbare CRS-venster; de sidebar wordt tijdelijk verborgen, de afbeelding wordt direct aan het gekozen veld toegevoegd en is via het kleine `×`-kruis rechtsboven met de muis te verwijderen.
- In extension mode is de template direct als ingeklapt in-app zijpaneel beschikbaar, zonder aparte startknop in CRS.
- Docking-ondersteuning voor zijpaneel (links, rechts, boven, onder) met bewaarde positie.
- Drag-to-dock: sleep de blauwe sidebar-header om live te docken naar links, rechts, boven of onder.
- Sidebar toggle-tab om snel te verbergen/tonen zonder context te verliezen.
- De open of ingeklapte paneelstatus blijft per CRS-browsertab behouden na een paginareload of navigatie via de linker CRS-navigatie, ook wanneer CRS zijn eigen sessieopslag wist.
- Pop-out knop (`↗`) om de template los in een apart venster te openen.
- Dock mode persistence: onthoudt de laatst gebruikte dock-positie.
- SPA-resilience: het ingeklapte paneel wordt automatisch hersteld bij dynamische CRS redraws en vervanging van de CRS-body.
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
- Veilig geplakte rich text behoudt tabellen en gangbare tekstformattering voor consistente Teams-output; onveilige HTML, externe afbeeldingen en actieve links worden verwijderd.
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
- Het blauwe toggle-uitsteekseltje opent en sluit hetzelfde reeds geladen iframe zonder de template opnieuw te initialiseren.
- Bewaart ingevulde templatevelden en screenshots tijdelijk per browsertab en bevestigd klantnummer. Een andere of tijdelijke klantcontext krijgt geen eerdere invoer; terugkeren naar dezelfde klant herstelt alleen diens draft.
- Na een CRS-paginareload gebruikt dezelfde browsertab hetzelfde draft-ID, zodat invoer voor dezelfde klant automatisch terugkomt.
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
- Single source of truth: bewerk de bronbestanden in `extension/`, waaronder `template.html`, `script.js`, `inject.js`, `background.js` en `manifest.json`.
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

### New in v5.0.4
- Drafts are stored locally per CRS browser tab and confirmed customer number. After switching between customers, text fields and screenshots return only for the matching customer.
- A temporary CRS context without a customer number shows no previous customer data and cannot automatically delete, or delete through `Clear`, a customer draft.

### New in v5.0.3
- CRS clears its own session storage during some left-navigation transitions. Template Helper therefore now stores the draft ID and open/collapsed state per actual Chrome tab in isolated extension storage.
- Text fields and screenshots remain in local IndexedDB storage and are restored for the same customer using the retained draft ID.

### New in v5.0.2
- Template Helper's open or collapsed state is preserved per CRS browser tab after a full page reload or navigation through the left CRS navigation bar.
- The same tab reuses the same draft ID for the same customer, automatically restoring previously entered text fields and screenshots from the local draft.

### New in v5.0.1
- Template Helper automatically loads collapsed on every supported CRS page; the blue toggle tab is the only control needed to open the already loaded panel.
- The panel recovers after dynamic CRS content replacement and refreshes the customer prefill when CRS switches to another customer within the same document.

### New in v4.3.3
- A draft for the same customer is retained when CRS temporarily provides no customer number or cannot load the template. The temporary page shows no customer data and cannot automatically change or delete the retained draft.
- `Clear` intentionally removes a retained draft even from that temporary contextless page.

### New in v4.3.2
- Wide pasted tables stay inside the preview area. Use the horizontal scrollbar directly at the table; the sidebar and remaining preview stay within their width.
- Teams/clipboard output retains the original table without preview-specific wrappers or scrollbar styles.

### New in v4.3.1
- Safe pasting from CRS and Teams now retains tables, cell formatting, lists, and emphasis in every rich-text field; unsafe HTML, external images, and active links are removed.
- The screenshot button is now available for every rich-text field. Removing screenshots leaves no extra whitespace and remains compatible with older temporary drafts.

### New in v4.3.0
- Filled fields and screenshots are temporarily preserved within the same CRS browser tab and restored when you open `Vraag maken` again for the same customer.
- A new customer number, or a transition to or from an empty customer number, deliberately clears the old draft so customer data cannot carry over to another context.
- Restored input is validated safely and automatically expires after 24 hours. `Where are you stuck` now clarifies that it refers to the script.

### Full feature set
- Four template views: V&A `Question Template` and `Answer Template`, plus TCC `Ticket Check Request` and `Ticket Check Answer`.
- A compact domain switch changes between Technical Knowledge Q&A and Ticket Check Chat (TCC); the existing template button switches between request and answer within the active domain.
- Works as a Chrome extension in CRS and as standalone HTML outside CRS.
- Loads automatically on every supported CRS page and starts collapsed; only the existing blue toggle tab remains visible to expand the already loaded panel.
- Automatically reads `Customer number` and note context from CRS and pre-fills relevant template fields.
- TCC request reuses the same CRS prefill for customer number and note.
- During an active TCC request, the CRS note stays synchronized live; after a local template edit, users explicitly choose whether a newer CRS note may overwrite the template note.
- The compact `📸` button at every rich-text field captures the visible CRS window from the CRS sidebar without keyboard input; the sidebar is briefly hidden, the image is added directly to the selected field, and the small top-right `×` control removes it with the mouse.
- In extension mode, the template is immediately available as a collapsed in-app sidebar without a separate CRS launch button.
- Sidebar docking support (left, right, top, bottom) with persisted dock position.
- Drag-to-dock: drag the blue sidebar header to dock live to left, right, top, or bottom.
- Sidebar toggle tab for fast hide/show without losing context.
- The open or collapsed panel state is preserved per CRS browser tab across page reloads and left-navigation transitions, even when CRS clears its own session storage.
- Pop-out button (`↗`) to open the template in a detached window.
- Dock mode persistence: remembers last used dock placement.
- SPA resilience: the collapsed panel auto-recovers after dynamic CRS redraws and CRS body replacement.
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
- Safe rich-text paste retains tables and common text formatting for consistent Teams output; unsafe HTML, external images, and active links are removed.
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
- The blue toggle tab opens and closes the same loaded iframe without reinitializing the template.
- Temporarily preserves filled template fields and screenshots per browser tab and confirmed customer number. A different or temporary customer context receives no earlier input; returning to the same customer restores only that customer's draft.
- After a CRS page reload, the same browser tab reuses its draft ID so input for the same customer is restored automatically.
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
- Single source of truth: edit source files in `extension/`, including `template.html`, `script.js`, `inject.js`, `background.js`, and `manifest.json`.
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
