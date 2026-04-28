# Changelog

## [2.1.10] - 2026-04-28
- **Functionaliteit Mijlpaal:** Het kopiëren van screenshots / afbeeldingen is voortaan niet meer gelimiteerd aan de velden `Klantvraag`, `Vastloper`, `Uitkomst` en `Antwoord`. Vanaf nu zijn de invoervelden **Bron** en **Vervolgstap** óók omgezet naar zogenaamde contenteditable 'Rich Text' vakken! 
  - Je kunt nu dus direct een screenshot droppen in de *Bron* en *Vervolgstap* velden.
  - De code houdt op de achtergrond slim rekening met de format formattering hiervan naar het klembord.
  - Placedholders ("Uit welk systeem komt..." / "Wat verwacht je nu...") zijn minimalistisch en onveranderd gehouden op verzoek.

## [2.1.9] - 2026-04-28
- **Hotfix Klembord:** Kopiëren werkte helemaal niet meer omdat Chrome's Clipboard Permissies in de extensie botsten met de iFrame-weergave. 
  - De 'Moderne' manier heeft nu `allow="clipboard-write"` gekregen in het iFrame, zodat de error "Clipboard API block" niet meer voorkomt.
  - En de 'Fallback' methode faalde omdat we in de vorige update per ongeluk het klembord-tekstvakje niet goed meer laadden. Dat is nu ook weer helemaal teruggezet én behoudt de lichte-modus-styling fix. 

## [2.1.8] - 2026-04-24
- Toegevoegd: Duidelijke waarschuwing / tip in de instellingen dat je altijd `Ctrl+V` moet gebruiken bij het plakken in Teams om afbeeldingen en opmaak te behouden.

## [2.1.7] - 2026-04-24
- Bugfix: Prevent copying white background to clipboard in Light Mode by stripping inline styles.

## [2.1.6] - 2026-04-24
- Fixed double blank lines appearing below values when copy-pasting to Teams by removing `div` wrappers.

## [2.1.5] - 2026-04-24
- Fixed formatting: removed redundant blank lines between labels and values in generated example output.
