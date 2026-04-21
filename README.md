# Delta Vraag en Antwoord Template Helper

Je hebt twee manieren om dit lokaal te gebruiken:
1. **Optie 1: De Browser Extensie (Aanbevolen, makkelijkst)** - Installeren via developer mode.
2. **Optie 2: De Bookmarklet (Klassiek)** - Een stukje code in je bladwijzerbalk plakken.

---

## 🚀 Optie 3: Publiceren via de Chrome Web Store (De échte manier)

We kunnen deze extensie in zijn geheel publiceren in the officiële Google Chrome Store voor het team. Dat lost alle update- en installatieproblemen in één keer op; collega's hoeven niet meer aan the kloten met zipjes, en als jij de code updatet rollen de updates automatisch the browsers in!

**Hoe publiceer je dit in the Store?**

1. Maak een Google Developer Account aan ($5 eenmalig) op de [Chrome Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).
2. Druk op **Nieuw Item toevoegen**.
3. Upload de zip file die onze eigen `pack.sh` zojuist heeft gegenereerd in the `ext-deploy/` map (bijv. `mod-helper-[commit-hash].zip`). Deze Zip is al **100% Store CWS-Ready** (inclusief correct Manifest V3 structuur en icoontjes)!
4. Vul The titel, beschrijving (Delta Vraag en Antwoord Template Helper), en wat screenshots in.
5. Verstuur hem ter verificatie (Review duurt meestal een paar uur tot 2 dagen). 
6. Zodra het gepubliceerd is, deel je the linkje the The moderator team. Iedereen the installeert, krijgt updates vanaf nu the auto-magic in Chrome.

Blijf the code hiërarchie simpel houden in GitHub, the pack script regelt de rest! 

---

## 💻 Optie 1: Lokale Chrome Extensie (Lokaal the testen / Developer Mode)

In plaats van handmatig te kloten met Windows mappen of bookmarklets, is er een kant-en-klare Chrome Extensie (Manifest V3) gemaakt!

**Installatie via Developer Mode (Chrome / Edge):**

1. Open je browser en ga naar Extensions (via `chrome://extensions/` of `edge://extensions/`).
2. Zet de switch **Ontwikkelaarsmodus** (Developer mode) rechtsboven AAN.
3. Klik op **Uitgepakte extensie laden** (Load unpacked).
4. Pak de zip file `ext-deploy/mod-helper-[commit-hash].zip` uit in een map op je computer. Selecteer deze **uitgepakte map** in Chrome (Chrome accepteert hier namelijk géén losse .zip bestanden).
5. Je ziet nu het "Delta Vraag en Antwoord Template Helper" icoontje (als puzzelstukje) in je browser balk verschijnen. Zet hem eventueel vast (pin) in de balk.

**Hoe het werkt:**
- Zorg dat je op een Klantkaart zit en dat je scherm klopt.
- Klik op de extensie-knop in de menubalk.
- De plug-in leest razendsnel de `Klantcode` & `Notitie` uit de pagina.
- Hij opent een nieuwe tab en laadt de meegeleverde `template.html` IN de browser (`chrome-extension://...`) met de velden al voor je ingevuld.

---

## 🔖 Optie 2: De Bookmarklet (Klassiek)

De Bookmarklet is een slim stukje Javascript-code verpakt als een browser-bladwijzer.
1. Haalt het **Klantnummer** en de **Notitie** op uit het systeem.
2. Opent jouw opgeslagen `template.html` bestand in een nieuw tabblad.

### Installatie Instructies

**Stap 1: Bepaal jouw Template URL**
Standaard gaat de code er vanuit dat je het `template.html` bestand in je **Downloads** map hebt opgeslagen.
Vervang in de code hieronder `JOUW_NAAM` door je eigen Windows gebruikersnaam.
Voorbeeld: `file:///C:/Users/JOUW_NAAM/Downloads/template.html`.
Heb je het ergens gehost, dan is het bijvoorbeeld: `https://jouwdomein.nl/template.html`.

**Stap 2: Maak de Bladwijzer (Bookmark)**
1. Laat je Bladwijzerbalk / Favorietenbalk zien in je browser (Shift + CTRL + B).
2. Klik met de rechtermuisknop op die balk en kies **Pagina toevoegen** (Add Page).
3. Geef het als naam bijvoorbeeld: `Naar Template`.
4. Plak bij het veld **URL** (of Webadres) de onderstaande Bookmarklet Code. 
5. Vergeet niet je eigen Windows gebruikersnaam in te vullen op de plek van `JOUW_NAAM`.
6. Klik op **Opslaan**.

---

### De Bookmarklet Code

Kopieer dit volledige blokje in het URL-veld van je bladwijzer. Dit is een ingekorte versie van het script, specifiek bedoeld voor bookmarks.

```javascript
javascript:(function(){var k=document.querySelector('.ut_DFI_EL_PARTY_ID'),n=document.getElementById('IWMEMO_SCRIPT_EIGENINPUT'),u='file:///C:/Users/JOUW_NAAM/Downloads/template.html';window.open(u+'?klantnummer='+(k?encodeURIComponent(k.innerText.trim()):'')+'&klantvraag='+(n?encodeURIComponent(n.value.trim()):''),'_blank');})();
```

---

## Hoe te gebruiken?
1. Je bent aan het werk op een actieve klantkaart.
2. Je typt je notitie/probleem in het notitieveld (als je dat wilt meenemen).
3. Klik in je bladwijzerbalk in je browser op **Naar Template**.
4. Een nieuw tabblad opent direct de template, netjes ingevuld en klaar om the kopiëren voor Moderator!

## Werking van de code (leesbaar)
Voor de volledigheid, dit is hoe de originele, leesbare Javascript code eruitziet:

```javascript
javascript:(function(){
    /* 1. Klantnummer ophalen uit ut_DFI_EL_PARTY_ID */
    var klnrEl = document.querySelector('.ut_DFI_EL_PARTY_ID');
    var klantnummer = klnrEl ? encodeURIComponent(klnrEl.innerText.trim()) : '';

    /* 2. Notitie (klantvraag) ophalen uit IWMEMO_SCRIPT_EIGENINPUT */
    var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
    var klantvraag = notitieEl ? encodeURIComponent(notitieEl.value.trim()) : '';

    /* 3. Link naar jouw eigen template (Standaard in de Downloads map) */
    var url = 'file:///C:/Users/JOUW_NAAM/Downloads/template.html';

    /* 4. Open in nieuw tabblad met argumenten */
    window.open(url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag, '_blank');
})();
```
