/**
 * MAIN INTERFACE SCRIPT (script.js)
 * 
 * This file controls the visual "Template" you see on your screen.
 * It manages what happens when you type, click buttons, or switch between the "Vraag" (Question) and "Antwoord" (Answer) tabs.
 * 
 * Think of it as the brain behind the text boxes.
 */

// Keeps track of which tab is currently open. It always starts on 'vraag' (Question).
let activeTmpl = 'vraag';

// These are the exact ID names of the text boxes on the screen for each tab
const fieldsVraag = ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'];
const fieldsAntwoord = ['antwoord', 'bron', 'vervolgstap'];

/**
 * TOGGLE TEMPLATE FUNCTION
 * This function runs when you click the Switch button.
 * It hides the "Question" text boxes and shows the "Answer" text boxes, and vice versa.
 */
function toggleTemplate() {
  if (activeTmpl === 'vraag') {
    // Switch to Answer mode
    activeTmpl = 'antwoord';
    document.getElementById('tmpl-vraag').style.display = 'none';      // Hide question fields
    document.getElementById('tmpl-antwoord').style.display = 'block';  // Show answer fields
    document.getElementById('pageTitle').textContent = 'Antwoord Template'; // Change title text
    document.getElementById('switchBtn').title = 'Vraag Template';    // Change hover text of the button
  } else {
    // Switch back to Question mode
    activeTmpl = 'vraag';
    document.getElementById('tmpl-antwoord').style.display = 'none';
    document.getElementById('tmpl-vraag').style.display = 'block';
    document.getElementById('pageTitle').textContent = 'Vraag Template';
    document.getElementById('switchBtn').title = 'Mod Antwoord Template';
  }
  // Whenever we switch, update the live preview window at the bottom of the screen
  updatePreview();
}

/**
 * BUILD MESSAGE HTML FUNCTION
 * This grabs whatever you typed in the boxes and turns it into a nice, formatted dot-point list.
 */
function buildMessageHTML() {
  if (activeTmpl === 'vraag') {
    // Grab text from the Question boxes. The 'trim()' removes invisible spaces at the start/end.
    // The 'replace(/\n/g, '<br>')' turns your "Enter/Return" line breaks into actual HTML line breaks.
    const w = document.getElementById('wachtrij').value;
    const k = document.getElementById('klantnummer').value.trim();
    const v = document.getElementById('klantvraag').innerHTML.trim();
    const l = document.getElementById('vastloper').innerHTML.trim();
    const u = document.getElementById('uitkomst').innerHTML.trim();

    // Build the final text layout. If a box is empty, it puts '...' instead.
    return `<div><b>• wachtrij:</b><br><br>${w || '…'}</div><br>` +
           `<div><b>• klantnummer:</b><br><br>${k || '…'}</div><br>` +
           `<div><b>• klantvraag:</b><br><br>${v || '…'}</div><br>` +
           `<div><b>• waar loop je vast:</b><br><br>${l || '…'}</div><br>` +
           `<div><b>• gewenste uitkomst:</b><br><br>${u || '…'}</div>`;
  } else {
    // Grab text from the Answer boxes
    const a = document.getElementById('antwoord').innerHTML.trim();
    const b = document.getElementById('bron').value.trim();
    const v = document.getElementById('vervolgstap').value.trim().replace(/\n/g, '<br>');
    
    // The Answer template is a bit smarter: it only shows 'Bron' (Source) and 'Vervolgstap' if you actually typed something in them.
    let msg = `<div><b>• antwoord:</b><br><br>${a || '…'}</div>`;
    if (b) msg += `<br><div><b>• bron:</b><br><br>${b}</div>`;
    if (v) msg += `<br><div><b>• vervolgstap:</b><br><br>${v}</div>`;
    return msg;
  }
}

/**
 * UPDATE PREVIEW FUNCTION
 * Pushes the formatted text we just built directly into the grey "Preview" box at the bottom.
 */
function updatePreview() {
  document.getElementById('preview').innerHTML = buildMessageHTML();
}

/**
 * VALIDATE FUNCTION
 * Checks if you forgot to fill in any mandatory boxes before it allows you to copy the text.
 */
function validate() {
  // Define which boxes are mandatory depending on the active tab
  const required = activeTmpl === 'vraag' ? ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'] : ['antwoord'];
  
  let ok = true; // Assume everything is OK until we find an empty box
  
  for (const id of required) {
    const el = document.getElementById(id);
    let empty = false;
    
    // Check if the dropdown box is empty, or if text boxes are empty
    if (el.tagName === 'SELECT') {
      empty = !el.value;
    } else if (el.tagName === 'DIV') {
      empty = el.innerText.trim() === '' && !el.innerHTML.includes('<img'); // Allow images in the rich text box
    } else {
      empty = !el.value.trim();
    }
    
    // If it's empty, paint the box with a red border (by adding the 'error' CSS class)
    el.classList.toggle('error', empty);
    if (empty) ok = false; // Mark the whole form as NOT ok
  }
  
  return ok; // Returns true if everything is filled in, false if something is missing
}

/**
 * COPY TO CLIPBOARD FUNCTION 
 * The magic function that takes your typed text and securely copies it to your computer's clipboard.
 */
async function copyToClipboard() {
  // Stop immediately if mandatory boxes are empty
  if (!validate()) {
    const errorToast = document.getElementById('toast-error');
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 10000);
    return;
  }

  const htmlMsg = buildMessageHTML();
  
  try {
    // Try the modern, secure way to copy text (this preserves nice formatting like bold/lists)
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlMsg], { type: 'text/html' }),
      'text/plain': new Blob([document.getElementById('preview').innerText], { type: 'text/plain' })
    });
    await navigator.clipboard.write([clipboardItem]);
  } catch {
    // Fallback: If the modern way fails (e.g. older browsers), use the invisible fake-box trick
    const buffer = document.createElement('div');
    buffer.contentEditable = true;
    buffer.innerHTML = htmlMsg;
    buffer.style.position = 'fixed';
    buffer.style.opacity = '0'; // Hide it from the screen
    document.body.appendChild(buffer);
    
    // Select the hidden text and press "Copy" via code
    const sel = window.getSelection();
    sel.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(buffer);
    sel.addRange(range);
    
    document.execCommand('copy'); // The actual copy command
    
    sel.removeAllRanges();
    document.body.removeChild(buffer); // Clean up the invisible box
  }

  // Show the little pop-up message saying "Copied!" (Gekopieerd!) for 10 seconds
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 10000);
}

/**
 * CLEAR FORM FUNCTION 
 * Empties all the boxes when you click the "Wissen" (Clear) button.
 */
function clearForm() {
  // Combine all boxes from both tabs into one big list
  const allFields = [...fieldsVraag, ...fieldsAntwoord];
  
  for (const id of allFields) {
    const el = document.getElementById(id);
    if (el.tagName === 'DIV') el.innerHTML = ''; // Clear rich text box
    else el.value = ''; // Clear normal text boxes
    el.classList.remove('error'); // Remove red warning borders just in case
  }
  updatePreview(); // Update the preview to show it's empty
}

/**
 * PREVENT UGLY PASTE FORMATTING
 * If a user copies text from a website that has crazy colors and huge fonts, 
 * this forces it to paste as normal, flat text. BUT it still allows pasting screenshots/images!
 */
document.querySelectorAll('div[contenteditable="true"]').forEach(el => {
  el.addEventListener('paste', function(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    // Check if they pasted an image file. If yes, let it pass normally.
    if (clipboardData.files && clipboardData.files.length > 0) return; 
    
    // Otherwise, block the paste, grab only the plain text version, and insert that instead.
    e.preventDefault();
    const text = clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });
});

/**
 * STARTUP INSTRUCTIONS (These run automatically when the tool opens)
 */

// 1. Make the preview box update instantly every time you press a key in ANY box
const allFieldsInit = [...fieldsVraag, ...fieldsAntwoord];
for (const id of allFieldsInit) {
  document.getElementById(id).addEventListener('input', updatePreview);
  document.getElementById(id).addEventListener('change', updatePreview);
}

// 2. Allow users to press "Ctrl + Enter" on their keyboard as a shortcut to Copy
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    copyToClipboard();
  }
});

// 3. Setup the Light/Dark mode "Theme" toggle button (The Sun/Moon icon)
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('themeBtn').textContent = isLight ? '🌙' : '☀️';
  // Save their choice in the browser memory so it remembers their preference next time
  localStorage.setItem('vraag-tmpl-theme', isLight ? 'light' : 'dark');
}

// Hook the theme toggle function to the button
document.getElementById('themeBtn').addEventListener('click', toggleTheme);

function resolveTemplateVersion() {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
      const manifest = chrome.runtime.getManifest();
      if (manifest && manifest.version) return manifest.version;
    }
  } catch {
    // Ignore and fallback to meta value.
  }

  const metaVersion = document.querySelector('meta[name="template-version"]');
  if (metaVersion && metaVersion.content) {
    return metaVersion.content;
  }

  return 'dev';
}

function renderTemplateVersion() {
  const versionEl = document.getElementById('templateVersion');
  if (!versionEl) return;
  versionEl.textContent = `v${resolveTemplateVersion()}`;
}

// When loading, check if they previously chose light mode, and if so, apply it immediately
if (localStorage.getItem('vraag-tmpl-theme') === 'light') {
  document.body.classList.add('light-mode');
  document.getElementById('themeBtn').textContent = '🌙';
}

// 4. AUTO-FILL MAGIC (How the extension talks to this template window)
// This reads the URL of the iframe (e.g. ?klantnummer=123&klantvraag=help) 
// and auto-types those values into the correct boxes for you!
const urlParams = new URLSearchParams(window.location.search);
const fillableFields = ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'];
for (const key of fillableFields) {
  if (urlParams.has(key)) {
    const el = document.getElementById(key);
    if (el) {
      if (el.tagName === 'DIV') el.innerHTML = decodeURIComponent(urlParams.get(key));
      else el.value = decodeURIComponent(urlParams.get(key));
    }
  }
}

// 5. Connect all the main UI buttons to their respective logic functions
renderTemplateVersion();
updatePreview();
document.getElementById("switchBtn").addEventListener("click", toggleTemplate);
document.getElementById("btn-copy").addEventListener("click", copyToClipboard);
document.getElementById("btn-clear").addEventListener("click", clearForm);


/**
 * ============================================================================
 * "DUMB AI" - OFFLINE TEXT BEAUTIFIER & MACRO SYSTEM
 * This operates 100% inside your local browser. It never sends data to the internet.
 * ============================================================================
 */

/**
 * TEXT BEAUTIFIER
 * Automatically cleans up sloppy typing when you click outside a text box.
 */
function applyLocalTextBeautifier(e) {
  let el = e.target;
  let val = el.value;
  if (!val) return;

  // 1. Removes accidental double or triple spaces
  val = val.replace(/  +/g, ' ');

  // 2. Fixes angry ALL CAPS text. (If someone types more than 10 letters and 60% are capital letters, it forces it all to lowercase)
  const letters = val.replace(/[^a-zA-Z]/g, '');
  const upperCases = val.replace(/[^A-Z]/g, '');
  if (letters.length > 10 && (upperCases.length / letters.length) > 0.6) {
     val = val.toLowerCase();
  }

  // 3. Scans for periods or exclamation marks, and makes sure the next letter starts with a Capital
  val = val.replace(/(^\s*|[.!?]\s+)([a-z])/g, function(match) {
      return match.toUpperCase();
  });

  // If we changed anything, shove the cleaned text back into the box
  if (el.value !== val) {
    el.value = val;
    updatePreview();
  }
}

// Bind Text Beautifier to the big text boxes only
const textFieldsToWatch = ['klantvraag', 'vastloper', 'uitkomst', 'vervolgstap'];
for (const id of textFieldsToWatch) {
  document.getElementById(id).addEventListener('blur', applyLocalTextBeautifier);
}
