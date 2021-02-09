let tbody = document.querySelector(".tbody"),
    clearInput = document.querySelector(".clear_input_insert"),
    deleteButton = document.querySelectorAll(".deleteButton"),
    form = document.querySelector(".form_insert"),
    input = document.querySelector(".input_insert"),
    displayToast = document.querySelector(".display_toast")

function handleClearInput() {
    clearInput.addEventListener("click",() => {
        input.value = ""
        clearInput.style.cssText = "visibility:collapse;"
    })
}
function handleChangeInput() {
    input.addEventListener("input",(e) => {
        if(e.target.value) {
            clearInput.style.cssText = "visibility:visible;"
        }
    })
}
function handleSubmit() {
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
        channelId = channelId.trim()
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
                                handleInsert({idx: Object.getOwnPropertyNames(channels).length - 1,id: channelId,name: channelName,customUrl})
                            });
                        }
                    } else {
                        await chrome.storage.sync.set({channels: JSON.stringify({[channelId]: {id: channelId,name: channelName,customUrl}})},function() {
                            handleInsert({idx: 0,id: channelId,name: channelName,customUrl})
                        });
                    }
                } else {
                    displayToast.style.cssText = "visibility: visible;"
                    setTimeout(() => {
                        displayToast.style.cssText = "visibility: collapse;"
                    },1500)
                }
                input.value = ""
            } catch(e) {input.value = ""}
        });
    })
}
async function handleInsert({idx,id,name,customUrl}) {
    try {
        let tr = document.createElement('tr')
        let tbodyContents = `
            <td style="text-align:center">${idx}</td>
            <td style="text-align:center">${name || "-"}</td>
            <td style="text-align:center">${customUrl || "-"}</td>
            <td style="text-align:center">${id}</td>
            <td><button class="deleteButton"><i class="bi-trash" style="font-size: 20px;"/></button></td>
        `
        tr.innerHTML = tbodyContents
        tbody.append(tr)
        deleteButton = document.querySelectorAll(".deleteButton")
        deleteButton[idx].addEventListener("click",async function(e) {
            let id = await deleteButton[idx].parentElement.parentElement.children[3].innerHTML
            await chrome.storage.sync.get(['channels'],async function(result) {
                let channels = await JSON.parse(result.channels)
                await delete channels[id]
                await chrome.storage.sync.set({channels: JSON.stringify(channels)},function() {
                    deleteButton[idx].parentElement.parentElement.remove()
                });
            })
        })
    } catch(e) {console.log(e)}
}
function isHttpUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch(e) {
        return false;
    }
}
function handleFillTable() {
    chrome.storage.sync.get(['channels'],function(result) {
        let channels = result.channels
        if(channels) {
            channels = JSON.parse(channels)
            let idx = 0
            for(const [key,value] of Object.entries(channels)) {
                // for(let i = 0;i < 10;i++) {
                handleInsert({idx: idx,id: value.id,name: value.name,customUrl: value.customUrl})
                // }
                idx += 1
            }
        }
    })
}
function renderParticles() {
    Particles.init({
        selector: '.background',
        connectParticles: false,
        maxParticles: 700,
        sizeVariations: 3,
    });
}
function init() {
    try {
        renderParticles()
        handleFillTable()
        handleSubmit()
        handleClearInput()
        handleChangeInput()
    } catch(e) {console.log(e)}
}
window.onload = function() {
    init()
    fetch('https://youtuberblockerapi.herokuapp.com/').then(ok => ok.json()).then(ok => console.log(ok))
};