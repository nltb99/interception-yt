console.log('script')
const form = document.querySelector(".form")
const input = document.querySelector(".input")
form.addEventListener("submit",function(e) {
    e.preventDefault()
    if(!input.value) return
    let channelId = input.value.match(/(?<=www\.youtube\.com\/channel\/)[\w].+/g)
    if((channelId && channelId.length === 0) || !channelId) return
    chrome.storage.sync.get(['channels'],function(result) {
        let channels = result.channels
        if(channels) {
            channels = JSON.parse(channels)
            channels.push({channel: channelId[0]})
            pushItem({idx: channels.length,channel: channelId[0]})
            chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {});
        } else {
            pushItem({idx: idx,channel: channelId[0]})
            chrome.storage.sync.set({channels: JSON.stringify([{channel: channelId[0]}])},function() {});
        }
        input.value = ""
    });
})

const table = document.querySelector(".table")

chrome.storage.sync.get(['channels'],function(result) {
    let channels = result.channels
    if(channels) {
        channels = JSON.parse(channels)
        channels.map((e,idx) => {
            pushItem({idx: idx,channel: e.channel})
        })
    }
})
function pushItem({idx,channel}) {
    let tbody = document.createElement('tr')
    let tbodyContents = `
        <td>${idx}</td>
        <td>${channel}</td>
        <td><button>Del</button></td>
    `
    tbody.innerHTML = tbodyContents
    table.append(tbody)
}

