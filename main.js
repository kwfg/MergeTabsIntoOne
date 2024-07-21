// Variable to store the original window state before merging
let originalWindowState = [];

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "mergeTabs") {
    // Get all open windows with their tabs
    chrome.windows.getAll({populate: true}, function(windows) {
      // Save the original window state
      originalWindowState = windows.map(window => ({
        windowId: window.id,
        tabIds: window.tabs.map(tab => tab.id)
      }));
      
      var tabIds = [];
      // Collect all tab IDs
      for (var i = 0; i < windows.length; i++) {
        var tabs = windows[i].tabs;
        for (var j = 0; j < tabs.length; j++) {
          tabIds.push(tabs[j].id);
        }
      }
      
      // Create a new window with the first tab and move all other tabs into it
      chrome.windows.create({tabId: tabIds[0]}, function(newWindow) {
        for (var k = 1; k < tabIds.length; k++) {
          chrome.tabs.move(tabIds[k], {windowId: newWindow.id, index: -1});
        }
        // Save the original window state to local storage for undo functionality
        chrome.storage.local.set({originalWindowState: originalWindowState});
      });
    });
  } else if (request.action === "undoMerge") {
    // Retrieve the original window state from local storage
    chrome.storage.local.get("originalWindowState", function(data) {
      const originalState = data.originalWindowState;
      if (originalState) {
        // Recreate the original windows and move tabs back to their original positions
        for (let window of originalState) {
          chrome.windows.create({}, function(newWindow) {
            for (let tabId of window.tabIds) {
              chrome.tabs.move(tabId, {windowId: newWindow.id, index: -1});
            }
          });
        }
      }
    });
  }
});
