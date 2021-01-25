console.log('script')
const form = document.querySelector(".form")
const input = document.querySelector(".input")
form.addEventListener("submit",function(e) {
    e.preventDefault()
    if(!input.value) return
    let channelId = input.value.match(/(?<=www\.youtube\.com\/channel\/)[\w].+/g)
    if(channelId.length === 0) return
    chrome.storage.sync.get(['channels'],function(result) {
        let channels = result.channels
        if(channels) {
            channels = JSON.parse(channels)
            channels.push({channel: channelId[0]})
            chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {});
        } else {
            chrome.storage.sync.set({channels: JSON.stringify([{channel: channelId[0]}])},function() {});
        }
        input.value = ""
    });
})