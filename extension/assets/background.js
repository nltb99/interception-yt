function menu_generator() {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title: 'Stored search',
        contexts: ['page', 'selection'],
        onclick: function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.create({
                    index: tabs[0].index,
                    url: chrome.extension.getURL('index.html'),
                    active: true
                });
            });
        }
    });
}
replaceText(document.body)

function replaceText(element) {
    if (element.hasChildNodes()) {
        element.childNodes.forEach(replaceText)
    } else if (element.nodeType === Text.TEXT_NODE) {
        if (element.textContent.match(/.*/gim)) {
            const newElement = document.createElement('span')
            newElement.innerHTML = element.textContent.replace(/.*/gim, '<span class="rainbow">$$$$$</span>')
            element.replaceWith(newElement)
        }
    }
}
console.log('background')