(function(){
    // 1. Haal de gegevens uit het actieve tabblad
    var klnrEl = document.querySelector('.ut_DFI_EL_PARTY_ID');
    var klantnummer = klnrEl ? encodeURIComponent(klnrEl.innerText.trim()) : '';

    var notitieEl = document.getElementById('IWMEMO_SCRIPT_EIGENINPUT');
    var klantvraag = notitieEl ? encodeURIComponent(notitieEl.value.trim()) : '';

    // 2. Haal de interne URL op van de ingebouwde template
    var url = chrome.runtime.getURL("template.html");

    // 3. Open de template in een nieuwe tab mét de data
    window.open(url + '?klantnummer=' + klantnummer + '&klantvraag=' + klantvraag, '_blank');
})();