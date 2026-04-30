# Changelog

## [Unreleased]

## [3.1.3] - 2026-04-30
- **Changed:** Prepared a Chrome Web Store compliance build by removing the external logo request, unused fallback injection permissions, legacy packaged scripts, and unsafe URL autofill HTML insertion.
- **Docs:** Updated the privacy policy and added Chrome Web Store submission notes for the compliance build.

## [3.1.2] - 2026-04-30
- **Added:** Remembered the last selected template mode so moderators can keep opening new customers directly in the answer template.

## [3.1.1] - 2026-04-30
- **Changed:** Capitalized the form labels and copied template headings, and updated the queue option to `Internet en Vaste Telefonie`.

## [3.1.0] - 2026-04-30
- **Changed:** Shortened the initial question template title to `Vraag Template` and fixed queue option capitalization for `Televisie en Radio` and `Wijzigen of Opzeggen`.

## [3.0.0] - 2026-04-28
- **Major:** Promoted sidebar docking to the default extension behavior. Drag the blue sidebar header to dock the template left, right, top, or bottom.
- **Added:** Top docking support, including matching open/close tab placement and remembered dock position.
- **Changed:** Removed the separate experimental docking ZIP. The normal release ZIP now contains the docking behavior.
- **Build:** Removed the legacy unversioned standalone release artifact and kept the release folder version-only for standalone HTML output.

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
