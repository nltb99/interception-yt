chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab) {
  if(changeInfo.url) {
    chrome.tabs.sendMessage(tabId,{
      message: 'urlchanged',
      url: changeInfo.url
    })
  }
});
chrome.runtime.onInstalled.addListener(() => {

})
// chrome.storage.sync.clear(function() {})

