  let activeTmpl = 'vraag';
  
  const fieldsVraag = ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'];
  const fieldsAntwoord = ['antwoord', 'bron', 'vervolgstap'];

  function toggleTemplate() {
    if (activeTmpl === 'vraag') {
      activeTmpl = 'antwoord';
      document.getElementById('tmpl-vraag').style.display = 'none';
      document.getElementById('tmpl-antwoord').style.display = 'block';
      document.getElementById('pageTitle').textContent = 'Antwoord Template';
      document.getElementById('switchBtn').title = 'Vraag Template';
    } else {
      activeTmpl = 'vraag';
      document.getElementById('tmpl-antwoord').style.display = 'none';
      document.getElementById('tmpl-vraag').style.display = 'block';
      document.getElementById('pageTitle').textContent = 'Vraag Template';
      document.getElementById('switchBtn').title = 'Mod Antwoord Template';
    }
    updatePreview();
  }

  function buildMessageHTML() {
    if (activeTmpl === 'vraag') {
      const w = document.getElementById('wachtrij').value;
      const k = document.getElementById('klantnummer').value.trim();
      const v = document.getElementById('klantvraag').value.trim().replace(/\n/g, '<br>');
      const l = document.getElementById('vastloper').value.trim().replace(/\n/g, '<br>');
      const u = document.getElementById('uitkomst').value.trim().replace(/\n/g, '<br>');

      return `<div>• Wachtrij: ${w || '…'}</div>` +
             `<div>• Klantnummer: ${k || '…'}</div>` +
             `<div>• Klantvraag: ${v || '…'}</div>` +
             `<div>• Waar loop je vast: ${l || '…'}</div>` +
             `<div>• Gewenste uitkomst: ${u || '…'}</div>`;
    } else {
      const a = document.getElementById('antwoord').innerHTML.trim();
      const b = document.getElementById('bron').value.trim();
      const v = document.getElementById('vervolgstap').value.trim().replace(/\n/g, '<br>');
      
      let msg = `<div>• Antwoord: ${a || '…'}</div>`;
      if (b) msg += `<div>• Bron: ${b}</div>`;
      if (v) msg += `<div>• Vervolgstap: ${v}</div>`;
      return msg;
    }
  }

  function updatePreview() {
    document.getElementById('preview').innerHTML = buildMessageHTML();
  }

  function validate() {
    const required = activeTmpl === 'vraag' ? ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'] : ['antwoord'];
    let ok = true;
    for (const id of required) {
      const el = document.getElementById(id);
      let empty = false;
      if (el.tagName === 'SELECT') {
        empty = !el.value;
      } else if (el.tagName === 'DIV') {
        empty = el.innerText.trim() === '' && !el.innerHTML.includes('<img');
      } else {
        empty = !el.value.trim();
      }
      el.classList.toggle('error', empty);
      if (empty) ok = false;
    }
    return ok;
  }

  async function copyToClipboard() {
    if (!validate()) return;

    const htmlMsg = buildMessageHTML();
    
    try {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlMsg], { type: 'text/html' }),
        'text/plain': new Blob([document.getElementById('preview').innerText], { type: 'text/plain' })
      });
      await navigator.clipboard.write([clipboardItem]);
    } catch {
      // Fallback via execCommand voor native copy event met images
      const buffer = document.createElement('div');
      buffer.contentEditable = true;
      buffer.innerHTML = htmlMsg;
      buffer.style.position = 'fixed';
      buffer.style.opacity = '0';
      document.body.appendChild(buffer);
      
      const sel = window.getSelection();
      sel.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(buffer);
      sel.addRange(range);
      
      document.execCommand('copy');
      
      sel.removeAllRanges();
      document.body.removeChild(buffer);
    }

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function clearForm() {
    const allFields = [...fieldsVraag, ...fieldsAntwoord];
    for (const id of allFields) {
      const el = document.getElementById(id);
      if (el.tagName === 'DIV') el.innerHTML = '';
      else el.value = '';
      el.classList.remove('error');
    }
    updatePreview();
  }

  // Prevent rich text formatting when pasting, but allow images
  document.getElementById('antwoord').addEventListener('paste', function(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;
    
    // Check if there are files (images)
    if (clipboardData.files && clipboardData.files.length > 0) return; // Allow native image paste
    
    // Otherwise force plain text
    e.preventDefault();
    const text = clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  // Live preview
  const allFieldsInit = [...fieldsVraag, ...fieldsAntwoord];
  for (const id of allFieldsInit) {
    document.getElementById(id).addEventListener('input', updatePreview);
    document.getElementById(id).addEventListener('change', updatePreview);
  }

  // Ctrl+Enter to copy
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      copyToClipboard();
    }
  });

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    document.getElementById('themeBtn').textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('vraag-tmpl-theme', isLight ? 'light' : 'dark');
  }

  document.getElementById('themeBtn').addEventListener('click', toggleTheme);

  if (localStorage.getItem('vraag-tmpl-theme') === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('themeBtn').textContent = '🌙';
  }

  // Auto-fill from URL parameters (via Bookmarklet)
  const urlParams = new URLSearchParams(window.location.search);
  const fillableFields = ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'];
  for (const key of fillableFields) {
    if (urlParams.has(key)) {
      const el = document.getElementById(key);
      if (el) el.value = urlParams.get(key);
    }
  }

  updatePreview();
  document.getElementById("switchBtn").addEventListener("click", toggleTemplate);
  document.getElementById("btn-copy").addEventListener("click", copyToClipboard);
  document.getElementById("btn-clear").addEventListener("click", clearForm);
// --- Local "Dumb AI" Text Beautifier (100% Privacy Proof) ---
  function applyLocalTextBeautifier(e) {
    let el = e.target;
    let val = el.value;
    if (!val) return;

    // 1. Verwijder dubbele spaties
    val = val.replace(/  +/g, ' ');

    // 2. Fix ALL CAPS (als meer dan 60% hoofdletters is)
    const letters = val.replace(/[^a-zA-Z]/g, '');
    const upperCases = val.replace(/[^A-Z]/g, '');
    if (letters.length > 10 && (upperCases.length / letters.length) > 0.6) {
       val = val.toLowerCase();
    }

    // 3. Hoofdletter aan het begin van nieuwe zinnen
    val = val.replace(/(^\s*|[.!?]\s+)([a-z])/g, function(match) {
        return match.toUpperCase();
    });

    if (el.value !== val) {
      el.value = val;
      updatePreview();
    }
  }

  // --- Slash Commands ---
  function handleSlashCommands(e) {
    let el = e.target;
    let val = el.value;
    if (!val) return;

    const commands = {
      '/mvg': 'Met vriendelijke groet,',
      '/bvd': 'Bij voorbaat dank voor de moeite!',
      '/fbi': 'Klant is boos, escalatie nodig.',
      '/done': 'Actie succesvol uitgevoerd.'
    };

    let changed = false;
    for (const [cmd, repl] of Object.entries(commands)) {
      if (val.includes(cmd + ' ') || val.endsWith(cmd)) {
        val = val.replace(new RegExp(cmd + '(?=\\s|$)', 'g'), repl);
        changed = true;
      }
    }

    if (changed) {
      el.value = val;
      updatePreview();
    }
  }

  // Bind beautifier en slash commands
  const textFields = ['klantvraag', 'vastloper', 'uitkomst', 'vervolgstap'];
  for (const id of textFields) {
    document.getElementById(id).addEventListener('blur', applyLocalTextBeautifier);
    document.getElementById(id).addEventListener('keyup', handleSlashCommands);
  }
// --- Local "Dumb AI" Text Beautifier (100% Privacy Proof) ---
  function applyLocalTextBeautifier(e) {
    let el = e.target;
    let val = el.value;
    if (!val) return;

    // 1. Verwijder dubbele spaties
    val = val.replace(/  +/g, ' ');

    // 2. Fix ALL CAPS (als meer dan 60% hoofdletters is)
    const letters = val.replace(/[^a-zA-Z]/g, '');
    const upperCases = val.replace(/[^A-Z]/g, '');
    if (letters.length > 10 && (upperCases.length / letters.length) > 0.6) {
       val = val.toLowerCase();
    }

    // 3. Hoofdletter aan het begin van nieuwe zinnen
    val = val.replace(/(^\s*|[.!?]\s+)([a-z])/g, function(match) {
        return match.toUpperCase();
    });

    if (el.value !== val) {
      el.value = val;
      updatePreview();
    }
  }

  // --- Slash Commands ---
  function handleSlashCommands(e) {
    let el = e.target;
    let val = el.value;
    if (!val) return;

    const commands = {
      '/mvg': 'Met vriendelijke groet,',
      '/bvd': 'Bij voorbaat dank voor de moeite!',
      '/fbi': 'Klant is boos, escalatie nodig.',
      '/done': 'Actie succesvol uitgevoerd.'
    };

    let changed = false;
    for (const [cmd, repl] of Object.entries(commands)) {
      if (val.includes(cmd + ' ') || val.endsWith(cmd)) {
        val = val.replace(new RegExp(cmd + '(?=\\s|$)', 'g'), repl);
        changed = true;
      }
    }

    if (changed) {
      el.value = val;
      updatePreview();
    }
  }

  // Bind beautifier en slash commands
  const textFields = ['klantvraag', 'vastloper', 'uitkomst', 'vervolgstap'];
  for (const id of textFields) {
    document.getElementById(id).addEventListener('blur', applyLocalTextBeautifier);
    document.getElementById(id).addEventListener('keyup', handleSlashCommands);
  }
