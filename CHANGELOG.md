# Changelog

## [Unreleased]

- **Changed:** Bumped release version to `4.1.1`.
- **Added:** Hardened Google Translate integration with proactive payload splitting, request throttling, queued execution, retry/backoff, and temporary cooldown handling for `429` and network failures.
- **Added:** Guardrails for translate-request sizing and per-run request caps to avoid endpoint abuse and prevent UI crashes on large input.

- **Added:** Introduced a persistent language toggle (`NL/EN`) in the template UI for Dutch and English moderators.
- **Changed:** Localized form labels, placeholders, help text, rules, toasts, and generated clipboard output based on the selected language.
- **Changed:** Standardized persistence so theme mode, template mode, and language mode are all remembered between sessions.
- **Added:** Added a `Translate filled fields` action that uses Google Translate to convert form content to the currently selected template language (`NL/EN`).
- **Changed:** Language switch now handles full form translation and content translation in one action; removed the separate translate button.
- **Added:** Expanded supported interface languages to `NL`, `EN`, `DE`, `AR`, and `HI`, with language cycling on the main language switch.
- **Changed:** Set light mode as the default visual theme while still restoring the user's last saved theme preference (`light`/`dark`) on startup.
- **Changed:** Simplified standard UI text resources to `NL` and `EN` only; selecting any other language now keeps labels/toasts in English while translating only the filled form content to the selected target language.
- **Docs:** Updated release notes to include both Dutch and English versions, plus explicit upgrade instructions to remove older extension installs before installing v4.1.0.
- **Docs:** Clarified in release notes that with `EN` as the only active language, a short press on the language button always translates filled content from any source language to English.
- **Docs:** Rewrote root README as bilingual (Dutch + English) with a complete feature inventory covering both legacy and new functionality.
- **Docs:** Updated release notes to explicitly link to the root README for full feature documentation.
- **Fixed:** Language switching no longer changes template mode; switching language now keeps the current `Vraag`/`Antwoord` mode stable.
- **Docs:** Updated v4.1.1 release notes to explicitly include the template mode stability bugfix in both Dutch and English sections.
- **Docs:** Expanded README feature coverage to reflect historical core features explicitly (including CRS button injection, drag-to-dock sidebar behavior, dock persistence, and pop-out workflow).
- **Docs:** Added additional explicit README feature bullets for template-mode stability during language switching, minimum-one-language enforcement, iframe clipboard permission behavior, and sidebar context refresh on repeated `Vraag maken` clicks.

## [3.1.4] - 2026-04-30
- **Changed:** Neutralized Chrome Web Store-facing metadata and sidebar branding to avoid implying official company publication while preserving the existing moderator workflow.
- **Docs:** Added guidance for using the Chrome Developer Dashboard public key instead of generating an arbitrary manifest key.

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
