document.getElementById('merge-tabs').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "mergeTabs"});
  });
  