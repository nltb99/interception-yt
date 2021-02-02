chrome.runtime.onMessage.addListener(
    function(request,sender,sendResponse) {
        if(request.message === 'urlchanged') {
            init()
        }
    }
);
function getUrlParams(hashKey = null) {
    try {
        const searchString = window.location.search
        const params = new URLSearchParams(searchString),dict = {}
        for(const [key,value] of params.entries()) dict[key] = value
        if(hashKey) return dict[hashKey]
        else return dict
    } catch(e) {console.log(e)}
}
function includes(url) {
    return window.location.href.includes(url)
}
function matchReg(reg) {
    return window.location.href.match(reg)[0]
}
async function init() {
    try {
        console.log('init')
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
            channelId = await matchReg(/((?<=https:\/\/www\.youtube\.com\/channel\/)[\w].+)(?=\?)/g)
        }
        let isMatchAlias = false
        if(!channelId && includes("https://www.youtube.com/c/")) {
            channelId = await matchReg(/((?<=https:\/\/www\.youtube\.com\/c\/)[\w].+)(?=\?)/g)
            isMatchAlias = await true
        }
        if(!channelId && includes("https://www.youtube.com/user/")) {
            channelId = await matchReg(/((?<=https:\/\/www\.youtube\.com\/user\/)[\w].+)(?=\?)/g)
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
    } catch(e) {console.log(e)}
}
init()

