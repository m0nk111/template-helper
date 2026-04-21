# Delta Vraag en Antwoord Template Helper

Welkom bij de **Delta V&A Template Helper**! Deze Chrome extensie is speciaal gebouwd voor het team om overtypen en kopieerfoutjes te voorkomen bij het aanmaken van vragen voor de Moderator.

Zodra je in ons systeem (CRS) aan het werk bent, injecteert deze tool volautomatisch een handige blauwe **"Vraag maken"** knop direct op je scherm.

### 🚀 Installatie Instructies (Voor Gebruikers)

**Let op:** Deze extensie ligt op dit moment ter goedkeuring bij Google. Zolang we daarop wachten, kun je onderstaande instructies volgen om hem nu al werkend te krijgen via een `.zip` bestand. Zodra de goedkeuring rond is, gebruiken we de makkelijke Chrome Web Store link!

#### 🔧 Tijdelijke Methode: Handmatig Installeren (Tot de goedkeuring)
Om de extensie toch al te kunnen gebruiken:

1. Download het nieuwste `.zip` bestand (klik de bovenste release aan) via de **[GitHub Releases pagina](https://github.com/m0nk111/template-helper/releases)**.
2. **Pak deze `.zip` file uit** (Extract) in een willekeurige map op je computer (bijv. in Documenten).
3. Open Google Chrome en typ of plak `chrome://extensions/` in je adresbalk (en druk op Enter).
4. Zet rechtsboven in dat scherm de switch **Ontwikkelaarsmodus** (Developer mode) AAN.
5. Er verschijnt nu een knop **Uitgepakte extensie laden** (Load unpacked) linksboven. Klik hierop.
6. Selecteer de zojuist uitgepakte map op je computer. De extensie is nu toegevoegd en klaar voor gebruik!

#### 🌐 Officiële Methode: Chrome Web Store (Zodra goedgekeurd)
Zodra de beoordeling door Google is afgerond, vervalt al het bovenstaande gedoe:

1. Ga naar de [Chrome Web Store pagina](https://chrome.google.com/webstore/detail/hpbpojapeangpogedgcobiipmhebcjcn).
2. Klik simpelweg op **Toevoegen aan Chrome**.

*(Wanneer er vanaf dat moment in de toekomst updates zijn, zal Google Chrome deze automatisch voor je installeren!)*

---

### Hoe werkt het?

1. Je bent aan het werk in het Klantportaal (CRS).
2. Typ je probleem/notitie in het tekstveld, net zoals je normaal doet.
3. Klik op de blauwe knop **"Vraag maken"** (deze knop staat direct boven het tekstveld).
4. De tool leest direct de `Klantcode` en jouw `Notitie` uit. Vervolgens schuift er direct in je scherm (als een handige zijbalk aan de rechterkant) het V&A-formulier naar binnen.
5. In deze nieuwe zijbalk is de Moderator V&A Template al perfect voor je ingevuld. Doordat deze gewoon *in* je eigen CRS scherm weergave gemonteerd is, raak je hem nooit kwijt onder andere vensters en kun je makkelijk teksten heen en weer vergelijken of kopiëren! Je klikt deze template simpelweg rechtsbovenin de zijbalk weer weg ("Sluiten") als je klaar bent.

---
---

## 🛠️ Developer Informatie (Voor Beheerders)

*Dit gedeelte is alleen relevant voor beheerders die de broncode willen aanpassen.*

### Structuur & CI/CD
Deze extensie wordt volautomatisch gebouwd en uitgerold via **GitHub Actions**. Zodra code wordt geüpdatet op de `master` branch en er een nieuwe **Release** wordt aangemaakt in GitHub, zal de CI/CD pijplijn:
1. `pack.sh` aftrappen om alles te bundelen en irrelevante files uit te sluiten.
2. Via de Google Chrome Web Store API de nieuwste `.zip` indienen en publiceren in de Chrome Store.

### Lokaal Testen
Wil je aan de code sleutelen zonder dat het meteen in de Store belandt?
1. Check de code uit via Git.
2. Open Chrome en ga naar `chrome://extensions/`.
3. Zet **Ontwikkelaarsmodus** aan (rechtsboven).
4. Klik op **Uitgepakte extensie laden** en selecteer de `/extension` map uit deze code.
5. Je kunt nu lokaal je javascript/html aanpassingen realtime testen op het portaal.
