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
    } catch(e) {}
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
        channelId = await channelId !== "" ? channelId : window.location.href.match(/(?<=https:\/\/www\.youtube\.com\/channel\/)[\w].+/g)[0]
        await chrome.storage.sync.get(['channels'],function(result) {
            if(result.channels) {
                let channels = JSON.parse(result.channels)
                console.log(channels[channelId],channelId)
                if(channels[channelId] !== undefined) {
                    window.location = "https://www.youtube.com"
                }
            } else {}
        });
        return
    } catch(e) {}
}
init()

