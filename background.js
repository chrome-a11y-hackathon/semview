chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.automation.getTree(function(rootNode) {
    if (!rootNode) {
      return;
    }

    chrome.tabs.onUpdated.addListener(function(tabId, processInfo, tabInfo) {
      if (processInfo.status === 'complete') {
        var win = chrome.extension.getViews({
          type: 'tab',
          windowId: tabInfo.windowId
        })[0];
        if (win && win.createTree) {
          win.createTree(rootNode);
        }
      }
    });

    chrome.windows.create({ url: chrome.extension.getURL("tree.html" )});
  });
});
