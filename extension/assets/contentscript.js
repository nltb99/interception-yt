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
    } catch(e) {
        console.log(e)
    }
}
async function init() {
    try {
        console.log('init')
        chrome.storage.sync.get(['channels'],function(result) {
            if(result.channels) {
                console.log(JSON.parse(result.channels))
            } else {
                console.log("Nothing")
            }
        });
        const id = await getUrlParams("v")
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
            await console.log(data.items[0].snippet.channelId)
            // window.location = "https://www.youtube.com"
        }
    } catch(e) {
        console.log(e)
    }
}
init()

