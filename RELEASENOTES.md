# v5.0.1 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.1` en toont `5.0.1` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.1
- **Altijd geladen in CRS:** Template Helper wordt op iedere ondersteunde CRS-pagina automatisch geladen, zonder een CRS-knop, `Profiel`-element of scriptnotitieveld als startvoorwaarde.
- **Alleen het blauwe uitsteekseltje:** Het paneel start ingeklapt. Het bestaande blauwe uitsteekseltje opent en sluit uitsluitend het reeds geladen paneel, zonder het iframe opnieuw te maken.
- **Herstel en actuele klantcontext:** Na dynamische CRS-contentvervanging bouwt het paneel zichzelf opnieuw op met dezelfde browsertab-draft. Wisselt CRS binnen hetzelfde document naar een andere klant, dan ververst de template automatisch de klantprefill.
- **Toegankelijker bediening:** Het blauwe uitsteekseltje is nu een toetsenbordtoegankelijke knop met zichtbare focus en status voor schermlezers.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.1/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.1
- **Always loaded in CRS:** Template Helper automatically loads on every supported CRS page, without requiring a CRS button, `Profile` element, or script note field as a launch condition.
- **Only the blue toggle tab:** The panel starts collapsed. Its existing blue protruding toggle only opens and closes the already loaded panel without recreating the iframe.
- **Recovery and current customer context:** After dynamic CRS content replacement, the panel rebuilds itself with the same browser-tab draft. When CRS switches to another customer in the same document, the template refreshes its customer prefill automatically.
- **More accessible control:** The blue protruding toggle is now a keyboard-accessible button with visible focus and screen-reader state.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.1/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*