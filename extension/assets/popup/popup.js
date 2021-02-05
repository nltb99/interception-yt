function countTime(totalWatched = null,isYoutubeTab = true) {
    let time = new Date(totalWatched)
    document.querySelector('.hour').innerHTML = ("0" + (time.getHours())).slice(-2);
    document.querySelector('.minute').innerHTML = ("0" + (time.getMinutes())).slice(-2);
    document.querySelector('.second').innerHTML = ("0" + (time.getSeconds())).slice(-2);
    if(!isYoutubeTab) return
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
function init() {
    let isYoutubeTab = false
    chrome.tabs.query({active: true,currentWindow: true},function(tabs) {
        var currentTab = tabs[0];
        if((/https:\/\/www\.youtube\.com\//g).test(currentTab.url)) {
            isYoutubeTab = true
        }
    });
    chrome.storage.sync.get(['totalWatched'],function(result) {
        let {totalWatched} = result
        if(totalWatched !== undefined) {
            totalWatched = +JSON.parse(totalWatched)
            if(isToday(new Date(totalWatched))) {
                countTime(new Date(totalWatched).getTime(),isYoutubeTab);
            } else {
                countTime(new Date(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDay(),0,0,0).getTime(),isYoutubeTab);
            }
        } else {
            countTime(new Date(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDay(),0,0,0).getTime(),isYoutubeTab);
        }
    })
    Particles.init({
        selector: '.background',
        connectParticles: false,
        maxParticles: 450,
        sizeVariations: 3,
    });
}
window.onload = function() {
    init()
};
