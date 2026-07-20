# v5.0.5 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.5` en toont `5.0.5` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.5
- **Draft blijft zichtbaar op ticketpagina's:** CRS gebruikt op Scripting `.ut_DFI_EL_PARTY_ID` en op Ticket `.ut_CUSTOMER_ID` voor dezelfde klantcode. Template Helper behandelt beide velden nu als aliases, zodat dezelfde klantcontext en draft actief blijven.
- **Oud gedrag blijft werken:** De bestaande scriptingselector blijft ondersteund en klantcodes van onder andere vijf cijfers worden niet afgewezen.
- **Veilig bij tijdelijke conflicten:** Als beide CRS-velden tegelijk verschillende klantcodes tonen, opent Template Helper geen van beide klantdrafts totdat de context weer eenduidig is.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.5/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.5
- **Draft remains visible on ticket pages:** CRS exposes the same customer code as `.ut_DFI_EL_PARTY_ID` on Scripting and `.ut_CUSTOMER_ID` on Ticket. Template Helper now treats both fields as aliases, preserving the same customer context and draft.
- **Existing behavior remains supported:** The original scripting selector continues to work, and customer codes including five-digit values are not rejected.
- **Safe during temporary conflicts:** If both CRS fields temporarily show different customer codes, Template Helper opens neither customer draft until the context is unambiguous again.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.5/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*