# v5.0.6 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie. Deze definitieve release gebruikt Chrome-manifestversie `5.0.6` en toont `5.0.6` als zichtbare versie.

## Nederlandse versie

### Changelog v5.0.6
- **Draft blijft zichtbaar op actiepagina's:** CRS gebruikt in Acties het inputveld `#IWEDIT_KLANTCODE` voor de klantcode. Template Helper leest de inputwaarde naast de bestaande Scripting- en Ticket-aliases.
- **Oud gedrag blijft werken:** De bestaande selectors en klantcodeformaten blijven ondersteund, inclusief klantcodes van vijf cijfers.
- **Veilig bij tijdelijke conflicten:** Als CRS-velden tegelijk verschillende klantcodes tonen, opent Template Helper geen klantdraft totdat de context weer eenduidig is.

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v[versie].html` en open dit direct in je browser.

### Volledig feature-overzicht
Alle huidige features staan in de root README:
https://github.com/m0nk111/template-helper/blob/v5.0.6/README.md

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v5.0.6
- **Draft remains visible on action pages:** CRS exposes the customer code in Actions through the `#IWEDIT_KLANTCODE` input. Template Helper reads its value alongside the existing Scripting and Ticket aliases.
- **Existing behavior remains supported:** Existing selectors and customer-code formats continue to work, including five-digit values.
- **Safe during temporary conflicts:** If CRS fields temporarily show different customer codes, Template Helper opens neither customer draft until the context is unambiguous again.

### Installation Instructions
1. Download the `.zip` file and extract it
2. Open `chrome://extensions/` in Chrome
3. Enable the **Developer mode** toggle in the top-right corner
4. Click **Load unpacked**
5. Select the extracted folder

Or download `standalone-template-v[version].html` and open it directly in your browser.

### Complete Feature Overview
For the complete feature set, see the root README:
https://github.com/m0nk111/template-helper/blob/v5.0.6/README.md

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*