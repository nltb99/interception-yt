function handleAddToBookmark() {
    const add_to_bookmark = document.querySelector('.add_to_bookmark')
    add_to_bookmark.addEventListener('click', () => {
        chrome.bookmarks.create({
            title: "Youtube Interception",
            url: `chrome-extension://${chrome.runtime.id}/assets/options/index.html`,
        }, (newFolder) => {

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
    handleAddToBookmark()
    renderParticles()
}

window.onload = function () {
    init()
};
