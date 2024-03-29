chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'urlchanged') {
        init()
    }
});

function removeVietnameseTones(str) {
    if (!str) return ""
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}

function isToday(dateCompe) {
    if (typeof dateCompe.getDay !== 'function') dateCompe = new Date(+dateCompe)
    let today = new Date();
    return dateCompe.getDate() === today.getDate() && dateCompe.getMonth() === today.getMonth() + 1 && dateCompe.getFullYear() === today.getFullYear();
}

function getUrlParams(hashKey = null) {
    try {
        const searchString = window.location.search
        const params = new URLSearchParams(searchString), dict = {}
        for (const [key, value] of params.entries()) dict[key] = value
        if (hashKey) return dict[hashKey]
        else return dict
    } catch (e) { }
}

function includes(reg) {
    return reg.test(window.location.href)
}

function matchReg(reg) {
    let pathname = new URL(window.location.href).pathname
    return decodeURIComponent(pathname.match(reg)[0])
}

async function handleCheckUrlOnLoad() {
    const id = getUrlParams("v")
    const searchQuery = getUrlParams("search_query")
    let channelId = null, isMatchAlias = false
    if (searchQuery) {
        chrome.storage.local.get(['keywords'], function (result) {
            if (result.keywords) {
                let keywords = JSON.parse(result.keywords)
                if (keywords[searchQuery.toLowerCase()] !== undefined) {
                    window.location = "https://www.youtube.com"
                }
            }
        })
    } else if (id) {
        let url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyDPpPlIMj5o_W3Q5B7qmn5-ex0kimioSiQ`
        const options = await {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const request = await fetch(url, options)
        const data = await request.json()
        channelId = await data?.items[0].snippet?.channelId
    } else if (includes(/^https:\/\/www\.youtube\.com\/channel\//g)) {
        channelId = matchReg(/(?<=channel\/)[\w].+/g)
    } else if (includes(/^https:\/\/www\.youtube\.com\/c\//g)) {
        channelId = matchReg(/(?<=c\/)[\w].+/g)
        isMatchAlias = true
    } else if (includes(/^https:\/\/www\.youtube\.com\/user\//g)) {
        channelId = matchReg(/(?<=user\/)[\w].+/g)
        isMatchAlias = true
    }
    chrome.storage.local.get(['channels'], function (result) {
        if (result.channels) {
            let channels = JSON.parse(result.channels)
            if (isMatchAlias) {
                for (const [_, value] of Object.entries(channels)) {
                    if (value.customUrl === removeVietnameseTones(channelId)) {
                        window.location = "https://www.youtube.com";
                        break;
                    }
                }
            } else {
                if (channels[channelId] !== undefined) {
                    window.location = "https://www.youtube.com"
                }
            }
        }
    });
}

function init() {
    try {
        handleCheckUrlOnLoad()
    } catch (e) { console.log(e) }
}

window.onload = function () {
    init()
};

