chrome.runtime.onInstalled.addListener(function(obj) {
  chrome.runtime.openOptionsPage();
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'youtube.com/watch' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

function handleClick() {
  chrome.runtime.openOptionsPage();
}

chrome.action.onClicked.addListener(handleClick);