# Privacybeleid - Moderator Template Helper

**Laatst bijgewerkt:** 3 augustus 2026

De "Moderator Template Helper" Chrome-extensie hecht grote waarde aan uw privacy. De extensie draait lokaal in uw browser en gebruikt gegevens alleen om het vraag- en antwoordtemplate te vullen.

### 1. Lokale gegevensverwerking
De extensie kan lokaal gegevens uit het CRS-scherm lezen, zoals klantnummer en de tekst die u zelf in het notitieveld heeft ingevuld. Deze gegevens worden alleen gebruikt om het template in de zijbalk of het losse templatevenster vooraf in te vullen.

De extensie bewaart lokaal enkele gebruikersinstellingen in de browser, zoals de gekozen licht/donker-modus, dockpositie en laatst gebruikte template-modus. Ingevulde templatevelden en screenshots worden tijdelijk per browsertab en bevestigd klantnummer in lokale IndexedDB-opslag bewaard en verlopen automatisch na 24 uur. Een tijdelijke CRS-pagina zonder klantnummer herstelt of verwijdert geen klantdraft.

Om navigatie binnen dezelfde CRS-browsertab te herkennen, bewaart de extensie in afgeschermde Chrome-extensieopslag alleen een willekeurig draft-ID en de open/ingeklapte paneelstatus. Deze tabstatus bevat geen klantnummer of template-inhoud, is niet toegankelijk voor CRS-scripts en wordt verwijderd wanneer de browsertab wordt gesloten. Alle lokale instellingen en drafts blijven op uw eigen apparaat.

### 2. Gegevens delen
Wij verzenden, delen of verkopen geen CRS- of gebruikersgegevens aan derden. De extensie bevat geen analytics, tracking, advertenties of externe scripts.

Bij het openen controleert de extensie eenmaal via de publieke GitHub Releases API of er een nieuwere stabiele versie beschikbaar is. Die anonieme, alleen-lezen aanvraag bevat geen CRS-inhoud, templategegevens, klantnummers, andere identificerende gegevens, inloggegevens of referrer. Alleen de openbare releasetag wordt gebruikt om een kleine updatebel te tonen. GitHub kan technische verbindingsgegevens, zoals uw IP-adres, verwerken volgens zijn eigen privacybeleid.

### 3. Toestemmingen
De templateknop en inhoudscripts draaien alleen op het CRS-portaal. De beperkte toestemming `storage` wordt uitsluitend gebruikt voor de extensie-eigen tabstatus en lokale instellingen. Voor de door de gebruiker gestarte screenshotfunctie moet Chrome de algemene capturebevoegdheid toestaan; de extensie accepteert screenshotverzoeken in code uitsluitend van het actieve CRS-tabblad. Er wordt niet meegelezen met andere websites of browseractiviteiten.

### Contact
Voor vragen over dit privacybeleid of de broncode, kunt u terecht op onze GitHub repository.
