chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "mergeTabs") {
    chrome.windows.getAll({populate: true}, function(windows) {
      var tabIds = [];
      for (var i = 0; i < windows.length; i++) {
        var tabs = windows[i].tabs;
        for (var j = 0; j < tabs.length; j++) {
          tabIds.push(tabs[j].id);
        }
      }
      chrome.windows.create({tabId: tabIds[0]}, function(newWindow) {
        for (var k = 1; k < tabIds.length; k++) {
          chrome.tabs.move(tabIds[k], {windowId: newWindow.id, index: -1});
        }
      });
    });
  }
});
