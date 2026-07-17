# v5.0.3 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.3` en toont `5.0.3` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.3
- **CRS-sessieopslag kan de draft niet meer wissen:** Sommige CRS-formulierwisselingen wissen hun eigen sessieopslag. Template Helper bewaart het willekeurige draft-ID en de open/ingeklapte paneelstatus nu per echte Chrome-tab in afgeschermde extensieopslag.
- **Invoer komt terug na linker navigatie:** Voor dezelfde klant worden eerder ingevoerde tekstvelden en screenshots opnieuw uit de lokale draft geladen, ook nadat CRS zijn sessieopslag heeft gewist.
- **Beperkte nieuwe opslagtoestemming:** De Chrome-permission `storage` bewaart alleen het draft-ID en de paneelstatus. Klantgegevens, template-inhoud en screenshots blijven lokaal in IndexedDB en worden niet naar extensieopslag gekopieerd.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.3/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.3
- **CRS session storage can no longer erase the draft:** Some CRS form transitions clear their own session storage. Template Helper now keeps the random draft ID and open/collapsed panel state per real Chrome tab in isolated extension storage.
- **Input returns after left navigation:** For the same customer, previously entered text fields and screenshots are loaded again from the local draft even after CRS clears its session storage.
- **Limited new storage permission:** The Chrome `storage` permission stores only the draft ID and panel state. Customer data, template content, and screenshots remain local in IndexedDB and are not copied into extension storage.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.3/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*