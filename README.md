# Delta Vraag en Antwoord Template Helper

Welkom bij de **Delta V&A Template Helper**! Deze Chrome extensie is speciaal gebouwd voor het team om overtypen en kopieerfoutjes te voorkomen bij het aanmaken van vragen voor de Moderator.

Zodra je in ons systeem (CRS) aan het werk bent, injecteert deze tool volautomatisch een handige blauwe **"Vraag maken"** knop direct op je scherm.

### 🚀 Installatie Instructies (Voor Gebruikers)

**Let op:** Deze extensie ligt op dit moment ter goedkeuring bij Google. Zolang we daarop wachten kan je handmatig installeren:

#### 💻 Optie 1: Chrome Extensie (Aanbevolen)
1. Download de nieuwste `template-helper-<hash>.zip` of `mod-helper-<hash>.zip` via de **[GitHub Releases pagina](https://github.com/m0nk111/template-helper/releases/latest)**.
2. **Pak deze `.zip` file uit** in een specifieke map op je computer.
3. Open Chrome en blader naar `chrome://extensions/`.
4. Zet **Ontwikkelaarsmodus (Developer mode)** AAN rechtsboven.
5. Klik op **Uitgepakte extensie laden (Load unpacked)** linksbovenin en selecteer de uitgepakte map.

#### 📄 Optie 2: Standalone HTML Pagina
Heb je geen mogelijkheid om Chrome extensies te installeren of heb je de zijbalk overlay niet per sé nodig? Er is ook een "Standalone Formaat". 
1. Download via **[GitHub Releases pagina](https://github.com/m0nk111/template-helper/releases/latest)** de `standalone-template.html` file (staat in de `release/` map).
2. Open dit bestand in willekeurig welke webbrowser. Je hebt dan meteen alle invulvelden, de tekstopmaak (bolding), kopieer knop e.d.

#### 🌐 Optie 3: Chrome Web Store
Zodra de beoordeling door Google is afgerond, vervalt al het bovenstaande gedoe. Je klikt dan simpelweg op "Toevoegen aan Chrome" in de Web Store.

---

### Hoe werkt het?

1. Je bent aan het werk in het Klantportaal (CRS).
2. Typ je probleem/notitie in het tekstveld, net zoals je normaal doet.
3. Klik op de blauwe knop **"Vraag maken"** (deze knop staat direct boven het tekstveld).
4. De tool leest direct de `Klantcode` en jouw `Notitie` uit. Vervolgens schuift er direct in je scherm (als een handige zijbalk aan de rechterkant) het V&A-formulier naar binnen.
5. In deze nieuwe zijbalk is de Moderator V&A Template al perfect voor je ingevuld. Doordat deze gewoon *in* je eigen CRS scherm weergave gemonteerd is, raak je hem nooit kwijt onder andere vensters en kun je makkelijk teksten heen en weer vergelijken of kopiëren! Je klikt deze template simpelweg rechtsbovenin de zijbalk weer weg ("Sluiten") als je klaar bent.
6. **Handig!** Bij het aanklikken van de Kopieer knop, worden alle labels voor de dubbele punt **automatisch dikgedrukt (bold)** naar je klembord gezet (bijv. **Wachtrij:** etc.).

---
---

## 🛠️ Developer Informatie (Voor Beheerders)

*Dit gedeelte is alleen relevant voor beheerders die de broncode willen aanpassen.*

### Structuur & CI/CD
Deze extensie wordt volautomatisch gebouwd en uitgerold via **GitHub Actions**. Zodra code wordt geüpdatet op de `master` branch en er een nieuwe **Release** wordt aangemaakt in GitHub, zal de CI/CD pijplijn:
1. `pack.sh` aftrappen om alles te bundelen en irrelevante files uit te sluiten.
2. Via de Google Chrome Web Store API de nieuwste `.zip` indienen en publiceren in de Chrome Store.

### Single Source Of Truth (belangrijk)
Om dubbel werk en versie-drift te voorkomen:
1. Pas alleen bestanden aan in `extension/template.html` en `extension/script.js`.
2. `standalone-template.html` wordt automatisch gegenereerd via `build-standalone.sh`.
3. `pack.sh` roept deze stap automatisch aan, zodat release ZIP en standalone altijd op 1 lijn blijven.
4. Build artifacts (ZIP + `standalone-template.html`) komen in de map `release/`.
5. PNG assets (screenshots, icon) staan in `assets/`.

### Lokaal Testen
Wil je aan de code sleutelen zonder dat het meteen in de Store belandt?
1. Check de code uit via Git.
2. Open Chrome en ga naar `chrome://extensions/`.
3. Zet **Ontwikkelaarsmodus** aan (rechtsboven).
4. Klik op **Uitgepakte extensie laden** en selecteer de `/extension` map uit deze code.
5. Je kunt nu lokaal je javascript/html aanpassingen realtime testen op het portaal.
