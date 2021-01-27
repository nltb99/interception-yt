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
async function init() {
    try {
        console.log('init')
        const id = await getUrlParams("v")
        let channelId = ""
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
        if(channelId === "" && window.location.href.includes("https://www.youtube.com/channel/")) {
            const regChannel = await /(?<=https:\/\/www\.youtube\.com\/channel\/)[\w].+/g
            channelId = await await window.location.href.match(regChannel)[0]
        }
        let isMatchAlias = false
        if(channelId === "" && window.location.href.includes("https://www.youtube.com/c/")) {
            const regAlias = await /(?<=https:\/\/www\.youtube\.com\/c\/)[\w].+/g
            channelId = await window.location.href.match(regAlias)[0]
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

