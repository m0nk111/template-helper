/**
 * MAIN INTERFACE SCRIPT (script.js)
 * Controls template mode, theme mode, language mode, and clipboard output.
 */

const templateModeStorageKey = 'vraag-tmpl-active-template';
const themeStorageKey = 'vraag-tmpl-theme';
const languageStorageKey = 'vraag-tmpl-language';
const enabledLanguagesStorageKey = 'vraag-tmpl-enabled-languages';
const googleTranslateEndpoint = 'https://translate.googleapis.com/translate_a/single';
const languageLongPressMs = 2000;
const translateRequestMaxChars = 5000;
const translateChunkSoftLimit = 4200;
const translateMinRequestIntervalMs = 700;
const translateRequestTimeoutMs = 12000;
const translateMaxRetryAttempts = 2;
const translateBackoffBaseMs = 900;
const translateRateLimitCooldownMs = 60000;
const translateNetworkCooldownMs = 8000;
const translateMaxRequestsPerRun = 12;

const languageCatalog = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'as', name: 'Assamese' },
  { code: 'ay', name: 'Aymara' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'bm', name: 'Bambara' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bho', name: 'Bhojpuri' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'dv', name: 'Divehi' },
  { code: 'doi', name: 'Dogri' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'ee', name: 'Ewe' },
  { code: 'fil', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gn', name: 'Guarani' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew (Zionisch)' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'ilo', name: 'Ilocano' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'gom', name: 'Konkani' },
  { code: 'ko', name: 'Korean' },
  { code: 'kri', name: 'Krio' },
  { code: 'ku', name: 'Kurdish (Kurmanji)' },
  { code: 'ckb', name: 'Kurdish (Sorani)' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'ln', name: 'Lingala' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lg', name: 'Luganda' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mai', name: 'Maithili' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mni-Mtei', name: 'Meiteilon (Manipuri)' },
  { code: 'lus', name: 'Mizo' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ny', name: 'Nyanja' },
  { code: 'or', name: 'Odia (Oriya)' },
  { code: 'om', name: 'Oromo' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'qu', name: 'Quechua' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'nso', name: 'Sepedi' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'ts', name: 'Tsonga' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'ak', name: 'Twi' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' }
];

const supportedLanguages = languageCatalog.map((entry) => entry.code);
const languageLabels = Object.fromEntries(languageCatalog.map((entry) => [entry.code, entry.code.toUpperCase()]));
const languageNames = Object.fromEntries(languageCatalog.map((entry) => [entry.code, entry.name]));
const defaultEnabledLanguages = ['nl', 'en'];
const languageMenuText = {
  nl: {
    title: 'Actieve talen',
    hint: 'Vink talen aan voor rotatie.',
    minOne: '⚠️ Selecteer minimaal één taal.'
  },
  en: {
    title: 'Active languages',
    hint: 'Check languages to include in rotation.',
    minOne: '⚠️ Select at least one language.'
  }
};

function loadEnabledLanguages() {
  try {
    const raw = localStorage.getItem(enabledLanguagesStorageKey);
    if (!raw) return [...defaultEnabledLanguages];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...defaultEnabledLanguages];

    const filtered = supportedLanguages.filter((code) => parsed.includes(code));
    return filtered.length ? filtered : [...defaultEnabledLanguages];
  } catch {
    return [...defaultEnabledLanguages];
  }
}

let activeTmpl = localStorage.getItem(templateModeStorageKey) === 'antwoord' ? 'antwoord' : 'vraag';
let activeLang = supportedLanguages.includes(localStorage.getItem(languageStorageKey))
  ? localStorage.getItem(languageStorageKey)
  : 'nl';
let enabledLanguages = loadEnabledLanguages();
let isLanguageSwitching = false;
let languagePressTimer = null;
let languagePressStartedAt = 0;
let languageLongPressTriggered = false;
let languagePointerDown = false;

if (!enabledLanguages.includes(activeLang)) {
  activeLang = enabledLanguages[0];
  localStorage.setItem(languageStorageKey, activeLang);
}

const fieldsVraag = ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst'];
const fieldsAntwoord = ['antwoord', 'bron', 'vervolgstap'];
const richTextFields = ['klantvraag', 'vastloper', 'uitkomst', 'antwoord', 'bron', 'vervolgstap'];
const translationCache = new Map();
let translateQueue = Promise.resolve();
let lastTranslateRequestAt = 0;
let translateBlockedUntil = 0;

const i18n = {
  nl: {
    pageTitleVraag: 'Vraag Template',
    pageTitleAntwoord: 'Antwoord Template',
    switchToVraagTitle: 'Vraag Template',
    switchToAntwoordTitle: 'Mod Antwoord Template',
    subtitle: 'Vul het formulier in en kopieer het bericht naar Teams.',
    labels: {
      wachtrij: 'Wachtrij',
      klantnummer: 'Klantnummer',
      klantvraag: 'Klantvraag',
      vastloper: 'Waar loop je vast',
      uitkomst: 'Gewenste uitkomst',
      antwoord: 'Antwoord',
      bron: 'Bron',
      vervolgstap: 'Vervolgstap'
    },
    placeholders: {
      klantnummer: 'Bijv. 12345678',
      klantvraag: 'Wat is de vraag van de klant? Je kunt hier ook een screenshot droppen.',
      vastloper: 'Beschrijf waar je vastzit...',
      uitkomst: 'Wat wil je bereiken?',
      antwoord: 'Typ hier je inhoudelijke antwoord en/of screenshot...',
      bron: 'Uit welk systeem komt de informatie?',
      vervolgstap: 'Wat verwacht je nu van de agent?'
    },
    queue: {
      placeholder: '— Kies Wachtrij —',
      internet: 'Internet en Vaste Telefonie',
      tvRadio: 'Televisie en Radio',
      otherTechnical: 'Overig Technisch',
      billing: 'Factuur en Betalen',
      changeCancel: 'Wijzigen of Opzeggen',
      otherService: 'Overige Service',
      mobile: 'Mobiel',
      sales: 'Sales',
      priceChange: 'Prijswijziging',
      migration: 'Migratielijn'
    },
    buttons: {
      copy: '📋 Kopieer naar klembord',
      clear: 'Wissen',
      languageTitle: 'Wissel taal en vertaal inhoud',
      themeTitle: 'Wissel Licht/Donker'
    },
    teamsTipHtml: '💡 <strong>Tip Teams:</strong> Gebruik altijd <strong>Ctrl+V</strong> bij het plakken. (De Rechtermuisknop -> "Plakken" filtert alle opmaak en screenshots weg!)',
    previewLabel: 'Voorbeeld',
    rulesSummary: '📌 Spelregels Moderator Chat',
    rules: [
      'Gebruik altijd dit template.',
      'Er wordt altijd met een citaat gereageerd.',
      'Alleen een moderator reageert op een vraag.',
      'Houd je vraag duidelijk en to-the-point.',
      'Reageer als de moderator om extra informatie vraagt.',
      'Geen discussies, social talk of priveberichten.',
      'Verbeter anderen niet in de chat - signaleer bij je TM of senior.'
    ],
    toastSuccessHtml: '✅ Gekopieerd!<br><span id="toastHint" style="font-size:11px;opacity:0.8;">(Gebruik Ctrl+V om te plakken in Teams)</span>',
    toastError: '⚠️ Let op: vul alle verplichte velden in!',
    translateStatus: {
      busy: '⏳ Taal wisselen en inhoud vertalen...',
      success: '✅ Interface en invulvakken vertaald.',
      empty: 'ℹ️ Taal gewijzigd. Geen ingevulde tekst gevonden om te vertalen.',
      tooLarge: '⚠️ Te veel tekst om veilig in één keer te vertalen. Kort de inhoud in of vertaal in delen.',
      rateLimited: '⚠️ Google Translate blokkeert tijdelijk (429). Wacht ongeveer een minuut en probeer opnieuw.',
      network: '⚠️ Netwerkfout tijdens vertalen. Probeer het zo opnieuw.',
      cooldown: '⚠️ Vertalen is tijdelijk gepauzeerd. Probeer over {seconds}s opnieuw.',
      failed: '⚠️ Interface gewijzigd, maar inhoud vertalen is mislukt.'
    },
    outputLabels: {
      wachtrij: 'Wachtrij',
      klantnummer: 'Klantnummer',
      klantvraag: 'Klantvraag',
      vastloper: 'Waar loop je vast',
      uitkomst: 'Gewenste uitkomst',
      antwoord: 'Antwoord',
      bron: 'Bron',
      vervolgstap: 'Vervolgstap'
    }
  },
  en: {
    pageTitleVraag: 'Question Template',
    pageTitleAntwoord: 'Answer Template',
    switchToVraagTitle: 'Question Template',
    switchToAntwoordTitle: 'Moderator Answer Template',
    subtitle: 'Fill in the form and copy the message to Teams.',
    labels: {
      wachtrij: 'Queue',
      klantnummer: 'Customer number',
      klantvraag: 'Customer question',
      vastloper: 'Where are you stuck',
      uitkomst: 'Desired outcome',
      antwoord: 'Answer',
      bron: 'Source',
      vervolgstap: 'Next step'
    },
    placeholders: {
      klantnummer: 'For example: 12345678',
      klantvraag: 'What is the customer asking? You can also drop a screenshot here.',
      vastloper: 'Describe where you are stuck...',
      uitkomst: 'What would you like to achieve?',
      antwoord: 'Type your substantive answer and/or screenshot here...',
      bron: 'Which system is this information from?',
      vervolgstap: 'What do you expect from the agent now?'
    },
    queue: {
      placeholder: '— Select Queue —',
      internet: 'Internet and Landline Telephony',
      tvRadio: 'Television and Radio',
      otherTechnical: 'Other Technical',
      billing: 'Billing and Payments',
      changeCancel: 'Change or Cancel',
      otherService: 'Other Service',
      mobile: 'Mobile',
      sales: 'Sales',
      priceChange: 'Price Change',
      migration: 'Migration Line'
    },
    buttons: {
      copy: '📋 Copy to clipboard',
      clear: 'Clear',
      languageTitle: 'Switch language and translate content',
      themeTitle: 'Switch Light/Dark'
    },
    teamsTipHtml: '💡 <strong>Teams tip:</strong> Always use <strong>Ctrl+V</strong> to paste. (Right-click -> "Paste" filters all formatting and screenshots.)',
    previewLabel: 'Preview',
    rulesSummary: '📌 Moderator Chat Rules',
    rules: [
      'Always use this template.',
      'Always respond with a quote.',
      'Only a moderator responds to a question.',
      'Keep your question clear and to the point.',
      'Respond when the moderator asks for more information.',
      'No discussions, social talk, or private messages.',
      'Do not correct others in chat - report it to your TM or senior.'
    ],
    toastSuccessHtml: '✅ Copied!<br><span id="toastHint" style="font-size:11px;opacity:0.8;">(Use Ctrl+V to paste in Teams)</span>',
    toastError: '⚠️ Please fill in all required fields!',
    translateStatus: {
      busy: '⏳ Switching language and translating content...',
      success: '✅ Interface and filled fields translated.',
      empty: 'ℹ️ Language switched. No filled text found to translate.',
      tooLarge: '⚠️ Too much text to translate safely in one run. Shorten the text or translate in smaller parts.',
      rateLimited: '⚠️ Google Translate temporarily blocked requests (429). Please wait about one minute and try again.',
      network: '⚠️ Network issue during translation. Please try again shortly.',
      cooldown: '⚠️ Translation is temporarily paused. Try again in {seconds}s.',
      failed: '⚠️ Interface switched, but content translation failed.'
    },
    outputLabels: {
      wachtrij: 'Queue',
      klantnummer: 'Customer number',
      klantvraag: 'Customer question',
      vastloper: 'Where are you stuck',
      uitkomst: 'Desired outcome',
      antwoord: 'Answer',
      bron: 'Source',
      vervolgstap: 'Next step'
    }
  }
};

function getLangPack() {
  return activeLang === 'nl' ? i18n.nl : i18n.en;
}

function isRtlLanguage(language) {
  return false;
}

function getLanguageMenuPack() {
  return activeLang === 'nl' ? languageMenuText.nl : languageMenuText.en;
}

function persistEnabledLanguages() {
  localStorage.setItem(enabledLanguagesStorageKey, JSON.stringify(enabledLanguages));
}

function getRotationLanguages() {
  const rotation = supportedLanguages.filter((code) => enabledLanguages.includes(code));
  return rotation.length ? rotation : [...defaultEnabledLanguages];
}

function isLanguageMenuOpen() {
  const menu = document.getElementById('languageMenu');
  return !!(menu && menu.classList.contains('show'));
}

function hideLanguageMenu() {
  const menu = document.getElementById('languageMenu');
  if (!menu) return;
  menu.classList.remove('show');
  menu.setAttribute('aria-hidden', 'true');
}

function showLanguageMenu() {
  renderLanguageMenu();
  const menu = document.getElementById('languageMenu');
  if (!menu) return;
  menu.classList.add('show');
  menu.setAttribute('aria-hidden', 'false');
}

function handleLanguageCheckboxChange(event) {
  const checkbox = event.target;
  const code = checkbox.getAttribute('data-language-code');
  if (!code || !supportedLanguages.includes(code)) return;

  if (checkbox.checked) {
    if (!enabledLanguages.includes(code)) {
      enabledLanguages = [...enabledLanguages, code];
      enabledLanguages = supportedLanguages.filter((lang) => enabledLanguages.includes(lang));
    }
  } else {
    if (enabledLanguages.length === 1) {
      checkbox.checked = true;
      showErrorToast(getLanguageMenuPack().minOne, 2600);
      return;
    }

    enabledLanguages = enabledLanguages.filter((lang) => lang !== code);
  }

  persistEnabledLanguages();

  if (!enabledLanguages.includes(activeLang)) {
    activeLang = enabledLanguages[0];
    localStorage.setItem(languageStorageKey, activeLang);
    applyLanguage(activeLang, false);
  }

  renderLanguageMenu();
}

function renderLanguageMenu() {
  const menuTitle = document.getElementById('languageMenuTitle');
  const menuHint = document.getElementById('languageMenuHint');
  const menuList = document.getElementById('languageMenuList');
  if (!menuTitle || !menuHint || !menuList) return;

  const pack = getLanguageMenuPack();
  menuTitle.textContent = pack.title;
  menuHint.textContent = pack.hint;

  menuList.innerHTML = '';
  for (const code of supportedLanguages) {
    const item = document.createElement('label');
    item.className = 'language-menu-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = enabledLanguages.includes(code);
    checkbox.setAttribute('data-language-code', code);
    checkbox.addEventListener('change', handleLanguageCheckboxChange);

    const text = document.createElement('span');
    text.textContent = `${languageNames[code] || code} (${languageLabels[code] || code.toUpperCase()})`;

    item.appendChild(checkbox);
    item.appendChild(text);
    menuList.appendChild(item);
  }
}

function clearLanguagePressTimer() {
  if (languagePressTimer) {
    clearTimeout(languagePressTimer);
    languagePressTimer = null;
  }
}

function onLanguageButtonMouseDown(event) {
  if (event.button !== 0 || isLanguageSwitching) return;

  languagePointerDown = true;
  languageLongPressTriggered = false;
  languagePressStartedAt = Date.now();
  clearLanguagePressTimer();

  languagePressTimer = setTimeout(() => {
    if (!languagePointerDown) return;
    languageLongPressTriggered = true;
    showLanguageMenu();
  }, languageLongPressMs);
}

async function onLanguageButtonMouseUp(event) {
  if (event.button !== 0) return;

  const wasPointerDown = languagePointerDown;
  const elapsed = Date.now() - languagePressStartedAt;
  languagePointerDown = false;
  clearLanguagePressTimer();

  if (!wasPointerDown) {
    languageLongPressTriggered = false;
    return;
  }

  if (languageLongPressTriggered) {
    languageLongPressTriggered = false;
    return;
  }

  if (elapsed < languageLongPressMs) {
    hideLanguageMenu();
    await switchLanguageAndTranslate();
  }
}

function onLanguageButtonMouseLeave() {
  languagePointerDown = false;
  languagePressStartedAt = 0;
  clearLanguagePressTimer();
}

function setTemplateMode(mode, persist) {
  activeTmpl = mode === 'antwoord' ? 'antwoord' : 'vraag';

  const langPack = getLangPack();
  const isAnswerMode = activeTmpl === 'antwoord';

  document.getElementById('tmpl-vraag').style.display = isAnswerMode ? 'none' : 'block';
  document.getElementById('tmpl-antwoord').style.display = isAnswerMode ? 'block' : 'none';
  document.getElementById('pageTitle').textContent = isAnswerMode ? langPack.pageTitleAntwoord : langPack.pageTitleVraag;
  document.getElementById('switchBtn').title = isAnswerMode ? langPack.switchToVraagTitle : langPack.switchToAntwoordTitle;

  if (persist) {
    localStorage.setItem(templateModeStorageKey, activeTmpl);
  }

  updatePreview();
}

function toggleTemplate() {
  setTemplateMode(activeTmpl === 'vraag' ? 'antwoord' : 'vraag', true);
}

function applyLanguage(language, persist) {
  activeLang = supportedLanguages.includes(language) ? language : 'en';

  if (persist) {
    localStorage.setItem(languageStorageKey, activeLang);
  }

  const langPack = getLangPack();

  document.documentElement.lang = activeLang;
  document.documentElement.dir = isRtlLanguage(activeLang) ? 'rtl' : 'ltr';

  document.getElementById('subtitleText').textContent = langPack.subtitle;

  document.getElementById('labelWachtrij').innerHTML = `${langPack.labels.wachtrij} <span class="required">*</span>`;
  document.getElementById('labelKlantnummer').innerHTML = `${langPack.labels.klantnummer} <span class="required">*</span>`;
  document.getElementById('labelKlantvraag').innerHTML = `${langPack.labels.klantvraag} <span class="required">*</span>`;
  document.getElementById('labelVastloper').innerHTML = `${langPack.labels.vastloper} <span class="required">*</span>`;
  document.getElementById('labelUitkomst').innerHTML = `${langPack.labels.uitkomst} <span class="required">*</span>`;

  document.getElementById('labelAntwoord').innerHTML = `${langPack.labels.antwoord} <span class="required">*</span>`;
  document.getElementById('labelBron').textContent = langPack.labels.bron;
  document.getElementById('labelVervolgstap').textContent = langPack.labels.vervolgstap;

  document.getElementById('klantnummer').placeholder = langPack.placeholders.klantnummer;
  document.getElementById('klantvraag').setAttribute('data-placeholder', langPack.placeholders.klantvraag);
  document.getElementById('vastloper').setAttribute('data-placeholder', langPack.placeholders.vastloper);
  document.getElementById('uitkomst').setAttribute('data-placeholder', langPack.placeholders.uitkomst);
  document.getElementById('antwoord').setAttribute('data-placeholder', langPack.placeholders.antwoord);
  document.getElementById('bron').setAttribute('data-placeholder', langPack.placeholders.bron);
  document.getElementById('vervolgstap').setAttribute('data-placeholder', langPack.placeholders.vervolgstap);

  document.getElementById('queuePlaceholder').textContent = langPack.queue.placeholder;
  document.getElementById('queueInternet').textContent = langPack.queue.internet;
  document.getElementById('queueTvRadio').textContent = langPack.queue.tvRadio;
  document.getElementById('queueOtherTechnical').textContent = langPack.queue.otherTechnical;
  document.getElementById('queueBilling').textContent = langPack.queue.billing;
  document.getElementById('queueChangeCancel').textContent = langPack.queue.changeCancel;
  document.getElementById('queueOtherService').textContent = langPack.queue.otherService;
  document.getElementById('queueMobile').textContent = langPack.queue.mobile;
  document.getElementById('queueSales').textContent = langPack.queue.sales;
  document.getElementById('queuePriceChange').textContent = langPack.queue.priceChange;
  document.getElementById('queueMigration').textContent = langPack.queue.migration;

  document.getElementById('btn-copy').textContent = langPack.buttons.copy;
  document.getElementById('btn-clear').textContent = langPack.buttons.clear;

  document.getElementById('teamsTip').innerHTML = langPack.teamsTipHtml;
  document.getElementById('previewLabel').textContent = langPack.previewLabel;

  document.getElementById('rulesSummary').textContent = langPack.rulesSummary;
  document.getElementById('rule1').textContent = langPack.rules[0];
  document.getElementById('rule2').textContent = langPack.rules[1];
  document.getElementById('rule3').textContent = langPack.rules[2];
  document.getElementById('rule4').textContent = langPack.rules[3];
  document.getElementById('rule5').textContent = langPack.rules[4];
  document.getElementById('rule6').textContent = langPack.rules[5];
  document.getElementById('rule7').textContent = langPack.rules[6];

  document.getElementById('toast').innerHTML = langPack.toastSuccessHtml;
  document.getElementById('toast-error').textContent = langPack.toastError;

  document.getElementById('languageBtn').textContent = languageLabels[activeLang] || activeLang.toUpperCase();
  document.getElementById('languageBtn').title = langPack.buttons.languageTitle;
  document.getElementById('themeBtn').title = langPack.buttons.themeTitle;

  renderLanguageMenu();
  setTemplateMode(activeTmpl, false);
}

function showStatusToast(message, durationMs) {
  const statusToast = document.getElementById('toast-status');
  statusToast.textContent = message;
  statusToast.classList.add('show');
  setTimeout(() => {
    statusToast.classList.remove('show');
  }, durationMs);
}

function showErrorToast(message, durationMs) {
  const errorToast = document.getElementById('toast-error');
  errorToast.textContent = message;
  errorToast.classList.add('show');
  setTimeout(() => {
    errorToast.classList.remove('show');
    errorToast.textContent = getLangPack().toastError;
  }, durationMs);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createTranslateError(code, message, extra) {
  const err = new Error(message);
  err.name = 'TranslateGuardError';
  err.code = code;
  if (extra && typeof extra === 'object') {
    Object.assign(err, extra);
  }
  return err;
}

function isTranslateError(error, code) {
  if (!error || error.name !== 'TranslateGuardError') return false;
  if (!code) return true;
  return error.code === code;
}

function splitTextIntoTranslateChunks(text, maxChars) {
  const source = text || '';
  if (!source) return [];
  if (source.length <= maxChars) return [source];

  const chunks = [];
  let index = 0;
  const minBoundary = Math.floor(maxChars * 0.55);

  while (index < source.length) {
    let end = Math.min(index + maxChars, source.length);

    if (end < source.length) {
      let splitAt = -1;
      for (let cursor = end - 1; cursor >= index + minBoundary; cursor -= 1) {
        const char = source[cursor];
        if (char === '\n' || char === ' ' || char === '.' || char === '!' || char === '?' || char === ';' || char === ',' || char === ':') {
          splitAt = cursor + 1;
          break;
        }
      }

      if (splitAt !== -1) {
        end = splitAt;
      }
    }

    const chunk = source.slice(index, end);
    chunks.push(chunk);
    index = end;
  }

  return chunks;
}

function estimateTranslateRequestsForText(text) {
  const normalized = (text || '').trim();
  if (!normalized) return 0;
  return splitTextIntoTranslateChunks(normalized, translateChunkSoftLimit).length;
}

function estimateTranslateRequestsForCurrentInput() {
  let count = 0;

  for (const id of richTextFields) {
    const el = document.getElementById(id);
    if (!el) continue;

    const textNodes = collectTranslatableTextNodes(el);
    for (const node of textNodes) {
      count += estimateTranslateRequestsForText(node.nodeValue);
      if (count > translateMaxRequestsPerRun) {
        return count;
      }
    }
  }

  return count;
}

async function enqueueTranslateRequest(task) {
  const execute = async () => {
    const now = Date.now();
    if (translateBlockedUntil > now) {
      const retryAfterMs = translateBlockedUntil - now;
      throw createTranslateError('TRANSLATE_COOLDOWN', 'Translation temporarily paused.', {
        retryAfterMs,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000))
      });
    }

    const delayMs = Math.max(0, translateMinRequestIntervalMs - (now - lastTranslateRequestAt));
    if (delayMs > 0) {
      await sleep(delayMs);
    }

    lastTranslateRequestAt = Date.now();
    return task();
  };

  const next = translateQueue.then(execute, execute);
  translateQueue = next.catch(() => {});
  return next;
}

async function performTranslateRequest(chunk, targetLanguage) {
  if (chunk.length > translateRequestMaxChars) {
    throw createTranslateError('TRANSLATE_TOO_LARGE', 'Translation chunk exceeds 5000 characters.', {
      chunkLength: chunk.length
    });
  }

  const url = new URL(googleTranslateEndpoint);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', targetLanguage);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', chunk);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), translateRequestTimeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal
    });

    if (response.status === 429) {
      translateBlockedUntil = Date.now() + translateRateLimitCooldownMs;
      throw createTranslateError('TRANSLATE_RATE_LIMIT', 'Google Translate rate limit reached (429).');
    }

    if (response.status === 400) {
      throw createTranslateError('TRANSLATE_BAD_REQUEST', 'Google Translate rejected the request (400).', {
        status: 400
      });
    }

    if (!response.ok) {
      throw createTranslateError('TRANSLATE_HTTP', `Translate request failed with status ${response.status}.`, {
        status: response.status
      });
    }

    const data = await response.json();
    return Array.isArray(data?.[0])
      ? data[0].map((part) => (Array.isArray(part) ? part[0] : '')).join('')
      : chunk;
  } catch (error) {
    if (error && error.name === 'AbortError') {
      translateBlockedUntil = Date.now() + translateNetworkCooldownMs;
      throw createTranslateError('TRANSLATE_NETWORK', 'Translate request timed out.');
    }

    if (isTranslateError(error)) {
      throw error;
    }

    translateBlockedUntil = Date.now() + translateNetworkCooldownMs;
    throw createTranslateError('TRANSLATE_NETWORK', 'Translate request failed due to a network issue.');
  } finally {
    clearTimeout(timeoutId);
  }
}

function shouldRetryTranslateError(error) {
  if (!isTranslateError(error)) return false;
  if (error.code === 'TRANSLATE_NETWORK') return true;
  if (error.code === 'TRANSLATE_HTTP' && Number(error.status) >= 500) return true;
  return false;
}

async function translateChunkWithRetry(chunk, targetLanguage) {
  let attempt = 0;

  while (attempt <= translateMaxRetryAttempts) {
    try {
      return await enqueueTranslateRequest(() => performTranslateRequest(chunk, targetLanguage));
    } catch (error) {
      if (!shouldRetryTranslateError(error) || attempt === translateMaxRetryAttempts) {
        throw error;
      }

      const backoffMs = translateBackoffBaseMs * Math.pow(2, attempt) + Math.floor(Math.random() * 240);
      await sleep(backoffMs);
      attempt += 1;
    }
  }

  throw createTranslateError('TRANSLATE_NETWORK', 'Translate retries exhausted.');
}

function getTranslateErrorMessage(error, langPack) {
  if (isTranslateError(error, 'TRANSLATE_TOO_LARGE') || isTranslateError(error, 'TRANSLATE_BAD_REQUEST')) {
    return langPack.translateStatus.tooLarge;
  }

  if (isTranslateError(error, 'TRANSLATE_RATE_LIMIT')) {
    return langPack.translateStatus.rateLimited;
  }

  if (isTranslateError(error, 'TRANSLATE_COOLDOWN')) {
    const seconds = Math.max(1, Number(error.retryAfterSeconds) || 1);
    return langPack.translateStatus.cooldown.replace('{seconds}', String(seconds));
  }

  if (isTranslateError(error, 'TRANSLATE_NETWORK')) {
    return langPack.translateStatus.network;
  }

  return langPack.translateStatus.failed;
}

async function translateWithGoogle(text, targetLanguage) {
  const normalized = (text || '').trim();
  if (!normalized) return text;

  if (normalized.length > translateRequestMaxChars * translateMaxRequestsPerRun) {
    throw createTranslateError('TRANSLATE_TOO_LARGE', 'Source text exceeds safe translation capacity.', {
      sourceLength: normalized.length
    });
  }

  const chunks = splitTextIntoTranslateChunks(normalized, translateChunkSoftLimit);
  if (!chunks.length) return text;

  if (chunks.length > translateMaxRequestsPerRun) {
    throw createTranslateError('TRANSLATE_TOO_LARGE', 'Too many translation requests required.', {
      estimatedRequests: chunks.length
    });
  }

  const translatedChunks = [];
  for (const chunk of chunks) {
    const cacheKey = `${targetLanguage}|${chunk}`;
    if (translationCache.has(cacheKey)) {
      translatedChunks.push(translationCache.get(cacheKey));
      continue;
    }

    const translatedChunk = await translateChunkWithRetry(chunk, targetLanguage);
    translationCache.set(cacheKey, translatedChunk);
    translatedChunks.push(translatedChunk);
  }

  return translatedChunks.join('');
}

async function translatePreservingWhitespace(text, targetLanguage) {
  const source = text || '';
  const leading = source.match(/^\s*/)?.[0] || '';
  const trailing = source.match(/\s*$/)?.[0] || '';
  const middle = source.trim();

  if (!middle) return source;

  const translated = await translateWithGoogle(middle, targetLanguage);
  return `${leading}${translated}${trailing}`;
}

function collectTranslatableTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node || !node.nodeValue || !node.nodeValue.trim()) {
        return NodeFilter.FILTER_REJECT;
      }

      const parentTag = node.parentElement ? node.parentElement.tagName : '';
      if (parentTag === 'SCRIPT' || parentTag === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  let current = walker.nextNode();
  while (current) {
    nodes.push(current);
    current = walker.nextNode();
  }
  return nodes;
}

async function translateEditableDivById(id, targetLanguage) {
  const el = document.getElementById(id);
  if (!el) return false;

  const textNodes = collectTranslatableTextNodes(el);
  if (!textNodes.length) return false;

  for (const node of textNodes) {
    const raw = node.nodeValue || '';
    if (raw.length > translateRequestMaxChars * translateMaxRequestsPerRun) {
      throw createTranslateError('TRANSLATE_TOO_LARGE', 'Single text node exceeds safe translation capacity.', {
        sourceLength: raw.length
      });
    }

    node.nodeValue = await translatePreservingWhitespace(node.nodeValue, targetLanguage);
  }

  return true;
}

function getNextLanguage(current) {
  const rotationLanguages = getRotationLanguages();
  const currentIndex = rotationLanguages.indexOf(current);
  if (currentIndex === -1) return rotationLanguages[0];
  return rotationLanguages[(currentIndex + 1) % rotationLanguages.length];
}

async function switchLanguageAndTranslate() {
  if (isLanguageSwitching) return;

  const previousLang = activeLang;
  const nextLang = getNextLanguage(previousLang);
  const statusPack = previousLang === 'nl' ? i18n.nl : i18n.en;

  isLanguageSwitching = true;
  document.getElementById('languageBtn').disabled = true;

  showStatusToast(statusPack.translateStatus.busy, 1500);

  try {
    const estimate = estimateTranslateRequestsForCurrentInput();
    if (estimate > translateMaxRequestsPerRun) {
      throw createTranslateError('TRANSLATE_TOO_LARGE', 'Too many translation requests needed for current input.', {
        estimatedRequests: estimate
      });
    }

    applyLanguage(nextLang, true);

    let changed = false;
    for (const id of richTextFields) {
      const didChange = await translateEditableDivById(id, nextLang);
      changed = changed || didChange;
    }

    updatePreview();

    const nextPack = getLangPack();
    if (!changed) {
      showStatusToast(nextPack.translateStatus.empty, 2600);
    } else {
      showStatusToast(nextPack.translateStatus.success, 3200);
    }
  } catch (error) {
    showErrorToast(getTranslateErrorMessage(error, getLangPack()), 5200);
  } finally {
    isLanguageSwitching = false;
    document.getElementById('languageBtn').disabled = false;
  }
}

function buildMessageHTML() {
  const getCleanHTML = (id) => {
    const html = document.getElementById(id).innerHTML || '';
    return html.replace(/\s+style=(['"]).*?\1/gi, '').trim();
  };

  const labels = getLangPack().outputLabels;

  if (activeTmpl === 'vraag') {
    const queueSelect = document.getElementById('wachtrij');
    const selectedOption = queueSelect.options[queueSelect.selectedIndex];

    const w = selectedOption && selectedOption.value ? selectedOption.text.trim() : '';
    const k = document.getElementById('klantnummer').value.trim();
    const v = getCleanHTML('klantvraag');
    const l = getCleanHTML('vastloper');
    const u = getCleanHTML('uitkomst');

    return `<b>• ${labels.wachtrij}:</b><br>${w || '…'}<br><br>` +
      `<b>• ${labels.klantnummer}:</b><br>${k || '…'}<br><br>` +
      `<b>• ${labels.klantvraag}:</b><br>${v || '…'}<br><br>` +
      `<b>• ${labels.vastloper}:</b><br>${l || '…'}<br><br>` +
      `<b>• ${labels.uitkomst}:</b><br>${u || '…'}`;
  }

  const a = getCleanHTML('antwoord');
  const b = getCleanHTML('bron');
  const v = getCleanHTML('vervolgstap');

  let msg = `<b>• ${labels.antwoord}:</b><br>${a || '…'}`;
  if (b) msg += `<br><br><b>• ${labels.bron}:</b><br>${b}`;
  if (v) msg += `<br><br><b>• ${labels.vervolgstap}:</b><br>${v}`;
  return msg;
}

function updatePreview() {
  document.getElementById('preview').innerHTML = buildMessageHTML();
}

function validate() {
  const required = activeTmpl === 'vraag'
    ? ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst']
    : ['antwoord'];

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
  if (!validate()) {
    const errorToast = document.getElementById('toast-error');
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 10000);
    return;
  }

  const htmlMsg = buildMessageHTML();

  try {
    const clipboardItem = new ClipboardItem({
      'text/html': new Blob([htmlMsg], { type: 'text/html' }),
      'text/plain': new Blob([document.getElementById('preview').innerText], { type: 'text/plain' })
    });
    await navigator.clipboard.write([clipboardItem]);
  } catch {
    const buffer = document.createElement('div');
    buffer.contentEditable = true;
    buffer.innerHTML = htmlMsg;
    buffer.style.position = 'fixed';
    buffer.style.opacity = '0';
    buffer.style.background = 'transparent';
    buffer.style.color = 'inherit';

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
  setTimeout(() => {
    toast.classList.remove('show');
    toast.innerHTML = getLangPack().toastSuccessHtml;
  }, 10000);
}

function clearForm() {
  const allFields = [...fieldsVraag, ...fieldsAntwoord];

  for (const id of allFields) {
    const el = document.getElementById(id);
    if (el.tagName === 'DIV') {
      el.innerHTML = '';
    } else {
      el.value = '';
    }
    el.classList.remove('error');
  }
  updatePreview();
}

document.querySelectorAll('div[contenteditable="true"]').forEach((el) => {
  el.addEventListener('paste', function(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    if (clipboardData.files && clipboardData.files.length > 0) return;

    e.preventDefault();
    const text = clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  });
});

for (const id of [...fieldsVraag, ...fieldsAntwoord]) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener('input', updatePreview);
  el.addEventListener('change', updatePreview);
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    copyToClipboard();
    return;
  }

  if (e.key === 'Escape') {
    hideLanguageMenu();
  }
});

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('themeBtn').textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem(themeStorageKey, isLight ? 'light' : 'dark');
}

document.getElementById('themeBtn').addEventListener('click', toggleTheme);
document.getElementById('languageBtn').addEventListener('mousedown', onLanguageButtonMouseDown);
document.getElementById('languageBtn').addEventListener('mouseup', onLanguageButtonMouseUp);
document.getElementById('languageBtn').addEventListener('mouseleave', onLanguageButtonMouseLeave);
document.getElementById('languageBtn').addEventListener('click', (event) => event.preventDefault());

document.addEventListener('mousedown', (event) => {
  if (!isLanguageMenuOpen()) return;

  const menu = document.getElementById('languageMenu');
  const button = document.getElementById('languageBtn');
  if (!menu || !button) return;

  if (menu.contains(event.target) || button.contains(event.target)) {
    return;
  }

  hideLanguageMenu();
});

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

const savedTheme = localStorage.getItem(themeStorageKey);
if (savedTheme === 'dark') {
  document.body.classList.remove('light-mode');
  document.getElementById('themeBtn').textContent = '☀️';
} else {
  // Default to light mode when no stored theme exists.
  document.body.classList.add('light-mode');
  document.getElementById('themeBtn').textContent = '🌙';
}

const urlParams = new URLSearchParams(window.location.search);
for (const key of ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst']) {
  if (!urlParams.has(key)) continue;

  const el = document.getElementById(key);
  if (!el) continue;

  const value = decodeURIComponent(urlParams.get(key));
  if (el.tagName === 'DIV') {
    el.innerText = value;
  } else {
    el.value = value;
  }
}

renderTemplateVersion();
applyLanguage(activeLang, false);
document.getElementById('switchBtn').addEventListener('click', toggleTemplate);
document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
document.getElementById('btn-clear').addEventListener('click', clearForm);

function applyLocalTextBeautifier(e) {
  if (!['nl', 'en', 'de'].includes(activeLang)) return;

  const el = e.target;
  let val = el.innerText;
  if (!val) return;

  val = val.replace(/  +/g, ' ');

  const letters = val.replace(/[^a-zA-Z]/g, '');
  const upperCases = val.replace(/[^A-Z]/g, '');
  if (letters.length > 10 && (upperCases.length / letters.length) > 0.6) {
    val = val.toLowerCase();
  }

  val = val.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase());

  if (el.innerText !== val) {
    el.innerText = val;
    updatePreview();
  }
}

for (const id of richTextFields) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener('blur', applyLocalTextBeautifier);
}
