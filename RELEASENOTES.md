# v5.0.4 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.4` en toont `5.0.4` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.4
- **Drafts blijven per klant gescheiden:** Binnen dezelfde CRS-browsertab worden drafts nu afzonderlijk per bevestigd klantnummer bewaard. Na meerdere CRS-wisselingen komen tekstvelden en screenshots alleen terug bij de bijbehorende klant.
- **Tijdelijke CRS-contexten zijn niet-destructief:** Een pagina zonder klantnummer toont geen eerdere klantgegevens en kan geen klantdraft automatisch of via `Wissen` verwijderen.
- **Veilige upgrade:** Een bestaande v5.0.3-draft migreert alleen wanneer het klantnummer exact overeenkomt. Alle templategegevens en screenshots blijven lokaal in IndexedDB.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.4/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.4
- **Drafts remain isolated per customer:** Within the same CRS browser tab, drafts are now stored separately per confirmed customer number. After repeated CRS switches, text fields and screenshots return only for the matching customer.
- **Temporary CRS contexts are non-destructive:** A page without a customer number shows no previous customer data and cannot automatically delete, or delete through `Clear`, a customer draft.
- **Safe upgrade:** An existing v5.0.3 draft is migrated only when its customer number is an exact match. All template data and screenshots remain local in IndexedDB.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.4/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*