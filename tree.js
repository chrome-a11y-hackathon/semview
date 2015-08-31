function createTree(automationNode, opt_parentNode, opt_indent) {
  var RoleType = chrome.automation.RoleType;

  if (!opt_parentNode && automationNode.role != RoleType.rootWebArea)
    throw 'no parent node and not rootWebArea';

  var parentNode = opt_parentNode,
      indent = opt_indent || '',
      logString = "",
      node = null;

  for (var property in automationNode) {
    var value = automationNode[property];
    if (typeof value === 'function')
      continue;
    if (value === undefined)
      continue;

    logString += property + ': ';
    logString += JSON.stringify(value);
    logString += ', ';
  }
  logString = logString.slice(0, -2);
  console.log(indent, automationNode.role, logString );

  var atomic = false;

  switch (automationNode.role) {
  case RoleType.rootWebArea:
    node = document.body;
    break;
  case RoleType.div:
    node = parentNode.appendChild(document.createElement("div"));
    break;
  case RoleType.image:
    atomic = true;
    node = parentNode.appendChild(document.createElement("img"));
    node.src = "";
    node.alt = automationNode.name != "" ? automationNode.name : automationNode.url ? automationNode.url.split('/').pop() : '<' + automationNode.htmlTag + '>';
    break;
  case RoleType.link:
    node = parentNode.appendChild(document.createElement("a"));
    node.href = automationNode.url;
    break;
  case RoleType.list:
    node = parentNode.appendChild(document.createElement(automationNode.htmlTag));
    break;
  case RoleType.listItem:
    node = parentNode.appendChild(document.createElement("li"));
    break;
  case RoleType.listMarker:
    atomic = true; // ignore list markers as the ul/ol will insert them
    break;
  case RoleType.staticText:
    atomic = true;
    node = parentNode.appendChild(document.createTextNode(automationNode.value));
    break;
  case RoleType.alertDialog:
  case RoleType.alert:
  case RoleType.annotation:
  case RoleType.application:
  case RoleType.article:
  case RoleType.banner:
  case RoleType.blockquote:
  case RoleType.busyIndicator:
  case RoleType.button:
  case RoleType.buttonDropDown:
  case RoleType.canvas:
  case RoleType.caption:
  case RoleType.cell:
  case RoleType.checkBox:
  case RoleType.client:
  case RoleType.colorWell:
  case RoleType.columnHeader:
  case RoleType.column:
  case RoleType.comboBox:
  case RoleType.complementary:
  case RoleType.contentInfo:
  case RoleType.date:
  case RoleType.dateTime:
  case RoleType.definition:
  case RoleType.descriptionListDetail:
  case RoleType.descriptionList:
  case RoleType.descriptionListTerm:
  case RoleType.desktop:
  case RoleType.details:
  case RoleType.dialog:
  case RoleType.directory:
  case RoleType.disclosureTriangle:
  case RoleType.document:
  case RoleType.embeddedObject:
  case RoleType.figcaption:
  case RoleType.figure:
  case RoleType.footer:
  case RoleType.form:
  case RoleType.grid:
  case RoleType.group:
  case RoleType.heading:
  case RoleType.iframe:
  case RoleType.iframePresentational:
  case RoleType.ignored:
  case RoleType.imageMapLink:
  case RoleType.imageMap:
  case RoleType.inlineTextBox:
  case RoleType.inputTime:
  case RoleType.labelText:
  case RoleType.legend:
  case RoleType.lineBreak:
  case RoleType.listBoxOption:
  case RoleType.listBox:
  case RoleType.locationBar:
  case RoleType.log:
  case RoleType.main:
  case RoleType.mark:
  case RoleType.marquee:
  case RoleType.math:
  case RoleType.menuBar:
  case RoleType.menuButton:
  case RoleType.menuItem:
  case RoleType.menuItemCheckBox:
  case RoleType.menuItemRadio:
  case RoleType.menuListOption:
  case RoleType.menuListPopup:
  case RoleType.menu:
  case RoleType.meter:
  case RoleType.navigation:
  case RoleType.note:
  case RoleType.outline:
  case RoleType.pane:
  case RoleType.paragraph:
  case RoleType.popUpButton:
  case RoleType.pre:
  case RoleType.presentational:
  case RoleType.progressIndicator:
  case RoleType.radioButton:
  case RoleType.radioGroup:
  case RoleType.region:
  case RoleType.rowHeader:
  case RoleType.row:
  case RoleType.ruby:
  case RoleType.ruler:
  case RoleType.svgRoot:
  case RoleType.scrollArea:
  case RoleType.scrollBar:
  case RoleType.seamlessWebArea:
  case RoleType.search:
  case RoleType.searchBox:
  case RoleType.slider:
  case RoleType.sliderThumb:
  case RoleType.spinButtonPart:
  case RoleType.spinButton:
  case RoleType.splitter:
  case RoleType.status:
  case RoleType.switch:
  case RoleType.tabGroup:
  case RoleType.tabList:
  case RoleType.tabPanel:
  case RoleType.tab:
  case RoleType.tableHeaderContainer:
  case RoleType.table:
  case RoleType.textField:
  case RoleType.time:
  case RoleType.timer:
  case RoleType.titleBar:
  case RoleType.toggleButton:
  case RoleType.toolbar:
  case RoleType.treeGrid:
  case RoleType.treeItem:
  case RoleType.tree:
  case RoleType.unknown:
  case RoleType.tooltip:
  case RoleType.webArea:
  case RoleType.webView:
  case RoleType.window:
    node = parentNode.appendChild(document.createElement("div"));
    node.setAttribute('role', automationNode.role);
    break;
  }

  if (atomic)
    return;

  for (var child of automationNode.children) {
    createTree(child, node, indent + "  ");
    node.appendChild(document.createTextNode("\n"));
  }
}
