

function get_lifty() {
  return function(info, tab) {
    var txt = "You selected " + info.selectionText;
    txt += " from tab " + tab.id;
    alert(txt);

    var serviceCall = 'http://www.google.com/search?q=' + info.selectionText;
    chrome.tabs.create({url: serviceCall});
  };
};

chrome.contextMenus.create({
  "title" : "Add to foodbox",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : get_lifter()
});
