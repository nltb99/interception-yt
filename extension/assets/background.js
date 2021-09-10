chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: 'urlchanged',
      url: changeInfo.url
    })
  }
});
chrome.runtime.setUninstallURL("https://www.facebook.com/nltbao")
chrome.runtime.onInstalled.addListener((re) => { })
