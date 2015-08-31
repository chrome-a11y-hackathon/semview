chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.automation.getTree(function(rootNode) {
    if (!rootNode)
      return;

    chrome.windows.create({ url: "tree.html" }, function(newWindow) {
      var treeWindow = chrome.extension.getViews({ type: "tab", windowId: newWindow.id })[0];
      treeWindow.createTree(rootNode);
    });
  });
});
