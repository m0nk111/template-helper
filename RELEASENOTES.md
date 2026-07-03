# v4.1.2 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie.
Als je al een oudere versie van de extensie hebt geinstalleerd, verwijder die eerst om conflicten te voorkomen.

## Nederlandse versie

### Changelog v4.1.2
- **Bugfix Enter-toets:** Een gewone `Enter` in een tekstveld (`Klantvraag`, `Vastloper`, `Gewenste uitkomst`, `Antwoord`, `Bron`, `Vervolgstap`) maakte tot nu toe een geneste `<div>` aan. Daardoor konden regeleinden "stapelen" (extra lege regels) bij bewerken, vertalen of kopieren. `Enter` gedraagt zich nu identiek aan `Shift+Enter` en voegt altijd een enkele nette regelafbreking toe.
- **Bugfix plakken:** Meerdere regels plakken gaf hetzelfde stapel-probleem; geplakte regeleinden worden nu op dezelfde consistente manier ingevoegd als getypte regeleinden.

### Changelog v4.1.1
- **Vertaling endpoint beveiligd:** De vertaalfunctie achter de taalswitch-knop is nu beschermd tegen de bekende limieten van `translate.googleapis.com/translate_a/single`.
- **5000-tekens grens afgevangen:** Lange teksten worden proactief opgesplitst in veilige delen voordat er een request wordt verstuurd, zodat `HTTP 400` op te grote payloads wordt voorkomen.
- **Rate-limit bescherming (`429`):** Vertaalverzoeken lopen via een queue met throttle, retry + backoff en een tijdelijke cooldown bij misbruikdetectie, zodat de UI stabiel blijft.
- **Graceful error handling:** Bij `429`, netwerkfouten of tijdelijke blokkades krijgt de gebruiker duidelijke status/toast feedback in plaats van een crash of vastlopende flow.
- **Template mode bugfix:** Taalwissel verandert niet langer onbedoeld tussen `Vraag` en `Antwoord`; de huidige template mode blijft nu stabiel bij language switch.

### Upgrade Instructies
1. Ga in Chrome naar `chrome://extensions/`
2. Zoek de oude Template Helper extensie
3. Klik op **Remove (Verwijderen)** en bevestig
4. Ga daarna verder met de installatie-instructies hieronder

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features (niet alleen de nieuwste wijzigingen) staan in de root README:
https://github.com/m0nk111/template-helper/blob/v4.1.2/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v4.1.2
- **Enter key bugfix:** A plain `Enter` in a rich-text field (`Klantvraag`, `Vastloper`, `Gewenste uitkomst`, `Antwoord`, `Bron`, `Vervolgstap`) used to create a nested `<div>`. This caused line breaks to "stack" (extra blank lines) during editing, translation, or copying. `Enter` now behaves identically to `Shift+Enter` and always inserts a single clean line break.
- **Paste bugfix:** Pasting multi-line text had the same stacking issue; pasted line breaks are now inserted the same consistent way as typed line breaks.

### Changelog v4.1.1
- **Translation endpoint hardening:** The translation flow behind the language switch button is now protected against known limits of `translate.googleapis.com/translate_a/single`.
- **5000-character guardrail:** Long input is proactively split into safe chunks before requests are sent, preventing direct `HTTP 400` failures on oversized payloads.
- **Rate-limit protection (`429`):** Translation requests now run through a throttled queue with retry + backoff and temporary cooldown behavior when abuse detection triggers.
- **Graceful error handling:** On `429`, network failures, or temporary blocks, users get clear status/toast feedback instead of UI crashes or stuck flows.
- **Template mode bugfix:** Language switching no longer flips between `Question` and `Answer`; the current template mode now stays stable while switching language.

### Upgrade Instructions
1. Open `chrome://extensions/` in Chrome
2. Locate the old Template Helper extension
3. Click **Remove** and confirm
4. Continue with the installation instructions below

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the full feature set (not only recent changes), see the root README:
https://github.com/m0nk111/template-helper/blob/v4.1.2/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*