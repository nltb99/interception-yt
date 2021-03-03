let tbodyChannel = document.querySelector(".tbodyChannel"),
    clearInputChannel = document.querySelector(".clear_input_channel"),
    deleteChannel = document.querySelectorAll(".deleteChannel"),
    formChannel = document.querySelector(".form_channel"),
    inputChannel = document.querySelector(".input_channel"),

    tbodyKeyword = document.querySelector(".tbodyKeyword"),
    formKeyword = document.querySelector(".form_keyword"),
    inputKeyword = document.querySelector(".input_keyword"),
    deleteKeyword = document.querySelectorAll(".deleteKeyword"),
    clearInputKeyword = document.querySelector(".clear_input_keyword"),

    tabs = document.querySelectorAll(".tab"),
    numOfTabs = 4,
    bgpage = chrome.extension.getBackgroundPage();

function handleTabs() {
    chrome.storage.local.get(['tabIndex'],function(result) {
        let tabIndex = result.tabIndex
        if(tabIndex) {
            tabIndex = +tabIndex
            tabs[tabIndex].checked = true
        } else {
            chrome.storage.local.set({tabIndex: "0"},function() {
                tabs[0].checked = true
            });
        }
    })
    for(let i = 0;i < numOfTabs;i++) {
        tabs[i].addEventListener('click',() => {
            chrome.storage.local.set({tabIndex: i.toString()},function() {});
        })
    }
}
function handleClearInput() {
    clearInputChannel.addEventListener("click",() => {
        inputChannel.value = ""
    })
    clearInputKeyword.addEventListener("click",() => {
        inputKeyword.value = ""
    })
}
function handleSubmitChannel() {
    formChannel.addEventListener("submit",async function(e) {
        e.preventDefault()
        if(!inputChannel.value) {
            handleShakeOnError(formChannel)
            return
        }
        let channelInput = decodeURIComponent(unescape(inputChannel.value.toString().trim()))
        let channelId = null
        let id = getUrlParams(channelInput,"v")
        if(id && isHttpUrl(channelInput)) {
            let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyDPpPlIMj5o_W3Q5B7qmn5-ex0kimioSiQ`
            const options = await {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const request = await fetch(url,options)
            const data = await request.json()
            channelId = await data?.items[0].snippet?.channelId
        } else if(isHttpUrl(channelInput)) {
            let pathname = new URL(channelInput).pathname
            if(pathname.match(/(?<=channel\/)[\w].+/g)) {
                channelId = pathname.match(/(?<=channel\/)[\w].+/g)[0]
            }
        }
        channelId = channelId ? channelId : channelInput
        channelId = channelId.trim()
        chrome.storage.local.get(['channels'],async function(result) {
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
                            await chrome.storage.local.set({channels: JSON.stringify(channels)},function() {
                                handleInsertChannel({idx: Object.keys(channels).length - 1,id: channelId,name: channelName,customUrl})
                            });
                        } else {
                            handleShakeOnError(formChannel)
                        }
                    } else {
                        await chrome.storage.local.set({channels: JSON.stringify({[channelId]: {id: channelId,name: channelName,customUrl}})},function() {
                            handleInsertChannel({idx: 0,id: channelId,name: channelName,customUrl})
                        });
                    }
                } else {
                    handleShakeOnError(formChannel)
                }
                inputChannel.value = ""
            } catch(e) {
                inputChannel.value = ""
                handleShakeOnError(formChannel)
            }
        });
    })
}
async function handleInsertChannel({idx,id,name,customUrl}) {
    let tr = document.createElement('tr')
    let tbodyContents = `
            <td style="text-align:center">${idx + 1}</td>
            <td style="text-align:center">${name || "-"}</td>
            <td style="text-align:center">${customUrl || "-"}</td>
            <td style="text-align:center">${id}</td>
            <td style="text-align:center"><button class="deleteChannel"><i class="bi-trash" style="font-size: 20px;"/></button></td>
        `
    tr.innerHTML = tbodyContents
    tbodyChannel.append(tr)
    deleteChannel = document.querySelectorAll(".deleteChannel")
    deleteChannel[idx].addEventListener("click",async function(e) {
        let id = await deleteChannel[idx].parentElement.parentElement.children[3].innerHTML
        await chrome.storage.local.get(['channels'],async function(result) {
            let channels = await JSON.parse(result.channels)
            await delete channels[id]
            await chrome.storage.local.set({channels: JSON.stringify(channels)},function() {
                deleteChannel[idx].parentElement.parentElement.remove()
            });
        })
    })
}
function handleSubmitKeyword() {
    try {
        formKeyword.addEventListener('submit',(e) => {
            e.preventDefault()
            if(!inputKeyword.value) {
                handleShakeOnError(formKeyword)
                return
            }
            const keyword = decodeURIComponent(unescape(inputKeyword.value.toString().trim())).toLowerCase()
            chrome.storage.local.get(['keywords'],function(result) {
                try {
                    let keywords = result.keywords
                    if(keywords) {
                        keywords = JSON.parse(keywords)
                        if(keywords[keyword] === undefined) {
                            keywords[keyword] = null
                            chrome.storage.local.set({keywords: JSON.stringify(keywords)},function() {
                                handleInsertKeyword({idx: Object.keys(keywords).length - 1,keyword})
                            });
                        } else {
                            handleShakeOnError(formKeyword)
                        }
                    } else {
                        chrome.storage.local.set({keywords: JSON.stringify({[keyword]: null})},function() {
                            handleInsertKeyword({idx: 0,keyword})
                        });
                    }
                    inputKeyword.value = ""
                } catch(e) {
                    inputKeyword.value = ""
                    handleShakeOnError(formKeyword)
                }
            });
        })
    } catch(e) {}
}
function handleInsertKeyword({idx,keyword}) {
    let tr = document.createElement('tr')
    let tbodyContents = `
            <td style="text-align:center">${idx + 1}</td>
            <td style="text-align:center">${keyword}</td>
            <td style="text-align:center"><button class="deleteKeyword"><i class="bi-trash" style="font-size: 20px;"/></button></td>
        `
    tr.innerHTML = tbodyContents
    tbodyKeyword.append(tr)
    deleteKeyword = document.querySelectorAll(".deleteKeyword")
    deleteKeyword[idx].addEventListener("click",async function(e) {
        let id = await deleteKeyword[idx].parentElement.parentElement.children[1].innerHTML
        await chrome.storage.local.get(['keywords'],async function(result) {
            let keywords = await JSON.parse(result.keywords)
            await delete keywords[id]
            await chrome.storage.local.set({keywords: JSON.stringify(keywords)},function() {
                deleteKeyword[idx].parentElement.parentElement.remove()
            });
        })
    })
}
function isHttpUrl(string) {
    try {
        let url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch(e) {}
}
function handleFillTableChannel() {
    chrome.storage.local.get(['channels'],function(result) {
        let channels = result.channels
        if(channels) {
            channels = JSON.parse(channels)
            let idx = 0
            for(const [key,value] of Object.entries(channels)) {
                handleInsertChannel({idx: idx,id: value.id,name: value.name,customUrl: value.customUrl})
                idx += 1
            }
        }
    })
}
function handleFillTableKeyword() {
    chrome.storage.local.get(['keywords'],function(result) {
        let keywords = result.keywords
        if(keywords) {
            keywords = JSON.parse(keywords)
            let idx = 0
            for(const value of Object.keys(keywords)) {
                if(typeof value === "string") {
                    handleInsertKeyword({idx: idx,keyword: value})
                    idx += 1
                }
            }
        }
    })
}
function handleShakeOnError(element) {
    element.classList.add('shake')
    setTimeout(() => {
        element.classList.remove('shake')
    },500)
}
function renderParticles() {
    Particles.init({
        selector: '.background',
        connectParticles: false,
        maxParticles: 700,
        sizeVariations: 3,
    });
}
function getUrlParams(searchString,hashKey = null) {
    try {
        searchString = new URL(searchString).search
        const params = new URLSearchParams(searchString),dict = {}
        for(const [key,value] of params.entries()) dict[key] = value
        if(hashKey) return dict[hashKey]
        else return dict
    } catch(e) {}
}
function init() {
    try {
        renderParticles()
        handleFillTableChannel()
        handleFillTableKeyword()
        handleSubmitChannel()
        handleClearInput()
        handleSubmitKeyword()
        handleTabs()
    } catch(e) {console.log(e)}
}
window.onload = function() {
    init()
};