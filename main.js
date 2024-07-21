chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "mergeTabs") {
    chrome.windows.getAll({populate: true}, function(windows) {
      var tabIds = [];
      var incognitoTabIds = [];

      // Collect all tab IDs and differentiate between regular and incognito tabs
      for (var i = 0; i < windows.length; i++) {
        var tabs = windows[i].tabs;
        for (var j = 0; j < tabs.length; j++) {
          if (tabs[j].incognito) {
            incognitoTabIds.push(tabs[j].id);
          } else {
            tabIds.push(tabs[j].id);
          }
        }
      }

      // Merge regular tabs
      if (tabIds.length > 0) {
        chrome.windows.create({tabId: tabIds[0]}, function(newWindow) {
          if (chrome.runtime.lastError) {
            console.error('Error creating new window:', chrome.runtime.lastError.message);
          } else {
            for (var k = 1; k < tabIds.length; k++) {
              chrome.tabs.move(tabIds[k], {windowId: newWindow.id, index: -1}, function() {
                if (chrome.runtime.lastError) {
                  console.error('Error moving tab:', chrome.runtime.lastError.message);
                }
              });
            }
          }
        });
      }

      // Merge incognito tabs
      if (incognitoTabIds.length > 0) {
        chrome.windows.create({tabId: incognitoTabIds[0], incognito: true}, function(newWindow) {
          if (chrome.runtime.lastError) {
            console.error('Error creating new incognito window:', chrome.runtime.lastError.message);
          } else {
            for (var k = 1; k < incognitoTabIds.length; k++) {
              chrome.tabs.move(incognitoTabIds[k], {windowId: newWindow.id, index: -1}, function() {
                if (chrome.runtime.lastError) {
                  console.error('Error moving incognito tab:', chrome.runtime.lastError.message);
                }
              });
            }
          }
        });
      }
    });
  }
});
