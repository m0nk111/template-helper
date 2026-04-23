(function(){
    // 1. Extract data from the active tab (e.g., customer number and their question)
    var klnrEl = document.querySelector('.ut_DFI_EL_PARTY_ID');
    var klantnummer = klnrEl ? encodeURIComponent(klnrEl.innerText.trim()) : '';

    var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
    var klantvraag = notitieEl ? encodeURIComponent(notitieEl.value.trim()) : '';

    // 2. Get the internal URL of our embedded template page
    var url = chrome.runtime.getURL("template.html");

    // 3. Open the template in a new browser tab and pass the extracted data along within the URL
    window.open(url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag, '_blank');
})();