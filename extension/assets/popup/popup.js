function countTime(totalWatched = null,isYoutubeTab = true) {
    let time = new Date(totalWatched)
    document.querySelector('.hour').innerHTML = ("0" + (time.getHours())).slice(-2);
    document.querySelector('.minute').innerHTML = ("0" + (time.getMinutes())).slice(-2);
    document.querySelector('.second').innerHTML = ("0" + (time.getSeconds())).slice(-2);
    if(!isYoutubeTab) return
    chrome.storage.local.set({totalWatched: JSON.stringify(Date.parse(new Date(totalWatched)))},function() {});
    clearTimeout(countTime.interval);
    countTime.interval = setTimeout(function() {
        countTime(totalWatched + 1000,isYoutubeTab)
    },1000);
}
function isToday(dateCompe) {
    if(typeof dateCompe.getDay !== 'function') dateCompe = new Date(+dateCompe)
    let today = new Date();
    return dateCompe.getDate() === today.getDate() && dateCompe.getMonth() === today.getMonth() + 1 && dateCompe.getFullYear() === today.getFullYear();
}
function handleCountTime() {
    chrome.tabs.query({active: true,currentWindow: true},async function(tabs) {
        const currentTab = await tabs[0];
        const isYoutubeTab = await (/^https:\/\/www\.youtube\.com\//g).test(currentTab.url)
        await chrome.storage.local.get(['totalWatched'],function(result) {
            // let {totalWatched} = result
            // const currentDate = new Date(new Date().getFullYear(),new Date().getMonth() + 1,new Date().getDate(),0,0,0).getTime()
            // if(totalWatched !== undefined) {
            //     totalWatched = +JSON.parse(totalWatched)
            //     if(isToday(new Date(totalWatched))) {
            //         countTime(new Date(totalWatched).getTime(),isYoutubeTab);
            //     } else {
            //         countTime(currentDate,isYoutubeTab);
            //     }
            // } else {
            //     countTime(currentDate,isYoutubeTab);
            // }
        })
    });
}
function handleAddToBookmark() {
    const add_to_bookmark = document.querySelector('.add_to_bookmark')
    add_to_bookmark.addEventListener('click',() => {
        chrome.bookmarks.create({
            title: "Youtube Interception",
            url: `chrome-extension://${chrome.runtime.id}/assets/options/index.html`,
        },(newFolder) => {

        });
    })
}
function renderParticles() {
    Particles.init({
        selector: '.background',
        connectParticles: false,
        maxParticles: 450,
        sizeVariations: 3,
    });
}
function init() {
    handleCountTime()
    handleAddToBookmark()
    renderParticles()
}
window.onload = function() {
    init()
};
