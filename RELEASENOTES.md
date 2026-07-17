# v4.3.0 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `4.3.0` en toont `4.3.0` als zichtbare versie.

## Nederlandse versie

### Changelog v4.3.0
- **Draftbehoud per tab:** Ingevulde V&A- en TCC-templates blijven tijdelijk beschikbaar wanneer je in dezelfde CRS-browsertab opnieuw `Vraag maken` opent. Tekst, wachtrij, checkboxen en screenshots worden hersteld.
- **Veilige klantcontext:** Een draft wordt alleen teruggezet voor hetzelfde klantnummer. Bij een ander klantnummer, of bij de overgang tussen een ingevuld en leeg klantnummer, wordt de vorige draft gewist.
- **TCC-live-notitie:** De bestaande live-synchronisatie en conflictdialoog voor de CRS-notitie blijven werken naast herstelde drafts.
- **Veilige tijdelijke opslag:** Herstelde invoer en screenshots worden gevalideerd en geschoond. Verlopen drafts worden na 24 uur automatisch verwijderd.
- **Duidelijker label:** `Waar loop je vast` is aangepast naar `Waar loop je vast (in het script)`; de Engelse interface gebruikt `Where are you stuck (in the script)`.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v4.3.0/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v4.3.0
- **Per-tab drafts:** Filled V&A and TCC templates remain temporarily available when you open `Vraag maken` again in the same CRS browser tab. Text, queues, switches, and screenshots are restored.
- **Safe customer context:** A draft is restored only for the same customer number. Changing the customer number, or transitioning between a populated and empty customer number, clears the previous draft.
- **Live TCC note:** The existing CRS live-note synchronization and conflict dialog continue to work alongside restored drafts.
- **Safe temporary storage:** Restored input and screenshots are validated and sanitized. Expired drafts are removed automatically after 24 hours.
- **Clearer label:** `Waar loop je vast` is now `Waar loop je vast (in het script)`; the English interface uses `Where are you stuck (in the script)`.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v4.3.0/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*