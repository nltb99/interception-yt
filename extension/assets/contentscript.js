chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if(request.message === 'urlchanged') {
            init()
        }
    }
);
function countTime(totalWatched = null) {
    totalWatched = +totalWatched
    chrome.storage.sync.set({totalWatched: JSON.stringify(Date.parse(new Date(totalWatched)))},function() {});
    clearTimeout(countTime.interval);
    countTime.interval = setTimeout(function() {
        countTime(totalWatched + 1000)
    },1000);
}
function isToday(dateCompe) {
    if(typeof dateCompe.getDay !== 'function') dateCompe = new Date(+dateCompe)
    let today = new Date();
    return dateCompe.getDate() === today.getDate() && dateCompe.getMonth() === today.getMonth() + 1 && dateCompe.getFullYear() === today.getFullYear();
}
function getUrlParams(hashKey = null) {
    try {
        const searchString = window.location.search
        const params = new URLSearchParams(searchString),dict = {}
        for(const [key,value] of params.entries()) dict[key] = value
        if(hashKey) return dict[hashKey]
        else return dict
    } catch(e) {}
}
function includes(url) {
    return window.location.href.includes(url)
}
function matchReg(reg) {
    let pathname = new URL(window.location.href).pathname
    return pathname.match(reg)[0]
}
async function init() {
    try {
        console.log('init: !')
        chrome.storage.sync.get(['totalWatched'],function(result) {
            let {totalWatched} = result
            if(totalWatched !== undefined) {
                totalWatched = +JSON.parse(totalWatched)
                if(isToday(new Date(totalWatched))) {
                    countTime(new Date(totalWatched).getTime());
                } else {
                    countTime(new Date(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDay(),0,0,0).getTime());
                }
            } else {
                countTime(new Date(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDay(),0,0,0).getTime());
            }
        })
        const id = await getUrlParams("v")
        let channelId = null
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
            channelId = data?.items[0].snippet?.channelId
        }
        if(!channelId && includes("https://www.youtube.com/channel/")) {
            channelId = await matchReg(/(?<=channel\/)[\w].+/g)
        }
        let isMatchAlias = false
        if(!channelId && includes("https://www.youtube.com/c/")) {
            channelId = await matchReg(/(?<=c\/)[\w].+/g)
            isMatchAlias = await true
        }
        if(!channelId && includes("https://www.youtube.com/user/")) {
            channelId = await matchReg(/(?<=user\/)[\w].+/g)
            isMatchAlias = await true
        }
        await chrome.storage.sync.get(['channels'],function(result) {
            if(result.channels) {
                let channels = JSON.parse(result.channels)
                if(isMatchAlias) {
                    for(const [key,value] of Object.entries(channels)) {
                        if(value.customUrl === channelId) {
                            window.location = "https://www.youtube.com";
                            break;
                        }
                    }
                } else {
                    if(channels[channelId] !== undefined) {
                        window.location = "https://www.youtube.com"
                    }
                }
            } else {}
        });
    } catch(e) {}
}
init()

