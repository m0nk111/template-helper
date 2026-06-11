# v4.1.1 Release Notes

## Nederlandse uitleg
Deze release notes bevatten eerst de Nederlandse versie en daarna de Engelse versie.
Als je al een oudere versie van de extensie hebt geinstalleerd, verwijder die eerst om conflicten te voorkomen.

## Nederlandse versie

### Changelog v4.1.1
- **Vertaling endpoint beveiligd:** De vertaalfunctie achter de taalswitch-knop is nu beschermd tegen de bekende limieten van `translate.googleapis.com/translate_a/single`.
- **5000-tekens grens afgevangen:** Lange teksten worden proactief opgesplitst in veilige delen voordat er een request wordt verstuurd, zodat `HTTP 400` op te grote payloads wordt voorkomen.
- **Rate-limit bescherming (`429`):** Vertaalverzoeken lopen via een queue met throttle, retry + backoff en een tijdelijke cooldown bij misbruikdetectie, zodat de UI stabiel blijft.
- **Graceful error handling:** Bij `429`, netwerkfouten of tijdelijke blokkades krijgt de gebruiker duidelijke status/toast feedback in plaats van een crash of vastlopende flow.

### Changelog v4.1.0
- **Internationale taalrotatie:** Uitgebreide taalcatalogus toegevoegd in het taalmenu, met checkboxen voor actieve talen in de rotatie.
- **Long-press taalmenu:** De taal-knop ondersteunt nu een 2-seconden long press om het taalmenu te openen. Een korte druk blijft de normale taalwissel + vertaalflow uitvoeren.
- **EN-only shortpress vertaling:** Als alleen `EN` actief staat en je invoer in een andere taal is (bijvoorbeeld Chinees, Swahili of iets anders), vertaalt een korte druk op de taal/vertaal-knop de ingevulde inhoud altijd naar Engels.
- **UI-taalbeleid vereenvoudigd:** Standaard UI-teksten (labels, toasts, regels, hints) blijven nu in Nederlands of Engels. Voor niet-NL/EN-doeltalen blijft de UI in het Engels, terwijl formulierinhoud wel wordt vertaald.
- **Standaard actieve talen:** Nieuwe installaties starten met alleen `NL` en `EN` actief in de taalrotatie.
- **Thema update:** Light mode is nu het standaardthema, terwijl de laatste opgeslagen keuze (`light` of `dark`) nog steeds automatisch wordt hersteld.
- **Release artifact update:** Standalone release artifact `standalone-template-v4.1.0.html` gegenereerd.

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

### Probleem ontdekt?
Heb je een probleem ontdekt? Het makkelijkste is om hier op GitHub even een issue aan te maken. Op die manier kunnen we het probleem gestructureerd onderzoeken en oplossen!

---
*Deze tool is gebouwd in samenwerking met Mark B. (m0nk111) en Davey G. (windhoos).*

## English version

### Changelog v4.1.1
- **Translation endpoint hardening:** The translation flow behind the language switch button is now protected against known limits of `translate.googleapis.com/translate_a/single`.
- **5000-character guardrail:** Long input is proactively split into safe chunks before requests are sent, preventing direct `HTTP 400` failures on oversized payloads.
- **Rate-limit protection (`429`):** Translation requests now run through a throttled queue with retry + backoff and temporary cooldown behavior when abuse detection triggers.
- **Graceful error handling:** On `429`, network failures, or temporary blocks, users get clear status/toast feedback instead of UI crashes or stuck flows.

### Changelog v4.1.0
- **International language rotation:** Added a broad language catalog in the language menu, with checkbox-based selection for which languages are active in rotation.
- **Long-press language menu:** The language button now supports a 2-second long press to open the language menu. A short press still performs the normal language switch + content translation flow.
- **EN-only short-press translation:** If only `EN` is enabled and you type content in another language (for example Chinese, Swahili, or any other language), a short press on the language/translate button will always translate the filled content to English.
- **UI language policy simplified:** Standard UI text (labels, toasts, rules, hints) now stays in Dutch or English only. For non-NL/EN targets, the UI stays in English while form content is translated to the selected target language.
- **Default active languages:** New setups now start with only `NL` and `EN` enabled in language rotation.
- **Theme behavior update:** Light mode is now the default visual theme, while the last saved theme (`light` or `dark`) is still restored automatically.
- **Release artifact update:** Generated standalone release artifact `standalone-template-v4.1.0.html`.

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

### Found an issue?
If you discovered an issue, the easiest way is to open an issue on GitHub. That helps us investigate and solve it in a structured way.

---
*This tool was built in collaboration with Mark B. (m0nk111) and Davey G. (windhoos).*