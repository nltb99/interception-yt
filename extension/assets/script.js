console.log('script')
const form = document.querySelector(".form")
const input = document.querySelector(".input")
const table = document.querySelector(".table")
form.addEventListener("submit",function(e) {
    e.preventDefault()
    if(!input.value) return
    let channelId = input.value.match(/(?<=www\.youtube\.com\/channel\/)[\w].+/g)
    if((channelId && channelId.length === 0) || !channelId) {
        input.value = ""
        return
    }
    chrome.storage.sync.get(['channels'],async function(result) {
        try {
            let channels = result.channels
            let url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId[0]}&maxResults=1&key=AIzaSyDPpPlIMj5o_W3Q5B7qmn5-ex0kimioSiQ`
            const options = await {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const request = await fetch(url,options)
            const channelSnippet = await request.json()
            if(channelSnippet.items) {
                if(channels) {
                    channels = JSON.parse(channels)
                    channels.push({channel: channelSnippet?.items[0].snippet?.title,id: channelId[0]})
                    insertItem({idx: channels.length,channel: channelSnippet?.items[0].snippet?.title,id: channelId[0]})
                    chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {});
                } else {
                    insertItem({idx: 1,channel: channelSnippet?.items[0].snippet?.title,id: channelId[0]})
                    chrome.storage.sync.set({channels: JSON.stringify([{channel: channelSnippet?.items[0].snippet?.title,id: channelId[0]}])},function() {});
                }
            }
            input.value = ""
        } catch(e) {
            input.value = ""
        }
    });
})

chrome.storage.sync.get(['channels'],function(result) {
    let channels = result.channels
    if(channels) {
        channels = JSON.parse(channels)
        channels.map((e,idx) => {
            insertItem({idx: idx,id: e.id,channel: e.channel})
        })
    }
})
function insertItem({idx,id,channel}) {
    let tbody = document.createElement('tr')
    let tbodyContents = `
        <td>${idx}</td>
        <td>${id}</td>
        <td>${channel}</td>
        <td><button class="deleteButtons">Del</button></td>
    `
    tbody.innerHTML = tbodyContents
    table.append(tbody)
    deleteButtons = document.querySelectorAll(".deleteButtons")
    deleteButtons[idx].addEventListener("click",function(e) {
        window.e = e
    })
    window.haha = deleteButtons[idx]
}
let deleteButtons = document.querySelectorAll(".deleteButtons")

function deleteItem(event) {
    event.parentElement.parentElement.parentElement.remove()
}
