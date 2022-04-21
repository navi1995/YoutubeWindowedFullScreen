// chrome
chrome.runtime.onInstalled.addListener(function(obj) {
  chrome.runtime.openOptionsPage();
});

function handleClick() {
  chrome.runtime.openOptionsPage();
}

try {
  chrome.action.onClicked.addListener(handleClick);
} catch (e) {
  chrome.browserAction.onClicked.addListener(handleClick);
}