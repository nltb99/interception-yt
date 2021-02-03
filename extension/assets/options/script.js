const form = document.querySelector(".form")
const input = document.querySelector(".input")
const table = document.querySelector(".table")
form.addEventListener("submit",function(e) {
    e.preventDefault()
    if(!input.value) return
    let channelId = null
    if(isHttpUrl(input.value)) {
        let pathname = new URL(input.value).pathname
        channelId = pathname.match(/(?<=channel\/)[\w].+/g)[0]
    } else {
        channelId = input.value
    }
    chrome.storage.sync.get(['channels'],async function(result) {
        try {
            let channels = result.channels
            let url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&maxResults=1&key=AIzaSyDPpPlIMj5o_W3Q5B7qmn5-ex0kimioSiQ`
            const options = await {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const request = await fetch(url,options)
            const channelSnippet = await request.json()
            if(channelSnippet.items) {
                const channelName = await channelSnippet?.items[0].snippet?.title
                const customUrl = await channelSnippet?.items[0].snippet?.customUrl
                if(channels) {
                    channels = await JSON.parse(channels)
                    if(channels[channelId] === undefined) {
                        channels[channelId] = await {id: channelId,name: channelName,customUrl}
                        await chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {
                            insertItem({idx: Object.getOwnPropertyNames(channels).length - 1,id: channelId,name: channelName,customUrl})
                        });
                    }
                } else {
                    await chrome.storage.sync.set({channels: JSON.stringify({[channelId]: {id: channelId,name: channelName,customUrl}})},function() {
                        insertItem({idx: 0,id: channelId,name: channelName,customUrl})
                    });
                }
            }
            input.value = ""
        } catch(e) {input.value = ""}
    });
})
chrome.storage.sync.get(['channels'],function(result) {
    let channels = result.channels
    if(channels) {
        channels = JSON.parse(channels)
        let idx = 0
        for(const [key,value] of Object.entries(channels)) {
            insertItem({idx: idx,id: value.id,name: value.name,customUrl: value.customUrl})
            idx += 1
        }
    }
})
async function insertItem({idx,id,name,customUrl}) {
    try {
        let tbody = document.createElement('tr')
        let tbodyContents = `
            <td>${idx}</td>
            <td>${name || "-"}</td>
            <td>${customUrl || "-"}</td>
            <td>${id}</td>
            <td><button class="deleteButtons">Del</button></td>
        `
        tbody.innerHTML = tbodyContents
        table.append(tbody)
        deleteButtons = document.querySelectorAll(".deleteButtons")
        deleteButtons[idx].addEventListener("click",async function(e) {
            const id = await deleteButtons[idx].parentElement.parentElement.children[3].innerHTML
            await chrome.storage.sync.get(['channels'],async function(result) {
                let channels = await JSON.parse(result.channels)
                await delete channels[id]
                await chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {
                    deleteButtons[idx].parentElement.parentElement.remove()
                });
            })
        })
    } catch(e) {}
}
function isHttpUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch(e) {
        return false;
    }
}
