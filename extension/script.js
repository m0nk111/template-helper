/**
 * MAIN INTERFACE SCRIPT (script.js)
 * Controls template mode, theme mode, language mode, and clipboard output.
 */

const templateModeStorageKey = 'vraag-tmpl-active-template';
const templateDomainStorageKey = 'vraag-tmpl-active-domain';
const themeStorageKey = 'vraag-tmpl-theme';
const languageStorageKey = 'vraag-tmpl-language';
const enabledLanguagesStorageKey = 'vraag-tmpl-enabled-languages';
const translationProviderStorageKey = 'vraag-tmpl-translate-provider';
const azureTranslatorKeyStorageKey = 'vraag-tmpl-azure-translator-key';
const azureTranslatorRegionStorageKey = 'vraag-tmpl-azure-translator-region';
const azureTranslatorEndpointStorageKey = 'vraag-tmpl-azure-translator-endpoint';
const googleTranslateEndpoint = 'https://translate.googleapis.com/translate_a/single';
const azureTranslatorDefaultEndpoint = 'https://api.cognitive.microsofttranslator.com/translate';
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
let activeDomain = localStorage.getItem(templateDomainStorageKey) === 'tcc' ? 'tcc' : 'va';
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
const fieldsTccVraag = ['tccKlantnummer', 'tccNotitie', 'tccScreenshots'];
const fieldsTccAntwoord = ['tccNogControleren', 'tccAanvullen', 'tccAkkoord'];
const richTextFieldsTcc = ['tccNotitie', 'tccScreenshots', 'tccNogControleren', 'tccAanvullen'];
const allRichTextFields = [...richTextFields, ...richTextFieldsTcc];
const draftDatabaseName = 'template-helper-drafts';
const draftDatabaseVersion = 1;
const draftStoreName = 'drafts';
const draftRecordVersion = 1;
const draftMaxAgeMs = 24 * 60 * 60 * 1000;
const draftSaveDelayMs = 250;
const crsOrigin = 'https://crs.gw.dfnld.nl';
const crsNoteUpdateMessageType = 'template-helper:crs-note-update';
const crsNoteMaxLength = 50000;
const crsScreenshotRequestMessageType = 'template-helper:screenshot-request';
const crsScreenshotResultMessageType = 'template-helper:screenshot-result';
const crsScreenshotErrorMessageType = 'template-helper:screenshot-error';
const screenshotTargetFields = [...allRichTextFields];
const screenshotDataUrlMaxLength = 20 * 1024 * 1024;
const draftMaxFieldLength = screenshotDataUrlMaxLength * 4;
const screenshotRequestTimeoutMs = 10000;
const translationCache = new Map();
let translateQueue = Promise.resolve();
let lastTranslateRequestAt = 0;
let translateBlockedUntil = 0;
let lastCrsSuppliedTccNote = '';
let hasManualTccNoteChange = false;
let isApplyingCrsTccNote = false;
let currentDraftId = '';
let currentDraftContext = { hasCustomerNumber: false, value: '' };
let draftDbPromise = null;
let draftSaveTimer = null;
let draftOperationChain = Promise.resolve();
let draftReady = false;
let draftStorageAvailable = false;

function normalizeCustomerNumber(value) {
  return String(value || '').trim();
}

function createDraftContext(customerNumber) {
  const value = normalizeCustomerNumber(customerNumber);
  return { hasCustomerNumber: value.length > 0, value };
}

function isValidDraftContext(context) {
  return !!context && typeof context === 'object' &&
    typeof context.hasCustomerNumber === 'boolean' &&
    typeof context.value === 'string' &&
    context.value.length <= 100 &&
    context.hasCustomerNumber === (context.value.length > 0);
}

function areDraftContextsEqual(first, second) {
  return isValidDraftContext(first) && isValidDraftContext(second) &&
    first.hasCustomerNumber === second.hasCustomerNumber &&
    first.value === second.value;
}

function getDraftFieldIds() {
  return [...new Set([...fieldsVraag, ...fieldsAntwoord, ...fieldsTccVraag, ...fieldsTccAntwoord])];
}

function getDraftFieldValue(element) {
  if (element.tagName === 'DIV') {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('.screenshot-remove').forEach((button) => {
      button.removeAttribute('data-template-helper-bound');
    });
    return clone.innerHTML;
  }
  if (element.type === 'checkbox') return element.checked;
  return element.value;
}

function captureDraftRecord() {
  const fields = {};
  for (const id of getDraftFieldIds()) {
    const element = document.getElementById(id);
    if (element) fields[id] = getDraftFieldValue(element);
  }

  return {
    draftId: currentDraftId,
    recordVersion: draftRecordVersion,
    customerContext: { ...currentDraftContext },
    fields,
    tccNoteState: {
      lastCrsSuppliedTccNote,
      hasManualTccNoteChange
    },
    updatedAt: Date.now()
  };
}

function isValidDraftFieldValue(value) {
  return typeof value === 'string' || typeof value === 'boolean';
}

function isValidDraftRecord(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return false;
  if (record.recordVersion !== draftRecordVersion || typeof record.draftId !== 'string') return false;
  if (!isValidDraftContext(record.customerContext) || !record.fields || typeof record.fields !== 'object') return false;
  if (typeof record.updatedAt !== 'number' || !Number.isFinite(record.updatedAt)) return false;

  for (const id of getDraftFieldIds()) {
    if (!Object.prototype.hasOwnProperty.call(record.fields, id)) continue;
    if (!isValidDraftFieldValue(record.fields[id])) return false;
    if (typeof record.fields[id] === 'string' && record.fields[id].length > draftMaxFieldLength) return false;
  }

  if (record.tccNoteState !== undefined &&
    (!record.tccNoteState || typeof record.tccNoteState.lastCrsSuppliedTccNote !== 'string' ||
      typeof record.tccNoteState.hasManualTccNoteChange !== 'boolean')) {
    return false;
  }

  return true;
}

function openDraftDatabase() {
  if (!currentDraftId || typeof indexedDB === 'undefined') return Promise.resolve(null);
  if (draftDbPromise) return draftDbPromise;

  draftDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(draftDatabaseName, draftDatabaseVersion);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(draftStoreName)) {
        request.result.createObjectStore(draftStoreName, { keyPath: 'draftId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Draft database could not be opened.'));
  });

  return draftDbPromise;
}

function getDraftRecord() {
  return openDraftDatabase().then((database) => {
    if (!database) return null;

    return new Promise((resolve, reject) => {
      const request = database.transaction(draftStoreName, 'readonly')
        .objectStore(draftStoreName)
        .get(currentDraftId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('Draft could not be read.'));
    });
  });
}

function saveDraftRecord(record) {
  return openDraftDatabase().then((database) => {
    if (!database) return false;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(draftStoreName, 'readwrite');
      transaction.objectStore(draftStoreName).put(record);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error || new Error('Draft could not be saved.'));
      transaction.onabort = () => reject(transaction.error || new Error('Draft save was aborted.'));
    });
  });
}

function deleteDraftRecord(draftId) {
  if (!draftId) return Promise.resolve(false);

  return openDraftDatabase().then((database) => {
    if (!database) return false;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(draftStoreName, 'readwrite');
      transaction.objectStore(draftStoreName).delete(draftId);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(transaction.error || new Error('Draft could not be deleted.'));
      transaction.onabort = () => reject(transaction.error || new Error('Draft deletion was aborted.'));
    });
  });
}

function removeExpiredDrafts() {
  return openDraftDatabase().then((database) => {
    if (!database) return;

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(draftStoreName, 'readwrite');
      const request = transaction.objectStore(draftStoreName).openCursor();
      const expiryTime = Date.now() - draftMaxAgeMs;

      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor) return;
        if (!cursor.value || typeof cursor.value.updatedAt !== 'number' || cursor.value.updatedAt < expiryTime) {
          cursor.delete();
        }
        cursor.continue();
      };
      request.onerror = () => reject(request.error || new Error('Expired drafts could not be removed.'));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error('Expired draft cleanup failed.'));
      transaction.onabort = () => reject(transaction.error || new Error('Expired draft cleanup was aborted.'));
    });
  });
}

function reportDraftStorageError(error) {
  draftStorageAvailable = false;
  console.debug('Template Helper: draft persistence is unavailable.', error);
}

function queueDraftOperation(operation) {
  draftOperationChain = draftOperationChain.then(operation).catch(reportDraftStorageError);
  return draftOperationChain;
}

function scheduleDraftSave() {
  if (!draftReady || !currentDraftId || !draftStorageAvailable) return;

  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(() => {
    draftSaveTimer = null;
    const record = captureDraftRecord();
    queueDraftOperation(() => saveDraftRecord(record));
  }, draftSaveDelayMs);
}

function flushDraftSave() {
  if (draftSaveTimer) {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = null;
    if (draftReady && currentDraftId && draftStorageAvailable) {
      const record = captureDraftRecord();
      return queueDraftOperation(() => saveDraftRecord(record));
    }
  }

  return draftOperationChain;
}

function clearStoredDraft() {
  clearTimeout(draftSaveTimer);
  draftSaveTimer = null;
  if (!currentDraftId) return;
  queueDraftOperation(() => deleteDraftRecord(currentDraftId));
}

function restoreDraftRecord(record) {
  for (const id of getDraftFieldIds()) {
    if (!Object.prototype.hasOwnProperty.call(record.fields, id)) continue;

    const element = document.getElementById(id);
    const value = record.fields[id];
    if (!element) continue;

    if (element.tagName === 'DIV' && typeof value === 'string') {
      element.innerHTML = sanitizeDraftHTML(value);
    } else if (element.type === 'checkbox' && typeof value === 'boolean') {
      element.checked = value;
    } else if (element.tagName !== 'DIV' && typeof value === 'string') {
      element.value = value;
    }
  }

  bindScreenshotRemoveButtons();
  updateTccAgreementValue();
  updatePreview();
}

function sanitizeSafeStyle(value) {
  const source = document.createElement('table');
  source.setAttribute('style', value || '');
  const allowedProperties = [
    'background-color',
    'border',
    'border-collapse',
    'border-color',
    'border-style',
    'border-width',
    'color',
    'font-size',
    'font-style',
    'font-weight',
    'height',
    'max-height',
    'max-width',
    'min-height',
    'min-width',
    'padding',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'padding-top',
    'text-align',
    'text-decoration',
    'vertical-align',
    'width'
  ];
  const sanitized = document.createElement('table');

  for (const property of allowedProperties) {
    const propertyValue = source.style.getPropertyValue(property).trim();
    if (!propertyValue || /(?:url\s*\(|expression\s*\(|@import|javascript:|var\s*\()/i.test(propertyValue)) continue;
    sanitized.style.setProperty(property, propertyValue);
  }

  return sanitized.getAttribute('style') || '';
}

function sanitizeTableAttribute(node, name, maximum) {
  const value = node.getAttribute(name) || '';
  if (!/^\d+$/.test(value)) return '';

  const numericValue = Number(value);
  return numericValue >= 1 && numericValue <= maximum ? String(numericValue) : '';
}

function sanitizeDraftHTML(value) {
  if (typeof value !== 'string' || value.length > draftMaxFieldLength) return '';

  const template = document.createElement('template');
  template.innerHTML = value;
  const allowedTags = new Set([
    'A', 'B', 'BLOCKQUOTE', 'BR', 'CAPTION', 'COL', 'COLGROUP', 'DIV', 'EM', 'I', 'LI',
    'OL', 'P', 'S', 'SPAN', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD',
    'TR', 'U', 'UL'
  ]);
  const dangerousTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'LINK', 'META']);

  const sanitizeChildren = (parent) => {
    [...parent.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) return;
      if (node.nodeType !== Node.ELEMENT_NODE) {
        node.remove();
        return;
      }

      const tagName = node.tagName;
      if (dangerousTags.has(tagName)) {
        node.remove();
        return;
      }

      if (tagName === 'IMG') {
        const source = node.getAttribute('src') || '';
        if (!isValidScreenshotDataUrl(source) || source.length > screenshotDataUrlMaxLength) {
          node.remove();
          return;
        }
        node.replaceChildren();
        [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
        node.setAttribute('src', source);
        node.setAttribute('alt', getLangPack().screenshotAlt);
        node.setAttribute('draggable', 'false');
        return;
      }

      if (tagName === 'BUTTON') {
        if (!node.classList.contains('screenshot-remove') || !node.closest('.screenshot-item')) {
          node.remove();
          return;
        }
        node.replaceChildren(document.createTextNode('×'));
        [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
        node.setAttribute('type', 'button');
        node.setAttribute('class', 'screenshot-remove');
        node.setAttribute('title', getLangPack().buttons.removeScreenshot);
        node.setAttribute('aria-label', getLangPack().buttons.removeScreenshot);
        return;
      }

      if (tagName === 'BR') {
        const isScreenshotSeparator = node.hasAttribute('data-screenshot-separator');
        node.replaceChildren();
        [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
        if (isScreenshotSeparator) node.setAttribute('data-screenshot-separator', 'true');
        return;
      }

      if (tagName === 'SPAN' && node.classList.contains('screenshot-item')) {
        const isManagedScreenshot = node.getAttribute('data-template-helper-screenshot') === 'true';
        sanitizeChildren(node);
        if (!node.querySelector('img')) {
          node.remove();
          return;
        }
        [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
        node.setAttribute('class', 'screenshot-item');
        node.setAttribute('contenteditable', 'false');
        if (isManagedScreenshot) node.setAttribute('data-template-helper-screenshot', 'true');
        return;
      }

      const safeStyle = sanitizeSafeStyle(node.getAttribute('style'));
      const safeRowSpan = (tagName === 'TD' || tagName === 'TH')
        ? sanitizeTableAttribute(node, 'rowspan', 100)
        : '';
      const safeColSpan = (tagName === 'TD' || tagName === 'TH')
        ? sanitizeTableAttribute(node, 'colspan', 100)
        : '';
      const safeSpan = tagName === 'COL' ? sanitizeTableAttribute(node, 'span', 100) : '';
      const scope = node.getAttribute('scope') || '';
      const safeScope = tagName === 'TH' && ['col', 'colgroup', 'row', 'rowgroup'].includes(scope)
        ? scope
        : '';

      if (!allowedTags.has(tagName)) {
        sanitizeChildren(node);
        const replacement = document.createDocumentFragment();
        while (node.firstChild) replacement.appendChild(node.firstChild);
        node.replaceWith(replacement);
        return;
      }

      [...node.attributes].forEach((attribute) => node.removeAttribute(attribute.name));
      if (safeStyle) node.setAttribute('style', safeStyle);
      if (safeRowSpan) node.setAttribute('rowspan', safeRowSpan);
      if (safeColSpan) node.setAttribute('colspan', safeColSpan);
      if (safeSpan) node.setAttribute('span', safeSpan);
      if (safeScope) node.setAttribute('scope', safeScope);
      sanitizeChildren(node);
    });
  };

  sanitizeChildren(template.content);
  const container = document.createElement('div');
  container.appendChild(template.content.cloneNode(true));
  return container.innerHTML;
}

function reconcileRestoredTccNote(record, currentCrsNote) {
  const noteState = record.tccNoteState || {
    lastCrsSuppliedTccNote: '',
    hasManualTccNoteChange: false
  };
  const tccNotitie = document.getElementById('tccNotitie');

  if (currentCrsNote !== null && !noteState.hasManualTccNoteChange && tccNotitie) {
    tccNotitie.textContent = currentCrsNote;
  }

  lastCrsSuppliedTccNote = currentCrsNote === null
    ? noteState.lastCrsSuppliedTccNote
    : currentCrsNote;
  hasManualTccNoteChange = noteState.hasManualTccNoteChange;
}

async function initializeDraftPersistence(draftId, customerContext, currentCrsNote) {
  currentDraftId = typeof draftId === 'string' ? draftId : '';
  currentDraftContext = isValidDraftContext(customerContext)
    ? { ...customerContext }
    : createDraftContext('');

  if (!currentDraftId || typeof indexedDB === 'undefined') {
    draftReady = true;
    return;
  }

  try {
    await removeExpiredDrafts();
    const record = await getDraftRecord();

    if (record && isValidDraftRecord(record) && areDraftContextsEqual(record.customerContext, currentDraftContext)) {
      restoreDraftRecord(record);
      reconcileRestoredTccNote(record, currentCrsNote);
    } else if (record) {
      await deleteDraftRecord(currentDraftId);
    }

    draftStorageAvailable = true;
  } catch (error) {
    reportDraftStorageError(error);
  } finally {
    draftReady = true;
    updatePreview();
    scheduleDraftSave();
  }
}
let pendingCrsTccNote = null;
let lastIgnoredCrsTccNote = null;
let pendingScreenshotRequest = null;

const i18n = {
  nl: {
    pageTitleVraag: 'Vraag Template',
    pageTitleAntwoord: 'Antwoord Template',
    pageTitleTccVraag: 'Ticketcontrole Verzoek',
    pageTitleTccAntwoord: 'Ticketcontrole Antwoord',
    switchToVraagTitle: 'Vraag Template',
    switchToAntwoordTitle: 'Mod Antwoord Template',
    switchToTccVraagTitle: 'TCC Verzoek Template',
    switchToTccAntwoordTitle: 'TCC Antwoord Template',
    switchToVaTitle: 'Wissel naar V&A',
    switchToTccTitle: 'Wissel naar Ticket Check Chat',
    subtitle: 'Vul het formulier in en kopieer het bericht naar Teams.',
    labels: {
      wachtrij: 'Wachtrij',
      klantnummer: 'Klantnummer',
      klantvraag: 'Klantvraag',
      vastloper: 'Waar loop je vast (in het script)',
      uitkomst: 'Gewenste uitkomst',
      antwoord: 'Antwoord',
      bron: 'Bron',
      vervolgstap: 'Vervolgstap',
      tccKlantnummer: 'Klantnummer',
      tccNotitie: 'Notitie',
      tccScreenshots: 'Screenshots',
      tccNogControleren: 'Nog controleren',
      tccAanvullen: 'Aanvullen in ticket',
      tccAkkoord: 'Akkoord'
    },
    placeholders: {
      klantnummer: 'Bijv. 12345678',
      klantvraag: 'Wat is de vraag van de klant? Je kunt hier ook een screenshot droppen.',
      vastloper: 'Beschrijf waar je vastzit...',
      uitkomst: 'Wat wil je bereiken?',
      antwoord: 'Typ hier je inhoudelijke antwoord en/of screenshot...',
      bron: 'Uit welk systeem komt de informatie?',
      vervolgstap: 'Wat verwacht je nu van de agent?',
      tccKlantnummer: 'Bijv. 12345678',
      tccNotitie: 'Plak hier de notitie uit CRS.',
      tccScreenshots: 'Plak of drop screenshots hier.',
      tccNogControleren: 'Nog te controleren punt...',
      tccAanvullen: 'Wat moet in het ticket worden aangevuld?'
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
      captureScreenshot: 'Maak screenshot van CRS',
      removeScreenshot: 'Verwijder screenshot',
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
      providerAuth: '⚠️ Azure Translator is geconfigureerd, maar key/region lijkt ongeldig. Controleer je instellingen of gebruik Google.',
      network: '⚠️ Netwerkfout tijdens vertalen. Probeer het zo opnieuw.',
      cooldown: '⚠️ Vertalen is tijdelijk gepauzeerd. Probeer over {seconds}s opnieuw.',
      failed: '⚠️ Interface gewijzigd, maar inhoud vertalen is mislukt.'
    },
    screenshotStatus: {
      capturing: '📸 Screenshot van CRS maken...',
      added: '📸 Screenshot toegevoegd.',
      failed: '⚠️ Screenshot maken is mislukt. Probeer opnieuw.',
      permissionDenied: '⚠️ Screenshotcapture is niet toegestaan. Herlaad de extensie in chrome://extensions/ en sta de nieuwe toestemming toe.',
      unavailable: '⚠️ Screenshots maken werkt alleen vanuit CRS.'
    },
    screenshotAlt: 'CRS-schermafbeelding',
    outputLabels: {
      wachtrij: 'Wachtrij',
      klantnummer: 'Klantnummer',
      klantvraag: 'Klantvraag',
      vastloper: 'Waar loop je vast (in het script)',
      uitkomst: 'Gewenste uitkomst',
      antwoord: 'Antwoord',
      bron: 'Bron',
      vervolgstap: 'Vervolgstap',
      tccKlantnummer: 'Klantnummer',
      tccNotitie: 'Notitie',
      tccScreenshots: 'Screenshots',
      tccNogControleren: 'Nog controleren',
      tccAanvullen: 'Aanvullen in ticket',
      tccAkkoord: 'Akkoord',
      agreementYes: 'ja',
      agreementNo: 'nee'
    }
  },
  en: {
    pageTitleVraag: 'Question Template',
    pageTitleAntwoord: 'Answer Template',
    pageTitleTccVraag: 'Ticket Check Request',
    pageTitleTccAntwoord: 'Ticket Check Answer',
    switchToVraagTitle: 'Question Template',
    switchToAntwoordTitle: 'Moderator Answer Template',
    switchToTccVraagTitle: 'Ticket Check Request Template',
    switchToTccAntwoordTitle: 'Ticket Check Answer Template',
    switchToVaTitle: 'Switch to Q&A',
    switchToTccTitle: 'Switch to Ticket Check Chat',
    subtitle: 'Fill in the form and copy the message to Teams.',
    labels: {
      wachtrij: 'Queue',
      klantnummer: 'Customer number',
      klantvraag: 'Customer question',
      vastloper: 'Where are you stuck (in the script)',
      uitkomst: 'Desired outcome',
      antwoord: 'Answer',
      bron: 'Source',
      vervolgstap: 'Next step',
      tccKlantnummer: 'Customer number',
      tccNotitie: 'Note',
      tccScreenshots: 'Screenshots',
      tccNogControleren: 'Still to check',
      tccAanvullen: 'Add to ticket',
      tccAkkoord: 'Approved'
    },
    placeholders: {
      klantnummer: 'For example: 12345678',
      klantvraag: 'What is the customer asking? You can also drop a screenshot here.',
      vastloper: 'Describe where you are stuck...',
      uitkomst: 'What would you like to achieve?',
      antwoord: 'Type your substantive answer and/or screenshot here...',
      bron: 'Which system is this information from?',
      vervolgstap: 'What do you expect from the agent now?',
      tccKlantnummer: 'For example: 12345678',
      tccNotitie: 'Paste the note from CRS here.',
      tccScreenshots: 'Paste or drop screenshots here.',
      tccNogControleren: 'Item still to check...',
      tccAanvullen: 'What should be added to the ticket?'
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
      captureScreenshot: 'Capture screenshot from CRS',
      removeScreenshot: 'Remove screenshot',
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
      providerAuth: '⚠️ Azure Translator is configured, but key/region appears invalid. Check your settings or switch back to Google.',
      network: '⚠️ Network issue during translation. Please try again shortly.',
      cooldown: '⚠️ Translation is temporarily paused. Try again in {seconds}s.',
      failed: '⚠️ Interface switched, but content translation failed.'
    },
    screenshotStatus: {
      capturing: '📸 Capturing screenshot from CRS...',
      added: '📸 Screenshot added.',
      failed: '⚠️ Screenshot capture failed. Try again.',
      permissionDenied: '⚠️ Screenshot capture is not allowed. Reload the extension in chrome://extensions/ and allow the new permission.',
      unavailable: '⚠️ Screenshot capture only works from CRS.'
    },
    screenshotAlt: 'CRS screenshot',
    outputLabels: {
      wachtrij: 'Queue',
      klantnummer: 'Customer number',
      klantvraag: 'Customer question',
      vastloper: 'Where are you stuck (in the script)',
      uitkomst: 'Desired outcome',
      antwoord: 'Answer',
      bron: 'Source',
      vervolgstap: 'Next step',
      tccKlantnummer: 'Customer number',
      tccNotitie: 'Note',
      tccScreenshots: 'Screenshots',
      tccNogControleren: 'Still to check',
      tccAanvullen: 'Add to ticket',
      tccAkkoord: 'Approved',
      agreementYes: 'yes',
      agreementNo: 'no'
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

function renderTemplateState() {
  const langPack = getLangPack();
  const isTccDomain = activeDomain === 'tcc';
  const isAnswerMode = activeTmpl === 'antwoord';

  document.getElementById('tmpl-vraag').style.display = !isTccDomain && !isAnswerMode ? 'block' : 'none';
  document.getElementById('tmpl-antwoord').style.display = !isTccDomain && isAnswerMode ? 'block' : 'none';
  document.getElementById('tmpl-tcc-vraag').style.display = isTccDomain && !isAnswerMode ? 'block' : 'none';
  document.getElementById('tmpl-tcc-antwoord').style.display = isTccDomain && isAnswerMode ? 'block' : 'none';

  const pageTitle = isTccDomain
    ? (isAnswerMode ? langPack.pageTitleTccAntwoord : langPack.pageTitleTccVraag)
    : (isAnswerMode ? langPack.pageTitleAntwoord : langPack.pageTitleVraag);
  const switchTitle = isTccDomain
    ? (isAnswerMode ? langPack.switchToTccVraagTitle : langPack.switchToTccAntwoordTitle)
    : (isAnswerMode ? langPack.switchToVraagTitle : langPack.switchToAntwoordTitle);

  document.getElementById('pageTitle').textContent = pageTitle;
  document.getElementById('switchBtn').title = switchTitle;

  const domainButton = document.getElementById('domainBtn');
  const domainTitle = isTccDomain ? langPack.switchToVaTitle : langPack.switchToTccTitle;
  domainButton.textContent = isTccDomain ? 'TCC' : 'V&A';
  domainButton.title = domainTitle;
  domainButton.setAttribute('aria-label', domainTitle);
  domainButton.setAttribute('aria-pressed', String(isTccDomain));
  domainButton.classList.toggle('tcc-active', isTccDomain);
}

function setTemplateMode(mode, persist) {
  activeTmpl = mode === 'antwoord' ? 'antwoord' : 'vraag';

  if (persist) {
    localStorage.setItem(templateModeStorageKey, activeTmpl);
  }

  if (!isActiveTccRequest()) {
    closeCrsNoteConflictDialog(false);
  }

  renderTemplateState();
  updatePreview();
}

function setDomainMode(domain, persist) {
  activeDomain = domain === 'tcc' ? 'tcc' : 'va';

  if (persist) {
    localStorage.setItem(templateDomainStorageKey, activeDomain);
  }

  if (!isActiveTccRequest()) {
    closeCrsNoteConflictDialog(false);
  }

  renderTemplateState();
  updatePreview();
}

function toggleTemplate() {
  setTemplateMode(activeTmpl === 'vraag' ? 'antwoord' : 'vraag', true);
}

function toggleDomain() {
  setDomainMode(activeDomain === 'va' ? 'tcc' : 'va', true);
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
  document.getElementById('labelTccKlantnummer').innerHTML = `${langPack.labels.tccKlantnummer} <span class="required">*</span>`;
  document.getElementById('labelTccNotitie').innerHTML = `${langPack.labels.tccNotitie} <span class="required">*</span>`;
  document.getElementById('labelTccScreenshots').innerHTML = `${langPack.labels.tccScreenshots} <span class="required">*</span>`;
  document.getElementById('labelTccNogControleren').textContent = langPack.labels.tccNogControleren;
  document.getElementById('labelTccAanvullen').textContent = langPack.labels.tccAanvullen;
  document.getElementById('labelTccAkkoord').textContent = langPack.labels.tccAkkoord;

  document.getElementById('klantnummer').placeholder = langPack.placeholders.klantnummer;
  document.getElementById('klantvraag').setAttribute('data-placeholder', langPack.placeholders.klantvraag);
  document.getElementById('vastloper').setAttribute('data-placeholder', langPack.placeholders.vastloper);
  document.getElementById('uitkomst').setAttribute('data-placeholder', langPack.placeholders.uitkomst);
  document.getElementById('antwoord').setAttribute('data-placeholder', langPack.placeholders.antwoord);
  document.getElementById('bron').setAttribute('data-placeholder', langPack.placeholders.bron);
  document.getElementById('vervolgstap').setAttribute('data-placeholder', langPack.placeholders.vervolgstap);
  document.getElementById('tccKlantnummer').placeholder = langPack.placeholders.tccKlantnummer;
  document.getElementById('tccNotitie').setAttribute('data-placeholder', langPack.placeholders.tccNotitie);
  document.getElementById('tccScreenshots').setAttribute('data-placeholder', langPack.placeholders.tccScreenshots);
  document.getElementById('tccNogControleren').setAttribute('data-placeholder', langPack.placeholders.tccNogControleren);
  document.getElementById('tccAanvullen').setAttribute('data-placeholder', langPack.placeholders.tccAanvullen);
  updateTccAgreementValue();

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
  document.querySelectorAll('.btn-capture-screenshot').forEach((button) => {
    button.title = langPack.buttons.captureScreenshot;
    button.setAttribute('aria-label', langPack.buttons.captureScreenshot);
  });

  renderLanguageMenu();
  renderTemplateState();
  updatePreview();
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

function isActiveTccRequest() {
  return activeDomain === 'tcc' && activeTmpl === 'vraag';
}

function applyCrsTccNote(note) {
  const tccNotitie = document.getElementById('tccNotitie');
  isApplyingCrsTccNote = true;
  tccNotitie.textContent = note;
  isApplyingCrsTccNote = false;
  lastCrsSuppliedTccNote = note;
  hasManualTccNoteChange = false;
  lastIgnoredCrsTccNote = null;
  updatePreview();
  scheduleDraftSave();
}

function closeCrsNoteConflictDialog(returnFocus) {
  const dialog = document.getElementById('crsNoteConflictDialog');
  if (!dialog) return;

  dialog.hidden = true;
  pendingCrsTccNote = null;

  if (returnFocus && isActiveTccRequest()) {
    document.getElementById('tccNotitie').focus();
  }
}

function showCrsNoteConflictDialog(note) {
  pendingCrsTccNote = note;

  const dialog = document.getElementById('crsNoteConflictDialog');
  if (!dialog || !dialog.hidden) return;

  dialog.hidden = false;
  document.getElementById('crsNoteConflictKeep').focus();
}

function handleCrsNoteUpdate(note) {
  if (!isActiveTccRequest()) return;

  const tccNotitie = document.getElementById('tccNotitie');
  if (!hasManualTccNoteChange) {
    if (note === lastCrsSuppliedTccNote && note === tccNotitie.textContent) {
      updatePreview();
      return;
    }
    applyCrsTccNote(note);
    return;
  }

  if (note === tccNotitie.textContent || note === lastIgnoredCrsTccNote) return;

  showCrsNoteConflictDialog(note);
}

function handleTccNotitieInput() {
  if (isApplyingCrsTccNote) return;

  hasManualTccNoteChange = true;
  lastIgnoredCrsTccNote = null;
}

function hasExactMessageKeys(data, keys) {
  return !!data && typeof data === 'object' && !Array.isArray(data) &&
    Object.keys(data).length === keys.length &&
    keys.every((key) => Object.prototype.hasOwnProperty.call(data, key));
}

function createScreenshotRequestId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function setScreenshotCaptureButtonsDisabled(disabled) {
  document.querySelectorAll('.btn-capture-screenshot').forEach((button) => {
    button.disabled = disabled;
  });
}

function clearPendingScreenshotRequest() {
  if (pendingScreenshotRequest && pendingScreenshotRequest.timeoutId) {
    clearTimeout(pendingScreenshotRequest.timeoutId);
  }

  pendingScreenshotRequest = null;
  setScreenshotCaptureButtonsDisabled(false);
}

function isValidScreenshotDataUrl(dataUrl) {
  return typeof dataUrl === 'string' &&
    dataUrl.length > 0 &&
    dataUrl.length <= screenshotDataUrlMaxLength &&
    /^data:image\/png;base64,[a-z0-9+/=]+$/i.test(dataUrl);
}

function getScreenshotErrorMessage(errorCode) {
  const status = getLangPack().screenshotStatus;
  if (errorCode === 'capture-permission-denied') return status.permissionDenied;
  if (errorCode === 'invalid-capture-context') return status.unavailable;
  return status.failed;
}

function createScreenshotItem(dataUrl) {
  const screenshotItem = document.createElement('span');
  screenshotItem.className = 'screenshot-item';
  screenshotItem.contentEditable = 'false';
  screenshotItem.setAttribute('data-template-helper-screenshot', 'true');

  const image = document.createElement('img');
  image.src = dataUrl;
  image.alt = getLangPack().screenshotAlt;
  image.draggable = false;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'screenshot-remove';
  removeButton.title = getLangPack().buttons.removeScreenshot;
  removeButton.setAttribute('aria-label', getLangPack().buttons.removeScreenshot);
  removeButton.textContent = '×';

  screenshotItem.append(image, removeButton);
  bindScreenshotRemoveButtons(screenshotItem);
  return screenshotItem;
}

function isScreenshotSeparator(node) {
  return node?.nodeName === 'BR' && node.getAttribute('data-screenshot-separator') === 'true';
}

function isLegacyScreenshotSeparator(node, isPreceding) {
  return node?.nodeName === 'BR' && !isScreenshotSeparator(node) &&
    (isPreceding || node.nextSibling?.classList?.contains('screenshot-item'));
}

function handleScreenshotRemove(event) {
  event.preventDefault();
  event.stopPropagation();

  const screenshotItem = event.currentTarget.closest('.screenshot-item');
  if (!screenshotItem) return;

  const precedingNode = screenshotItem.previousSibling;
  const followingNode = screenshotItem.nextSibling;
  const isLegacyScreenshot = screenshotItem.getAttribute('data-template-helper-screenshot') !== 'true';
  if (isScreenshotSeparator(precedingNode) ||
    (isLegacyScreenshot && isLegacyScreenshotSeparator(precedingNode, true))) {
    precedingNode.remove();
  } else if (isScreenshotSeparator(followingNode) ||
    (isLegacyScreenshot && isLegacyScreenshotSeparator(followingNode, false))) {
    followingNode.remove();
  }
  screenshotItem.remove();
  updatePreview();
  scheduleDraftSave();
}

function bindScreenshotRemoveButtons(root = document) {
  root.querySelectorAll('.screenshot-remove').forEach((button) => {
    if (button.dataset.templateHelperBound === 'true') return;
    button.dataset.templateHelperBound = 'true';
    button.addEventListener('click', handleScreenshotRemove);
  });
}

function appendScreenshotToField(targetField, dataUrl) {
  const field = document.getElementById(targetField);
  if (!field || !screenshotTargetFields.includes(targetField)) return false;

  if (field.childNodes.length && field.lastChild?.nodeName !== 'BR') {
    const separator = document.createElement('br');
    separator.setAttribute('data-screenshot-separator', 'true');
    field.appendChild(separator);
  }

  field.appendChild(createScreenshotItem(dataUrl));
  field.classList.remove('error');
  field.setAttribute('aria-invalid', 'false');
  updatePreview();
  scheduleDraftSave();
  return true;
}

function requestCrsScreenshot(event) {
  const targetField = event.currentTarget.dataset.screenshotTarget;
  if (!screenshotTargetFields.includes(targetField) || pendingScreenshotRequest) return;

  const status = getLangPack().screenshotStatus;
  if (window.parent === window) {
    showStatusToast(status.unavailable, 3200);
    return;
  }

  const requestId = createScreenshotRequestId();
  pendingScreenshotRequest = { requestId, targetField, timeoutId: null };
  setScreenshotCaptureButtonsDisabled(true);
  showStatusToast(status.capturing, screenshotRequestTimeoutMs);

  pendingScreenshotRequest.timeoutId = setTimeout(() => {
    if (!pendingScreenshotRequest || pendingScreenshotRequest.requestId !== requestId) return;
    clearPendingScreenshotRequest();
    showStatusToast(getLangPack().screenshotStatus.failed, 3600);
  }, screenshotRequestTimeoutMs);

  window.parent.postMessage({
    type: crsScreenshotRequestMessageType,
    targetField,
    requestId
  }, crsOrigin);
}

function handleCrsScreenshotMessage(data) {
  const request = pendingScreenshotRequest;
  if (!request || data.requestId !== request.requestId || data.targetField !== request.targetField) return;

  const isResult = data.type === crsScreenshotResultMessageType &&
    hasExactMessageKeys(data, ['type', 'targetField', 'requestId', 'imageDataUrl']) &&
    isValidScreenshotDataUrl(data.imageDataUrl);
  const isError = data.type === crsScreenshotErrorMessageType &&
    hasExactMessageKeys(data, ['type', 'targetField', 'requestId', 'errorCode']) &&
    typeof data.errorCode === 'string' && data.errorCode.length <= 80;

  if (!isResult && !isError) return;

  clearPendingScreenshotRequest();
  if (!isResult || !appendScreenshotToField(data.targetField, data.imageDataUrl)) {
    showStatusToast(isError ? getScreenshotErrorMessage(data.errorCode) : getLangPack().screenshotStatus.failed, 5200);
    return;
  }

  showStatusToast(getLangPack().screenshotStatus.added, 2600);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeGetStorageValue(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getConfiguredTranslationProvider() {
  const raw = (safeGetStorageValue(translationProviderStorageKey) || 'google').trim().toLowerCase();
  if (raw === 'azure' || raw === 'microsoft' || raw === 'ms') {
    return 'azure';
  }
  return 'google';
}

function normalizeAzureEndpoint(endpoint) {
  const raw = (endpoint || '').trim();
  if (!raw) return azureTranslatorDefaultEndpoint;

  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  if (withoutTrailingSlash.endsWith('/translate')) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/translate`;
}

function getAzureTranslatorConfig() {
  return {
    endpoint: normalizeAzureEndpoint(safeGetStorageValue(azureTranslatorEndpointStorageKey)),
    key: (safeGetStorageValue(azureTranslatorKeyStorageKey) || '').trim(),
    region: (safeGetStorageValue(azureTranslatorRegionStorageKey) || '').trim()
  };
}

function canUseAzureTranslator(config) {
  return Boolean(config && config.endpoint && config.key && config.region);
}

function getTranslationProviderContext() {
  const configuredProvider = getConfiguredTranslationProvider();
  if (configuredProvider !== 'azure') {
    return { provider: 'google' };
  }

  const azureConfig = getAzureTranslatorConfig();
  if (!canUseAzureTranslator(azureConfig)) {
    // Azure path is optional and disabled unless fully configured.
    return { provider: 'google' };
  }

  return {
    provider: 'azure',
    azureConfig
  };
}

function normalizeTargetLanguageForProvider(targetLanguage, provider) {
  if (provider !== 'azure') {
    return targetLanguage;
  }

  const azureCodeMap = {
    'zh-CN': 'zh-Hans',
    'zh-TW': 'zh-Hant'
  };

  return azureCodeMap[targetLanguage] || targetLanguage;
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

  for (const id of getActiveRichTextFields()) {
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

async function performGoogleTranslateRequest(chunk, targetLanguage, signal) {
  const url = new URL(googleTranslateEndpoint);
  url.searchParams.set('client', 'gtx');
  url.searchParams.set('sl', 'auto');
  url.searchParams.set('tl', targetLanguage);
  url.searchParams.set('dt', 't');
  url.searchParams.set('q', chunk);

  const response = await fetch(url.toString(), {
    method: 'GET',
    signal
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
}

async function performAzureTranslateRequest(chunk, targetLanguage, azureConfig, signal) {
  const url = new URL(azureConfig.endpoint);
  url.searchParams.set('api-version', '3.0');
  url.searchParams.set('to', targetLanguage);

  const response = await fetch(url.toString(), {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': azureConfig.key,
      'Ocp-Apim-Subscription-Region': azureConfig.region
    },
    body: JSON.stringify([{ text: chunk }])
  });

  if (response.status === 429) {
    translateBlockedUntil = Date.now() + translateRateLimitCooldownMs;
    throw createTranslateError('TRANSLATE_RATE_LIMIT', 'Azure Translator rate limit reached (429).');
  }

  if (response.status === 401 || response.status === 403) {
    throw createTranslateError('TRANSLATE_PROVIDER_AUTH', 'Azure Translator credentials were rejected.', {
      status: response.status
    });
  }

  if (response.status === 400) {
    throw createTranslateError('TRANSLATE_BAD_REQUEST', 'Azure Translator rejected the request (400).', {
      status: 400
    });
  }

  if (!response.ok) {
    throw createTranslateError('TRANSLATE_HTTP', `Translate request failed with status ${response.status}.`, {
      status: response.status
    });
  }

  const data = await response.json();
  if (!Array.isArray(data) || !Array.isArray(data[0]?.translations) || !data[0].translations.length) {
    return chunk;
  }

  return data[0].translations.map((entry) => entry?.text || '').join('');
}

async function performTranslateRequest(chunk, targetLanguage, providerContext) {
  if (chunk.length > translateRequestMaxChars) {
    throw createTranslateError('TRANSLATE_TOO_LARGE', 'Translation chunk exceeds 5000 characters.', {
      chunkLength: chunk.length
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), translateRequestTimeoutMs);

  try {
    if (providerContext.provider === 'azure') {
      return await performAzureTranslateRequest(
        chunk,
        targetLanguage,
        providerContext.azureConfig,
        controller.signal
      );
    }

    return await performGoogleTranslateRequest(chunk, targetLanguage, controller.signal);
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

async function translateChunkWithRetry(chunk, targetLanguage, providerContext) {
  let attempt = 0;

  while (attempt <= translateMaxRetryAttempts) {
    try {
      return await enqueueTranslateRequest(() => performTranslateRequest(chunk, targetLanguage, providerContext));
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

  if (isTranslateError(error, 'TRANSLATE_PROVIDER_AUTH')) {
    return langPack.translateStatus.providerAuth;
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

async function translateTextViaProvider(text, targetLanguage) {
  const normalized = (text || '').trim();
  if (!normalized) return text;

  const providerContext = getTranslationProviderContext();
  const provider = providerContext.provider;
  const effectiveTargetLanguage = normalizeTargetLanguageForProvider(targetLanguage, provider);

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
    const cacheKey = `${provider}|${effectiveTargetLanguage}|${chunk}`;
    if (translationCache.has(cacheKey)) {
      translatedChunks.push(translationCache.get(cacheKey));
      continue;
    }

    const translatedChunk = await translateChunkWithRetry(chunk, effectiveTargetLanguage, providerContext);
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

  const translated = await translateTextViaProvider(middle, targetLanguage);
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

function getActiveRichTextFields() {
  return activeDomain === 'tcc' ? richTextFieldsTcc : richTextFields;
}

function updateTccAgreementValue() {
  const agreementToggle = document.getElementById('tccAkkoord');
  const agreementValue = document.getElementById('tccAkkoordValue');
  if (!agreementToggle || !agreementValue) return;

  const labels = getLangPack().outputLabels;
  agreementValue.textContent = agreementToggle.checked ? labels.agreementYes : labels.agreementNo;
}

async function switchLanguageAndTranslate() {
  if (isLanguageSwitching) return;

  const previousLang = activeLang;
  const nextLang = getNextLanguage(previousLang);
  const modeBeforeSwitch = activeTmpl;
  const domainBeforeSwitch = activeDomain;
  const statusPack = previousLang === 'nl' ? i18n.nl : i18n.en;
  const languageButton = document.getElementById('languageBtn');
  const switchButton = document.getElementById('switchBtn');
  const domainButton = document.getElementById('domainBtn');

  isLanguageSwitching = true;
  languageButton.disabled = true;
  if (switchButton) {
    switchButton.disabled = true;
  }
  if (domainButton) {
    domainButton.disabled = true;
  }

  showStatusToast(statusPack.translateStatus.busy, 1500);

  try {
    const estimate = estimateTranslateRequestsForCurrentInput();
    if (estimate > translateMaxRequestsPerRun) {
      throw createTranslateError('TRANSLATE_TOO_LARGE', 'Too many translation requests needed for current input.', {
        estimatedRequests: estimate
      });
    }

    applyLanguage(nextLang, true);
  setDomainMode(domainBeforeSwitch, false);
    setTemplateMode(modeBeforeSwitch, false);

    let changed = false;
  for (const id of getActiveRichTextFields()) {
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
    languageButton.disabled = false;
    if (switchButton) {
      switchButton.disabled = false;
    }
    if (domainButton) {
      domainButton.disabled = false;
    }
  }
}

function buildMessageHTML() {
  const getCleanHTML = (id) => {
    const source = document.getElementById(id);
    const cleanField = source.cloneNode(true);

    cleanField.querySelectorAll('.screenshot-remove').forEach((button) => button.remove());
    cleanField.querySelectorAll('.screenshot-item').forEach((item) => {
      const image = item.querySelector('img');
      item.replaceWith(image || '');
    });
    cleanField.querySelectorAll('br[data-screenshot-separator]').forEach((separator) => {
      separator.removeAttribute('data-screenshot-separator');
    });

    return sanitizeDraftHTML(cleanField.innerHTML).trim();
  };

  const labels = getLangPack().outputLabels;

  if (activeDomain === 'tcc') {
    if (activeTmpl === 'vraag') {
      const klantnummer = document.getElementById('tccKlantnummer').value.trim();
      const notitie = getCleanHTML('tccNotitie');
      const screenshots = getCleanHTML('tccScreenshots');

      return `<b>• ${labels.tccKlantnummer}:</b><br>${klantnummer || '…'}<br><br>` +
        `<b>• ${labels.tccNotitie}:</b><br>${notitie || '…'}<br><br>` +
        `<b>• ${labels.tccScreenshots}:</b><br>${screenshots || '…'}`;
    }

    const check = getCleanHTML('tccNogControleren') || '-';
    const aanvullen = getCleanHTML('tccAanvullen') || '-';
    const agreementToggle = document.getElementById('tccAkkoord');
    const akkoord = agreementToggle.checked ? labels.agreementYes : labels.agreementNo;

    return `<b>• ${labels.tccNogControleren}:</b><br>${check}<br><br>` +
      `<b>• ${labels.tccAanvullen}:</b><br>${aanvullen}<br><br>` +
      `<b>• ${labels.tccAkkoord}:</b><br>${akkoord}`;
  }

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
  const required = activeDomain === 'tcc'
    ? (activeTmpl === 'vraag' ? fieldsTccVraag : [])
    : (activeTmpl === 'vraag' ? fieldsVraag : ['antwoord']);

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
    el.setAttribute('aria-invalid', String(empty));
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
  const allFields = [...fieldsVraag, ...fieldsAntwoord, ...fieldsTccVraag, ...fieldsTccAntwoord];

  clearPendingScreenshotRequest();
  clearStoredDraft();

  for (const id of allFields) {
    const el = document.getElementById(id);
    if (el.tagName === 'DIV') {
      el.innerHTML = '';
    } else if (el.type === 'checkbox') {
      el.checked = false;
    } else {
      el.value = '';
    }
    el.classList.remove('error');
  }
  lastCrsSuppliedTccNote = '';
  hasManualTccNoteChange = false;
  lastIgnoredCrsTccNote = null;
  closeCrsNoteConflictDialog(false);
  updateTccAgreementValue();
  updatePreview();
}

function insertPlainTextAsLineBreaks(text) {
  const lines = (text || '').split(/\r\n|\r|\n/);

  lines.forEach((line, index) => {
    if (index > 0) {
      document.execCommand('insertLineBreak');
    }
    if (line) {
      document.execCommand('insertText', false, line);
    }
  });
}

function insertSanitizedHTML(value) {
  const sanitizedHTML = sanitizeDraftHTML(value);
  if (!sanitizedHTML) return false;

  document.execCommand('insertHTML', false, sanitizedHTML);
  bindScreenshotRemoveButtons();
  return true;
}

document.querySelectorAll('div[contenteditable="true"]').forEach((el) => {
  el.addEventListener('paste', function(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    if (clipboardData.files && clipboardData.files.length > 0) return;

    e.preventDefault();
    const pastedHTML = clipboardData.getData('text/html');
    const didInsertHTML = pastedHTML && insertSanitizedHTML(pastedHTML);
    if (!didInsertHTML) insertPlainTextAsLineBreaks(clipboardData.getData('text/plain'));
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Plain Enter creates a new block-level <div> in contenteditable, which
  // stacks extra blank lines when read back as text (each <div> boundary
  // plus its own <br> counts as a line break). Force Enter to behave like
  // Shift+Enter (a single <br>) so line breaks stay consistent everywhere,
  // including translation.
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  });
});

function handleFieldChange() {
  updatePreview();
  scheduleDraftSave();
}

for (const id of [...fieldsVraag, ...fieldsAntwoord, ...fieldsTccVraag, ...fieldsTccAntwoord]) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener('input', handleFieldChange);
  el.addEventListener('change', handleFieldChange);
}

document.getElementById('tccNotitie').addEventListener('input', handleTccNotitieInput);

document.getElementById('tccAkkoord').addEventListener('change', () => {
  updateTccAgreementValue();
  updatePreview();
});

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
      if (manifest && manifest.version) return manifest.version_name || manifest.version;
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

function isValidDraftId(draftId) {
  return typeof draftId === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(draftId);
}

function applyUrlPrefill(urlParams) {
  for (const key of ['wachtrij', 'klantnummer', 'klantvraag', 'vastloper', 'uitkomst']) {
    if (!urlParams.has(key)) continue;

    const element = document.getElementById(key);
    if (!element) continue;

    const value = urlParams.get(key) || '';
    if (element.tagName === 'DIV') {
      element.innerText = value;
    } else {
      element.value = value;
    }
  }

  if (urlParams.has('klantnummer')) {
    document.getElementById('tccKlantnummer').value = urlParams.get('klantnummer') || '';
  }

  if (urlParams.has('klantvraag')) {
    const crsPrefillNote = urlParams.get('klantvraag') || '';
    document.getElementById('tccNotitie').textContent = crsPrefillNote;
    lastCrsSuppliedTccNote = crsPrefillNote;
    hasManualTccNoteChange = false;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const initialDraftId = isValidDraftId(urlParams.get('draftId')) ? urlParams.get('draftId') : '';
const initialCustomerContext = createDraftContext(urlParams.get('klantnummer'));
const initialCrsNote = urlParams.has('klantvraag') ? (urlParams.get('klantvraag') || '') : null;
applyUrlPrefill(urlParams);

renderTemplateVersion();
applyLanguage(activeLang, false);
setDomainMode(activeDomain, false);
setTemplateMode(activeTmpl, false);
document.getElementById('switchBtn').addEventListener('click', toggleTemplate);
document.getElementById('domainBtn').addEventListener('click', toggleDomain);
document.getElementById('btn-copy').addEventListener('click', copyToClipboard);
document.getElementById('btn-clear').addEventListener('click', clearForm);
document.querySelectorAll('.btn-capture-screenshot').forEach((button) => {
  button.addEventListener('click', requestCrsScreenshot);
});

document.getElementById('crsNoteConflictUse').addEventListener('click', () => {
  if (pendingCrsTccNote !== null && isActiveTccRequest()) {
    applyCrsTccNote(pendingCrsTccNote);
  }
  closeCrsNoteConflictDialog(true);
});

document.getElementById('crsNoteConflictKeep').addEventListener('click', () => {
  if (pendingCrsTccNote !== null) {
    lastIgnoredCrsTccNote = pendingCrsTccNote;
  }
  closeCrsNoteConflictDialog(true);
});

document.getElementById('crsNoteConflictDialog').addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    document.getElementById('crsNoteConflictKeep').click();
    return;
  }

  if (e.key !== 'Tab') return;

  e.preventDefault();
  const buttons = [
    document.getElementById('crsNoteConflictUse'),
    document.getElementById('crsNoteConflictKeep')
  ];
  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = e.shiftKey
    ? (currentIndex <= 0 ? buttons.length - 1 : currentIndex - 1)
    : (currentIndex === buttons.length - 1 ? 0 : currentIndex + 1);
  buttons[nextIndex].focus();
});

window.addEventListener('message', (event) => {
  if (event.origin !== crsOrigin || event.source !== window.parent) return;

  const data = event.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return;

  if (data.type === crsScreenshotResultMessageType || data.type === crsScreenshotErrorMessageType) {
    handleCrsScreenshotMessage(data);
    return;
  }

  if (!hasExactMessageKeys(data, ['type', 'note']) ||
    data.type !== crsNoteUpdateMessageType ||
    typeof data.note !== 'string' ||
    data.note.length > crsNoteMaxLength) return;

  handleCrsNoteUpdate(data.note);
});

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
    scheduleDraftSave();
  }
}

for (const id of allRichTextFields) {
  const el = document.getElementById(id);
  if (!el) continue;
  el.addEventListener('blur', applyLocalTextBeautifier);
}

window.addEventListener('pagehide', flushDraftSave);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushDraftSave();
});

window.templateHelperDraftReady = initializeDraftPersistence(
  initialDraftId,
  initialCustomerContext,
  initialCrsNote
);
