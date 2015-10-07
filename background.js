chrome.browserAction.onClicked.addListener(function(tab) {
  const COMPLETE = 'complete';

  chrome.automation.getTree(function(rootNode) {
    if (!rootNode) {
      return;
    }

    let processTree = function (tabInfo) {
      let win = chrome.extension.getViews({
        type: 'tab',
        windowId: tabInfo.windowId
      })[0];
      if (win && win.createTree) {
        win.createTree(rootNode);
      }
    }

    let onUpdatedHandler = function(tabId, processInfo, tabInfo) {
      if (processInfo.status === COMPLETE) {
        processTree(tabInfo);
        chrome.tabs.onUpdated.removeListener(onUpdatedHandler);
      }
    };

    chrome.windows.create({
      url: chrome.extension.getURL("tree.html" )
    }, function(winInfo) {
      let tabInfo = winInfo.tabs[0];
      if (tabInfo && tabInfo.status === COMPLETE) {
        processTree(tabInfo);
      } else {
        chrome.tabs.onUpdated.addListener(onUpdatedHandler);
      }
    });
  });
});
