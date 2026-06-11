### Changelog v4.1.0
- **International language rotation:** Added a broad language catalog in the language menu, with checkbox-based selection for which languages are active in rotation.
- **Long-press language menu:** The language button now supports a 2-second long press to open the language menu. A short press still performs the normal language switch + content translation flow.
- **UI language policy simplified:** Standard UI text (labels, toasts, rules, hints) now stays in Dutch or English only. For non-NL/EN targets, the UI stays in English while form content is translated to the selected target language.
- **Default active languages:** New setups now start with only `NL` and `EN` enabled in language rotation.
- **Theme behavior update:** Light mode is now the default visual theme, while the last saved theme (`light` or `dark`) is still restored automatically.
- **Release artifact update:** Generated standalone release artifact `standalone-template-v4.1.0.html`.

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