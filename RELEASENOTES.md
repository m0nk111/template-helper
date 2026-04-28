### Changelog v2.1.9

- **iFrame Klembord Permissies gefixed:** Kopiëren werkte helemaal niet meer in specifieke web-omgevingen omdat in Chrome Extensions het nieuwe *moderne* Klembord API (Clipboard-write) standaard geblokkeerd is zonder expliciete attributies op de ingesloten Extensie-Scherm (Permissions policy violation). Dit lost het probleem met de rode klembord API timeout waarschuwingen op!
- **Fallback Reparatie:** Omdat het oude klembord faalde, voerde de code zijn *noodkopieersysteem* (verstopt veld in scherm selecteren, document.execCommand) uit zonder op de pagina terug verbonden te zijn (`addRange` errors). Dit is nu weer teruggebracht én is de foute Witte Achtergrond op lichte-modus nu afgevangen!

### Installatie Instructies
1. Download het `.zip` bestand en pak het uit
2. Ga in Chrome naar `chrome://extensions/`
3. Zet rechtsboven de slider op Developer mode (Ontwikkelaarsmodus) aan
4. Klik op Load unpacked (Uitgepakte extensie laden)
5. Selecteer de uitgepakte map

Of download `standalone-template-v2.1.9.html` en open dit direct in je browser.

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*
