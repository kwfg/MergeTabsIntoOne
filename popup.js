document.getElementById('merge-tabs').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "mergeTabs"});
  });
  
  document.getElementById('undo-merge').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "undoMerge"});
  });
  