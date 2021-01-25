function menu_generator() {
  chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    title: 'Stored search',
    contexts: ['page','selection'],
    onclick: function() {
      chrome.tabs.query({active: true,currentWindow: true},function(tabs) {
        chrome.tabs.create({
          index: tabs[0].index,
          url: chrome.extension.getURL('index.html'),
          active: true
        });
      });
    }
  });
}
// function replaceText(element) {
//   if(element.hasChildNodes()) {
//     element.childNodes.forEach(replaceText)
//   } else if(element.nodeType === Text.TEXT_NODE) {
//     if(element.textContent.match(/.*/gim)) {
//       const newElement = document.createElement('span')
//       newElement.innerHTML = element.textContent.replace(/.*/gim,'<span class="rainbow">$$$$$</span>')
//       element.replaceWith(newElement)
//     }
//   }
// }
// replaceText(document.body)
function getUrlParams(hashKey = null) {
  try {
    const searchString = window.location.search
    const params = new URLSearchParams(searchString),dict = {}
    for(const [key,value] of params.entries()) dict[key] = value
    if(hashKey) return dict[hashKey]
    else return dict
  } catch(e) {
    console.log(e)
  }
}
async function init() {
  try {
    console.log("INITTTTT")
    const id = await getUrlParams("v")
    await console.log('ddddddddddd',id)
    if(id) {
      let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyDPpPlIMj5o_W3Q5B7qmn5-ex0kimioSiQ`
      const options = await {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const request = await fetch(url,options)
      const data = await request.json()
      await console.log(data.items[0].snippet.channelId)
      // window.location = "https://www.youtube.com"
      // return data.items[0].snippet.channelId
    }
  } catch(e) {
    console.log(e)
  }
}
console.log(Math.random())
init()

