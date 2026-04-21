# Delta Vraag en Antwoord Template Helper

Welkom bij de **Delta V&A Template Helper**! Deze Chrome extensie is speciaal gebouwd voor het team om overtypen en kopieerfoutjes te voorkomen bij het aanmaken van vragen voor de Moderator.

Zodra je in ons systeem (CRS) aan het werk bent, injecteert deze tool volautomatisch een handige blauwe **"Vraag / Antwoord Maken"** knop direct op je scherm.

### 🚀 Installatie Instructies (Voor Gebruikers)

Omdat de extensie in de officiële Chrome Web Store staat, is installeren een fluitje van een cent:

1. Ga naar de officiële [Chrome Web Store pagina](https://chrome.google.com/webstore/detail/hpbpojapeangpogedgcobiipmhebcjcn).
2. Klik op **Toevoegen aan Chrome** (Add to Chrome).
3. Bevestig de pop-up door op **Extensie toevoegen** te klikken.
4. Klaar! Je hoeft verder niets in te stellen. Zodra je het CRS portaal opent, verschijnt de knop vanzelf op de juiste plek.

*(Wanneer er in de toekomst updates zijn, zal Google Chrome deze automatisch op de achtergrond voor je installeren. Je werkt dus altijd met de nieuwste versie!)*

---

### Hoe werkt het?

1. Je bent aan het werk in het Klantportaal (CRS).
2. Typ je probleem/notitie in het tekstveld, net zoals je normaal doet.
3. Klik op de blauwe knop **"Vraag / Antwoord Maken"** (deze knop staat direct boven het tekstveld).
4. De tool leest direct de `Klantcode` en jouw `Notitie` uit, en opent direct een nieuw scherm.
5. In dat nieuwe scherm is de Moderator V&A Template al perfect voor je ingevuld en klaar om te versturen!

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
