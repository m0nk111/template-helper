# v5.0.8 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.8` en toont `5.0.8` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.8
- **Regelafbrekingen zichtbaar in Notitie:** De Notitie in Ticketcontrole Verzoek toont CRS-regelafbrekingen nu ook in het invoerveld zelf. Het voorbeeld werkte al correct.
- **Regels blijven behouden bij synchronisatie:** De terug-synchronisatie naar CRS behoudt regelafbrekingen, inclusief een combinatie van CRS-tekst en handmatig ingevoerde Enter-regels.
- **Geen vals conflict bij echo:** Wanneer CRS dezelfde meerregelige notitie terugstuurt, herkent Template Helper deze als gelijk en opent geen conflictvenster.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.8/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.8
- **Line breaks visible in Note:** The Ticket Check Request Note now shows CRS line breaks in the input field itself. The preview already rendered them correctly.
- **Lines remain intact during synchronization:** Synchronization back to CRS preserves line breaks, including a combination of CRS text and manually entered line breaks.
- **No false conflict on echo:** When CRS returns the same multiline note, Template Helper recognizes it as equal and does not open a conflict dialog.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.8/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*