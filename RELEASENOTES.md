# v5.0.7 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.7` en toont `5.0.7` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.7
- **Notitie synchroniseert naar CRS:** De Notitie in Ticketcontrole Verzoek wordt nu naar CRS-notitieveld `#IWMEMO_SCRIPT_EIGENINPUT` geschreven.
- **Normaal typen, geen aparte Enter-logica:** Gewone invoer wordt na 300 ms als laatste versie gesynchroniseerd. Enter en Ctrl+Enter hebben geen nieuwe of afwijkende synchronisatiehandeling; bestaande sneltoetsen blijven intact.
- **Veilig afgebakend:** Alleen Ticketcontrole Verzoek mag de CRS-notitie bijwerken. De template- en CRS-zijde valideren bron, origin, berichtstructuur en notitielengte; een programmatische CRS-write wordt niet teruggestuurd als echo.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.7/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.7
- **Note synchronizes to CRS:** The Note in Ticket Check Request now writes to the CRS note field `#IWMEMO_SCRIPT_EIGENINPUT`.
- **Normal typing, no separate Enter behavior:** Ordinary input synchronizes the latest value after 300 ms. Enter and Ctrl+Enter have no new or special synchronization behavior; existing shortcuts remain intact.
- **Safely scoped:** Only Ticket Check Request may update the CRS note. Both sides validate the source, origin, message structure, and note length; a programmatic CRS write is not echoed back to the template.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.7/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*